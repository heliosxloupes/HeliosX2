'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useCarouselDots } from '@/components/useCarouselDots'

type OrderingStep = {
  number: string
  kicker: string
  title: string
  body: string
  bullets: string[]
  note?: string
  accent: {
    rgb: string
    text: string
    border: string
    dot: string
    glow: string
  }
}

const steps: OrderingStep[] = [
  {
    number: '01',
    kicker: 'Configure',
    title: 'Choose your system and magnification',
    body: 'Start on the product page. Pick the HeliosX system that matches your work, choose your frame style, and select the magnification that fits the procedures you do most often.',
    bullets: [
      '2.5x – 3.5x for general practice and training use',
      'Higher magnification for fine, focused work',
      'You can always discuss changes with us before we build',
    ],
    accent: {
      rgb: '52, 211, 153',
      text: 'text-emerald-200',
      border: 'border-emerald-300/30',
      dot: 'bg-emerald-300',
      glow: 'shadow-[0_0_40px_-12px_rgba(52,211,153,0.55)]',
    },
  },
  {
    number: '02',
    kicker: 'Checkout',
    title: 'Secure checkout, then a fit request email',
    body: 'Complete checkout on our encrypted payment page. Once your order is placed, you will receive an email with simple instructions to submit:',
    bullets: [
      'Pupillary distance (PD)',
      'Preferred working distance (approximate is okay)',
      'Optional prescription details if you use Rx lenses',
    ],
    note: 'If you do not know your PD or working distance, we guide you through measuring it or using a phone-based tool — no special equipment required.',
    accent: {
      rgb: '125, 211, 252',
      text: 'text-sky-200',
      border: 'border-sky-300/30',
      dot: 'bg-sky-300',
      glow: 'shadow-[0_0_40px_-12px_rgba(125,211,252,0.55)]',
    },
  },
  {
    number: '03',
    kicker: 'Build & ship',
    title: 'We build your loupes, then ship to you',
    body: 'Once we receive and confirm your measurements, your loupes move into production. We verify alignment, optics, and ergonomics before they leave the lab.',
    bullets: [
      'Your card is charged at checkout, but build starts after fit confirmation',
      'You will receive status updates as your order progresses',
      'If something looks off with your measurements, we reach out before shipping',
    ],
    accent: {
      rgb: '253, 186, 116',
      text: 'text-amber-200',
      border: 'border-amber-300/30',
      dot: 'bg-amber-300',
      glow: 'shadow-[0_0_40px_-12px_rgba(253,186,116,0.55)]',
    },
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const headerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const stepsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
}

function StepCard({ step, index }: { step: OrderingStep; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative flex h-full shrink-0 basis-[85%] snap-center flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#050b16]/85 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-white/25 sm:basis-[62%] md:basis-auto md:shrink md:p-8 ${step.accent.glow}`}
    >
      {/* Ambient gradient wash, tinted to step accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, rgba(${step.accent.rgb}, 0.16), transparent 55%), radial-gradient(80% 80% at 100% 100%, rgba(${step.accent.rgb}, 0.08), transparent 60%)`,
        }}
      />

      {/* Watermark step number */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-none absolute -right-2 -top-4 select-none text-[4rem] font-bold leading-none tracking-tight ${step.accent.text} opacity-[0.08] md:text-[5rem]`}
      >
        {step.number}
      </motion.span>

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${step.accent.border} bg-black/45 text-xs font-semibold ${step.accent.text}`}
            style={{
              boxShadow: `0 0 18px -6px rgba(${step.accent.rgb}, 0.6)`,
            }}
          >
            {step.number}
          </span>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${step.accent.text}`}>
            {step.kicker}
          </p>
        </div>

        <h3 className="mt-6 text-xl font-semibold leading-tight text-white md:text-2xl">
          {step.title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-neutral-300 md:text-[15px]">
          {step.body}
        </p>

        <ul className="mt-6 space-y-3 text-sm leading-6 text-neutral-300">
          {step.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span
                className={`mt-[9px] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${step.accent.dot}`}
                style={{ boxShadow: `0 0 8px rgba(${step.accent.rgb}, 0.6)` }}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {step.note ? (
          <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-neutral-400">
            {step.note}
          </p>
        ) : null}

        {/* Bottom accent rail */}
        <div className="relative mt-auto pt-8">
          <div className="h-px w-full overflow-hidden bg-white/5">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 1.1,
                delay: 0.35 + 0.18 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: 'left',
                background: `linear-gradient(90deg, rgba(${step.accent.rgb}, 0) 0%, rgba(${step.accent.rgb}, 0.85) 50%, rgba(${step.accent.rgb}, 0) 100%)`,
              }}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function OrderingInfoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const { scrollerRef, activeIndex, scrollToIndex } =
    useCarouselDots<HTMLDivElement>(steps.length)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-black"
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-32 left-[12%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[8%] h-[480px] w-[480px] rounded-full bg-sky-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-[1180px] px-5 py-24 md:px-12 md:py-32">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerContainer}
          className="mb-16 max-w-3xl md:mb-20"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gradient-to-r from-emerald-300/70 to-transparent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
              Ordering information
            </p>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-3xl font-semibold leading-[1.05] text-white md:text-5xl"
          >
            How HeliosX ordering works.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-[17px]"
          >
            We separate two things: choosing your system and magnification, and dialing in your fit
            (PD, working distance, and optional prescription). You can place your order first — your
            loupes do not go into production until your measurements are confirmed.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={scrollerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={stepsContainer}
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-7 md:overflow-visible md:px-0 md:pb-0"
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </motion.div>

        {/* Mobile pagination dots */}
        <div className="mt-5 flex justify-center gap-2 md:hidden">
          {steps.map((step, i) => (
            <button
              key={step.number}
              type="button"
              aria-label={`Go to step ${step.number}: ${step.kicker}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* PD and Rx callout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 overflow-hidden rounded-[28px] border border-sky-300/25 bg-gradient-to-br from-sky-500/[0.08] via-emerald-500/[0.05] to-transparent p-7 backdrop-blur-sm md:mt-20 md:p-9"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.08),transparent_55%)]" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="md:w-[34%]">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-sky-300/80 to-transparent" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                  PD &amp; prescription workflow
                </p>
              </div>
              <p className="mt-4 text-lg font-semibold leading-snug text-white md:text-xl">
                Order first. We handle the fit, step by step.
              </p>
            </div>

            <p className="text-sm leading-8 text-neutral-200 md:flex-1 md:text-[15px]">
              You do not need your PD or Rx ready to explore frames and magnification. Place your
              order, and we handle the fit process step-by-step via email. No guessing, no pressure
              — just clear instructions and a final double-check before your HeliosX system is
              built.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OrderingInfoSection
