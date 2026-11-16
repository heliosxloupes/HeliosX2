import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { LIGHT_BUNDLE_PERCENT_OFF, PRESCRIPTION_PRICE, TRAINEE_PERCENT_OFF, magnificationPriceByProduct } from './pricing'
import { lightFrom } from './lights'
import {
  allModels,
  leadTime,
  light,
  lightEntry,
  loupeEntry,
  lux,
  modelColumns,
  modelName,
  modelRows,
  photo,
  priceScale,
  priceTiers,
  returns,
  shipping,
  type Tier,
} from './seo-bofu-pages'

// Nov 16 2026, wave 4: ten bottom-of-funnel pages for searches with few
// impressions but clear buying intent, from 90 days of Search Console
// (query, impressions, average position, page Google showed):
//   galilean loupes 161 @ 56 · galilean dental loupes · galilean loupes price
//   4x dental loupes · 3.0x dental loupes · 5x dental loupes (no page)
//   surgical loupes 6x 3 @ 39 · surgical loupes 6x manufacturer
//   dental loupes with wireless light 456 @ 51 · best wireless dental loupe light 137 @ 56
//   prescription dental loupes 28 @ 33 · rx loupes · prescription loupes
//   surgical loupes canada 13 @ 47 · dental loupes canada · ergo loupes canada
//   best surgical loupes uk 7 · dental loupes uk prices · univet loupes uk
//   lumadent loupes 34 · lumadent loupes price 15 @ 10 · lumadent dental loupes
//   ergonomic loupes cost 23 · ergonomic loupes price 15 · ergo loupes price 10
// Same format as waves 1–3: answer and chart first, quick picks, one entry
// per pick with photo and best-for tags, tips, FAQs. No page targets a
// search another page already owns; each links to the page that does.
// Competitor prices come only from the brand's own store, checked on the date
// shown. Tax rules name the authority that sets them.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const prices = (model: string) => Object.values(magnificationPriceByProduct[model])
const from = (model: string) => usd(Math.min(...prices(model)))
const top = (model: string) => usd(Math.max(...prices(model)))
const range = (model: string) => `${from(model)}–${top(model)}`
const at = (model: string, mag: string) => usd(magnificationPriceByProduct[model][mag])
const section = (title: string, body: string, bullets: string[] = []): ContentSection => ({ title, body, bullets })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const published = '2026-11-16'
const checked = 'Checked November 16, 2026.'
const tier = (label: string, note: string, picks: [string, string][]): Tier => ({
  label,
  note,
  picks: picks.map(([id, detail]) => ({ label: id.includes('-') ? id : modelName(id), href: `#${id}`, detail })),
})
const alt = (m: string, keyword: string) => ({ ...photo[m], alt: `${keyword}: ${photo[m].alt}` })
const withAlt = <T extends { id: string; image?: unknown }>(e: T, keyword: string) => ({ ...e, image: alt(e.id, keyword) })
const atMagRows = (mag: string, models: string[]) =>
  models.map((m) => [modelName(m), m === 'kepler' ? 'Prismatic' : 'Ergonomic prismatic', mag, m === 'kepler' ? '68–85 g' : m === 'apollo' ? '55–58 g' : '56–65 g', at(m, mag)])

// LumaDent store prices, lumadent.com/products.json (checked Nov 16, 2026).
const luma = {
  galileanVario: { '2.5x': 495, '3.0x': 795 },
  galileanTtl: { '2.5x': 1095, '3.0x': 1395 },
  prismVario: { '3.5x': 1095, '4.5x': 1395 },
  prismTi: { '3.5x': 1695, '4.5x': 1995, '6.0x': 2295 },
  ergoAirTiTtl: { '3.0x': 1995, '3.5x': 2295, '4.0x': 2295, '5.0x': 2595, '6.5x': 2895, '8.0x': 3195 },
  ergoAirTiVario: { '3.0x': 1395, '4.0x': 1695, '5.0x': 1995 },
  ergoMaxTiTtl: { '2.5x': 2295, '5.0x': 2595, '7.5x': 2895, '10.0x': 3195 },
  trinity: 3495,
}
// Q-Optics ErgoAngle retail, q-optics.com/pages/brightnowdental (checked Nov 15, 2026).
const qoErgo = { '3.0x': 2090, '3.5x': 2490, '4.0x': 2590, '4.5x': 2690 }

