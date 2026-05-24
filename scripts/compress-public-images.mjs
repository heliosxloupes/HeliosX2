// Recompress PNGs in public/ down to a sane source size so next/image
// transcodes faster and Vercel ships fewer bytes.
// Usage: node scripts/compress-public-images.mjs
//
// Strategy:
//   1. Walk public/, find every PNG over MIN_SIZE_BYTES.
//   2. If a dimension exceeds MAX_DIMENSION, resize inside (preserve aspect).
//   3. Re-encode with sharp's PNG optimizer (palette + max compression).
//   4. Skip rewrite if savings under MIN_SAVINGS_RATIO so we don't churn
//      files that are already near-optimal.
//   5. Print per-file before/after and a totals summary.

import sharp from 'sharp'
import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public')

const MIN_SIZE_BYTES = 1024 * 1024 // 1 MB
const MAX_DIMENSION = 2048
const MIN_SAVINGS_RATIO = 0.1

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(fullPath)
    } else {
      yield fullPath
    }
  }
}

function format(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}

let totalBefore = 0
let totalAfter = 0
let processed = 0
let skippedLowSavings = 0
let errors = 0

for await (const file of walk(PUBLIC_DIR)) {
  if (!/\.png$/i.test(file)) continue
  const stats = await stat(file)
  if (stats.size < MIN_SIZE_BYTES) continue
  totalBefore += stats.size

  try {
    const input = await readFile(file)
    const meta = await sharp(input).metadata()
    let pipeline = sharp(input)

    const widthOversize = meta.width && meta.width > MAX_DIMENSION
    const heightOversize = meta.height && meta.height > MAX_DIMENSION
    if (widthOversize || heightOversize) {
      pipeline = pipeline.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    const out = await pipeline
      .png({ compressionLevel: 9, quality: 85, palette: true, effort: 10 })
      .toBuffer()

    if (out.length <= stats.size * (1 - MIN_SAVINGS_RATIO)) {
      await writeFile(file, out)
      totalAfter += out.length
      processed += 1
      const rel = relative(ROOT, file)
      console.log(`  ${format(stats.size)} -> ${format(out.length)}  ${rel}`)
    } else {
      totalAfter += stats.size
      skippedLowSavings += 1
    }
  } catch (error) {
    errors += 1
    totalAfter += stats.size
    console.error(`  FAILED ${relative(ROOT, file)}: ${error.message}`)
  }
}

const saved = totalBefore - totalAfter
const ratio = totalBefore === 0 ? 0 : (saved / totalBefore) * 100

console.log('')
console.log(`Processed:           ${processed}`)
console.log(`Skipped (low gain):  ${skippedLowSavings}`)
console.log(`Errors:              ${errors}`)
console.log(`Total before:        ${format(totalBefore)}`)
console.log(`Total after:         ${format(totalAfter)}`)
console.log(`Saved:               ${format(saved)} (${ratio.toFixed(1)}%)`)
