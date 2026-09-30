'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 0.61, 0.36, 1] as const
const spring = { type: 'spring', stiffness: 420, damping: 22 } as const

const pill =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] outline-none transition-colors duration-300 focus-visible:ring-2'

type Props = { label: string; onClick: () => void }

// Edit: the pencil tilts forward as if about to write, and a cyan focus line
// draws under the label.
export function CartEditButton({ label, onClick }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className={`${pill} border-white/15 bg-white/[0.03] text-neutral-200 hover:border-[#48CFC8]/50 hover:bg-[#48CFC8]/10 hover:text-white focus-visible:ring-[#48CFC8]/60`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ originX: 0.2, originY: 0.8 }}
        variants={reduceMotion ? {} : { rest: { rotate: 0, x: 0, y: 0 }, hover: { rotate: -14, x: 1, y: -1 } }}
        transition={spring}
      >
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </motion.svg>
      <span className="relative">
        Edit
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full bg-[#48CFC8]"
          style={{ originX: 0 }}
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.35, ease }}
        />
      </span>
    </motion.button>
  )
}

// Remove: the bin lid lifts open and the pill warms to red.
export function CartRemoveButton({ label, onClick }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className={`${pill} border-white/10 bg-transparent text-neutral-400 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-red-400/60`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.g
          style={{ originX: 0.15, originY: 1 }}
          variants={reduceMotion ? {} : { rest: { rotate: 0, y: 0 }, hover: { rotate: -22, y: -2.5 } }}
          transition={spring}
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </motion.g>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
      <span>Remove</span>
    </motion.button>
  )
}
