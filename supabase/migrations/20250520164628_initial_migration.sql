-- 1. ENUM TYPES -------------------------------------------------------------
create type public.pricing_plan_interval as enum (
  'day',
  'week',
  'month',
  'year'
);

create type public.pricing_type as enum (
  'one_time',
  'recurring'
);

create type public.subscription_status as enum (
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused'
);

create type public.access as enum (
  'user',
  'admin'
);


-- 2. TABLES -----------------------------------------------------------------
-- customers
create table if not exists public.customers (
  id uuid not null primary key,
  stripe_customer_id text,
  constraint customers_user_fkey
    foreign key (id) 
    references auth.users(id) 
    on delete set null
);

-- products
create table if not exists public.products (
  id text not null primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb,
  marketing_features jsonb not null default '{}'::jsonb
);

-- prices
create table if not exists public.prices (
  id text not null primary key,
  product_id text,
  active boolean,
  description text,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type public.pricing_type,
  interval public.pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb,
  constraint prices_product_fkey
    foreign key (product_id)
    references public.products(id)
    on delete set null
);

-- subscriptions
create table if not exists public.subscriptions (
  id text not null primary key,
  user_id uuid not null,
  status public.subscription_status,
  metadata jsonb,
  price_id text,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamptz not null default timezone('utc', now()),
  current_period_start timestamptz not null default timezone('utc', now()),
  current_period_end timestamptz not null default timezone('utc', now()),
  ended_at timestamptz default null,
  cancel_at timestamptz default null,
  canceled_at timestamptz default null,
  trial_start timestamptz default null,
  trial_end timestamptz default null,
  constraint subscriptions_price_fkey
    foreign key (price_id)
    references public.prices(id)
    on delete set null,
  constraint subscriptions_user_fkey
    foreign key (user_id)
    references auth.users(id)
    on delete set null
);

-- users (mirror auth.users + extra fields)
create table if not exists public.users (
  id uuid not null primary key,
  full_name text,
  email text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  constraint users_auth_fkey
    foreign key (id)
    references auth.users(id)
    on delete set null
);

-- payments
create table if not exists public.payments (
  id text not null primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null,
  product_id text not null,
  quantity integer,
  metadata jsonb,
  constraint payments_user_fkey
    foreign key (user_id)
    references auth.users(id)
    on delete set null,
  constraint payments_product_fkey
    foreign key (product_id)
    references public.products(id)
    on delete set null
);

-- user_access
create table if not exists public.user_access (
  id uuid not null default gen_random_uuid() primary key,
  access public.access not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_access_auth_fkey
    foreign key (id)
    references auth.users(id)
    on delete set null
);


-- 3. TRIGGER FUNCTION & TRIGGER ---------------------------------------------
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
as $$
begin
  insert into public.users (id, full_name, email, avatar_url)
    values (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'avatar_url'
    );
  insert into public.user_access (id)
    values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 4. ROW-LEVEL SECURITY & POLICIES ------------------------------------------
-- Enable RLS
alter table public.customers  enable row level security;
alter table public.products   enable row level security;
alter table public.prices     enable row level security;
alter table public.subscriptions enable row level security;
alter table public.users      enable row level security;
alter table public.payments   enable row level security;
alter table public.user_access enable row level security;

-- Public read-only on products & prices
create policy products_read_only on public.products
  for select using (true);

create policy prices_read_only on public.prices
  for select using (true);

-- Only owners can view or update their own user record
create policy users_select_own on public.users
  for select using (auth.uid() = id);

create policy users_update_own on public.users
  for update using (auth.uid() = id);

-- Subscriptions: only owner may view
create policy subscriptions_select_own on public.subscriptions
  for select using (auth.uid() = user_id);

-- Payments: only owner may view
create policy payments_select_own on public.payments
  for select using (auth.uid() = user_id);