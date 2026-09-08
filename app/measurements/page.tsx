import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import MeasurementsExperience from '@/components/seo/MeasurementsExperience'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo'

// Expanded 8 Sep 2026. This page receives 64 internal links -- more than
// almost any other page on the site -- and carried only 463 words, which was
// the largest authority-to-substance gap in the audit. It also has to answer
// the biggest objection to buying loupes direct: how a custom fit works
// without an in-person fitting appointment.

const faqs = [
  {
    question: 'What measurements do I need for HeliosX loupes?',
    answer:
      'Three things: pupillary distance, working distance, and a current eyeglass prescription if you want prescription lenses fitted. Pupillary distance and working distance are the two that determine how the loupes are built, and both can be measured accurately at home in a few minutes. Everything else — frame choice, magnification, declination — is a selection rather than a measurement.',
  },
  {
    question: 'How accurate does my pupillary distance need to be?',
    answer:
      'Within about 1 mm. PD sets where the two optical barrels converge, so an error here shows up as eye strain rather than blur — your eyes compensate for a few minutes and then start to fatigue. This is why it is worth taking the measurement three times and averaging it rather than trusting a single reading.',
  },
  {
    question: 'Can I use a smartphone app for pupillary distance?',
    answer:
      'Yes, and most customers do. Accuracy varies between apps, so repeat the measurement two or three times and use the average. If you have an eyeglass prescription from the last couple of years, the PD is often printed on it, and an optician-measured PD is the most reliable source of all. Any of these three routes is fine.',
  },
  {
    question: 'What happens if my working distance is wrong?',
    answer:
      'You adapt your posture to the loupes instead of the other way round — which is the exact problem loupes are meant to solve. Too short and you lean in; too long and you sit back and lose the benefit of the magnification. Neither damages the loupes, but both undo the ergonomic case for wearing them, and the effect compounds over years of clinical work.',
  },
  {
    question: 'Which HeliosX model has adjustable working distance?',
    answer:
      'Medusa. It adjusts in real time from 300 mm to 600 mm, which is why it suits clinicians who move between seated and standing work within the same day. Every other model is built to one fixed working distance taken from your measurement, so on those the number matters more.',
  },
  {
    question: 'Should I measure sitting or standing?',
    answer:
      'Measure in the posture you actually work in most of the time. If that is genuinely split between seated and standing, either measure the position you spend more hours in, or choose Medusa and adjust between them. Do not average two very different postures into a number that matches neither.',
  },
  {
    question: 'How do you fit loupes without an in-person appointment?',
    answer:
      'The measurements that matter — pupillary distance and working distance — are numbers, and numbers travel. A fitting appointment largely exists because a dealer needs you in the room; it is a sales structure rather than an optical requirement. We have no dealer network, so we take the measurements online, build to them, and help you adjust the frame on arrival if anything needs refining.',
  },
  {
    question: 'When do I submit my measurements?',
    answer:
      'After checkout. You will receive a measurement link by email, and production starts once those numbers are in. Taking payment first is simply how the build queue is ordered — nothing is cut or assembled until we have your measurements.',
  },
  {
    question: 'Can I get prescription lenses fitted?',
    answer:
      'Yes, as a $200 add-on across the lineup. Provide a current eyeglass prescription — ideally issued within the last two years — along with your other measurements. The prescription sits in a carrier lens rather than in the barrels themselves, so it can be updated later without rebuilding the loupes.',
  },
  {
    question: 'What if the fit is not right when they arrive?',
    answer:
      'Contact us. Frame adjustments — temple arms, nose bridge, angle — are routine and can usually be resolved with guidance. If a measurement was genuinely wrong rather than slightly off, that is a different conversation, and we would rather have it than leave you with loupes you avoid wearing.',
  },
]

