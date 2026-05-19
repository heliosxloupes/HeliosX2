alter type public.order_status add value if not exists 'delivered';

alter table public.orders
  add column if not exists payment_status text not null default 'paid',
  add column if not exists paid_at timestamptz,
  add column if not exists delivered_at timestamptz;

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status,
  payment_status text,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.order_status_events enable row level security;

update public.orders
set
  payment_status = coalesce(nullif(payment_status, ''), 'paid'),
  paid_at = coalesce(paid_at, created_at)
where stripe_session_id is not null;
