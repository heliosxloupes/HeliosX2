import type { Metadata } from 'next'
import { ShieldCheck, RotateCcw, ClipboardCheck, Mail } from 'lucide-react'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Returns & Refunds | HeliosX Loupes',
  description: 'Return any non-prescription HeliosX loupes within 30 days of delivery for a full refund. Prescription pairs are refundable until production starts. Two-year warranty on every pair.',
  path: '/returns',
})

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
            Order &amp; delivery
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Returns and refunds</h1>

          <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.06] p-5 text-sm leading-7 text-neutral-200">
            <p><strong className="text-white">30-day returns:</strong> Return any non-prescription pair within 30 days of delivery for a full refund.</p>
            <p><strong className="text-white">Prescription pairs:</strong> Cancel for a full refund any time before production starts. After that, we cover defects and fit corrections.</p>
            <p><strong className="text-white">Warranty:</strong> Every pair has a two-year limited warranty.</p>
          </div>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <RotateCcw className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              30-day returns on non-prescription pairs
            </h2>
            <p className="text-neutral-300">
              Buying loupes you have never tried on is a leap, so try them where it counts: in your own clinic or operating room. If the pair is not right for you, email us within 30 days of delivery, send the loupes back in their original condition with the case, and we refund the full price of the loupes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ClipboardCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Prescription pairs
            </h2>
            <p className="text-neutral-300">
              Prescription lenses are ground for one person, so prescription pairs can be cancelled for a full refund any time before production starts, but not returned afterwards for a change of mind. Before production we review your pupillary distance, working distance, frame and prescription with you. If a finished pair does not match the measurements you approved, we correct or remake it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Defects and warranty
            </h2>
            <p className="text-neutral-300">
              Every pair is covered by a two-year limited warranty against manufacturer defects in materials and workmanship. Confirmed defects are eligible for repair, replacement or exchange. Reach out to{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              and we will help work out the right fix.
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
              with your order number and whether you are returning the pair or reporting an issue, with photos when relevant. We reply within one business day with return instructions.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
