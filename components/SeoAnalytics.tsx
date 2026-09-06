'use client'

import { useEffect } from 'react'
import { trackCustomEvent } from '@/lib/analytics'

type SeoAnalyticsProps = {
  pageType: string
  pageName: string
}

export default function SeoAnalytics({ pageType, pageName }: SeoAnalyticsProps) {
  useEffect(() => {
    const pagePath = window.location.pathname
    trackCustomEvent('seo_page_view', {
      page_type: pageType,
      page_name: pageName,
      page_path: pagePath,
    })

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest('a[data-seo-event]') as HTMLAnchorElement | null
      if (!link) return

      trackCustomEvent('seo_cta_click', {
        page_type: pageType,
        page_name: pageName,
        page_path: pagePath,
        cta: link.dataset.seoEvent,
        link_url: link.href,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pageName, pageType])

  return null
}
