// Markdown content negotiation (acceptmarkdown.com).
//
// An agent that sends `Accept: text/markdown` gets a Markdown version of the
// same URL; browsers keep getting HTML. middleware.ts rewrites those requests
// to /api/markdown, which renders the page from the same data the HTML uses.

type MediaRange = { type: string; q: number; order: number }

function parseAccept(accept: string): MediaRange[] {
  return accept
    .split(',')
    .map((part, order) => {
      const [rawType, ...params] = part.trim().split(';')
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1
      return { type: rawType.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0, order }
    })
    .filter((range) => range.type.length > 0)
}

function qualityFor(ranges: MediaRange[], type: string) {
  const exact = ranges.find((range) => range.type === type)
  return exact ? exact.q : 0
}

/**
 * True when the client asks for Markdown at least as strongly as HTML.
 * Wildcards (`*\/*`, `text/*`) never select Markdown on their own, so
 * browsers and generic fetchers keep the HTML page.
 */
export function prefersMarkdown(accept: string | null | undefined) {
  if (!accept) return false
  const ranges = parseAccept(accept)
  const markdown = qualityFor(ranges, 'text/markdown')
  if (markdown <= 0) return false
  const html = Math.max(qualityFor(ranges, 'text/html'), qualityFor(ranges, 'application/xhtml+xml'))
  if (markdown > html) return true
  if (markdown < html) return false
  // Equal weights: the type listed first wins.
  const mdOrder = ranges.find((r) => r.type === 'text/markdown')?.order ?? Infinity
  const htmlOrder = ranges.find((r) => r.type === 'text/html')?.order ?? Infinity
  return mdOrder < htmlOrder
}

/** Paths that are files or framework internals: never negotiated. */
export function isNegotiablePath(pathname: string) {
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) return false
  // Anything with a file extension (images, llms.txt, sitemap.xml, PDFs).
  const last = pathname.split('/').pop() ?? ''
  return !last.includes('.')
}

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8'
