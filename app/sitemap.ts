import type { MetadataRoute } from 'next'

import { allSeoLandingPages, educationGuides } from '@/lib/seo-content'
import { siteUrl } from '@/lib/seo'

// Default freshness used for any path that does not have an explicit
// override. Bump this when the broader site/content gets a meaningful
// refresh so crawlers see a real lastmod signal instead of `now`.
const SITE_CONTENT_LAST_MODIFIED = '2026-05-24'

// Per-path overrides for content that changes on its own cadence
// (homepage, product pages, legal docs). Keep dates in ISO format.
const staticPathLastModified: Record<string, string> = {
  '': '2026-05-24',
  '/product': '2026-05-24',
  '/product/medusa': '2026-05-20',
  '/product/apollo': '2026-05-20',
  '/product/galileo': '2026-05-20',
  '/product/newton': '2026-05-20',
  '/product/kepler': '2026-05-20',
  '/education': '2026-05-23',
  '/measurements': '2026-05-20',
  '/faq': '2026-05-23',
  '/shipping': '2026-04-01',
  '/returns': '2026-04-01',
  '/warranty': '2026-04-01',
  '/privacy': '2026-04-01',
  '/terms': '2026-04-01',
  '/research/intraoperative-magnification-who-uses-it.pdf': '2026-05-22',
}

const staticPaths = Object.keys(staticPathLastModified)

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`)
}

function priorityFor(path: string): number {
  if (path === '') return 1
  if (path.startsWith('/product')) return 0.9
  if (path.startsWith('/education')) return 0.8
  return 0.75
}

function changeFrequencyFor(path: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (path === '') return 'weekly'
  if (path.startsWith('/product')) return 'weekly'
  if (path === '/faq' || path === '/education') return 'weekly'
  if (path.startsWith('/education/')) return 'monthly'
  if (
    path === '/shipping' ||
    path === '/returns' ||
    path === '/warranty' ||
    path === '/privacy' ||
    path === '/terms'
  ) {
    return 'yearly'
  }
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: toDate(staticPathLastModified[path]),
      changeFrequency: changeFrequencyFor(path),
      priority: priorityFor(path),
    })
  }

  for (const page of allSeoLandingPages) {
    const path = `/${page.slug}`
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: toDate(SITE_CONTENT_LAST_MODIFIED),
      changeFrequency: changeFrequencyFor(path),
      priority: priorityFor(path),
    })
  }

  for (const guide of educationGuides) {
    const path = `/education/${guide.slug}`
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: toDate(guide.dateModified ?? guide.datePublished ?? SITE_CONTENT_LAST_MODIFIED),
      changeFrequency: changeFrequencyFor(path),
      priority: priorityFor(path),
    })
  }

  return entries
}
