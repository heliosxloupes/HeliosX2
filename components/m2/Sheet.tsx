'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

// Bottom sheet on Radix Dialog: focus trap, Escape and scroll lock come from
// Radix; the slide and scrim live in app/m2.css (m2-drawer, m2-scrim).
export default function Sheet({
  open,
  onOpenChange,
  title,
  description,
  full = false,
  footer,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  full?: boolean
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="m2 m2-scrim" />
        <Dialog.Content className={`m2 m2-drawer ${full ? 'm2-drawer--full' : ''}`}>
          {!full ? <div className="m2-grip" aria-hidden="true" /> : null}
          <div className="flex items-start justify-between gap-4 px-5 pb-2" style={{ paddingTop: full ? 'calc(14px + env(safe-area-inset-top, 0px))' : 8 }}>
            <div className="min-w-0">
              <Dialog.Title className="text-[1.6rem] font-extrabold leading-tight tracking-[-0.045em]">{title}</Dialog.Title>
              {description ? <Dialog.Description className="mt-0.5 text-[13px] text-[#4d5f54]">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
            </div>
            <Dialog.Close className="m2-icon m2-icon--ink shrink-0" aria-label="Close">
              <X size={19} />
            </Dialog.Close>
          </div>
          <div className="m2-drawer__body">{children}</div>
          {footer ? <div className="border-t border-[rgba(8,38,27,0.1)] px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] pt-3">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
