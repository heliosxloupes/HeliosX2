import type { MetadataRoute } from 'next'

import { allSeoLandingPages, educationGuides } from '@/lib/seo-content'
import { siteUrl } from '@/lib/seo'

const staticPaths = [
  '',
  '/product',
  '/product/medusa',
  '/product/apollo',
  '/product/galileo',
  '/product/newton',
  '/product/kepler',
  '/education',
  '/measurements',
  '/faq',
  '/shipping',
  '/returns',
  '/warranty',
  '/privacy',
  '/terms',
  '/research/intraoperative-magnification-who-uses-it.pdf',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries = [
    ...staticPaths,
    ...allSeoLandingPages.map((page) => `/${page.slug}`),
    ...educationGuides.map((guide) => `/education/${guide.slug}`),
  ]

  return entries.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/product') ? 0.9 : 0.75,
  }))
}