const steps = [
  {
    title: 'Measure pupillary distance',
    body:
      'Pupillary distance is the gap between the centres of your pupils, in millimetres. It determines where the two optical barrels converge, so it carries the least tolerance of any measurement here — aim to be within 1 mm. Use a well-reviewed smartphone PD app, or hold a ruler across your brow in good lighting and read the distance between pupil centres while looking straight ahead at a fixed point several metres away. Take the measurement three times and use the average; a single reading is where most errors come from. If you have an eyeglass prescription from the last couple of years, the PD is often printed on it already, and an optician-measured PD is more reliable than either method above.',
    image: {
      src: '/pupillary distance.png',
      alt: 'Pupillary distance measured between the centers of the pupils with a ruler held across the brow',
      width: 1196,
      height: 777,
      label: 'Pupillary distance',
    },
  },
  {
    title: 'Measure working distance',
    body:
      'Working distance is the gap between your eyes and the field you are working on, measured in your natural clinical posture. Set yourself up as if you were mid-procedure — same chair height, same patient position, same distance from the field — then measure from the outer corner of your eye to the point where your hands are working. Most clinicians land somewhere between 350 mm and 500 mm, but the number that matters is yours rather than the average. This measurement is what every other decision hangs off: it sets the focal length the optics are cut to, and on fixed-distance models it cannot be changed afterwards.',
    image: {
      src: '/workingdistance.png',
      alt: 'Clinician demonstrating natural working distance posture during a procedure',
      width: 1500,
      height: 1000,
      label: 'Working distance',
    },
  },
  {
    title: 'Check your posture before you trust the number',
    body:
      'This is the step people skip, and it is the one that decides whether the loupes help your neck or quietly hurt it. Measure with your back straight, shoulders down, and neck close to neutral — not hunched toward the field. If you measure while leaning in, you build that lean permanently into the optics and then spend years working in the posture you were trying to escape. Ergonomic prismatic models such as Apollo and Medusa refract the view downward so your head stays up and your eyes look straight ahead, but they can only do that if the working distance was measured from an upright posture in the first place.',
    image: {
      src: '/workdistance diagram.png',
      alt: 'Leg-supported sitting posture reference diagram showing elbow and knee angles',
      width: 600,
      height: 732,
      label: 'Posture reference',
    },
  },
  {
    title: 'Decide whether your working distance is fixed or variable',
    body:
      'If you work in one consistent posture, a fixed working distance is correct and simpler. If you genuinely move between seated and standing work through the day, or between procedures with very different ergonomics, a single fixed number will be a compromise at both ends. Medusa adjusts in real time from 300 mm to 600 mm for exactly that reason. Deciding between fixed and adjustable before you measure is worth doing, because it changes how much the precision of any single reading matters.',
  },
  {
    title: 'Add your prescription, if you need one',
    body:
      'Prescription lenses are a $200 add-on across the lineup. Provide a current eyeglass prescription, ideally issued within the last two years, alongside your other measurements. The prescription is carried in a lens behind the optics rather than in the barrels, which means it can be updated later without rebuilding the loupes. If you wear contact lenses during clinical work and glasses the rest of the time, measure and order for the way you actually work.',
  },
  {
    title: 'Submit after checkout',
    body:
      'Once you have ordered, you will receive a measurement link by email. Enter your pupillary distance, working distance, and prescription details there, and production starts from those numbers. There is no dealer, no rep visit and no fitting appointment anywhere in this process — the measurements are the fitting, which is why they are worth taking carefully. If anything needs adjusting when the loupes arrive, the frame can be fine-tuned with our guidance.',
  },
]

export const metadata: Metadata = buildMetadata({
  title: 'Loupe Measurements | Pupillary & Working Distance',
  description:
    'How to measure pupillary distance and working distance for surgical and dental loupes at home, including posture, accuracy tolerances, and prescription fitting.',
  path: '/measurements',
  image: null,
  keywords: [
    'loupe measurements',
    'pupillary distance for loupes',
    'working distance for loupes',
    'how to measure PD for loupes',
    'loupe fitting without appointment',
  ],
})

export default function MeasurementsPage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to measure for surgical and dental loupes',
    description:
      'Measure pupillary distance, working distance, posture, and prescription requirements before final loupe production.',
    totalTime: 'PT10M',
    supply: [
      { '@type': 'HowToSupply', name: 'Millimetre ruler or a pupillary distance app' },
      { '@type': 'HowToSupply', name: 'Tape measure' },
      {
        '@type': 'HowToSupply',
        name: 'Current eyeglass prescription (only when ordering prescription lenses)',
      },
    ],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  }

  return (
    <>
      <JsonLd
        data={[
          howToJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Measurements', path: '/measurements' },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <MeasurementsExperience faqs={faqs} steps={steps} />
    </>
  )
}
