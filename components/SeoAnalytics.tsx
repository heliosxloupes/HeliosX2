'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

type SeoAnalyticsProps = {
  pageType: string
  pageName: string
}

export default function SeoAnalytics({ pageType, pageName }: SeoAnalyticsProps) {
  useEffect(() => {
    const pagePath = window.location.pathname
    const eventPayload = {
      event: 'seo_page_view',
      page_type: pageType,
      page_name: pageName,
      page_path: pagePath,
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(eventPayload)
    window.gtag?.('event', 'seo_page_view', {
      page_type: pageType,
      page_name: pageName,
      page_path: pagePath,
    })

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest('a[data-seo-event]') as HTMLAnchorElement | null
      if (!link) return

      const clickPayload = {
        event: 'seo_cta_click',
        page_type: pageType,
        page_name: pageName,
        page_path: pagePath,
        cta: link.dataset.seoEvent,
        href: link.href,
      }
      window.dataLayer?.push(clickPayload)
      window.gtag?.('event', 'seo_cta_click', {
        page_type: pageType,
        page_name: pageName,
        cta: link.dataset.seoEvent,
        link_url: link.href,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pageName, pageType])

  return null
}
