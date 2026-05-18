'use server';

import { createClient } from '@farmheaven/db/server';
import type { Database } from '@farmheaven/db';
import { farmOnboardingSchema, type FarmOnboardingInput } from '@farmheaven/db/schemas';
import { revalidatePath } from 'next/cache';

type BootstrapFarmArgs = Database['public']['Functions']['bootstrap_farm']['Args'];

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

  const args: BootstrapFarmArgs = {
    _org_name: data.org_name,
    _farm_name: data.farm_name,
    _slug: data.slug,
    _total_acres: data.total_acres,
    _address_line: data.address_line,
    _pincode: data.pincode,
    _state: data.state,
    _country: data.country,
    _latitude: data.latitude,
    _longitude: data.longitude,
  };

  // supabase-js 2.105.x has broken rpc<FnName, Args> inference: Args defaults
  // to `never`, so `args?: Args` collapses to `undefined` and a real args
  // object is rejected at compile time. The `as never` cast lets the call
  // typecheck; runtime is unaffected because `args` is validated above.
  const { data: farmId, error } = await supabase.rpc('bootstrap_farm', args as never);

  if (error) {
    if (error.message === 'slug_taken') {
      return { error: 'That slug is already taken. Try another.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { ok: true as const, farmId: farmId as string };
}
