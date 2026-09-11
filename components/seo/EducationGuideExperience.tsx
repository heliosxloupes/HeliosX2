import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import SeoAnalytics from '@/components/SeoAnalytics'
import { linkifyText } from '@/components/seo/linkify'
import { getRelatedPages } from '@/lib/seo-content'
import type { EducationGuide } from '@/lib/seo-content'
import styles from './BuyerGuide.module.css'

type Diagram = { src: string; alt: string } | null
export type RelatedGuide = {
  slug: string
  title: string
  description: string
  kicker?: string
}
export type ShopByLink = { label: string; href: string; description: string }
type Props = {
  guide: EducationGuide
  diagram: Diagram
  relatedGuides?: RelatedGuide[]
  shopByLinks?: ShopByLink[]
}
const id = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)

export default function EducationGuideExperience({
  guide,
  diagram,
  relatedGuides = [],
  shopByLinks = [],
}: Props) {
  const curated = getRelatedPages(guide.slug)
  const links = [
    ...curated,
    ...relatedGuides.map((g) => ({
      href: `/education/${g.slug}`,
      label: g.title,
    })),
    ...shopByLinks,
  ].filter(
    (link, index, list) =>
      list.findIndex((item) => item.href === link.href) === index,
  )
  return (
    <>
      <Header />
      <SeoAnalytics pageType="education" pageName={guide.title} />
      <main className={styles.page}>
        <div className={styles.wrap}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/education">Education</Link>
          </nav>
          <header className={`${styles.section} max-w-3xl`}>
            <p className={styles.kicker}>HeliosX field notes</p>
            <h1>{guide.title}</h1>
            <p className={styles.intro}>{linkifyText(guide.intro)}</p>
            <p className={styles.meta}>
              By HeliosX
              {guide.dateModified ? (
                <>
                  {' '}
                  · Updated{' '}
                  <time dateTime={guide.dateModified}>
                    {new Date(
                      `${guide.dateModified}T12:00:00Z`,
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </time>
                </>
              ) : null}
            </p>
          </header>
          <nav aria-label="On this page" className={styles.nav}>
            {guide.sections.map((s) => (
              <a key={s.title} href={`#${id(s.title)}`}>
                {s.title}
              </a>
            ))}
          </nav>
          <div className={`${styles.section} ${styles.articleGrid}`}>
            <div>
              {diagram ? (
                <figure className="mb-10 overflow-hidden rounded border border-white/15 bg-white">
                  <Image
                    src={diagram.src}
                    alt={diagram.alt}
                    width={1200}
                    height={760}
                    sizes="(max-width:767px) calc(100vw - 40px), 740px"
                    className="h-auto w-full"
                  />
                </figure>
              ) : null}
              {guide.sections.map((s) => (
                <section
                  key={s.title}
                  id={id(s.title)}
                  className={styles.article}
                >
                  <h2>{s.title}</h2>
                  <p>{linkifyText(s.body)}</p>
                  {s.bullets.length ? (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{linkifyText(b)}</li>
                      ))}
                    </ul>
                  ) : null}
                  {s.sourceHref ? (
                    <p className={styles.source}>
                      Source:{' '}
                      <a href={s.sourceHref}>{s.sourceLabel ?? s.sourceHref}</a>
                    </p>
                  ) : null}
                  {s.image ? (
                    <figure>
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        width={s.image.width ?? 1200}
                        height={s.image.height ?? 700}
                        sizes="(max-width:767px) calc(100vw - 40px), 740px"
                      />
                      {s.image.caption ? (
                        <figcaption>{s.image.caption}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </section>
              ))}
            </div>
            <aside className={styles.aside}>
              <p className={styles.kicker}>Put the guide to use</p>
              <h2 className="mt-3">Choose with a clear plan.</h2>
              <p>
                Compare optical designs, current prices, and fitting
                requirements before ordering a custom pair.
              </p>
              <Link
                href="/best-loupes"
                className={styles.primary}
                data-seo-event="education_compare_models"
              >
                Find your HeliosX model
              </Link>
              <Link
                href="/measurements"
                className={styles.secondary}
                data-seo-event="education_measurements"
              >
                Measurement instructions
              </Link>
            </aside>
          </div>
          {guide.citations?.length ? (
            <section className={styles.section}>
              <h2>Sources and further reading</h2>
              <div className={styles.related}>
                {guide.citations
                  .filter(
                    (c, i, a) => a.findIndex((x) => x.href === c.href) === i,
                  )
                  .map((c) => (
                    <a key={c.href} href={c.href}>
                      {c.label}
                    </a>
                  ))}
              </div>
            </section>
          ) : null}
          <section className={styles.section}>
            <h2>Common questions</h2>
            <div className={styles.faq}>
              {guide.faqs.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{linkifyText(f.answer)}</p>
                </details>
              ))}
            </div>
          </section>
          <section className={styles.closing}>
            <h2>Need help applying this to your setup?</h2>
            <p className={styles.lead}>
              Tell us your specialty, usual working position, and the question
              you are trying to resolve. Ask before ordering if your
              configuration is uncertain.
            </p>
            <div className={styles.actions}>
              <a
                href={`mailto:heliosxloupes@gmail.com?subject=${encodeURIComponent(`Question about ${guide.title}`)}`}
                className={styles.primary}
                data-seo-event="education_fit_email"
              >
                Email HeliosX
              </a>
              <Link
                href="/product"
                className={styles.secondary}
                data-seo-event="education_shop"
              >
                Compare loupes
              </Link>
            </div>
          </section>
          {links.length ? (
            <section className={styles.section}>
              <h2>Related guides</h2>
              <div className={styles.related}>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    data-seo-event="education_related"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  )
}
