import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { renderTemplate, sendEmail } from '@/lib/email'
import { upsertCrmContact } from '@/lib/commerce'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 500 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' as any })
  const signature = req.headers.get('stripe-signature')
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? '', webhookSecret)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ received: true, stored: false })

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail ??
    ''

  if (!email) return NextResponse.json({ received: true, stored: false })

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
  }))

  const { data: order, error } = await supabase
    .from('orders')
    .upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        abandoned_cart_session_id: session.metadata?.cartSessionId || null,
        customer_email: email.toLowerCase(),
        customer_phone: session.customer_details?.phone ?? null,
        items,
        subtotal: session.amount_subtotal,
        total: session.amount_total,
        currency: session.currency ?? 'usd',
        status: 'pending_measurements',
      },
      { onConflict: 'stripe_session_id' }
    )
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (session.metadata?.cartSessionId) {
    await supabase
      .from('abandoned_cart_sessions')
      .update({
        completed_at: new Date().toISOString(),
        checkout_session_id: session.id,
      })
      .eq('id', session.metadata.cartSessionId)
  }

  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('key', 'post_purchase')
    .maybeSingle()

  if (template?.is_active) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const measurementUrl = `${baseUrl}/measurements/${order.measurement_token}`
    const subject = renderTemplate(template.subject, { measurement_url: measurementUrl })
    const body = renderTemplate(template.body, { measurement_url: measurementUrl })
    const result: any = await sendEmail({ to: email, subject, body })

    await supabase.from('email_events').insert({
      template_key: 'post_purchase',
      recipient_email: email.toLowerCase(),
      related_order_id: order.id,
      status: result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent',
      error: result?.error?.message ?? null,
    })
  }

  return NextResponse.json({ received: true })
}
