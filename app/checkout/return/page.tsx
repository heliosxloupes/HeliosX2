'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import { clearCart } from '@/lib/cart'

function ReturnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'complete' | 'error'>('loading')
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    const initialize = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${sessionId}`)
        const session = await response.json()

        if (session.status === 'open') {
          router.replace('/checkout')
          return
        }

        if (session.status === 'complete') {
          clearCart()
          setCustomerEmail(session.customer_email || '')
          setStatus('complete')
          return
        }

        setStatus('error')
      } catch (error) {
        console.error('Error fetching session status:', error)
        setStatus('error')
      }
    }

    initialize()
  }, [router, sessionId])

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-transparent pt-24 text-neutral-100">
          <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center justify-center px-4 pb-12">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Confirming checkout</p>
            </div>
          </section>
        </main>
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-transparent pt-24 text-neutral-100">
          <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center justify-center px-4 pb-12">
            <div className="max-w-xl rounded-[32px] border border-white/10 bg-neutral-950/80 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Checkout status</p>
              <h1 className="mt-3 text-2xl font-semibold text-white">We could not confirm this checkout.</h1>
              <p className="mt-4 text-sm leading-6 text-neutral-300">
                Please return to checkout and try again. If your payment already went through,
                contact us and we will help reconcile it quickly.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => router.push('/checkout')}
                  className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                >
                  Back to checkout
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Return home
                </button>
              </div>
            </div>
          </section>
        </main>
      </>
    )
  }

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
              src="/Apollo/Apollo3xAsian.png"
              alt="HeliosX checkout confirmation"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-neutral-100">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-300">
                Payment complete
              </p>
              <h1 className="max-w-lg text-2xl font-semibold leading-tight lg:text-4xl">
                Your HeliosX system is officially in motion.
              </h1>
              <p className="max-w-md text-sm leading-6 text-neutral-300">
                We have your order. Next comes the fit-confirmation step so your final build feels
                precise, personal, and ready for the field.
              </p>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
            className="w-full max-w-md flex-1 space-y-6"
          >
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                    Confirmation
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-neutral-50">
                    Checkout verified
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10">
                  <span className="text-lg">✓</span>
                </div>
              </div>

              <p className="text-sm leading-6 text-neutral-300">
                {customerEmail
                  ? `A confirmation has been sent to ${customerEmail}.`
                  : 'A confirmation email has been sent with your receipt and order summary.'}
              </p>
            </div>

            <div className="space-y-4 rounded-[32px] border border-white/10 bg-gradient-to-b from-neutral-900/80 to-black p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                What happens next
              </p>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>Watch for your order confirmation and fit instructions by email.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>If you ordered prescription lenses, we will guide you through the Rx and PD step.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>Once fit details are confirmed, your system moves into production and then ships.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-[32px] border border-white/10 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 shadow-[0_0_45px_rgba(0,0,0,0.9)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Next move
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/product')}
                  className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                >
                  Explore more systems
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-neutral-100 transition hover:bg-white/10"
                >
                  Back to home
                </button>
              </div>
              <p className="text-[0.65rem] leading-5 text-neutral-500">
                Questions about fit, prescription, or timing? Reach out and we will help directly.
              </p>
            </div>
          </motion.aside>
        </section>
      </main>
    </>
  )
}

export default function ReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-transparent text-neutral-300">
          Loading...
        </div>
      }
    >
      <ReturnContent />
    </Suspense>
  )
}
