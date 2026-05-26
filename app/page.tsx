import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  organizationJsonLd,
  videoObjectJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from '@/lib/seo'
import { productPositioning, productStartingPrices } from '@/lib/seo-content'
import HomePage from './home/page'

const homepageLineup = (Object.keys(productPositioning) as Array<keyof typeof productPositioning>).map(
  (shortName) => ({
    name: `${shortName} Loupes`,
    url: `/product/${shortName.toLowerCase()}`,
    description: productPositioning[shortName],
    sku: `heliosx-${shortName.toLowerCase()}`,
    price: productStartingPrices[shortName],
  }),
)

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Loupes | Ergonomic Surgical & Dental Loupes',
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
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(),
          webPageJsonLd({
            title: 'HeliosX Loupes | Ergonomic Surgical & Dental Loupes',
            description:
              'Premium ergonomic prismatic surgical and dental loupes at fair prices. HeliosX Loupes is a direct-to-clinician medical-device brand — not to be confused with the UK healthtech company also called HeliosX.',
            path: '/',
            datePublished: '2026-05-24',
            dateModified: '2026-05-25',
          }),
          breadcrumbJsonLd([{ name: 'Home', path: '/' }]),
          itemListJsonLd(homepageLineup),
          videoObjectJsonLd({
            name: 'HeliosX Loupes brand film',
            description:
              'Surgical precision, finally accessible. The HeliosX brand film introducing ergonomic prismatic loupes for surgeons, dentists, residents, hygienists, and medical students.',
            url: '/',
            thumbnailUrl: '/mainpagevideo2-poster.jpg',
            contentUrl: '/mainpagevideo2.mp4',
            uploadDate: '2026-05-24',
          }),
        ]}
      />
      <HomePage />
    </>
  )
}
