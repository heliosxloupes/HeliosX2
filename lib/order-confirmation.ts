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

async function sendPostPurchaseEmail({
  to,
  subject,
  body,
  customerName,
  orderSummary,
  measurementUrl,
}: {
  to: string
  subject: string
  body: string
  customerName: string
  orderSummary: OrderEmailSummary
  measurementUrl?: string
}) {
  return sendEmail({
    to,
    subject,
    body,
    preview: `${customerName ? `${customerName}, y` : 'Y'}our HeliosX order is confirmed. Receipt and next steps are inside.`,
    eyebrow: 'Order confirmed',
    title: 'Your HeliosX order is confirmed',
    orderSummary,
    cta: measurementUrl
      ? {
          label: 'Open measurement page',
          url: measurementUrl,
        }
      : undefined,
    secondaryCta: {
      label: 'Download PDCheck AR',
      url: PDCHECK_AR_IOS_URL,
    },
  })
}

function formatTotalLabel(summary: OrderEmailSummary) {
  if (typeof summary.total !== 'number') return ''
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (summary.currency || 'usd').toUpperCase(),
    }).format(summary.total / 100)
  } catch {
    return `$${(summary.total / 100).toFixed(2)}`
  }
}

// Internal "new order" notification sent to the HeliosX team. This is distinct
// from the customer receipt — it's framed as an ops alert with the action the
// team needs to take (collect fit measurements before production).
async function sendInternalOrderNotification({
  customerName,
  orderSummary,
  measurementUrl,
}: {
  customerName: string
  orderSummary: OrderEmailSummary
  measurementUrl?: string
}) {
  const totalLabel = formatTotalLabel(orderSummary)
  const who = customerName || orderSummary.customerEmail || 'a customer'
  const body = [
    `New order from ${who}${totalLabel ? ` — ${totalLabel}` : ''}.`,
    '',
    'Action needed: this customer still needs to submit their fit measurements before we move into production. Their order is marked pending measurements — full order details are below.',
  ].join('\n')

  return sendEmail({
    to: HELIOSX_SUPPORT_EMAIL,
    subject: `New order — ${who}${totalLabel ? ` (${totalLabel})` : ''}`,
    preview: `New HeliosX order from ${who}${totalLabel ? ` for ${totalLabel}` : ''}.`,
    eyebrow: 'Internal · New order',
    title: 'New order received',
    body,
    orderSummary,
    cta: measurementUrl
      ? {
          label: 'Open measurement page',
          url: measurementUrl,
        }
      : undefined,
  })
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
  const result: any = await sendPostPurchaseEmail({
    to: email,
    subject: DEFAULT_POST_PURCHASE_SUBJECT,
    body,
    customerName,
    orderSummary,
  })
  const internalResult: any = await sendInternalOrderNotification({
    customerName,
    orderSummary,
  })

  return {
    emailed: !result?.error && !result?.skipped,
    emailStatus: result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent',
    error: result?.error?.message,
    internalEmailStatus: internalResult?.error
      ? 'error'
      : internalResult?.skipped
        ? 'skipped'
        : 'sent',
    internalError: internalResult?.error?.message,
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
  const result: any = await sendPostPurchaseEmail({
    to: email,
    subject,
    body,
    customerName,
    orderSummary,
    measurementUrl,
  })

  const status = result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent'
  await supabase.from('email_events').insert({
    template_key: 'post_purchase',
    recipient_email: email.toLowerCase(),
    related_order_id: order.id,
    status,
    error: result?.error?.message ?? null,
  })

  // Always send the team an internal order notification (distinct from the
  // customer receipt) so fulfillment knows a new order needs measurements.
  const internalResult: any = await sendInternalOrderNotification({
    customerName,
    orderSummary,
    measurementUrl,
  })
  const internalStatus = internalResult?.error
    ? 'error'
    : internalResult?.skipped
      ? 'skipped'
      : 'sent'
  const internalError = internalResult?.error?.message ?? null
  await supabase.from('email_events').insert({
    template_key: 'order_notification',
    recipient_email: HELIOSX_SUPPORT_EMAIL,
    related_order_id: order.id,
    status: internalStatus,
    error: internalError,
  })

  return {
    stored: true,
    emailed: status === 'sent',
    emailStatus: status,
    internalEmailStatus: internalStatus,
    order,
  }
}
