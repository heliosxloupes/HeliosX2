// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Frames: four pairs of frames on a stepped display riser, one style per step:
 * modern, round, vintage, classic. Each pair stands facing the reader with its
 * temples reaching back. The pair under the pointer lifts off its step and
 * takes the bright stroke; its neighbours lift a little after it. At rest the
 * round pair sits proud. The read-out names the style. The slider is the lift.
 */
const {
  Cam, clamp, fit, open, poly, prism, proj, rings, rrect, seg, facing,
  tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 4, W = 104, SD = 24, RISE = 13, BASE = 5, CX = W / 2;
const STYLES = [
  { name: "modern", w: 21, h: 13, r: 4 },
  { name: "round", w: 17, h: 17, r: 8.5 },
  { name: "vintage", w: 20, h: 15, r: 7 },
  { name: "classic", w: 23, h: 12, r: 2 },
];
const REST_I = 1, REST_LIFT = 4;
const top = (k) => BASE + (N - 1 - k) * RISE;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, 0], [W, N * SD, 0], [W, 0, 0], [0, N * SD, 0], [CX, 0, top(0) + 40]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const pairs = STYLES.map((s, k) => {
    const [r, ri] = rings(0, k * SD, W, (k + 1) * SD, 3, 1.2);
    put(solid(g), prism(P, front, r, ri, 0, top(k)));
    const grp = mk("g", {}, g);
    const temples = mk("path", { class: "nf lo" }, grp);
    const rims = mk("path", { class: "sil" }, grp), glass = mk("path", { class: "nf lo" }, grp), bridge = mk("path", { class: "nf" }, grp);
    return { k, s, temples, rims, glass, bridge, z: tween(k === REST_I ? REST_LIFT : 0), drawn: NaN };
  });

  function draw(p, dz) {
    if (dz === p.drawn) return;
    p.drawn = dz;
    const { w, h, r } = p.s, y = p.k * SD + SD * 0.45, z0 = top(p.k) + 3 + dz, half = w + 3.5;
    const face = (ring, du) => ring.map((q) => P(CX + du + q.u, y, z0 + q.v));
    const lens = (du) => rrect(-w / 2, 0, w / 2, h, r, 5).map((q) => ({ ...q })).map((q) => q), shift = (du) => face(lens(), du);
    const outL = shift(-half / 2 - 1.5), outR = shift(half / 2 + 1.5);
    p.rims.setAttribute("d", poly(outL) + poly(outR));
    const inner = rrect(-w / 2 + 2, 2, w / 2 - 2, h - 2, Math.max(0.5, r - 2), 5);
    p.glass.setAttribute("d", poly(face(inner, -half / 2 - 1.5)) + poly(face(inner, half / 2 + 1.5)));
    const bx = half / 2 + 1.5 - w / 2;
    p.bridge.setAttribute("d", open([P(CX - bx, y, z0 + h * 0.62), P(CX, y, z0 + h * 0.78), P(CX + bx, y, z0 + h * 0.62)]));
    const ex = half / 2 + 1.5 + w / 2;
    p.temples.setAttribute("d", seg(P(CX - ex, y, z0 + h * 0.8), P(CX - ex, y - 20, z0 + h * 0.8)) + seg(P(CX + ex, y, z0 + h * 0.8), P(CX + ex, y - 20, z0 + h * 0.8)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pairs) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : REST_I;
    act = a;
    const lit = a >= 0 ? a : REST_I;
    pairs.forEach((p) => {
      const d = Math.abs(p.k - from);
      const to = a < 0 ? (p.k === REST_I ? REST_LIFT : 0) : p.k === a ? lift : d === 1 ? lift * 0.25 : 0;
      tset(p.z, to, now, d * 45);
      p.rims.classList.toggle("hi", p.k === lit);
    });
    read.textContent = a < 0 ? "rest" : STYLES[a].name;
    B.wake();
  }
  setActive(-1);

  // Each pair is tested at its resting centre on screen, so a lifted pair cannot slide out from under the pointer.
  const centres = pairs.map((p) => P(CX, p.k * SD + SD * 0.45, top(p.k) + 3 + p.s.h / 2));
  function hit(pt) {
    let best = -1, bd = 34;
    centres.forEach((c, k) => { const d = Math.hypot(pt[0] - c[0], (pt[1] - c[1]) * 1.4); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = clamp(v, 0, 22); const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "frames",
  means: "Frames on a display riser, one style per step: the pair under the pointer lifts off its step.",
  rules: [1, 2, 4, 5],
  range: [8, 14, 20],
  tour: [[160, 120], [200, 170], [240, 215], null],
  mount,
});
