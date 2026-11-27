import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { LIGHT_BUNDLE_PERCENT_OFF, TRAINEE_PERCENT_OFF, magnificationPriceByProduct } from './pricing'
import { photo } from './seo-bofu-pages'

// Dec 2026 draft (planned 27 Nov, owner-approved titles and plan): rewrite of
// /loupes-for-dental-hygiene and /ergonomic-loupes in the "Types of Apples"
// buyer format, plus a new title for /dental-hygiene-loupes-with-light.
// Plan and evidence: heliosxvision.com-audit/keyword-research/HYGIENE-ERGO-REWRITE-PLAN.md
//
// One search per page, so siblings stop competing:
// - hygiene guide owns "dental hygiene loupes", "hygiene loupes", magnification;
//   "best" stays with the dental hub, "price" with /dental-hygiene-loupes-price,
//   "with light" with /dental-hygiene-loupes-with-light.
// - ergonomic page owns "ergonomic loupes", "ergo loupes", "deflection loupes";
//   no "best" (hubs) and no "prismatic loupes" (Galilean vs prismatic guide).
// Applied last, over every earlier layer. Rollback: drop the call in seo-content.ts.
// Studies are the ones already cited on these pages. No claim that loupes treat pain.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const prices = (model: string) => Object.values(magnificationPriceByProduct[model])
const from = (model: string) => usd(Math.min(...prices(model)))
const top = (model: string) => usd(Math.max(...prices(model)))
const range = (model: string) => `${from(model)}–${top(model)}`
const at = (model: string, mag: string) => usd(magnificationPriceByProduct[model][mag])
const section = (title: string, body: string, bullets: string[] = [], sourceHref?: string, sourceLabel?: string): ContentSection => ({
  title,
  body,
  bullets,
  ...(sourceHref ? { sourceHref, sourceLabel } : {}),
})
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const MODIFIED = '2026-11-27'

// ---------------------------------------------------------------- hygiene

