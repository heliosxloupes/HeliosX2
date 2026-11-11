import Image from 'next/image'
import Link from 'next/link'

import CookiePreferencesButton from '@/components/CookiePreferencesButton'
import CopyEmail from '@/components/Contact/CopyEmail'
import LanguageSwitcher from '@/components/intl/LanguageSwitcher'
import { localeHome } from '@/lib/i18n'
import { ui, type IntlLocale } from '@/lib/intl/pages'

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[13px] leading-5 text-neutral-400 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Footer for /es and /pt. Same look as the English footer, shorter. */
export default function FooterIntl({ locale }: { locale: IntlLocale }) {
  const t = ui[locale]
  return (
    <footer data-tone="dark" lang={locale === 'es' ? 'es' : 'pt-BR'} className="relative overflow-hidden border-t border-white/10 bg-[#030508] text-neutral-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(23,176,143,0.13),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-12 md:px-12 md:pt-16">
        <div className="grid gap-12 pb-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href={localeHome[locale]} className="inline-flex items-center gap-3" aria-label="HeliosX">
              <Image
                src="/logominimalnowriting.png"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 object-contain brightness-0 invert"
              />
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">HELIOSX</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-6 text-neutral-400">{t.footerMission}</p>
            <CopyEmail
              className="mt-6 text-xs text-emerald-200"
              buttonClassName="border border-emerald-200/25 text-emerald-200 hover:border-emerald-200/60 hover:text-white"
            />
            <p className="mt-2 text-[11px] text-neutral-500">{t.footerReply}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            <Column title={t.footerLinksTitle} links={t.footerLocalLinks} />
            <Column title={t.footerEnglishTitle} links={t.footerEnglishLinks} />
            <Column title="HeliosX" links={t.footerPolicies} />
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} HeliosX Loupes. {t.footerTagline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <LanguageSwitcher />
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  )
}
