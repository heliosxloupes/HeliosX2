import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { ALL_LIGHTS, LIGHT_WARRANTY_YEARS, lightFrom } from './lights'
import {
  LIGHT_BUNDLE_PERCENT_OFF,
  PRESCRIPTION_PRICE,
  TRAINEE_PERCENT_OFF,
  bundledLightPrice,
  lightPriceBySlug,
  magnificationPriceByProduct,
} from './pricing'

// Nov 2026 buyer pages (bottom of funnel). Built on the format that wins
// broad "types of" searches: the title names the guide, a chart and the uses;
// the answer and a chart come first; a "what are you doing?" block sends each
// task to an entry; then one entry per item in a fixed shape (tag, two short
// paragraphs, best-for list) with its own anchor; a buy prompt sits inside the
// entry it belongs to. Price transparency is the through-line: every HeliosX
// price is shown before the buyer commits.
//
// Every price and spec is read from pricing.json, lights.ts or the product
// specs. Bundle totals use bundledLightPrice(), the same function checkout
// uses. Competitor statements are limited to what the brand's own site says,
// plus one attributed, dated third-party figure.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const prices = (model: string) => Object.values(magnificationPriceByProduct[model])
const from = (model: string) => usd(Math.min(...prices(model)))
const top = (model: string) => usd(Math.max(...prices(model)))
const range = (model: string) => `${from(model)}–${top(model)}`
const price = (model: string, mag: string) => magnificationPriceByProduct[model][mag]
const section = (title: string, body: string, bullets: string[] = []): ContentSection => ({ title, body, bullets })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const light = (slug: string) => ALL_LIGHTS.find((l) => l.slug === slug)!
const lux = (slug: string) => `${light(slug).lux.toLocaleString('en-US')} lux`
const published = '2026-11-13'
const modified = '2026-11-14'

// Entry photos. Files are named for what they show and the search they serve.
type EntryImage = { src: string; alt: string; width: number; height: number; fit?: 'cover' | 'contain' }
const loupePhoto = (file: string, alt: string): EntryImage => ({ src: `/guides/${file}`, alt, width: 1600, height: 893 })
const lightPhoto = (file: string, alt: string, width: number, height: number): EntryImage => ({ src: `/guides/${file}`, alt, width, height, fit: 'contain' })
const photo: Record<string, EntryImage> = {
  newton: loupePhoto('newton-galilean-loupes.webp', 'HeliosX Newton Galilean loupes on a black wraparound frame'),
  galileo: loupePhoto('galileo-dental-surgical-loupes.webp', 'HeliosX Galileo loupes on a black frame, on a frosted acrylic block'),
  kepler: loupePhoto('kepler-prismatic-surgical-loupes.webp', 'HeliosX Kepler prismatic loupes on a metal frame with a retaining strap'),
  apollo: loupePhoto('apollo-ergonomic-surgical-loupes.webp', 'HeliosX Apollo ergonomic prismatic loupes on a red metal frame'),
  medusa: loupePhoto('medusa-adjustable-surgical-loupes.webp', 'HeliosX Medusa loupes with bronze barrels on a metal frame'),
  polaris: lightPhoto('polaris-dental-loupe-light.webp', 'HeliosX Polaris dental loupe light with its frame clip and cable', 1200, 1200),
  vega: lightPhoto('vega-dental-loupe-light.webp', 'HeliosX Vega dental loupe light with its frame clip and cable', 1098, 1098),
  rigel: lightPhoto('rigel-dental-loupe-light.webp', 'HeliosX Rigel loupe light with its frame clip and cable', 782, 780),
  sirius: lightPhoto('sirius-surgical-loupe-light.webp', 'HeliosX Sirius loupe light with its frame clip and cable', 780, 780),
  nova: lightPhoto('nova-wireless-dental-loupe-light.webp', 'HeliosX Nova wireless loupe light with spare batteries and charging dock', 520, 557),
  arcturus: { src: '/guides/arcturus-dental-headlight.webp', alt: 'HeliosX Arcturus dental headlight on a padded headband', width: 1200, height: 896 },
  antares: { src: '/guides/antares-dental-headlight.webp', alt: 'HeliosX Antares dental headlight on a headband with a top strap', width: 1200, height: 896 },
  canopus: { src: '/guides/canopus-surgical-headlight.webp', alt: 'HeliosX Canopus surgical headlight on a single padded band', width: 1200, height: 896 },
  'canopus-xl': { src: '/guides/canopus-xl-surgical-headlight.webp', alt: 'HeliosX Canopus XL surgical headlight with a strap over the top', width: 1200, height: 896 },
}
// Meters mirror the page's chart: brightness on the light page, price on the loupe pages.
const brightness = (slug: string) => {
  const l = light(slug).lux
  return { value: l <= 50000 ? 1 : l <= 70000 ? 2 : l <= 100000 ? 3 : 4, label: 'Brightness' }
}
const priceLevel = (model: string) => {
  const p = Math.min(...prices(model))
  return { value: p < 750 ? 1 : p < 1000 ? 2 : p < 1500 ? 3 : 4, label: 'Price' }
}
// Tiered charts (low to high). Every chip jumps to its entry, as the chart chips
// on the reference page do. Bands match the meters above.
type TierChart = NonNullable<SeoLandingPage['tierChart']>
type Tier = TierChart['tiers'][number]
const modelName = (m: string) => m.charAt(0).toUpperCase() + m.slice(1)
const PRICE_BANDS = [
  { label: `Under ${usd(750)}`, note: 'Galilean, entry level', max: 750 },
  { label: `${usd(750)}–${usd(999)}`, note: 'Galilean, wider field', max: 1000 },
  { label: `${usd(1000)}–${usd(1499)}`, note: 'Prismatic, 4x–6x', max: 1500 },
  { label: `${usd(1500)} and up`, note: 'Ergonomic prismatic', max: Infinity },
]
const priceTiers = (models: string[], detail: Record<string, string> = {}): Tier[] =>
  PRICE_BANDS.map((band, i) => {
    const min = i ? PRICE_BANDS[i - 1].max : 0
    const picks = models
      .filter((m) => {
        const p = Math.min(...prices(m))
        return p >= min && p < band.max
      })
      .map((m) => ({ label: modelName(m), href: `#${m}`, detail: detail[m] ?? `from ${from(m)}` }))
    return { label: band.label, note: band.note, picks }
  }).filter((t) => t.picks.length > 0)
const LUX_BANDS = [
  { label: 'Up to 50,000 lux', note: 'For 2.5x–3.5x', max: 50000 },
  { label: '70,000 lux', note: 'For 4x', max: 70000 },
  { label: '100,000 lux', note: 'For 5x–6x', max: 100000 },
  { label: '150,000 lux and up', note: 'For 8x and up, or a headlight', max: Infinity },
]
const luxTiers = (slugs: string[], label: Record<string, string> = {}): Tier[] =>
  LUX_BANDS.map((band, i) => {
    const min = i ? LUX_BANDS[i - 1].max : 0
    const picks = slugs
      .filter((s) => light(s).lux > min && light(s).lux <= band.max)
      .map((s) => ({ label: label[s] ?? light(s).name, href: `#${s}`, detail: `${light(s).headWeight} · ${usd(lightFrom(s))}` }))
    return { label: band.label, note: band.note, picks }
  }).filter((t) => t.picks.length > 0)
const priceScale: [string, string] = ['Lower price', 'Higher price']
const luxScale: [string, string] = ['Less light', 'More light']
const allModels = ['newton', 'galileo', 'kepler', 'apollo', 'medusa']

const bundle = `${LIGHT_BUNDLE_PERCENT_OFF}% off any light ordered with a pair of loupes`
const returns = 'Non-prescription pairs can be returned within 30 days of delivery for a full refund; prescription pairs are fully refundable until production begins.'
const leadTime = 'Custom production typically takes 1–2 weeks after your measurements are approved, plus 5–7 business days for prescription orders.'
const shipping = 'Standard worldwide shipping is included in the listed price.'

// Hygiene setups: Polaris on the 6 hr slim pack lasts a hygiene day better than the 4 hr clip.
const polarisSlim = lightPriceBySlug.polaris.prices['slim-6h']
const polarisSlimBundled = bundledLightPrice(polarisSlim)
const novaBundled = bundledLightPrice(lightFrom('nova'))
const hygLow = price('newton', '2.5x') + polarisSlimBundled
const hygHighPolaris = price('galileo', '3.5x') + polarisSlimBundled
const hygHighNova = price('galileo', '3.5x') + novaBundled

const modelRows = (models: string[]): string[][] => {
  const row: Record<string, string[]> = {
    newton: ['Newton', 'Galilean', '2.5x–3.5x', '40–50 g', range('newton')],
    galileo: ['Galileo', 'Galilean', '2.5x–3.5x', '—', range('galileo')],
    kepler: ['Kepler', 'Prismatic', '4.0x–6.0x', '68–85 g', range('kepler')],
    apollo: ['Apollo', 'Ergonomic prismatic', '3.0x–6.0x', '55–58 g', range('apollo')],
    medusa: ['Medusa', 'Ergonomic prismatic, adjustable distance', '3.0x–8.5x', '56–65 g', range('medusa')],
  }
  return models.map((m) => row[m])
}
const modelColumns = ['Model', 'Optics', 'Magnification', 'Weight with frame', 'Price (USD)']

// Wave 2 and 3 (Nov 15): competitor price pages, light alternatives, Australia,
// payment plans. Same shape as wave 1. Competitor facts come only from the
// brand's own site (or a source named in the note), checked on the date shown.
const published2 = '2026-11-15'
const checked = 'Checked November 15, 2026.'
const modelTag: Record<string, string> = {
  newton: 'Galilean · 2.5x–3.5x · 40–50 g',
  galileo: 'Galilean · 2.5x–3.5x · widest field',
  kepler: 'Prismatic · 4.0x–6.0x · 68–85 g',
  apollo: 'Ergonomic prismatic · 3.0x–6.0x · 55–58 g',
  medusa: 'Ergonomic prismatic · 3.0x–8.5x · 56–65 g',
}
type Cta = { text: string; label: string; href: string }
const loupeEntry = (m: string, body: string[], bestFor: string[], cta?: Cta) => ({
  id: m,
  name: modelName(m),
  tag: modelTag[m],
  price: range(m),
  href: `/product/${m}`,
  image: photo[m],
  meter: priceLevel(m),
  body,
  bestFor,
  ...(cta ? { cta } : {}),
})
const lightEntry = (slug: string, name: string, body: string[], bestFor: string[], cta?: Cta) => ({
  id: slug,
  name,
  tag: `${lux(slug)} · ${light(slug).headWeight}`,
  price: Object.keys(lightPriceBySlug[slug].prices).length > 1 ? `from ${usd(lightFrom(slug))}` : usd(lightFrom(slug)),
  href: '/product/lights',
  image: photo[slug],
  meter: brightness(slug),
  body,
  bestFor,
  ...(cta ? { cta } : {}),
})
const bundled = (slug: string) => bundledLightPrice(lightFrom(slug))
const priceFacts = [
  `Loupes: ${from('newton')} to ${top('medusa')}, by model and magnification.`,
  `Lights: from ${usd(lightFrom('polaris'))}, ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`,
  `Prescription lenses: ${usd(PRESCRIPTION_PRICE)}.`,
  `Verified students and residents: ${TRAINEE_PERCENT_OFF}% off.`,
  'Standard worldwide shipping included.',
]
// Q-Optics retail prices, q-optics.com/pages/brightnowdental (checked Nov 15, 2026).
const qo = {
  galilean: { '2.5x': 1370, '3.0x': 1470, '3.5x': 1570 } as Record<string, number>,
  ergo: { '3.0x': 2090, '3.5x': 2490, '4.0x': 2590, '4.5x': 2690 } as Record<string, number>,
  prism: { '3.5x': 2260, '4.0x': 2360, '4.5x': 2460 } as Record<string, number>,
  light: 945,
}
// Shared with the category pages (seo-hubs-2026-11-16.ts).
export { photo, loupeEntry, lightEntry, modelRows, modelColumns, allModels, modelName, modelTag, leadTime, returns, shipping, priceTiers, priceScale, priceLevel, light, lux }
export type { Cta, Tier }

// Payment plans: an even split over 12 months at 0% APR, for illustration only.
const perMonth = (total: number, months = 12) => `$${(total / months).toFixed(2)}`

