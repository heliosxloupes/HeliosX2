'use client'

import React, { useMemo, useState } from 'react'
import Header from '@/components/Header'
import styles from './page.module.css'

const faqSections = [
  {
    title: 'How Prescription & Measurements work',
    items: [
      {
        q: 'How Does the Prescription & Measurement Process Work?',
        a: (
          <p>
            After placing your order, you will see a confirmation page instructing you to wait for an email with the next steps.
            This email contains all instructions, links, and forms needed to complete your prescription or non-prescription setup.
          </p>
        ),
      },
      {
        q: 'Prescription vs. Non-Prescription Lenses',
        a: (
          <div>
            <p><strong>Prescription Lenses</strong></p>
            <p>If you require prescription lenses, simply reply to the confirmation email and attach your valid eyeglass prescription.</p>
            <p>Once received, we will verify the information and proceed with your custom lens production.</p>

            <p style={{ marginTop: '1.5rem' }}><strong>Non-Prescription Lenses</strong></p>
            <p>If you do not require a prescription, your confirmation email will guide you through two quick measurements:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>Pupillary Distance (PD)</li>
              <li>Working Distance</li>
            </ul>
            <p>The email also includes a QR code to download the PDCheck AR app, along with instructions for submitting your measurements.</p>
          </div>
        ),
      },
      {
        q: 'How to Measure Your Pupillary Distance (PD)',
        a: (
          <div>
            <p>Shortly after placing your order, look out for an email containing:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Step-by-step PD measurement instructions</li>
              <li>A QR code linking directly to the PDCheck AR app in the App Store</li>
              <li>A link to the customer measurement form where you will submit your results</li>
            </ul>
            <p><strong>PDCheck AR by EyeQue</strong> is a smartphone-based vision tool that provides quick, accurate PD measurements using augmented reality. We highly recommend using this app for the most precise results.</p>
            <p style={{ marginTop: '1rem' }}>If you prefer not to use the app, your email will also include simple instructions on how to measure your PD manually with a ruler.</p>
          </div>
        ),
      },
      {
        q: 'How to Measure Your Working Distance',
        a: (
          <div>
            <p>Your working distance is the space between your eyes and the area or patient you typically focus on during procedures or detailed tasks. Selecting the correct working distance is essential for posture, clarity, and comfort.</p>

            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '1.5rem auto', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src="/working distance.png"
                alt="Dental professional measuring working distance"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <p style={{ marginTop: '1.5rem' }}><strong>How to Determine Your Working Distance</strong></p>

            <p style={{ marginTop: '1rem' }}><strong>1. Use Your Natural Working Posture</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Sit or stand exactly as you normally would while working</li>
              <li>Keep your back and neck straight</li>
              <li>Look toward your usual focal point</li>
            </ul>

            <p><strong>2. Measure the Distance</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Place a measuring tape at the corner of your eye</li>
              <li>Extend it to the object or position where your hands normally work</li>
              <li>Record this distance — this is your working distance</li>
            </ul>

            <p><strong>3. Consider Your Professional Needs</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Some fields require closer focus or more mobility</li>
              <li>Choose a distance that remains clear without straining your posture</li>
            </ul>

            <p style={{ marginTop: '1.5rem' }}><strong>Tips for Best Results</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>If you're using Try Before You Buy, test different distances in your workspace to find the most comfortable setup</li>
              <li>Re-measure periodically as your habits or working style may evolve</li>
              <li>Ask colleagues for input if you're unsure</li>
            </ul>
          </div>
        ),
      },
      {
        q: 'Submitting Your Measurements',
        a: (
          <div>
            <p>Once you have:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>✔ Your prescription (if applicable)</li>
              <li>✔ Your pupillary distance</li>
              <li>✔ Your working distance</li>
            </ul>
            <p>Complete the customer measurement form included in your confirmation email.</p>
            <p>Submit it back to us, and we'll begin crafting your custom loupes.</p>
          </div>
        ),
      },
      {
        q: 'Can I get prescription lenses?',
        a: 'Yes, prescription lenses are available for all HeliosX models. During checkout, you\'ll receive an email with instructions on how to provide your prescription details. We work with licensed optometrists to ensure accurate prescription integration.',
      },
      {
        q: 'How do I provide my prescription information?',
        a: 'After placing your order, you\'ll receive an email with a link to submit your prescription details. You can also contact our support team directly with your prescription information. We require your most recent eye exam results.',
      },
      {
        q: 'What if my prescription changes?',
        a: 'If your prescription changes after receiving your loupes, we can help you update your lenses. Contact our support team to discuss options for prescription updates or lens replacement.',
      },
      {
        q: 'How long does it take to process prescription orders?',
        a: 'Prescription orders typically take an additional 5-7 business days to process compared to standard orders, as we need to verify your prescription and integrate it into your loupes.',
      },
    ],
  },
  {
    title: 'Product',
    items: [
      {
        q: 'What magnification options are available?',
        a: 'HeliosX offers various magnification levels across our product line: Galileo and Newton (2.5x, 3.0x, 3.5x), Apollo (3.0x, 4.0x, 5.0x, 6.0x), and Kepler (4.0x, 5.0x, 6.0x). Each model is designed for specific surgical and dental applications.',
      },
      {
        q: 'What frame options do you have?',
        a: 'We offer multiple frame styles and colors to suit your preferences. Frame options vary by product model and include various colors and designs. You can view all available frames on each product page.',
      },
      {
        q: 'What are the weight specifications?',
        a: 'HeliosX loupes are designed to be lightweight for extended use. Galileo weighs approximately 35-37g depending on magnification. Newton, Apollo, and Kepler have similar lightweight designs optimized for comfort during long procedures.',
      },
      {
        q: 'What is the working distance?',
        a: 'Working distance varies by magnification and model. Our loupes are designed for optimal working distances typical in surgical and dental procedures. Specific measurements are available in each product\'s technical specifications.',
      },
      {
        q: 'Are the lenses multi-layer coated?',
        a: 'Yes, all HeliosX loupes feature multi-layer coated premium lenses with high color fidelity and light transmittance greater than 98%. This ensures optimal clarity and color accuracy for precise work.',
      },
      {
        q: 'What is the field of view?',
        a: 'HeliosX loupes feature an extra-wide field of view, providing excellent peripheral vision while maintaining optical clarity. The exact field of view varies by magnification level and model.',
      },
      {
        q: 'Are the loupes compatible with light sources?',
        a: 'Yes, all HeliosX loupes are compatible with fixed light sources and power supplies. They can be used with various surgical headlights and light systems commonly used in operating rooms and dental clinics.',
      },
    ],
  },
  {
    title: 'Order & Shipping',
    items: [
      {
        q: 'What is the warranty on HeliosX loupes?',
        a: 'All HeliosX surgical loupes come with a comprehensive warranty covering manufacturing defects and optical performance. Please contact our support team for specific warranty details based on your product model.',
      },
      {
        q: 'What is your return policy?',
        a: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, you can return your loupes within 30 days of delivery for a full refund. The product must be in original condition with all packaging and accessories.",
      },
      {
        q: 'Where do you ship?',
        a: 'We currently ship to the United States and Canada. International shipping options may be available upon request. Please contact our support team for more information.',
      },
      {
        q: 'How much is shipping?',
        a: 'Shipping costs vary based on your location and selected shipping method. Standard shipping within the US typically takes 3-5 business days. Express shipping options are available at checkout.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'We accept all major credit cards and offer flexible payment options. For medical professionals, we may offer payment plans - please contact us to discuss options.',
      },
      {
        q: 'How can I edit my billing or shipping address?',
        a: 'You can update your shipping address before your order ships by contacting our support team. Once an order has shipped, address changes may not be possible.',
      },
    ],
  },
  {
    title: 'Company',
    items: [
      {
        q: 'Where is HeliosX based?',
        a: 'HeliosX is based in the United States, founded by a plastic surgery resident who recognized the need for high-quality, affordable surgical loupes in the medical community.',
      },
      {
        q: 'Why did you start HeliosX?',
        a: 'HeliosX was born in the operating room, built to defy industry greed. We saw that premium surgical loupes were priced out of reach for many medical professionals, and we set out to make surgical precision accessible to all without compromising on quality.',
      },
      {
        q: 'What are your vision, mission, and values?',
        a: "Our mission is to provide premium surgical optics at fair prices. We believe that high-quality medical equipment should be accessible to all healthcare professionals, regardless of their career stage. We're committed to transparency, quality, and supporting the medical community.",
      },
      {
        q: 'What other products do you offer?',
        a: 'Currently, we offer four main product lines: Galileo, Newton, Apollo, and Kepler surgical loupes. Each is designed for specific applications and preferences. We\'re continuously working on expanding our product range based on community feedback.',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        q: 'How can I contact support?',
        a: 'You can reach our support team via email or through the contact form on our website. We typically respond within 24-48 hours. For urgent matters, please indicate this in your message.',
      },
      {
        q: 'Do you offer technical support?',
        a: 'Yes, we provide comprehensive technical support for all our products. Our team can help with fitting adjustments, maintenance questions, and troubleshooting. We\'re committed to ensuring you get the most out of your HeliosX loupes.',
      },
      {
        q: 'Can I schedule a fitting consultation?',
        a: 'We offer virtual fitting consultations to help you select the right magnification, frame, and configuration for your needs. Contact our support team to schedule a consultation.',
      },
      {
        q: 'What if I need repairs?',
        a: 'If your loupes need repair, contact our support team. We\'ll assess the issue and provide repair options. Many repairs can be completed quickly, and we offer replacement options when necessary.',
      },
      {
        q: 'Do you have educational resources?',
        a: 'We provide guides and resources to help you choose the right loupes and maintain them properly. Check our website for detailed product specifications, fitting guides, and care instructions.',
      },
    ],
  },
]

