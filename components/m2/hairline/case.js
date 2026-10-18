// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Case: a hard loupe case with a foam insert cut to hold a pair. The pointer's
 * height sets how far the lid lifts, on a spring: low keeps it shut, high
 * opens it to show the two cutouts. At rest the lid sits ajar. The lid's
 * silhouette is the bright stroke. The read-out says how open it is. The
 * slider is how far the lid may lift.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings,
  ringAt, spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 130, D = 78, BH = 22, LH = 9, REST = 9;

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const C = Cam(45, 0.5, 1.82);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [W / 2, D / 2, BH + LH + 44]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, BH));

  // The foam, a little below the rim, and the two cutouts shaped for a pair of barrels.
  const [fr] = rings(5, 5, W - 5, D - 5, 8, 1);
  mk("path", { d: poly(ringAt(P, fr, BH - 2)), class: "nf lo" }, g);
  for (const cx of [W * 0.32, W * 0.68]) {
    mk("path", { d: poly(ringAt(P, shift(circ(15, 16), cx, D / 2), BH - 2)), class: "nf" }, g);
    mk("path", { d: poly(ringAt(P, shift(circ(9, 16), cx, D / 2), BH - 2)), class: "nf lo" }, g);
  }
  mk("path", { d: poly(ringAt(P, rings(W * 0.42, D / 2 - 3, W * 0.58, D / 2 + 3, 3, 1)[0], BH - 2)), class: "nf lo" }, g);

  // The lid, a touch larger than the body, with a zip seam round its foot.
  const [lr, li] = rings(-1.5, -1.5, W + 1.5, D + 1.5, 13, 2.4);
  const lid = solid(g);
  lid.sil.classList.add("hi");
  const seam = mk("path", { class: "nf lo" }, g);

  const sp = spring(REST, { eps: 0.05 });
  let drawn = NaN;
  function draw() {
    const z = BH + sp.x;
    if (z === drawn) return;
    drawn = z;
    put(lid, prism(P, front, lr, li, z, z + LH));
    seam.setAttribute("d", poly(ringAt(P, rings(2, 2, W - 2, D - 2, 10, 1)[0], z + 2.2)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const u = clamp((240 - p[1]) / 170, 0, 1);
    sp.t = 1 + u * reach;
    read.textContent = `open ${Math.round(u * 100)}%`;
    B.wake();
  }

  // The pointer's screen height alone sets the lift: nothing it reads ever moves.
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; },
    destroy: bag.dispose,
  };
}

export default ({
  name: "case",
  means: "A loupe case: the higher the pointer, the further the lid lifts off the foam that holds the pair.",
  rules: [1, 3, 5, 8],
  range: [24, 34, 42],
  tour: [[200, 110], [200, 200], [200, 80], null],
  mount,
});
