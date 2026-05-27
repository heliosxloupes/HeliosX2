// Config for the homepage scroll cinematic intro.
// Frames are WebP (fast decode for scrubbing), 240 @ 1280x720, ~5.7MB total.

export const CINEMATIC = {
  frameCount: 240,
  framePath: (i: number) =>
    `/cinematic/frames/frame-${String(i).padStart(4, '0')}.webp`,
  audioSrc: '/cinematic/audio.m4a',
  audioVolume: 0.32,
  // localStorage key — once set, returning visitors skip straight to the homepage.
  seenKey: 'heliosx_intro_seen_v1',
  // Runway height in vh. Faster than the original 700 but with enough room at
  // the end for the caption to finish before the 2nd section rises. The 2nd
  // section overlaps the last 100vh (sticky-release window), so it starts
  // rising at (1 - 100/runwayVh) ≈ 83% here — the caption must complete before
  // that with dwell. ~25px of scroll per frame keeps the scrub smooth.
  runwayVh: 600,
} as const
