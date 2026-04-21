-- Physical structures: barns, sheds, parlors, storage, etc.
create table public.structures (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  name text not null,
  kind text not null check (kind in ('dairy_barn','calf_barn','goat_shed','poultry_shed','parlor','quarantine','storage','office','compost_yard','apiary','processing','other')),
  capacity int,
  boundary_geom geography(polygon,4326),
  climate_targets jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (farm_id, code)
);
create trigger trg_structures_updated before update on public.structures for each row execute function public.set_updated_at();
create index on public.structures (farm_id) where deleted_at is null;
create index on public.structures using gist (boundary_geom);

-- Fields / plots (for crops).
create table public.plots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  name text not null,
  area_acres numeric(8,3) not null,
  boundary_geom geography(polygon,4326),
  center_geom geography(point,4326),
  soil_type text,
  water_source text,
  slope_pct numeric(4,1),
  is_certified_organic boolean not null default true,
  certification_since date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (farm_id, code)
);
create trigger trg_plots_updated before update on public.plots for each row execute function public.set_updated_at();
create index on public.plots (farm_id) where deleted_at is null;
create index on public.plots using gist (boundary_geom);

-- Irrigation / feed / cooling zones.
create table public.zones (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  name text not null,
  kind text not null check (kind in ('irrigation','feed','cooling','lighting','security','milking','other')),
  parent_plot_id uuid references public.plots(id) on delete set null,
  parent_structure_id uuid references public.structures(id) on delete set null,
  boundary_geom geography(polygon,4326),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
create trigger trg_zones_updated before update on public.zones for each row execute function public.set_updated_at();
create index on public.zones (farm_id);
