import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'

import { GET as llmsTxt } from '@/app/llms.txt/route'
import { GET as markdownRoute } from '@/app/api/markdown/route'
import { middleware } from '@/middleware'
import { isNegotiablePath, prefersMarkdown } from '@/lib/markdown-negotiation'
import { renderPageMarkdown } from '@/lib/page-markdown'
import { catalogItemListJsonLd, organizationJsonLd, productJsonLd } from '@/lib/seo'
import { aboutPage, contactPage, type TrustPage } from '@/lib/trust-pages'

describe('prefersMarkdown', () => {
  it('selects Markdown only when asked for at least as strongly as HTML', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true)
    expect(prefersMarkdown('text/markdown, text/html;q=0.9')).toBe(true)
    expect(prefersMarkdown('text/html, text/markdown')).toBe(false)
    expect(prefersMarkdown('text/html;q=0.5, text/markdown;q=0.8')).toBe(true)
    expect(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false)
    expect(prefersMarkdown('*/*')).toBe(false)
    expect(prefersMarkdown('text/markdown;q=0')).toBe(false)
    expect(prefersMarkdown(null)).toBe(false)
  })

  it('never negotiates files, API routes or Next internals', () => {
    expect(isNegotiablePath('/')).toBe(true)
    expect(isNegotiablePath('/product/medusa')).toBe(true)
    expect(isNegotiablePath('/llms.txt')).toBe(false)
    expect(isNegotiablePath('/sitemap.xml')).toBe(false)
    expect(isNegotiablePath('/api/markdown')).toBe(false)
    expect(isNegotiablePath('/_next/static/chunk.js')).toBe(false)
  })
})

describe('middleware', () => {
  const req = (path: string, accept: string) =>
    new NextRequest(`https://heliosxvision.com${path}`, { headers: { accept, host: 'heliosxvision.com' } })

  it('rewrites Markdown requests to the Markdown route, keeping the URL', () => {
    const res = middleware(req('/product/medusa', 'text/markdown'))
    expect(res.headers.get('x-middleware-rewrite')).toBe('https://heliosxvision.com/api/markdown?path=%2Fproduct%2Fmedusa')
    expect(res.headers.get('x-middleware-request-x-markdown-path')).toBe('/product/medusa')
  })

  it('leaves HTML requests alone and adds Vary: Accept', () => {
    const res = middleware(req('/', 'text/html'))
    expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    expect(res.headers.get('vary')).toContain('Accept')
  })

  it('still redirects www to the canonical host', () => {
    const res = middleware(
      new NextRequest('https://www.heliosxvision.com/faq', { headers: { accept: 'text/markdown', host: 'www.heliosxvision.com' } }),
    )
    expect(res.status).toBe(301)
  })
})

describe('Markdown route', () => {
  const call = (path: string) =>
    markdownRoute(new NextRequest(`https://heliosxvision.com/api/markdown?path=${encodeURIComponent(path)}`))

  it('serves the homepage as Markdown with Vary: Accept', async () => {
    const res = call('/')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(res.headers.get('vary')).toBe('Accept')
    const body = await res.text()
    expect(body.startsWith('# HeliosX Loupes')).toBe(true)
    expect(body).toContain('$1,695')
  })

  it('returns a Markdown 404 that links to llms.txt for unknown paths', async () => {
    const res = call('/__ora-404-probe-test')
    expect(res.status).toBe(404)
    expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    const body = await res.text()
    expect(body.length).toBeGreaterThan(20)
    expect(body).toContain('https://heliosxvision.com/llms.txt')
  })

  it('reads the original path from the rewrite header', async () => {
    const res = markdownRoute(
      new NextRequest('https://heliosxvision.com/api/markdown', { headers: { 'x-markdown-path': '/__missing' } }),
    )
    expect(res.status).toBe(404)
  })

  it('renders products, guides, trust pages and the FAQ', () => {
    for (const path of ['/product', '/product/medusa', '/about', '/contact', '/faq', '/education', '/surgical-loupes', '/education/loupe-magnification-guide']) {
      const page = renderPageMarkdown(path)
      expect(page.status, path).toBe(200)
      expect(page.body.length, path).toBeGreaterThan(200)
    }
    expect(renderPageMarkdown('/product/medusa').body).toContain('| 8.5x | $2,075 |')
  })
})

describe('trust pages', () => {
  const text = (page: TrustPage) =>
    [page.intro, ...page.sections.flatMap((s) => [s.title, s.body, ...(s.bullets ?? [])])].join(' ')

  it('have at least 500 characters of real content', () => {
    expect(text(aboutPage).length).toBeGreaterThanOrEqual(500)
    expect(text(contactPage).length).toBeGreaterThanOrEqual(500)
    expect(text(contactPage)).toContain('heliosxloupes@gmail.com')
  })
})

describe('structured data', () => {
  it('Organization has contactPoint and sameAs profiles', () => {
    const org = organizationJsonLd() as Record<string, any>
    expect(org.contactPoint.email).toBe('heliosxloupes@gmail.com')
    expect(org.contactPoint.contactType).toBeTruthy()
    expect(org.sameAs).toContain('https://www.instagram.com/heliosxloupes/')
    expect(org.sameAs).toContain('https://www.facebook.com/profile.php?id=61594420101254')
  })

  it('catalog lists expose Product nodes with AggregateOffer prices', () => {
    const list = catalogItemListJsonLd([{ name: 'Medusa Loupes', url: '/product/medusa' }]) as any
    const item = list.itemListElement[0].item
    expect(item['@type']).toBe('Product')
    expect(item.offers).toMatchObject({ '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: 1695, highPrice: 2075 })
    expect(item.offers.availability).toBe('https://schema.org/InStock')
  })
})

describe('product page JSON-LD', () => {
  it('has an AggregateOffer with one priced Offer per magnification', () => {
    const data = productJsonLd({
      name: 'Medusa Surgical Loupes', description: 'x', slug: 'medusa', priceLabel: '$1,695-$2,075',
      magnifications: ['3.0x', '4.0x', '5.0x', '6.0x', '8.0x', '8.5x'],
    }) as any
    const node = Array.isArray(data) ? data.find((d: any) => d['@type'] === 'Product') : data['@type'] === 'Product' ? data : (data['@graph'] ?? []).find((d: any) => d['@type'] === 'Product')
    const offers = node.offers
    expect(offers['@type']).toBe('AggregateOffer')
    expect(offers.lowPrice).toBe(1695)
    expect(offers.offers).toHaveLength(6)
    expect(offers.offers[0]).toMatchObject({ '@type': 'Offer', price: 1695, priceCurrency: 'USD', availability: 'https://schema.org/InStock' })
    expect(offers.offers[5].price).toBe(2075)
  })
})

describe('llms.txt', () => {
  it('is a Markdown navigation index under 30,000 characters with when-to-use guidance', async () => {
    const body = await llmsTxt().text()
    expect(body.startsWith('# ')).toBe(true)
    expect(body.length).toBeLessThan(30000)
    expect(body).toContain('## When to use HeliosX')
    expect(body).toMatch(/\[About\]\(https:\/\/heliosxvision\.com\/about\)/)
    expect((body.match(/\]\(https:\/\/heliosxvision\.com/g) ?? []).length).toBeGreaterThan(20)
  })
})
