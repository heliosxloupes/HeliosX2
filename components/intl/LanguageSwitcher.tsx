'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { counterpartPath, hreflangFor, localeName, localeOfPath, locales } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * English · Español · Português. Each link goes to the same page in that
 * language when it exists (lib/i18n.ts), otherwise to that language's home.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/'
  const current = localeOfPath(pathname)

  return (
    <nav aria-label="Language / Idioma" className={cn('flex flex-wrap items-center gap-1 text-xs', className)}>
      {locales.map((locale) => {
        const active = locale === current
        return (
          <Link
            key={locale}
            href={counterpartPath(pathname, locale)}
            hrefLang={hreflangFor[locale]}
            lang={hreflangFor[locale]}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
              active
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:bg-white/[0.06] hover:text-white',
            )}
          >
            {localeName[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
