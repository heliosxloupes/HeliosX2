import type { Metadata } from 'next'
import { ShieldCheck, RotateCcw, ClipboardCheck, Mail } from 'lucide-react'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Returns &amp; Refunds | HeliosX Loupes',
  description: 'HeliosX return policy: risk-free refund window before measurements are submitted, and 30-day return rules after delivery.',
  path: '/returns',
})

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
            Order &amp; delivery
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Returns and refunds</h1>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Risk-free before measurements
            </h2>
            <p className="text-neutral-300">
              Orders are fully refundable before measurements are submitted. Because each pair of HeliosX loupes is built around your individual pupillary distance, working distance, and frame selection, the risk-free window covers the period between checkout and the moment we begin custom production.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <RotateCcw className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              30-day return after delivery
            </h2>
            <p className="text-neutral-300">
              We offer a 30-day money-back guarantee on delivered orders. If you are not satisfied with your loupes within 30 days of delivery, you can return them for a full refund. The product must be in original condition with all packaging and accessories included.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ClipboardCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              After production review
            </h2>
            <p className="text-neutral-300">
              Once measurements are submitted and production review begins, refunds may be limited by the custom production status. Reach out to{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              and we will work with you on the best path forward.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <Mail className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              How to start a return
            </h2>
            <p className="text-neutral-300">
              Email{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              with your order number and a brief description of the issue. We respond within one business day with the next step and a return shipping label when applicable.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
