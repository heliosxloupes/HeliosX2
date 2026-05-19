import { OrderStatusForm, TrackingForm } from '@/components/AdminForms'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { AdminOrderStatus } from '@/lib/ecommerce-types'

function formatStatus(status: string) {
  return status.replaceAll('_', ' ')
}

function formatMoney(cents?: number | null, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format((cents ?? 0) / 100)
}

export default async function AdminOrdersPage() {
  await requireAdmin()
  const supabase = getSupabaseServiceClient()
  const { data } = supabase
    ? await supabase
        .from('orders')
        .select('*, order_status_events(*)')
        .order('created_at', { ascending: false })
        .order('created_at', { referencedTable: 'order_status_events', ascending: false })
    : { data: [] }
  const orders = data ?? []

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order: any) => (
          <article key={order.id} className="rounded-[24px] border border-white/10 bg-neutral-950 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{order.customer_email}</p>
                <p className="mt-1 text-xs text-neutral-500">{order.stripe_session_id}</p>
                <p className="mt-2 text-xs text-neutral-400">
                  {formatMoney(order.total, order.currency)} · payment {order.payment_status ?? 'unknown'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs capitalize text-emerald-100">
                  {formatStatus(order.status)}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs capitalize text-neutral-300">
                  {order.payment_status ?? 'unknown'}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-neutral-400 md:grid-cols-3">
              <p>Paid: {order.paid_at ? new Date(order.paid_at).toLocaleString() : 'Not recorded'}</p>
              <p>Shipped: {order.shipped_at ? new Date(order.shipped_at).toLocaleString() : 'Not shipped'}</p>
              <p>Delivered: {order.delivered_at ? new Date(order.delivered_at).toLocaleString() : 'Not delivered'}</p>
            </div>
            <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-black p-3 text-xs text-neutral-300">
              {JSON.stringify(order.items, null, 2)}
            </pre>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status as AdminOrderStatus}
            />
            <TrackingForm orderId={order.id} />
            {Array.isArray(order.order_status_events) && order.order_status_events.length > 0 && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Timeline
                </p>
                <div className="mt-3 space-y-2">
                  {order.order_status_events.slice(0, 6).map((event: any) => (
                    <div key={event.id} className="text-xs text-neutral-300">
                      <span className="text-neutral-500">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                      {' · '}
                      <span className="capitalize">{formatStatus(event.status ?? event.payment_status ?? 'event')}</span>
                      {event.note ? <span className="text-neutral-400"> · {event.note}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
        {!orders.length && <p className="text-neutral-400">No orders yet.</p>}
      </div>
    </main>
  )
}
