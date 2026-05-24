import type { Metadata } from 'next'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Warranty | HeliosX Loupes',
  description: 'HeliosX warranty covering manufacturing defects, optical performance, and ongoing support for surgical and dental loupes.',
  path: '/warranty',
})

export default function WarrantyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
            Support
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Warranty</h1>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">What is covered</h2>
            <p className="text-neutral-300">
              All HeliosX loupes come with a warranty covering manufacturing defects and optical performance. If something is wrong with the build, the optics, or the fit out of the box, reach out and we will make it right.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Repairs and service</h2>
            <p className="text-neutral-300">
              We support repairs across the HeliosX product line. Many repairs are completed quickly. When a repair is not the right option, we offer replacement paths. Email us at{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              with your order number and a description of the issue, including photos when relevant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Prescription updates</h2>
            <p className="text-neutral-300">
              If your prescription changes after delivery, we can help update your lenses. Contact our support team to discuss lens-replacement options for your existing frame.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Outside of warranty</h2>
            <p className="text-neutral-300">
              Wear, accidental damage, and modifications fall outside the standard warranty. We still try to help. Email{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              and we will share repair and replacement options.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
