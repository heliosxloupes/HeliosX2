'use client'

import { useState, useRef } from 'react'

import Image from 'next/image'

import Header from '@/components/Header'

import { addToCart } from '@/lib/cart'

import { useRouter } from 'next/navigation'

const heroImages = [
  '/Galileo/GalileoMain2.png',
  '/Galileo/BlackguyGalileo.png',
  '/Galileo/BlonddirectNew.png',
  '/Oldguy4Galileo.png',
]

type Magnification = '2.5x' | '3.0x' | '3.5x'

type FrameId = 'JJ04B' | 'JJ20B' | 'JJ21G' | 'JJ22B' | 'JJ23Grey' | 'JJ24Grey'

type FrameConfig = {
  id: FrameId
  label: string
  baseImage: string
  colors: {
    name: string
    value: string // css label name
    image: string
  }[]
}

// Frame + variant configuration
const frameConfigs: FrameConfig[] = [
  {
    id: 'JJ04B',
    label: 'JJ04',
    baseImage: '/Frames/JJ04B.png',
    colors: [
      { name: 'Black', value: 'black', image: '/Frames/JJ04B.png' },
      { name: 'Grey', value: 'grey', image: '/Frames/JJ04G.png' },
    ],
  },
  {
    id: 'JJ20B',
    label: 'JJ20',
    baseImage: '/Frames/JJ20B.png',
    colors: [
      { name: 'Black', value: 'black', image: '/Frames/JJ20B.png' }, // no variants
    ],
  },
  {
    id: 'JJ21G',
    label: 'JJ21',
    baseImage: '/Frames/JJ21G.png',
    colors: [
      { name: 'Gold', value: 'gold', image: '/Frames/JJ21G.png' },
      { name: 'Steel', value: 'steel', image: '/Frames/JJ21S.png' },
    ],
  },
  {
    id: 'JJ22B',
    label: 'JJ22',
    baseImage: '/Frames/JJ22B.png',
    colors: [
      { name: 'Blue', value: 'blue', image: '/Frames/JJ22Blue.png' },
      { name: 'Gold', value: 'gold', image: '/Frames/JJ22Gold.png' },
      { name: 'Grey', value: 'grey', image: '/Frames/JJ22Grey.png' },
    ],
  },
  {
    id: 'JJ23Grey',
    label: 'JJ23',
    baseImage: '/Frames/JJ23Grey.png',
    colors: [
      { name: 'Grey', value: 'grey', image: '/Frames/JJ23Grey.png' },
      { name: 'Black', value: 'black', image: '/Frames/JJ23Black.png' },
      { name: 'Blue', value: 'blue', image: '/Frames/JJ23Blue.png' },
      { name: 'Red', value: 'red', image: '/Frames/JJ23Red.png' },
    ],
  },
  {
    id: 'JJ24Grey',
    label: 'JJ24',
    baseImage: '/Frames/JJ24Grey.png',
    colors: [
      { name: 'Grey', value: 'grey', image: '/Frames/JJ24Grey.png' },
      { name: 'Black', value: 'black', image: '/Frames/JJ24Black.png' },
      { name: 'Blue', value: 'blue', image: '/Frames/JJ24Blue.png' },
    ],
  },
]

