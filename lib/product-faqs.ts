// Per-product FAQs surfaced as both visible content (rendered by
// ProductPageTemplate when present) and as FAQPage JSON-LD so PDPs
// become eligible for "People also ask" rich results and AI Overview
// citations. Kept in its own module (no server imports) so the client
// ProductPageTemplate can import it without pulling in lib/commerce.ts.

export const productFaqs: Record<string, { question: string; answer: string }[]> = {
  medusa: [
    {
      question: 'What magnification options does Medusa support?',
      answer:
        'Medusa is offered in 3.0x, 4.0x, 5.0x, 6.0x, 8.0x, and 8.5x. The 3.0x and 4.0x are the most common picks for surgical residents and detail-oriented dental work; 5.0x and above are for microsurgery, fine vascular, and supermicrosurgery cases.',
    },
    {
      question: 'How does adjustable working distance work?',
      answer:
        'Medusa supports a 300–600 mm adjustable working distance, which is useful if you change posture between seated and standing work or share equipment across cases. The fit is measured before production so the adjustment range is centered on your actual clinical posture.',
    },
    {
      question: 'How much does Medusa weigh?',
      answer:
        'Medusa with frame is 56–65 g depending on configuration. The build uses premium optical glass with multi-layer coatings and rigid metal barrels with reinforced mounts — the same construction class as the higher-tier prismatic loupe market.',
    },
    {
      question: 'Are there discounts for residents and students?',
      answer:
        'Yes. Resident- and student-friendly pricing is documented across the HeliosX lineup with explicit discount eligibility. Email heliosxloupes@gmail.com with your training program details to confirm.',
    },
    {
      question: 'What happens if my Medusa loupes get damaged?',
      answer:
        'Every order is covered by a warranty that includes replacement and lens-update paths. Optional protection coverage for loss, damage, and accidental drops is available at order. See /warranty for the full policy.',
    },
  ],
  apollo: [
    {
      question: 'What magnification options does Apollo support?',
      answer:
        'Apollo standard online configurations are 3.0x, 4.0x, 5.0x, and 6.0x. Custom magnifications, including 4.5x, may be available by request. Apollo is the HeliosX ergonomic prismatic system with a fixed working distance configured to the clinician’s measurements.',
    },
    {
      question: 'What is the difference between Apollo and Medusa?',
      answer:
        'Apollo runs 3.0x–6.0x with fixed working distance. Medusa runs 3.0x–8.5x with adjustable working distance. Pick Apollo for a posture-locked daily setup; pick Medusa for clinicians who change posture across cases or need higher magnification ceilings.',
    },
    {
      question: 'How much does Apollo weigh?',
      answer:
        'Apollo weighs 55–58.2 g including the frame, depending on configuration. Apollo 1 and Apollo 2 frames each ship in five colorways.',
    },
    {
      question: 'Are there discounts for residents and students?',
      answer:
        'Yes. Resident- and student-friendly pricing is documented across the HeliosX lineup. Email heliosxloupes@gmail.com with your training program details to confirm eligibility.',
    },
  ],
  kepler: [
    {
      question: 'What magnification options does Kepler support?',
      answer:
        'Kepler is offered in 4.0x, 5.0x, and 6.0x — high-magnification configurations purpose-built for microsurgery, supermicrosurgery, peripheral nerve work, and fine vascular cases.',
    },
    {
      question: 'Is Kepler suitable for first-time loupe wearers?',
      answer:
        'Usually no. Kepler is a high-magnification surgical platform that demands stable working distance, good lighting, and steady technique. Most residents do better starting with Galileo, Newton, or Apollo at 3.0x–3.5x and stepping up to Kepler later.',
    },
    {
      question: 'How much does Kepler weigh?',
      answer:
        'Kepler with frame is 68–85 g depending on configuration. The build uses premium optical glass with multi-layer coatings and rigid metal barrels.',
    },
    {
      question: 'Are there discounts for residents and fellows?',
      answer:
        'Yes. Resident- and fellowship-friendly pricing is documented across the HeliosX lineup. Email heliosxloupes@gmail.com with your training program details to confirm.',
    },
  ],
  galileo: [
    {
      question: 'What magnification options does Galileo support?',
      answer:
        'Galileo is offered in 2.5x, 3.0x, and 3.5x — the forgiving range for first-time loupe wearers. Starting price from $795 makes it the most accessible HeliosX entry point.',
    },
    {
      question: 'Is Galileo good for dental students?',
      answer:
        'Yes. Galileo is built specifically as an entry-tier loupe that students can afford during training without compromising on the optical or fitting standard. Resident and student discount eligibility is documented across the lineup.',
    },
    {
      question: 'How much does Galileo weigh?',
      answer:
        'Galileo with frame is 35–37 g — the lightest HeliosX product, designed for long clinic days and clinical rotations.',
    },
    {
      question: 'When should I upgrade from Galileo?',
      answer:
        'Most clinicians upgrade to Apollo or Medusa (ergonomic prismatic) when residency or post-grad volume makes posture more demanding, or when their case mix requires magnification above 3.5x.',
    },
  ],
  newton: [
    {
      question: 'What magnification options does Newton support?',
      answer:
        'Newton is offered in 2.5x, 3.0x, and 3.5x — built for long days at light weight. Starting price from $695, with H1 and H2 frame options.',
    },
    {
      question: 'How much does Newton weigh?',
      answer:
        'Newton with frame is 40–50 g depending on configuration. The lightweight build is designed for hygienists, dental students, and clinicians who spend the most hours per day in loupes.',
    },
    {
      question: 'What is the difference between Newton and Galileo?',
      answer:
        'Both are HeliosX entry-tier Galilean systems — Newton from $695, Galileo from $795. Newton is the ultra-light option (40–50 g) with H1 and H2 frames; Galileo (35–37 g) ships with six JJ-series frames. Pick by frame fit and feel.',
    },
    {
      question: 'Are there discounts for residents and students?',
      answer:
        'Yes. Resident- and student-friendly pricing is documented across the HeliosX lineup. Email heliosxloupes@gmail.com with your training program details to confirm.',
    },
  ],
}
