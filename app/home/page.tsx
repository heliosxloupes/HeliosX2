"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LenisProvider } from "@/components/lenis-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function HomePage() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-transparent text-white">
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

        <HeliosXFooter />
      </div>
    </LenisProvider>
  );
}

function HeroSection() {
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.86]);

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
            setCursorPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(320px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,255,255,0.16), transparent 72%)`,
              mixBlendMode: "screen",
            }}
          />

          <div className="absolute inset-0">
            <Image
              src="/Apollo/Apollo3xFemale2.png"
              alt="Surgeon wearing HeliosX loupes in the OR"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,140,127,0.22),transparent_24%),linear-gradient(110deg,rgba(0,0,0,0.9)_14%,rgba(0,0,0,0.56)_46%,rgba(0,0,0,0.2)_72%,rgba(0,0,0,0.72)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <motion.div
            className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-8 pt-28 md:px-12 md:pb-12 md:pt-32"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr),minmax(260px,0.52fr)] md:items-end">
              <motion.div
                className="max-w-2xl space-y-6 md:space-y-7"
                variants={fadeUp}
                transition={{ duration: 0.68, ease: "easeOut" }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-200 backdrop-blur-md"
                  variants={fadeIn}
                >
                  In stock · Ships in 3–5 business days
                </motion.div>

                <motion.h1
                  className="max-w-4xl text-[clamp(2.95rem,8vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.045em]"
                  variants={fadeUp}
                  transition={{ duration: 0.72, ease: "easeOut" }}
                >
                  Surgical precision,
                  <span className="block bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                    finally accessible.
                  </span>
                </motion.h1>

                <motion.p
                  className="max-w-xl text-sm leading-6 text-neutral-200 md:text-base md:leading-7"
                  variants={fadeUp}
                  transition={{ duration: 0.72, delay: 0.06, ease: "easeOut" }}
                >
                  Created for those who pursue mastery. Engineered for excellence,
                  with perfect focus in every detail.
                </motion.p>

                <motion.p
                  className="max-w-xl text-sm leading-6 text-neutral-300 md:text-base md:leading-7"
                  variants={fadeUp}
                  transition={{ duration: 0.72, delay: 0.09, ease: "easeOut" }}
                >
                  No gate keeping. Just fair pricing. Elite quality made truly
                  affordable.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-3 pt-1"
                  variants={fadeUp}
                  transition={{ duration: 0.72, delay: 0.12, ease: "easeOut" }}
                >
                  <Link
                    href="/product"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_40px_rgba(255,255,255,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200"
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
              </motion.div>

              <motion.div
                className="max-w-sm space-y-4 rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl md:ml-auto"
                variants={fadeUp}
                transition={{ duration: 0.72, delay: 0.18, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-400">
                    In stock
                  </p>
                  <p className="text-xs text-neutral-300">Ships in 3-5 business days</p>
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section id="manifesto" className="relative bg-transparent px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
        <motion.div
          className="space-y-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.35em] text-neutral-500">Manifesto</p>
          <h2 className="max-w-2xl text-2xl font-semibold leading-snug md:text-3xl">
            WE REFUSE to accept that surgical optics must be overpriced,
            gatekept, or reserved for a select few.
          </h2>
          <p className="max-w-xl text-sm text-neutral-300 md:text-base">
            We reject the idea that clarity is a luxury. That precision belongs
            only to those who can absorb a five-figure price tag. That the tools
            we rely on for patient care should be engineered for margin first
            and mastery second.
          </p>
          <p className="max-w-xl text-sm text-neutral-300 md:text-base">
            HeliosX is built around a simple belief:{" "}
            <span className="font-medium text-neutral-100">skill thrives where access exists.</span>{" "}
            Elite optical quality, honest pricing, and designs shaped by real
            surgeons, not by corporate spreadsheets.
          </p>
          <p className="max-w-xl text-sm text-neutral-300 md:text-base">
            No gate keeping. Just fair pricing. Elite quality made truly
            affordable.
          </p>
          <div className="grid gap-4 pt-2 text-sm text-neutral-200 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Access</p>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                Precision should not depend on who can absorb an inflated price tag.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Mastery</p>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                Tools should support the craft, not distract from the field.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Fair pricing</p>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                Elite quality made truly affordable, without gatekeeping.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-white/10 bg-neutral-900/60"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
        >
          <Image
            src="/hardcase1.png"
            alt="HeliosX loupes in protective hard case"
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
              HeliosX system
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-200">
              Elite optical quality, honest pricing, and designs shaped by real surgeons.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

      return () => {
        tween.kill();
      };
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
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10 md:flex">
            <div className="h-full rounded-full bg-white/70" style={{ width: `${progress * 100}%` }} />
          </div>

          <div ref={trackRef} className="flex flex-col gap-5 px-4 md:h-full md:w-[300vw] md:flex-row md:gap-0 md:px-0 md:will-change-transform">
            {panels.map((panel, index) => (
              <div key={panel.title} className="flex w-full shrink-0 items-center px-0 md:w-screen md:px-6">
                <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[30px] border border-white/10 bg-neutral-950/55 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-sm md:grid-cols-[1.1fr,0.9fr] md:gap-10 md:p-8">
                  <div className="order-2 flex flex-col justify-center space-y-4 md:order-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{panel.eyebrow}</p>
                    <h2 className="max-w-xl text-2xl font-semibold tracking-tight md:text-4xl">{panel.title}</h2>
                    <p className="max-w-xl text-sm leading-7 text-neutral-300 md:text-base">
                      {panel.body}
                    </p>
                    {index === 2 ? (
                      <div className="pt-2">
                        <Link
                          href="/product"
                          className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/35 hover:bg-white/16"
                        >
                          Explore frame options
                        </Link>
                      </div>
                    ) : null}
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
                        <Image
                          src={panel.media}
                          alt={panel.title}
                          fill
                          className="object-cover"
                        />
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
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">Optical clarity</p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-transparent">
              Engineered for sharp, confident visualization.
            </span>
          </h2>
          <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
            HeliosX optics are designed to give you a clear, stable view of the
            field, so you can trust what you&apos;re seeing when details are
            measured in millimeters.
          </p>
          <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
            From skin closure to microsurgical work, our lenses balance
            magnification, depth of field, and working distance for real
            surgical workflows, not bench demos.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          {points.map((point, index) => (
            <motion.div
              key={point.label}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
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

function FitSection() {
  const pillars = [
    "Multiple frame styles: modern, hipster, vintage, classic.",
    "Material choices: ultra-light polymer or premium alloy metal.",
    "Magnification options from 2.5x to 6.0x for any procedure type.",
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr,1.15fr] md:items-center">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-white/10 bg-neutral-900/60"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/Galileo/girlinmirror.png"
            alt="Surgeon adjusting HeliosX loupes in mirror"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          className="space-y-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">Customization</p>
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
            Built for every specialty. Tailored to every surgeon.
          </h2>
          <p className="text-sm leading-7 text-neutral-300 md:text-base">
            No two surgeons operate the same way, and your loupes shouldn&apos;t
            force you into a template. HeliosX offers multiple frame styles,
            magnifications, and material options designed to fit your workflow,
            your anatomy, and your aesthetic.
          </p>
          <p className="text-sm leading-7 text-neutral-300 md:text-base">
            Choose from 2.5x to 6.0x magnification, lightweight plastic or
            premium metal frames, and designs ranging from modern minimalist to
            vintage-inspired. We tailor the system to you without charging you
            two months of rent for it.
          </p>

          <div className="space-y-3 pt-2">
            {pillars.map((pillar) => (
              <div
                key={pillar}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-neutral-950/70 p-4"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                <p className="text-sm leading-6 text-neutral-200">{pillar}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#050814]/40 to-transparent"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <motion.div
        className="relative mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Company
        </p>
        <h2 className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
          How HeliosX began.
        </h2>
        <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
          HeliosX began with a simple realization shared by surgeons at every
          stage of training: the tools we rely on daily are treated like luxury
          goods instead of necessities.
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
          For decades, surgical optics have been locked behind inflated prices,
          outdated designs, and a business model that assumes surgeons will
          simply accept it. But we didn&apos;t.
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
          We watched residents delay buying loupes because rent mattered more.
          We saw medical students borrow gear because their budget had limits.
          We listened to attendings who had used the same outdated optics for
          years because upgrading felt irrational.
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
          The problem was never the craftsmanship. It was the gatekeeping.
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
          So we built an alternative.
        </p>
        <p className="mt-8 text-sm text-neutral-300">- Founder</p>
      </motion.div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="cta" className="border-y border-white/10">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid gap-10 md:grid-cols-[1.3fr,0.95fr] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              At a glance
            </p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              HeliosX loupes, at a glance.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400 md:text-base">
              Everything you need to know in one place: world-class optics,
              honest pricing, and a fitting process designed around real OR
              life.
            </p>

            <div className="mt-6 grid gap-4 text-sm text-neutral-200 md:grid-cols-2">
              <BulletItem>Galilean optics with generous depth of field.</BulletItem>
              <BulletItem>Magnification options from 2.5x to 6.0x.</BulletItem>
              <BulletItem>Custom frame styles fitted to your anatomy.</BulletItem>
              <BulletItem>Lightweight builds that respect your posture.</BulletItem>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-4 rounded-[28px] border border-white/10 bg-neutral-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Starting at</p>
                <p className="mt-1 text-3xl font-semibold">$499</p>
              </div>
              <div className="text-right text-xs text-neutral-500">
                <p>Transparent pricing.</p>
                <p>No upsell games.</p>
              </div>
            </div>

            <Link
              href="/product"
              className="flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              Shop HeliosX
            </Link>

            <p className="text-xs leading-6 text-neutral-500">
              In stock. Ships in 3-5 business days with surgeon-informed fitting support.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-neutral-300">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
      <span>{children}</span>
    </div>
  );
}

function HeliosXFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-transparent px-4 py-12 md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/Walkinghallway2.png"
          alt="Surgeon walking through hallway"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/90" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <p className="text-sm font-semibold text-neutral-100">HeliosX</p>
            <p className="text-sm text-neutral-300">
              Surgical loupes designed by surgeons, for surgeons - bringing elite
              optical performance to more operators through honest, transparent pricing.
            </p>
            <p className="text-xs text-neutral-400">
              Need guidance on frames, magnification, or fitting? Our team answers within one business day.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm text-neutral-200">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Explore</p>
              <div className="space-y-2">
                <Link href="/product" className="block text-neutral-200 transition hover:text-white">Products</Link>
                <Link href="/education" className="block text-neutral-200 transition hover:text-white">Education</Link>
                <Link href="/faq" className="block text-neutral-200 transition hover:text-white">FAQ</Link>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Company</p>
              <div className="space-y-2">
                <a href="#story" className="block text-neutral-200 transition hover:text-white">Our story</a>
                <Link href="/cart" className="block text-neutral-200 transition hover:text-white">Cart</Link>
                <Link href="/checkout" className="block text-neutral-200 transition hover:text-white">Checkout</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>Engineered for excellence. Perfect focus, every detail.</p>
          <p>&copy; {new Date().getFullYear()} HeliosX</p>
        </div>
      </div>
    </footer>
  );
}
