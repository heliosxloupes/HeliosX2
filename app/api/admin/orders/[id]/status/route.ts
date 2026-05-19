import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { AdminOrderStatus } from '@/lib/ecommerce-types'

const allowedStatuses: AdminOrderStatus[] = [
  'pending_measurements',
  'measurements_received',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()

  const body = await req.json().catch(() => null)
  const status = String(body?.status ?? '') as AdminOrderStatus
  const note = String(body?.note ?? '').trim()

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const updates: Record<string, string | null> = { status }
  const now = new Date().toISOString()

  if (status === 'shipped') updates.shipped_at = now
  if (status === 'delivered') updates.delivered_at = now
  if (status === 'refunded') updates.payment_status = 'refunded'
  if (status === 'cancelled') updates.payment_status = 'cancelled'

  const { data: order, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('order_status_events').insert({
    order_id: order.id,
    status,
    payment_status: updates.payment_status ?? order.payment_status,
    note: note || `Admin updated order status to ${status}`,
    metadata: { source: 'admin' },
  })

  return NextResponse.json({ ok: true, order })
}
