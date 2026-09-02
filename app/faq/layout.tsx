import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import { buildMetadata, faqJsonLd } from '@/lib/seo'
import { faqSchemaItems } from '@/lib/faq-data'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX FAQ | Measurements, Shipping & Support',
  description:
    'Answers about HeliosX surgical and dental loupes: measurements, prescriptions, magnification, frames, shipping, returns, warranty, and support.',
  path: '/faq',
  keywords: ['HeliosX FAQ', 'loupe FAQ', 'surgical loupes FAQ', 'pupillary distance', 'working distance'],
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd(faqSchemaItems)} />
      {children}
    </>
  )
}
