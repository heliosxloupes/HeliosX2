import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import {
  processCheckoutSessionCompleted,
  sendStandaloneCheckoutConfirmation,
} from '@/lib/order-confirmation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json().catch(() => ({ sessionId: '' }))
  const normalizedSessionId = String(sessionId ?? '').trim()

  if (!normalizedSessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' as any })
  const session = await stripe.checkout.sessions.retrieve(normalizedSessionId)

  if (session.payment_status !== 'paid') {
    return NextResponse.json({
      ensured: false,
      reason: 'payment_not_paid',
      paymentStatus: session.payment_status,
    })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) {
    const result = await sendStandaloneCheckoutConfirmation({ session, stripe })
    return NextResponse.json({
      ensured: true,
      stored: false,
      fallback: 'supabase_not_configured',
      ...result,
    })
  }

  const result = await processCheckoutSessionCompleted({
    session,
    stripe,
    supabase,
  })

  return NextResponse.json({ ensured: true, ...result })
}
