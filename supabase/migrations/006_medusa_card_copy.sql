update public.products
set
  card_tagline = 'Real-time adjustable working distance for seated or standing surgical posture.',
  card_bullets = array[
    '300-600 mm working distance',
    'Tailored fixed IPD',
    'Enhanced depth perception'
  ],
  updated_at = now()
where slug = 'medusa';
