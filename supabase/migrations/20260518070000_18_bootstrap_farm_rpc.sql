-- Bootstrap RPC for first-farm onboarding.
--
-- The RLS policies in migration 14 (`farms_owner_write`, `memberships_owner_write`)
-- gate INSERTs on `is_member(farm_id, ['owner','manager'])`. That check is
-- unwinnable for the very first farm a user creates: no membership row can
-- exist until the farm exists, and the farm INSERT itself is denied. This
-- function runs as `security definer` to perform the org → farm → membership
-- bootstrap atomically. RLS stays strict everywhere else.

create or replace function public.bootstrap_farm(
  _org_name text,
  _farm_name text,
  _slug text,
  _total_acres numeric,
  _address_line text default null,
  _pincode text default null,
  _state text default 'Telangana',
  _country text default 'IN',
  _latitude numeric default null,
  _longitude numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _org_id uuid;
  _farm_id uuid;
  _location geography;
begin
  if _uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  -- Profile row must exist for the orgs.owner_id and memberships.user_id FKs.
  -- The handle_new_user trigger creates it on signup; this is defensive.
  insert into public.profiles (id, full_name)
  values (_uid, 'Owner')
  on conflict (id) do nothing;

  insert into public.orgs (name, owner_id)
  values (_org_name, _uid)
  returning id into _org_id;

  if _latitude is not null and _longitude is not null then
    _location := st_setsrid(st_makepoint(_longitude, _latitude), 4326)::geography;
  end if;

  begin
    insert into public.farms (
      org_id, name, slug, total_acres,
      address_line, pincode, state, country,
      location_geom
    )
    values (
      _org_id, _farm_name, _slug, _total_acres,
      _address_line, _pincode, _state, _country,
      _location
    )
    returning id into _farm_id;
  exception when unique_violation then
    raise exception 'slug_taken' using errcode = 'P0001';
  end;

  insert into public.memberships (farm_id, user_id, role, is_active, accepted_at)
  values (_farm_id, _uid, 'owner', true, now());

  return _farm_id;
end;
$$;

-- Supabase auto-grants EXECUTE to anon and authenticated on creation. Revoke
-- both, then re-grant only to authenticated.
revoke all on function public.bootstrap_farm(
  text, text, text, numeric, text, text, text, text, numeric, numeric
) from public, anon;
grant execute on function public.bootstrap_farm(
  text, text, text, numeric, text, text, text, text, numeric, numeric
) to authenticated;
