'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@farmheaven/db';
import { createClient } from '@farmheaven/db/server';
import { animalRegistrationSchema } from '@/lib/livestock/schemas';
import { getCurrentFarmIdFromMembership } from '@/lib/livestock/queries';

type Result = { ok: true; id: string } | { ok: false; error: string };

export async function createAnimal(input: unknown): Promise<Result> {
  const parsed = animalRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid_input' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_authenticated' };

  // supabase-js 2.105.x: @supabase/ssr's createServerClient returns the
  // 3-generic SupabaseClient shape, while query helpers declare the
  // 4-generic form. Same family of type-skew handled elsewhere via casts.
  const farmId = await getCurrentFarmIdFromMembership(
    supabase as never as SupabaseClient<Database>,
    user.id,
  );
  if (!farmId) return { ok: false, error: 'no_farm' };

  // Drop optional empties so we don't write empty strings into nullable cols.
  const data = parsed.data;
  const payload: Record<string, unknown> = {
    tag: data.tag,
    species_code: data.species_code,
    sex: data.sex,
    acquisition_kind: data.acquisition_kind,
    farm_id: farmId,
    created_by: user.id,
  };
  if (data.name) payload.name = data.name;
  if (data.breed_id) payload.breed_id = data.breed_id;
  if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
  if (data.current_structure_id) payload.current_structure_id = data.current_structure_id;

  // supabase-js 2.105.x type-skew workaround.
  const insertResult = await (
    supabase.from('animals') as never as {
      insert: (p: Record<string, unknown>) => {
        select: (cols: string) => {
          single: () => Promise<{
            data: { id: string } | null;
            error: { code: string; message: string } | null;
          }>;
        };
      };
    }
  )
    .insert(payload)
    .select('id')
    .single();

  if (insertResult.error) {
    if (insertResult.error.code === '23505') {
      return { ok: false, error: 'tag_taken' };
    }
    return { ok: false, error: insertResult.error.message };
  }
  if (!insertResult.data) return { ok: false, error: 'insert_returned_no_row' };

  revalidatePath('/livestock');
  return { ok: true, id: insertResult.data.id };
}
