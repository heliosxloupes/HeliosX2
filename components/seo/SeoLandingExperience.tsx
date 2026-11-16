import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import SeoAnalytics from '@/components/SeoAnalytics'
import { linkifyText } from '@/components/seo/linkify'
import { supportEmail } from '@/lib/seo'
import {
  getRelatedPages,
  productImages,
  productStartingPrices,
} from '@/lib/seo-content'
import type { SeoLandingPage } from '@/lib/seo-content'
import AuthorityBand from './AuthorityBand'
import styles from './BuyerGuide.module.css'
import { modelBySlug } from '@/components/m2/models'

// Guide pages use the current studio photography (the phone storefront set);
// the older cut-out renders stay as a fallback.
const guideImage = (name: keyof typeof productImages) =>
  modelBySlug(name.toLowerCase())?.photo.src ?? productImages[name]

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
  // Chart rows jump to the matching entry below, as the chips on a chart do.
  const entryAnchor = (head: string) =>
    page.items?.entries.find((e) => head === e.name || head.startsWith(`${e.name} `))?.id
  const hero = page.heroImage ?? {
    src: guideImage(imageKey),
    alt: `HeliosX ${imageKey} loupes`,
    caption: `${imageKey} · From ${usd(productStartingPrices[imageKey])} USD`,
  }
  const words = [
    page.intro,
    page.answer ?? '',
    ...page.sections.flatMap((s) => [s.title, s.body, ...s.bullets]),
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
  ]
    .join(' ')
    .split(/\s+/).length
  const email = `mailto:${supportEmail}?subject=${encodeURIComponent(`Help choosing loupes: ${page.title}`)}&body=${encodeURIComponent('Hi HeliosX,\n\nMy specialty / training stage:\nThe procedures I do most:\nMy current loupes and magnification (if any):\nMy budget:\nMy question:\n')}`
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
              <p className={styles.kicker}>{page.heroKicker}</p>
              <h1>{page.title}</h1>
              {page.answer ? (
                <p className={styles.answer}>
                  <strong>Short answer:</strong> {linkifyText(page.answer)}
                </p>
              ) : null}
              <p className={styles.intro}>{linkifyText(page.intro)}</p>
              <p className={styles.meta}>
                By the HeliosX loupe specialists · {Math.max(2, Math.ceil(words / 220))} min read
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
                  href={page.items ? '#side-by-side' : '#model-shortlist'}
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
                Guidance from the HeliosX loupe specialists.
              </p>
            </div>
            <div className={styles.heroImage}>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 40px), 440px"
                quality={90}
              />
              <p className={styles.heroCaption}>{hero.caption}</p>
            </div>
          </header>
          <nav aria-label="On this page" className={styles.nav}>
            {page.tierChart ? <a href="#chart">Chart</a> : null}
            {page.specTable ? <a href="#models-prices">Models &amp; prices</a> : null}
            {page.quickPicks ? <a href="#quick-picks">Quick picks</a> : null}
            {page.items ? <a href="#side-by-side">Side by side</a> : null}
            {page.tips ? <a href="#buying-tips">Buying tips</a> : null}
            {page.comparisonRows?.length ? (
              <a href="#comparison">Comparison</a>
            ) : null}
            {page.procedureRows?.length ? (
              <a href="#by-procedure">By procedure</a>
            ) : null}
            {page.items ? null : <a href="#model-shortlist">HeliosX options</a>}
            <a href="#buying-advice">What to look for</a>
            <a href="#questions">Questions</a>
            <a href="#help-choosing">Ask for help</a>
          </nav>
          {page.why ? (
            <section id="why" className={styles.section}>
              <h2>{page.why.title}</h2>
              <div className={styles.why}>
                {page.why.body.map((para) => (
                  <p key={para.slice(0, 40)}>{linkifyText(para)}</p>
                ))}
              </div>
            </section>
          ) : null}
          {page.tierChart ? (
            <section id="chart" className={styles.section}>
              <h2>{page.tierChart.title}</h2>
              {page.tierChart.lead ? (
                <p className={styles.lead}>{linkifyText(page.tierChart.lead)}</p>
              ) : null}
              <div className={styles.tierChart}>
                <p className={styles.tierScale} aria-hidden="true">
                  <span>{page.tierChart.scale[0]}</span>
                  <span>{page.tierChart.scale[1]}</span>
                </p>
                <ol className={styles.tiers}>
                  {page.tierChart.tiers.map((tier, t) => (
                    <li key={tier.label} className={styles.tier}>
                      <div className={styles.tierHead}>
                        <span className={styles.meterBars} aria-hidden="true">
                          {page.tierChart!.tiers.map((_, n) => (
                            <i key={n} className={n <= t ? styles.meterOn : undefined} />
                          ))}
                        </span>
                        <strong>{tier.label}</strong>
                        {tier.note ? <span>{tier.note}</span> : null}
                      </div>
                      <ul className={styles.tierPicks}>
                        {tier.picks.map((pick) => (
                          <li key={pick.href + pick.label}>
                            <a href={pick.href} className={styles.tierChip} data-cta="tier-chart">
                              {pick.label}
                              {pick.detail ? <span>{pick.detail}</span> : null}
                              <i aria-hidden="true">↓</i>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}
          {page.specTable ? (
            <section id="models-prices" className={styles.section}>
              {page.tierChart ? (
                <h3 className={styles.subhead}>{page.specTable.title}</h3>
              ) : (
                <h2>{page.specTable.title}</h2>
              )}
              {page.specTable.lead ? (
                <p className={styles.lead}>{linkifyText(page.specTable.lead)}</p>
              ) : null}
              <table className={`${styles.procedureTable} ${styles.specTable}`}>
                <thead>
                  <tr>
                    {page.specTable.columns.map((column) => (
                      <th key={column} scope="col">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.specTable.rows.map(([head, ...cells]) => (
                    <tr key={head}>
                      <th scope="row">
                        {entryAnchor(head) ? (
                          <a href={`#${entryAnchor(head)}`} className={styles.rowJump}>
                            {head} <span aria-hidden="true">↓</span>
                          </a>
                        ) : (
                          linkifyText(head)
                        )}
                      </th>
                      {cells.map((cell, i) => (
                        <td key={i} data-label={page.specTable!.columns[i + 1]}>
                          <span>{linkifyText(cell)}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {page.specTable.note ? (
                <p className={styles.lead}>{linkifyText(page.specTable.note)}</p>
              ) : null}
            </section>
          ) : null}
          {page.quickPicks ? (
            <section id="quick-picks" className={styles.section}>
              <h2>{page.quickPicks.title}</h2>
              <dl className={styles.picks}>
                {page.quickPicks.rows.map((row) => (
                  <div key={row.task} className={styles.pickRow}>
                    <dt>{row.task}</dt>
                    <dd>
                      {row.picks.map((pick, i) => (
                        <span key={pick.href + pick.label}>
                          {i > 0 ? ', ' : null}
                          <a href={pick.href}>{pick.label}</a>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {page.items ? (
            <section id="side-by-side" className={styles.section}>
              <h2>{page.items.title}</h2>
              {page.items.lead ? <p className={styles.lead}>{linkifyText(page.items.lead)}</p> : null}
              <div className={styles.items}>
                {page.items.entries.map((entry, index) => (
                  <article
                    key={entry.id}
                    id={entry.id}
                    className={`${styles.item} ${entry.image ? styles.itemWithImage : ''} ${entry.image && index % 2 ? styles.itemFlip : ''}`}
                  >
                    {entry.image ? (
                      <figure className={`${styles.itemImage} ${entry.image.fit === 'contain' ? styles.itemImageContain : ''}`}>
                        <Image
                          src={entry.image.src}
                          alt={entry.image.alt}
                          width={entry.image.width}
                          height={entry.image.height}
                          sizes="(max-width: 767px) calc(100vw - 40px), 320px"
                          quality={90}
                        />
                      </figure>
                    ) : null}
                    <div className={styles.itemBody}>
                    <div className={styles.itemHead}>
                      <h3>{entry.href ? <Link href={entry.href}>{entry.name}</Link> : entry.name}</h3>
                      <p className={styles.itemTag}>
                        {entry.tag}
                        {entry.price ? <span> · {entry.price}</span> : null}
                      </p>
                    </div>
                    {entry.meter ? (
                      <p className={styles.meter}>
                        <span className={styles.meterBars} aria-hidden="true">
                          {[1, 2, 3, 4].map((n) => (
                            <i key={n} className={n <= entry.meter!.value ? styles.meterOn : undefined} />
                          ))}
                        </span>
                        {entry.meter.label}
                      </p>
                    ) : null}
                    {entry.body.map((para) => (
                      <p key={para.slice(0, 40)}>{linkifyText(para)}</p>
                    ))}
                    <p className={styles.bestFor}>
                      <span>Best for</span>
                      {entry.bestFor.map((b) => (
                        <span key={b} className={styles.chip}>{b}</span>
                      ))}
                    </p>
                    {entry.cta ? (
                      <p className={styles.itemCta}>
                        {linkifyText(entry.cta.text)}{' '}
                        <Link href={entry.cta.href} data-seo-event={`item_cta_${entry.id}`}>
                          {entry.cta.label} <span aria-hidden="true">↗</span>
                        </Link>
                      </p>
                    ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {page.tips ? (
            <section id="buying-tips" className={styles.section}>
              <h2>{page.tips.title}</h2>
              <ol className={styles.tips}>
                {page.tips.items.map((tip) => (
                  <li key={tip.title}>
                    <strong>{tip.title}</strong> {linkifyText(tip.body)}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          {page.procedureRows?.length ? (
            <section id="by-procedure" className={styles.section}>
              <h2>Magnification by procedure</h2>
              <p className={styles.lead}>
                Common starting points. Choose for the work you do most often,
                then confirm the view at your own working distance.
              </p>
              <table className={styles.procedureTable}>
                <thead>
                  <tr>
                    <th scope="col">Procedure</th>
                    <th scope="col">Magnification</th>
                    <th scope="col">Working distance</th>
                    <th scope="col">HeliosX starting point</th>
                  </tr>
                </thead>
                <tbody>
                  {page.procedureRows.map((row) => (
                    <tr key={row.procedure}>
                      <th scope="row">{row.procedure}</th>
                      <td data-label="Magnification" className={styles.mag}><span>{row.magnification}</span></td>
                      <td data-label="Working distance"><span>{row.distance}</span></td>
                      <td data-label="HeliosX starting point"><span>{linkifyText(row.pick)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}
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
          <AuthorityBand audience={page.authorityAudience} />
          {page.items ? null : (
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
                        src={guideImage(key)}
                        alt={`HeliosX ${row.name} loupes`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 40px), 355px"
                        quality={90}
                      />
                    </Link>
                    <div className={styles.cardBody}>
                      <div className={styles.cardTitle}>
                        <h3>
                          <Link href={row.href} className="hover:underline hover:underline-offset-4">
                            {row.name}
                          </Link>
                        </h3>
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
          )}
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
                        quality={90}
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
                Non-prescription pairs can be returned within 30 days of
                delivery for a full refund. Prescription pairs are fully
                refundable until production begins.
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
              <Link href="/warranty">Limited lifetime warranty</Link>
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
