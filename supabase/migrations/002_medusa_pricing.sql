update public.products
set
  magnifications = array['3.0x', '4.0x', '5.0x', '6.0x', '8.0x', '8.5x'],
  base_price = 710,
  price_label = '$710-$1,090',
  is_available = true,
  updated_at = now()
where slug = 'medusa';

update public.product_specs
set
  items = array[
    'Magnification options: 3.0x, 4.0x, 5.0x, 6.0x, 8.0x, 8.5x.',
    'Working distance: adjustable 300-600 mm.',
    'Field of view: 80 mm.',
    'Depth of field: 110 mm.'
  ]
where product_id = (select id from public.products where slug = 'medusa')
  and title = 'Magnification data';
