import Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'

import {
  HELIOSX_SUPPORT_EMAIL,
  PDCHECK_AR_IOS_URL,
  type OrderEmailSummary,
  renderTemplate,
  sendEmail,
} from '@/lib/email'
import { upsertCrmContact } from '@/lib/commerce'

const DEFAULT_POST_PURCHASE_SUBJECT = 'Your HeliosX order is confirmed'
const DEFAULT_POST_PURCHASE_BODY = `Thanks for your order. We have received your payment and reserved your HeliosX loupe configuration.

Your receipt and shipping details are below. Before production begins, we need your custom fit measurements so we can build your loupes around the way you work.

Please send us:
- Pupillary distance (PD)
- Working distance
- Prescription notes or a prescription screenshot, if applicable
- Any fit notes you want our team to review

For PD, we recommend using PDCheck AR by EyeQue on iPhone. Download the app here: {{pdcheck_ios_url}}

After measuring, reply directly to this email with a screenshot of your PDCheck AR result, or submit your details through your secure measurement page: {{measurement_url}}

Your order remains fully refundable until measurements are submitted.`

function compactDetails(details: Array<string | null | undefined>) {
  return details
    .map((detail) => String(detail ?? '').trim())
    .filter(Boolean)
}

function formatStripeAddress(address?: Stripe.Address | null) {
  if (!address) return ''
  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(', '),
    address.country,
  ]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean)
    .join('\n')
}

function getProductMetadata(item: Stripe.LineItem) {
  const product = item.price?.product
  if (!product || typeof product !== 'object' || 'deleted' in product) return {}
  return product.metadata ?? {}
}

function buildOrderSummary({
  session,
  lineItems,
}: {
  session: Stripe.Checkout.Session
  lineItems: Stripe.ApiList<Stripe.LineItem>
}) {
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail ??
    ''
  const customerName = session.customer_details?.name ?? ''
  const shippingAddress = formatStripeAddress((session as any).shipping_details?.address)
  const billingAddress = formatStripeAddress(session.customer_details?.address)

  return {
    customerName,
    shippingAddress,
    billingAddress,
    orderSummary: {
      orderNumber: session.id,
      customerName,
      customerEmail: email.toLowerCase(),
      customerPhone: session.customer_details?.phone ?? '',
      shippingAddress,
      billingAddress,
      subtotal: session.amount_subtotal,
      total: session.amount_total,
      currency: session.currency ?? 'usd',
      paymentStatus: session.payment_status ?? 'paid',
      paidAt: new Date().toISOString(),
      items: lineItems.data.map((item) => {
        const metadata = getProductMetadata(item)
        return {
          name: item.description ?? 'HeliosX item',
          quantity: item.quantity,
          amountTotal: item.amount_total,
          details: compactDetails([
            metadata?.magnification ? `Magnification: ${metadata.magnification}` : '',
            metadata?.frameStyle ? `Frame: ${metadata.frameStyle}` : '',
            metadata?.frameColor ? `Color: ${metadata.frameColor}` : '',
          ]),
        }
      }),
    } satisfies OrderEmailSummary,
  }
}

export async function sendStandaloneCheckoutConfirmation({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session
  stripe: Stripe
}) {
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail ??
    ''

  if (!email) return { emailed: false, reason: 'missing_email' }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })
  const { customerName, orderSummary } = buildOrderSummary({ session, lineItems })
  const body = renderTemplate(DEFAULT_POST_PURCHASE_BODY, {
    measurement_url: `mailto:${HELIOSX_SUPPORT_EMAIL}`,
    pdcheck_ios_url: PDCHECK_AR_IOS_URL,
    support_email: HELIOSX_SUPPORT_EMAIL,
    site_url: process.env.NEXT_PUBLIC_BASE_URL || 'https://heliosxloupes.com',
  })
  const internalCopy =
    email.toLowerCase() === HELIOSX_SUPPORT_EMAIL.toLowerCase() ? undefined : HELIOSX_SUPPORT_EMAIL
  const result: any = await sendEmail({
    to: email,
    bcc: internalCopy,
    subject: DEFAULT_POST_PURCHASE_SUBJECT,
    body,
    preview: `${customerName ? `${customerName}, y` : 'Y'}our HeliosX order is confirmed. Receipt and next steps are inside.`,
    eyebrow: 'Order confirmed',
    title: 'Your HeliosX order is confirmed',
    orderSummary,
    secondaryCta: {
      label: 'Download PDCheck AR',
      url: PDCHECK_AR_IOS_URL,
    },
  })

  return {
    emailed: !result?.error && !result?.skipped,
    emailStatus: result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent',
    error: result?.error?.message,
  }
}

async function upsertOrderWithFallback({
  supabase,
  orderPayload,
}: {
  supabase: SupabaseClient
  orderPayload: Record<string, any>
}) {
  const response = await supabase
    .from('orders')
    .upsert(orderPayload, { onConflict: 'stripe_session_id' })
    .select('*')
    .single()

  if (!response.error || response.error.code !== 'PGRST204') return response

  const { customer_name, shipping_details, billing_details, ...basePayload } = orderPayload
  return supabase
    .from('orders')
    .upsert(basePayload, { onConflict: 'stripe_session_id' })
    .select('*')
    .single()
}

