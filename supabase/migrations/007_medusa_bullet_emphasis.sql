update public.products
set
  card_bullets = array[
    'Real-time adjustable working distance',
    '300-600 mm working distance',
    'Tailored fixed IPD',
    'Enhanced depth perception'
  ],
  updated_at = now()
where slug = 'medusa';
