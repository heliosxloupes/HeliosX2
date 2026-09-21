import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

const pageTitle = 'HeliosX Loupes | Surgical, Dental & Prismatic'
const pageDescription =
  'Compare HeliosX Medusa, Apollo, Galileo, Newton, and Kepler loupes for surgical, dental, ergonomic, affordable, and high-magnification workflows.'

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/product',
  keywords: ['surgical loupes', 'dental loupes', 'prismatic loupes', 'ergonomic loupes'],
})

// Structured data for the hub itself lives in app/product/(hub)/layout.tsx so
// it does not leak onto the five product detail pages, which emit their own
// complete Product, WebPage and BreadcrumbList nodes.
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
