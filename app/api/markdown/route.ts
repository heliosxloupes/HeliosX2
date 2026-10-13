import { NextResponse, type NextRequest } from 'next/server'

import { MARKDOWN_CONTENT_TYPE } from '@/lib/markdown-negotiation'
import { renderPageMarkdown } from '@/lib/page-markdown'
import { siteUrl } from '@/lib/seo'

// Target of the middleware rewrite for `Accept: text/markdown` requests.
// The original path arrives in the x-markdown-path header (with ?path= as a
// fallback); the public URL never changes. No CDN caching: the cache key would
// be /api/markdown, not the page path.

function respond(request: NextRequest, method: 'GET' | 'HEAD') {
  const path = request.headers.get('x-markdown-path') || request.nextUrl.searchParams.get('path') || '/'
  const { status, body } = renderPageMarkdown(path)
  return new NextResponse(method === 'HEAD' ? null : body, {
    status,
    headers: {
      'Content-Type': MARKDOWN_CONTENT_TYPE,
      Vary: 'Accept',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...(status === 200 ? { Link: `<${siteUrl}${path === '/' ? '/' : path}>; rel="canonical"` } : {}),
    },
  })
}

export function GET(request: NextRequest) {
  return respond(request, 'GET')
}

export function HEAD(request: NextRequest) {
  return respond(request, 'HEAD')
}
