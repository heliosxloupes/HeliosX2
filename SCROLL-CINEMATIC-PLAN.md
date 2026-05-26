# Scroll Cinematic — Design Doc

**Status:** Design / planning. No code yet.
**Author:** Claude (Opus 4.7) with Kyle
**Date:** 2026-05-26
**Goal:** A visually stunning, scroll-driven cinematic intro: load on a live waterfall with a modern minimal facility on top; as the user scrolls, the camera rotates right while zooming, pushes into the facility, and lands inside on the surgical loupes resting on a modern stand. Linear cinematic (v1, confirmed). Ends by transitioning into the normal homepage.

---

## TL;DR (the key decision)

**You do not need real-time 3D. If you produce one cinematic video, scroll can drive it.**

The technique is **scroll-scrubbing**: scroll position maps to a frame/timestamp in a pre-rendered cinematic. The video is the animation; scroll is the playhead. This is the literal Apple "AirPods / MacBook" scroll technique. It is simpler, more reliable, and higher-quality than trying to rebuild a photoreal waterfall in real-time WebGL.

**Recommended pipeline:** produce the cinematic → extract it to an optimized image-frame sequence → draw the scroll-matched frame to a `<canvas>` on scroll. The video file is just the authoring source; we ship frames, not the video, because frame-scrubbing is smooth and deterministic where direct video seeking is janky.

**The one catch:** the payoff shot must show the *real* HeliosX loupes accurately. A fully AI-generated video (e.g. VEO) cannot render your real SKU. Solve it by authoring the product reveal from a real source (filmed macro footage of the actual loupes, or a render from a GLB of the real product) and stitching it as the final beat. See "Authoring the cinematic" below.

---

## How scroll-scrubbing works (the mechanic)

1. A tall scroll container (e.g. `300vh`) creates scroll runway. The cinematic canvas is `position: sticky` and pinned to the viewport while the user scrolls through that runway.
2. Scroll progress through the runway (0 → 1) maps to frame index (frame 0 → frame N).
3. On each scroll/`rAF` tick, we `drawImage()` the matching frame to the canvas.
4. At progress = 1, the canvas cross-fades into the normal homepage (the existing hero/lineup).

Scroll → playhead. No autoplay. The user "scrubs" the camera move with their scroll wheel/trackpad/touch.

### Two ways to scrub — and why we pick frames

| Method | How | Verdict |
|---|---|---|
| **A. `<video>` + `currentTime`** | Map scroll → `video.currentTime` | ❌ Unreliable. H.264/H.265 only seek cleanly to keyframes, so scrubbing is janky unless you re-encode with a keyframe on every frame (huge file). Mobile Safari throttles/blocks programmatic seeking. Avoid as the primary method. |
| **B. Frame sequence + canvas `drawImage`** (Apple method) | Decode the video to N images, preload, draw the scroll-matched frame | ✅ **Recommended.** Buttery, deterministic, works on mobile, no codec-seek lottery. Cost: total payload of the frames (managed — see Performance). |

We author in video, **ship in frames.**

---

## Authoring the cinematic (where the video comes from)

This is the real cost and the real creative decision. Four ways to produce the source cinematic, best → most-compromised for *this specific* product-reveal:

### Option 1 — 3D artist (Blender / Cinema4D / Houdini) — highest quality, full control
- Artist models the facility + waterfall environment + imports a GLB of the real loupes, keyframes the exact camera path, renders the full move.
- ✅ Frame-exact choreography (rotate-right-while-zooming-through-the-window-onto-the-stand).
- ✅ The loupes are *your real product* (rendered from a GLB).
- ✅ Photoreal water/volumetrics are trivial offline.
- ✅ Re-renderable at any resolution / frame count.
- Cost: a freelance 3D/motion artist; ~1–3 weeks for a polished 15–30s shot. This is the gating spend.

