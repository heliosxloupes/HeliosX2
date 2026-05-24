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

export function articleJsonLd({
  title,
  description,
  path,
  datePublished = '2026-05-23',
}: {
  title: string
  description: string
  path: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: siteName,
    },
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

export function productJsonLd(product: {
  name: string
  description: string
  slug: string
  image?: string
  price?: number
  priceLabel?: string
}) {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl(`/product/${product.slug}`),
  }

  if (typeof product.price === 'number') offer.price = product.price
  if (product.priceLabel) {
    offer.priceSpecification = {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      description: product.priceLabel,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    description: product.description,
    image: absoluteUrl(product.image ?? '/HeliosXNew.png'),
    url: absoluteUrl(`/product/${product.slug}`),
    category: 'Surgical and dental loupes',
    offers: offer,
  }
}
