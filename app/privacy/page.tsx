import type { Metadata } from 'next'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | HeliosX Loupes',
  description: 'How HeliosX collects, stores, and uses information about customers, orders, and measurements.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-neutral-300">
            HeliosX collects the information needed to answer inquiries, process orders, manage custom measurements, send order updates, and improve the buying experience.
          </p>
          <p className="text-neutral-300">
            We may collect email, phone, shipping/payment metadata from Stripe, cart activity, order details, measurements, and support messages. Payments are processed by Stripe; HeliosX does not store full card numbers.
          </p>
          <p className="text-neutral-300">
            We use Supabase for operational data and Resend for transactional and abandoned-cart email. You can contact us at heliosxloupes@gmail.com for privacy questions or data requests.
          </p>
          <p className="text-neutral-300">
            With your permission, we use Google Analytics and Meta Pixel to understand website activity, measure advertising performance, and improve our campaigns. These tools may use cookies or similar browser storage. You can accept or decline analytics and advertising tracking when prompted, and you can reopen Privacy choices from the footer at any time.
          </p>
        </article>
      </main>
    </>
  )
}
