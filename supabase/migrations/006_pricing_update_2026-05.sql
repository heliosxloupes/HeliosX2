update public.products
set
  base_price = 695,
  price_label = '$695-$725',
  is_available = true,
  updated_at = now()
where slug = 'newton';

update public.products
set
  base_price = 795,
  price_label = '$795-$825',
  is_available = true,
  updated_at = now()
where slug = 'galileo';

update public.products
set
  base_price = 1195,
  price_label = '$1,195-$1,255',
  is_available = true,
  updated_at = now()
where slug = 'kepler';

update public.products
set
  base_price = 1695,
  price_label = '$1,695-$2,075',
  is_available = true,
  updated_at = now()
where slug = 'medusa';

update public.products
set
  base_price = 1695,
  price_label = '$1,695-$2,070',
  is_available = true,
  updated_at = now()
where slug = 'apollo';
