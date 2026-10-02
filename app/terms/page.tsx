import type { Metadata } from 'next'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service | HeliosX Loupes',
  description: 'HeliosX terms covering custom-fit loupe orders, measurements, refunds, shipping, and support.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-neutral-300">
            HeliosX surgical loupes are custom-fit products. After checkout, customers must submit required measurements before production begins.
          </p>
          <p className="text-neutral-300">
            Non-prescription pairs may be returned within 30 days of delivery, in their original condition with the case, for a full refund of the loupes. Prescription pairs may be cancelled for a full refund at any time before custom production begins; once production begins they are not returnable for a change of mind, and pairs that do not match the approved measurements are corrected or remade. Manufacturer-related defects are covered by the two-year limited warranty.
          </p>
          <p className="text-neutral-300">
            Shipping updates are provided by email when tracking is available. Contact heliosxloupes@gmail.com for order, refund, or support questions.
          </p>
        </article>
      </main>
    </>
  )
}
