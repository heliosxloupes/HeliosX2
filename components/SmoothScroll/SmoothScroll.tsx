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
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
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

