import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import SeoLandingExperience from '@/components/seo/SeoLandingExperience'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  catalogItemListJsonLd,
  organizationJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import {
  allSeoLandingPages,
  getSeoLandingPage,
  productImages,
  productPositioning,
  productStartingPrices,
} from '@/lib/seo-content'

type SeoPageProps = {
  params: {
    seoSlug: string
  }
}

export function generateStaticParams() {
  return allSeoLandingPages.map((page) => ({ seoSlug: page.slug }))
}

export function generateMetadata({ params }: SeoPageProps): Metadata {
  const page = getSeoLandingPage(params.seoSlug)
  if (!page) return {}

  return buildMetadata({
    title: page.metaTitle,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [page.primaryKeyword, ...page.relatedKeywords],
    image: productImages[page.recommendedProducts[0] as keyof typeof productImages],
  })
}

// Comparison pages include the comparison hub in their breadcrumb.
// All buying guides use WebPage + Article, matching their editorial content.
const COMPARISON_SLUG_PATTERNS = [
  /^heliosx-vs-/,
  /-alternatives$/,
  /^loupe-comparisons$/,
  /-loupe-comparison$/,
  /-loupe-brands$/,
]

function isComparisonSlug(slug: string): boolean {
  return COMPARISON_SLUG_PATTERNS.some((re) => re.test(slug))
}

export default function SeoLandingPage({ params }: SeoPageProps) {
  const page = getSeoLandingPage(params.seoSlug)
  if (!page) notFound()

  const modelRows = Object.entries(productPositioning).map(([name, positioning]) => ({
    name,
    href: `/product/${name.toLowerCase()}`,
    positioning,
  }))

  const recommendedItems = page.recommendedProducts
    .map((shortName) => {
      const positioning = productPositioning[shortName as keyof typeof productPositioning]
      if (!positioning) return null
      const price =
        productStartingPrices[shortName as keyof typeof productStartingPrices]
      return {
        name: `${shortName} Loupes`,
        url: `/product/${shortName.toLowerCase()}`,
        description: positioning,
        image: productImages[shortName as keyof typeof productImages],
        sku: `heliosx-${shortName.toLowerCase()}`,
        ...(typeof price === 'number' ? { price } : {}),
      }
    })
    .filter(
      (item): item is {
        name: string
        url: string
        description: string
        image: string
        sku: string
        price?: number
      } => item !== null,
    )

  const isComparison = isComparisonSlug(page.slug)
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...(isComparison ? [{ name: 'Comparisons', path: '/loupe-comparisons' }] : []),
    { name: page.title, path: `/${page.slug}` },
  ]
  const datePublished = page.datePublished ?? '2026-05-25'
  const dateModified = page.dateModified ?? '2026-05-25'

  const pageNode = webPageJsonLd({
    title: page.title, description: page.description, path: `/${page.slug}`,
    datePublished, dateModified, breadcrumb: breadcrumbItems,
  })
  const articleNode = articleJsonLd({
    title: page.title, description: page.description, path: `/${page.slug}`,
    image: productImages[page.recommendedProducts[0] as keyof typeof productImages],
    citations: page.sections.filter(section => section.sourceHref).map(section => ({ label: section.sourceLabel ?? section.title, href: section.sourceHref! })),
    datePublished, dateModified,
  })

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          pageNode,
          ...(articleNode ? [articleNode] : []),
          breadcrumbJsonLd(breadcrumbItems),
          faqJsonLd(page.faqs),
          ...(recommendedItems.length > 0 ? [catalogItemListJsonLd(recommendedItems)] : []),
        ]}
      />
      <SeoLandingExperience page={page} modelRows={modelRows} />
    </>
  )
}
