import { TrackingForm } from '@/components/AdminForms'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export default async function AdminOrdersPage() {
  await requireAdmin()
  const supabase = getSupabaseServiceClient()
  const { data } = supabase
    ? await supabase.from('orders').select('*').order('created_at', { ascending: false })
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
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300">
                {order.status}
              </span>
            </div>
            <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-black p-3 text-xs text-neutral-300">
              {JSON.stringify(order.items, null, 2)}
            </pre>
            <TrackingForm orderId={order.id} />
          </article>
        ))}
        {!orders.length && <p className="text-neutral-400">No orders yet.</p>}
      </div>
    </main>
  )
}
