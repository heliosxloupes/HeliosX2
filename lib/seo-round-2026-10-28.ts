import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { LIGHTS, lightFrom } from './lights'
import {
  LIGHT_BUNDLE_PERCENT_OFF,
  lightPriceBySlug,
  magnificationPriceByProduct,
  PRESCRIPTION_PRICE,
  TRAINEE_PERCENT_OFF,
} from './pricing'

// Oct 28 2026 SEO round. Each page in this round gets a models-and-prices
// table under the hero, a direct answer, and checked research where it
// applies. It is a measured test: the control pages listed in
// seo/keyword-research-2026-10-27/PAGE-LIST-2026-10-28.md stay untouched.
// Specs come from lib/fallback-products.ts and lib/lights.ts; money from
// lib/pricing.json. Keep clinical statements to what each study found.
const updated = '2026-10-28'

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const priceRange = (model: string) => {
  const prices = Object.values(magnificationPriceByProduct[model])
  return `${usd(Math.min(...prices))}–${usd(Math.max(...prices))}`
}
const from = (model: string) => usd(Math.min(...Object.values(magnificationPriceByProduct[model])))
const lightRange = (slug: string) => {
  const prices = Object.values(lightPriceBySlug[slug].prices)
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  return low === high ? usd(low) : `${usd(low)}–${usd(high)}`
}
const terms = 'a lifetime warranty and 30-day returns on non-prescription pairs'

const section = (
  title: string,
  body: string,
  bullets: string[] = [],
  sourceHref?: string,
  sourceLabel?: string,
): ContentSection => ({ title, body, bullets, ...(sourceHref ? { sourceHref, sourceLabel } : {}) })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })

type ModelRow = { model: string; optics: string; mags: string; weight: string; distance: string; bestFor: string }
const models: ModelRow[] = [
  { model: 'newton', optics: 'Galilean', mags: '2.5x–3.5x', weight: '40–50 g with frame', distance: 'Fixed, measured to you', bestFor: 'Lowest-priced first pair' },
  { model: 'galileo', optics: 'Galilean', mags: '2.5x–3.5x', weight: '35–37 g', distance: 'Fixed, measured to you', bestFor: 'Everyday dental and surgical work; six frame styles included' },
  { model: 'kepler', optics: 'Conventional prismatic', mags: '4.0x–6.0x', weight: '68–85 g with frame', distance: 'Fixed, measured to you', bestFor: 'Fine detail at higher magnification' },
  { model: 'apollo', optics: 'Ergonomic prismatic', mags: '3.0x–6.0x', weight: '55–58.2 g with frame', distance: 'Fixed: 420, 450, 500 or 550 mm', bestFor: 'A more upright head in one working position' },
  { model: 'medusa', optics: 'Ergonomic prismatic', mags: '3.0x–8.5x', weight: '56–65 g with frame', distance: 'Adjustable, 300–600 mm', bestFor: 'Switching between sitting and standing' },
]
const modelTable = (
  title: string,
  pick: string[],
  bestFor: Record<string, string> = {},
): NonNullable<SeoLandingPage['specTable']> => ({
  title,
  lead: 'Published prices in USD. Every pair is built to your pupillary and working distance, with frame, worldwide shipping and a lifetime warranty included.',
  columns: ['Model', 'Optics', 'Magnification', 'Weight', 'Working distance', 'Best for', 'Price'],
  rows: models
    .filter((row) => pick.includes(row.model))
    .map((row) => [
      // linkifyText renders a bare path as a link named after its last segment.
      `/product/${row.model}`,
      row.optics,
      row.mags,
      row.weight,
      row.distance,
      bestFor[row.model] ?? row.bestFor,
      priceRange(row.model),
    ]),
  note: `Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Verified students, residents and fellows get ${TRAINEE_PERCENT_OFF}% off. Weights are as published on each product page; Galileo's figure does not state whether the frame is included.`,
})

const lightTable: NonNullable<SeoLandingPage['specTable']> = {
  title: 'HeliosX loupe lights compared',
  lead: `Five LED lights that fit every HeliosX frame. ${LIGHT_BUNDLE_PERCENT_OFF}% off any light ordered with a pair of loupes. Shop and compare: /product/lights.`,
  columns: ['Light', 'Type', 'Brightness', 'Spot at 42 cm', 'Head weight', 'Runtime', 'Best for', 'Price'],
  rows: LIGHTS.map((light) => [
    light.name,
    light.kind === 'wireless' ? 'Wireless' : 'Corded',
    `${light.lux.toLocaleString('en-US')} lux`,
    light.spotMm ? `${light.spotMm} mm${light.spotAdjustable ? ', adjustable' : ''}` : 'Not listed',
    light.headWeight,
    light.wireless
      ? `${light.wireless.hoursPerBattery} h per battery, ${light.wireless.batteries} batteries`
      : '4–10 h, by battery',
    light.bestFor,
    lightRange(light.slug),
  ]),
  note: 'Corded light prices depend on the battery: clip-on (4 h), slim (6 h), extended (10 h) or neckband (4 h). Brightness and spot size are the manufacturer’s figures.',
}

