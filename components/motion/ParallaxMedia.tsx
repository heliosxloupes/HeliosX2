'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type ParallaxMediaProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  distance?: number
}

// Clips its child and drifts it against the scroll for depth. The child should
// fill the frame; it is scaled slightly so the drift never exposes an edge.
export default function ParallaxMedia({ children, className, style, distance = 60 }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <motion.div className="absolute inset-[-12%_0]" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  )
}
