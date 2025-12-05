'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
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
  selectedFrameName?: string
  selectedMagnification?: string
  isAddon?: boolean
  stripePriceId?: string
}

declare global {
  interface Window {
    Stripe: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const checkoutRef = useRef<HTMLDivElement>(null)
  const checkoutInstanceRef = useRef<any>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            const prescriptionPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRESCRIPTION
            if (prescriptionPriceId && prescriptionPriceId !== 'price_xxx_prescription') {
              mergedItems.push({
                productSlug: 'prescription-lenses',
                name: 'Prescription Lenses',
                price: 0,
                quantity: 1,
                isAddon: true,
                stripePriceId: prescriptionPriceId,
              })
            } else {
              console.warn('Prescription price ID not configured, skipping add-on')
            }
          }

          if (flags.warranty) {
            const warrantyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_WARRANTY
            if (warrantyPriceId && warrantyPriceId !== 'price_xxx_warranty') {
              mergedItems.push({
                productSlug: 'extended-warranty',
                name: 'Extended Warranty',
                price: 0,
                quantity: 1,
                isAddon: true,
                stripePriceId: warrantyPriceId,
              })
            } else {
              console.warn('Warranty price ID not configured, skipping add-on')
            }
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

  useEffect(() => {
    if (!items.length || !stripeLoaded || !checkoutRef.current) {
      if (!items.length) {
        setLoading(false)
      }
      return
    }

    const initialize = async () => {
      try {
        // Destroy existing checkout instance if it exists
        if (checkoutInstanceRef.current) {
          try {
            checkoutInstanceRef.current.destroy()
          } catch (e) {
            // Ignore destroy errors
          }
          checkoutInstanceRef.current = null
        }

        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (!publishableKey) {
          throw new Error('Stripe publishable key not found')
        }

        const stripe = window.Stripe(publishableKey)
        if (!stripe) {
          throw new Error('Failed to initialize Stripe')
        }

        // Map cart items to API format
        const apiItems = items.map(item => {
          // Parse frame style and color from selectedFrameName if available
          let frameStyle = item.frameStyle
          let frameColor = item.frameColor
          
          if (!frameStyle && item.selectedFrameName) {
            // Try to parse "FrameName Color" format
            const parts = item.selectedFrameName.split(' ')
            if (parts.length >= 2) {
              frameStyle = parts[0]
              frameColor = parts.slice(1).join(' ')
            } else {
              frameStyle = item.selectedFrameName
            }
          }
          
          return {
            productSlug: item.productSlug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            frameStyle: frameStyle || item.frameStyle,
            frameColor: frameColor || item.frameColor,
            magnification: item.magnification || item.selectedMagnification || undefined,
            isAddon: item.isAddon || false,
            stripePriceId: item.stripePriceId || undefined,
          }
        })

        const fetchClientSecret = async () => {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: apiItems }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to create checkout session')
          }

          const data = await response.json()
          if (!data.client_secret) {
            throw new Error('No client_secret in response')
          }
          return data.client_secret
        }

        const checkout = await stripe.initEmbeddedCheckout({
          fetchClientSecret,
        })

        checkoutInstanceRef.current = checkout
        checkout.mount(checkoutRef.current)
        setLoading(false)
        setError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('Error initializing checkout:', error)
        setError(errorMessage)
        setLoading(false)
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initialize()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (checkoutInstanceRef.current) {
        try {
          checkoutInstanceRef.current.destroy()
        } catch (e) {
          // Ignore destroy errors
        }
      }
    }
  }, [items, stripeLoaded])

  return (
    <>
      <Script
        src="https://js.stripe.com/clover/stripe.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Stripe script loaded')
          setStripeLoaded(true)
        }}
        onError={() => {
          console.error('Failed to load Stripe script')
          setError('Failed to load Stripe. Please refresh the page.')
          setLoading(false)
        }}
      />
      <Header />
      <main className="pt-24 min-h-screen bg-black text-neutral-100">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row lg:px-8">
          {/* Left Column - Stripe Embedded Checkout */}
          <div className="flex-1 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)]">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Payment
            </p>
            <h1 className="mt-2 text-2xl font-semibold lg:text-3xl">
              Secure checkout
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              Complete your payment securely with Stripe.
            </p>

            <div className="mt-6">
              {error ? (
                <div className="rounded-2xl bg-red-900/20 border border-red-500/50 p-6">
                  <p className="text-red-400 font-semibold mb-2">Error loading checkout</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-neutral-400">Loading checkout...</div>
                </div>
              ) : (
                <div 
                  id="checkout" 
                  ref={checkoutRef}
                  className="min-h-[600px]"
                ></div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Order summary
            </h2>

            <div className="mb-6 space-y-4 text-sm text-neutral-200">
              {items.map((item, idx) => (
                <div
                  key={`${item.productSlug}-${idx}`}
                  className="rounded-2xl bg-black/50 p-4"
                >
                  <div className="flex gap-4">
                    {item.image && (
                      <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-neutral-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
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
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center justify-between text-sm text-neutral-300">
                <span>Base loupes subtotal</span>
                <span className="text-lg font-semibold text-neutral-50">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[0.7rem] text-neutral-400">
                Final itemized total, including prescription lenses and extended
                warranty, will be displayed directly in Stripe.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}
