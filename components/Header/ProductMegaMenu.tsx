'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { magnificationPriceByProduct } from '@/lib/pricing'

const lineup = [
  { slug: 'medusa', name: 'Medusa', type: 'Ergonomic prismatic', note: 'Adjustable distance', image: '/Medusa/MedusaMain.png' },
  { slug: 'apollo', name: 'Apollo', type: 'Ergonomic prismatic', note: 'Posture-aware viewing', image: '/Apollo/ApollomainProduct(Notext).png' },
  { slug: 'kepler', name: 'Kepler', type: 'Conventional prismatic', note: 'Higher magnification', image: '/Keppler/KepplerMainProduct(Notext).png' },
  { slug: 'galileo', name: 'Galileo', type: 'Galilean', note: 'Lightweight everyday', image: '/Galileo/GalileoMainProduct(notext).png' },
  { slug: 'newton', name: 'Newton', type: 'Galilean', note: 'Our entry model', image: '/Newton/NewtonMainProduct(notext).png' },
].map((product) => {
  const table = magnificationPriceByProduct[product.slug]
  const mags = Object.keys(table)
  return {
    ...product,
    range: `${mags[0]}–${mags[mags.length - 1]}`,
    from: Math.min(...Object.values(table)),
  }
})

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const ease = [0.22, 0.61, 0.36, 1] as const

type Props = {
  open: boolean
  top: number
  onNavigate: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function ProductMegaMenu({ open, top, onNavigate, onMouseEnter, onMouseLeave }: Props) {
  const [focused, setFocused] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <div
      style={{ top }}
      className="pointer-events-none fixed inset-x-0 z-[49] hidden px-4 md:block lg:px-10 xl:px-16"
    >
    <AnimatePresence>
      {open && (
        <motion.div
          key="product-menu"
          id="product-menu"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0 round 0 0 28px 28px)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 0 0 28px 28px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0 round 0 0 28px 28px)' }}
          transition={{ duration: 0.42, ease }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="pointer-events-auto relative mx-auto max-w-[1400px] overflow-hidden rounded-b-[28px] border border-t-0 border-white/10 bg-[#060A12]/70 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150"
        >
            {/* glass edge light */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#48CFC8]/40 to-transparent" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-[#17B08F]/[0.07] blur-3xl" />

            <ul
              className="relative grid grid-cols-5 gap-2 p-3"
              onMouseLeave={() => setFocused(null)}
            >
              {lineup.map((product, index) => {
                const dimmed = focused !== null && focused !== product.slug
                return (
                  <motion.li
                    key={product.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.06 + index * 0.045, ease }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={onNavigate}
                      onMouseEnter={() => setFocused(product.slug)}
                      onFocus={() => setFocused(product.slug)}
                      className="group relative flex h-full flex-col rounded-[20px] border border-transparent p-3 outline-none transition-[background-color,border-color] duration-300 hover:border-white/10 hover:bg-white/[0.045] focus-visible:border-[#48CFC8]/50 focus-visible:bg-white/[0.045]"
                    >
                      <div
                        className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-[filter,opacity] duration-500"
                        style={{ filter: dimmed ? 'blur(2.5px)' : 'blur(0px)', opacity: dimmed ? 0.5 : 1 }}
                      >
                        <Image
                          src={product.image}
                          alt={`HeliosX ${product.name} loupes`}
                          fill
                          sizes="240px"
                          className="object-contain p-2 scale-[1.32] transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.42]"
                        />
                      </div>

                      <div
                        className="mt-3 px-1 transition-opacity duration-500"
                        style={{ opacity: dimmed ? 0.55 : 1 }}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[0.95rem] font-semibold tracking-[0.08em] text-neutral-50">
                            {product.name}
                          </span>
                          <span className="text-[0.7rem] tabular-nums text-neutral-400">{product.range}</span>
                        </div>
                        <p className="mt-1 min-h-[2.6em] text-[0.65rem] font-medium uppercase leading-[1.3] tracking-[0.16em] text-[#48CFC8]/80 xl:min-h-0">
                          {product.type}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2 border-t xl:mt-3 border-white/[0.07] pt-2.5">
                          <span className="hidden truncate text-[0.72rem] text-neutral-400 xl:inline">{product.note}</span>
                          <span className="shrink-0 whitespace-nowrap text-[0.72rem] tabular-nums text-neutral-200">From {usd(product.from)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            <div className="relative flex items-center justify-between border-t border-white/[0.07] px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em]">
              <span className="text-neutral-500">Published prices. Measurements reviewed before production.</span>
              <div className="flex items-center gap-6">
                <Link href="/loupe-comparisons" onClick={onNavigate} className="text-neutral-400 transition-colors hover:text-white">
                  Compare models
                </Link>
                <Link href="/product" onClick={onNavigate} className="group inline-flex items-center gap-2 text-neutral-100 transition-colors hover:text-[#48CFC8]">
                  View all loupes
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
