import type { ContentFaq, ContentSection, EducationGuide, SeoLandingPage } from './seo-content'
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
  'Why hygiene loupes must be fitted to your chair position',
  'A 2021 study in the Journal of Dental Hygiene measured 24 second-year dental hygiene students during 30 minutes of hand scaling with loupes. Every student exceeded 20° of forward neck flexion, and half reported neck pain. The practical lesson: a loupe fitted to your own seated working distance and viewing angle, which is how every HeliosX pair is built, stops you leaning in to find focus.',
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
  'Why surgeons choose ergonomic loupes',
  'Neck pain is one of the most common complaints in surgery: in a 2024 survey of 93 ophthalmologists (Saudi Journal of Ophthalmology), 87% reported neck pain over 12 months. In a 2024 randomized crossover trial of 19 surgeons (Fan et al., Frontiers in Public Health), prismatic loupes lowered head inclination and neck muscle activity during simulated surgical tasks. HeliosX Apollo and Medusa are ergonomic prismatic loupes built on the same principle.',
  [
    'The evidence in detail: /education/ergonomic-loupes-neck-pain.',
    'Measure working distance in your operating posture: /education/working-distance-for-loupes.',
    'These studies used other loupes, not HeliosX.',
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

// Batch 2 (weak pages): ergonomic and prismatic comparisons.
const prismaticNumbers = section(
  'Galilean vs prismatic in numbers',
  'Prismatic loupes reach higher magnification, but the view in focus gets smaller and shallower as magnification rises. These figures are from HeliosX product pages, so they compare like with like.',
  [
    'Newton (Galilean) 2.5x: field of view 80–120 mm, depth of field 200 mm, 40 g with frame.',
    'Medusa (ergonomic prismatic) 3.0x–4.0x: field of view 80 mm, depth of field 110 mm, 56 g with frame.',
    'Medusa 8.0x–8.5x: field of view 50 mm, depth of field 40 mm, 65 g with frame.',
    'Kepler (conventional prismatic) 4.0x–6.0x: 68–85 g with frame.',
  ],
  '/education/galilean-vs-prismatic-loupes',
  'How Galilean and prismatic optics differ',
)

updates['ergonomic-loupe-comparison'] = {
  specTable: modelTable('Ergonomic and conventional loupes: models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa']),
  prependSections: [dentalPainStudy],
  addFaqs: [
    faq(
      'How much do ergonomic loupes cost?',
      `HeliosX ergonomic prismatic loupes cost ${priceRange('apollo')} (Apollo) and ${priceRange('medusa')} (Medusa). LumaDent publishes Ergo Air Ti from $1,995; most other ergonomic brands quote through representatives.`,
    ),
  ],
  addKeywords: ['ergo loupes', 'best ergo loupes', 'best ergonomic loupes', 'ergonomic dental loupes', 'ergonomic surgical loupes'],
}

updates['prismatic-loupe-comparison'] = {
  answer: `Prismatic loupes use prisms to fold a longer optical path into the barrel, which allows 4x and above with a sharp, flat image. Conventional prismatic loupes (HeliosX Kepler, ${priceRange('kepler')}) keep the usual downward head tilt; ergonomic prismatic loupes (Apollo and Medusa, from ${from('apollo')}) also redirect your line of sight so your head can stay more upright. For 2.5x–3.5x, lighter Galilean loupes from ${from('newton')} are usually enough.`,
  specTable: modelTable('Prismatic and Galilean loupes: models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa']),
  prependSections: [prismaticNumbers],
  addFaqs: [
    faq(
      'Are prismatic loupes heavier than Galilean loupes?',
      'Usually, yes. On HeliosX models, Galilean Newton weighs 40–50 g with frame, ergonomic prismatic Apollo and Medusa 55–65 g, and conventional prismatic Kepler 68–85 g.',
    ),
  ],
  addKeywords: ['prismatic loupe', 'prism loupes', 'prismatic dental loupes', 'prismatic surgical loupes'],
}

