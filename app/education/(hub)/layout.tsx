import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  resourceItemListJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import { educationGuides } from '@/lib/seo-content'

// Added after the 8 Sep 2026 audit found this hub carrying no structured data.
// CollectionPage plus an ItemList of the guides it indexes.
//
// Scoped to a (hub) route group so it applies to /education alone. The shared
// layout also wrapped the twelve /education/[slug] guides, which meant each
// guide shipped a CollectionPage claiming to be /education, a duplicate
// Organization node, and a breadcrumb that contradicted its own.
const pageTitle = 'HeliosX Education | Loupe Guides & Research'
const pageDescription =
  'Research-backed guides for surgical loupes, dental loupes, prismatic loupes, ergonomic posture, magnification, working distance, and pupillary distance.'

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Education', path: '/education' },
]

const guideItems = educationGuides.map((guide) => ({
  name: guide.title,
  url: `/education/${guide.slug}`,
  description: guide.description,
}))

export default function EducationHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          {
            // No `breadcrumb` passed to webPageJsonLd: it nests a full
            // BreadcrumbList inside WebPage.breadcrumb, and breadcrumbJsonLd()
            // below emits the same list as a top-level node.
            ...webPageJsonLd({
              title: pageTitle,
              description: pageDescription,
              path: '/education',
            }),
            '@type': 'CollectionPage',
          },
          breadcrumbJsonLd(breadcrumbItems),
          resourceItemListJsonLd(guideItems),
        ]}
      />
      {children}
    </>
  )
}
