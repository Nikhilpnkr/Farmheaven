-- Enable RLS on every FarmHeaven table (skip postgis system table)
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename not in ('spatial_ref_sys')
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- PROFILES
create policy "profiles_self_read" on public.profiles for select using (id = auth.uid());
create policy "profiles_self_write" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_member_read" on public.profiles for select using (
  exists (
    select 1 from public.memberships m1
    join public.memberships m2 on m1.farm_id = m2.farm_id
    where m1.user_id = auth.uid() and m2.user_id = profiles.id and m1.is_active and m2.is_active
  )
);

-- ORGS
create policy "orgs_owner_all" on public.orgs for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- FARMS
create policy "farms_member_read" on public.farms for select using (public.is_member(id));
create policy "farms_owner_write" on public.farms for all
  using (public.is_member(id, array['owner','manager']::public.user_role[]))
  with check (public.is_member(id, array['owner','manager']::public.user_role[]));

-- MEMBERSHIPS
create policy "memberships_read_self_or_farm" on public.memberships for select using (
  user_id = auth.uid() or public.is_member(farm_id, array['owner','manager']::public.user_role[])
);
create policy "memberships_owner_write" on public.memberships for all
  using (public.is_member(farm_id, array['owner','manager']::public.user_role[]))
  with check (public.is_member(farm_id, array['owner','manager']::public.user_role[]));

-- Bulk policy generator for every farm_id-scoped table
do $$
declare t text; has_farm boolean;
  skip_tables text[] := array[
    'profiles','orgs','farms','memberships',
    'species','breeds','crops','certification_bodies','subsidy_schemes',
    'sensor_readings','sensor_readings_default',
    'audit_log','audit_log_default',
    'spatial_ref_sys'
  ];
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public' and not tablename = any(skip_tables)
  loop
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'farm_id'
    ) into has_farm;
    if has_farm then
      execute format('create policy %I on public.%I for select using (public.is_member(farm_id));', t||'_member_read', t);
      execute format('create policy %I on public.%I for all using (public.is_member(farm_id)) with check (public.is_member(farm_id));', t||'_member_write', t);
    end if;
  end loop;
end $$;

-- Public reference data
create policy "species_public_read" on public.species for select using (true);
create policy "breeds_public_read" on public.breeds for select using (true);
create policy "crops_public_read" on public.crops for select using (true);
create policy "cert_bodies_public_read" on public.certification_bodies for select using (true);
create policy "subsidy_schemes_public_read" on public.subsidy_schemes for select using (true);

-- Sensor readings + audit log
create policy "sensor_readings_member_read" on public.sensor_readings for select using (public.is_member(farm_id));
create policy "sensor_readings_member_write" on public.sensor_readings for insert with check (public.is_member(farm_id));
create policy "sensor_readings_default_read" on public.sensor_readings_default for select using (public.is_member(farm_id));
create policy "sensor_readings_default_write" on public.sensor_readings_default for insert with check (public.is_member(farm_id));
create policy "audit_read_owner" on public.audit_log for select using (public.is_member(farm_id, array['owner','manager','accountant']::public.user_role[]));
create policy "audit_read_owner_default" on public.audit_log_default for select using (public.is_member(farm_id, array['owner','manager','accountant']::public.user_role[]));
