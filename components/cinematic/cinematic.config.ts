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
  // Runway height in vh — taller = longer, more luxurious scrub.
  runwayVh: 700,
} as const
