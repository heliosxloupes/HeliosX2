import type { ContentFaq, ContentSection, EducationGuide, SeoLandingPage } from './seo-content'
import { HEADLIGHTS, LIGHT_WARRANTY_YEARS, LIGHTS, lightFrom } from './lights'
import { magnificationPriceByProduct, TRAINEE_PERCENT_OFF } from './pricing'

// Full specialty rewrites in the HeliosX authority voice (SEO-THESIS.md):
// each page owns one claim for its search, states it in the first sentence,
// proves it in the specialty's own terms, and names the model that specialty
// favors. Company facts come from lib/brand-claims.ts (owner, 2026-10-30).
// Clinical limits stay accurate: loupes never replace a microscope where one
// is indicated, and nothing here claims a health outcome.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const from = (model: string) => usd(Math.min(...Object.values(magnificationPriceByProduct[model])))
const section = (title: string, body: string, bullets: string[] = [], sourceHref?: string, sourceLabel?: string): ContentSection => ({
  title,
  body,
  bullets,
  ...(sourceHref ? { sourceHref, sourceLabel } : {}),
})
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const priceTop = usd(Math.max(...Object.values(magnificationPriceByProduct).flatMap((p) => Object.values(p))))
const brightestHead = HEADLIGHTS.reduce((a, b) => (a.lux >= b.lux ? a : b))
const sirius = LIGHTS.find((l) => l.slug === 'sirius')!

type Rewrite = Partial<SeoLandingPage> & { dateModified: string }

