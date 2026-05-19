update public.products
set
  base_price = 270,
  price_label = '$270-$300',
  is_available = true,
  updated_at = now()
where slug in ('galileo', 'newton');
