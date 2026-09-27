'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FaceLandmarker } from '@mediapipe/tasks-vision'

import IpdCameraTool from '@/components/measurements/IpdCameraTool'
import { CARD_WIDTH_MM } from '@/lib/ipd-measurement'
import {
  CARD_HEIGHT_MM,
  IRIS_DIAMETER_MM,
  LIMITS,
  combineRounds,
  detectCard,
  distanceFromIris,
  focalPx,
  headPose,
  median,
  pdFromFrame,
  summarizeSamples,
  type CardDetection,
} from '@/lib/ipd-live'

const SAMPLES_PER_ROUND = 45
const ROUNDS = 3
const RESET_AFTER_MS = 700
const MAX_ROUND_IQR_MM = 1.2

type CheckKey = 'face' | 'distance' | 'straight' | 'eyes' | 'light' | 'card'
type Checks = Record<CheckKey, boolean>

const CHECKS: { key: CheckKey; label: string; hint: string }[] = [
  { key: 'face', label: 'Face centred', hint: 'Centre your face in the frame.' },
  { key: 'distance', label: 'Distance', hint: 'Hold the phone about an arm’s length away (40–50 cm).' },
  { key: 'straight', label: 'Head straight', hint: 'Face the camera squarely and keep your head level.' },
  { key: 'eyes', label: 'Eyes open', hint: 'Keep both eyes open and look at the camera lens.' },
  { key: 'light', label: 'Lighting', hint: 'Find even light on your face, without a bright window behind you.' },
  { key: 'card', label: 'Card found', hint: 'Hold the card flat and level on your forehead, just above your eyebrows.' },
]

const NO_CHECKS: Checks = { face: false, distance: false, straight: false, eyes: false, light: false, card: false }

type Phase = 'intro' | 'loading' | 'live' | 'between' | 'result' | 'error'

// Landmark indices in MediaPipe's 478-point face mesh.
const LM = {
  leftIris: 468, leftIrisEdges: [469, 471],
  rightIris: 473, rightIrisEdges: [474, 476],
  browLeft: 105, browRight: 334,
  midEyes: 168,
}

