-- Devices
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  label text not null,
  kind text not null check (kind in (
    'soil_moisture','soil_ec','air_temp','humidity','nh3','co2','tank_level','flow_meter',
    'weather_station','et_pod','rfid_reader','camera','valve','feeder','fan','pump','siren','gateway','edge_ai','other')),
  model text,
  firmware_version text,
  hw_serial text,
  zone_id uuid references public.zones(id),
  structure_id uuid references public.structures(id),
  plot_id uuid references public.plots(id),
  geom geography(point,4326),
  mqtt_topic text,
  status public.device_status not null default 'offline',
  battery_pct numeric(4,1),
  signal_rssi int,
  last_seen_at timestamptz,
  installed_at timestamptz,
  retired_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
create trigger trg_devices_updated before update on public.devices for each row execute function public.set_updated_at();
create index on public.devices (farm_id, kind) where retired_at is null;
create index on public.devices (status) where retired_at is null;

alter table public.welfare_events
  add constraint welfare_events_camera_fk
  foreign key (camera_id) references public.devices(id) on delete set null;

-- Sensor readings (partitioned time-series)
create table public.sensor_readings (
  device_id uuid not null references public.devices(id) on delete cascade,
  metric text not null,
  value numeric(14,4) not null,
  unit text,
  occurred_at timestamptz not null,
  quality numeric(3,2),
  farm_id uuid not null,
  primary key (device_id, metric, occurred_at)
) partition by range (occurred_at);
create index on public.sensor_readings (farm_id, occurred_at desc);
create index on public.sensor_readings (device_id, metric, occurred_at desc);

create table public.sensor_readings_default partition of public.sensor_readings default;

-- Rules
create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  trigger jsonb not null,
  conditions jsonb default '[]'::jsonb,
  actions jsonb not null,
  cooldown_minutes int default 0,
  last_fired_at timestamptz,
  fire_count int default 0,
  created_by uuid references public.profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_rules_updated before update on public.automation_rules for each row execute function public.set_updated_at();
create index on public.automation_rules (farm_id) where is_active;

-- Rule firings audit
create table public.rule_firings (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  rule_id uuid not null references public.automation_rules(id) on delete cascade,
  fired_at timestamptz not null default now(),
  trigger_payload jsonb,
  actions_taken jsonb,
  outcome text check (outcome in ('success','partial','failed')),
  error text,
  created_at timestamptz not null default now()
);
create index on public.rule_firings (farm_id, fired_at desc);
create index on public.rule_firings (rule_id, fired_at desc);

-- Device commands
create table public.device_commands (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  device_id uuid not null references public.devices(id) on delete cascade,
  command text not null,
  payload jsonb,
  status text not null default 'queued' check (status in ('queued','sent','acked','failed','cancelled')),
  queued_at timestamptz not null default now(),
  sent_at timestamptz,
  acked_at timestamptz,
  source_rule_id uuid references public.automation_rules(id) on delete set null,
  source_user_id uuid references public.profiles(id),
  error text,
  created_at timestamptz not null default now()
);
create index on public.device_commands (device_id, status, queued_at);

alter table public.tasks
  add constraint tasks_source_rule_fk
  foreign key (source_rule_id) references public.automation_rules(id) on delete set null;
