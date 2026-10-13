import type { Metadata } from 'next'

import TrustPageView from '@/components/TrustPageView'
import { buildMetadata } from '@/lib/seo'
import { contactPage } from '@/lib/trust-pages'

export const metadata: Metadata = buildMetadata({
  title: contactPage.metaTitle,
  description: contactPage.description,
  path: contactPage.path,
})

export default function ContactPage() {
  return <TrustPageView page={contactPage} />
}
