'use client'

import { useEffect, useRef, useState } from 'react'

import { DELIVERY_ICONS } from './delivery-icons'
import styles from './DeliveryTimeline.module.css'

// Order-to-door estimate: production 7-10 days, then shipping 7-10 days.
// Dates are worked out in the browser (not on the server) so they follow the
// shopper's own calendar and never cause a hydration mismatch.
const BUILD_DAYS: [number, number] = [7, 10]
const SHIP_DAYS: [number, number] = [7, 10]

const ICONS = DELIVERY_ICONS

type Stage = { key: keyof typeof ICONS; label: string; when: string }

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const plus = (base: Date, days: number) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + days)
const range = (base: Date, [a, b]: [number, number]) => `${fmt(plus(base, a))} – ${fmt(plus(base, b))}`

function stages(today: Date | null): Stage[] {
  const total: [number, number] = [BUILD_DAYS[0] + SHIP_DAYS[0], BUILD_DAYS[1] + SHIP_DAYS[1]]
  return [
    { key: 'order', label: 'Order', when: today ? fmt(today) : 'Today' },
    { key: 'build', label: 'Built & fitted', when: today ? range(today, BUILD_DAYS) : '7–10 days' },
    { key: 'ship', label: 'Ships', when: 'Tracked' },
    { key: 'receive', label: 'Arrives', when: today ? range(today, total) : '~3 weeks' },
  ]
}

type Props = {
  tone?: 'dark' | 'light'
  className?: string
}

export default function DeliveryTimeline({ tone = 'light', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [today, setToday] = useState<Date | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    setToday(new Date())
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const list = stages(today)

  return (
    <div
      ref={ref}
      className={`${styles.root} ${tone === 'dark' ? styles.dark : styles.light} ${seen ? styles.seen : ''} ${className}`}
      role="group"
      aria-label="Estimated delivery timeline"
    >
      <ol className={styles.steps}>
        {list.map((s, i) => (
          <li key={s.key} className={styles.step} style={{ '--i': i } as React.CSSProperties}>
            <svg className={styles.icon} viewBox="0 0 48 40" aria-hidden="true">
              {ICONS[s.key].map(([cls, d], j) => (
                <path key={j} className={styles[cls]} d={d} pathLength={1} />
              ))}
            </svg>
            <span className={styles.label}>{s.label}</span>
            <span className={styles.when}>{s.when}</span>
          </li>
        ))}
      </ol>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.fill} />
        {list.map((s, i) => (
          <span key={s.key} className={styles.node} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <p className={styles.note}>Made to order: about 3 weeks door to door, counted from when your measurements are in.</p>
    </div>
  )
}