### Option 2 — VEO (or other generative video) for the environment, real footage for the product — hybrid
- Use VEO to generate the **waterfall + facility fly-in** (it's genuinely good at ambient environment shots).
- Film a **real macro shot of the actual loupes on a stand** for the final beat.
- Composite/cut the two into one continuous-feeling move; extract frames; scrub.
- ✅ Fast, cheap-ish environment.
- ⚠️ VEO constraints to plan around:
  - Clips are short (~8s) — a long continuous move needs multiple clips stitched, and **VEO does not keep a persistent world**, so two clips of "the same" waterfall/facility may not match. Continuity across cuts is the hard part. Design the move with deliberate cut points (e.g. a whip-pan or a push-through-darkness transition) to hide seams.
  - VEO **cannot** render your real loupes — never let the product reveal come from VEO.
  - Camera path is prompt-suggested, not keyframed — you get *a* move, not *the exact* move.

### Option 3 — Filmed plate + CGI facility — for a real-water look without a full 3D world
- Real waterfall footage (licensed or shot) + a CGI facility composited on top + a filmed/rendered product reveal.
- ✅ Real water. ⚠️ Compositing skill required; camera move limited by the source plate's camera.

### Option 4 — Fully AI/procedural — fastest, lowest product fidelity
- VEO/procedural environment + an AI or stand-in product at the end.
- ✅ Cheapest/fastest. ❌ Product is not your real SKU — acceptable only for a teaser/mood piece, not the primary store hero.

**Recommendation:** Option 1 if budget allows (it's the only one that nails all of: photoreal water, exact choreography, real product). Option 2 is the pragmatic middle path if you want to move fast and are willing to design around VEO's continuity limits and film the product beat separately.

---

## Technical architecture (fits the current stack)

Your stack already has everything needed — no new core deps:
- **Lenis** (global smooth scroll) — already wired via `components/SmoothScroll` + `components/lenis-provider`.
- **GSAP + ScrollTrigger** — already used across the site; ideal for pinning + progress mapping.
- **Framer Motion** — for the cross-fade hand-off into the page.
- **R3F/Three** — only needed if we later upgrade the final beat to interactive (not in v1).

### Component shape (v1, frame-scrub)

```
components/cinematic/
  ScrollCinematic.tsx        # client component: sticky canvas + scroll→frame mapping
  useFrameSequence.ts        # preloads + decodes frames, exposes draw(frameIndex)
  cinematic.config.ts        # frame count, base path, dimensions, breakpoints
  CinematicFallback.tsx      # reduced-motion / mobile / no-JS poster + short loop
```

Sketch of the core mechanic:

```tsx
// 300vh runway; canvas is sticky and pinned.
// ScrollTrigger maps runway progress (0..1) -> frameIndex (0..N-1).
// On update, drawImage the matching preloaded frame.
ScrollTrigger.create({
  trigger: runwayRef.current,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const frame = Math.round(self.progress * (FRAME_COUNT - 1))
    drawFrame(frame)            // ctx.drawImage(images[frame], 0, 0, w, h)
  },
})
```

Frames live in `/public/cinematic/` as `frame-0001.avif` … `frame-0300.avif`. The loader preloads in priority order (first frames first so the top of the experience is instant), and can stream the rest.

### Where it sits on the page
- The cinematic runway is the **first thing** on `/` (above the current hero), OR gated behind a "first visit only" flag so returning shoppers go straight to the store. Decision below.
- At progress = 1, cross-fade canvas → the existing `HeroSection` / `LineupSection`. The page continues normally; SEO content is untouched and still server-rendered below.

---

## Performance & SEO guardrails (non-negotiable for a CWV-optimized store)

We just cut the hero image 97% — the cinematic must not undo that. Rules:

1. **It must not block LCP.** The server-rendered hero text/H1 remain the LCP target. The canvas + frames load *after* first paint.
2. **Desktop-gated.** Full frame-scrub ships to desktop/large viewports only. **Mobile gets a short looping MP4 or a stunning static hero** — never the full frame set on a phone.
3. **Frames are AVIF/WebP**, dimensioned to actual display size (e.g. 1600×900, not 4K), quality-tuned. Target the *whole sequence* under a hard budget (e.g. ≤ 6–8 MB on desktop via aggressive AVIF + frame-count discipline).
4. **Progressive preload**, not all-at-once. First ~30 frames eager; rest streamed. Show the first frame instantly as a poster.
5. **`prefers-reduced-motion: reduce`** → skip the scrub entirely, show the final framed product shot as a static hero. Accessibility + motion-sickness safety.
6. **No-JS / crawler fallback** → server-render the real hero; the cinematic is pure enhancement. Googlebot indexes the normal page; zero SEO risk.
7. **Frame count discipline** is the main lever: 200–300 frames at 30fps ≈ 7–10s of motion, which is plenty. More frames = smoother but heavier; we tune to the budget.

---

## Asset spec (hand this to whoever produces the cinematic)

- **Duration of motion:** 8–12s of camera move (maps to ~250–360 frames at 30fps).
- **Resolution to deliver:** 1920×1080 master; we downscale to ~1600×900 for shipped frames.
- **Frame rate:** 30fps source.
- **Camera beats (storyboard):**
  1. Open: wide on the waterfall, facility on top, gentle drift (frames 0–60).
  2. Rotate right + begin zoom toward the facility (frames 60–160).
  3. Push toward/through a window or entrance (frames 160–240).
  4. Interior: settle onto the loupes on the modern stand, final hero framing (frames 240–end).
- **The product beat must use the real loupes** (GLB render or filmed macro). Flag if only photography exists — we'll plan the product shot separately.
- **Delivery:** either the master video (we extract frames) OR a numbered PNG sequence (`frame_0001.png`…). Either works; PNG sequence skips a decode step.
- **Color:** match the site's dark cinematic palette (deep blacks, emerald/sky accents per CLAUDE.md) so the hand-off into the page is seamless.

---

## Phased build plan

- **Phase 0 — this doc.** ✅
- **Phase 1 — Proof-of-concept harness (no final assets).** Build `ScrollCinematic` with ~30 placeholder/stand-in frames (even a quick Blender turntable or stock fly-through) so you can *feel* the scroll timing, pin behavior, and hand-off on real hardware. De-risks the asset spend before you commission anything. *(~3–5 days; recommended next step once you green-light.)*
- **Phase 2 — Produce the real cinematic.** Per the asset spec (Option 1 or 2 above). This is the long pole — artist time.
- **Phase 3 — Integrate final frames.** Swap placeholders for real frames, tune frame count/quality to the perf budget, wire desktop-gating + mobile fallback + reduced-motion.
- **Phase 4 — Polish.** Cross-fade hand-off, optional scroll-hint UI, preloader, analytics on completion rate.
- **Optional Phase 5 — Interactive upgrade.** Replace the final static beat with a live R3F loupes model the user can orbit / recolor. Your stack already supports it.

---

## Open decisions (for next session)

1. **Production route:** Option 1 (3D artist) vs Option 2 (VEO environment + filmed product). Drives budget + timeline.
2. **Do you have a GLB / 3D model of the loupes, or only photography?** Determines how the product beat is produced.
3. **First-visit-only, or every load?** Returning shoppers may not want the 10s intro every time. Recommend: play on first visit, then a cookie/localStorage flag skips straight to the store (with a replay affordance).
4. **Entry point:** homepage `/` only, or a dedicated `/experience` route linked from the hero?
5. **Budget/timeline** for the cinematic production — this sizes Option 1 vs 2.

---

## Why not the alternatives (recorded for posterity)

- **Real-time R3F for the whole thing:** photoreal real-time water is the hardest thing in WebGL; heavy on mobile; would jeopardize CWV. Not worth it when a pre-rendered cinematic looks better and ships lighter. Reserve R3F for the *optional interactive product beat*.
- **Direct `<video>` scrubbing:** codec keyframe-seek limits + mobile Safari restrictions make it janky. Frame-on-canvas is the robust path.
- **VEO for the product reveal:** cannot render the real SKU. Hard no for the payoff shot; fine for ambient environment only.
