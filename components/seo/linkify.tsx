import Link from 'next/link'
import type { ReactNode } from 'react'

// Detect internal-path tokens like /cardiac-surgery-loupes or
// /education/loupe-magnification-guide inside body copy and convert
// them to real Next.js <Link>s. This is the cheapest possible internal-
// linking lift across the SEO landing + education content — every bullet
// or sentence that says "Cardiac surgery: /cardiac-surgery-loupes"
// becomes a clickable, crawler-followable link without touching the
// underlying content data.
//
// Matches: a leading slash, a first segment char of [a-z0-9], then any
// run of [a-z0-9-/], ending on [a-z0-9]. Stops at whitespace, comma, a
// sentence-ending period, or end-of-string. File-extension URLs (.pdf
// etc.) only live in sourceHref fields, which render separately, so the
// trailing-dot exclusion here is safe.
const INTERNAL_PATH_REGEX = /\/[a-z0-9][a-z0-9-/]*[a-z0-9]/g

// Prices ($695, $1,695, $3,500+), magnifications (3.0x, 8.5x) and percent
// figures (30-50%) are the numbers a buyer actually scans for. Lifting them
// out of uniform grey body copy is what makes these pages skimmable instead
// of a wall of text. Deliberately narrow, so ordinary prose is untouched.
// Thousands are matched as explicit groups so a trailing comma in prose
// ("Newton from $695, Galileo from $795") is not swallowed into the figure.
const FIGURE_REGEX = /\$\d{1,3}(?:,\d{3})*\+?|\b\d+\.\d+x|\b\d+\s?[–-]\s?\d+%/g

function emphasizeFigures(text: string, keyPrefix: string): ReactNode {
  const matches = [...text.matchAll(FIGURE_REGEX)]
  if (matches.length === 0) return text

  const nodes: ReactNode[] = []
  let cursor = 0
  matches.forEach((match, idx) => {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(text.slice(cursor, start))
    nodes.push(
      <span key={`${keyPrefix}-fig-${idx}`} className="font-semibold text-white">
        {match[0]}
      </span>,
    )
    cursor = start + match[0].length
  })
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

export function linkifyText(text: string): ReactNode {
  const matches = [...text.matchAll(INTERNAL_PATH_REGEX)]
  if (matches.length === 0) return emphasizeFigures(text, 'plain')

  const nodes: ReactNode[] = []
  let cursor = 0
  matches.forEach((match, idx) => {
    const start = match.index ?? 0
    const path = match[0]
    if (start > cursor) {
      nodes.push(emphasizeFigures(text.slice(cursor, start), `seg-${idx}`))
    }
    nodes.push(
      <Link
        key={`${path}-${idx}`}
        href={path}
        className="text-emerald-200 underline decoration-emerald-200/30 underline-offset-4 transition hover:text-white hover:decoration-emerald-200"
      >
        {path}
      </Link>,
    )
    cursor = start + path.length
  })
  if (cursor < text.length) {
    nodes.push(emphasizeFigures(text.slice(cursor), 'tail'))
  }
  return nodes
}
