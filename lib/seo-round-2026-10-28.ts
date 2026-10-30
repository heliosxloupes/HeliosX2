import type { ContentFaq, ContentSection, EducationGuide, SeoLandingPage } from './seo-content'
import { HEADLIGHTS, headHours, LIGHT_WARRANTY_YEARS, LIGHTS, lightFrom } from './lights'
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
  lead: `Five LED lights that fit every HeliosX frame, each with a ${LIGHT_WARRANTY_YEARS}-year warranty. ${LIGHT_BUNDLE_PERCENT_OFF}% off any light ordered with a pair of loupes. Shop and compare: /product/lights.`,
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
  removeKeywords?: string[]
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
    intro: 'Dentists, hygienists and dental students in more than 110 countries work with HeliosX loupes. Our specialists have fitted them at hundreds of dental expos and conferences, and every pair is custom-tailored to the clinician: your seated working distance, your pupillary distance, your magnification, your frame and light. Here is how to choose yours.',
    answer: `HeliosX dental loupes are favored by dentists and hygienists in more than 110 countries for lightweight, ergonomic optics custom-tailored to their seated posture. Most choose 2.5x–3.5x lightweight Galilean loupes (Newton from ${from('newton')}, Galileo from ${from('galileo')}); endodontics, implants and periodontal surgery call for Kepler prismatic loupes at 4x–6x; and ergonomic prismatic Apollo and Medusa (from ${from('apollo')}) keep your head upright through a full day of patients. Every pair comes with a lifetime warranty.`,
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
    intro: 'Surgeons in more than 110 countries operate with HeliosX loupes. Our specialists have fitted surgeons at hundreds of expos across nearly every specialty, and every pair is custom-tailored: your pupillary distance, your working distance, your magnification, your frame and light. Here is how to choose yours.',
    answer: `HeliosX surgical loupes are the world standard in ergonomic and lightweight optics, favored by surgeons in more than 110 countries and custom-tailored to each surgeon's working distance. Choose lightweight Galilean Newton or Galileo (2.5x–3.5x, from ${from('newton')}) for general surgery and training, Kepler (4x–6x, from ${from('kepler')}) for fine detail, or ergonomic prismatic Apollo and Medusa (up to 8.5x, from ${from('apollo')}) for long cases with an upright head. Every pair comes with a lifetime warranty.`,
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
        'LoupeDirect sells Schultz-branded loupes and headlights online from Las Vegas. Its site lists through-the-lens, flip-up, clip-on, headband, prismatic and ErgoFusion ergonomic loupes.',
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
      faq('Is HeliosX the same company as Schultz or LoupeDirect?', 'No. They are different brands with different products and terms. HeliosX is an independent optics company with its own designs, custom fitting and published prices.'),
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
  for (const guide of guides) if (!/110 countries/.test(guide.intro)) guide.intro = `${authorityLead} ${guide.intro}`.trim()
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

