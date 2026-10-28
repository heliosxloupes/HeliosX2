'use client'

import { useEffect, useState } from 'react'

import GhostFibers from './GhostFibers'

/**
 * The desktop Lights page's moving background: React Bits' Ghost Fibers in
 * the brand's emerald and sky (their "silk" look, nudged toward HeliosX teal).
 * Fixed behind the glass. Mounted on desktop only, so phones never start the
 * WebGL loop. Ghost Fibers pauses itself off-screen, in a hidden tab, and
 * under reduced motion.
 */
export default function LightsBackdrop({ className = '' }: { className?: string }) {
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const sync = () => setDesktop(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (!desktop) return null

  return (
    <div className={`pointer-events-none fixed inset-0 ${className}`} aria-hidden="true">
      <GhostFibers
        glowColor="#17b08f"
        lineColor="#e6fff6"
        secondaryColor="#4888ff"
        gradient="depth"
        fiberStyle="lines"
        layers={2}
        twist={0.7}
        waves={1.5}
        volume={1.1}
        spread={1}
        scale={1}
        rotation={18}
        perspective={0.65}
        threads={120}
        density={1}
        thickness={1}
        tips={0}
        foldGlow={2}
        speed={0.5}
        flow={0.4}
        rollSpeed={0.15}
        depthOfField={0.45}
        focusDepth={0}
        particles={0.25}
        sparkle={0.2}
        glow={0.8}
        brightness={0.85}
        vignette={0.3}
        grain={0.06}
        mouseInteraction
        hoverEffect="focus"
        mouseStrength={1}
        pulseOnClick={false}
        intro
      />
    </div>
  )
}
