'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { CINEMATIC } from './cinematic.config'
import styles from './CinematicIntro.module.css'

type Props = {
  /** Called once the intro is dismissed (Start/Skip) or skipped on gate. */
  onComplete?: () => void
}

// 2nd-section lineup — mirrors the homepage LineupSection (real product imagery).
const LINEUP = [
  { slug: 'medusa', name: 'Medusa', image: '/Medusa/MedusaCaseOpen.png', price: '$710+', badge: 'Prismatic Ergonomics', copy: 'Ergonomic prismatic with adjustable working distance — 3.0x to 8.5x.' },
  { slug: 'apollo', name: 'Apollo', image: '/Apollo/Apollo3xFemale2.png', price: '$740+', badge: 'Prismatic Ergonomics', copy: 'Ergonomic prismatic, fixed working distance — 3.0x to 6.0x.' },
  { slug: 'galileo', name: 'Galileo', image: '/Galileo/BlackguyGalileo.png', price: '$270+', badge: 'Universal', copy: 'Lightweight affordable daily-use Galilean — 2.5x to 3.5x.' },
  { slug: 'kepler', name: 'Kepler', image: '/Keppler/KepplerMain.png', price: '$460+', badge: 'Microsurgery', copy: 'High-magnification surgical and microsurgery — 4.0x to 6.0x.' },
  { slug: 'newton', name: 'Newton', image: '/Newton/NewtonAsian2.png', price: '$270+', badge: 'Everyday', copy: 'Ultra-light long-day comfort — 2.5x to 3.5x.' },
] as const

/**
 * Homepage scroll-cinematic intro. Renders as a fixed full-viewport overlay on
 * top of the (server-rendered) homepage. Scroll scrubs a pre-rendered frame
 * sequence; a Start button dismisses the overlay to reveal the homepage.
 *
 * Gating: only plays on first visit per browser (localStorage). Skipped on
 * reduced-motion and small/touch viewports (those land straight on the page),
 * which protects mobile LCP and respects motion preferences.
 *
 * SEO-safe: this is a client-only enhancement that renders null on the server,
 * so crawlers and Core Web Vitals see the real homepage underneath.
 */
