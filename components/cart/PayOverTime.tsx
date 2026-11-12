'use client'

import { useEffect, useState } from 'react'

type Plan = {
  key: string
  label: string
  rate: string
  free: boolean
  amount: string
  per: string
}

type Logo = { name: string; dark: string; light: string }

type Offer = {
  monthly: string | null
  promo: string
  plans: Plan[]
  logos: Logo[]
}

const STATIC_HOST = 'https://b.stripecdn.com/'

const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

// Stripe sends rates in basis points: 999 is 9.99%.
const percent = (bps: number) => `${(bps / 100).toFixed(2).replace(/\.?0+$/, '')}%`

function readPlans(data: any): Plan[] {
  const best = new Map<string, { n: number; unit: string; every: number; amount: number; rate: number }>()
  for (const group of data?.payment_plan_groups ?? []) {
    for (const plan of group?.payment_plans ?? []) {
      const n = plan?.number_of_installments
      const amount = plan?.installment_amount
      const unit = plan?.interval?.unit
      if (typeof n !== 'number' || typeof amount !== 'number' || (unit !== 'week' && unit !== 'month')) continue
      const key = `${unit}-${n}`
      const seen = best.get(key)
      // Klarna and Affirm can both offer the same term. Show the cheaper one.
      if (!seen || amount < seen.amount) {
        best.set(key, { n, unit, every: plan.interval.frequency ?? 1, amount, rate: plan.interest_rate ?? 0 })
      }
    }
  }

  const all = Array.from(best.values())
  const split = all.filter((p) => p.unit === 'week').sort((a, b) => a.n - b.n)
  let monthly = all.filter((p) => p.unit === 'month').sort((a, b) => a.n - b.n)
  // Nobody picks a shorter term that charges interest when a longer one is free.
  const longestFree = Math.max(0, ...monthly.filter((p) => p.rate === 0).map((p) => p.n))
  monthly = monthly.filter((p) => p.rate === 0 || p.n > longestFree)
  // Keep the list short: the two shortest and the two longest terms.
  if (monthly.length > 4) monthly = [...monthly.slice(0, 2), ...monthly.slice(-2)]

  return [
    ...split.map((p) => ({
      key: `week-${p.n}`,
      label: `Pay in ${p.n}`,
      rate: `${p.rate === 0 ? '0%' : `${percent(p.rate)} APR`} · every ${p.every === 1 ? 'week' : `${p.every} weeks`}`,
      free: p.rate === 0,
      amount: money(p.amount),
      per: '',
    })),
    ...monthly.map((p) => ({
      key: `month-${p.n}`,
      label: `${p.n} months`,
      rate: `${percent(p.rate)} APR`,
      free: p.rate === 0,
      amount: money(p.amount),
      per: '/mo',
    })),
  ]
}

function readLogos(data: any): Logo[] {
  const logos: Logo[] = []
  for (const image of data?.content?.images ?? []) {
    const dark = image?.dark_theme_svg?.url
    const light = image?.light_theme_svg?.url
    if (image?.role !== 'logo' || typeof dark !== 'string' || typeof light !== 'string') continue
    if (!dark.startsWith(STATIC_HOST) || !light.startsWith(STATIC_HOST)) continue
    logos.push({ name: typeof image.text === 'string' ? image.text : '', dark, light })
  }
  return logos
}

// Shows what the order costs when it is split into payments. The figures come
// from Stripe's payment method messaging service (the same source as Stripe's
// own messaging element), so they are the real Klarna and Affirm plans for
// this amount on this account, never a number we invented. If Stripe has
// nothing to show, the plain line stays, which is true for every order.
// The host must stay in connect-src in next.config.js.
export default function PayOverTime({ amount }: { amount: number }) {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const cents = Math.round(amount * 100)
    if (!key || cents <= 0) {
      setOffer(null)
      setLoading(false)
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
    setLoading(true)
    fetch(`https://ppm.stripe.com/config?${query}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const promo: unknown = data?.content?.promotion?.message
        if (typeof promo !== 'string' || !promo) {
          setOffer(null)
        } else {
          setOffer({
            monthly: promo.match(/\$[\d,]+(?:\.\d{2})?(?=\s*\/\s*month)/)?.[0] ?? null,
            promo,
            plans: readPlans(data),
            logos: readLogos(data),
          })
        }
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setOffer(null)
        setLoading(false)
      })

    return () => controller.abort()
  }, [amount])

  return (
    <section
      aria-label="Pay over time"
      className="hx-pay-over-time mt-5 rounded-2xl border border-white/10 bg-black/35 p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400">Pay over time</p>
        {offer?.logos.length ? (
          <div className="flex items-center gap-2">
            {offer.logos.map((logo) => (
              <span key={logo.dark} className="block h-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.dark} alt={logo.name} className="hidden h-5 w-auto md:block" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.light} alt={logo.name} className="h-5 w-auto md:hidden" />
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400">Klarna · Affirm</p>
        )}
      </div>

      {loading ? (
        <div aria-hidden="true" className="mt-4 h-10 w-40 rounded-lg bg-white/5 motion-safe:animate-pulse" />
      ) : offer?.monthly ? (
        <p className="mt-3 flex items-baseline gap-2 text-neutral-50">
          <span className="text-sm text-neutral-400">From</span>
          <span className="text-5xl font-semibold leading-none tracking-tight tabular-nums">{offer.monthly}</span>
          <span className="text-lg text-neutral-400">/mo</span>
        </p>
      ) : offer ? (
        <p className="mt-3 text-xl font-semibold leading-snug text-neutral-50">{offer.promo}</p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-neutral-100">
          Split this order into smaller payments with Klarna or Affirm. Choose either one at the payment step.
        </p>
      )}

      {offer?.plans.length ? (
        <ul className="mt-4">
          {offer.plans.map((plan) => (
            <li
              key={plan.key}
              className="flex items-baseline justify-between gap-3 border-t border-white/10 py-2.5 text-sm"
            >
              <span className="min-w-0">
                <span className="text-neutral-100">{plan.label}</span>
                <span className={`ml-2 text-xs ${plan.free ? 'text-emerald-200' : 'text-neutral-400'}`}>
                  {plan.rate}
                </span>
              </span>
              <span className="shrink-0 font-medium tabular-nums text-neutral-50">
                {plan.amount}
                {plan.per ? <span className="font-normal text-neutral-400">{plan.per}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {loading ? null : (
        <p
          className={`text-[0.72rem] leading-5 text-neutral-400 ${
            offer?.plans.length ? 'border-t border-white/10 pt-3' : 'mt-2'
          }`}
        >
          {offer
            ? 'Choose Klarna or Affirm at the payment step. Example plans before tax. Your rate, from 0 to 36% APR, depends on approval.'
            : 'Approval and terms are set by Klarna or Affirm.'}
        </p>
      )}
    </section>
  )
}
