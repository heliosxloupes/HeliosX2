export type ProductSpecColumn = {
  title: string
  items: string[]
}

export type ProductImage = {
  src: string
  alt: string
  kind?: string
  displayOrder?: number
}

export type CmsProduct = {
  slug: string
  name: string
  shortName: string
  description: string
  cardTagline: string
  cardHighlight: string
  cardBullets: string[]
  highlights: string[]
  magnifications: string[]
  basePrice?: number
  priceLabel?: string
  isAvailable: boolean
  cardImageSrc: string
  cardImageAlt: string
  imagePosition?: string
  displayOrder: number
  specTitle: string
  specDescription: string
  specColumns: ProductSpecColumn[]
  heroImages: ProductImage[]
  specImages: ProductImage[]
}

export type CrmSource = 'contact form' | 'cart' | 'purchase' | 'newsletter' | 'measurement'

export type CartSessionStage = 'cart' | 'checkout'

export type AdminOrderStatus =
  | 'pending_measurements'
  | 'measurements_received'
  | 'in_production'
  | 'shipped'
  | 'cancelled'
  | 'refunded'
