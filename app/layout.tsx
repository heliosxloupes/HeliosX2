import type { Metadata } from 'next'
import { Syne, Manrope } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import AmbientBackground from '@/components/AmbientBackground'
import AnalyticsScripts, { GTM_ID } from '@/components/AnalyticsScripts'
import Footer from '@/components/Footer/Footer'
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
  // Lenis adds its own `lenis` / `lenis-smooth` classes at runtime — don't
  // hardcode them, or the smooth-scroll CSS stays applied even when Lenis
  // isn't running. See components/SmoothScroll/SmoothScroll.tsx.
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable}`}>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AnalyticsScripts />
        <div className="site-shell">
          <AmbientBackground />
          <div className="site-content">
            <SmoothScroll>
              {children}
              <Footer />
            </SmoothScroll>
          </div>
        </div>
      </body>
    </html>
  )
}