const hygieneNeckStudy = section(
  'Loupes alone do not fix a hygienist’s posture',
  'A 2021 study in the Journal of Dental Hygiene measured 24 second-year dental hygiene students during 30 minutes of hand scaling while wearing magnification loupes. Every student exceeded 20° of forward neck flexion, and half reported neck pain at that level. It is a small study, but the lesson is practical: the loupe has to be fitted to your seated working distance and viewing angle, or you will still lean in.',
  [
    'Measure working distance in the chair position you actually use: /education/working-distance-for-loupes.',
    'If your neck is the main problem, compare ergonomic prismatic Apollo, which lets you look down with your head closer to upright.',
    'Persistent pain needs a clinical assessment; no loupe is a treatment.',
  ],
  'https://pubmed.ncbi.nlm.nih.gov/33875531/',
  'Evaluating the Prevalence of Musculoskeletal Neck Pain in Dental Hygiene Students. J Dent Hyg. 2021;95(2):58–62',
)

const dentalPainStudy = section(
  'What the research says about loupes and pain in dentistry',
  'A 2020 survey of 400 dental students and dentists in Jeddah (International Journal of Dentistry) found that loupe users reported less recent pain than non-users: neck 18% vs 34%, lower back 14% vs 39%, and shoulder 0% vs 21% over the past 7 days. Only 49 of the 400 used loupes, and a one-time survey shows an association, not proof that loupes reduce pain. Fit and posture still decide most of the benefit.',
  [
    'Choose a working distance measured in your seated posture.',
    'Ergonomic prismatic loupes (Apollo, Medusa) redirect the line of sight for a more upright head.',
    'The study did not test HeliosX loupes.',
  ],
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC7414349/',
  'Practices and Attitudes of Dental Loupes and Their Relationship to Musculoskeletal Disorders among Dental Practitioners. Int J Dent. 2020',
)

const surgeonPainStudy = section(
  'Neck pain is common in surgery, with or without loupes',
  'In a 2024 survey of 93 ophthalmologists in Saudi Arabia (Saudi Journal of Ophthalmology), 82% reported musculoskeletal pain from operating-room work over 12 months, including neck pain in 87%. Most owned loupes, but only a third used them regularly, and the study found no significant link between loupe use and pain. Owning loupes is not the point; a fit that keeps your head from tipping forward is.',
  [
    'A 2024 randomized crossover trial of 19 surgeons (Fan et al.) found prismatic loupes lowered head inclination and neck muscle activity in simulated tasks: /education/ergonomic-loupes-neck-pain.',
    'Measure working distance in your operating posture: /education/working-distance-for-loupes.',
    'Neither study tested HeliosX loupes.',
  ],
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC12240280/',
  'The relationship between surgical loupes usage, workplace ergonomics, and musculoskeletal disorders among Saudi ophthalmologists. Saudi J Ophthalmol. 2024;39(2):166–173',
)

const lightPick = section(
  'Which HeliosX light for your magnification?',
  'Higher magnification shows a smaller, darker field, so it needs more light. Match the light to the magnification you use most, then choose corded or wireless.',
  [
    `2.5x–3.5x: Polaris, 50,000 lux with the widest spot (140 mm), from ${usd(lightFrom('polaris'))}.`,
    `Up to 4x: Vega, 70,000 lux, from ${usd(lightFrom('vega'))}.`,
    `4x–6x or deep fields: Rigel, 100,000 lux, from ${usd(lightFrom('rigel'))}.`,
    `High magnification and fine work: Sirius, 150,000 lux with an adjustable spot, from ${usd(lightFrom('sirius'))}.`,
    `No cord: Nova wireless, 50,000 lux, ${usd(lightFrom('nova'))}.`,
  ],
  '/product/lights',
  'Compare and buy HeliosX loupe lights',
)

const wirelessTradeoff = section(
  'Wireless or corded loupe light: the trade-off in numbers',
  'A wireless light puts the battery on your frame; a corded light keeps it on your scrubs. On HeliosX lights that means 29 g on the frame for the wireless Nova, against 10–12 g for a corded head. Nova runs about 3 hours per battery and ships with three, so you swap between patients. Corded packs run 4–10 hours depending on the battery you choose.',
  [
    'Choose wireless if a cord catching on the chair or bib bothers you more than extra weight on your nose.',
    'Choose corded for long clinic or theater days and the lightest frame.',
    'Hygienists wearing loupes all day usually notice the weight before the cord.',
  ],
)

