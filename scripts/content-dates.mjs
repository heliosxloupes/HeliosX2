// Writes lib/content-dates.json: the date each landing page and education guide
// last had its own content changed, read from git history. The sitemap uses it
// for <lastmod>, so Google gets dates it can trust and recrawls edited pages.
//
// Run after editing page content, then commit the JSON:  npm run content-dates
// (Vercel builds from a shallow clone, so this can't run at build time.)

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const FILE = 'lib/seo-content.ts'
const OUT = 'lib/content-dates.json'
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })

// Split the file into one text block per page object. Pages are the array
// entries, so their `slug: '...'` lines share the most common indentation
// (nested references sit deeper or shallower). A block ends at the next page
// or at the end of its array (a line starting in column 0).
function pageBlocks(src) {
  const starts = [...src.matchAll(/^( +)slug: '([^']+)'/gm)].map((m) => ({ indent: m[1].length, slug: m[2], at: m.index }))
  if (!starts.length) return new Map()
  const counts = {}
  for (const s of starts) counts[s.indent] = (counts[s.indent] ?? 0) + 1
  const indent = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0])
  const top = starts.filter((s) => s.indent === indent)
  const blocks = new Map()
  top.forEach((s, i) => {
    let end = top[i + 1]?.at ?? src.length
    const arrayEnd = src.slice(s.at, end).search(/\n\S/)
    if (arrayEnd >= 0) end = s.at + arrayEnd
    if (!blocks.has(s.slug)) blocks.set(s.slug, src.slice(s.at, end))
  })

  // Pages appended later with `something.push({ slug: '...' ... })`.
  for (const m of src.matchAll(/\.push\(\{\s*\n\s+slug: '([^']+)'/g)) {
    if (blocks.has(m[1])) continue
    const end = src.indexOf('\n})', m.index)
    blocks.set(m[1], src.slice(m.index, end < 0 ? src.length : end))
  }

  // Pages generated from tuples like ['loupes-for-residents', 'Loupes for Residents', ...]:
  // their own content is every line that names the slug.
  const lines = src.split('\n')
  for (const m of src.matchAll(/^\s*\['([a-z0-9-]+)', '/gm)) {
    if (blocks.has(m[1])) continue
    blocks.set(m[1], lines.filter((line) => line.includes(`'${m[1]}'`)).join('\n'))
  }
  return blocks
}

const history = git('log', '--format=%H %ad', '--date=short', '--', FILE)
  .trim()
  .split('\n')
  .map((line) => line.split(' '))
  .reverse() // oldest first

const lastText = new Map()
const dates = {}
for (const [hash, date] of history) {
  for (const [slug, text] of pageBlocks(git('show', `${hash}:${FILE}`))) {
    if (lastText.get(slug) !== text) {
      lastText.set(slug, text)
      dates[slug] = date
    }
  }
}

// Uncommitted edits count as today.
const today = new Date().toISOString().slice(0, 10)
const working = pageBlocks(git('show', `:${FILE}`))
for (const [slug, text] of working) if (lastText.get(slug) !== text) dates[slug] = today

const sorted = Object.fromEntries(Object.entries(dates).filter(([slug]) => working.has(slug)).sort())
writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`)
console.log(`${OUT}: ${Object.keys(sorted).length} pages from ${history.length} commits`)
