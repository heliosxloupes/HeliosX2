import { claims, identity, identityShort } from './brand-claims'
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
  title: 'World-renowned loupes. Never gatekept.',
  metaTitle: 'About HeliosX | World-Renowned Surgical & Dental Loupes',
  description: identityShort,
  intro: identity,
  sections: [
    {
      title: 'Trusted in more than 110 countries',
      body: `${claims.expos} That is where HeliosX earned its name: on conference floors, fitting surgeons, dentists, hygienists, residents and students one by one, in Europe, Asia, South America and the United States. Today clinicians in more than 110 countries work with HeliosX optics every day.`,
    },
    {
      title: 'The world standard for ergonomic and lightweight optics',
      body: `${claims.leader} ${claims.favored}`,
      bullets: [
        'Ergonomic prismatic loupes up to 8.5x, built so you look down at the field with your head upright.',
        'Lightweight Galilean loupes that disappear on long days.',
        'Kepler high-magnification loupes for the finest surgical detail.',
        'Medusa: working distance you adjust from 300 to 600 mm, for clinicians who sit and stand.',
        'LED loupe lights and headlights up to 198,000 lux.',
      ],
    },
    {
      title: 'Custom-tailored to every clinician',
      body: `${claims.custom} Your measurements are reviewed by the same specialists who fit clinicians at expos worldwide, before a single lens is set.`,
    },
    {
      title: 'Clinics, teaching hospitals and universities',
      body: `${claims.institutions} From a single private practice to a full residency class, we equip the clinicians who will define their specialty. See /hospitals-and-universities.`,
    },
    {
      title: 'Surgical missions',
      body: `${claims.missions} See /missions.`,
    },
    {
      title: 'Why we refuse to gatekeep',
      body: `${claims.mission} Elite optics belong in every hand that needs them, in this economy more than ever. So we publish every price, and we keep them fair. Skill thrives where access exists.`,
    },
    {
      title: 'Talk to a loupe specialist',
      body: claims.specialists,
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

export const missionsPage: TrustPage = {
  path: '/missions',
  kicker: 'Missions',
  title: 'Elite optics where they matter most',
  metaTitle: 'HeliosX Surgical Missions | South America & Asia',
  description: 'HeliosX sponsors surgeons on medical mission trips across South America and Asia, equipping operating rooms that treat children born with congenital conditions.',
  intro: claims.missions,
  sections: [
    {
      title: 'Why we sponsor surgeons',
      body: 'Skill thrives where access exists. On a mission trip, a surgeon may operate on more children in a week than some hospitals see in a month, often in rooms without an operating microscope. The right loupes on the right surgeon change what is possible in those cases, and we make sure they are there.',
    },
    {
      title: 'Where we work',
      body: 'For years HeliosX has sponsored surgeons travelling to communities across South America and Asia, where mission teams correct congenital conditions in children who would otherwise wait years for surgery, or never receive it.',
    },
    {
      title: 'The same mission at home',
      body: `${claims.mission} The surgeons we sponsor abroad and the residents we equip at home share one principle: no clinician should be gatekept from the tools of their craft.`,
      bullets: [
        'Loupes for plastic and reconstructive surgery: /education/best-loupes-for-plastic-surgery.',
        'Loupes for maxillofacial surgery: /maxillofacial-surgery-loupes.',
        'Loupes for pediatric surgery: /pediatric-surgery-loupes.',
      ],
    },
    {
      title: 'Surgeons and mission teams',
      body: 'Planning a mission and need optics for your team? Email us and a HeliosX specialist will help you equip it.',
    },
  ],
}

export const institutionsPage: TrustPage = {
  path: '/hospitals-and-universities',
  kicker: 'Institutions',
  title: 'Loupes for teaching hospitals, universities and clinics',
  metaTitle: 'Loupes for Hospitals & Universities | HeliosX',
  description: 'HeliosX equips private clinics, teaching hospitals, universities and training programs worldwide with custom-tailored surgical and dental loupes.',
  intro: `${claims.institutions} We equip residency classes, dental and medical schools, hygiene programs and private clinics with custom-tailored loupes, fitted by specialists who have advised clinicians in more than 110 countries.`,
  sections: [
    {
      title: 'Residency and training programs',
      body: `Every resident fitted to their own pupillary and working distance, with the magnification your program teaches. Verified residents, fellows and students receive ${TRAINEE_PERCENT_OFF}% off.`,
      bullets: ['Galilean loupes for first-year training, 2.5x to 3.5x.', 'Prismatic and ergonomic prismatic loupes for senior residents and fellows, up to 8.5x.', 'Lights and headlights for every loupe.'],
    },
    {
      title: 'Dental, hygiene and medical schools',
      body: 'Students choose their first loupes at the start of clinical training. We make that choice simple: a specialist recommendation by year and discipline, custom fitting, and published prices that fit a student budget.',
    },
    {
      title: 'Private clinics and group practices',
      body: 'Equip a whole team, each clinician fitted individually, with one point of contact for orders, warranty and service.',
    },
    {
      title: 'Work with HeliosX',
      body: `Tell us your institution, the number of clinicians and their specialties, and a HeliosX specialist will build a plan for your team. Email ${supportEmail}.`,
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
