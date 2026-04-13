'use client'

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function AmbientBackground() {
  const { scrollYProgress } = useScroll()

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.28)

  const softX = useSpring(pointerX, { stiffness: 42, damping: 20, mass: 0.35 })
  const softY = useSpring(pointerY, { stiffness: 42, damping: 20, mass: 0.35 })

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth)
      pointerY.set(event.clientY / window.innerHeight)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [pointerX, pointerY])

  const rootBackground = useMotionTemplate`
    radial-gradient(circle at ${useTransform(softX, (v) => `${18 + v * 42}%`)} ${useTransform(softY, (v) => `${6 + v * 18}%`)}, rgba(34, 197, 156, 0.16), transparent 22%),
    radial-gradient(circle at ${useTransform(softX, (v) => `${72 + v * 10}%`)} ${useTransform(scrollYProgress, [0, 1], ['22%', '72%'])}, rgba(59, 130, 246, 0.14), transparent 28%),
    linear-gradient(180deg, rgb(3 5 9) 0%, rgb(5 8 16) 46%, rgb(3 4 8) 100%)
  `

  const emeraldY = useTransform(scrollYProgress, [0, 1], ['-8vh', '14vh'])
  const skyY = useTransform(scrollYProgress, [0, 1], ['14vh', '42vh'])
  const amberY = useTransform(scrollYProgress, [0, 1], ['72vh', '48vh'])

  const emeraldX = useTransform(softX, [0, 1], ['-12vw', '2vw'])
  const skyX = useTransform(softX, [0, 1], ['12vw', '-8vw'])
  const amberX = useTransform(softX, [0, 1], ['22vw', '34vw'])

  const glowScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.08, 1.02])
  const meshOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.34, 0.22])

  return (
    <motion.div className="site-ambient" aria-hidden="true" style={{ background: rootBackground }}>
      <motion.div
        className="site-ambient__glow site-ambient__glow--emerald"
        style={{ x: emeraldX, y: emeraldY, scale: glowScale }}
      />
      <motion.div
        className="site-ambient__glow site-ambient__glow--sky"
        style={{ x: skyX, y: skyY, scale: glowScale }}
      />
      <motion.div
        className="site-ambient__glow site-ambient__glow--amber"
        style={{ x: amberX, y: amberY, scale: glowScale }}
      />
      <motion.div className="site-ambient__mesh" style={{ opacity: meshOpacity }} />
      <div className="site-ambient__vignette" />
    </motion.div>
  )
}
