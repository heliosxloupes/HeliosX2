"use client";

import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Noise from "@/components/Noise";
import Header from "@/components/Header";
import OrderingInfoSection from "@/components/OrderingInfoSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductPage() {
  return (
    <>
      <Header />
      <main className="bg-transparent pt-20 text-white min-h-screen md:pt-24">
        <div className="hidden md:block">
          <ParallaxProductHero />
        </div>
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
/*  PARALLAX HERO - GSAP SCROLLTRIGGER LAYERS    */
/* --------------------------------------------- */

function ParallaxProductHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const layeredImageSectionRef = useRef<HTMLDivElement | null>(null);
  const basexImageRef = useRef<HTMLDivElement | null>(null);
  const basex1ImageRef = useRef<HTMLDivElement | null>(null);
  const basex2ImageRef = useRef<HTMLDivElement | null>(null);
  const basex3ImageRef = useRef<HTMLDivElement | null>(null);
  const basex4ImageRef = useRef<HTMLDivElement | null>(null);
  const logoContainerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (
        layeredImageSectionRef.current &&
        basexImageRef.current &&
        basex1ImageRef.current &&
        basex2ImageRef.current &&
        basex3ImageRef.current &&
        basex4ImageRef.current
      ) {
        gsap.to(basexImageRef.current, {
          y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2.0,
          },
        });

        gsap.to(basex4ImageRef.current, {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.8,
          },
        });

        gsap.to(basex3ImageRef.current, {
          y: -59,
          ease: "none",
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to(basex2ImageRef.current, {
          y: -83,
          ease: "none",
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(basex1ImageRef.current, {
          y: -106,
          ease: "none",
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        });

        if (logoContainerRef.current) {
          gsap.to(logoContainerRef.current, {
            y: -200,
            ease: "none",
            scrollTrigger: {
              trigger: layeredImageSectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        if (textContainerRef.current) {
          gsap.to(textContainerRef.current, {
            y: -150,
            ease: "none",
            scrollTrigger: {
              trigger: layeredImageSectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.0,
            },
          });
        }
      }
    });

    return () => {
      mm.revert();
    };
  }, []);


  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-transparent pb-20 pt-24 md:pb-32 md:pt-28"
    >
      {/* Parallax layers spanning full viewport width */}
      <div ref={layeredImageSectionRef} className="pointer-events-none absolute inset-0 w-full">
        <div className="relative h-[300px] w-full md:h-[460px] lg:h-[520px]">
          {/* Tronaeast-style fade overlay - blends into background */}
          <div className="absolute inset-0 z-[11] pointer-events-none bg-gradient-to-b from-transparent via-transparent via-60% via-[rgba(0,0,0,0.2)] via-75% via-[rgba(0,0,0,0.5)] via-85% via-[rgba(0,0,0,0.8)] via-92% to-black" />

          {/* Base background layer - basex */}
          <div
            ref={basexImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 0 }}
          >
            <Image
              src="/basex.png"
              alt="HeliosX base optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* Layer 4 - basex4.5 */}
          <div
            ref={basex4ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 1 }}
          >
            <Image
              src="/basex4.5.png"
              alt="HeliosX 4.5x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* Layer 3 - basex3.5 */}
          <div
            ref={basex3ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 2 }}
          >
            <Image
              src="/base3.5x.png"
              alt="HeliosX 3.5x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* HeliosX Logo Container - positioned at the very top layer (above all overlays) */}
          <div
            ref={logoContainerRef}
            className="absolute top-[15%] left-[2rem] pointer-events-none will-change-transform"
            style={{ zIndex: 12 }}
          >
            <div className="flex flex-col items-start gap-0">
              <Image
                src="/upscaledlogo.png"
                alt="HeliosX Logo"
                width={300}
                height={300}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                quality={100}
                style={{
                  width: "auto",
                  height: "200px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          {/* basex2 - Middle-top parallax layer */}
          <div
            ref={basex2ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 3 }}
          >
            <Image
              src="/basex2.png"
              alt="HeliosX 2x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* basex1 - Top parallax layer (highest, most bottom of image visually) */}
          <div
            ref={basex1ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 4 }}
          >
            <Image
              src="/basex1.png"
              alt="HeliosX primary optical configuration"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
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
          </div>
        </div>
      </div>

      {/* Text content over the parallax layers */}
      <div className="relative z-10 px-4 md:px-8">
        <div className="mx-auto flex h-[300px] max-w-6xl items-center md:h-[460px] lg:h-[520px]">
          <div
            ref={textContainerRef}
            className="ml-1 will-change-transform md:-ml-12 lg:-ml-20"
          >
            <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
              Choose the HeliosX system
              <br />
              that matches your work.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  OUR LOUPES GRID - 4 CARDS HORIZONTAL         */
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
    <section className="bg-transparent px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-0">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            OUR LOUPES
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Five systems. One premium standard.
          </h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 items-stretch md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group relative flex h-full"
            >
              <Link
                href={`/product/${product.slug}`}
                className="group/card relative flex h-full w-full flex-col rounded-2xl border border-white/10 bg-neutral-900/70 overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/30"
                style={{
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  transition: 'all 0.3s ease-out'
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
                <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-neutral-950">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <div className="space-y-3">
                    <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-400 font-medium">
                      {product.magnification}
                    </p>
                  </div>

                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {product.tagline}
                    </p>

                    <ul className="min-h-[6.75rem] space-y-1.5 pt-2">
                    {product.bullets.map((bullet: string, i: number) => (
                      <li
                        key={i}
                        className={`flex items-start text-xs md:text-sm ${
                          product.slug === 'medusa' && i === 0
                            ? 'font-semibold text-emerald-200'
                            : 'text-neutral-400'
                        }`}
                      >
                        <span className="mr-2 shrink-0 text-neutral-500">-</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                    </ul>
                  </div>

                  <div className="mt-auto space-y-3 pt-3">
                    <p className="text-xs md:text-sm text-neutral-500 italic border-t border-white/5 pt-3">
                      {product.highlight}
                    </p>

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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
