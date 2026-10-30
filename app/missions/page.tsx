import type { Metadata } from 'next'

import TrustPageView from '@/components/TrustPageView'
import { buildMetadata } from '@/lib/seo'
import { missionsPage } from '@/lib/trust-pages'

export const metadata: Metadata = buildMetadata({
  title: missionsPage.metaTitle,
  description: missionsPage.description,
  path: missionsPage.path,
})

export default function MissionsPage() {
  return <TrustPageView page={missionsPage} />
}
