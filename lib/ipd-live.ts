// Live pupillary-distance measurement: card detection, geometric corrections
// and frame statistics. Pure functions so they can be unit-tested with
// recorded frames. Constants marked TUNE should be adjusted against
// optician-measured PDs before relying on the tool for orders.

import { CARD_WIDTH_MM } from './ipd-measurement'

export const CARD_HEIGHT_MM = 53.98
const CARD_ASPECT = CARD_HEIGHT_MM / CARD_WIDTH_MM

// Average adult horizontal visible iris diameter. Used only to predict how
// wide the card should look and to estimate distance before the card is found.
export const IRIS_DIAMETER_MM = 11.7

// TUNE: how far the card, resting on the forehead, sits in front of the pupils.
export const CARD_PLANE_OFFSET_MM = 12
// TUNE: distance from the pupil back to the eye's centre of rotation.
export const PUPIL_TO_ROTATION_MM = 10
// TUNE: focal length as a fraction of the long side of the frame
// (about a 70° field of view, typical for front cameras and webcams).
export const FOCAL_FRACTION = 0.714

export const LIMITS = {
  minDistanceMm: 300,
  maxDistanceMm: 650,
  maxYawDeg: 4,
  maxPitchDeg: 8,
  maxRollDeg: 4,
  maxCardTiltDeg: 3,
  maxBlink: 0.4,
  minLuma: 55,
  maxLuma: 225,
  minPdMm: 45,
  maxPdMm: 80,
}

export type Point = { x: number; y: number }

export function focalPx(frameWidth: number, frameHeight: number) {
  return FOCAL_FRACTION * Math.max(frameWidth, frameHeight)
}

// Converts pixel measurements into a distance PD in millimetres.
// 1. Scale from the card, then enlarge because the pupils are further away.
// 2. The eyes converge on the camera, which narrows the pupils; undo that.
export function pdFromFrame(pupilPx: number, cardPx: number, focal: number) {
  const cardDistance = (focal * CARD_WIDTH_MM) / cardPx
  const pupilDistance = cardDistance + CARD_PLANE_OFFSET_MM
  const nearPd = (pupilPx * CARD_WIDTH_MM) / cardPx * (pupilDistance / cardDistance)
  const fixation = pupilDistance + PUPIL_TO_ROTATION_MM
  const pd = nearPd / (1 - PUPIL_TO_ROTATION_MM / fixation)
  return { pd, nearPd, cardDistance }
}

export function distanceFromIris(irisPx: number, focal: number) {
  return (focal * IRIS_DIAMETER_MM) / irisPx
}

// Yaw, pitch and roll in degrees from MediaPipe's column-major 4x4 matrix.
export function headPose(m: ArrayLike<number>) {
  const r00 = m[0], r10 = m[1], r20 = m[2], r21 = m[6], r22 = m[10]
  const deg = 180 / Math.PI
  return {
    pitch: Math.atan2(r21, r22) * deg,
    yaw: Math.atan2(-r20, Math.hypot(r21, r22)) * deg,
    roll: Math.atan2(r10, r00) * deg,
  }
}

export type CardDetection = {
  left: number // x of left edge, in ROI pixels (sub-pixel)
  right: number
  top: number
  bottom: number
  widthPx: number // corrected for tilt
  tiltDeg: number
  strength: number // edge contrast relative to background, >1 is better
  meanLuma: number
}

function grayscale(data: ImageData) {
  const { width, height, data: px } = data
  const out = new Float32Array(width * height)
  for (let i = 0, j = 0; i < out.length; i++, j += 4) {
    out[i] = 0.299 * px[j] + 0.587 * px[j + 1] + 0.114 * px[j + 2]
  }
  return out
}

function refinePeak(profile: Float32Array, i: number) {
  if (i <= 0 || i >= profile.length - 1) return i
  const a = profile[i - 1], b = profile[i], c = profile[i + 1]
  const denom = a - 2 * b + c
  return denom === 0 ? i : i + (0.5 * (a - c)) / denom
}

