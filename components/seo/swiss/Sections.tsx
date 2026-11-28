// Shared, server-rendered content blocks. Every visible word comes from the guide
// data (see content.ts), so each variant styles and arranges, never rewords.
// Each block takes the variant's CSS-module object; missing classes are fine.
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react'
import { linkifyText } from '@/components/seo/linkify'
import { productImages, productPositioning, productStartingPrices } from '@/lib/seo-content'
import { modelBySlug } from '@/components/m2/models'
import { L, isMuted, magRange, slug, type Guide } from './content'

type S = Record<string, string>
const c = (s: S, ...names: (string | false | undefined)[]) => names.map((n) => (n ? s[n] : '')).filter(Boolean).join(' ') || undefined

export function Crumbs({ s }: { s: S }) {
  return (
    <nav aria-label="Breadcrumb" className={c(s, 'crumbs')}>
      <Link href="/">{L.home}</Link>
      <span aria-hidden="true">/</span>
      <Link href="/loupe-comparisons">{L.guides}</Link>
    </nav>
  )
}

export function Kicker({ g, s }: { g: Guide; s: S }) {
  return <p className={c(s, 'kicker')}>{g.page.heroKicker}</p>
}
export function Title({ g, s, as = 'h1' }: { g: Guide; s: S; as?: 'h1' }) {
  const T = as
  return <T className={c(s, 'h1')}>{g.page.title}</T>
}
export function Answer({ g, s }: { g: Guide; s: S }) {
  return g.page.answer ? (
    <p className={c(s, 'answer')}>
      <strong>{L.shortAnswer}</strong> {linkifyText(g.page.answer)}
    </p>
  ) : null
}
export function Intro({ g, s }: { g: Guide; s: S }) {
  return <p className={c(s, 'intro')}>{linkifyText(g.page.intro)}</p>
}
export function Meta({ g, s }: { g: Guide; s: S }) {
  return (
    <p className={c(s, 'meta')}>
      {L.byline} · {g.readMins} {L.minRead}
      {g.dateLabel ? (
        <>
          {' '}
          · {L.updated} <time dateTime={g.page.dateModified}>{g.dateLabel}</time>
        </>
      ) : null}
    </p>
  )
}
export function HeroActions({ g, s }: { g: Guide; s: S }) {
  return (
    <div className={c(s, 'actions')}>
      <a href={g.page.items ? '#side-by-side' : '#model-shortlist'} className={c(s, 'btn')} data-seo-event="guide_see_models">
        {L.seeModels} <ArrowDown size={17} strokeWidth={2} aria-hidden="true" />
      </a>
      <a href="#buying-advice" className={c(s, 'link')}>
        {L.readGuide}
      </a>
    </div>
  )
}
export function Guidance({ s }: { s: S }) {
  return <p className={c(s, 'fine')}>{L.guidance}</p>
}
export function HeroCaption({ g, s }: { g: Guide; s: S }) {
  return g.heroHref ? (
    <Link href={g.heroHref} className={c(s, 'caption')}>
      {g.hero.caption} <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
    </Link>
  ) : (
    <p className={c(s, 'caption')}>{g.hero.caption}</p>
  )
}
export function OnPage({ g, s }: { g: Guide; s: S }) {
  return (
    <nav aria-label="On this page" className={c(s, 'onPage')}>
      {g.railItems.map((it) => (
        <a key={it.id} href={`#${it.id}`}>{it.label}</a>
      ))}
    </nav>
  )
}

export function WhyText({ g, s }: { g: Guide; s: S }) {
  if (!g.page.why) return null
  return (
    <>
      <h2 id="why-h" className={c(s, 'h2')}>{g.page.why.title}</h2>
      {g.page.why.body.map((p) => (
        <p key={p.slice(0, 40)} className={c(s, 'body')}>{linkifyText(p)}</p>
      ))}
    </>
  )
}

