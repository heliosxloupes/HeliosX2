'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import Header from '@/components/Header'
import WorkingDistanceSchematic from '@/components/measurements/WorkingDistanceSchematic'
import MaskedLines from '@/components/motion/MaskedLines'
import Reveal from '@/components/motion/Reveal'
import ScrollProgressBar from '@/components/motion/ScrollProgressBar'

type Faq = {
  question: string
  answer: string
}

type StepImage = {
  src: string
  alt: string
  width: number
  height: number
  label?: string
  photo?: boolean
}

type Step = {
  title: string
  body: string
  image?: StepImage
  visual?: 'working-distance-schematic'
}

type MeasurementsExperienceProps = {
  faqs: Faq[]
  steps: Step[]
}

const HERO_PHOTO = '/images/measurements/working-distance-radix-tape.jpg'
const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
}

const pad = (n: number) => String(n).padStart(2, '0')
const stepAnchor = (step: Step, index: number) =>
  step.visual === 'working-distance-schematic' ? 'working-distance' : `step-${index + 1}`

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <section ref={ref} className="relative min-h-[92svh] overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 md:left-auto md:w-[58%]"
        initial={{ opacity: 0, clipPath: 'inset(6% 0% 6% 12% round 28px)' }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: photoY, scale: photoScale }}>
          <Image
            src={HERO_PHOTO}
            alt="Surgeon at the operating table while a colleague holds a tape measure from her nasal radix down to her instrument tips"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 58vw"
            className="object-cover object-[50%_32%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 md:bg-gradient-to-r md:from-black md:via-black/25 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        className="relative z-10 flex min-h-[92svh] flex-col justify-end px-5 pb-10 pt-28 md:px-12 md:pb-16"
      >
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl space-y-6">
          <motion.p
            variants={fadeUp}
            className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md"
          >
            Measurements
          </motion.p>
          <h1 className="text-[clamp(3rem,7vw,6.25rem)] font-bold leading-[0.94] text-white">
            <MaskedLines
              delay={0.2}
              lines={[
                { text: 'Measure once.' },
                {
                  text: 'Build around you.',
                  className: 'bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent',
                },
              ]}
            />
          </h1>
          <motion.p variants={fadeUp} className="max-w-xl text-sm leading-7 text-neutral-200 md:text-base md:leading-8">
            Accurate pupillary distance and working distance help your loupes align with your eyes, your posture, and
            the way you actually work.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link
              href="/measurements/ipd"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition hover:bg-neutral-200"
            >
              Measure PD with camera
            </Link>
            <Link
              href="/product"
              className="rounded-full border border-white/20 bg-black/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Shop loupes
            </Link>
            <Link
              href="#working-distance"
              className="rounded-full border border-white/20 bg-black/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Measure working distance
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
        style={reduce ? undefined : { y: cardY }}
        className="absolute bottom-14 right-12 z-20 hidden w-[320px] rounded-[22px] border border-white/10 bg-black/45 p-5 backdrop-blur-xl lg:block"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">Two measurements</p>
        <p className="mt-3 text-[15px] leading-6 text-white">
          Pupillary distance and working distance are the numbers your loupes are built from.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">Time</dt>
            <dd className="mt-1 text-sm text-neutral-100">About 10 minutes</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">You need</dt>
            <dd className="mt-1 text-sm text-neutral-100">Tape, PD app, a colleague</dd>
          </div>
        </dl>
      </motion.aside>
    </section>
  )
}