export default function CinematicIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<'init' | 'playing' | 'done'>('init')

  const scrollerRef = useRef<HTMLDivElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const [muted, setMuted] = useState(false)

  const finish = useCallback(() => {
    const overlay = overlayRef.current
    const done = () => {
      document.body.style.overflow = ''
      try {
        localStorage.setItem(CINEMATIC.seenKey, '1')
      } catch {}
      // nudge the homepage's Lenis/layout to recalc now that it's visible
      window.dispatchEvent(new Event('resize'))
      window.scrollTo(0, 0)
      setPhase('done')
      onComplete?.()
    }
    const audio = audioRef.current
    if (audio) gsap.to(audio, { volume: 0, duration: 0.6, onComplete: () => audio.pause() })
    if (overlay) {
      gsap.to(overlay, { opacity: 0, duration: 0.7, ease: 'power2.inOut', onComplete: done })
    } else {
      done()
    }
  }, [onComplete])

  // --- Gate: decide whether to show at all (client only) ---
  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(CINEMATIC.seenKey) === '1'
    } catch {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 820px)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    if (seen || reduced || small || coarse) {
      // Skip — land straight on the homepage. Mark seen so it doesn't retry.
      try {
        localStorage.setItem(CINEMATIC.seenKey, '1')
      } catch {}
      setPhase('done')
      onComplete?.()
      return
    }
    setPhase('playing')
  }, [onComplete])

  // --- Setup once we're playing: lock scroll, preload frames, wire GSAP ---
  useEffect(() => {
    if (phase !== 'playing') return

    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const images: HTMLImageElement[] = []
    imagesRef.current = images

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      drawFrame(currentFrameRef.current)
    }

    const drawFrame = (index: number) => {
      const img = images[index]
      if (!img || !img.complete) return
      currentFrameRef.current = index
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    let loaded = 0
    const preload = () =>
      new Promise<void>((resolve) => {
        for (let i = 1; i <= CINEMATIC.frameCount; i++) {
          const img = new Image()
          img.onload = img.onerror = () => {
            loaded++
            if (i === 1) {
              resizeCanvas()
              drawFrame(0)
            }
            if (loaded === CINEMATIC.frameCount) resolve()
          }
          img.src = CINEMATIC.framePath(i)
          images[i - 1] = img
        }
      })

    // Audio: quieter, starts on first user gesture (autoplay-with-sound is blocked)
    const audio = audioRef.current
    if (audio) {
      audio.volume = CINEMATIC.audioVolume
      const startAudio = () => {
        if (!muted) audio.play().catch(() => {})
      }
      audio.play().catch(() => {
        const opts = { once: true as const, passive: true as const }
        scrollerRef.current?.addEventListener('scroll', startAudio, opts)
        window.addEventListener('pointerdown', startAudio, { once: true })
        window.addEventListener('wheel', startAudio, opts)
        window.addEventListener('touchstart', startAudio, opts)
      })
    }

    let gctx: gsap.Context | undefined
    let killResize: (() => void) | undefined

    preload().then(() => {
      gsap.registerPlugin(ScrollTrigger)
      const scroller = scrollerRef.current!

      gctx = gsap.context(() => {
        const frameState = { f: 0 }

        // Core scrub: runway progress -> frame index
        gsap.to(frameState, {
          f: CINEMATIC.frameCount - 1,
          ease: 'none',
          scrollTrigger: {
            scroller,
            trigger: runwayRef.current!,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.width = self.progress * 100 + '%'
            },
          },
          onUpdate: () => drawFrame(Math.round(frameState.f)),
        })

        // Intro headline lifts away over the first ~12%
        gsap.to(`.${styles.intro}`, {
          opacity: 0,
          y: -40,
          ease: 'power2.out',
          scrollTrigger: { scroller, trigger: runwayRef.current!, start: 'top top', end: '12% top', scrub: true },
        })
        // Scroll hint fades almost immediately
        gsap.to(`.${styles.hint}`, {
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: { scroller, trigger: runwayRef.current!, start: 'top top', end: '5% top', scrub: true },
        })

        // Caption — premium word reveal, finishes by 76% (dwell before Start)
        const capTL = gsap.timeline({
          scrollTrigger: { scroller, trigger: runwayRef.current!, start: '60% top', end: '76% top', scrub: 0.6 },
        })
        capTL
          .fromTo(`.${styles.captionLabel}`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 })
          .to(`.${styles.word} > span`, { y: '0%', filter: 'blur(0px)', opacity: 1, ease: 'power3.out', duration: 0.5, stagger: 0.13 }, '-=0.1')

        // The 2nd section rises over the cinematic (CSS gradient/overlap handles
        // the dissolve). Reveal its hero + lineup as they scroll into view —
        // the Start button lives in this section.
        gsap.from(`.${styles.hero} > *`, {
          opacity: 0,
          y: 24,
          ease: 'power2.out',
          duration: 0.7,
          stagger: 0.08,
          scrollTrigger: { scroller, trigger: `.${styles.hero}`, start: 'top 80%' },
        })
        gsap.fromTo(
          `.${styles.card}`,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.7,
            stagger: 0.1,
            scrollTrigger: { scroller, trigger: `.${styles.lineupGrid}`, start: 'top 82%' },
          },
        )

        ScrollTrigger.refresh()
      }, overlayRef)

      window.addEventListener('resize', resizeCanvas)
      killResize = () => window.removeEventListener('resize', resizeCanvas)
    })

    resizeCanvas()

    return () => {
      gctx?.revert()
      killResize?.()
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    setMuted(next)
    if (next) audio.pause()
    else audio.play().catch(() => {})
  }

  if (phase !== 'playing') return null

  return (
    <div className={styles.overlay} ref={overlayRef} aria-label="HeliosX intro">
      <div className={styles.progress} ref={progressRef} />

      <button className={styles.sound} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} type="button">
        {muted ? '♪̷' : '♪'}
      </button>

      <div className={styles.scroller} ref={scrollerRef} data-lenis-prevent>
        <div className={styles.runway} ref={runwayRef} style={{ height: `${CINEMATIC.runwayVh}vh` }}>
          <div className={styles.stage} ref={stageRef}>
            <canvas className={styles.canvas} ref={canvasRef} />

            <div className={styles.intro}>
              <div className={styles.brand}>Clarity without compromise.</div>
            </div>

            <div className={styles.caption}>
              <div className={styles.captionLabel}>HeliosX Loupes</div>
              <div className={styles.captionTitle}>
                <span className={styles.word}><span>Precision,</span></span>{' '}
                <span className={styles.word}><span>finally</span></span>{' '}
                <span className={styles.word}><span>accessible.</span></span>
              </div>
            </div>

            <div className={styles.hint}>
              <div className={styles.mouse} />
              <span>Scroll</span>
            </div>
          </div>
        </div>

        {/* 2nd section — rises over the cinematic; holds the Start button */}
        <section className={styles.site}>
          <div className={styles.ambient} aria-hidden="true">
            <span className={`${styles.glow} ${styles.glowEmerald}`} />
            <span className={`${styles.glow} ${styles.glowSky}`} />
            <span className={`${styles.glow} ${styles.glowAmber}`} />
          </div>

          <div className={styles.siteInner}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>HeliosX Loupes</p>
              <h2 className={styles.heroTitle}>
                Surgical precision,<br />
                <span className={styles.grad}>finally accessible.</span>
              </h2>
              <p className={styles.heroSub}>
                Premium ergonomic prismatic loupes for surgeons, dentists, residents, and students.
                Published pricing. Direct-to-clinician. No gatekeeping.
              </p>
              <div className={styles.heroCtas}>
                <button className={styles.startBtn} onClick={finish} type="button">Start</button>
              </div>
              <p className={styles.resident}>Resident &amp; student pricing from $270</p>
            </header>

            <div className={styles.lineupHead}>
              <h2 className={styles.lineupTitle}>Five product lines. One fitting standard.</h2>
            </div>

            <ul className={styles.lineupGrid}>
              {LINEUP.map((p) => (
                <li className={styles.card} key={p.slug}>
                  <div className={styles.cardImg}>
                    <img src={p.image} alt={`${p.name} loupes`} loading="lazy" />
                    <span className={styles.badge}>{p.badge}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <h3>{p.name}</h3>
                      <span className={styles.price}>{p.price}</span>
                    </div>
                    <p>{p.copy}</p>
                    <span className={styles.cardLink}>View {p.name} →</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <button className={styles.skip} onClick={finish} type="button">Skip intro</button>

      <audio ref={audioRef} src={CINEMATIC.audioSrc} loop preload="auto" />
    </div>
  )
}
