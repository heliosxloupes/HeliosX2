import type { Metadata } from 'next'

import { getProduct } from '@/lib/commerce'
import { getProductAggregateRating, getProductReviews } from '@/lib/reviews'
import { productPositioning } from '@/lib/seo-content'
import { productFaqs } from '@/lib/product-faqs'
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  organizationJsonLd,
  productJsonLd,
  type ProductSpecInput,
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

// Per-product overall spec ranges, sourced from the master spec sheet.
// Emitted as PropertyValues on the Product schema so Google's product
// knowledge graph picks up working distance, field of view, depth of
// field, and weight alongside magnification.
const productAdditionalSpecs: Record<string, ProductSpecInput[]> = {
  medusa: [
    { name: 'Working distance', value: '300-600', unitCode: 'MMT', unitText: 'mm (adjustable)' },
    { name: 'Field of view', value: '50-80', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Depth of field', value: '40-110', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Weight with frame', value: '56-65', unitCode: 'GRM', unitText: 'g' },
  ],
  apollo: [
    { name: 'Working distance', value: '420, 450, 500, 550', unitCode: 'MMT', unitText: 'mm (selectable)' },
    { name: 'Field of view', value: '50-105', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Net weight with frame', value: '55-58.2', unitCode: 'GRM', unitText: 'g' },
  ],
  newton: [
    { name: 'Working distance', value: '300-550', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Field of view', value: '60-120', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Depth of field', value: '200', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Weight with frame', value: '40-50', unitCode: 'GRM', unitText: 'g' },
  ],
  kepler: [
    { name: 'Working distance', value: '280-600', unitCode: 'MMT', unitText: 'mm (configurable post-purchase)' },
    { name: 'Field of view', value: '50-75', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Depth of field', value: '80', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Weight with frame', value: '68-85', unitCode: 'GRM', unitText: 'g' },
  ],
  galileo: [
    { name: 'Working distance', value: '300-580', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Field of view', value: '110-170', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Depth of field', value: '200', unitCode: 'MMT', unitText: 'mm' },
    { name: 'Weight', value: '35-37', unitCode: 'GRM', unitText: 'g' },
  ],
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

  const faqs = productFaqs[slug] ?? []

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
      additionalSpecs: productAdditionalSpecs[slug],
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Loupes', path: '/product' },
      { name: product.shortName, path: `/product/${slug}` },
    ]),
    ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
    organizationJsonLd(),
  ]
}
