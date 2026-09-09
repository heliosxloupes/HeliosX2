import type { Metadata } from 'next'

import MobileConceptExperience from '@/components/preview/MobileConceptExperience'

/**
 * Mobile concept preview — NOT a production route.
 *
 * Lives at /preview/mobile so the direction can be reviewed on a real phone
 * without touching the live homepage. Excluded from the sitemap and marked
 * noindex/nofollow so it cannot be crawled or indexed while under review.
 *
 * If approved, the intent is to fold this layout into app/home/page.tsx
 * rather than keep a second homepage.
 */
export const metadata: Metadata = {
  title: 'Mobile Concept Preview | HeliosX',
  description: 'Internal design preview. Not a public page.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function MobileConceptPreviewPage() {
  return <MobileConceptExperience />
}
