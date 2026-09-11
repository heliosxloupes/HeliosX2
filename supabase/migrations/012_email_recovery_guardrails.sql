-- Keep recovery useful without starting overlapping sequences for repeat carts.
-- Application-level guards also cap each recipient at two messages in 14 days.

update public.email_templates
set
  subject = 'Your HeliosX configuration is saved',
  body = E'Your HeliosX loupe configuration is saved if you want to return to it.\n\nIf you are unsure about magnification, working distance, prescription lenses, or frame choice, reply to this email and we will help. There is no need to order until the setup feels right.',
  delay_days = 1,
  is_active = true
where key = 'cart_abandoned_1';

update public.email_templates
set
  subject = 'Questions about your HeliosX configuration?',
  body = E'This is the final reminder about your saved HeliosX configuration.\n\nYou can return to your cart when you are ready, or reply if you want help choosing the right setup. We will not send another reminder for this cart.',
  delay_days = 5,
  is_active = true
where key = 'cart_abandoned_2';

update public.email_templates
set
  subject = 'Need help with your HeliosX checkout?',
  body = E'Your HeliosX checkout was not completed. If the payment form did not load or something was unclear, reply and we will help.\n\nYour configuration is still saved, and your order remains fully refundable until custom production begins.',
  delay_days = 1,
  is_active = true
where key = 'checkout_abandoned_1';

update public.email_templates
set
  subject = 'A final note about your HeliosX checkout',
  body = E'This is the final reminder about your HeliosX checkout.\n\nReturn when you are ready, or reply if you want help with the product configuration or payment process. We will not send another reminder for this checkout.',
  delay_days = 5,
  is_active = true
where key = 'checkout_abandoned_2';

update public.email_templates
set is_active = false
where key in ('cart_abandoned_3', 'checkout_abandoned_3');
