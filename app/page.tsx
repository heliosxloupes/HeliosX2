import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import { buildMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import HomePage from './home/page'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Loupes | Affordable Ergonomic Surgical and Dental Loupes',
  description:
    'Premium ergonomic prismatic surgical and dental loupes at fair prices. Shop Medusa, Apollo, Galileo, Newton, and Kepler loupes with measurement support.',
  path: '/',
  keywords: [
    'surgical loupes',
    'dental loupes',
    'prismatic loupes',
    'ergonomic loupes',
    'affordable loupes',
    'cheap loupes',
    'best loupes',
  ],
})

export default function RootPage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <HomePage />
    </>
  )
}
