import Header from '@/components/Header'

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
        </article>
      </main>
    </>
  )
}
