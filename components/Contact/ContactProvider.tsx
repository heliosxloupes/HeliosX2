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
import { ArrowUpRight, Check, Mail, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { trackContact, trackGenerateLead } from '@/lib/analytics'
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
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const openContact = useCallback((nextSource = 'floating_contact') => {
    setSource(nextSource)
    setStatus('idle')
    setError('')
    // Returning shoppers already gave us their email in the bag.
    const savedEmail = window.localStorage.getItem('heliosx_customer_email') ?? ''
    setForm((current) => (current.email ? current : { ...current, email: savedEmail }))
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

  // Sent through /api/contact: saved to the CRM and emailed to the team, so a
  // question never depends on the visitor's mail app being set up.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    const productLabel = productContext
      ? [productContext.name, magnification, productContext.frame, productContext.color].filter(Boolean).join(' · ')
      : ''
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          topic: selectedTopic.subject,
          product: productLabel,
          page: `https://heliosxvision.com${pathname}`,
          source,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload?.error || 'Something went wrong. Please try again.')
      window.localStorage.setItem('heliosx_customer_email', form.email.trim().toLowerCase())
      setStatus('sent')
      setForm((current) => ({ ...current, message: '' }))
      trackContact('contact_submit', {
        contact_source: source,
        contact_topic: topic,
        page_path: pathname,
        product: productContext?.slug,
      })
      trackGenerateLead('contact_form', { contact_topic: topic, product: productContext?.slug })
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.')
    }
  }

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

              {status === 'sent' ? (
                <div className={styles.sent} role="status">
                  <Check aria-hidden="true" />
                  <div>
                    <strong>Thanks, we have your question.</strong>
                    <p>A loupe specialist will reply to {form.email} within one business day.</p>
                  </div>
                </div>
              ) : (
                <form className={styles.form} onSubmit={submit} noValidate>
                  <label className={styles.field}>
                    <span>Your question</span>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      placeholder={
                        productContext
                          ? `Ask anything about ${productContext.name}: fit, magnification, delivery…`
                          : 'Fit, magnification, delivery, an existing order…'
                      }
                    />
                  </label>
                  <div className={styles.fieldRow}>
                    <label className={styles.field}>
                      <span>Email</span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Name <em>(optional)</em></span>
                      <input
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                      />
                    </label>
                  </div>
                  <input
                    className={styles.honeypot}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                    name="company"
                  />
                  {error ? <p className={styles.formError} role="alert">{error}</p> : null}
                  <button type="submit" className={styles.emailButton} disabled={status === 'sending'}>
                    <span>
                      <Mail aria-hidden="true" />
                      {status === 'sending' ? 'Sending…' : 'Send to a loupe specialist'}
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </button>
                </form>
              )}
              <a
                className={styles.emailAddress}
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
                Prefer email? {supportEmail}
              </a>
              <p className={styles.responseTime}>Our team answers within one business day.</p>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </ContactContext.Provider>
  )
}
