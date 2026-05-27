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
  /**
   * Explicit OG image URL. Pass `null` to opt into Next.js's
   * file-based opengraph-image.tsx convention (the dynamic OG route
   * generates the image instead). Omit / pass undefined to use the
   * site-wide fallback hero.
   */
  image?: string | null
  keywords?: string[]
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/HeliosX-share.jpg',
  keywords = [],
  noIndex = false,
}: SeoMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = image === null ? null : absoluteUrl(image)

  const openGraph: NonNullable<Metadata['openGraph']> = {
    type: 'website',
    siteName,
    title,
    description,
    url,
  }
  if (imageUrl) {
    openGraph.images = [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${siteName} surgical and dental loupes`,
      },
    ]
  }

  const twitter: NonNullable<Metadata['twitter']> = {
    card: 'summary_large_image',
    title,
    description,
  }
  if (imageUrl) {
    twitter.images = [imageUrl]
  }

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
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
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
    openGraph,
    twitter,
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    metadata.verification = {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }
  }

  return metadata
}

// External profiles for Knowledge-Graph + LLM entity resolution.
// Add real social/profile URLs as they're claimed — empty entries
// are filtered out before serialization so the schema stays clean.
const organizationSameAs: string[] = [
  // 'https://www.instagram.com/heliosxloupes',
  // 'https://www.youtube.com/@heliosxloupes',
  // 'https://www.linkedin.com/company/heliosxloupes',
  // 'https://www.crunchbase.com/organization/heliosx-loupes',
  // 'https://www.wikidata.org/wiki/Q__________',
].filter(Boolean) as string[]

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: siteName,
    legalName: 'HeliosX Loupes',
    alternateName: ['HeliosX', 'HeliosX Loupes'],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logominimalnowriting.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/HeliosX-share.jpg'),
    email: supportEmail,
    sameAs: organizationSameAs,
    description:
      'HeliosX Loupes makes affordable premium ergonomic prismatic surgical and dental loupes for surgeons, dentists, residents, hygienists, and medical students. HeliosX Loupes is a direct-to-clinician medical-device brand and is unrelated to the UK healthtech company also called HeliosX.',
    knowsAbout: [
      'Surgical loupes',
      'Dental loupes',
      'Prismatic loupes',
      'Ergonomic loupes',
      'Pupillary distance measurement',
      'Working distance for loupes',
      'Loupe magnification by specialty',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: supportEmail,
      availableLanguage: ['English'],
      areaServed: ['US', 'CA', 'GB', 'AU', 'IE', 'NZ'],
    },
  }
}

export function websiteJsonLd() {
  // SearchAction intentionally omitted until a real on-site search
  // endpoint exists. Pointing at /faq?search= caused Google to flag a
  // non-functional sitelinks search box during the audit.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en-US',
  }
}

export function webPageJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  isPartOfWebSite = true,
  breadcrumb,
}: {
  title: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
  isPartOfWebSite?: boolean
  breadcrumb?: { name: string; path: string }[]
}) {
  const url = absoluteUrl(path)
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: 'en-US',
    publisher: { '@id': `${siteUrl}/#organization` },
  }
  if (isPartOfWebSite) {
    node.isPartOf = { '@id': `${siteUrl}/#website` }
  }
  if (datePublished) node.datePublished = datePublished
  if (dateModified) node.dateModified = dateModified
  if (breadcrumb && breadcrumb.length > 0) {
    node.breadcrumb = breadcrumbJsonLd(breadcrumb)
  }
  return node
}

export function imageObjectJsonLd({
  name,
  url,
  caption,
  width,
  height,
}: {
  name: string
  url: string
  caption?: string
  width?: number
  height?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    contentUrl: absoluteUrl(url),
    url: absoluteUrl(url),
    creator: {
      '@type': 'Organization',
      name: siteName,
    },
    creditText: siteName,
    copyrightNotice: `© ${new Date().getFullYear()} ${siteName}`,
    license: absoluteUrl('/terms'),
    acquireLicensePage: absoluteUrl('/terms'),
    ...(caption ? { caption } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  }
}

export function videoObjectJsonLd({
  name,
  description,
  url,
  thumbnailUrl,
  contentUrl,
  uploadDate,
  duration,
}: {
  name: string
  description: string
  url: string
  thumbnailUrl: string
  contentUrl: string
  uploadDate: string
  duration?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: absoluteUrl(thumbnailUrl),
    uploadDate,
    contentUrl: absoluteUrl(contentUrl),
    embedUrl: absoluteUrl(url),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logominimalnowriting.png'),
      },
    },
    ...(duration ? { duration } : {}),
  }
}

