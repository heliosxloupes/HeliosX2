'use client'

import { useEffect, useRef } from 'react'

// Custom Hairline figures (made with the hairline-create skill) mounted the way
// the package mounts its own: same engine, same CSS variables, so the m2 tone
// classes tint them too. The engine and figure load after first paint, and the
// figure walks its own tour on a loop (phones have no pointer to answer).
const FIGURES = {
  caliper: () => import('./hairline/caliper'),
  case: () => import('./hairline/case'),
  frames: () => import('./hairline/frames'),
  magnifier: () => import('./hairline/magnifier'),
  optics: () => import('./hairline/optics'),
  shelf: () => import('./hairline/shelf'),
  tray: () => import('./hairline/tray'),
}

export type CustomHairlineName = keyof typeof FIGURES

type Props = {
  name: CustomHairlineName
  tone?: 'paper' | 'card' | 'mint'
  className?: string
}

export default function CustomHairline({ name, tone = 'paper', className = '' }: Props) {
  const hostRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const stage = hostRef.current
    if (!stage) return
    let cleanup = () => {}
    let cancelled = false

    Promise.all([import('./hairline/kernel'), FIGURES[name]()]).then(([{ default: HL }, { default: figure }]) => {
      if (cancelled) return
      HL.inject(document)
      stage.setAttribute('data-hairline', figure.name)
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage)
      const read = { textContent: '' }
      const handle = figure.mount({ stage, svg, read }, figure.range[1])
      const walk = HL.tour(stage, figure.tour || HL.LAP)
      cleanup = () => {
        walk.stop()
        handle.destroy()
        svg.remove()
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [name])

  return <span ref={hostRef} className={`m2-hairline m2-hairline--${tone} block aspect-[5/4] ${className}`} aria-hidden="true" />
}
