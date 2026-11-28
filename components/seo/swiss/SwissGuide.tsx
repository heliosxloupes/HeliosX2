// The Swiss guide template: renders any SEO guide page from its live data.
// Sections follow the live template's order (components/seo/SeoLandingExperience.tsx)
// so headings, links and words stay identical; only the presentation changes.
import { Inter_Tight } from 'next/font/google'
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import Header from '@/components/Header'
import SeoAnalytics from '@/components/SeoAnalytics'
import AuthorityBand from '@/components/seo/AuthorityBand'
import { POSTURE, type Guide } from './content'
import * as X from './Sections'
import { CalloutPlate, ChapterRail, Parallax, PicksPhoto, PostureScroller, PriceChart, TopProgress, WeightChart } from './motion'
import { HeroStage, Rise, Settle, SwissMotion } from './Client'
import { heroPhotoFor } from './heroPhotos'
import s from './swiss.module.css'

const sans = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--f-sans' })

/** A section on the 12-column grid: index number in the first two columns. */
function Block({ id, n, children, className, label }: { id?: string; n: number; children: ReactNode; className?: string; label?: string }) {
  return (
    <section id={id} className={`${s.block} ${className ?? ''}`} aria-label={label}>
      <i className={s.rule} data-rule aria-hidden="true" />
      <div className={s.indexCol} aria-hidden="true">
        <span className={s.index} data-index data-t={String(n).padStart(2, '0')} />
      </div>
      <div className={s.blockBody}>{children}</div>
    </section>
  )
}

const GUIDE_PLATE = /^\/guides\//

