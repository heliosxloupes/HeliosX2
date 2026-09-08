import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  organizationJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import { educationGuides } from '@/lib/seo-content'

const pageTitle = 'HeliosX Education | Loupe Guides & Research'
const pageDescription =
  'Research-backed guides for surgical loupes, dental loupes, prismatic loupes, ergonomic posture, magnification, working distance, and pupillary distance.'

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/education',
  keywords: ['loupe education', 'surgical loupes guide', 'dental loupes guide', 'prismatic loupes'],
})

// Added after the 8 Sep 2026 audit found this hub carrying no structured data.
// CollectionPage plus an ItemList of the guides it indexes.
const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Education', path: '/education' },
]

const guideItems = educationGuides.map((guide) => ({
  name: guide.title,
  url: `/education/${guide.slug}`,
  description: guide.description,
}))

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          {
            ...webPageJsonLd({
              title: pageTitle,
              description: pageDescription,
              path: '/education',
              breadcrumb: breadcrumbItems,
            }),
            '@type': 'CollectionPage',
          },
          breadcrumbJsonLd(breadcrumbItems),
          itemListJsonLd(guideItems),
        ]}
      />
      {children}
    </>
  )
}
