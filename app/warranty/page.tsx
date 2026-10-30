import type { Metadata } from 'next'
import { ShieldCheck, Wrench, Glasses, AlertTriangle, Lightbulb } from 'lucide-react'

import Header from '@/components/Header'
import { LIGHT_WARRANTY_YEARS } from '@/lib/lights'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Limited Lifetime Warranty on Every Pair | HeliosX Loupes',
  description: `Every HeliosX loupe has a limited lifetime warranty against manufacturer defects in the optics, frame and hinges. HeliosX loupe lights carry a ${LIGHT_WARRANTY_YEARS}-year warranty.`,
  path: '/warranty',
})

export default function WarrantyPage() {
  return (
    <>
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
            Support
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Limited lifetime warranty</h1>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              What is covered
            </h2>
            <p className="text-neutral-300">
              All HeliosX loupes include a limited lifetime warranty covering manufacturer-related defects in materials and workmanship of the optics, frame and hinges. Coverage begins on the delivery date and lasts for as long as the original purchaser owns the loupes. It is not transferable. If you believe your loupes have a covered issue, contact us with your order information and photos when relevant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <Lightbulb className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Loupe lights: {LIGHT_WARRANTY_YEARS}-year warranty
            </h2>
            <p className="text-neutral-300">
              Every HeliosX LED loupe light and headlight includes a {LIGHT_WARRANTY_YEARS}-year limited warranty covering manufacturer-related defects in materials and workmanship of the light head, LEDs, cable, mount and headband. Coverage begins on the delivery date, applies to the original purchaser and is not transferable. Batteries are wear parts and are not covered.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <Wrench className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Repairs and service
            </h2>
            <p className="text-neutral-300">
              We assess covered claims and provide the appropriate authorized return, repair, replacement, or exchange path. Email us at{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white">
                heliosxloupes@gmail.com
              </a>{' '}
              with your order number and a description of the issue, including photos when relevant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <Glasses className="h-5 w-5 shrink-0 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Prescription updates
            </h2>
            <p className="text-neutral-300">
              If your prescription changes after delivery, we can help update your lenses. Contact our support team to discuss lens-replacement options for your existing frame.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-300/90" strokeWidth={1.75} aria-hidden="true" />
              Outside of warranty
            </h2>
            <p className="text-neutral-300">
              Normal wear, wear parts such as nose pads, straps, side shields and batteries, accidental damage, misuse, prescription changes, and unauthorized modifications fall outside these warranties. We still try to help. Email{' '}
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
