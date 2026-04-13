'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lenis: Lenis | null = null
    let rafId: number | null = null

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

      function raf(time: number) {
        if (lenis) {
          lenis.raf(time)
        }
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    } catch (error) {
      console.error('Lenis initialization error:', error)
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (lenis) {
        try {
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

