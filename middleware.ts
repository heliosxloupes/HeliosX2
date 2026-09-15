import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * One canonical host: https://heliosxvision.com (no www).
 *
 * Two things get folded in here:
 *   - the legacy heliosxloupes.com domain
 *   - the www. subdomain of either domain
 *
 * The www case matters as much as the legacy one: www.heliosxvision.com and
 * heliosxvision.com were both serving 200s with no redirect between them, so
 * Google indexed both and split each page's ranking signals across two
 * addresses. Canonical tags alone weren't consolidating them.
 *
 * Path and query string are preserved, so ?session_id=… on the Stripe return
 * URL survives the redirect.
 *
 * Every other response gets the visitor's country in the hx_geo cookie, read
 * from Vercel's x-vercel-ip-country header. lib/consent.ts uses it to pick the
 * tracking model: on by default with an opt-out for US visitors, opt-in
 * banner for everyone else.
 */
const CANONICAL_HOST = 'heliosxvision.com'
const GEO_COOKIE = 'hx_geo'

function withVisitorCountry(request: NextRequest, response: NextResponse) {
  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase()
  if (/^[A-Z]{2}$/.test(country) && request.cookies.get(GEO_COOKIE)?.value !== country) {
    response.cookies.set(GEO_COOKIE, country, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: true,
    })
  }
  return response
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase()

  // Leave local dev and Vercel preview deployments on their own hostnames.
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.endsWith('.vercel.app')) {
    return withVisitorCountry(request, NextResponse.next())
  }

  const isLegacyDomain = host.includes('heliosxloupes.com')
  const isWww = host.startsWith('www.')

  if (isLegacyDomain || isWww) {
    const url = request.nextUrl.clone()
    url.host = CANONICAL_HOST
    url.protocol = 'https:'
    url.port = ''
    return NextResponse.redirect(url, { status: 301 })
  }

  return withVisitorCountry(request, NextResponse.next())
}

export const config = {
  matcher: '/(.*)',
}
