'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { TRAINEE_PERCENT_OFF } from '@/lib/pricing'

const EMAIL = 'heliosxloupes@gmail.com'
const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('Resident / student discount verification')}&body=${encodeURIComponent(
  'Hi HeliosX,\n\nI would like to verify my training status for the resident/student discount.\n\nName:\nProgram / school:\nYear of training and expected graduation:\nModel and magnification I am considering:\n\nProof of status attached (program ID, enrollment letter, or a screenshot of my program profile).\n\nThanks,',
)}`

const steps = [
  {
    title: 'Email us',
    body: (
      <>
        Write to <span className="font-medium text-white">{EMAIL}</span> with your program, year of training and the model you
        are considering.
      </>
    ),
  },
  {
    title: 'Attach proof of status',
    body: 'A current program ID, enrollment or residency letter, or a screenshot of your program profile.',
  },
  {
    title: 'Get your code',
    body: 'We confirm eligibility and reply with a personal discount code for checkout, usually within one business day.',
  },
]

const ease = [0.16, 1, 0.3, 1] as const

export default function ResidentDiscountBadge() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const badgeRef = useRef<HTMLAnchorElement>(null)
  // The hero headline stacks above this block, so the panel renders in a
  // portal and opens beside the badge, bottom edges aligned.
  const [anchor, setAnchor] = useState<{ left: number; bottom: number } | null>(null)

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    const rect = badgeRef.current?.getBoundingClientRect()
    if (rect) setAnchor({ left: rect.right + 14, bottom: Math.max(16, window.innerHeight - rect.bottom) })
    setOpen(true)
  }
  // Short grace period so the pointer can travel from the badge into the panel.
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onScroll = () => setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  // Hover only where a real pointer exists; touch keeps the plain link.
  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => canHover() && show()}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hide()
      }}
    >
      <Link
        ref={badgeRef}
        href="/product"
        aria-expanded={open}
        aria-controls="resident-discount-panel"
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200 backdrop-blur-sm transition-colors duration-300 ${
          open ? 'border-emerald-300/60 bg-emerald-500/20' : 'border-emerald-300/30 bg-emerald-500/10 hover:border-emerald-300/50'
        }`}
      >
        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
        Resident &amp; Student Discounts
      </Link>

      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {open && anchor && (
          <motion.div
            id="resident-discount-panel"
            role="dialog"
            aria-label="How resident and student discounts work"
            onMouseEnter={show}
            onMouseLeave={hide}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -10, scale: 0.94, clipPath: 'circle(0% at 0% 100%)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1, clipPath: 'circle(150% at 0% 100%)' }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -6, scale: 0.97, clipPath: 'circle(0% at 0% 100%)' }
            }
            transition={{ duration: 0.55, ease }}
            style={{ transformOrigin: '0% 100%', left: anchor.left, bottom: anchor.bottom }}
            className="fixed z-[70] w-[min(440px,calc(100vw-3rem))] overflow-hidden rounded-[28px] border border-white/[0.14] bg-[rgba(16,20,26,0.52)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_40px_100px_-30px_rgba(0,0,0,0.85)] backdrop-blur-[30px] backdrop-saturate-[1.8]"
          >
            {/* glass sheen and optical edge light */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_0%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#48CFC8]/60 to-transparent" />

            {/* Blur sits on the content, not the glass: a filter on the glass
                element itself would switch off its backdrop blur. */}
            <motion.div
              className="relative"
              initial={reduceMotion ? false : { filter: 'blur(10px)' }}
              animate={{ filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              transition={{ duration: 0.55, ease }}
            >

            <div className="px-6 pb-5 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5EE0D8]">
                Resident &amp; student pricing
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold leading-snug tracking-[-0.01em] text-white">
                Verify once. Save {TRAINEE_PERCENT_OFF}% on any pair.
              </h3>

              <ol className="relative mt-6 space-y-5">
                {/* the line draws down through the steps */}
                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-3 left-[13px] top-3 w-px bg-gradient-to-b from-[#48CFC8]/60 via-emerald-400/30 to-transparent"
                  style={{ originY: 0 }}
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease }}
                />
                {steps.map((step, index) => (
                  <motion.li
                    key={step.title}
                    className="relative flex gap-4"
                    initial={reduceMotion ? false : { opacity: 0, x: -8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.45, delay: 0.18 + index * 0.09, ease }}
                  >
                    <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#48CFC8]/50 bg-[#121a1f] text-xs font-bold tabular-nums text-[#5EE0D8]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-300">{step.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            <motion.div
              className="flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.04] px-6 py-4"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <span className="text-xs leading-snug text-neutral-300">
                Residents, fellows, medical and dental students.
              </span>
              <a
                href={mailto}
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-200 px-4 py-2.5 text-[13px] font-semibold text-[#06100b] transition-colors duration-300 hover:bg-white"
              >
                Email to verify
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  )
}
