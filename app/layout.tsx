import type { Metadata } from 'next'
import { Syne, Manrope } from 'next/font/google'
import './globals.css'
import './mobile-v2.css'
import './m2.css'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import AmbientBackground from '@/components/AmbientBackground'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import Footer from '@/components/Footer/Footer'
import FooterIntl from '@/components/Footer/FooterIntl'
import LocaleFooter from '@/components/Footer/LocaleFooter'
import LanguageSuggest from '@/components/intl/LanguageSuggest'
import LocaleHtmlLang from '@/components/intl/LocaleHtmlLang'
import ContactProvider from '@/components/Contact/ContactProvider'
import { buildMetadata, siteUrl } from '@/lib/seo'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
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
    hreflang: false,
  }),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(max-width: 767px)', color: '#eef0ec' },
    { media: '(min-width: 768px)', color: '#030508' },
  ],
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
        <AnalyticsScripts />
        <LocaleHtmlLang />
        <ContactProvider>
          <div className="site-shell">
            <AmbientBackground />
            <div className="site-content">
              <SmoothScroll>
                {children}
                <LocaleFooter
                  en={<Footer />}
                  es={<FooterIntl locale="es" />}
                  pt={<FooterIntl locale="pt" />}
                />
              </SmoothScroll>
            </div>
          </div>
          <LanguageSuggest />
        </ContactProvider>
      </body>
    </html>
  )
}
