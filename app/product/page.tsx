"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Microscope } from "lucide-react";
import Noise from "@/components/Noise";
import Header from "@/components/Header";
import OrderingInfoSection from "@/components/OrderingInfoSection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export default function ProductPage() {
  return (
    <>
      <Header />
      <main className="bg-transparent pt-20 text-white min-h-screen md:pt-24">
        <ProductLineupHeader />
        <OurLoupesGrid />
        <OrderingInfoSection />
        <section className="px-4 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto grid max-w-6xl gap-4 border-t border-white/10 pt-8 text-sm text-neutral-300 md:grid-cols-4">
            <Link href="/prismatic-loupes" className="transition hover:text-white">
              Prismatic loupes
            </Link>
            <Link href="/ergonomic-loupes" className="transition hover:text-white">
              Ergonomic loupes
            </Link>
            <Link href="/affordable-loupes" className="transition hover:text-white">
              Affordable loupes
            </Link>
            <Link href="/best-loupes" className="transition hover:text-white">
              Best loupes guide
            </Link>
            <Link href="/loupe-comparisons" className="transition hover:text-white">
              Compare brands
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

/* --------------------------------------------- */
/*  PAGE HEADER - replaces the old parallax hero */
/* --------------------------------------------- */

function ProductLineupHeader() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-10 md:px-8 md:pb-16 md:pt-16">
      {/* ambient accent glows — premium depth without heavy imagery */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -top-28 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-emerald-500/12 blur-[130px]" />
        <span className="absolute right-[-120px] top-1/4 h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[130px]" />
        <span className="absolute bottom-[-100px] left-[-100px] h-[320px] w-[320px] rounded-full bg-amber-400/10 blur-[130px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative mx-auto max-w-4xl text-center"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200/80"
        >
          The HeliosX lineup
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl"
        >
          Choose the system that
          <br className="hidden md:block" /> matches your{" "}
          <span className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
            work.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-300 md:text-base"
        >
          Five ergonomic and lightweight loupe systems — every pair built around your own
          measurements. Published pricing, direct to clinician, no gatekeeping.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------- */
/*  OUR LOUPES GRID - 5 CARDS                    */
/* --------------------------------------------- */

function OurLoupesGrid() {
  const [cmsProducts, setCmsProducts] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((payload) => {
        if (!Array.isArray(payload?.products)) return;
        setCmsProducts(payload.products.map((product: any) => ({
          slug: product.slug,
          name: product.shortName,
          magnification: (product.magnifications ?? []).join(' / '),
          basePrice: product.basePrice,
          tagline: product.cardTagline,
          bullets: product.cardBullets ?? [],
          highlight: product.cardHighlight,
          imageSrc: product.cardImageSrc,
          imageAlt: product.cardImageAlt,
          imagePosition: product.slug === 'medusa' ? '34% center' : product.imagePosition,
        })));
      })
      .catch(() => setCmsProducts(null));
  }, []);

  // Helper function to get glow color for each product
  const getGlowColor = (slug: string) => {
    switch (slug) {
      case 'galileo':
        return '56,189,248'; // Sky blue
      case 'newton':
        return '16,185,129'; // Emerald
      case 'apollo':
        return '255,157,0'; // Orange
      case 'kepler':
        return '139,92,246'; // Purple
      case 'medusa':
        return '234,179,8'; // Amber
      default:
        return '56,189,248';
    }
  };

  const products = [
    {
      slug: "medusa",
      name: "Medusa",
      magnification: "3.0x / 4.0x / 5.0x",
      basePrice: 710,
      tagline: "Ergonomic prismatic loupes with adjustable working distance.",
      bullets: [
        "Ergonomic prismatic optics",
        "300-600 mm working distance",
        "Tailored fixed IPD",
      ],
      highlight: "Best for posture-flexible precision work.",
      imageSrc: "/Medusa/MedusaMain.png",
      imageAlt: "HeliosX Medusa loupes product image",
      imagePosition: "34% center",
    },
    {
      slug: "apollo",
      name: "Apollo",
      magnification: "3.0x / 4.0x / 5.0x / 6.0x",
      basePrice: 740,
      tagline: "Ergonomic prismatic clarity for detail-obsessed operators.",
      bullets: [
        "Ergonomic prismatic optics",
        "Increased working precision",
        "Ergonomic frame options",
      ],
      highlight: "Best for fine aesthetic & micro-oriented work.",
      imageSrc: "/Apollo/ApollomainProduct(Notext).png",
      imageAlt: "HeliosX Apollo loupes product image",
    },
    {
      slug: "galileo",
      name: "Galileo",
      magnification: "2.5x / 3.0x / 3.5x",
      basePrice: 270,
      tagline: "Versatile field of view for general and reconstructive work.",
      bullets: ["Lightweight", "Modern frame geometry", "Everyday precision"],
      highlight: "Best for broad use and training.",
      imageSrc: "/Galileo/GalileoMainProduct(notext).png",
      imageAlt: "HeliosX Galileo loupes product image",
    },
    {
      slug: "newton",
      name: "Newton",
      magnification: "2.5x / 3.0x / 3.5x",
      basePrice: 270,
      tagline: "Ultra-light performance for long cases and full OR days.",
      bullets: ["Ultra-light chassis", "Comfort-driven design", "Low fatigue"],
      highlight: "Best when comfort is critical.",
      imageSrc: "/Newton/NewtonMainProduct(notext).png",
      imageAlt: "HeliosX Newton loupes product image",
    },
    {
      slug: "kepler",
      name: "Kepler",
      magnification: "4.0x / 5.0x / 6.0x",
      basePrice: 460,
      tagline: "Maximal magnification for demanding micro and super-micro.",
      bullets: [
        "Signature optical stack",
        "Upgraded contrast & resolution",
        "Designed for advanced users",
      ],
      highlight: "Best for high-level microsurgery.",
      imageSrc: "/Keppler/KepplerMainProduct(Notext).png",
      imageAlt: "HeliosX Kepler loupes product image",
    },
  ];
  const displayedProducts = cmsProducts ?? products;

  return (
    <section className="bg-transparent px-4 pb-16 pt-2 md:px-8 md:pb-24 md:pt-2">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6"
        >
          {displayedProducts.map((product) => {
            const glow = getGlowColor(product.slug);
            return (
            <motion.div
              key={product.slug}
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative flex h-full"
            >
              <Link
                href={`/product/${product.slug}`}
                className="group/card relative flex h-full w-full flex-col rounded-2xl border border-white/10 bg-neutral-900/70 overflow-hidden transition-colors duration-300 ease-out hover:border-white/30"
                style={{
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  transition: 'box-shadow 0.3s ease-out, border-color 0.3s ease-out'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const glowColor = getGlowColor(product.slug);
                  e.currentTarget.style.boxShadow = `0 0 50px rgba(${glowColor}, 0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                }}
              >
                {/* Enhanced glow effect on hover - variant colors per product */}
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(${getGlowColor(product.slug)}, 0.12), transparent 60%)`,
                    opacity: 0.5
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(${getGlowColor(product.slug)}, 0.3), transparent 50%)`
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, transparent, rgba(${getGlowColor(product.slug)}, 0.1))`
                  }}
                />
                <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-neutral-900">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    className="origin-bottom object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: product.imagePosition ?? "center" }}
                  />
                  <div className="absolute inset-0 pointer-events-none z-10 mix-blend-mode-overlay opacity-100">
                    <Noise
                      patternSize={250}
                      patternScaleX={1}
                      patternScaleY={1}
                      patternRefreshInterval={2}
                      patternAlpha={5}
                    />
                  </div>
                  {/* fade the image into the card body so it isn't a hard seam.
                      Opaque at the bottom + extra height so the hover-zoom never
                      pushes a bright edge into the seam. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-neutral-900 via-neutral-900/55 to-transparent" />
                  {/* tinted wash in the product's accent color on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 z-[9] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{ background: `linear-gradient(to top, rgba(${glow},0.22), transparent 55%)` }}
                  />
                  {['medusa', 'apollo'].includes(product.slug) && (
                    <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/55 bg-black/70 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.35)] backdrop-blur-md">
                      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-emerald-200/70 bg-emerald-400/15">
                        <span className="absolute h-2 w-[2px] rounded-full bg-emerald-200" />
                        <span className="absolute h-1.5 w-1.5 translate-x-[3px] -translate-y-[3px] rounded-full border border-emerald-200/80" />
                      </span>
                      Ergonomic
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-semibold">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Microscope
                      className="h-3.5 w-3.5 shrink-0"
                      strokeWidth={2}
                      style={{ color: `rgb(${glow})` }}
                      aria-hidden="true"
                    />
                    <span className="text-xs md:text-sm font-medium text-neutral-400">
                      {product.magnification}
                    </span>
                  </div>
                  {/* accent divider in the product's color */}
                  <div
                    className="mt-3 h-px w-full"
                    style={{ background: `linear-gradient(to right, rgba(${glow},0.55), transparent)` }}
                  />

                  <p className="mt-4 min-h-[3.5rem] text-sm md:text-base text-neutral-200 leading-relaxed">
                    {product.tagline}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {product.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs md:text-sm">
                        <Check
                          className="mt-[2px] h-3.5 w-3.5 shrink-0"
                          strokeWidth={3}
                          style={{ color: `rgb(${glow})` }}
                          aria-hidden="true"
                        />
                        <span
                          className={
                            product.slug === 'medusa' && i === 0
                              ? 'font-semibold text-emerald-200'
                              : 'text-neutral-300'
                          }
                        >
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto space-y-3 pt-5">
                    {/* highlight as an accent callout */}
                    <div
                      className="rounded-r-md border-l-2 bg-white/[0.03] py-1.5 pl-3 pr-2 text-xs md:text-sm text-neutral-300"
                      style={{ borderColor: `rgb(${glow})` }}
                    >
                      {product.highlight}
                    </div>

                    {typeof product.basePrice === 'number' ? (
                      <div
                        className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-sm transition-colors duration-300 group-hover/card:border-white/25"
                        style={{
                          boxShadow: `inset 0 0 0 1px rgba(${getGlowColor(product.slug)}, 0.14), 0 0 18px -10px rgba(${getGlowColor(product.slug)}, 0.45)`,
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover/card:opacity-100"
                          style={{
                            background: `radial-gradient(ellipse at top left, rgba(${getGlowColor(product.slug)}, 0.18), transparent 75%)`,
                          }}
                        />
                        <div className="relative flex items-baseline justify-between gap-2">
                          <span className="whitespace-nowrap text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            From
                          </span>
                          <span
                            className="whitespace-nowrap text-sm font-semibold text-white"
                            style={{
                              textShadow: `0 0 14px rgba(${getGlowColor(product.slug)}, 0.5)`,
                            }}
                          >
                            ${product.basePrice.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/product/${product.slug}`;
                      }}
                      className="w-full rounded-full border border-white/35 px-3 py-1.5 text-[0.7rem] font-semibold text-neutral-50 transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                    >
                      Select {product.name}
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
