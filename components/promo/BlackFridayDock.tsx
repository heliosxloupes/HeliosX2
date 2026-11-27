'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Aperture, ArrowRight, ChevronDown } from 'lucide-react'

import { localeOfPath } from '@/lib/i18n'
import { magnificationPriceByProduct } from '@/lib/pricing'
import { PROMO, promoActive, promoTimeLeft, regularPrice } from '@/lib/promo'

import styles from './BlackFridayDock.module.css'

/**
 * Sitewide Black Friday dock, mounted once in the root layout so it stays on
 * every page and survives client navigation. It only labels prices: the
 * current catalogue price is the Black Friday price, no code is involved.
 * Collapses to a chip; never fully dismissible while the sale runs. Removes
 * itself at PROMO.endsAt.
 */

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const SEEN_KEY = 'hx-bf-seen'
const COLLAPSED_KEY = 'hx-bf-collapsed'

/** The biggest dollar gap between a loupe's regular and Black Friday price. */
const MAX_SAVING = Math.max(
  ...Object.values(magnificationPriceByProduct).flatMap((prices) =>
    Object.values(prices).map((price) => regularPrice(price) - price),
  ),
)
const usd = (value: number) => `$${value.toLocaleString('en-US')}`

const COPY = {
  en: {
    title: 'Black Friday',
    save: `Save up to ${usd(MAX_SAVING)} on loupes`,
    endsIn: 'Ends in',
    cta: 'Shop the sale',
    minimize: 'Minimize the Black Friday offer',
    expand: 'Show the Black Friday offer',
    ends: `Black Friday pricing ends ${PROMO.lastDay}.`,
  },
  es: {
    title: 'Black Friday',
    save: `Ahorra hasta ${usd(MAX_SAVING)} en lupas`,
    endsIn: 'Termina en',
    cta: 'Ver la oferta',
    minimize: 'Minimizar la oferta de Black Friday',
    expand: 'Mostrar la oferta de Black Friday',
    ends: 'Los precios de Black Friday terminan el 30 de noviembre.',
  },
  pt: {
    title: 'Black Friday',
    save: `Economize até ${usd(MAX_SAVING)} em lupas`,
    endsIn: 'Termina em',
    cta: 'Ver a oferta',
    minimize: 'Minimizar a oferta de Black Friday',
    expand: 'Mostrar a oferta de Black Friday',
    ends: 'Os preços de Black Friday terminam em 30 de novembro.',
  },
} as const

type Left = ReturnType<typeof promoTimeLeft>

const lineSwap = (reduce: boolean) => ({
  initial: reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(60%)' },
  animate: reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0%)' },
  exit: reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-60%)' },
  transition: { duration: 0.3, ease: EASE_OUT },
})
const pad = (n: number) => String(n).padStart(2, '0')

