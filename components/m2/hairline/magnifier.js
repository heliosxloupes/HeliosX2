// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill.
import HL from './kernel'

/**
 * Magnifier: a classic magnifying glass, round rim and turned handle, held over
 * a ruled sheet. The pointer's spot on the sheet is where the glass goes, on a
 * spring; inside the glass the ruled lines are drawn enlarged about its centre,
 * so they spread apart and run off its edge. The rim is the bright stroke. The
 * read-out names the line under the centre. The slider is the magnification.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, ringAt, rings, run, seg, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 150, D = 112, X0 = 12, X1 = W - 12, LINES = [16, 26, 36, 46, 56, 66, 76, 86, 96];
const R = 24, H = 16, HL_LEN = 38, REST = [62, 52];

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let M = value;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[0, 0, -3], [W + HL_LEN, D, -3], [W + HL_LEN, 0, -3], [0, D, -3], [W / 2, D / 2, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, W, D, 6, 1.6);
  put(solid(g), prism(P, front, sr, si, -3, 0));
  mk("path", { d: LINES.map((v) => seg(P(X0, v, 0), P(X1, v, 0))).join(""), class: "nf lo" }, g);
  mk("path", { d: seg(P(X0 + 10, 8, 0), P(X0 + 10, D - 8, 0)), class: "nf lo" }, g);

  // The glass, its enlarged view, the rim, then the ferrule and handle reaching toward the reader.
  const glass = mk("path", { class: "sil hi" }, g);
  const view = mk("path", { class: "nf" }, g);
  const rimIn = mk("path", { class: "nf lo" }, g);
  const rimEdge = mk("path", { class: "nf sil hi" }, g);
  const ferrule = solid(g), handle = solid(g);

  const sx = spring(REST[0], { eps: 0.03 }), sy = spring(REST[1], { eps: 0.03 });
  let drawn = "";

  function draw() {
    const cu = sx.x, cv = sy.x, key = cu.toFixed(2) + "," + cv.toFixed(2) + "," + M;
    if (key === drawn) return;
    drawn = key;
    const disc = shift(circ(R, 24), cu, cv);
    glass.setAttribute("d", poly(ringAt(P, disc, H)));
    // each ruled line, enlarged about the centre, clipped to the glass by its chord
    let d = "";
    for (const v of LINES.concat([LINES[0] - 10, LINES[LINES.length - 1] + 10])) {
      const vv = cv + (v - cv) * M, dv = vv - cv;
      if (Math.abs(dv) >= R - 2.5) continue;
      const half = Math.sqrt((R - 2.5) ** 2 - dv * dv);
      const a = Math.max(cu - half, cu + (X0 - cu) * M), b = Math.min(cu + half, cu + (X1 - cu) * M);
      if (b > a) d += seg(P(a, vv, H), P(b, vv, H));
    }
    view.setAttribute("d", d);
    rimIn.setAttribute("d", poly(ringAt(P, shift(circ(R - 2.5, 24), cu, cv), H)));
    rimEdge.setAttribute("d", open(ringAt(P, run(disc, front), H - 3)));
    const [fr, fi] = rings(cu + R - 2, cv - 4.5, cu + R + 8, cv + 4.5, 2.5, 1);
    put(ferrule, prism(P, front, fr, fi, H - 4, H + 1));
    const [hr, hi] = rings(cu + R + 8, cv - 3.4, cu + R + HL_LEN, cv + 3.4, 3.4, 1.2);
    put(handle, prism(P, front, hr, hi, H - 3.6, H + 0.6));
  }

  const B = register(stage, (dt) => {
    const a = stepS(sx, dt), b = stepS(sy, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sx.t = REST[0]; sy.t = REST[1]; read.textContent = "rest"; B.wake(); return; }
    // the pointer meets the sheet's plane, which never moves; the glass follows it inside the margins
    const [u, v] = unproj(C, p[0], p[1], 0);
    sx.t = clamp(u, R * 0.6, W - R * 0.6);
    sy.t = clamp(v, R * 0.6, D - R * 0.6);
    let near = 0;
    LINES.forEach((l, i) => { if (Math.abs(l - sy.t) < Math.abs(LINES[near] - sy.t)) near = i; });
    read.textContent = `line ${near + 1}`;
    B.wake();
  }

  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { M = v; drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "magnifier",
  means: "A magnifying glass over a ruled sheet: the lines under the glass are drawn enlarged as it moves.",
  rules: [1, 3, 4, 5],
  range: [1.5, 2, 2.6],
  tour: [[150, 150], [240, 190], [190, 215], null],
  mount,
});
