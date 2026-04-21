-- Fix views: make them security_invoker (RLS on base tables applies to the caller)
alter view public.v_animals_active set (security_invoker = on);
alter view public.v_daily_milk set (security_invoker = on);
alter view public.v_upcoming_estrus set (security_invoker = on);
alter view public.v_animals_quarantined set (security_invoker = on);
alter view public.v_inventory_onhand set (security_invoker = on);
alter view public.v_pnl_mtd set (security_invoker = on);
alter view public.v_welfare_latest set (security_invoker = on);
alter view public.v_carbon_net set (security_invoker = on);
alter view public.inventory_lot_lineage set (security_invoker = on);

-- Fix function search_paths
alter function public.set_updated_at() set search_path = public;
alter function public.apply_inventory_movement() set search_path = public;
alter function public.animals_sync_from_event() set search_path = public;
alter function public.auto_quarantine_production() set search_path = public;
alter function public.record_milk(uuid, uuid, numeric, text, numeric, numeric, integer, uuid, text) set search_path = public;
alter function public.sign_prescription(uuid, uuid, text, numeric, text, text, text, integer, integer, integer, uuid, text) set search_path = public;
alter function public.handle_new_user() set search_path = public;
alter function public.is_member(uuid, public.user_role[]) set search_path = public;
alter function public.current_farm_id() set search_path = public;

-- Add policies for tables that scope via parent FK
-- customer_addresses scopes via customer->farm
create policy "customer_addresses_read" on public.customer_addresses for select
  using (exists (select 1 from public.customers c where c.id = customer_id and public.is_member(c.farm_id)));
create policy "customer_addresses_write" on public.customer_addresses for all
  using (exists (select 1 from public.customers c where c.id = customer_id and public.is_member(c.farm_id)))
  with check (exists (select 1 from public.customers c where c.id = customer_id and public.is_member(c.farm_id)));

-- order_items scopes via order->farm
create policy "order_items_read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and public.is_member(o.farm_id)));
create policy "order_items_write" on public.order_items for all
  using (exists (select 1 from public.orders o where o.id = order_id and public.is_member(o.farm_id)))
  with check (exists (select 1 from public.orders o where o.id = order_id and public.is_member(o.farm_id)));

-- flock_fcr_rollups scopes via flock->farm
create policy "flock_fcr_rollups_read" on public.flock_fcr_rollups for select
  using (exists (select 1 from public.flocks f where f.id = flock_id and public.is_member(f.farm_id)));
create policy "flock_fcr_rollups_write" on public.flock_fcr_rollups for all
  using (exists (select 1 from public.flocks f where f.id = flock_id and public.is_member(f.farm_id)))
  with check (exists (select 1 from public.flocks f where f.id = flock_id and public.is_member(f.farm_id)));
