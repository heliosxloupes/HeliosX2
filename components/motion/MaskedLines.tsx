'use client'

import { motion } from 'framer-motion'

type MaskedLinesProps = {
  lines: { text: string; className?: string }[]
  delay?: number
}

// Headline lines that rise out of a mask on load.
export default function MaskedLines({ lines, delay = 0.12 }: MaskedLinesProps) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={line.text} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${line.className ?? ''}`}
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.85, delay: delay + index * 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </>
  )
}
