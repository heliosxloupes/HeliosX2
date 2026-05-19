update public.products
set
  base_price = 740,
  price_label = '$740-$1,115',
  is_available = true,
  updated_at = now()
where slug = 'apollo';
