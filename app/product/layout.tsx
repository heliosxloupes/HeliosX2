import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Loupes | Surgical, Dental & Prismatic',
  description:
    'Compare HeliosX Medusa, Apollo, Galileo, Newton, and Kepler loupes for surgical, dental, ergonomic, affordable, and high-magnification workflows.',
  path: '/product',
  keywords: ['surgical loupes', 'dental loupes', 'prismatic loupes', 'ergonomic loupes'],
})

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
