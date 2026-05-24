'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'framer-motion'

import Header from '@/components/Header'
import { LenisProvider } from '@/components/lenis-provider'
import type { EducationGuide } from '@/lib/seo-content'

type Diagram = {
  src: string
  alt: string
} | null

export type RelatedGuide = {
  slug: string
  title: string
  description: string
  kicker?: string
}

export type ShopByLink = {
  label: string
  href: string
  description: string
}

type EducationGuideExperienceProps = {
  guide: EducationGuide
  diagram: Diagram
  relatedGuides?: RelatedGuide[]
  shopByLinks?: ShopByLink[]
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

function getGuideImage(slug: string) {
  if (slug === 'working-distance-for-loupes' || slug === 'how-to-measure-pupillary-distance') {
    return {
      src: '/oldguy2.png',
      alt: 'Clinician at the operating field demonstrating loupe working posture',
    }
  }

  if (slug.includes('pupillary') || slug.includes('working-distance') || slug.includes('prescription')) {
    return {
      src: '/workingdistance.png',
      alt: 'HeliosX loupe measurement setup',
    }
  }

  if (slug.includes('prismatic') || slug.includes('ergonomic')) {
    return {
      src: '/Medusa/MedusaStudioCloseup.png',
      alt: 'Close view of HeliosX ergonomic prismatic loupes',
    }
  }

  if (slug.includes('student') || slug.includes('resident')) {
    return {
      src: '/Galileo/Homepage1.png',
      alt: 'HeliosX loupes for clinical training',
    }
  }

  return {
    src: '/Apollo/Apollo3xFemale2.png',
    alt: 'Clinician wearing HeliosX loupes',
  }
}

export default function EducationGuideExperience({
  guide,
  diagram,
  relatedGuides = [],
  shopByLinks = [],
}: EducationGuideExperienceProps) {
  const hero = getGuideImage(guide.slug)
  const diagramHasLightBackground =
    diagram?.src.includes('pupillary distance') || diagram?.src.includes('workdistance diagram')

  return (
    <LenisProvider>
      <ScrollProgressBar />
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        <section className="relative min-h-[86svh] overflow-hidden">
          <Image src={hero.src} alt={hero.alt} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.92)_10%,rgba(0,0,0,0.66)_46%,rgba(0,0,0,0.22)_76%,rgba(0,0,0,0.82)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/72 to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 flex min-h-[86svh] flex-col justify-end px-5 pb-10 pt-28 md:px-12 md:pb-14"
          >
            <div className="max-w-4xl space-y-6">
              <motion.div variants={fadeUp}>
                <Link href="/education" className="text-sm font-semibold text-emerald-200 hover:text-white">
                  Back to education
                </Link>
              </motion.div>
              <motion.p variants={fadeUp} className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md">
                {guide.kicker}
              </motion.p>
              <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-white">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '108%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.78, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {guide.title}
                  </motion.span>
                </span>
              </h1>
              <motion.p variants={fadeUp} className="max-w-2xl text-sm leading-7 text-neutral-200 md:text-base md:leading-8">
                {guide.intro}
              </motion.p>
              <motion.p variants={fadeUp} className="max-w-xl border-l border-emerald-300/60 pl-4 text-sm leading-6 text-neutral-300">
                Built for {guide.audience}.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {diagram ? (
          <section className="px-5 py-16 md:px-12 md:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, amount: 0.22 }}
              className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#050b16] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-6"
            >
              <div
                className={`relative overflow-hidden rounded-2xl border border-white/10 ${
                  diagramHasLightBackground ? 'bg-white p-3' : 'bg-black'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_34%),linear-gradient(90deg,rgba(5,11,22,0.12),transparent_18%,transparent_82%,rgba(5,11,22,0.12))]" />
                <Image
                  src={diagram.src}
                  alt={diagram.alt}
                  width={1200}
                  height={760}
                  className="mx-auto h-auto max-h-[680px] w-full object-contain"
                  priority
                />
              </div>
            </motion.div>
          </section>
        ) : null}

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            {guide.sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.26 }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[0.34fr,0.66fr]"
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
                  <p className="text-base leading-8 text-neutral-300">{section.body}</p>
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
                        {bullet}
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
              </motion.section>
            ))}
          </div>
        </section>

        {guide.citations?.length ? (
          <section className="border-y border-white/10 bg-neutral-950/70 px-5 py-14 md:px-12">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                References
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {guide.citations.map((citation) => (
                  <Link
                    key={citation.href}
                    href={citation.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-t border-white/10 py-4 text-sm font-semibold text-emerald-200 transition hover:text-white"
                  >
                    {citation.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-5 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Questions
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Quick answers</h2>
            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {guide.faqs.map((faq) => (
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

        {relatedGuides.length > 0 || shopByLinks.length > 0 ? (
          <section className="border-t border-white/10 bg-neutral-950/60 px-5 py-16 md:px-12 md:py-24">
            <div className="mx-auto max-w-6xl space-y-12">
              {relatedGuides.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
                    Related guides
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
                    Keep reading the education library.
                  </h2>
                  <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {relatedGuides.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/education/${related.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#050b16]/85 p-5 transition hover:border-emerald-200/40 hover:bg-[#070d1a]"
                      >
                        {related.kicker ? (
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                            {related.kicker}
                          </p>
                        ) : null}
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-white group-hover:text-emerald-100">
                          {related.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-300">
                          {related.description}
                        </p>
                        <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80 transition group-hover:text-white">
                          Read guide →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {shopByLinks.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
                    Shop by specialty
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
                    Match the right loupe to your work.
                  </h2>
                  <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {shopByLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#050b16]/85 p-5 transition hover:border-emerald-200/40 hover:bg-[#070d1a]"
                      >
                        <div>
                          <h3 className="text-base font-semibold text-white group-hover:text-emerald-100">
                            {link.label}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-neutral-300">{link.description}</p>
                        </div>
                        <span className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80 transition group-hover:text-white">
                          Explore →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>
    </LenisProvider>
  )
}
