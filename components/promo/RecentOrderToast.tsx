'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MapPin, X } from 'lucide-react'

import { localeOfPath, type Locale } from '@/lib/i18n'
import type { RecentPurchase } from '@/lib/recent-purchases'

import styles from './RecentOrderToast.module.css'

/**
 * Sitewide "recent order" toast. Rotates through real paid orders from
 * /api/recent-purchases: product, magnification, shipping country, and how
 * long ago. Nothing is invented: no data, no toast.
 *
 * Quiet by design: first card after a pause, long gaps between cards, one
 * pass through the list per visit, hidden on payment and account flows, and
 * dismissible for three days.
 */

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const FIRST_DELAY = 9_000 // after the page settles
const DWELL = 6_500 // card on screen
const GAP = 14_000 // between cards
const MAX_PER_VISIT = 6
const DISMISS_DAYS = 3

const DISMISS_KEY = 'hx-recent-dismissed'
const STATE_KEY = 'hx-recent-state' // { next, shown, lastAt } per tab session

const HIDDEN_PREFIXES = ['/checkout', '/cart', '/admin', '/auth', '/measurements', '/offer']

const COPY: Record<Locale, { eyebrow: string; paid: string; region: string; close: string; loupes: string; light: string; headlight: string }> = {
  en: { eyebrow: 'Recent order', paid: 'Paid via Stripe', region: 'Recent orders', close: 'Hide recent orders', loupes: 'loupes', light: 'loupe light', headlight: 'headlight' },
  es: { eyebrow: 'Pedido reciente', paid: 'Pagado con Stripe', region: 'Pedidos recientes', close: 'Ocultar pedidos recientes', loupes: 'lupas', light: 'luz para lupas', headlight: 'luz frontal' },
  pt: { eyebrow: 'Pedido recente', paid: 'Pago via Stripe', region: 'Pedidos recentes', close: 'Ocultar pedidos recentes', loupes: 'lupas', light: 'luz para lupas', headlight: 'fotóforo' },
}

/* ------------------------------------------------------------------ data */

// Dev-only previews: ?hxRecentDemo=1 (sample rotation) or ?hxRecentDemo=worst.
// Stripped from production builds, so the live site only ever shows real orders.
function devDemo(): RecentPurchase[] | null {
  if (process.env.NODE_ENV === 'production') return null
  const mode = new URLSearchParams(window.location.search).get('hxRecentDemo')
  if (!mode) return null
  const day = (ago: number) => new Date(Date.now() - ago * 86_400_000).toISOString().slice(0, 10)
  if (mode === 'worst') {
    return [
      { slug: 'medusa', product: 'Medusa Ultra Wide Field Prismatic Extended', magnification: '8.5x', kind: 'loupes', image: '/Medusa/MedusaStudioCloseup.png', country: 'GS', day: day(0) },
      { slug: 'canopus-xl', product: 'Canopus XL', kind: 'headlight', image: '/lights/light-7.webp', country: 'CD', day: day(45) },
      { slug: 'x', product: 'X', kind: 'loupes', image: '/Galileo/galileoproduct.png', country: 'ZZ', day: day(400) },
    ]
  }
  return [
    { slug: 'medusa', product: 'Medusa', magnification: '3.5x', kind: 'loupes', image: '/Medusa/MedusaStudioCloseup.png', country: 'BR', day: day(0) },
    { slug: 'galileo', product: 'Galileo', magnification: '3.0x', kind: 'loupes', image: '/Galileo/galileoproduct.png', country: 'DE', day: day(1) },
    { slug: 'polaris', product: 'Polaris', kind: 'light', image: '/lights/light-7.webp', country: 'MX', day: day(3) },
    { slug: 'apollo', product: 'Apollo', magnification: '4.0x', kind: 'loupes', image: '/Apollo/Apollofinal.png', country: 'US', day: day(9) },
  ]
}

function hrefFor(p: RecentPurchase) {
  return p.kind === 'loupes' ? `/product/${p.slug}` : '/product/lights'
}

function countryName(code: string, locale: Locale) {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

/** Calendar-day distance, said plainly: "today", "yesterday", "3 days ago", "2 weeks ago". */
function ago(day: string, locale: Locale) {
  const then = Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10))
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const days = Math.max(0, Math.round((today - then) / 86_400_000))
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (days < 7) return rtf.format(-days, 'day')
  if (days < 30) return rtf.format(-Math.floor(days / 7), 'week')
  return rtf.format(-Math.max(1, Math.floor(days / 30)), 'month')
}

type Area = 'local' | 'session'
const area = (kind: Area) => (kind === 'local' ? window.localStorage : window.sessionStorage)

