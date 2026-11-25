'use client'

import { useEffect, useState } from 'react'

import { promoActive, regularPrice } from '@/lib/promo'

/**
 * The regular price, struck through, beside a Black Friday price. Display
 * only. `extra` is added unmarked (add-ons such as prescription lenses keep
 * their price). Disappears with the promotion.
 */
export default function RegularPrice({
  price,
  quantity = 1,
  extra = 0,
  tone = 'dark',
  className = '',
}: {
  price: number
  quantity?: number
  extra?: number
  tone?: 'dark' | 'paper'
  className?: string
}) {
  const [active, setActive] = useState(true)
  useEffect(() => setActive(promoActive()), [])
  if (!active || !price) return null

  const value = regularPrice(price) * quantity + extra
  const color = tone === 'dark' ? 'text-neutral-400 decoration-[#ffa33a]/80' : 'text-[#6b7a70] decoration-[#c2410c]/70'

  return (
    <s className={`tab font-medium decoration-[1.5px] ${color} ${className}`}>
      <span className="sr-only">Regular price </span>${value.toLocaleString('en-US')}
    </s>
  )
}
