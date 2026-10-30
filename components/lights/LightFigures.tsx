'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

import type { Light } from '@/lib/lights'

const EASE = [0.23, 1, 0.32, 1] as const
const MAX_LUX = 150000

// A loupe light seen from above the field: the cone and the pool of light it
// casts. Spot width is to scale across the range; glow strength follows lux.
export function BeamFigure({ light, label = true }: { light: Light; label?: boolean }) {
  const reduceMotion = useReducedMotion()
  // Several figures can share a page, so gradient ids must be unique.
  const id = useId().replace(/:/g, '')
  const rx = ((light.spotMm ?? 110) / 140) * 118
  const strength = Math.min(1, 0.35 + (light.lux / MAX_LUX) * 0.65)
  const t = { duration: reduceMotion ? 0 : 0.6, ease: EASE }
  return (
    <svg viewBox="0 0 320 172" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-pool`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8ea" />
          <stop offset="55%" stopColor="#ffe3b0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffa33a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4dc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff4dc" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <motion.path
        initial={false}
        animate={{ d: `M154 22 L166 22 L${160 + rx * 0.82} 134 L${160 - rx * 0.82} 134 Z`, opacity: strength }}
        transition={t}
        fill={`url(#${id}-cone)`}
      />
      <motion.ellipse cx="160" cy="134" initial={false} animate={{ rx, ry: rx * 0.22, opacity: strength }} transition={t} fill={`url(#${id}-pool)`} />
      <motion.ellipse
        cx="160"
        cy="134"
        initial={false}
        animate={{ rx: rx * 0.86, ry: rx * 0.19 }}
        transition={t}
        fill="none"
        stroke="rgba(238,242,238,0.38)"
        strokeDasharray="2 4"
      />
      <rect x="150" y="10" width="20" height="14" rx="4" fill="#eef2ee" />
      {label ? (
        <>
      <text x="16" y="24" fill="rgba(238,242,238,0.66)" fontSize="10.5" fontWeight="700" letterSpacing="1.4">
        AT 42 CM
      </text>
      {light.watts ? (
        <text x="304" y="24" textAnchor="end" fill="rgba(238,242,238,0.9)" fontSize="11" fontWeight="800">
          {light.watts} W
        </text>
      ) : null}
        </>
      ) : null}
    </svg>
  )
}

// Hours on one charge, drawn on a 12-hour dial. Wireless lights show one arc
// per included battery, with a gap where you swap.
export function BatteryRing({ segments, tone = 'paper' }: { segments: number[]; tone?: 'paper' | 'dark' }) {
  const reduceMotion = useReducedMotion()
  const dark = tone === 'dark'
  const size = 92
  const r = 38
  const c = 2 * Math.PI * r
  const hour = c / 12
  const gap = segments.length > 1 ? 3 : 0
  const total = segments.reduce((sum, value) => sum + value, 0)
  let offset = 0
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(8,38,27,0.1)'} strokeWidth="7" />
        {segments.map((hours, index) => {
          const length = hours * hour - gap
          const start = offset
          offset += hours * hour
          return (
            <motion.circle
              key={`${segments.length}-${index}`}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={dark ? '#34d399' : '#0b6b53'}
              strokeWidth="7"
              strokeLinecap="butt"
              initial={reduceMotion ? false : { strokeDasharray: `0 ${c}` }}
              animate={{ strokeDasharray: `${length} ${c}` }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE, delay: reduceMotion ? 0 : index * 0.12 }}
              style={{ strokeDashoffset: -start }}
            />
          )
        })}
        {Array.from({ length: 12 }, (_, index) => {
          // Rounded so server and client render identical attributes.
          const at = (radius: number, fn: (angle: number) => number) => (size / 2 + radius * fn((index / 12) * 2 * Math.PI)).toFixed(2)
          return (
            <line key={index} x1={at(r - 5, Math.cos)} y1={at(r - 5, Math.sin)} x2={at(r + 5, Math.cos)} y2={at(r + 5, Math.sin)} stroke={dark ? 'rgba(10,14,13,0.95)' : '#f7f9f7'} strokeWidth="1.5" />
          )
        })}
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="tab block text-[22px] font-extrabold leading-none">{total}</span>
          <span className={`block text-[10.5px] font-bold uppercase tracking-[0.12em] ${dark ? 'text-neutral-400' : 'text-[#4d5f54]'}`}>hrs</span>
        </span>
      </span>
    </div>
  )
}