export const bofuPagesNov16: SeoLandingPage[] = [
  // 1. Galilean loupes.
  {
    slug: 'galilean-loupes',
    title: 'Galilean Loupes: A Complete Guide, With Prices',
    metaTitle: 'Galilean Loupes Guide + Field of View Chart & Prices | HeliosX',
    description: `Galilean loupes explained: what 2.5x–3.5x Galilean optics do well, field of view by model, and every price. HeliosX Galilean loupes from ${from('newton')}.`,
    heroKicker: 'Galilean loupes',
    heroImage: { src: photo.galileo.src, alt: 'Galilean loupes: HeliosX Galileo loupes on a black frame', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'galilean loupes',
    relatedKeywords: ['galilean dental loupes', 'galilean loupes price', 'galilean surgical loupes', '2.5x galilean loupes'],
    audience: 'Dentists, hygienists, students and surgeons choosing 2.5x–3.5x loupes',
    intro:
      'Galilean loupes are the simplest, lightest kind of loupe: a short two-lens telescope that magnifies 2.5x to 3.5x with a wide field of view. They are the first pair for most dentists, hygienists, students and general surgeons. Here is what Galilean optics do well, where they stop, and what each HeliosX Galilean pair costs.',
    answer: `Galilean loupes magnify 2.5x–3.5x with a short, light telescope and a wide field. HeliosX makes two: Newton (${range('newton')}, 40–50 g with frame) and Galileo (${range('galileo')}, the widest field in the range at 150–170 mm at 2.5x). Above 3.5x, prismatic loupes stay sharper: Kepler from ${from('kepler')}.`,
    why: {
      title: 'Why Galilean loupes are where most people start',
      body: [
        'Galilean optics use two lenses and no prism, so the barrels are short and the pair is light. At 2.5x–3.5x that gives a wide, bright view of the whole field, which suits hygiene, restorative dentistry and general surgery.',
        'Their limit is magnification. Past about 3.5x the edges soften and the field narrows quickly, which is where prismatic loupes take over. Pick Galilean when a wide view matters more than the last bit of detail.',
      ],
    },
    tierChart: {
      title: 'Galilean loupes chart: field of view against magnification',
      lead: 'Both HeliosX Galilean loupes, and where prismatic takes over. Tap one to jump to it.',
      scale: ['Wider field', 'More detail'],
      tiers: [
        tier('2.5x', 'Widest field, hygiene and students', [['newton', `from ${at('newton', '2.5x')}`], ['galileo', `from ${at('galileo', '2.5x')}`]]),
        tier('3.0x–3.5x', 'Restorative dentistry, general surgery', [['newton', `${at('newton', '3.5x')} at 3.5x`], ['galileo', `${at('galileo', '3.5x')} at 3.5x`]]),
        tier('4x and up', 'Past the Galilean range: prismatic', [['kepler', `from ${from('kepler')}`]]),
      ],
    },
    specTable: {
      title: 'Galilean loupes: models and prices',
      columns: ['Model', 'Optics', 'Magnification', 'Field of view at 2.5x', 'Price (USD)'],
      rows: [
        ['Newton', 'Galilean', '2.5x / 3.0x / 3.5x', '80–120 mm', `${at('newton', '2.5x')} / ${at('newton', '3.0x')} / ${at('newton', '3.5x')}`],
        ['Galileo', 'Galilean', '2.5x / 3.0x / 3.5x', '150–170 mm', `${at('galileo', '2.5x')} / ${at('galileo', '3.0x')} / ${at('galileo', '3.5x')}`],
      ],
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Verified students and residents get ${TRAINEE_PERCENT_OFF}% off.`,
    },
    quickPicks: {
      title: 'Quick picks: which Galilean pair?',
      rows: [
        { task: 'Student or hygienist, lightest pair', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'Dentist, widest view of the quadrant', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'General surgery, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'You need 4x or more', picks: [{ label: 'Kepler', href: '#kepler' }] },
      ],
    },
    items: {
      title: 'Galilean loupes, and what each is best for',
      entries: [
        withAlt(loupeEntry('newton', [
          `The lightest pair we make, 40–50 g with frame, at ${at('newton', '2.5x')} (2.5x), ${at('newton', '3.0x')} (3.0x) and ${at('newton', '3.5x')} (3.5x).`,
          'Its field is 80–120 mm at 2.5x, narrower than Galileo. Choose it when weight and price matter most.',
        ], ['Students', 'Hygiene', 'Assistants']), 'Galilean loupes'),
        withAlt(loupeEntry('galileo', [
          `The everyday Galilean pair, ${range('galileo')}, with six frame styles included and a 150–170 mm field at 2.5x, the widest in the range.`,
          `About $100 more than Newton at each magnification. Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`,
        ], ['General dentistry', 'General surgery', 'Hygiene'], { text: 'Most dentists choose 3.0x or 3.5x.', label: 'Shop Galileo', href: '/product/galileo' }), 'Galilean loupes'),
        withAlt(loupeEntry('kepler', [
          `Not Galilean: prismatic, for when you need 4x–6x. ${range('kepler')}, 68–85 g with frame.`,
          'Included here because it is where most people go when Galilean magnification runs out.',
        ], ['Endodontics', 'Microsurgery']), 'Galilean loupes'),
      ],
    },
    tips: {
      title: 'Tips for buying Galilean loupes',
      items: [
        { title: 'Pick 3.0x–3.5x if you are unsure.', body: 'Many students who start at 2.5x move up within a year. 3.0x–3.5x still keeps a wide field.' },
        { title: 'Field of view decides comfort.', body: 'A wider field means less head movement to keep the whole site in view. Galileo is widest.' },
        { title: 'Measure your working distance.', body: 'Every pair is focused to it. Guide: /measurements.' },
        { title: 'Compare the two designs side by side.', body: 'Galilean against prismatic, in detail: /education/galilean-vs-prismatic-loupes.' },
      ],
    },
    proofPoints: ['Galilean from $695', 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      section('Galilean vs prismatic loupes', 'Galilean loupes use two lenses; prismatic loupes add a prism that folds a longer light path into the barrel. Prismatic stays sharp at higher magnification but weighs more and costs more.', [
        'Galilean: 2.5x–3.5x, lighter, wider field, lower price.',
        `Prismatic: 4x and up, sharper edges at high magnification. Kepler ${range('kepler')}.`,
        `Ergonomic prismatic: angled optics for an upright head. Apollo and Medusa from ${from('apollo')}.`,
        'Full comparison: /education/galilean-vs-prismatic-loupes.',
      ]),
      section('How ordering works', `Choose the model, magnification and frame online. After checkout you send your measurements and we review them before production. ${leadTime} ${returns}`),
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Kepler'],
    faqs: [
      faq('What are Galilean loupes?', 'Loupes with a simple two-lens telescope, usually 2.5x–3.5x. They are light, have a wide field of view and cost less than prismatic loupes.'),
      faq('What is the best magnification for Galilean loupes?', '3.0x–3.5x suits most dentists and general surgeons; 2.5x suits hygienists and students who want the widest view. Above 3.5x, choose prismatic.'),
      faq('How much do Galilean loupes cost?', `At HeliosX, Newton costs ${range('newton')} and Galileo ${range('galileo')}, with shipping included.`),
      faq('Are Galilean loupes good for dental students?', `Yes. Most dental programs start students at 2.5x–3.5x Galilean. Verified students get ${TRAINEE_PERCENT_OFF}% off.`),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 2. 4x loupes.
  {
    slug: '4x-loupes',
    title: '4x Loupes: Every Option and Price at 4.0x',
    metaTitle: '4x Loupes: Dental & Surgical Price Chart | HeliosX',
    description: `4x loupes for dentistry and surgery: every 4.0x option, prismatic and ergonomic, with prices from ${at('kepler', '4.0x')}. Field, weight and who needs 4x.`,
    heroKicker: '4x loupes',
    heroImage: { src: photo.kepler.src, alt: '4x loupes: HeliosX Kepler prismatic loupes on a metal frame', caption: `Kepler 4.0x · ${at('kepler', '4.0x')} USD` },
    primaryKeyword: '4x loupes',
    relatedKeywords: ['4x dental loupes', '4x surgical loupes', '4.0x loupes', '4x prismatic loupes'],
    audience: 'Dentists and surgeons moving up from 2.5x–3.5x',
    intro:
      '4x is where loupes change design: Galilean optics run out of sharpness around 3.5x, so every 4x loupe worth buying is prismatic. It is the step up for endodontics, implants, crown margins, vascular and hand surgery. Here is every HeliosX option at 4.0x, what it costs, and how to tell if you need it.',
    answer: `HeliosX makes three 4x loupes: Kepler 4.0x (${at('kepler', '4.0x')}, conventional prismatic), Medusa 4.0x (${at('medusa', '4.0x')}, ergonomic, working distance adjusts 300–600 mm) and Apollo 4.0x (${at('apollo', '4.0x')}, ergonomic, fixed working distance). All are prismatic, because Galilean optics soften above 3.5x.`,
    why: {
      title: 'Why 4x is a different kind of loupe',
      body: [
        'Going from 3.5x to 4x is not just more magnification. The field of view narrows and the depth of field gets shallower, so the loupe has to be prismatic to stay sharp, and your working distance has to be measured carefully.',
        'Move to 4x when you keep leaning in to see detail at 3.5x. If a wide view of the whole site still matters more, stay at 3.0x–3.5x.',
      ],
    },
    tierChart: {
      title: '4x loupes price chart',
      lead: 'Every HeliosX loupe at 4.0x, from the lowest price. Tap one to jump to it.',
      scale: priceScale,
      tiers: [
        tier(`${at('kepler', '4.0x')}`, 'Conventional prismatic', [['kepler', '68–85 g']]),
        tier(`${at('medusa', '4.0x')}–${at('apollo', '4.0x')}`, 'Ergonomic prismatic', [['medusa', 'Adjustable 300–600 mm'], ['apollo', 'Fixed working distance']]),
      ],
    },
    specTable: {
      title: '4x loupes: models and prices',
      columns: modelColumns,
      rows: atMagRows('4.0x', ['kepler', 'medusa', 'apollo']),
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. HeliosX does not make 4.5x.`,
    },
    quickPicks: {
      title: 'Quick picks: which 4x loupe?',
      rows: [
        { task: 'Lowest price at 4x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Neck strain, sit and stand', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Upright head, one working distance', picks: [{ label: 'Apollo', href: '#apollo' }] },
        { task: 'Not sure you need 4x yet', picks: [{ label: 'Galilean loupes', href: '/galilean-loupes' }] },
      ],
    },
    items: {
      title: '4x loupes, and what each is best for',
      entries: [
        withAlt(loupeEntry('kepler', [
          `Kepler 4.0x is ${at('kepler', '4.0x')}, the lowest-cost 4x pair we make, and steps to ${at('kepler', '5.0x')} at 5x and ${at('kepler', '6.0x')} at 6x.`,
          'Conventional prismatic, so you look down through it, at 68–85 g with frame. Good for endo, implants and fine surgical work when posture is not the main problem.',
        ], ['Endodontics', 'Implants', 'Vascular']), '4x loupes'),
        withAlt(loupeEntry('medusa', [
          `Medusa 4.0x is ${at('medusa', '4.0x')}: ergonomic prismatic, with a working distance you adjust from 300 to 600 mm.`,
          'One pair works seated and standing, which also helps if you are not sure of your working distance. 56–65 g with frame.',
        ], ['Sit and stand', 'Posture', 'Surgery']), '4x loupes'),
        withAlt(loupeEntry('apollo', [
          `Apollo 4.0x is ${at('apollo', '4.0x')}: ergonomic prismatic at a fixed working distance of 420, 450, 500 or 550 mm.`,
          'Angled optics keep your head more upright through long appointments or cases. 55–58 g with frame.',
        ], ['Posture', 'Restorative', 'Long cases']), '4x loupes'),
      ],
    },
    tips: {
      title: 'Tips for buying 4x loupes',
      items: [
        { title: 'Measure working distance carefully.', body: 'Depth of field is shallower at 4x, so a wrong distance shows more. Guide: /measurements.' },
        { title: 'Add more light.', body: 'Magnification darkens the view. At 4x, Vega (70,000 lux) is the usual match: /best-dental-loupe-lights.' },
        { title: 'Try 4x before 5x or 6x.', body: 'Most clinicians who need more than 3.5x find 4x enough for daily work.' },
        { title: 'Consider ergonomics now.', body: 'You lean in more at higher magnification; Apollo and Medusa keep your head more upright.' },
      ],
    },
    proofPoints: ['4x from $1,195', 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      section('Who needs 4x loupes', 'Clinicians who need finer detail than 3.5x shows, every day:', [
        'Endodontics, implants and crown margins: /loupes-for-endodontics.',
        'Vascular, hand and plastic surgery: /vascular-surgery-loupes.',
        'Anyone moving up from Galilean: /galilean-loupes.',
        'Higher still: /6x-loupes.',
      ]),
      section('How ordering works', `Choose the model and 4.0x online. After checkout you send your measurements and we review them before production. ${leadTime} ${returns}`),
    ],
    recommendedProducts: ['Kepler', 'Medusa', 'Apollo'],
    faqs: [
      faq('Are 4x loupes too strong for dentistry?', 'Not for endodontics, implants or crown margins. For hygiene and general restorative work, 2.5x–3.5x keeps a wider field.'),
      faq('Can you get 4x Galilean loupes?', 'Some brands sell them, but Galilean optics soften at the edges above about 3.5x. HeliosX 4x loupes are all prismatic.'),
      faq('How much do 4x loupes cost?', `At HeliosX, ${at('kepler', '4.0x')} (Kepler), ${at('medusa', '4.0x')} (Medusa) or ${at('apollo', '4.0x')} (Apollo), with shipping included.`),
      faq('What light do I need with 4x loupes?', 'A brighter one than at 3.5x. Vega at 70,000 lux is the usual match; see /best-dental-loupe-lights.'),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 3. 6x loupes (and 8x).
  {
    slug: '6x-loupes',
    title: '6x Loupes: High-Magnification Options and Prices',
    metaTitle: '6x Loupes: Surgical Price Chart, Up to 8.5x | HeliosX',
    description: `6x surgical loupes and higher: every prismatic option at 6.0x, 8.0x and 8.5x, with prices from ${at('kepler', '6.0x')}. Field, weight and lighting.`,
    heroKicker: '6x loupes',
    heroImage: { src: photo.medusa.src, alt: '6x loupes: HeliosX Medusa high-magnification ergonomic loupes', caption: `Medusa 6.0x · ${at('medusa', '6.0x')} USD` },
    primaryKeyword: '6x loupes',
    relatedKeywords: ['surgical loupes 6x', '6x surgical loupes', '8x loupes', 'high magnification loupes'],
    audience: 'Surgeons and endodontists working at 6x and above',
    intro:
      'At 6x and above, loupes are close to the limit of what you can wear: the field is small, depth of field is shallow, and the light has to be bright. Neurosurgeons, spine, microvascular and hand surgeons and some endodontists work here. Here is every HeliosX loupe at 6x and above, with prices, and when a microscope is the better tool.',
    answer: `HeliosX makes three 6x loupes: Kepler 6.0x (${at('kepler', '6.0x')}), Medusa 6.0x (${at('medusa', '6.0x')}) and Apollo 6.0x (${at('apollo', '6.0x')}). Medusa also comes in 8.0x (${at('medusa', '8.0x')}) and 8.5x (${at('medusa', '8.5x')}), the highest we make. All are prismatic.`,
    why: {
      title: 'Why 6x needs a different setup',
      body: [
        'At 6x a small head movement moves the whole view, and depth of field is only a few centimetres. Fit, working distance and a steady posture matter more than at any lower magnification.',
        'You also need much more light: magnification darkens the view, and at 6x most surgeons wear a 100,000 lux light or a headlight. Where an operating microscope is indicated, loupes do not replace it.',
      ],
    },
    tierChart: {
      title: '6x and higher loupes price chart',
      lead: 'Every HeliosX loupe at 6x and above. Tap one to jump to it.',
      scale: ['6x', '8.5x'],
      tiers: [
        tier('6.0x', 'Prismatic and ergonomic', [['kepler', at('kepler', '6.0x')], ['medusa', at('medusa', '6.0x')], ['apollo', at('apollo', '6.0x')]]),
        tier('8.0x–8.5x', 'Ergonomic, adjustable distance', [['medusa', `${at('medusa', '8.0x')}–${at('medusa', '8.5x')}`]]),
      ],
    },
    specTable: {
      title: '6x loupes: models and prices',
      columns: modelColumns,
      rows: [...atMagRows('6.0x', ['kepler', 'medusa', 'apollo']), ['Medusa', 'Ergonomic prismatic', '8.0x / 8.5x', '56–65 g', `${at('medusa', '8.0x')} / ${at('medusa', '8.5x')}`]],
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}.`,
    },
    quickPicks: {
      title: 'Quick picks: which high-magnification loupe?',
      rows: [
        { task: 'Lowest price at 6x', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Neurosurgery, spine, sit and stand', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'More than 6x', picks: [{ label: 'Medusa 8.0x–8.5x', href: '#medusa' }] },
        { task: 'Upright head at one distance', picks: [{ label: 'Apollo', href: '#apollo' }] },
      ],
    },
    items: {
      title: '6x loupes, and what each is best for',
      entries: [
        withAlt(loupeEntry('kepler', [
          `Kepler 6.0x is ${at('kepler', '6.0x')}, the lowest-cost route to 6x. Conventional prismatic, 68–85 g with frame.`,
          'You look down through it, so it suits shorter high-detail tasks more than long cases where neck posture is the problem.',
        ], ['Microvascular', 'Hand surgery', 'Endodontics']), '6x loupes'),
        withAlt(loupeEntry('medusa', [
          `Medusa runs from ${at('medusa', '6.0x')} at 6.0x to ${at('medusa', '8.5x')} at 8.5x, with a working distance you adjust from 300 to 600 mm.`,
          'Ergonomic optics keep your head more upright, and the adjustable distance lets you refocus as you move between sitting and standing. 56–65 g with frame.',
        ], ['Neurosurgery', 'Spine', 'Up to 8.5x']), '6x loupes'),
        withAlt(loupeEntry('apollo', [
          `Apollo 6.0x is ${at('apollo', '6.0x')}: ergonomic prismatic at a fixed working distance chosen at order.`,
          'For surgeons who work at one table height and want posture first at high magnification. 55–58 g with frame.',
        ], ['Posture', 'Long cases']), '6x loupes'),
      ],
    },
    tips: {
      title: 'Tips for buying 6x loupes',
      items: [
        { title: 'Get your working distance exactly right.', body: 'Depth of field is shallow at 6x. Measure in your operating posture: /measurements.' },
        { title: 'Pair them with a bright light.', body: 'Rigel (100,000 lux) or a headlight such as Canopus: /surgical-loupes-with-light.' },
        { title: 'Build up to it.', body: 'Many surgeons use 4x for most of a case and 6x for the critical steps.' },
        { title: 'Know when to use the microscope.', body: 'Loupes do not replace an operating microscope where one is indicated.' },
      ],
    },
    proofPoints: ['Up to 8.5x', 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      section('Who uses 6x loupes', 'Short answers, with the page for each:', [
        'Neurosurgery: /neurosurgery-loupes.',
        'Spine: /spine-surgery-loupes.',
        'Vascular and hand: /vascular-surgery-loupes and /hand-surgery-loupes.',
        'A step down: /4x-loupes.',
      ]),
      section('How ordering works', `Choose the model and magnification online. After checkout you send your measurements and we review them before production. ${leadTime} ${returns}`),
    ],
    recommendedProducts: ['Medusa', 'Kepler', 'Apollo'],
    faqs: [
      faq('Who needs 6x loupes?', 'Mainly neurosurgeons, spine, microvascular and hand surgeons, and some endodontists. Most dentists and general surgeons work at 2.5x–4x.'),
      faq('What is the highest magnification loupe?', `At HeliosX, Medusa at 8.5x (${at('medusa', '8.5x')}). Above that, most surgeons switch to an operating microscope.`),
      faq('How much do 6x loupes cost?', `At HeliosX, ${at('kepler', '6.0x')} (Kepler), ${at('medusa', '6.0x')} (Medusa) or ${at('apollo', '6.0x')} (Apollo), with shipping included.`),
      faq('Do 6x loupes replace a microscope?', 'No. Where an operating microscope is indicated, loupes do not replace it.'),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 4. Wireless loupe light.
  {
    slug: 'wireless-loupe-light',
    title: 'Wireless Loupe Lights: Options, Battery Life and Prices',
    metaTitle: 'Wireless Loupe Light: Battery & Brightness Chart | HeliosX',
    description: `Wireless dental loupe lights compared with corded ones: brightness, battery life, weight and price. HeliosX Nova cordless from ${usd(lightFrom('nova'))}.`,
    heroKicker: 'Wireless loupe light',
    heroImage: { src: photo.nova.src, alt: 'Wireless loupe light: HeliosX Nova cordless light with spare batteries and dock', caption: `Nova · ${usd(lightFrom('nova'))} USD` },
    primaryKeyword: 'wireless loupe light',
    relatedKeywords: ['dental loupes with wireless light', 'wireless dental loupe light', 'cordless loupe light', 'best wireless loupe light'],
    audience: 'Dentists and hygienists who want a light with no cord',
    intro:
      'A wireless loupe light puts the battery on the light itself, so there is no cord running to your belt or collar. You trade some runtime and a little weight on the frame for freedom of movement. Here is how wireless and corded lights compare, and what each HeliosX option costs.',
    answer: `HeliosX Nova is a wireless loupe light: ${lux('nova')}, ${light('nova').headWeight}, about ${light('nova').wireless!.hoursPerBattery} hours per battery with ${light('nova').wireless!.batteries} batteries included, ${usd(lightFrom('nova'))}. Corded lights are lighter on the head (10–12 g) and run longer; HeliosX headlights carry their battery on the headband.`,
    why: {
      title: 'Why wireless is a trade-off, not an upgrade',
      body: [
        'No cord means nothing to snag between patients and nothing clipped to your scrubs. The cost is weight on the frame, because the battery sits on the light, and shorter runtime per battery.',
        'Swapping batteries between appointments solves the runtime. Whether the extra weight bothers you depends on your loupes: on a light Galilean pair it is easy to wear; on a heavy prismatic pair, a corded light keeps the front lighter.',
      ],
    },
    tierChart: {
      title: 'Loupe light chart: wireless against corded',
      lead: 'From no cord to the lightest on the head. Tap one to jump to it.',
      scale: ['No cord', 'Least weight on the head'],
      tiers: [
        tier('Wireless', 'Battery on the light', [['nova', `${lux('nova')} · ${usd(lightFrom('nova'))}`]]),
        tier('Headlight', 'Battery on the headband', [['arcturus', `${lux('arcturus')} · ${usd(lightFrom('arcturus'))}`]]),
        tier('Corded', 'Battery on a clip or pack', [['polaris', `${lux('polaris')} · from ${usd(lightFrom('polaris'))}`], ['vega', `${lux('vega')} · from ${usd(lightFrom('vega'))}`]]),
      ],
    },
    specTable: {
      title: 'Wireless and corded loupe lights: specs and prices',
      columns: ['Light', 'Type', 'Brightness', 'Weight on head', 'Price (USD)'],
      rows: ['nova', 'arcturus', 'polaris', 'vega', 'rigel'].map((s) => [light(s).name, light(s).kind === 'wireless' ? 'Wireless' : light(s).kind === 'head' ? 'Headlight' : 'Corded', lux(s), light(s).headWeight, `from ${usd(lightFrom(s))}`]),
      note: `Any light is ${LIGHT_BUNDLE_PERCENT_OFF}% off when ordered with loupes. Full range: /product/lights.`,
    },
    quickPicks: {
      title: 'Quick picks: which light?',
      rows: [
        { task: 'No cord at all', picks: [{ label: 'Nova', href: '#nova' }] },
        { task: 'No cord, and very bright', picks: [{ label: 'Arcturus headlight', href: '#arcturus' }] },
        { task: 'Lightest on the frame, all day', picks: [{ label: 'Polaris', href: '#polaris' }] },
        { task: '4x loupes', picks: [{ label: 'Vega', href: '#vega' }] },
      ],
    },
    items: {
      title: 'Wireless and corded loupe lights, and what each is best for',
      entries: [
        lightEntry('nova', 'Nova', [
          `The wireless one: ${lux('nova')}, ${light('nova').headWeight}, ${usd(lightFrom('nova'))} with ${light('nova').wireless!.batteries} batteries and a charging dock.`,
          `Each battery lasts about ${light('nova').wireless!.hoursPerBattery} hours and charges in ${light('nova').wireless!.chargeTime.toLowerCase()}, so you swap between appointments. Best on 2.5x–3.5x loupes.`,
        ], ['No cord', 'Hygiene', '2.5x–3.5x'], { text: `Order it with loupes and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`, label: 'Shop Nova', href: '/product/lights' }),
        lightEntry('arcturus', 'Arcturus headlight', [
          `No cord to your belt: the light sits on its own headband with the battery at the back. ${lux('arcturus')}, ${usd(lightFrom('arcturus'))}.`,
          `It weighs ${light('arcturus').headWeight} on the head, spread around the band rather than on the loupes. More headlights: /dental-headlights.`,
        ], ['Very bright', 'No loupe mount']),
        lightEntry('polaris', 'Polaris', [
          `Corded: ${lux('polaris')} at ${light('polaris').headWeight} on the frame, from ${usd(lightFrom('polaris'))}, with batteries from a 4 hr clip to a 10 hr pack.`,
          'The lightest option on your loupes, and the longest runtime. The cord runs to a clip or pack on your scrubs.',
        ], ['Lightest', 'Longest runtime']),
        lightEntry('vega', 'Vega', [
          `Corded: ${lux('vega')} at ${light('vega').headWeight}, from ${usd(lightFrom('vega'))}. A step brighter for 4x.`,
          'Choose it over Nova if you work at 4x or above and want the front of your loupes light.',
        ], ['4x loupes', 'Restorative']),
      ],
    },
    tips: {
      title: 'Tips for choosing a wireless loupe light',
      items: [
        { title: 'Count your hours.', body: 'Plan one battery per three hours of light, and swap between patients.' },
        { title: 'Check the total weight on the frame.', body: 'Loupes plus light plus prescription is what your nose carries. Heavy prismatic pair? Consider corded.' },
        { title: 'Match brightness to magnification.', body: '50,000 lux suits 2.5x–3.5x; go brighter at 4x and up. Full chart: /best-dental-loupe-lights.' },
        { title: 'Buy it with the loupes.', body: `The mount is fitted to the frame, and the light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.` },
      ],
    },
    proofPoints: [`${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes`, 'Every price published', 'Fits HeliosX frames', 'Ships with loupes in one box'],
    sections: [
      section('Wireless or corded?', 'Choose wireless if the cord is what bothers you, and corded if weight on the frame or runtime matters more.', [
        'Wireless: no cord, about 3 hours per battery, battery weight on the light.',
        'Corded: 10–12 g on the frame, 4–10 hours per battery, a cord to your scrubs.',
        'Headlight: no loupe mount, battery on the headband.',
        'All lights ranked by brightness: /best-dental-loupe-lights.',
      ]),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    faqs: [
      faq('Are wireless loupe lights as bright as corded ones?', `Nova gives ${lux('nova')}, the same as Polaris, enough for 2.5x–3.5x. For 4x and above, corded Vega and Rigel go brighter.`),
      faq('How long does a wireless loupe light last?', `Nova runs about ${light('nova').wireless!.hoursPerBattery} hours per battery and ships with ${light('nova').wireless!.batteries}, so a full day means swapping between patients.`),
      faq('Can I put a wireless light on my existing loupes?', 'HeliosX lights mount to HeliosX frames. If you have another brand, ask us first with a photo of your frame.'),
      faq('How much is a wireless loupe light?', `Nova is ${usd(lightFrom('nova'))}, or ${LIGHT_BUNDLE_PERCENT_OFF}% off when ordered with loupes.`),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 5. Prescription loupes.
  {
    slug: 'prescription-loupes',
    title: 'Prescription Loupes: How They Work, What They Cost',
    metaTitle: 'Prescription Loupes: Price, Lenses & How to Order | HeliosX',
    description: `Prescription surgical and dental loupes: how your prescription is built into the carrier lenses, what it adds (${usd(PRESCRIPTION_PRICE)}), and how long it takes.`,
    heroKicker: 'Prescription loupes',
    heroImage: { src: photo.apollo.src, alt: 'Prescription loupes: HeliosX Apollo loupes on a red metal frame', caption: `Prescription lenses · ${usd(PRESCRIPTION_PRICE)} USD` },
    primaryKeyword: 'prescription loupes',
    relatedKeywords: ['prescription dental loupes', 'rx loupes', 'prescription surgical loupes', 'loupes with prescription lenses'],
    audience: 'Clinicians who wear glasses and want loupes that include their prescription',
    intro:
      'If you wear glasses, your loupes can include your prescription, so you see clearly through the carrier lens and the telescopes without wearing two pairs. Every HeliosX model can be built with prescription lenses. Here is how it works, what it adds to the price and the timeline, and which model to choose.',
    answer: `Every HeliosX loupe can be built with your prescription in the carrier lenses for ${usd(PRESCRIPTION_PRICE)}. Send a current prescription after checkout; production adds 5–7 business days. Pairs with prescription lenses: Newton ${at('newton', '2.5x')} + ${usd(PRESCRIPTION_PRICE)} = ${usd(magnificationPriceByProduct.newton['2.5x'] + PRESCRIPTION_PRICE)} upward.`,
    why: {
      title: 'Why a prescription changes the order',
      body: [
        'Loupes are focused at your working distance, and the carrier lens is what you look through around the telescopes. If you need correction, it has to be in that lens, or the view through and around the loupes will not be sharp.',
        'That makes a prescription pair a custom product from the start: it is built for your eyes, so it cannot be resold, and the return terms change once production begins.',
      ],
    },
    tierChart: {
      title: 'Prescription loupes price chart',
      lead: `Each model with prescription lenses added (${usd(PRESCRIPTION_PRICE)}), from the lowest price. Tap one to jump to it.`,
      scale: priceScale,
      tiers: priceTiers(allModels, Object.fromEntries(allModels.map((m) => [m, `from ${usd(Math.min(...prices(m)) + PRESCRIPTION_PRICE)} with Rx`]))),
    },
    specTable: {
      title: 'Prescription loupes: models and prices with lenses',
      columns: ['Model', 'Optics', 'Magnification', 'Loupe price', 'With prescription'],
      rows: allModels.map((m) => [modelName(m), m === 'newton' || m === 'galileo' ? 'Galilean' : m === 'kepler' ? 'Prismatic' : 'Ergonomic prismatic', `${Object.keys(magnificationPriceByProduct[m])[0]}+`, `from ${from(m)}`, `from ${usd(Math.min(...prices(m)) + PRESCRIPTION_PRICE)}`]),
      note: `Prescription lenses are ${usd(PRESCRIPTION_PRICE)} on any model. Production for prescription orders adds 5–7 business days. ${shipping}`,
    },
    quickPicks: {
      title: 'Quick picks: which prescription pair?',
      rows: [
        { task: 'Lowest total with prescription', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'Dentist, everyday 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Posture first', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: '4x–6x detail', picks: [{ label: 'Kepler', href: '#kepler' }] },
      ],
    },
    items: {
      title: 'Prescription loupes by model, and what each is best for',
      entries: [
        withAlt(loupeEntry('newton', [`With prescription lenses: from ${usd(magnificationPriceByProduct.newton['2.5x'] + PRESCRIPTION_PRICE)}. The lightest frame, 40–50 g before lenses.`, 'A good first prescription pair for students and hygienists.'], ['Lowest total', 'Students']), 'Prescription loupes'),
        withAlt(loupeEntry('galileo', [`With prescription lenses: from ${usd(magnificationPriceByProduct.galileo['2.5x'] + PRESCRIPTION_PRICE)}. Six frame styles included, the widest field in the range.`, 'The everyday prescription pair for dentists and general surgeons.'], ['General dentistry', 'General surgery']), 'Prescription loupes'),
        withAlt(loupeEntry('kepler', [`With prescription lenses: from ${usd(magnificationPriceByProduct.kepler['4.0x'] + PRESCRIPTION_PRICE)}. Prismatic, 4x–6x.`, 'For fine work where you also need correction.'], ['Endodontics', 'Microsurgery']), 'Prescription loupes'),
        withAlt(loupeEntry('apollo', [`With prescription lenses: from ${usd(magnificationPriceByProduct.apollo['3.0x'] + PRESCRIPTION_PRICE)}. Ergonomic prismatic, fixed working distance.`, 'Posture first, without a second pair of glasses.'], ['Posture', 'Long cases']), 'Prescription loupes'),
        withAlt(loupeEntry('medusa', [`With prescription lenses: from ${usd(magnificationPriceByProduct.medusa['3.0x'] + PRESCRIPTION_PRICE)}. Ergonomic, working distance adjusts 300–600 mm.`, 'Up to 8.5x, for clinicians who sit and stand.'], ['Sit and stand', 'Up to 8.5x']), 'Prescription loupes'),
      ],
    },
    tips: {
      title: 'Tips for ordering prescription loupes',
      items: [
        { title: 'Use a current prescription.', body: 'Ideally from the last year or two, with your pupillary distance on it.' },
        { title: 'Order the prescription at checkout.', body: `Add prescription lenses (${usd(PRESCRIPTION_PRICE)}) and send the prescription afterwards with your measurements.` },
        { title: 'Plan for the extra time.', body: 'Prescription production adds 5–7 business days.' },
        { title: 'Know the return terms.', body: 'Prescription pairs are fully refundable until production begins; after that we cover fit corrections and defects.' },
      ],
    },
    proofPoints: [`Prescription lenses ${usd(PRESCRIPTION_PRICE)}`, 'Any model', 'Reviewed before production', 'Limited lifetime warranty'],
    sections: [
      section('How prescription loupes are made', 'Your prescription is ground into the carrier lenses, and the telescopes are mounted through them at your working distance and pupillary distance.', [
        'More on how lenses and loupes work together: /education/prescription-loupes-guide.',
        'How to measure pupillary distance: /education/how-to-measure-pupillary-distance.',
        `Timeline: ${leadTime}`,
      ]),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Newton'],
    faqs: [
      faq('Can I get loupes with my prescription?', `Yes. Every HeliosX model can include prescription carrier lenses for ${usd(PRESCRIPTION_PRICE)}.`),
      faq('How much do prescription loupes cost?', `The loupe price plus ${usd(PRESCRIPTION_PRICE)}: from ${usd(magnificationPriceByProduct.newton['2.5x'] + PRESCRIPTION_PRICE)} for Newton 2.5x.`),
      faq('Can I wear loupes over my glasses?', 'Some clip-on and headband loupes allow it, but loupes with your prescription built into the carrier lenses are simpler and lighter to wear.'),
      faq('Can I return prescription loupes?', 'They are fully refundable until production begins. After that, we cover fit corrections and manufacturer defects under the lifetime warranty.'),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 6. Canada.
  {
    slug: 'surgical-loupes-canada',
    title: 'Surgical and Dental Loupes in Canada: Prices and Delivery',
    metaTitle: 'Surgical Loupes Canada: Price Chart & Delivery | HeliosX',
    description: `Custom surgical and dental loupes delivered to Canada from ${from('newton')} USD, shipping included. GST/HST, duty, delivery times and warranty, with every price shown.`,
    heroKicker: 'Loupes Canada',
    heroImage: { src: photo.galileo.src, alt: 'Surgical loupes Canada: HeliosX Galileo custom loupes', caption: `Galileo · From ${from('galileo')} USD` },
    primaryKeyword: 'surgical loupes canada',
    relatedKeywords: ['dental loupes canada', 'buy loupes canada', 'loupes canada price', 'ergo loupes canada'],
    audience: 'Surgeons, dentists, hygienists and residents in Canada',
    intro:
      'HeliosX builds every pair to your measurements and ships to Canada, with standard shipping included in the price. Prices are in US dollars and your card converts them. Here is what each model costs, how GST/HST and any duty apply at import, and how delivery, returns and warranty work from Canada.',
    answer: `HeliosX loupes cost ${from('newton')}–${top('medusa')} USD with shipping to Canada included. Imports are assessed by the Canada Border Services Agency: you pay GST or HST (and PST where it applies) plus any duty, usually collected by the carrier on delivery. ${leadTime}`,
    why: {
      title: 'Why the landed cost matters in Canada',
      body: [
        'Many Canadian clinicians buy loupes from US brands through a rep. Buying direct can cost less, but only if you know the landed total: the price, the exchange rate, sales tax at import and any brokerage fee.',
        'This page shows every price in US dollars and how tax at the border works, so you can work out the total before you order.',
      ],
    },
    tierChart: { title: 'Loupes price chart for Canadian buyers', lead: 'Prices in USD, shipping to Canada included. Tap a model to jump to it.', scale: priceScale, tiers: priceTiers(allModels) },
    specTable: {
      title: 'What you pay for loupes delivered to Canada',
      columns: ['Cost', 'How it works', 'Amount'],
      rows: [
        ['Loupes', 'Published USD price; your card converts to CAD', `${from('newton')}–${top('medusa')} USD`],
        ['Shipping', 'Standard shipping included', 'Included'],
        ['GST/HST and PST', 'Charged on import by CBSA, at your province’s rate', 'Your provincial rate'],
        ['Duty and brokerage', 'Assessed by CBSA; the carrier may add a brokerage fee', 'Depends on the goods'],
        ['Prescription lenses', 'Optional', `${usd(PRESCRIPTION_PRICE)} USD`],
      ],
      note: `Sales tax and duty on imported goods: Canada Border Services Agency. Your card issuer sets the exchange rate and any foreign transaction fee. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: which pair for Canadian practice?',
      rows: [
        { task: 'Resident or dental student', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'Dentist or hygienist, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Surgeon, 4x–6x detail', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Posture first, long days', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'Loupes for Canadian buyers, and what each is best for',
      entries: [
        withAlt(loupeEntry('newton', [`The lowest-cost custom pair, ${range('newton')} USD. Verified residents and students get ${TRAINEE_PERCENT_OFF}% off.`, 'It weighs 40–50 g with frame, with a 80–120 mm field at 2.5x.'], ['Residents', 'Students', 'Hygiene']), 'Surgical loupes Canada'),
        withAlt(loupeEntry('galileo', [`The everyday pair, ${range('galileo')} USD, with the widest field in the range and six frame styles.`, `Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off, in the same shipment and one import.`], ['General dentistry', 'General surgery']), 'Surgical loupes Canada'),
        withAlt(loupeEntry('kepler', [`Prismatic 4x–6x, ${range('kepler')} USD.`, '68–85 g with frame, for vascular, hand and endodontic detail.'], ['Fine detail', 'Endodontics']), 'Surgical loupes Canada'),
        withAlt(loupeEntry('apollo', [`Ergonomic prismatic, ${range('apollo')} USD, 55–58 g with frame.`, 'Fixed working distance of 420, 450, 500 or 550 mm, chosen at order.'], ['Posture', 'One working distance']), 'Surgical loupes Canada'),
        withAlt(loupeEntry('medusa', [`Ergonomic prismatic up to 8.5x, ${range('medusa')} USD.`, 'Working distance adjusts from 300 to 600 mm, so one pair works seated and standing.'], ['Sit and stand', 'Neurosurgery']), 'Surgical loupes Canada'),
      ],
    },
    tips: {
      title: 'Tips for buying loupes from the US in Canada',
      items: [
        { title: 'Budget for sales tax at the border.', body: 'Add GST/HST (and PST where it applies) on top of the converted price.' },
        { title: 'Ship loupes and light together.', body: 'One order means one import and one brokerage charge.' },
        { title: 'Check your card’s foreign transaction fee.', body: 'Prices are in USD; your card issuer sets the rate.' },
        { title: 'Measure before you order.', body: 'Guide: /measurements.' },
      ],
    },
    proofPoints: ['Ships to Canada, shipping included', 'Every price published', 'Lifetime warranty in Canada', `${TRAINEE_PERCENT_OFF}% off for verified trainees`],
    sections: [
      section('Delivery to Canada', `${leadTime} You receive tracking by email when it ships; see /shipping and /surgical-loupes-international-shipping.`),
      section('Returns and warranty from Canada', `${returns} The limited lifetime warranty runs from the delivery date, wherever you are.`),
    ],
    recommendedProducts: ['Galileo', 'Kepler', 'Medusa'],
    faqs: [
      faq('Does HeliosX ship loupes to Canada?', 'Yes, with standard shipping included in the listed USD price.'),
      faq('Do I pay tax on loupes ordered from the US?', 'Yes. GST or HST, and PST where it applies, are charged on import, with any duty assessed by the Canada Border Services Agency.'),
      faq('What are the best surgical loupes in Canada?', `The same as anywhere: match the loupe to your work. Galileo (${range('galileo')} USD) for general work, Kepler for 4x–6x, Apollo or Medusa for posture.`),
      faq('Is the warranty valid in Canada?', 'Yes. The limited lifetime warranty runs from the delivery date, wherever you are.'),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 7. UK.
  {
    slug: 'surgical-loupes-uk',
    title: 'Surgical and Dental Loupes in the UK: Prices and Delivery',
    metaTitle: 'Surgical Loupes UK: Price Chart, VAT & Delivery | HeliosX',
    description: `Custom surgical and dental loupes delivered to the UK from ${from('newton')} USD, shipping included. Import VAT, duty, delivery and warranty, with every price shown.`,
    heroKicker: 'Loupes UK',
    heroImage: { src: photo.apollo.src, alt: 'Surgical loupes UK: HeliosX Apollo ergonomic loupes', caption: `Apollo · From ${from('apollo')} USD` },
    primaryKeyword: 'surgical loupes uk',
    relatedKeywords: ['best surgical loupes uk', 'dental loupes uk', 'dental loupes uk prices', 'buy loupes uk'],
    audience: 'Surgeons, dentists, hygienists and trainees in the UK, including NHS clinicians',
    intro:
      'HeliosX builds every pair to your measurements and ships to the UK, with standard shipping included in the price. Prices are in US dollars and your card converts them. Here is what each model costs, how import VAT and duty apply, and how delivery, returns and warranty work from the UK.',
    answer: `HeliosX loupes cost ${from('newton')}–${top('medusa')} USD with shipping to the UK included. Goods over £135 pay import VAT (20%) and any customs duty at the border, usually collected by the carrier with a handling fee, per HMRC. ${leadTime}`,
    why: {
      title: 'Why the landed cost matters in the UK',
      body: [
        'UK clinicians often buy loupes through dealers or at course stands. Buying direct can cost less, but only if you know the landed total: price, exchange rate, import VAT and the carrier’s handling fee.',
        'This page shows every price in US dollars and how VAT at import works, so you can work out the total before you order.',
      ],
    },
    tierChart: { title: 'Loupes price chart for UK buyers', lead: 'Prices in USD, shipping to the UK included. Tap a model to jump to it.', scale: priceScale, tiers: priceTiers(allModels) },
    specTable: {
      title: 'What you pay for loupes delivered to the UK',
      columns: ['Cost', 'How it works', 'Amount'],
      rows: [
        ['Loupes', 'Published USD price; your card converts to GBP', `${from('newton')}–${top('medusa')} USD`],
        ['Shipping', 'Standard shipping included', 'Included'],
        ['Import VAT', 'Charged at the border on goods over £135', '20%'],
        ['Customs duty and handling', 'Assessed at import; the carrier may add a handling fee', 'Depends on the goods'],
        ['Prescription lenses', 'Optional', `${usd(PRESCRIPTION_PRICE)} USD`],
      ],
      note: `Import VAT and duty: HM Revenue & Customs, goods sent from abroad. Your card issuer sets the exchange rate and any foreign transaction fee. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: which pair for UK practice?',
      rows: [
        { task: 'Foundation doctor, core trainee or dental student', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'Dentist or hygienist, 2.5x–3.5x', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'Surgeon, 4x–6x detail', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'Posture first, long lists', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'Loupes for UK buyers, and what each is best for',
      entries: [
        withAlt(loupeEntry('newton', [`The lowest-cost custom pair, ${range('newton')} USD. Verified trainees and students get ${TRAINEE_PERCENT_OFF}% off.`, 'It weighs 40–50 g with frame, with a 80–120 mm field at 2.5x.'], ['Trainees', 'Students', 'Hygiene']), 'Surgical loupes UK'),
        withAlt(loupeEntry('galileo', [`The everyday pair, ${range('galileo')} USD, with the widest field in the range and six frame styles.`, `Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off, in the same shipment.`], ['General dentistry', 'General surgery']), 'Surgical loupes UK'),
        withAlt(loupeEntry('kepler', [`Prismatic 4x–6x, ${range('kepler')} USD.`, '68–85 g with frame, for vascular, plastics, hand and endodontic detail.'], ['Fine detail', 'Endodontics']), 'Surgical loupes UK'),
        withAlt(loupeEntry('apollo', [`Ergonomic prismatic, ${range('apollo')} USD, 55–58 g with frame.`, 'Fixed working distance of 420, 450, 500 or 550 mm, chosen at order.'], ['Posture', 'Long lists']), 'Surgical loupes UK'),
        withAlt(loupeEntry('medusa', [`Ergonomic prismatic up to 8.5x, ${range('medusa')} USD.`, 'Working distance adjusts from 300 to 600 mm, so one pair works seated and standing.'], ['Sit and stand', 'Neurosurgery']), 'Surgical loupes UK'),
      ],
    },
    tips: {
      title: 'Tips for buying loupes from overseas in the UK',
      items: [
        { title: 'Budget for import VAT.', body: 'Add 20% VAT on top of the converted price, plus any duty and handling fee.' },
        { title: 'Ship loupes and light together.', body: 'One order means one import and one handling fee.' },
        { title: 'Check your card’s foreign transaction fee.', body: 'Prices are in USD; your card issuer sets the rate.' },
        { title: 'Measure before you order.', body: 'Guide: /measurements.' },
      ],
    },
    proofPoints: ['Ships to the UK, shipping included', 'Every price published', 'Lifetime warranty in the UK', `${TRAINEE_PERCENT_OFF}% off for verified trainees`],
    sections: [
      section('Delivery to the UK', `${leadTime} You receive tracking by email when it ships; see /shipping and /surgical-loupes-international-shipping.`),
      section('Returns and warranty from the UK', `${returns} The limited lifetime warranty runs from the delivery date, wherever you are.`),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Kepler'],
    faqs: [
      faq('Does HeliosX ship loupes to the UK?', 'Yes, with standard shipping included in the listed USD price.'),
      faq('Do I pay VAT on loupes ordered from abroad?', 'Yes. Goods over £135 pay 20% import VAT plus any customs duty at the border, per HMRC, usually collected by the carrier.'),
      faq('What are the best surgical loupes in the UK?', `Match the loupe to your work: Galileo (${range('galileo')} USD) for general work, Kepler for 4x–6x, Apollo or Medusa for posture. Brands compared: /best-surgical-loupe-brands.`),
      faq('Is the warranty valid in the UK?', 'Yes. The limited lifetime warranty runs from the delivery date, wherever you are.'),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 8. LumaDent loupes price.
  {
    slug: 'lumadent-loupes-price',
    title: 'LumaDent Loupes Price, and the HeliosX Pair for Each',
    metaTitle: 'LumaDent Loupes Price: Full Chart & Comparison | HeliosX',
    description: `LumaDent loupe prices from its own store: Galilean from $495, Ergo Air Ti from $1,395, Prism Ti from $1,695. The closest HeliosX pair for each, from ${from('newton')}.`,
    heroKicker: 'LumaDent price',
    heroImage: { src: photo.medusa.src, alt: 'LumaDent loupes price comparison: HeliosX Medusa ergonomic loupes', caption: `Medusa · From ${from('medusa')} USD` },
    primaryKeyword: 'lumadent loupes price',
    relatedKeywords: ['lumadent loupes', 'lumadent loupes cost', 'lumadent ergo air ti price', 'lumadent dental loupes'],
    audience: 'Dentists and surgeons comparing a LumaDent pair',
    competitorName: 'LumaDent',
    intro:
      'LumaDent is one of the few loupe brands that publishes its prices, which makes it easy to compare. Here is every LumaDent loupe price from its own store, next to the closest HeliosX pair at the same kind of optics, so you can see the difference in dollars and decide what matters to you. LumaDent lights are compared on /lumadent-light-alternative; the full brand comparison is on /heliosx-vs-lumadent.',
    answer: `LumaDent lists Galilean loupes from $${luma.galileanVario['2.5x']} (Vario) to $${luma.galileanTtl['3.0x'].toLocaleString('en-US')} (TTL), prismatic from $${luma.prismVario['3.5x'].toLocaleString('en-US')}, Ergo Air Ti from $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')} (Vario) and $${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')} (TTL), and Ergo Trinity at $${luma.trinity.toLocaleString('en-US')}. The closest HeliosX pairs cost ${range('newton')} (Galilean), ${range('kepler')} (prismatic) and ${from('apollo')} and up (ergonomic).`,
    why: {
      title: 'Why compare LumaDent line by line',
      body: [
        'LumaDent sells two mountings at different prices: Vario (an adjustable mount) and TTL (through-the-lens). The same optics cost several hundred dollars more as TTL, so compare like for like.',
        'HeliosX loupes are custom-built to your measurements with every price published. Below, each LumaDent line sits next to the HeliosX pair that does the same job.',
      ],
    },
    tierChart: {
      title: 'LumaDent loupes price chart, with the HeliosX match',
      lead: 'LumaDent prices from its store, by line. Tap a HeliosX pair to jump to it.',
      scale: priceScale,
      tiers: [
        tier(`$${luma.galileanVario['2.5x']}–$${luma.galileanTtl['3.0x'].toLocaleString('en-US')}`, 'LumaDent Galilean', [['newton', from('newton')], ['galileo', from('galileo')]]),
        tier(`$${luma.prismVario['3.5x'].toLocaleString('en-US')}–$${luma.prismTi['6.0x'].toLocaleString('en-US')}`, 'LumaDent Prism', [['kepler', from('kepler')]]),
        tier(`$${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}–$${luma.trinity.toLocaleString('en-US')}`, 'LumaDent Ergo', [['apollo', from('apollo')], ['medusa', from('medusa')]]),
      ],
    },
    specTable: {
      title: 'LumaDent loupes price list against HeliosX',
      columns: ['LumaDent line', 'LumaDent price (USD)', 'Closest HeliosX', 'HeliosX price (USD)'],
      rows: [
        ['Galilean Vario 2.5x / 3.0x', `$${luma.galileanVario['2.5x']} / $${luma.galileanVario['3.0x']}`, 'Newton 2.5x / 3.0x', `${at('newton', '2.5x')} / ${at('newton', '3.0x')}`],
        ['Galilean TTL 2.5x / 3.0x', `$${luma.galileanTtl['2.5x'].toLocaleString('en-US')} / $${luma.galileanTtl['3.0x'].toLocaleString('en-US')}`, 'Galileo 2.5x / 3.0x', `${at('galileo', '2.5x')} / ${at('galileo', '3.0x')}`],
        ['Prism Ti TTL 3.5x / 4.5x / 6.0x', `$${luma.prismTi['3.5x'].toLocaleString('en-US')} / $${luma.prismTi['4.5x'].toLocaleString('en-US')} / $${luma.prismTi['6.0x'].toLocaleString('en-US')}`, 'Kepler 4.0x / 5.0x / 6.0x', `${at('kepler', '4.0x')} / ${at('kepler', '5.0x')} / ${at('kepler', '6.0x')}`],
        ['Ergo Air Ti TTL 3.0x / 4.0x / 5.0x', `$${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')} / $${luma.ergoAirTiTtl['4.0x'].toLocaleString('en-US')} / $${luma.ergoAirTiTtl['5.0x'].toLocaleString('en-US')}`, 'Apollo 3.0x / 4.0x / 5.0x', `${at('apollo', '3.0x')} / ${at('apollo', '4.0x')} / ${at('apollo', '5.0x')}`],
        ['Ergo Air Ti TTL 8.0x', `$${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')}`, 'Medusa 8.0x', at('medusa', '8.0x')],
        ['Ergo Air Ti Vario 3.0x / 4.0x / 5.0x', `$${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')} / $${luma.ergoAirTiVario['4.0x'].toLocaleString('en-US')} / $${luma.ergoAirTiVario['5.0x'].toLocaleString('en-US')}`, 'Medusa 3.0x / 4.0x / 5.0x', `${at('medusa', '3.0x')} / ${at('medusa', '4.0x')} / ${at('medusa', '5.0x')}`],
        ['Ergo Trinity TTL 3.5x–5.0x–7.0x', `$${luma.trinity.toLocaleString('en-US')}`, 'Medusa 6.0x', at('medusa', '6.0x')],
      ],
      note: `LumaDent prices from lumadent.com (its online store), loupe only; LumaDent sells lights separately. Vario is LumaDent’s adjustable mount; TTL is through-the-lens. HeliosX does not make 4.5x, 6.5x, 7.5x or 10x. ${checked}`,
    },
    quickPicks: {
      title: 'Quick picks: you were looking at…',
      rows: [
        { task: 'LumaDent Galilean TTL', picks: [{ label: 'Galileo', href: '#galileo' }] },
        { task: 'LumaDent Galilean Vario, lowest price', picks: [{ label: 'Newton', href: '#newton' }] },
        { task: 'LumaDent Prism Ti', picks: [{ label: 'Kepler', href: '#kepler' }] },
        { task: 'LumaDent Ergo Air Ti TTL', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'The HeliosX pair for each LumaDent line',
      entries: [
        withAlt(loupeEntry('newton', [
          `Against Galilean Vario ($${luma.galileanVario['2.5x']} at 2.5x Micro, $${luma.galileanVario['3.0x']} at 3.0x): Newton is ${at('newton', '2.5x')} at 2.5x and ${at('newton', '3.0x')} at 3.0x, custom-built to your measurements.`,
          'LumaDent’s 2.5x Vario costs less; Newton is custom-built to your measurements and pupillary distance.',
        ], ['Lowest cost', 'Students']), 'LumaDent loupes price'),
        withAlt(loupeEntry('galileo', [
          `Against Galilean TTL ($${luma.galileanTtl['2.5x'].toLocaleString('en-US')} at 2.5x, $${luma.galileanTtl['3.0x'].toLocaleString('en-US')} at 3.0x): Galileo is ${at('galileo', '2.5x')} and ${at('galileo', '3.0x')}.`,
          `That is ${usd(luma.galileanTtl['3.0x'] - magnificationPriceByProduct.galileo['3.0x'])} less at 3.0x, with six frame styles included.`,
        ], ['General dentistry', 'Hygiene']), 'LumaDent loupes price'),
        withAlt(loupeEntry('kepler', [
          `Against Prism Ti TTL ($${luma.prismTi['3.5x'].toLocaleString('en-US')}–$${luma.prismTi['6.0x'].toLocaleString('en-US')}): Kepler is ${range('kepler')} at 4x–6x.`,
          `At 6x that is ${usd(luma.prismTi['6.0x'] - magnificationPriceByProduct.kepler['6.0x'])} less. Kepler starts at 4.0x; LumaDent also makes 3.5x and 4.5x.`,
        ], ['Endodontics', 'Fine detail']), 'LumaDent loupes price'),
        withAlt(loupeEntry('apollo', [
          `Against Ergo Air Ti TTL ($${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')} at 3.0x, $${luma.ergoAirTiTtl['5.0x'].toLocaleString('en-US')} at 5.0x): Apollo is ${at('apollo', '3.0x')} at 3.0x and ${at('apollo', '5.0x')} at 5.0x.`,
          `${usd(luma.ergoAirTiTtl['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} less at 3.0x, ergonomic prismatic at a fixed working distance.`,
        ], ['Posture', 'One working distance']), 'LumaDent loupes price'),
        withAlt(loupeEntry('medusa', [
          `Against Ergo Air Ti at higher magnification ($${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')} at 8.0x TTL) or Ergo Trinity ($${luma.trinity.toLocaleString('en-US')}): Medusa is ${at('medusa', '8.0x')} at 8.0x.`,
          'Its working distance adjusts from 300 to 600 mm. It does not switch magnification like Trinity; you choose one at order.',
        ], ['Sit and stand', 'Up to 8.5x']), 'LumaDent loupes price'),
      ],
    },
    tips: {
      title: 'Tips when comparing a LumaDent quote',
      items: [
        { title: 'Compare TTL with TTL.', body: 'Vario and TTL versions of the same optics differ by several hundred dollars.' },
        { title: 'Price the light separately.', body: `LumaDent sells lights separately; HeliosX lights are ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes. Compare: /lumadent-light-alternative.` },
        { title: 'Match the magnification.', body: 'HeliosX does not make 4.5x, 6.5x or 7.5x; pick the nearest step for your work.' },
        { title: 'Check what is included.', body: 'Ask about prescription lenses, shipping and warranty on both sides.' },
      ],
    },
    proofPoints: ['Every price published', 'Custom-built to your measurements', 'Shipping included', 'Limited lifetime warranty'],
    sections: [
      section('LumaDent and HeliosX in one line each', 'Both publish prices. LumaDent offers Vario and through-the-lens options and a switching-magnification Ergo Trinity; HeliosX builds each pair to your measurements at one magnification, with Medusa adding an adjustable working distance.', [
        'Full comparison: /heliosx-vs-lumadent.',
        'Ergonomic loupes from every brand: /ergonomic-loupe-comparison.',
        'Every brand’s prices in one place: /dental-loupes-price.',
      ]),
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Medusa'],
    faqs: [
      faq('How much do LumaDent loupes cost?', `From LumaDent’s store: Galilean $${luma.galileanVario['2.5x']}–$${luma.galileanTtl['3.0x'].toLocaleString('en-US')}, Prism $${luma.prismVario['3.5x'].toLocaleString('en-US')}–$${luma.prismTi['6.0x'].toLocaleString('en-US')}, Ergo Air Ti $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}–$${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')}, Ergo Trinity $${luma.trinity.toLocaleString('en-US')}. ${checked}`),
      faq('How much is the LumaDent Ergo Air Ti?', `$${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')} at 3.0x through-the-lens, up to $${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')} at 8.0x; the Vario version is $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}–$${luma.ergoAirTiVario['5.0x'].toLocaleString('en-US')}.`),
      faq('What is the HeliosX equivalent of LumaDent Ergo Air Ti?', `Apollo (${range('apollo')}) for one working distance, or Medusa (${range('medusa')}) for an adjustable one.`),
      faq('Are LumaDent loupes cheaper than HeliosX?', `Its 2.5x Galilean Vario ($${luma.galileanVario['2.5x']}) is. At most other lines HeliosX costs less: Galileo 3.0x is ${usd(luma.galileanTtl['3.0x'] - magnificationPriceByProduct.galileo['3.0x'])} below Galilean TTL 3.0x, Apollo 3.0x ${usd(luma.ergoAirTiTtl['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} below Ergo Air Ti TTL 3.0x.`),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 9. Ergonomic loupes price.
  {
    slug: 'ergonomic-loupes-price',
    title: 'Ergonomic Loupes Price: Every Brand, Side by Side',
    metaTitle: 'Ergonomic Loupes Price Chart: All Brands | HeliosX',
    description: `What ergonomic loupes cost: LumaDent, Q-Optics and HeliosX published prices side by side, and which brands quote. HeliosX Apollo and Medusa from ${from('apollo')}.`,
    heroKicker: 'Ergonomic loupes price',
    heroImage: { src: photo.apollo.src, alt: 'Ergonomic loupes price: HeliosX Apollo ergonomic prismatic loupes', caption: `Apollo · From ${from('apollo')} USD` },
    primaryKeyword: 'ergonomic loupes price',
    relatedKeywords: ['ergonomic loupes cost', 'ergo loupes price', 'ergonomic dental loupes price', 'how much are ergonomic loupes'],
    audience: 'Dentists, hygienists and surgeons pricing ergonomic loupes',
    intro:
      'Ergonomic loupes cost more than standard ones because the angled prism optics are harder to make. How much more depends on the brand, and most do not publish prices at all. Here is every published ergonomic loupe price we could find, side by side, and what the brands that quote usually ask you to do. For which ergonomic loupe is best, see /ergonomic-loupe-comparison.',
    answer: `Published ergonomic loupe prices: HeliosX Apollo ${range('apollo')} and Medusa ${range('medusa')}; LumaDent Ergo Air Ti $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}–$${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')}; Q-Optics ErgoAngle $${qoErgo['3.0x'].toLocaleString('en-US')}–$${qoErgo['4.5x'].toLocaleString('en-US')} at retail. Orascoptic, SurgiTel, ExamVision, Admetec and Designs for Vision quote through representatives.`,
    why: {
      title: 'Why ergonomic loupes cost more',
      body: [
        'An ergonomic loupe bends the light path with a prism so you can look down with your eyes while your head stays closer to upright. The prism glass and the precise angle add cost and weight compared with a Galilean pair.',
        'The spread between brands is still wide: at 3.0x, published prices run from about $1,400 to over $2,000. That is why it pays to compare the same magnification and mounting.',
      ],
    },
    tierChart: {
      title: 'Ergonomic loupes price chart at 3.0x',
      lead: 'Published 3.0x prices, lowest first. Tap a HeliosX pair to jump to it.',
      scale: priceScale,
      tiers: [
        tier(`$${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}`, 'LumaDent Ergo Air Ti Vario', []),
        tier(at('apollo', '3.0x'), 'HeliosX Apollo and Medusa', [['apollo', 'Fixed distance'], ['medusa', 'Adjustable 300–600 mm']]),
        tier(`$${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')}–$${qoErgo['3.0x'].toLocaleString('en-US')}`, 'LumaDent TTL, Q-Optics ErgoAngle', []),
      ],
    },
    specTable: {
      title: 'Ergonomic loupes price list by brand',
      columns: ['Brand and line', '3.0x', '4.0x', 'Highest', 'How priced'],
      rows: [
        ['HeliosX Apollo', at('apollo', '3.0x'), at('apollo', '4.0x'), `${at('apollo', '6.0x')} (6.0x)`, 'Published'],
        ['HeliosX Medusa', at('medusa', '3.0x'), at('medusa', '4.0x'), `${at('medusa', '8.5x')} (8.5x)`, 'Published'],
        ['LumaDent Ergo Air Ti Vario', `$${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}`, `$${luma.ergoAirTiVario['4.0x'].toLocaleString('en-US')}`, `$${luma.ergoAirTiVario['5.0x'].toLocaleString('en-US')} (5.0x)`, 'Published'],
        ['LumaDent Ergo Air Ti TTL', `$${luma.ergoAirTiTtl['3.0x'].toLocaleString('en-US')}`, `$${luma.ergoAirTiTtl['4.0x'].toLocaleString('en-US')}`, `$${luma.ergoAirTiTtl['8.0x'].toLocaleString('en-US')} (8.0x)`, 'Published'],
        ['Q-Optics ErgoAngle', `$${qoErgo['3.0x'].toLocaleString('en-US')}`, `$${qoErgo['4.0x'].toLocaleString('en-US')}`, `$${qoErgo['4.5x'].toLocaleString('en-US')} (4.5x)`, 'Published retail'],
        ['Orascoptic Ergo Series', '—', '—', '—', 'Dealer quote'],
        ['SurgiTel Ergo IQ', '—', '—', '—', 'Representative quote'],
        ['ExamVision Kepler Reflekt', '—', '—', '—', 'Dealer quote'],
      ],
      note: `LumaDent: lumadent.com store, checked November 16, 2026. Q-Optics: q-optics.com partner offer page, checked November 15, 2026. Orascoptic, SurgiTel and ExamVision from their own sites, which list no prices. Loupe only; lights are extra at every brand.`,
    },
    quickPicks: {
      title: 'Quick picks: by budget and need',
      rows: [
        { task: 'Ergonomic at one working distance', picks: [{ label: 'Apollo', href: '#apollo' }] },
        { task: 'Sit and stand, adjustable distance', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Higher than 6x', picks: [{ label: 'Medusa', href: '#medusa' }] },
        { task: 'Not sure you need ergonomic', picks: [{ label: 'Galilean loupes', href: '/galilean-loupes' }] },
      ],
    },
    items: {
      title: 'HeliosX ergonomic loupes, and what each costs',
      entries: [
        withAlt(loupeEntry('apollo', [
          `${at('apollo', '3.0x')} at 3.0x, ${at('apollo', '4.0x')} at 4.0x, ${at('apollo', '5.0x')} at 5.0x and ${at('apollo', '6.0x')} at 6.0x. Ergonomic prismatic, 55–58 g with frame.`,
          `${usd(luma.ergoAirTiTtl['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} below LumaDent Ergo Air Ti TTL and ${usd(qoErgo['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} below Q-Optics ErgoAngle at 3.0x.`,
        ], ['Posture', 'One working distance']), 'Ergonomic loupes price'),
        withAlt(loupeEntry('medusa', [
          `${at('medusa', '3.0x')} at 3.0x up to ${at('medusa', '8.5x')} at 8.5x, with a working distance you adjust from 300 to 600 mm.`,
          'At each magnification Apollo also offers, Medusa costs the same or less.',
        ], ['Sit and stand', 'Up to 8.5x'], { text: 'Pay over time at checkout where available.', label: 'Shop Medusa', href: '/product/medusa' }), 'Ergonomic loupes price'),
      ],
    },
    tips: {
      title: 'Tips for pricing ergonomic loupes',
      items: [
        { title: 'Compare the same magnification and mounting.', body: 'Two mountings of the same line can differ by $600: LumaDent Ergo Air Ti at 3.0x is $1,395 on Vario and $1,995 through-the-lens.' },
        { title: 'Ask for an itemized quote from reps.', body: 'Loupe, light, prescription, shipping and any fitting fee, in writing.' },
        { title: 'Spread the cost if you need to.', body: 'Monthly cost by model: /loupes-payment-plans.' },
        { title: 'Check student and resident pricing.', body: `Verified trainees get ${TRAINEE_PERCENT_OFF}% off HeliosX loupes.` },
      ],
    },
    proofPoints: [`Ergonomic from ${from('apollo')}`, 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      section('Which ergonomic loupe is best?', 'Price is one part. For how each brand’s ergonomic line works and who it suits, see the best ergonomic loupes compared: /ergonomic-loupe-comparison.', [
        'Posture research and what it shows: /education/ergonomic-loupes-neck-pain.',
        'LumaDent line by line: /lumadent-loupes-price.',
        'Q-Optics line by line: /q-optics-loupes-price.',
      ]),
    ],
    recommendedProducts: ['Apollo', 'Medusa', 'Galileo'],
    faqs: [
      faq('How much do ergonomic loupes cost?', `Published prices run from $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')} (LumaDent Ergo Air Ti Vario 3.0x) to over $3,000. HeliosX Apollo and Medusa start at ${from('apollo')}.`),
      faq('Why are ergonomic loupes more expensive?', 'The prism that angles the view is extra precision glass, and the angle has to be set accurately for your posture.'),
      faq('Are ergonomic loupes worth the extra cost?', 'If your work keeps you bent over for long stretches, many clinicians find them worth it. If your cases are short, Galilean loupes may be enough.'),
      faq('What is the cheapest ergonomic loupe?', `Among published prices, LumaDent Ergo Air Ti Vario 3.0x at $${luma.ergoAirTiVario['3.0x'].toLocaleString('en-US')}; HeliosX Apollo and Medusa start at ${at('apollo', '3.0x')}.`),
    ],
    datePublished: published,
    dateModified: published,
  },

  // 10. 2.5x vs 3.5x loupes.
  {
    slug: '2-5x-vs-3-5x-loupes',
    title: '2.5x vs 3.5x Loupes: Which Magnification to Buy',
    metaTitle: '2.5x vs 3.5x Loupes: Field of View Chart & Prices | HeliosX',
    description: `2.5x or 3.5x loupes? Field of view, depth of field and who each suits, with prices: 2.5x from ${at('newton', '2.5x')}, 3.5x from ${at('newton', '3.5x')}.`,
    heroKicker: '2.5x vs 3.5x',
    heroImage: { src: photo.newton.src, alt: '2.5x vs 3.5x loupes: HeliosX Newton Galilean loupes', caption: `Newton · ${at('newton', '2.5x')}–${at('newton', '3.5x')} USD` },
    primaryKeyword: '2.5x vs 3.5x loupes',
    relatedKeywords: ['2.5x loupes', '3.5x loupes', '3.0x dental loupes', '2.5 vs 3.5 loupes'],
    audience: 'Dental students, hygienists, dentists and residents choosing a first magnification',
    intro:
      '2.5x and 3.5x are the two most common first magnifications, and the most common regret is buying too low. 2.5x shows the whole site with a deep focus range; 3.5x shows more detail in a smaller, shallower view. Here is how they compare, who each suits, and what each costs.',
    answer: `Choose 2.5x for the widest field and deepest focus (hygiene, students, general surgery); choose 3.5x for more detail (restorative dentistry, fine surgery). Many buyers split the difference at 3.0x. HeliosX prices: Newton ${at('newton', '2.5x')} / ${at('newton', '3.0x')} / ${at('newton', '3.5x')}, Galileo ${at('galileo', '2.5x')} / ${at('galileo', '3.0x')} / ${at('galileo', '3.5x')}.`,
    why: {
      title: 'Why the step from 2.5x to 3.5x matters',
      body: [
        'Each step up makes structures look bigger but shrinks what you see and how far you can move before the image blurs. At 2.5x you see the whole quadrant or incision; at 3.5x you see part of it, in more detail.',
        'Many students who start at 2.5x move up within a year, so if you already do detailed work, 3.0x or 3.5x can save buying twice.',
      ],
    },
    tierChart: {
      title: '2.5x vs 3.5x loupes chart',
      lead: 'The same two Galilean pairs at each magnification. Tap one to jump to it.',
      scale: ['Wider field', 'More detail'],
      tiers: [
        tier('2.5x', 'Widest field, deepest focus', [['newton', at('newton', '2.5x')], ['galileo', at('galileo', '2.5x')]]),
        tier('3.0x', 'The middle choice', [['newton', at('newton', '3.0x')], ['galileo', at('galileo', '3.0x')]]),
        tier('3.5x', 'Most detail before prismatic', [['newton', at('newton', '3.5x')], ['galileo', at('galileo', '3.5x')]]),
      ],
    },
    specTable: {
      title: '2.5x, 3.0x and 3.5x loupes: prices',
      columns: ['Model', '2.5x', '3.0x', '3.5x', 'Field at 2.5x'],
      rows: [
        ['Newton', at('newton', '2.5x'), at('newton', '3.0x'), at('newton', '3.5x'), '80–120 mm'],
        ['Galileo', at('galileo', '2.5x'), at('galileo', '3.0x'), at('galileo', '3.5x'), '150–170 mm'],
      ],
      note: `Prices in USD. ${shipping} The field of view narrows as magnification rises.`,
    },
    quickPicks: {
      title: 'Quick picks: 2.5x or 3.5x?',
      rows: [
        { task: 'Hygienist or first-year student', picks: [{ label: '2.5x Newton', href: '#newton' }] },
        { task: 'Dentist, restorative work', picks: [{ label: '3.5x Galileo', href: '#galileo' }] },
        { task: 'General surgery or orthopedics', picks: [{ label: '2.5x–3.0x Galileo', href: '#galileo' }] },
        { task: 'You want more than 3.5x', picks: [{ label: '4x loupes', href: '/4x-loupes' }] },
      ],
    },
    items: {
      title: '2.5x and 3.5x loupes, and what each is best for',
      entries: [
        withAlt(loupeEntry('newton', [
          `Newton at 2.5x is ${at('newton', '2.5x')}, at 3.0x ${at('newton', '3.0x')} and at 3.5x ${at('newton', '3.5x')}: only $30 between the lowest and highest magnification.`,
          'The lightest pair, 40–50 g with frame. A good 2.5x for hygiene and students.',
        ], ['2.5x', 'Hygiene', 'Students']), '2.5x vs 3.5x loupes'),
        withAlt(loupeEntry('galileo', [
          `Galileo at 2.5x is ${at('galileo', '2.5x')}, at 3.0x ${at('galileo', '3.0x')} and at 3.5x ${at('galileo', '3.5x')}, with the widest field in the range.`,
          'Its wider field makes 3.5x easier to work with, which is why most dentists choose Galileo at 3.0x–3.5x.',
        ], ['3.5x', 'Restorative', 'General surgery']), '2.5x vs 3.5x loupes'),
      ],
    },
    tips: {
      title: 'Tips for choosing between 2.5x and 3.5x',
      items: [
        { title: 'Think a year ahead.', body: 'If you will do more detailed work soon, 3.0x–3.5x avoids buying twice.' },
        { title: 'Wider field makes higher magnification easier.', body: 'Galileo at 3.5x feels more like 3.0x on a narrower pair.' },
        { title: 'Match your working distance.', body: 'Measure first: /measurements.' },
        { title: 'Read more on magnification.', body: 'Full guide: /education/loupe-magnification-guide.' },
      ],
    },
    proofPoints: ['2.5x from $695', 'Every price published', 'Custom-built to your measurements', '30-day returns on non-prescription pairs'],
    sections: [
      section('2.5x vs 3.5x at a glance', 'What changes as you go up:', [
        'Field of view: largest at 2.5x, smaller at 3.5x.',
        'Depth of field: deepest at 2.5x, so small head movements matter less.',
        'Detail: more at 3.5x.',
        'Price: only $30 more at 3.5x on the same model.',
        'All Galilean options: /galilean-loupes.',
      ]),
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Kepler'],
    faqs: [
      faq('Is 2.5x or 3.5x better for dental school?', '2.5x–3.0x for preclinical work; many students move to 3.0x–3.5x for clinic. If you buy once, 3.0x is a safe middle.'),
      faq('Is 3.5x too much for a hygienist?', 'Some hygienists use it, but most prefer 2.5x–3.0x for the wider field during scaling.'),
      faq('What is the price difference between 2.5x and 3.5x loupes?', `At HeliosX, $30 on the same model: Newton ${at('newton', '2.5x')} vs ${at('newton', '3.5x')}, Galileo ${at('galileo', '2.5x')} vs ${at('galileo', '3.5x')}.`),
      faq('Should I get 3.0x as a compromise?', 'Many dentists and residents do: it keeps most of the 2.5x field with noticeably more detail.'),
    ],
    datePublished: published,
    dateModified: published,
  },
]
