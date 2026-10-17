'use client'

import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { supportEmail } from '@/lib/seo'

// The address stays visible and selectable, with a one-tap copy, for people
// who would rather write from their own inbox than use the contact form.
export default function CopyEmail({
  className = '',
  buttonClassName = '',
}: {
  className?: string
  buttonClassName?: string
}) {
  const addressRef = useRef<HTMLSpanElement | null>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail)
    } catch {
      const node = addressRef.current
      const selection = window.getSelection()
      if (node && selection) {
        const range = document.createRange()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span ref={addressRef} className="select-all">{supportEmail}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
        className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2 text-[11px] font-semibold transition ${buttonClassName}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}