export default function GalileoProductPage() {
  const router = useRouter()

  // MAIN HERO IMAGE STATE
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)

  // PRODUCT CONFIG STATE
  const [selectedMag, setSelectedMag] = useState<Magnification>('2.5x')
  const [selectedFrameId, setSelectedFrameId] = useState<FrameId>('JJ23Grey')
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>('grey')
  const [quantity, setQuantity] = useState(1)

  const techRef = useRef<HTMLDivElement | null>(null)

  const basePrice = 499
  const subtotal = basePrice * quantity

  const currentFrameConfig = frameConfigs.find(f => f.id === selectedFrameId) ?? frameConfigs[0]
  const currentColorConfig =
    currentFrameConfig.colors.find(c => c.value === selectedFrameColor) ??
    currentFrameConfig.colors[0]

  const handleAddToCart = () => {
    addToCart({
      productSlug: 'galileo',
      name: 'Galileo Surgical Loupes',
      shortName: 'Galileo',
      price: basePrice,
      quantity,
      image: heroImages[0],
      selectedMagnification: selectedMag,
      selectedFrameId: selectedFrameId,
      selectedFrameName: `${currentFrameConfig.label} ${currentColorConfig.name}`,
      selectedFrameImage: currentColorConfig.image,
    })
    router.push('/cart')
  }

  const scrollToTech = () => {
    if (!techRef.current) return
    techRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-neutral-100">
        {/* HERO: main product image + right column */}
        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1400px] px-4 lg:px-10 pt-6 lg:pt-10 gap-8 lg:gap-12">
          {/* LEFT – MAIN IMAGE */}
          <div className="w-full lg:flex-[1.25] flex items-center">
            <div className="w-full rounded-[32px] overflow-hidden bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.7)]">
              {/* Main image + thumbnails */}
              <div className="relative w-full overflow-hidden">
                {/* Taller on mobile, standard on desktop */}
                <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[16/9] w-full">
                  <Image
                    src={heroImages[activeHeroIndex]}
                    alt="Galileo surgical loupes hero"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* View specs button */}
                <button
                  onClick={scrollToTech}
                  className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-medium text-neutral-100 backdrop-blur-md transition hover:bg-white/10"
                >
                  View product specs
                </button>

                {/* Thumbnail strip */}
                <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
                  {heroImages.map((src, idx) => (
                    <button
                      key={src}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative overflow-hidden rounded-[18px] border transition-all duration-200 ${
                        activeHeroIndex === idx
                          ? 'border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.5)] scale-[1.04]'
                          : 'border-white/10 hover:border-white/40 hover:scale-[1.03]'
                      }`}
                    >
                      <div className="relative h-10 w-10 xs:h-11 xs:w-11 sm:h-12 sm:w-12 lg:h-11 lg:w-11">
                        <Image
                          src={src}
                          alt={`View ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – TEXT / MAG / FRAMES / CART */}
          <div className="hidden lg:flex w-full lg:flex-[0.9] flex-col gap-8 justify-start">
              {/* Title + copy */}
              <div>
                <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500">
                  HeliosX • Galileo
                </p>
                <h1 className="text-2xl font-semibold text-neutral-50 sm:text-3xl">
                  Galileo Surgical Loupes
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Versatile, lightweight optics designed for operators who want
                  precision without overhead. Galileo balances field of view,
                  depth, and comfort for high-precision surgical and dental
                  work.
                </p>
              </div>

              {/* Highlights */}
              <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-4 text-xs text-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Highlights
                </p>
                <div className="grid grid-cols-2 gap-3 text-[0.75rem]">
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                      <span className="h-2 w-2 rounded-full bg-black" />
                    </span>
                    <span>Light weight, reduced volume barrels.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                      <span className="h-2 w-2 rounded-full bg-black" />
                    </span>
                    <span>Multi-layer coated premium lenses.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                      <span className="h-2 w-2 rounded-full bg-black" />
                    </span>
                    <span>Extra-wide field of view &amp; depth.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                      <span className="h-2 w-2 rounded-full bg-black" />
                    </span>
                    <span>Prescription compatible &amp; light-source ready.</span>
                  </div>
                </div>
              </div>

              {/* Magnification */}
              <div>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Magnification
                </p>
                <div className="flex gap-2">
                  {(['2.5x', '3.0x', '3.5x'] as Magnification[]).map(mag => (
                    <button
                      key={mag}
                      onClick={() => setSelectedMag(mag)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                        selectedMag === mag
                          ? 'bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.45)]'
                          : 'border border-white/15 bg-black/40 text-neutral-200 hover:border-white/40'
                      }`}
                    >
                      {mag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame styles */}
              <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-4 text-xs text-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Frame style
                </p>

                {/* Frame thumbnails grid */}
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {frameConfigs.map(frame => {
                    const isActive = frame.id === selectedFrameId
                    return (
                      <button
                        key={frame.id}
                        onClick={() => {
                          setSelectedFrameId(frame.id)
                          // default color for new frame
                          setSelectedFrameColor(frame.colors[0].value)
                        }}
                        className={`relative overflow-hidden rounded-2xl border bg-black/40 transition ${
                          isActive
                            ? 'border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.6)]'
                            : 'border-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="relative h-16 w-full">
                          <Image
                            src={frame.baseImage}
                            alt={frame.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute bottom-1 left-2 rounded-full bg-black/70 px-2 py-[2px] text-[0.6rem] font-medium text-neutral-100">
                          {frame.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Active frame description */}
                <div className="mb-2 text-[0.7rem] text-neutral-300">
                  <p className="font-semibold text-neutral-100">
                    {currentFrameConfig.label}{' '}
                    {currentColorConfig.name && `• ${currentColorConfig.name}`}
                  </p>
                  <p className="mt-1">
                    Choose a base frame, then fine-tune the finish. All frames
                    support light mounts and prescription builds.
                  </p>
                </div>

                {/* Color pills */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {currentFrameConfig.colors.map(color => {
                    const active = color.value === selectedFrameColor
                    return (
                      <button
                        key={color.value}
                        onClick={() => setSelectedFrameColor(color.value)}
                        className={`rounded-full px-3 py-1 text-[0.7rem] transition ${
                          active
                            ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.5)]'
                            : 'border border-white/20 bg-black/40 text-neutral-200 hover:border-white/50'
                        }`}
                      >
                        {color.name}
                      </button>
                    )
                  })}
                </div>

                {/* Preview window */}
                <div className="relative mt-2 overflow-hidden rounded-2xl border border-white/15 bg-black/70">
                  <div className="relative h-32 w-full sm:h-36">
                    <Image
                      src={currentColorConfig.image}
                      alt={`${currentFrameConfig.label} ${currentColorConfig.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing / Add to cart */}
              <div className="mt-1 rounded-3xl border border-white/10 bg-neutral-900/90 p-4 text-xs text-neutral-200 shadow-[0_26px_90px_rgba(0,0,0,0.8)]">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Starting at
                </p>
                <div className="mt-1 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-neutral-50">
                      ${basePrice}
                      <span className="ml-1 text-[0.65rem] font-normal text-neutral-400">
                        USD
                      </span>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-neutral-400">
                      You'll finalize IPD, working distance, and prescription
                      details after checkout.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] text-neutral-400">
                      Qty
                    </span>
                    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1">
                      <button
                        onClick={() =>
                          setQuantity(q => (q > 1 ? q - 1 : 1))
                        }
                        className="px-2 text-sm text-neutral-300 hover:text-white"
                      >
                        –
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm text-neutral-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-2 text-sm text-neutral-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[0.7rem] text-neutral-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal}.00</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.6)] transition hover:bg-neutral-100"
                >
                  Add to cart
                </button>
                <p className="mt-2 text-[0.65rem] leading-relaxed text-neutral-500">
                  No hidden service contracts, mandatory bundles, or surprise
                  fees—just the loupes you actually need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL DETAILS + BANNER */}
        <section
          id="technical-details"
          ref={techRef}
          className="relative bg-black text-neutral-100 min-h-screen flex flex-col justify-center"
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 py-16 lg:px-10 lg:py-24">
            {/* Section label + heading */}
            <div className="space-y-2">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-400">
                Technical detail
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold text-white">
                Galileo product specifications.
              </h2>
            </div>

            {/* Specs + images grid */}
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
              {/* LEFT – Structured specs */}
              <div className="space-y-8 text-sm leading-relaxed text-neutral-200">
                {/* Block: Weight + Optics */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Light weight
                    </h3>
                    <p>
                      Volume reduced by 30% while maintaining excellent performance. Designed
                      for long cases without unnecessary strain.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Excellent optics
                    </h3>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>A+ grade imported optical glass</li>
                      <li>Multi-layer coated premium lenses</li>
                      <li>High color fidelity, light transmittance &gt; 98%</li>
                    </ul>
                  </div>
                </div>

                {/* Block: Optical lens + light source */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Optical lens
                    </h3>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Extra-wide field of view</li>
                      <li>High color accuracy</li>
                      <li>Designed for precise surgical and dental work</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Light source
                    </h3>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Compatible with fixed light source and power supply</li>
                      <li>Produces a bright, uniform spot</li>
                      <li>Long-lasting illumination</li>
                    </ul>
                  </div>
                </div>

                {/* Block: General specs */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    General specifications
                  </h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Product model: TTL-Galileo</li>
                      <li>Magnification: 2.5x / 3.0x / 3.5x</li>
                      <li>Weight: 35g / 36g / 37g (by mag)</li>
                      <li>Frames: Optional, multiple styles</li>
                      <li>Prescription available: Yes</li>
                    </ul>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>IPD range: 54–72 mm</li>
                      <li>Barrels material: Metal</li>
                      <li>Lens material: A+ grade optical glass</li>
                      <li>Transmittance: 98%</li>
                      <li>Fixed lights: Supported</li>
                    </ul>
                  </div>
                </div>

                {/* Block: Per-magnification details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Working distances &amp; fields
                  </h3>
                  <div className="grid gap-4 lg:grid-cols-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-100">2.5x</p>
                      <p>Working distance: 300–580 mm</p>
                      <p>Field of view: 150–170 mm</p>
                      <p>Depth of field: 200 mm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-100">3.0x</p>
                      <p>Working distance: 300–580 mm</p>
                      <p>Field of view: 130–150 mm</p>
                      <p>Depth of field: 200 mm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-100">3.5x</p>
                      <p>Working distance: 300–580 mm</p>
                      <p>Field of view: 110–130 mm</p>
                      <p>Depth of field: 200 mm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT – 3 imagery tiles */}
              <div className="grid gap-4">
                <div className="relative h-40 w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                  <Image
                    src="/Galileo/cutegirlhallway.png"
                    alt="Galileo in everyday clinical corridor"
                    fill
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>

                <div className="relative h-40 w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                  <Image
                    src="/Galileo/girlinmirror.png"
                    alt="Mirror fit check with Galileo loupes"
                    fill
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>

                <div className="relative h-40 w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                  <Image
                    src="/Galileo/lockerroom.png"
                    alt="Locker room perspective with Galileo"
                    fill
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
              </div>
            </div>

            {/* BOTTOM BANNER – brighter overlay */}
            <div className="mt-8 w-full">
              <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px]">
                <Image
                  src="/Galileo/walkinghallway2.png"
                  alt="Surgeon walking hallway with Galileo loupes"
                  width={1600}
                  height={600}
                  className="h-[260px] w-full object-cover lg:h-[340px]"
                />
                {/* Dark overlay reduced from ~70% to 40% */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-between px-6 lg:px-12">
                  <div className="max-w-xl space-y-1">
                    <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-300">
                      Built for real operators
                    </p>
                    <h3 className="text-lg lg:text-xl font-semibold text-white">
                      Precision optics that keep up with your cases.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
