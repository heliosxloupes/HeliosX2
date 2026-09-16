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

type ServerEventInput = {
  eventName: 'Lead' | 'InitiateCheckout' | 'AddToCart' | 'ViewContent'
  /** Must match the eventID the browser pixel sent, so Meta de-duplicates the pair. */
  eventId: string
  eventSourceUrl?: string
  analyticsConsent?: string | null
  email?: string | null
  phone?: string | null
  fbp?: string | null
  fbc?: string | null
  clientIp?: string | null
  clientUserAgent?: string | null
  custom?: Record<string, unknown>
}

/**
 * Server copy of a browser pixel event. Ad blockers and iOS drop a large share of
 * browser events; the server copy is what Meta actually optimises delivery on.
 */
export async function sendMetaEvent(input: ServerEventInput) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1802043734283628'
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN

  if (!accessToken) return { sent: false, reason: 'meta_token_not_configured' }
  if (input.analyticsConsent && input.analyticsConsent !== 'granted') {
    return { sent: false, reason: 'analytics_consent_not_granted' }
  }

  const userData: Record<string, unknown> = {}
  const emailHash = sha256(input.email)
  const phoneHash = hashedPhone(input.phone)
  if (emailHash) userData.em = [emailHash]
  if (phoneHash) userData.ph = [phoneHash]
  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  if (input.clientIp) userData.client_ip_address = input.clientIp
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: input.custom ?? {},
      },
    ],
  }
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE

  try {
    const response = await fetch(`https://graph.facebook.com/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: accessToken }),
      signal: AbortSignal.timeout(8000),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      console.error(`Meta Conversions API rejected ${input.eventName}`, {
        status: response.status,
        code: result?.error?.code,
      })
      return { sent: false, reason: 'meta_api_rejected', status: response.status }
    }
    return { sent: true, eventsReceived: result?.events_received ?? null }
  } catch (error) {
    console.error(`Meta Conversions API request failed for ${input.eventName}`, error)
    return { sent: false, reason: 'meta_request_failed' }
  }
}

/** Reads the pixel cookies and request context Meta uses to match a person. */
export function metaContextFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const read = (name: string) =>
    cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.split('=').slice(1).join('=') ?? null
  return {
    fbp: read('_fbp'),
    fbc: read('_fbc'),
    clientIp: (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip'),
    clientUserAgent: request.headers.get('user-agent'),
  }
}
