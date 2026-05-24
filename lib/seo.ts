import type { Metadata } from 'next'

export const siteUrl = 'https://heliosxloupes.com'
export const siteName = 'HeliosX Loupes'
export const supportEmail = 'heliosxloupes@gmail.com'

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

type SeoMetadataInput = {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/Homepage1NEW.jpg',
  keywords = [],
  noIndex = false,
}: SeoMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} surgical and dental loupes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    metadata.verification = {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }
  }

  return metadata
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl('/logominimalnowriting.png'),
    email: supportEmail,
    sameAs: [siteUrl],
    description:
      'HeliosX Loupes makes affordable premium ergonomic prismatic surgical and dental loupes for surgeons, dentists, residents, hygienists, and medical students.',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/faq?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

type ArticleAuthor =
  | { name: string; type?: 'Person' | 'Organization'; jobTitle?: string; url?: string }
  | undefined

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
  author,
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  image?: string
  author?: ArticleAuthor
}) {
  const resolvedAuthor =
    author && author.name
      ? {
          '@type': author.type ?? 'Person',
          name: author.name,
          ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
          ...(author.url ? { url: author.url } : {}),
        }
      : { '@type': 'Organization', name: siteName }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: absoluteUrl(image ?? '/Homepage1NEW.jpg'),
    author: resolvedAuthor,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logominimalnowriting.png'),
      },
    },
  }
}

function parsePriceLabelRange(priceLabel?: string): { low?: number; high?: number } {
  if (!priceLabel) return {}
  const numbers = priceLabel.replace(/[, ]/g, '').match(/\d+(?:\.\d+)?/g)
  if (!numbers || numbers.length === 0) return {}
  const values = numbers.map(Number).filter((value) => Number.isFinite(value))
  if (values.length === 0) return {}
  if (values.length === 1) return { low: values[0] }
  return { low: Math.min(...values), high: Math.max(...values) }
}

function oneYearFromTodayISO(): string {
  const now = new Date()
  const future = new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth(), now.getUTCDate()))
  return future.toISOString().slice(0, 10)
}

const defaultMerchantReturnPolicy = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: ['US', 'CA', 'GB', 'AU', 'IE', 'NZ'],
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
}

const defaultShippingDetails = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0',
    currency: 'USD',
  },
  shippingDestination: [
    {
      '@type': 'DefinedRegion',
      addressCountry: 'US',
    },
    {
      '@type': 'DefinedRegion',
      addressCountry: 'CA',
    },
  ],
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 3,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 3,
      maxValue: 10,
      unitCode: 'DAY',
    },
  },
}

export function productJsonLd(product: {
  name: string
  description: string
  slug: string
  image?: string
  price?: number
  priceLabel?: string
  magnifications?: string[]
  audience?: string
}) {
  const productUrl = absoluteUrl(`/product/${product.slug}`)
  const sku = `heliosx-${product.slug}`
  const priceValidUntil = oneYearFromTodayISO()
  const { low: parsedLow, high: parsedHigh } = parsePriceLabelRange(product.priceLabel)
  const offerCount = product.magnifications?.length ?? 0

  const lowPrice = parsedLow ?? product.price
  const highPrice = parsedHigh ?? product.price

  let offers: Record<string, unknown>

  if (
    typeof lowPrice === 'number' &&
    typeof highPrice === 'number' &&
    highPrice > lowPrice &&
    offerCount > 1
  ) {
    offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice,
      highPrice,
      offerCount,
      availability: 'https://schema.org/InStock',
      url: productUrl,
      priceValidUntil,
      hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
      shippingDetails: defaultShippingDetails,
    }
  } else {
    offers = {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      priceValidUntil,
      hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
      shippingDetails: defaultShippingDetails,
    }
    if (typeof lowPrice === 'number') offers.price = lowPrice
  }

  const productNode: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku,
    mpn: sku,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    description: product.description,
    image: absoluteUrl(product.image ?? '/HeliosXNew.png'),
    url: productUrl,
    category: 'Surgical and dental loupes',
    offers,
  }

  if (product.audience) {
    productNode.audience = {
      '@type': 'MedicalAudience',
      audienceType: product.audience,
    }
  }

  if (product.magnifications && product.magnifications.length > 0) {
    productNode.additionalProperty = product.magnifications.map((mag) => ({
      '@type': 'PropertyValue',
      name: 'Magnification',
      value: mag,
    }))
  }

  return productNode
}

export function itemListJsonLd(items: { name: string; url: string; image?: string; description?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(item.url),
      item: {
        '@type': 'Product',
        name: item.name,
        url: absoluteUrl(item.url),
        ...(item.image ? { image: absoluteUrl(item.image) } : {}),
        ...(item.description ? { description: item.description } : {}),
        brand: {
          '@type': 'Brand',
          name: siteName,
        },
      },
    })),
  }
}
