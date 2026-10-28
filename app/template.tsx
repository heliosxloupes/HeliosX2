'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Next remounts this template on every client-side navigation, so each new
// page fades in. Opacity only: a transform here would become the containing
// block for position:fixed children (sticky CTAs, sheets) and break them.
// The first load skips the fade so the hero paints immediately (LCP).
let hasNavigated = false

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const skip = !hasNavigated || reduceMotion || pathname.startsWith('/checkout')

  useEffect(() => {
    hasNavigated = true
  }, [])

  return (
    <motion.div
      initial={skip ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
