// Shared content layer for every design-lab variant of the ergonomic guide.
// CONTENT RULE: every string here is the live page's own data or a literal copied
// from components/seo/SeoLandingExperience.tsx. Variants may restyle and reorder,
// never reword. Anything a variant draws on top (charts, callouts) is aria-hidden.
import { supportEmail } from '@/lib/seo'
import { getRelatedPages, getSeoLandingPage, productImages, productStartingPrices } from '@/lib/seo-content'
import { modelBySlug } from '@/components/m2/models'

export const L = {
  home: 'Home',
  guides: 'Buying guides',
  shortAnswer: 'Short answer:',
  byline: 'By the HeliosX loupe specialists',
  minRead: 'min read',
  updated: 'Updated',
  seeModels: 'See models & prices',
  readGuide: 'Read the guide',
  guidance: 'Guidance from the HeliosX loupe specialists.',
  bestFor: 'Best for',
  procTitle: 'Magnification by procedure',
  procLead: 'Common starting points. Choose for the work you do most often, then confirm the view at your own working distance.',
  procCols: ['Procedure', 'Magnification', 'Working distance', 'HeliosX starting point'] as const,
  source: 'Source:',
  orderKicker: 'Before you order',
  orderTitle: 'Get the fit right.',
  orderBody: 'After checkout, we collect your measurements and review the configuration before custom production. If you are unsure what to choose, email us first.',
  orderLink: 'How measurement works',
  returnBody: 'Non-prescription pairs can be returned within 30 days of delivery for a full refund. Prescription pairs are fully refundable until production begins.',
  returnLink: 'Read the return policy',
  faqTitle: 'Questions before buying',
  helpKicker: 'Premium magnification. More accessible.',
  helpTitle: 'A clear choice starts with your work.',
  helpBody: 'Tell us your specialty, typical procedures, current magnification, and budget. We can help you narrow the options before you order.',
  helpCta: 'Help me choose',
  shopAll: 'Shop all loupes',
  emailNote: 'Email opens in your mail app: support@heliosxvision.com ·',
  warranty: 'Limited lifetime warranty',
  related: 'Continue your research',
} as const

// CC BY 4.0 attribution for the posture photographs (same wording as the live
// /education/ergonomic-loupes-neck-pain page, plus the required change note).
export const POSTURE = {
  frames: ['/guides/posture-a.webp', '/guides/posture-b.webp', '/guides/posture-c.webp'],
  alt: 'Side-view photographs of a surgeon working with three different loupe configurations: traditional loupes (A), low-tilt prismatic loupes (B), and high-tilt prismatic loupes (C), showing progressively reduced head flexion.',
  credit:
    'Figure 2 from Fan et al. (2024), Frontiers in Public Health. Posture side-view under traditional (A), low-tilt prismatic (B), and high-tilt prismatic (C) loupes. © 2024 Fan, Yang, Young, Kaner, Kjellman, Forsman. Licensed under CC BY 4.0. Cropped into three panels.',
}

export type Callout = { at: [number, number]; label: [number, number]; side: 'left' | 'right'; title: string; value: string }
const CALLOUT_GEOMETRY: Record<string, Omit<Callout, 'title' | 'value'>> = {
  Design: { at: [47, 41], label: [48, 11], side: 'right' },
  'Weight with frame': { at: [21, 40], label: [20, 20], side: 'left' },
  'Working distance': { at: [53, 73], label: [40, 89], side: 'left' },
  Magnification: { at: [80, 70], label: [79, 89], side: 'left' },
}

const GUIDE_PHOTOS: Record<string, string> = {
  medusa: '/guides/medusa-adjustable-surgical-loupes.webp',
  apollo: '/guides/apollo-ergonomic-surgical-loupes.webp',
  galileo: '/guides/galileo-dental-surgical-loupes.webp',
}

const usd = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
export const slug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)
export const isMuted = (c: string) => /^(—|Ask the (seller|dealer)|Dealer quote|Representative quote|Quote)$/.test(c)

// Numbers read out of the page's own cells, for charts that picture them.
const dollars = (s: string) => (s.match(/\$[\d,]+/g) ?? []).map((x) => Number(x.replace(/[$,]/g, '')))
export const magRange = (s: string) => {
  const n = (s.match(/\d+(\.\d+)?(?=x)/g) ?? []).map(Number)
  return n.length ? [Math.min(...n), Math.max(...n)] : null
}

