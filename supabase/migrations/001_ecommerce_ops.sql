create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('admin', 'user');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
    'pending_measurements',
    'measurements_received',
    'in_production',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text unique,
  sources text[] not null default '{}',
  first_source text,
  last_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  description text not null,
  card_tagline text not null default '',
  card_highlight text not null default '',
  card_bullets text[] not null default '{}',
  highlights text[] not null default '{}',
  magnifications text[] not null default '{}',
  base_price integer,
  price_label text,
  is_available boolean not null default true,
  card_image_src text,
  card_image_alt text,
  image_position text,
  display_order integer not null default 0,
  spec_title text not null default '',
  spec_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  src text not null,
  alt text not null default '',
  kind text not null default 'hero',
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  items text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.abandoned_cart_sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  cart_items jsonb not null default '[]'::jsonb,
  stage text not null default 'cart',
  checkout_session_id text unique,
  added_to_cart_at timestamptz not null default now(),
  reached_checkout_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  abandoned_cart_session_id uuid references public.abandoned_cart_sessions(id) on delete set null,
  customer_email text not null,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  subtotal integer,
  total integer,
  currency text not null default 'usd',
  payment_status text not null default 'paid',
  paid_at timestamptz,
  status public.order_status not null default 'pending_measurements',
  measurement_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status,
  payment_status text,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  email text not null,
  pupillary_distance text not null,
  working_distance text,
  prescription_notes text,
  additional_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  subject text not null,
  body text not null,
  delay_days integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  recipient_email text not null,
  related_order_id uuid references public.orders(id) on delete set null,
  related_cart_session_id uuid references public.abandoned_cart_sessions(id) on delete set null,
  status text not null,
  error text,
  sent_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();

drop trigger if exists set_crm_contacts_updated_at on public.crm_contacts;
create trigger set_crm_contacts_updated_at before update on public.crm_contacts for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();

drop trigger if exists set_abandoned_cart_sessions_updated_at on public.abandoned_cart_sessions;
create trigger set_abandoned_cart_sessions_updated_at before update on public.abandoned_cart_sessions for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

drop trigger if exists set_measurements_updated_at on public.measurements;
create trigger set_measurements_updated_at before update on public.measurements for each row execute function public.set_updated_at();

drop trigger if exists set_email_templates_updated_at on public.email_templates;
create trigger set_email_templates_updated_at before update on public.email_templates for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_specs enable row level security;
alter table public.abandoned_cart_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.measurements enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_events enable row level security;
alter table public.order_status_events enable row level security;

drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable" on public.products for select using (true);

drop policy if exists "product images are publicly readable" on public.product_images;
create policy "product images are publicly readable" on public.product_images for select using (true);

drop policy if exists "product specs are publicly readable" on public.product_specs;
create policy "product specs are publicly readable" on public.product_specs for select using (true);

insert into public.email_templates (key, name, subject, body, delay_days)
values
  ('cart_abandoned_1', 'Cart abandoned email 1', 'Your HeliosX configuration is saved', E'You started configuring a HeliosX loupe system, and your cart is still saved.\n\nEvery order is risk-free until custom measurements are submitted, so you can reserve your configuration without being locked into production.\n\nReturn when you are ready and finish checkout in a few minutes.', 1),
  ('cart_abandoned_2', 'Cart abandoned email 2', 'A quick note about ordering loupes online', E'Buying surgical loupes online should feel clear, not risky.\n\nWith HeliosX, checkout reserves your configuration first. Production does not begin until you send your custom measurements, and your order remains fully refundable before measurements are submitted.\n\nIf you have questions about magnification, working distance, prescription lenses, or frame choice, reply to this email and we will help.', 3),
  ('cart_abandoned_3', 'Cart abandoned email 3', 'Your HeliosX cart is still available', E'Your HeliosX cart is still available if you want to come back to it.\n\nThe next step is simple: complete checkout, then send your pupillary distance, working distance, and prescription notes before production begins.\n\nRisk-free reminder: your order is fully refundable until measurements are submitted.', 7),
  ('checkout_abandoned_1', 'Checkout abandoned email 1', 'Need help finishing your HeliosX checkout?', E'You reached checkout, but your HeliosX order was not completed.\n\nIf something got in the way, your configuration is still waiting. You can return to checkout, review the order, and finish payment securely through Stripe.\n\nYour order remains fully refundable before measurements are submitted.', 1),
  ('checkout_abandoned_2', 'Checkout abandoned email 2', 'Your HeliosX checkout is still open', E'Your HeliosX checkout is still open.\n\nAfter payment, we will send your measurement instructions. Production only begins after you provide your fit details, so there is still a review step before anything custom is made.\n\nReply here if you want help choosing between models or magnification levels.', 3),
  ('checkout_abandoned_3', 'Checkout abandoned email 3', 'Final reminder: your HeliosX checkout is waiting', E'This is a final reminder that your HeliosX checkout is still available.\n\nIf you are ready, you can complete payment and then send your measurements when convenient. If you are still deciding, reply with any questions and we will help you choose the right setup.', 7),
  ('post_purchase', 'Post-purchase email', 'Your HeliosX order is confirmed', E'Thanks for your order. We have received your payment and reserved your HeliosX loupe configuration.\n\nBefore production begins, we need your custom fit measurements so we can build your loupes around the way you work.\n\nPlease send us:\n- Pupillary distance (PD)\n- Working distance\n- Prescription notes or a prescription screenshot, if applicable\n- Any fit notes you want our team to review\n\nFor PD, we recommend using PDCheck AR by EyeQue on iPhone. Download the app here: {{pdcheck_ios_url}}\n\nAfter measuring, reply directly to this email with a screenshot of your PDCheck AR result, or submit your details through your secure measurement page: {{measurement_url}}\n\nYour order remains fully refundable until measurements are submitted.', 0),
  ('tracking', 'Tracking email', 'Your HeliosX order has shipped', E'Your HeliosX order has shipped.\n\nTracking number: {{tracking_number}}\n\nTrack your shipment here: {{tracking_url}}\n\nIf anything looks off with delivery or your package arrives with damage, reply to this email and our team will help.', 0)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;
