'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchViewport = window.matchMedia('(max-width: 767px)').matches

    const lenis = new Lenis({
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
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const tickerCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.off('scroll', onScroll)
      try {
        lenis.destroy()
      } catch (error) {
        console.error('Lenis destroy error:', error)
      }
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
