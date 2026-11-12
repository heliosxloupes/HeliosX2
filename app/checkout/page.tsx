'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Image from 'next/image'
import { ArrowRight, Check, Lock } from 'lucide-react'
import AfterCheckoutSteps from '@/components/cart/AfterCheckoutSteps'
import AskSpecialistButton from '@/components/Contact/AskSpecialistButton'
import CopyEmail from '@/components/Contact/CopyEmail'
import Header from '@/components/Header'
import { getCart } from '@/lib/cart'
import { getEffectiveConsent } from '@/lib/consent'
import { PRESCRIPTION_PRICE, lineUnitPrice } from '@/lib/pricing'

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
  hasPrescriptionLenses?: boolean
  isLight?: boolean
  lightOption?: string
  lightOptionName?: string
}

declare global {
  interface Window {
    Stripe: any
  }
}

const usd = (amount: number) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

// Two short steps. With an email the first step is done and shows the address.
function CheckoutSteps({ email, onChange }: { email?: string; onChange?: () => void }) {
  const done = Boolean(email)
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8rem] font-medium">
      <li className="flex min-w-0 items-center gap-2 text-neutral-100">
        <span className="hx-step-dot grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-300 text-[0.68rem] font-semibold tabular-nums text-neutral-950">
          {done ? <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} /> : '1'}
        </span>
        <span className="truncate">{done ? email : 'Email'}</span>
        {done && onChange && (
          <button
            type="button"
            onClick={onChange}
            className="text-neutral-400 underline decoration-white/25 underline-offset-4 transition-colors duration-150 hover:text-neutral-100"
          >
            Change
          </button>
        )}
      </li>
      <li aria-hidden="true" className="h-px w-8 bg-current text-neutral-500 opacity-50" />
      <li className={`flex items-center gap-2 ${done ? 'text-neutral-100' : 'text-neutral-500'}`}>
        <span
          className={`hx-step-dot grid h-5 w-5 place-items-center rounded-full text-[0.68rem] font-semibold tabular-nums ${
            done ? 'bg-emerald-300 text-neutral-950' : 'hx-step-dot-idle border border-white/25'
          }`}
        >
          2
        </span>
        Payment
      </li>
    </ol>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const checkoutRef = useRef<HTMLDivElement>(null)
  const checkoutInstanceRef = useRef<any>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // null until read from storage; '' means the shopper skipped the email.
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  const [emailDraft, setEmailDraft] = useState('')
  const [emailError, setEmailError] = useState('')

  // Email comes first so a shopper who leaves at the payment form can still be
  // sent their saved checkout. Stripe then opens with it already filled in.
  const submitEmail = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = emailDraft.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setEmailError('Check your email address.')
      return
    }
    setEmailError('')
    window.localStorage.setItem('heliosx_customer_email', normalized)
    setCustomerEmail(normalized)
  }

  const changeEmail = () => {
    setEmailDraft(customerEmail ?? '')
    window.localStorage.removeItem('heliosx_customer_email')
    setCustomerEmail('')
  }

  useEffect(() => {
    const cart = getCart() as CartItem[] | undefined
    if (!cart || !cart.length) {
      router.replace('/cart')
      return
    }

    const savedEmail = window.localStorage.getItem('heliosx_customer_email') ?? ''
    setCustomerEmail(/^\S+@\S+\.\S+$/.test(savedEmail) ? savedEmail : '')

    let mergedItems: CartItem[] = [...cart]

    // Read add-ons from sessionStorage (set in /cart).
    // Only the slug travels; the checkout API prices these from lib/pricing.json.
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('heliosx_addons')
      if (raw) {
        try {
          const flags = JSON.parse(raw) as {
            prescription?: boolean
            prescriptionQuantity?: number
            warranty?: boolean
          }

          const prescriptionQuantity = Number.isFinite(flags.prescriptionQuantity)
            ? Math.max(0, Math.floor(flags.prescriptionQuantity ?? 0))
            : flags.prescription
              ? cart.reduce((sum, item) => sum + (item.hasPrescriptionLenses && !item.isLight ? item.quantity : 0), 0) || 1
              : 0

          if (prescriptionQuantity > 0) {
            let remaining = prescriptionQuantity
            while (remaining > 0) {
              const quantity = Math.min(remaining, 10)
              mergedItems.push({
                productSlug: 'prescription-lenses',
                name: 'Prescription Lenses',
                price: PRESCRIPTION_PRICE,
                quantity,
                isAddon: true,
              })
              remaining -= quantity
            }
          }

        } catch (e) {
          console.error('Failed to parse add-on flags', e)
        }
      }
    }

    setItems(mergedItems)
  }, [router])

  // Lights show their loupe-bundle price here; the server charges the same (create-checkout-session).
  const subtotal = items.reduce(
    (sum, item) => sum + lineUnitPrice(item, items) * item.quantity,
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
            const parts = item.selectedFrameName.split(' - ')
            if (parts.length >= 2) {
              frameStyle = parts[0]
              frameColor = parts.slice(1).join(' - ')
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
            isLight: item.isLight || false,
            lightOption: item.lightOption || undefined,
          }
        })

        const fetchClientSecret = async () => {
          const cartSessionId = window.localStorage.getItem('heliosx_cart_session_id') ?? ''
          if (customerEmail) await fetch('/api/cart-session', {
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
              // Same rules as the privacy banner, so a US visitor who never
              // saw the banner still gets the server-side purchase event.
              analyticsConsent: getEffectiveConsent(),
              checkoutEventId: window.localStorage.getItem('heliosx_checkout_event_id') ?? '',
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
      <main className="hx-mobile-checkout pt-24 min-h-screen bg-transparent text-neutral-100">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row lg:px-8">
          {/* Left Column - Stripe Embedded Checkout */}
          <div className={`flex-1 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,32,0.96),rgba(5,8,14,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:p-8 ${customerEmail === '' ? 'lg:self-start' : ''}`}>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
              Payment
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">
              Secure checkout
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
              Pay by card, Affirm or Klarna through Stripe. Nothing is made until we have checked your measurements with you.
            </p>
            <p className="mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-100">
              30-day returns on non-prescription pairs. Prescription pairs are fully refundable until production begins.
            </p>

            <div className="mt-6">
              {error ? (
                <div className="rounded-2xl border border-red-500/50 bg-red-900/20 p-6">
                  <p className="text-red-400 font-semibold mb-2">Error loading checkout</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              ) : customerEmail === '' ? (
                <form
                  onSubmit={submitEmail}
                  noValidate
                  className="relative isolate border-t border-white/10 pt-7 md:overflow-hidden md:rounded-3xl md:border md:border-white/10 md:bg-[#04070d] md:px-9 md:pb-10 md:pt-9 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_28px_60px_-28px_rgba(0,0,0,0.9)]"
                >
                  {/* Desktop only: the pair being bought, fading into the panel, lit from the corner. */}
                  {items[0]?.image && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[68%] md:block"
                      style={{
                        WebkitMaskImage: 'linear-gradient(to left, #000 18%, transparent 92%)',
                        maskImage: 'linear-gradient(to left, #000 18%, transparent 92%)',
                      }}
                    >
                      <Image src={items[0].image} alt="" fill sizes="480px" className="object-cover opacity-60" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,13,0.55),rgba(4,7,13,0)_38%,rgba(4,7,13,0.85))]" />
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 -top-28 -z-10 hidden h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(23,176,143,0.34),transparent)] md:block"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-32 right-10 -z-10 hidden h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(72,136,255,0.22),transparent)] md:block"
                  />
                  <CheckoutSteps />
                  <label
                    htmlFor="checkout-email"
                    className="mt-7 block max-w-[20ch] text-balance text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.02em] text-neutral-50 md:mt-9 md:text-[2.1rem]"
                  >
                    Where should we send your order confirmation?
                  </label>
                  <div className="mt-6 max-w-xl sm:relative">
                    <input
                      id="checkout-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="none"
                      enterKeyHint="next"
                      autoFocus
                      value={emailDraft}
                      onChange={(event) => {
                        setEmailDraft(event.target.value)
                        if (emailError) setEmailError('')
                      }}
                      placeholder="you@example.com"
                      aria-invalid={emailError ? true : undefined}
                      aria-describedby="checkout-email-note"
                      className="h-14 w-full rounded-full border border-white/20 bg-white/[0.04] px-6 text-base text-white caret-emerald-300 outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-neutral-500 focus:border-emerald-300/80 focus:shadow-[0_0_0_4px_rgba(52,211,153,0.14)] sm:pr-44 md:h-16 md:border-white/15 md:bg-[rgba(3,5,8,0.62)] md:shadow-[inset_0_2px_10px_rgba(0,0,0,0.65),0_1px_0_rgba(255,255,255,0.06)] md:backdrop-blur-md md:placeholder:text-neutral-400 md:focus:shadow-[inset_0_2px_10px_rgba(0,0,0,0.65),0_0_0_4px_rgba(34,197,156,0.18)]"
                    />
                    <button
                      type="submit"
                      className="hx-ask-cta group mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-6 text-sm font-semibold text-neutral-950 transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-emerald-200 active:scale-[0.98] sm:absolute sm:right-1.5 sm:top-1.5 sm:mt-0 sm:h-11 sm:w-auto md:right-2 md:top-2 md:h-12 md:px-7 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_26px_-8px_rgba(23,176,143,0.75)] md:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_32px_-8px_rgba(23,176,143,0.9)]"
                    >
                      Continue
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </button>
                  </div>
                  {emailError && (
                    <p role="alert" className="mt-3 text-sm text-red-300">{emailError}</p>
                  )}
                  <p id="checkout-email-note" className="mt-5 flex max-w-xl items-start gap-2.5 text-[0.8rem] leading-5 text-neutral-400">
                    <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="text-pretty">
                      For your receipt and order updates. If you step away, we email this checkout back to you. No newsletter.
                    </span>
                  </p>
                </form>
              ) : loading || customerEmail === null ? (
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
                <>
                  <div className="mb-5 border-t border-white/10 pt-7">
                    <CheckoutSteps email={customerEmail ?? ''} onChange={changeEmail} />
                  </div>
                  <div
                    id="checkout"
                    ref={checkoutRef}
                    className="min-h-[600px] overflow-hidden rounded-[28px] border border-white/8 bg-[#f4eeea]"
                  ></div>
                </>
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
                      {item.isLight ? (
                        <div className="mt-1 text-[0.7rem] text-neutral-300">
                          {item.lightOptionName}
                          {lineUnitPrice(item, items) !== item.price ? <span className="ml-2 text-emerald-200">10% off with loupes</span> : null}
                        </div>
                      ) : !item.isAddon && (
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-neutral-300">
                          {(item.magnification || item.selectedMagnification) && (
                            <span>Mag: {item.magnification || item.selectedMagnification}</span>
                          )}
                          {item.frameStyle && (
                            <span>Frame: {item.frameStyle}</span>
                          )}
                          {item.frameColor && (
                            <span>Color: {item.frameColor}</span>
                          )}
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between text-xs text-neutral-300">
                        <span>Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold text-neutral-50">
                          {usd(lineUnitPrice(item, items) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <dl className="space-y-2 text-sm text-neutral-300">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{usd(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Worldwide shipping</dt>
                  <dd className="text-emerald-200">Included</dd>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-neutral-50">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-lg font-semibold tabular-nums">{usd(subtotal)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[0.72rem] leading-5 text-neutral-400">
                Taxes, if any, are shown by Stripe before you pay.
              </p>
            </div>

            <AfterCheckoutSteps lightsOnly={items.length > 0 && items.every((item) => item.isLight)} className="mt-6 border-t border-white/10 pt-5" />

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="text-sm font-medium text-neutral-50">Questions before you pay?</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Ask about fit, magnification or delivery. A real person replies within one business day, and your checkout stays open.
              </p>
              <AskSpecialistButton
                source="checkout_summary"
                className="hx-ask-cta mt-3 flex min-h-11 w-full items-center justify-between rounded-full border border-emerald-200/30 bg-emerald-200/10 px-4 text-sm font-semibold text-white transition hover:border-emerald-200/60 hover:bg-emerald-200/15"
              >
                <span>Ask a loupe specialist</span>
                <span aria-hidden="true">↗</span>
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
