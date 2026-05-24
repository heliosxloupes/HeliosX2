'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'framer-motion'

import Header from '@/components/Header'
import { LenisProvider } from '@/components/lenis-provider'

type Faq = {
  question: string
  answer: string
}

type Step = {
  title: string
  body: string
}

type MeasurementsExperienceProps = {
  faqs: Faq[]
  steps: Step[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[200] h-[1.5px] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, rgba(52,211,153,0.92), rgba(125,211,252,0.92), rgba(52,211,153,0.72))',
      }}
    />
  )
}

export default function MeasurementsExperience({ faqs, steps }: MeasurementsExperienceProps) {
  return (
    <LenisProvider>
      <ScrollProgressBar />
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section className="relative min-h-[92svh] overflow-hidden">
          <Image
            src="/working distance.png"
            alt="Clinician measuring working distance for loupes"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.92)_10%,rgba(0,0,0,0.68)_48%,rgba(0,0,0,0.26)_76%,rgba(0,0,0,0.84)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/42 to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 flex min-h-[92svh] flex-col justify-end px-5 pb-10 pt-28 md:px-12 md:pb-14"
          >
            <div className="max-w-4xl space-y-6">
              <motion.p variants={fadeUp} className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md">
                Measurements
              </motion.p>
              <h1 className="text-[clamp(3rem,7.5vw,6.75rem)] font-bold leading-[0.94] text-white">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '108%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.78, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Measure once.
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    className="block bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent"
                    initial={{ y: '108%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.78, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Build around you.
                  </motion.span>
                </span>
              </h1>
              <motion.p variants={fadeUp} className="max-w-2xl text-sm leading-7 text-neutral-200 md:text-base md:leading-8">
                Accurate pupillary distance and working distance help your loupes align with your eyes, your posture, and the way you actually work.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link
                  href="/product"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition hover:bg-neutral-200"
                >
                  Shop loupes
                </Link>
                <Link
                  href="/education/how-to-measure-pupillary-distance"
                  className="rounded-full border border-white/20 bg-black/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
                >
                  Read PD guide
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="px-5 py-16 md:px-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true, amount: 0.18 }}
            className="mx-auto max-w-6xl"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Visual guide
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              The two measurements that drive fit.
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-[#050b16] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-6">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-300/15 bg-black">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.28),transparent_22%,transparent_78%,rgba(0,0,0,0.28))]" />
                <Image
                  src="/workingdistance.png"
                  alt="Dark HeliosX diagram showing working distance from the eye to the normal focal point"
                  width={728}
                  height={686}
                  className="mx-auto h-auto max-h-[680px] w-full max-w-5xl object-contain"
                  priority
                />
              </div>
            </motion.div>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {[
                ['/pupillary distance.png', 'Pupillary distance', 'Diagram showing pupillary distance measured between pupil centers', 1196, 777],
                ['/workdistance diagram.png', 'Posture reference', 'Diagram showing working distance from eye to focal point', 600, 732],
              ].map(([src, label, alt, width, height]) => (
                <motion.div key={src} variants={fadeUp} className="overflow-hidden rounded-[24px] border border-white/10 bg-[#050b16] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                    {label}
                  </p>
                  <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,11,22,0.08),transparent_18%,transparent_82%,rgba(5,11,22,0.08))]" />
                    <Image
                      src={src as string}
                      alt={alt as string}
                      width={width as number}
                      height={height as number}
                      className="h-auto max-h-[520px] w-full object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="border-y border-white/10 bg-neutral-950/70 px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.26 }}
                className="grid gap-8 border-t border-white/10 pt-8 first:border-t-0 first:pt-0 lg:grid-cols-[0.34fr,0.66fr]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{step.title}</h2>
                </div>
                <p className="text-base leading-8 text-neutral-300">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, amount: 0.2 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Evidence note
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Smartphone PD apps can help, but measure carefully.
              </h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, amount: 0.2 }} className="space-y-5 text-base leading-8 text-neutral-300">
              <p>
                A 2023 peer-reviewed study compared smartphone pupillary distance applications against a digital pupilometer and found that app accuracy varies. Use apps as a helpful tool, not as a reason to rush the measurement.
              </p>
              <Link
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10389117/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold text-emerald-200 hover:text-white"
              >
                Read the PubMed Central study
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
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
          </div>
        </section>
      </main>
    </LenisProvider>
  )
}
