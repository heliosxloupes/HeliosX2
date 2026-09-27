'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  as?: 'div' | 'section' | 'figure' | 'aside' | 'header'
  id?: string
  className?: string
  delay?: number
  y?: number
}

// Fades and lifts content in as it enters the viewport. Content stays in the
// server-rendered HTML, so crawlers and no-JS readers see it unchanged.
export default function Reveal({ children, as = 'div', id, className, delay = 0, y = 28 }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}
