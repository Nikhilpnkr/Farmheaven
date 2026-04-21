-- ================= REFERENCE TABLES =================
create table public.species (
  code text primary key,
  label text not null,
  telugu_label text,
  hindi_label text,
  kingdom text default 'livestock',
  gestation_days int,
  typical_lifespan_years int,
  tracks_individually boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.breeds (
  id uuid primary key default gen_random_uuid(),
  species_code text not null references public.species(code),
  code text not null,
  label text not null,
  origin_region text,
  purpose text[],
  typical_weight_kg_min numeric(6,1),
  typical_weight_kg_max numeric(6,1),
  avg_305d_yield_l numeric(6,1),
  avg_egg_per_year int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (species_code, code)
);

-- ================= ANIMALS (individually tracked) =================
create table public.animals (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  tag text not null,
  name text,
  species_code text not null references public.species(code),
  breed_id uuid references public.breeds(id),
  sex public.sex not null default 'unknown',
  date_of_birth date,
  acquired_at date,
  acquisition_kind text check (acquisition_kind in ('born_onfarm','purchased','gifted','transferred')) default 'born_onfarm',
  acquisition_cost numeric(12,2),
  acquisition_source text,
  current_structure_id uuid references public.structures(id) on delete set null,
  dam_id uuid references public.animals(id) on delete set null,
  sire_id uuid references public.animals(id) on delete set null,
  rfid_tag text,
  external_ids jsonb not null default '{}'::jsonb,
  lifecycle public.animal_lifecycle,
  health_state public.animal_health_state not null default 'healthy',
  lactation_number smallint default 0,
  days_in_milk int,
  last_calving_date date,
  predicted_next_estrus_at timestamptz,
  last_production_at timestamptz,
  retired_at timestamptz,
  retirement_reason text check (retirement_reason in ('sold','died','culled','gifted','transferred','other')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  unique (farm_id, tag)
);
create trigger trg_animals_updated before update on public.animals for each row execute function public.set_updated_at();
create index on public.animals (farm_id, species_code) where retired_at is null;
create index on public.animals (farm_id, health_state);
create index on public.animals (dam_id);
create index on public.animals (sire_id);
create index on public.animals (rfid_tag) where rfid_tag is not null;
create index on public.animals using gin (external_ids);

-- ================= FLOCKS (group-tracked) =================
create table public.flocks (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  name text,
  species_code text not null references public.species(code),
  breed_id uuid references public.breeds(id),
  purpose public.flock_purpose not null,
  structure_id uuid references public.structures(id) on delete set null,
  date_placed date not null,
  expected_exit_date date,
  headcount_initial int not null,
  headcount_current int not null,
  mortalities int not null default 0,
  culled int not null default 0,
  sold int not null default 0,
  target_fcr numeric(4,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  unique (farm_id, code)
);
create trigger trg_flocks_updated before update on public.flocks for each row execute function public.set_updated_at();
create index on public.flocks (farm_id, species_code) where closed_at is null;

-- Movement: animals between structures
create table public.animal_movements (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  flock_id uuid references public.flocks(id) on delete cascade,
  from_structure_id uuid references public.structures(id),
  to_structure_id uuid references public.structures(id),
  at timestamptz not null default now(),
  reason text,
  created_by uuid references public.profiles(id),
  source public.event_source not null default 'manual',
  created_at timestamptz not null default now(),
  check (animal_id is not null or flock_id is not null)
);
create index on public.animal_movements (farm_id, at desc);
create index on public.animal_movements (animal_id, at desc);
create index on public.animal_movements (flock_id, at desc);
