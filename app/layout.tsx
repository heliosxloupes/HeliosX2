import type { Metadata } from 'next'
import { Syne, Manrope } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import AmbientBackground from '@/components/AmbientBackground'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import { buildMetadata, siteUrl } from '@/lib/seo'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: 'HeliosX Loupes | Ergonomic Prismatic Surgical and Dental Loupes',
    description:
      'Affordable premium surgical and dental loupes for surgeons, dentists, residents, hygienists, and medical students. Explore ergonomic prismatic Medusa and Apollo systems.',
    keywords: [
      'surgical loupes',
      'dental loupes',
      'prismatic loupes',
      'ergonomic loupes',
      'affordable loupes',
      'best loupes',
    ],
  }),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`lenis lenis-smooth ${syne.variable} ${manrope.variable}`}>
      <body>
        <AnalyticsScripts />
        <div className="site-shell">
          <AmbientBackground />
          <div className="site-content">
            <SmoothScroll>{children}</SmoothScroll>
          </div>
        </div>
      </body>
    </html>
  )
}