export function SpecHead({ g, s }: { g: Guide; s: S }) {
  const t = g.page.specTable
  if (!t) return null
  return (
    <>
      {g.page.tierChart ? <h3 className={c(s, 'h2')}>{t.title}</h3> : <h2 className={c(s, 'h2')}>{t.title}</h2>}
      {t.lead ? <p className={c(s, 'lead')}>{linkifyText(t.lead)}</p> : null}
    </>
  )
}
export function SpecTable({ g, s }: { g: Guide; s: S }) {
  const t = g.page.specTable
  if (!t) return null
  return (
    <>
      <div className={c(s, 'tableWrap')}>
        <table className={c(s, 'table', 'stack')}>
          <thead>
            <tr>{t.columns.map((col) => <th key={col} scope="col">{col}</th>)}</tr>
          </thead>
          <tbody>
            {t.rows.map(([head, ...cells]) => {
              const anchor = g.entryAnchor(head)
              return (
                <tr key={head} className={head.startsWith('HeliosX') ? s.ours : undefined}>
                  <th scope="row">
                    {anchor ? (
                      <a href={`#${anchor}`} className={c(s, 'rowJump')}>
                        {head} <ArrowDown size={14} strokeWidth={2} aria-hidden="true" />
                      </a>
                    ) : (
                      linkifyText(head)
                    )}
                  </th>
                  {cells.map((cell, i) => (
                    <td key={i} data-label={t.columns[i + 1]} className={isMuted(cell) ? s.muted : undefined}>
                      <span>{linkifyText(cell)}</span>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {t.note ? <p className={c(s, 'fine')}>{linkifyText(t.note)}</p> : null}
    </>
  )
}

export function PicksTitle({ g, s }: { g: Guide; s: S }) {
  return g.page.quickPicks ? <h2 className={c(s, 'h2')}>{g.page.quickPicks.title}</h2> : null
}
export function PicksList({ g, s, icon }: { g: Guide; s: S; icon?: (task: string) => ReactNode }) {
  const q = g.page.quickPicks
  if (!q) return null
  return (
    <dl className={c(s, 'picks')}>
      {q.rows.map((row) => (
        <div key={row.task} className={c(s, 'pickRow')}>
          <dt>
            {icon ? <span className={c(s, 'pickIcon')} aria-hidden="true">{icon(row.task)}</span> : null}
            {row.task}
          </dt>
          <dd>
            {row.picks.map((pick, j) => (
              <span key={pick.href + pick.label}>
                {j > 0 ? ', ' : null}
                <a href={pick.href}>{pick.label}</a>
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function ItemsHead({ g, s }: { g: Guide; s: S }) {
  const it = g.page.items
  if (!it) return null
  return (
    <>
      <h2 className={c(s, 'h2')}>{it.title}</h2>
      {it.lead ? <p className={c(s, 'lead')}>{linkifyText(it.lead)}</p> : null}
    </>
  )
}
type Entry = NonNullable<Guide['page']['items']>['entries'][number]
export function EntryText({ e, s }: { e: Entry; s: S }) {
  return (
    <>
      <h3 className={c(s, 'h3')}>{e.href ? <Link href={e.href}>{e.name}</Link> : e.name}</h3>
      <p className={c(s, 'tag')}>
        {e.tag}
        {e.price ? <span className={c(s, 'price')}> · {e.price}</span> : null}
      </p>
      {e.meter ? (
        <p className={c(s, 'meter')}>
          <span className={c(s, 'meterBars')} aria-hidden="true">
            {[1, 2, 3, 4].map((n) => <i key={n} data-on={n <= e.meter!.value || undefined} />)}
          </span>
          {e.meter.label}
        </p>
      ) : null}
      {e.body.map((b) => <p key={b.slice(0, 40)} className={c(s, 'body')}>{linkifyText(b)}</p>)}
      <p className={c(s, 'best')}>
        <span>{L.bestFor}</span>
        {e.bestFor.map((b) => <span key={b} className={c(s, 'chip')}>{b}</span>)}
      </p>
      {e.cta ? (
        <p className={c(s, 'itemCta')}>
          {linkifyText(e.cta.text)}{' '}
          <Link href={e.cta.href} className={c(s, 'btn')} data-seo-event={`item_cta_${e.id}`}>
            {e.cta.label} <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </p>
      ) : null}
    </>
  )
}

export function TipsTitle({ g, s }: { g: Guide; s: S }) {
  return g.page.tips ? <h2 className={c(s, 'h2')}>{g.page.tips.title}</h2> : null
}
export function TipsList({ g, s, icon }: { g: Guide; s: S; icon?: (title: string, i: number) => ReactNode }) {
  const t = g.page.tips
  if (!t) return null
  return (
    <ol className={c(s, 'tips')}>
      {t.items.map((tip, i) => (
        <li key={tip.title}>
          {icon ? <span className={c(s, 'tipIcon')} aria-hidden="true">{icon(tip.title, i)}</span> : null}
          <strong>{tip.title}</strong> <span>{linkifyText(tip.body)}</span>
        </li>
      ))}
    </ol>
  )
}

export function ProcHead({ s }: { s: S }) {
  return (
    <>
      <h2 className={c(s, 'h2')}>{L.procTitle}</h2>
      <p className={c(s, 'lead')}>{L.procLead}</p>
    </>
  )
}
export function ProcTable({ g, s }: { g: Guide; s: S }) {
  const rows = g.page.procedureRows ?? []
  if (!rows.length) return null
  return (
    <div className={c(s, 'tableWrap')}>
      <table className={c(s, 'table', 'stack')}>
        <thead>
          <tr>{L.procCols.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const m = magRange(r.magnification)
            const at = (v: number) => ((v - 2) / 7) * 100
            return (
              <tr key={r.procedure}>
                <th scope="row">{r.procedure}</th>
                <td data-label={L.procCols[1]} className={c(s, 'num')}>
                  <span>{r.magnification}</span>
                  {m ? (
                    <span className={c(s, 'magBar')} aria-hidden="true">
                      <i style={{ left: `${at(m[0])}%`, width: `max(6px, ${at(m[1]) - at(m[0])}%)` }} />
                    </span>
                  ) : null}
                </td>
                <td data-label={L.procCols[2]}><span>{r.distance}</span></td>
                <td data-label={L.procCols[3]}><span>{linkifyText(r.pick)}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

type Section = Guide['page']['sections'][number]
export function Article({ a, s, icon, dropCap }: { a: Section; s: S; icon?: ReactNode; dropCap?: boolean }) {
  const evidence = /research/i.test(a.title)
  return (
    <article id={slug(a.title)} className={c(s, 'article', a.quote && 'articleQuote', evidence && 'articleEvidence')}>
      <h2 className={c(s, 'h2sm')}>
        {icon && evidence ? <span className={c(s, 'h2Icon')} aria-hidden="true">{icon}</span> : null}
        {a.title}
      </h2>
      <p className={c(s, 'body', dropCap && 'dropCap')}>{linkifyText(a.body)}</p>
      {a.bullets.length ? <ul className={c(s, 'bullets')}>{a.bullets.map((b) => <li key={b}>{linkifyText(b)}</li>)}</ul> : null}
      {a.sourceHref ? (
        <p className={c(s, 'source')}>
          {L.source} <a href={a.sourceHref}>{a.sourceLabel ?? a.sourceHref}</a>
        </p>
      ) : null}
      {a.quote ? (
        <figure className={c(s, 'quote')}>
          <blockquote>
            {a.quote.heading ? <p className={c(s, 'quoteHead')}>{a.quote.heading}</p> : null}
            {a.quote.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </blockquote>
          <figcaption>
            <strong>{a.quote.name}</strong>, {a.quote.role}
            <span>{a.quote.disclosure}</span>
          </figcaption>
        </figure>
      ) : null}
      {a.image ? (
        <figure className={c(s, 'articleFig')}>
          <Image src={a.image.src} alt={a.image.alt} width={a.image.width ?? 1200} height={a.image.height ?? 700} sizes="(max-width: 767px) 100vw, 740px" quality={90} />
          {a.image.caption ? <figcaption>{a.image.caption}</figcaption> : null}
        </figure>
      ) : null}
    </article>
  )
}

export function OrderPanel({ s }: { s: S }) {
  return (
    <aside className={c(s, 'orderPanel')}>
      <div>
        <p className={c(s, 'kicker')}>{L.orderKicker}</p>
        <h2 className={c(s, 'h2')}>{L.orderTitle}</h2>
      </div>
      <div className={c(s, 'orderCols')}>
        <div>
          <p>{L.orderBody}</p>
          <Link href="/measurements" className={c(s, 'link')} data-seo-event="guide_measurements">{L.orderLink}</Link>
        </div>
        <div>
          <p>{L.returnBody}</p>
          <Link href="/returns" className={c(s, 'link')}>{L.returnLink}</Link>
        </div>
      </div>
    </aside>
  )
}

export function Faq({ g, s }: { g: Guide; s: S }) {
  return (
    <>
      <h2 className={c(s, 'h2')}>{L.faqTitle}</h2>
      <div className={c(s, 'faq')}>
        {g.page.faqs.map((f) => (
          <details key={f.question}>
            <summary>{f.question}</summary>
            <p>{linkifyText(f.answer)}</p>
          </details>
        ))}
      </div>
    </>
  )
}

export function HelpHead({ s }: { s: S }) {
  return (
    <>
      <p className={c(s, 'kicker')}>{L.helpKicker}</p>
      <h2 className={c(s, 'closeH')}>{L.helpTitle}</h2>
    </>
  )
}
export function HelpBody({ g, s }: { g: Guide; s: S }) {
  return (
    <>
      <p className={c(s, 'closeP')}>{L.helpBody}</p>
      <div className={c(s, 'actions')}>
        <a href={g.email} className={c(s, 'btnAlt')} data-seo-event="guide_fit_email">
          <Mail size={17} strokeWidth={2} aria-hidden="true" /> {L.helpCta}
        </a>
        <Link href="/product" className={c(s, 'linkAlt')} data-seo-event="guide_shop_bottom">{L.shopAll}</Link>
      </div>
      <p className={c(s, 'closeFine')}>
        {L.emailNote} <Link href="/warranty">{L.warranty}</Link>
      </p>
    </>
  )
}

export function Related({ g, s }: { g: Guide; s: S }) {
  if (!g.related.length) return null
  return (
    <section className={c(s, 'relatedSec')}>
      <h2 className={c(s, 'h2sm')}>{L.related}</h2>
      <div className={c(s, 'related')}>
        {g.related.map((link) => (
          <Link href={link.href} key={link.href} data-seo-event="guide_related">
            {link.label} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---------- parts the ergonomic page does not use (wording copied from the live template) ---------- */

export function WhyPlain({ g, s }: { g: Guide; s: S }) {
  if (!g.page.why) return null
  return (
    <>
      <h2 className={c(s, 'h2')}>{g.page.why.title}</h2>
      <div className={c(s, 'whyBody')}>
        {g.page.why.body.map((p) => (
          <p key={p.slice(0, 40)} className={c(s, 'body')}>{linkifyText(p)}</p>
        ))}
      </div>
    </>
  )
}

export function TierChart({ g, s }: { g: Guide; s: S }) {
  const t = g.page.tierChart
  if (!t) return null
  return (
    <>
      <h2 className={c(s, 'h2')}>{t.title}</h2>
      {t.lead ? <p className={c(s, 'lead')}>{linkifyText(t.lead)}</p> : null}
      <div className={c(s, 'tierChart')}>
        <p className={c(s, 'tierScale')} aria-hidden="true">
          <span>{t.scale[0]}</span>
          <span>{t.scale[1]}</span>
        </p>
        <ol className={c(s, 'tiers')}>
          {t.tiers.map((tier, i) => (
            <li key={tier.label} className={c(s, 'tier')}>
              <div className={c(s, 'tierHead')}>
                <span className={c(s, 'meterBars')} aria-hidden="true">
                  {t.tiers.map((_, n) => <i key={n} data-on={n <= i || undefined} />)}
                </span>
                <strong>{tier.label}</strong>
                {tier.note ? <span>{tier.note}</span> : null}
              </div>
              <ul className={c(s, 'tierPicks')}>
                {tier.picks.map((pick) => (
                  <li key={pick.href + pick.label}>
                    <a href={pick.href} className={c(s, 'tierChip')} data-cta="tier-chart">
                      {pick.label}
                      {pick.detail ? <span>{pick.detail}</span> : null}
                      <ArrowDown size={14} strokeWidth={2} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

export function Comparison({ g, s }: { g: Guide; s: S }) {
  const rows = g.page.comparisonRows ?? []
  if (!rows.length) return null
  const other = g.page.competitorName ?? 'Other options'
  return (
    <>
      <p className={c(s, 'kickerSm')}>The differences that matter</p>
      <h2 className={c(s, 'h2')}>Compare before you commit</h2>
      <div className={c(s, 'comparison')}>
        {rows.map((row) => (
          <div key={row.feature} className={c(s, 'compareRow')}>
            <h3>{row.feature}</h3>
            <div className={c(s, 'compareOurs')}>
              <strong>HeliosX</strong>
              {row.heliosx}
            </div>
            <div className={c(s, 'compareOther')}>
              <strong>{other}</strong>
              {row.other}
            </div>
          </div>
        ))}
      </div>
      {g.page.verdict ? <p className={c(s, 'verdict')}>{linkifyText(g.page.verdict)}</p> : null}
    </>
  )
}

const TRADEOFFS: Record<string, string> = {
  Newton: 'Galilean optics. Choose Apollo or Medusa for a redirected ergonomic view.',
  Galileo: 'A lightweight Galilean option; not an ergonomic prismatic system.',
  Kepler: 'Conventional prismatic optics. Choose Apollo or Medusa for ergonomic viewing.',
  Apollo: 'Working distance is fixed to your configuration; magnification is selected at purchase.',
  Medusa: 'Working distance adjusts from 300–600 mm. Magnification does not switch on the loupe.',
}
const guideImage = (name: keyof typeof productImages) => modelBySlug(name.toLowerCase())?.photo.src ?? productImages[name]

export function Shortlist({ g, s }: { g: Guide; s: S }) {
  if (g.page.items) return null
  const rows = g.page.recommendedProducts
    .filter((name) => name in productPositioning)
    .map((name) => ({ name, href: `/product/${name.toLowerCase()}`, positioning: productPositioning[name as keyof typeof productPositioning] }))
  return (
    <>
      <p className={c(s, 'kickerSm')}>Your HeliosX shortlist</p>
      <h2 className={c(s, 'h2')}>Start with the work you do.</h2>
      <p className={c(s, 'lead')}>
        Compare the optical design, then choose your magnification and frame on the product page.
      </p>
      <div className={c(s, 'shortlist')}>
        {rows.map((row) => {
          const key = row.name as keyof typeof productImages
          return (
            <article className={c(s, 'card')} key={row.name}>
              <Link href={row.href} className={c(s, 'cardImage')} tabIndex={-1} aria-hidden="true">
                <Image src={guideImage(key)} alt={`HeliosX ${row.name} loupes`} fill sizes="(max-width: 900px) 100vw, 360px" quality={90} />
              </Link>
              <div className={c(s, 'cardBody')}>
                <div className={c(s, 'cardTitle')}>
                  <h3>
                    <Link href={row.href}>{row.name}</Link>
                  </h3>
                  <span className={c(s, 'cardPrice')}>From {g.usd(productStartingPrices[key])}</span>
                </div>
                <p>{row.positioning}</p>
                <p className={c(s, 'tradeoff')}>{TRADEOFFS[row.name]}</p>
                <Link href={row.href} className={c(s, 'link')} data-seo-event={`recommended_product_${row.name.toLowerCase()}`}>
                  Explore {row.name} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
      <p className={c(s, 'fine')}>
        Starting prices in USD. Magnification and optional prescription lenses affect the total; shipping and taxes appear at checkout.{' '}
        <Link href="/product">See all five models</Link>.
      </p>
    </>
  )
}
