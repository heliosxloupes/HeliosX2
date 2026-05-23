import { OrderStatusForm, TrackingForm } from '@/components/AdminForms'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { AdminOrderStatus } from '@/lib/ecommerce-types'

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function asRecord(value: unknown): JsonRecord {
  const parsed = parseJsonValue(value)
  return isRecord(parsed) ? parsed : {}
}

function asArray(value: unknown): unknown[] {
  const parsed = parseJsonValue(value)
  if (Array.isArray(parsed)) return parsed
  if (isRecord(parsed)) return [parsed]
  return []
}

function asString(value: unknown, fallback = 'Not provided') {
  const text = String(value ?? '').trim()
  return text || fallback
}

function cleanVariant(value: unknown) {
  return asString(value, '').replace(/^[\s\-\u2013\u2014]+/, '').trim()
}

function formatStatus(status?: string | null) {
  return asString(status, 'unknown').replaceAll('_', ' ')
}

function formatDate(value?: string | null) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not recorded'
  return date.toLocaleString()
}

function formatMoney(cents?: number | null, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format((cents ?? 0) / 100)
}

function statusClass(status?: string | null) {
  const value = String(status ?? '').toLowerCase()
  if (['paid', 'delivered', 'measurements_received'].includes(value)) {
    return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
  }
  if (['pending_measurements', 'in_production', 'shipped'].includes(value)) {
    return 'border-sky-400/30 bg-sky-500/10 text-sky-100'
  }
  if (['refunded', 'cancelled', 'canceled'].includes(value)) {
    return 'border-red-400/30 bg-red-500/10 text-red-100'
  }
  return 'border-white/15 bg-white/[0.03] text-neutral-300'
}

function formatAddress(addressValue: unknown) {
  const address = asRecord(addressValue)
  const cityLine = [address.city, address.state, address.postal_code]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(', ')

  return [address.line1, address.line2, cityLine, address.country]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean)
}

function normalizeItems(value: unknown) {
  return asArray(value).map((item) => {
    const row = asRecord(item)
    const metadata = asRecord(row.productMetadata)
    const quantity = Number(row.quantity ?? 1) || 1
    const amountTotal = Number(row.amountTotal ?? row.amount_total ?? 0) || 0

    return {
      name: asString(row.description ?? row.name, 'HeliosX item'),
      quantity,
      amountTotal,
      unitAmount: quantity > 0 ? Math.round(amountTotal / quantity) : amountTotal,
      magnification: asString(metadata.magnification, ''),
      frameStyle: asString(metadata.frameStyle, ''),
      frameColor: cleanVariant(metadata.frameColor),
      productSlug: asString(metadata.productSlug, ''),
    }
  })
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-white/8 py-2 first:border-t-0 sm:grid-cols-[120px,1fr]">
      <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-200">{value}</dd>
    </div>
  )
}

