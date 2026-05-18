-- Fix handle_new_user trigger for phone-only signup.
--
-- The original trigger (defined in migration 02_identity_and_farms) computed
-- full_name as:
--   coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
--
-- For phone-only OTP signups (no email, no name in metadata) this evaluates to
-- coalesce(NULL, NULL) = NULL, which violates profiles.full_name NOT NULL and
-- crashes the user creation transaction with:
--   500: Database error saving new user
--
-- Extend the coalesce chain to fall back to the phone number, and then to a
-- literal placeholder so the constraint is never violated. The real name gets
-- collected during the onboarding flow and updates the row later.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      nullif(split_part(new.email, '@', 1), ''),
      new.phone,
      'New user'
    ),
    new.phone,
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
