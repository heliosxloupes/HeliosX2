'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [showFX, setShowFX] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShowFX(false), 2600)
    return () => clearTimeout(timeout)
  }, [])

  const handleBackHome = () => {
    router.push('/home')
  }

  const handleViewOrders = () => {
    router.push('/cart')
  }

  const handleShopMore = () => {
    router.push('/product')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 lg:flex-row lg:items-center lg:px-8 lg:pt-10">
          {/* Subtle glow + confetti FX (first load only) */}
          <AnimatePresence>
            {showFX && (
              <>
                {/* Soft radial glow behind left card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.35, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="pointer-events-none absolute -left-10 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_60%)] blur-3xl"
                />

                {/* A few subtle "confetti" chips */}
                {[
                  { x: '12%', y: '18%', delay: 0 },
                  { x: '32%', y: '10%', delay: 0.1 },
                  { x: '22%', y: '30%', delay: 0.18 },
                  { x: '18%', y: '45%', delay: 0.25 },
                  { x: '40%', y: '22%', delay: 0.15 },
                  { x: '35%', y: '38%', delay: 0.32 },
                ].map((chip, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 12, scale: 0.7, rotate: -10 }}
                    animate={{ opacity: 0.9, y: -8, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: -24, scale: 0.9, rotate: 8 }}
                    transition={{
                      duration: 0.9,
                      delay: chip.delay,
                      ease: 'easeOut',
                    }}
                    className="pointer-events-none absolute h-1.5 w-4 rounded-full bg-neutral-50/80"
                    style={{ left: chip.x, top: chip.y }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* LEFT – hero / emotional side */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative w-full flex-1 overflow-hidden rounded-[32px] bg-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
          >
            <Image
              src="/Galileo/Walkinghallway2.png"
              alt="Surgeon walking down hallway"
              fill
              className="object-cover"
              priority
            />
            {/* gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/75 via-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-neutral-100">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-300">
                Order confirmed
              </p>
              <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">
                Your new field of view is on the way.
              </h1>
              <p className="max-w-md text-sm text-neutral-300">
                We&apos;ll confirm your IPD, working distance, and prescription
                details shortly. Once everything is dialed in, your HeliosX
                system goes into production.
              </p>
            </div>
          </motion.div>

          {/* RIGHT – summary / actions */}
          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="w-full max-w-md flex-1 space-y-6"
          >
            {/* Card 1: Status */}
            <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
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

              <p className="text-sm text-neutral-300">
                A confirmation email has been sent with your receipt and next
                steps. You&apos;ll receive a separate message requesting any
                remaining measurement or prescription details.
              </p>

              {sessionId && (
                <p className="mt-4 text-[0.7rem] text-neutral-500">
                  Stripe session ID:{' '}
                  <span className="font-mono text-[0.7rem] text-neutral-300">
                    {sessionId}
                  </span>
                </p>
              )}
            </div>

            {/* Card 2: What happens next */}
            <div className="space-y-4 rounded-3xl bg-gradient-to-b from-neutral-900/80 to-black p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Next steps
              </p>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>
                    Check your email for your Stripe receipt and order
                    confirmation.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>
                    Complete the short fit form so we can lock in IPD, working
                    distance, and prescription details.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-neutral-200" />
                  <span>
                    Once everything is verified, your loupes move into
                    production and you&apos;ll receive build + shipping
                    updates.
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 3: Actions */}
            <div className="space-y-4 rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 shadow-[0_0_45px_rgba(0,0,0,0.9)]">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Keep moving
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBackHome}
                  className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:translate-y-[1px] hover:bg-neutral-100"
                >
                  Back to home
                </button>
                <button
                  onClick={handleShopMore}
                  className="flex w-full items-center justify-center rounded-full border border-neutral-700 bg-black px-6 py-3 text-sm font-medium text-neutral-100 shadow-[0_0_30px_rgba(0,0,0,0.7)] transition hover:border-neutral-500 hover:bg-neutral-950"
                >
                  Explore other systems
                </button>
                <button
                  onClick={handleViewOrders}
                  className="flex w-full items-center justify-center rounded-full border border-neutral-800 bg-transparent px-6 py-3 text-xs font-medium text-neutral-300 hover:border-neutral-600 hover:bg-neutral-950/60"
                >
                  View cart / order details
                </button>
              </div>
              <p className="text-[0.65rem] text-neutral-500">
                Questions about your order or fit? Reach out and we&apos;ll
                answer like colleagues, not a call center.
              </p>
            </div>
          </motion.aside>
        </section>
      </main>
    </>
  )
}