export default function IpdLiveTool({ onAccept }: { onAccept?: (value: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const scratchRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const rafRef = useRef(0)
  const lastVideoTime = useRef(-1)
  const samples = useRef<number[]>([])
  const cardWidths = useRef<number[]>([])
  const lastGood = useRef(0)
  const lastUi = useRef(0)
  const phaseRef = useRef<Phase>('intro')

  const [phase, setPhaseState] = useState<Phase>('intro')
  const [checks, setChecks] = useState<Checks>(NO_CHECKS)
  const [progress, setProgress] = useState(0)
  const [liveValue, setLiveValue] = useState<number | null>(null)
  const [rounds, setRounds] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const [photoMode, setPhotoMode] = useState(false)
  const roundsRef = useRef<number[]>([])

  const setPhase = (next: Phase) => {
    phaseRef.current = next
    setPhaseState(next)
  }

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(
    () => () => {
      stop()
      landmarkerRef.current?.close()
    },
    [stop],
  )

  const loadLandmarker = async () => {
    if (landmarkerRef.current) return landmarkerRef.current
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('/ipd')
    const options = (delegate: 'GPU' | 'CPU') => ({
      baseOptions: { modelAssetPath: '/ipd/face_landmarker.task', delegate },
      runningMode: 'VIDEO' as const,
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    })
    try {
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, options('GPU'))
    } catch {
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, options('CPU'))
    }
    return landmarkerRef.current
  }

  const resetRound = () => {
    samples.current = []
    cardWidths.current = []
    setProgress(0)
    setLiveValue(null)
  }

  const finishRound = () => {
    const summary = summarizeSamples(samples.current)
    resetRound()
    if (summary.iqr > MAX_ROUND_IQR_MM) {
      setMessage('Too much movement in that hold. Keep still and try again.')
      return
    }
    const next = [...roundsRef.current, summary.value]
    roundsRef.current = next
    setRounds(next)
    if (next.length >= ROUNDS) {
      stop()
      setPhase('result')
      return
    }
    setMessage(`Reading ${next.length} of ${ROUNDS} saved. Lower the card, then place it again for the next reading.`)
    setPhase('between')
    window.setTimeout(() => {
      if (phaseRef.current === 'between') {
        setMessage('')
        setPhase('live')
      }
    }, 2200)
  }

  const processFrame = () => {
    rafRef.current = requestAnimationFrame(processFrame)
    const video = videoRef.current
    const landmarker = landmarkerRef.current
    if (!video || !landmarker || video.readyState < 2 || video.currentTime === lastVideoTime.current) return
    lastVideoTime.current = video.currentTime

    const W = video.videoWidth
    const H = video.videoHeight
    const now = performance.now()
    const result = landmarker.detectForVideo(video, now)
    const lm = result.faceLandmarks?.[0]
    const overlay = overlayRef.current
    const ctx = overlay?.getContext('2d')
    if (overlay && (overlay.width !== W || overlay.height !== H)) {
      overlay.width = W
      overlay.height = H
    }
    ctx?.clearRect(0, 0, W, H)

    const next: Checks = { ...NO_CHECKS }
    let pd: number | null = null
    let card: CardDetection | null = null

    if (lm && lm.length >= 478) {
      const px = (i: number) => ({ x: lm[i].x * W, y: lm[i].y * H })
      const leftPupil = px(LM.leftIris)
      const rightPupil = px(LM.rightIris)
      const pupilPx = Math.hypot(rightPupil.x - leftPupil.x, rightPupil.y - leftPupil.y)
      const irisPx =
        (Math.hypot(px(LM.leftIrisEdges[0]).x - px(LM.leftIrisEdges[1]).x, px(LM.leftIrisEdges[0]).y - px(LM.leftIrisEdges[1]).y) +
          Math.hypot(px(LM.rightIrisEdges[0]).x - px(LM.rightIrisEdges[1]).x, px(LM.rightIrisEdges[0]).y - px(LM.rightIrisEdges[1]).y)) /
        2
      const mid = px(LM.midEyes)
      const browY = Math.min(px(LM.browLeft).y, px(LM.browRight).y)
      const focal = focalPx(W, H)

      next.face = Math.abs(mid.x / W - 0.5) < 0.15 && mid.y / H > 0.2 && mid.y / H < 0.7

      const matrix = result.facialTransformationMatrixes?.[0]?.data
      if (matrix) {
        const pose = headPose(matrix)
        next.straight =
          Math.abs(pose.yaw) < LIMITS.maxYawDeg && Math.abs(pose.pitch) < LIMITS.maxPitchDeg && Math.abs(pose.roll) < LIMITS.maxRollDeg
      }

      const shapes = result.faceBlendshapes?.[0]?.categories ?? []
      const blink = (name: string) => shapes.find((c) => c.categoryName === name)?.score ?? 0
      next.eyes = blink('eyeBlinkLeft') < LIMITS.maxBlink && blink('eyeBlinkRight') < LIMITS.maxBlink

      // Where the card should be: centred on the face, bottom edge at the brows.
      // It sits a little closer to the camera than the eyes, so looks slightly larger.
      const expectedWidth = irisPx * (CARD_WIDTH_MM / IRIS_DIAMETER_MM) * 1.03
      const expectedHeight = expectedWidth * (CARD_HEIGHT_MM / CARD_WIDTH_MM)
      const roi = {
        x: Math.max(0, Math.round(mid.x - expectedWidth * 0.85)),
        y: Math.max(0, Math.round(browY - expectedHeight * 1.3)),
        w: 0,
        h: 0,
      }
      roi.w = Math.min(W - roi.x, Math.round(expectedWidth * 1.7))
      roi.h = Math.min(H - roi.y, Math.round(expectedHeight * 1.6))

      if (roi.w > 40 && roi.h > 30) {
        if (!scratchRef.current) scratchRef.current = document.createElement('canvas')
        const scratch = scratchRef.current
        scratch.width = roi.w
        scratch.height = roi.h
        const sctx = scratch.getContext('2d', { willReadFrequently: true })
        if (sctx) {
          sctx.drawImage(video, roi.x, roi.y, roi.w, roi.h, 0, 0, roi.w, roi.h)
          card = detectCard(sctx.getImageData(0, 0, roi.w, roi.h), expectedWidth, mid.x - roi.x)
        }
      }

      if (card) {
        next.light = card.meanLuma > LIMITS.minLuma && card.meanLuma < LIMITS.maxLuma
        // Reject a detection that jumps away from the recent card width.
        const recent = cardWidths.current.length >= 8 ? median(cardWidths.current.slice(-15)) : null
        const steady = recent === null || Math.abs(card.widthPx - recent) / recent < 0.03
        next.card = Math.abs(card.tiltDeg) < LIMITS.maxCardTiltDeg && steady
        const frame = pdFromFrame(pupilPx, card.widthPx, focal)
        next.distance = frame.cardDistance > LIMITS.minDistanceMm && frame.cardDistance < LIMITS.maxDistanceMm
        if (frame.pd > LIMITS.minPdMm && frame.pd < LIMITS.maxPdMm) pd = frame.pd
        else next.card = false
        cardWidths.current.push(card.widthPx)
        if (cardWidths.current.length > 60) cardWidths.current.shift()
      } else {
        const d = distanceFromIris(irisPx, focal)
        next.distance = d > LIMITS.minDistanceMm && d < LIMITS.maxDistanceMm
        next.light = true
      }

      if (ctx) {
        ctx.lineWidth = Math.max(2, W / 600)
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        for (const p of [leftPupil, rightPupil]) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, irisPx / 2, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.setLineDash([10, 8])
        ctx.strokeStyle = card ? 'rgba(110,231,183,0.95)' : 'rgba(255,255,255,0.55)'
        if (card) {
          ctx.setLineDash([])
          ctx.strokeRect(roi.x + card.left, roi.y + card.top, card.right - card.left, card.bottom - card.top)
        } else {
          ctx.strokeRect(mid.x - expectedWidth / 2, browY - expectedHeight, expectedWidth, expectedHeight)
        }
        ctx.setLineDash([])
      }
    }

    const allGood = CHECKS.every(({ key }) => next[key])
    if (phaseRef.current === 'live') {
      if (allGood && pd !== null) {
        lastGood.current = now
        samples.current.push(pd)
        if (samples.current.length >= SAMPLES_PER_ROUND) finishRound()
      } else if (samples.current.length && now - lastGood.current > RESET_AFTER_MS) {
        resetRound()
      }
    }

    // Update the interface about 10 times a second.
    if (now - lastUi.current > 100) {
      lastUi.current = now
      setChecks(next)
      setProgress(samples.current.length / SAMPLES_PER_ROUND)
      setLiveValue(samples.current.length >= 5 ? median(samples.current) : null)
    }
  }

  const start = async () => {
    setMessage('')
    roundsRef.current = []
    setRounds([])
    resetRound()
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage('This browser cannot open the camera. Use photo mode instead.')
      setPhase('error')
      return
    }
    setPhase('loading')
    try {
      const [stream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        }),
        loadLandmarker(),
      ])
      streamRef.current = stream
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()
      lastVideoTime.current = -1
      setPhase('live')
      rafRef.current = requestAnimationFrame(processFrame)
    } catch {
      stop()
      setMessage('The camera could not start. Allow camera access in your browser settings, or use photo mode.')
      setPhase('error')
    }
  }

  if (photoMode) {
    return (
      <div className="space-y-6">
        <IpdCameraTool onAccept={onAccept} />
        <button type="button" onClick={() => setPhotoMode(false)} className="text-sm font-semibold text-emerald-200 hover:text-white">
          Back to live measurement
        </button>
      </div>
    )
  }

  const final = rounds.length >= ROUNDS ? combineRounds(rounds) : null
  const firstFailing = CHECKS.find(({ key }) => !checks[key])
  const showCamera = phase === 'live' || phase === 'between' || phase === 'loading'

  return (
    <div className="space-y-6" id="ipd-live-tool">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Live camera measurement</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Measure your pupillary distance</h2>
        {phase === 'intro' || phase === 'error' ? (
          <ul className="max-w-2xl space-y-1.5 text-sm leading-6 text-neutral-300">
            <li>You need any card the size of a bank card: a debit card, driver’s licence or gym card. Face the back outwards.</li>
            <li>Hold it flat on your forehead, centred, just above your eyebrows.</li>
            <li>Remove glasses, find even light, and hold the phone at eye level about 40–50 cm away.</li>
            <li>Look at the camera lens, not the screen, while it measures. It takes three short readings.</li>
          </ul>
        ) : null}
      </div>

      <div className={showCamera ? 'space-y-4' : 'hidden'}>
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black">
          <div className="relative [transform:scaleX(-1)]">
            <video ref={videoRef} playsInline muted aria-label="Live camera preview" className="block max-h-[70vh] w-full object-contain" />
            <canvas ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
          </div>

          {phase === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm text-neutral-300">
              Starting camera and face tracking…
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16">
            <div aria-live="polite">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                {phase === 'between'
                  ? 'Saved'
                  : progress > 0
                    ? 'Hold steady'
                    : firstFailing
                      ? firstFailing.hint
                      : 'Hold steady'}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-bold tabular-nums text-white">
                {liveValue !== null ? liveValue.toFixed(1) : '––.–'}
                <span className="ml-1.5 text-lg text-neutral-400">mm</span>
              </p>
            </div>
            <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90" aria-hidden="true">
              <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 19}
                strokeDashoffset={2 * Math.PI * 19 * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 120ms linear' }}
              />
            </svg>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Measurement checks">
          {CHECKS.map(({ key, label }) => (
            <li
              key={key}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                checks[key] ? 'border-emerald-300/60 bg-emerald-300/10 text-emerald-200' : 'border-white/15 text-neutral-400'
              }`}
            >
              {checks[key] ? '✓ ' : ''}
              {label}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <span>
            Reading {Math.min(rounds.length + 1, ROUNDS)} of {ROUNDS}
          </span>
          <button
            type="button"
            onClick={() => {
              stop()
              setPhase('intro')
            }}
            className="rounded-full border border-white/20 px-4 py-2 text-white hover:border-white/50"
          >
            Cancel
          </button>
        </div>
      </div>

      {(phase === 'intro' || phase === 'error') && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={start} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200">
            Start live measurement
          </button>
          <button
            type="button"
            onClick={() => setPhotoMode(true)}
            className="rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:border-white/50"
          >
            Use a photo instead
          </button>
        </div>
      )}

      {phase === 'result' && final && (
        <div className="space-y-5 rounded-[24px] border border-white/10 bg-[#050b16] p-6" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">Your pupillary distance</p>
          {final.agreed ? (
            <>
              <p className="font-[family-name:var(--font-display)] text-6xl font-bold leading-none">
                <span className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                  {final.value.toFixed(1)}
                </span>
                <span className="ml-2 text-2xl text-neutral-400">mm</span>
              </p>
              <p className="text-sm text-neutral-400">
                Three readings: {rounds.map((r) => r.toFixed(1)).join(' · ')} mm, within {final.spread.toFixed(1)} mm of each other.
              </p>
              <p className="max-w-xl text-sm leading-6 text-neutral-300">
                This is a camera estimate. We review fit details before production, and an optician-measured PD remains the best
                check if you have one.
              </p>
              <div className="flex flex-wrap gap-3">
                {onAccept && (
                  <button
                    type="button"
                    onClick={() => onAccept(final.value)}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
                  >
                    Use this PD on my order
                  </button>
                )}
                <button type="button" onClick={start} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:border-white/50">
                  Measure again
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-amber-200">
                Your three readings ({rounds.map((r) => r.toFixed(1)).join(' · ')} mm) differ by {final.spread.toFixed(1)} mm, so we
                can’t trust the result yet.
              </p>
              <p className="text-sm text-neutral-300">
                Try again with the card flat against your forehead and the phone held level at eye height.
              </p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={start} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200">
                  Measure again
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode(true)}
                  className="rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:border-white/50"
                >
                  Use a photo instead
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {message && (
        <p role="status" className="text-sm leading-6 text-neutral-300">
          {message}
        </p>
      )}
      <p className="border-t border-white/10 pt-4 text-xs leading-5 text-neutral-500">
        The camera feed is processed on your device. No images are uploaded or stored.
      </p>
    </div>
  )
}
