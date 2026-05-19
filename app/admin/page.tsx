import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

function statusLabel(value: string) {
  return value.replaceAll('_', ' ')
}

export default async function AdminHomePage() {
  await requireAdmin()
  const supabase = getSupabaseServiceClient()
  const [{ data: orders }, { data: contacts }, { data: carts }] = supabase
    ? await Promise.all([
        supabase.from('orders').select('id,status,payment_status,total,currency,customer_email,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('crm_contacts').select('id,email,sources,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('abandoned_cart_sessions').select('id,email,stage,completed_at,created_at').is('completed_at', null).limit(50),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }]

  const recentOrders = orders ?? []
  const recentContacts = contacts ?? []
  const openCarts = carts ?? []
  const pendingMeasurements = recentOrders.filter((order: any) => order.status === 'pending_measurements').length

  return (
    <main>
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Operations</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Ecommerce control room</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
            Monitor payments, measurements, fulfillment, customer capture, and email automation from one surface.
          </p>
        </div>
        <Link
          href="/product"
          className="w-fit rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          View storefront
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ['Recent orders', String(recentOrders.length), 'latest records pulled from Supabase'],
          ['Pending measurements', String(pendingMeasurements), 'recent orders needing fit details'],
          ['Open cart sessions', String(openCarts.length), 'active abandoned-cart candidates'],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-xs text-neutral-500">{detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ['Orders', '/admin/orders', 'Track payments, measurements, and shipping.'],
          ['CRM', '/admin/crm', 'View captured contacts and source history.'],
          ['Products', '/admin/products', 'Edit product CMS data and seed catalogue.'],
          ['Email Templates', '/admin/email-templates', 'Configure drips and transactional emails.'],
        ].map(([title, href, copy]) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-white/10 bg-neutral-950/80 p-5 transition hover:border-emerald-300/40 hover:bg-neutral-900"
          >
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{copy}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 transition group-hover:text-emerald-300">
              Open
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-emerald-300 hover:text-emerald-200">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-white/10">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-neutral-100">{order.customer_email}</p>
                  <p className="mt-1 text-xs capitalize text-neutral-500">{statusLabel(order.status)}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
                  {order.payment_status ?? 'paid'}
                </span>
              </div>
            ))}
            {!recentOrders.length && <p className="py-6 text-sm text-neutral-500">No orders yet.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">Recent contacts</h2>
            <Link href="/admin/crm" className="text-xs text-emerald-300 hover:text-emerald-200">View CRM</Link>
          </div>
          <div className="mt-4 divide-y divide-white/10">
            {recentContacts.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <p className="truncate text-neutral-100">{contact.email}</p>
                <p className="text-xs text-neutral-500">{(contact.sources ?? []).slice(-1)[0] ?? 'unknown'}</p>
              </div>
            ))}
            {!recentContacts.length && <p className="py-6 text-sm text-neutral-500">No contacts yet.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