async function hasPostPurchaseEvent(supabase: SupabaseClient, orderId: string, email: string) {
  const { data } = await supabase
    .from('email_events')
    .select('id,status')
    .eq('template_key', 'post_purchase')
    .eq('related_order_id', orderId)
    .eq('recipient_email', email.toLowerCase())
    .eq('status', 'sent')
    .maybeSingle()

  return Boolean(data)
}

export async function processCheckoutSessionCompleted({
  session,
  stripe,
  supabase,
}: {
  session: Stripe.Checkout.Session
  stripe: Stripe
  supabase: SupabaseClient
}) {
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail ??
    ''

  if (!email) return { stored: false, emailed: false, reason: 'missing_email' }

  await upsertCrmContact({
    email,
    phone: session.customer_details?.phone,
    source: 'purchase',
    metadata: { stripeSessionId: session.id },
  })

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })

  const items = lineItems.data.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    amountSubtotal: item.amount_subtotal,
    amountTotal: item.amount_total,
    productMetadata: getProductMetadata(item),
  }))

  const { customerName, shippingAddress, billingAddress, orderSummary } = buildOrderSummary({
    session,
    lineItems,
  })
  const paidAt = new Date().toISOString()
  const shippingDetails = {
    name: (session as any).shipping_details?.name ?? customerName,
    address: (session as any).shipping_details?.address ?? null,
    shippingCost: session.total_details?.amount_shipping ?? 0,
  }
  const billingDetails = {
    name: customerName,
    address: session.customer_details?.address ?? null,
  }

  const { data: order, error } = await upsertOrderWithFallback({
    supabase,
    orderPayload: {
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
      abandoned_cart_session_id: session.metadata?.cartSessionId || null,
      customer_email: email.toLowerCase(),
      customer_name: customerName || null,
      customer_phone: session.customer_details?.phone ?? null,
      shipping_details: shippingDetails,
      billing_details: billingDetails,
      items,
      subtotal: session.amount_subtotal,
      total: session.amount_total,
      currency: session.currency ?? 'usd',
      payment_status: session.payment_status ?? 'paid',
      paid_at: paidAt,
      status: 'pending_measurements',
    },
  })

  if (error) throw new Error(error.message)

  await supabase.from('order_status_events').insert({
    order_id: order.id,
    status: 'pending_measurements',
    payment_status: session.payment_status ?? 'paid',
    note: 'Stripe checkout session completed',
    metadata: {
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
    },
  })

  if (session.metadata?.cartSessionId) {
    await supabase
      .from('abandoned_cart_sessions')
      .update({
        completed_at: new Date().toISOString(),
        checkout_session_id: session.id,
      })
      .eq('id', session.metadata.cartSessionId)
  }

  if (await hasPostPurchaseEvent(supabase, order.id, email)) {
    return { stored: true, emailed: false, skippedDuplicate: true, order }
  }

  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('key', 'post_purchase')
    .maybeSingle()

  if (template?.is_active === false) {
    return { stored: true, emailed: false, skippedInactiveTemplate: true, order }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const measurementUrl = `${baseUrl}/measurements/${order.measurement_token}`
  const templateValues = {
    measurement_url: measurementUrl,
    pdcheck_ios_url: PDCHECK_AR_IOS_URL,
    support_email: HELIOSX_SUPPORT_EMAIL,
    site_url: baseUrl,
  }
  const subject = renderTemplate(template?.subject ?? DEFAULT_POST_PURCHASE_SUBJECT, templateValues)
  const body = renderTemplate(template?.body ?? DEFAULT_POST_PURCHASE_BODY, templateValues)
  const internalCopy =
    email.toLowerCase() === HELIOSX_SUPPORT_EMAIL.toLowerCase() ? undefined : HELIOSX_SUPPORT_EMAIL
  const result: any = await sendEmail({
    to: email,
    bcc: internalCopy,
    subject,
    body,
    preview: `${customerName ? `${customerName}, y` : 'Y'}our HeliosX order is confirmed. Receipt and next steps are inside.`,
    eyebrow: 'Order confirmed',
    title: 'Your HeliosX order is confirmed',
    orderSummary,
    cta: {
      label: 'Open measurement page',
      url: measurementUrl,
    },
    secondaryCta: {
      label: 'Download PDCheck AR',
      url: PDCHECK_AR_IOS_URL,
    },
  })

  const status = result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent'
  await supabase.from('email_events').insert({
    template_key: 'post_purchase',
    recipient_email: email.toLowerCase(),
    related_order_id: order.id,
    status,
    error: result?.error?.message ?? null,
  })

  if (internalCopy) {
    await supabase.from('email_events').insert({
      template_key: 'post_purchase',
      recipient_email: internalCopy,
      related_order_id: order.id,
      status,
      error: result?.error?.message ?? null,
    })
  }

  return { stored: true, emailed: status === 'sent', emailStatus: status, order }
}
