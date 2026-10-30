import type { Metadata } from 'next'

import TrustPageView from '@/components/TrustPageView'
import { buildMetadata } from '@/lib/seo'
import { institutionsPage } from '@/lib/trust-pages'

export const metadata: Metadata = buildMetadata({
  title: institutionsPage.metaTitle,
  description: institutionsPage.description,
  path: institutionsPage.path,
})

export default function InstitutionsPage() {
  return <TrustPageView page={institutionsPage} />
}