export function getGuide(pageSlug = 'ergonomic-loupes') {
  const page = getSeoLandingPage(pageSlug)
  if (!page) return null
  const imageKey = (page.recommendedProducts[0] ?? 'Apollo') as keyof typeof productImages
  const hero = page.heroImage ?? {
    src: modelBySlug(imageKey.toLowerCase())?.photo.src ?? productImages[imageKey],
    alt: `HeliosX ${imageKey} loupes`,
    caption: `${imageKey} · From ${usd(productStartingPrices[imageKey])} USD`,
  }
  const heroModel = hero.caption.split(' ')[0]?.toLowerCase()
  const heroHref = heroModel && modelBySlug(heroModel) ? `/product/${heroModel}` : undefined
  const words = [
    page.intro,
    page.answer ?? '',
    ...page.sections.flatMap((x) => [x.title, x.body, ...x.bullets]),
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
  ]
    .join(' ')
    .split(/\s+/).length
  const readMins = Math.max(2, Math.ceil(words / 220))
  const dateLabel = page.dateModified
    ? new Date(`${page.dateModified}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : null

  const railItems = [
    page.tierChart && { id: 'chart', label: 'Chart' },
    page.specTable && { id: 'models-prices', label: 'Models & prices' },
    page.quickPicks && { id: 'quick-picks', label: 'Quick picks' },
    page.items && { id: 'side-by-side', label: 'Side by side' },
    page.tips && { id: 'buying-tips', label: 'Buying tips' },
    page.procedureRows?.length && { id: 'by-procedure', label: 'By procedure' },
    page.comparisonRows?.length && { id: 'comparison', label: 'Comparison' },
    !page.items && { id: 'model-shortlist', label: 'HeliosX options' },
    { id: 'buying-advice', label: 'What to look for' },
    { id: 'questions', label: 'Questions' },
    { id: 'help-choosing', label: 'Ask for help' },
  ].filter((item): item is { id: string; label: string } => !!item)

  const entryAnchor = (head: string) =>
    page.items?.entries.find((e) => head === e.name || head.startsWith(`${e.name} `))?.id

  // The product plate: the studio photo of the page's lead model (16:9 set),
  // or the page's own hero image when it has one (headlights, price guides).
  const leadModel = (page.recommendedProducts[0] ?? 'Medusa').toLowerCase()
  const productPhoto =
    pageSlug === 'ergonomic-loupes'
      ? GUIDE_PHOTOS.medusa
      : page.heroImage?.src ?? GUIDE_PHOTOS[leadModel] ?? hero.src
  const plateModel = productPhoto === GUIDE_PHOTOS.medusa ? 'medusa' : null
  // Callout geometry is measured on the Medusa studio photo only.
  const medusaRow = plateModel === 'medusa' ? page.specTable?.rows.find(([head]) => head === 'HeliosX Medusa') : undefined
  const callouts: Callout[] = medusaRow
    ? page.specTable!.columns.flatMap((col, i) =>
        CALLOUT_GEOMETRY[col] && medusaRow[i] && medusaRow[i] !== '—' ? [{ ...CALLOUT_GEOMETRY[col], title: col, value: medusaRow[i] }] : [],
      )
    : []

  // Chart data, all read from the comparison table cells.
  const cols = page.specTable?.columns ?? []
  const priceCol = cols.findIndex((c) => /price/i.test(c))
  const weightCol = cols.findIndex((c) => /weight/i.test(c))
  const prices = (page.specTable?.rows ?? [])
    .map(([head, ...cells]) => {
      const cell = cells[priceCol - 1] ?? ''
      const segs = cell.split(';').map((part) => {
        const d = dollars(part)
        return d.length ? { lo: Math.min(...d), hi: Math.max(...d), note: part.replace(/\$[\d,]+(–\$[\d,]+)?/g, '').replace(/,\s*$/, '').trim() } : null
      }).filter((x): x is { lo: number; hi: number; note: string } => !!x)
      return { name: head, ours: head.startsWith('HeliosX'), cell, segs }
    })
    .filter((r) => r.segs.length)
  const weights = (page.specTable?.rows ?? [])
    .map(([head, ...cells]) => {
      const m = (cells[weightCol - 1] ?? '').match(/(\d+)–(\d+)\s*g/)
      return m ? { name: head, lo: Number(m[1]), hi: Number(m[2]), ours: head.startsWith('HeliosX') } : null
    })
    .filter((x): x is { name: string; lo: number; hi: number; ours: boolean } => !!x)
  const tipWeight = page.tips?.items.map((t) => t.body.match(/conventional prismatic (\d+)–(\d+) g/)).find(Boolean)
  if (tipWeight) weights.push({ name: 'conventional prismatic', lo: Number(tipWeight[1]), hi: Number(tipWeight[2]), ours: false })

  const email = `mailto:${supportEmail}?subject=${encodeURIComponent(`Help choosing loupes: ${page.title}`)}&body=${encodeURIComponent('Hi HeliosX,\n\nMy specialty / training stage:\nThe procedures I do most:\nMy current loupes and magnification (if any):\nMy budget:\nMy question:\n')}`

  return {
    page,
    hero,
    heroHref,
    readMins,
    dateLabel,
    railItems,
    entryAnchor,
    callouts,
    prices,
    weights,
    email,
    related: getRelatedPages(page.slug),
    productPhoto,
    usd,
  }
}
export type Guide = NonNullable<ReturnType<typeof getGuide>>
