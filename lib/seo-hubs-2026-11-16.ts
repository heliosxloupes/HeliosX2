import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { LIGHT_BUNDLE_PERCENT_OFF, PRESCRIPTION_PRICE, TRAINEE_PERCENT_OFF, magnificationPriceByProduct } from './pricing'
import {
  allModels,
  leadTime,
  loupeEntry,
  modelColumns,
  modelName,
  modelRows,
  photo,
  returns,
  shipping,
  type Cta,
  type Tier,
} from './seo-bofu-pages'

// Nov 16 2026: the two category pages, rebuilt for the head searches
// "surgical loupes" and "dental loupes". Neither has reached page 1:
// /surgical-loupes averages about 72 (Google prefers the brands page, at
// about 23), and /dental-loupes was out of the index from May to Nov 13.
//
// The formula, from the reference "types of" guide that ranks in the top
// three for its head term, and from what moved "best surgical loupes" from
// 19.6 to about 9:
// - the search first in the title ("<Keyword> Guide + <Chart> & Prices")
//   and the H1 ("<Keyword>: A Complete Guide to Choosing the Right Pair");
// - who we are and what the guide covers in the first lines;
// - why the choice matters, then a chart whose chips jump to each entry;
// - quick picks by task, then one entry per type with a tag, two short
//   paragraphs, best-for tags and a photo whose alt starts with the search;
// - the other names people search (magnifying glasses, telescopes), short
//   answers by specialty or role, buying and care tips, FAQs for the
//   question variants, and related pages linking in with the search as label.
// Nothing is hidden and the keyword is not repeated for its own sake.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const prices = (model: string) => Object.values(magnificationPriceByProduct[model])
const from = (model: string) => usd(Math.min(...prices(model)))
const top = (model: string) => usd(Math.max(...prices(model)))
const range = (model: string) => `${from(model)}–${top(model)}`
const section = (title: string, body: string, bullets: string[] = []): ContentSection => ({ title, body, bullets })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const modified = '2026-11-16'

const hubPhoto = (m: string, keyword: string) => ({ ...photo[m], alt: `${keyword}: ${photo[m].alt}` })
const entry = (m: string, keyword: string, body: string[], bestFor: string[], cta?: Cta) => ({
  ...loupeEntry(m, body, bestFor, cta),
  image: hubPhoto(m, keyword),
})
const tier = (label: string, note: string, picks: [string, string][]): Tier => ({
  label,
  note,
  picks: picks.map(([m, detail]) => ({ label: modelName(m), href: `#${m}`, detail })),
})
const types = (setting: string) =>
  section(
    `${setting} loupes, magnifying glasses and telescopes`,
    `They are the same device: magnifying optics on a frame, focused at your working distance. You will also see them called ${setting.toLowerCase()} magnifying glasses, ${setting.toLowerCase()} telescopes or binocular loupes. Two choices separate them: the optics (Galilean or prismatic) and the mounting (through-the-lens, fixed in the lens, or flip-up on a hinge).`,
    [
      'Galilean: light and simple, 2.5x–3.5x.',
      'Prismatic: sharper at 4x and above; HeliosX prismatic models run from 3.0x to 8.5x.',
      'Ergonomic prismatic: angled optics for a more upright head.',
      'Through-the-lens: lighter, with a wider field. Flip-up: can be lifted out of the way.',
    ],
  )
const ordering = section(
  'How ordering works',
  `Choose your model, magnification and frame online and check out. After checkout you send your pupillary and working distance, and a loupe specialist reviews them before production. ${leadTime} ${returns}`,
)

