'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Image from 'next/image'
import Header from '@/components/Header'
import { getCart } from '@/lib/cart'
import { PRESCRIPTION_PRICE, WARRANTY_PRICE } from '@/lib/pricing'

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
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    const cart = getCart() as CartItem[] | undefined
    if (!cart || !cart.length) {
      router.replace('/cart')
      return
    }

    const savedEmail = window.localStorage.getItem('heliosx_customer_email') ?? ''
    if (!/^\S+@\S+\.\S+$/.test(savedEmail)) {
      router.replace('/cart')
      return
    }
    setCustomerEmail(savedEmail)

    let mergedItems: CartItem[] = [...cart]

    // Read add-ons from sessionStorage (set in /cart).
    // Only the slug travels; the checkout API prices these from lib/pricing.json.
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
              price: PRESCRIPTION_PRICE,
              quantity: 1,
              isAddon: true,
            })
          }

          if (flags.warranty) {
            mergedItems.push({
              productSlug: 'extended-warranty',
              name: 'Extended Warranty',
              price: WARRANTY_PRICE,
              quantity: 1,
              isAddon: true,
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
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  useEffect(() => {
    if (!items.length || !stripeLoaded || !checkoutRef.current || !customerEmail) {
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
          console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Please configure it in your environment variables.')
          throw new Error('Stripe publishable key not found. Please check your environment variables (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) in Vercel settings.')
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
          }
        })

        const fetchClientSecret = async () => {
          const cartSessionId = window.localStorage.getItem('heliosx_cart_session_id') ?? ''
          await fetch('/api/cart-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: customerEmail,
              cartItems: apiItems,
              stage: 'checkout',
              cartSessionId,
            }),
          })
            .then((response) => response.json())
            .then((payload) => {
              if (payload?.cartSessionId) {
                window.localStorage.setItem('heliosx_cart_session_id', payload.cartSessionId)
              }
            })
            .catch(() => null)

          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: apiItems,
              customerEmail,
              cartSessionId: window.localStorage.getItem('heliosx_cart_session_id') ?? '',
            }),
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
  }, [items, stripeLoaded, customerEmail])

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
      <main className="pt-24 min-h-screen bg-transparent text-neutral-100">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row lg:px-8">
          {/* Left Column - Stripe Embedded Checkout */}
          <div className="flex-1 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,27,0.96),rgba(10,10,12,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
              Payment
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">
              Secure checkout
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
              Review your order and complete payment securely with Stripe&apos;s embedded checkout.
            </p>
            <p className="mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-100">
              Risk-free. Fully refundable before measurements are provided.
            </p>

            <div className="mt-6">
              {error ? (
                <div className="rounded-2xl border border-red-500/50 bg-red-900/20 p-6">
                  <p className="text-red-400 font-semibold mb-2">Error loading checkout</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              ) : loading ? (
                <div className="space-y-4 py-10">
                  <div className="h-5 w-36 animate-pulse rounded-full bg-white/8" />
                  <div className="grid gap-3">
                    <div className="h-14 animate-pulse rounded-2xl bg-white/6" />
                    <div className="h-14 animate-pulse rounded-2xl bg-white/6" />
                    <div className="h-44 animate-pulse rounded-3xl bg-white/6" />
                  </div>
                  <div className="text-sm text-neutral-500">Loading secure Stripe checkout...</div>
                </div>
              ) : (
                <div 
                  id="checkout" 
                  ref={checkoutRef}
                  className="min-h-[600px] overflow-hidden rounded-[28px] border border-white/8 bg-[#f4eeea]"
                ></div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="w-full max-w-sm rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(8,8,10,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Order summary
            </h2>

            <div className="mb-6 space-y-4 text-sm text-neutral-200">
              {items.map((item, idx) => (
                <div
                  key={`${item.productSlug}-${idx}`}
                  className="rounded-2xl border border-white/8 bg-black/35 p-4 backdrop-blur-sm"
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
              <p className="text-[0.72rem] leading-5 text-neutral-400">
                Final itemized totals, including prescription lenses and extended
                warranty, are confirmed directly inside Stripe before payment.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}
