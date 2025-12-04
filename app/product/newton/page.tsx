'use client'

import ProductPageTemplate, { ProductPageConfig } from '../ProductPageTemplate'

const newtonConfig: ProductPageConfig = {
  slug: 'newton',
  name: 'Newton Surgical Loupes',
  shortName: 'Newton',
  description:
    'Featherweight optics built for clinicians who live in their loupes. Newton keeps fatigue low with a balanced chassis and crystal-clear glass for daily procedures.',
  highlights: [
    'Ultra-light barrels and balanced chassis.',
    'Multi-layer coated lenses with high fidelity.',
    'Wide field of view with dependable depth.',
    'Prescription ready and light-source compatible.',
  ],
  heroImages: [
    '/Newton/NewtonMain.png',
    '/Newton/NewtonAsian2.png',
    '/Newton/NewtonAsian3.png',
    '/Newton/H2.3.png',
  ],
  magnifications: ['2.5x', '3.0x', '3.5x'],
  basePrice: 449,
  specTitle: 'Newton product specifications.',
  specDescription:
    'Built for long cases and back-to-back days in the OR. Newton balances weight, clarity, and durability so you can stay focused without strain.',
  specColumns: [
    {
      title: 'Core build',
      items: [
        'Featherweight chassis that prioritizes balance.',
        'Weight: 33g / 34g / 35g (2.5x / 3.0x / 3.5x).',
        'Metal barrels for dependable longevity.',
        'Prescription friendly with immediate compatibility.',
      ],
    },
    {
      title: 'Optics & glass',
      items: [
        'A+ grade optical glass with multi-layer coatings.',
        'Neutral color rendering with high transmittance.',
        'Even illumination and crisp edge-to-edge clarity.',
        'IPD range: 54—72 mm with quick adjustments.',
      ],
    },
    {
      title: 'Magnification data',
      items: [
        '2.5x — WD 300—580 mm, FOV 150—170 mm, DOF 200 mm.',
        '3.0x — WD 300—580 mm, FOV 130—150 mm, DOF 200 mm.',
        '3.5x — WD 300—580 mm, FOV 110—130 mm, DOF 200 mm.',
        'Compatible with fixed LED lights and battery packs.',
        'Built to stay bright through extended sessions.',
      ],
    },
  ],
  specImages: [
    { src: '/Newton/H2.1.png', alt: 'Newton surgeon prepping in hallway' },
    { src: '/Newton/H2.2.png', alt: 'Newton loupes being fitted' },
    { src: '/Newton/H2.3.png', alt: 'Newton loupes on mannequin' },
  ],
}

export default function NewtonProductPage() {
  return <ProductPageTemplate config={newtonConfig} />
}
