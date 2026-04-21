-- Suppliers
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  kind text check (kind in ('feed','seed','medicine','fertilizer','bio_input','packaging','equipment','services','mixed')),
  gstin text,
  phone text,
  email citext,
  address jsonb not null default '{}'::jsonb,
  cert_status public.cert_status not null default 'valid',
  cert_body text,
  cert_number text,
  cert_valid_from date,
  cert_valid_until date,
  cert_document_url text,
  score_pct numeric(4,1),
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, name)
);
create trigger trg_suppliers_updated before update on public.suppliers for each row execute function public.set_updated_at();
create index on public.suppliers (farm_id) where is_active;
create index on public.suppliers (cert_valid_until) where is_active;

-- SKUs (master product/input catalogue for this farm)
create table public.skus (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  code text not null,
  name text not null,
  category public.inventory_category not null,
  unit text not null,
  is_consumable boolean not null default true,
  is_withdrawal_tracked boolean not null default false,
  default_withdrawal_milk_hours int,
  default_withdrawal_meat_days int,
  reorder_point numeric(12,3),
  reorder_qty numeric(12,3),
  preferred_supplier_id uuid references public.suppliers(id),
  is_organic_compliant boolean not null default true,
  allowed_under_certifications text[] default array['PGS-India','NPOP'],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
create trigger trg_skus_updated before update on public.skus for each row execute function public.set_updated_at();
create index on public.skus (farm_id, category);
create index on public.skus (farm_id) where is_withdrawal_tracked;

-- Lots: each physical batch of a SKU
create table public.inventory_lots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  sku_id uuid not null references public.skus(id) on delete cascade,
  supplier_id uuid references public.suppliers(id),
  supplier_batch_ref text,
  internal_batch text not null,
  quantity_initial numeric(14,3) not null,
  quantity_remaining numeric(14,3) not null,
  unit text not null,
  unit_cost numeric(12,4),
  received_at timestamptz not null default now(),
  expires_at timestamptz,
  location text,
  supplier_cert_status_at_purchase public.cert_status,
  supplier_cert_number_snapshot text,
  is_harvested_on_farm boolean not null default false,
  parent_lot_ids uuid[],
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_lots_updated before update on public.inventory_lots for each row execute function public.set_updated_at();
create index on public.inventory_lots (farm_id, sku_id, received_at desc);
create index on public.inventory_lots (farm_id, expires_at) where expires_at is not null;
create index on public.inventory_lots (supplier_id);
create index on public.inventory_lots using gin (parent_lot_ids);

-- Movements
create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid not null references public.inventory_lots(id) on delete cascade,
  movement_type text not null check (movement_type in ('receive','consume','produce','adjust','transfer','dispose','sell')),
  quantity numeric(14,3) not null,
  unit text not null,
  reference_kind text,
  reference_id uuid,
  plot_id uuid references public.plots(id),
  animal_id uuid references public.animals(id),
  flock_id uuid references public.flocks(id),
  structure_id uuid references public.structures(id),
  occurred_at timestamptz not null default now(),
  recorded_by uuid references public.profiles(id),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.inventory_movements (farm_id, occurred_at desc);
create index on public.inventory_movements (lot_id, occurred_at desc);
create index on public.inventory_movements (reference_kind, reference_id);

create or replace function public.apply_inventory_movement()
returns trigger language plpgsql as $$
declare _delta numeric(14,3);
begin
  _delta := case new.movement_type
    when 'receive' then new.quantity
    when 'produce' then new.quantity
    when 'consume' then -new.quantity
    when 'dispose' then -new.quantity
    when 'sell' then -new.quantity
    when 'adjust' then new.quantity
    else 0
  end;
  update public.inventory_lots set quantity_remaining = quantity_remaining + _delta where id = new.lot_id;
  return new;
end; $$;
create trigger trg_apply_movement after insert on public.inventory_movements for each row execute function public.apply_inventory_movement();

-- Back-fill FKs
alter table public.health_events
  add constraint health_events_inventory_lot_fk
  foreign key (inventory_lot_id) references public.inventory_lots(id) on delete set null;

alter table public.ipm_logs
  add constraint ipm_logs_input_lot_fk
  foreign key (input_lot_id) references public.inventory_lots(id) on delete set null;

-- Batch lineage view
create or replace view public.inventory_lot_lineage as
with recursive lineage as (
  select id, id as ancestor_id, 0 as depth
  from public.inventory_lots
  union all
  select l.id, parent_id, lg.depth + 1
  from public.inventory_lots l
  join lineage lg on l.id = lg.id
  cross join unnest(coalesce(l.parent_lot_ids, '{}'::uuid[])) as parent_id
  where lg.depth < 20
)
select * from lineage where ancestor_id != id;
