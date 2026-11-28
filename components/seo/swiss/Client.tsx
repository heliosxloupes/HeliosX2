'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RISE_EASE = [0.16, 1, 0.3, 1] as const

/** Same move as the live /measurements page's Reveal: fade in and lift 28px,
    0.9s, once. Fires off IntersectionObserver (not scroll math), which phones
    run natively, so fast thumb scrolls never leave a block blank. The trigger
    is a margin, not an "amount", so very tall blocks (tables) fire on time too.
    Text stays in the server HTML. */
export function Rise({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: RISE_EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Top stage. The photo settles in on load (slight zoom out + fade, one
    orchestrated moment with the headline), then drifts slower than the page as
    you scroll away. Transform/opacity only; static under reduced motion. */
export function HeroStage({
  children,
  className,
  visualClassName,
  photoClassName,
  src,
  alt,
  style,
  ...rest
}: {
  children: ReactNode
  className?: string
  visualClassName?: string
  photoClassName?: string
  src: string
  alt: string
  style?: CSSProperties
  'data-h1'?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '14%'])
  return (
    <div ref={ref} className={className} style={style} {...rest}>
      <div className={visualClassName}>
        <motion.div className={photoClassName} style={{ y }}>
          {/* settle-in is a CSS animation (.photoIn), so it never waits on JS */}
          <div data-photo-in style={{ position: 'absolute', inset: 0 }}>
            <Image src={src} alt={alt} fill priority sizes="(max-width: 900px) 100vw, 64vw" quality={85} />
          </div>
        </motion.div>
      </div>
      {children}
    </div>
  )
}

/** Photo settles from a slight zoom while it fades in (the /measurements image move). */
export function Settle({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={reduce ? false : { scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.2, ease: RISE_EASE }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** GSAP layer for the Swiss variant. Lenis (site-wide) already drives
    ScrollTrigger.update, so these scrubs stay in sync with smooth scroll.

    Rules for phones: nothing here may hide content. Touch screens scroll
    natively and fast, so anything that starts at opacity 0 and waits for a
    trigger risks being skipped past blank. Phones only get the rules drawing
    across (transform only, the text is already visible). */
export function SwissMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add(
      {
        desk: '(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        touch: '(max-width: 900px), (hover: none), (pointer: coarse)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { desk, reduce } = ctx.conditions as { desk: boolean; touch: boolean; reduce: boolean }
        if (reduce) return
        // Section rules draw across as each section arrives, tied to scroll.
        gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((r) => {
          gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: 'left center', scrollTrigger: { trigger: r, start: 'top 95%', end: 'top 60%', scrub: desk ? 0.6 : true } })
        })
        if (!desk) return
        // Desktop only: grid lines rise on load, index numbers slide up.
        // (Content fade-ins are Rise, above, on every screen.)
        gsap.from('[data-gridline]', { scaleY: 0, transformOrigin: 'top center', duration: 1.2, ease: 'power3.out', stagger: 0.04 })
        gsap.utils.toArray<HTMLElement>('[data-index]').forEach((n) => {
          gsap.fromTo(n, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.9, scrollTrigger: { trigger: n, start: 'top 88%', once: true } })
        })
      },
    )
    // Images, fonts and the posture pin change page height after first paint;
    // re-measure so triggers fire where the content actually is.
    let t = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(el)
    return () => {
      window.clearTimeout(t)
      ro.disconnect()
      mm.revert()
    }
  }, [])
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
