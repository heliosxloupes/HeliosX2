import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Submit your measurements | HeliosX',
  description: 'Customer measurement submission flow for HeliosX loupes.',
  path: '/measurements',
  noIndex: true,
})

export default function MeasurementsTokenLayout({ children }: { children: React.ReactNode }) {
  return children
}
