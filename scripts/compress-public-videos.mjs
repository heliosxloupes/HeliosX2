// One-shot video optimizer for hero/autoplay videos in public/.
// Usage: node scripts/compress-public-videos.mjs
//
// Strategy:
//   - H.264 + AAC MP4, faststart (moov atom at the front so playback can
//     begin before download completes).
//   - Cap longest edge at MAX_WIDTH; preserve aspect ratio. Even-pad to
//     keep H.264 happy.
//   - CRF 22 on the main MP4 (visually near-lossless).
//   - Extract a poster JPG at SECOND=1 so the markup can render the
//     poster as the LCP element instead of the video bytes.

import ffmpegPath from 'ffmpeg-static'
import { spawnSync } from 'node:child_process'
import { mkdirSync, statSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public')

const MAX_WIDTH = 1280
const CRF = 22
const PRESET = 'medium'
const POSTER_SECOND = 1

const targets = [
  // Autoplay device mockup video — most expensive cold-load. Compress hard.
  { input: 'mainpagevideo2.mp4', output: 'mainpagevideo2.mp4', poster: 'mainpagevideo2-poster.jpg' },
  // User-triggered thumbnail/modal video — still worth compressing but
  // user has already engaged before it plays.
  { input: 'mainpagevideo.mp4', output: 'mainpagevideo.mp4', poster: 'mainpagevideo-poster.jpg' },
]

function format(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}

function run(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  if (result.status !== 0) {
    const stderr = result.stderr?.toString() ?? ''
    throw new Error(`ffmpeg failed (exit ${result.status}):\n${stderr}`)
  }
}

let totalBefore = 0
let totalAfter = 0

for (const { input, output, poster } of targets) {
  const inputPath = join(PUBLIC_DIR, input)
  if (!existsSync(inputPath)) {
    console.log(`skip (missing): ${input}`)
    continue
  }
  const sizeBefore = statSync(inputPath).size
  totalBefore += sizeBefore

  const tempOutput = join(PUBLIC_DIR, `__tmp_${basename(output)}`)
  const posterPath = join(PUBLIC_DIR, poster)
  mkdirSync(dirname(tempOutput), { recursive: true })

  // Encode the compressed MP4 to a temp file first so we never trash the
  // source if ffmpeg fails partway.
  run([
    '-y',
    '-i', inputPath,
    '-vf', `scale='if(gt(iw,ih),min(${MAX_WIDTH},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_WIDTH},ih))',pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    '-c:v', 'libx264',
    '-preset', PRESET,
    '-crf', String(CRF),
    '-profile:v', 'high',
    '-level:v', '4.1',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    tempOutput,
  ])

  // Extract a poster frame as JPG.
  run([
    '-y',
    '-i', inputPath,
    '-ss', String(POSTER_SECOND),
    '-frames:v', '1',
    '-vf', `scale='if(gt(iw,ih),min(${MAX_WIDTH},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_WIDTH},ih))'`,
    '-q:v', '4',
    posterPath,
  ])

  // Swap temp into place.
  const { renameSync } = await import('node:fs')
  renameSync(tempOutput, join(PUBLIC_DIR, output))
  const sizeAfter = statSync(join(PUBLIC_DIR, output)).size
  totalAfter += sizeAfter
  const posterSize = statSync(posterPath).size

  console.log(
    `${input}: ${format(sizeBefore)} -> ${format(sizeAfter)}  (poster ${poster}: ${format(posterSize)})`
  )
}

const saved = totalBefore - totalAfter
const ratio = totalBefore === 0 ? 0 : (saved / totalBefore) * 100
console.log('')
console.log(`Total video before:  ${format(totalBefore)}`)
console.log(`Total video after:   ${format(totalAfter)}`)
console.log(`Saved:               ${format(saved)} (${ratio.toFixed(1)}%)`)
