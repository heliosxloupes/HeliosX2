import type { CmsProduct } from './ecommerce-types'
import type { ProductPageConfig } from '@/app/product/ProductPageTemplate'

export function cmsProductToProductPageConfig(product: CmsProduct): ProductPageConfig {
  return {
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    description: product.description,
    highlights: product.highlights,
    heroImages: product.heroImages.map((image) => image.src),
    magnifications: product.magnifications,
    basePrice: product.basePrice,
    priceLabel: product.priceLabel,
    isAvailable: product.isAvailable,
    specTitle: product.specTitle,
    specDescription: product.specDescription,
    specColumns: product.specColumns,
    specImages: product.specImages.map((image) => ({
      src: image.src,
      alt: image.alt,
    })),
  }
}