const schultzComparison: Pick<SeoLandingPage, 'comparisonRows' | 'verdict'> = {
  comparisonRows: [
    { feature: 'Price', heliosx: `Every model and magnification priced on the site: ${from('newton')}–${priceRange('medusa').split('–')[1]}, frame and shipping included.`, other: '"Starting at $199" is the Feather Flip-Up at 2.0x; 2.5x is $299 and 3.0x $499, each shown as marked down from $699–$1,299.' },
    { feature: 'Optics', heliosx: 'Galilean 2.5x–3.5x, conventional prismatic 4.0x–6.0x, ergonomic prismatic 3.0x–8.5x.', other: 'Lists TTL 2.5x–3.5x, flip-up 2.0x–3.5x, prismatic 3.0x–6.0x and ErgoFusion ergonomic loupes.' },
    { feature: 'Working distance', heliosx: 'Measured to you; Medusa adjusts from 300–600 mm.', other: 'Confirm how working distance is measured and whether it can be changed.' },
    { feature: 'Trial and returns', heliosx: '30-day returns on non-prescription pairs, free return shipping.', other: 'Advertises a 30-day risk-free trial and money-back guarantee; read its returns page for conditions.' },
    { feature: 'Warranty', heliosx: 'Limited lifetime warranty against manufacturer defects.', other: 'Advertises a lifetime warranty; check what it covers.' },
    { feature: 'Lights', heliosx: `Five LED lights from ${usd(lightFrom('polaris'))}, ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`, other: 'Sells loupe-and-light combos and a wireless headlight it lists at 55,000 lux.' },
  ],
  verdict: 'Choose HeliosX if you want a pair built to your measurements, ergonomic prismatic optics, working distance you can adjust (Medusa), and a published price for the exact configuration before you pay.',
}

