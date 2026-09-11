import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import SeoAnalytics from '@/components/SeoAnalytics'
import { linkifyText } from '@/components/seo/linkify'
import {
  getRelatedPages,
  productImages,
  productStartingPrices,
} from '@/lib/seo-content'
import type { SeoLandingPage } from '@/lib/seo-content'
import styles from './BuyerGuide.module.css'

type ModelRow = { name: string; href: string; positioning: string }
const tradeoffs: Record<string, string> = {
  Newton:
    'Galilean optics. Choose Apollo or Medusa for a redirected ergonomic view.',
  Galileo: 'A lightweight Galilean option; not an ergonomic prismatic system.',
  Kepler:
    'Conventional prismatic optics. Choose Apollo or Medusa for ergonomic viewing.',
  Apollo:
    'Working distance is fixed to your configuration; magnification is selected at purchase.',
  Medusa:
    'Working distance adjusts from 300–600 mm. Magnification does not switch on the loupe.',
}
const id = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
const usd = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

// Reading content is server-rendered and visible without hydration.
export default function SeoLandingExperience({
  page,
  modelRows,
}: {
  page: SeoLandingPage
  modelRows: ModelRow[]
}) {
  const products = page.recommendedProducts
    .map((name) => modelRows.find((row) => row.name === name))
    .filter((row): row is ModelRow => !!row)
  const imageKey = (products[0]?.name ?? 'Apollo') as keyof typeof productImages
  const related = getRelatedPages(page.slug)
  const words = [
    page.intro,
    ...page.sections.flatMap((s) => [s.title, s.body, ...s.bullets]),
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
  ]
    .join(' ')
    .split(/\s+/).length
  const email = `mailto:heliosxloupes@gmail.com?subject=${encodeURIComponent(`Help choosing loupes: ${page.title}`)}&body=${encodeURIComponent('Hi HeliosX,\n\nMy specialty / training stage:\nThe procedures I do most:\nMy current loupes and magnification (if any):\nMy budget:\nMy question:\n')}`
  return (
    <>
      <Header />
      <SeoAnalytics pageType="seo_landing" pageName={page.title} />
      <main className={styles.page}>
        <div className={styles.wrap}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/loupe-comparisons">Buying guides</Link>
          </nav>
          <header className={styles.hero}>
            <div>
              <p className={styles.kicker}>HeliosX buying guide</p>
              <h1>{page.title}</h1>
              <p className={styles.intro}>{linkifyText(page.intro)}</p>
              <p className={styles.meta}>
                By HeliosX · {Math.max(2, Math.ceil(words / 220))} min read
                {page.dateModified ? (
                  <>
                    {' '}
                    · Updated{' '}
                    <time dateTime={page.dateModified}>
                      {new Date(
                        `${page.dateModified}T12:00:00Z`,
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
              <div className={styles.actions}>
                <a
                  href="#model-shortlist"
                  className={styles.primary}
                  data-seo-event="guide_see_models"
                >
                  See models &amp; prices <span aria-hidden="true">↓</span>
                </a>
                <a href="#buying-advice" className={styles.secondary}>
                  Read the guide
                </a>
              </div>
              <p className={styles.fineprint}>
                We make and sell HeliosX loupes. This is our buying guidance,
                not an independent product test or paid ranking.
              </p>
            </div>
            <div className={styles.heroImage}>
              <Image
                src={productImages[imageKey]}
                alt={`HeliosX ${imageKey} loupes`}
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 40px), 440px"
              />
              <p className={styles.heroCaption}>
                {imageKey} · From {usd(productStartingPrices[imageKey])} USD
              </p>
            </div>
          </header>
          <nav aria-label="On this page" className={styles.nav}>
            {page.comparisonRows?.length ? (
              <a href="#comparison">Comparison</a>
            ) : null}
            <a href="#model-shortlist">HeliosX options</a>
            <a href="#buying-advice">What to look for</a>
            <a href="#questions">Questions</a>
            <a href="#help-choosing">Ask for help</a>
          </nav>
          {page.comparisonRows?.length ? (
            <section id="comparison" className={styles.section}>
              <p className={styles.kicker}>The differences that matter</p>
              <h2 className="mt-3">Compare before you commit</h2>
              <div className={styles.comparison}>
                {page.comparisonRows.map((row) => (
                  <div key={row.feature} className={styles.compareRow}>
                    <h3>{row.feature}</h3>
                    <div className={styles.ours}>
                      <strong>HeliosX</strong>
                      {row.heliosx}
                    </div>
                    <div>
                      <strong>{page.competitorName ?? 'Other options'}</strong>
                      {row.other}
                    </div>
                  </div>
                ))}
              </div>
              {page.verdict ? (
                <p className={styles.verdict}>{linkifyText(page.verdict)}</p>
              ) : null}
            </section>
          ) : null}
          <section id="model-shortlist" className={styles.section}>
            <p className={styles.kicker}>Your HeliosX shortlist</p>
            <h2 className="mt-3">Start with the work you do.</h2>
            <p className={styles.lead}>
              Compare the optical design, then choose your magnification and
              frame on the product page.
            </p>
            <div className={styles.shortlist}>
              {products.map((row) => {
                const key = row.name as keyof typeof productImages
                return (
                  <article className={styles.card} key={row.name}>
                    <Link
                      href={row.href}
                      className={styles.cardImage}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={productImages[key]}
                        alt=""
                        fill
                        sizes="(max-width: 767px) calc(100vw - 40px), 355px"
                      />
                    </Link>
                    <div className={styles.cardBody}>
                      <div className={styles.cardTitle}>
                        <h3>{row.name}</h3>
                        <span className={styles.price}>
                          From {usd(productStartingPrices[key])}
                        </span>
                      </div>
                      <p>{row.positioning}</p>
                      <p className={styles.tradeoff}>{tradeoffs[row.name]}</p>
                      <Link
                        href={row.href}
                        className={styles.secondary}
                        data-seo-event={`recommended_product_${row.name.toLowerCase()}`}
                      >
                        Explore {row.name} <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
            <p className={styles.fineprint}>
              Starting prices in USD. Magnification and optional prescription
              lenses affect the total; shipping and taxes appear at checkout.{' '}
              <Link href="/product">See all five models</Link>.
            </p>
          </section>
          <section
            id="buying-advice"
            className={`${styles.section} ${styles.articleGrid}`}
            aria-label="Buying advice"
          >
            <div>
              {page.sections.map((section) => (
                <article
                  id={id(section.title)}
                  key={section.title}
                  className={styles.article}
                >
                  <h2>{section.title}</h2>
                  <p>{linkifyText(section.body)}</p>
                  {section.bullets.length > 0 ? (
                    <ul>
                      {section.bullets.map((b) => (
                        <li key={b}>{linkifyText(b)}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.sourceHref ? (
                    <p className={styles.source}>
                      Source:{' '}
                      <a href={section.sourceHref}>
                        {section.sourceLabel ?? section.sourceHref}
                      </a>
                    </p>
                  ) : null}
                  {section.image ? (
                    <figure>
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        width={section.image.width ?? 1200}
                        height={section.image.height ?? 700}
                        sizes="(max-width: 767px) calc(100vw - 40px), 740px"
                      />
                      {section.image.caption ? (
                        <figcaption>{section.image.caption}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className={styles.aside}>
              <p className={styles.kicker}>Before you order</p>
              <h2 className="mt-3">Get the fit right.</h2>
              <p>
                After checkout, we collect your measurements and review the
                configuration before custom production. If you are unsure what
                to choose, email us first.
              </p>
              <Link
                href="/measurements"
                className={styles.secondary}
                data-seo-event="guide_measurements"
              >
                How measurement works
              </Link>
              <p>
                Full cancellation refunds are available before production
                begins. After production, non-defective orders are not
                refundable.
              </p>
              <Link href="/returns" className={styles.secondary}>
                Read the return policy
              </Link>
            </aside>
          </section>
          <section id="questions" className={styles.section}>
            <h2>Questions before buying</h2>
            <div className={styles.faq}>
              {page.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{linkifyText(faq.answer)}</p>
                </details>
              ))}
            </div>
          </section>
          <section
            id="help-choosing"
            className={`${styles.section} ${styles.closing}`}
          >
            <p className={styles.kicker}>
              Premium magnification. More accessible.
            </p>
            <h2 className="mt-3">A clear choice starts with your work.</h2>
            <p className={styles.lead}>
              Tell us your specialty, typical procedures, current magnification,
              and budget. We can help you narrow the options before you order.
            </p>
            <div className={styles.actions}>
              <a
                href={email}
                className={styles.primary}
                data-seo-event="guide_fit_email"
              >
                Help me choose
              </a>
              <Link
                href="/product"
                className={styles.secondary}
                data-seo-event="guide_shop_bottom"
              >
                Shop all loupes
              </Link>
            </div>
            <p className={styles.fineprint}>
              Email opens in your mail app: heliosxloupes@gmail.com ·{' '}
              <Link href="/warranty">Two-year limited warranty</Link>
            </p>
          </section>
          {related.length > 0 ? (
            <section className={styles.section}>
              <h2>Continue your research</h2>
              <div className={styles.related}>
                {related.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    data-seo-event="guide_related"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
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
