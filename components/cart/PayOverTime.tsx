'use client'

import { useEffect, useState } from 'react'

type Offer = {
  monthly: string | null
  promo: string
  summary: string | null
  plansUrl: string | null
}

// Shows what the order costs when it is split into payments. The figures come
// from Stripe's payment method messaging service (the same source as Stripe's
// own messaging element), so they are the real Klarna and Affirm offers for
// this amount on this account, never a number we invented. If Stripe has
// nothing to show, the plain line stays, which is true for every order.
// The host must stay in connect-src in next.config.js.
export default function PayOverTime({ amount }: { amount: number }) {
  const [offer, setOffer] = useState<Offer | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const cents = Math.round(amount * 100)
    if (!key || cents <= 0) {
      setOffer(null)
      return
    }

    const controller = new AbortController()
    const query = new URLSearchParams({
      key,
      amount: String(cents),
      currency: 'USD',
      country: 'US',
      locale: 'en',
    })
    fetch(`https://ppm.stripe.com/config?${query}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const promo: unknown = data?.content?.promotion?.message
        if (typeof promo !== 'string' || !promo) {
          setOffer(null)
          return
        }
        const summary: unknown = data?.content?.summary?.message
        const plansUrl: unknown = data?.content?.learn_more?.url
        setOffer({
          monthly: promo.match(/\$[\d,]+(?:\.\d{2})?(?=\s*\/\s*month)/)?.[0] ?? null,
          promo,
          summary: typeof summary === 'string' ? summary : null,
          plansUrl: typeof plansUrl === 'string' && plansUrl.startsWith('https://') ? plansUrl : null,
        })
      })
      .catch(() => {
        if (!controller.signal.aborted) setOffer(null)
      })

    return () => controller.abort()
  }, [amount])

  return (
    <div className="hx-pay-over-time mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400">Or pay over time</p>
        <p className="text-[11px] font-medium text-neutral-300">Klarna · Affirm</p>
      </div>

      {offer?.monthly ? (
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-neutral-100">
          <span className="text-sm text-neutral-300">As low as</span>
          <span className="text-4xl font-semibold leading-none tabular-nums">{offer.monthly}</span>
          <span className="text-base font-medium text-neutral-300">/ month</span>
        </p>
      ) : offer ? (
        <p className="mt-2 text-lg font-semibold leading-snug text-neutral-100">{offer.promo}</p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-neutral-100">
          Split this order into smaller payments with Klarna or Affirm. Choose either one at the payment step.
        </p>
      )}

      {offer?.summary ? <p className="mt-2 text-sm leading-6 text-neutral-200">{offer.summary}</p> : null}

      <p className="mt-2 text-[0.72rem] leading-5 text-neutral-400">
        {offer
          ? 'Choose Klarna or Affirm at the payment step. Estimate before tax. Rates from 0 to 36% APR, subject to approval. '
          : 'Approval and terms are set by Klarna or Affirm.'}
        {offer?.plansUrl ? (
          <a
            href={offer.plansUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-100 underline underline-offset-2"
          >
            See plans
          </a>
        ) : null}
      </p>
    </div>
  )
}
