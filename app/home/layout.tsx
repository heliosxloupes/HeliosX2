import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Loupes | Affordable Ergonomic Surgical and Dental Loupes',
  description:
    'Premium ergonomic prismatic surgical and dental loupes at fair prices. Shop Medusa, Apollo, Galileo, Newton, and Kepler loupes with measurement support.',
  path: '/',
})

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
