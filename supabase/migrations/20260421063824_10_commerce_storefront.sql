-- Customers
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text,
  email citext,
  preferred_lang text default 'en' check (preferred_lang in ('en','te','hi')),
  source text,
  tags text[] default '{}',
  segment_membership jsonb default '{}'::jsonb,
  ltv numeric(14,2) default 0,
  first_order_at timestamptz,
  last_order_at timestamptz,
  orders_count int default 0,
  nps_score int,
  nps_captured_at timestamptz,
  marketing_consent boolean default true,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, phone)
);
create trigger trg_customers_updated before update on public.customers for each row execute function public.set_updated_at();
create index on public.customers (farm_id) where is_active;
create index on public.customers (phone);
create index on public.customers using gin (tags);

-- Addresses
create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text,
  full_address text not null,
  city text,
  pincode text,
  state text default 'Telangana',
  geom geography(point,4326),
  delivery_notes text,
  is_default boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_cust_addr_updated before update on public.customer_addresses for each row execute function public.set_updated_at();
create index on public.customer_addresses (customer_id);
create index on public.customer_addresses using gist (geom);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  slug text not null,
  name text not null,
  tagline text,
  description text,
  sku_id uuid references public.skus(id),
  category text,
  unit_label text,
  price numeric(10,2) not null,
  mrp numeric(10,2),
  gst_rate_pct numeric(5,2) default 0,
  image_urls text[] default '{}',
  badges text[] default '{}',
  lead_time_hours int,
  is_subscribable boolean default true,
  is_available boolean default true,
  inventory_policy text default 'track' check (inventory_policy in ('track','forecast','always_on')),
  meta_seo jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, slug)
);
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
create index on public.products (farm_id) where is_available;

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  plan_code text not null,
  status public.subscription_status not null default 'active',
  cadence text not null,
  delivery_weekday smallint,
  delivery_slot text,
  items jsonb not null,
  total numeric(12,2) not null,
  next_delivery_date date,
  paused_until date,
  e_mandate_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz
);
create trigger trg_subs_updated before update on public.subscriptions for each row execute function public.set_updated_at();
create index on public.subscriptions (farm_id, status);
create index on public.subscriptions (next_delivery_date) where status = 'active';

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  order_number text not null,
  customer_id uuid not null references public.customers(id),
  subscription_id uuid references public.subscriptions(id),
  address_id uuid references public.customer_addresses(id),
  status public.order_status not null default 'new',
  sub_total numeric(12,2) not null,
  delivery_fee numeric(10,2) default 0,
  discount numeric(10,2) default 0,
  gst numeric(10,2) default 0,
  total numeric(12,2) not null,
  payment_status public.payment_status not null default 'pending',
  payment_method text,
  payment_ref text,
  delivery_date date,
  delivery_slot text,
  route_id uuid,
  assigned_packer_id uuid references public.workers(id),
  assigned_delivery_id uuid references public.workers(id),
  placed_at timestamptz not null default now(),
  packed_at timestamptz,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, order_number)
);
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();
create index on public.orders (farm_id, status, delivery_date);
create index on public.orders (customer_id, placed_at desc);
create index on public.orders (delivery_date, status);

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  sku_id uuid references public.skus(id),
  picked_lot_ids uuid[],
  name_snapshot text not null,
  quantity numeric(10,2) not null,
  unit text not null,
  unit_price numeric(10,2) not null,
  line_total numeric(12,2) not null,
  gst_rate_pct numeric(5,2) default 0,
  created_at timestamptz not null default now()
);
create index on public.order_items (order_id);
create index on public.order_items (product_id);
create index on public.order_items using gin (picked_lot_ids);

-- Delivery routes
create table public.delivery_routes (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  route_date date not null,
  label text,
  assigned_worker_id uuid references public.workers(id),
  stops jsonb,
  distance_km numeric(6,2),
  cost numeric(10,2),
  status text default 'planned' check (status in ('planned','in_progress','done','cancelled')),
  polyline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_routes_updated before update on public.delivery_routes for each row execute function public.set_updated_at();

alter table public.orders
  add constraint orders_route_fk
  foreign key (route_id) references public.delivery_routes(id) on delete set null;

-- Customer journal
create table public.customer_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  kind text not null,
  body text,
  payload jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on public.customer_events (customer_id, occurred_at desc);
