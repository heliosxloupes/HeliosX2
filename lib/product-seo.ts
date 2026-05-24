import type { Metadata } from 'next'

import { getProduct } from '@/lib/commerce'
import { getProductAggregateRating, getProductReviews } from '@/lib/reviews'
import { productPositioning } from '@/lib/seo-content'
import {
  breadcrumbJsonLd,
  buildMetadata,
  organizationJsonLd,
  productJsonLd,
} from '@/lib/seo'

const productKeywords: Record<string, string[]> = {
  medusa: [
    'Medusa loupes',
    'ergonomic prismatic loupes',
    'adjustable working distance loupes',
    'surgical loupes',
  ],
  apollo: ['Apollo loupes', 'ergonomic prismatic loupes', 'surgical loupes', 'dental loupes'],
  galileo: ['Galileo loupes', 'affordable surgical loupes', 'dental loupes', 'student loupes'],
  newton: ['Newton loupes', 'lightweight loupes', 'affordable loupes', 'dental loupes'],
  kepler: ['Kepler loupes', 'high magnification loupes', 'microsurgery loupes', 'surgical loupes'],
}

const productAudience: Record<string, string> = {
  medusa: 'Surgeons and clinicians',
  apollo: 'Surgeons, dentists, and detail-oriented clinicians',
  galileo: 'Dental students, medical students, residents, and hygienists',
  newton: 'Hygienists, dental students, and daily-use clinicians',
  kepler: 'Microsurgery and high-magnification surgical specialists',
}

export async function getProductMetadata(slug: string): Promise<Metadata> {
  const product = await getProduct(slug)
  if (!product) return {}

  const positioning =
    productPositioning[product.shortName as keyof typeof productPositioning] ?? product.description

  return buildMetadata({
    title: `${product.name} | HeliosX ${product.shortName} Loupes`,
    description: positioning,
    path: `/product/${slug}`,
    image: product.cardImageSrc || product.heroImages[0]?.src || '/HeliosXNew.png',
    keywords: productKeywords[slug] ?? ['surgical loupes', 'dental loupes'],
  })
}

export async function getProductJsonLd(slug: string) {
  const product = await getProduct(slug)
  if (!product) return null

  const description =
    productPositioning[product.shortName as keyof typeof productPositioning] ?? product.description

  const aggregateRating = getProductAggregateRating(slug) ?? undefined
  const reviewList = getProductReviews(slug).map((review) => ({
    authorName: review.authorName,
    rating: review.rating,
    title: review.title,
    body: review.body,
    datePublished: review.datePublished,
    language: review.language,
  }))

  return [
    productJsonLd({
      name: product.name,
      description,
      slug: product.slug,
      image: product.cardImageSrc || product.heroImages[0]?.src,
      price: product.basePrice,
      priceLabel: product.priceLabel,
      magnifications: product.magnifications,
      audience: productAudience[slug],
      aggregateRating,
      reviews: reviewList,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Loupes', path: '/product' },
      { name: product.shortName, path: `/product/${slug}` },
    ]),
    organizationJsonLd(),
  ]
}
