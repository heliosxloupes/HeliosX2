'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { hreflangFor, localeOfPath } from '@/lib/i18n'

/**
 * Keeps <html lang> in step with the section on client-side navigation.
 * The server HTML for /es and /pt sets it with an inline script in their
 * layouts; the root layout itself always renders lang="en".
 */
export default function LocaleHtmlLang() {
  const pathname = usePathname() ?? '/'
  useEffect(() => {
    document.documentElement.lang = hreflangFor[localeOfPath(pathname)]
  }, [pathname])
  return null
}