export default function SwissGuide({ g }: { g: Guide }) {
  const { page } = g
  const photo = heroPhotoFor(page.slug)
  const posture = page.slug === 'ergonomic-loupes' && page.why
  // Section numbers follow the chapter menu, so "03" is chapter 3 of the menu.
  const num = (id: string) => g.railItems.findIndex((r) => r.id === id) + 1
  return (
    <>
      <Header />
      <SeoAnalytics pageType="seo_landing" pageName={page.title} />
      <TopProgress items={g.railItems} />
      <main className={`${s.page} ${sans.variable}`}>
        <SwissMotion>
          <div className={s.grid} aria-hidden="true">
            {Array.from({ length: 13 }).map((_, i) => <i key={i} data-gridline />)}
          </div>

          <HeroStage
            className={s.stage}
            visualClassName={s.stageVisual}
            photoClassName={s.stagePhoto}
            src={photo.src}
            alt={photo.alt}
            style={{ '--pos': photo.pos, '--pos-phone': photo.posPhone } as CSSProperties}
            data-h1={page.title.length <= 30 ? 'xl' : page.title.length <= 50 ? 'l' : 'm'}
          >
            <div className={s.stageInner}>
              <div className={s.heroTop}>
                <X.Crumbs s={s} />
                <X.Kicker g={g} s={s} />
                <X.Meta g={g} s={s} />
              </div>
              <h1 className={s.h1}>
                {page.title.split(' ').map((w, i, all) => (
                  <Fragment key={i}>
                    <span className={s.wordMask}><span className={s.word} style={{ '--i': i } as CSSProperties}>{w}</span></span>
                    {i < all.length - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </h1>
              <div className={s.heroCols}>
                <div className={s.heroAnswer}>
                  <X.Answer g={g} s={s} />
                  <X.HeroActions g={g} s={s} />
                </div>
              </div>
            </div>
          </HeroStage>

          <header className={s.hero}>
            <Rise className={s.heroIntroLight}>
              <X.Intro g={g} s={s} />
              <X.Guidance s={s} />
            </Rise>
            <figure className={`${s.heroFig} ${GUIDE_PLATE.test(g.productPhoto) ? '' : s.heroFigContain}`}>
              <CalloutPlate
                src={g.productPhoto}
                alt={g.hero.alt}
                callouts={g.callouts}
                priority
                aspect={GUIDE_PLATE.test(g.productPhoto) ? '16 / 7' : '16 / 9'}
              />
              <figcaption><X.HeroCaption g={g} s={s} /></figcaption>
            </figure>
            <X.OnPage g={g} s={s} />
          </header>

          <div className={s.layout}>
            <div className={s.railCol}><ChapterRail items={g.railItems} /></div>
            <div className={s.content}>
              {posture ? (
                <PostureScroller frames={POSTURE.frames} alt={POSTURE.alt} credit={POSTURE.credit} className={s.why} gridClassName={s.whyGrid} textClassName={s.whyText}>
                  <X.WhyText g={g} s={s} />
                </PostureScroller>
              ) : page.why ? (
                <section id="why" className={s.whyPlain}>
                  <Rise className={s.whyText}><X.WhyPlain g={g} s={s} /></Rise>
                </section>
              ) : null}

              {page.tierChart ? (
                <Block id="chart" n={num('chart')}>
                  <Rise><X.TierChart g={g} s={s} /></Rise>
                </Block>
              ) : null}

              {page.specTable ? (
                <Block id="models-prices" n={num('models-prices')}>
                  <Rise><X.SpecHead g={g} s={s} /></Rise>
                  {g.prices.length > 1 ? <Rise className={s.chart}><PriceChart rows={g.prices} /></Rise> : null}
                  <Rise><div data-rows><X.SpecTable g={g} s={s} /></div></Rise>
                </Block>
              ) : null}

              {page.quickPicks ? (
                <Block id="quick-picks" n={num('quick-picks')}>
                  <Rise><X.PicksTitle g={g} s={s} /></Rise>
                  <Rise><PicksPhoto labels={page.quickPicks.rows.map((r) => r.picks[0]?.label ?? '')} className={s.picksGrid}>
                    <X.PicksList g={g} s={s} />
                  </PicksPhoto></Rise>
                </Block>
              ) : null}

              {page.items ? (
                <Block id="side-by-side" n={num('side-by-side')}>
                  <Rise><X.ItemsHead g={g} s={s} /></Rise>
                  <div className={s.models}>
                    {page.items.entries.map((e) => (
                      <article key={e.id} id={e.id} className={s.model}>
                        {e.image ? (
                          <Settle className={`${s.modelMedia} ${e.image.fit === 'contain' ? s.modelMediaContain : ''}`}>
                            <Parallax src={e.image.src} alt={e.image.alt} className={s.fillMedia} amount={4} />
                          </Settle>
                        ) : null}
                        <Rise><X.EntryText e={e} s={s} /></Rise>
                      </article>
                    ))}
                  </div>
                </Block>
              ) : null}

              {page.tips ? (
                <Block id="buying-tips" n={num('buying-tips')}>
                  <Rise><X.TipsTitle g={g} s={s} /></Rise>
                  <Rise><X.TipsList g={g} s={s} /></Rise>
                  {g.weights.length > 1 ? <Rise className={s.chart}><WeightChart rows={g.weights} /></Rise> : null}
                </Block>
              ) : null}

              {page.procedureRows?.length ? (
                <Block id="by-procedure" n={num('by-procedure')}>
                  <Rise><X.ProcHead s={s} /></Rise>
                  <Rise><div data-rows><X.ProcTable g={g} s={s} /></div></Rise>
                </Block>
              ) : null}

              {page.comparisonRows?.length ? (
                <Block id="comparison" n={num('comparison')}>
                  <Rise><X.Comparison g={g} s={s} /></Rise>
                </Block>
              ) : null}

              {page.compact ? null : (
                <Rise className={s.authority}><AuthorityBand audience={page.authorityAudience} /></Rise>
              )}

              {page.items ? null : (
                <Block id="model-shortlist" n={num('model-shortlist')}>
                  <Rise><X.Shortlist g={g} s={s} /></Rise>
                </Block>
              )}

              <Block id="buying-advice" n={num('buying-advice')} className={s.advice} label="Buying advice">
                <Rise className={s.articles}>
                  {page.sections.map((a) => <X.Article key={a.title} a={a} s={s} />)}
                </Rise>
                <Rise><X.OrderPanel s={s} /></Rise>
              </Block>

              <Block id="questions" n={num('questions')}>
                <Rise><X.Faq g={g} s={s} /></Rise>
              </Block>
            </div>
          </div>

          <section id="help-choosing" className={s.close}>
            <Rise className={s.closeA}><X.HelpHead s={s} /></Rise>
            <Rise className={s.closeB} delay={0.1}><X.HelpBody g={g} s={s} /></Rise>
          </section>
          <Rise><X.Related g={g} s={s} /></Rise>
        </SwissMotion>
      </main>
    </>
  )
}
