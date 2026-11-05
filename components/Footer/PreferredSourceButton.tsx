'use client'

import { useEffect } from 'react'

const SCRIPT_SRC = 'https://news.google.com/swg/js/v1/publisher.js'
const TRIGGERS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const

// Google's "Add as a preferred source" button. Its script pulls in ~240 KiB of
// Google code, so it waits for the visitor's first scroll, tap or keypress
// instead of competing with the page's first load.
export default function PreferredSourceButton() {
  useEffect(() => {
    const load = () => {
      TRIGGERS.forEach((type) => window.removeEventListener(type, load))
      if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }

    TRIGGERS.forEach((type) => window.addEventListener(type, load, { once: true, passive: true }))
    return () => TRIGGERS.forEach((type) => window.removeEventListener(type, load))
  }, [])

  return (
    <div
      {...{ 'google-add-preferred-source-btn': '' }}
      data-theme="dark"
      data-lang="en"
      suppressHydrationWarning
    />
  )
}
