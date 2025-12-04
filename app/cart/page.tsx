'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
}

const PRESCRIPTION_ESTIMATE = 200 // USD – for cart display
const WARRANTY_ESTIMATE = 99     // USD – for cart display

// If your cart library uses a different key, change this to match
const CART_STORAGE_KEY = 'heliosx_cart'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [includePrescription, setIncludePrescription] = useState(false)
  const [includeWarranty, setIncludeWarranty] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const cart = getCart() as CartItem[] | undefined
      setItems(cart ?? [])
    } catch (err) {
      console.error('Error reading cart', err)
      setItems([])
    }
  }, [])

  const saveCart = (updated: CartItem[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated))
      // Dispatch event so other components (like CartButton) can update
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (err) {
      console.error('Error saving cart', err)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index)
      saveCart(next)
      return next
    })
  }

  const baseSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const addOnTotal =
    (includePrescription ? PRESCRIPTION_ESTIMATE : 0) +
    (includeWarranty ? WARRANTY_ESTIMATE : 0)

  const subtotal = baseSubtotal + addOnTotal

  const handleCheckout = () => {
    if (!items.length) return

    // Persist add-on choices so /checkout can pick them up
    if (typeof window !== 'undefined') {
      const payload = {
        prescription: includePrescription,
        warranty: includeWarranty,
      }
      sessionStorage.setItem('heliosx_addons', JSON.stringify(payload))
    }

    router.push('/checkout')
  }

  const handleEditConfig = () => {
    router.push('/product/galileo')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-16 pt-8 lg:grid-cols-[3fr,2.2fr] lg:px-8 lg:pt-10">
          {/* LEFT – hero image */}
          <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.75)] lg:min-h-[520px]">
            <Image
              src="/Galileo/GalileoMain2.png"
              alt="Galileo loupes hero"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 space-y-1 text-sm text-neutral-100">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-300/80">
                Cart
              </p>
              <h1 className="text-2xl font-semibold lg:text-3xl">
                Review your configuration
              </h1>
              <p className="max-w-md text-xs text-neutral-300/80 lg:text-sm">
                Confirm your loupe system and any add-ons before proceeding to
                secure Stripe checkout.
              </p>
            </div>
          </div>

          {/* RIGHT – cart summary + add-ons */}
          <aside className="flex flex-col gap-6">
            {/* Main cart content */}
            <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Order summary
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleEditConfig}
                    className="text-[0.7rem] uppercase tracking-[0.18em] text-neutral-300 underline-offset-4 hover:underline"
                  >
                    Edit selection
                  </button>
                )}
              </div>

              {!items.length ? (
                <p className="text-sm text-neutral-400">
                  Your cart is empty. Select a system from the product page to
                  continue.
                </p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item, idx) => (
                    <li
                      key={`${item.productSlug}-${idx}`}
                      className="flex gap-4 rounded-2xl bg-black/40 p-4"
                    >
                      <div className="relative h-20 w-28 overflow-hidden rounded-2xl bg-neutral-800">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between text-xs lg:text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400">
                              {item.shortName ?? item.productSlug}
                            </p>
                            <p className="mt-1 text-sm font-medium text-neutral-50">
                              {item.name}
                            </p>
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
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[0.65rem] text-neutral-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-neutral-300">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-sm font-semibold text-neutral-50">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add-ons */}
            <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Optional add-ons
              </h3>

              <div className="space-y-4 text-sm text-neutral-200">
                {/* Prescription lenses */}
                <button
                  type="button"
                  onClick={() =>
                    setIncludePrescription((prev) => !prev)
                  }
                  className={`flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    includePrescription
                      ? 'border-white/70 bg-white/10'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                      Prescription lenses
                    </p>
                    <p className="mt-1 text-sm text-neutral-100">
                      Integrate your spectacle Rx directly into the system.
                    </p>
                    <p className="mt-1 text-[0.7rem] text-neutral-400">
                      You&apos;ll upload your prescription and PD after
                      checkout.
                    </p>
                  </div>
                  <span className="ml-4 whitespace-nowrap text-sm font-semibold text-neutral-50">
                    +${PRESCRIPTION_ESTIMATE}
                  </span>
                </button>

                {/* Extended warranty */}
                <button
                  type="button"
                  onClick={() => setIncludeWarranty((prev) => !prev)}
                  className={`flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    includeWarranty
                      ? 'border-white/70 bg-white/10'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                      Extended warranty
                    </p>
                    <p className="mt-1 text-sm text-neutral-100">
                      Extra coverage beyond the standard manufacturing
                      warranty.
                    </p>
                    <p className="mt-1 text-[0.7rem] text-neutral-400">
                      Covers qualifying defects and select repairs within the
                      extended term.
                    </p>
                  </div>
                  <span className="ml-4 whitespace-nowrap text-sm font-semibold text-neutral-50">
                    +${WARRANTY_ESTIMATE}
                  </span>
                </button>
              </div>
            </div>

            {/* Totals + CTA */}
            <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-300">
                <span>Items subtotal</span>
                <span>${baseSubtotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
                <span>Add-ons</span>
                <span>${addOnTotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-neutral-50">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button
                disabled={!items.length}
                onClick={handleCheckout}
                className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:translate-y-[1px] hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-neutral-200 disabled:shadow-none"
              >
                Proceed to payment
              </button>
              <p className="mt-3 text-[0.65rem] text-neutral-500">
                Test mode only – payments are processed in Stripe&apos;s sandbox
                environment.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}