function readJSON<T>(kind: Area, key: string): T | null {
  try {
    const raw = area(kind).getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(kind: Area, key: string, value: unknown) {
  try {
    area(kind).setItem(key, JSON.stringify(value))
  } catch {
    /* storage blocked: the toast still works for this page */
  }
}

/* ------------------------------------------------------------ placement */

/**
 * Sits bottom-left. When the Black Friday dock (or any element marked
 * data-hx-bottom-dock) would overlap it, the toast lifts to sit above it.
 */
function useLiftAboveDock(ref: React.RefObject<HTMLElement>, active: boolean) {
  const [lift, setLift] = useState(0)

  useLayoutEffect(() => {
    if (!active) return
    const dockWrap = document.querySelector<HTMLElement>('[data-hx-bottom-dock]')

    const measure = () => {
      const toast = ref.current
      const dock = dockWrap?.firstElementChild as HTMLElement | null
      if (!toast || !dock) return setLift(0)
      const d = dock.getBoundingClientRect()
      const t = toast.getBoundingClientRect()
      // Use the card's full width, not the current one, so the lift is settled before a card enters.
      const right = t.left + Math.min(360, window.innerWidth - 20)
      const overlaps = d.height > 0 && d.left < right + 12 && d.right > t.left - 12
      setLift(overlaps ? Math.max(0, window.innerHeight - d.top + 10 - parseFloat(getComputedStyle(toast).bottom || '0')) : 0)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (ref.current) ro.observe(ref.current)
    const mo = dockWrap ? new MutationObserver(() => requestAnimationFrame(measure)) : null
    if (dockWrap) {
      mo!.observe(dockWrap, { childList: true, subtree: true })
      if (dockWrap.firstElementChild) ro.observe(dockWrap.firstElementChild)
    }
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      mo?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref, active])

  return lift
}

/* ------------------------------------------------------------- component */

export default function RecentOrderToast() {
  const pathname = usePathname() ?? '/'
  const locale = localeOfPath(pathname)
  const copy = COPY[locale]
  const reduce = useReducedMotion() ?? false

  const [items, setItems] = useState<RecentPurchase[] | null>(null)
  const [current, setCurrent] = useState<RecentPurchase | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [paused, setPaused] = useState(false)

  const hiddenRoute = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const wrapRef = useRef<HTMLElement>(null)

  // Phones get a different form: a notification that drops in under the header
  // and swipes away, so it never stacks with the bottom bars.
  const [isPhone, setIsPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const lift = useLiftAboveDock(wrapRef, Boolean(items?.length) && !isPhone)

  // Load once, after the page is idle, so it never competes with first paint.
  useEffect(() => {
    const dismissedAt = readJSON<number>('local', DISMISS_KEY)
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86_400_000) {
      setDismissed(true)
      return
    }
    const demo = devDemo()
    if (demo) return setItems(demo)

    let cancelled = false
    const load = () =>
      fetch('/api/recent-purchases')
        .then((res) => (res.ok ? res.json() : { purchases: [] }))
        .then((body) => !cancelled && setItems(Array.isArray(body?.purchases) ? body.purchases : []))
        .catch(() => !cancelled && setItems([]))

    const idle = (window as any).requestIdleCallback as undefined | ((cb: () => void, o?: object) => number)
    const handle = idle ? idle(load, { timeout: 4000 }) : window.setTimeout(load, 2500)
    return () => {
      cancelled = true
      if (idle) (window as any).cancelIdleCallback?.(handle)
      else window.clearTimeout(handle)
    }
  }, [])

  // Scheduler: wait, show one card for DWELL, hide, wait GAP, next card.
  // The position in the list survives client navigation and reloads within the tab.
  const timer = useRef<number>()
  const dwellLeft = useRef(DWELL)
  const dwellStart = useRef(0)

  const hide = useCallback(() => setCurrent(null), [])

  const scheduleNext = useCallback(
    (delay: number) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        // Never compete with the privacy banner: wait until it has been answered.
        const consentOpen = document.querySelector('section[aria-label="Privacy choices"]')
        if (!items?.length || document.hidden || consentOpen) return scheduleNext(3_000)
        const state = readJSON<{ next: number; shown: number }>('session', STATE_KEY) ?? { next: 0, shown: 0 }
        if (state.shown >= Math.min(MAX_PER_VISIT, items.length)) return
        const item = items[state.next % items.length]
        writeJSON('session', STATE_KEY, { next: state.next + 1, shown: state.shown + 1, lastAt: Date.now() })
        dwellLeft.current = DWELL
        setCurrent(item)
      }, delay)
    },
    [items],
  )

  useEffect(() => {
    if (!items?.length || dismissed || hiddenRoute) {
      setCurrent(null)
      window.clearTimeout(timer.current)
      return
    }
    // Respect the gap across page loads, so navigating never fires a card instantly.
    const last = readJSON<{ lastAt?: number }>('session', STATE_KEY)?.lastAt ?? 0
    const sinceLast = Date.now() - last
    scheduleNext(last ? Math.max(GAP - sinceLast, 4_000) : FIRST_DELAY)
    return () => window.clearTimeout(timer.current)
  }, [items, dismissed, hiddenRoute, scheduleNext])

  // Dwell timer, pausable on hover, focus, or a hidden tab.
  useEffect(() => {
    if (!current) return
    if (paused) {
      dwellLeft.current -= Date.now() - dwellStart.current
      window.clearTimeout(timer.current)
      return
    }
    dwellStart.current = Date.now()
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      hide()
      scheduleNext(GAP)
    }, Math.max(dwellLeft.current, 800))
  }, [current, paused, hide, scheduleNext])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Swipe up on a phone: no more cards this visit (the desktop X hides them for days).
  const dragged = useRef(false)
  const skip = () => {
    window.clearTimeout(timer.current)
    const state = readJSON<{ next: number }>('session', STATE_KEY) ?? { next: 0 }
    writeJSON('session', STATE_KEY, { next: state.next, shown: MAX_PER_VISIT, lastAt: Date.now() })
    setPaused(false)
    hide()
  }

  const dismiss = () => {
    window.clearTimeout(timer.current)
    setCurrent(null)
    setDismissed(true)
    writeJSON('local', DISMISS_KEY, Date.now())
  }

  if (dismissed || hiddenRoute || !items?.length) return null

  // Desktop rises from the corner; phones drop from under the header.
  const from = isPhone ? -18 : 16
  const enter = reduce
    ? { opacity: 0 }
    : { opacity: 0, transform: `translateY(${from}px) scale(0.96)`, filter: 'blur(6px)' }
  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' }
  const leave = reduce
    ? { opacity: 0, transition: { duration: 0.2 } }
    : {
        opacity: 0,
        transform: `translateY(${isPhone ? -14 : 10}px) scale(0.98)`,
        filter: 'blur(2px)',
        transition: { duration: 0.24, ease: EASE_OUT },
      }

  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, transform: 'translateY(6px)' },
          animate: { opacity: 1, transform: 'translateY(0px)' },
          transition: { duration: 0.45, ease: EASE_OUT, delay: 0.12 + i * 0.05 },
        }

  const label = current
    ? current.kind === 'loupes'
      ? current.product
      : `${current.product} ${copy[current.kind]}`
    : ''

  return (
    <aside
      ref={wrapRef}
      className={styles.wrap}
      aria-label={copy.region}
      style={{ transform: lift && !isPhone ? `translateY(${-lift}px)` : undefined }}
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={`${current.slug}-${current.country}-${current.day}`}
            className={styles.shell}
            initial={enter}
            animate={shown}
            exit={leave}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
          {/* Inner layer owns the swipe, so it never fights the enter/exit transform. */}
          <motion.div
            className={`${styles.card} ${paused ? styles.paused : ''}`}
            drag={isPhone ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.7, bottom: 0.06 }}
            dragSnapToOrigin
            onDragStart={() => {
              dragged.current = true
              setPaused(true)
            }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -28 || info.velocity.y < -260) skip()
              else setPaused(false)
              window.setTimeout(() => (dragged.current = false), 0)
            }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            style={{ ['--dwell' as string]: `${DWELL}ms` }}
          >
            <Link
              href={hrefFor(current)}
              className={styles.link}
              draggable={false}
              onClickCapture={(e) => dragged.current && e.preventDefault()}
            >
              <span className={styles.thumb} aria-hidden="true">
                <motion.span
                  className={styles.thumbInner}
                  initial={reduce ? false : { transform: 'scale(1.18)', filter: 'blur(5px)' }}
                  animate={reduce ? undefined : { transform: 'scale(1)', filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <Image src={current.image} alt="" fill sizes="56px" className={styles.img} />
                </motion.span>
              </span>

              <span className={styles.copy}>
                <motion.span className={styles.eyebrow} {...line(0)}>
                  <span className={styles.dot} aria-hidden="true" />
                  {copy.eyebrow}
                  <span className={styles.paid}>{copy.paid}</span>
                  <span className={styles.whenTop}>{ago(current.day, locale)}</span>
                </motion.span>
                <motion.span className={styles.product} {...line(1)}>
                  <span className={styles.productName}>{label}</span>
                  {current.magnification && <span className={styles.mag}>{current.magnification}</span>}
                </motion.span>
                <motion.span className={styles.meta} {...line(2)}>
                  <MapPin className={styles.pin} strokeWidth={2} aria-hidden="true" />
                  <span className={styles.country}>{countryName(current.country, locale)}</span>
                  <span className={styles.sep} aria-hidden="true">·</span>
                  <span className={styles.when}>{ago(current.day, locale)}</span>
                </motion.span>
              </span>
            </Link>

            <button type="button" className={styles.close} onClick={dismiss} aria-label={copy.close}>
              <X strokeWidth={2.2} aria-hidden="true" />
            </button>

            <span className={styles.progress} aria-hidden="true" />
            <span className={styles.grabber} aria-hidden="true" />
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
