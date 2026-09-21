import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

const pageTitle = 'HeliosX Education | Loupe Guides & Research'
const pageDescription =
  'Research-backed guides for surgical loupes, dental loupes, prismatic loupes, ergonomic posture, magnification, working distance, and pupillary distance.'

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/education',
  keywords: ['loupe education', 'surgical loupes guide', 'dental loupes guide', 'prismatic loupes'],
})

// Structured data for the hub itself lives in app/education/(hub)/layout.tsx so
// it does not leak onto the twelve guide pages, which emit their own complete
// Article, WebPage and BreadcrumbList nodes.
export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
