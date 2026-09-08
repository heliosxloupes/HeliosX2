'use client'

import { useEffect, useRef, useState } from 'react'

type LazyVideoProps = {
  src: string
  poster: string
  width: number
  height: number
  className?: string
  'aria-label'?: string
}

/**
 * A muted autoplaying background video that does not download until it is
 * near the viewport.
 *
 * `autoPlay` overrides `preload="metadata"` -- the browser fetches the whole
 * file immediately regardless of the hint. On the homepage that meant the
 * 1.69 MB hero video was 74% of page weight and the largest single drag on
 * LCP (8 Sep 2026 audit). Holding the `src` back until an IntersectionObserver
 * fires keeps the poster visible, preserves the autoplay behaviour once the
 * panel is actually reached, and takes the video off the critical path.
 *
 * `rootMargin` starts the fetch a screen early so playback still looks
 * instant by the time the panel is scrolled into view.
 */
export default function LazyVideo({
  src,
  poster,
  width,
  height,
  className,
  'aria-label': ariaLabel,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shouldLoad) return

    // No IntersectionObserver (older browsers, some crawlers): load normally
    // rather than never showing the video at all.
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <video
      ref={ref}
      {...(shouldLoad ? { src } : {})}
      poster={poster}
      preload="none"
      width={width}
      height={height}
      aria-label={ariaLabel}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
