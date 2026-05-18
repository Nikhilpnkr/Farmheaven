-- Add a platform-tier admin flag to profiles.
-- super_admin is NOT a per-farm role; it lives outside the user_role enum.
-- See docs/superpowers/specs/2026-05-18-super-admin-design.md.

alter table public.profiles
  add column is_super_admin boolean not null default false;

-- Partial index so the middleware lookup stays cheap even as profiles grows.
-- Only the (small) set of super_admin rows is indexed.
create index if not exists profiles_is_super_admin_idx
  on public.profiles (id) where is_super_admin = true;
