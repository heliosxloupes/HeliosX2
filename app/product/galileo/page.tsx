'use client'

import ProductPageTemplate, { ProductPageConfig } from '../ProductPageTemplate'

const galileoConfig: ProductPageConfig = {
  slug: 'galileo',
  name: 'Galileo Surgical Loupes',
  shortName: 'Galileo',
  description:
    'Versatile, lightweight optics designed for operators who want precision without overhead. Galileo balances field of view, depth, and comfort for high-precision surgical and dental work.',
  highlights: [
    'Light weight, reduced volume barrels.',
    'Multi-layer coated premium lenses.',
    'Extra-wide field of view & depth.',
    'Prescription compatible & light-source ready.',
  ],
  heroImages: [
    '/Galileo/GalileoMain2.png',
    '/Galileo/BlackguyGalileo.png',
    '/Galileo/BlonddirectNew.png',
    '/Oldguy4Galileo.png',
  ],
  magnifications: ['2.5x', '3.0x', '3.5x'],
  basePrice: 499,
  specTitle: 'Galileo product specifications.',
  specDescription:
    'Designed for high-precision work where clarity, color fidelity, and depth perception actually matter. Every Galileo unit is tuned for long-case comfort and compatibility with modern LED light systems.',
  specColumns: [
    {
      title: 'Core build',
      items: [
        'Volume reduced by ~30% while maintaining performance.',
        'Weight: 35g / 36g / 37g (2.5x / 3.0x / 3.5x).',
        'Barrels: metal construction, tuned for durability.',
        'Prescription compatible straight out of the box.',
      ],
    },
    {
      title: 'Optics & glass',
      items: [
        'A+ grade imported optical glass.',
        'Multi-layer coated lenses, high color fidelity.',
        'Transmittance > 98% for bright, neutral images.',
        'Extra-wide field of view and generous depth of field for stable focus.',
        'IPD range: 54—72 mm.',
      ],
    },
    {
      title: 'Magnification data',
      items: [
        '2.5x — WD 300—580 mm, FOV 150—170 mm, DOF 200 mm.',
        '3.0x — WD 300—580 mm, FOV 130—150 mm, DOF 200 mm.',
        '3.5x — WD 300—580 mm, FOV 110—130 mm, DOF 200 mm.',
        'Compatible with fixed LED light sources and packs.',
        'Bright, uniform spot with long-lasting illumination.',
      ],
    },
  ],
  specImages: [
    { src: '/Galileo/cutegirlhallway.png', alt: 'Surgeon walking to the OR' },
    { src: '/Galileo/girlinmirror.png', alt: 'Surgeon fitting loupes in mirror' },
    { src: '/Galileo/lockerroom.png', alt: 'Locker room preparation with loupes' },
  ],
}

export default function GalileoProductPage() {
  return <ProductPageTemplate config={galileoConfig} />
}
