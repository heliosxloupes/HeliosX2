'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Mail, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { trackContact } from '@/lib/analytics'
import { supportEmail } from '@/lib/seo'

import styles from './ContactProvider.module.css'

type ProductContext = {
  slug: string
  name: string
  magnification?: string
  frame?: string
  color?: string
}

type ContactTopic = 'fitting' | 'product' | 'order' | 'other'

type ContactContextValue = {
  openContact: (source?: string) => void
  setProductContext: (context: ProductContext | null) => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

const topics: { id: ContactTopic; label: string; subject: string }[] = [
  { id: 'fitting', label: 'Fit & magnification', subject: 'Fitting and magnification question' },
  { id: 'product', label: 'Product question', subject: 'Product question' },
  { id: 'order', label: 'Shipping or order', subject: 'Shipping or order question' },
  { id: 'other', label: 'Something else', subject: 'Question for HeliosX' },
]

function formatMagnification(value?: string) {
  return value?.replace(/x$/i, '×')
}

export function useContact() {
  const value = useContext(ContactContext)
  if (!value) throw new Error('useContact must be used inside ContactProvider')
  return value
}

export default function ContactProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState('floating_contact')
  const [topic, setTopic] = useState<ContactTopic>('product')
  const [productContext, setProductContext] = useState<ProductContext | null>(null)

  const openContact = useCallback((nextSource = 'floating_contact') => {
    setSource(nextSource)
    setOpen(true)
    trackContact('contact_open', {
      contact_source: nextSource,
      page_path: window.location.pathname,
    })
  }, [])

  const closeContact = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeContact()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeContact, open])

  useEffect(() => setOpen(false), [pathname])

  const selectedTopic = topics.find((item) => item.id === topic) ?? topics[1]
  const magnification = formatMagnification(productContext?.magnification)
  const subject = productContext
    ? `${selectedTopic.subject}: ${productContext.name}${magnification ? ` ${magnification}` : ''}`
    : selectedTopic.subject
  const productLines = productContext
    ? [
        `Product: ${productContext.name}`,
        magnification ? `Magnification: ${magnification}` : '',
        productContext.frame ? `Frame: ${productContext.frame}` : '',
        productContext.color ? `Color: ${productContext.color}` : '',
        '',
      ].filter(Boolean)
    : []
  const body = [
    'Hi HeliosX team,',
    '',
    ...productLines,
    'My question:',
    '',
    '',
    `Page: https://heliosxvision.com${pathname}`,
  ].join('\n')
  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const value = useMemo(
    () => ({ openContact, setProductContext }),
    [openContact]
  )

  return (
    <ContactContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {open && (
          <div className={styles.layer} role="presentation">
            <motion.button
              type="button"
              className={styles.backdrop}
              aria-label="Close contact panel"
              onClick={closeContact}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              data-lenis-prevent
            >
              <div className={styles.panelTop}>
                <div className={styles.mark} aria-hidden="true">
                  <span />
                  <span />
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.closeButton}
                  onClick={closeContact}
                  aria-label="Close contact panel"
                >
                  <X aria-hidden="true" />
                </button>
              </div>

              <p className={styles.eyebrow}>PERSONAL GUIDANCE</p>
              <h2 id="contact-title">Questions before you choose?</h2>
              <p className={styles.intro}>
                Tell us what you are deciding. We can help with fit, magnification,
                product details, shipping, and existing orders.
              </p>

              {productContext && (
                <div className={styles.contextCard}>
                  <span>YOUR CURRENT SELECTION</span>
                  <strong>
                    {productContext.name}{magnification ? ` · ${magnification}` : ''}
                  </strong>
                  {(productContext.frame || productContext.color) && (
                    <small>
                      {[productContext.frame, productContext.color].filter(Boolean).join(' · ')}
                    </small>
                  )}
                </div>
              )}

              <fieldset className={styles.topicGroup}>
                <legend>What can we help with?</legend>
                <div>
                  {topics.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={topic === item.id}
                      onClick={() => {
                        setTopic(item.id)
                        trackContact('contact_topic_select', {
                          contact_source: source,
                          contact_topic: item.id,
                          page_path: pathname,
                          product: productContext?.slug,
                        })
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <a
                className={styles.emailButton}
                href={mailto}
                onClick={() =>
                  trackContact('email_click', {
                    contact_source: source,
                    contact_topic: topic,
                    page_path: pathname,
                    product: productContext?.slug,
                    magnification: productContext?.magnification,
                  })
                }
              >
                <span><Mail aria-hidden="true" /> Email a loupe specialist</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className={styles.emailAddress} href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              <p className={styles.responseTime}>Our team answers within one business day.</p>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </ContactContext.Provider>
  )
}
