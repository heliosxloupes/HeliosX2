// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Tray: a steel instrument tray holding five instruments from different
 * specialties, laid side by side: scalpel, forceps, needle driver, dental
 * mirror, probe. The instrument under the pointer lifts clear of the tray and
 * takes the bright stroke; its neighbours slide away from it, staggered
 * outwards. At rest they lie a little out of line, the scalpel bright. The
 * read-out names the instrument. The slider is how far the neighbours part.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 5, GAP = 30, X0 = 0, X1 = N * GAP + 2, Y0 = 0, Y1 = 108, WH = 9, WT = 3, FLOOR = 1.5, LIFT = 24;
const SU = 1.65, SH = 1.8;
const NAMES = ["scalpel", "forceps", "driver", "mirror", "probe"];
const REST_DY = [3, -3, 5, -1, 2];

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));
const bar = (u0, u1, v0, v1, h, r = 1.4) => ({ u0, u1, v0, v1, h, r });
const disc = (cu, cv, R, h) => ({ cu, cv, R, h });

/** Each instrument as parts around its own centre line: bars (u across, v along) and discs. */
const KIT = [
  [bar(-3, 3, 32, 98, 2.6), bar(-2.4, 3, 8, 32, 1.2, 2.4)],                                  // scalpel: handle, blade
  [bar(-4.5, -1.2, 10, 90, 2, 1.2), bar(1.2, 4.5, 10, 90, 2, 1.2), bar(-4.5, 4.5, 84, 98, 2.6)], // forceps: two prongs, joint
  [bar(-1.6, 1.6, 8, 58, 2.6, 1), bar(-6, -2, 56, 76, 2.2, 1), bar(2, 6, 56, 80, 2.2, 1), disc(-6, 86, 6.5, 2.2), disc(6, 90, 6.5, 2.2)], // driver: jaw, shanks, finger rings
  [bar(-2.6, 2.6, 32, 98, 3), bar(-1, 1, 18, 33, 1.6, 0.8), disc(0, 12, 7, 1.6)],             // mirror: handle, neck, head
  [bar(-2.6, 2.6, 36, 98, 3), bar(-0.9, 0.9, 12, 37, 1.2, 0.8), bar(0, 4.5, 9, 13, 1.2, 0.8)], // probe: handle, shaft, hook
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;

  const C = Cam(45, 0.5, 1.72);
  fit(C, [[X0 - 14, Y0, 0], [X1 + 14, Y1, 0], [X1 + 14, Y0, 0], [X0 - 14, Y1, 0], [X1 / 2, Y1 / 2, WH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);

  // The tray, which never moves: its far body before the instruments, its near wall after.
  const outer = rrect(X0, Y0, X1, Y1, 8, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, 8 - WT, 6);
  const g = mk("g", {}, svg);
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, WH)), class: "nf" }, g);
  mk("path", { d: open(ringAt(P, run(inner, (q) => !front(q)), FLOOR)), class: "nf lo" }, g);

  const tools = KIT.map((parts, i) => {
    const grp = mk("g", {}, g);
    return { i, parts, grp, els: parts.map(() => solid(grp)), dx: tween(0), z: tween(0), drawn: "" };
  });

  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  const near = mk("g", {}, g);
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, near);
  mk("path", { d: open(oT), class: "nf lo" }, near);
  mk("path", { d: open(iF), class: "nf" }, near);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, near);

  const cx = (i) => X0 + GAP * (i + 0.5) + 1;

  function draw(t, dx, lift) {
    const key = dx.toFixed(2) + "," + lift.toFixed(2);
    if (key === t.drawn) return;
    t.drawn = key;
    const ox = cx(t.i) + dx, oy = REST_DY[t.i], z0 = FLOOR + lift;
    // Parts are drawn wider and thicker than life (SU, SH) so they read at thumbnail size.
    t.parts.forEach((p, k) => {
      if ("R" in p) {
        const R = p.R * SU, ring = shift(circ(R, 16), ox + p.cu * SU, oy + p.cv), inr = shift(circ(R - 1.6, 16), ox + p.cu * SU, oy + p.cv);
        put(t.els[k], prism(P, front, ring, inr, z0, z0 + p.h * SH));
      } else {
        const u0 = p.u0 * SU, u1 = p.u1 * SU;
        const [ring, inr] = rings(ox + u0, oy + p.v0, ox + u1, oy + p.v1, p.r * SU, Math.min(1, (u1 - u0) / 3));
        put(t.els[k], prism(P, front, ring, inr, z0, z0 + p.h * SH));
      }
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tools) {
      draw(t, tval(t.dx, now), tval(t.z, now));
      if (!tdone(t.dx, now) || !tdone(t.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    const lit = a >= 0 ? a : 0;
    tools.forEach((t) => {
      const d = t.i - (a >= 0 ? a : 0), delay = Math.abs(t.i - from) * 45;
      const push = a < 0 || d === 0 ? 0 : Math.sign(d) * spread * (Math.abs(d) === 1 ? 1 : 0.55);
      tset(t.dx, push, now, delay);
      tset(t.z, a === t.i ? LIFT : 0, now, delay);
      t.els.forEach((el) => el.sil.classList.toggle("hi", t.i === lit));
    });
    // the lifted instrument is painted last of the five, just before the near wall
    if (a >= 0) tools[a].grp.parentNode.insertBefore(tools[a].grp, near);
    else tools.forEach((t) => t.grp.parentNode.insertBefore(t.grp, near));
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);

  // The hit is on the ground plane, which never moves: the nearest resting instrument inside the tray.
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < X0 || x > X1 || y < Y0 - 6 || y > Y1 + 6) return -1;
    return clamp(Math.floor((x - X0) / GAP), 0, N - 1);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { spread = v; const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "tray",
  means: "An instrument tray: the one under the pointer lifts clear and its neighbours slide aside.",
  rules: [1, 2, 4, 5],
  range: [0, 7, 11],
  tour: [[150, 170], [215, 200], [270, 230], null],
  mount,
});
