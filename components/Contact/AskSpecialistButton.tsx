'use client'

import { useContact } from './ContactProvider'

// A mailto: link does nothing for visitors without a mail app set up (Clarity
// logged dead clicks on the old footer link), so every "talk to us" call to
// action opens the contact panel instead. It sends through /api/contact.
export default function AskSpecialistButton({
  source,
  className,
  children,
}: {
  source: string
  className?: string
  children: React.ReactNode
}) {
  const { openContact } = useContact()
  return (
    <button type="button" onClick={() => openContact(source)} className={className}>
      {children}
    </button>
  )
}
