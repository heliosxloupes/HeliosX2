alter table public.orders
  add column if not exists customer_name text,
  add column if not exists shipping_details jsonb not null default '{}'::jsonb,
  add column if not exists billing_details jsonb not null default '{}'::jsonb;
