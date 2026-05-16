'use client'

import ProductPageTemplate, { ProductPageConfig } from '../ProductPageTemplate'

const medusaConfig: ProductPageConfig = {
  slug: 'medusa',
  name: 'Medusa Surgical Loupes',
  shortName: 'Medusa',
  description:
    'Adjustable working-distance loupes built for surgeons who move between sitting and standing positions without sacrificing clarity, depth, or posture.',
  highlights: [
    'Adjustable 300-600 mm working distance.',
    'Fixed interpupillary distance tailored to your specifications.',
    'Enhanced depth perception with superior clarity.',
    'Ergonomic comfort for the neck and spine.',
  ],
  heroImages: [
    '/Medusa/MedusaMain.png',
    '/Medusa/MedusaMain.png',
    '/Medusa/MedusaMain.png',
  ],
  magnifications: ['3.0x', '4.0x', '5.0x'],
  priceLabel: 'Pricing coming soon',
  isAvailable: false,
  specTitle: 'Medusa product specifications.',
  specDescription:
    'Medusa is designed around adjustable working distance and custom fit. It adapts to the surgeon rather than forcing the surgeon into one fixed operating posture.',
  specColumns: [
    {
      title: 'Core build',
      items: [
        'Weight with frame: 56g.',
        'Adjustable working distance for seated or standing procedures.',
        'Fixed interpupillary distance tailored to your specifications.',
        'Built for maximum ergonomic comfort through long cases.',
      ],
    },
    {
      title: 'Optics & fit',
      items: [
        'Enhanced depth perception for precise field control.',
        'Superior clarity across the working field.',
        'Custom IPD alignment for a stable visual axis.',
        'Designed to reduce neck and spine strain.',
      ],
    },
    {
      title: 'Magnification data',
      items: [
        'Magnification options: 3.0x, 4.0x, 5.0x.',
        'Working distance: adjustable 300-600 mm.',
        'Field of view: 80 mm.',
        'Depth of field: 110 mm.',
      ],
    },
  ],
  specImages: [
    { src: '/Medusa/MedusaMain.png', alt: 'Medusa surgical loupes product image' },
    { src: '/Medusa/MedusaMain.png', alt: 'Medusa surgical loupes side placeholder' },
    { src: '/Medusa/MedusaMain.png', alt: 'Medusa surgical loupes detail placeholder' },
  ],
}

export default function MedusaProductPage() {
  return <ProductPageTemplate config={medusaConfig} />
}