const hygiene: Partial<SeoLandingPage> = {
  title: 'Dental hygiene loupes: magnification chart by task',
  metaTitle: 'Dental Hygiene Loupes + Magnification Chart by Task | HeliosX',
  description: `Which magnification fits scaling, perio charting and subgingival work? Chart by task, picks from ${from('newton')}, fitted seated. Free shipping, 30-day returns.`,
  answer: `Most dental hygienists work best with 3.0x–3.5x Galilean loupes fitted to their seated working distance. Start at 2.5x if you are new to magnification. If neck strain is the main problem, choose an ergonomic prismatic pair, which angles the view so your head stays closer to upright. A loupe light adds clearer posterior and subgingival views.`,
  intro:
    'Hygiene is its own buying problem: you work seated, for most of the day, moving along whole arches, and detection matters as much as detail. Pick the magnification for the task, get the fit measured in your real chair position, then add a light if you need one.',
  compact: true,
  why: {
    title: 'Why the right hygiene loupe matters',
    body: [
      'A pair fitted to your seated working distance and declination angle lets you see the field without leaning in. In a 2021 pilot study of hygienists scaling (Ludwig et al., International Journal of Dental Hygiene), the posture difference came from a custom declination angle, not from magnification alone.',
      'Reviews of the wider evidence are positive but limited: a 2019 systematic review in JADA (Roll et al.) found magnification helps musculoskeletal symptoms, while a 2016 study of hygienists (Hayes et al., Work) found mixed results. Buy for the view and a fit measured to you, not for a promise about pain.',
    ],
  },
  tierChart: {
    title: 'Dental hygiene loupes magnification chart',
    lead: 'Find your task, then tap the model to jump to it. Prices in USD, shipping included.',
    scale: ['Wider view', 'More detail'],
    tiers: [
      { label: '2.5x', note: 'Students and first pairs; widest field for moving along an arch', picks: [{ label: 'Newton 2.5x', href: '#newton', detail: at('newton', '2.5x') }, { label: 'Galileo 2.5x', href: '#galileo', detail: at('galileo', '2.5x') }] },
      { label: '3.0x', note: 'Scaling, root planing and perio charting', picks: [{ label: 'Galileo 3.0x', href: '#galileo', detail: at('galileo', '3.0x') }, { label: 'Newton 3.0x', href: '#newton', detail: at('newton', '3.0x') }] },
      { label: '3.5x', note: 'Subgingival calculus detection and detail work', picks: [{ label: 'Galileo 3.5x', href: '#galileo', detail: at('galileo', '3.5x') }] },
      { label: '3.0x ergonomic', note: 'When neck strain is the priority', picks: [{ label: 'Medusa 3.0x', href: '#medusa', detail: at('medusa', '3.0x') }] },
    ],
  },
  quickPicks: {
    title: 'What does your day look like?',
    rows: [
      { task: 'A full column of recalls, seated', picks: [{ label: 'Galileo 3.0x', href: '/product/galileo?mag=3.0x' }] },
      { task: `Student or first pair (${TRAINEE_PERCENT_OFF}% off for students)`, picks: [{ label: 'Newton 2.5x', href: '/product/newton?mag=2.5x' }, { label: 'Student loupes compared', href: '/student-loupe-comparison' }] },
      { task: 'Neck strain already', picks: [{ label: 'Medusa 3.0x', href: '/product/medusa?mag=3.0x' }, { label: 'Ergonomic loupes compared', href: '/ergonomic-loupes' }] },
      { task: 'You need a light too', picks: [{ label: 'Hygiene loupe and light pairings', href: '/dental-hygiene-loupes-with-light' }] },
    ],
  },
  items: {
    title: 'The three HeliosX pairs hygienists choose',
    lead: 'Same shape for each: what it is, the honest trade-off, and who it suits.',
    entries: [
      {
        id: 'newton',
        name: 'Newton',
        tag: 'Galilean 2.5x–3.5x',
        price: `From ${from('newton')}`,
        href: '/product/newton',
        image: photo.newton,
        meter: { value: 1, label: 'Price' },
        body: [
          'The lowest-priced way into fitted Galilean loupes, with a wide field at 2.5x that makes it easy to follow an arch while you learn to work under magnification.',
          'The trade-off: at 40–50 g with frame it is heavier than Galileo, and Galilean optics stop at 3.5x.',
        ],
        bestFor: ['Students', 'First pair', 'Tight budgets'],
        cta: { text: 'Choose your magnification', label: 'Newton', href: '/product/newton' },
      },
      {
        id: 'galileo',
        name: 'Galileo',
        tag: 'Galilean 2.5x–3.5x, 35–37 g',
        price: `From ${from('galileo')}`,
        href: '/product/galileo',
        image: photo.galileo,
        meter: { value: 2, label: 'Price' },
        body: [
          `The everyday hygiene pair: 35–37 g with frame and a wide, deep field, from ${at('galileo', '3.0x')} at 3.0x. Light enough for a full day of recalls, and the usual home for a loupe light.`,
          'The trade-off: the angle of view is a conventional declination, so posture still depends on a careful seated measurement.',
        ],
        bestFor: ['Scaling and root planing', 'Full recall days', 'Adding a light'],
        cta: { text: 'Choose your magnification', label: 'Galileo', href: '/product/galileo' },
      },
      {
        id: 'medusa',
        name: 'Medusa',
        tag: 'Ergonomic prismatic, adjustable 300–600 mm',
        price: `From ${from('medusa')}`,
        href: '/product/medusa',
        image: photo.medusa,
        meter: { value: 4, label: 'Price' },
        body: [
          'An angled prism light path, so your eyes look down while your head stays closer to upright, and a working distance you turn from 300 to 600 mm. It follows you between operatories, chairs and patients instead of locking you to one measured position. 56 g with frame at 3.0x.',
          `The trade-off: about twice the price of Galileo (${at('medusa', '3.0x')} at 3.0x), and most hygienists do not need more than 3.5x. Choose it for posture and flexibility, not for magnification.`,
        ],
        bestFor: ['Neck strain', 'Changing operatories', 'Ergonomic-first buyers'],
        cta: { text: 'Frames, magnifications and prices:', label: 'Medusa', href: '/product/medusa' },
      },
    ],
  },
  tips: {
    title: 'How to choose dental hygiene loupes: 4 tips',
    items: [
      { title: 'Measure seated, at your own operatory', body: 'Working distance and declination angle are set from the posture you actually hold. A standing measurement gives you a pair built for someone else.' },
      { title: 'Check the declination angle', body: 'The steeper the angle, the less you bend your neck to see the field. Ask for it in writing with any quote.' },
      { title: 'Weigh the finished pair', body: 'Include prescription lenses and any light you plan to wear. A light pair you keep on all day beats a better pair left in the case.' },
      { title: 'Get the terms in writing', body: 'HeliosX: non-prescription pairs return within 30 days for a full refund, a limited lifetime warranty, and payment plans at /loupes-payment-plans.' },
    ],
  },
  specTable: undefined,
  procedureRows: undefined,
  comparisonRows: undefined,
  verdict: undefined,
  recommendedProducts: ['Galileo', 'Newton', 'Medusa'],
  sections: [
    section(
      '5 terms to know before you buy',
      'Every brand quotes these, so it helps to know what each one means for hygiene.',
      [
        'Working distance: from your eyes to the tooth in your working posture. Measured seated for hygiene.',
        'Declination angle: how far the optics point down. A steeper angle means less neck bend.',
        'Field of view: how much of the arch you see at once. Wider at 2.5x, narrower at 3.5x.',
        'Depth of field: how far you can move before the image blurs. Galilean loupes are forgiving here.',
        'Interpupillary distance (PD): the distance between your pupils, used to align the barrels. How to measure: /education/how-to-measure-pupillary-distance.',
      ],
    ),
    section(
      'Galilean or prismatic for hygiene?',
      'Galilean loupes are the most common hygiene choice: light, wide field, 2.5x–3.5x. Prismatic loupes reach higher magnification but weigh more; ergonomic prismatic loupes like Medusa use the prism to angle the view for posture rather than for power.',
      [
        'Galilean (Newton, Galileo): 35–50 g, widest field, 2.5x–3.5x, from ' + from('newton') + '.',
        'Ergonomic prismatic (Medusa): 56 g at 3.0x, head closer to upright, adjustable 300–600 mm, from ' + from('medusa') + '.',
        'Full comparison: /education/galilean-vs-prismatic-loupes.',
      ],
    ),
    section(
      'Why hygiene loupes must be fitted to your chair position',
      'Hygiene exposes fit problems a short procedure would hide. You repeat the same seated head position for hours, so a working distance taken standing, or a declination angle off the shelf, shows up as strain by the afternoon. Take your measurements in the chair you use, in the posture you hold.',
      ['Measurement guide: /measurements.', 'If you assist chairside rather than instrument: /loupes-for-dental-assistants.'],
      'https://doi.org/10.1111/idh.12470',
      'Ludwig EA, Tolle SL, Jenkins E, Russell D. Magnification loupes influence on neck and trunk flexion of dental hygienists while scaling, a pilot study. International Journal of Dental Hygiene, 2021',
    ),
    section(
      'Getting used to loupes',
      'Expect a few days of adjustment. Wear them for part of the day first, keep the same seated position you were measured in, and build up to full recall days. If the image never settles, the fit is the problem: we review and correct fits.',
    ),
    section(
      'Other brands, lights and prices',
      'Each of these has its own page, so this one stays about choosing hygiene magnification and fit.',
      [
        'Brands compared side by side: /best-dental-loupe-brands.',
        'Loupe and light pairings for hygienists: /dental-hygiene-loupes-with-light.',
        'Every setup priced, with and without a light: /dental-hygiene-loupes-price.',
        'Students: /student-loupe-comparison.',
      ],
    ),
  ],
  faqs: [
    faq('What magnification is best for dental hygiene?', 'Most hygienists work at 3.0x–3.5x. 2.5x gives the widest field and is easiest to adapt to, which suits students and first pairs; 3.5x helps with subgingival calculus detection. Few hygienists need more than 3.5x.'),
    faq('Do dental hygienists need loupes?', 'They are not legally required, but many hygiene programs ask students to buy them and most practicing hygienists use them for detection and posture. A pair fitted to your seated working distance is what makes the difference.'),
    faq('Are dental hygienist glasses the same as loupes?', 'Usually, yes: "hygienist glasses" or "dental glasses" means loupes, small telescopes mounted in a glasses frame. Plain magnifying readers are not loupes; they have no fitted working distance or declination angle.'),
    faq('Galilean or prismatic loupes for hygiene?', 'Galilean for most hygienists: lighter, wider field, 2.5x–3.5x. Choose an ergonomic prismatic pair such as Medusa when posture is the priority, not for extra magnification.'),
    faq('How much do dental hygiene loupes cost?', `HeliosX hygiene pairs run ${range('newton')} (Newton), ${range('galileo')} (Galileo) and from ${from('medusa')} (Medusa, ergonomic), with ${TRAINEE_PERCENT_OFF}% off for verified students. Full setups with a light: /dental-hygiene-loupes-price.`),
    faq('Can I get prescription dental hygiene loupes?', 'Yes. Prescription lenses are a $200 add-on on the order, built into the pair. Prescription pairs are refundable until production starts.'),
    faq('Do dental hygiene programs require loupes?', 'Many do, or strongly encourage them, and some specify a magnification or supplier. Check with your program before you order; HeliosX offers ' + TRAINEE_PERCENT_OFF + '% off for verified students.'),
  ],
  dateModified: MODIFIED,
}