function StepArticle({
  step,
  index,
  onActive,
}: {
  step: Step
  index: number
  onActive: (index: number) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const inFocus = useInView(ref, { margin: '-45% 0px -50% 0px' })

  useEffect(() => {
    if (inFocus) onActive(index)
  }, [inFocus, index, onActive])

  return (
    <article
      ref={ref}
      id={stepAnchor(step, index)}
      className="scroll-mt-28 border-t border-white/10 pt-10 first:border-t-0 first:pt-0"
    >
      <Reveal>
        <p
          aria-hidden="true"
          className="font-[family-name:var(--font-display)] text-5xl font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(186,230,253,0.45)] md:text-6xl"
        >
          {pad(index + 1)}
        </p>
        <p className="sr-only">Step {index + 1}</p>
        <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">{step.title}</h2>
        <p className="mt-5 max-w-[68ch] text-base leading-8 text-neutral-300">{step.body}</p>
        {index === 0 && (
          <Link href="/measurements/ipd" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
            Open camera measurement tool
          </Link>
        )}
      </Reveal>

      {step.visual === 'working-distance-schematic' && (
        <Reveal
          delay={0.1}
          className="mt-8 rounded-[24px] border border-white/10 bg-[#050b16] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
            Working distance · Standing
          </p>
          <WorkingDistanceSchematic />
        </Reveal>
      )}

      {step.image && (
        <Reveal
          delay={0.1}
          className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-[#050b16] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
        >
          {step.image.label && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              {step.image.label}
            </p>
          )}
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 ${
              step.image.photo ? 'bg-black' : 'min-h-[280px] bg-white p-3'
            }`}
          >
            <motion.div
              className="w-full"
              initial={{ scale: 1.06, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <Image
                src={step.image.src}
                alt={step.image.alt}
                width={step.image.width}
                height={step.image.height}
                sizes="(max-width: 1023px) 100vw, 760px"
                className={step.image.photo ? 'h-auto w-full' : 'h-auto max-h-[480px] w-full object-contain'}
              />
            </motion.div>
          </div>
        </Reveal>
      )}
    </article>
  )
}

function Steps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section className="bg-neutral-950/70 px-5 py-16 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">The process</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
            {steps.length} steps.{' '}
            <span className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
              Two numbers that matter.
            </span>
          </h2>
        </Reveal>

        <div ref={ref} className="mt-14 grid gap-12 lg:grid-cols-[250px,1fr] lg:gap-16">
          <nav aria-label="Steps" className="hidden lg:block">
            <div className="sticky top-28 flex gap-5">
              <div className="relative w-px bg-white/10">
                <motion.div
                  className="absolute inset-0 origin-top bg-gradient-to-b from-white via-sky-200 to-emerald-300"
                  style={{ scaleY: fill }}
                />
              </div>
              <ol className="space-y-4 py-1">
                {steps.map((step, index) => (
                  <li key={step.title}>
                    <a
                      href={`#${stepAnchor(step, index)}`}
                      aria-current={active === index ? 'step' : undefined}
                      className={`block text-sm leading-5 transition-colors duration-300 ${
                        active === index ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <span
                        className={`mr-2 font-semibold tabular-nums transition-colors duration-300 ${
                          active === index ? 'text-emerald-300' : ''
                        }`}
                      >
                        {pad(index + 1)}
                      </span>
                      {step.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <StepArticle key={step.title} step={step} index={index} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function MeasurementsExperience({ faqs, steps }: MeasurementsExperienceProps) {
  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main className="hx-mobile-editorial min-h-screen bg-black text-neutral-100">
        <Hero />
        <Steps steps={steps} />

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Evidence note
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Smartphone PD apps are accurate enough for your loupe order.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-base leading-8 text-neutral-300">
              <p>
                A 2023 peer-reviewed study compared smartphone pupillary distance applications against a digital pupilometer and confirmed that the leading apps measure accurately enough to support a confident loupe order from home. Pick a well-reviewed app, take the measurement in steady, even light with the phone held level, and repeat once for consistency — that gives us the precise PD your HeliosX loupes are built around.
              </p>
              <Link
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10389117/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold text-emerald-200 hover:text-white"
              >
                Read the PubMed Central study
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24">
          <Reveal className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Questions
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Measurement FAQ</h2>
            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white transition group-open:text-emerald-200">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
    </>
  )
}
