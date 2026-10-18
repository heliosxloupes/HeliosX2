import { supportEmail } from './seo'
import { TRAINEE_PERCENT_OFF } from './pricing'

// Content for /about and /contact. The pages and their Markdown versions
// (lib/page-markdown.ts) both read from here, so they can't drift apart.

export type TrustSection = { title: string; body: string; bullets?: string[] }

export type TrustPage = {
  path: string
  kicker: string
  title: string
  metaTitle: string
  description: string
  intro: string
  sections: TrustSection[]
}

export const aboutPage: TrustPage = {
  path: '/about',
  kicker: 'About',
  title: 'About HeliosX Loupes',
  metaTitle: 'About HeliosX Loupes | Custom Surgical & Dental Loupes',
  description:
    'HeliosX Loupes sells custom-fit surgical and dental loupes directly to clinicians, with every price published and no sales representatives.',
  intro:
    'HeliosX Loupes is a direct-to-clinician optics company. We make custom-fit surgical and dental loupes for surgeons, dentists, hygienists, residents and students, and we sell them online at published prices instead of through sales representatives and quotes.',
  sections: [
    {
      title: 'Why we exist',
      body: 'Loupes are one of the first serious purchases a clinician makes, and most of the market still hides the price behind a quote and a rep visit. We publish every price on the product page, so the budget conversation happens before anyone books a demo. Skill thrives where access exists.',
    },
    {
      title: 'What we make',
      body: 'Five models cover the main optical systems used in clinical work, each built to one magnification and to the buyer’s own measurements.',
      bullets: [
        'Newton and Galileo: Galilean loupes, 2.5x to 3.5x, for hygiene, students and everyday clinical work.',
        'Kepler: conventional prismatic loupes, 4.0x to 6.0x, for fine surgical detail.',
        'Apollo: ergonomic prismatic loupes, 3.0x to 6.0x, with a fixed working distance and angled optics for a more upright head.',
        'Medusa: ergonomic prismatic loupes, 3.0x to 8.5x, with a working distance that adjusts from 300 to 600 mm.',
      ],
    },
    {
      title: 'How buying works',
      body: 'There is no in-person fitting. You send your pupillary distance and working distance, we review the measurements before production starts, and your pair is built and shipped to you. Production usually takes one to two weeks after the measurements are approved.',
    },
    {
      title: 'What every pair includes',
      body: 'Worldwide shipping, a limited lifetime warranty against manufacturer defects, and a review of your measurements before we build. Non-prescription pairs can be returned within 30 days of delivery for a full refund.',
      bullets: [
        `Residents, fellows and students receive ${TRAINEE_PERCENT_OFF}% off with verified training status.`,
        'Payment by card, Affirm or Klarna through Stripe checkout.',
      ],
    },
    {
      title: 'Name note',
      body: 'HeliosX Loupes (heliosxvision.com) is not related to the UK healthtech company also called HeliosX.',
    },
  ],
}

export const contactPage: TrustPage = {
  path: '/contact',
  kicker: 'Support',
  title: 'Contact HeliosX Loupes',
  metaTitle: 'Contact HeliosX Loupes | Email Support',
  description: `Email HeliosX Loupes at ${supportEmail}. We usually answer within one business day.`,
  intro: `The fastest way to reach us is email: ${supportEmail}. A real person on the HeliosX team reads every message, and we usually answer within one business day.`,
  sections: [
    {
      title: 'What to include',
      body: 'A little detail lets us answer in one reply instead of three.',
      bullets: [
        'Orders and shipping: your order number and the email you used at checkout.',
        'Choosing a model: your specialty or role, whether you mostly sit or stand, and the magnification you are considering.',
        'Fit and measurements: your pupillary distance and working distance, or the step where you got stuck.',
        'Warranty or repair: your order number, a description of the issue and a photo if you can.',
      ],
    },
    {
      title: 'Trainee pricing',
      body: `Residents, fellows and students get ${TRAINEE_PERCENT_OFF}% off. Email us from your training-program address, or attach proof of your training status, and we will send a discount code to use at checkout.`,
    },
    {
      title: 'Before you write',
      body: 'Many answers are already on the site: the measuring guide explains pupillary and working distance, and the shipping, returns and warranty pages cover delivery times, the 30-day return window and the limited lifetime warranty.',
    },
  ],
}
