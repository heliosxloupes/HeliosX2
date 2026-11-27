import type Stripe from 'stripe'

/**
 * Server copy of the GA4 `purchase` event, sent from the Stripe webhook through
 * the GA4 Measurement Protocol. The browser event on /checkout/success is lost
 * when an ad blocker or a closed tab stops it; this one is not. Both use the
 * order id as transaction_id, so GA4 counts the purchase once.
 *
 * Needs GA4_API_SECRET (GA4 Admin → Data streams → web stream → Measurement
 * Protocol API secrets) and NEXT_PUBLIC_GA_MEASUREMENT_ID. Without them it does
 * nothing. A visitor who declined analytics is never sent.
 */
type OrderItem = {
  description?: string | null
  quantity?: number | null
  amountTotal?: number | null
  productMetadata?: Record<string, string> | null
}

/** "GA1.1.123456789.1700000000" (the _ga cookie) → "123456789.1700000000". */
export function gaClientIdFromCookie(value: string | undefined | null): string {
  const parts = String(value ?? '').split('.')
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ''
}

/** Session id from the _ga_<stream> cookie: "GS1.1.1700000000.3..." or "GS2.1.s1700000000$o3...". */
export function gaSessionIdFromCookies(cookies: Record<string, string>): string {
  const value = Object.entries(cookies).find(([name]) => name.startsWith('_ga_'))?.[1] ?? ''
  if (value.startsWith('GS1.')) return value.split('.')[2] ?? ''
  return value.match(/^GS2\.\d+\.s(\d+)/)?.[1] ?? ''
}

export async function sendGa4Purchase({
  session,
  orderId,
  items,
}: {
  session: Stripe.Checkout.Session
  orderId: string
  items: OrderItem[]
}) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) return { sent: false, reason: 'ga4_not_configured' }
  if (session.metadata?.analyticsConsent === 'denied') {
    return { sent: false, reason: 'analytics_consent_denied' }
  }

  // Keep the shopper's GA client id when we have it, so the sale is tied to
  // their visit and traffic source; otherwise a stable id per order.
  const clientId = session.metadata?.gaClientId || `${Date.now()}.${orderId.replace(/\D/g, '').slice(-9) || '1'}`
  const currency = String(session.currency ?? 'usd').toUpperCase()

  const body = {
    client_id: clientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: orderId,
          value: (session.amount_total ?? 0) / 100,
          currency,
          shipping: 0,
          ...(session.metadata?.gaSessionId ? { session_id: session.metadata.gaSessionId } : {}),
          engagement_time_msec: 1,
          items: items.map((item) => ({
            item_id: item.productMetadata?.productSlug ?? item.description ?? 'heliosx-item',
            item_name: item.description ?? 'HeliosX item',
            item_variant: item.productMetadata?.magnification,
            quantity: item.quantity ?? 1,
            price: item.quantity ? (item.amountTotal ?? 0) / 100 / item.quantity : (item.amountTotal ?? 0) / 100,
          })),
        },
      },
    ],
  }

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      { method: 'POST', body: JSON.stringify(body) },
    )
    return { sent: response.ok, status: response.status }
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : 'ga4_request_failed' }
  }
}
