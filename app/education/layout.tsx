import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Education | Loupe Guides & Research',
  description:
    'Research-backed guides for surgical loupes, dental loupes, prismatic loupes, ergonomic posture, magnification, working distance, and pupillary distance.',
  path: '/education',
  keywords: ['loupe education', 'surgical loupes guide', 'dental loupes guide', 'prismatic loupes'],
})

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children
}
