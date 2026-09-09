import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  buildMetadata,
  catalogItemListJsonLd,
  organizationJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import { productImages, productPositioning, productStartingPrices } from '@/lib/seo-content'

const pageTitle = 'HeliosX Loupes | Surgical, Dental & Prismatic'
const pageDescription =
  'Compare HeliosX Medusa, Apollo, Galileo, Newton, and Kepler loupes for surgical, dental, ergonomic, affordable, and high-magnification workflows.'

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/product',
  keywords: ['surgical loupes', 'dental loupes', 'prismatic loupes', 'ergonomic loupes'],
})

// This hub carried no structured data at all before the 8 Sep 2026 audit,
// despite being the category page for the entire lineup. CollectionPage plus
// an ItemList of the five models tells Google what the page collects.
const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Loupes', path: '/product' },
]

const modelItems = Object.entries(productPositioning).map(([name, positioning]) => {
  const price = productStartingPrices[name as keyof typeof productStartingPrices]
  return {
    name: `${name} Surgical Loupes`,
    url: `/product/${name.toLowerCase()}`,
    description: positioning,
    image: productImages[name as keyof typeof productImages],
    sku: `heliosx-${name.toLowerCase()}`,
    ...(typeof price === 'number' ? { price } : {}),
  }
})

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          {
            ...webPageJsonLd({
              title: pageTitle,
              description: pageDescription,
              path: '/product',
              breadcrumb: breadcrumbItems,
            }),
            '@type': 'CollectionPage',
          },
          breadcrumbJsonLd(breadcrumbItems),
          catalogItemListJsonLd(modelItems),
        ]}
      />
      {children}
    </>
  )
}