// ---------------------------------------------------------------- ergonomic

const ERGO_KEEP = [
  'Ergonomic, deflection and ergo prism loupes',
  'A plastic surgery resident on ergonomic loupes',
  'What the research shows: surgeons',
  'What the research shows: dentistry and hygiene',
  'Ergonomic loupes price: what you will pay',
]

const ergonomic = (current: SeoLandingPage): Partial<SeoLandingPage> => {
  const keep = (title: string) => current.sections.find((s) => s.title === title)
  const kept = ERGO_KEEP.map(keep).filter((s): s is ContentSection => !!s)
  return {
    title: 'Ergonomic loupes compared',
    metaTitle: 'Ergonomic Loupes Compared: Head Angle, Weight & Price | HeliosX',
    description: `Look down without bending your neck. Ergonomic loupes compared by head angle, weight and price, with the research. Medusa adjusts 300–600 mm, from ${from('medusa')}.`,
    answer: `Ergonomic loupes angle the image inside the barrel, so you look down at the field while your head stays close to upright. They come as deflection prisms, angled prismatic loupes, or conventional loupes with a steep declination angle. Most dentists choose 3.0x–4.0x. If you switch between sitting and standing, choose an adjustable working distance: HeliosX Medusa adjusts from 300 to 600 mm.`,
    intro:
      'Every ergonomic loupe here is compared the same way: how upright it keeps your head, what it weighs with the frame, and what it costs. Start with your day, then the two HeliosX pairs, then every other brand side by side.',
    compact: true,
    why: {
      title: 'Why ergonomic loupes matter',
      body: [
        'Every loupe points your eyes down toward the work; the declination angle decides how far. Past that angle, you bend your neck to reach the field, case after case. Ergonomic loupes bend the light path inside the optics, so the view angles down while your head stays closer to upright.',
        'The research is encouraging but short-term: studies of dentists, hygienists and surgeons show less neck flexion with fitted ergonomic optics, not a cure for pain. What matters most is a fit measured at your real working distance, sitting or standing.',
      ],
    },
    comparisonRows: undefined,
    verdict: undefined,
    // Owner preference (27 Nov): Medusa is the suggested ergonomic pair.
    procedureRows: current.procedureRows?.map((row) =>
      row.pick.startsWith('/product/apollo')
        ? { ...row, pick: row.pick.replace(/\/product\/apollo at ([^,]+).*/, (_m, mag: string) => `/product/medusa at ${mag}, from ${from('medusa')}`) }
        : row,
    ),
    quickPicks: {
      title: 'What does your day look like?',
      rows: [
        { task: 'Seated dentistry, moving between chairs and operatories', picks: [{ label: 'Medusa 3.0x–4.0x', href: '/product/medusa?mag=3.0x' }] },
        { task: 'Sitting for some cases, standing for others, or shared OR tables', picks: [{ label: 'Medusa, adjustable 300–600 mm', href: '/product/medusa' }] },
        { task: 'Dental hygiene', picks: [{ label: 'Hygiene magnification chart', href: '/loupes-for-dental-hygiene' }] },
        { task: 'Budget first', picks: [{ label: `Galileo from ${from('galileo')}`, href: '/product/galileo' }] },
      ],
    },
    items: {
      title: 'The two HeliosX ergonomic loupes',
      lead: 'Both angle the view with a prism. Medusa adjusts its working distance as you move; Apollo is built for one distance.',
      entries: [
        {
          id: 'medusa',
          name: 'Medusa',
          tag: 'Ergonomic prismatic, adjustable 300–600 mm',
          price: range('medusa'),
          href: '/product/medusa',
          image: photo.medusa,
          meter: { value: 4, label: 'Working distance: adjustable' },
          body: [
            'The working distance turns from 300 to 600 mm, so the focus moves with you when you sit for one case and stand for the next, or work at a table another surgeon set. 3.0x–8.5x, 56–65 g with frame.',
            `The trade-off: the highest price in the range (${range('medusa')}), and more adjustment than you need if you always work at one distance.`,
          ],
          bestFor: ['Sitting and standing', 'Shared OR tables', 'High magnification up to 8.5x'],
          cta: { text: 'Frames, magnifications and prices:', label: 'Medusa', href: '/product/medusa' },
        },
        {
          id: 'apollo',
          name: 'Apollo',
          tag: 'Ergonomic prismatic, fixed working distance',
          price: range('apollo'),
          href: '/product/apollo',
          image: photo.apollo,
          meter: { value: 1, label: 'Working distance: fixed' },
          body: [
            'Built to one measured working distance (420, 450, 500 or 550 mm), 3.0x–6.0x, 55–58 g with frame. The choice for clinicians who work at the same distance all day, which is most seated dentistry.',
            'The trade-off: if you change position between cases, a fixed distance cannot follow you, and you lean again to find focus.',
          ],
          bestFor: ['Seated dentistry', 'Endodontics and restorative', 'One working distance'],
          cta: { text: 'Frames, magnifications and prices:', label: 'Apollo', href: '/product/apollo' },
        },
      ],
    },
    tips: {
      title: 'How to choose ergonomic loupes: 4 tips',
      items: [
        { title: 'Start with head angle', body: 'Ask how far the view is angled down and how upright that keeps your head at your working distance. That is the whole point of an ergonomic loupe.' },
        { title: 'Fixed or adjustable working distance', body: 'One position all day: fixed (Apollo). Sitting and standing, or tables set by others: adjustable (Medusa).' },
        { title: 'Weigh it with frame and light', body: 'Prism glass adds weight. Compare finished weights: Apollo 55–58 g, Medusa 56–65 g, conventional prismatic 68–85 g.' },
        { title: 'Get a trial or return window in writing', body: 'Ergonomic optics take days to get used to. HeliosX non-prescription pairs return within 30 days for a full refund.' },
      ],
    },
    sections: [
      kept[0],
      section(
        'The trade-off: magnification when you sit upright',
        'Sitting upright can move your eyes slightly further from the field. At a longer working distance the same magnification shows the work a little smaller, so some clinicians choose half a step higher when they switch, for example 3.5x instead of 3.0x. Measure at your real upright working distance before you decide.',
        ['Working distance guide: /education/working-distance-for-loupes.', 'Magnification by task: /education/loupe-magnification-guide.'],
      ),
      section(
        'How long does it take to get used to ergonomic loupes?',
        'Expect the first two days to feel the strangest, because your eyes now do the looking down that your neck used to do. Many clinicians report settling within about a week. Wear them for shorter cases or appointments first, keep the posture you were measured in, and build up.',
      ),
      ...kept.slice(1),
      section(
        'Related guides',
        'Each of these covers its own question in depth.',
        [
          'Loupes and neck pain, the evidence: /education/ergonomic-loupes-neck-pain.',
          'Dental hygiene magnification chart: /loupes-for-dental-hygiene.',
          'Lightweight loupes by weight: /lightweight-dental-loupes.',
          `Loupes with a light (${LIGHT_BUNDLE_PERCENT_OFF}% off the light with loupes): /dental-loupes-with-light.`,
          'Galilean vs prismatic optics: /education/galilean-vs-prismatic-loupes.',
        ],
      ),
    ],
    faqs: [
      faq('What are ergonomic loupes?', 'Loupes that angle the image downward inside the optics, so you look down at the field with your eyes while your head stays closer to upright. Also called deflection or ergo prism loupes.'),
      faq('Are ergonomic loupes worth it?', 'If you spend long days looking down, they reduce how far you bend your neck, which many clinicians find worth the higher price. They do not treat neck pain, and the research is still short-term; see /education/ergonomic-loupes-neck-pain.'),
      faq('What are deflection loupes?', 'Ergonomic loupes by another name: the optics deflect your line of sight downward. HeliosX Apollo and Medusa do it with an angled prismatic light path.'),
      faq('Ergonomic vs regular loupes: what is the difference?', 'Regular loupes look straight along the barrel, so the declination angle decides how far your neck bends. Ergonomic loupes bend the light path inside, so your head can stay closer to upright at the same view.'),
      faq('Which ergonomic loupes suit dentists?', `Most dentists choose 3.0x–4.0x at a seated working distance. Medusa is ${at('medusa', '3.0x')} at 3.0x and ${at('medusa', '4.0x')} at 4.0x, and its working distance adjusts 300–600 mm as you move between chairs and procedures. Apollo (${at('apollo', '3.0x')} at 3.0x) suits dentists who always work at one distance.`),
      faq('Are there ergonomic surgical loupes?', 'Yes. Surgeons who operate standing use ergonomic prismatic loupes at 3.0x–5.0x built to a standing distance; Medusa suits surgeons who sit for some cases and stand for others, and reaches 8.5x.'),
      faq('Do ergonomic loupes help with neck pain?', 'They reduce how far you bend your neck while you work, which lowers the load on your neck muscles. That is different from treating neck pain, and the research so far comes from short studies. Persistent pain needs a clinical assessment.'),
      faq('Are ergonomic loupes heavier?', 'Slightly heavier than Galilean, because of the prism glass: Apollo 55–58 g and Medusa 56–65 g with frame, against 35–50 g for Galilean and 68–85 g for conventional prismatic.'),
    ],
    dateModified: MODIFIED,
  }
}

// ---------------------------------------------------------------- with light (title only)

const withLight: Partial<SeoLandingPage> = {
  title: 'Dental hygiene loupes with light: RDH pairing guide',
  metaTitle: 'Dental Hygiene Loupes With Light: RDH Pairing Guide | HeliosX',
  description: `Corded or wireless for a full day of recalls? Hygiene loupe and light setups compared by weight, battery and brightness. ${LIGHT_BUNDLE_PERCENT_OFF}% off the light with loupes.`,
}

export function applyHygieneErgoRewrite(pages: SeoLandingPage[]) {
  const find = (slug: string) => pages.find((p) => p.slug === slug)
  const h = find('loupes-for-dental-hygiene')
  if (h) Object.assign(h, hygiene)
  const e = find('ergonomic-loupes')
  if (e) Object.assign(e, ergonomic(e))
  const w = find('dental-hygiene-loupes-with-light')
  if (w) Object.assign(w, withLight)
}