const hubs: Record<string, Partial<SeoLandingPage>> = {
  'surgical-loupes': {
    title: 'Surgical Loupes: A Complete Guide to Choosing the Right Pair',
    metaTitle: 'Surgical Loupes Guide + Magnification Chart & Prices | HeliosX',
    description: `Surgical loupes explained: Galilean, prismatic and ergonomic types, a magnification chart by specialty, and every price. HeliosX pairs from ${from('newton')}.`,
    heroKicker: 'Surgical loupes',
    heroImage: {
      src: photo.medusa.src,
      alt: 'Surgical loupes: HeliosX Medusa adjustable ergonomic prismatic loupes on a metal frame',
      caption: `Medusa · From ${from('medusa')} USD`,
    },
    authorityAudience: 'surgeons',
    intro:
      'Surgical loupes are the magnifying telescopes surgeons wear on a frame, focused at their working distance, so fine structures look bigger without leaning in. Surgeons in more than 110 countries wear HeliosX, and choosing the right pair is the question we answer most. Here is the complete guide: the types of surgical loupes, which magnification suits each specialty, what each pair costs, and how to get the fit right.',
    answer: `The right surgical loupes match your procedures, working distance and posture. Galilean loupes at 2.5x–3.5x suit general surgery and training (Newton from ${from('newton')}, Galileo from ${from('galileo')}); prismatic loupes at 4x–6x suit fine work (Kepler from ${from('kepler')}); ergonomic prismatic loupes keep your head upright in long cases (Apollo and Medusa from ${from('apollo')}).`,
    why: {
      title: 'Why the type of surgical loupe matters',
      body: [
        'Magnification is only part of it. A loupe that is too strong shrinks your field of view and depth of field; one fitted at the wrong working distance or angle pushes your head forward through every case. The optical design decides most of that before you pick a number.',
        'So choose in this order: the type of loupe your work needs, then the magnification, then the working distance and frame. The chart below puts every HeliosX surgical loupe on one scale, from the widest view to the most detail.',
      ],
    },
    tierChart: {
      title: 'Surgical loupes magnification chart',
      lead: 'From a wide field of view to fine detail. Tap a loupe to jump to it.',
      scale: ['Wider field', 'More detail'],
      tiers: [
        tier('2.5x–3.5x', 'General surgery, orthopedics, training', [
          ['newton', `Galilean · from ${from('newton')}`],
          ['galileo', `Galilean · from ${from('galileo')}`],
        ]),
        tier('3.0x–6.0x', 'Long cases, upright head', [['apollo', `Ergonomic · from ${from('apollo')}`]]),
        tier('4.0x–6.0x', 'Vascular, hand, plastic, pediatric', [['kepler', `Prismatic · from ${from('kepler')}`]]),
        tier('Up to 8.5x', 'Neurosurgery, spine, microsurgery', [['medusa', `Ergonomic, adjustable · from ${from('medusa')}`]]),
      ],
    },
    specTable: {
      title: 'Surgical loupes: models and prices',
      columns: modelColumns,
      rows: modelRows(allModels),
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Verified residents, fellows and students get ${TRAINEE_PERCENT_OFF}% off. Full catalog: /product.`,
    },
    quickPicks: {
      title: 'Quick picks: what do you operate on?',
      rows: [
        { task: 'General surgery, orthopedics, trauma', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
        { task: 'Residents and medical students', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'Vascular, hand, plastic, pediatric', picks: [{ label: 'Kepler', href: '#kepler' }, { label: 'Apollo', href: '#apollo' }] },
        { task: 'Long cases, neck strain', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Neurosurgery, spine, sit and stand', picks: [{ label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'The main types of surgical loupes and what they are best for',
      entries: [
        entry('newton', 'Surgical loupes', [
          `The lightest way into surgical loupes: Galilean optics at 2.5x–3.5x, 40–50 g with frame, ${range('newton')}. Galilean loupes use a short, simple telescope, so they stay light and give a wide view at low magnification.`,
          'It suits residents, students and anyone who wants a first pair for general cases. If you already know you need 4x or more, go straight to Kepler or Apollo rather than buying twice.',
        ], ['Residents', 'General surgery', 'First pair']),
        entry('galileo', 'Surgical loupes', [
          `The everyday Galilean pair at 2.5x–3.5x, ${range('galileo')}, with six frame styles included and the widest field of view in the range: 150–170 mm at 2.5x.`,
          'Choose it for general surgery, orthopedics, trauma and plastic surgery at 3.0x–3.5x, where a wide view of the field matters more than the last bit of detail.',
        ], ['General surgery', 'Orthopedics', 'Plastic surgery']),
        entry('kepler', 'Surgical loupes', [
          `Prismatic surgical loupes at 4.0x, 5.0x and 6.0x, ${range('kepler')}. A prism folds a longer light path into the barrel, which keeps the image sharp at magnifications where Galilean loupes run out.`,
          'It is heavier, at 68–85 g with frame, and conventional prismatic, so you look down through it. For vascular, hand and nerve repair and pediatric work it is the lowest-cost route to 4x and up.',
        ], ['Vascular', 'Hand surgery', 'Fine detail']),
        entry('apollo', 'Surgical loupes', [
          `Ergonomic prismatic surgical loupes at 3.0x–6.0x, ${range('apollo')}. The optics angle your view downward, so you look at the field with your head closer to upright instead of bending your neck.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order, and it weighs 55–58 g with frame. It suits surgeons who work at one table height and want posture first.',
        ], ['Long cases', 'Posture', 'Upright head']),
        entry('medusa', 'Surgical loupes', [
          `Ergonomic prismatic surgical loupes up to 8.5x, with a working distance you adjust from 300 to 600 mm, ${range('medusa')}. One pair works whether you sit or stand.`,
          'It is the highest magnification HeliosX makes, at 56–65 g with frame. Neurosurgeons and spine surgeons use it for exposure, decompression and closure; where an operating microscope is indicated, loupes do not replace it.',
        ], ['Neurosurgery', 'Spine', 'Sit and stand'], {
          text: 'Not sure which magnification? Ask a loupe specialist before you order.',
          label: 'Shop Medusa',
          href: '/product/medusa',
        }),
      ],
    },
    tips: {
      title: 'Tips for choosing surgical loupes',
      items: [
        { title: 'Start with the lowest magnification that shows what you need.', body: 'Field of view and depth of field shrink as magnification rises. Most surgeons start at 2.5x–3.5x and move up for fine work.' },
        { title: 'Measure your working distance first.', body: 'It is the distance from your eyes to the field in your normal posture, and every pair is focused to it. Guide: /measurements.' },
        { title: 'Check the angle, not only the optics.', body: 'A steeper declination or ergonomic prismatic optics let you look down with your eyes rather than your neck.' },
        { title: 'Decide on a light at the same time.', body: `The mount is fitted to the frame, and any HeliosX light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes: /surgical-loupes-with-light.` },
        { title: 'Look after them.', body: 'Keep them in the case, clean the lenses with a microfiber cloth and lens spray, and never autoclave them.' },
      ],
    },
    proofPoints: ['Worn in 110+ countries', 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      types('Surgical'),
      section('Surgical loupes by specialty', 'The specialty sets the working distance, the magnification and how long you hold one posture. Short answers, with the page for each:', [
        'General surgery: 2.5x–3.5x Galilean. /general-surgery-loupes.',
        'Orthopedics and trauma: 2.5x–3.5x. /orthopedic-surgery-loupes.',
        'Plastic and hand surgery: 3.5x–4.5x, higher for nerve repair. /hand-surgery-loupes.',
        'Vascular: 3.5x–5.0x for anastomosis. /vascular-surgery-loupes.',
        'Neurosurgery and spine: 3.5x–6.0x prismatic with a light. /neurosurgery-loupes and /spine-surgery-loupes.',
        'Comparing brands as well: the best surgical loupes, 8 brands compared. /best-surgical-loupe-brands.',
      ]),
      section('What surgical loupes cost', `HeliosX surgical loupes cost ${from('newton')} to ${top('medusa')}, by model and magnification, with standard worldwide shipping included. Many established brands quote through representatives instead of publishing prices. Full breakdown: /how-much-do-surgical-loupes-cost.`, [
        `Verified residents, fellows and students: ${TRAINEE_PERCENT_OFF}% off.`,
        'Pay over time with Klarna or Affirm at checkout where available: /loupes-payment-plans.',
      ]),
      ordering,
    ],
    recommendedProducts: ['Galileo', 'Apollo', 'Medusa'],
    faqs: [
      faq('What are surgical loupes?', 'Surgical loupes are magnifying telescopes mounted on a spectacle frame or headband and focused at your working distance, so surgeons can see fine structures without leaning in. They are also called surgical magnifying glasses or surgical telescopes.'),
      faq('What magnification surgical loupes do I need?', 'Most surgeons start at 2.5x–3.5x for a wide field. Vascular, hand, plastic and pediatric work often uses 4x–5x, and neurosurgery and spine up to 6x or more. Choose the lowest magnification that shows the detail your procedures need.'),
      faq('Galilean or prismatic surgical loupes?', 'Galilean loupes are lighter and simpler and work well up to about 3.5x. Prismatic loupes stay sharp at 4x and above but weigh more. Ergonomic prismatic loupes also angle the view so your head stays more upright.'),
      faq('How much do surgical loupes cost?', `At HeliosX, ${from('newton')} to ${top('medusa')}, with shipping included and ${TRAINEE_PERCENT_OFF}% off for verified trainees. Other brands mostly quote through representatives; see /how-much-do-surgical-loupes-cost.`),
      faq('Are surgical loupes worth it?', 'For most surgeons, yes: they make fine structures easier to see and let you work without bending as far toward the field. The value depends on wearing them, which depends on fit, weight and the right magnification. More: /are-surgical-loupes-worth-it.'),
      faq('Can I buy surgical loupes online?', 'Yes. You order online, take two measurements at home, and a loupe specialist reviews them before your pair is built. Non-prescription pairs can be returned within 30 days of delivery.'),
    ],
  },

  'dental-loupes': {
    title: 'Dental Loupes: A Complete Guide to Choosing the Right Pair',
    metaTitle: 'Dental Loupes Guide + Magnification Chart & Prices | HeliosX',
    description: `Dental loupes explained: Galilean, prismatic and ergonomic types, a magnification chart for dentists and hygienists, and every price. HeliosX from ${from('newton')}.`,
    heroKicker: 'Dental loupes',
    heroImage: {
      src: photo.galileo.src,
      alt: 'Dental loupes: HeliosX Galileo Galilean loupes on a black frame',
      caption: `Galileo · From ${from('galileo')} USD`,
    },
    authorityAudience: 'dentists',
    intro:
      'Dental loupes are the magnifying telescopes dentists, hygienists and assistants wear on a frame, focused at their seated working distance, so margins, calculus and canals look bigger without leaning over the chair. Dental teams in more than 110 countries wear HeliosX, and choosing the right pair is the question we answer most. Here is the complete guide: the types of dental loupes, which magnification suits each role and procedure, what each pair costs, and how to get the fit right.',
    answer: `The right dental loupes match your procedures, seated working distance and posture. Most dentists and hygienists work at 2.5x–3.5x Galilean (Newton from ${from('newton')}, Galileo from ${from('galileo')}); endodontics and implants use 4x–6x prismatic (Kepler from ${from('kepler')}); ergonomic prismatic loupes keep your head upright through a full schedule (Apollo and Medusa from ${from('apollo')}).`,
    why: {
      title: 'Why the type of dental loupe matters',
      body: [
        'Dentistry is done seated, close in, for hours a day. A loupe at the wrong working distance or angle pulls your head forward appointment after appointment, and one that is too strong makes it hard to keep the whole quadrant in view.',
        'So choose in this order: the type of loupe your work needs, then the magnification, then the working distance and frame. The chart below puts every HeliosX dental loupe on one scale, from the widest view to the most detail.',
      ],
    },
    tierChart: {
      title: 'Dental loupes magnification chart',
      lead: 'From a wide view of the arch to fine detail. Tap a loupe to jump to it.',
      scale: ['Wider field', 'More detail'],
      tiers: [
        tier('2.5x–3.5x', 'Hygiene, restorative, students', [
          ['newton', `Galilean · from ${from('newton')}`],
          ['galileo', `Galilean · from ${from('galileo')}`],
        ]),
        tier('3.0x–6.0x', 'All-day posture, upright head', [['apollo', `Ergonomic · from ${from('apollo')}`]]),
        tier('4.0x–6.0x', 'Endodontics, implants, crown margins', [['kepler', `Prismatic · from ${from('kepler')}`]]),
        tier('Up to 8.5x', 'Perio and oral surgery, sit and stand', [['medusa', `Ergonomic, adjustable · from ${from('medusa')}`]]),
      ],
    },
    specTable: {
      title: 'Dental loupes: models and prices',
      columns: modelColumns,
      rows: modelRows(allModels),
      note: `${shipping} Prescription lenses add ${usd(PRESCRIPTION_PRICE)}. Verified dental students get ${TRAINEE_PERCENT_OFF}% off. Full catalog: /product.`,
    },
    quickPicks: {
      title: 'Quick picks: what is your work?',
      rows: [
        { task: 'Dental hygienist, full day of recalls', picks: [{ label: 'Newton', href: '#newton' }, { label: 'Galileo', href: '#galileo' }] },
        { task: 'Dental student, first pair', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Newton', href: '#newton' }] },
        { task: 'General and restorative dentistry', picks: [{ label: 'Galileo', href: '#galileo' }, { label: 'Apollo', href: '#apollo' }] },
        { task: 'Endodontics, implants, fine margins', picks: [{ label: 'Kepler', href: '#kepler' }, { label: 'Medusa', href: '#medusa' }] },
        { task: 'Neck or shoulder strain', picks: [{ label: 'Apollo', href: '#apollo' }, { label: 'Medusa', href: '#medusa' }] },
      ],
    },
    items: {
      title: 'The main types of dental loupes and what they are best for',
      entries: [
        entry('newton', 'Dental loupes', [
          `The lightest dental loupes we make: Galilean optics at 2.5x–3.5x, 40–50 g with frame, ${range('newton')}. Light weight matters most when you wear them through a full day of hygiene appointments.`,
          'Its field of view is 80–120 mm at 2.5x, narrower than Galileo. It suits hygienists, assistants and students buying a first pair.',
        ], ['Hygiene', 'Assistants', 'Students']),
        entry('galileo', 'Dental loupes', [
          `The everyday dental loupe at 2.5x–3.5x, ${range('galileo')}, with six frame styles included and the widest field of view in the range: 150–170 mm at 2.5x, enough to keep a quadrant in view.`,
          'Most dentists choose 3.0x–3.5x for restorative work and hygienists 2.5x–3.0x. Add a light at checkout and it is discounted with the loupes.',
        ], ['General dentistry', 'Hygiene', 'Dental students'], {
          text: `Add a light at checkout and it is ${LIGHT_BUNDLE_PERCENT_OFF}% off.`,
          label: 'Shop Galileo',
          href: '/product/galileo',
        }),
        entry('kepler', 'Dental loupes', [
          `Prismatic dental loupes at 4.0x, 5.0x and 6.0x, ${range('kepler')}, for canal location, implant work and crown margins where Galilean optics run out of sharpness.`,
          'It weighs 68–85 g with frame and is conventional prismatic, so you look down through it. If posture is the problem, Apollo or Medusa give the same range with angled optics.',
        ], ['Endodontics', 'Implants', 'Prosthodontics']),
        entry('apollo', 'Dental loupes', [
          `Ergonomic prismatic dental loupes at 3.0x–6.0x, ${range('apollo')}. The optics angle your view down into the mouth, so you can sit closer to upright instead of bending your neck over the chair.`,
          'Working distance is fixed at 420, 450, 500 or 550 mm, chosen at order, and it weighs 55–58 g with frame. It suits dentists and hygienists who work from one chair position and want posture first.',
        ], ['Posture', 'Restorative', 'All-day wear']),
        entry('medusa', 'Dental loupes', [
          `Ergonomic prismatic dental loupes up to 8.5x, with a working distance you adjust from 300 to 600 mm, ${range('medusa')}. One pair works as your chair position changes, or if you also stand.`,
          'At 56–65 g with frame, it suits periodontal and oral surgery, microsurgical work and clinicians who switch between seated and standing procedures.',
        ], ['Periodontics', 'Oral surgery', 'Sit and stand']),
      ],
    },
    tips: {
      title: 'Tips for choosing dental loupes',
      items: [
        { title: 'Measure your seated working distance.', body: 'Sit in your normal position with the patient where you treat them, and measure from your eyes to the tooth. Guide: /measurements.' },
        { title: 'Do not overbuy magnification.', body: 'Higher magnification narrows the field. 2.5x–3.5x covers most hygiene and restorative work; 4x and above is for endo, implants and fine margins.' },
        { title: 'Choose the light with the loupes.', body: `The mount is fitted to the frame, and any HeliosX light is ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes. Compare lights: /best-dental-loupe-lights.` },
        { title: 'Students: check what your program allows.', body: `Then verify your status for ${TRAINEE_PERCENT_OFF}% off before checkout.` },
        { title: 'Look after them.', body: 'Keep them in the case, clean the lenses with a microfiber cloth and lens spray, wipe the frame with a disinfectant your clinic approves, and never autoclave them.' },
      ],
    },
    proofPoints: ['Worn in 110+ countries', 'Every price published', 'Custom-built to your measurements', 'Limited lifetime warranty'],
    sections: [
      types('Dental'),
      section('Dental loupes by role and procedure', 'Your role sets the working distance, the detail you need and how long you wear them. Short answers, with the page for each:', [
        'Dental hygienists: 2.5x–3.5x, as light as possible. /loupes-for-dental-hygiene.',
        'General dentists: 3.0x–3.5x, ergonomic if posture is the problem. /loupes-for-general-dentists.',
        'Endodontics: 4.0x–6.0x prismatic with a light. /loupes-for-endodontics.',
        'Implants and periodontics: 3.5x–5.0x. /loupes-for-dental-implants and /loupes-for-periodontics.',
        'Dental students: 2.5x–3.5x Galilean. /education/best-loupes-for-dental-students.',
        'Comparing brands as well: the best dental loupes, 8 brands compared. /best-dental-loupe-brands.',
      ]),
      section('What dental loupes cost', `HeliosX dental loupes cost ${from('newton')} to ${top('medusa')}, by model and magnification, with standard worldwide shipping included. Most established brands quote through representatives. Every model and brand side by side: /dental-loupes-price.`, [
        `Verified dental students: ${TRAINEE_PERCENT_OFF}% off.`,
        'Pay over time with Klarna or Affirm at checkout where available: /loupes-payment-plans.',
      ]),
      ordering,
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Apollo'],
    faqs: [
      faq('What are dental loupes?', 'Dental loupes are magnifying telescopes mounted on a spectacle frame and focused at your seated working distance, so dentists and hygienists can see margins, calculus and canals without leaning over the patient. They are also called dental magnifying glasses or dental telescopes.'),
      faq('What magnification dental loupes should I get?', 'Most dentists and hygienists use 2.5x–3.5x. Endodontists, implant dentists and prosthodontists often use 4x–6x. Start with the lowest magnification that shows the detail you need, because the field narrows as magnification rises.'),
      faq('What are the best dental loupes for hygienists?', 'Light Galilean loupes at 2.5x–3.5x, such as Newton or Galileo, because you wear them through a full day of recalls. If your neck is the problem, an ergonomic pair such as Apollo is worth the extra weight. More: /loupes-for-dental-hygiene.'),
      faq('How much do dental loupes cost?', `At HeliosX, ${from('newton')} to ${top('medusa')}, with shipping included and ${TRAINEE_PERCENT_OFF}% off for verified students. Other brands mostly quote through representatives; see /dental-loupes-price.`),
      faq('Do I need a light with dental loupes?', 'Most clinicians add one, because magnification makes the field darker and a coaxial light removes shadows. Choose it with the loupes so the mount fits the frame: /dental-loupes-with-light.'),
      faq('Can I buy dental loupes online?', 'Yes. You order online, take two measurements at home, and a loupe specialist reviews them before your pair is built. Non-prescription pairs can be returned within 30 days of delivery.'),
    ],
  },
}

/** Runs last, so these two pages are exactly what is defined here. */
export function applyCategoryHubs(pages: SeoLandingPage[]) {
  for (const page of pages) {
    const hub = hubs[page.slug]
    if (!hub) continue
    Object.assign(page, hub, {
      procedureRows: undefined,
      comparisonRows: undefined,
      verdict: undefined,
      dateModified: modified,
    })
  }
}
