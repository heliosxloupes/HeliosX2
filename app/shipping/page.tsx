import type { Metadata } from 'next'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Shipping | HeliosX Loupes',
  description: 'Shipping destinations, transit times, and order tracking for HeliosX surgical and dental loupes.',
  path: '/shipping',
})

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
            Order &amp; delivery
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Shipping</h1>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Where we ship</h2>
            <p className="text-neutral-300">
              HeliosX ships to the United States and Canada as standard destinations. International shipping is available on request to most countries served by major couriers; reach out at{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              if your delivery address is outside the US or Canada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Transit time</h2>
            <p className="text-neutral-300">
              Standard shipping within the US typically takes 3–5 business days after production is complete. Express options are offered at checkout when available. Custom-fit production starts after measurements are received, which adds a separate production window before shipment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Tracking and updates</h2>
            <p className="text-neutral-300">
              Once your order ships, you receive an email with carrier and tracking information. Address changes are possible before the carrier takes possession of the package. Contact{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              as soon as possible to update an address before shipment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Shipping cost</h2>
            <p className="text-neutral-300">
              Standard shipping inside the US and Canada is included on most orders. Final shipping cost is calculated at checkout based on destination and the option you select.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
