'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'

import Header from '@/components/Header'
import { LenisProvider } from '@/components/lenis-provider'
import SeoAnalytics from '@/components/SeoAnalytics'
import { linkifyText } from '@/components/seo/linkify'
import type { SeoLandingPage } from '@/lib/seo-content'

type ModelRow = {
  name: string
  href: string
  positioning: string
}

type SeoLandingExperienceProps = {
  page: SeoLandingPage
  modelRows: ModelRow[]
}

function slugifySectionTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
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

function MagneticWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 18 })
  const springY = useSpring(y, { stiffness: 180, damping: 18 })

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - (rect.left + rect.width / 2)) * 0.18)
        y.set((event.clientY - (rect.top + rect.height / 2)) * 0.18)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function getHeroImage(slug: string) {
  if (slug === 'dental-loupes') {
    return {
      src: '/mirrorshotdental.png',
      alt: 'Dental clinician using a mirror retractor during a chairside procedure with HeliosX loupes',
    }
  }

  if (slug.includes('dental') || slug.includes('hygienist') || slug.includes('lumadent')) {
    return {
      src: '/Galileo/girlinmirror.png',
      alt: 'Clinician wearing HeliosX loupes during dental and clinical preparation',
    }
  }

  if (slug.includes('student') || slug.includes('resident') || slug.includes('affordable') || slug.includes('cheap')) {
    return {
      src: '/Newton/NewtonAsian.png',
      alt: 'HeliosX lightweight loupes for students and residents',
    }
  }

  if (slug.includes('prismatic') || slug.includes('ergonomic') || slug.includes('surgitel') || slug.includes('admetec')) {
    return {
      src: '/Medusa/MedusaDoctorSeated.png',
      alt: 'Clinician wearing HeliosX ergonomic prismatic loupes',
    }
  }

  if (slug.includes('comparison') || slug.includes('alternative') || slug.includes('orascoptic') || slug.includes('q-optics') || slug.includes('examvision')) {
    return {
      src: '/Apollo/Apollowomanscrubbing.png',
      alt: 'Clinician preparing with HeliosX loupes before a procedure',
    }
  }

  return {
    src: '/Apollo/Apollo3xFemale2.png',
    alt: 'Surgeon wearing HeliosX loupes in a clinical setting',
  }
}

function useParallax() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.76])

  return { ref, scale, opacity }
}

