create table public.certification_bodies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  scheme text not null,
  scope text,
  template_url text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.farm_certifications (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  body_id uuid not null references public.certification_bodies(id),
  cert_number text not null,
  status public.cert_status not null default 'valid',
  valid_from date not null,
  valid_until date not null,
  issued_on date,
  document_url text,
  next_audit_at date,
  scope_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, body_id, cert_number)
);
create trigger trg_certs_updated before update on public.farm_certifications for each row execute function public.set_updated_at();

create table public.audit_log (
  id uuid default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete set null,
  actor_id uuid references public.profiles(id),
  actor_role public.user_role,
  entity_kind text not null,
  entity_id uuid,
  action text not null,
  diff jsonb,
  reason text,
  occurred_at timestamptz not null default now(),
  primary key (id, occurred_at)
) partition by range (occurred_at);
create table public.audit_log_default partition of public.audit_log default;
create index on public.audit_log (farm_id, occurred_at desc);
create index on public.audit_log (entity_kind, entity_id);

create table public.welfare_rollups (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  species_code text,
  flock_id uuid references public.flocks(id),
  period_start date not null,
  period_end date not null,
  stress_free_hours_pct numeric(5,2),
  panting_pct numeric(5,2),
  crowding_pct numeric(5,2),
  vocalization_pct numeric(5,2),
  lameness_pct numeric(5,2),
  body_cond_avg numeric(3,1),
  observation_hours int,
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);
create unique index welfare_rollups_uq on public.welfare_rollups (farm_id, species_code, flock_id, period_start, period_end);
create index on public.welfare_rollups (farm_id, period_end desc);

create table public.carbon_entries (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  direction text not null check (direction in ('sequester','emit')),
  source_kind text not null,
  method text,
  tco2e numeric(10,4) not null,
  cost_center_id uuid references public.cost_centers(id),
  period_start date not null,
  period_end date not null,
  evidence_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.carbon_entries (farm_id, period_end desc);
create index on public.carbon_entries (direction, source_kind);

create table public.lactation_rollups (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  lactation_number smallint,
  start_date date,
  end_date date,
  total_milk_l numeric(12,2),
  peak_l_per_day numeric(6,2),
  days_in_milk int,
  projected_305d_l numeric(12,2),
  persistence_index numeric(5,2),
  generated_at timestamptz not null default now(),
  unique (animal_id, lactation_number)
);

create table public.flock_fcr_rollups (
  id uuid primary key default gen_random_uuid(),
  flock_id uuid not null references public.flocks(id) on delete cascade,
  period_start date,
  period_end date,
  feed_consumed_kg numeric(12,2),
  body_weight_kg numeric(12,2),
  fcr numeric(4,2),
  mortality_pct numeric(5,2),
  generated_at timestamptz not null default now()
);
