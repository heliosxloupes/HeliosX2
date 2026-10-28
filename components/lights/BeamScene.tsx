'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId, type CSSProperties } from 'react'

import type { Light } from '@/lib/lights'
import styles from './lights.module.css'

const MAX_LUX = 150000
const W = 480
const H = 270
const LAMP = { x: 240, y: 40 }
const POOL_Y = 196
const HORIZON = 150
const VANISH = { x: 240, y: 70 }

// Deterministic "random" so server and client draw the same dust.
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const MOTES = (() => {
  const rand = seeded(42)
  return Array.from({ length: 16 }, () => ({
    t: 0.12 + rand() * 0.72, // height down the cone
    side: rand() * 2 - 1, // position across it
    r: 0.6 + rand() * 1.1,
    dur: 5 + rand() * 6,
    delay: -rand() * 10,
    dx: (rand() * 2 - 1) * 10,
    dy: 14 + rand() * 22,
  }))
})()

// Perspective floor: rows tighten toward the horizon, columns run to one vanishing point.
const ROWS = [158, 166, 176, 188, 203, 221, 243, 268]
const COLS = Array.from({ length: 15 }, (_, index) => index - 7)

/**
 * A loupe light switched on over a working field, drawn to scale: the beam,
 * the pool it casts at 42 cm with its measured width, and dust caught in the
 * light. Spot size follows the spec sheet; glow strength follows lux. Changing
 * light flicks the beam back on.
 */
