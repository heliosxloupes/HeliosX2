-- Align persisted catalogue and customer email copy with the verified HeliosX policies.

update public.products
set
  highlights = array[
    'Ergonomic prismatic optics tuned for detail work.',
    'Lightweight frame options that stay balanced.',
    'Fixed working distance configured to your measurements.',
    'Prescription capable and light-source ready.'
  ]::text[],
  updated_at = now()
where slug = 'apollo';

update public.product_specs
set
  title = 'Core build',
  items = array[
    'Balanced chassis that keeps weight off your neck.',
    'Net weight with frame: 55–58.2 g across all magnifications.',
    'Durable metal barrels with refined finish.',
    'Prescription ready with multiple frame geometries.'
  ]::text[]
where product_id = (select id from public.products where slug = 'apollo')
  and display_order = 0;

update public.product_specs
set
  title = 'Magnification specifications',
  items = array[
    'Standard online magnification options: 3.0x, 4.0x, 5.0x, and 6.0x. Custom magnifications, including 4.5x, may be available by request.',
    'Fixed working distance: select 420 mm, 450 mm, 500 mm, or 550 mm at order.',
    'Field of view: 50–105 mm, varying with magnification and working distance.',
    'Net weight with frame: 55–58.2 g.',
    'Optimized for LED light packs and fixed mounts.'
  ]::text[]
where product_id = (select id from public.products where slug = 'apollo')
  and display_order = 2;

update public.email_templates
set body = E'You started configuring a HeliosX loupe system, and your cart is still saved.\n\nEvery order is risk-free until custom production begins, so you can reserve your configuration before anything custom is made.\n\nReturn when you are ready and finish checkout in a few minutes.'
where key = 'cart_abandoned_1';

update public.email_templates
set body = E'Buying surgical loupes online should feel clear, not risky.\n\nWith HeliosX, checkout reserves your configuration first. We collect and review your measurements before manufacturing, and your order remains fully refundable until custom production begins.\n\nIf you have questions about magnification, working distance, prescription lenses, or frame choice, reply to this email and we will help.'
where key = 'cart_abandoned_2';

update public.email_templates
set body = E'Your HeliosX cart is still available if you want to come back to it.\n\nThe next step is simple: complete checkout, then send your pupillary distance, working distance, and prescription notes for review.\n\nRisk-free reminder: your order is fully refundable until custom production begins.'
where key = 'cart_abandoned_3';

update public.email_templates
set body = E'You reached checkout, but your HeliosX order was not completed.\n\nIf something got in the way, your configuration is still waiting. You can return to checkout, review the order, and finish payment securely through Stripe.\n\nYour order remains fully refundable until custom production begins.'
where key = 'checkout_abandoned_1';

update public.email_templates
set body = E'Thanks for your order. We have received your payment and reserved your HeliosX loupe configuration.\n\nBefore production begins, we need your custom fit measurements so we can build your loupes around the way you work.\n\nPlease send us:\n- Pupillary distance (PD)\n- Working distance\n- Prescription notes or a prescription screenshot, if applicable\n- Any fit notes you want our team to review\n\nFor PD, we recommend using PDCheck AR by EyeQue on iPhone. Download the app here: {{pdcheck_ios_url}}\n\nAfter measuring, reply directly to this email with a screenshot of your PDCheck AR result, or submit your details through your secure measurement page: {{measurement_url}}\n\nYour order remains fully refundable until custom production begins.'
where key = 'post_purchase';
