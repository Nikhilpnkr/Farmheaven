-- =============== IDENTITY ===============
-- Extends Supabase auth.users with app-specific profile.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email citext,
  preferred_lang text not null default 'en' check (preferred_lang in ('en','te','hi')),
  avatar_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create index on public.profiles using btree (phone);
create index on public.profiles using btree (email);

-- =============== ORGS & FARMS ===============
-- An org can own multiple farms (useful later for franchise / multi-site).
create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id),
  plan text not null default 'free',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_orgs_updated before update on public.orgs for each row execute function public.set_updated_at();

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  name text not null,
  slug text not null unique,
  location_geom geography(point, 4326),
  boundary_geom geography(polygon, 4326),
  total_acres numeric(10,2),
  address_line text,
  pincode text,
  state text default 'Telangana',
  country text default 'IN',
  timezone text default 'Asia/Kolkata',
  fiscal_year_start_month smallint default 4 check (fiscal_year_start_month between 1 and 12),
  primary_currency text not null default 'INR',
  default_langs text[] not null default array['en','te'],
  certifications jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_farms_updated before update on public.farms for each row execute function public.set_updated_at();
create index on public.farms using gist (location_geom);
create index on public.farms using gist (boundary_geom);
create index on public.farms (org_id) where deleted_at is null;

-- Membership = user's role on a farm. One user can be a worker on farm A and owner on farm B.
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  is_active boolean not null default true,
  scoped_animal_ids uuid[],
  scoped_module text[],
  invited_by uuid references public.profiles(id),
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, user_id)
);
create trigger trg_memberships_updated before update on public.memberships for each row execute function public.set_updated_at();
create index on public.memberships (user_id);
create index on public.memberships (farm_id);

-- Convenience security-definer function so RLS policies can check membership fast.
create or replace function public.is_member(_farm_id uuid, _roles public.user_role[] default null)
returns boolean
language plpgsql
stable security definer
set search_path = public
as $$
declare
  r public.user_role;
begin
  if auth.uid() is null then return false; end if;
  select role into r from public.memberships
    where farm_id = _farm_id and user_id = auth.uid() and is_active = true limit 1;
  if r is null then return false; end if;
  if _roles is null then return true; end if;
  return r = any(_roles);
end; $$;

-- Active farm for the current session.
create or replace function public.current_farm_id()
returns uuid
language sql
stable security definer
set search_path = public
as $$
  select farm_id from public.memberships
    where user_id = auth.uid() and is_active = true
    order by created_at asc limit 1;
$$;

-- Auto-provision profile on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.phone, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
