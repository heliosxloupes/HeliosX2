'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Publishes the height of a fixed bottom purchase bar as `--hx-sticky-bar` on
 * <html>, so other fixed UI (the privacy banner) can sit above the bar instead
 * of covering its button. A hidden bar (desktop) reports 0.
 */
export function useStickyBarOffset(ref: RefObject<HTMLElement | null>, mounted = true) {
  useEffect(() => {
    const bar = ref.current
    if (!mounted || !bar) return

    const root = document.documentElement
    const update = () => root.style.setProperty('--hx-sticky-bar', `${bar.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(bar)

    return () => {
      observer.disconnect()
      root.style.removeProperty('--hx-sticky-bar')
    }
  }, [ref, mounted])
}
