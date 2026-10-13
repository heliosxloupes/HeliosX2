import type { Metadata } from 'next'

import TrustPageView from '@/components/TrustPageView'
import { buildMetadata } from '@/lib/seo'
import { aboutPage } from '@/lib/trust-pages'

export const metadata: Metadata = buildMetadata({
  title: aboutPage.metaTitle,
  description: aboutPage.description,
  path: aboutPage.path,
})

export default function AboutPage() {
  return <TrustPageView page={aboutPage} />
}
