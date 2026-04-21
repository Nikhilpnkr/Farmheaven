-- Cost centers (used everywhere for P&L)
create table public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  label text not null,
  kind public.cost_center_type not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (farm_id, code)
);

-- Transaction categories (chart of accounts, simplified)
create table public.txn_categories (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  label text not null,
  txn_type public.transaction_type not null,
  parent_id uuid references public.txn_categories(id),
  is_ag_income boolean default false,
  gst_rate_pct numeric(5,2),
  hsn_sac text,
  created_at timestamptz not null default now(),
  unique (farm_id, code)
);

-- Every cash event
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  txn_type public.transaction_type not null,
  category_id uuid references public.txn_categories(id),
  cost_center_id uuid references public.cost_centers(id),
  occurred_at timestamptz not null default now(),
  amount numeric(14,2) not null,
  gst_amount numeric(14,2) default 0,
  net_amount numeric(14,2) generated always as (amount - coalesce(gst_amount,0)) stored,
  currency text not null default 'INR',
  party_name text,
  party_gstin text,
  reference_kind text,
  reference_id uuid,
  payment_status public.payment_status not null default 'paid',
  payment_method text,
  invoice_number text,
  invoice_url text,
  ocr_extracted jsonb,
  source public.event_source not null default 'manual',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);
create index on public.transactions (farm_id, occurred_at desc);
create index on public.transactions (cost_center_id, occurred_at desc);
create index on public.transactions (category_id, occurred_at desc);
create index on public.transactions (reference_kind, reference_id);

-- Back-fill payslip FK
alter table public.payslips
  add constraint payslips_transaction_fk
  foreign key (transaction_id) references public.transactions(id) on delete set null;

-- Subsidies (global scheme catalogue + per-farm claims)
create table public.subsidy_schemes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  authority text,
  scope text check (scope in ('central','state','district')) default 'central',
  state text,
  eligibility jsonb not null default '{}'::jsonb,
  frequency text,
  max_amount numeric(14,2),
  form_template_url text,
  portal_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.subsidy_claims (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  scheme_id uuid not null references public.subsidy_schemes(id),
  amount_expected numeric(14,2),
  amount_approved numeric(14,2),
  amount_disbursed numeric(14,2),
  status public.subsidy_status not null default 'eligible',
  period_label text,
  window_start date,
  window_end date,
  deadline date,
  submitted_at timestamptz,
  approved_at timestamptz,
  disbursed_at timestamptz,
  form_draft jsonb not null default '{}'::jsonb,
  submitted_pdf_url text,
  receipt_url text,
  transaction_id uuid references public.transactions(id),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_subsidy_updated before update on public.subsidy_claims for each row execute function public.set_updated_at();
create index on public.subsidy_claims (farm_id, status);
create index on public.subsidy_claims (deadline) where status in ('eligible','draft','ready');
