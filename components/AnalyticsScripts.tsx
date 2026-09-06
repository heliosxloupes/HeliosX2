'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { Suspense, useEffect, useRef, useState } from 'react'

const CONSENT_KEY = 'heliosx_analytics_consent'
const CONSENT_EVENT = 'heliosx:open-privacy-choices'
const configuredGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const configuredMetaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1062398469881055'
const gaId = configuredGaId && /^G-[A-Z0-9]+$/i.test(configuredGaId) ? configuredGaId : null
const metaPixelId = /^\d+$/.test(configuredMetaPixelId) ? configuredMetaPixelId : null

type ConsentState = 'loading' | 'unset' | 'granted' | 'denied'

function PageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()
  const isFirstPage = useRef(true)

  useEffect(() => {
    if (!enabled) {
      isFirstPage.current = true
      return
    }

    // The initialization script sends the first page view. This only handles
    // client-side App Router navigations after that initial load.
    if (isFirstPage.current) {
      isFirstPage.current = false
      return
    }

    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
    window.fbq?.('track', 'PageView')
  }, [enabled, pathname])

  return null
}

function revokeTrackingConsent() {
  window.__heliosxAnalyticsConsentGranted = false
  window.__heliosxAnalyticsQueue = []
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.fbq?.('consent', 'revoke')
}

export default function AnalyticsScripts() {
  const [consent, setConsent] = useState<ConsentState>('loading')

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(CONSENT_KEY)
    setConsent(savedConsent === 'granted' ? 'granted' : savedConsent === 'denied' ? 'denied' : 'unset')

    const openPrivacyChoices = () => setConsent('unset')
    window.addEventListener(CONSENT_EVENT, openPrivacyChoices)
    return () => window.removeEventListener(CONSENT_EVENT, openPrivacyChoices)
  }, [])

  const chooseConsent = (choice: 'granted' | 'denied') => {
    window.localStorage.setItem(CONSENT_KEY, choice)
    window.__heliosxAnalyticsConsentGranted = choice === 'granted'

    if (choice === 'denied') {
      revokeTrackingConsent()
    } else {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
      window.fbq?.('consent', 'grant')
    }

    setConsent(choice)
  }

  const initializer = `
    window.__heliosxAnalyticsConsentGranted = true;
    window.dataLayer = window.dataLayer || [];
    ${gaId ? `
      window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
      window.gtag('js', new Date());
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
      window.gtag('config', ${JSON.stringify(gaId)}, { send_page_view: true });
    ` : ''}
    ${metaPixelId ? `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', ${JSON.stringify(metaPixelId)});
      window.fbq('consent', 'grant');
      window.fbq('track', 'PageView');
    ` : ''}
    window.__heliosxAnalyticsReady = true;
    (window.__heliosxAnalyticsQueue || []).splice(0).forEach(function(send){ send(); });
  `

  return (
    <>
      {consent === 'granted' ? (
        <>
          {gaId ? (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
          ) : null}
          <Script id="heliosx-analytics-init" strategy="afterInteractive">
            {initializer}
          </Script>
        </>
      ) : null}

      <Suspense fallback={null}>
        <PageViewTracker enabled={consent === 'granted'} />
      </Suspense>

      {consent === 'unset' ? (
        <section
          role="dialog"
          aria-label="Privacy choices"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-neutral-950/95 p-5 text-white shadow-2xl backdrop-blur-xl md:flex md:items-center md:gap-6"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">Help us measure what works</p>
            <p className="mt-1 text-xs leading-5 text-neutral-300">
              With your permission, HeliosX uses Google Analytics and Meta Pixel to understand site use and measure advertising. Essential site functions always remain available. Read our{' '}
              <Link href="/privacy" className="text-emerald-200 underline underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
          </div>
          <div className="mt-4 flex shrink-0 flex-wrap gap-2 md:mt-0">
            <button
              type="button"
              onClick={() => chooseConsent('denied')}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:border-white/40 hover:text-white"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => chooseConsent('granted')}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-neutral-200"
            >
              Accept analytics
            </button>
          </div>
        </section>
      ) : null}
    </>
  )
}
