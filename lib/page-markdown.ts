import { faqSchemaItems } from './faq-data'
import { fallbackProducts } from './fallback-products'
import { llmsFactsBlock, llmsNameNote, llmsSummary } from './llms-facts'
import { magnificationPriceByProduct } from './pricing'
import { allSeoLandingPages, educationGuides, type ContentFaq, type ContentSection } from './seo-content'
import { siteUrl } from './seo'
import { aboutPage, contactPage, type TrustPage } from './trust-pages'

// Markdown versions of the site's pages for agents that send
// `Accept: text/markdown`. Everything is rendered from the same data the
// HTML pages use. Unknown paths get a Markdown 404 that points to llms.txt.

export type MarkdownPage = { status: 200 | 404; body: string }

const usd = (value: number) => `$${value.toLocaleString('en-US')}`

function footer(path: string) {
  return [
    '---',
    '',
    `HTML version: ${siteUrl}${path === '/' ? '/' : path}`,
    `Site index for agents: [llms.txt](${siteUrl}/llms.txt) · [Sitemap](${siteUrl}/sitemap.xml)`,
    '',
  ].join('\n')
}

function sectionsMarkdown(sections: ContentSection[]) {
  return sections.flatMap((section) => [
    `## ${section.title}`,
    '',
    section.body,
    '',
    ...(section.bullets?.length ? [...section.bullets.map((b) => `- ${b}`), ''] : []),
    ...(section.sourceHref ? [`Source: [${section.sourceLabel ?? section.sourceHref}](${section.sourceHref})`, ''] : []),
  ])
}

function faqsMarkdown(faqs: ContentFaq[] | undefined) {
  if (!faqs?.length) return []
  return ['## Frequently asked questions', '', ...faqs.flatMap((f) => [`### ${f.question}`, '', f.answer, ''])]
}

function productLines() {
  return fallbackProducts
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((product) => {
      const prices = Object.values(magnificationPriceByProduct[product.slug] ?? {})
      const range = prices.length ? `${usd(Math.min(...prices))}–${usd(Math.max(...prices))}` : 'see product page'
      return `- [${product.shortName}](${siteUrl}/product/${product.slug}): ${product.cardTagline} ${range}, ${product.magnifications.join(', ')}.`
    })
}

function homeMarkdown() {
  return [
    '# HeliosX Loupes: custom-fit surgical and dental loupes',
    '',
    `> ${llmsSummary}`,
    '',
    llmsNameNote,
    '',
    '## Models and prices',
    '',
    ...productLines(),
    '',
    llmsFactsBlock(siteUrl),
    '## Useful pages',
    '',
    `- [All loupes](${siteUrl}/product)`,
    `- [Measuring guide](${siteUrl}/measurements)`,
    `- [FAQ](${siteUrl}/faq)`,
    `- [About](${siteUrl}/about) · [Contact](${siteUrl}/contact)`,
    `- [Shipping](${siteUrl}/shipping) · [Returns](${siteUrl}/returns) · [Warranty](${siteUrl}/warranty)`,
    '',
  ].join('\n')
}

function productMarkdown(slug: string) {
  const product = fallbackProducts.find((p) => p.slug === slug)
  if (!product) return null
  const table = magnificationPriceByProduct[slug] ?? {}
  return [
    `# ${product.name}`,
    '',
    product.description,
    '',
    '## Price by magnification (USD)',
    '',
    '| Magnification | Price |',
    '| --- | --- |',
    ...Object.entries(table).map(([mag, price]) => `| ${mag} | ${usd(price)} |`),
    '',
    'Standard worldwide shipping is included. Prescription lenses are an add-on.',
    '',
    '## Highlights',
    '',
    ...product.highlights.map((h) => `- ${h}`),
    '',
    ...product.specColumns.flatMap((col) => [`## ${col.title}`, '', ...col.items.map((i) => `- ${i}`), '']),
  ].join('\n')
}

function catalogMarkdown() {
  return ['# HeliosX loupes: all models', '', ...productLines(), ''].join('\n')
}

function trustMarkdown(page: TrustPage) {
  return [
    `# ${page.title}`,
    '',
    page.intro,
    '',
    ...page.sections.flatMap((s) => [`## ${s.title}`, '', s.body, '', ...(s.bullets?.map((b) => `- ${b}`) ?? []), ...(s.bullets ? [''] : [])]),
  ].join('\n')
}

function faqMarkdown() {
  return ['# HeliosX Loupes FAQ', '', ...faqSchemaItems.flatMap((f) => [`## ${f.question}`, '', f.answer, ''])].join('\n')
}

