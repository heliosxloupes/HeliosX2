'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { getCart } from '@/lib/cart'

export default function CartButton() {
  const [count, setCount] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = getCart()
        const total = cart.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        )
        setCount(total)
      } catch (err) {
        console.error('Failed to read cart', err)
        setCount(0)
      }
    }

    // initial read
    updateCount()

    // re-run when localStorage changes (if your cart uses it)
    const storageHandler = () => updateCount()

    // Listen for cart updates from cart lib
    const customHandler = () => updateCount()

    window.addEventListener('storage', storageHandler)
    window.addEventListener('cartUpdated', customHandler as EventListener)

    return () => {
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('cartUpdated', customHandler as EventListener)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => router.push('/cart')}
      className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-100 backdrop-blur-md transition hover:bg-white/15"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[0.7rem] font-semibold text-black">
        {count}
      </span>
      <span>Cart</span>
    </button>
  )
}

