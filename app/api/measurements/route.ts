import { NextResponse } from 'next/server'

import { upsertCrmContact } from '@/lib/commerce'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const token = String(body?.token ?? '')
  const email = String(body?.email ?? '').trim().toLowerCase()
  const pupillaryDistance = String(body?.pupillaryDistance ?? '').trim()

  if (!token || !email || !pupillaryDistance) {
    return NextResponse.json({ error: 'Token, email, and PD are required' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('measurement_token', token)
    .maybeSingle()

  if (!order) return NextResponse.json({ error: 'Invalid measurement link' }, { status: 404 })

  await supabase.from('measurements').insert({
    order_id: order.id,
    email,
    pupillary_distance: pupillaryDistance,
    working_distance: body?.workingDistance ?? null,
    prescription_notes: body?.prescriptionNotes ?? null,
    additional_notes: body?.additionalNotes ?? null,
  })

  await supabase
    .from('orders')
    .update({ status: 'measurements_received' })
    .eq('id', order.id)

  await upsertCrmContact({ email, source: 'measurement' })

  return NextResponse.json({ ok: true })
}