function AddressBlock({ lines }: { lines: string[] }) {
  if (!lines.length) return <span className="text-neutral-500">Not provided</span>

  return (
    <span className="block leading-6">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </span>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {title}
      </h2>
      <dl className="mt-3">{children}</dl>
    </section>
  )
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
    <main>
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Order operations</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
            Review payment, fit, shipping, and fulfillment details without digging through raw Stripe payloads.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300">
          {orders.length} orders
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {orders.map((order: any) => {
          const shipping = asRecord(order.shipping_details)
          const billing = asRecord(order.billing_details)
          const shippingAddress = formatAddress(shipping.address)
          const billingAddress = formatAddress(billing.address)
          const items = normalizeItems(order.items)
          const trackingUrl = asString(order.tracking_url, '')
          const events = Array.isArray(order.order_status_events)
            ? order.order_status_events
            : []

          return (
            <article key={order.id} className="rounded-[24px] border border-white/10 bg-neutral-950 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-neutral-50">
                    {asString(order.customer_email)}
                  </p>
                  <p className="mt-1 break-all text-xs text-neutral-500">
                    Stripe session: {asString(order.stripe_session_id)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span>Created: {formatDate(order.created_at)}</span>
                    <span>Total: {formatMoney(order.total, order.currency)}</span>
                    <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs capitalize ${statusClass(order.payment_status)}`}>
                    Payment: {formatStatus(order.payment_status)}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs capitalize ${statusClass(order.status)}`}>
                    Fulfillment: {formatStatus(order.status)}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <Section title="Customer">
                  <DetailRow label="Name" value={asString(order.customer_name)} />
                  <DetailRow label="Email" value={asString(order.customer_email)} />
                  <DetailRow label="Phone" value={asString(order.customer_phone)} />
                </Section>

                <Section title="Payment">
                  <DetailRow label="Total" value={formatMoney(order.total, order.currency)} />
                  <DetailRow label="Paid" value={formatDate(order.paid_at)} />
                  <DetailRow label="Status" value={<span className="capitalize">{formatStatus(order.payment_status)}</span>} />
                </Section>

                <Section title="Shipping">
                  <DetailRow label="Recipient" value={asString(shipping.name ?? order.customer_name)} />
                  <DetailRow label="Address" value={<AddressBlock lines={shippingAddress} />} />
                  <DetailRow label="Tracking" value={asString(order.tracking_number)} />
                  <DetailRow
                    label="Link"
                    value={
                      trackingUrl ? (
                        <a href={trackingUrl} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                          Open tracking
                        </a>
                      ) : (
                        'Not provided'
                      )
                    }
                  />
                </Section>

                <Section title="Billing">
                  <DetailRow label="Name" value={asString(billing.name ?? order.customer_name)} />
                  <DetailRow label="Address" value={<AddressBlock lines={billingAddress} />} />
                </Section>
              </div>

              <section className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Items
                </h2>
                <div className="mt-3 divide-y divide-white/8">
                  {items.length ? (
                    items.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="grid gap-3 py-3 text-sm md:grid-cols-[1.5fr,0.7fr,1fr] md:items-center">
                        <div>
                          <p className="font-medium text-neutral-100">{item.name}</p>
                          <p className="mt-1 text-xs text-neutral-500">{item.productSlug || 'Product slug not provided'}</p>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Qty {item.quantity} | {formatMoney(item.unitAmount, order.currency)} each
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <span className="rounded-full border border-white/10 px-2 py-1 text-neutral-300">
                            {formatMoney(item.amountTotal, order.currency)}
                          </span>
                          {item.magnification && (
                            <span className="rounded-full border border-white/10 px-2 py-1 text-neutral-300">
                              {item.magnification}
                            </span>
                          )}
                          {item.frameStyle && (
                            <span className="rounded-full border border-white/10 px-2 py-1 text-neutral-300">
                              {item.frameStyle}
                            </span>
                          )}
                          {item.frameColor && (
                            <span className="rounded-full border border-white/10 px-2 py-1 text-neutral-300">
                              {item.frameColor}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-3 text-sm text-neutral-500">No item details recorded.</p>
                  )}
                </div>
              </section>

              <div className="mt-4 grid gap-3 text-xs text-neutral-400 md:grid-cols-3">
                <p>Paid: {formatDate(order.paid_at)}</p>
                <p>Shipped: {formatDate(order.shipped_at)}</p>
                <p>Delivered: {formatDate(order.delivered_at)}</p>
              </div>

              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status as AdminOrderStatus}
              />
              <TrackingForm orderId={order.id} />

              <section className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Timeline
                </p>
                {events.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {events.slice(0, 6).map((event: any) => (
                      <div key={event.id} className="text-xs text-neutral-300">
                        <span className="text-neutral-500">
                          {formatDate(event.created_at)}
                        </span>
                        {' | '}
                        <span className="capitalize">{formatStatus(event.status ?? event.payment_status ?? 'event')}</span>
                        {event.note ? <span className="text-neutral-400"> | {event.note}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-neutral-500">No timeline events recorded.</p>
                )}
              </section>
            </article>
          )
        })}
        {!orders.length && <p className="text-neutral-400">No orders yet.</p>}
      </div>
    </main>
  )
}
