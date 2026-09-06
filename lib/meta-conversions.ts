import { createHash } from 'crypto'
import type Stripe from 'stripe'

type StoredOrderItem = {
  name?: string
  quantity?: number | null
  amountTotal?: number | null
  productMetadata?: {
    productSlug?: string
  }
}

type MetaPurchaseInput = {
  session: Stripe.Checkout.Session
  orderId: string
  items: StoredOrderItem[]
}

function sha256(value: string | null | undefined) {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) return null
  return createHash('sha256').update(normalized).digest('hex')
}

function hashedPhone(value: string | null | undefined) {
  const normalized = String(value ?? '').replace(/\D/g, '')
  return normalized ? createHash('sha256').update(normalized).digest('hex') : null
}

function splitName(value: string | null | undefined) {
  const parts = String(value ?? '').trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
  }
}

export async function sendMetaPurchase({ session, orderId, items }: MetaPurchaseInput) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1802043734283628'
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN

  if (!accessToken) return { sent: false, reason: 'meta_token_not_configured' }
  if (session.metadata?.analyticsConsent !== 'granted') {
    return { sent: false, reason: 'analytics_consent_not_granted' }
  }

  const email =
    session.customer_details?.email ?? session.customer_email ?? session.metadata?.customerEmail
  const phone = session.customer_details?.phone
  const address = session.customer_details?.address
  const { firstName, lastName } = splitName(session.customer_details?.name)

  const userData: Record<string, unknown> = {}
  const hashedEmail = sha256(email)
  const phoneHash = hashedPhone(phone)
  const firstNameHash = sha256(firstName)
  const lastNameHash = sha256(lastName)
  const cityHash = sha256(address?.city)
  const stateHash = sha256(address?.state)
  const postalCodeHash = sha256(address?.postal_code?.replace(/\s/g, ''))
  const countryHash = sha256(address?.country)

  if (hashedEmail) userData.em = [hashedEmail]
  if (phoneHash) userData.ph = [phoneHash]
  if (firstNameHash) userData.fn = [firstNameHash]
  if (lastNameHash) userData.ln = [lastNameHash]
  if (cityHash) userData.ct = [cityHash]
  if (stateHash) userData.st = [stateHash]
  if (postalCodeHash) userData.zp = [postalCodeHash]
  if (countryHash) userData.country = [countryHash]
  if (session.metadata?.clientIp) userData.client_ip_address = session.metadata.clientIp
  if (session.metadata?.clientUserAgent) {
    userData.client_user_agent = session.metadata.clientUserAgent
  }
  if (session.metadata?.fbp) userData.fbp = session.metadata.fbp
  if (session.metadata?.fbc) userData.fbc = session.metadata.fbc

  const contents = items.map((item) => {
    const quantity = item.quantity ?? 1
    return {
      id: item.productMetadata?.productSlug || item.name || 'heliosx-item',
      quantity,
      item_price: item.amountTotal ? item.amountTotal / quantity / 100 : undefined,
    }
  })

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: orderId,
        action_source: 'website',
        event_source_url: `https://heliosxvision.com/checkout/success?session_id=${encodeURIComponent(session.id)}`,
        user_data: userData,
        custom_data: {
          currency: String(session.currency ?? 'usd').toUpperCase(),
          value: (session.amount_total ?? 0) / 100,
          content_type: 'product',
          content_ids: contents.map((item) => item.id),
          contents,
          num_items: contents.reduce((total, item) => total + item.quantity, 0),
        },
      },
    ],
  }

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: accessToken }),
      signal: AbortSignal.timeout(8000),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('Meta Conversions API rejected Purchase event', {
        status: response.status,
        code: result?.error?.code,
        type: result?.error?.type,
      })
      return { sent: false, reason: 'meta_api_rejected', status: response.status }
    }

    return { sent: true, eventsReceived: result?.events_received ?? null }
  } catch (error: any) {
    console.error('Meta Conversions API request failed', { message: error?.message })
    return { sent: false, reason: 'meta_api_request_failed' }
  }
}