function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextFromNode).join(' ')
  if (React.isValidElement(node) && node.props?.children) return extractTextFromNode(node.props.children)
  return ''
}

function FAQPage() {
  const [search, setSearch] = useState('')

  const filteredSections = useMemo(() => {
    if (!search.trim()) return faqSections
    const term = search.toLowerCase()
    return faqSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          const content = typeof item.a === 'string' ? item.a : extractTextFromNode(item.a)
          return `${item.q} ${content}`.toLowerCase().includes(term)
        }),
      }))
      .filter(section => section.items.length > 0)
  }, [search])

  return (
    <main className={styles.main}>
      <Header />
      <section className={styles.hero}>
        <p className={styles.kicker}>FAQ • About HeliosX</p>
        <h1 className={styles.title}>Everything you need to know</h1>
        <p className={styles.subtitle}>
          Answers pulled from the HeliosX FAQ so you can move from configuration to checkout with confidence.
        </p>
        <div className={styles.heroActions}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for shipping, prescriptions, warranty, and more"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <a className={styles.contactButton} href="mailto:heliosxloupes@gmail.com">
            Email HeliosX Support
          </a>
        </div>
      </section>

      <section className={styles.faqGrid}>
        {filteredSections.map(section => (
          <div key={section.title} className={styles.card}>
            <h2>{section.title}</h2>
            <div className={styles.qaList}>
              {section.items.map(item => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <div className={styles.answer}>
                    {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className={styles.empty}>No answers found. Try a different keyword.</div>
        )}
      </section>
    </main>
  )
}

export default FAQPage