// Batch 3: competitor comparison pages (few impressions, positions 7–15).
// Brand searches carry real volume ("orascoptic loupes", "q optics loupes",
// "lumadent loupes", "surgitel loupe": 1K–10K each in Keyword Planner), so
// each page gets a HeliosX-first answer, the model table, and brand terms.
// Competitor facts are only those already checked in seo-editorial.ts.
const allModels = modelTable('HeliosX models and prices', ['newton', 'galileo', 'kepler', 'apollo', 'medusa'])
const heliosxFirst = `HeliosX publishes the full price of every model and builds each pair to your measured pupillary and working distance: Galilean from ${from('newton')}, conventional prismatic from ${from('kepler')} and ergonomic prismatic from ${from('apollo')}, with frame, shipping and ${terms} included.`
// The brand template's verdict ends with each competitor's selling point, so
// every comparison page gets a HeliosX-first verdict here.
const vsPage = (answer: string, metaTitle: string | undefined, keywords: string[], verdict: string): RoundUpdate => ({
  answer,
  verdict,
  ...(metaTitle ? { metaTitle } : {}),
  specTable: allModels,
  addKeywords: keywords,
})
Object.assign(updates, {
  'heliosx-vs-lumadent': vsPage(
    `HeliosX ergonomic prismatic loupes, Apollo and Medusa, start at ${from('apollo')}, below LumaDent's published Ergo Air Ti starting price of $1,995 at 3.0x. Every HeliosX pair is built to your measured pupillary and working distance, with frame, shipping and ${terms} included; Medusa adjusts its working distance from 300 to 600 mm.`,
    undefined,
    ['lumadent loupes', 'lumadent dental loupes', 'lumadent ergo loupes', 'lumadent ergonomic loupes'],
    `Choose HeliosX for ergonomic prismatic loupes from ${from('apollo')}, below LumaDent's published $1,995 start, built to your measurements, with a lifetime warranty and adjustable working distance on Medusa.`,
  ),
  'heliosx-vs-surgitel': vsPage(
    `${heliosxFirst} SurgiTel sells its ErgoDeflection and other ergonomic families through quotes and demonstrations. HeliosX Apollo and Medusa are ergonomic prismatic loupes with the price on the page, and Medusa adjusts its working distance from 300 to 600 mm.`,
    undefined,
    ['surgitel loupes', 'surgitel loupe', 'surgitel dental loupes', 'surgitel ergo loupes', 'surgitel loupes price'],
    'Choose HeliosX if you want ergonomic prismatic optics with the price published before you order, a pair built to your measurements, and working distance you can adjust on Medusa.',
  ),
  'heliosx-vs-q-optics': vsPage(
    `${heliosxFirst} Q-Optics quotes ErgoAngle per configuration; HeliosX shows the price of every model and magnification before you order.`,
    'Q-Optics Loupes vs HeliosX: Price, Fit & Features',
    ['q optics loupes', 'loupes q optics', 'q optics dental loupes', 'q optics loupes price', 'q optics ergo loupes'],
    'Choose HeliosX if you want the price of your exact configuration before you order, a pair built to your measurements, and a lifetime warranty.',
  ),
  'heliosx-vs-admetec': vsPage(
    `${heliosxFirst} Admetec Ergo V is sold through authorized sellers with regional pricing. If you work at one magnification, a HeliosX pair built for it means you do not pay for settings you will not use, and Medusa adjusts working distance from 300 to 600 mm.`,
    'Admetec Loupes vs HeliosX: Price, Fit & Features',
    ['admetec loupes', 'admetec ergo loupes', 'admetec ergo v'],
    'Choose HeliosX if you work at one magnification and want a pair built for it at a published price, with working distance you can adjust on Medusa.',
  ),
  'heliosx-vs-zeiss': {
    ...vsPage(
      `${heliosxFirst} ZEISS EyeMag is sold through dealers without published US prices, and retailers list a 2-year warranty against HeliosX's lifetime warranty. Medusa also adjusts working distance from 300 to 600 mm instead of fixed steps.`,
      'ZEISS Loupes vs HeliosX: Price, Fit & Warranty',
      ['zeiss dental loupes', 'carl zeiss dental loupes', 'dental loupes zeiss', 'zeiss surgical loupes'],
      'Choose HeliosX if you want the full price before you order, a pair built to your working distance or adjustable with Medusa, ergonomic prismatic optics, and a lifetime warranty instead of two years.',
    ),
  },
  'heliosx-vs-designs-for-vision': {
    specTable: allModels,
    verdict: 'Choose HeliosX if you want a custom-built pair with the full price published before you order, ergonomic prismatic options, and a lifetime warranty.',
    metaTitle: 'Designs for Vision Loupes vs HeliosX: Price & Fit',
    addKeywords: ['designs for vision dental loupes', 'designs for vision surgical loupes', 'designs for vision ergo loupes', 'designs for vision loupes'],
  },
} satisfies Record<string, RoundUpdate>)

// Oct 29: light pages by audience. 90 days of Search Console showed hygienist
// light searches (1,820 impressions, position 49) split across three pages
// with none built for them, and Keyword Planner shows "surgical loupes with
// light" and "led surgical headlight" at 100–1K a month with no page of ours.
const added = '2026-10-29'
const loupePrice = (model: string, mag: string) => magnificationPriceByProduct[model][mag]
const lightOption = (slug: string, option: string) => lightPriceBySlug[slug].prices[option]
const setupRow = (setup: string, model: string, mag: string, light: string, option: string, frameWeight: string, runtime: string) => [
  setup,
  `${name(model)} ${mag}: /product/${model}`,
  `${name(light)}, ${optionLabel[option]}`,
  frameWeight,
  runtime,
  `${usd(loupePrice(model, mag) + lightOption(light, option))} (${usd(loupePrice(model, mag))} + ${usd(lightOption(light, option))})`,
]
const name = (slug: string) => slug[0].toUpperCase() + slug.slice(1)
const optionLabel: Record<string, string> = {
  'clip-4h': 'clip-on battery',
  'slim-6h': 'slim battery',
  'pack-10h': 'extended battery',
  'neck-4h': 'neckband battery',
  wireless: 'wireless',
}
const setupColumns = ['Setup', 'Loupe', 'Light', 'Weight at the frame', 'Light runtime', 'Loupe + light']
const setupNote = `Prices in USD before the ${LIGHT_BUNDLE_PERCENT_OFF}% light discount you get when the light is ordered with the loupes. Weights are the published loupe weight plus the light head; corded batteries sit at your waist or neck, not on the frame. Every HeliosX light fits every HeliosX frame and carries a ${LIGHT_WARRANTY_YEARS}-year warranty.`

