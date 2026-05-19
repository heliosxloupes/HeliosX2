update public.products
set
  base_price = 460,
  price_label = '$460-$520',
  is_available = true,
  updated_at = now()
where slug = 'kepler';