type RoundUpdate = Partial<SeoLandingPage> & {
  prependSections?: ContentSection[]
  replaceSection?: Record<string, ContentSection>
  addFaqs?: ContentFaq[]
  replaceFaq?: Record<string, string>
  addKeywords?: string[]
}

const updates: Record<string, RoundUpdate> = {
  'dental-loupes-with-light': {
    metaTitle: 'Dental Loupes With Light: 5 LED Lights Compared | HeliosX',
    description: `Dental loupes with a light: 5 HeliosX LED lights, corded or wireless, 50,000–150,000 lux, from ${usd(lightFrom('polaris'))}. ${LIGHT_BUNDLE_PERCENT_OFF}% off with any pair of loupes.`,
    answer: `For most dentists and hygienists, a 3.0x–3.5x Galilean loupe with a corded LED of 50,000–70,000 lux is enough; brighter lights help at 4x and above. HeliosX sells five lights that fit every HeliosX frame, from Polaris at ${usd(lightFrom('polaris'))} to the 150,000-lux Sirius, plus the wireless Nova at ${usd(lightFrom('nova'))}, with ${LIGHT_BUNDLE_PERCENT_OFF}% off any light ordered with loupes. Loupes start at ${from('newton')}.`,
    specTable: lightTable,
    prependSections: [lightPick, wirelessTradeoff],
    replaceSection: {
      'Where HeliosX fits': section(
        'Where HeliosX fits',
        `HeliosX publishes the price of the loupe and of the light, so you can see the full cost before you order. Every HeliosX light fits every HeliosX frame, and a light ordered with a pair of loupes is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`,
        [
          `Example: Galileo 3.0x (${usd(magnificationPriceByProduct.galileo['3.0x'])}) with a Polaris on the clip-on battery (${usd(lightPriceBySlug.polaris.prices['clip-4h'])} before the ${LIGHT_BUNDLE_PERCENT_OFF}% bundle discount).`,
          'Newton and Galileo keep the base weight low before the light is added.',
          'Apollo and Medusa redirect the line of sight, which changes where the beam needs to point.',
          'Magnification for hygiene: /loupes-for-dental-hygiene.',
        ],
        '/product/lights',
        'All five HeliosX loupe lights',
      ),
    },
    replaceFaq: {
      'Do dental loupes come with a light?': `Usually not as standard. HeliosX, like most brands, sells the light separately so you can choose brightness and battery. Our five lights cost ${usd(lightFrom('polaris'))}–${usd(Math.max(...LIGHTS.map((l) => Math.max(...Object.values(lightPriceBySlug[l.slug].prices)))))} and are ${LIGHT_BUNDLE_PERCENT_OFF}% off when ordered with loupes. Always check whether another brand's quote is loupe-only or a bundle.`,
    },
    addFaqs: [
      faq(
        'Is a wireless loupe light better than a corded one?',
        'Neither is better for everyone. Wireless removes the cord but adds weight to the frame (29 g for HeliosX Nova) and runs about 3 hours per battery. Corded lights keep the frame lighter (10–12 g) and run 4–10 hours on a pack you clip to your scrubs.',
      ),
      faq(
        'How bright should a dental loupe light be?',
        'For 2.5x–3.5x, 50,000–70,000 lux is usually enough. At 4x–6x the view is darker, so 100,000 lux or more helps. Too bright a spot on wet enamel reflects back, so a light you can dim is worth more than the highest figure.',
      ),
    ],
    addKeywords: ['dental loupe light', 'dental loupes light', 'loupe lights', 'wireless loupe light', 'dental loupes with wireless light', 'led loupe light'],
  },
  'loupes-for-dental-hygiene': {
    specTable: modelTable('Dental hygiene loupes: models and prices', ['newton', 'galileo', 'apollo', 'medusa'], {
      newton: 'Lowest price for a first hygiene pair',
      galileo: 'Most hygienists: 3.0x–3.5x with a wide view of the quadrant',
      apollo: 'Hygienists whose neck is the main complaint',
      medusa: 'Hygienists who also stand, or share a pair across operatories',
    }),
    prependSections: [
      section(
        'Dental hygiene loupe prices',
        `HeliosX hygiene loupes start at ${from('newton')} for Newton and ${from('galileo')} for Galileo, and ergonomic prismatic Apollo starts at ${from('apollo')}. Hygiene students get ${TRAINEE_PERCENT_OFF}% off. School-fair packages from representative-sold brands commonly cost $1,500–2,000, so compare the finished price, not the discount.`,
        [
          `A light adds ${usd(lightFrom('polaris'))}–${usd(lightFrom('nova'))}, ${LIGHT_BUNDLE_PERCENT_OFF}% off with your loupes: /dental-loupes-with-light.`,
          `Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`,
          'Frame, worldwide shipping and a lifetime warranty are included in every price.',
        ],
        '/how-much-do-surgical-loupes-cost',
        'Full price list for every model',
      ),
      hygieneNeckStudy,
    ],
    addFaqs: [
      faq(
        'How much do dental hygiene loupes cost?',
        `HeliosX hygiene loupes cost ${priceRange('newton')} (Newton), ${priceRange('galileo')} (Galileo) and from ${from('apollo')} for ergonomic Apollo, with ${TRAINEE_PERCENT_OFF}% off for students. Representative-sold packages commonly cost $1,500–2,000.`,
      ),
    ],
    addKeywords: ['dental hygiene loupes prices', 'dental hygienist loupes', 'hygiene loupes', 'loupes for dental hygienists'],
  },
  'dental-loupes': {
    answer: `Dental loupes from HeliosX cost ${from('newton')} to ${priceRange('medusa').split('–')[1]}. Most dentists and hygienists use 2.5x–3.5x Galilean loupes (Newton from ${from('newton')}, Galileo from ${from('galileo')}); endodontics, implants and periodontal surgery often need 4x–6x prismatic loupes; and ergonomic prismatic Apollo or Medusa (from ${from('apollo')}) keeps your head more upright. Every pair is built to your measurements, with ${terms}.`,
    specTable: modelTable('Dental loupes: models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa'], {
      kepler: 'Endodontics, implants and fine restorative detail',
    }),
    prependSections: [dentalPainStudy],
    addFaqs: [
      faq(
        'How much do dental loupes cost?',
        `HeliosX dental loupes cost ${priceRange('newton')} (Newton), ${priceRange('galileo')} (Galileo), ${priceRange('kepler')} (Kepler) and ${from('apollo')}–${priceRange('medusa').split('–')[1]} for ergonomic Apollo and Medusa. Pairs from representative-sold brands usually cost $1,500 or more.`,
      ),
      faq(
        'Do I need a light with dental loupes?',
        `Most dentists add one, because your head blocks the overhead light when you lean in. HeliosX lights fit every HeliosX frame and are ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes: /dental-loupes-with-light.`,
      ),
    ],
    addKeywords: ['loupes for dentists', 'dental loupes for sale', 'dental magnification loupes', 'dental loupes price'],
  },
  'surgical-loupes': {
    answer: `HeliosX surgical loupes cost ${from('newton')} to ${priceRange('medusa').split('–')[1]}. Most residents and general surgeons start at 2.5x–3.5x Galilean (Newton, Galileo); fine work at 4x–6x uses prismatic Kepler from ${from('kepler')}; and long cases where neck posture matters suit ergonomic prismatic Apollo or Medusa from ${from('apollo')}. Every pair is built to your measured working distance, with ${terms}.`,
    specTable: modelTable('Surgical loupes: models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa'], {
      newton: 'Residents and students on a budget',
      galileo: 'General surgery and training at 2.5x–3.5x',
      kepler: 'Plastic, hand and vascular detail at 4x–6x',
    }),
    prependSections: [surgeonPainStudy],
    addFaqs: [
      faq(
        'How much do surgical loupes cost?',
        `HeliosX surgical loupes cost ${priceRange('newton')} (Newton), ${priceRange('galileo')} (Galileo), ${priceRange('kepler')} (Kepler), ${priceRange('apollo')} (Apollo) and ${priceRange('medusa')} (Medusa). Representative-sold brands usually run $2,000–5,500.`,
      ),
    ],
    addKeywords: ['loupes surgery', 'surgery loupes', 'loupes for surgeons', 'custom surgical loupes', 'surgical loupe'],
  },
}

export function applyOct28Round(pages: SeoLandingPage[]) {
  for (const page of pages) {
    const update = updates[page.slug]
    if (!update) continue
    const { prependSections, replaceSection, addFaqs, replaceFaq, addKeywords, ...fields } = update
    Object.assign(page, fields, { dateModified: updated })
    if (replaceSection)
      page.sections = page.sections.map((s) => replaceSection[s.title] ?? s)
    if (prependSections) page.sections = [...prependSections, ...page.sections]
    if (replaceFaq)
      page.faqs = page.faqs.map((f) => (replaceFaq[f.question] ? { ...f, answer: replaceFaq[f.question] } : f))
    if (addFaqs) page.faqs = [...page.faqs, ...addFaqs.filter((f) => !page.faqs.some((e) => e.question === f.question))]
    if (addKeywords) page.relatedKeywords = Array.from(new Set([...page.relatedKeywords, ...addKeywords]))
  }
}
