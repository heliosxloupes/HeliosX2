import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import SeoLandingExperience from '@/components/seo/SeoLandingExperience'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  itemListJsonLd,
  medicalWebPageJsonLd,
  organizationJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import {
  allSeoLandingPages,
  getSeoLandingPage,
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
    image: null,
  })
}

// Comparison-cluster slugs use commercial-investigation intent, so they
// schema as plain WebPage + Article instead of MedicalWebPage (which
// implies clinical/diagnostic content and risks Google demoting these
// pages for the wrong intent).
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
        sku: `heliosx-${shortName.toLowerCase()}`,
        ...(typeof price === 'number' ? { price } : {}),
      }
    })
    .filter(
      (item): item is {
        name: string
        url: string
        description: string
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

  const pageNode = isComparison
    ? webPageJsonLd({
        title: page.title,
        description: page.description,
        path: `/${page.slug}`,
        datePublished,
        dateModified,
        breadcrumb: breadcrumbItems,
      })
    : medicalWebPageJsonLd({
        title: page.title,
        description: page.description,
        path: `/${page.slug}`,
        audienceType: page.audience,
      })

  const articleNode = isComparison
    ? articleJsonLd({
        title: page.title,
        description: page.description,
        path: `/${page.slug}`,
        datePublished,
        dateModified,
      })
    : null

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          pageNode,
          ...(articleNode ? [articleNode] : []),
          breadcrumbJsonLd(breadcrumbItems),
          faqJsonLd(page.faqs),
          ...(recommendedItems.length > 0 ? [itemListJsonLd(recommendedItems)] : []),
        ]}
      />
      <SeoLandingExperience page={page} modelRows={modelRows} />
    </>
  )
}
