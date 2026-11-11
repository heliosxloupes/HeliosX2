'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { counterpartPath, hreflangFor, localeOfPath, translationsOf, type Locale } from '@/lib/i18n'

/**
 * A small, dismissible offer on English pages for visitors from Spanish- or
 * Portuguese-speaking countries (hx_geo cookie, set by middleware) or with a
 * Spanish/Portuguese browser. Never redirects: Google crawls from the US, and
 * forced redirects would hide pages from it and from visitors who want English.
 * Sits at the top, under the header: the cookie banner owns the bottom edge.
 */

const SPANISH_COUNTRIES = new Set([
  'MX', 'CO', 'AR', 'CL', 'PE', 'EC', 'VE', 'BO', 'UY', 'PY',
  'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'DO', 'CU', 'PR', 'ES',
])
const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT', 'AO', 'MZ'])

const DISMISS_KEY = 'hx_lang_suggest_dismissed'

// Checkout, cart and back-office flows stay uninterrupted.
const SKIP_PREFIXES = ['/checkout', '/cart', '/admin', '/auth', '/api']

const copy: Record<'es' | 'pt', { page: string; site: string; cta: string; close: string }> = {
  es: {
    page: 'Esta página está disponible en español.',
    site: 'HeliosX también está en español.',
    cta: 'Ver en español',
    close: 'Cerrar',
  },
  pt: {
    page: 'Esta página está disponível em português.',
    site: 'A HeliosX também está em português.',
    cta: 'Ver em português',
    close: 'Fechar',
  },
}

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

function preferredLocale(): 'es' | 'pt' | null {
  const country = readCookie('hx_geo').toUpperCase()
  if (SPANISH_COUNTRIES.has(country)) return 'es'
  if (PORTUGUESE_COUNTRIES.has(country)) return 'pt'
  const lang = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('pt')) return 'pt'
  return null
}

export default function LanguageSuggest() {
  const pathname = usePathname() ?? '/'
  const [target, setTarget] = useState<'es' | 'pt' | null>(null)

  useEffect(() => {
    if (localeOfPath(pathname) !== 'en' || SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
      setTarget(null)
      return
    }
    try {
      if (localStorage.getItem(DISMISS_KEY)) return
    } catch {
      // Storage blocked: still offer, just can't remember the dismissal.
    }
    setTarget(preferredLocale())
  }, [pathname])

  if (!target) return null

  const dismiss = () => {
    setTarget(null)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {}
  }

  const text = copy[target]
  const hasPage = Boolean(translationsOf(pathname)?.[target as Locale])

  return (
    <div
      role="region"
      data-tone="dark"
      aria-label={text.cta}
      lang={hreflangFor[target]}
      className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+5rem)] z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/15 bg-[#060a12]/95 py-2.5 pl-4 pr-2 text-sm text-[#e5e7eb] shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur md:inset-x-auto md:right-6"
    >
      <p className="min-w-0 flex-1 leading-5 text-[#e5e7eb]">{hasPage ? text.page : text.site}</p>
      <Link
        href={counterpartPath(pathname, target)}
        hrefLang={hreflangFor[target]}
        onClick={dismiss}
        className="shrink-0 rounded-full bg-[#ffffff] px-3.5 py-2 text-xs font-semibold text-[#030508] transition hover:bg-[#e5e7eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        {text.cta}
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={text.close}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#a3a3a3] transition hover:bg-white/10 hover:text-[#ffffff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
