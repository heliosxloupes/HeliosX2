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
        {/* TOP VIEWPORT: HERO + CONFIG */}
        <section className="w-full pt-6 pb-20 lg:pb-28">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 lg:flex-row lg:items-start lg:px-10 xl:px-16">
            {/* LEFT: HERO IMAGE + THUMBS */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <div className="relative w-full max-w-[900px] overflow-hidden rounded-[32px] bg-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
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

            {/* RIGHT: PRODUCT INFO + FRAME + CART */}
            <div className="flex w-full max-w-md flex-col gap-6 lg:max-w-sm xl:max-w-md">
              {/* Title + copy */}
              <div>
                <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500">
                  HeliosX · Galileo
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
                    {currentColorConfig.name && `· ${currentColorConfig.name}`}
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
                        —
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

        {/* TECHNICAL DETAILS + IMAGE STRIP (SECOND VIEWPORT) */}
        <section
          ref={techRef}
          className="border-t border-white/10 bg-black pb-24 pt-16"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 lg:px-10 xl:px-16">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="max-w-lg">
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Technical detail
                </p>
                <h2 className="text-xl font-semibold text-neutral-50 sm:text-2xl">
                  Galileo product specifications.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Designed for high-precision work where clarity, color
                  fidelity, and depth perception actually matter. Every Galileo
                  unit is tuned for long-case comfort and compatibility with
                  modern LED light systems.
                </p>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-5 text-xs text-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
                {/* Column 1 */}
                <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4">
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Core build
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.75rem]">
                    <li>Volume reduced by ~30% while maintaining performance.</li>
                    <li>Weight: 35g / 36g / 37g (2.5x / 3.0x / 3.5x).</li>
                    <li>Barrels: metal construction, tuned for durability.</li>
                    <li>Prescription compatible straight out of the box.</li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4">
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Optics &amp; glass
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.75rem]">
                    <li>A+ grade imported optical glass.</li>
                    <li>Multi-layer coated lenses, high color fidelity.</li>
                    <li>Transmittance &gt; 98% for bright, neutral images.</li>
                    <li>
                      Extra-wide field of view and generous depth of field for
                      stable focus.
                    </li>
                    <li>IPD range: 54—72 mm.</li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4">
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Magnification data
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.75rem]">
                    <li>
                      <span className="font-semibold">2.5x</span> — WD 300—580
                      mm, FOV 150—170 mm, DOF 200 mm.
                    </li>
                    <li>
                      <span className="font-semibold">3.0x</span> — WD 300—580
                      mm, FOV 130—150 mm, DOF 200 mm.
                    </li>
                    <li>
                      <span className="font-semibold">3.5x</span> — WD 300—580
                      mm, FOV 110—130 mm, DOF 200 mm.
                    </li>
                    <li>Compatible with fixed LED light sources and packs.</li>
                    <li>Bright, uniform spot with long-lasting illumination.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Image strip */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative h-52 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                <Image
                  src="/Galileo/cutegirlhallway.png"
                  alt="Surgeon walking to the OR"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-52 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                <Image
                  src="/Galileo/girlinmirror.png"
                  alt="Surgeon fitting loupes in mirror"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-52 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
                <Image
                  src="/Galileo/lockerroom.png"
                  alt="Locker room preparation with loupes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="relative overflow-hidden border-t border-white/10">
          <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-16 lg:px-10 xl:px-16">
            <div className="relative z-10 max-w-xl space-y-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Built for real operators
              </p>
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Designed in the OR, priced for reality.
              </h3>
              <p className="text-sm text-neutral-300">
                HeliosX exists because surgeons shouldn&apos;t have to choose
                between compromised tools and two months of rent. The work is
                demanding enough—the access should be too.
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="mt-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-100 backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black"
              >
                Back to top
              </button>
            </div>

            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/Walkinghallway2.png"
                alt="Surgeon hallway banner"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/90" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