oct28NewPages.push(
  {
    slug: 'dental-hygiene-loupes-with-light',
    title: 'Dental hygiene loupes with light: the pair and light hygienists need',
    metaTitle: 'Dental Hygiene Loupes With Light: Setups & Prices | HeliosX',
    description: `Dental hygiene loupes with a light: 3.0x–3.5x Galilean loupes plus an LED for posterior and sub-gingival work. Five setups with prices, from ${usd(loupePrice('newton', '2.5x') + lightOption('polaris', 'clip-4h'))}.`,
    heroKicker: 'Hygiene loupes with light',
    primaryKeyword: 'dental hygiene loupes with light',
    relatedKeywords: ['dental loupes with light for dental hygienist', 'dental hygienist loupes with light', 'loupes with light for dental hygienist', 'dental hygiene glasses with light', 'best dental hygiene loupes with light', 'headlight for dental hygienist', 'dental hygienist glasses with light'],
    audience: 'dental hygienists and hygiene students choosing loupes and a light together',
    answer: `Most hygienists do best with a 3.0x–3.5x Galilean loupe and a corded LED light: HeliosX Galileo 3.0x (${usd(loupePrice('galileo', '3.0x'))}) with a Polaris light (from ${usd(lightFrom('polaris'))}) adds only 10 g at the frame and runs 4–10 hours on a battery at your waist. Order the light with the loupes for ${LIGHT_BUNDLE_PERCENT_OFF}% off; hygiene students get ${TRAINEE_PERCENT_OFF}% off the loupes.`,
    intro: 'Hygiene asks more of a light than most dentistry: six to eight hours of recalls, posterior and sub-gingival work in the shadow of your own head, and a frame you wear all day. Choose the loupe and the light together, because the light is mounted to the frame you order.',
    specTable: {
      title: 'Hygienist setups: loupe and light',
      lead: 'Five complete setups, from the lowest price to the most upright posture.',
      columns: setupColumns,
      rows: [
        setupRow('Lowest price', 'newton', '2.5x', 'polaris', 'clip-4h', '40 g + 10 g light', '4 h'),
        setupRow('Most hygienists', 'galileo', '3.0x', 'polaris', 'slim-6h', '36 g + 10 g light', '6 h'),
        setupRow('Full day of recalls', 'galileo', '3.5x', 'polaris', 'pack-10h', '37 g + 10 g light', '10 h'),
        setupRow('No cord', 'galileo', '3.0x', 'nova', 'wireless', '36 g + 29 g light with battery', '3 h per battery, 3 batteries'),
        setupRow('Neck strain', 'apollo', '3.0x', 'vega', 'slim-6h', '55–58 g + 10 g light', '6 h'),
      ],
      note: setupNote,
    },
    proofPoints: ['Five complete setups with prices.', 'Every light fits every HeliosX frame.', `${LIGHT_BUNDLE_PERCENT_OFF}% off the light with loupes.`],
    sections: [
      section(
        'Why hygienists need a loupe light',
        'The operatory light sits above and behind you, so your own head blocks it as soon as you lean in. Sub-gingival deposits, distal surfaces and the posterior sextants all sit in that shadow. A light mounted on the loupe points wherever you look, so the field stays lit at every angle.',
        ['Magnification without a light gives you a bigger view of a darker field.', 'At 2.5x–3.5x, a 50,000-lux light such as Polaris is enough for most hygiene work.'],
      ),
      section(
        'Corded or wireless for a full column of recalls',
        'A corded light keeps the frame light: the head adds 10 g and the battery rides at your waist or neck for 4–10 hours. The wireless Nova has no cord to catch on the chair or bib, but adds 29 g on the frame and runs about 3 hours per battery, so you swap between patients. Most hygienists notice weight on the nose before they notice a cord.',
        ['Long days without a break: Polaris on the extended 10-hour battery.', 'Moving between operatories all day: Nova wireless, with three batteries included.'],
        '/product/lights',
        'Compare all five HeliosX lights',
      ),
      section(
        'Fit the loupe to your chair, then the light to the loupe',
        'The light only helps if the loupe is focused where you work. Every HeliosX pair is built to the working distance you measure in your own seated posture, and we review the measurements before production. A 2021 study of hygiene students found that all of them exceeded 20° of neck flexion while scaling, so a pair fitted to your chair position matters as much as the light.',
        ['Measure your working distance: /education/working-distance-for-loupes.', 'Choosing the loupe first: /loupes-for-dental-hygiene.'],
        'https://pubmed.ncbi.nlm.nih.gov/33875531/',
        'J Dent Hyg 2021: neck flexion and pain in 24 dental hygiene students',
      ),
      section(
        'What a hygiene setup costs',
        `A complete HeliosX hygiene setup runs from ${usd(loupePrice('newton', '2.5x') + lightOption('polaris', 'clip-4h'))} (Newton 2.5x with Polaris) before the ${LIGHT_BUNDLE_PERCENT_OFF}% light discount. Frame, worldwide shipping and a lifetime warranty are included in the loupe price, and hygiene students get ${TRAINEE_PERCENT_OFF}% off the loupes.`,
        [`Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`, 'Full loupe price list: /how-much-do-surgical-loupes-cost.'],
      ),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    faqs: [
      faq('Do dental hygienists need a loupe light?', 'Most do. Posterior and sub-gingival work sits in the shadow of your own head, and a loupe-mounted light keeps the field lit wherever you look.'),
      faq('Which light is best for hygiene loupes?', `At 2.5x–3.5x, a 50,000-lux corded light such as HeliosX Polaris (from ${usd(lightFrom('polaris'))}) suits most hygienists. Choose the wireless Nova if a cord bothers you more than 29 g on the frame.`),
      faq('Can I add a light to my HeliosX loupes later?', `Yes. Every HeliosX light fits every HeliosX frame. The ${LIGHT_BUNDLE_PERCENT_OFF}% light discount applies when the light is ordered with the loupes.`),
      faq('How much do hygiene loupes with a light cost?', `HeliosX setups run from ${usd(loupePrice('newton', '2.5x') + lightOption('polaris', 'clip-4h'))} (Newton 2.5x with Polaris) to about ${usd(loupePrice('apollo', '3.0x') + lightOption('vega', 'slim-6h'))} for ergonomic Apollo with Vega, before the ${LIGHT_BUNDLE_PERCENT_OFF}% light discount.`),
    ],
    datePublished: added,
    dateModified: added,
  },
  {
    slug: 'surgical-loupes-with-light',
    title: 'Surgical loupes with light: choosing a headlight for the OR',
    metaTitle: 'Surgical Loupes With Light & LED Headlights | HeliosX',
    description: `Surgical loupes with a light: match the LED headlight to your magnification and field depth, from 50,000 to 150,000 lux. Setups with prices from ${usd(loupePrice('galileo', '3.0x') + lightOption('vega', 'slim-6h'))}.`,
    heroKicker: 'Surgical loupes with light',
    primaryKeyword: 'surgical loupes with light',
    relatedKeywords: ['led surgical headlight', 'surgical headlight', 'surgical loupes with headlight', 'surgical loupe headlight', 'medical loupes with light', 'best surgical loupes with light', 'cordless surgical headlight', 'ergonomic loupes with light', 'prismatic loupes with light', 'surgical magnifying glasses with light'],
    audience: 'surgeons, residents and fellows choosing loupes and a headlight for the operating room',
    answer: `Match the light to your magnification and how deep you work: Vega (70,000 lux) for 2.5x–4x general surgery, Rigel (100,000 lux) for 4x–6x and deep or shadowed fields, and Sirius (150,000 lux, adjustable spot) for high magnification and fine work. HeliosX corded lights add 10–12 g at the frame and run up to 10 hours, every light fits every HeliosX frame, and lights ordered with loupes are ${LIGHT_BUNDLE_PERCENT_OFF}% off.`,
    intro: 'Overhead theatre lights are aimed at the field, but your head, hands and retractors shadow it as soon as you lean in, and deep cavities stay dark. A loupe-mounted headlight puts the light on your line of sight. The right one depends on your magnification, the depth you work at, and how long your cases run.',
    specTable: {
      title: 'Surgical setups: loupe and light',
      lead: 'Common setups by type of work. Higher magnification shows a smaller, darker field, so it needs more light.',
      columns: setupColumns,
      rows: [
        setupRow('Training and general surgery', 'galileo', '3.0x', 'vega', 'slim-6h', '36 g + 10 g light', '6 h'),
        setupRow('Plastic, hand and vascular at 4x', 'kepler', '4.0x', 'rigel', 'pack-10h', '68 g + 11 g light', '10 h'),
        setupRow('Long cases, upright posture', 'apollo', '4.0x', 'rigel', 'pack-10h', '55–58 g + 11 g light', '10 h'),
        setupRow('Fine detail at 6x', 'medusa', '6.0x', 'sirius', 'pack-10h', '58 g + 12 g light', '10 h'),
        setupRow('Sitting and standing, no waist pack', 'medusa', '4.0x', 'rigel', 'neck-4h', '56 g + 11 g light', '4 h'),
      ],
      note: setupNote,
    },
    proofPoints: ['Lights from 50,000 to 150,000 lux.', 'Up to 10 hours on one battery.', `${LIGHT_BUNDLE_PERCENT_OFF}% off the light with loupes.`],
    sections: [
      section(
        'Brightness follows magnification',
        'Each step up in magnification spreads the same light over a smaller field and darkens the view through the loupe. That is why the light that is plenty at 3.0x feels dim at 5.0x.',
        [
          `2.5x–3.5x: Polaris, 50,000 lux, widest spot (140 mm), from ${usd(lightFrom('polaris'))}.`,
          `Up to 4x: Vega, 70,000 lux, from ${usd(lightFrom('vega'))}.`,
          `4x–6x and deep fields: Rigel, 100,000 lux, from ${usd(lightFrom('rigel'))}.`,
          `High magnification and fine work: Sirius, 150,000 lux, adjustable spot, from ${usd(lightFrom('sirius'))}.`,
        ],
        '/product/lights',
        'Compare all five HeliosX lights',
      ),
      section(
        'Runtime for long cases',
        'Choose the battery for your longest list, not your average one. HeliosX corded lights take a clip-on (4 h), slim (6 h), extended (10 h) or neckband (4 h) battery. The neckband keeps nothing at the waist, which helps if you gown and scrub with a pack in the way.',
        ['Full day in theatre: extended 10-hour battery.', 'Gowned cases: neckband battery, nothing at the waist.'],
      ),
      section(
        'Ergonomic and prismatic loupes with a light',
        'Ergonomic prismatic loupes, such as HeliosX Apollo and Medusa, redirect your line of sight downward so your head can stay more upright. The light has to point where you are actually looking, so it is mounted for the loupe you order. Prismatic loupes are heavier than Galilean ones, which makes a 10–12 g corded head the better match than a heavier wireless light.',
        ['Ergonomic loupes compared: /ergonomic-loupe-comparison.', 'Galilean vs prismatic: /prismatic-loupe-comparison.'],
      ),
      section(
        'What a surgical setup costs',
        `HeliosX surgical setups run from ${usd(loupePrice('galileo', '3.0x') + lightOption('vega', 'slim-6h'))} (Galileo 3.0x with Vega) before the ${LIGHT_BUNDLE_PERCENT_OFF}% light discount. Loupe prices include the frame, worldwide shipping and a lifetime warranty, and verified residents and fellows get ${TRAINEE_PERCENT_OFF}% off the loupes.`,
        [`Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`, 'Every loupe price: /how-much-do-surgical-loupes-cost.'],
      ),
    ],
    recommendedProducts: ['Kepler', 'Apollo', 'Medusa', 'Galileo'],
    faqs: [
      faq('Do surgical loupes come with a light?', `HeliosX sells the light separately so you can choose brightness and battery, and every light fits every HeliosX frame. Ordered with loupes, the light is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`),
      faq('How bright should a surgical headlight be?', 'Around 50,000–70,000 lux suits 2.5x–4x. At 4x–6x, or in deep cavities, 100,000 lux or more helps; HeliosX Sirius reaches 150,000 lux with an adjustable spot.'),
      faq('Corded or cordless headlight for surgery?', 'Corded lights keep the frame lighter (10–12 g at the head) and run up to 10 hours, which suits long lists. The wireless Nova runs about 3 hours per battery, so it fits shorter cases where you can swap between them.'),
      faq('Can I add a light to ergonomic loupes?', 'Yes. Every HeliosX light fits every HeliosX frame, including ergonomic prismatic Apollo and Medusa.'),
    ],
    datePublished: added,
    dateModified: added,
  },
)

// RONIN X7 facts from roninsurgical.com, read 2026-10-29: $4,000 private
// practice, $3,500 resident/fellow, $5,250 hospital; 1-year warranty on the
// first two; headband with luminaire 4.9 oz soft-top / 5.5 oz hard-top; the
// battery rides at the hip: holster 6.1 oz, standard battery 8 oz, extended
// 16 oz; 350,000 lux (530,000 high-intensity); 6+ h at max intensity.
// Rewritten 2026-10-30 to compare headlight with headlight now that HeliosX
// sells head-mounted lights (lib/lights.ts HEADLIGHTS, battery on the band).
// HeliosX light warranty: 5 years (owner decision 2026-10-29), see /warranty.
const oz = (value: number) => Math.round(value * 28.35)
// Head weight 233 g as checked by the HeliosX team (2026-10-30), matching the
// lights page weight scale. Hip battery and holster from RONIN's own site.
const roninHead = 233
const roninSystem = roninHead + oz(6.1) + oz(8)
const headPrice = (slug: string) => lightFrom(slug)
const headlightsFrom = Math.min(...HEADLIGHTS.map((h) => headPrice(h.slug)))
const headlightsTo = Math.max(...HEADLIGHTS.map((h) => headPrice(h.slug)))
const headGrams = HEADLIGHTS.map((h) => h.grams)
const lightest = HEADLIGHTS.reduce((a, b) => (a.grams <= b.grams ? a : b))
const brightest = HEADLIGHTS.reduce((a, b) => (a.lux >= b.lux ? a : b))
const longest = HEADLIGHTS.reduce((a, b) => ((a.head?.hours[1] ?? 0) >= (b.head?.hours[1] ?? 0) ? a : b))
const roninComparison: Pick<SeoLandingPage, 'comparisonRows' | 'verdict'> = {
  comparisonRows: [
    { feature: 'Price', heliosx: `Headlights ${usd(headlightsFrom)}–${usd(headlightsTo)}, every price published. Loupe-mounted lights from ${usd(lightFrom('polaris'))}.`, other: 'RONIN X7: $4,000 private practice, $3,500 resident or fellow, $5,250 hospital package.' },
    { feature: 'Total weight', heliosx: `${Math.min(...headGrams)}–${Math.max(...headGrams)} g, battery included, all on the headband.`, other: `${roninHead} g headband and light, plus a ${oz(6.1)} g holster and ${oz(8)} g battery at the hip: about ${roninSystem} g in all.` },
    { feature: 'Battery', heliosx: `On the headband, no cable or hip pack. ${longest.name} runs up to ${longest.head?.hours[1]} hours; Antares ships with two batteries.`, other: '6+ hours at maximum intensity, on a hip-worn battery connected by cable.' },
    { feature: 'Brightness', heliosx: `Up to ${brightest.lux.toLocaleString('en-US')} lux (${brightest.name}), with an adjustable spot on every headlight.`, other: '350,000 lux, 530,000 in high-intensity mode; adjustable spot.' },
    { feature: 'Warranty', heliosx: `${LIGHT_WARRANTY_YEARS}-year limited warranty.`, other: '1 year on private-practice and resident packages; 3 years on the $5,250 hospital package.' },
  ],
  verdict: `Choose HeliosX for a headlight that costs ${usd(headlightsFrom)}–${usd(headlightsTo)} instead of $3,500–$5,250, carries its battery on the band instead of a cable to your hip, and comes with a ${LIGHT_WARRANTY_YEARS}-year warranty instead of one.`,
}
oct28NewPages.push({
  slug: 'ronin-headlight-alternative',
  title: 'RONIN headlight alternative: HeliosX headlights compared',
  metaTitle: `RONIN Headlight Alternative From ${usd(headlightsFrom)} | HeliosX`,
  description: `Compare the RONIN X7 surgical headlight ($3,500–$5,250) with HeliosX headlights from ${usd(headlightsFrom)}: price, total weight, battery, brightness and warranty.`,
  heroKicker: 'Comparison',
  primaryKeyword: 'ronin headlight alternative',
  relatedKeywords: ['ronin headlight', 'ronin surgical headlight', 'ronin x7', 'ronin x7 headlight', 'ronin x6', 'ronin headlight price', 'ronin surgical headlight price', 'ronin alternative', 'best surgical headlight', 'surgical headlight alternative', 'cordless surgical headlight'],
  audience: 'surgeons, residents and dentists comparing the RONIN surgical headlight with HeliosX headlights',
  answer: `HeliosX headlights cost ${usd(headlightsFrom)}–${usd(headlightsTo)}, against $3,500–$5,250 for the RONIN X7. They weigh ${Math.min(...headGrams)}–${Math.max(...headGrams)} g with the battery on the band, while the RONIN X7 puts ${roninHead} g on your head and its battery and holster at your hip, about ${roninSystem} g in all. ${brightest.name} reaches ${brightest.lux.toLocaleString('en-US')} lux, ${longest.name} runs up to ${longest.head?.hours[1]} hours, and every HeliosX light has a ${LIGHT_WARRANTY_YEARS}-year warranty against RONIN's 1 year.`,
  intro: 'RONIN makes a high-output headband light with a battery worn at the hip. HeliosX headlights put the light and battery on one band, with no cable to route, at a fraction of the price. Here is how they compare on the numbers each company publishes.',
  competitorName: 'RONIN X7',
  ...roninComparison,
  specTable: {
    title: 'HeliosX headlights against the RONIN X7',
    lead: `Every HeliosX headlight carries its battery on the band. Weights include the battery. Prices in USD, ${LIGHT_BUNDLE_PERCENT_OFF}% off with a pair of loupes.`,
    columns: ['Headlight', 'Brightness', 'Total weight', 'Runtime per charge', 'Spot', 'Band', 'Price'],
    rows: [
      ...[...HEADLIGHTS].sort((a, b) => a.grams - b.grams).map((h) => [
        h.name,
        `${h.lux.toLocaleString('en-US')} lux`,
        `${h.grams} g`,
        `${headHours(h)}${h.head && h.head.batteries > 1 ? `, ${h.head.batteries} batteries` : ''}`,
        h.head ? `Adjustable, ${h.head.spotRange[0]}–${h.head.spotRange[1]} mm` : 'Adjustable',
        h.head?.band ?? '',
        usd(headPrice(h.slug)),
      ]),
      ['RONIN X7 (for comparison)', '350,000 lux (530,000 high-intensity)', `About ${roninSystem} g: ${roninHead} g on the head, the rest at the hip`, '6+ hrs at maximum', 'Adjustable', 'Soft-top or hard-top, battery on a hip cable', '$3,500–$5,250'],
    ],
    note: 'RONIN head weight is the headband with light; its battery holster, standard battery, prices and other figures are from roninsurgical.com, checked October 29, 2026. HeliosX figures are from our product specifications.',
  },
  proofPoints: [`Headlights from ${usd(headlightsFrom)}, every price published.`, 'Battery on the band: no hip pack or cable.', `${LIGHT_WARRANTY_YEARS}-year warranty on every light.`],
  sections: [
    section(
      'What RONIN offers',
      'RONIN Surgical, based in Austin, Texas, sells the X7 headlight on a soft-top or hard-top headband, with the battery in a holster at your hip. Its site lists 350,000 lux (530,000 in high-intensity mode), an adjustable spot and 6+ hours at maximum intensity. Packages cost $4,000 for private practice and $3,500 for residents and fellows, each with a 1-year warranty, or $5,250 for hospitals with 3 years.',
      [],
      'https://www.roninsurgical.com/',
      'RONIN Surgical official site; checked October 29, 2026',
    ),
    section(
      'Total weight, not just the part on your head',
      `The RONIN X7 headband with its light weighs ${roninHead} g, and the battery is separate: RONIN lists a ${oz(6.1)} g holster and an ${oz(8)} g standard battery worn at the hip, connected by cable. HeliosX headlights put everything, battery included, on the band: ${lightest.name} weighs ${lightest.grams} g, ${roninHead - lightest.grams} g less than the RONIN on your head alone, and even Canopus XL with its top strap is ${Math.max(...headGrams)} g.`,
      ['No battery pack to clip on under a gown.', 'No cable running from your head to your waist.', 'Canopus XL adds a strap over the top to hold it steady on long cases.'],
    ),
    section(
      'Brightness and runtime',
      `RONIN publishes higher peak output. HeliosX headlights are built for a full operating day: ${brightest.name} reaches ${brightest.lux.toLocaleString('en-US')} lux, ${longest.name} runs up to ${longest.head?.hours[1]} hours on a charge, and Antares ships with two batteries so one is always charging. Every HeliosX headlight has an adjustable spot.`,
      HEADLIGHTS.map((h) => `${h.name}: ${h.lux.toLocaleString('en-US')} lux, ${h.grams} g, ${headHours(h)}, ${usd(headPrice(h.slug))}. ${h.bestFor}`),
      '/product/lights',
      'Compare all HeliosX headlights and loupe lights',
    ),
    section(
      'Prefer a light on your loupes?',
      `If you already wear loupes, a HeliosX loupe light clips to the frame and adds only 10–12 g at the head, with the battery at your waist or neck. Loupe lights start at ${usd(lightFrom('polaris'))}, and Sirius reaches 150,000 lux with an adjustable spot.`,
      ['Surgical loupes with light, by magnification: /surgical-loupes-with-light.'],
    ),
  ],
  recommendedProducts: ['Kepler', 'Apollo', 'Medusa', 'Galileo'],
  faqs: [
    faq('How much does a RONIN headlight cost?', `RONIN lists the X7 at $4,000 for private practice, $3,500 for residents and fellows, and $5,250 for hospitals (checked October 29, 2026). HeliosX headlights cost ${usd(headlightsFrom)}–${usd(headlightsTo)}.`),
    faq('What is the best RONIN alternative?', `${lightest.name} is our lightest headlight at ${lightest.grams} g with up to ${lightest.head?.hours[1]} hours per charge, for ${usd(headPrice(lightest.slug))}. ${brightest.name} is our brightest at ${brightest.lux.toLocaleString('en-US')} lux, for ${usd(headPrice(brightest.slug))}. Both carry the battery on the band.`),
    faq('How much does the RONIN X7 weigh?', `The RONIN X7 headband with light weighs ${roninHead} g. RONIN lists a ${oz(6.1)} g battery holster and an ${oz(8)} g standard battery, worn at the hip: about ${roninSystem} g in total. HeliosX headlights weigh ${Math.min(...headGrams)}–${Math.max(...headGrams)} g with the battery on the band.`),
    faq('Is HeliosX affiliated with RONIN?', 'No. RONIN Surgical and HeliosX are separate companies. RONIN is a trademark of its owner. RONIN figures on this page come from its own site.'),
  ],
  datePublished: added,
  dateModified: '2026-10-30',
})
updates['ronin-headlight-alternative'] = roninComparison

// Send the hygienist-light searches to the new page instead of splitting them.
const hygieneLightPointer = section(
  'Dental hygiene loupes with light',
  'Hygienists have their own light needs: a full column of recalls, posterior and sub-gingival work, and a frame worn all day. We cover complete hygienist setups, with prices, on their own page.',
  ['Hygienist setups with prices: /dental-hygiene-loupes-with-light.'],
)
updates['dental-loupes-with-light'].replaceSection = {
  ...updates['dental-loupes-with-light'].replaceSection,
  'Dental hygiene loupes with light: what changes': hygieneLightPointer,
}
updates['dental-loupes-with-light'].removeKeywords = ['dental hygiene loupes with light', 'loupes with light for dental hygienist', 'dental loupes with light for dental hygienist', 'dental hygienist loupes with light']
updates['loupes-for-dental-hygiene'].replaceSection = {
  'Light matters more in hygiene than most buyers expect': section(
    'Light matters more in hygiene than most buyers expect',
    'Sub-gingival work, distal surfaces and the posterior sextants sit in the shadow of your own head, so most hygienists add a loupe-mounted light. Choose it with the loupe, because it is mounted to the frame you order.',
    ['Five hygienist setups, loupe and light, with prices: /dental-hygiene-loupes-with-light.'],
  ),
}
updates['surgical-loupes'].addFaqs = [
  ...(updates['surgical-loupes'].addFaqs ?? []),
  faq('Which light should I use with surgical loupes?', 'Match it to magnification: Vega up to 4x, Rigel at 4x–6x or in deep fields, Sirius for high magnification. Setups with prices: /surgical-loupes-with-light.'),
]

// applyEditorialRevisions strips comparison tables from pages without a
// revision, so the Schultz table is restored here.
updates['heliosx-vs-schultz'] = schultzComparison

export function applyOct28Round(pages: SeoLandingPage[]) {
  for (const page of pages) {
    const update = updates[page.slug]
    if (!update) continue
    const { prependSections, replaceSection, addFaqs, replaceFaq, addKeywords, removeKeywords, ...fields } = update
    Object.assign(page, fields, { dateModified: updated })
    if (replaceSection)
      page.sections = page.sections.map((s) => replaceSection[s.title] ?? s)
    if (prependSections) page.sections = [...prependSections, ...page.sections]
    if (replaceFaq)
      page.faqs = page.faqs.map((f) => (replaceFaq[f.question] ? { ...f, answer: replaceFaq[f.question] } : f))
    if (addFaqs) page.faqs = [...page.faqs, ...addFaqs.filter((f) => !page.faqs.some((e) => e.question === f.question))]
    if (addKeywords) page.relatedKeywords = Array.from(new Set([...page.relatedKeywords, ...addKeywords]))
    if (removeKeywords) page.relatedKeywords = page.relatedKeywords.filter((k) => !removeKeywords.includes(k.toLowerCase()))
  }
  // Oct 30: every guide opens with the HeliosX authority line (lib/brand-claims.ts).
  for (const page of pages) if (!page.authorityAudience && !/110 countries/.test(page.intro)) page.intro = `${authorityLead} ${page.intro}`.trim()
}

const authorityLead = 'Trusted by clinicians in more than 110 countries and fitted at hundreds of expos, HeliosX is the world standard in custom ergonomic loupes.'
