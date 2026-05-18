'use server';

import { createClient } from '@farmheaven/db/server';
import { farmOnboardingSchema, type FarmOnboardingInput } from '@farmheaven/db/schemas';
import { revalidatePath } from 'next/cache';

export async function createFarm(input: FarmOnboardingInput) {
  const parsed = farmOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const data = parsed.data;

  // Ensure profile row exists (trigger handles this on signup, but defensive).
  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.phone ?? 'Owner',
      phone: user.phone ?? null,
      email: user.email ?? null,
    })
    .select()
    .single();

  // Org
  const { data: org, error: orgErr } = await supabase
    .from('orgs')
    .insert({ name: data.org_name, owner_id: user.id })
    .select('id')
    .single();
  if (orgErr || !org) {
    return { error: orgErr?.message ?? 'Failed to create organisation' };
  }

  // Farm
  const locationWkt =
    data.latitude != null && data.longitude != null
      ? `POINT(${data.longitude} ${data.latitude})`
      : null;

  const { data: farm, error: farmErr } = await supabase
    .from('farms')
    .insert({
      org_id: org.id,
      name: data.farm_name,
      slug: data.slug,
      total_acres: data.total_acres,
      address_line: data.address_line ?? null,
      pincode: data.pincode ?? null,
      state: data.state,
      country: data.country,
      location_geom: locationWkt,
    })
    .select('id')
    .single();
  if (farmErr || !farm) {
    return { error: farmErr?.message ?? 'Failed to create farm' };
  }

  // Membership
  const { error: memErr } = await supabase.from('memberships').insert({
    farm_id: farm.id,
    user_id: user.id,
    role: 'owner',
    is_active: true,
    accepted_at: new Date().toISOString(),
  });
  if (memErr) {
    return { error: memErr.message };
  }

  revalidatePath('/', 'layout');
  return { ok: true as const, farmId: farm.id };
}
