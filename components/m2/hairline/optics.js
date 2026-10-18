// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Optics: five loupe barrels standing on a plate, shortest to longest, the way
 * magnification grows from 2.5x to 8.5x. Each barrel has its glass on top and
 * a focus band round its middle. The barrel under the pointer rises and takes
 * the bright stroke; its neighbours rise a little after it, staggered
 * outwards. At rest the 4.5x stands a touch proud. The read-out names the
 * magnification. The slider is how far the chosen barrel rises.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, ringAt, rings, run,
  tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid,
} = HL;

const MAGS = ["2.5x", "3.5x", "4.5x", "6.0x", "8.5x"];
const HS = [16, 23, 31, 40, 50], R = 10, GAP = 27, N = 5, REST_I = 2, REST_LIFT = 5;

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;

  const C = Cam(45, 0.5, 2.0);
  const X1 = (N - 1) * GAP;
  fit(C, [[-R - 8, -R - 8, -5], [X1 + R + 8, R + 8, -5], [X1 + R + 8, -R - 8, -5], [-R - 8, R + 8, -5], [X1, 0, HS[N - 1] + 26]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-R - 8, -R - 8, X1 + R + 8, R + 8, 8, 2);
  put(solid(g), prism(P, front, pr, pi, -5, 0));

  const ring = circ(R, 16), crease = circ(R - 1.4, 16), glass = circ(R - 3, 16);
  const bars = HS.map((h, i) => {
    const grp = mk("g", {}, g), body = solid(grp);
    const band = mk("path", { class: "nf lo" }, grp), lens = mk("path", { class: "nf" }, grp);
    return { i, h, body, band, lens, z: tween(i === REST_I ? REST_LIFT : 0), drawn: NaN };
  });

  function draw(b, lift) {
    if (lift === b.drawn) return;
    b.drawn = lift;
    const x = b.i * GAP, top = b.h + lift;
    put(b.body, prism(P, front, shift(ring, x, 0), shift(crease, x, 0), lift, top));
    const bz = lift + b.h * 0.42;
    b.band.setAttribute("d", open(ringAt(P, run(shift(ring, x, 0), front), bz)) + open(ringAt(P, run(shift(ring, x, 0), front), bz + 3)));
    b.lens.setAttribute("d", poly(ringAt(P, shift(glass, x, 0), top)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bars) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : REST_I;
    act = a;
    const lit = a >= 0 ? a : REST_I;
    bars.forEach((b) => {
      const d = Math.abs(b.i - from);
      const to = a < 0 ? (b.i === REST_I ? REST_LIFT : 0) : b.i === a ? rise : d === 1 ? rise * 0.3 : 0;
      tset(b.z, to, now, d * 45);
      b.body.sil.classList.toggle("hi", b.i === lit);
    });
    read.textContent = a < 0 ? "rest" : MAGS[a];
    B.wake();
  }
  setActive(-1);

  // One row: the barrel whose resting foot is nearest the pointer on screen.
  const feet = bars.map((b) => P(b.i * GAP, 0, 0)[0]);
  function hit(p) {
    let best = -1, bd = 22;
    feet.forEach((fx, i) => { const d = Math.abs(p[0] - fx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { rise = clamp(v, 0, 30); const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "optics",
  means: "Loupe barrels from 2.5x to 8.5x: the one under the pointer rises out of the row.",
  rules: [1, 2, 4, 5],
  range: [10, 18, 26],
  tour: [[132, 200], [228, 170], [292, 150], null],
  mount,
});
