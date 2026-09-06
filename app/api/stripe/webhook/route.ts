import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { processCheckoutSessionCompleted } from '@/lib/order-confirmation'
import { sendMetaPurchase } from '@/lib/meta-conversions'
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

  const result = await processCheckoutSessionCompleted({
    session,
    stripe,
    supabase,
  })

  const meta = result.order
    ? await sendMetaPurchase({
        session,
        orderId: String(result.order.id),
        items: Array.isArray(result.order.items) ? result.order.items : [],
      })
    : { sent: false, reason: 'order_not_available' }

  return NextResponse.json({ received: true, ...result, meta })
}
