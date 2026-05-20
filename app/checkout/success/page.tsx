'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Suspense, useEffect, useState } from 'react'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return
    async function loadOrder() {
      const confirmationKey = `heliosx_confirmation_ensured_${sessionId}`
      if (window.sessionStorage.getItem(confirmationKey) !== '1') {
        await fetch('/api/orders/ensure-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
          .then((response) => {
            if (response.ok) window.sessionStorage.setItem(confirmationKey, '1')
          })
          .catch(() => null)
      }

      fetch(`/api/orders/lookup?session_id=${sessionId}`)
        .then((response) => response.json())
        .then((payload) => setOrder(payload?.order ?? null))
        .catch(() => setOrder(null))
    }

    loadOrder()
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent pt-24 text-neutral-100">
        <section className="relative mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col gap-10 px-4 pb-16 lg:flex-row lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative min-h-[340px] flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.85)] lg:min-h-[540px]"
          >
            <Image
              src="/Successcheckout2.png"
              alt="Order confirmed"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-neutral-100">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-300">
                Order confirmed
              </p>
              <h1 className="max-w-lg text-2xl font-semibold leading-tight lg:text-4xl">
                Your new field of view is on the way.
              </h1>
              <p className="max-w-md text-sm leading-6 text-neutral-300">
                Payment is complete. Next, we lock in your fit details and move your HeliosX system into production.
              </p>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="w-full max-w-md flex-1 space-y-6"
          >
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                    Checkout
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-neutral-50">
                    Payment successful
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10">
                  <span className="text-lg">✓</span>
                </div>
              </div>

              <p className="text-sm leading-6 text-neutral-300">
                We&apos;ve recorded your order and payment. Your order status is pending measurements until your PD and fit details are submitted.
              </p>
              {order && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-neutral-300 print:border-black print:bg-white print:text-black">
                  <p className="font-semibold text-neutral-100 print:text-black">Printable receipt</p>
                  <p className="mt-2">Order: {order.id}</p>
                  <p>Email: {order.customer_email}</p>
                  <p>Total: ${((order.total ?? 0) / 100).toFixed(2)} {String(order.currency ?? 'usd').toUpperCase()}</p>
                  <p>Status: {order.status}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-[32px] border border-white/10 bg-gradient-to-b from-neutral-900/80 to-black p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Next steps
              </p>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>Check your email for your receipt and order confirmation.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>Submit your pupillary distance, working distance, and any prescription notes from the secure link in your confirmation email.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>Your order is fully refundable until measurements are submitted. Once fit details are verified, we&apos;ll begin production and send shipping updates.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-[32px] border border-white/10 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 shadow-[0_0_45px_rgba(0,0,0,0.9)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Keep moving
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/home')}
                  className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                >
                  Back to home
                </button>
                <button
                  onClick={() => router.push('/product')}
                  className="flex w-full items-center justify-center rounded-full border border-neutral-700 bg-black px-6 py-3 text-sm font-medium text-neutral-100 transition hover:border-neutral-500 hover:bg-neutral-950"
                >
                  Explore other systems
                </button>
                <button
                  onClick={() => router.push('/cart')}
                  className="flex w-full items-center justify-center rounded-full border border-neutral-800 bg-transparent px-6 py-3 text-xs font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-950/60"
                >
                  View cart and details
                </button>
              </div>
              <p className="text-[0.65rem] leading-5 text-neutral-500">
                Questions about your order or fit? Reach out and we&apos;ll answer directly.
              </p>
            </div>
          </motion.aside>
        </section>
      </main>
    </>
  )
}
