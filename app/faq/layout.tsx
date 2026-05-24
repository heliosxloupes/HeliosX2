import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX FAQ | Loupe Measurements, Shipping, Prescription, and Support',
  description:
    'Answers about HeliosX surgical and dental loupes: measurements, prescriptions, magnification, frames, shipping, returns, warranty, and support.',
  path: '/faq',
  keywords: ['HeliosX FAQ', 'loupe FAQ', 'surgical loupes FAQ', 'pupillary distance', 'working distance'],
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
