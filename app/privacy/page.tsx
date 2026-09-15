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
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
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
            We use Google Analytics and Meta Pixel to understand website activity, measure advertising performance, and improve our campaigns. These tools may use cookies or similar browser storage.
          </p>
          <p className="text-neutral-300">
            If you visit from the United States, this tracking is on by default and you can opt out at any time from Privacy choices in the footer. We also treat a browser Global Privacy Control signal as a request to opt out. If you visit from anywhere else, nothing runs until you accept it in the privacy banner. You can change your choice from Privacy choices in the footer whenever you like.
          </p>
          <p className="text-neutral-300">
            When tracking is on and you place an order, our server also reports the purchase to Meta through its Conversions API so we can see which ads lead to sales. Your email, phone number, name and address are hashed before they are sent.
          </p>
        </article>
      </main>
    </>
  )
}