// Batch 2 new pages: searches with demand and no page of their own.
// LoupeDirect/Schultz facts are its own site's claims, read 2026-10-28.
// Feather Flip-Up prices ($199 2.0x, $299 2.5x, $499 3.0x, struck through
// from $699/$899/$1,299) come from a LoupeDirect screenshot the owner sent
// that day. State checkable facts only; no quality claims about products we
// have not tested.
export const oct28NewPages: SeoLandingPage[] = [
  {
    slug: 'surgical-magnifying-glasses',
    title: 'Surgical magnifying glasses: types, magnification and prices',
    metaTitle: 'Surgical Magnifying Glasses: Types & Prices | HeliosX',
    description: `Surgical magnifying glasses are surgical loupes: telescopes in a spectacle frame, focused at your working distance. Types, magnification and prices from ${from('newton')}.`,
    heroKicker: 'Surgical magnifying glasses',
    primaryKeyword: 'surgical magnifying glasses',
    relatedKeywords: ['magnifying glasses surgery', 'surgery glasses magnify', 'surgical magnifying lenses', 'surgical binocular glasses', 'surgeon glasses magnifying', 'surgical telescope glasses', 'doctors magnifying glasses'],
    audience: 'surgeons, residents and clinicians looking for magnifying glasses for procedures',
    answer: `Surgical magnifying glasses are what surgeons call loupes: two small telescopes mounted in a spectacle frame and focused at your working distance, usually 2.5x to 6x. Unlike reading glasses or headband magnifiers, they keep a sharp image at arm's length while you stand or sit upright. HeliosX makes five custom-fit models from ${from('newton')} to ${priceRange('medusa').split('–')[1]}, with ${terms}.`,
    intro: 'If you searched for magnifying glasses for surgery, you are looking for surgical loupes. This page explains the types, how much magnification you need, and what each costs, so you can compare like with like.',
    specTable: modelTable('Surgical magnifying glasses: models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa']),
    proofPoints: ['Five models from 2.5x to 8.5x.', 'Built to your pupillary and working distance.', 'Published prices, lifetime warranty.'],
    sections: [
      section(
        'Loupes, readers and headband magnifiers are different tools',
        'Reading glasses and simple magnifiers enlarge an image only when you hold it close. Surgical loupes are telescopes aimed at a fixed point, your working distance, so the field stays sharp 30–60 cm away while you keep a working posture. Headband and visor magnifiers are built for hobby and bench work and do not focus to your measured distance.',
        ['Loupes: telescopes focused at your working distance, 2.5x and up.', 'Readers: a single lens that magnifies close-up text.', 'Headband magnifiers: low-cost, general-purpose, not fitted to you.'],
      ),
      section(
        'Galilean or prismatic',
        'Galilean loupes are lighter and give a wide, deep view at 2.5x–3.5x, which suits training and general work. Prismatic loupes fold the optical path with prisms to reach 4x and above. Ergonomic prismatic loupes also bend your line of sight so your head can stay more upright.',
        [`Galilean: Newton from ${from('newton')}, Galileo from ${from('galileo')}.`, `Conventional prismatic: Kepler from ${from('kepler')}.`, `Ergonomic prismatic: Apollo and Medusa from ${from('apollo')}.`],
        '/education/galilean-vs-prismatic-loupes',
        'Galilean vs prismatic loupes explained',
      ),
      section(
        'How much magnification do surgeons use?',
        'Most residents and general surgeons start at 2.5x–3.5x. Plastic, hand, vascular and fine reconstructive work often uses 4x–6x. Higher magnification shows more detail but a smaller, shallower field, so choose the lowest power that shows your finest routine task.',
        ['Magnification by specialty: /education/intraoperative-magnification-by-specialty.', 'Loupe magnification guide: /education/loupe-magnification-guide.'],
      ),
      section(
        'Fit decides whether they work',
        'Surgical magnifying glasses only focus at the distance they are built for. HeliosX builds each pair to your pupillary distance and the working distance you measure in your operating posture, and reviews the measurements before production.',
        ['Measure working distance: /education/working-distance-for-loupes.', `Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`, 'Add a light for deep or shadowed fields: /dental-loupes-with-light.'],
      ),
    ],
    recommendedProducts: ['Galileo', 'Kepler', 'Apollo', 'Newton'],
    faqs: [
      faq('Are surgical magnifying glasses the same as surgical loupes?', 'Yes. "Surgical magnifying glasses", "surgical telescopes" and "binocular loupes" all describe the same thing: magnifying telescopes mounted in a frame and focused at your working distance.'),
      faq('How much do surgical magnifying glasses cost?', `HeliosX pairs cost ${priceRange('newton')} (Newton), ${priceRange('galileo')} (Galileo), ${priceRange('kepler')} (Kepler), ${priceRange('apollo')} (Apollo) and ${priceRange('medusa')} (Medusa). Representative-sold brands usually run $2,000–5,500.`),
      faq('Can I use reading glasses or a headband magnifier for surgery?', 'They are not designed for it. Neither focuses at a measured working distance, so you end up leaning in to get a sharp image.'),
      faq('Can I get them with my prescription?', `Yes. HeliosX adds prescription lenses for ${usd(PRESCRIPTION_PRICE)} per pair.`),
    ],
    datePublished: updated,
    dateModified: updated,
  },
  {
    slug: 'heliosx-vs-schultz',
    title: 'HeliosX vs Schultz (LoupeDirect)',
    metaTitle: 'HeliosX vs Schultz LoupeDirect: Loupes & Pricing',
    description: 'Compare HeliosX and Schultz (LoupeDirect) loupes by optical design, price, trial and warranty terms before you order.',
    heroKicker: 'Comparison',
    primaryKeyword: 'heliosx vs schultz loupes',
    relatedKeywords: ['schultz loupes', 'schultz dental loupes', 'loupedirect', 'loupedirect alternatives', 'schultz loupes review'],
    audience: 'dentists, hygienists, students and surgeons comparing HeliosX with Schultz loupes sold through LoupeDirect',
    answer: `HeliosX builds every pair to your own pupillary and working distance and publishes the full price of each model and magnification: Galilean from ${from('newton')}, conventional prismatic from ${from('kepler')} and ergonomic prismatic from ${from('apollo')}, with frame, shipping and ${terms} included. Schultz (LoupeDirect) advertises loupes "starting at $199"; that price buys its Feather Flip-Up at 2.0x, below the 2.5x most clinicians start with. Its 2.5x is $299 and 3.0x is $499.`,
    intro: 'Schultz and HeliosX both sell loupes online. The useful comparison is the pair you would actually wear: its optical design, magnification, fit and finished price.',
    competitorName: 'Schultz (LoupeDirect)',
    ...schultzComparison,
    proofPoints: ['Both sell online, direct to clinicians.', 'HeliosX publishes every magnification price.', 'Schultz figures are its own advertised claims, checked October 28, 2026.'],
    sections: [
      section(
        'What Schultz (LoupeDirect) offers',
        'LoupeDirect sells Schultz-branded loupes and headlights online from Las Vegas. Its site lists through-the-lens, flip-up, clip-on, headband, prismatic and ErgoFusion ergonomic loupes. We have not tested Schultz loupes and make no claim about their optical quality.',
        [],
        'https://www.loupedirect.com/',
        'LoupeDirect official site; checked October 28, 2026',
      ),
      section(
        'A "starting at" price is not the price of your pair',
        'The $199 Schultz price is for a flip-up loupe at 2.0x. Most dental and surgical buyers start at 2.5x–3.5x, and flip-up loupes hinge in front of the lens, so they typically sit further from the eye than loupes fixed in the lens, which narrows the field of view and puts more weight forward. Compare the magnification and design you will actually use, measured to your working distance. HeliosX shows that full price for every model and magnification before checkout.',
        [`HeliosX prescription lenses: ${usd(PRESCRIPTION_PRICE)}.`, 'HeliosX includes frame and worldwide shipping in the listed price.', 'Full HeliosX price list: /how-much-do-surgical-loupes-cost.'],
      ),
      section(
        'Where HeliosX is different',
        'Every HeliosX pair is built to the pupillary and working distance you measure, and we review those measurements before production. HeliosX ergonomic prismatic loupes redirect your line of sight so your head can stay more upright, and Medusa adds working distance you can adjust from 300 to 600 mm for clinicians who sit and stand.',
        ['Apollo: /product/apollo.', 'Medusa: /product/medusa.', 'Galileo: /product/galileo.'],
      ),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Medusa'],
    faqs: [
      faq('Is HeliosX the same company as Schultz or LoupeDirect?', 'No. They are different brands with different products and terms. We have not performed a controlled optical comparison.'),
      faq('Is a $199 loupe the same as a HeliosX pair?', `No. Schultz's $199 price is for a 2.0x flip-up. HeliosX pairs, from ${from('newton')} at 2.5x, are built to your measured pupillary and working distance, with frame, shipping and a lifetime warranty included. Compare the same magnification and optical design.`),
    ],
    datePublished: updated,
    dateModified: updated,
  },
  {
    slug: 'lightweight-dental-loupes',
    title: 'Lightweight dental loupes: what the weight figures mean',
    metaTitle: 'Lightweight Dental Loupes: Weights Compared | HeliosX',
    description: 'How much do dental loupes weigh? HeliosX weights by model, what a published weight includes, and how a light and prescription change it.',
    heroKicker: 'Lightweight loupes',
    primaryKeyword: 'lightweight dental loupes',
    relatedKeywords: ['lightest dental loupes', 'lightweight surgical loupes', 'dental loupe weight comparison', 'lightweight loupes', 'lightweight ergonomic loupes'],
    audience: 'dentists, hygienists and students who wear loupes for long days',
    answer: `The lightest dental loupes are Galilean pairs at 2.5x–3.5x. HeliosX Newton weighs 40–50 g with frame and Galileo is listed at 35–37 g; ergonomic prismatic Apollo and Medusa weigh 55–65 g with frame, and conventional prismatic Kepler 68–85 g. Before comparing any brand, check whether the figure includes the frame, a light and prescription lenses.`,
    intro: 'Weight decides whether you keep loupes on through a full day. The catch is that brands quote weight on different bases, so a lower number is not always a lighter pair on your face.',
    specTable: modelTable('Dental loupe weights by model', ['newton', 'galileo', 'kepler', 'apollo', 'medusa']),
    proofPoints: ['Weights as published for each HeliosX model.', 'Galilean pairs are the lightest.', 'Lights add 10–29 g.'],
    sections: [
      section(
        'What a published weight includes',
        'Some brands quote one eyepiece, some the optics without a frame, and some the whole pair. Ask for the weight of the complete pair you would wear: frame, both barrels, prescription lenses and any light.',
        ['Optic-only figures can look half the size of a full-pair figure.', 'Prescription lenses add weight, more for strong prescriptions.', "Galileo's listed 35–37 g does not state whether it includes the frame."],
      ),
      section(
        'A light changes the total',
        `A corded HeliosX light adds 10–12 g at the frame; the wireless Nova adds 29 g including its battery. If weight is your main concern, a corded light keeps the battery on your scrubs.`,
        ['Compare all five lights: /dental-loupes-with-light.'],
      ),
      section(
        'Light is not the same as ergonomic',
        'Low weight and a redirected viewing angle are different features. A lighter Galilean pair still has you tilt your head; ergonomic prismatic Apollo and Medusa weigh a little more but let you look down with your head more upright.',
        ['Ergonomic loupes compared: /ergonomic-loupe-comparison.'],
      ),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    faqs: [
      faq('What are the lightest HeliosX loupes?', 'Galileo is listed at 35–37 g and Newton at 40–50 g with frame. Both are Galilean, 2.5x–3.5x.'),
      faq('How much do dental loupes weigh?', 'Galilean pairs usually weigh around 35–50 g and prismatic pairs more, depending on magnification, frame and whether a light is attached. Compare complete-pair weights.'),
    ],
    datePublished: updated,
    dateModified: updated,
  },
]

// Neck-pain guide (0 impressions): add the checked dental and hygiene studies.
export function applyOct28GuideRound(guides: EducationGuide[]) {
  const neck = guides.find((g) => g.slug === 'ergonomic-loupes-neck-pain')
  if (!neck) return
  neck.dateModified = updated
  neck.answer = 'Ergonomic prismatic loupes let you look down at the work with your head closer to upright. A 2024 trial in 19 surgeons found they lowered head inclination and neck muscle activity in simulated tasks, and dental surveys link loupe use with less reported pain, but no study shows a loupe prevents or treats neck pain.'
  neck.sections = [...neck.sections, dentalPainStudy, hygieneNeckStudy, surgeonPainStudy]
  neck.citations = [
    ...(neck.citations ?? []),
    { label: 'Int J Dent 2020: loupe use and musculoskeletal disorders among 400 dental students and dentists', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7414349/' },
    { label: 'J Dent Hyg 2021: neck flexion and pain in 24 dental hygiene students', href: 'https://pubmed.ncbi.nlm.nih.gov/33875531/' },
    { label: 'Saudi J Ophthalmol 2024: loupe use and musculoskeletal pain in 93 ophthalmologists', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12240280/' },
  ]
}

// applyEditorialRevisions strips comparison tables from pages without a
// revision, so the Schultz table is restored here.
updates['heliosx-vs-schultz'] = schultzComparison

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
