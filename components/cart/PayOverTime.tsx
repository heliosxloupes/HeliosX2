'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarClock } from 'lucide-react'

// Shows what the order costs when it is split into payments. The figures come
// from Stripe's Payment Method Messaging Element, so they are the real Klarna
// and Affirm offers for this amount, never an estimate we invented. If Stripe
// has nothing to show (amount out of range, script blocked), the plain line
// stays, which is true for every order.
export default function PayOverTime({ amount, stripeReady }: { amount: number; stripeReady: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const node = mountRef.current
    const Stripe = (window as any).Stripe
    if (!stripeReady || !key || !node || !Stripe || amount <= 0) return

    let element: any = null
    let cancelled = false
    try {
      // Phones render this page on a light surface (mobile-v2.css).
      const light = window.matchMedia('(max-width: 767px)').matches
      const elements = Stripe(key).elements({
        appearance: {
          theme: light ? 'stripe' : 'night',
          variables: {
            colorText: light ? '#0f172a' : '#f5f5f5',
            colorTextSecondary: light ? '#475569' : '#d4d4d4',
            colorBackground: 'transparent',
            fontSizeBase: '15px',
          },
        },
      })
      element = elements.create('paymentMethodMessaging', {
        amount: Math.round(amount * 100),
        currency: 'USD',
        countryCode: 'US',
        paymentMethodTypes: ['klarna', 'affirm'],
      })
      element.on('ready', () => {
        // Give the iframe a beat to size itself; an empty one means no offer.
        // The mount node is collapsed until then, so measure the iframe itself.
        let tries = 0
        const check = () => {
          if (cancelled) return
          const frame = node.querySelector('iframe')
          if (frame && frame.offsetHeight > 20) setLive(true)
          else if (++tries < 12) window.setTimeout(check, 250)
        }
        window.setTimeout(check, 250)
      })
      element.mount(node)
    } catch {
      element = null
    }

    return () => {
      cancelled = true
      setLive(false)
      try {
        element?.destroy()
      } catch {
        // Already gone.
      }
    }
  }, [amount, stripeReady])

  return (
    <div className="hx-pay-over-time mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3.5">
      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
        <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
        Or pay over time
      </p>
      <div ref={mountRef} className={live ? 'mt-2.5' : 'h-0 overflow-hidden'} />
      {live ? null : (
        <p className="mt-2 text-sm leading-6 text-neutral-100">
          Split this order into smaller payments with Klarna or Affirm. Choose either one at the payment step.
        </p>
      )}
      <p className="mt-2 text-[0.72rem] leading-5 text-neutral-400">
        Approval and terms are set by Klarna or Affirm.
      </p>
    </div>
  )
}
