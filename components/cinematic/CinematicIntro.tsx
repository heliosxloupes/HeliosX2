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
  const startWrapRef = useRef<HTMLDivElement>(null)
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

        // Start button fades in over the final product frames
        gsap.fromTo(
          startWrapRef.current!,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              scroller,
              trigger: runwayRef.current!,
              start: '82% top',
              end: '90% top',
              scrub: true,
              onEnter: () => startWrapRef.current?.classList.add(styles.visible),
              onLeaveBack: () => startWrapRef.current?.classList.remove(styles.visible),
            },
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

      <div className={styles.scroller} ref={scrollerRef}>
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
      </div>

      <div className={styles.startWrap} ref={startWrapRef}>
        <button className={styles.startBtn} onClick={finish} type="button">Start</button>
      </div>

      <button className={styles.skip} onClick={finish} type="button">Skip intro</button>

      <audio ref={audioRef} src={CINEMATIC.audioSrc} loop preload="auto" />
    </div>
  )
}
