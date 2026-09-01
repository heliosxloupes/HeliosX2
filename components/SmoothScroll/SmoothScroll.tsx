'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * The ONE Lenis instance for the whole site. Mounted once in app/layout.tsx.
 *
 * Do not create Lenis anywhere else. A second instance hijacks the same wheel
 * events and writes scroll position on a different clock, and the two disagree
 * every frame — which reads as choppy, heavy scrolling. See lenis-provider.tsx.
 *
 * Lenis is driven off gsap.ticker rather than a private requestAnimationFrame
 * loop so that Lenis and GSAP share a single clock; ScrollTrigger is updated
 * from Lenis's scroll event so pinned/scrubbed sections stay in sync.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lenis: Lenis | null = null
    let tickerCallback: ((time: number) => void) | null = null
    let onScroll: (() => void) | null = null

    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isTouchViewport = window.matchMedia('(max-width: 767px)').matches

      lenis = new Lenis({
        duration: prefersReducedMotion ? 0.8 : isTouchViewport ? 0.95 : 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !prefersReducedMotion,
        wheelMultiplier: 1,
        touchMultiplier: isTouchViewport ? 1.05 : 1.2,
        infinite: false,
      })

      lenisRef.current = lenis

      // Bridge Lenis to GSAP ScrollTrigger so scroll-pinned sections work correctly
      const activeLenis = lenis
      onScroll = () => ScrollTrigger.update()
      activeLenis.on('scroll', onScroll)

      tickerCallback = (time: number) => activeLenis.raf(time * 1000)
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)
    } catch (error) {
      console.error('Lenis initialization error:', error)
    }

    return () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback)
      }
      if (lenis) {
        try {
          if (onScroll) lenis.off('scroll', onScroll)
          lenis.destroy()
        } catch (error) {
          console.error('Lenis destroy error:', error)
        }
      }
      lenisRef.current = null
    }
  }, [])

  // Reset scroll position when pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const timer = setTimeout(() => {
      try {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true })
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      } catch (error) {
        console.error('Scroll reset error:', error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return <>{children}</>
}
