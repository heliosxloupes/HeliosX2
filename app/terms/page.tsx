import Header from '@/components/Header'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-neutral-300">
            HeliosX surgical loupes are custom-fit products. After checkout, customers must submit required measurements before production begins.
          </p>
          <p className="text-neutral-300">
            Orders are risk-free and fully refundable before measurements are submitted. Once measurements are submitted and production review begins, refunds may be limited by custom production status.
          </p>
          <p className="text-neutral-300">
            Shipping updates are provided by email when tracking is available. Contact heliosxloupes@gmail.com for order, refund, or support questions.
          </p>
        </article>
      </main>
    </>
  )
}
