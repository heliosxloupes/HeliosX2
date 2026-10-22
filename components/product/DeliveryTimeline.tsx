'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './DeliveryTimeline.module.css'

// Order-to-door estimate: production 7-10 days, then shipping 7-10 days.
// Dates are worked out in the browser (not on the server) so they follow the
// shopper's own calendar and never cause a hydration mismatch.
const BUILD_DAYS: [number, number] = [7, 10]
const SHIP_DAYS: [number, number] = [7, 10]

const ICONS = {
  order: ['M6 8.5h12l-1 11.5H7L6 8.5Z', 'M9.5 8.5V7a2.5 2.5 0 0 1 5 0v1.5'],
  build: ['M3.5 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M12.5 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M11.5 13.5h1', 'M5 10.5 6.5 6h3l1 4.5M19 10.5 17.5 6h-3l-1 4.5'],
  ship: ['M3.5 8 12 4.5 20.5 8v8L12 19.5 3.5 16V8Z', 'M3.5 8 12 11.5 20.5 8', 'M12 11.5v8'],
  receive: ['M4.5 11 12 5l7.5 6v8.5h-15V11Z', 'M10 19.5V15h4v4.5'],
}

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
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              {ICONS[s.key].map((d) => (
                <path key={d} d={d} pathLength={1} />
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
