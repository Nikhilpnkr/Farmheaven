-- Crop catalogue (reference; extensible per farm)
create table public.crops (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  telugu_label text,
  hindi_label text,
  family text,
  kind text check (kind in ('cereal','pulse','vegetable','fruit','oilseed','spice','millet','fodder','cash','cover','perennial')),
  cycle_days_min int,
  cycle_days_max int,
  companion_codes text[],
  rotation_partner_codes text[],
  water_need_mm numeric(6,1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- A crop cycle is a specific sowing-to-harvest run on a plot.
create table public.crop_cycles (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  plot_id uuid not null references public.plots(id) on delete cascade,
  crop_id uuid not null references public.crops(id),
  variety text,
  season text check (season in ('kharif','rabi','summer','perennial')),
  sowing_date date,
  expected_harvest_start date,
  expected_harvest_end date,
  area_acres numeric(8,3),
  target_yield_kg numeric(10,2),
  current_stage public.plot_stage not null default 'prep',
  stage_changed_at timestamptz default now(),
  forecast_yield_kg numeric(10,2),
  forecast_window_days int default 14,
  forecast_updated_at timestamptz,
  forecast_confidence numeric(3,2),
  closed_at timestamptz,
  actual_yield_kg numeric(10,2),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_crop_cycles_updated before update on public.crop_cycles for each row execute function public.set_updated_at();
create index on public.crop_cycles (farm_id, plot_id) where closed_at is null;
create index on public.crop_cycles (farm_id, current_stage);

-- Back-fill FK on production_events
alter table public.production_events
  add constraint production_events_crop_cycle_fk
  foreign key (crop_cycle_id) references public.crop_cycles(id) on delete set null;

-- Soil samples & lab results
create table public.soil_samples (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  plot_id uuid not null references public.plots(id) on delete cascade,
  sampled_at date not null,
  lab_name text,
  lab_report_url text,
  depth_cm int,
  ph numeric(3,1),
  organic_carbon_pct numeric(4,2),
  available_n_kg_ha numeric(6,1),
  available_p_kg_ha numeric(6,1),
  available_k_kg_ha numeric(6,1),
  sulfur_kg_ha numeric(6,1),
  zinc_ppm numeric(5,2),
  microbial_biomass_ug numeric(7,1),
  ec_ds_m numeric(5,2),
  texture text,
  full_results jsonb not null default '{}'::jsonb,
  recommendations text,
  created_at timestamptz not null default now()
);
create index on public.soil_samples (farm_id, plot_id, sampled_at desc);

-- NDVI / drone / satellite imagery ingestion
create table public.remote_sensing_runs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  plot_id uuid references public.plots(id) on delete set null,
  kind text not null check (kind in ('drone','satellite')),
  vendor text,
  flight_date timestamptz not null,
  orthomosaic_url text,
  ndvi_url text,
  thermal_url text,
  avg_ndvi numeric(4,3),
  stress_zones_geom geography(multipolygon,4326),
  stress_area_acres numeric(8,3),
  notes text,
  cost numeric(10,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.remote_sensing_runs (farm_id, flight_date desc);
create index on public.remote_sensing_runs (plot_id, flight_date desc);

-- IPM log
create table public.ipm_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  plot_id uuid not null references public.plots(id) on delete cascade,
  crop_cycle_id uuid references public.crop_cycles(id) on delete set null,
  observed_at timestamptz not null default now(),
  pest text,
  pressure text check (pressure in ('none','low','moderate','high','severe')),
  method text check (method in ('scouting','pheromone_trap','yellow_sticky','camera_ai','damage_count')),
  action_taken text,
  input_lot_id uuid,
  observed_by uuid references public.profiles(id),
  media jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);
create index on public.ipm_logs (farm_id, observed_at desc);

-- Compost pipeline
create table public.compost_windrows (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  started_at date not null,
  c_n_ratio numeric(4,1),
  source_mix jsonb not null default '[]'::jsonb,
  current_stage text check (current_stage in ('fresh','thermophilic','cooling','mature','applied')) default 'fresh',
  core_temp_c numeric(4,1),
  estimated_output_kg numeric(10,2),
  applied_at date,
  applied_to_plot_ids uuid[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
create trigger trg_compost_updated before update on public.compost_windrows for each row execute function public.set_updated_at();
