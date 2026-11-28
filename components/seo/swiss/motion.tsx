'use client'

// Shared motion kit for the design-lab variants. Pure presentation: anything here
// that carries text either repeats words already on the page (and is aria-hidden)
// or is navigation built from the page's own "On this page" labels.
// Page scroll is Lenis (site-wide) + native sticky; springs are for touch only.
import Image from 'next/image'
import { Children, Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { List, X } from 'lucide-react'
import type { Callout } from './content'
import k from './kit.module.css'

export const EASE = [0.23, 1, 0.32, 1] as const
type Item = { id: string; label: string }

/* ---------------- media query hook ---------------- */
export function useMedia(q: string, initial = false) {
  const [m, setM] = useState(initial)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const set = () => setM(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [q])
  return m
}

/* ---------------- callout plate ---------------- */
export function CalloutPlate({
  src,
  alt,
  callouts,
  priority,
  aspect = '1600 / 893',
  className,
}: {
  src: string
  alt: string
  callouts: Callout[]
  priority?: boolean
  aspect?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [hot, setHot] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '9%'])
  return (
    <>
    <div ref={ref} className={`${k.plate} ${className ?? ''}`} style={{ '--aspect': aspect } as React.CSSProperties}>
      <motion.div className={k.plateImg} style={{ y }}>
        <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 900px) 100vw, 60vw" quality={90} />
      </motion.div>
      <div className={k.plateShade} aria-hidden="true" />
      <div className={k.calloutLayer} aria-hidden="true">
        <svg className={k.leaders} viewBox="0 0 100 100" preserveAspectRatio="none">
          {callouts.map((c, i) => (
            <motion.path
              key={c.title}
              d={`M ${c.at[0]} ${c.at[1]} L ${c.at[0]} ${c.label[1]} L ${c.side === 'left' ? c.label[0] + 1 : c.label[0] - 1} ${c.label[1]}`}
              vectorEffect="non-scaling-stroke"
              className={hot === i ? k.leaderHot : undefined}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 + i * 0.12, ease: EASE }}
            />
          ))}
        </svg>
        {callouts.map((c, i) => (
          <motion.span
            key={`m-${c.title}`}
            className={`${k.marker} ${hot === i ? k.markerHot : ''}`}
            style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%` }}
            data-n={i + 1}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15, delay: 0.3 + i * 0.12 }}
          />
        ))}
        {callouts.map((c, i) => (
          <motion.p
            key={`l-${c.title}`}
            className={`${k.callout} ${c.side === 'left' ? k.calloutLeft : ''}`}
            style={{ top: `${c.label[1]}%`, ...(c.side === 'left' ? { right: `${100 - c.label[0]}%` } : { left: `${c.label[0]}%` }) }}
            initial={reduce ? false : { opacity: 0, clipPath: c.side === 'left' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
            transition={{ duration: 0.6, delay: 0.95 + i * 0.12, ease: EASE }}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
          >
            <span className={k.calloutKey} data-t={c.title} />
            <span className={k.calloutVal} data-t={c.value} />
          </motion.p>
        ))}
      </div>
    </div>
    {/* Phones: floating labels would cover the product, so the same values sit in
        a numbered strip under the photo instead (CSS decides which one shows). */}
    <div className={k.calloutStrip} aria-hidden="true">
      {callouts.map((c, i) => (
        <span key={`s-${c.title}`} className={k.calloutStripItem}>
          <b data-t={String(i + 1)} />
          <span className={k.calloutKey} data-t={c.title} />
          <span className={k.calloutVal} data-t={c.value} />
        </span>
      ))}
    </div>
    </>
  )
}

/* ---------------- posture scroller ----------------
   Wide screens: the section is tall and its inner block sticks, so scrolling
   moves through the three photographs. Phones: plays as the stage crosses. */
export function PostureScroller({
  frames,
  alt,
  credit,
  children,
  className,
  stickyClassName,
  gridClassName,
  textClassName,
  figureClassName,
  tall = 300,
}: {
  frames: string[]
  alt: string
  credit: string
  children: ReactNode
  className?: string
  stickyClassName?: string
  gridClassName?: string
  textClassName?: string
  figureClassName?: string
  tall?: number
}) {
  const wrap = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 901px)', true)
  const pinned = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  // Phones: hold the first photo until the whole stage is on screen (its bottom
  // reaches the viewport bottom), then step through the three while it rises
  // to just under the header. Nothing moves before the reader gets there.
  const inline = useScroll({ target: stage, offset: ['end end', 'start 16%'] })
  // One driver value fed by whichever tracker fits the screen. (useSpring binds
  // to the source it gets on first render, so swapping sources later would leave
  // phones following the desktop tracker.)
  const raw = useMotionValue(0)
  const wideRef = useRef(wide)
  wideRef.current = wide
  useMotionValueEvent(pinned.scrollYProgress, 'change', (v) => { if (wideRef.current) raw.set(v) })
  useMotionValueEvent(inline.scrollYProgress, 'change', (v) => { if (!wideRef.current) raw.set(v) })
  useEffect(() => { raw.set(wide ? pinned.scrollYProgress.get() : inline.scrollYProgress.get()) }, [wide, raw, pinned.scrollYProgress, inline.scrollYProgress])
  const p = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 })
  const still = !!reduce
  return (
    <section
      id="why"
      ref={wrap}
      aria-labelledby="why-h"
      // Pin height comes from CSS (wide screens only), so phones never render a
      // 300vh section first and then collapse it after hydration.
      className={`${k.pinWrap} ${className ?? ''}`}
      style={{ '--tall': `${tall}vh` } as React.CSSProperties}
    >
      <div className={`${k.pinSticky} ${stickyClassName ?? ''}`}>
        <div className={gridClassName}>
          <div className={textClassName}>{children}</div>
          <figure className={`${k.posture} ${figureClassName ?? ''}`}>
            {still ? (
              <div className={k.postureRow}>
                {frames.map((src, i) => (
                  <div key={src} className={k.frameStatic}>
                    <Image src={src} alt={i === 0 ? alt : ''} fill sizes="20vw" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div ref={stage} className={k.stage}>
                  {frames.map((src, i) => (
                    <Frame key={src} src={src} i={i} p={p} alt={alt} />
                  ))}
                </div>
                <div className={k.ticks} aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <Tick key={i} p={p} i={i} />
                  ))}
                </div>
              </>
            )}
            <figcaption className={k.credit}>{credit}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
function Frame({ src, i, p, alt }: { src: string; i: number; p: MotionValue<number>; alt: string }) {
  const r = [
    [0, 0, 0.28, 0.4],
    [0.28, 0.4, 0.6, 0.72],
    [0.6, 0.72, 1, 1],
  ][i]
  const opacity = useTransform(p, r, i === 0 ? [1, 1, 1, 0] : i === 2 ? [0, 1, 1, 1] : [0, 1, 1, 0])
  const scale = useTransform(p, [r[0], r[3]], [1.045, 1])
  return (
    <motion.div className={k.frame} style={{ opacity, scale }}>
      <Image src={src} alt={i === 0 ? alt : ''} fill sizes="(max-width: 900px) 70vw, 30vw" quality={88} />
    </motion.div>
  )
}
function Tick({ p, i }: { p: MotionValue<number>; i: number }) {
  const scaleX = useTransform(p, [i / 3, (i + 1) / 3], [0, 1])
  return (
    <span className={k.tick}>
      <motion.i style={{ scaleX }} />
    </span>
  )
}

/* ---------------- parallax media ---------------- */
export function Parallax({ src, alt, className, amount = 7, sizes = '(max-width: 900px) 100vw, 50vw', priority }: { src: string; alt: string; className?: string; amount?: number; sizes?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${amount}%`, `${amount}%`])
  return (
    <div ref={ref} className={`${k.parallax} ${className ?? ''}`}>
      <motion.div className={k.parallaxInner} style={{ y, inset: `-${amount + 1}% 0` }}>
        <Image src={src} alt={alt} fill sizes={sizes} quality={90} priority={priority} />
      </motion.div>
    </div>
  )
}

