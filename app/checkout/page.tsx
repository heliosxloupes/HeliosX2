'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import Header from '@/components/Header'
import { getCart } from '@/lib/cart'

type CartItem = {
  productSlug: string
  name: string
  shortName?: string
  image?: string
  price: number
  quantity: number
  frameStyle?: string
  frameColor?: string
  magnification?: string
  // add-on related:
  isAddon?: boolean
  stripePriceId?: string
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const cart = getCart() as CartItem[] | undefined
    if (!cart || !cart.length) {
      router.replace('/cart')
      return
    }

    let mergedItems: CartItem[] = [...cart]

    // Read add-ons from sessionStorage (set in /cart)
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('heliosx_addons')
      if (raw) {
        try {
          const flags = JSON.parse(raw) as {
            prescription?: boolean
            warranty?: boolean
          }

          if (flags.prescription) {
            mergedItems.push({
              productSlug: 'prescription-lenses',
              name: 'Prescription Lenses',
              price: 0, // actual price comes from Stripe price ID
              quantity: 1,
              isAddon: true,
              stripePriceId:
                process.env.NEXT_PUBLIC_STRIPE_PRICE_PRESCRIPTION,
            })
          }

          if (flags.warranty) {
            mergedItems.push({
              productSlug: 'extended-warranty',
              name: 'Extended Warranty',
              price: 0,
              quantity: 1,
              isAddon: true,
              stripePriceId:
                process.env.NEXT_PUBLIC_STRIPE_PRICE_WARRANTY,
            })
          }
        } catch (e) {
          console.error('Failed to parse add-on flags', e)
        }
      }
    }

    setItems(mergedItems)
  }, [router])

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.isAddon ? 0 : item.quantity),
    0
  )

  const handleStripeCheckout = async () => {
    if (!items.length || loading) return

    setLoading(true)

    try {
      const stripe = await stripePromise
      if (!stripe) {
        console.error('Stripe failed to load')
        setLoading(false)
        return
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      if (!res.ok) {
        console.error('Failed to create checkout session')
        setLoading(false)
        return
      }

      const data = await res.json()

      const { error } = await (stripe as any).redirectToCheckout({
        sessionId: data.id,
      })

      if (error) {
        console.error(error.message)
      }
    } catch (err) {
      console.error('Stripe checkout error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row lg:px-8">
          <div className="flex-1 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)]">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Payment
            </p>
            <h1 className="mt-2 text-2xl font-semibold lg:text-3xl">
              Secure checkout
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              You&apos;ll complete payment in Stripe&apos;s encrypted checkout.
              All orders here are in test mode.
            </p>

            <div className="mt-6 space-y-4 text-sm text-neutral-200">
              {items.map((item, idx) => (
                <div
                  key={`${item.productSlug}-${idx}`}
                  className="rounded-2xl bg-black/50 p-4"
                >
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400">
                    {item.isAddon
                      ? 'Add-on'
                      : item.shortName ?? item.productSlug}
                  </p>
                  <p className="mt-1 text-sm font-medium">{item.name}</p>
                  {!item.isAddon && (
                    <>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-neutral-300">
                        {item.magnification && (
                          <span>Mag: {item.magnification}</span>
                        )}
                        {item.frameStyle && (
                          <span>Frame: {item.frameStyle}</span>
                        )}
                        {item.frameColor && (
                          <span>Color: {item.frameColor}</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-neutral-300">
                        <span>Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold text-neutral-50">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  {item.isAddon && (
                    <p className="mt-1 text-[0.7rem] text-neutral-400">
                      Billed via linked Stripe price ID.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Total (excluding add-ons shown on Stripe)
            </h2>
            <div className="mb-3 flex items-center justify-between text-sm text-neutral-300">
              <span>Base loupes subtotal</span>
              <span className="text-lg font-semibold text-neutral-50">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="mb-4 text-[0.7rem] text-neutral-400">
              Final itemized total, including prescription lenses and extended
              warranty, will be displayed directly in Stripe.
            </p>
            <button
              onClick={handleStripeCheckout}
              disabled={loading || !items.length}
              className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:translate-y-[1px] hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-neutral-200 disabled:shadow-none"
            >
              {loading ? 'Redirecting…' : 'Pay with Stripe (test mode)'}
            </button>
            <p className="mt-3 text-[0.65rem] text-neutral-500">
              Use Stripe test cards (e.g. 4242 4242 4242 4242, any future date,
              any CVC) while you&apos;re in development.
            </p>
          </aside>
        </section>
      </main>
    </>
  )
}
