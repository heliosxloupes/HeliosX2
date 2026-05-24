"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { LenisProvider } from "@/components/lenis-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

gsap.registerPlugin(ScrollTrigger);

// ── Variants ──────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const clipReveal = {
  hidden: { clipPath: "inset(0 101% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)" },
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// ── Scroll progress bar ───────────────────────────────────────────────────────

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[1.5px] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, rgba(52,211,153,0.9), rgba(125,211,252,0.9), rgba(52,211,153,0.7))",
      }}
    />
  );
}

// ── Magnetic CTA wrapper ──────────────────────────────────────────────────────

function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.26);
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.26);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Parallax image container ──────────────────────────────────────────────────

function ParallaxImage({
  src,
  alt,
  containerClassName,
  children,
}: {
  src: string;
  alt: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName ?? ""}`}>
      <motion.div
        style={{ y, position: "absolute", top: "-6%", left: 0, right: 0, bottom: "-6%" }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-transparent text-white">
        <ScrollProgressBar />
        <Header />

        <main className="space-y-20 pb-16 md:space-y-28 md:pb-24">
          <HeroSection />
          <ManifestoSection />
          <HorizontalStorySection />

          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#050814] to-black">
              <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/18 blur-3xl" />
              <div className="absolute top-1/3 right-0 h-80 w-80 translate-x-1/4 rounded-full bg-sky-500/16 blur-3xl" />
              <div className="absolute bottom-[-140px] left-0 h-80 w-80 -translate-x-1/3 rounded-full bg-orange-400/14 blur-3xl" />
            </div>

            <ClaritySection />
            <FitSection />
            <StorySection />
            <CtaSection />
          </section>
        </main>
      </div>
    </LenisProvider>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section id="top" className="relative overflow-hidden bg-transparent">
      <div
        ref={heroWrapperRef}
        className="relative flex min-h-[100svh] items-end justify-center"
      >
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative min-h-[100svh] w-full overflow-hidden"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {/* Cursor-tracking light */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background: `radial-gradient(340px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,255,255,0.13), transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />

          {/* Hero image */}
          <div className="absolute inset-0">
            <Image
              src="/Apollo/Apollo3xFemale2.png"
              alt="Surgeon wearing HeliosX loupes in the OR"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Dark overlays */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,140,127,0.22),transparent_24%),linear-gradient(110deg,rgba(0,0,0,0.9)_14%,rgba(0,0,0,0.56)_46%,rgba(0,0,0,0.2)_72%,rgba(0,0,0,0.72)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Content */}
          <motion.div
            className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-8 pt-28 md:px-12 md:pb-12 md:pt-32"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr),minmax(260px,0.52fr)] md:items-end">

              {/* Left - headline block */}
              <div className="max-w-2xl space-y-6 md:space-y-7">

                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md"
                  variants={fadeIn}
                  transition={{ duration: 0.5 }}
                >
                  Ultra customizable - Worldwide shipping
                </motion.div>

                {/* H1 - line-by-line slide-up reveal */}
                <h1 className="max-w-4xl text-[clamp(3.1rem,8vw,7rem)] font-bold leading-[0.93] tracking-[-0.03em]">
                  <span style={{ overflow: "hidden", display: "block" }}>
                    <motion.span
                      style={{ display: "block" }}
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.78, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Surgical precision,
                    </motion.span>
                  </span>
                  <span style={{ overflow: "hidden", display: "block" }}>
                    <motion.span
                      style={{ display: "block" }}
                      className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent"
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.78, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    >
                      finally accessible.
                    </motion.span>
                  </span>
                </h1>

                {/* Subtext */}
                <motion.p
                  className="max-w-xl text-sm leading-6 text-neutral-200 md:text-base md:leading-7"
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: 0.55 }}
                >
                  Created for those who pursue mastery. Engineered for excellence,
                  with perfect focus in every detail.
                </motion.p>

                <motion.p
                  className="max-w-xl text-sm leading-6 text-neutral-300 md:text-base md:leading-7"
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: 0.65 }}
                >
                  No gate keeping. Just fair pricing. Elite quality made truly affordable.
                </motion.p>

                {/* CTAs with magnetic effect */}
                <motion.div
                  className="flex flex-wrap items-center gap-3 pt-1"
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: 0.75 }}
                >
                  <Link
                    href="/product"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200"
                  >
                    Shop HeliosX Loupes
                  </Link>
                  <Link
                    href="/education"
                    className="rounded-full border border-white/20 bg-black/20 px-5 py-3 text-sm font-medium text-neutral-100 backdrop-blur-sm transition-all duration-300 hover:border-white/35 hover:bg-white/10"
                  >
                    See the science
                  </Link>
                </motion.div>
              </div>

              {/* Right - floating info card */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="max-w-sm space-y-4 rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl md:ml-auto"
                  animate={{ y: [0, -9, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-400">
                      Ultra customizable
                    </p>
                    <p className="text-xs text-neutral-300">Worldwide shipping</p>
                  </div>
                  <p className="text-lg font-medium leading-7 text-neutral-50">
                    Designed for those who demand precision. Created for those who pursue mastery.
                  </p>
                  <div className="flex gap-6 text-sm text-neutral-300">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Starting at</p>
                      <p className="mt-1 text-xl font-semibold text-white">$499</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Fit support</p>
                      <p className="mt-1 text-sm text-neutral-200">Surgeon-informed guidance</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Manifesto ─────────────────────────────────────────────────────────────────

function ManifestoSection() {
  const pillars = [
    {
      label: "Access",
      body: "Precision should not depend on who can absorb an inflated price tag.",
    },
    {
      label: "Mastery",
      body: "Tools should support the craft, not distract from the field.",
    },
    {
      label: "Fair pricing",
      body: "Elite quality made truly affordable, without gatekeeping.",
    },
  ];

  return (
    <section id="manifesto" className="relative bg-transparent px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">

        <div className="space-y-5">
          <motion.p
            className="text-xs font-semibold tracking-[0.35em] text-neutral-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Manifesto
          </motion.p>

          <motion.h2
            className="max-w-2xl text-2xl font-bold leading-snug text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            WE REFUSE to accept that surgical optics must be overpriced,
            gatekept, or reserved for a select few.
          </motion.h2>

          {/* Body paragraphs - sequential reveal */}
          {[
            <>
              We reject the idea that clarity is a luxury. That precision belongs
              only to those who can absorb a five-figure price tag. That the tools
              we rely on for patient care should be engineered for margin first
              and mastery second.
            </>,
            <>
              HeliosX is built around a simple belief:{" "}
              <span className="font-medium text-neutral-100">skill thrives where access exists.</span>{" "}
              Elite optical quality, honest pricing, and designs shaped by real
              surgeons, not by corporate spreadsheets.
            </>,
            <>No gate keeping. Just fair pricing. Elite quality made truly affordable.</>,
          ].map((para, i) => (
            <motion.p
              key={i}
              className="max-w-xl text-sm text-neutral-300 md:text-base"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            >
              {para}
            </motion.p>
          ))}

          {/* 3D staggered pillar cards */}
          <motion.div
            className="grid gap-4 pt-2 text-sm text-neutral-200 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.label}
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.94 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{pillar.label}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-200">{pillar.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Parallax image */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ParallaxImage
            src="/Medusa/MedusaCaseOpen.png"
            alt="Medusa loupes in protective foam case"
            containerClassName="aspect-[4/5] rounded-[30px] border border-white/10 bg-neutral-900/60"
          >
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/65 to-transparent p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                HeliosX system
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-200">
                Elite optical quality, honest pricing, and designs shaped by real surgeons.
              </p>
            </div>
          </ParallaxImage>
        </motion.div>
      </div>
    </section>
  );
}

// ── Horizontal story ──────────────────────────────────────────────────────────

function HorizontalStorySection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const getMaxX = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getMaxX()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getMaxX()}`,
        onUpdate: (self) => setProgress(self.progress),
      });

      return () => { tween.kill(); };
    });

    return () => mm.revert();
  }, []);

  const panels = [
    {
      eyebrow: "Unmatched quality",
      title: "Unmatched Quality, Finally Affordable.",
      body: "HeliosX was created for those who pursue mastery: optical clarity, ergonomic comfort, and elite quality without the industry markup.",
      media: "/mainpagevideo2.mp4",
      type: "video" as const,
    },
    {
      eyebrow: "Engineered for excellence",
      title: "Perfect focus, every detail.",
      body: "Designed for those who demand precision. HeliosX keeps you locked in on the field that matters most: the operative field.",
      media: "/Newton/NewtonAsian2.png",
      type: "image" as const,
    },
    {
      eyebrow: "Built around you",
      title: "Form that follows function.",
      body: "Frames that fit your face. Working distances tailored to the way you operate. Optics tuned so your posture, not just your vision, feels better by the end of the case.",
      media: "/Apollo/Apollo3xFemale.png",
      type: "image" as const,
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-transparent" aria-label="HeliosX story panels">
      <div className="block md:h-[175vh]">
        <div className="relative overflow-hidden md:sticky md:top-16 md:h-[calc(100vh-4rem)]">

          {/* Progress bar */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden h-[2px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10 md:flex">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Panel counter */}
          <div className="pointer-events-none absolute bottom-6 right-8 z-10 hidden items-center gap-2 md:flex">
            {panels.map((_, i) => (
              <div
                key={i}
                className="h-[5px] rounded-full transition-all duration-500"
                style={{
                  width: progress * panels.length > i + 0.5 ? "20px" : "5px",
                  background: progress * panels.length > i + 0.5
                    ? "rgba(52,211,153,0.8)"
                    : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <div
            ref={trackRef}
            className="flex flex-col gap-5 px-4 md:h-full md:w-[300vw] md:flex-row md:gap-0 md:px-0 md:will-change-transform"
          >
            {panels.map((panel, index) => (
              <div key={panel.title} className="flex w-full shrink-0 items-center px-0 md:w-screen md:px-6">
                <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[30px] border border-white/10 bg-neutral-950/55 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-sm md:grid-cols-[1.1fr,0.9fr] md:gap-10 md:p-8">
                  <div className="order-2 flex flex-col justify-center space-y-4 md:order-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{panel.eyebrow}</p>
                    <h2 className="max-w-xl text-2xl font-bold tracking-tight md:text-4xl">{panel.title}</h2>
                    <p className="max-w-xl text-sm leading-7 text-neutral-300 md:text-base">{panel.body}</p>
                    {index === 2 && (
                      <div className="pt-2">
                        <Link
                          href="/product"
                          className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/35 hover:bg-white/16"
                        >
                          Explore frame options
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="order-1 md:order-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-white/10 bg-neutral-900/80 md:h-[70vh] md:aspect-auto">
                      {panel.type === "video" ? (
                        <video
                          src={panel.media}
                          className="h-full w-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <Image src={panel.media} alt={panel.title} fill className="object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Clarity ───────────────────────────────────────────────────────────────────

function ClaritySection() {
  const points = [
    {
      label: "Magnification",
      body: "Configurable magnification ranges tuned for plastics, hand, microsurgery, and general precision work.",
    },
    {
      label: "Depth and field",
      body: "Balanced depth of field that supports steady visualization without constant micro-adjustments.",
    },
    {
      label: "Coatings and contrast",
      body: "Anti-reflective coatings and high-quality glass help maintain contrast under OR lighting and headlights.",
    },
  ];

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="space-y-4">
          <motion.p
            className="text-xs font-semibold tracking-[0.3em] text-neutral-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Optical clarity
          </motion.p>
          <motion.h2
            className="text-2xl font-bold text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Engineered for sharp, confident{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
              visualization.
            </span>
          </motion.h2>
          {[
            "HeliosX optics are designed to give you a clear, stable view of the field, so you can trust what you're seeing when details are measured in millimeters.",
            "From skin closure to microsurgical work, our lenses balance magnification, depth of field, and working distance for real surgical workflows, not bench demos.",
          ].map((text, i) => (
            <motion.p
              key={i}
              className="max-w-2xl text-sm text-neutral-300 md:text-base"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
        >
          {points.map((point, index) => (
            <motion.div
              key={point.label}
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/12 bg-black/50 p-5 backdrop-blur-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {point.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-200 md:text-base">{point.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Fit ───────────────────────────────────────────────────────────────────────

function FitSection() {
  const pillars = [
    "Multiple frame styles: modern, hipster, vintage, classic.",
    "Material choices: ultra-light polymer or premium alloy metal.",
    "Magnification options from 2.5x to 6.0x for any procedure type.",
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr,1.15fr] md:items-center">

        {/* Parallax image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ParallaxImage
            src="/Galileo/girlinmirror.png"
            alt="Surgeon adjusting HeliosX loupes in mirror"
            containerClassName="aspect-[4/5] rounded-[30px] border border-white/10 bg-neutral-900/60"
          />
        </motion.div>

        <div className="space-y-5">
          <motion.p
            className="text-xs font-semibold tracking-[0.3em] text-neutral-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Customization
          </motion.p>
          <motion.h2
            className="text-2xl font-bold text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Built for every specialty. Tailored to every surgeon.
          </motion.h2>

          {[
            "No two surgeons operate the same way, and your loupes shouldn't force you into a template. HeliosX offers multiple frame styles, magnifications, and material options designed to fit your workflow, your anatomy, and your aesthetic.",
            "Choose from 2.5x to 6.0x magnification, lightweight plastic or premium metal frames, and designs ranging from modern minimalist to vintage-inspired. We tailor the system to you without charging you two months of rent for it.",
          ].map((text, i) => (
            <motion.p
              key={i}
              className="text-sm leading-7 text-neutral-300 md:text-base"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              {text}
            </motion.p>
          ))}

          <motion.div
            className="space-y-3 pt-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {pillars.map((pillar) => (
              <motion.div
                key={pillar}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-neutral-950/70 p-4"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                <p className="text-sm leading-6 text-neutral-200">{pillar}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Story ─────────────────────────────────────────────────────────────────────

function StorySection() {
  const paragraphs = [
    "HeliosX began with a simple realization shared by surgeons at every stage of training: the tools we rely on daily are treated like luxury goods instead of necessities.",
    "For decades, surgical optics have been locked behind inflated prices, outdated designs, and a business model that assumes surgeons will simply accept it. But we didn't.",
    "We watched residents delay buying loupes because rent mattered more. We saw medical students borrow gear because their budget had limits. We listened to attendings who had used the same outdated optics for years because upgrading felt irrational.",
    "The problem was never the craftsmanship. It was the gatekeeping.",
    "So we built an alternative.",
  ];

  return (
    <section
      id="story"
      className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#050814]/40 to-transparent"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <motion.p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Company
        </motion.p>

        <motion.h2
          className="text-2xl font-bold tracking-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          How HeliosX began.
        </motion.h2>

        {/* Sequential paragraph reveals */}
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            className="mt-5 text-sm leading-7 text-neutral-400 md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
          >
            {text}
          </motion.p>
        ))}

        <motion.p
          className="mt-8 text-sm text-neutral-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          - Founder
        </motion.p>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section id="cta" className="border-y border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1.3fr,0.95fr] md:items-center">
          <div>
            <motion.p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              At a glance
            </motion.p>
            <motion.h2
              className="text-2xl font-bold tracking-tight md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              HeliosX loupes, at a glance.
            </motion.h2>
            <motion.p
              className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400 md:text-base"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to know in one place: world-class optics,
              honest pricing, and a fitting process designed around real OR life.
            </motion.p>

            <motion.div
              className="mt-6 grid gap-4 text-sm text-neutral-200 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <BulletItem>Galilean optics with generous depth of field.</BulletItem>
              <BulletItem>Magnification options from 2.5x to 6.0x.</BulletItem>
              <BulletItem>Custom frame styles fitted to your anatomy.</BulletItem>
              <BulletItem>Lightweight builds that respect your posture.</BulletItem>
            </motion.div>
          </div>

          <motion.div
            className="space-y-4 rounded-[28px] border border-white/10 bg-neutral-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Starting at</p>
                <p className="mt-1 text-3xl font-bold">$499</p>
              </div>
              <div className="text-right text-xs text-neutral-500">
                <p>Transparent pricing.</p>
                <p>No upsell games.</p>
              </div>
            </div>

            <Link
              href="/product"
              className="flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_4px_20px_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              Shop HeliosX
            </Link>

            <p className="text-xs leading-6 text-neutral-500">
              Ultra customizable systems with worldwide shipping and surgeon-informed fitting support.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex items-start gap-2 text-xs text-neutral-300"
      variants={{
        hidden: { opacity: 0, x: -12 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
      <span>{children}</span>
    </motion.div>
  );
}

// Footer is now mounted globally via the root layout (see components/Footer/Footer.tsx).
