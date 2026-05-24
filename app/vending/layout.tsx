import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Vending | HeliosX',
  description: 'Internal vending utility.',
  path: '/vending',
  noIndex: true,
})

export default function VendingLayout({ children }: { children: React.ReactNode }) {
  return children
}
