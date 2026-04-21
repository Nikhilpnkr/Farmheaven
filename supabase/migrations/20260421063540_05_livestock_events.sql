create table public.health_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  flock_id uuid references public.flocks(id) on delete cascade,
  event_type public.health_event_type not null,
  occurred_at timestamptz not null default now(),
  diagnosis text,
  symptoms text[],
  body_condition_score numeric(2,1),
  temperature_c numeric(4,1),
  drug_name text,
  drug_cdsco_code text,
  batch_number text,
  dose_value numeric(10,3),
  dose_unit text,
  route text,
  frequency text,
  duration_days int,
  milk_withdrawal_hours int,
  meat_withdrawal_days int,
  withdrawal_until_milk timestamptz,
  withdrawal_until_meat timestamptz,
  inventory_lot_id uuid,
  observed_by uuid references public.profiles(id),
  prescribed_by uuid references public.profiles(id),
  prescription_signed_at timestamptz,
  source public.event_source not null default 'manual',
  media jsonb not null default '[]'::jsonb,
  notes text,
  voice_note_url text,
  voice_transcript text,
  metadata jsonb not null default '{}'::jsonb,
  idempotency_key text,
  created_at timestamptz not null default now(),
  check (animal_id is not null or flock_id is not null),
  unique (farm_id, idempotency_key)
);
create index on public.health_events (farm_id, occurred_at desc);
create index on public.health_events (animal_id, occurred_at desc);
create index on public.health_events (flock_id, occurred_at desc);
create index on public.health_events (event_type, occurred_at desc);
create index on public.health_events (withdrawal_until_milk desc nulls last);

create table public.breeding_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  event_type public.breeding_event_type not null,
  occurred_at timestamptz not null default now(),
  sire_id uuid references public.animals(id),
  semen_straw_batch text,
  semen_breed text,
  pregnancy_outcome text check (pregnancy_outcome in ('positive','negative','retest','lost')),
  offspring_count smallint,
  predicted_window_start timestamptz,
  predicted_window_end timestamptz,
  ml_confidence numeric(3,2),
  ml_model_version text,
  observed_by uuid references public.profiles(id),
  source public.event_source not null default 'manual',
  media jsonb not null default '[]'::jsonb,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.breeding_events (farm_id, occurred_at desc);
create index on public.breeding_events (animal_id, occurred_at desc);
create index on public.breeding_events (event_type);

create table public.production_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  flock_id uuid references public.flocks(id) on delete cascade,
  plot_id uuid references public.plots(id) on delete cascade,
  crop_cycle_id uuid,
  kind public.production_type not null,
  shift text check (shift in ('morning','evening','midday','all_day')),
  occurred_at timestamptz not null default now(),
  quantity numeric(12,3) not null,
  unit text not null,
  quality jsonb not null default '{}'::jsonb,
  structure_id uuid references public.structures(id),
  is_quarantined boolean not null default false,
  quarantine_reason public.quarantine_reason,
  quarantined_until timestamptz,
  disposition text check (disposition in ('for_sale','for_internal','for_compost','destroyed','unknown')) default 'unknown',
  recorded_by uuid references public.profiles(id),
  source public.event_source not null default 'manual',
  media jsonb not null default '[]'::jsonb,
  notes text,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (animal_id is not null or flock_id is not null or plot_id is not null),
  unique (farm_id, idempotency_key)
);
create index on public.production_events (farm_id, occurred_at desc);
create index on public.production_events (animal_id, occurred_at desc);
create index on public.production_events (flock_id, occurred_at desc);
create index on public.production_events (plot_id, occurred_at desc);
create index on public.production_events (kind, occurred_at desc);
create index on public.production_events (is_quarantined) where is_quarantined = true;

create table public.welfare_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  flock_id uuid references public.flocks(id) on delete cascade,
  structure_id uuid references public.structures(id),
  signal public.welfare_signal not null,
  severity text check (severity in ('info','warn','alert')) default 'info',
  observed_at timestamptz not null default now(),
  duration_seconds int,
  camera_id uuid,
  clip_url text,
  ml_confidence numeric(3,2),
  ml_model_version text,
  source public.event_source not null default 'ml',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (animal_id is not null or flock_id is not null or structure_id is not null)
);
create index on public.welfare_events (farm_id, observed_at desc);
create index on public.welfare_events (animal_id, observed_at desc);
create index on public.welfare_events (flock_id, observed_at desc);
create index on public.welfare_events (signal, observed_at desc);

-- TRIGGERS: keep denormalised animal state fresh
create or replace function public.animals_sync_from_event()
returns trigger language plpgsql as $$
declare _animal_id uuid;
begin
  _animal_id := new.animal_id;
  if _animal_id is null then return new; end if;
  if TG_TABLE_NAME = 'health_events' then
    if new.event_type = 'treatment' and new.withdrawal_until_milk is not null then
      update public.animals set health_state = 'quarantined' where id = _animal_id;
    elsif new.event_type = 'recovery' then
      update public.animals set health_state = 'healthy' where id = _animal_id;
    elsif new.event_type in ('symptom','diagnosis') then
      update public.animals set health_state = 'sick' where id = _animal_id;
    elsif new.event_type = 'death' then
      update public.animals
        set retired_at = coalesce(retired_at, new.occurred_at),
            retirement_reason = coalesce(retirement_reason, 'died')
        where id = _animal_id;
    end if;
  elsif TG_TABLE_NAME = 'breeding_events' then
    if new.event_type = 'parturition' then
      update public.animals
        set last_calving_date = new.occurred_at::date,
            lactation_number = coalesce(lactation_number,0) + 1,
            days_in_milk = 0,
            lifecycle = 'lactating'
        where id = _animal_id;
    elsif new.event_type = 'pregnancy_check' and new.pregnancy_outcome = 'positive' then
      update public.animals set lifecycle = 'pregnant' where id = _animal_id;
    elsif new.event_type = 'heat_predicted' then
      update public.animals set predicted_next_estrus_at = new.predicted_window_start where id = _animal_id;
    elsif new.event_type = 'heat_observed' then
      update public.animals set health_state = 'in_heat' where id = _animal_id;
    end if;
  elsif TG_TABLE_NAME = 'production_events' then
    update public.animals set last_production_at = new.occurred_at where id = new.animal_id;
  end if;
  return new;
end; $$;

create trigger trg_animals_health_sync after insert on public.health_events for each row execute function public.animals_sync_from_event();
create trigger trg_animals_breeding_sync after insert on public.breeding_events for each row execute function public.animals_sync_from_event();
create trigger trg_animals_production_sync after insert on public.production_events for each row execute function public.animals_sync_from_event();

create or replace function public.auto_quarantine_production()
returns trigger language plpgsql as $$
declare _hold_until timestamptz;
begin
  if new.animal_id is null or new.kind != 'milk' then return new; end if;
  select max(withdrawal_until_milk) into _hold_until
    from public.health_events
    where animal_id = new.animal_id
      and withdrawal_until_milk is not null
      and withdrawal_until_milk > new.occurred_at;
  if _hold_until is not null then
    new.is_quarantined := true;
    new.quarantine_reason := 'antibiotic_withdrawal';
    new.quarantined_until := _hold_until;
    new.disposition := 'for_compost';
  end if;
  return new;
end; $$;
create trigger trg_auto_quarantine before insert on public.production_events for each row execute function public.auto_quarantine_production();