export default function BeamScene({ light, label = true }: { light: Light; label?: boolean }) {
  const reduceMotion = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const strength = 0.4 + (light.lux / MAX_LUX) * 0.6
  const rx = ((light.spotMm ?? 110) / 140) * 150
  const ry = rx * 0.27
  const lensHalf = 9

  const coneEdge = (t: number) => lensHalf + (rx * 0.92 - lensHalf) * t

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1411" stopOpacity="0" />
          <stop offset="100%" stopColor="#13201b" />
        </linearGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#ffe7bd" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffd28a" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${id}-core`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-pool`}>
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="35%" stopColor="#fff0cf" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#ffc979" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffa33a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lens`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fff4dc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd28a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0f0e" />
          <stop offset="45%" stopColor="#3a403d" />
          <stop offset="100%" stopColor="#0c0f0e" />
        </linearGradient>
        <radialGradient id={`${id}-lit`}>
          <stop offset="0%" stopColor="#fff" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-litmask`}>
          <ellipse cx={LAMP.x} cy={POOL_Y} rx={rx * 1.25} ry={ry * 1.9} fill={`url(#${id}-lit)`} />
        </mask>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Floor and its grid, faint in the dark */}
      <rect x="0" y={HORIZON - 30} width={W} height={H - HORIZON + 30} fill={`url(#${id}-floor)`} />
      <Grid stroke="rgba(238,242,238,0.05)" />

      <motion.g
        key={light.slug}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: [0, 0.8, 0.3, 1] }}
        transition={{ duration: 0.6, times: [0, 0.3, 0.5, 1], ease: 'easeOut' }}
      >
        {/* The grid where the light lands */}
        <g mask={`url(#${id}-litmask)`} opacity={0.25 + strength * 0.4}>
          <Grid stroke="rgba(255,236,200,0.55)" />
        </g>

        {/* Beam: a soft outer cone and a brighter core */}
        <path
          d={`M${LAMP.x - lensHalf} ${LAMP.y} L${LAMP.x + lensHalf} ${LAMP.y} L${LAMP.x + rx * 0.92} ${POOL_Y} L${LAMP.x - rx * 0.92} ${POOL_Y} Z`}
          fill={`url(#${id}-cone)`}
          filter={`url(#${id}-soft)`}
          opacity={0.45 + strength * 0.55}
        />
        <path
          d={`M${LAMP.x - 4} ${LAMP.y} L${LAMP.x + 4} ${LAMP.y} L${LAMP.x + rx * 0.4} ${POOL_Y} L${LAMP.x - rx * 0.4} ${POOL_Y} Z`}
          fill={`url(#${id}-core)`}
          filter={`url(#${id}-soft)`}
          opacity={0.2 + strength * 0.5}
        />

        {/* Pool of light at 42 cm, with bloom and a hotspot */}
        <ellipse cx={LAMP.x} cy={POOL_Y} rx={rx * 1.12} ry={ry * 1.2} fill={`url(#${id}-pool)`} filter={`url(#${id}-bloom)`} opacity={0.35 + strength * 0.5} />
        <ellipse cx={LAMP.x} cy={POOL_Y} rx={rx} ry={ry} fill={`url(#${id}-pool)`} opacity={0.55 + strength * 0.45} />
        <ellipse cx={LAMP.x} cy={POOL_Y} rx={rx * 0.32} ry={ry * 0.32} fill="#fffdf8" filter={`url(#${id}-soft)`} opacity={0.3 + strength * 0.6} />
        <ellipse cx={LAMP.x} cy={POOL_Y} rx={rx} ry={ry} fill="none" stroke="rgba(255,240,214,0.45)" strokeDasharray="1.5 4" />

        {/* Dust caught in the beam */}
        {MOTES.map((mote, index) => {
          const y = LAMP.y + (POOL_Y - LAMP.y) * mote.t
          const x = LAMP.x + mote.side * coneEdge(mote.t) * 0.8
          return (
            <circle
              key={index}
              cx={x.toFixed(2)}
              cy={y.toFixed(2)}
              r={mote.r.toFixed(2)}
              fill="#fff6e2"
              className={styles.mote}
              style={
                {
                  '--dur': `${mote.dur.toFixed(2)}s`,
                  '--delay': `${mote.delay.toFixed(2)}s`,
                  '--dx': `${mote.dx.toFixed(1)}px`,
                  '--dy': `${mote.dy.toFixed(1)}px`,
                  '--peak': (0.35 + strength * 0.5).toFixed(2),
                } as CSSProperties
              }
            />
          )
        })}

        {/* Lens glow */}
        <circle cx={LAMP.x} cy={LAMP.y} r={10 + strength * 14} fill={`url(#${id}-lens)`} filter={`url(#${id}-bloom)`} className={styles.lens} />
      </motion.g>

      {/* Lamp head, seen from above and in front */}
      <rect x={LAMP.x - 12} y={LAMP.y - 30} width="24" height="28" rx="6" fill={`url(#${id}-body)`} />
      {[0, 1, 2, 3].map((index) => (
        <line key={index} x1={LAMP.x - 12} x2={LAMP.x + 12} y1={LAMP.y - 24 + index * 4} y2={LAMP.y - 24 + index * 4} stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" />
      ))}
      <ellipse cx={LAMP.x} cy={LAMP.y - 1} rx="11" ry="3.6" fill="#fffaf0" />
      <ellipse cx={LAMP.x} cy={LAMP.y - 1} rx="11" ry="3.6" fill="none" stroke="#1a1f1d" strokeWidth="1.5" />

      {/* Measured spot width */}
      {light.spotMm ? (
        <g stroke="rgba(238,242,238,0.45)" strokeWidth="1">
          <line x1={LAMP.x - rx} x2={LAMP.x + rx} y1={POOL_Y + ry + 20} y2={POOL_Y + ry + 20} />
          <line x1={LAMP.x - rx} x2={LAMP.x - rx} y1={POOL_Y + ry + 15} y2={POOL_Y + ry + 25} />
          <line x1={LAMP.x + rx} x2={LAMP.x + rx} y1={POOL_Y + ry + 15} y2={POOL_Y + ry + 25} />
          <rect x={LAMP.x - 30} y={POOL_Y + ry + 12} width="60" height="16" rx="8" fill="#0d1512" stroke="none" />
          <text x={LAMP.x} y={POOL_Y + ry + 24} textAnchor="middle" fill="rgba(238,242,238,0.85)" stroke="none" fontSize="11" fontWeight="700">
            {light.spotMm} mm
          </text>
        </g>
      ) : null}

      {label ? (
        <>
          <text x="20" y="28" fill="rgba(238,242,238,0.6)" fontSize="11" fontWeight="700" letterSpacing="1.4">
            AT 42 CM
          </text>
          <text x={W - 20} y="28" textAnchor="end" fill="rgba(238,242,238,0.92)" fontSize="12" fontWeight="800">
            {light.watts} W
          </text>
          <text x={W - 20} y="44" textAnchor="end" fill="rgba(238,242,238,0.55)" fontSize="10.5" fontWeight="600">
            {light.lux.toLocaleString('en-US')} lux
          </text>
        </>
      ) : null}
    </svg>
  )
}

function Grid({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1" fill="none">
      {ROWS.map((y) => (
        <line key={`r${y}`} x1="0" x2={W} y1={y} y2={y} />
      ))}
      {COLS.map((k) => {
        const bottomX = VANISH.x + k * 70
        const topX = VANISH.x + ((bottomX - VANISH.x) * (ROWS[0] - VANISH.y)) / (H - VANISH.y)
        return <line key={`c${k}`} x1={topX.toFixed(2)} y1={ROWS[0]} x2={bottomX} y2={H} />
      })}
    </g>
  )
}
