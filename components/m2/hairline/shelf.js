// @ts-nocheck
// Custom Hairline figure, drawn with the hairline-create skill (source + checks in design history).
import HL from './kernel'

/**
 * Shelf: a row of seven guides on a shelf plank, uneven in height and width.
 * The book under the pointer slides out toward the reader and takes the bright
 * stroke; its neighbours ease forward after it, staggered outwards. At rest the
 * third sits a little proud. Each spine has a band at head and foot. The
 * read-out names the guide. The slider is how far the chosen book slides out.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, unproj,
  tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid,
} = HL;

const WS = [16, 12, 20, 14, 18, 11, 17], HS = [52, 44, 58, 40, 50, 46, 55];
const DEPTH = 30, PAD = 3, REST_I = 2, REST_OUT = 7, NAMES = ["guide 1", "guide 2", "guide 3", "guide 4", "guide 5", "guide 6", "guide 7"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;

  const xs = [];
  let acc = PAD;
  for (const w of WS) { xs.push(acc); acc += w + 1.6; }
  const L = acc + PAD;

  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -4, -7], [L, DEPTH + 30, -7], [L, -4, -7], [0, DEPTH + 30, -7], [0, 0, 60]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, -4, L, DEPTH + 6, 3, 1.4);
  put(solid(g), prism(P, front, sr, si, -7, 0));

  const books = WS.map((w, i) => {
    const grp = mk("g", {}, g), body = solid(grp), bands = mk("path", { class: "nf lo" }, grp);
    return { i, w, h: HS[i], x: xs[i], grp, body, bands, y: tween(i === REST_I ? REST_OUT : 0), drawn: NaN };
  });

  function draw(b, dy) {
    if (dy === b.drawn) return;
    b.drawn = dy;
    const [r, ri] = rings(b.x, dy, b.x + b.w, dy + DEPTH, 1.6, 0.9);
    put(b.body, prism(P, front, r, ri, 0, b.h));
    const y = dy + DEPTH, x0 = b.x + 2, x1 = b.x + b.w - 2;
    b.bands.setAttribute("d", [7, 10, b.h - 10, b.h - 7].map((z) => seg(P(x0, y, z), P(x1, y, z))).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of books) { draw(b, tval(b.y, now)); if (!tdone(b.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : REST_I;
    act = a;
    const lit = a >= 0 ? a : REST_I;
    books.forEach((b) => {
      const d = Math.abs(b.i - from);
      const to = a < 0 ? (b.i === REST_I ? REST_OUT : 0) : b.i === a ? out : d === 1 ? out * 0.18 : 0;
      tset(b.y, to, now, d * 40);
      b.body.sil.classList.toggle("hi", b.i === lit);
    });
    // a book pulled toward the reader is painted after the rest of the row
    if (a >= 0) g.appendChild(books[a].grp);
    else books.forEach((b) => g.appendChild(b.grp));
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);

  // The hit is on the ground plane under the resting row, which never moves.
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (y < -20 || y > DEPTH + 40 || x < 0 || x > L) return -1;
    let best = 0;
    xs.forEach((x0, i) => { if (x >= x0 - 0.8) best = i; });
    return clamp(best, 0, WS.length - 1);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { out = v; const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

export default ({
  name: "shelf",
  means: "A shelf of guides: the one under the pointer slides out toward you, its neighbours easing after it.",
  rules: [1, 2, 4, 5],
  range: [12, 20, 26],
  tour: [[150, 150], [215, 180], [265, 205], null],
  mount,
});
