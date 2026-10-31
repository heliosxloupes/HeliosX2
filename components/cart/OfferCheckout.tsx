'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowUpRight } from 'lucide-react'

import AfterCheckoutSteps from '@/components/cart/AfterCheckoutSteps'
import AskSpecialistButton from '@/components/Contact/AskSpecialistButton'
import CopyEmail from '@/components/Contact/CopyEmail'
import Header from '@/components/Header'
import { getEffectiveConsent } from '@/lib/consent'

type Line = {
  name: string
  description?: string
  image?: string
  price: number
}

const usd = (amount: number) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function OfferCheckout({
  token,
  greeting,
  percentOff,
  discountNote,
  lines,
}: {
  token: string
  greeting: string
  percentOff: number
  discountNote: string
  lines: Line[]
}) {
  const checkoutRef = useRef<HTMLDivElement>(null)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = lines.reduce((sum, line) => sum + line.price, 0)
  const discount = (subtotal * percentOff) / 100
  const total = subtotal - discount

  useEffect(() => {
    if (!stripeLoaded || !checkoutRef.current) return

    let checkout: any
    let cancelled = false

    const initialize = async () => {
      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (!publishableKey) throw new Error('Checkout is not configured. Please contact us.')

        const fetchClientSecret = async () => {
          const response = await fetch('/api/create-offer-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, analyticsConsent: getEffectiveConsent() }),
          })
          const data = await response.json().catch(() => ({}))
          if (!response.ok || !data.client_secret) {
            throw new Error(data.error || 'We could not open checkout. Please refresh the page.')
          }
          return data.client_secret as string
        }

        // Fetch first so a used or invalid offer shows our message, not Stripe's.
        const clientSecret = await fetchClientSecret()
        if (cancelled) return

        checkout = await window.Stripe(publishableKey).initEmbeddedCheckout({
          fetchClientSecret: async () => clientSecret,
        })
        if (cancelled) {
          checkout.destroy()
          return
        }
        checkout.mount(checkoutRef.current)
        setMounted(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'We could not open checkout. Please refresh the page.')
      }
    }

    const timeoutId = setTimeout(initialize, 100)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      try {
        checkout?.destroy()
      } catch {
        // Ignore destroy errors
      }
    }
  }, [stripeLoaded, token])

  return (
    <>
      <Script
        src="https://js.stripe.com/clover/stripe.js"
        strategy="afterInteractive"
        onLoad={() => setStripeLoaded(true)}
        onError={() => setError('Stripe could not load. Please refresh the page.')}
      />
      <Header />
      <main className="hx-mobile-checkout min-h-screen bg-transparent pt-24 text-neutral-100">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row lg:px-8">
          <div className="min-w-0 flex-1 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,27,0.96),rgba(10,10,12,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:p-8">
            <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{greeting}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
              {discountNote} Pay by card, Affirm or Klarna through Stripe.
            </p>

            <div className="mt-6">
              {error ? (
                <div role="alert" className="rounded-2xl border border-red-500/50 bg-red-900/20 p-6">
                  <p className="mb-2 font-semibold text-red-300">Checkout is unavailable</p>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              ) : (
                <>
                  {!mounted ? (
                    <div className="space-y-4 py-10">
                      <div className="h-14 animate-pulse rounded-2xl bg-white/6" />
                      <div className="h-14 animate-pulse rounded-2xl bg-white/6" />
                      <div className="h-44 animate-pulse rounded-3xl bg-white/6" />
                      <p className="text-sm text-neutral-400">Loading secure Stripe checkout...</p>
                    </div>
                  ) : null}
                  <div
                    id="checkout"
                    ref={checkoutRef}
                    className={mounted ? 'min-h-[600px] overflow-hidden rounded-[28px] border border-white/8 bg-[#f4eeea]' : 'hidden'}
                  />
                </>
              )}
            </div>
          </div>

          <aside className="w-full rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(8,8,10,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:sticky lg:top-28 lg:max-w-sm lg:self-start">
            <h2 className="mb-4 text-sm font-semibold text-neutral-100">Your order</h2>

            <ul className="mb-6 space-y-4 text-sm text-neutral-200">
              {lines.map((line) => (
                <li key={line.name} className="flex gap-4 rounded-2xl border border-white/8 bg-black/35 p-4">
                  {line.image ? (
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{line.name}</p>
                    {line.description ? (
                      <p className="mt-1 text-xs text-neutral-300">{line.description}</p>
                    ) : null}
                    <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
                      <span className="font-semibold text-neutral-50">{usd(line.price * (1 - percentOff / 100))}</span>
                      <s className="text-xs text-neutral-400">{usd(line.price)}</s>
                      <span className="text-xs text-emerald-200">{percentOff}% off</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-white/10 pt-4 text-sm text-neutral-300">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{usd(subtotal)}</dd>
              </div>
              {lines.map((line) => (
                <div key={line.name} className="flex items-center justify-between gap-4 text-emerald-200">
                  <dt>{percentOff}% off {line.name.replace(/ LED Headlight$/, '')}</dt>
                  <dd className="tabular-nums">-{usd((line.price * percentOff) / 100)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className="text-emerald-200">Included</dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-neutral-50">
                <dt className="font-semibold">Total</dt>
                <dd className="text-lg font-semibold tabular-nums">{usd(total)}</dd>
              </div>
            </dl>

            <AfterCheckoutSteps lightsOnly className="mt-6 border-t border-white/10 pt-5" />

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="text-sm font-medium text-neutral-50">Questions before you pay?</p>
              <AskSpecialistButton
                source="offer_checkout"
                className="hx-ask-cta mt-3 flex min-h-11 w-full items-center justify-between rounded-full border border-emerald-200/30 bg-emerald-200/10 px-4 text-sm font-semibold text-white transition hover:border-emerald-200/60 hover:bg-emerald-200/15"
              >
                <span>Ask a loupe specialist</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </AskSpecialistButton>
              <CopyEmail
                className="mt-3 text-xs text-neutral-300"
                buttonClassName="border border-white/15 text-neutral-200 hover:border-emerald-200/60 hover:text-white"
              />
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}
