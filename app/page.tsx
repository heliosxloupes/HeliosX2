import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  organizationJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
} from '@/lib/seo'
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
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(),
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
