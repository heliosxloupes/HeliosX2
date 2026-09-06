import type { Metadata } from 'next'
import { ShieldCheck, RotateCcw, ClipboardCheck, Mail } from 'lucide-react'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Returns &amp; Refunds | HeliosX Loupes',
  description: 'HeliosX refund and modification policy for custom surgical and dental loupes before production and after delivery.',
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
              Fully refundable before production
            </h2>
            <p className="text-neutral-300">
              You may cancel your order for a full refund at any time before custom production begins. After checkout, we collect and review your pupillary distance, working distance, frame selection, and prescription information before releasing the order to production.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <RotateCcw className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Modifications after delivery
            </h2>
            <p className="text-neutral-300">
              After your loupes have shipped or arrived, they may be returned for an authorized fit or configuration modification. Contact us before sending the product so we can review the issue and provide the correct return instructions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ClipboardCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Once production begins
            </h2>
            <p className="text-neutral-300">
              Because every pair is made to the buyer’s measurements and selected configuration, orders are no longer refundable once custom production begins. Manufacturing-related issues remain covered by the two-year limited warranty. Reach out to{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              and we will help determine whether a modification, repair, or warranty service is appropriate.
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
              with your order number, a brief description of the issue, and photos when relevant. We respond within one business day with authorization and the next steps when a return is appropriate.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
