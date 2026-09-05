import Script from 'next/script'

// GA4 loads directly via gtag. There is deliberately no Google Tag Manager
// container here: GTM-MNWZLL2T shipped ~435 KB per page (the container plus
// the placeholder tags G-XXXXXXXXXX and AW-AW-XXXXXXXXX it fired) and served
// no working tag. If GTM is ever reintroduced, configure real tags first.
export default function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!gaId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="heliosx-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
