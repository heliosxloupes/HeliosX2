'use client'

import dynamic from 'next/dynamic'

// Loaded client-side after first paint; on the server each slot is an empty
// 5:4 box, so nothing shifts when the lines draw in. Figures animate only while
// on screen and rest under reduced motion (handled by the library).
const load = (name: keyof typeof import('./hairline-figures')) =>
  dynamic(() => import('./hairline-figures').then((m) => m[name]), { ssr: false })

const FIGURES = {
  Loupe: load('Loupe'),
  Query: load('Query'),
}

export type HairlineName = keyof typeof FIGURES

type Props = {
  name: HairlineName
  /** Background the figure sits on; the plate colour must match it. */
  tone?: 'paper' | 'card' | 'mint'
  className?: string
}

export default function HairlineFigure({ name, tone = 'paper', className = '' }: Props) {
  const Figure = FIGURES[name]
  return (
    <span className={`m2-hairline m2-hairline--${tone} block aspect-[5/4] ${className}`} aria-hidden="true">
      <Figure play />
    </span>
  )
}