function educationHubMarkdown() {
  return [
    '# HeliosX education guides',
    '',
    ...educationGuides.map((g) => `- [${g.title}](${siteUrl}/education/${g.slug}): ${g.description}`),
    '',
  ].join('\n')
}

// Real pages whose content lives in components rather than data files. They
// get a short summary so the Markdown response is never empty.
const summaryPages: Record<string, { title: string; summary: string }> = {
  '/measurements': {
    title: 'Measuring guide and measurement form',
    summary: 'How to measure your pupillary distance (PD) and working distance for custom loupes, and the form to submit them. Loupes need PD within about 1 mm, so take three readings and use the average.',
  },
  '/shipping': {
    title: 'Shipping',
    summary: 'HeliosX ships worldwide. Standard worldwide shipping is included in the listed price. Production usually takes 1–2 weeks after your measurements are approved, then delivery time depends on the destination.',
  },
  '/returns': {
    title: 'Returns and refunds',
    summary: 'Non-prescription pairs can be returned within 30 days of delivery for a full refund of the loupes. Prescription pairs can be cancelled for a full refund until production starts; after that, defects and fit corrections are covered.',
  },
  '/warranty': {
    title: 'Limited lifetime warranty',
    summary: 'All HeliosX loupes include a limited lifetime warranty covering manufacturer-related defects in materials and workmanship, starting on the delivery date. Email heliosxloupes@gmail.com with your order number to start a claim.',
  },
  '/privacy': {
    title: 'Privacy policy',
    summary: 'How HeliosX Loupes collects, uses and protects personal information, including analytics consent choices and how to contact us about your data.',
  },
  '/terms': {
    title: 'Terms of service',
    summary: 'The terms that govern purchases and use of heliosxvision.com, including pricing, custom orders, returns and warranty references.',
  },
  '/surgical-loupes-latin-america': {
    title: 'Surgical and dental loupes for Latin America',
    summary: 'HeliosX ships custom surgical and dental loupes to Latin America with published USD prices and standard worldwide shipping included.',
  },
  '/education/research': {
    title: 'Research library',
    summary: 'Peer-reviewed studies on loupes, magnification and clinician ergonomics that HeliosX guides cite.',
  },
  '/cart': { title: 'Shopping bag', summary: 'Your shopping bag. Configure a pair on a product page to add it.' },
  '/checkout': { title: 'Checkout', summary: 'Secure Stripe checkout for HeliosX orders.' },
}

export function renderPageMarkdown(rawPath: string): MarkdownPage {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : '/'
  let body: string | null = null

  if (path === '/' || path === '/home') body = homeMarkdown()
  else if (path === '/product') body = catalogMarkdown()
  else if (path.startsWith('/product/')) body = productMarkdown(path.slice('/product/'.length))
  else if (path === '/about') body = trustMarkdown(aboutPage)
  else if (path === '/contact') body = trustMarkdown(contactPage)
  else if (path === '/faq') body = faqMarkdown()
  else if (path === '/education') body = educationHubMarkdown()
  else if (summaryPages[path]) body = `# ${summaryPages[path].title}\n\n${summaryPages[path].summary}\n`
  else if (path.startsWith('/education/')) {
    const guide = educationGuides.find((g) => `/education/${g.slug}` === path)
    if (guide) body = [`# ${guide.title}`, '', guide.description, '', guide.intro, '', ...sectionsMarkdown(guide.sections), ...faqsMarkdown(guide.faqs)].join('\n')
  } else {
    const page = allSeoLandingPages.find((p) => `/${p.slug}` === path)
    if (page) body = [`# ${page.title}`, '', page.description, '', page.intro, '', ...sectionsMarkdown(page.sections), ...faqsMarkdown(page.faqs)].join('\n')
  }

  if (body) return { status: 200, body: `${body.trimEnd()}\n\n${footer(path)}` }

  return {
    status: 404,
    body: [
      '# 404: page not found',
      '',
      `There is no page at \`${path}\` on heliosxvision.com. It may have moved or never existed.`,
      '',
      'Where to go instead:',
      '',
      `- [llms.txt](${siteUrl}/llms.txt): index of every page, written for AI agents`,
      `- [Sitemap](${siteUrl}/sitemap.xml)`,
      `- [All loupes](${siteUrl}/product)`,
      `- [Contact](${siteUrl}/contact)`,
      '',
    ].join('\n'),
  }
}