/* ---------------- reveal (used sparingly: one per section family) ---------------- */
export function Reveal({ children, className, delay = 0, y = 18 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- charts (aria-hidden pictures of table cells) ---------------- */
type PriceRow = { name: string; ours: boolean; cell: string; segs: { lo: number; hi: number; note: string }[] }
export function PriceChart({ rows, className, min = 1000, max = 3500 }: { rows: PriceRow[]; className?: string; min?: number; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const at = (v: number) => ((v - min) / (max - min)) * 100
  const ticks = [1000, 1500, 2000, 2500, 3000, 3500].filter((t) => t >= min && t <= max)
  return (
    <div ref={ref} className={`${k.chart} ${className ?? ''}`} aria-hidden="true">
      <div className={k.chartGrid}>
        {ticks.map((t) => (
          <span key={t} style={{ left: `${at(t)}%` }} data-t={`$${(t / 1000).toFixed(t % 1000 ? 1 : 0)}k`} />
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={r.name} className={`${k.chartRow} ${r.ours ? k.chartOurs : ''}`}>
          <span className={k.chartName} data-t={r.name} />
          <span className={k.chartTrack}>
            {r.segs.map((sg, j) => (
              <motion.i
                key={j}
                className={j > 0 ? k.chartSegAlt : undefined}
                style={{ left: `${at(sg.lo)}%`, width: `max(8px, ${at(sg.hi) - at(sg.lo)}%)`, transformOrigin: 'left center' }}
                initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.08 + j * 0.15, ease: EASE }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

type WeightRow = { name: string; lo: number; hi: number; ours: boolean }
export function WeightChart({ rows, className, min = 40, max = 90 }: { rows: WeightRow[]; className?: string; min?: number; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const at = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div ref={ref} className={`${k.chart} ${k.chartWeight} ${className ?? ''}`} aria-hidden="true">
      {rows.map((r, i) => (
        <div key={r.name} className={`${k.chartRow} ${r.ours ? k.chartOurs : ''}`}>
          <span className={k.chartName} data-t={r.name} />
          <span className={k.chartTrack}>
            <motion.i
              style={{ left: 0, width: `${at(r.hi)}%`, transformOrigin: 'left center' }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: EASE }}
            />
            <motion.b
              style={{ left: `${at(r.lo)}%` }}
              initial={reduce ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.12 }}
              data-t={`${r.lo}–${r.hi} g`}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- elastic carousel (phones): drag with momentum, snap,
   rubber-band past the ends; wide screens get the plain grid. ---------------- */
export function ElasticCards({ children, className, cardClassName, breakpoint = 900 }: { children: ReactNode; className?: string; cardClassName?: string; breakpoint?: number }) {
  const narrow = useMedia(`(max-width: ${breakpoint}px)`)
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [bounds, setBounds] = useState({ left: 0, right: 0 })
  const [index, setIndex] = useState(0)
  const items = Children.toArray(children)

  const offsets = useCallback(() => {
    const t = track.current
    if (!t) return [0]
    const kids = [...t.children] as HTMLElement[]
    const maxShift = Math.max(0, t.scrollWidth - (view.current?.clientWidth ?? 0))
    return kids.map((el) => -Math.min(el.offsetLeft, maxShift))
  }, [])

  useEffect(() => {
    if (!narrow) return
    const measure = () => {
      const t = track.current
      const v = view.current
      if (!t || !v) return
      setBounds({ left: -Math.max(0, t.scrollWidth - v.clientWidth), right: 0 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [narrow, items.length])

  useMotionValueEvent(x, 'change', (v) => {
    const o = offsets()
    let best = 0
    o.forEach((ov, i) => {
      if (Math.abs(ov - v) < Math.abs(o[best] - v)) best = i
    })
    setIndex(best)
  })

  const go = (i: number) => {
    const o = offsets()
    const target = o[Math.max(0, Math.min(o.length - 1, i))]
    animate(x, target, reduce ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.4 })
  }

  if (!narrow) return <div className={className}>{children}</div>
  return (
    <div className={k.elastic}>
      <div ref={view} className={k.elasticView}>
        <motion.div
          ref={track}
          className={`${k.elasticTrack} ${className ?? ''}`}
          style={{ x, touchAction: 'pan-y' }}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.16}
          dragTransition={{
            power: 0.25,
            timeConstant: 260,
            // Project the flick, then land on the nearest card (Apple's momentum projection).
            modifyTarget: (target) => {
              const o = offsets()
              return o.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a), o[0])
            },
            bounceStiffness: 420,
            bounceDamping: 38,
          }}
        >
          {items.map((child, i) => (
            <div key={i} className={`${k.elasticCard} ${cardClassName ?? ''}`} onFocusCapture={() => go(i)}>
              {child}
            </div>
          ))}
        </motion.div>
      </div>
      <div className={k.dots} aria-hidden="true">
        {items.map((_, i) => (
          <button key={i} type="button" tabIndex={-1} data-on={index === i || undefined} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- chapters: measurement, rail, top bar, bottom sheet ---------------- */
export function useChapters(items: Item[]) {
  const { scrollYProgress } = useScroll()
  const [marks, setMarks] = useState<number[]>([])
  const [active, setActive] = useState(-1)
  const [top, setTop] = useState(60)
  const along = useMotionValue(0)
  const update = useCallback(() => {
    const els = items.map((it) => document.getElementById(it.id))
    const marker = window.innerHeight * 0.35
    const tops = els.map((el) => (el ? el.getBoundingClientRect().top : Infinity))
    let cur = -1
    tops.forEach((t, i) => {
      if (t <= marker) cur = i
    })
    setActive(cur)
    if (cur < 0) along.set(0)
    else if (cur >= tops.length - 1) along.set(tops.length - 1)
    else along.set(cur + Math.min(1, Math.max(0, (marker - tops[cur]) / Math.max(1, tops[cur + 1] - tops[cur]))))
    const max = document.documentElement.scrollHeight - window.innerHeight
    setMarks(tops.map((t) => (t === Infinity || max <= 0 ? -1 : Math.min(1, Math.max(0, (t + window.scrollY - marker) / max)))))
  }, [items, along])
  useEffect(() => {
    const measure = () => {
      const h = [...document.querySelectorAll('header')].find((el) => {
        const r = el.getBoundingClientRect()
        return getComputedStyle(el).position === 'fixed' && r.height > 0 && r.top <= 0
      })
      const bottom = h ? Math.round(h.getBoundingClientRect().bottom) : 60
      setTop(bottom)
      document.documentElement.style.setProperty('--hdr', `${bottom}px`)
      update()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [update])
  useMotionValueEvent(scrollYProgress, 'change', update)
  return { scrollYProgress, marks, active, top, along }
}

const jump = (id: string, smooth: boolean, after?: () => void) => (e: React.MouseEvent) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  after?.()
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

/** Hairline progress under the site header; on narrow screens a chip names the
    chapter and opens the chapter sheet. */
export function TopProgress({ items, sheetBelow = 1199 }: { items: Item[]; sheetBelow?: number }) {
  const { scrollYProgress, marks, active, top } = useChapters(items)
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  const narrow = useMedia(`(max-width: ${sheetBelow}px)`)
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={k.progress} style={{ top }} aria-hidden="true">
        <motion.i className={k.progressFill} style={{ scaleX: fill }} />
        {marks.map((m, i) => (m >= 0 ? <b key={items[i].id} className={k.progressMark} style={{ left: `${m * 100}%` }} /> : null))}
      </div>
      {narrow ? (
        <motion.button
          type="button"
          className={k.chip}
          style={{ top: top + 10 }}
          initial={false}
          animate={{ opacity: active >= 0 ? 1 : 0, y: active >= 0 ? 0 : -6, pointerEvents: active >= 0 ? 'auto' : 'none' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <List size={15} strokeWidth={2} aria-hidden="true" />
          <span className={k.chipCount}>{active + 1}/{items.length}</span>
          {active >= 0 ? items[active].label : ''}
        </motion.button>
      ) : null}
      <ChapterSheet items={items} active={active} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/** Bottom sheet of chapters: springs in, follows the finger, rubber-bands upward,
    and closes on a downward flick (velocity) or a long enough pull. */
function ChapterSheet({ items, active, open, onClose }: { items: Item[]; active: number; open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const first = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (!open) return
    first.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className={k.scrim} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sections"
            className={k.sheet}
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', bounce: 0.12, duration: 0.38 }}
            drag={reduce ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.08, bottom: 0.9 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose()
            }}
          >
            <div className={k.sheetHandle} aria-hidden="true" />
            <button type="button" className={k.sheetClose} onClick={onClose} aria-label="Close">
              <X size={18} strokeWidth={2} />
            </button>
            <ol className={k.sheetList}>
              {items.map((it, i) => (
                <li key={it.id} data-on={active === i || undefined}>
                  <a ref={i === 0 ? first : undefined} href={`#${it.id}`} onClick={jump(it.id, !reduce, onClose)}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {it.label}
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

/** In-flow sticky rail for wide screens. Theme via CSS variables on an ancestor. */
export function ChapterRail({ items, className }: { items: Item[]; className?: string }) {
  const reduce = useReducedMotion()
  const { active, along } = useChapters(items)
  const smooth = useSpring(along, { stiffness: 260, damping: 34, mass: 0.4 })
  const n = Math.max(1, items.length - 1)
  const src = reduce ? along : smooth
  const bead = useTransform(src, (v) => `calc(${(v / n) * 100}% - 6px)`)
  const fill = useTransform(src, (v) => v / n)
  return (
    <nav aria-label="Sections" className={`${k.rail} ${className ?? ''}`}>
      <div className={k.railTrack} aria-hidden="true">
        <motion.i className={k.railFill} style={{ scaleY: fill }} />
        <motion.b className={k.railBead} style={{ top: bead }} data-on={active >= 0 || undefined} />
      </div>
      <ol>
        {items.map((it, i) => (
          <li key={it.id} data-on={active === i || undefined} data-past={active > i || undefined}>
            <a href={`#${it.id}`} aria-current={active === i ? 'location' : undefined} onClick={jump(it.id, !reduce)}>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* ---------------- headline: words rise into place on load (one orchestrated moment).
   The full text is server-rendered inside the heading, so crawlers read it unchanged. */
export function SplitHeadline({ text, className, as: Tag = 'h1', delay = 0.1 }: { text: string; className?: string; as?: 'h1' | 'h2'; delay?: number }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              initial={reduce ? false : { y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/* ---------------- count-up number (aria-hidden decoration of an existing figure) ---------------- */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '', className }: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const v = useMotionValue(reduce ? to : 0)
  const [txt, setTxt] = useState(reduce ? to.toFixed(decimals) : (0).toFixed(decimals))
  useMotionValueEvent(v, 'change', (n) => setTxt(n.toFixed(decimals)))
  useEffect(() => {
    if (inView && !reduce) animate(v, to, { duration: 1.4, ease: EASE })
  }, [inView, reduce, to, v])
  return (
    <span ref={ref} className={className} aria-hidden="true">
      <span data-t={`${prefix}${txt}${suffix}`} />
    </span>
  )
}

/* ---------------- quick picks with photo ---------------- */
const PHOTOS: Record<string, string> = {
  medusa: '/guides/medusa-adjustable-surgical-loupes.webp',
  galileo: '/guides/galileo-dental-surgical-loupes.webp',
  apollo: '/guides/apollo-ergonomic-surgical-loupes.webp',
}
const modelOf = (label: string) => (/medusa/i.test(label) ? 'medusa' : /galileo/i.test(label) ? 'galileo' : /apollo/i.test(label) ? 'apollo' : null)
/** Wraps the server-rendered picks list; hovering or focusing a row swaps the photo. */
export function PicksPhoto({ labels, children, className, photoClassName }: { labels: string[]; children: ReactNode; className?: string; photoClassName?: string }) {
  const [active, setActive] = useState(0)
  const model = labels.slice(active).concat(labels.slice(0, active)).map(modelOf).find(Boolean)
  const onHit = (e: React.SyntheticEvent) => {
    const row = (e.target as HTMLElement).closest('dl > div')
    if (!row?.parentElement) return
    const i = [...row.parentElement.children].indexOf(row)
    if (i >= 0) setActive(i)
    row.parentElement.querySelectorAll(':scope > div').forEach((el, j) => el.toggleAttribute('data-active', j === i))
  }
  return (
    <div className={className} onPointerOver={onHit} onFocusCapture={onHit}>
      {children}
      <div className={`${k.pickPhoto} ${photoClassName ?? ''}`} aria-hidden="true">
        {Object.entries(PHOTOS).map(([key, src]) => (
          <motion.div key={key} className={k.pickPhotoImg} initial={false} animate={{ opacity: model === key ? 1 : 0, scale: model === key ? 1 : 1.03 }} transition={{ duration: 0.45, ease: EASE }}>
            <Image src={src} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
