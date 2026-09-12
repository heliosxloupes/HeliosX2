'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

type RecoveryResponse = {
  cartSessionId: string
  customerEmail: string
  cartItems: unknown[]
  addOns: { prescription: boolean; prescriptionQuantity: number; warranty: boolean }
  destination: '/cart' | '/checkout'
  error?: string
}

function RecoveryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token') ?? ''
    if (!token) {
      setError('This cart link is missing its recovery token.')
      return
    }

    const controller = new AbortController()
    fetch(`/api/cart-session/recover?token=${encodeURIComponent(token)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({})) as RecoveryResponse
        if (!res.ok) throw new Error(payload.error || 'We could not restore this cart.')
        return payload
      })
      .then((payload) => {
        localStorage.setItem('heliosx_cart', JSON.stringify(payload.cartItems))
        localStorage.setItem('heliosx_customer_email', payload.customerEmail)
        localStorage.setItem('heliosx_cart_session_id', payload.cartSessionId)
        sessionStorage.setItem('heliosx_addons', JSON.stringify(payload.addOns))
        window.dispatchEvent(new CustomEvent('cartUpdated'))
        router.replace(payload.destination)
      })
      .catch((reason) => {
        if (reason?.name !== 'AbortError') {
          setError(reason instanceof Error ? reason.message : 'We could not restore this cart.')
        }
      })

    return () => controller.abort()
  }, [router, searchParams])

  return (
    <main className="grid min-h-screen place-items-center bg-[#06090b] px-5 text-neutral-100">
      <section className="w-full max-w-md border border-white/10 bg-[#0b100d] p-8 text-center shadow-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">HeliosX saved cart</p>
        {error ? (
          <>
            <h1 className="mt-4 text-3xl font-medium tracking-tight">This link cannot restore your cart.</h1>
            <p className="mt-4 text-sm leading-6 text-neutral-400">{error}</p>
            <Link href="/product" className="mt-7 inline-flex min-h-12 items-center justify-center bg-emerald-200 px-6 text-sm font-semibold text-[#07110c]">
              Browse surgical loupes
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-emerald-300" />
            <h1 className="mt-5 text-3xl font-medium tracking-tight">Restoring your configuration.</h1>
            <p className="mt-3 text-sm text-neutral-400">Your saved loupe setup will open automatically.</p>
          </>
        )}
      </section>
    </main>
  )
}

export default function RecoverCartPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#06090b]" />}><RecoveryContent /></Suspense>
}
