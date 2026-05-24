import type { Metadata } from 'next'

import { getProduct } from '@/lib/commerce'
import { productPositioning } from '@/lib/seo-content'
import { buildMetadata, productJsonLd } from '@/lib/seo'

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

  return productJsonLd({
    name: product.name,
    description:
      productPositioning[product.shortName as keyof typeof productPositioning] ?? product.description,
    slug: product.slug,
    image: product.cardImageSrc || product.heroImages[0]?.src,
    price: product.basePrice,
    priceLabel: product.priceLabel,
  })
}
