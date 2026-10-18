// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Caliper: a sliding caliper lying on the bench. A graduated beam with a fixed
 * jaw at its left end; the slider rides the beam and carries the moving jaw.
 * The pointer's position along the beam sets where the slider goes, on a
 * spring, so the jaws open and close like measuring a pupillary distance. The
 * moving jaw carries the bright stroke. The read-out is the gap in mm. The
 * slider is the reach: how wide the jaws may open.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS, seg,
  mk, pointer, put, register, disposer, solid,
} = HL;

const L = 210, BW = 12, BT = 5;          // beam: length, width (y), thickness (z)
const JW = 16, JL = 44, IJ = 14;         // jaw width (x), outside jaw length (+y), inside jaw length (-y)
const SW = 34, SH = 10, SY0 = -5, SY1 = 17; // slider: width, height, y extent (it wraps the beam)
const MIN = JW + 4;                      // the slider's left edge when the jaws touch
const REST = 92;                         // the slider's rest position: jaws open on a pupil-sized gap

/** The gap between the jaws' inner faces, read as millimetres on a PD scale. */
const mm = (s) => Math.round(40 + ((s - MIN) / 150) * 40);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-4, -IJ - 6, 0], [L + 4, JL + BW + 4, 0], [L + 4, -IJ - 6, 0], [-4, JL + BW + 4, 0], [0, 0, SH + 2]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const back = mk("g", {}, g), mid = mk("g", {}, g), fore = mk("g", {}, g);

  // Inside jaws (behind the beam, -y), fixed then sliding.
  const fixedIn = rings(0, -IJ, JW * 0.6, 0, 2.2, 0.9);
  put(solid(back), prism(P, front, fixedIn[0], fixedIn[1], 0, BT - 1));
  const slideIn = solid(back);

  // The beam and its graduations.
  const beam = rings(0, 0, L, BW, 3, 1.2);
  put(solid(mid), prism(P, front, beam[0], beam[1], 0, BT));
  let ticks = "";
  for (let x = JW + 6; x <= L - 8; x += 8) {
    const major = (x - JW - 6) % 40 === 0;
    ticks += seg(P(x, 1.6, BT), P(x, major ? 6.4 : 4, BT));
  }
  mk("path", { d: ticks, class: "nf lo" }, mid);

  // Fixed outside jaw, then the slider: body wrapping the beam, its jaw, a thumb grip.
  // A jaw is a root and a narrower tip on the side facing the gap, like a real caliper's knife edge.
  const ROOT = 22, TIP = JW * 0.42;
  const fixedRoot = rings(0, BW, JW, BW + ROOT, 3, 1.2), fixedTip = rings(JW - TIP, BW + ROOT - 2, JW, BW + JL, 2, 0.8);
  put(solid(fore), prism(P, front, fixedRoot[0], fixedRoot[1], 0, BT));
  put(solid(fore), prism(P, front, fixedTip[0], fixedTip[1], 0, BT - 0.6));
  const body = solid(fore), jaw = solid(fore), tip = solid(fore);
  const grip = mk("path", { class: "nf lo" }, fore);
  jaw.sil.classList.add("hi");
  tip.sil.classList.add("hi");

  const sp = spring(REST, { eps: 0.05 });
  let drawn = NaN;

  function draw() {
    const s = sp.x;
    if (s === drawn) return;
    drawn = s;
    const inR = rings(s, -IJ, s + JW * 0.6, SY0, 2.2, 0.9);
    put(slideIn, prism(P, front, inR[0], inR[1], 0, BT - 1));
    const bR = rings(s, SY0, s + SW, SY1, 4, 1.4);
    put(body, prism(P, front, bR[0], bR[1], 0, SH));
    const jR = rings(s, SY1 - 2, s + JW, BW + ROOT, 3, 1.2);
    put(jaw, prism(P, front, jR[0], jR[1], 0, BT));
    const tR = rings(s, BW + ROOT - 2, s + TIP, BW + JL, 2, 0.8);
    put(tip, prism(P, front, tR[0], tR[1], 0, BT - 0.6));
    let d = "";
    for (let k = 0; k < 4; k++) d += seg(P(s + SW - 12 + k * 2.4, SY0 + 5, SH), P(s + SW - 12 + k * 2.4, SY1 - 5, SH));
    grip.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(x) {
    sp.t = x === null ? REST : clamp(x - SW / 2, MIN, MIN + reach);
    read.textContent = x === null ? "rest" : `${mm(sp.t)} mm`;
    B.wake();
  }

  // The hit lives on the ground plane, which never moves: only the world x is read.
  bag.add(pointer(stage, {
    move: (p) => aim(unproj(C, p[0], p[1], 0)[0]),
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; if (sp.t !== REST) aim(sp.t + SW / 2); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "caliper",
  means: "A sliding caliper: the pointer moves the jaw along the beam, opening and closing the gap it measures.",
  rules: [1, 3, 5, 8],
  range: [90, 150, 170],
  tour: [[150, 150], [255, 205], [205, 178], null],
  mount,
});
