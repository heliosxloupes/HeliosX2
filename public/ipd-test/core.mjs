// Measurement maths for the IPD test, kept separate from the page so it can
// be checked against still photos.

// Eye geometry for the near-to-far correction
export const PUPIL_TO_ROTATION_MM = 10.5;

export function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function sd(arr) {
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, arr.length - 1));
}

// Pupils converge on the camera; undo that to get distance PD.
// Each pupil sits PUPIL_TO_ROTATION_MM in front of the eye's rotation centre
// and swings inward by p*sin(theta), where theta aims the eye at the camera.
export function toDistancePd(nearPd, camDistMm) {
  const D = camDistMm + PUPIL_TO_ROTATION_MM;
  let far = nearPd;
  for (let i = 0; i < 4; i++) {
    const half = far / 2;
    const sinT = half / Math.hypot(D, half);
    far = nearPd + 2 * PUPIL_TO_ROTATION_MM * sinT;
  }
  return far;
}

export function fitCircle(pts) {
  const n = pts.length;
  let mx = 0, my = 0;
  for (const p of pts) { mx += p[0]; my += p[1]; }
  mx /= n; my /= n;
  let suu = 0, svv = 0, suv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0;
  for (const p of pts) {
    const u = p[0] - mx, v = p[1] - my;
    suu += u * u; svv += v * v; suv += u * v;
    suuu += u * u * u; svvv += v * v * v; suvv += u * v * v; svuu += v * u * u;
  }
  const det = suu * svv - suv * suv;
  if (Math.abs(det) < 1e-9) return null;
  const bu = 0.5 * (suuu + suvv), bv = 0.5 * (svvv + svuu);
  const uc = (bu * svv - bv * suv) / det;
  const vc = (suu * bv - suv * bu) / det;
  const r = Math.sqrt(uc * uc + vc * vc + (suu + svv) / n);
  return { x: uc + mx, y: vc + my, r };
}

// The landmark model places the iris ring from a small eye crop. Here we go
// back to the full-resolution frame, cast rays outward from the model's
// centre across the left and right sides of the iris (top and bottom are
// usually under the eyelids), find the dark-to-bright step where iris meets
// sclera to sub-pixel precision, and fit a circle to those edge points.
const eyeCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
const ectx = eyeCanvas && eyeCanvas.getContext("2d", { willReadFrequently: true });

export function refineIris(src, cx, cy, r, W, H) {
  const half = Math.ceil(r * 1.7);
  const x0 = Math.max(0, Math.round(cx) - half), y0 = Math.max(0, Math.round(cy) - half);
  const sw = Math.min(W - x0, half * 2), sh = Math.min(H - y0, half * 2);
  if (sw < 12 || sh < 12) return null;
  if (eyeCanvas.width !== sw || eyeCanvas.height !== sh) { eyeCanvas.width = sw; eyeCanvas.height = sh; }
  ectx.drawImage(src, x0, y0, sw, sh, 0, 0, sw, sh);
  const d = ectx.getImageData(0, 0, sw, sh).data;
  const g = new Float32Array(sw * sh);
  for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];

  // pixel i covers [i, i+1), so its value sits at i + 0.5
  const sample = (x, y) => {
    x -= 0.5; y -= 0.5;
    if (x < 0 || y < 0 || x >= sw - 1 || y >= sh - 1) return NaN;
    const xi = x | 0, yi = y | 0, fx = x - xi, fy = y - yi, i = yi * sw + xi;
    return g[i] * (1 - fx) * (1 - fy) + g[i + 1] * fx * (1 - fy) + g[i + sw] * (1 - fx) * fy + g[i + sw + 1] * fx * fy;
  };

  const lx = cx - x0, ly = cy - y0;
  const STEP = 0.25, t0 = 0.6 * r, t1 = 1.45 * r;
  const n = Math.floor((t1 - t0) / STEP) + 1;
  const prof = new Float32Array(n), smooth = new Float32Array(n);
  const pts = [];
  for (const side of [0, Math.PI]) {
    for (let a = -30; a <= 30; a += 3) {
      const th = side + a * Math.PI / 180, ux = Math.cos(th), uy = Math.sin(th);
      // average three parallel rays 1 px apart to cut sensor noise
      const px = -uy, py = ux;
      let bad = false;
      for (let k = 0; k < n; k++) {
        const t = t0 + k * STEP, bx = lx + ux * t, by = ly + uy * t;
        const v = (sample(bx, by) + sample(bx + px, by + py) + sample(bx - px, by - py)) / 3;
        if (Number.isNaN(v)) { bad = true; break; }
        prof[k] = v;
      }
      if (bad) continue;
      for (let k = 0; k < n; k++) {
        let s = 0, c = 0;
        for (let j = -2; j <= 2; j++) { const q = k + j; if (q >= 0 && q < n) { s += prof[q]; c++; } }
        smooth[k] = s / c;
      }
      let best = -Infinity, kb = -1;
      for (let k = 3; k < n - 3; k++) {
        const dv = (smooth[k + 2] - smooth[k - 2]) / (4 * STEP);
        if (dv > best) { best = dv; kb = k; }
      }
      if (kb < 4 || kb > n - 5 || best < 3) continue;
      const dAt = (k) => (smooth[k + 2] - smooth[k - 2]) / (4 * STEP);
      const y1 = dAt(kb - 1), y2 = best, y3 = dAt(kb + 1);
      const den = y1 - 2 * y2 + y3;
      const off = den !== 0 ? Math.max(-1, Math.min(1, 0.5 * (y1 - y3) / den)) : 0;
      const t = t0 + (kb + off) * STEP;
      pts.push([lx + ux * t, ly + uy * t, side === 0 ? 1 : 0]);
    }
  }
  if (pts.length < 16) return null;

  let fit = fitCircle(pts);
  if (!fit) return null;
  const resid = pts.map((p) => Math.abs(Math.hypot(p[0] - fit.x, p[1] - fit.y) - fit.r));
  const mad = median(resid);
  const keep = pts.filter((_, i) => resid[i] <= Math.max(0.75, 2.5 * mad));
  const right = keep.filter((p) => p[2] === 1).length, left = keep.length - right;
  if (keep.length < 14 || right < 6 || left < 6) return null;
  fit = fitCircle(keep);
  if (!fit) return null;

  const fx = fit.x + x0, fy = fit.y + y0;
  if (fit.r < 0.8 * r || fit.r > 1.25 * r) return null;
  if (Math.hypot(fx - cx, fy - cy) > 0.35 * r) return null;
  return { x: fx, y: fy, r: fit.r, n: keep.length };
}
