'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { localeOfPath } from '@/lib/i18n'

/**
 * The root layout renders one footer for every page. This picks the
 * Spanish or Portuguese footer under /es and /pt, so the single root layout
 * (and static rendering) stays as it is. Pages are pre-rendered with their
 * path, so the right footer is in the server HTML.
 */
export default function LocaleFooter({ en, es, pt }: { en: ReactNode; es: ReactNode; pt: ReactNode }) {
  const locale = localeOfPath(usePathname() ?? '/')
  if (locale === 'es') return <>{es}</>
  if (locale === 'pt') return <>{pt}</>
  return <>{en}</>
}
