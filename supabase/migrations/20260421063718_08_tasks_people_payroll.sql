-- Workers: a profile + employment meta on a farm.
create table public.workers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  code text not null,
  full_name text not null,
  phone text,
  role_label text,
  skills text[],
  primary_lang text check (primary_lang in ('en','te','hi')) default 'te',
  wage_rate_per_day numeric(10,2),
  wage_currency text default 'INR',
  is_piece_rate boolean default false,
  piece_rate jsonb,
  date_joined date,
  date_left date,
  aadhaar_last4 text,
  uan text,
  esic_number text,
  pf_enabled boolean default true,
  esic_enabled boolean default true,
  account_number_last4 text,
  ifsc text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
create trigger trg_workers_updated before update on public.workers for each row execute function public.set_updated_at();
create index on public.workers (farm_id) where is_active;

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  worker_id uuid not null references public.workers(id) on delete cascade,
  check_in_at timestamptz not null,
  check_in_geom geography(point,4326),
  check_out_at timestamptz,
  check_out_geom geography(point,4326),
  minutes_worked int,
  within_geofence boolean,
  source public.event_source not null default 'manual',
  notes text,
  created_at timestamptz not null default now()
);
create index on public.attendance (farm_id, check_in_at desc);
create index on public.attendance (worker_id, check_in_at desc);

create table public.piece_work_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  worker_id uuid not null references public.workers(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  work_kind text not null,
  quantity numeric(10,2) not null,
  unit text not null,
  rate_per_unit numeric(10,2) not null,
  amount numeric(12,2) generated always as (quantity * rate_per_unit) stored,
  reference_kind text,
  reference_id uuid,
  created_at timestamptz not null default now()
);
create index on public.piece_work_logs (farm_id, worker_id, occurred_at desc);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'backlog',
  priority public.task_priority not null default 'medium',
  due_at timestamptz,
  assigned_worker_id uuid references public.workers(id) on delete set null,
  assigned_profile_id uuid references public.profiles(id) on delete set null,
  reference_kind text,
  reference_id uuid,
  source public.event_source not null default 'manual',
  source_rule_id uuid,
  auto_completes boolean default false,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);
create trigger trg_tasks_updated before update on public.tasks for each row execute function public.set_updated_at();
create index on public.tasks (farm_id, status, due_at);
create index on public.tasks (assigned_worker_id, status);
create index on public.tasks (reference_kind, reference_id);

create table public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  period_month date not null,
  status text not null default 'draft' check (status in ('draft','approved','paid','reversed')),
  total_gross numeric(14,2) not null default 0,
  total_pf numeric(14,2) not null default 0,
  total_esic numeric(14,2) not null default 0,
  total_tds numeric(14,2) not null default 0,
  total_net numeric(14,2) not null default 0,
  approved_at timestamptz,
  paid_at timestamptz,
  approved_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, period_month)
);
create trigger trg_payroll_runs_updated before update on public.payroll_runs for each row execute function public.set_updated_at();

create table public.payslips (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade,
  worker_id uuid not null references public.workers(id) on delete cascade,
  days_worked numeric(5,2) not null default 0,
  wage_amount numeric(12,2) not null default 0,
  piece_rate_amount numeric(12,2) not null default 0,
  gross numeric(12,2) not null default 0,
  pf_employee numeric(12,2) default 0,
  pf_employer numeric(12,2) default 0,
  esic_employee numeric(12,2) default 0,
  esic_employer numeric(12,2) default 0,
  tds numeric(12,2) default 0,
  advance_deduction numeric(12,2) default 0,
  net numeric(12,2) not null default 0,
  payslip_pdf_url text,
  payslip_lang text default 'te',
  whatsapp_sent_at timestamptz,
  transaction_id uuid,
  created_at timestamptz not null default now(),
  unique (payroll_run_id, worker_id)
);
create index on public.payslips (worker_id);
