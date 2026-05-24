import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import SeoLandingExperience from '@/components/seo/SeoLandingExperience'
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  itemListJsonLd,
  organizationJsonLd,
} from '@/lib/seo'
import { allSeoLandingPages, getSeoLandingPage, productPositioning } from '@/lib/seo-content'

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
  })
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
      return {
        name: `${shortName} Loupes`,
        url: `/product/${shortName.toLowerCase()}`,
        description: positioning,
      }
    })
    .filter((item): item is { name: string; url: string; description: string } => item !== null)

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.title, path: `/${page.slug}` },
          ]),
          faqJsonLd(page.faqs),
          ...(recommendedItems.length > 0 ? [itemListJsonLd(recommendedItems)] : []),
        ]}
      />
      <SeoLandingExperience page={page} modelRows={modelRows} />
    </>
  )
}
