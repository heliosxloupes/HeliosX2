'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

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

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
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





