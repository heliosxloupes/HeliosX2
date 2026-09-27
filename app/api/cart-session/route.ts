import { NextResponse } from 'next/server'

import { upsertCrmContact } from '@/lib/commerce'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const cartItems = Array.isArray(body?.cartItems) ? body.cartItems : []
  const stage = body?.stage === 'checkout' ? 'checkout' : 'cart'
  const cartSessionId = body?.cartSessionId

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  await upsertCrmContact({ email, source: 'cart' })

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ ok: true, cartSessionId: null })

  const payload = {
    email,
    cart_items: cartItems,
    stage,
    reached_checkout_at: stage === 'checkout' ? new Date().toISOString() : undefined,
  }

  if (cartSessionId) {
    const { data } = await supabase
      .from('abandoned_cart_sessions')
      .update(payload)
      .eq('id', cartSessionId)
      .select('id')
      .maybeSingle()

    if (data?.id) return NextResponse.json({ ok: true, cartSessionId: data.id })
  }

  // No usable id (new device, cleared storage, or first cart write): reuse this
  // shopper's latest open cart instead of adding a row per visit. Duplicate
  // rows used to start parallel reminder sequences for the same person.
  const { data: openCart } = await supabase
    .from('abandoned_cart_sessions')
    .select('id, stage')
    .eq('email', email)
    .is('completed_at', null)
    .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (openCart?.id) {
    // Never move a cart back from 'checkout' to 'cart'.
    const merged = openCart.stage === 'checkout' && stage === 'cart'
      ? { ...payload, stage: 'checkout', reached_checkout_at: undefined }
      : payload
    const { data: updated } = await supabase
      .from('abandoned_cart_sessions')
      .update(merged)
      .eq('id', openCart.id)
      .select('id')
      .maybeSingle()
    if (updated?.id) return NextResponse.json({ ok: true, cartSessionId: updated.id })
  }

  const { data, error } = await supabase
    .from('abandoned_cart_sessions')
    .insert(payload)
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, cartSessionId: data.id })
}