export const bofuPagesNov2026: SeoLandingPage[] = [
  // 1. Lights: ~1,500 GSC impressions at positions 36–60 with no light page.
  // /dental-loupes-with-light owns "dental loupes with light"; this page owns "best ... light" + headlight.
  {
    slug: 'best-dental-loupe-lights',
    title: 'Best dental loupe lights: brightness chart, battery life and which to choose',
    metaTitle: 'Best Dental Loupe Lights + Brightness Chart & Uses | HeliosX',
    description: `Compare dental loupe lights by brightness, weight and battery life. Lux chart, quick picks by magnification, and every HeliosX light price, from ${usd(lightFrom('polaris'))}.`,
    heroKicker: 'Loupe lights',
    why: {
      title: 'Why the right loupe light matters',
      body: [
        'Loupes narrow your view to a small, magnified field, and the more they magnify, the darker that field looks. Once you lean into the work, the overhead light is behind your head, so your own head shades the area you are looking at.',
        'A light on the frame shines along your line of sight, wherever you look. The questions are how bright it needs to be for your magnification, how much it adds to the frame, and whether the battery lasts your day. The chart below answers all three, with every price shown.',
      ],
    },
    heroImage: { src: photo.arcturus.src, alt: 'Best dental loupe lights: HeliosX Arcturus headlight on a padded headband', caption: `Arcturus headlight · ${usd(lightFrom('arcturus'))} USD` },
    primaryKeyword: 'best dental loupes with light',
    relatedKeywords: ['best dental headlight', 'best wireless dental loupe light', 'best light for dental loupes', 'brightest dental loupe light'],
    audience: 'Dentists, hygienists and dental students choosing a light for HeliosX loupes',
    intro:
      'Most questions about lights come down to three things: how bright it needs to be, how much it adds to your head, and whether the battery lasts the day. This guide answers those with numbers, shows every price up front, and matches each HeliosX light to the magnification it suits. For loupe-and-light setups by specialty, see /dental-loupes-with-light and /surgical-loupes-with-light.',
    answer: `Match the light to your magnification. At 2.5x–3.5x, HeliosX Polaris (${lux('polaris')}, 10 g, from ${usd(lightFrom('polaris'))}) is enough; at 4x, Vega (${lux('vega')}, from ${usd(lightFrom('vega'))}); at 5x–6x, Rigel (${lux('rigel')}); at 8x and up, Sirius (${lux('sirius')}). Nova is wireless at 29 g with battery. Every price is on this page, and any light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`,
    tierChart: {
      title: 'Dental loupe light brightness chart',
      lead: 'From the least light to the most. Tap a light to jump to it. Higher magnification shows a darker image, so the light should rise with the loupe.',
      scale: luxScale,
      tiers: luxTiers(['polaris', 'nova', 'vega', 'rigel', 'sirius', 'arcturus'], { nova: 'Nova (wireless)', arcturus: 'Arcturus (headlight)' }),
    },
    specTable: {
      title: 'Loupe light specs and prices',
      lead: 'Higher magnification shows a darker image, so the light should rise with the loupe.',
      columns: ['Light', 'Brightness', 'Weight on the frame', 'Battery', 'Price (USD)'],
      rows: [
        ['Polaris', lux('polaris'), '10 g', 'Corded: 4, 6 or 10 hr packs', `from ${usd(lightFrom('polaris'))}`],
        ['Vega', lux('vega'), '10 g', 'Corded: 4, 6 or 10 hr packs', `from ${usd(lightFrom('vega'))}`],
        ['Rigel', lux('rigel'), '11 g', 'Corded: 4, 6 or 10 hr packs', `from ${usd(lightFrom('rigel'))}`],
        ['Sirius', lux('sirius'), '12 g', 'Corded: 4, 6 or 10 hr packs', `from ${usd(lightFrom('sirius'))}`],
        ['Nova (wireless)', lux('nova'), '29 g with battery', '3 hr per battery, 3 batteries', usd(lightFrom('nova'))],
        ['Arcturus (headlight)', lux('arcturus'), 'Headband, 164 g', '5–12 hr', usd(lightFrom('arcturus'))],
      ],
      note: `${bundle}. Every light has a ${LIGHT_WARRANTY_YEARS}-year limited warranty. Prices and specs current as of November 2026. All lights: /product/lights.`,
    },
    quickPicks: {
      title: 'Quick picks: what are you doing?',
      rows: [
        { task: 'Hygiene, exams and general dentistry, 2.5x–3.5x', picks: [{ label: 'Polaris', href: '#polaris' }, { label: 'Nova', href: '#nova' }] },
        { task: 'Restorative and crown preps at 4x', picks: [{ label: 'Vega', href: '#vega' }] },
        { task: 'Endodontics and fine work at 5x–6x', picks: [{ label: 'Rigel', href: '#rigel' }] },
        { task: 'Microsurgery at 8x and up', picks: [{ label: 'Sirius', href: '#sirius' }] },
        { task: 'No cord, moving between operatories', picks: [{ label: 'Nova', href: '#nova' }] },
        { task: 'Long lists, or a light off the loupe', picks: [{ label: 'Arcturus headlight', href: '#arcturus' }] },
      ],
    },
    items: {
      title: 'Types of dental loupe lights, and what each is best for',
      lead: 'Every corded light shares the same battery options: a 4 hr clip, a 6 hr slim pack, a 10 hr pack, or a 4 hr neckband that keeps the waist clear.',
      entries: [
        {
          id: 'polaris', name: 'Polaris', tag: `${lux('polaris')} · 10 g`, price: `from ${usd(lightFrom('polaris'))}`, href: '/product/lights', image: photo.polaris, meter: brightness('polaris'),
          body: [
            'Polaris is where most hygienists, students and general dentists should start. It is made for 2.5x–3.5x, and it has the widest spot in the range, which helps at lower magnification where your field of view is large.',
            'It is not the light for 4x and above. As the loupe magnifies more, the image gets darker, and you will want Vega or brighter.',
          ],
          bestFor: ['Hygiene', 'Students', '2.5x–3.5x'],
        },
        {
          id: 'vega', name: 'Vega', tag: `${lux('vega')} · 10 g`, price: `from ${usd(lightFrom('vega'))}`, href: '/product/lights', image: photo.vega, meter: brightness('vega'),
          body: [
            'Vega is a step brighter than Polaris at the same weight, with a tighter spot that stays on the field. It is the light for 4x.',
            'If you work at 3.5x today and expect to move to 4x, Vega saves you buying a second light later.',
          ],
          bestFor: ['4x', 'Restorative', 'Crown preps'],
          cta: { text: `Ordering loupes too? Any light ordered with loupes is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`, label: 'Build Galileo with a light', href: '/product/galileo' },
        },
        {
          id: 'rigel', name: 'Rigel', tag: `${lux('rigel')} · 11 g`, price: `from ${usd(lightFrom('rigel'))}`, href: '/product/lights', image: photo.rigel, meter: brightness('rigel'),
          body: [
            'At 5x–6x you see a much darker image, and a 50,000 lux light starts to look grey. Rigel doubles that, for 1 g more on the frame.',
            'It is the light we suggest for endodontics and fine work at 5x–6x.',
          ],
          bestFor: ['Endodontics', 'Fine detail', '5x–6x'],
          cta: { text: 'Working at 5x–6x? Kepler and Apollo both go to 6x.', label: 'See Kepler', href: '/product/kepler' },
        },
        {
          id: 'sirius', name: 'Sirius', tag: `${lux('sirius')} · 12 g`, price: `from ${usd(lightFrom('sirius'))}`, href: '/product/lights', image: photo.sirius, meter: brightness('sirius'),
          body: [
            'Sirius is the most light we make for the loupe frame, with a spot you can adjust. It is made for 8x and up.',
            'At 2.5x–3.5x it is far more light than you need, and you would be paying for brightness you do not use.',
          ],
          bestFor: ['Microsurgery', '8x and up'],
          cta: { text: 'Medusa goes to 8.5x with an adjustable working distance.', label: 'See Medusa', href: '/product/medusa' },
        },
        {
          id: 'nova', name: 'Nova (wireless)', tag: `${lux('nova')} · 29 g with battery`, price: usd(lightFrom('nova')), href: '/product/lights', image: photo.nova, meter: brightness('nova'),
          body: [
            'Nova has no cord at all. The battery sits on the light, three batteries ship with it, and each lasts about 3 hours, so you swap between patients and charge the spares in under an hour.',
            'The trade-off is weight at the front of the frame: 29 g against 10–12 g for a corded light. Choose it if the cord bothers you more than the weight.',
          ],
          bestFor: ['Moving between rooms', 'Hygiene', 'No cord'],
        },
        {
          id: 'arcturus', name: 'Arcturus (headlight)', tag: `${lux('arcturus')} · headband`, price: usd(lightFrom('arcturus')), href: '/product/lights', image: photo.arcturus, meter: brightness('arcturus'),
          body: [
            'Arcturus sits on its own padded headband, not on the loupe, so the frame carries no light weight at all. It runs 5 to 12 hours on a charge.',
            'Choose a headlight for long lists, or if you want light without mounting anything on your loupes. For most chairside dentistry, a frame-mounted light is lighter and simpler.',
          ],
          bestFor: ['Long lists', 'Off the loupe', 'Oral surgery'],
        },
      ],
    },
    authorityAudience: 'dentists and hygienists',
    tips: {
      title: 'Tips for choosing a dental loupe light',
      items: [
        { title: 'Match brightness to magnification.', body: `${lux('polaris')} is enough at 2.5x–3.5x. Each step up in magnification needs a step up in light.` },
        { title: 'Weigh the light, not the battery.', body: 'On a corded light the battery sits at your waist or neck, so only the 10–12 g light head is on the frame.' },
        { title: 'Pick the battery for your longest day.', body: 'Corded lights take a 4, 6 or 10 hr pack. Nova swaps between three batteries instead.' },
        { title: 'Order it with your loupes.', body: `Any light ordered with a pair of loupes is ${LIGHT_BUNDLE_PERCENT_OFF}% off, and every light has a ${LIGHT_WARRANTY_YEARS}-year limited warranty.` },
      ],
    },
    proofPoints: ['Every light price published', `${bundle}`, `${LIGHT_WARRANTY_YEARS}-year limited warranty on every light`],
    sections: [
      section('What to look for in a loupe light', 'Brightness, weight and battery are the three numbers that matter. Spot size comes next.', [
        `Brightness rises with magnification: ${lux('polaris')} for 2.5x–3.5x, ${lux('vega')} for 4x, ${lux('rigel')} for 5x–6x, ${lux('sirius')} for 8x and up.`,
        'Weight on the frame is what you feel through a long day. On a corded light the battery sits at your waist or neck, so only the light head is on the loupe.',
        'Battery: corded lights come with a 4, 6 or 10 hr pack. Wireless lights cover the day with spare batteries.',
        'Spot size should cover your field at your working distance, without lighting the whole room.',
      ]),
      section('Can I add a light to loupes I already own?', 'Sometimes. A mount made for one brand rarely transfers to another, so a clip-on light may not fit loupes from another company. A headlight such as Arcturus needs no mount at all. Every HeliosX light fits every HeliosX frame. More on pairing loupes and lights at /dental-loupes-with-light.'),
      section('If the light is not right', returns),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Kepler'],
    faqs: [
      faq('Do I need a light with 2.5x loupes?', 'Not always, but most clinicians who try one keep it. Once you work through loupes, the overhead light is behind your head; a light on the frame shines along your line of sight. At 2.5x–3.5x, Polaris is enough.'),
      faq('What is the best wireless dental loupe light?', `Within HeliosX, Nova: ${lux('nova')}, 29 g with battery, three batteries of about 3 hours each, ${usd(lightFrom('nova'))}. If weight on the frame matters more than the cord, a corded light at 10–12 g is lighter.`),
      faq('How bright should a dental loupe light be?', `It depends on magnification: ${lux('polaris')} at 2.5x–3.5x, ${lux('vega')} at 4x, ${lux('rigel')} at 5x–6x and ${lux('sirius')} at 8x and up.`),
      faq('Is a headlight better than a loupe-mounted light?', 'A headlight keeps weight off the loupe and suits long lists or loupes you do not want to mount anything on. For chairside dentistry, a frame-mounted light is lighter overall and always points where you look.'),
    ],
    datePublished: published,
    dateModified: modified,
  },

  // 2. Custom loupes: 513 GSC impressions at 29–34 with no page.
  {
    slug: 'custom-loupes',
    title: 'Custom surgical and dental loupes, built to your measurements',
    metaTitle: 'Custom Loupes: Fit Chart, Prices & How It Works | HeliosX',
    description: `What "custom" means for surgical and dental loupes, how remote fitting works, how long it takes, and every price, from ${from('newton')} to ${top('medusa')}.`,
    heroKicker: 'Custom loupes',
    why: {
      title: 'Why a custom fit matters for loupes',
      body: [
        'Loupes focus at one distance and look through one angle. Built for an average face, the barrels may not sit in front of your pupils, and the focus may land closer or farther than where you actually work. You end up leaning in or back to stay sharp.',
        `A custom pair moves the optics to you instead. Two measurements set the fit, a specialist checks them before production, and your measurements do not change the price. The only add-on is prescription lenses, at ${usd(PRESCRIPTION_PRICE)}.`,
      ],
    },
    heroImage: { src: photo.medusa.src, alt: 'Custom surgical loupes: HeliosX Medusa, built to your measurements', caption: `Medusa · From ${from('medusa')} USD` },
    primaryKeyword: 'custom surgical loupes',
    relatedKeywords: ['custom dental loupes', 'custom loupes', 'custom made dental loupes', 'custom fit loupes'],
    audience: 'Surgeons, dentists, residents and hygienists deciding between custom and ready-made loupes',
    intro:
      'Ready-made loupes are built for an average face and an average posture. Custom loupes are built for yours, so they stay in focus where you actually work. Every HeliosX pair is custom, every price is published, and the fitting is done remotely, so you can see the full cost of each model before you order.',
    answer: `Custom loupes are built to your pupillary distance and working distance, plus your prescription and frame. HeliosX makes every pair to order, at published prices from ${from('newton')} (Newton) to ${top('medusa')} (Medusa at 8.5x). ${leadTime}`,
    tierChart: {
      title: 'Custom loupes price chart',
      lead: 'Every model is custom-built to your measurements. Tap a model to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels),
    },
    specTable: {
      title: 'What gets customized, and why it matters',
      columns: ['What', 'How it is set', 'If it is wrong'],
      rows: [
        ['Pupillary distance', 'Measured: the distance between your pupils, so each barrel sits in front of each eye', 'A tiring or doubled image'],
        ['Working distance', 'Measured: eye to patient, in your real working posture', 'You lean in or back to stay in focus'],
        ['Declination angle', 'Selected, not measured: how far the optics tilt down', 'Your head tips forward to see through them'],
        ['Prescription', `Your lenses built into the carrier, ${usd(PRESCRIPTION_PRICE)}`, 'Blur if you normally wear glasses'],
        ['Frame', 'Chosen from the frame styles for your model', 'Slipping or pressure points'],
      ],
      note: 'How to take both measurements: /measurements.',
    },
    quickPicks: {
      title: 'Quick picks: which custom loupe for your work?',
      rows: [
        { task: 'Dental hygiene, students, first pair', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'General dentistry and general surgery, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Long cases, posture is the priority', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'You sit for some cases and stand for others', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Fine work at 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
      ],
    },
    items: {
      title: 'Custom loupe models, and what each is best for',
      entries: [
        {
          id: 'newton', name: 'Newton', tag: 'Galilean · 2.5x–3.5x', price: range('newton'), href: '/product/newton', image: photo.newton, meter: priceLevel('newton'),
          body: [
            'Newton is the lowest-cost way into custom loupes. It is a Galilean system at 40–50 g with frame, with a working distance between 300 and 550 mm set to your measurement and a 200 mm depth of field.',
            'It is built for 2.5x–3.5x, and the field of view narrows as magnification rises: 80–120 mm at 2.5x, 60–100 mm at 3.5x. If you already know you will need 4x within a year, start higher instead of buying twice.',
          ],
          bestFor: ['Students', 'Hygiene', 'First pair'],
        },
        {
          id: 'galileo', name: 'Galileo', tag: 'Galilean · 2.5x–3.5x', price: range('galileo'), href: '/product/galileo', image: photo.galileo, meter: priceLevel('galileo'),
          body: [
            'Galileo is the everyday custom loupe for dentists and surgeons at 2.5x–3.5x. Its field of view is much wider than Newton’s, 150–170 mm at 2.5x against 80–120 mm, so more of the working area stays in view. Six frame styles are included.',
            `It costs about $100 more than Newton at each magnification, from ${from('galileo')}. The wider field is what you are paying for. Like Newton, it tops out at 3.5x.`,
          ],
          bestFor: ['General dentistry', 'General surgery', 'Wide field'],
          cta: { text: `Adding a light? Any light is ${LIGHT_BUNDLE_PERCENT_OFF}% off when ordered with loupes.`, label: 'Build Galileo', href: '/product/galileo' },
        },
        {
          id: 'kepler', name: 'Kepler', tag: 'Prismatic · 4.0x–6.0x', price: range('kepler'), href: '/product/kepler', image: photo.kepler, meter: priceLevel('kepler'),
          body: [
            'Kepler is a prismatic loupe for fine detail at 4x, 5x and 6x. Its field of view runs 60–75 mm at 4x and 50–65 mm at 6x, with an 80 mm depth of field, and the working distance is set within one of four ranges between 280 and 600 mm.',
            'It is heavier, at 68–85 g with frame, and its view is narrower than a Galilean pair, so it is the right choice when the detail matters more than the weight.',
          ],
          bestFor: ['Endodontics', 'Microsurgery', '4x–6x'],
        },
        {
          id: 'apollo', name: 'Apollo', tag: 'Ergonomic prismatic · 3.0x–6.0x', price: range('apollo'), href: '/product/apollo', image: photo.apollo, meter: priceLevel('apollo'),
          body: [
            'Apollo angles the optics so you can keep your head more upright and look down with your eyes. It covers 3x to 6x at 55–58 g with frame, and you choose a fixed working distance of 420, 450, 500 or 550 mm at order.',
            'Choose Apollo if posture is the reason you are buying and you work at one consistent distance. If you switch between sitting and standing, the fixed distance is the limit; Medusa solves that.',
          ],
          bestFor: ['Posture', 'Long cases', 'One working posture'],
        },
        {
          id: 'medusa', name: 'Medusa', tag: 'Ergonomic prismatic · 3.0x–8.5x', price: range('medusa'), href: '/product/medusa', image: photo.medusa, meter: priceLevel('medusa'),
          body: [
            'Medusa adds an adjustable working distance, 300–600 mm, so the same pair stays in focus whether you sit or stand. It runs from 3x to 8.5x, at 56–65 g with frame.',
            'At each magnification Apollo also offers, Medusa costs the same or less, so the choice between them comes down to a fixed or an adjustable working distance. At 8x–8.5x the field of view is 50 mm, which suits fine work, not wide views.',
          ],
          bestFor: ['Sit and stand', 'Neurosurgery', 'Up to 8.5x'],
          cta: { text: 'Not sure about your working distance? Medusa lets you adjust it after delivery.', label: 'See Medusa', href: '/product/medusa' },
        },
      ],
    },
    tips: {
      title: 'Tips for getting a custom fit right',
      items: [
        { title: 'Measure in your real posture.', body: 'Take your working distance seated or standing, exactly as you work, not at a desk.' },
        { title: 'Follow the measuring guide step by step.', body: 'The guide at /measurements covers pupillary distance and working distance.' },
        { title: 'Sit for some cases and stand for others?', body: 'Choose Medusa. Its working distance adjusts from 300 to 600 mm after delivery.' },
        { title: 'Wear glasses?', body: `Add prescription lenses for ${usd(PRESCRIPTION_PRICE)} and send your current prescription after checkout.` },
      ],
    },
    proofPoints: ['Every pair custom-built', 'Every price published', 'Remote fitting with specialist review', 'Limited lifetime warranty'],
    sections: [
      section('How remote fitting works', 'You order, then send two measurements. A loupe specialist reviews them before anything is made.', [
        'Measure your pupillary distance and your working distance in your real posture. The guide at /measurements shows how.',
        'Send a prescription if you need one.',
        'A specialist checks the numbers and contacts you if anything looks off.',
        leadTime,
      ]),
      section('Custom vs ready-made loupes', 'Ready-made loupes are cheaper because they skip the fitting. The cost shows up later: a working distance that is off by a few centimeters makes you lean to stay in focus. More on this at /amazon-loupes-vs-custom-loupes.'),
      section('If the fit is not right', `${returns} Contact us first; most fit questions are solved by adjusting the order before production. ${shipping}`),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Medusa'],
    faqs: [
      faq('How much do custom loupes cost?', `HeliosX custom loupes cost ${range('newton')} for Newton, ${range('galileo')} for Galileo, ${range('kepler')} for Kepler, ${range('apollo')} for Apollo and ${range('medusa')} for Medusa. Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. ${shipping}`),
      faq('How long do custom loupes take?', leadTime),
      faq('Do I need to visit a showroom to get fitted?', 'No. You take two measurements at home or at work, and a specialist reviews them. The step-by-step guide is at /measurements.'),
      faq('Can custom loupes include my prescription?', `Yes, for ${usd(PRESCRIPTION_PRICE)}. Send your current prescription after checkout.`),
    ],
    datePublished: published,
    dateModified: modified,
  },

  // 3. Buy online: "buy surgical loupes" 128 impressions at 13.7.
  {
    slug: 'buy-surgical-loupes',
    title: 'Buy surgical and dental loupes online: every model and price',
    metaTitle: 'Buy Surgical Loupes Online: All Models & Prices | HeliosX',
    description: `Buy custom surgical and dental loupes online from ${from('newton')}. All five HeliosX models with full prices, delivery, returns and payment plans in one place.`,
    heroKicker: 'Buy loupes',
    why: {
      title: 'Why the price should be on the page',
      body: [
        'Many loupe brands sell through reps or dealers, so the price arrives as a quote after you have already spent time on a demo. That makes it hard to compare brands, or to plan around a budget.',
        'HeliosX lists every model, magnification, light and add-on with its price. You can compare against your budget and your work, shop around, and order online when you are ready.',
      ],
    },
    heroImage: { src: photo.galileo.src, alt: 'Buy surgical loupes online: HeliosX Galileo loupes on a black frame', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'buy surgical loupes',
    relatedKeywords: ['buy dental loupes', 'dental loupes for sale', 'buy loupes online', 'surgical loupes for sale'],
    audience: 'Surgeons, dentists, residents and hygienists ready to order',
    intro:
      'You should not need a sales rep, a course booth or a quote request to find out what loupes cost. Every HeliosX model is listed here with its full price, so you can compare against your budget and your work, shop around, and order online only when you are ready. For what loupes cost across the market, see /how-much-do-surgical-loupes-cost.',
    answer: `HeliosX sells five custom loupe models online: Newton ${range('newton')}, Galileo ${range('galileo')}, Kepler ${range('kepler')}, Apollo ${range('apollo')} and Medusa ${range('medusa')}. Every pair is built to your measurements, and standard worldwide shipping is included. ${leadTime}`,
    tierChart: {
      title: 'Surgical and dental loupes price chart',
      lead: 'All five HeliosX models, from the lowest price to the highest. Tap a model to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels),
    },
    specTable: {
      title: 'All HeliosX loupes and prices',
      columns: modelColumns,
      rows: modelRows(['newton', 'galileo', 'kepler', 'apollo', 'medusa']),
      note: `${shipping} Duties and taxes depend on your country. Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Verified residents, fellows and students get ${TRAINEE_PERCENT_OFF}% off. Full catalog: /product.`,
    },
    quickPicks: {
      title: 'Quick picks: which one is yours?',
      rows: [
        { task: 'Dental or medical student, first pair', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'Dentist or hygienist, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Surgeon, posture is the priority', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Microsurgery, endo, 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Ordering for a team or residency', picks: [{ label: 'Hospitals and universities', href: '/hospitals-and-universities' }] },
      ],
    },
    items: {
      title: 'Surgical and dental loupes for sale, and what each is best for',
      entries: [
        {
          id: 'newton', name: 'Newton', tag: 'Galilean · 2.5x–3.5x', price: range('newton'), href: '/product/newton', image: photo.newton, meter: priceLevel('newton'),
          body: [
            `The lowest-cost HeliosX pair: ${usd(price('newton', '2.5x'))} at 2.5x, ${usd(price('newton', '3.0x'))} at 3.0x and ${usd(price('newton', '3.5x'))} at 3.5x. It weighs 40–50 g with frame and is built for students, hygienists and assistants.`,
            'What you give up against Galileo is frame choice and field of view: 80–120 mm at 2.5x, against 150–170 mm. If you expect to need 4x soon, skip ahead to Kepler or Apollo rather than buying twice.',
          ],
          bestFor: ['Students', 'Hygiene', 'Assistants'],
        },
        {
          id: 'galileo', name: 'Galileo', tag: 'Galilean · 2.5x–3.5x', price: range('galileo'), href: '/product/galileo', image: photo.galileo, meter: priceLevel('galileo'),
          body: [
            `The everyday pair for dentists and surgeons at 2.5x–3.5x, ${range('galileo')}, with six frame styles included. Its field of view is the widest in the HeliosX range: 150–170 mm at 2.5x.`,
            `About $100 more than Newton at each magnification. Order a light with it and the light is ${LIGHT_BUNDLE_PERCENT_OFF}% off; Polaris on the 6 hr pack comes to ${usd(polarisSlimBundled)} that way.`,
          ],
          bestFor: ['General dentistry', 'General surgery'],
          cta: { text: `Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`, label: 'Buy Galileo', href: '/product/galileo' },
        },
        {
          id: 'kepler', name: 'Kepler', tag: 'Prismatic · 4.0x–6.0x', price: range('kepler'), href: '/product/kepler', image: photo.kepler, meter: priceLevel('kepler'),
          body: [
            `High magnification for fine detail: ${usd(price('kepler', '4.0x'))} at 4x, ${usd(price('kepler', '5.0x'))} at 5x and ${usd(price('kepler', '6.0x'))} at 6x. It is the lowest-cost way to 4x and above in the range.`,
            'It is heavier than a Galilean pair, at 68–85 g with frame, and uses conventional prismatic optics, so you look down through it rather than keeping your head upright. For that, see Apollo or Medusa.',
          ],
          bestFor: ['Microsurgery', 'Endodontics', 'Fine detail'],
        },
        {
          id: 'apollo', name: 'Apollo', tag: 'Ergonomic prismatic · 3.0x–6.0x', price: range('apollo'), href: '/product/apollo', image: photo.apollo, meter: priceLevel('apollo'),
          body: [
            `Angled optics so your head stays more upright, from ${usd(price('apollo', '3.0x'))} at 3.0x to ${usd(price('apollo', '6.0x'))} at 6.0x. Weight stays at 55–58 g with frame at every magnification.`,
            'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order, so measure before you buy. It suits surgeons and dentists buying for posture first who work at one distance.',
          ],
          bestFor: ['Posture', 'Long cases'],
        },
        {
          id: 'medusa', name: 'Medusa', tag: 'Ergonomic prismatic · 3.0x–8.5x', price: range('medusa'), href: '/product/medusa', image: photo.medusa, meter: priceLevel('medusa'),
          body: [
            `Ergonomic optics plus a working distance you adjust from 300 to 600 mm, so one pair works seated and standing. Prices run from ${usd(price('medusa', '3.0x'))} at 3.0x to ${usd(price('medusa', '8.5x'))} at 8.5x.`,
            'Up to 8.5x, the highest magnification HeliosX makes. At each magnification Apollo also offers, Medusa costs the same or less.',
          ],
          bestFor: ['Sit and stand', 'Neurosurgery', 'Spine'],
        },
      ],
    },
    tips: {
      title: 'Tips before you buy loupes online',
      items: [
        { title: 'Choose magnification by the work you do most.', body: '2.5x–3.5x suits general dentistry, hygiene and general surgery; 4x–6x is for fine detail.' },
        { title: 'Know your working distance before choosing Apollo.', body: 'Apollo is fixed at 420, 450, 500 or 550 mm. Measure first at /measurements.' },
        { title: 'Check the full total.', body: `Prescription lenses add ${usd(PRESCRIPTION_PRICE)}, any light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes, and standard shipping is included.` },
        { title: 'Students and residents: verify first.', body: `Send proof of training status before checkout to get ${TRAINEE_PERCENT_OFF}% off.` },
      ],
    },
    proofPoints: ['Order online, no sales rep', 'Every price published', 'Shipping included worldwide', 'Pay over time at checkout'],
    sections: [
      section('How ordering works', 'You choose your model, magnification and frame, and check out. After checkout we collect your measurements and review them before production.', [
        'Pick a model and magnification on its product page.',
        'Check out by card, or pay over time with Klarna or Affirm where available.',
        'Send your pupillary and working distance (/measurements), plus a prescription if you need one.',
        leadTime,
      ]),
      section('Delivery, returns and warranty', `${shipping} Transit time varies by destination, carrier and customs; see /shipping. ${returns} Every pair has a limited lifetime warranty.`),
      section('Student and resident pricing', `Verified residents, fellows and students get ${TRAINEE_PERCENT_OFF}% off. Email proof of training status and we send a code for checkout.`),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Kepler'],
    faqs: [
      faq('Can I buy surgical loupes online without a fitting appointment?', 'Yes. You take two measurements yourself and a loupe specialist reviews them before production.'),
      faq('How much do surgical loupes cost?', `HeliosX loupes cost ${from('newton')} to ${top('medusa')} depending on model and magnification, with standard worldwide shipping included. More on the market at /how-much-do-surgical-loupes-cost.`),
      faq('Can I pay for loupes in installments?', 'Yes. Klarna and Affirm are offered at checkout where available, and show the monthly amount before you confirm.'),
      faq('What if they do not fit?', returns),
    ],
    datePublished: published,
    dateModified: modified,
  },

  // 4. Hygiene price: 239 GSC impressions at 11.6.
  // Magnification guidance matches the existing hygiene pages: 3.0x default, 2.5x common for a first pair.
  {
    slug: 'dental-hygiene-loupes-price',
    title: 'Dental hygiene loupes prices: chart and best picks by budget',
    metaTitle: 'Dental Hygiene Loupes Price Chart + Best Picks | HeliosX',
    description: `Dental hygiene loupes price chart: HeliosX hygiene pairs from ${from('newton')}, totals with a light, student pricing and payment plans. Every price shown up front.`,
    heroKicker: 'Hygiene loupes',
    why: {
      title: 'Why hygienists should see the total first',
      body: [
        'Hygienists usually pay for loupes themselves, so the full total matters more than the starting price. A light, a prescription and the battery choice can move it by hundreds of dollars.',
        'The chart below shows complete setups, with the light priced the way checkout charges it, so you can choose by budget and by how you work before you commit.',
      ],
    },
    heroImage: { src: photo.newton.src, alt: 'Dental hygiene loupes: HeliosX Newton Galilean loupes', caption: `Newton · From ${from('newton')} USD` },
    primaryKeyword: 'dental hygiene loupes prices',
    relatedKeywords: ['dental hygiene loupes price', 'hygienist loupes cost', 'dental hygiene loupes for sale', 'cheap dental hygiene loupes'],
    audience: 'Dental hygienists and hygiene students paying for their own loupes',
    intro:
      'Hygienists usually buy their own loupes, so the price question matters more than it does for most clinicians. Here are the full totals, with a light and without, so you can compare against your budget before you commit. For choosing by fit and posture, see /loupes-for-dental-hygiene; for light pairings, /dental-hygiene-loupes-with-light.',
    answer: `HeliosX hygiene loupes cost ${range('newton')} (Newton) and ${range('galileo')} (Galileo). With a Polaris light on the 6 hr pack, the total is ${usd(hygLow)}–${usd(hygHighPolaris)} after the ${LIGHT_BUNDLE_PERCENT_OFF}% bundle discount. Verified hygiene students get ${TRAINEE_PERCENT_OFF}% off.`,
    tierChart: {
      title: 'Dental hygiene loupes price chart',
      lead: 'Loupe prices from lowest to highest, before a light. Tap a pair to jump to it; full setups with a light are in the table below.',
      scale: priceScale,
      tiers: priceTiers(['newton', 'galileo', 'apollo']),
    },
    specTable: {
      title: 'Full hygiene setups, with and without a light',
      lead: 'Full totals for the pairs we fit most often for hygienists, with the light priced as checkout charges it.',
      columns: ['Setup', 'Loupes', 'Light', 'Total (USD)'],
      rows: [
        ['Newton 2.5x, no light', usd(price('newton', '2.5x')), '—', usd(price('newton', '2.5x'))],
        ['Newton 3.0x + Polaris (6 hr)', usd(price('newton', '3.0x')), `${usd(polarisSlimBundled)} with loupes`, usd(price('newton', '3.0x') + polarisSlimBundled)],
        ['Galileo 3.0x + Polaris (6 hr)', usd(price('galileo', '3.0x')), `${usd(polarisSlimBundled)} with loupes`, usd(price('galileo', '3.0x') + polarisSlimBundled)],
        ['Galileo 3.0x + Nova wireless', usd(price('galileo', '3.0x')), `${usd(novaBundled)} with loupes`, usd(price('galileo', '3.0x') + novaBundled)],
        ['Apollo 3.0x (ergonomic), no light', usd(price('apollo', '3.0x')), '—', usd(price('apollo', '3.0x'))],
      ],
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Prices current as of November 2026.`,
    },
    quickPicks: {
      title: 'Quick picks: what fits your budget and your day?',
      rows: [
        { task: 'Hygiene student, tight budget', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'Full-time hygienist', picks: [{ label: 'Galileo 3.0x + Polaris', href: '#galileo' }] },
        { task: 'Moving between operatories all day', picks: [{ label: 'Galileo + Nova', href: '#nova' }] },
        { task: 'Posture is the priority', picks: [{ label: 'Apollo', href: '#apollo' }] },
      ],
    },
    items: {
      title: 'Dental hygiene loupes by price, and what each is best for',
      entries: [
        {
          id: 'newton', name: 'Newton', tag: 'Galilean · 2.5x–3.5x · 40–50 g', price: range('newton'), href: '/product/newton', image: photo.newton, meter: priceLevel('newton'),
          body: [
            `The lowest-cost custom pair we make: ${usd(price('newton', '2.5x'))} at 2.5x, ${usd(price('newton', '3.0x'))} at 3.0x and ${usd(price('newton', '3.5x'))} at 3.5x. It weighs 40–50 g with frame, with the working distance set to your measurement.`,
            'Most hygienists work at 3.0x–3.5x; 2.5x is a common first pair for students. What you give up against Galileo is frame choice and field of view: 80–120 mm at 2.5x, against 150–170 mm.',
          ],
          bestFor: ['Students', 'Budget'],
        },
        {
          id: 'galileo', name: 'Galileo', tag: 'Galilean · 2.5x–3.5x', price: range('galileo'), href: '/product/galileo', image: photo.galileo, meter: priceLevel('galileo'),
          body: [
            `A wider field of view than Newton, 150–170 mm at 2.5x, and six frame styles included, for $100 more at each magnification. At 3.0x it is ${usd(price('galileo', '3.0x'))}, or ${usd(price('galileo', '3.0x') + polarisSlimBundled)} with Polaris on the 6 hr pack.`,
            'Worth it if you will wear the pair all day for years. The wider field keeps more of the working area in view as you move around the arch.',
          ],
          bestFor: ['Full-time hygiene', 'Wide field'],
          cta: { text: `Add Polaris at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`, label: 'Build Galileo', href: '/product/galileo' },
        },
        {
          id: 'polaris', name: 'Polaris light', tag: `${lux('polaris')} · 10 g`, price: `${usd(polarisSlimBundled)} with loupes`, href: '/product/lights', image: photo.polaris,
          body: [
            `Our pick for most hygiene setups. At ${lux('polaris')} it is made for 2.5x–3.5x, and only the 10 g light head sits on the frame; the battery clips at your waist or neck.`,
            `On the 6 hr slim pack it costs ${usd(polarisSlim)} alone, or ${usd(polarisSlimBundled)} ordered with loupes. Choose the 10 hr pack if your days run long.`,
          ],
          bestFor: ['Hygiene', '2.5x–3.5x', 'Light on the frame'],
        },
        {
          id: 'nova', name: 'Nova wireless light', tag: `${lux('nova')} · 29 g with battery`, price: usd(lightFrom('nova')), href: '/product/lights', image: photo.nova,
          body: [
            `No cord between the light and your waist, which matters when you move between rooms and patients all day. It costs ${usd(lightFrom('nova'))} alone, or ${usd(novaBundled)} ordered with loupes.`,
            'Three batteries ship with it, about 3 hours each, so one is always charging. The trade-off is 29 g at the front of the frame, against 10 g for Polaris.',
          ],
          bestFor: ['Moving between rooms', 'No cord'],
        },
        {
          id: 'apollo', name: 'Apollo', tag: 'Ergonomic prismatic · 3.0x–6.0x', price: range('apollo'), href: '/product/apollo', image: photo.apollo, meter: priceLevel('apollo'),
          body: [
            `Ergonomic optics angled so you can keep your head more upright and look down with your eyes. At 3.0x it is ${usd(price('apollo', '3.0x'))}, with a fixed working distance of 420, 450, 500 or 550 mm chosen at order.`,
            'It costs about twice as much as Galileo. Buy it for the posture, not the magnification: at 3.0x it magnifies the same as Galileo 3.0x.',
          ],
          bestFor: ['Posture', 'Long days'],
        },
      ],
    },
    authorityAudience: 'dental hygienists',
    tips: {
      title: 'Tips for buying hygiene loupes on a budget',
      items: [
        { title: 'Start at 2.5x–3.0x for a first pair.', body: 'It keeps the whole arch in view. Most hygienists settle at 3.0x–3.5x.' },
        { title: 'Choose the light by how you move.', body: 'A corded Polaris is lighter on the frame. Nova has no cord, which helps if you move between rooms all day.' },
        { title: 'Order the light with the loupes.', body: `It is ${LIGHT_BUNDLE_PERCENT_OFF}% off that way, and the chart above already includes it.` },
        { title: 'Use the student discount and payment plans.', body: `Verified hygiene students get ${TRAINEE_PERCENT_OFF}% off. Klarna and Affirm are offered at checkout where available.` },
      ],
    },
    proofPoints: ['Every price published', `${TRAINEE_PERCENT_OFF}% off for verified students`, `${bundle}`, 'Pay over time at checkout'],
    sections: [
      section('What changes the price of hygiene loupes', 'Four things move the price: optics, magnification, the light and the prescription.', [
        'Galilean loupes (Newton, Galileo) cost less than prismatic ones and suit most hygiene work.',
        'Magnification: within one model, 3.0x and 3.5x cost slightly more than 2.5x.',
        'A light adds the most. Polaris is the lowest-cost HeliosX light; Nova is wireless.',
        `Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`,
      ]),
      section('Hygiene loupes by budget', 'If you are starting from a number, here is what it buys. Every total includes standard shipping.', [
        `Under ${usd(750)}: Newton at any magnification, ${range('newton')}, without a light.`,
        `About ${usd(price('newton', '3.0x') + polarisSlimBundled)}: Newton 3.0x with Polaris on the 6 hr pack.`,
        `About ${usd(price('galileo', '3.0x') + polarisSlimBundled)}: Galileo 3.0x with Polaris, our pick for full-time hygiene.`,
        `About ${usd(price('galileo', '3.0x') + novaBundled)}: Galileo 3.0x with the Nova wireless light.`,
        `${from('apollo')} and up: Apollo, if posture is the priority. A light is extra.`,
      ]),
      section('Paying for them',`Klarna and Affirm are offered at checkout where available. Hygiene students get ${TRAINEE_PERCENT_OFF}% off once we verify enrollment. ${returns}`),
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Apollo'],
    faqs: [
      faq('How much do dental hygiene loupes cost?', `HeliosX hygiene loupes cost ${from('newton')}–${top('galileo')}. With Polaris (6 hr pack) or Nova ordered alongside, the total is ${usd(hygLow)}–${usd(hygHighNova)}.`),
      faq('What magnification should a hygienist use?', 'Most hygienists work at 3.0x–3.5x. 2.5x is a common first pair for students because it keeps the whole arch in view.'),
      faq('Is there a student discount on hygiene loupes?', `Yes, ${TRAINEE_PERCENT_OFF}% for verified hygiene students. Email proof of enrollment and we send a code.`),
      faq('Do hygienists need a light on their loupes?', 'Most who try one keep it. Once you work through loupes, the overhead light is behind your head; a light on the frame shines along your line of sight.'),
    ],
    datePublished: published,
    dateModified: modified,
  },

  // 5. ExamVision price: 424 GSC impressions at 8–20.
  // ExamVision lines per its own FAQ: Galilean Essential, Galilean HD, Kepler Kompakt,
  // Kepler Advanced (multi-magnification 4x–7x), Kepler Reflekt.
  {
    slug: 'examvision-loupes-price',
    title: 'ExamVision loupes price, and what you get for less',
    metaTitle: 'ExamVision Loupes Price + Comparison Chart | HeliosX',
    description: `ExamVision does not publish prices; dealers quote them. What drives the quote, and the HeliosX pair for each ExamVision line, with every price shown, from ${from('newton')}.`,
    heroKicker: 'ExamVision price',
    why: {
      title: 'Why compare before you sign a quote',
      body: [
        'A quote is built for one configuration: magnification, frame, light and prescription. Without a published price list, it is hard to tell which of those choices drive the total, or what the same type of loupe costs elsewhere.',
        'The chart below lines up each ExamVision line, named as ExamVision names it, with the closest HeliosX pair and its published price.',
      ],
    },
    heroImage: { src: photo.kepler.src, alt: 'ExamVision loupes price comparison: HeliosX Kepler prismatic loupes', caption: `Kepler · From ${from('kepler')} USD` },
    primaryKeyword: 'examvision loupes price',
    relatedKeywords: ['exam vision loupes price', 'examvision kepler advanced price', 'examvision loupes cost', 'examvision galilean essential price'],
    audience: 'Dentists and surgeons comparing an ExamVision quote',
    competitorName: 'ExamVision',
    intro:
      'ExamVision makes well-regarded loupes, but you will not find a price on its website. If you are reading this, you were probably handed a quote, or could not find a price at all. You should be able to see what a pair costs before you commit, and compare it against your budget and your needs. Here is what ExamVision says publicly about pricing, what drives a quote, and what the same type of loupe costs at HeliosX, where every price is on the page. Our wider comparison is at /examvision-alternatives.',
    answer: `ExamVision does not publish list prices. It says prices vary with customization, and authorized dealers quote them; one 2026 dental loupe roundup says ExamVision and Zeiss premium configurations can exceed $4,000. HeliosX publishes every price: Galilean loupes from ${from('newton')}, prismatic from ${from('kepler')}, and ergonomic prismatic from ${from('apollo')}.`,
    tierChart: {
      title: 'ExamVision loupes price chart: the HeliosX match for each line',
      lead: 'ExamVision does not publish prices, so this chart ranks the HeliosX pair for each ExamVision line by its published price. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `vs Galilean Essential or HD · from ${from('newton')}`,
        galileo: `vs Galilean Essential or HD · from ${from('galileo')}`,
        kepler: `vs Kepler Kompakt · from ${from('kepler')}`,
        apollo: `vs Kepler Reflekt · from ${from('apollo')}`,
        medusa: `vs Kepler Reflekt · from ${from('medusa')}`,
      }),
    },
    specTable: {
      title: 'ExamVision vs HeliosX, line by line',
      lead: 'ExamVision lines as named on its own site. Ask your dealer for a written quote to compare like for like.',
      columns: ['Type of loupe', 'ExamVision', 'HeliosX equivalent', 'HeliosX price (USD)'],
      rows: [
        ['Galilean', 'Galilean Essential or Galilean HD: dealer quote', 'Galileo or Newton (2.5x–3.5x)', `${range('galileo')} / ${range('newton')}`],
        ['Prismatic, 3.4x–7.6x', 'Kepler Kompakt: dealer quote', 'Kepler (4x–6x); Medusa to 8.5x', `${range('kepler')} / ${range('medusa')}`],
        ['Multi-magnification, 4x–7x', 'Kepler Advanced: dealer quote', 'No direct match; Medusa adjusts working distance, not magnification', range('medusa')],
        ['Ergonomic, 4x and 6x', 'Kepler Reflekt: dealer quote', 'Apollo or Medusa', `${range('apollo')} / ${range('medusa')}`],
      ],
      note: 'ExamVision: examvision.com FAQ (prices vary with customization; quoted by dealers). Third-party figure: dentalreviewed.com, Best Dental Loupes 2026. Checked November 13, 2026.',
    },
    quickPicks: {
      title: 'Quick picks: which HeliosX pair matches your ExamVision quote?',
      rows: [
        { task: 'Quoted for Galilean Essential or HD', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
        { task: 'Quoted for Kepler Kompakt', picks: [{ label: 'Kepler', href: '#kepler' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Quoted for Kepler Reflekt, posture first', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'You sit and stand and want one pair', picks: [{ label: 'Medusa', href: '#medusa' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published online, ${from('newton')}–${top('medusa')}, shipping included`, other: 'Not published; quoted by dealers' },
      { feature: 'How you buy', heliosx: 'Online; measurements reviewed by a specialist', other: 'Through authorized dealers; an online 3D Loupe Creator sends your design to a dealer for a quote' },
      { feature: 'Student pricing', heliosx: `${TRAINEE_PERCENT_OFF}% off for verified students and residents`, other: 'Special offers for students and teachers' },
      { feature: 'Returns', heliosx: '30 days on non-prescription pairs', other: 'Not stated publicly; ask your dealer' },
    ],
    verdict: 'Choose ExamVision if you want to work with a local dealer and are comfortable working from a quote. Choose HeliosX if you want to see the full price before you commit, compare models against your own budget, and get custom optics fitted remotely.',
    items: {
      title: 'ExamVision loupe types and the HeliosX pair for each, with prices',
      entries: [
        {
          id: 'galileo', name: 'Galileo', tag: 'Galilean · 2.5x–3.5x', price: range('galileo'), href: '/product/galileo', image: photo.galileo, meter: priceLevel('galileo'),
          body: [
            `For dentists comparing a Galilean ExamVision quote: Galileo covers 2.5x–3.5x at ${range('galileo')}, with six frame styles included and a 150–170 mm field of view at 2.5x.`,
            `It is custom-built to your pupillary and working distance and reviewed by a specialist before production. Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`,
          ],
          bestFor: ['General dentistry', 'Hygiene'],
          cta: { text: `Add a light and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off with the loupes.`, label: 'Build Galileo', href: '/product/galileo' },
        },
        {
          id: 'newton', name: 'Newton', tag: 'Galilean · 2.5x–3.5x', price: range('newton'), href: '/product/newton', image: photo.newton, meter: priceLevel('newton'),
          body: [
            `The lowest-cost custom pair we make, at ${range('newton')}, for students and first-time buyers comparing an entry-level Galilean quote.`,
            'Same magnification range as Galileo at 40–50 g with frame, with fewer frame options and a narrower field: 80–120 mm at 2.5x.',
          ],
          bestFor: ['Students', 'First pair'],
        },
        {
          id: 'kepler', name: 'Kepler', tag: 'Prismatic · 4.0x–6.0x', price: range('kepler'), href: '/product/kepler', image: photo.kepler, meter: priceLevel('kepler'),
          body: [
            `For dentists comparing a prismatic quote at 4x–6x. Kepler covers 4x, 5x and 6x at a fixed magnification, from ${from('kepler')}.`,
            'Heavier than a Galilean pair, at 68–85 g with frame, with a 60–75 mm field at 4x. It uses conventional prismatic optics; for a more upright head, compare Apollo or Medusa.',
          ],
          bestFor: ['Endodontics', 'Prosthodontics', '4x–6x'],
        },
        {
          id: 'apollo', name: 'Apollo', tag: 'Ergonomic prismatic · 3.0x–6.0x', price: range('apollo'), href: '/product/apollo', image: photo.apollo, meter: priceLevel('apollo'),
          body: [
            'Angled optics for a more upright head, at a fixed working distance of 420, 450, 500 or 550 mm chosen at order. It runs 3x–6x at 55–58 g with frame.',
            `The closest HeliosX match for an ergonomic quote when you work at one distance, at ${range('apollo')}.`,
          ],
          bestFor: ['Posture', 'One working posture'],
        },
        {
          id: 'medusa', name: 'Medusa', tag: 'Ergonomic prismatic · 3.0x–8.5x', price: range('medusa'), href: '/product/medusa', image: photo.medusa, meter: priceLevel('medusa'),
          body: [
            'Ergonomic optics with a working distance you adjust from 300 to 600 mm, up to 8.5x, for clinicians who want one pair for sitting and standing.',
            'It adjusts working distance, not magnification; you choose the magnification at order. At each magnification Apollo also offers, Medusa costs the same or less.',
          ],
          bestFor: ['Sit and stand', 'Up to 8.5x'],
        },
      ],
    },
    tips: {
      title: 'Tips for comparing an ExamVision quote',
      items: [
        { title: 'Get the quote in writing.', body: 'Ask for magnification, working distance, frame, light and prescription listed line by line.' },
        { title: 'Compare the same type of optics.', body: 'Galilean with Galilean, prismatic with prismatic, ergonomic with ergonomic.' },
        { title: 'Check what the total includes.', body: 'A light and prescription lenses can be a large share of any quote.' },
        { title: 'Ask about returns before you order.', body: 'ExamVision does not state a return policy publicly. HeliosX non-prescription pairs can be returned within 30 days of delivery.' },
      ],
    },
    proofPoints: ['Every price published', 'Remote fitting', `${TRAINEE_PERCENT_OFF}% off for verified students`, 'Limited lifetime warranty'],
    sections: [
      section('Why HeliosX publishes every price', 'A quote-only price means you have to contact a dealer and share your details before you learn what a pair costs. That makes it hard to shop around. Every HeliosX model, magnification, light and add-on has its price on the page, so you can compare options against your budget and your work before you commit to anything.', [
        `Loupes: ${from('newton')} to ${top('medusa')}, by model and magnification.`,
        `Lights: from ${usd(lightFrom('polaris'))}, ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`,
        `Prescription lenses: ${usd(PRESCRIPTION_PRICE)}.`,
        `Verified students and residents: ${TRAINEE_PERCENT_OFF}% off.`,
        shipping,
      ]),
      section('What drives an ExamVision quote', 'ExamVision says its prices can vary significantly with customization, which is why dealers quote them instead of the site listing them. The same things drive the cost at any brand.', [
        'Optics: prismatic and multi-magnification systems cost more than Galilean.',
        'Magnification and frame.',
        'A light, and which battery.',
        'Prescription lenses.',
        'Student and teacher offers, where they apply.',
      ]),
      section('Getting a fair comparison', 'Ask your ExamVision dealer for a written quote with magnification, working distance, frame, light and prescription listed. Then build the closest pair on a HeliosX product page and compare the totals.'),
    ],
    recommendedProducts: ['Galileo', 'Kepler', 'Medusa'],
    faqs: [
      faq('How much do ExamVision loupes cost?', 'ExamVision does not publish prices; it says they vary with customization, and authorized dealers quote them. One 2026 dental loupe roundup says ExamVision and Zeiss premium configurations can exceed $4,000.'),
      faq('What is the ExamVision Kepler Advanced price?', `ExamVision does not list it; ask an authorized dealer for a written quote. Kepler Advanced is a multi-magnification loupe (4x–7x). HeliosX does not make a multi-magnification loupe; our closest high-magnification options are Kepler (${range('kepler')}) and Medusa (${range('medusa')}).`),
      faq('Are there lower-cost alternatives to ExamVision?', `Yes. HeliosX custom loupes start at ${from('newton')} with every price published. See /examvision-alternatives for a wider comparison.`),
    ],
    datePublished: published,
    dateModified: modified,
  },

  // 6. Orascoptic price: "orascoptic dental loupes" 1K–10K/mo at $17.74 a click.
  // Orascoptic site (Nov 15): Core Series 2.5x–5.5x, Zoom Series (EyeZoom), Ergo Series; no prices; dealer links.
  {
    slug: 'orascoptic-loupes-price',
    title: 'Orascoptic loupes price, and the HeliosX pair for each series',
    metaTitle: 'Orascoptic Loupes Price + Comparison Chart | HeliosX',
    description: `Orascoptic does not list loupe prices online; dealers quote them. What drives the quote, and the HeliosX pair for each Orascoptic series with its price, from ${from('newton')}.`,
    heroKicker: 'Orascoptic price',
    why: {
      title: 'Why compare before you sign an Orascoptic quote',
      body: [
        'Orascoptic is one of the best-known loupe brands in dentistry, and most buyers meet it through a dealer, a course or a school program. The price arrives as a quote for one configuration, so it is hard to see what each choice adds, or what the same kind of loupe costs elsewhere.',
        'The chart below takes each Orascoptic series, named as Orascoptic names it, and puts the closest HeliosX pair next to it with its published price. Orascoptic’s Spark light is compared separately at /orascoptic-light-alternative.',
      ],
    },
    heroImage: { src: photo.apollo.src, alt: 'Orascoptic loupes price comparison: HeliosX Apollo ergonomic loupes', caption: `Apollo · From ${from('apollo')} USD` },
    primaryKeyword: 'orascoptic loupes price',
    relatedKeywords: ['orascoptic dental loupes price', 'orascoptic ergo loupes price', 'orascoptic loupes cost', 'orascoptic rdh loupes price'],
    audience: 'Dentists, hygienists and surgeons comparing an Orascoptic quote',
    competitorName: 'Orascoptic',
    intro:
      'Orascoptic makes three loupe series and sells them through dental dealers. Its website describes the loupes but does not show what they cost. If you are holding a quote, or could not find a number at all, this page sets out what Orascoptic says publicly, what moves the price, and the HeliosX pair that matches each series, with every price on the page. For the full brand comparison, see /heliosx-vs-orascoptic.',
    answer: `Orascoptic does not publish loupe prices on its website; a dental dealer quotes them. HeliosX publishes every price: Galilean pairs from ${from('newton')}, prismatic from ${from('kepler')} and ergonomic prismatic from ${from('apollo')}, with standard worldwide shipping included.`,
    tierChart: {
      title: 'Orascoptic loupes price chart: the HeliosX match for each series',
      lead: 'Orascoptic does not list prices, so the chart ranks the closest HeliosX pair for each Orascoptic series by its published price. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `vs Core Series · from ${from('newton')}`,
        galileo: `vs Core Series · from ${from('galileo')}`,
        kepler: `vs Core Series at 4x+ · from ${from('kepler')}`,
        apollo: `vs Ergo Series · from ${from('apollo')}`,
        medusa: `vs Ergo or Zoom Series · from ${from('medusa')}`,
      }),
    },
    specTable: {
      title: 'Orascoptic vs HeliosX, series by series',
      columns: ['Orascoptic series', 'What Orascoptic says', 'HeliosX equivalent', 'HeliosX price (USD)'],
      rows: [
        ['Core Series', '2.5x to 5.5x. Price by dealer quote', 'Newton or Galileo (2.5x–3.5x); Kepler (4x–6x)', `${range('newton')} / ${range('galileo')} / ${range('kepler')}`],
        ['Ergo Series', 'Ergonomic loupes. Price by dealer quote', 'Apollo or Medusa', `${range('apollo')} / ${range('medusa')}`],
        ['Zoom Series', 'Variable magnification, including EyeZoom. Price by dealer quote', 'No direct match; Medusa adjusts working distance, not magnification', range('medusa')],
      ],
      note: `Orascoptic: orascoptic.com loupes pages list the three series and magnifications from 2.5x to 6.5x, with no prices, and link to dental dealers. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: which HeliosX pair matches your Orascoptic quote?',
      rows: [
        { task: 'Quoted for Core Series at 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
        { task: 'Quoted for Core Series at 4x or more', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Quoted for Ergo Series, posture first', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Looking at a zoom loupe because you sit and stand', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Hygienist, offered Orascoptic’s RDH line', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published online, ${from('newton')}–${top('medusa')}, shipping included`, other: 'Not published; quoted by dental dealers' },
      { feature: 'Series', heliosx: 'Galilean, prismatic and ergonomic prismatic, 2.5x–8.5x', other: 'Core, Zoom and Ergo series, 2.5x–6.5x' },
      { feature: 'Variable magnification', heliosx: 'Not offered', other: 'Zoom Series, including EyeZoom' },
      { feature: 'Light', heliosx: `From ${usd(lightFrom('polaris'))}, ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes`, other: 'Spark cordless headlight; price not listed' },
    ],
    verdict: `Choose Orascoptic if you want a variable-magnification loupe such as EyeZoom, or you prefer to buy through a dealer you already use. Choose HeliosX if you want the full price before you commit, custom optics fitted remotely, and ergonomic optics from ${from('apollo')}.`,
    items: {
      title: 'Orascoptic loupe series and the HeliosX pair for each, with prices',
      entries: [
        loupeEntry('galileo', [
          `For a Core Series quote at 2.5x–3.5x. Galileo is our everyday Galilean pair, ${range('galileo')}, with the widest field of view in the range, 150–170 mm at 2.5x, and six frame styles included.`,
          'It is built to your pupillary and working distance, and a specialist reviews both before production. It tops out at 3.5x; for more, look at Kepler.',
        ], ['General dentistry', 'Hygiene', 'Wide field'], { text: `Add a light and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off with the loupes.`, label: 'Build Galileo', href: '/product/galileo' }),
        loupeEntry('newton', [
          `The lowest-cost custom pair we make, ${range('newton')}. It is the closest match if you were offered an entry-level Galilean pair, or Orascoptic’s RDH line as a hygienist or student.`,
          'Against Galileo you give up frame choice and field of view: 80–120 mm at 2.5x. If you will need 4x within a year, start higher instead of buying twice.',
        ], ['Hygiene', 'Students', 'First pair']),
        loupeEntry('kepler', [
          `For a Core Series quote at 4x or more. Kepler covers 4x, 5x and 6x at ${range('kepler')}, with a 60–75 mm field of view at 4x and an 80 mm depth of field.`,
          'It uses conventional prismatic optics and weighs 68–85 g with frame. If posture is the reason you are buying, compare Apollo and Medusa first.',
        ], ['Endodontics', 'Fine detail', '4x–6x']),
        loupeEntry('apollo', [
          `For an Ergo Series quote. Apollo angles the optics so your head stays more upright, from ${usd(price('apollo', '3.0x'))} at 3.0x to ${usd(price('apollo', '6.0x'))} at 6.0x, at 55–58 g with frame.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order. It suits clinicians who work at one consistent distance.',
        ], ['Posture', 'One working posture']),
        loupeEntry('medusa', [
          'Ergonomic optics with a working distance you adjust from 300 to 600 mm, up to 8.5x. If you were looking at a zoom loupe because you move between sitting and standing, this is the closest HeliosX answer.',
          'It adjusts working distance, not magnification, so you choose the magnification at order. At each magnification Apollo also offers, Medusa costs the same or less.',
        ], ['Sit and stand', 'Up to 8.5x'], { text: 'Not sure of your working distance? Medusa adjusts after delivery.', label: 'See Medusa', href: '/product/medusa' }),
      ],
    },
    tips: {
      title: 'Tips for comparing an Orascoptic quote',
      items: [
        { title: 'Ask for the quote line by line.', body: 'Series, magnification, working distance, frame, light and prescription, each with its price.' },
        { title: 'Compare the same kind of optics.', body: 'Core Series against Galileo, Newton or Kepler; Ergo Series against Apollo or Medusa.' },
        { title: 'Check whether a light is included.', body: 'A light can be a large share of the total. HeliosX lights are listed separately, from $265.' },
        { title: 'Ask about returns and remakes.', body: 'Find out what happens if the fit is wrong before you order. HeliosX non-prescription pairs can be returned within 30 days of delivery.' },
      ],
    },
    proofPoints: ['Every price published', 'Remote fitting', `${TRAINEE_PERCENT_OFF}% off for verified students`, 'Limited lifetime warranty'],
    sections: [
      section('What drives an Orascoptic quote', 'The same choices set the price at any brand, which is why a quote only makes sense line by line.', [
        'Series: ergonomic and variable-magnification loupes cost more than standard Galilean ones.',
        'Magnification and frame.',
        'A light, and which battery.',
        'Prescription lenses.',
        'Student or program pricing, where it applies.',
      ]),
      section('Why HeliosX publishes every price', 'You should not have to share your details with a dealer to learn what a pair costs. Every HeliosX model, light and add-on is priced on the page.', priceFacts),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Medusa'],
    faqs: [
      faq('How much do Orascoptic loupes cost?', 'Orascoptic does not publish prices on its website; dental dealers quote them, and the total depends on series, magnification, frame, light and prescription. Ask for a written, itemized quote.'),
      faq('What is the HeliosX equivalent of Orascoptic Ergo?', `Apollo (${range('apollo')}) if you work at one distance, or Medusa (${range('medusa')}) if you want to adjust the working distance.`),
      faq('Does HeliosX make a zoom loupe like EyeZoom?', 'No. HeliosX loupes have a fixed magnification. Medusa adjusts the working distance from 300 to 600 mm, which solves a different problem: staying in focus seated and standing.'),
      faq('Is there an Orascoptic alternative for hygienists?', `Yes. Newton (${range('newton')}) and Galileo (${range('galileo')}) are the HeliosX hygiene pairs. Verified hygiene students get ${TRAINEE_PERCENT_OFF}% off. More at /dental-hygiene-loupes-price.`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 7. Q-Optics price: "q optics loupes price" 100–1K/mo. Q-Optics publishes retail prices.
  {
    slug: 'q-optics-loupes-price',
    title: 'Q-Optics loupes price, side by side with HeliosX',
    metaTitle: 'Q-Optics Loupes Price + Side-by-Side Chart | HeliosX',
    description: `Q-Optics retail prices for Galilean, ErgoAngle and Prismatic loupes and lights, next to the closest HeliosX pair. Galilean from ${usd(qo.galilean['2.5x'])} vs ${from('newton')}.`,
    heroKicker: 'Q-Optics price',
    why: {
      title: 'Why a price-to-price comparison is possible here',
      body: [
        'Credit where it is due: unlike most loupe brands, Q-Optics shows retail prices on its website. That means you can compare like for like, without asking anyone for a quote.',
        'Q-Optics is popular with hygienists, so the chart starts with Galilean pairs and lights, then moves to ergonomic and prismatic loupes. Every HeliosX price is the published catalog price.',
      ],
    },
    heroImage: { src: photo.galileo.src, alt: 'Q-Optics loupes price comparison: HeliosX Galileo Galilean loupes', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'q optics loupes price',
    relatedKeywords: ['q-optics loupes price', 'q optics dental loupes price', 'q optics ergo loupes price', 'q optics loupe light price'],
    audience: 'Hygienists, dentists and students comparing Q-Optics prices',
    competitorName: 'Q-Optics',
    intro:
      'Q-Optics lists retail prices for its Galilean, ErgoAngle and Prismatic loupes and its lights. Here they are next to the closest HeliosX pair at the same magnification, so you can see the difference in dollars, then decide what matters more to you. For the full brand comparison, see /heliosx-vs-q-optics.',
    answer: `Q-Optics lists Galilean loupes at ${usd(qo.galilean['2.5x'])}–${usd(qo.galilean['3.5x'])}, ErgoAngle at ${usd(qo.ergo['3.0x'])}–${usd(qo.ergo['4.5x'])}, Prismatic at ${usd(qo.prism['3.5x'])}–${usd(qo.prism['4.5x'])} and lights at ${usd(qo.light)}, at retail. The closest HeliosX pairs cost ${range('newton')} (Galilean), ${range('kepler')} (prismatic) and ${from('apollo')} and up (ergonomic).`,
    tierChart: {
      title: 'Q-Optics loupes price chart: the HeliosX pair at each price',
      lead: 'HeliosX pairs from lowest to highest price, each with the Q-Optics retail price it compares against. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `${from('newton')} vs Q-Optics Galilean ${usd(qo.galilean['2.5x'])}`,
        galileo: `${from('galileo')} vs Q-Optics Galilean ${usd(qo.galilean['2.5x'])}`,
        kepler: `${usd(price('kepler', '4.0x'))} vs Q-Optics Prismatic ${usd(qo.prism['4.0x'])}`,
        apollo: `${usd(price('apollo', '3.0x'))} vs ErgoAngle ${usd(qo.ergo['3.0x'])}`,
        medusa: `${usd(price('medusa', '3.0x'))} vs ErgoAngle ${usd(qo.ergo['3.0x'])}`,
      }),
    },
    specTable: {
      title: 'Q-Optics vs HeliosX, price by price',
      columns: ['Q-Optics (retail)', 'Q-Optics price', 'Closest HeliosX', 'HeliosX price'],
      rows: [
        ['Galilean 2.5x', usd(qo.galilean['2.5x']), 'Newton 2.5x / Galileo 2.5x', `${usd(price('newton', '2.5x'))} / ${usd(price('galileo', '2.5x'))}`],
        ['Galilean 3.0x', usd(qo.galilean['3.0x']), 'Newton 3.0x / Galileo 3.0x', `${usd(price('newton', '3.0x'))} / ${usd(price('galileo', '3.0x'))}`],
        ['Galilean 3.5x', usd(qo.galilean['3.5x']), 'Newton 3.5x / Galileo 3.5x', `${usd(price('newton', '3.5x'))} / ${usd(price('galileo', '3.5x'))}`],
        ['ErgoAngle 3.0x', usd(qo.ergo['3.0x']), 'Apollo 3.0x / Medusa 3.0x', `${usd(price('apollo', '3.0x'))} / ${usd(price('medusa', '3.0x'))}`],
        ['ErgoAngle 4.0x', usd(qo.ergo['4.0x']), 'Medusa 4.0x / Apollo 4.0x', `${usd(price('medusa', '4.0x'))} / ${usd(price('apollo', '4.0x'))}`],
        ['Prismatic 4.0x', usd(qo.prism['4.0x']), 'Kepler 4.0x', usd(price('kepler', '4.0x'))],
        ['Cordless light', usd(qo.light), 'Nova wireless', `${usd(lightFrom('nova'))}, or ${usd(bundled('nova'))} with loupes`],
        ['Wired light', usd(qo.light), 'Polaris (corded)', `from ${usd(lightFrom('polaris'))}, or ${usd(bundled('polaris'))} with loupes`],
      ],
      note: `Q-Optics retail prices as shown on q-optics.com/pages/brightnowdental, a partner offer page that also lists a code taking $150 off loupes and $250 off lights. ErgoAngle also comes in 3.5x (${usd(qo.ergo['3.5x'])}) and 4.5x (${usd(qo.ergo['4.5x'])}), and Prismatic in 3.5x and 4.5x; HeliosX does not make 4.5x. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: what were you looking at?',
      rows: [
        { task: 'Q-Optics Galilean, hygiene or general dentistry', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
        { task: 'Q-Optics light, wired or cordless', picks: [{ label: 'Polaris', href: '#polaris' }, { label: 'Nova', href: '/best-dental-loupe-lights#nova' }] },
        { task: 'Q-Optics ErgoAngle', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Q-Optics Prismatic at 4x', picks: [{ label: 'Kepler', href: '#kepler' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published, ${from('newton')}–${top('medusa')}, shipping included`, other: `Retail prices published, Galilean from ${usd(qo.galilean['2.5x'])}` },
      { feature: 'Magnifications', heliosx: '2.5x–8.5x, no 4.5x', other: 'Galilean 2.5x–3.5x; ErgoAngle and Prismatic to 4.5x' },
      { feature: 'Lights', heliosx: `From ${usd(lightFrom('polaris'))}; ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes`, other: `Wired or cordless, ${usd(qo.light)} retail` },
      { feature: 'Student pricing', heliosx: `${TRAINEE_PERCENT_OFF}% off for verified students and residents`, other: 'Ask Q-Optics' },
    ],
    verdict: `Choose Q-Optics if you want 4.5x, or prefer its frames and service after trying a pair. Choose HeliosX if price decides it: Galileo 2.5x is ${usd(qo.galilean['2.5x'] - price('galileo', '2.5x'))} less than the Q-Optics Galilean 2.5x at retail.`,
    items: {
      title: 'Q-Optics loupe types and the HeliosX pair for each, with prices',
      entries: [
        loupeEntry('galileo', [
          `Against Q-Optics Galilean 2.5x at ${usd(qo.galilean['2.5x'])} retail, Galileo 2.5x is ${usd(price('galileo', '2.5x'))}: ${usd(qo.galilean['2.5x'] - price('galileo', '2.5x'))} less. It has the widest field in the HeliosX range, 150–170 mm at 2.5x, with six frame styles included.`,
          'It is custom-built to your measurements and reviewed by a specialist before production. It stops at 3.5x, the same as the Q-Optics Galilean line.',
        ], ['Hygiene', 'General dentistry', 'Wide field'], { text: `Add a light and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off with the loupes.`, label: 'Build Galileo', href: '/product/galileo' }),
        loupeEntry('newton', [
          `The lowest-cost HeliosX pair, ${range('newton')}: ${usd(qo.galilean['2.5x'] - price('newton', '2.5x'))} less than Q-Optics Galilean 2.5x at retail. Made for hygiene students and first pairs, at 40–50 g with frame.`,
          'Against Galileo you give up frame choice and field of view: 80–120 mm at 2.5x, against 150–170 mm.',
        ], ['Students', 'Hygiene', 'Budget']),
        lightEntry('polaris', 'Polaris light', [
          `Q-Optics lists its wired and cordless lights at ${usd(qo.light)} retail. Polaris is a corded light at ${lux('polaris')}, from ${usd(lightFrom('polaris'))}, or ${usd(bundled('polaris'))} ordered with loupes. Only the 10 g head sits on the frame.`,
          `If you want no cord at all, Nova is wireless at ${usd(lightFrom('nova'))}, with three batteries of about 3 hours each.`,
        ], ['Hygiene', '2.5x–3.5x']),
        loupeEntry('apollo', [
          `Against ErgoAngle 3.0x at ${usd(qo.ergo['3.0x'])} retail, Apollo 3.0x is ${usd(price('apollo', '3.0x'))}. Its angled optics keep your head more upright, at 55–58 g with frame.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order. If you move between sitting and standing, look at Medusa.',
        ], ['Posture', 'One working posture']),
        loupeEntry('medusa', [
          `Against ErgoAngle 4.0x at ${usd(qo.ergo['4.0x'])} retail, Medusa 4.0x is ${usd(price('medusa', '4.0x'))}, with a working distance you adjust from 300 to 600 mm.`,
          'It runs from 3.0x to 8.5x, but there is no 4.5x. If 4.5x is the magnification you need, Q-Optics makes it and we do not.',
        ], ['Sit and stand', 'Up to 8.5x']),
        loupeEntry('kepler', [
          `Against Q-Optics Prismatic 4.0x at ${usd(qo.prism['4.0x'])} retail, Kepler 4.0x is ${usd(price('kepler', '4.0x'))}. It covers 4x, 5x and 6x with an 80 mm depth of field.`,
          'It weighs 68–85 g with frame and uses conventional prismatic optics. For a more upright head at 4x, compare Apollo and Medusa.',
        ], ['Endodontics', 'Fine detail']),
      ],
    },
    tips: {
      title: 'Tips for comparing Q-Optics and HeliosX prices',
      items: [
        { title: 'Compare at the same magnification.', body: 'Galilean 3.0x against Galilean 3.0x; the price moves within each line.' },
        { title: 'Add the light to both totals.', body: `Q-Optics lights list at ${usd(qo.light)} retail; HeliosX lights start at ${usd(lightFrom('polaris'))} and are ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.` },
        { title: 'Check for codes and student pricing.', body: `Q-Optics shows offer codes on some partner pages; HeliosX gives verified students ${TRAINEE_PERCENT_OFF}% off.` },
        { title: 'Decide whether you need 4.5x.', body: 'Q-Optics makes 4.5x; HeliosX goes from 4.0x to 5.0x.' },
      ],
    },
    proofPoints: ['Every price published', `${bundle}`, `${TRAINEE_PERCENT_OFF}% off for verified students`, 'Limited lifetime warranty'],
    sections: [
      section('What the HeliosX price includes', 'The listed price covers the loupes built to your measurements, a frame, a specialist review of your measurements and shipping.', priceFacts),
      section('A hygiene setup, priced both ways', `At retail, Q-Optics Galilean 3.0x plus a light comes to ${usd(qo.galilean['3.0x'] + qo.light)}. Galileo 3.0x plus Polaris on the 6 hr pack comes to ${usd(price('galileo', '3.0x') + polarisSlimBundled)} with the bundle discount. Full hygiene totals are at /dental-hygiene-loupes-price.`),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    faqs: [
      faq('How much do Q-Optics loupes cost?', `At retail, Q-Optics lists Galilean loupes at ${usd(qo.galilean['2.5x'])}–${usd(qo.galilean['3.5x'])}, ErgoAngle at ${usd(qo.ergo['3.0x'])}–${usd(qo.ergo['4.5x'])} and Prismatic at ${usd(qo.prism['3.5x'])}–${usd(qo.prism['4.5x'])}, per its partner offer page. ${checked}`),
      faq('How much is a Q-Optics loupe light?', `Q-Optics lists its wired and cordless lights at ${usd(qo.light)} retail. HeliosX lights start at ${usd(lightFrom('polaris'))}.`),
      faq('What is the HeliosX equivalent of Q-Optics ErgoAngle?', `Apollo (${range('apollo')}) for one working distance, or Medusa (${range('medusa')}) for an adjustable one. Neither comes in 4.5x.`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 8. SurgiTel price: 108 impressions at 10–29. SurgiTel site (Nov 15): Ergo IQ, UltiView Pro,
  // Galilean loupes; "Request a Demo", "Find Your Local Representative"; no prices.
  {
    slug: 'surgitel-loupes-price',
    title: 'SurgiTel loupes price, and the HeliosX surgical pair for each line',
    metaTitle: 'SurgiTel Loupes Price + Surgeon Comparison Chart | HeliosX',
    description: `SurgiTel does not list prices; local representatives quote them. The HeliosX surgical pair for each SurgiTel line, with every price published, from ${from('kepler')} for prismatic.`,
    heroKicker: 'SurgiTel price',
    why: {
      title: 'Why surgeons should see the number first',
      body: [
        'SurgiTel is known for ergonomic loupes in surgery, and it sells through local representatives and demos. That suits some surgeons, but it means the price comes last, after the time spent on a demo.',
        'The chart below lines up each SurgiTel line with the closest HeliosX surgical pair and its published price, so you know the comparison before the demo.',
      ],
    },
    heroImage: { src: photo.medusa.src, alt: 'SurgiTel loupes price comparison: HeliosX Medusa adjustable surgical loupes', caption: `Medusa · From ${from('medusa')} USD` },
    primaryKeyword: 'surgitel loupes price',
    relatedKeywords: ['surgitel loupes cost', 'surgitel ergo loupes price', 'surgitel surgical loupes price', 'surgitel dental loupes price'],
    audience: 'Surgeons, residents and dentists comparing a SurgiTel quote',
    competitorName: 'SurgiTel',
    intro:
      'SurgiTel lists its loupes online but sends you to a local representative or a demo for the price. Here is what SurgiTel says publicly, what it says premium loupes cost, and the HeliosX pair that matches each line, with the price on the page. Surgeon models come first, because that is where most SurgiTel buyers are. The full brand comparison is at /heliosx-vs-surgitel.',
    answer: `SurgiTel does not publish prices; a local representative quotes them. In its own blog, SurgiTel puts premium custom loupes at $1,500–$2,500 or more. HeliosX ergonomic pairs cost ${range('apollo')} (Apollo) and ${range('medusa')} (Medusa), and prismatic Kepler ${range('kepler')}, all published.`,
    tierChart: {
      title: 'SurgiTel loupes price chart: the HeliosX match for each line',
      lead: 'SurgiTel does not list prices, so the chart ranks the closest HeliosX pair for each SurgiTel line by its published price. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `vs SurgiTel Galilean · from ${from('newton')}`,
        galileo: `vs SurgiTel Galilean · from ${from('galileo')}`,
        kepler: `4x–6x, fixed posture · from ${from('kepler')}`,
        apollo: `vs Ergo IQ · from ${from('apollo')}`,
        medusa: `vs Ergo IQ · from ${from('medusa')}`,
      }),
    },
    specTable: {
      title: 'SurgiTel vs HeliosX, line by line',
      columns: ['SurgiTel line', 'What SurgiTel says', 'HeliosX equivalent', 'HeliosX price (USD)'],
      rows: [
        ['Ergo IQ', 'Ergonomic loupes, in 3x, 3.5x and 4.5x. Price through a representative', 'Apollo or Medusa', `${range('apollo')} / ${range('medusa')}`],
        ['Galilean loupes', 'Listed online. Price through a representative', 'Newton or Galileo', `${range('newton')} / ${range('galileo')}`],
        ['Higher magnification', 'Price through a representative', 'Kepler (4x–6x); Medusa to 8.5x', `${range('kepler')} / ${range('medusa')}`],
      ],
      note: `SurgiTel: surgitel.com lists Ergo IQ, UltiView Pro and Galilean loupes, with "Request a Demo" and "Find Your Local Representative" instead of prices. Price range from SurgiTel’s blog post "The hidden cost of cheap optics". ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: what kind of surgeon are you?',
      rows: [
        { task: 'Long cases, posture first, one working distance', picks: [{ label: 'Apollo', href: '#apollo' }] },
        { task: 'You sit for some cases and stand for others', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Vascular, plastics or hand surgery at 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Neurosurgery or spine above 6x', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'General surgery or a resident’s first pair', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published, ${from('newton')}–${top('medusa')}, shipping included`, other: 'Through a local representative' },
      { feature: 'Ergonomic range', heliosx: 'Apollo 3.0x–6.0x; Medusa 3.0x–8.5x', other: 'Ergo IQ in 3x, 3.5x and 4.5x' },
      { feature: 'Working distance', heliosx: 'Built to your measurement; Medusa adjusts from 300 to 600 mm', other: 'Ask your representative' },
      { feature: 'Resident pricing', heliosx: `${TRAINEE_PERCENT_OFF}% off for verified residents and fellows`, other: 'Ask your representative' },
    ],
    verdict: `Choose SurgiTel if you want 4.5x ergonomic loupes or an in-person demo with a local representative. Choose HeliosX if you want the price before the demo, ergonomic optics up to 8.5x, and an adjustable working distance with Medusa from ${from('medusa')}.`,
    items: {
      title: 'SurgiTel loupe lines and the HeliosX surgical pair for each, with prices',
      entries: [
        loupeEntry('apollo', [
          `The closest match for an Ergo IQ quote if you work at one distance. Apollo runs from ${usd(price('apollo', '3.0x'))} at 3.0x to ${usd(price('apollo', '6.0x'))} at 6.0x, at 55–58 g with frame, with angled optics so your head stays more upright.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order, so measure in your real operating posture first.',
        ], ['Long cases', 'Posture', 'One working posture']),
        loupeEntry('medusa', [
          `The pair for surgeons who switch between sitting and standing: a working distance you adjust from 300 to 600 mm, from ${usd(price('medusa', '3.0x'))} at 3.0x to ${usd(price('medusa', '8.5x'))} at 8.5x.`,
          'At 8x–8.5x the field of view is 50 mm, which suits fine work, not wide views. At each magnification Apollo also offers, Medusa costs the same or less.',
        ], ['Sit and stand', 'Neurosurgery', 'Spine'], { text: 'Not sure of your working distance? Medusa adjusts after delivery.', label: 'See Medusa', href: '/product/medusa' }),
        loupeEntry('kepler', [
          `The lowest-cost way to 4x and above: ${usd(price('kepler', '4.0x'))} at 4x, ${usd(price('kepler', '5.0x'))} at 5x and ${usd(price('kepler', '6.0x'))} at 6x, with an 80 mm depth of field.`,
          'It uses conventional prismatic optics, so you look down through it, and weighs 68–85 g with frame. For posture, choose Apollo or Medusa.',
        ], ['Vascular', 'Plastics', 'Hand surgery']),
        loupeEntry('galileo', [
          `For general surgery at 2.5x–3.5x, ${range('galileo')}. It has the widest field in the HeliosX range, 150–170 mm at 2.5x, which helps in open procedures.`,
          'It stops at 3.5x. If you expect to need 4x during training, start with Kepler or an ergonomic pair.',
        ], ['General surgery', 'Wide field']),
        loupeEntry('newton', [
          `A resident’s first pair at ${range('newton')}, at 40–50 g with frame. With the ${TRAINEE_PERCENT_OFF}% resident discount, it is the lowest-cost way into custom loupes.`,
          'It has a narrower field than Galileo, 80–120 mm at 2.5x, and fewer frame options.',
        ], ['Residents', 'Medical students']),
      ],
    },
    tips: {
      title: 'Tips for comparing a SurgiTel quote',
      items: [
        { title: 'Get the quote in writing before the demo ends.', body: 'Magnification, working distance, frame, light and prescription, line by line.' },
        { title: 'Measure in your operating posture.', body: 'Working distance seated and standing can differ by 10 cm or more. The guide is at /measurements.' },
        { title: 'Decide on 4.5x early.', body: 'SurgiTel Ergo IQ comes in 4.5x; HeliosX goes from 4.0x to 5.0x.' },
        { title: 'Residents: ask about training pricing.', body: `HeliosX gives verified residents and fellows ${TRAINEE_PERCENT_OFF}% off.` },
      ],
    },
    proofPoints: ['Every price published', 'Ergonomic optics up to 8.5x', `${TRAINEE_PERCENT_OFF}% off for verified residents`, 'Limited lifetime warranty'],
    sections: [
      section('What SurgiTel says loupes cost', 'SurgiTel’s own blog compares budget loupes at $400–$800 with premium custom loupes such as its own at $1,500–$2,500 or more, and argues the premium is worth it over time. Every HeliosX pair is custom-built to your measurements, with its price on the page.', priceFacts),
      section('Why HeliosX publishes every price', 'A demo is useful, but you should know what the pair costs before you book one. Every HeliosX model, light and add-on is priced on the page, so you can compare against your budget first.'),
    ],
    recommendedProducts: ['Apollo', 'Medusa', 'Kepler'],
    faqs: [
      faq('How much do SurgiTel loupes cost?', 'SurgiTel does not list prices; a local representative quotes them. SurgiTel’s own blog puts premium custom loupes at $1,500–$2,500 or more.'),
      faq('What is the HeliosX equivalent of SurgiTel Ergo IQ?', `Apollo (${range('apollo')}) for one working distance, or Medusa (${range('medusa')}) for an adjustable one, up to 8.5x.`),
      faq('Is there a resident discount?', `HeliosX gives verified residents, fellows and students ${TRAINEE_PERCENT_OFF}% off. Email proof of training status and we send a code.`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 9. Designs for Vision price: 31 impressions at 38. DFV site (Nov 15): no prices;
  // Panoramic loupes, MicroSeries, HDi headlights.
  {
    slug: 'designs-for-vision-loupes-price',
    title: 'Designs for Vision loupes price, and what the same loupe costs at HeliosX',
    metaTitle: 'Designs for Vision Loupes Price + Comparison | HeliosX',
    description: `Designs for Vision does not list prices online. What drives a DFV quote, and the HeliosX pair for each DFV line with its price, from ${from('newton')}.`,
    heroKicker: 'Designs for Vision price',
    why: {
      title: 'Why compare before you sign a Designs for Vision quote',
      body: [
        'Designs for Vision has made loupes and headlights for decades and sells them through its own representatives. The website shows the products, not the prices, so most buyers learn the total at the end of a demo.',
        'The chart below lines up each Designs for Vision line with the closest HeliosX pair and its published price, so you can walk into the demo knowing the comparison.',
      ],
    },
    heroImage: { src: photo.galileo.src, alt: 'Designs for Vision loupes price comparison: HeliosX Galileo loupes', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'designs for vision loupes price',
    relatedKeywords: ['design for vision loupes cost', 'designs for vision dental loupes price', 'dfv loupes price', 'designs for vision surgical loupes price'],
    audience: 'Dentists and surgeons comparing a Designs for Vision quote',
    competitorName: 'Designs for Vision',
    intro:
      'Designs for Vision lists its Panoramic and MicroSeries loupes, frames and HDi headlights online, but no prices. If you were quoted after a demo, or could not find a price at all, here is what drives a DFV quote and the HeliosX pair for each line, with every price on the page. The full brand comparison is at /heliosx-vs-designs-for-vision.',
    answer: `Designs for Vision does not publish prices on its website; its representatives quote them. HeliosX publishes every price: Galilean pairs from ${from('newton')}, prismatic from ${from('kepler')}, ergonomic prismatic from ${from('apollo')}, and headlights from ${usd(lightFrom('antares'))}.`,
    tierChart: {
      title: 'Designs for Vision loupes price chart: the HeliosX match for each line',
      lead: 'Designs for Vision does not list prices, so the chart ranks the closest HeliosX pair for each DFV line by its published price. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `vs Panoramic · from ${from('newton')}`,
        galileo: `vs Panoramic · from ${from('galileo')}`,
        kepler: `vs MicroSeries · from ${from('kepler')}`,
        apollo: `ergonomic option · from ${from('apollo')}`,
        medusa: `vs MicroSeries, to 8.5x · from ${from('medusa')}`,
      }),
    },
    specTable: {
      title: 'Designs for Vision vs HeliosX, line by line',
      columns: ['Designs for Vision', 'What DFV says', 'HeliosX equivalent', 'HeliosX price (USD)'],
      rows: [
        ['Panoramic loupes', 'Wide-field loupes, including 3x Panoramic. Price by quote', 'Galileo or Newton', `${range('galileo')} / ${range('newton')}`],
        ['MicroSeries', 'Higher-magnification loupes. Price by quote', 'Kepler (4x–6x); Medusa to 8.5x', `${range('kepler')} / ${range('medusa')}`],
        ['HDi headlights', 'Headlights, including H-TwinBeam HDi. Price by quote', 'Antares, Arcturus, Canopus headlights', `${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}`],
      ],
      note: `Designs for Vision: designsforvision.com lists Panoramic loupes, MicroSeries, Flair Titanium, SteamVUE and Icon frames, and HDi headlights, with no prices. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: which HeliosX pair matches your DFV quote?',
      rows: [
        { task: 'Quoted for Panoramic, general dentistry', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Student or first pair', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'Quoted for MicroSeries, 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Posture is why you are buying', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Quoted for an HDi headlight', picks: [{ label: 'HeliosX headlights', href: '/dental-headlights' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published, ${from('newton')}–${top('medusa')}, shipping included`, other: 'Not published; quoted by a representative' },
      { feature: 'Ergonomic optics', heliosx: 'Apollo and Medusa, 3.0x–8.5x', other: 'Ask your representative' },
      { feature: 'Headlights', heliosx: `From ${usd(lightFrom('antares'))}, published`, other: 'HDi headlights, by quote' },
      { feature: 'Returns', heliosx: '30 days on non-prescription pairs', other: 'Ask your representative' },
    ],
    verdict: 'Choose Designs for Vision if you want to buy through a representative who visits you, or you prefer its frames. Choose HeliosX if you want every price before you commit, ergonomic optics to 8.5x, and custom fitting done remotely.',
    items: {
      title: 'Designs for Vision loupe lines and the HeliosX pair for each, with prices',
      entries: [
        loupeEntry('galileo', [
          `For a Panoramic quote. Galileo is a wide-field Galilean pair, 150–170 mm at 2.5x, the widest in the HeliosX range, at ${range('galileo')} with six frame styles included.`,
          `It goes from 2.5x to 3.5x. Prescription lenses add ${usd(PRESCRIPTION_PRICE)}, and a light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with the loupes.`,
        ], ['General dentistry', 'Wide field'], { text: `Add a light and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off with the loupes.`, label: 'Build Galileo', href: '/product/galileo' }),
        loupeEntry('newton', [
          `The lowest-cost custom pair we make, ${range('newton')}, for students and first-time buyers.`,
          'It is lighter, at 40–50 g with frame, with a narrower field than Galileo: 80–120 mm at 2.5x.',
        ], ['Students', 'First pair']),
        loupeEntry('kepler', [
          `For a MicroSeries quote at 4x–6x. Kepler is ${usd(price('kepler', '4.0x'))} at 4x, ${usd(price('kepler', '5.0x'))} at 5x and ${usd(price('kepler', '6.0x'))} at 6x, with an 80 mm depth of field.`,
          'It weighs 68–85 g with frame and uses conventional prismatic optics. For a more upright head, compare Apollo or Medusa.',
        ], ['Endodontics', 'Microsurgery']),
        loupeEntry('apollo', [
          `If posture is the reason you are buying, Apollo angles the optics so your head stays more upright, ${range('apollo')}, at 55–58 g with frame.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order.',
        ], ['Posture', 'Long cases']),
        loupeEntry('medusa', [
          `Ergonomic optics up to 8.5x with a working distance you adjust from 300 to 600 mm, ${range('medusa')}.`,
          'At each magnification Apollo also offers, Medusa costs the same or less.',
        ], ['Sit and stand', 'Up to 8.5x']),
      ],
    },
    tips: {
      title: 'Tips for comparing a Designs for Vision quote',
      items: [
        { title: 'Ask for an itemized quote.', body: 'Loupes, frame, headlight, battery and prescription, each with its price.' },
        { title: 'Price the headlight separately.', body: `A headlight can be a large share of the total. HeliosX headlights start at ${usd(lightFrom('antares'))}.` },
        { title: 'Compare the same optics.', body: 'Panoramic against Galileo; MicroSeries against Kepler or Medusa.' },
        { title: 'Ask about returns before you order.', body: 'HeliosX non-prescription pairs can be returned within 30 days of delivery.' },
      ],
    },
    proofPoints: ['Every price published', 'Remote fitting', `${TRAINEE_PERCENT_OFF}% off for verified students`, 'Limited lifetime warranty'],
    sections: [
      section('What drives a Designs for Vision quote', 'The same choices set the price at any brand.', [
        'Optics and magnification.',
        'Frame: titanium and specialty frames cost more.',
        'A headlight, and its battery.',
        'Prescription lenses.',
      ]),
      section('Why HeliosX publishes every price', 'You should know what a pair costs before you book a demo. Every HeliosX model, light and add-on is priced on the page.', priceFacts),
    ],
    recommendedProducts: ['Galileo', 'Kepler', 'Medusa'],
    faqs: [
      faq('How much do Designs for Vision loupes cost?', 'Designs for Vision does not publish prices online; its representatives quote them, and the total depends on optics, frame, headlight and prescription.'),
      faq('What is the HeliosX equivalent of Designs for Vision Panoramic?', `Galileo, a wide-field Galilean pair at ${range('galileo')}.`),
      faq('Does HeliosX sell headlights like DFV?', `Yes. HeliosX headlights run ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))} and sit on their own headband. See /dental-headlights.`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 10. Zeiss price. Facts as on /heliosx-vs-zeiss (checked Oct 22, 2026): EyeMag Smart/Classic Galilean,
  // EyeMag Pro Keplerian 3.2x–6.0x, Pro F frame / Pro S headband; ZEISS India med-shop prices.
  {
    slug: 'zeiss-loupes-price',
    title: 'Zeiss loupes price, and prismatic optics for less',
    metaTitle: 'Zeiss Loupes Price: EyeMag Chart & Comparison | HeliosX',
    description: `ZEISS does not list US loupe prices; dealers quote them. What EyeMag costs where ZEISS does list it, and the HeliosX prismatic pair for each, from ${from('kepler')}.`,
    heroKicker: 'Zeiss price',
    why: {
      title: 'Why look at the optics before the badge',
      body: [
        'ZEISS is a byword for optical quality, and EyeMag loupes are priced to match. In the US they are sold through dealers, without a public price list, so the badge is often the first thing you weigh and the price the last.',
        'If what you want is sharp prismatic optics at a fair price, the chart below lines up each EyeMag model with the closest HeliosX pair and its published price.',
      ],
    },
    heroImage: { src: photo.kepler.src, alt: 'Zeiss loupes price comparison: HeliosX Kepler prismatic loupes', caption: `Kepler · From ${from('kepler')} USD` },
    primaryKeyword: 'zeiss loupes price',
    relatedKeywords: ['carl zeiss dental loupes price', 'zeiss eyemag pro price', 'zeiss surgical loupes price', 'zeiss loupes cost'],
    audience: 'Dentists and surgeons comparing ZEISS EyeMag loupes',
    competitorName: 'ZEISS',
    intro:
      'ZEISS makes the EyeMag range: Galilean EyeMag Smart and Classic, and prismatic EyeMag Pro on a titanium frame or a headband. There are no US prices on the ZEISS site, but the ZEISS India store lists some, which gives a reference point. Here is that reference, and the HeliosX pair for each EyeMag model with its published price. The full brand comparison is at /heliosx-vs-zeiss.',
    answer: `ZEISS does not publish US prices for EyeMag loupes; dealers quote them. The ZEISS India store lists EyeMag Pro F 3.2x at ₹1,97,000 and Pro S 4.0x at ₹2,34,000. HeliosX prismatic loupes cost ${range('kepler')} (Kepler), with ergonomic prismatic from ${from('apollo')}, all published in USD.`,
    tierChart: {
      title: 'Zeiss loupes price chart: the HeliosX match for each EyeMag model',
      lead: 'ZEISS does not list US prices, so the chart ranks the closest HeliosX pair for each EyeMag model by its published price. Tap a pair to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, {
        newton: `vs EyeMag Smart · from ${from('newton')}`,
        galileo: `vs EyeMag Smart or Classic · from ${from('galileo')}`,
        kepler: `vs EyeMag Pro · from ${from('kepler')}`,
        apollo: `ergonomic, not in EyeMag · from ${from('apollo')}`,
        medusa: `ergonomic, to 8.5x · from ${from('medusa')}`,
      }),
    },
    specTable: {
      title: 'ZEISS EyeMag vs HeliosX, model by model',
      columns: ['ZEISS model', 'What ZEISS lists', 'HeliosX equivalent', 'HeliosX price (USD)'],
      rows: [
        ['EyeMag Smart / Classic', 'Galilean optics. No US price', 'Galileo or Newton (2.5x–3.5x)', `${range('galileo')} / ${range('newton')}`],
        ['EyeMag Pro F (frame)', 'Keplerian, 3.2x–6.0x. India store: 3.2x at 500 mm, ₹1,97,000', 'Kepler (4x–6x)', range('kepler')],
        ['EyeMag Pro S (headband)', 'Keplerian, 3.2x–6.0x. India store: 4.0x at 500 mm, ₹2,34,000', 'Kepler, or Medusa for an adjustable distance', `${range('kepler')} / ${range('medusa')}`],
        ['No ergonomic line', '—', 'Apollo or Medusa', `${range('apollo')} / ${range('medusa')}`],
      ],
      note: 'ZEISS: zeiss.com EyeMag medical loupes page; prices from the ZEISS India med-shop, in Indian rupees, as cited on /heliosx-vs-zeiss. Checked October 22, 2026. Retailers list a 2-year warranty for EyeMag.',
    },
    quickPicks: {
      title: 'Quick picks: which HeliosX pair matches the EyeMag you were looking at?',
      rows: [
        { task: 'EyeMag Pro, prismatic at 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'EyeMag Pro, but you want a more upright head', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'EyeMag Smart or Classic, Galilean', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Price', heliosx: `Published in USD, ${from('newton')}–${top('medusa')}`, other: 'No US prices; dealer quote' },
      { feature: 'Prismatic range', heliosx: 'Kepler 4x–6x; Apollo 3x–6x; Medusa 3x–8.5x', other: 'EyeMag Pro 3.2x–6.0x' },
      { feature: 'Working distance', heliosx: 'Built to your measurement; Medusa adjusts from 300 to 600 mm', other: 'EyeMag Pro: fixed options from 300 to 500 mm' },
      { feature: 'Warranty', heliosx: 'Limited lifetime warranty', other: 'Retailers list 2 years' },
    ],
    verdict: `Choose ZEISS if the ZEISS name and its dealer network matter to you, or you want 3.2x in a prismatic loupe. Choose HeliosX if you want prismatic optics with a published price, from ${from('kepler')}, an ergonomic option to 8.5x, and a lifetime warranty.`,
    items: {
      title: 'ZEISS EyeMag models and the HeliosX pair for each, with prices',
      entries: [
        loupeEntry('kepler', [
          `The closest match for EyeMag Pro at 4x–6x: ${usd(price('kepler', '4.0x'))} at 4x, ${usd(price('kepler', '5.0x'))} at 5x and ${usd(price('kepler', '6.0x'))} at 6x, with a 60–75 mm field at 4x and an 80 mm depth of field.`,
          'It is built to your working distance within one of four ranges between 280 and 600 mm. It does not come in 3.2x; for 3x prismatic, look at Apollo or Medusa.',
        ], ['Endodontics', 'Prosthodontics', 'Microsurgery'], { text: `Adding a light? It is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`, label: 'Build Kepler', href: '/product/kepler' }),
        loupeEntry('apollo', [
          `EyeMag has no separate ergonomic line. Apollo angles the optics so your head stays more upright, from ${usd(price('apollo', '3.0x'))} at 3.0x to ${usd(price('apollo', '6.0x'))} at 6.0x.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order.',
        ], ['Posture', 'One working posture']),
        loupeEntry('medusa', [
          `Ergonomic prismatic optics from 3.0x to 8.5x, with a working distance you adjust from 300 to 600 mm, ${range('medusa')}.`,
          'Against EyeMag Pro’s fixed distance options, Medusa lets one pair work seated and standing.',
        ], ['Sit and stand', 'Up to 8.5x']),
        loupeEntry('galileo', [
          `For EyeMag Smart or Classic buyers at 2.5x–3.5x, Galileo is ${range('galileo')} with a 150–170 mm field of view at 2.5x.`,
          'Six frame styles are included, and it is built to your measurements.',
        ], ['General dentistry', 'Wide field']),
        loupeEntry('newton', [
          `The lowest-cost custom pair we make, ${range('newton')}, at 40–50 g with frame.`,
          'A narrower field than Galileo, 80–120 mm at 2.5x, with fewer frames.',
        ], ['Students', 'First pair']),
      ],
    },
    tips: {
      title: 'Tips for comparing a ZEISS quote',
      items: [
        { title: 'Compare optics, not names.', body: 'EyeMag Pro is prismatic: compare it with Kepler, Apollo or Medusa, not a Galilean pair.' },
        { title: 'Check the working distance options.', body: 'EyeMag Pro pairs magnification with fixed distances. Medusa adjusts from 300 to 600 mm.' },
        { title: 'Ask whether the light is included.', body: `HeliosX lights start at ${usd(lightFrom('polaris'))} and are ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.` },
        { title: 'Compare warranties.', body: 'Retailers list 2 years for EyeMag; HeliosX loupes have a limited lifetime warranty.' },
      ],
    },
    proofPoints: ['Every price published', `Prismatic from ${from('kepler')}`, 'Limited lifetime warranty', 'Remote fitting'],
    sections: [
      section('Why HeliosX publishes every price', 'Premium optics should not need a quote to price. Every HeliosX model, light and add-on is priced on the page.', priceFacts),
    ],
    recommendedProducts: ['Kepler', 'Medusa', 'Apollo'],
    faqs: [
      faq('How much do ZEISS loupes cost?', 'ZEISS does not publish US prices; dealers quote them. The ZEISS India store lists EyeMag Pro F 3.2x at ₹1,97,000 and Pro S 4.0x at ₹2,34,000.'),
      faq('What is a lower-cost alternative to ZEISS EyeMag Pro?', `HeliosX Kepler, a prismatic loupe at ${range('kepler')}, or Apollo and Medusa for ergonomic prismatic optics from ${from('apollo')}.`),
      faq('Does HeliosX make a 3.2x prismatic loupe?', 'Not at 3.2x. Apollo and Medusa start at 3.0x; Kepler starts at 4.0x.'),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 11. Dental headlights: "dental headlight" 100–1K/mo. Sells headlights; the lights guide compares.
  {
    slug: 'dental-headlights',
    title: 'Dental headlights for loupes and glasses: brightness chart and prices',
    metaTitle: 'Dental Headlights + Brightness Chart & Prices | HeliosX',
    description: `HeliosX dental headlights, ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}: brightness, weight, battery life and spot size, with every price shown. Work with any loupes or glasses.`,
    heroKicker: 'Dental headlights',
    why: {
      title: 'Why choose a headlight instead of a loupe light',
      body: [
        'A headlight sits on its own band, not on your loupes. Nothing is mounted on the frame, so it works with any loupes, with plain glasses, or with no eyewear at all, and you can move it between pairs.',
        'The trade-off is weight on your head instead of on your nose: 164–231 g on a padded band, against 10–12 g for a light clipped to the frame. The chart below shows how bright each one is, how long it runs and what it costs.',
      ],
    },
    heroImage: { src: photo.canopus.src, alt: 'Dental headlights: HeliosX Canopus headlight on a single padded band', caption: `Canopus · ${usd(lightFrom('canopus'))} USD` },
    primaryKeyword: 'dental headlight',
    relatedKeywords: ['dental led headlight', 'headlight for dental hygienist', 'dental headlight for loupes', 'dental headlight for glasses', 'best dental headlight'],
    audience: 'Dentists, hygienists and surgeons buying a headlight, with or without loupes',
    intro:
      'Most people looking for a dental headlight want one of two things: light without mounting anything on their loupes, or one light that works across pairs and glasses. Here are the four HeliosX headlights, with brightness, weight, battery life and price for each. If you would rather have a light on the loupe frame, compare them at /best-dental-loupe-lights.',
    answer: `HeliosX makes four headlights: Antares (${lux('antares')}, two batteries, ${usd(lightFrom('antares'))}), Arcturus (${lux('arcturus')}, up to 12 hours, ${usd(lightFrom('arcturus'))}), Canopus (${lux('canopus')}, ${usd(lightFrom('canopus'))}) and Canopus XL (the same light with a top strap, ${usd(lightFrom('canopus-xl'))}). Each works with any loupes or glasses, and is ${LIGHT_BUNDLE_PERCENT_OFF}% off ordered with loupes.`,
    tierChart: {
      title: 'Dental headlight brightness chart',
      lead: 'From the least light to the most. Tap a headlight to jump to it.',
      scale: luxScale,
      tiers: [
        { label: '45,000 lux', note: 'Exams and general procedures', picks: [{ label: 'Antares', href: '#antares', detail: `180 g · ${usd(lightFrom('antares'))}` }] },
        { label: '150,000 lux', note: 'Long lists, up to 12 hours', picks: [{ label: 'Arcturus', href: '#arcturus', detail: `164 g · ${usd(lightFrom('arcturus'))}` }] },
        { label: '198,000 lux', note: 'The brightest HeliosX light', picks: [{ label: 'Canopus', href: '#canopus', detail: `175 g · ${usd(lightFrom('canopus'))}` }, { label: 'Canopus XL', href: '#canopus-xl', detail: `231 g · ${usd(lightFrom('canopus-xl'))}` }] },
      ],
    },
    specTable: {
      title: 'Dental headlight specs and prices',
      columns: ['Headlight', 'Brightness', 'Weight', 'Battery', 'Spot size', 'Price (USD)'],
      rows: [
        ['Antares', lux('antares'), '180 g', '5 hr, 2 batteries', '20–100 mm', usd(lightFrom('antares'))],
        ['Arcturus', lux('arcturus'), '164 g', '5–12 hr', '20–95 mm', usd(lightFrom('arcturus'))],
        ['Canopus', lux('canopus'), '175 g', '4 hr', '10–90 mm', usd(lightFrom('canopus'))],
        ['Canopus XL', lux('canopus-xl'), '231 g, with top strap', '4 hr', '10–90 mm', usd(lightFrom('canopus-xl'))],
      ],
      note: `Every headlight has an adjustable spot and a ${LIGHT_WARRANTY_YEARS}-year limited warranty. ${bundle}. All lights: /product/lights.`,
    },
    quickPicks: {
      title: 'Quick picks: what are you doing?',
      rows: [
        { task: 'Hygiene and exams, all day', picks: [{ label: 'Antares', href: '#antares' }] },
        { task: 'Long lists, longest battery', picks: [{ label: 'Arcturus', href: '#arcturus' }] },
        { task: 'Oral surgery, deep cavities, most light', picks: [{ label: 'Canopus', href: '#canopus' }] },
        { task: 'Long cases where the band must not move', picks: [{ label: 'Canopus XL', href: '#canopus-xl' }] },
        { task: 'You would rather have a light on the loupe', picks: [{ label: 'Loupe lights', href: '/best-dental-loupe-lights' }] },
        { task: 'Buying for surgery, not dentistry', picks: [{ label: 'Surgical headlights', href: '/surgical-headlights' }] },
      ],
    },
    items: {
      title: 'Types of dental headlights, and what each is best for',
      entries: [
        lightEntry('antares', 'Antares', [
          `The lowest-cost HeliosX headlight, ${usd(lightFrom('antares'))}, with ${lux('antares')}. Two batteries ship with it, about 5 hours each, so one is always charging.`,
          'It is the least bright of the four, which suits exams, hygiene and general work, not deep surgical fields. At 180 g it uses a headband with a top strap.',
        ], ['Hygiene', 'Exams', 'Two batteries']),
        lightEntry('arcturus', 'Arcturus', [
          `Our lightest headlight at 164 g, with ${lux('arcturus')} and 5 to 12 hours on a charge. It sits on a single padded band.`,
          'It costs more than Canopus and is less bright; you are paying for the lower weight and the longer battery.',
        ], ['Long lists', 'Lightest headlight'], { text: `Ordering loupes too? The headlight is ${LIGHT_BUNDLE_PERCENT_OFF}% off with them.`, label: 'Build Galileo', href: '/product/galileo' }),
        lightEntry('canopus', 'Canopus', [
          `The brightest light we make, ${lux('canopus')}, with the tightest spot, down to 10 mm. It sits on a single padded band at 175 g, for ${usd(lightFrom('canopus'))}.`,
          'The battery runs about 4 hours, so it suits procedures more than a full day. Its color temperature is cooler, 5,500–6,500 K.',
        ], ['Oral surgery', 'Deep fields', 'Most light']),
        lightEntry('canopus-xl', 'Canopus XL', [
          'The same light as Canopus, on a headband with a strap over the top, so it stays put on long cases.',
          `The strap adds weight: 231 g against 175 g. It costs ${usd(lightFrom('canopus-xl'))}.`,
        ], ['Long cases', 'Surgery']),
      ],
    },
    tips: {
      title: 'Tips for choosing a dental headlight',
      items: [
        { title: 'Choose by brightness first.', body: 'Exams and hygiene need far less light than oral surgery or deep fields.' },
        { title: 'Check battery life against your day.', body: 'Arcturus runs up to 12 hours; Antares swaps two 5-hour batteries; Canopus runs about 4 hours.' },
        { title: 'Think about the band.', body: 'A single padded band is lighter; a top strap holds steadier on long cases.' },
        { title: 'Order it with loupes if you can.', body: `It is ${LIGHT_BUNDLE_PERCENT_OFF}% off that way.` },
      ],
    },
    proofPoints: ['Every price published', 'Works with any loupes or glasses', `${LIGHT_WARRANTY_YEARS}-year limited warranty`, `${bundle}`],
    sections: [
      section('Headlight or loupe light?', 'A light clipped to the loupe frame weighs 10–12 g and always points where you look, but it needs a mount that fits your frame. A headlight needs no mount and works with any eyewear, but weighs 164–231 g on your head. If you wear HeliosX loupes all day, a frame light is usually the lighter choice; if you switch between pairs, or wear glasses, a headlight is simpler.'),
      section('If the light is not right', returns),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Kepler'],
    faqs: [
      faq('Do HeliosX headlights work with other brands’ loupes?', 'Yes. The headlight sits on its own band, so it works with any loupes, with glasses or with no eyewear.'),
      faq('What is the brightest HeliosX headlight?', `Canopus and Canopus XL, at ${lux('canopus')}.`),
      faq('Which headlight is best for a hygienist?', `Antares: ${lux('antares')}, two batteries of about 5 hours each, ${usd(lightFrom('antares'))}. If weight matters more, Arcturus is 164 g.`),
      faq('How long do the batteries last?', 'Antares about 5 hours per battery, with two batteries; Arcturus 5–12 hours; Canopus and Canopus XL about 4 hours.'),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 11b. Surgical headlights (2026-11-23): "surgical headlight", "surgical headlamp", "surgeon headlight",
  // "ENT headlight" are each 100–1K/mo in Keyword Planner, and no page targeted them (965 GSC impressions
  // over 90 days for headlight searches, spread across 8 pages, 1 click). Same buyer format as /dental-headlights
  // and /ronin-headlight-alternative. Facts only from lib/lights.ts; RONIN figures as on the RONIN page (checked Oct 29).
  {
    slug: 'surgical-headlights',
    title: 'Surgical headlights: brightness chart, battery life and prices',
    metaTitle: `Surgical Headlights, Every Price Shown, From ${usd(lightFrom('antares'))} | HeliosX`,
    description: `Surgical headlights with every price published, ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, no quote or sales call: up to ${lux('canopus')}, battery on the band, ${LIGHT_WARRANTY_YEARS}-year warranty. Brightness chart and brand comparison.`,
    heroKicker: 'Surgical headlights',
    why: {
      title: 'Why surgeons choose a headlight, and why ours has a price on it',
      body: [
        'Overhead lights are aimed at the table, not at where you are looking. When you lean in, change angle or work in a deep or narrow field, your head and hands shade the site. A headlight sends the light along your line of sight, so the field stays lit wherever you turn.',
        'Every HeliosX headlight carries its battery on the band. There is no cable to a pack at your hip and nothing to clip under a gown. It works with any loupes, with glasses, or with no eyewear at all.',
        'Most surgical headlight makers do not show a price. You fill in a form, wait for a rep and get a quote. HeliosX sells direct, so every headlight below has its price on the page, the same price for every surgeon, and you can order it today.',
      ],
    },
    heroImage: { src: photo.canopus.src, alt: 'Surgical headlight: HeliosX Canopus, 198,000 lux, on a single padded band', caption: `Canopus · ${usd(lightFrom('canopus'))} USD` },
    primaryKeyword: 'surgical headlight',
    relatedKeywords: ['surgical headlamp', 'surgical head lamp', 'surgeon headlight', 'ent headlight', 'surgical loupes with headlight', 'cordless surgical headlight', 'led surgical headlight', 'best surgical headlight', 'surgical headlight price', 'brightest surgical headlight'],
    audience: 'Surgeons, residents and ENT, plastic, general and oral surgeons buying a headlight, with or without loupes',
    intro:
      'Surgical headlights range from a few hundred dollars to several thousand. Price mostly follows peak brightness, the battery setup and the warranty. Here are the four HeliosX headlights for surgery, with brightness, weight, battery life, spot size and price for each. Compared with the RONIN X7: /ronin-headlight-alternative.',
    answer: `HeliosX makes four surgical headlights, ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, each with its battery on the band and an adjustable spot. Canopus is the brightest at ${lux('canopus')}, for ${usd(lightFrom('canopus'))}; Canopus XL is the same light with a strap over the top for long cases, ${usd(lightFrom('canopus-xl'))}; Arcturus is the lightest at 164 g and runs up to 12 hours, ${usd(lightFrom('arcturus'))}; Antares ships with two batteries, ${usd(lightFrom('antares'))}. Each has a ${LIGHT_WARRANTY_YEARS}-year limited warranty and is ${LIGHT_BUNDLE_PERCENT_OFF}% off ordered with loupes.`,
    tierChart: {
      title: 'Surgical headlight brightness chart',
      lead: 'From the least light to the most. Tap a headlight to jump to it.',
      scale: luxScale,
      tiers: [
        { label: '45,000 lux', note: 'Minor procedures and exams', picks: [{ label: 'Antares', href: '#antares', detail: `180 g · ${usd(lightFrom('antares'))}` }] },
        { label: '150,000 lux', note: 'Long lists, up to 12 hours', picks: [{ label: 'Arcturus', href: '#arcturus', detail: `164 g · ${usd(lightFrom('arcturus'))}` }] },
        { label: '198,000 lux', note: 'Deep or narrow fields', picks: [{ label: 'Canopus', href: '#canopus', detail: `175 g · ${usd(lightFrom('canopus'))}` }, { label: 'Canopus XL', href: '#canopus-xl', detail: `231 g · ${usd(lightFrom('canopus-xl'))}` }] },
      ],
    },
    specTable: {
      title: 'Surgical headlight specs and prices',
      columns: ['Headlight', 'Brightness', 'Weight with battery', 'Battery', 'Spot size', 'Color temperature', 'Band', 'Price (USD)'],
      rows: [
        ['Antares', lux('antares'), '180 g', '5 hr, 2 batteries', '20–100 mm', '4,500–5,500 K', 'Headband with top strap', usd(lightFrom('antares'))],
        ['Arcturus', lux('arcturus'), '164 g', '5–12 hr', '20–95 mm', '4,500–5,500 K', 'Single padded band', usd(lightFrom('arcturus'))],
        ['Canopus', lux('canopus'), '175 g', '4 hr', '10–90 mm', '5,500–6,500 K', 'Single padded band', usd(lightFrom('canopus'))],
        ['Canopus XL', lux('canopus-xl'), '231 g', '4 hr', '10–90 mm', '5,500–6,500 K', 'Headband with top strap', usd(lightFrom('canopus-xl'))],
      ],
      note: `Every battery charges in about 4 hours. ${LIGHT_WARRANTY_YEARS}-year limited warranty on the light head, LEDs and mount. ${bundle}. All lights: /product/lights.`,
    },
    quickPicks: {
      title: 'Quick picks: what kind of surgery?',
      rows: [
        { task: 'Deep or narrow fields: ENT, oral, plastic', picks: [{ label: 'Canopus', href: '#canopus' }] },
        { task: 'Long cases where the band must not move', picks: [{ label: 'Canopus XL', href: '#canopus-xl' }] },
        { task: 'Long lists, lightest on the head', picks: [{ label: 'Arcturus', href: '#arcturus' }] },
        { task: 'Minor procedures, clinic and exams', picks: [{ label: 'Antares', href: '#antares' }] },
        { task: 'You would rather have a light on your loupes', picks: [{ label: 'Surgical loupes with light', href: '/surgical-loupes-with-light' }] },
      ],
    },
    items: {
      title: 'The four HeliosX surgical headlights',
      entries: [
        lightEntry('canopus', 'Canopus', [
          `Our brightest light, ${lux('canopus')}, with the tightest spot, down to 10 mm, for deep or narrow fields. It sits on a single padded band at 175 g, battery included, for ${usd(lightFrom('canopus'))}.`,
          'The battery runs about 4 hours, so it suits single cases more than a full list. The light is cooler, 5,500–6,500 K.',
        ], ['Deep fields', 'Most light', 'Tightest spot']),
        lightEntry('canopus-xl', 'Canopus XL', [
          'The same light as Canopus, on a headband with a strap over the top. The extra strap holds it steady when you look down for a long case.',
          `The strap adds weight: 231 g against 175 g. It costs ${usd(lightFrom('canopus-xl'))}.`,
        ], ['Long cases', 'Steadiest fit'], { text: `Ordering loupes too? The headlight is ${LIGHT_BUNDLE_PERCENT_OFF}% off with them.`, label: 'Build Kepler', href: '/product/kepler' }),
        lightEntry('arcturus', 'Arcturus', [
          `Our lightest headlight at 164 g, with ${lux('arcturus')} and 5 to 12 hours on a charge, so one battery can cover a full list.`,
          'It costs more than Canopus and is less bright. You are paying for the lower weight and the longer battery.',
        ], ['Long lists', 'Lightest headlight']),
        lightEntry('antares', 'Antares', [
          `Our lowest-cost headlight, ${usd(lightFrom('antares'))}, with ${lux('antares')}. Two batteries ship with it, about 5 hours each, so one is always charging.`,
          'It is the least bright of the four. It suits minor procedures, clinic work and exams more than deep surgical fields.',
        ], ['Minor procedures', 'Two batteries']),
      ],
    },
    tips: {
      title: 'How to choose a surgical headlight',
      items: [
        { title: 'Match brightness to the field.', body: 'Deep or narrow cavities and higher loupe magnification need more light. Superficial and minor work needs less.' },
        { title: 'Check runtime against your longest case.', body: 'Arcturus runs up to 12 hours. Antares swaps two 5-hour batteries. Canopus runs about 4 hours.' },
        { title: 'Count total weight, not just the head unit.', body: 'Some surgical headlights put the battery at your hip on a cable. Ours carry it on the band, and the weights above include it.' },
        { title: 'Look at the spot size.', body: 'A spot that closes down to 10–20 mm keeps light in a small field without glare off the drapes.' },
        { title: 'Order it with loupes if you can.', body: `It is ${LIGHT_BUNDLE_PERCENT_OFF}% off that way.` },
      ],
    },
    proofPoints: ['Every price published, no quote', 'Sold direct, ordered online', 'Battery on the band, no hip pack', `${LIGHT_WARRANTY_YEARS}-year limited warranty`],
    sections: [
      section(
        'Surgical headlight prices: published here, quote-only elsewhere',
        'We checked the product pages of the headlights that rank for surgical headlight searches on November 23, 2026. Two publish a price. The rest ask you to request a quote or contact sales, so the price you pay depends on who is asking and what else your hospital buys.',
        [
          'STERIS MedLED Spectra: no price on the product page, "Request a quote". STERIS lists 100,000, 200,000 or 300,000 lux and 10, 8 or 5 hours with both batteries on the head strap.',
          'Stryker Qosmic: no price, a contact form for your hospital and specialty. Stryker lists 90,000+ lux at 16 inches and 4+ hours at the highest setting, with the battery pack clipped to you on a cable.',
          'Enova: prices published on its store, $1,595–$3,795 for its LED headlight systems.',
          'RONIN X7: prices published, $3,500–$5,250 by package.',
          `HeliosX: every price published, ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, ordered online, with a ${LIGHT_WARRANTY_YEARS}-year limited warranty and ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`,
        ],
      ),
      section(
        'Where HeliosX fits against hospital headlights',
        `High-output operating-room headlights such as the RONIN X7 publish more peak light: RONIN lists 350,000 lux, or 530,000 in high-intensity mode, with the battery at the hip. They cost $3,500–$5,250 with a 1-year warranty on the private-practice and resident packages (RONIN site, checked October 29, 2026). HeliosX headlights cost ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, keep the battery on the band and carry a ${LIGHT_WARRANTY_YEARS}-year warranty. If you need the very highest output, those lights are built for it. If you want a light you own outright, wear all day and can move between rooms, ours are built for that.`,
        ['Full side-by-side with the RONIN X7: /ronin-headlight-alternative.'],
      ),
      section(
        'Headlight or a light on your loupes?',
        'A light clipped to the loupe frame weighs 10–12 g and always points where you look, but it needs a mount that fits your frame. A headlight needs no mount and works with any eyewear, but weighs 164–231 g on your head. If you wear one pair of loupes all day, a frame light is usually lighter. If you switch between pairs, wear glasses, or operate without loupes, a headlight is simpler.',
        ['Loupe lights for surgery, by magnification: /surgical-loupes-with-light.', 'Headlights for dentistry and hygiene: /dental-headlights.'],
      ),
      section('If the light is not right', returns),
    ],
    recommendedProducts: ['Kepler', 'Apollo', 'Medusa'],
    faqs: [
      faq('How much does a surgical headlight cost?', `HeliosX surgical headlights cost ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, and ${LIGHT_BUNDLE_PERCENT_OFF}% less ordered with loupes. High-output operating-room headlights such as the RONIN X7 are listed at $3,500–$5,250.`),
      faq('What is the brightest HeliosX surgical headlight?', `Canopus and Canopus XL, at ${lux('canopus')}, with a spot that closes down to 10 mm.`),
      faq('Which surgical headlight is best for long cases?', 'Arcturus for the longest battery, up to 12 hours at 164 g. Canopus XL if you need the most light and a strap over the top to hold it steady.'),
      faq('Why don’t most surgical headlight brands show a price?', 'Many sell through hospital sales reps and quote each buyer separately. STERIS and Stryker, for example, ask you to request a quote or contact them. HeliosX sells direct, so the price on this page is the price you pay.'),
      faq('Do I need a quote to buy a HeliosX headlight?', `No. Every headlight is priced on the page, ${usd(lightFrom('antares'))}–${usd(lightFrom('arcturus'))}, and you can order it online.`),
      faq('Is a surgical headlamp the same as a surgical headlight?', 'Yes. Surgeons use both names for a light worn on a headband that shines along the line of sight.'),
      faq('Do HeliosX headlights work with other brands’ loupes or with glasses?', 'Yes. The headlight sits on its own band, so it works with any loupes, with glasses or with no eyewear.'),
      faq('Is there a cable or a battery pack at the hip?', 'No. Every HeliosX headlight carries its battery on the band.'),
    ],
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
  },

  // 12. Orascoptic Spark alternative: "orascoptic spark light" 100–1K/mo at $7.75.
  // Spark per orascoptic.com/en-us/spark (Nov 15): 40 lumens, 6 hr with 2 batteries, up to 2 hr charge,
  // fits "virtually any loupe or eyewear frame", no price shown.
  {
    slug: 'orascoptic-light-alternative',
    title: 'Orascoptic Spark light alternative, with prices',
    metaTitle: 'Orascoptic Spark Alternative: Light Chart & Prices | HeliosX',
    description: `An Orascoptic Spark alternative: HeliosX wireless, corded and headband lights with brightness, battery life and price, from ${usd(lightFrom('polaris'))}. Spark specs as Orascoptic lists them.`,
    heroKicker: 'Spark alternative',
    why: {
      title: 'Why compare the Spark before you order it',
      body: [
        'The Spark is Orascoptic’s cordless light, sold through dealers, and its price is not on the Orascoptic site. Its brightness is given in lumens, while most loupe lights, ours included, are rated in lux, so the two numbers cannot be compared directly.',
        'What can be compared is how each light is powered, how long it runs, what sits on the frame and what it costs. The chart below does that, with every HeliosX price shown.',
      ],
    },
    heroImage: { src: photo.nova.src, alt: 'Orascoptic Spark alternative: HeliosX Nova wireless loupe light with spare batteries', caption: `Nova wireless · ${usd(lightFrom('nova'))} USD` },
    primaryKeyword: 'orascoptic spark light',
    relatedKeywords: ['orascoptic spark alternative', 'orascoptic light', 'orascoptic spark price', 'cordless loupe light'],
    audience: 'Dentists and hygienists comparing the Orascoptic Spark with other loupe lights',
    competitorName: 'Orascoptic',
    intro:
      'If you were offered the Orascoptic Spark, you are probably after a cordless light. Here is what Orascoptic lists for the Spark, and the HeliosX lights that do the same job, wireless, corded or on a headband, with brightness, battery and price for each. For the full guide to loupe lights, see /best-dental-loupe-lights.',
    answer: `Orascoptic lists the Spark at 40 lumens, with 6 hours from 2 batteries and up to 2 hours to charge; the price comes from a dealer. The closest HeliosX light is Nova: wireless, ${lux('nova')}, three batteries of about 3 hours each, ${usd(lightFrom('nova'))}, or ${usd(bundled('nova'))} with loupes. Corded Polaris starts at ${usd(lightFrom('polaris'))}.`,
    tierChart: {
      title: 'Spark alternatives: brightness chart',
      lead: 'HeliosX lights from the least light to the most. Tap a light to jump to it. The Spark is rated in lumens, so it is not placed on this scale.',
      scale: luxScale,
      tiers: luxTiers(['polaris', 'nova', 'vega', 'arcturus'], { nova: 'Nova (wireless)', arcturus: 'Arcturus (headlight)' }),
    },
    specTable: {
      title: 'Orascoptic Spark vs HeliosX lights',
      columns: ['Light', 'Power', 'Brightness', 'Battery', 'Price (USD)'],
      rows: [
        ['Orascoptic Spark', 'Cordless', '40 lumens (Orascoptic)', '6 hr with 2 batteries; up to 2 hr charge', 'Not listed; dealer quote'],
        ['Nova (wireless)', 'Cordless, battery on the light', lux('nova'), '3 batteries, about 3 hr each', `${usd(lightFrom('nova'))}; ${usd(bundled('nova'))} with loupes`],
        ['Polaris', 'Corded, battery at waist or neck', lux('polaris'), '4, 6 or 10 hr packs', `from ${usd(lightFrom('polaris'))}`],
        ['Vega', 'Corded, battery at waist or neck', lux('vega'), '4, 6 or 10 hr packs', `from ${usd(lightFrom('vega'))}`],
        ['Arcturus (headlight)', 'Headband, no mount', lux('arcturus'), '5–12 hr', usd(lightFrom('arcturus'))],
      ],
      note: `Orascoptic Spark: orascoptic.com/en-us/spark lists 40 lumens, 6 hours with 2 batteries, up to 2 hours to charge, and fit on "virtually any loupe or eyewear frame"; no price is shown. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: why did you want the Spark?',
      rows: [
        { task: 'No cord at all', picks: [{ label: 'Nova', href: '#nova' }] },
        { task: 'The lightest thing on the frame', picks: [{ label: 'Polaris', href: '#polaris' }] },
        { task: 'Working at 4x', picks: [{ label: 'Vega', href: '#vega' }] },
        { task: 'Keeping your Orascoptic loupes', picks: [{ label: 'Arcturus headlight', href: '#arcturus' }] },
      ],
    },
    items: {
      title: 'Orascoptic Spark alternatives, and what each is best for',
      entries: [
        lightEntry('nova', 'Nova (wireless)', [
          `The closest match for the Spark: no cord, with the battery on the light. Three batteries ship with it, about 3 hours each, and each recharges in under an hour. It costs ${usd(lightFrom('nova'))}, or ${usd(bundled('nova'))} with loupes.`,
          'The trade-off is 29 g with battery at the front of the frame. Nova is made for HeliosX frames; if you are keeping Orascoptic loupes, a headlight is the simpler fit.',
        ], ['No cord', 'Hygiene', 'Moving between rooms']),
        lightEntry('polaris', 'Polaris', [
          `If weight on the frame bothers you more than a cord, Polaris puts only a 10 g head on the frame, with the battery at your waist or neck. ${lux('polaris')}, from ${usd(lightFrom('polaris'))}.`,
          'Choose the 6 or 10 hr pack to cover a full day without swapping batteries.',
        ], ['Lightest on the frame', '2.5x–3.5x']),
        lightEntry('vega', 'Vega', [
          `A step brighter for 4x work, ${lux('vega')}, at the same 10 g on the frame, from ${usd(lightFrom('vega'))}.`,
          'Like Polaris, it is corded, with the battery off the frame.',
        ], ['4x', 'Restorative']),
        lightEntry('arcturus', 'Arcturus (headlight)', [
          `If you are keeping your Orascoptic loupes, a headlight needs no mount. Arcturus gives ${lux('arcturus')} for 5 to 12 hours on a padded band, at ${usd(lightFrom('arcturus'))}.`,
          'It weighs 164 g on your head, against a few grams on the frame for a clip-on light.',
        ], ['Any loupes', 'Long lists']),
      ],
    },
    tips: {
      title: 'Tips for comparing the Spark with other lights',
      items: [
        { title: 'Do not compare lumens with lux.', body: 'Lumens measure total output; lux measures light on the field. Ask for the same unit, or compare in person.' },
        { title: 'Count the battery hours you need.', body: 'Spark lists 6 hours from 2 batteries; Nova ships 3 batteries of about 3 hours each.' },
        { title: 'Check what fits your frame.', body: 'A mount made for one brand rarely fits another. A headlight fits any frame.' },
        { title: 'Ask for the Spark price in writing.', body: `It is not on Orascoptic’s site. HeliosX lights are listed from ${usd(lightFrom('polaris'))}.` },
      ],
    },
    proofPoints: ['Every light price published', `${bundle}`, `${LIGHT_WARRANTY_YEARS}-year limited warranty`],
    sections: [
      section('Will a HeliosX light fit Orascoptic loupes?', 'Frame-mounted HeliosX lights are made for HeliosX frames, and a mount made for one brand rarely transfers to another. If you are keeping Orascoptic loupes, choose a headlight, which needs no mount, or email us a photo of your frame and we will tell you honestly. If you are buying new loupes too, every HeliosX light fits every HeliosX frame. Orascoptic loupe prices are compared at /orascoptic-loupes-price.'),
      section('If the light is not right', returns),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    faqs: [
      faq('How much is the Orascoptic Spark?', 'Orascoptic does not show the Spark price on its website; dealers quote it.'),
      faq('How bright is the Orascoptic Spark?', 'Orascoptic lists it at 40 lumens. Lumens are total output, not light on the field, so the figure cannot be compared directly with lux ratings.'),
      faq('What is the best wireless alternative to the Spark?', `Within HeliosX, Nova: ${lux('nova')}, three batteries, ${usd(lightFrom('nova'))}.`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 13. LumaDent light alternative: "lumadent lights" 100–1K/mo. airLUX per lumadent.com/pages/airlux
  // (Nov 15): $695 package, 22 g, 2 batteries, 3+ hr each, 2 hr recharge; brightness stated two ways.
  // LumaDent warranty page: headlamp 2 years, battery pack and charger 1 year.
  {
    slug: 'lumadent-light-alternative',
    title: 'LumaDent light alternative: airLUX vs HeliosX, with prices',
    metaTitle: 'LumaDent Light Alternative: airLUX Chart & Prices | HeliosX',
    description: `LumaDent airLUX next to HeliosX loupe lights and headlights: brightness, weight, battery and price for each, from ${usd(lightFrom('polaris'))}. airLUX specs as LumaDent lists them.`,
    heroKicker: 'LumaDent light alternative',
    why: {
      title: 'Why compare LumaDent lights before you buy',
      body: [
        'LumaDent publishes its prices, which makes a straight comparison possible. Its airLUX wireless light is lighter than our wireless Nova and costs less, and we say so below.',
        'Where HeliosX differs is choice: corded lights from 10 g on the frame, a brighter range for higher magnification, and headlights that need no mount. The chart below puts them side by side.',
      ],
    },
    heroImage: { src: photo.polaris.src, alt: 'LumaDent light alternative: HeliosX Polaris dental loupe light with frame clip', caption: `Polaris · from ${usd(lightFrom('polaris'))} USD` },
    primaryKeyword: 'lumadent lights',
    relatedKeywords: ['lumadent light alternative', 'lumadent airlux price', 'lumadent loupe light', 'featherlight loupe light'],
    audience: 'Dentists and hygienists comparing LumaDent lights with other loupe lights',
    competitorName: 'LumaDent',
    intro:
      'LumaDent sells loupes and lights online with prices shown, including the airLUX wireless light. Here are the airLUX specs as LumaDent lists them, next to the HeliosX lights that do the same job, with brightness, weight, battery and price for each. The full guide to loupe lights is at /best-dental-loupe-lights.',
    answer: `LumaDent lists the airLUX package at $695: 22 g, two batteries of 3+ hours each, recharging in 2 hours. HeliosX Nova is wireless too, at ${lux('nova')} and 29 g with battery, with three batteries, for ${usd(lightFrom('nova'))}. If a cord is fine, Polaris puts 10 g on the frame from ${usd(lightFrom('polaris'))}.`,
    tierChart: {
      title: 'LumaDent airLUX alternatives: brightness chart',
      lead: 'HeliosX lights from the least light to the most. Tap a light to jump to it. LumaDent states airLUX brightness two different ways, so it is not placed on this scale.',
      scale: luxScale,
      tiers: luxTiers(['polaris', 'nova', 'vega', 'rigel', 'arcturus'], { nova: 'Nova (wireless)', arcturus: 'Arcturus (headlight)' }),
    },
    specTable: {
      title: 'LumaDent airLUX vs HeliosX lights',
      columns: ['Light', 'Power', 'Weight on the frame', 'Battery', 'Price (USD)'],
      rows: [
        ['LumaDent airLUX', 'Wireless', '22 g (LumaDent)', '2 batteries, 3+ hr each; 2 hr recharge', '$695 package; spare battery $150'],
        ['Nova (wireless)', 'Wireless', '29 g with battery', '3 batteries, about 3 hr each; under 1 hr charge', `${usd(lightFrom('nova'))}; ${usd(bundled('nova'))} with loupes`],
        ['Polaris', 'Corded', '10 g', '4, 6 or 10 hr packs', `from ${usd(lightFrom('polaris'))}`],
        ['Vega', 'Corded', '10 g', '4, 6 or 10 hr packs', `from ${usd(lightFrom('vega'))}`],
        ['Arcturus (headlight)', 'Headband', 'Nothing on the frame; 164 g band', '5–12 hr', usd(lightFrom('arcturus'))],
      ],
      note: `LumaDent: lumadent.com/pages/airlux lists the airLUX package at $695, 22 g, two batteries with 3+ hours each and a 2-hour recharge; the same page states brightness as both 75,000 and 21,000 lux. LumaDent’s warranty page lists 2 years on the headlamp and 1 year on the battery pack and charger. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: what matters most to you?',
      rows: [
        { task: 'No cord', picks: [{ label: 'Nova', href: '#nova' }] },
        { task: 'Least weight on the frame', picks: [{ label: 'Polaris', href: '#polaris' }] },
        { task: '4x or higher', picks: [{ label: 'Vega', href: '#vega' }, { label: 'Rigel', href: '#rigel' }] },
        { task: 'Keeping your LumaDent loupes', picks: [{ label: 'Arcturus headlight', href: '#arcturus' }] },
      ],
    },
    comparisonRows: [
      { feature: 'Prices', heliosx: `Published, lights from ${usd(lightFrom('polaris'))}`, other: 'Published; airLUX package $695' },
      { feature: 'Wireless light weight', heliosx: 'Nova, 29 g with battery', other: 'airLUX, 22 g' },
      { feature: 'Corded options', heliosx: 'Polaris to Sirius, 10–12 g on the frame', other: 'See LumaDent' },
      { feature: 'Light warranty', heliosx: `${LIGHT_WARRANTY_YEARS}-year limited warranty`, other: 'Headlamp 2 years; battery and charger 1 year' },
    ],
    verdict: 'Choose LumaDent airLUX if you want the lightest wireless light and already wear LumaDent loupes. Choose HeliosX if you want a corded light that puts only 10 g on the frame, more brightness for higher magnification, or loupes and light from one place with the light 10% off.',
    items: {
      title: 'LumaDent light alternatives, and what each is best for',
      entries: [
        lightEntry('nova', 'Nova (wireless)', [
          `HeliosX’s wireless light: ${lux('nova')}, three batteries of about 3 hours each, charging in under an hour, at ${usd(lightFrom('nova'))}, or ${usd(bundled('nova'))} with loupes.`,
          'To be straight about it: airLUX is lighter, 22 g against 29 g, and costs less. Nova gives you a third battery and faster charging.',
        ], ['No cord', 'Hygiene']),
        lightEntry('polaris', 'Polaris', [
          `If you can live with a cord, Polaris puts only 10 g on the frame, less than half of either wireless light, with ${lux('polaris')}. It starts at ${usd(lightFrom('polaris'))}.`,
          'The battery clips at your waist or neck, in 4, 6 or 10 hr packs.',
        ], ['Lightest on the frame', 'Hygiene', '2.5x–3.5x'], { text: `Ordering loupes too? The light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with them.`, label: 'Build Galileo', href: '/product/galileo' }),
        lightEntry('vega', 'Vega', [
          `For 4x: ${lux('vega')} at 10 g on the frame, from ${usd(lightFrom('vega'))}.`,
          'A tighter spot than Polaris that stays on the field at higher magnification.',
        ], ['4x', 'Restorative']),
        lightEntry('rigel', 'Rigel', [
          `For 5x–6x: ${lux('rigel')} at 11 g on the frame, from ${usd(lightFrom('rigel'))}.`,
          'At higher magnification the image gets darker, so the light needs to rise with it.',
        ], ['5x–6x', 'Endodontics']),
        lightEntry('arcturus', 'Arcturus (headlight)', [
          `If you are keeping LumaDent loupes, a headlight needs no mount: ${lux('arcturus')} for 5 to 12 hours, at ${usd(lightFrom('arcturus'))}.`,
          'It weighs 164 g on a padded band, so it suits long lists more than quick exams.',
        ], ['Any loupes', 'Long lists']),
      ],
    },
    tips: {
      title: 'Tips for choosing between LumaDent and HeliosX lights',
      items: [
        { title: 'Decide on the cord first.', body: 'Wireless puts the battery on the frame; corded keeps it at your waist.' },
        { title: 'Match brightness to magnification.', body: `${lux('polaris')} at 2.5x–3.5x, ${lux('vega')} at 4x, ${lux('rigel')} at 5x–6x.` },
        { title: 'Check what fits your frame.', body: 'A mount made for one brand rarely fits another; a headlight fits any frame.' },
        { title: 'Count spare batteries.', body: 'LumaDent lists a spare airLUX battery at $150; Nova ships with three.' },
      ],
    },
    proofPoints: ['Every light price published', `${bundle}`, `${LIGHT_WARRANTY_YEARS}-year limited warranty`],
    sections: [
      section('Will a HeliosX light fit LumaDent loupes?', 'Frame-mounted HeliosX lights are made for HeliosX frames, and a mount made for one brand rarely transfers to another. If you are keeping LumaDent loupes, a headlight needs no mount; or email us a photo of your frame and we will tell you honestly. LumaDent loupes are compared at /lumadent-alternatives.'),
      section('If the light is not right', returns),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Kepler'],
    faqs: [
      faq('How much is the LumaDent airLUX?', 'LumaDent lists the airLUX headlight package at $695, with a spare battery at $150.'),
      faq('Is the airLUX lighter than Nova?', 'Yes. LumaDent lists airLUX at 22 g; Nova is 29 g with battery. A corded Polaris is lighter than both on the frame, at 10 g.'),
      faq('Which HeliosX light is the best LumaDent alternative?', `Nova if you want wireless (${usd(lightFrom('nova'))}); Polaris if you want the least weight on the frame (from ${usd(lightFrom('polaris'))}).`),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 14. Australia: "best dental loupes australia" 373 impressions at 30.5.
  // GST: ATO / ABF. Consignments over A$1,000 go through formal import; GST, duty and charges at the border.
  {
    slug: 'dental-loupes-australia',
    title: 'Dental loupes in Australia: prices, delivery and import costs',
    metaTitle: 'Dental Loupes Australia: Price Chart & Delivery | HeliosX',
    description: `Custom dental loupes delivered to Australia from ${from('newton')} USD with shipping included. Prices, GST and import costs, delivery times and warranty, with every price shown.`,
    heroKicker: 'Dental loupes Australia',
    why: {
      title: 'Why the total matters more than the sticker price in Australia',
      body: [
        'Buying loupes from overseas can make sense for Australian dentists and hygienists, but only if you know the full landed cost before you order: the price, shipping, GST and any import charges.',
        'This page shows every HeliosX price in US dollars, what shipping covers, and how GST and import charges work for a pair of loupes, so you can work out the total before you order.',
      ],
    },
    heroImage: { src: photo.galileo.src, alt: 'Dental loupes Australia: HeliosX Galileo custom loupes', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'dental loupes australia',
    relatedKeywords: ['best dental loupes australia', 'buy dental loupes australia', 'surgical loupes australia', 'dental loupes price australia'],
    audience: 'Dentists, hygienists, dental students and surgeons in Australia',
    intro:
      'HeliosX builds every pair to your measurements and ships to Australia, with standard shipping included in the price. Prices are in US dollars and your card converts them. Here is what each model costs, how GST and import charges apply to an order of this size, and how delivery, returns and warranty work from Australia. More on shipping worldwide at /surgical-loupes-international-shipping.',
    answer: `HeliosX loupes cost ${from('newton')}–${top('medusa')} USD with shipping to Australia included. Because most pairs come to more than A$1,000, they go through a formal import, and you pay 10% GST plus any duty and clearance charges at the border, per the ATO. ${leadTime}`,
    tierChart: {
      title: 'Dental loupes price chart for Australian buyers',
      lead: 'Prices in USD, shipping to Australia included. Tap a model to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels),
    },
    specTable: {
      title: 'What you pay for loupes delivered to Australia',
      columns: ['Cost', 'How it works', 'Amount'],
      rows: [
        ['Loupes', 'Published USD price; your card converts to AUD', `${from('newton')}–${top('medusa')} USD`],
        ['Shipping', 'Standard shipping included in the price', 'Included'],
        ['GST', 'For a consignment over A$1,000, charged at the border on import', '10%'],
        ['Duty and clearance', 'Assessed by Australian Border Force on formal import', 'Depends on the goods; check with ABF'],
        ['Prescription lenses', 'Optional', `${usd(PRESCRIPTION_PRICE)} USD`],
      ],
      note: 'GST on imports: Australian Taxation Office, "GST on low value imported goods", and Australian Border Force guidance on consignments over A$1,000. Your card issuer sets the exchange rate and any foreign transaction fee. Checked November 15, 2026.',
    },
    quickPicks: {
      title: 'Quick picks: which pair for Australian practice?',
      rows: [
        { task: 'Dental or hygiene student', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'General dentist or hygienist, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Endodontics or prosthodontics, 4x–6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Posture first, long days', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'Dental loupes for Australian buyers, and what each is best for',
      entries: [
        loupeEntry('newton', [
          `The lowest-cost custom pair, ${range('newton')} USD, for dental and hygiene students. Verified students get ${TRAINEE_PERCENT_OFF}% off.`,
          'It weighs 40–50 g with frame. Against Galileo you give up frame choice and field of view: 80–120 mm at 2.5x.',
        ], ['Students', 'Hygiene']),
        loupeEntry('galileo', [
          `The everyday pair for general dentists and hygienists, ${range('galileo')} USD, with the widest field in the range: 150–170 mm at 2.5x.`,
          `Six frame styles are included. Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off, in the same shipment.`,
        ], ['General dentistry', 'Hygiene'], { text: 'Add a light now and it ships in the same box, with one import.', label: 'Build Galileo', href: '/product/galileo' }),
        loupeEntry('kepler', [
          `For endodontics and prosthodontics at 4x–6x, ${range('kepler')} USD, with an 80 mm depth of field.`,
          'It weighs 68–85 g with frame. For a more upright head, compare Apollo or Medusa.',
        ], ['Endodontics', 'Prosthodontics']),
        loupeEntry('apollo', [
          `Angled optics so your head stays more upright, ${range('apollo')} USD, at 55–58 g with frame.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order.',
        ], ['Posture', 'One working posture']),
        loupeEntry('medusa', [
          `Ergonomic optics with a working distance you adjust from 300 to 600 mm, ${range('medusa')} USD, up to 8.5x.`,
          'Useful if you are not sure of your working distance, because you can adjust it after it arrives.',
        ], ['Sit and stand', 'Up to 8.5x']),
      ],
    },
    tips: {
      title: 'Tips for buying loupes from overseas in Australia',
      items: [
        { title: 'Budget for GST.', body: 'Add 10% for GST on top of the converted price, plus any duty and clearance charges.' },
        { title: 'Ship loupes and light together.', body: 'One order means one import, and the light is 10% off with loupes.' },
        { title: 'Check your card’s foreign transaction fee.', body: 'Prices are in USD; your card issuer sets the rate and any fee.' },
        { title: 'Measure before you order.', body: 'A remote fit only works with good measurements. The guide is at /measurements.' },
      ],
    },
    proofPoints: ['Ships to Australia, shipping included', 'Every price published', 'Limited lifetime warranty, wherever you are', `${TRAINEE_PERCENT_OFF}% off for verified students`],
    sections: [
      section('Delivery to Australia', `${leadTime} Shipping time begins after production and depends on the carrier and customs processing. You receive tracking by email when it ships; see /shipping.`),
      section('Returns and warranty from Australia', `${returns} The limited lifetime warranty runs from the delivery date, wherever you are.`),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Kepler'],
    faqs: [
      faq('Do I pay GST on loupes ordered from overseas?', 'Yes. GST applies to imported goods. For a consignment over A$1,000, which most pairs are, GST, any duty and clearance charges are paid at the border on import, per the ATO.'),
      faq('Does HeliosX ship to Australia?', 'Yes, with standard shipping included in the listed USD price.'),
      faq('What are the best dental loupes for an Australian dentist?', `It depends on your work: Galileo (${range('galileo')} USD) for general dentistry, Kepler for 4x–6x, and Apollo or Medusa if posture is the priority.`),
      faq('Is the warranty valid in Australia?', 'Yes. The limited lifetime warranty runs from the delivery date, wherever you are.'),
    ],
    datePublished: published2,
    dateModified: published2,
  },

  // 15. Payment plans: conversion page; real plans come from Stripe (Klarna, Affirm) at checkout.
  {
    slug: 'loupes-payment-plans',
    title: 'Loupes on a payment plan: monthly cost by model',
    metaTitle: 'Loupes Payment Plans: Monthly Cost Chart | HeliosX',
    description: `Pay for surgical and dental loupes over time with Klarna or Affirm. Monthly cost by model, from ${perMonth(price('newton', '2.5x'))} a month on a 12-month 0% plan, and how checkout works.`,
    heroKicker: 'Payment plans',
    why: {
      title: 'Why a payment plan changes the decision',
      body: [
        'For many residents, students and hygienists, the problem with good loupes is not the price, it is paying it all at once. That is often why people wait, borrow a pair or buy the cheapest one they can find.',
        'Splitting the cost into monthly payments removes that wait. The chart below shows what each model works out to per month, and how to see your real plan before you commit.',
      ],
    },
    heroImage: { src: photo.apollo.src, alt: 'Loupes payment plans: HeliosX Apollo ergonomic loupes', caption: `Apollo · From ${from('apollo')} USD` },
    primaryKeyword: 'loupes payment plan',
    relatedKeywords: ['loupes financing', 'dental loupes payment plan', 'surgical loupes financing', 'klarna loupes', 'affirm loupes'],
    audience: 'Residents, students, hygienists and clinicians who want to pay for loupes over time',
    intro:
      'HeliosX offers Klarna and Affirm at checkout, through Stripe, where available. You choose either one at the payment step, see the plans offered for your total, and confirm only if they suit you. Here is what each model works out to per month, so you can plan before you start.',
    answer: `You can pay for HeliosX loupes over time with Klarna or Affirm at checkout. On a 12-month plan at 0% APR, Newton works out to ${perMonth(price('newton', '2.5x'))} a month and Apollo to ${perMonth(price('apollo', '3.0x'))}. Your actual plan, term and rate, from 0 to 36% APR, are set by Klarna or Affirm on approval.`,
    tierChart: {
      title: 'Loupes monthly cost chart',
      lead: 'Each model’s lowest price split evenly over 12 months, as if at 0% APR. Your real plan may differ. Tap a model to jump to it.',
      scale: priceScale,
      tiers: priceTiers(allModels, Object.fromEntries(allModels.map((m) => [m, `${perMonth(Math.min(...prices(m)))}/mo · ${from(m)}`]))),
    },
    specTable: {
      title: 'Monthly cost by model and plan length',
      lead: 'Lowest price for each model, split evenly. Illustrative only: interest, if any, is added by the lender.',
      columns: ['Model', 'Price', '6 months', '12 months', '24 months'],
      rows: allModels.map((m) => {
        const p = Math.min(...prices(m))
        return [modelName(m), usd(p), perMonth(p, 6), perMonth(p, 12), perMonth(p, 24)]
      }),
      note: 'Plans, terms and rates are set by Klarna or Affirm, depend on approval, and are shown before you confirm. Example figures exclude tax and interest.',
    },
    quickPicks: {
      title: 'Quick picks: what fits your monthly budget?',
      rows: [
        { task: 'Under $60 a month over 12 months', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'Around $70 a month', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Around $100 a month', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Around $140 a month, posture first', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'Loupes you can pay for over time, and what each is best for',
      entries: [
        loupeEntry('newton', [
          `${range('newton')}, or ${perMonth(price('newton', '2.5x'))} a month over 12 months at 0%. The lowest-cost custom pair, for students and first pairs.`,
          `Verified students get ${TRAINEE_PERCENT_OFF}% off before the plan is calculated, which lowers every payment.`,
        ], ['Students', 'Hygiene']),
        loupeEntry('galileo', [
          `${range('galileo')}, or ${perMonth(price('galileo', '2.5x'))} a month over 12 months at 0%. The everyday pair for dentists, hygienists and general surgeons, with the widest field in the range.`,
          `Add a light and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off; the plan covers the whole order.`,
        ], ['General dentistry', 'Hygiene'], { text: 'One plan can cover loupes, light and prescription together.', label: 'Build Galileo', href: '/product/galileo' }),
        loupeEntry('kepler', [
          `${range('kepler')}, or ${perMonth(price('kepler', '4.0x'))} a month over 12 months at 0%. Prismatic optics for 4x–6x.`,
          'Heavier than a Galilean pair, at 68–85 g with frame.',
        ], ['Endodontics', 'Microsurgery']),
        loupeEntry('apollo', [
          `${range('apollo')}, or ${perMonth(price('apollo', '3.0x'))} a month over 12 months at 0%. Ergonomic optics so your head stays more upright.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order.',
        ], ['Posture', 'Residents']),
        loupeEntry('medusa', [
          `${range('medusa')}, or ${perMonth(price('medusa', '3.0x'))} a month over 12 months at 0%. Ergonomic optics with a working distance you adjust from 300 to 600 mm.`,
          'At each magnification Apollo also offers, Medusa costs the same or less.',
        ], ['Sit and stand', 'Up to 8.5x']),
      ],
    },
    tips: {
      title: 'Tips for paying for loupes over time',
      items: [
        { title: 'Check the APR before you confirm.', body: 'Rates run from 0 to 36% APR depending on approval. Look for a 0% plan if one is offered.' },
        { title: 'Apply discounts first.', body: `The ${TRAINEE_PERCENT_OFF}% student discount and the ${LIGHT_BUNDLE_PERCENT_OFF}% light bundle lower the amount you finance.` },
        { title: 'Put everything in one order.', body: 'Loupes, light and prescription on one plan are easier to track than several.' },
        { title: 'See your real plan first.', body: 'The cart shows example plans for your total before you reach the payment step.' },
      ],
    },
    proofPoints: ['Klarna and Affirm at checkout', 'Every price published', `${TRAINEE_PERCENT_OFF}% off for verified students`, 'Shipping included'],
    sections: [
      section('How paying over time works at checkout', 'Payment runs through Stripe. Nothing is made until we have checked your measurements with you.', [
        'Build your pair and add it to the cart. The cart shows example Klarna and Affirm plans for your total.',
        'At the payment step, choose Klarna or Affirm.',
        'The lender shows the plans you are approved for, with the rate and monthly amount, before you confirm.',
        'After checkout, send your measurements. A specialist reviews them before production.',
      ]),
      section('Returns on a payment plan', `${returns} If you return a pair, the refund goes back through Klarna or Affirm.`),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Newton'],
    faqs: [
      faq('Can I pay for loupes in installments?', 'Yes. Klarna and Affirm are offered at checkout through Stripe where available.'),
      faq('Is there interest on a loupes payment plan?', 'It depends on the plan you are approved for. Rates run from 0 to 36% APR and are shown before you confirm.'),
      faq('Can students use a payment plan and the student discount together?', `Yes. The ${TRAINEE_PERCENT_OFF}% discount is applied at checkout, and the plan covers the discounted total.`),
      faq('Do payment plans cover lights and prescription lenses?', 'Yes. The plan covers the whole order total.'),
    ],
    datePublished: published2,
    dateModified: published2,
  },
]
