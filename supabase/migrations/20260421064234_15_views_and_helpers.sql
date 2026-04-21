-- Active animals (exclude retired/deceased)
create or replace view public.v_animals_active as
select a.*, b.label as breed_label, s.label as species_label, st.name as structure_name
from public.animals a
left join public.breeds b on b.id = a.breed_id
left join public.species s on s.code = a.species_code
left join public.structures st on st.id = a.current_structure_id
where a.retired_at is null;

-- Daily herd yield (dairy)
create or replace view public.v_daily_milk as
select farm_id,
       date_trunc('day', occurred_at)::date as day,
       sum(quantity) filter (where not is_quarantined) as saleable_l,
       sum(quantity) filter (where is_quarantined) as quarantined_l,
       sum(quantity) as total_l,
       count(distinct animal_id) as contributing_animals
from public.production_events
where kind = 'milk'
group by 1, 2;

-- Upcoming heat windows (predicted)
create or replace view public.v_upcoming_estrus as
select a.id as animal_id, a.farm_id, a.tag, a.name, a.breed_id,
       be.predicted_window_start, be.predicted_window_end, be.ml_confidence
from public.animals a
join lateral (
  select * from public.breeding_events
  where animal_id = a.id
    and event_type = 'heat_predicted'
    and predicted_window_end > now()
  order by predicted_window_start asc limit 1
) be on true
where a.retired_at is null;

-- Animals currently quarantined (withdrawal)
create or replace view public.v_animals_quarantined as
select distinct on (a.id) a.id, a.farm_id, a.tag, a.name, he.withdrawal_until_milk, he.drug_name
from public.animals a
join public.health_events he on he.animal_id = a.id
where he.withdrawal_until_milk > now()
order by a.id, he.withdrawal_until_milk desc;

-- Inventory snapshot
create or replace view public.v_inventory_onhand as
select s.farm_id, s.id as sku_id, s.name, s.category, s.unit,
       coalesce(sum(l.quantity_remaining),0) as on_hand,
       min(l.expires_at) as earliest_expiry,
       s.reorder_point,
       coalesce(sum(l.quantity_remaining),0) < coalesce(s.reorder_point,0) as needs_reorder
from public.skus s
left join public.inventory_lots l on l.sku_id = s.id
group by s.farm_id, s.id;

-- P&L per cost center (this month)
create or replace view public.v_pnl_mtd as
select t.farm_id, t.cost_center_id, cc.label as cost_center,
       sum(case when t.txn_type = 'income' then t.amount else 0 end) as income,
       sum(case when t.txn_type = 'expense' then t.amount else 0 end) as expense,
       sum(case when t.txn_type = 'income' then t.amount else -t.amount end) as net
from public.transactions t
left join public.cost_centers cc on cc.id = t.cost_center_id
where t.occurred_at >= date_trunc('month', now())
group by 1, 2, 3;

-- Welfare latest rollup per species
create or replace view public.v_welfare_latest as
select distinct on (farm_id, species_code)
       farm_id, species_code, period_end,
       stress_free_hours_pct, panting_pct, crowding_pct, vocalization_pct
from public.welfare_rollups
order by farm_id, species_code, period_end desc;

-- Carbon net position
create or replace view public.v_carbon_net as
select farm_id,
       sum(case when direction = 'sequester' then tco2e else 0 end) as sequestered_tco2e,
       sum(case when direction = 'emit' then tco2e else 0 end) as emitted_tco2e,
       sum(case when direction = 'sequester' then tco2e else -tco2e end) as net_tco2e
from public.carbon_entries
where period_end >= date_trunc('year', now())
group by 1;

-- ============== Helper functions ==============
create or replace function public.sign_prescription(
  _farm_id uuid, _animal_id uuid, _drug_name text, _dose_value numeric, _dose_unit text,
  _route text, _frequency text, _duration_days int,
  _milk_withdrawal_hours int, _meat_withdrawal_days int,
  _inventory_lot_id uuid default null, _notes text default null
)
returns uuid language plpgsql security invoker as $$
declare _id uuid;
begin
  insert into public.health_events (
    farm_id, animal_id, event_type, occurred_at,
    drug_name, dose_value, dose_unit, route, frequency, duration_days,
    milk_withdrawal_hours, meat_withdrawal_days,
    withdrawal_until_milk, withdrawal_until_meat,
    inventory_lot_id, prescribed_by, prescription_signed_at, notes, source
  ) values (
    _farm_id, _animal_id, 'treatment', now(),
    _drug_name, _dose_value, _dose_unit, _route, _frequency, _duration_days,
    _milk_withdrawal_hours, _meat_withdrawal_days,
    now() + make_interval(days => _duration_days, hours => _milk_withdrawal_hours),
    now() + make_interval(days => _duration_days + _meat_withdrawal_days),
    _inventory_lot_id, auth.uid(), now(), _notes, 'vet'
  )
  returning id into _id;
  return _id;
end $$;

create or replace function public.record_milk(
  _farm_id uuid, _animal_id uuid, _litres numeric, _shift text default 'morning',
  _fat_pct numeric default null, _snf_pct numeric default null, _scc int default null,
  _structure_id uuid default null, _idempotency_key text default null
)
returns uuid language plpgsql security invoker as $$
declare _id uuid;
begin
  insert into public.production_events (
    farm_id, animal_id, kind, shift, occurred_at, quantity, unit, structure_id,
    quality, recorded_by, source, idempotency_key
  ) values (
    _farm_id, _animal_id, 'milk', _shift, now(), _litres, 'L', _structure_id,
    jsonb_strip_nulls(jsonb_build_object('fat_pct',_fat_pct,'snf_pct',_snf_pct,'scc',_scc)),
    auth.uid(), 'manual', _idempotency_key
  ) returning id into _id;
  return _id;
end $$;
