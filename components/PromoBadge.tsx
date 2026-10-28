'use client'

import { useEffect, useState } from 'react'

import { PROMO, promoActive, promoCountdown } from '@/lib/promo'

// The seasonal label next to prices. The countdown is filled in after mount so
// the server-rendered HTML never disagrees with the visitor's clock, and the
// badge removes itself once the promotion has ended.
export default function PromoBadge({ tone = 'paper', className = '' }: { tone?: 'paper' | 'dark'; className?: string }) {
  const [active, setActive] = useState(true)
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => {
      setActive(promoActive())
      setCountdown(promoCountdown())
    }
    tick()
    const timer = window.setInterval(tick, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  if (!active) return null

  const skin =
    tone === 'dark'
      ? 'border border-[rgba(255,163,58,0.35)] bg-[rgba(255,163,58,0.1)] text-[#ffd9a8]'
      : 'bg-[#14231d] text-[#eef2ee]'

  return (
    <span className={`inline-flex min-h-7 max-w-full items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-bold leading-tight ${skin} ${className}`}>
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-[#ffa33a] motion-safe:animate-ping motion-safe:opacity-60" />
        <span className="relative h-2 w-2 rounded-full bg-[#ffa33a]" />
      </span>
      <span className="min-w-0">
        {PROMO.name} pricing
        <span className={`tab font-semibold ${tone === 'dark' ? 'text-[rgba(255,217,168,0.75)]' : 'text-[rgba(238,242,238,0.7)]'}`}>
          {' '}· {countdown ?? `Ends ${PROMO.lastDay}`}
        </span>
      </span>
    </span>
  )
}