export default function SeoLandingExperience({ page, modelRows }: SeoLandingExperienceProps) {
  const hero = getHeroImage(page.slug)
  const heroMotion = useParallax()

  const relatedGuides = [
    { href: '/education/loupe-magnification-guide', label: 'Magnification guide' },
    { href: '/education/intraoperative-magnification-by-specialty', label: 'Magnification by specialty' },
    { href: '/education/galilean-vs-prismatic-loupes', label: 'Galilean vs prismatic' },
    { href: '/education/working-distance-for-loupes', label: 'Working distance' },
    { href: '/measurements', label: 'Measurements' },
  ]

  const highIntentLinks = [
    { href: '/best-dental-loupe-brands', label: 'Best dental loupe brands' },
    { href: '/best-surgical-loupe-brands', label: 'Best surgical loupe brands' },
    { href: '/student-loupe-comparison', label: 'Student loupe comparison' },
    { href: '/ergonomic-loupe-comparison', label: 'Ergonomic loupe comparison' },
    { href: '/prismatic-loupe-comparison', label: 'Prismatic loupe comparison' },
    { href: '/heliosx-vs-lumadent', label: 'HeliosX vs LumaDent' },
    { href: '/heliosx-vs-orascoptic', label: 'HeliosX vs Orascoptic' },
    { href: '/heliosx-vs-surgitel', label: 'HeliosX vs SurgiTel' },
  ].filter((link) => link.href !== `/${page.slug}`)

  return (
    <LenisProvider>
      <SeoAnalytics pageType="seo_landing" pageName={page.title} />
      <ScrollProgressBar />
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section ref={heroMotion.ref} className="relative min-h-[94svh] overflow-hidden">
          <motion.div style={{ scale: heroMotion.scale, opacity: heroMotion.opacity }} className="absolute inset-0">
            <Image src={hero.src} alt={hero.alt} fill priority className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.92)_8%,rgba(0,0,0,0.62)_43%,rgba(0,0,0,0.26)_70%,rgba(0,0,0,0.78)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/72 to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 flex min-h-[94svh] flex-col justify-end px-5 pb-10 pt-28 md:px-12 md:pb-14"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(280px,0.52fr)] lg:items-end">
              <div className="max-w-3xl space-y-6">
                <motion.p
                  variants={fadeUp}
                  className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md"
                >
                  {page.heroKicker}
                </motion.p>
                <h1 className="max-w-4xl text-[clamp(3rem,7.5vw,6.75rem)] font-bold leading-[0.94] text-white">
                  <span className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: '108%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.78, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {page.title}
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden">
                    <motion.span
                      className="block bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent"
                      initial={{ y: '108%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.78, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {page.heroTail ?? 'built around real clinical work.'}
                    </motion.span>
                  </span>
                </h1>
                <motion.p variants={fadeUp} className="max-w-2xl text-sm leading-7 text-neutral-200 md:text-base md:leading-8">
                  {linkifyText(page.intro)}
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <MagneticWrapper>
                    <Link
                      href="/product"
                      data-seo-event="shop_loupes_primary"
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition hover:bg-neutral-200"
                    >
                      Shop HeliosX loupes
                    </Link>
                  </MagneticWrapper>
                  <Link
                    href="/measurements"
                    data-seo-event="measurements_primary"
                    className="rounded-full border border-white/20 bg-black/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
                  >
                    Read measurement guide
                  </Link>
                </motion.div>
              </div>

              <motion.aside
                variants={fadeUp}
                className="border-l border-white/15 pl-5 text-sm text-neutral-200 backdrop-blur-sm lg:pb-2"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  Built for
                </p>
                <p className="mt-3 text-xl font-semibold leading-7 text-white">{page.audience}</p>
                <div className="mt-6 space-y-3">
                  {page.proofPoints.map((point) => (
                    <p key={point} className="border-t border-white/10 pt-3 leading-6 text-neutral-300">
                      {point}
                    </p>
                  ))}
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </section>

        {page.sections.length > 3 ? (
          <section className="px-5 pt-10 md:px-12">
            <nav
              aria-label="On this page"
              className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-neutral-950/60 px-5 py-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                On this page
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
                {page.sections.map((section, index) => (
                  <li key={`toc-${section.title}`}>
                    <a
                      href={`#${slugifySectionTitle(section.title)}`}
                      className="underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-emerald-200"
                    >
                      <span className="mr-1 text-neutral-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        ) : null}

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            {page.sections.map((section, index) => (
              <motion.article
                key={section.title}
                id={slugifySectionTitle(section.title)}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.26 }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[0.34fr,0.66fr] scroll-mt-24"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-base leading-8 text-neutral-300">{linkifyText(section.body)}</p>
                  {section.sourceHref && section.sourceLabel ? (
                    <p className="text-xs leading-6 text-neutral-400">
                      <span className="font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                        Source:{' '}
                      </span>
                      <Link
                        href={section.sourceHref}
                        target={section.sourceHref.startsWith('http') ? '_blank' : undefined}
                        rel={section.sourceHref.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white"
                      >
                        {section.sourceLabel}
                      </Link>
                    </p>
                  ) : null}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="border-t border-white/10 pt-4 text-sm leading-6 text-neutral-300">
                        {linkifyText(bullet)}
                      </div>
                    ))}
                  </div>
                  {section.image ? (
                    <figure className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white">
                      <div className="relative w-full bg-white">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          width={section.image.width ?? 1200}
                          height={section.image.height ?? 700}
                          className="h-auto w-full object-contain"
                        />
                      </div>
                      {section.image.caption ? (
                        <figcaption className="border-t border-white/10 bg-[#050b16] px-5 py-4 text-xs leading-6 text-neutral-400">
                          {section.image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-neutral-950/70 px-5 py-16 md:px-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true, amount: 0.18 }}
            className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr,1.22fr]"
          >
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Buyer criteria
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Choose by work, posture, and fit.
              </h2>
              <p className="mt-5 text-sm leading-7 text-neutral-300">
                A useful loupe guide answers the real buying question. Start with the procedures you perform, then compare optics around posture, magnification, fit support, and price.
              </p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Workflow', 'Which procedures, appointments, or cases will these loupes support most often?'],
                ['Posture', 'Do you need ergonomic prismatic viewing or adjustable working distance?'],
                ['Magnification', 'How much detail do you need before field of view becomes too narrow?'],
                ['Fit', 'Do you have accurate pupillary distance, working distance, and prescription details?'],
                ['Budget', 'Are you buying for school, residency, practice, or a focused upgrade?'],
                ['Support', 'Can you easily get help with measurements, shipping, prescription, and setup?'],
              ].map(([label, body]) => (
                <motion.div key={label} variants={fadeUp} className="border-t border-white/10 pt-5">
                  <h3 className="text-sm font-semibold text-white">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {page.comparisonRows?.length ? (
          <section className="px-5 py-16 md:px-12 md:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, amount: 0.18 }}
              className="mx-auto max-w-6xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Side-by-side
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Comparison snapshot</h2>
              <div className="mt-8 overflow-x-auto border-y border-white/10">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <caption className="sr-only">
                    Side-by-side comparison of HeliosX and {page.competitorName ?? 'other brands'}
                    {' '}across {page.comparisonRows.length} positioning factors.
                  </caption>
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      <th scope="col" className="py-4 pr-4 font-semibold">Feature</th>
                      <th scope="col" className="p-4 font-semibold">HeliosX</th>
                      <th scope="col" className="p-4 font-semibold">
                        {page.competitorName ?? 'Other brands'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.comparisonRows.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-t border-white/10 text-sm text-neutral-300 align-top"
                      >
                        <th scope="row" className="py-5 pr-4 font-semibold text-white">
                          {row.feature}
                        </th>
                        <td className="p-5 leading-6">{row.heliosx}</td>
                        <td className="p-5 leading-6">{row.other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {page.verdict ? (
                <p className="mt-7 max-w-4xl border-l border-emerald-300/60 pl-5 text-base leading-8 text-emerald-50">
                  {linkifyText(page.verdict)}
                </p>
              ) : null}
            </motion.div>
          </section>
        ) : null}

        <section className="border-y border-white/10 bg-neutral-950/70 px-5 py-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Product path
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">The HeliosX lineup</h2>
              </div>
              <Link href="/product" className="text-sm font-semibold text-emerald-200 hover:text-white">
                Compare all loupes
              </Link>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={stagger}
              viewport={{ once: true, amount: 0.16 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {page.recommendedProducts.map((product) => {
                const row = modelRows.find((item) => item.name === product)
                if (!row) return null

                return (
                  <motion.div key={product} variants={fadeUp}>
                    <Link
                      href={row.href}
                      data-seo-event={`recommended_product_${product.toLowerCase()}`}
                      className="group block border-t border-white/10 pt-5 transition"
                    >
                      <h3 className="text-xl font-semibold text-white transition group-hover:text-emerald-200">{product}</h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">{row.positioning}</p>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr,0.92fr]">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, amount: 0.2 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Keep comparing
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Related buyer searches
              </h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {highIntentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-seo-event={`high_intent_${link.label.toLowerCase().replaceAll(' ', '_')}`}
                    className="border-t border-white/10 py-4 text-sm font-semibold text-neutral-200 transition hover:border-emerald-300/70 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.aside
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className="border-l border-white/10 pl-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Education
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Learn the fit variables</h2>
              <div className="mt-6 space-y-3">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    data-seo-event={`related_${guide.label.toLowerCase().replaceAll(' ', '_')}`}
                    className="block border-t border-white/10 py-4 text-sm text-neutral-200 transition hover:text-emerald-200"
                  >
                    {guide.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Questions
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Quick answers</h2>
            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white transition group-open:text-emerald-200">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{linkifyText(faq.answer)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </LenisProvider>
  )
}
