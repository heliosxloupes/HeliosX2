'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Fixed full-viewport ambient glow behind every page.
 *
 * Performance note: this deliberately does NOT read scroll position. It used to
 * rebuild its `background` gradient string via useMotionTemplate on every scroll
 * frame, which forces a full-viewport repaint (background-image can't be
 * GPU-composited) and was a major cause of scroll jank. The base gradient now
 * lives statically in globals.css.
 *
 * The glow layers animate transform only — never `scale`, because scaling a
 * blurred layer re-rasterizes the blur instead of just moving a cached texture.
 */
export default function AmbientBackground() {
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.28)

  const softX = useSpring(pointerX, { stiffness: 42, damping: 20, mass: 0.35 })
  const softY = useSpring(pointerY, { stiffness: 42, damping: 20, mass: 0.35 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Pointer parallax is meaningless without a fine pointer, and unwanted when
    // the visitor has asked for reduced motion. Skip the listener entirely.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    if (prefersReducedMotion || !hasFinePointer) return

    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth)
      pointerY.set(event.clientY / window.innerHeight)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [pointerX, pointerY])

  const emeraldX = useTransform(softX, [0, 1], ['-12vw', '2vw'])
  const skyX = useTransform(softX, [0, 1], ['12vw', '-8vw'])
  const amberX = useTransform(softX, [0, 1], ['22vw', '34vw'])

  const emeraldY = useTransform(softY, [0, 1], ['-6vh', '6vh'])
  const skyY = useTransform(softY, [0, 1], ['18vh', '30vh'])
  const amberY = useTransform(softY, [0, 1], ['64vh', '52vh'])

  return (
    <div className="site-ambient" aria-hidden="true">
      <motion.div
        className="site-ambient__glow site-ambient__glow--emerald"
        style={{ x: emeraldX, y: emeraldY }}
      />
      <motion.div
        className="site-ambient__glow site-ambient__glow--sky"
        style={{ x: skyX, y: skyY }}
      />
      <motion.div
        className="site-ambient__glow site-ambient__glow--amber"
        style={{ x: amberX, y: amberY }}
      />
      <div className="site-ambient__mesh" />
      <div className="site-ambient__vignette" />
    </div>
  )
}
