'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[1.5px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgba(52,211,153,0.92), rgba(125,211,252,0.92), rgba(52,211,153,0.72))',
      }}
    />
  )
}
