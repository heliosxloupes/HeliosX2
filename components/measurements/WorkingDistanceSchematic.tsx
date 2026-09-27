'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

import styles from './WorkingDistanceSchematic.module.css'

// Drawing geometry. The figure is drawn to scale at 3.4 SVG units per cm.
// RADIX is the nasal radix after the head's 12° tilt about C7 (398, 222);
// WORK is where the instrument tips meet tissue.
const VIEW = { x: 330, y: 80, w: 500, h: 460 }
const PX_PER_CM = 3.4
const RADIX = { x: 461.97, y: 178.34 }
const WORK = { x: 545, y: 352 }
const DX = WORK.x - RADIX.x
const DY = WORK.y - RADIX.y
const LEN = Math.hypot(DX, DY)
const NORMAL = { x: DY / LEN, y: -DX / LEN }
const READING_MM = Math.round(((LEN / PX_PER_CM) * 10) / 5) * 5

const pct = (x: number, y: number) => ({
  left: `${((x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((y - VIEW.y) / VIEW.h) * 100}%`,
})

// Milliseconds from start
const TIMELINE = { lit: 30, lamp: 700, radix: 2100, work: 2900, line: 3700, lineDur: 1900, measure: 5500 }

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

export default function WorkingDistanceSchematic() {
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef, { once: true, amount: 0.35 })
  const [phase, setPhase] = useState(0)
  const [line, setLine] = useState(0)
  const [measured, setMeasured] = useState(false)
  const timers = useRef<number[]>([])
  const raf = useRef<number>(0)

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    cancelAnimationFrame(raf.current)
  }

  const play = useCallback(() => {
    clear()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(4)
      setLine(1)
      setMeasured(true)
      return
    }
    setPhase(0)
    setLine(0)
    setMeasured(false)
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    later(TIMELINE.lit, () => setPhase(1))
    later(TIMELINE.lamp, () => setPhase(2))
    later(TIMELINE.radix, () => setPhase(3))
    later(TIMELINE.work, () => setPhase(4))
    later(TIMELINE.line, () => {
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / TIMELINE.lineDur)
        setLine(easeOut(p))
        if (p < 1) raf.current = requestAnimationFrame(step)
      }
      raf.current = requestAnimationFrame(step)
    })
    later(TIMELINE.measure, () => {
      setLine(1)
      setMeasured(true)
    })
  }, [])

  useEffect(() => {
    if (inView) play()
  }, [inView, play])

  useEffect(() => clear, [])

  const tipX = RADIX.x + DX * line
  const tipY = RADIX.y + DY * line
  const mid = { x: (RADIX.x + WORK.x) / 2 + NORMAL.x * 22, y: (RADIX.y + WORK.y) / 2 + NORMAL.y * 22 }
  const frameClass = [styles.frame, phase >= 1 && styles.lit, phase >= 2 && styles.lampOn].filter(Boolean).join(' ')

  return (
    <div className="grid gap-4">
      <div ref={frameRef} className={frameClass}>
        <svg
          className={styles.svg}
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          role="img"
          aria-labelledby="wds-title"
        >
          <title id="wds-title">
            A surgeon stands upright at the operating table under the surgical light. A line runs from the nasal radix
            to the instrument tips at the surgical field.
          </title>
          <defs>
            <radialGradient id="wds-room" cx="52%" cy="42%" r="70%">
              <stop offset="0" stopColor="#161b21" />
              <stop offset=".55" stopColor="#0a0d11" />
              <stop offset="1" stopColor="#040506" />
            </radialGradient>
            <radialGradient
              id="wds-pool"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(560 355) scale(170 110)"
            >
              <stop offset="0" stopColor="#e9f3f7" stopOpacity=".22" />
              <stop offset=".45" stopColor="#bfe3ea" stopOpacity=".07" />
              <stop offset="1" stopColor="#bfe3ea" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wds-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eaf5f8" stopOpacity=".13" />
              <stop offset="1" stopColor="#eaf5f8" stopOpacity=".01" />
            </linearGradient>
            <filter id="wds-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="wds-softer" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            {/* Materials, lit from the lamp above and to the right */}
            <linearGradient id="wds-gown" x1="1" y1="0" x2=".2" y2="1">
              <stop offset="0" stopColor="#34506f" />
              <stop offset=".55" stopColor="#1b2b3e" />
              <stop offset="1" stopColor="#0c131c" />
            </linearGradient>
            <linearGradient id="wds-gownFar" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#22354b" />
              <stop offset="1" stopColor="#0a1018" />
            </linearGradient>
            <linearGradient id="wds-cap" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3f5f80" />
              <stop offset="1" stopColor="#172433" />
            </linearGradient>
            <linearGradient id="wds-mask" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8ea8bd" />
              <stop offset="1" stopColor="#3b4d5d" />
            </linearGradient>
            <linearGradient id="wds-skin" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7a6658" />
              <stop offset="1" stopColor="#2d2521" />
            </linearGradient>
            <linearGradient id="wds-glove" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c3c8cb" />
              <stop offset="1" stopColor="#5d646a" />
            </linearGradient>
            <linearGradient id="wds-drape" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2f5256" />
              <stop offset=".35" stopColor="#18302f" />
              <stop offset="1" stopColor="#081112" />
            </linearGradient>
            <linearGradient id="wds-steel" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2d343a" />
              <stop offset="1" stopColor="#0b0e11" />
            </linearGradient>
            <linearGradient id="wds-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".72" stopColor="#050608" stopOpacity="0" />
              <stop offset="1" stopColor="#050608" stopOpacity=".95" />
            </linearGradient>
            <linearGradient
              id="wds-tape"
              gradientUnits="userSpaceOnUse"
              x1={RADIX.x}
              y1={RADIX.y}
              x2={WORK.x}
              y2={WORK.y}
            >
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".55" stopColor="#bae6fd" />
              <stop offset="1" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>

          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="url(#wds-room)" />

          {/* Surgical light */}
          <polygon
            className={styles.lightpool}
            points="652,112 722,112 610,372 492,372"
            fill="url(#wds-cone)"
            filter="url(#wds-soft)"
          />
          <path d="M840,40 C790,62 745,78 712,88" fill="none" stroke="#1b2127" strokeWidth="5" strokeLinecap="round" />
          <path
            d="M648,108 C650,88 670,77 690,77 C710,78 724,90 726,108 Z"
            fill="url(#wds-steel)"
            stroke="rgba(255,255,255,.08)"
          />
          <ellipse cx="687" cy="109" rx="38" ry="4.5" fill="#dcebf0" opacity=".75" />
          <ellipse cx="687" cy="112" rx="46" ry="10" fill="#dcebf0" opacity=".18" filter="url(#wds-softer)" />

          {/* Draped patient on the table, seen in cross-section */}
          <rect x="546" y="506" width="34" height="80" fill="url(#wds-steel)" />
          <path
            d="M462,508 L466,424 C478,420 486,404 494,390 C508,364 530,350 563,346 C598,350 620,366 634,390 C642,404 650,420 662,424 L668,540 L460,540 Z"
            fill="url(#wds-drape)"
            stroke="rgba(255,255,255,.07)"
          />
          <path
            d="M474,432 L470,540 M654,432 L660,540 M520,436 L514,540 M608,436 L614,540"
            stroke="rgba(0,0,0,.35)"
            strokeWidth="1.2"
            fill="none"
          />
          <ellipse className={styles.lightpool} cx="560" cy="352" rx="150" ry="95" fill="url(#wds-pool)" />
          <path
            d="M536,353 Q545,356 554,349"
            fill="none"
            stroke="#5a2a2a"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity=".8"
          />
          <ellipse cx="520" cy="362" rx="40" ry="6" fill="#000" opacity=".45" filter="url(#wds-softer)" />

          {/* Far arm */}
          <path
            d="M440,320 L500,316 C508,316 514,320 516,324 C516,328 512,331 506,331 L440,336 Z"
            fill="url(#wds-gownFar)"
          />
          <path
            d="M500,316 C508,316 514,320 516,324 C516,328 512,331 506,331 L494,332 L494,317 Z"
            fill="url(#wds-glove)"
            opacity=".75"
          />
          <path d="M512,325 L545,351 M509,329 L545,352" stroke="#9aa3aa" strokeWidth="1.3" strokeLinecap="round" />

          {/* Neck and gown */}
          <path d="M393,204 C392,214 392,222 394,230 L428,230 C428,224 430,219 434,216 L420,205 Z" fill="url(#wds-skin)" />
          <path
            d="M392,222 C383,228 377,238 375,250 C371,285 370,335 372,385 C374,410 378,430 377,450 L368,608 C395,612 430,612 460,606 C458,545 459,475 458,432 C459,412 461,392 459,372 C457,332 452,288 446,262 C442,244 434,232 426,226 C414,229 402,228 392,222 Z"
            fill="url(#wds-gown)"
            stroke="rgba(255,255,255,.06)"
          />
          <path
            d="M374,392 C400,398 430,398 459,392 M392,440 L386,600 M430,440 L436,600 M412,262 C418,300 420,340 418,380"
            stroke="rgba(0,0,0,.3)"
            strokeWidth="1.4"
            fill="none"
          />
          <path d="M446,262 C452,288 457,332 459,372" stroke="rgba(220,235,245,.18)" strokeWidth="1.5" fill="none" />

          {/* Near arm, glove and needle driver */}
          <path
            d="M398,244 C392,272 392,320 398,344 C402,357 415,358 424,352 L470,344 L470,328 L432,331 C435,308 434,272 430,250 C424,243 406,240 398,244 Z"
            fill="url(#wds-gown)"
            stroke="rgba(0,0,0,.35)"
          />
          <path d="M432,331 L470,328" stroke="rgba(220,235,245,.2)" strokeWidth="1.2" />
          <path
            d="M470,328 L492,327 C500,327 508,330 512,334 C515,338 514,343 509,345 L490,346 L470,344 Z"
            fill="url(#wds-glove)"
          />
          <path d="M500,339 L546,353" stroke="#c7ced3" strokeWidth="1.5" strokeLinecap="round" />

          {/* Head, tilted 12° about C7 so the neck stays near neutral */}
          <g transform="rotate(12 398 222)">
            <path
              d="M455,156 C454,161 452,163 451,166 C454,171 458,176 461,180 C462,182 460,184 457,184 L455,185 C457,187 457,189 455,191 C457,193 457,196 454,199 C453,202 455,205 452,207 C448,210 440,210 432,210 C428,211 425,214 424,218 L394,218 C392,212 391,209 390,206 C388,196 384,186 382,174 C379,158 382,139 393,130 C405,121 428,122 440,128 C452,133 457,146 455,156 Z"
              fill="url(#wds-skin)"
            />
            <path
              d="M455,156 C454,161 452,163 451,166 C454,171 458,176 461,180"
              stroke="rgba(255,225,200,.22)"
              strokeWidth="1.2"
              fill="none"
            />
            <ellipse cx="410" cy="171" rx="5" ry="9" fill="#3a302a" />
            <path
              d="M456,150 C455,140 451,131 440,126 C427,119 403,119 391,128 C380,137 377,156 381,172 C383,182 386,190 389,196 C395,180 405,160 420,153 C432,148 446,148 456,150 Z"
              fill="url(#wds-cap)"
            />
            <path
              d="M451,170 C455,173 460,177 463,181 C465,190 462,200 456,207 C450,212 437,213 426,211 C423,200 421,185 421,173 C432,171 442,170 451,170 Z"
              fill="url(#wds-mask)"
            />
            <path d="M425,184 L460,186 M425,193 L461,195" stroke="rgba(0,0,0,.18)" fill="none" />
            <path d="M421,176 L412,166 M424,206 L409,180" stroke="#9fb4c4" strokeWidth=".9" opacity=".6" fill="none" />
            <path
              d="M440,166.5 Q444,168.5 448.5,166"
              stroke="#0b0d10"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Measurement */}
          {line > 0 && (
            <>
              <line
                x1={RADIX.x}
                y1={RADIX.y}
                x2={tipX}
                y2={tipY}
                stroke="#bae6fd"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".14"
              />
              <line
                x1={RADIX.x}
                y1={RADIX.y}
                x2={tipX}
                y2={tipY}
                stroke="url(#wds-tape)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </>
          )}
          <g className={`${styles.dot} ${phase >= 3 ? styles.dotOn : ''}`}>
            <circle cx={RADIX.x} cy={RADIX.y} r="9" fill="#fff" opacity=".12" />
            <circle cx={RADIX.x} cy={RADIX.y} r="3" fill="#fff" />
          </g>
          <g className={`${styles.dot} ${phase >= 4 ? styles.dotOn : ''}`}>
            <circle cx={WORK.x} cy={WORK.y} r="9" fill="#6ee7b7" opacity=".16" />
            <circle cx={WORK.x} cy={WORK.y} r="3" fill="#6ee7b7" />
          </g>

          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="url(#wds-fade)" />
        </svg>

        <span className={`${styles.pill} ${phase >= 3 ? styles.pillOn : ''}`} style={pct(RADIX.x + 16, RADIX.y - 22)}>
          <i />
          Nasal radix
        </span>
        <span className={`${styles.pill} ${phase >= 4 ? styles.pillOn : ''}`} style={pct(WORK.x + 16, WORK.y + 16)}>
          <i />
          Working point
        </span>
        <span
          className={`${styles.pill} ${styles.measure} ${measured ? styles.pillOn : ''}`}
          style={pct(mid.x, mid.y)}
        >
          {READING_MM} mm
        </span>
      </div>

      <div className={styles.foot}>
        <div aria-live="polite">
          <span className={styles.readoutLabel}>Working distance</span>
          <div className={styles.num}>
            {Math.round(READING_MM * line)}
            <small>mm</small>
          </div>
        </div>
        <button type="button" className={styles.replay} onClick={play}>
          Replay
        </button>
      </div>
      <p className="px-1 text-[13px] text-neutral-500">
        Example reading from this drawing, which is to scale. Yours will differ.
      </p>
    </div>
  )
}