// Finds a card resting on the forehead inside `roi`. `expectedWidth` is the
// card width predicted from iris size; `centerX` is the face midline, both in
// ROI pixels. Returns null unless the edges form a card-shaped rectangle.
export function detectCard(roi: ImageData, expectedWidth: number, centerX: number): CardDetection | null {
  const { width: w, height: h } = roi
  if (w < 40 || h < 30) return null
  const g = grayscale(roi)

  let lumaSum = 0
  for (let i = 0; i < g.length; i++) lumaSum += g[i]
  const meanLuma = lumaSum / g.length

  // Column profile of horizontal gradient: vertical card edges stand out.
  const col = new Float32Array(w)
  for (let y = 1; y < h - 1; y++) {
    const row = y * w
    for (let x = 1; x < w - 1; x++) {
      col[x] += Math.abs(g[row + x + 1] - g[row + x - 1])
    }
  }

  const tol = expectedWidth * 0.25
  let best = { score: 0, l: -1, r: -1 }
  for (let l = 2; l < w - 2; l++) {
    const rMin = Math.max(l + 1, Math.floor(l + expectedWidth - tol))
    const rMax = Math.min(w - 3, Math.ceil(l + expectedWidth + tol))
    for (let r = rMin; r <= rMax; r++) {
      const mid = (l + r) / 2
      if (Math.abs(mid - centerX) > expectedWidth * 0.18) continue
      const score = col[l] + col[r]
      if (score > best.score) best = { score, l, r }
    }
  }
  if (best.l < 0) return null

  const sorted = Array.from(col).sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)] || 1
  const strength = best.score / 2 / median
  if (strength < 1.8) return null

  const left = refinePeak(col, best.l)
  const right = refinePeak(col, best.r)
  const span = right - left

  // Row profile of vertical gradient between the edges: top and bottom of card.
  const x0 = Math.round(left + span * 0.1)
  const x1 = Math.round(right - span * 0.1)
  const rowProfile = new Float32Array(h)
  for (let y = 1; y < h - 1; y++) {
    let sum = 0
    for (let x = x0; x < x1; x++) sum += Math.abs(g[(y + 1) * w + x] - g[(y - 1) * w + x])
    rowProfile[y] = sum
  }
  const expectedHeight = span * CARD_ASPECT
  let edges = { score: 0, t: -1, b: -1 }
  for (let t = 1; t < h - 1; t++) {
    const bMin = Math.floor(t + expectedHeight * 0.85)
    const bMax = Math.min(h - 2, Math.ceil(t + expectedHeight * 1.15))
    for (let b = bMin; b <= bMax; b++) {
      const score = rowProfile[t] + rowProfile[b]
      if (score > edges.score) edges = { score, t, b }
    }
  }
  // The bottom edge (against the brow) must always be found; the top edge may
  // blend into hair, so fall back to the strongest row in the lower half.
  let top = edges.t
  let bottom = edges.b
  if (bottom < 0) {
    let peak = Math.floor(h / 2)
    for (let y = peak; y < h - 1; y++) if (rowProfile[y] > rowProfile[peak]) peak = y
    bottom = peak
    top = Math.max(0, bottom - expectedHeight)
  }

  // Tilt: fit a line through the strongest vertical-gradient pixel near the
  // bottom edge in each column.
  const band = Math.max(3, Math.round(expectedHeight * 0.08))
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0
  for (let x = x0; x < x1; x += 2) {
    let bestY = -1, bestG = 0
    for (let y = Math.max(1, bottom - band); y <= Math.min(h - 2, bottom + band); y++) {
      const gy = Math.abs(g[(y + 1) * w + x] - g[(y - 1) * w + x])
      if (gy > bestG) { bestG = gy; bestY = y }
    }
    if (bestY < 0) continue
    n++; sx += x; sy += bestY; sxx += x * x; sxy += x * bestY
  }
  const slope = n > 5 ? (n * sxy - sx * sy) / (n * sxx - sx * sx || 1) : 0
  const tiltDeg = (Math.atan(slope) * 180) / Math.PI

  return {
    left,
    right,
    top: refinePeak(rowProfile, Math.round(top)),
    bottom: refinePeak(rowProfile, Math.round(bottom)),
    widthPx: span / Math.cos(Math.atan(slope)),
    tiltDeg,
    strength,
    meanLuma,
  }
}

export function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// Robust summary of one hold: median, and the spread of the middle half.
export function summarizeSamples(samples: number[]) {
  const s = [...samples].sort((a, b) => a - b)
  const q = (p: number) => s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]
  return { value: median(s), iqr: q(0.75) - q(0.25) }
}

// Final result from the per-round values. Rounds must agree within 1 mm.
export function combineRounds(rounds: number[]) {
  const value = Math.round(median(rounds) * 10) / 10
  const spread = Math.max(...rounds) - Math.min(...rounds)
  return { value, spread, agreed: spread <= 1.0 }
}
