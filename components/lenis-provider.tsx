'use client'

import { ReactNode } from 'react'

interface LenisProviderProps {
  children: ReactNode
}

/**
 * Intentionally inert. Renders children and nothing else.
 *
 * This used to create its own Lenis instance. Because app/layout.tsx already
 * wraps the entire site in <SmoothScroll>, every page that also used this
 * provider ended up running TWO Lenis instances at once — both hijacking the
 * same wheel events and writing scroll position on different clocks (one on
 * requestAnimationFrame, this one on gsap.ticker). They fought each other every
 * frame, which is what made scrolling feel choppy and heavy.
 *
 * That was fixed once before and reverted (see commit c2c3d63, then 1b28748),
 * which brought the stutter back. Please don't "restore" this — if you need the
 * Lenis instance or the GSAP ScrollTrigger bridge, they live in
 * components/SmoothScroll/SmoothScroll.tsx.
 *
 * Kept as a pass-through so the ~30 existing call sites (homepage, education,
 * and the shared SEO experience components) keep working untouched.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  return <>{children}</>
}
