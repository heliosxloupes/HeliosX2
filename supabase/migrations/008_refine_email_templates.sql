update public.email_templates
set
  subject = 'Your HeliosX configuration is saved',
  body = E'You started configuring a HeliosX loupe system, and your cart is still saved.\n\nEvery order is risk-free until custom measurements are submitted, so you can reserve your configuration without being locked into production.\n\nReturn when you are ready and finish checkout in a few minutes.',
  delay_days = 1
where key = 'cart_abandoned_1';

update public.email_templates
set
  subject = 'A quick note about ordering loupes online',
  body = E'Buying surgical loupes online should feel clear, not risky.\n\nWith HeliosX, checkout reserves your configuration first. Production does not begin until you send your custom measurements, and your order remains fully refundable before measurements are submitted.\n\nIf you have questions about magnification, working distance, prescription lenses, or frame choice, reply to this email and we will help.',
  delay_days = 3
where key = 'cart_abandoned_2';

update public.email_templates
set
  subject = 'Your HeliosX cart is still available',
  body = E'Your HeliosX cart is still available if you want to come back to it.\n\nThe next step is simple: complete checkout, then send your pupillary distance, working distance, and prescription notes before production begins.\n\nRisk-free reminder: your order is fully refundable until measurements are submitted.',
  delay_days = 7
where key = 'cart_abandoned_3';

update public.email_templates
set
  subject = 'Need help finishing your HeliosX checkout?',
  body = E'You reached checkout, but your HeliosX order was not completed.\n\nIf something got in the way, your configuration is still waiting. You can return to checkout, review the order, and finish payment securely through Stripe.\n\nYour order remains fully refundable before measurements are submitted.',
  delay_days = 1
where key = 'checkout_abandoned_1';

update public.email_templates
set
  subject = 'Your HeliosX checkout is still open',
  body = E'Your HeliosX checkout is still open.\n\nAfter payment, we will send your measurement instructions. Production only begins after you provide your fit details, so there is still a review step before anything custom is made.\n\nReply here if you want help choosing between models or magnification levels.',
  delay_days = 3
where key = 'checkout_abandoned_2';

update public.email_templates
set
  subject = 'Final reminder: your HeliosX checkout is waiting',
  body = E'This is a final reminder that your HeliosX checkout is still available.\n\nIf you are ready, you can complete payment and then send your measurements when convenient. If you are still deciding, reply with any questions and we will help you choose the right setup.',
  delay_days = 7
where key = 'checkout_abandoned_3';

update public.email_templates
set
  subject = 'Your HeliosX order is confirmed',
  body = E'Thanks for your order. We have received your payment and reserved your HeliosX loupe configuration.\n\nBefore production begins, we need your custom fit measurements so we can build your loupes around the way you work.\n\nPlease send us:\n- Pupillary distance (PD)\n- Working distance\n- Prescription notes or a prescription screenshot, if applicable\n- Any fit notes you want our team to review\n\nFor PD, we recommend using PDCheck AR by EyeQue on iPhone. Download the app here: {{pdcheck_ios_url}}\n\nAfter measuring, reply directly to this email with a screenshot of your PDCheck AR result, or submit your details through your secure measurement page: {{measurement_url}}\n\nYour order remains fully refundable until measurements are submitted.',
  delay_days = 0
where key = 'post_purchase';

update public.email_templates
set
  subject = 'Your HeliosX order has shipped',
  body = E'Your HeliosX order has shipped.\n\nTracking number: {{tracking_number}}\n\nTrack your shipment here: {{tracking_url}}\n\nIf anything looks off with delivery or your package arrives with damage, reply to this email and our team will help.',
  delay_days = 0
where key = 'tracking';