export function courseJsonLd({
  name,
  description,
  path,
  audienceType,
}: {
  name: string
  description: string
  path: string
  audienceType?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    educationalLevel: 'Professional',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: audienceType ?? 'Surgeons, dentists, residents, and clinical trainees',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT30M',
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

const defaultMedicalAudience = {
  '@type': 'MedicalAudience',
  audienceType:
    'Surgeons, dentists, residents, dental and medical students, hygienists, and allied clinical professionals',
}

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
  author,
  citations,
  inLanguage = 'en-US',
  audience = defaultMedicalAudience,
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  image?: string
  author?: ArticleAuthor
  citations?: { label: string; href: string }[]
  inLanguage?: string
  audience?: Record<string, unknown> | null
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

  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: absoluteUrl(image ?? '/HeliosX-share.jpg'),
    inLanguage,
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

  if (audience) {
    article.audience = audience
  }

  if (citations && citations.length > 0) {
    article.citation = citations.map((citation) => ({
      '@type': 'CreativeWork',
      name: citation.label,
      url: citation.href.startsWith('http') ? citation.href : absoluteUrl(citation.href),
    }))
  }

  return article
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

export type ProductReviewInput = {
  authorName: string
  rating: number
  title: string
  body: string
  datePublished: string
  language?: string
}

export type ProductSpecInput = {
  name: string
  value: string
  unitCode?: string
  unitText?: string
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
  aggregateRating?: { ratingValue: number; reviewCount: number }
  reviews?: ProductReviewInput[]
  additionalSpecs?: ProductSpecInput[]
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

  const additionalProperty: Record<string, unknown>[] = []

  if (product.magnifications && product.magnifications.length > 0) {
    for (const mag of product.magnifications) {
      additionalProperty.push({
        '@type': 'PropertyValue',
        name: 'Magnification',
        value: mag,
      })
    }
  }

  if (product.additionalSpecs && product.additionalSpecs.length > 0) {
    for (const spec of product.additionalSpecs) {
      additionalProperty.push({
        '@type': 'PropertyValue',
        name: spec.name,
        value: spec.value,
        ...(spec.unitCode ? { unitCode: spec.unitCode } : {}),
        ...(spec.unitText ? { unitText: spec.unitText } : {}),
      })
    }
  }

  if (additionalProperty.length > 0) {
    productNode.additionalProperty = additionalProperty
  }

  if (product.aggregateRating && product.aggregateRating.reviewCount > 0) {
    productNode.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (product.reviews && product.reviews.length > 0) {
    productNode.review = product.reviews.map((review) => ({
      '@type': 'Review',
      name: review.title,
      reviewBody: review.body,
      datePublished: review.datePublished,
      ...(review.language ? { inLanguage: review.language } : {}),
      author: {
        '@type': 'Person',
        name: review.authorName,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }))
  }

  return productNode
}

export function medicalWebPageJsonLd({
  title,
  description,
  path,
  audienceType,
}: {
  title: string
  description: string
  path: string
  audienceType?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: 'en-US',
    audience: {
      '@type': 'MedicalAudience',
      audienceType: audienceType ?? defaultMedicalAudience.audienceType,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  }
}

export function howToJsonLd({
  name,
  description,
  path,
  steps,
  totalTime,
  image,
}: {
  name: string
  description: string
  path: string
  steps: { name: string; text: string; image?: string }[]
  totalTime?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: 'en-US',
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: absoluteUrl(step.image) } : {}),
    })),
  }
}

export function itemListJsonLd(
  items: {
    name: string
    url: string
    image?: string
    description?: string
    price?: number
    priceCurrency?: string
    sku?: string
  }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => {
      const itemUrl = absoluteUrl(item.url)
      const product: Record<string, unknown> = {
        '@type': 'Product',
        name: item.name,
        url: itemUrl,
        ...(item.image ? { image: absoluteUrl(item.image) } : {}),
        ...(item.description ? { description: item.description } : {}),
        ...(item.sku ? { sku: item.sku, mpn: item.sku } : {}),
        brand: {
          '@type': 'Brand',
          name: siteName,
        },
      }

      if (typeof item.price === 'number' && Number.isFinite(item.price)) {
        product.offers = {
          '@type': 'Offer',
          url: itemUrl,
          priceCurrency: item.priceCurrency ?? 'USD',
          price: item.price,
          availability: 'https://schema.org/InStock',
          priceValidUntil: oneYearFromTodayISO(),
        }
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        url: itemUrl,
        item: product,
      }
    }),
  }
}