const rewrites: Record<string, Rewrite> = {
  'neurosurgery-loupes': {
    title: 'Neurosurgery loupes: the HeliosX standard in neurosurgical optics',
    metaTitle: 'Best Loupes for Neurosurgery: The HeliosX Standard',
    description: `Neurosurgeons in 110+ countries trust HeliosX: ergonomic prismatic loupes up to 8.5x, working distance adjustable for long cases, custom-built. From ${from('kepler')}.`,
    heroKicker: 'Neurosurgery loupes',
    authorityAudience: 'neurosurgeons',
    answer: `HeliosX is the standard in neurosurgical loupes, trusted by neurosurgeons and spine surgeons in more than 110 countries. Neurosurgeons favor Medusa, ergonomic prismatic up to 8.5x with a working distance that adjusts from 300 to 600 mm through a long case; Apollo for an upright head at a fixed distance; and Kepler, conventional prismatic 4x–6x, for fine detail from ${from('kepler')}. Every pair is custom-built to the surgeon and paired with light up to ${brightestHead.lux.toLocaleString('en-US')} lux.`,
    intro: 'Neurosurgery asks more of optics than any other specialty: deep corridors, long cases standing at the table, and no room to lose focus at the wrong moment. HeliosX has supplied its premium ergonomic loupes, optics and headlights to neurosurgeons and spine surgeons worldwide, and every pair we build for neurosurgery is custom-tailored to the surgeon’s working distance, posture and case mix.',
    procedureRows: [
      { procedure: 'Exposure and closure', magnification: '3.0x–4.0x', distance: '400–500 mm, measured standing', pick: '/product/apollo at 4.0x' },
      { procedure: 'Spine: microdiscectomy, laminectomy, decompression', magnification: '4.0x–5.0x', distance: '400–500 mm', pick: '/product/medusa at 4.0x, with a Rigel light' },
      { procedure: 'Peripheral nerve repair and decompression', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/kepler at 5.0x' },
      { procedure: 'Long cases, sitting and standing', magnification: '4.0x–6.0x', distance: '300–600 mm, adjustable', pick: '/product/medusa, adjustable' },
      { procedure: 'Fine detail before the microscope', magnification: '6.0x–8.5x', distance: '350–600 mm', pick: '/product/medusa at 6.0x–8.5x, with Sirius' },
    ],
    proofPoints: ['Ergonomic prismatic up to 8.5x.', 'Working distance adjustable from 300 to 600 mm.', 'Custom-built, lifetime warranty.'],
    sections: [
      section(
        'The standard in neurosurgical optics',
        'Neurosurgeons and spine surgeons in more than 110 countries operate with HeliosX loupes. We have supplied neurosurgical teams, teaching hospitals and spine practices for a decade, and that experience is built into every pair: ergonomic prismatic optics that keep the head upright through a long case, high-grade optical glass that holds a sharp, true-color image at depth, and premium lightweight metals that stay comfortable at hour four.',
        [
          'Ergonomic prismatic optics from 3.0x to 8.5x.',
          'Working distance built to your table, or adjustable with Medusa.',
          'Custom-tailored: pupillary distance, working distance, magnification, frame and light.',
          `Verified neurosurgical residents and fellows receive ${TRAINEE_PERCENT_OFF}% off.`,
        ],
      ),
      section(
        'Why neurosurgeons favor Medusa',
        `Neurosurgery rarely happens at one distance. You sit for spine work, stand for cranial exposure, lean in for a deep corridor. Medusa is the ergonomic prismatic loupe built for exactly that: its working distance adjusts from 300 to 600 mm, so one pair stays in focus across the whole case, at magnifications from 3.0x to 8.5x and 56–65 g with the frame. It is the HeliosX loupe neurosurgeons choose most.`,
        ['Adjustable working distance, 300–600 mm.', 'Magnification from 3.0x to 8.5x.', `From ${from('medusa')}, lifetime warranty.`],
        '/product/medusa',
        'Medusa ergonomic prismatic loupes',
      ),
      section(
        'Apollo and Kepler: the other two neurosurgical standards',
        `Apollo is the ergonomic prismatic loupe for surgeons who work at one table height: angled optics for an upright head, built to a fixed working distance of 420, 450, 500 or 550 mm, from ${from('apollo')}. Kepler is the conventional prismatic loupe for high-magnification detail at 4.0x, 5.0x and 6.0x, from ${from('kepler')}.`,
        ['Apollo: /product/apollo.', 'Kepler: /product/kepler.'],
      ),
      section(
        'Loupes and the microscope: where each leads',
        'HeliosX loupes lead wherever speed, freedom of movement and a wide view matter: exposure, closure, most spine work and peripheral nerve surgery. The operating microscope leads in deep cranial corridors and microvascular work, where its coaxial light and fixed optical axis are indicated. The best neurosurgical teams use both, and the right loupes make every step before and after the microscope faster.',
        [
          'Clinical references on microdiscectomy describe magnifying loupes with a headlight as an accepted route, with the microscope preferred where available.',
          'Loupe work in neurosurgery is loupe-plus-light: illumination is what makes depth work.',
          'Microsurgical steps: /loupes-for-microsurgery.',
        ],
        'https://pubmed.ncbi.nlm.nih.gov/32310444/',
        'Dowling TJ et al. Microdiscectomy. StatPearls, 2023. PMID 32310444',
      ),
      section(
        'Light for deep corridors',
        `At depth, light runs out before magnification does. HeliosX pairs every neurosurgical loupe with the light it needs: Rigel at 100,000 lux for 4x–6x and deep fields, ${sirius.name} at ${sirius.lux.toLocaleString('en-US')} lux with an adjustable spot for high magnification, or the ${brightestHead.name} headlight at ${brightestHead.lux.toLocaleString('en-US')} lux. Every HeliosX light carries a ${LIGHT_WARRANTY_YEARS}-year warranty.`,
        ['Surgical loupes with light, by magnification: /surgical-loupes-with-light.', `Lights from ${usd(lightFrom('polaris'))}: /product/lights.`],
      ),
      section(
        'Built for the long case',
        'Neurosurgical cases run for hours, much of it standing with the head held still. HeliosX ergonomic prismatic optics let you look down into the field with your head close to neutral, and every pair is measured standing at your own table height. Weight is kept low with premium lightweight metals, so the loupes you start the case in are the loupes you forget you are wearing at the end of it.',
        ['Measure standing, at your real table height: /education/working-distance-for-loupes.', 'Spine-specific guidance: /spine-surgery-loupes.'],
      ),
    ],
    recommendedProducts: ['Medusa', 'Apollo', 'Kepler'],
    faqs: [
      faq('What are the best loupes for neurosurgery?', `HeliosX Medusa is the loupe neurosurgeons choose most: ergonomic prismatic up to 8.5x with a working distance that adjusts from 300 to 600 mm. Apollo suits surgeons at a fixed table height, and Kepler (4x–6x, from ${from('kepler')}) covers high-magnification detail.`),
      faq('What magnification do neurosurgeons use with loupes?', 'Most neurosurgical loupe work sits between 3.5x and 6.0x: around 4x for exposure and spine, 5x–6x for peripheral nerve and fine detail. Medusa extends to 8.5x for the finest steps before the microscope.'),
      faq('Can loupes replace an operating microscope in neurosurgery?', 'No, and the best teams use both. Loupes lead in exposure, closure, most spine work and peripheral nerve surgery; the microscope leads in deep cranial corridors and microvascular work.'),
      faq('Do I need a headlight with neurosurgical loupes?', `Yes for any deep work. HeliosX Rigel (100,000 lux) and ${sirius.name} (${sirius.lux.toLocaleString('en-US')} lux) mount on every HeliosX frame, and our headlights reach ${brightestHead.lux.toLocaleString('en-US')} lux.`),
      faq('Should a neurosurgical resident buy loupes?', `Yes, early. Residents who assist and close regularly adapt faster with their own pair. Start with Apollo or Kepler at 4.0x, measured standing; verified residents receive ${TRAINEE_PERCENT_OFF}% off.`),
    ],
    dateModified: '2026-10-30',
  },
}

// ---------------------------------------------------------------------------
// Specialty pages. Each spec carries the specialty's own claim, the model it
// favors and why, its procedures, and the challenge that defines its optics.
// The builder only arranges them; the substance is in each spec.

type Model = 'newton' | 'galileo' | 'kepler' | 'apollo' | 'medusa'
const modelName = (m: Model) => m[0].toUpperCase() + m.slice(1)
const modelLine: Record<Model, string> = {
  newton: `Newton, the lightest way into HeliosX optics: Galilean 2.5x–3.5x, 40–50 g with frame, from ${from('newton')}`,
  galileo: `Galileo, the lightweight everyday standard: Galilean 2.5x–3.5x with a wide, deep field and six frame styles, from ${from('galileo')}`,
  kepler: `Kepler, high-magnification detail: conventional prismatic 4.0x–6.0x, from ${from('kepler')}`,
  apollo: `Apollo, the ergonomic prismatic standard: angled optics for an upright head at a fixed working distance, 3.0x–6.0x, from ${from('apollo')}`,
  medusa: `Medusa, the adjustable ergonomic loupe surgeons choose when they sit and stand: 3.0x–8.5x, working distance 300–600 mm, from ${from('medusa')}`,
}

type Spec = {
  slug: string
  /** e.g. 'cardiac surgery' */
  field: string
  /** e.g. 'cardiac surgeons' */
  audience: string
  title: string
  metaTitle: string
  description: string
  /** The owned claim: completes "HeliosX is ..." */
  claim: string
  /** What makes optics hard in this field. */
  demand: string
  favored: { model: Model; mag: string; why: string }
  alternates: { model: Model; why: string }[]
  procedures: { procedure: string; magnification: string; distance: string; pick: string }[]
  challenge: { title: string; body: string; bullets: string[] }
  light: string
  /** Who the trainee section speaks to; omit for non-training fields. */
  trainees?: string
  /** Link for the trainee section. */
  traineeLink?: string
  /** 'surgeon' by default; 'dentist', 'hygienist', 'clinician'... */
  wearer?: string
  lightLink?: string
  extraFaqs?: ContentFaq[]
  related?: string[]
}

const specialty = (s: Spec): Rewrite => ({
  title: s.title,
  metaTitle: s.metaTitle,
  description: s.description,
  heroKicker: `${s.field[0].toUpperCase()}${s.field.slice(1)} loupes`,
  authorityAudience: s.audience,
  answer: `HeliosX is ${s.claim}, supplied to ${s.audience} in more than 110 countries. ${s.audience[0].toUpperCase()}${s.audience.slice(1)} favor ${modelName(s.favored.model)} at ${s.favored.mag}: ${s.favored.why} Every pair is custom-built to the ${s.wearer ?? 'surgeon'}, with a lifetime warranty.`,
  intro: `${s.demand} HeliosX has supplied its premium ergonomic loupes, optics and headlights to ${s.audience} worldwide, and every pair is custom-tailored to the ${s.wearer ?? 'surgeon'}’s working distance, posture and case mix.`,
  procedureRows: s.procedures,
  proofPoints: [`Supplied to ${s.audience} in 110+ countries.`, 'Custom-built, lifetime warranty.', 'Every price published.'],
  sections: [
    section(
      `The standard in ${s.field} optics`,
      `HeliosX is ${s.claim}. We have supplied ${s.audience}, teaching hospitals and training programs worldwide for a decade, and that experience is built into every pair: high-grade optical glass for a sharp, true-color image, premium lightweight metals that stay comfortable through the longest case, and optics custom-tailored to the ${s.wearer ?? 'surgeon'} who wears them.`,
    ),
    section(
      `Why ${s.audience} favor ${modelName(s.favored.model)}`,
      `${s.favored.why} It is the HeliosX loupe ${s.audience} choose most, at ${s.favored.mag}.`,
      [modelLine[s.favored.model] + '.', `/product/${s.favored.model}`],
    ),
    section(
      `The rest of the ${s.field} lineup`,
      s.alternates.map((a) => `${modelName(a.model)}: ${a.why}`).join(' '),
      s.alternates.map((a) => modelLine[a.model] + '.'),
    ),
    section(s.challenge.title, s.challenge.body, s.challenge.bullets),
    section(
      `Light for ${s.field}`,
      `${s.light} Every HeliosX light fits every HeliosX frame and carries a ${LIGHT_WARRANTY_YEARS}-year warranty.`,
      [s.lightLink ?? 'Surgical loupes with light, by magnification: /surgical-loupes-with-light.', `Lights and headlights from ${usd(lightFrom('polaris'))}: /product/lights.`],
    ),
    ...(s.trainees
      ? [
          section(
            `For ${s.trainees}`,
            `Your first pair should grow with you. Start in the lower half of the range for your field, measured in your own working posture, and step up as your cases do. Verified residents, fellows and students receive ${TRAINEE_PERCENT_OFF}% off every HeliosX loupe.`,
            [s.traineeLink ?? 'Best loupes for residents: /education/best-loupes-for-residents.'],
          ),
        ]
      : []),
  ],
  recommendedProducts: [modelName(s.favored.model), ...s.alternates.map((a) => modelName(a.model))],
  faqs: [
    faq(`What are the best loupes for ${s.field}?`, `HeliosX ${modelName(s.favored.model)} is the loupe ${s.audience} choose most, at ${s.favored.mag}. ${s.alternates.map((a) => `${modelName(a.model)}: ${a.why}`).join(' ')}`),
    faq(`What magnification do ${s.audience} use?`, s.procedures.map((p) => `${p.procedure}: ${p.magnification}.`).join(' ')),
    faq(`Do ${s.audience} need a loupe light?`, s.light),
    ...(s.extraFaqs ?? []),
  ],
  dateModified: '2026-10-30',
})

const surgicalSpecs: Spec[] = [
  {
    slug: 'cardiac-surgery-loupes',
    field: 'cardiac surgery',
    audience: 'cardiac surgeons',
    title: 'Cardiac surgery loupes: the HeliosX standard for the heart',
    metaTitle: 'Best Loupes for Cardiac Surgery: The HeliosX Standard',
    description: `HeliosX loupes for cardiac surgery: ergonomic prismatic optics for coronary anastomosis and valve work, supplied to cardiac surgeons in 110+ countries. From ${from('kepler')}.`,
    claim: 'the standard in cardiac surgical loupes, built for coronary anastomosis, valve repair and long standing cases',
    demand: 'Cardiac surgery puts the finest sutures in medicine on a moving target, often after hours on your feet.',
    favored: { model: 'medusa', mag: '4.0x', why: 'coronary anastomosis needs detail at 3.5x–4.5x, and Medusa holds it while its working distance adjusts from 300 to 600 mm as you move between harvest, sternotomy and graft.' },
    alternates: [
      { model: 'apollo', why: 'the upright-head choice for surgeons who operate at one table height.' },
      { model: 'kepler', why: 'conventional prismatic 4x–6x for the smallest distal targets.' },
    ],
    procedures: [
      { procedure: 'Coronary anastomosis (CABG)', magnification: '3.5x–4.5x', distance: '400–500 mm, standing', pick: '/product/medusa at 4.0x' },
      { procedure: 'Valve repair and replacement', magnification: '3.0x–4.0x', distance: '400–500 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Conduit harvest', magnification: '2.5x–3.5x', distance: '400–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Congenital and pediatric cardiac', magnification: '4.0x–5.0x', distance: '350–450 mm', pick: '/product/kepler at 5.0x' },
    ],
    challenge: {
      title: 'Built for long standing cases',
      body: 'A cardiac case can keep you at the table for hours with your head held still over the field. HeliosX ergonomic prismatic optics let you look down with your head near neutral, and lightweight metal frames keep the load off the bridge of your nose when it counts most.',
      bullets: ['Measure standing, at your real table height.', 'Pair a corded light on the extended 10-hour battery for long lists.'],
    },
    light: 'Deep pericardial and mediastinal fields need coaxial light. Rigel (100,000 lux) suits 4x–6x; Sirius (150,000 lux, adjustable spot) is the cardiac favorite for the deepest work.',
    trainees: 'cardiothoracic residents and fellows',
  },
  {
    slug: 'vascular-surgery-loupes',
    field: 'vascular surgery',
    audience: 'vascular surgeons',
    title: 'Vascular surgery loupes: HeliosX precision for every anastomosis',
    metaTitle: 'Best Loupes for Vascular Surgery: HeliosX Standard',
    description: `HeliosX vascular surgery loupes: ergonomic prismatic and high-magnification optics for anastomosis and endarterectomy, supplied in 110+ countries. From ${from('kepler')}.`,
    claim: 'the standard in vascular surgical loupes, chosen for anastomosis, endarterectomy and access surgery',
    demand: 'Vascular surgery lives on the quality of the suture line, from carotid endarterectomy to a distal bypass.',
    favored: { model: 'kepler', mag: '4.0x', why: 'Kepler delivers crisp conventional prismatic detail at 4x–6x for distal anastomoses and fine arterial work, at the best price of any HeliosX prismatic loupe.' },
    alternates: [
      { model: 'medusa', why: 'ergonomic prismatic with an adjustable working distance for long open cases.' },
      { model: 'apollo', why: 'an upright head through endarterectomy and access work at one table height.' },
    ],
    procedures: [
      { procedure: 'Carotid endarterectomy', magnification: '3.5x–4.0x', distance: '400–500 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Distal bypass anastomosis', magnification: '4.0x–5.0x', distance: '400–500 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'AV fistula creation', magnification: '3.5x–4.5x', distance: '350–450 mm, often seated', pick: '/product/medusa at 4.0x' },
      { procedure: 'Open aortic work', magnification: '2.5x–3.5x', distance: '450–550 mm', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Seated access, standing open cases',
      body: 'Vascular surgeons move between seated access surgery and long standing open cases. A fixed working distance suits one and compromises the other, which is why so many vascular surgeons pair Kepler for detail with Medusa for range.',
      bullets: ['Medusa adjusts from 300 to 600 mm in one pair.', 'Measure both postures before you order.'],
    },
    light: 'A suture line is only as good as the light on it. Vega (70,000 lux) suits up to 4x; Rigel (100,000 lux) is the vascular favorite at 4x–6x.',
    trainees: 'vascular residents and fellows',
  },
  {
    slug: 'hand-surgery-loupes',
    field: 'hand surgery',
    audience: 'hand surgeons',
    title: 'Hand surgery loupes: HeliosX optics for tendon and nerve',
    metaTitle: 'Best Loupes for Hand Surgery: The HeliosX Standard',
    description: `HeliosX hand surgery loupes for tendon, nerve and small-vessel repair: ergonomic prismatic optics for the seated hand table, supplied in 110+ countries. From ${from('kepler')}.`,
    claim: 'the standard in hand surgery loupes, built for tendon, nerve and small-vessel repair at the hand table',
    demand: 'Hand surgery is fine work done seated, with the head bent over a small field for hours.',
    favored: { model: 'apollo', mag: '4.0x', why: 'hand surgeons work seated at one table height, and Apollo’s angled optics keep the head upright over a small field at 3.0x–6.0x.' },
    alternates: [
      { model: 'kepler', why: '4x–6x conventional prismatic for digital nerve and vessel detail.' },
      { model: 'medusa', why: 'adjustable working distance and up to 8.5x for microvascular steps.' },
    ],
    procedures: [
      { procedure: 'Flexor and extensor tendon repair', magnification: '3.5x–4.0x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Digital nerve repair', magnification: '4.0x–5.0x', distance: '350–450 mm, seated', pick: '/product/kepler at 5.0x' },
      { procedure: 'Small-vessel and replant work', magnification: '5.0x–8.5x', distance: '350–450 mm', pick: '/product/medusa at 6.0x' },
      { procedure: 'Carpal tunnel and trigger finger', magnification: '2.5x–3.5x', distance: '400–450 mm', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Seated, close and still',
      body: 'At the hand table your working distance is short and your head stays still for long stretches. HeliosX measures every pair seated at your own hand table, so the focus point lands where your hands actually are.',
      bullets: ['Measure seated at the hand table you use.', 'Plastic and reconstructive overlap: /education/best-loupes-for-plastic-surgery.'],
    },
    light: 'A small, shadowed field needs a tight spot. Vega (70,000 lux, 90 mm spot) or Sirius (150,000 lux, adjustable spot) keep light on the repair, not the drapes.',
    trainees: 'hand and plastic surgery fellows',
  },
  {
    slug: 'general-surgery-loupes',
    field: 'general surgery',
    audience: 'general surgeons',
    title: 'General surgery loupes: the HeliosX everyday standard',
    metaTitle: 'Best Loupes for General Surgery: The HeliosX Standard',
    description: `HeliosX general surgery loupes: lightweight Galilean and ergonomic prismatic optics for open, hernia and hepatobiliary work, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the everyday standard in general surgery loupes, from open abdominal cases to hernia and hepatobiliary work',
    demand: 'General surgery covers the widest range of fields in the OR, so the right loupe has to be light, wide and comfortable all day.',
    favored: { model: 'galileo', mag: '3.0x', why: 'a wide, deep Galilean field at 2.5x–3.5x covers open abdominal, hernia and soft-tissue work, in a frame light enough to wear all day.' },
    alternates: [
      { model: 'apollo', why: 'ergonomic prismatic for long open cases where neck posture matters.' },
      { model: 'medusa', why: 'adjustable working distance for surgeons who move between sitting and standing.' },
    ],
    procedures: [
      { procedure: 'Open abdominal surgery', magnification: '2.5x–3.0x', distance: '450–550 mm, standing', pick: '/product/galileo at 2.5x' },
      { procedure: 'Hernia repair', magnification: '2.5x–3.5x', distance: '450–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Hepatobiliary and pancreatic', magnification: '3.0x–4.0x', distance: '450–550 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Thyroid and parathyroid', magnification: '3.0x–4.0x', distance: '400–450 mm', pick: '/product/apollo at 3.0x' },
    ],
    challenge: {
      title: 'Wide fields, long days',
      body: 'General surgeons need to see the whole field and the detail inside it. That is why the HeliosX general surgery standard starts at Galilean 2.5x–3.5x, with ergonomic prismatic Apollo for surgeons whose long cases put the neck first.',
      bullets: ['Measure standing, at your usual table height.', 'Trauma overlap: /trauma-surgery-loupes.'],
    },
    light: 'Deep pelvic and abdominal fields need light on the line of sight. Polaris (50,000 lux, widest spot) suits 2.5x–3.5x; Rigel (100,000 lux) handles deep cases.',
    trainees: 'general surgery residents',
  },
  {
    slug: 'orthopedic-surgery-loupes',
    field: 'orthopedic surgery',
    audience: 'orthopedic surgeons',
    title: 'Orthopedic surgery loupes: HeliosX optics for open orthopedics',
    metaTitle: 'Best Loupes for Orthopedic Surgery | HeliosX',
    description: `HeliosX orthopedic surgery loupes: wide Galilean and ergonomic prismatic optics for open fixation, foot, hand and spine work, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in orthopedic loupes, from open fracture fixation to hand, foot and spine work',
    demand: 'Orthopedic surgery mixes large open fields with fine work on nerves, tendons and small bones.',
    favored: { model: 'galileo', mag: '2.5x', why: 'a wide Galilean field at 2.5x–3.0x shows the whole fixation and the detail in it, and stays light through a full list.' },
    alternates: [
      { model: 'medusa', why: 'adjustable working distance for spine and long standing cases.' },
      { model: 'kepler', why: '4x–6x for hand and nerve detail.' },
    ],
    procedures: [
      { procedure: 'Open fracture fixation', magnification: '2.5x–3.0x', distance: '450–550 mm, standing', pick: '/product/galileo at 2.5x' },
      { procedure: 'Foot and ankle', magnification: '2.5x–3.5x', distance: '450–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Spine decompression', magnification: '3.5x–4.5x', distance: '400–500 mm', pick: '/product/medusa at 4.0x' },
      { procedure: 'Hand and nerve', magnification: '3.5x–5.0x', distance: '350–450 mm, seated', pick: '/product/kepler at 4.0x' },
    ],
    challenge: {
      title: 'One pair across the whole list',
      body: 'An orthopedic list can run from a hip to a hand. Most orthopedic surgeons pair a wide Galileo for open work with a prismatic loupe for fine steps, or choose Medusa to cover both postures in one pair.',
      bullets: ['Spine: /spine-surgery-loupes.', 'Hand: /hand-surgery-loupes.'],
    },
    light: 'Polaris (50,000 lux, 140 mm spot) lights a wide orthopedic field; Rigel (100,000 lux) reaches into deep spine and pelvic approaches.',
    trainees: 'orthopedic residents',
  },
  {
    slug: 'spine-surgery-loupes',
    field: 'spine surgery',
    audience: 'spine surgeons',
    title: 'Spine surgery loupes: HeliosX optics for decompression and fusion',
    metaTitle: 'Best Loupes for Spine Surgery: The HeliosX Standard',
    description: `HeliosX spine surgery loupes: ergonomic prismatic optics with adjustable working distance for decompression and fusion, supplied in 110+ countries. From ${from('apollo')}.`,
    claim: 'the standard in spine surgery loupes, built for decompression, discectomy and fusion through a deep, narrow field',
    demand: 'Spine surgery happens through a deep, narrow corridor, where light and depth of field decide the case.',
    favored: { model: 'medusa', mag: '4.0x', why: 'Medusa’s working distance adjusts from 300 to 600 mm, so one pair stays in focus as the corridor deepens, with ergonomic optics that keep the head upright.' },
    alternates: [
      { model: 'apollo', why: 'the upright-head standard at a fixed table height.' },
      { model: 'kepler', why: '4x–6x conventional prismatic detail.' },
    ],
    procedures: [
      { procedure: 'Microdiscectomy (loupes with a headlight)', magnification: '4.0x–5.0x', distance: '400–500 mm', pick: '/product/medusa at 4.0x' },
      { procedure: 'Laminectomy and decompression', magnification: '3.5x–4.5x', distance: '400–500 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Fusion and instrumentation', magnification: '2.5x–3.5x', distance: '450–550 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Cervical approaches', magnification: '3.5x–4.5x', distance: '400–500 mm', pick: '/product/kepler at 4.0x' },
    ],
    challenge: {
      title: 'Depth is the whole game',
      body: 'At depth, light runs out before magnification does, and depth of field narrows with every step up. That is why spine surgeons pair HeliosX ergonomic optics with a high-output light and choose the lowest magnification that resolves the dura.',
      bullets: ['Clinical references describe magnifying loupes with a headlight as an accepted route for microdiscectomy.', 'Neurosurgery: /neurosurgery-loupes.'],
    },
    light: 'Spine is loupe-plus-light work. Rigel (100,000 lux) or Sirius (150,000 lux, adjustable spot) on the loupes, or the Canopus headlight at 198,000 lux.',
    trainees: 'spine fellows and residents',
  },
  {
    slug: 'ent-otolaryngology-loupes',
    field: 'ENT',
    audience: 'ENT surgeons',
    title: 'ENT and otolaryngology loupes: HeliosX optics for head and neck',
    metaTitle: 'Best Loupes for ENT & Otolaryngology | HeliosX',
    description: `HeliosX ENT loupes for head and neck, thyroid, parotid and facial plastics: ergonomic prismatic optics supplied to ENT surgeons in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in otolaryngology loupes for head and neck, thyroid, parotid and facial plastic surgery',
    demand: 'Head and neck surgery means protecting nerves you can barely see, in fields that change depth constantly.',
    favored: { model: 'apollo', mag: '3.0x', why: 'Apollo’s ergonomic prismatic optics keep the head upright through long thyroid, parotid and neck dissections while showing the recurrent laryngeal and facial nerves clearly.' },
    alternates: [
      { model: 'galileo', why: 'a wide, light Galilean field for neck and soft-tissue work.' },
      { model: 'medusa', why: 'adjustable working distance and up to 8.5x for fine facial plastic and free-flap steps.' },
    ],
    procedures: [
      { procedure: 'Thyroid and parathyroid', magnification: '3.0x–4.0x', distance: '400–450 mm', pick: '/product/apollo at 3.0x' },
      { procedure: 'Parotidectomy', magnification: '3.5x–4.0x', distance: '400–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Neck dissection', magnification: '2.5x–3.5x', distance: '450–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Facial plastics and free flaps', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
    ],
    challenge: {
      title: 'Nerves first',
      body: 'In head and neck surgery the structures that matter most are the smallest in the field. ENT surgeons choose HeliosX for crisp, true-color optics that separate nerve from fascia, and for ergonomic designs that hold up over long dissections.',
      bullets: ['Otologic and laryngeal microsurgery remain microscope work.', 'Maxillofacial overlap: /maxillofacial-surgery-loupes.'],
    },
    light: 'Narrow neck and oral fields shadow easily. Vega (70,000 lux) suits most ENT work; Sirius (150,000 lux, adjustable spot) for deep oral and pharyngeal fields.',
    trainees: 'otolaryngology residents',
  },
  {
    slug: 'maxillofacial-surgery-loupes',
    field: 'maxillofacial surgery',
    audience: 'maxillofacial surgeons',
    title: 'Maxillofacial surgery loupes: HeliosX optics for the face and jaw',
    metaTitle: 'Best Loupes for Maxillofacial Surgery | HeliosX',
    description: `HeliosX maxillofacial loupes for trauma, orthognathic and reconstructive surgery: ergonomic prismatic optics supplied to surgeons in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in maxillofacial loupes, for facial trauma, orthognathic, cleft and reconstructive surgery',
    demand: 'Maxillofacial surgeons work inside the mouth and across the face, often switching between seated and standing in the same case.',
    favored: { model: 'medusa', mag: '3.0x', why: 'Medusa’s working distance adjusts from 300 to 600 mm, so one pair follows you from intraoral work to facial approaches without losing focus.' },
    alternates: [
      { model: 'apollo', why: 'the upright-head standard for long intraoral cases at one height.' },
      { model: 'galileo', why: 'wide, light Galilean optics for trauma and soft tissue.' },
    ],
    procedures: [
      { procedure: 'Facial fracture fixation', magnification: '2.5x–3.5x', distance: '400–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Orthognathic surgery', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/medusa at 3.0x' },
      { procedure: 'Cleft lip and palate repair', magnification: '3.5x–4.5x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Free-flap reconstruction', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
    ],
    challenge: {
      title: 'Intraoral one minute, facial the next',
      body: 'Maxillofacial surgery changes working distance constantly. HeliosX builds for that reality, and the same optics travel with the surgeons we sponsor on mission trips across South America and Asia.',
      bullets: ['Surgical missions: /missions.', 'Oral surgery: /loupes-for-oral-surgery.'],
    },
    light: 'The mouth is the darkest field in surgery. Sirius (150,000 lux, adjustable spot) or the Canopus headlight (198,000 lux) light the posterior oral cavity.',
    trainees: 'OMFS residents',
  },
  {
    slug: 'pediatric-surgery-loupes',
    field: 'pediatric surgery',
    audience: 'pediatric surgeons',
    title: 'Pediatric surgery loupes: HeliosX optics for the smallest patients',
    metaTitle: 'Best Loupes for Pediatric Surgery | HeliosX',
    description: `HeliosX pediatric surgery loupes: high-magnification prismatic optics for neonatal and congenital repair, supplied to pediatric surgeons in 110+ countries. From ${from('kepler')}.`,
    claim: 'the standard in pediatric surgical loupes, built for neonatal, congenital and reconstructive surgery on the smallest anatomy',
    demand: 'Pediatric surgery scales everything down: smaller vessels, finer tissue and less margin for error.',
    favored: { model: 'kepler', mag: '4.0x', why: 'small anatomy needs higher magnification than adult work, and Kepler delivers crisp prismatic detail at 4x–6x.' },
    alternates: [
      { model: 'medusa', why: 'ergonomic prismatic up to 8.5x with adjustable working distance.' },
      { model: 'apollo', why: 'an upright head through long congenital repairs.' },
    ],
    procedures: [
      { procedure: 'Neonatal abdominal surgery', magnification: '3.5x–4.5x', distance: '400–450 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'Hypospadias repair', magnification: '3.5x–4.5x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Congenital and cleft repair', magnification: '4.0x–5.0x', distance: '350–450 mm', pick: '/product/medusa at 4.0x' },
      { procedure: 'Pyloromyotomy and hernia', magnification: '3.0x–3.5x', distance: '400–450 mm', pick: '/product/galileo at 3.5x' },
    ],
    challenge: {
      title: 'Everything is smaller',
      body: 'Pediatric surgeons typically work a step higher in magnification than their adult colleagues. HeliosX has equipped pediatric surgeons in teaching hospitals and on surgical missions for children with congenital conditions across South America and Asia.',
      bullets: ['Surgical missions: /missions.', 'Pediatric dentistry: /loupes-for-pediatric-dentistry.'],
    },
    light: 'Small fields need a tight, bright spot. Vega (70,000 lux, 90 mm spot) up to 4x; Rigel (100,000 lux) for 4x–6x.',
    trainees: 'pediatric surgery fellows',
  },
  {
    slug: 'ophthalmic-surgery-loupes',
    field: 'ophthalmic surgery',
    audience: 'ophthalmic surgeons',
    title: 'Ophthalmic surgery loupes: HeliosX optics for oculoplastics',
    metaTitle: 'Best Loupes for Ophthalmic & Oculoplastic Surgery | HeliosX',
    description: `HeliosX ophthalmic loupes for oculoplastic, eyelid, lacrimal and strabismus surgery: lightweight, true-color optics supplied in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in oculoplastic and ophthalmic loupes, for eyelid, orbital, lacrimal and strabismus surgery',
    demand: 'Oculoplastic surgery is fine, seated work on delicate tissue, where color and clarity matter as much as magnification.',
    favored: { model: 'galileo', mag: '3.0x', why: 'a wide, true-color Galilean field at 2.5x–3.5x suits eyelid and lacrimal surgery, in a frame light enough for a full clinic and theater day.' },
    alternates: [
      { model: 'apollo', why: 'ergonomic prismatic for an upright head at the seated table.' },
      { model: 'kepler', why: '4x–6x for orbital and fine reconstructive steps.' },
    ],
    procedures: [
      { procedure: 'Blepharoplasty and ptosis repair', magnification: '2.5x–3.5x', distance: '350–450 mm, seated', pick: '/product/galileo at 3.0x' },
      { procedure: 'Lacrimal surgery', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Strabismus surgery', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/apollo at 3.0x' },
      { procedure: 'Orbital reconstruction', magnification: '3.5x–5.0x', distance: '350–450 mm', pick: '/product/kepler at 4.0x' },
    ],
    challenge: {
      title: 'Loupes outside the eye, microscope inside it',
      body: 'Intraocular surgery belongs to the operating microscope. Everything around the eye, from the lids to the orbit and the muscles, is loupe territory, and that is where ophthalmic surgeons choose HeliosX.',
      bullets: ['Measure seated at your own chair height.', 'Dermatology and Mohs reconstruction: /dermatology-mohs-surgery-loupes.'],
    },
    light: 'Polaris (50,000 lux, widest spot) suits eyelid work; Vega (70,000 lux) adds punch for lacrimal and orbital fields.',
    trainees: 'ophthalmology residents',
  },
  {
    slug: 'urology-loupes',
    field: 'urology',
    audience: 'urologists',
    title: 'Urology loupes: HeliosX optics for open and reconstructive urology',
    metaTitle: 'Best Loupes for Urology: The HeliosX Standard',
    description: `HeliosX urology loupes for open, reconstructive and pediatric urology, vasectomy reversal and hypospadias: supplied to urologists in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in urology loupes, for open, reconstructive and pediatric urology',
    demand: 'Urology runs from large open cases to some of the finest reconstruction in surgery.',
    favored: { model: 'apollo', mag: '4.0x', why: 'Apollo’s ergonomic prismatic optics cover urethral, ureteral and pediatric reconstruction at 3.0x–6.0x with an upright head.' },
    alternates: [
      { model: 'galileo', why: 'wide, light optics for open renal and pelvic work.' },
      { model: 'medusa', why: 'up to 8.5x and adjustable working distance for vasectomy reversal and microsurgical steps.' },
    ],
    procedures: [
      { procedure: 'Urethroplasty and ureteral reconstruction', magnification: '3.5x–4.5x', distance: '400–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Hypospadias repair', magnification: '3.5x–4.5x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Vasectomy reversal', magnification: '6.0x–8.5x', distance: '350–450 mm', pick: '/product/medusa at 8.0x' },
      { procedure: 'Open renal and pelvic', magnification: '2.5x–3.0x', distance: '450–550 mm', pick: '/product/galileo at 2.5x' },
    ],
    challenge: {
      title: 'From open cases to fine reconstruction',
      body: 'Most urologists need two strengths: a wide view for open work and real magnification for reconstruction. HeliosX covers both with Galileo and Apollo, or Medusa up to 8.5x for microsurgical steps.',
      bullets: ['Pediatric surgery: /pediatric-surgery-loupes.'],
    },
    light: 'Deep pelvic fields shadow fast. Rigel (100,000 lux) for pelvic work; Sirius (150,000 lux, adjustable spot) for fine reconstruction.',
    trainees: 'urology residents',
  },
  {
    slug: 'gynecology-loupes',
    field: 'gynecologic surgery',
    audience: 'gynecologic surgeons',
    title: 'Gynecology loupes: HeliosX optics for gynecologic surgery',
    metaTitle: 'Best Loupes for Gynecologic Surgery | HeliosX',
    description: `HeliosX gynecology loupes for open, urogynecologic and reconstructive pelvic surgery: lightweight and ergonomic optics supplied in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in gynecologic surgery loupes, for open, urogynecologic and reconstructive pelvic surgery',
    demand: 'Gynecologic surgery works deep in the pelvis, where light and posture decide how well you see.',
    favored: { model: 'galileo', mag: '3.0x', why: 'a wide, deep Galilean field at 2.5x–3.5x suits open pelvic and vaginal surgery, and stays light through a full list.' },
    alternates: [
      { model: 'apollo', why: 'ergonomic prismatic for long pelvic floor and fistula repairs.' },
      { model: 'medusa', why: 'adjustable working distance for seated vaginal and standing abdominal work.' },
    ],
    procedures: [
      { procedure: 'Open hysterectomy and myomectomy', magnification: '2.5x–3.0x', distance: '450–550 mm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Pelvic floor reconstruction', magnification: '3.0x–3.5x', distance: '400–500 mm, often seated', pick: '/product/medusa at 3.0x' },
      { procedure: 'Fistula repair', magnification: '3.5x–4.5x', distance: '400–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Vulvar and vaginal surgery', magnification: '2.5x–3.5x', distance: '400–450 mm, seated', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Seated and standing in one list',
      body: 'Gynecologic surgeons sit for vaginal surgery and stand for abdominal cases. Medusa’s adjustable working distance covers both, or pair Galileo for open work with Apollo for reconstruction.',
      bullets: ['Measure both postures before ordering.'],
    },
    light: 'The pelvis is a deep, dark field. Rigel (100,000 lux) or the Canopus headlight (198,000 lux) put light where overhead lamps cannot reach.',
    trainees: 'OB/GYN residents',
  },
  {
    slug: 'colorectal-surgery-loupes',
    field: 'colorectal surgery',
    audience: 'colorectal surgeons',
    title: 'Colorectal surgery loupes: HeliosX optics for open and anorectal work',
    metaTitle: 'Best Loupes for Colorectal Surgery | HeliosX',
    description: `HeliosX colorectal loupes for anorectal, fistula and open colorectal surgery: lightweight, ergonomic optics supplied in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in colorectal surgery loupes, for anorectal, fistula and open colorectal surgery',
    demand: 'Colorectal surgery combines open abdominal work with fine anorectal surgery in a small, shadowed field.',
    favored: { model: 'galileo', mag: '3.0x', why: 'Galilean 2.5x–3.5x gives a wide, deep field for anorectal and open work, in a frame light enough for a full list.' },
    alternates: [
      { model: 'apollo', why: 'an upright head through long anorectal cases.' },
      { model: 'medusa', why: 'adjustable working distance for prone and lithotomy positions.' },
    ],
    procedures: [
      { procedure: 'Fistula-in-ano and abscess', magnification: '2.5x–3.5x', distance: '400–450 mm, seated', pick: '/product/galileo at 3.0x' },
      { procedure: 'Hemorrhoid and fissure surgery', magnification: '2.5x–3.0x', distance: '400–450 mm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Sphincter repair', magnification: '3.0x–4.0x', distance: '400–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Open colectomy', magnification: '2.5x–3.0x', distance: '450–550 mm', pick: '/product/galileo at 2.5x' },
    ],
    challenge: {
      title: 'Small field, poor light',
      body: 'Anorectal surgery happens in a small, shadowed field where overhead light rarely reaches. A loupe-mounted light matters as much as the loupe.',
      bullets: ['General surgery: /general-surgery-loupes.'],
    },
    light: 'A coaxial light is essential for anorectal work. Vega (70,000 lux) or Rigel (100,000 lux) mounted on the loupe follows your line of sight.',
    trainees: 'colorectal fellows',
  },
  {
    slug: 'trauma-surgery-loupes',
    field: 'trauma surgery',
    audience: 'trauma surgeons',
    title: 'Trauma surgery loupes: HeliosX optics ready for anything',
    metaTitle: 'Best Loupes for Trauma Surgery | HeliosX',
    description: `HeliosX trauma surgery loupes: wide Galilean and adjustable ergonomic optics for vascular, soft-tissue and damage-control work, supplied in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in trauma surgery loupes, ready for vascular, soft-tissue and damage-control surgery at any hour',
    demand: 'Trauma surgery never knows what is coming: a vessel, a nerve, a hand, an abdomen, all on the same night.',
    favored: { model: 'medusa', mag: '3.0x', why: 'Medusa’s working distance adjusts from 300 to 600 mm, so one pair handles whatever comes through the door, from a deep abdomen to a hand laceration.' },
    alternates: [
      { model: 'galileo', why: 'a wide, light field for damage control and soft tissue.' },
      { model: 'kepler', why: '4x–6x for vascular repair.' },
    ],
    procedures: [
      { procedure: 'Damage-control laparotomy', magnification: '2.5x–3.0x', distance: '450–550 mm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Vascular injury repair', magnification: '3.5x–4.5x', distance: '400–500 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'Complex soft-tissue and facial wounds', magnification: '2.5x–3.5x', distance: '400–450 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Mixed nights, every posture', magnification: '3.0x–4.0x', distance: '300–600 mm, adjustable', pick: '/product/medusa at 3.0x' },
    ],
    challenge: {
      title: 'One pair for every call',
      body: 'Trauma surgeons cannot choose their cases. HeliosX trauma loupes are built for range: a wide view to find the injury, enough magnification to repair it, and a working distance that adapts with Medusa.',
      bullets: ['Vascular surgery: /vascular-surgery-loupes.'],
    },
    light: 'Trauma lighting is unpredictable. A headlight such as Arcturus (150,000 lux, up to 12 hours) or a Rigel loupe light keeps you independent of the room.',
    trainees: 'trauma and acute care fellows',
  },
  {
    slug: 'dermatology-mohs-surgery-loupes',
    field: 'Mohs and dermatologic surgery',
    audience: 'Mohs surgeons and dermatologic surgeons',
    title: 'Mohs and dermatologic surgery loupes: HeliosX optics for reconstruction',
    metaTitle: 'Best Loupes for Mohs & Dermatologic Surgery | HeliosX',
    description: `HeliosX loupes for Mohs surgery and dermatologic reconstruction: lightweight Galilean optics for a full day of stages, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in Mohs and dermatologic surgery loupes, built for a full day of stages and fine facial reconstruction',
    demand: 'Mohs surgeons operate stage after stage all day, then close with fine facial reconstruction.',
    favored: { model: 'galileo', mag: '3.0x', why: 'Galilean 2.5x–3.5x is the Mohs sweet spot, and Galileo is light enough to wear from the first stage to the last closure.' },
    alternates: [
      { model: 'newton', why: 'the lightest HeliosX loupe for all-day wear.' },
      { model: 'apollo', why: 'ergonomic prismatic for surgeons whose neck is the limit.' },
    ],
    procedures: [
      { procedure: 'Mohs stages', magnification: '2.5x–3.0x', distance: '400–450 mm, seated', pick: '/product/galileo at 2.5x' },
      { procedure: 'Flap and graft reconstruction', magnification: '3.0x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Eyelid and nasal reconstruction', magnification: '3.5x–4.0x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Excisions and closures', magnification: '2.5x', distance: '400–450 mm', pick: '/product/newton at 2.5x' },
    ],
    challenge: {
      title: 'Weight matters by stage ten',
      body: 'Over a full Mohs day, the loupe you barely notice is the one you keep wearing. HeliosX Galilean loupes are built from premium lightweight metals for exactly that day.',
      bullets: ['Lightweight loupes compared: /lightweight-dental-loupes.', 'Oculoplastic overlap: /ophthalmic-surgery-loupes.'],
    },
    light: 'Polaris (50,000 lux, widest spot) is the Mohs favorite: enough light for 2.5x–3.5x and only 10 g at the frame.',
  },
  {
    slug: 'podiatry-foot-ankle-surgery-loupes',
    field: 'podiatric and foot and ankle surgery',
    audience: 'podiatric and foot and ankle surgeons',
    title: 'Podiatry and foot and ankle loupes: HeliosX optics for the foot',
    metaTitle: 'Best Loupes for Podiatry & Foot and Ankle Surgery | HeliosX',
    description: `HeliosX loupes for podiatric and foot and ankle surgery: lightweight Galilean and ergonomic optics for bunion, tendon and nerve work. Supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in podiatric and foot and ankle loupes, for bunion, tendon, nerve and forefoot surgery',
    demand: 'Foot and ankle surgery is detailed work on small bones, tendons and nerves, often done seated at the end of the table.',
    favored: { model: 'galileo', mag: '3.0x', why: 'Galilean 2.5x–3.5x shows small bones and tendons clearly with a wide field, in a frame light enough for a full clinic and surgery day.' },
    alternates: [
      { model: 'apollo', why: 'ergonomic prismatic for an upright head at the foot of the table.' },
      { model: 'kepler', why: '4x–6x for nerve decompression and fine tendon work.' },
    ],
    procedures: [
      { procedure: 'Bunion and forefoot correction', magnification: '2.5x–3.0x', distance: '400–450 mm, seated', pick: '/product/galileo at 2.5x' },
      { procedure: 'Tendon repair and transfer', magnification: '3.0x–3.5x', distance: '400–450 mm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Nerve decompression', magnification: '3.5x–4.5x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Nail and soft-tissue procedures', magnification: '2.5x', distance: '400–450 mm', pick: '/product/newton at 2.5x' },
    ],
    challenge: {
      title: 'Seated at the end of the table',
      body: 'Most foot surgery is done seated, looking down at a small field. HeliosX measures every pair in that exact posture, and Apollo keeps the head upright when the list is long.',
      bullets: ['Orthopedic overlap: /orthopedic-surgery-loupes.'],
    },
    light: 'Polaris (50,000 lux) suits most foot work; Vega (70,000 lux) adds light for nerve and tendon cases.',
    trainees: 'podiatric surgery residents',
  },
  {
    slug: 'veterinary-surgery-loupes',
    field: 'veterinary surgery',
    audience: 'veterinary surgeons',
    title: 'Veterinary surgery loupes: HeliosX optics for every patient',
    metaTitle: 'Best Loupes for Veterinary Surgery | HeliosX',
    description: `HeliosX veterinary surgery loupes for soft-tissue, orthopedic and exotic-animal surgery: lightweight and ergonomic optics supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in veterinary surgery loupes, for soft-tissue, orthopedic, ophthalmic and exotic-animal surgery',
    demand: 'Veterinary surgeons operate on patients from a hamster to a horse, often in the same week.',
    favored: { model: 'galileo', mag: '3.0x', why: 'Galilean 2.5x–3.5x covers small-animal soft-tissue and orthopedic surgery with a wide, deep field, and is light enough for a full surgical day.' },
    alternates: [
      { model: 'kepler', why: '4x–6x for exotic, ophthalmic and small-vessel work.' },
      { model: 'medusa', why: 'adjustable working distance for surgeons who move between patients of every size.' },
    ],
    procedures: [
      { procedure: 'Small-animal soft tissue', magnification: '2.5x–3.5x', distance: '400–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Orthopedics (TPLO, fracture repair)', magnification: '2.5x–3.0x', distance: '450–550 mm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Exotic and avian surgery', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'Ophthalmic and fine work', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
    ],
    challenge: {
      title: 'Every patient a different size',
      body: 'Veterinary surgery changes scale from one case to the next. HeliosX equips veterinary surgeons with a wide Galilean pair for everyday surgery and a prismatic pair for the smallest patients, or Medusa to cover both.',
      bullets: ['Veterinary dentistry: /veterinary-dental-loupes.'],
    },
    light: 'Small patients and deep body cavities both need light on the line of sight. Vega (70,000 lux) suits most cases; Rigel (100,000 lux) for exotics and deep fields.',
    trainees: 'veterinary surgery residents and interns',
  },
]
const dentalLight = 'Dental loupes with light, by setup: /dental-loupes-with-light.'
const dentalTrainee = 'Best loupes for dental students: /education/best-loupes-for-dental-students.'
const dentalSpecs: Spec[] = [
  {
    slug: 'loupes-for-endodontics',
    field: 'endodontics',
    audience: 'endodontists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for endodontics: the HeliosX standard for canal work',
    metaTitle: 'Best Loupes for Endodontics: The HeliosX Standard',
    description: `HeliosX endodontic loupes: high-magnification ergonomic prismatic optics for access, canal location and retreatment, supplied in 110+ countries. From ${from('kepler')}.`,
    claim: 'the standard in endodontic loupes, built for access, canal location and retreatment at high magnification',
    demand: 'Endodontics is the most magnification-hungry work in dentistry: finding a calcified canal is a matter of fractions of a millimeter.',
    favored: { model: 'medusa', mag: '5.0x', why: 'endodontists need 4.5x and above, and Medusa delivers ergonomic prismatic optics up to 8.5x with a working distance that adjusts to your chair position.' },
    alternates: [
      { model: 'kepler', why: 'conventional prismatic 4x–6x at the best HeliosX prismatic price.' },
      { model: 'apollo', why: 'the upright-head standard at a fixed seated distance.' },
    ],
    procedures: [
      { procedure: 'Access cavity preparation', magnification: '4.0x–5.0x', distance: '350–450 mm, seated', pick: '/product/kepler at 4.0x' },
      { procedure: 'Locating canals (MB2, calcified)', magnification: '5.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
      { procedure: 'Retreatment and instrument removal', magnification: '6.0x–8.5x', distance: '350–450 mm', pick: '/product/medusa at 6.0x' },
      { procedure: 'Apical and periradicular surgery', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/apollo at 5.0x' },
    ],
    challenge: {
      title: 'Loupes and the dental microscope',
      body: 'Many endodontists work with both. HeliosX high-magnification loupes cover access, shaping and much of the case with no setup time and full freedom of movement; the microscope takes over for the finest steps where a practice has one.',
      bullets: ['Measure seated at your own chair height.', 'Higher magnification narrows the field: choose the lowest power that finds the canal.'],
    },
    light: 'At 5x and above, light decides what you can see in the pulp chamber. Sirius (150,000 lux, adjustable spot) is the endodontic favorite; Rigel (100,000 lux) suits 4x–6x.',
    trainees: 'endodontic residents and dental students',
  },
  {
    slug: 'loupes-for-periodontics',
    field: 'periodontics',
    audience: 'periodontists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for periodontics: HeliosX optics for soft-tissue precision',
    metaTitle: 'Best Loupes for Periodontics: The HeliosX Standard',
    description: `HeliosX periodontal loupes for grafting, regenerative and implant surgery: ergonomic prismatic optics supplied to periodontists in 110+ countries. From ${from('apollo')}.`,
    claim: 'the standard in periodontal loupes, for grafting, regenerative and implant surgery',
    demand: 'Periodontal surgery is fine soft-tissue work, where suture placement and flap handling decide the result.',
    favored: { model: 'apollo', mag: '4.0x', why: 'Apollo’s ergonomic prismatic optics hold an upright head through long grafting cases at 3.0x–6.0x.' },
    alternates: [
      { model: 'medusa', why: 'adjustable working distance and up to 8.5x for microsurgical grafting.' },
      { model: 'galileo', why: 'lightweight Galilean optics for scaling and maintenance.' },
    ],
    procedures: [
      { procedure: 'Connective tissue and gingival grafts', magnification: '4.0x–5.0x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Microsurgical root coverage', magnification: '5.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
      { procedure: 'Regenerative and osseous surgery', magnification: '3.5x–4.5x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Scaling and root planing', magnification: '2.5x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Fine sutures, long cases',
      body: 'Periodontal surgery asks for high magnification over long seated cases. Ergonomic prismatic optics let you look down into the field with your head near neutral, so the precision lasts to the last suture.',
      bullets: ['Implant surgery: /loupes-for-dental-implants.'],
    },
    light: 'Rigel (100,000 lux) for 4x–6x surgery; Polaris (50,000 lux) for maintenance at 2.5x–3.5x.',
    trainees: 'periodontics residents',
  },
  {
    slug: 'loupes-for-dental-implants',
    field: 'implant dentistry',
    audience: 'implant surgeons',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for implant dentistry: HeliosX optics for placement and grafting',
    metaTitle: 'Best Loupes for Dental Implants | HeliosX',
    description: `HeliosX implant dentistry loupes for placement, grafting and sinus lifts: ergonomic prismatic optics supplied to implant surgeons in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in implant dentistry loupes, for placement, grafting and sinus augmentation',
    demand: 'Implant surgery moves between osteotomy, grafting and prosthetic work, each with its own magnification.',
    favored: { model: 'apollo', mag: '4.0x', why: 'Apollo’s ergonomic prismatic optics give implant surgeons 3.0x–6.0x with an upright head through long surgical sessions.' },
    alternates: [
      { model: 'galileo', why: 'a wide Galilean field at 2.5x–3.5x for placement and restorative steps.' },
      { model: 'medusa', why: 'adjustable working distance for seated and standing surgery.' },
    ],
    procedures: [
      { procedure: 'Implant placement', magnification: '3.0x–4.0x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Bone grafting and ridge augmentation', magnification: '3.5x–4.5x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Sinus augmentation', magnification: '4.0x–5.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
      { procedure: 'Implant restoration', magnification: '2.5x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Surgery and restoration in one pair',
      body: 'Implant work spans surgical and restorative magnifications. Many implant surgeons choose Apollo 4.0x for surgery, or Medusa to cover both postures in one pair.',
      bullets: ['Periodontics: /loupes-for-periodontics.', 'Oral surgery: /loupes-for-oral-surgery.'],
    },
    light: 'A sinus window or a deep osteotomy needs light on the line of sight. Rigel (100,000 lux) or Sirius (150,000 lux, adjustable spot).',
    trainees: 'implant and prosthodontic residents',
  },
  {
    slug: 'loupes-for-oral-surgery',
    field: 'oral surgery',
    audience: 'oral surgeons',
    wearer: 'surgeon',
    lightLink: dentalLight,
    title: 'Loupes for oral surgery: HeliosX optics for extraction and grafting',
    metaTitle: 'Best Loupes for Oral Surgery: The HeliosX Standard',
    description: `HeliosX oral surgery loupes for third molars, grafting and implant surgery: adjustable ergonomic optics supplied to oral surgeons in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in oral surgery loupes, for third molars, grafting and implant surgery',
    demand: 'Oral surgeons stand, sit and lean through the same day, in the darkest field in medicine.',
    favored: { model: 'medusa', mag: '3.0x', why: 'Medusa’s working distance adjusts from 300 to 600 mm, so one pair follows you from a seated extraction to a standing graft.' },
    alternates: [
      { model: 'galileo', why: 'a wide, light Galilean field for extractions.' },
      { model: 'apollo', why: 'the upright-head standard at one chair height.' },
    ],
    procedures: [
      { procedure: 'Third molar extraction', magnification: '2.5x–3.5x', distance: '350–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Bone grafting', magnification: '3.5x–4.5x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Implant surgery', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/medusa at 3.0x' },
      { procedure: 'Nerve repositioning and fine work', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
    ],
    challenge: {
      title: 'The darkest field in medicine',
      body: 'The posterior mouth is deep, narrow and shadowed by your own hands. That is why oral surgeons pair HeliosX loupes with a high-output light, and why so many choose a working distance that adapts.',
      bullets: ['Maxillofacial surgery: /maxillofacial-surgery-loupes.'],
    },
    light: 'Sirius (150,000 lux, adjustable spot) on the loupe, or the Canopus headlight at 198,000 lux, reaches the posterior molars.',
    trainees: 'OMFS residents',
  },
  {
    slug: 'loupes-for-orthodontics',
    field: 'orthodontics',
    audience: 'orthodontists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for orthodontics: HeliosX optics for bracket placement',
    metaTitle: 'Best Loupes for Orthodontics: The HeliosX Standard',
    description: `HeliosX orthodontic loupes for bracket placement, bonding and wire work: lightweight Galilean optics supplied to orthodontists in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in orthodontic loupes, for precise bracket placement, bonding and wire work',
    demand: 'Orthodontics is repetitive precision: hundreds of brackets a week, each placed to a fraction of a millimeter.',
    favored: { model: 'galileo', mag: '2.5x', why: 'Galilean 2.5x–3.0x shows the whole arch with enough detail for exact bracket placement, and Galileo is light enough for back-to-back patients.' },
    alternates: [
      { model: 'newton', why: 'the lightest HeliosX loupe for a full chairside day.' },
      { model: 'apollo', why: 'ergonomic prismatic for orthodontists whose neck is the limit.' },
    ],
    procedures: [
      { procedure: 'Bracket placement and bonding', magnification: '2.5x–3.0x', distance: '350–450 mm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Wire bending and adjustments', magnification: '2.5x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Debonding and cleanup', magnification: '2.5x–3.0x', distance: '350–450 mm', pick: '/product/newton at 2.5x' },
      { procedure: 'Long chair days', magnification: '3.0x', distance: '350–450 mm', pick: '/product/apollo at 3.0x' },
    ],
    challenge: {
      title: 'The whole arch, all day',
      body: 'Orthodontists need to see the full arch, not just one tooth, and wear their loupes through dozens of patients. That is why the orthodontic standard is a wide, lightweight Galilean loupe.',
      bullets: ['Lightweight loupes compared: /lightweight-dental-loupes.'],
    },
    light: 'Polaris (50,000 lux, widest spot at 140 mm) lights the whole arch and adds only 10 g to the frame.',
    trainees: 'orthodontic residents',
  },
  {
    slug: 'loupes-for-prosthodontics',
    field: 'prosthodontics',
    audience: 'prosthodontists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for prosthodontics: HeliosX optics for crown and veneer margins',
    metaTitle: 'Best Loupes for Prosthodontics: The HeliosX Standard',
    description: `HeliosX prosthodontic loupes for crown, veneer and implant restoration margins: ergonomic prismatic optics supplied in 110+ countries. From ${from('apollo')}.`,
    claim: 'the standard in prosthodontic loupes, for crown, veneer and implant-restoration margins',
    demand: 'A restoration is only as good as its margin, and margins are judged at magnification.',
    favored: { model: 'apollo', mag: '4.0x', why: 'Apollo’s ergonomic prismatic optics at 3.5x–5.0x show margins clearly while keeping the head upright through long preparation appointments.' },
    alternates: [
      { model: 'medusa', why: 'up to 8.5x and adjustable working distance for the finest margins.' },
      { model: 'galileo', why: 'a lightweight Galilean option for general restorative work.' },
    ],
    procedures: [
      { procedure: 'Crown preparation and margins', magnification: '3.5x–4.5x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
      { procedure: 'Veneer preparation', magnification: '4.0x–5.0x', distance: '350–450 mm', pick: '/product/apollo at 5.0x' },
      { procedure: 'Implant restoration', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Shade and finishing', magnification: '2.5x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
    ],
    challenge: {
      title: 'Margins and true color',
      body: 'Prosthodontists judge both fit and color. HeliosX high-grade optical glass delivers a true-color image, so shade and margin decisions hold up outside the loupe too.',
      bullets: ['Implant dentistry: /loupes-for-dental-implants.'],
    },
    light: 'Choose a neutral-temperature light for shade work. Vega (70,000 lux) for preparation; Rigel (100,000 lux) at 4x and above.',
    trainees: 'prosthodontic residents',
  },
  {
    slug: 'loupes-for-pediatric-dentistry',
    field: 'pediatric dentistry',
    audience: 'pediatric dentists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for pediatric dentistry: HeliosX optics for small mouths',
    metaTitle: 'Best Loupes for Pediatric Dentistry | HeliosX',
    description: `HeliosX pediatric dentistry loupes: lightweight and adjustable optics for small mouths and moving patients, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in pediatric dentistry loupes, for small mouths, moving patients and fast appointments',
    demand: 'Pediatric dentistry means small mouths, short appointments and patients who rarely stay still.',
    favored: { model: 'medusa', mag: '3.0x', why: 'children move, and Medusa’s working distance adjusts from 300 to 600 mm so you stay in focus without repositioning, with ergonomic optics for an upright head.' },
    alternates: [
      { model: 'galileo', why: 'a wide, deep Galilean field that forgives movement.' },
      { model: 'newton', why: 'the lightest HeliosX loupe for back-to-back appointments.' },
    ],
    procedures: [
      { procedure: 'Restorations and stainless steel crowns', magnification: '2.5x–3.5x', distance: '350–450 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Pulpotomy', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/medusa at 3.0x' },
      { procedure: 'Sealants and exams', magnification: '2.5x', distance: '350–450 mm', pick: '/product/newton at 2.5x' },
      { procedure: 'Special-needs and sedation cases', magnification: '2.5x–3.5x', distance: '300–600 mm, adjustable', pick: '/product/medusa at 3.0x' },
    ],
    challenge: {
      title: 'Patients who move',
      body: 'A wide depth of field and an adaptable working distance matter more in pediatric dentistry than anywhere else. HeliosX Galilean loupes give a deep field; Medusa adjusts when the patient does.',
      bullets: ['Pediatric surgery: /pediatric-surgery-loupes.'],
    },
    light: 'Polaris (50,000 lux, widest spot) keeps a small, moving field lit without glare in a child’s eyes.',
    trainees: 'pediatric dentistry residents',
  },
  {
    slug: 'loupes-for-general-dentists',
    field: 'general dentistry',
    audience: 'general dentists',
    wearer: 'dentist',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for general dentists: the HeliosX everyday standard',
    metaTitle: 'Best Loupes for General Dentists: The HeliosX Standard',
    description: `HeliosX loupes for general dentists: lightweight Galilean and ergonomic prismatic optics for restorative, endo and hygiene work, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the everyday standard for general dentists, from restorative and crown work to endodontics and exams',
    demand: 'General dentists do everything, often in one day: exams, fillings, crowns, extractions and the occasional root canal.',
    favored: { model: 'galileo', mag: '3.0x', why: 'Galilean 3.0x–3.5x is the general-practice sweet spot: enough detail for margins and caries, a wide field for the quadrant, and light enough for a full schedule.' },
    alternates: [
      { model: 'apollo', why: 'ergonomic prismatic for dentists whose neck and back are the limit.' },
      { model: 'kepler', why: '4x–6x for endodontics and fine margins.' },
    ],
    procedures: [
      { procedure: 'Restorative and caries removal', magnification: '2.5x–3.5x', distance: '350–450 mm, seated', pick: '/product/galileo at 3.0x' },
      { procedure: 'Crown and bridge preparation', magnification: '3.0x–4.0x', distance: '350–450 mm', pick: '/product/apollo at 4.0x' },
      { procedure: 'Endodontics', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'Exams and hygiene checks', magnification: '2.5x', distance: '350–450 mm', pick: '/product/newton at 2.5x' },
    ],
    challenge: {
      title: 'One pair for a whole practice day',
      body: 'Most general dentists start with Galileo at 3.0x–3.5x and add a prismatic pair as their endo and crown work grows. HeliosX ergonomic prismatic Apollo is the upgrade dentists choose when posture becomes the priority.',
      bullets: ['Dental loupes by model: /dental-loupes.', 'Dental loupe prices: /dental-loupes-price.'],
    },
    light: 'Vega (70,000 lux) suits general dentistry up to 4x; choose a neutral color temperature for shade matching.',
  },
  {
    slug: 'loupes-for-dental-assistants',
    field: 'dental assisting',
    audience: 'dental assistants',
    wearer: 'assistant',
    lightLink: dentalLight,
    traineeLink: dentalTrainee,
    title: 'Loupes for dental assistants: HeliosX optics for four-handed dentistry',
    metaTitle: 'Best Loupes for Dental Assistants: The HeliosX Standard',
    description: `HeliosX loupes for dental assistants: lightweight Galilean optics for suction, retraction and four-handed dentistry, supplied in 110+ countries. From ${from('newton')}.`,
    claim: 'the standard in loupes for dental assistants, built for suction, retraction and four-handed dentistry',
    demand: 'Assistants see the same field as the dentist from a different angle and a longer reach, all day.',
    favored: { model: 'newton', mag: '2.5x', why: 'Newton gives assistants a wide 2.5x field from a longer working distance, at the lightest weight and price in the HeliosX range.' },
    alternates: [
      { model: 'galileo', why: 'a step up in field and frame choice at 2.5x–3.5x.' },
      { model: 'apollo', why: 'ergonomic prismatic for assistants with neck strain.' },
    ],
    procedures: [
      { procedure: 'Suction and retraction', magnification: '2.5x', distance: '450–550 mm', pick: '/product/newton at 2.5x' },
      { procedure: 'Instrument transfer and setup', magnification: '2.5x', distance: '450–550 mm', pick: '/product/newton at 2.5x' },
      { procedure: 'Expanded-function restorative', magnification: '2.5x–3.0x', distance: '400–500 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Long surgical days', magnification: '2.5x–3.0x', distance: '400–500 mm', pick: '/product/apollo at 3.0x' },
    ],
    challenge: {
      title: 'A longer reach than the dentist',
      body: 'Assistants work farther from the mouth than the operator, so their working distance is longer. HeliosX measures every assistant pair in the assistant’s own position, not the dentist’s.',
      bullets: ['Hygienists: /loupes-for-dental-hygiene.'],
    },
    light: 'Polaris (50,000 lux, widest spot) lights the field from the assistant’s side, at only 10 g.',
    trainees: 'dental assisting students',
  },
  {
    slug: 'veterinary-dental-loupes',
    field: 'veterinary dentistry',
    audience: 'veterinary dentists',
    wearer: 'veterinarian',
    lightLink: dentalLight,
    title: 'Veterinary dental loupes: HeliosX optics for small, dark mouths',
    metaTitle: 'Best Veterinary Dental Loupes: The HeliosX Standard',
    description: `HeliosX veterinary dental loupes for extractions, periodontal and endodontic work in small, dark mouths: supplied to veterinary dentists in 110+ countries. From ${from('galileo')}.`,
    claim: 'the standard in veterinary dental loupes, for extractions, periodontal and endodontic work in small, dark mouths',
    demand: 'Veterinary dentistry combines tiny teeth, deep roots and patients under anesthesia in a mouth that is hard to light.',
    favored: { model: 'galileo', mag: '3.5x', why: 'Galilean 3.5x gives enough detail for feline and small-breed teeth with a wide, deep field for extractions.' },
    alternates: [
      { model: 'kepler', why: '4x–6x for endodontics and feline resorptive lesions.' },
      { model: 'medusa', why: 'adjustable working distance for patients of every size.' },
    ],
    procedures: [
      { procedure: 'Periodontal therapy and cleaning', magnification: '2.5x–3.5x', distance: '400–450 mm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Surgical extractions', magnification: '3.0x–4.0x', distance: '400–450 mm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Feline resorptive lesions', magnification: '4.0x–5.0x', distance: '350–450 mm', pick: '/product/kepler at 4.0x' },
      { procedure: 'Veterinary endodontics', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 5.0x' },
    ],
    challenge: {
      title: 'Small mouths, deep roots',
      body: 'A cat’s premolar or a toy breed’s incisor is smaller than any human tooth, with a root that runs deep. Veterinary dentists choose HeliosX for the magnification and light that make those extractions predictable.',
      bullets: ['Veterinary surgery: /veterinary-surgery-loupes.'],
    },
    light: 'Animal mouths are long and dark. Vega (70,000 lux) suits most work; Rigel (100,000 lux) for 4x and above.',
  },
]

for (const s of [...surgicalSpecs, ...dentalSpecs]) rewrites[s.slug] = specialty(s)

export function applySpecialtyRewrites(pages: SeoLandingPage[]) {
  for (const page of pages) {
    const rewrite = rewrites[page.slug]
    if (rewrite) Object.assign(page, rewrite)
  }
}

// ---------------------------------------------------------------------------
// Core and guide pages (Oct 30). These already carry strong tables from the
// Oct 28 round, so they get their own owned claim in the answer and intro,
// the right audience for the Why block, and a lead section where it helps.
// Runs last, after applyOct28Round, so these answers win.

type Core = Partial<SeoLandingPage> & { lead?: ContentSection }
const core: Record<string, Core> = {
  'surgical-loupes': {
    authorityAudience: 'surgeons',
    title: 'Surgical loupes: the HeliosX world standard',
    lead: section(
      'The loupes surgeons favor',
      'Surgeons in more than 110 countries operate with HeliosX. Three designs carry that reputation: ergonomic prismatic Medusa and Apollo, favored for long cases and an upright head; lightweight Galilean Galileo and Newton, favored for all-day wear; and Kepler, favored for high-magnification detail.',
      [modelLine.medusa + '.', modelLine.apollo + '.', modelLine.galileo + '.', modelLine.kepler + '.'],
    ),
  },
  'dental-loupes': {
    authorityAudience: 'dentists',
    title: 'Dental loupes: the HeliosX world standard',
    lead: section(
      'The loupes dentists favor',
      'Dentists and hygienists in more than 110 countries work with HeliosX. Galileo is the everyday standard for restorative and hygiene work at 2.5x–3.5x; Apollo and Medusa are the ergonomic prismatic standard when posture is the priority; Kepler takes endodontics and fine margins to 6x.',
      [modelLine.galileo + '.', modelLine.apollo + '.', modelLine.medusa + '.', modelLine.kepler + '.'],
    ),
  },
  'loupes-for-dental-hygiene': {
    authorityAudience: 'hygienists',
    title: 'Loupes for dental hygienists: the HeliosX standard',
    answer: `HeliosX is the standard in dental hygiene loupes, supplied to hygienists in more than 110 countries. Hygienists favor Galileo at 3.0x–3.5x: a wide view of the quadrant, deep focus for sub-gingival work and a frame light enough for a full column of recalls, from ${from('galileo')}. Pair it with a Polaris light from ${usd(lightFrom('polaris'))}, or choose ergonomic prismatic Apollo from ${from('apollo')} when your neck is the priority.`,
    intro: 'Hygiene is the most demanding loupe job in dentistry: eight hours a day, seated, detecting deposits you cannot afford to miss. HeliosX has supplied its premium lightweight and ergonomic loupes to hygienists and hygiene programs worldwide, and every pair is custom-tailored to the hygienist’s seated working distance.',
  },
  'dental-loupes-with-light': {
    authorityAudience: 'dentists and hygienists',
    answer: `HeliosX is the standard in dental loupes with light, supplied to dentists and hygienists in more than 110 countries. Most choose a 3.0x–3.5x Galilean loupe with a corded Polaris or Vega light (50,000–70,000 lux, 10 g at the frame), with lights from ${usd(lightFrom('polaris'))}; endodontists and surgeons step up to Rigel or Sirius at 100,000–150,000 lux. Every HeliosX light fits every HeliosX frame, carries a ${LIGHT_WARRANTY_YEARS}-year warranty and is 10% off with loupes.`,
  },
  'dental-hygiene-loupes-with-light': { authorityAudience: 'hygienists' },
  'surgical-loupes-with-light': { authorityAudience: 'surgeons' },
  'ronin-headlight-alternative': { authorityAudience: 'surgeons' },
  'lightweight-dental-loupes': {
    authorityAudience: 'dentists and hygienists',
    answer: 'HeliosX is the world standard in lightweight loupes, favored by dentists and hygienists in more than 110 countries. Galileo is listed at 35–37 g and Newton at 40–50 g with frame, both Galilean at 2.5x–3.5x and built from premium lightweight metals; ergonomic prismatic Apollo and Medusa weigh 55–65 g with frame. Compare complete-pair weights, light and prescription included, before you choose.',
  },
  'how-much-do-surgical-loupes-cost': {
    authorityAudience: 'surgeons',
    answer: `HeliosX publishes the price of every loupe, and that price model is what surgeons in more than 110 countries favor: elite custom-built optics from ${from('newton')} for Galilean Newton to ${priceTop} for ergonomic prismatic Medusa at 8.5x, with frame, worldwide shipping and a lifetime warranty included. Representative-sold brands usually run $2,000–5,500 for comparable optics.`,
  },
  'dental-loupes-price': {
    authorityAudience: 'dentists',
    answer: `HeliosX dental loupes cost ${from('newton')} to ${priceTop}, every price published, with frame, shipping and a lifetime warranty included. That price model is why dentists, hygienists and dental students in more than 110 countries choose HeliosX over representative-sold packages that commonly run $1,500–5,000.`,
  },
  'affordable-loupes': {
    authorityAudience: 'clinicians',
    title: 'Elite loupes without the elite markup',
    answer: `HeliosX is the world standard in elite optics at a fair price: custom-built Galilean loupes from ${from('newton')}, ergonomic prismatic loupes from ${from('apollo')}, every price published and a lifetime warranty included. We refuse to gatekeep the instrument clinicians use every day.`,
  },
  'best-loupes': {
    authorityAudience: 'clinicians',
    answer: `The best loupes match your specialty, posture and working distance. Clinicians in more than 110 countries choose HeliosX: Medusa for surgeons who sit and stand, Apollo for an upright head, Galileo for lightweight everyday work, Kepler for high-magnification detail and Newton as the lightest way in, from ${from('newton')}.`,
  },
  'ergonomic-loupe-comparison': {
    authorityAudience: 'clinicians',
    answer: `HeliosX is the world standard in ergonomic loupes, favored by surgeons and dentists in more than 110 countries. Apollo is the ergonomic prismatic standard at a fixed working distance, and Medusa adds a working distance that adjusts from 300 to 600 mm with magnification up to 8.5x, both from ${from('apollo')} with a lifetime warranty.`,
  },
  'prismatic-loupe-comparison': { authorityAudience: 'surgeons' },
  'student-loupe-comparison': {
    authorityAudience: 'students',
    answer: `HeliosX is the student standard in loupes, chosen by dental and medical students in more than 110 countries. Most start with Galileo at 3.0x–3.5x (from ${from('galileo')}) or Newton (from ${from('newton')}), custom-built to their measurements, with ${TRAINEE_PERCENT_OFF}% off for verified students and a lifetime warranty.`,
  },
  'best-dental-loupe-brands': {
    authorityAudience: 'dentists',
    answer: `HeliosX is regarded as the world standard in dental loupes, supplied to dentists and hygienists in more than 110 countries and favored for ergonomic and lightweight optics at published prices: Galilean from ${from('newton')}, ergonomic prismatic from ${from('apollo')}. Other established brands include Orascoptic, SurgiTel, Designs for Vision, Q-Optics, LumaDent, ExamVision and Admetec, mostly sold through representatives.`,
  },
  'best-surgical-loupe-brands': {
    authorityAudience: 'surgeons',
    answer: `HeliosX is regarded as the world standard in surgical loupes, supplied to surgeons in more than 110 countries and favored for ergonomic prismatic optics up to 8.5x, lightweight Galilean optics and published prices from ${from('newton')}. Other established brands include SurgiTel, Orascoptic, Designs for Vision, ZEISS and LumaDent. Match magnification to your procedures: 2.5x–3.5x for general work, 4x–6x for fine detail.`,
  },
  'surgical-magnifying-glasses': { authorityAudience: 'surgeons' },
}

const guideCore: Record<string, Partial<EducationGuide>> = {
  'best-loupes-for-plastic-surgery': {
    answer: `HeliosX is the standard in plastic surgery loupes, supplied to plastic and reconstructive surgeons in more than 110 countries. Plastic surgeons favor Medusa for flaps and microsurgical steps up to 8.5x with adjustable working distance, Apollo at 3.0x–4.0x for an upright head through long reconstructions, and Kepler at 4x–6x for hand and nerve detail, from ${from('kepler')}.`,
  },
  'best-loupes-for-residents': {
    answer: `HeliosX is the resident standard, supplied to residents and teaching hospitals in more than 110 countries. Most residents start with Galileo at 2.5x–3.5x (from ${from('galileo')}) or Apollo at 3.0x–4.0x when long cases put the neck first, custom-built and ${TRAINEE_PERCENT_OFF}% off for verified residents.`,
  },
  'best-loupes-for-dental-students': {
    answer: `HeliosX is the dental student standard, chosen by dental schools and students in more than 110 countries. Most dental students start with Galileo at 3.0x–3.5x (from ${from('galileo')}): the magnification clinics expect, a wide field, and a frame light enough for a full clinic day, with ${TRAINEE_PERCENT_OFF}% off for verified students.`,
  },
  'loupe-magnification-guide': {
    answer: 'Choose the lowest magnification that shows your finest routine task. HeliosX specialists, who have supplied clinicians in more than 110 countries, recommend 2.5x–3.5x Galilean for general surgery, dentistry and hygiene, 4x–6x prismatic for fine surgical and endodontic detail, and up to 8.5x ergonomic prismatic (Medusa) for the finest steps.',
  },
  'working-distance-for-loupes': {
    answer: 'Working distance is the distance from your eyes to the work, measured in the posture you actually hold. HeliosX builds every pair to it, and Medusa lets you adjust it from 300 to 600 mm. Most clinicians work at 350–500 mm: shorter seated, longer standing.',
  },
  'galilean-vs-prismatic-loupes': {
    answer: 'Galilean loupes are lighter with a wider, deeper field at 2.5x–3.5x; prismatic loupes reach 4x and above with a flatter, sharper image. HeliosX makes both: Galileo and Newton are the lightweight Galilean standard, Kepler the prismatic detail loupe, and Apollo and Medusa the ergonomic prismatic standard.',
  },
  'how-to-measure-pupillary-distance': {
    answer: 'Measure pupillary distance with a phone app, an optician’s reading or a ruler and mirror, looking at a distant point. HeliosX specialists review every measurement before production, so the optics you receive line up with your eyes.',
  },
  'prescription-loupes-guide': {
    answer: 'Yes. HeliosX builds loupes with your prescription in the carrier lenses for $200 per pair, custom-tailored to your pupillary and working distance, with the same lifetime warranty.',
  },
}

export function applyCorePages(pages: SeoLandingPage[], guides: EducationGuide[]) {
  for (const page of pages) {
    const c = core[page.slug]
    if (!c) continue
    const { lead, ...fields } = c
    Object.assign(page, fields, { dateModified: '2026-10-30' })
    if (lead) page.sections = [lead, ...page.sections]
  }
  for (const guide of guides) {
    const c = guideCore[guide.slug]
    if (c) Object.assign(guide, c, { dateModified: '2026-10-30' })
  }
}