/** Each digit rolls down on its own when it changes, like a mechanical counter. */
function Roll({ value, reduce }: { value: string; reduce: boolean }) {
  return (
    <span className={styles.digits} aria-hidden="true">
      {value.split('').map((char, i) => (
        <span key={i} className={styles.slot}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={char}
              className={styles.digit}
              initial={reduce ? { opacity: 0 } : { transform: 'translateY(-100%)', opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { transform: 'translateY(0%)', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { transform: 'translateY(100%)', opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

function Clock({ left, reduce, label }: { left: Left; reduce: boolean; label: string }) {
  const cells: [string, string][] = [
    [String(left.days), 'd'],
    [pad(left.hours), 'h'],
    [pad(left.minutes), 'm'],
    [pad(left.seconds), 's'],
  ]
  return (
    <span className={styles.clock}>
      <span className={styles.clockLabel}>{label}</span>
      {cells.map(([value, unit]) => (
        <span key={unit} className={styles.cell}>
          <Roll value={value} reduce={reduce} />
          <span className={styles.unit} aria-hidden="true">{unit}</span>
        </span>
      ))}
    </span>
  )
}

export default function BlackFridayDock() {
  const pathname = usePathname() ?? '/'
  const reduce = useReducedMotion() ?? false
  const [mounted, setMounted] = useState(false)
  const [left, setLeft] = useState<Left | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [firstVisit, setFirstVisit] = useState(false)

  const hidden = pathname.startsWith('/admin')
  // Cart and checkout: start as the chip and keep still. Payment flows stay calm.
  const quiet = pathname.startsWith('/checkout') || pathname.startsWith('/cart')
  const copy = COPY[localeOfPath(pathname)]

  useEffect(() => {
    setMounted(true)
    try {
      setFirstVisit(!sessionStorage.getItem(SEEN_KEY))
    } catch {
      /* storage blocked: show it expanded */
    }
    const tick = () => setLeft(promoActive() ? promoTimeLeft() : null)
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Each route starts from the visitor's choice; cart and checkout start as the chip.
  useEffect(() => {
    let stored = false
    try {
      stored = sessionStorage.getItem(COLLAPSED_KEY) === '1'
    } catch {
      /* ignore */
    }
    setCollapsed(quiet || stored)
  }, [quiet])

  // Phones have room for one line under the title: alternate the offer and the clock.
  const [showClock, setShowClock] = useState(false)
  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => setShowClock((v) => !v), 4000)
    return () => window.clearInterval(timer)
  }, [reduce])

  const finishEntrance = () => {
    if (!firstVisit) return
    setFirstVisit(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const setAndRemember = (next: boolean) => {
    setCollapsed(next)
    try {
      sessionStorage.setItem(COLLAPSED_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  if (!mounted || hidden || !left) return null

  const isCollapsed = collapsed
  const enterFrom = reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(140%) scale(1)' }
  const swapFrom = reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px) scale(0.96)' }

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <div className={`${styles.wrap} ${isCollapsed ? styles.collapsedWrap : ''}`} data-hx-bottom-dock="">
        <AnimatePresence mode="wait" initial={firstVisit}>
          {isCollapsed ? (
            <motion.button
              key="chip"
              type="button"
              className={styles.chip}
              onClick={() => setAndRemember(false)}
              aria-label={`${copy.expand}. ${copy.ends}`}
              initial={swapFrom}
              animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
              exit={swapFrom}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <span className={`${styles.iris} ${quiet ? styles.quiet : ''}`}>
                <span className={styles.irisRing} aria-hidden="true" />
                <Aperture className={styles.irisIcon} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className={styles.chipTag} aria-hidden="true">
                {left.days > 0 ? `${left.days}d ${pad(left.hours)}h` : `${pad(left.hours)}:${pad(left.minutes)}`}
              </span>
            </motion.button>
          ) : (
            <motion.aside
              key="dock"
              aria-label={copy.title}
              className={`${styles.dock} ${quiet ? styles.quiet : ''}`}
              initial={firstVisit ? enterFrom : swapFrom}
              animate={{ opacity: 1, transform: 'translateY(0%) scale(1)' }}
              exit={swapFrom}
              transition={
                firstVisit && !reduce
                  ? { type: 'spring', duration: 0.8, bounce: 0.2, delay: 1.1 }
                  : { duration: 0.22, ease: EASE_OUT }
              }
              onAnimationComplete={finishEntrance}
            >
              <span className={styles.iris}>
                <span className={styles.irisRing} aria-hidden="true" />
                <Aperture className={styles.irisIcon} strokeWidth={2.2} aria-hidden="true" />
              </span>

              <span className={styles.copy}>
                <span className={styles.title}>{copy.title}</span>
                <span className={`${styles.save} ${styles.desktopClock}`}>{copy.save}</span>
                <span className={styles.mobileLine}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {showClock ? (
                      <motion.span key="clock" {...lineSwap(reduce)}>
                        <Clock left={left} reduce={reduce} label={copy.endsIn} />
                      </motion.span>
                    ) : (
                      <motion.span key="save" className={styles.save} {...lineSwap(reduce)}>
                        {copy.save}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>

              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.desktopClock}>
                <Clock left={left} reduce={reduce} label={copy.endsIn} />
              </span>
              <span className="sr-only">
                {copy.save}. {copy.ends}
              </span>

              <Link href="/product" className={styles.cta} aria-label={copy.cta}>
                <span className={styles.ctaText}>{copy.cta}</span>
                <ArrowRight className={styles.ctaArrow} strokeWidth={2.4} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className={styles.min}
                onClick={() => setAndRemember(true)}
                aria-label={copy.minimize}
              >
                <ChevronDown className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
