import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@farmheaven/db';

const COUNT_CAP = 10_000;
const PAGE_SIZE_MAX = 200;

export type AnimalListRow = {
  id: string;
  tag: string;
  name: string | null;
  species_code: string;
  species_label: string;
  sex: 'male' | 'female' | 'unknown';
  date_of_birth: string | null;
  current_structure_id: string | null;
  structure_name: string | null;
  breed_id: string | null;
  breed_label: string | null;
  health_state: string;
  retired_at: string | null;
};

export type AnimalDetail = AnimalListRow & {
  rfid_tag: string | null;
  lifecycle: string | null;
  acquisition_kind: string | null;
  acquired_at: string | null;
  acquisition_cost: number | null;
  acquisition_source: string | null;
  dam: { id: string; tag: string; name: string | null } | null;
  sire: { id: string; tag: string; name: string | null } | null;
  created_at: string;
  created_by: string | null;
  created_by_name: string | null;
  updated_at: string;
};

export type ListAnimalsParams = {
  farmId: string;
  page: number;
  size: number;
  search?: string;
  species?: string;
  includeRetired?: boolean;
  order?: 'tag' | 'date_of_birth';
  dir?: 'asc' | 'desc';
};

export type ListAnimalsResult = {
  rows: AnimalListRow[];
  totalCount: number;
};

export async function listAnimals(
  supabase: SupabaseClient<Database>,
  params: ListAnimalsParams,
): Promise<ListAnimalsResult> {
  const {
    farmId,
    page,
    size,
    search,
    species,
    includeRetired = false,
    order = 'tag',
    dir = 'asc',
  } = params;

  const clampedSize = Math.min(PAGE_SIZE_MAX, Math.max(1, size));
  const offset = (Math.max(1, page) - 1) * clampedSize;

  // Type cast — supabase-js 2.105.x has a known type-skew defect with
  // .from(...).select(...) chains (see admin-client.ts + onboarding/actions.ts).
  let query = (supabase
    .from('animals')
    .select(
      `id, tag, name, species_code, sex, date_of_birth, current_structure_id,
       breed_id, health_state, retired_at,
       species:species_code (label),
       breed:breed_id (label),
       structure:current_structure_id (name)`,
      { count: 'estimated' },
    ) as never) as {
      eq: (col: string, val: unknown) => typeof query;
      is: (col: string, val: unknown) => typeof query;
      ilike: (col: string, pattern: string) => typeof query;
      or: (filter: string) => typeof query;
      order: (col: string, opts: { ascending: boolean }) => typeof query;
      range: (from: number, to: number) => Promise<{
        data: Array<Record<string, unknown>> | null;
        count: number | null;
        error: { message: string } | null;
      }>;
    };

  query = query.eq('farm_id', farmId);
  if (!includeRetired) query = query.is('retired_at', null);
  if (species) query = query.eq('species_code', species);
  if (search && search.trim()) {
    const pattern = `%${search.trim().replace(/[%_]/g, '\\$&')}%`;
    query = query.or(`tag.ilike.${pattern},name.ilike.${pattern}`);
  }
  query = query.order(order, { ascending: dir === 'asc' });

  const result = await query.range(offset, offset + clampedSize - 1);
  if (result.error) {
    throw new Error(`listAnimals failed: ${result.error.message}`);
  }

  const rows: AnimalListRow[] = (result.data ?? []).map((row) => {
    const speciesJoin = row.species as { label?: string } | null;
    const breedJoin = row.breed as { label?: string } | null;
    const structureJoin = row.structure as { name?: string } | null;
    return {
      id: String(row.id),
      tag: String(row.tag),
      name: row.name === null ? null : String(row.name),
      species_code: String(row.species_code),
      species_label: speciesJoin?.label ?? String(row.species_code),
      sex: row.sex as 'male' | 'female' | 'unknown',
      date_of_birth: row.date_of_birth === null ? null : String(row.date_of_birth),
      current_structure_id: row.current_structure_id === null ? null : String(row.current_structure_id),
      structure_name: structureJoin?.name ?? null,
      breed_id: row.breed_id === null ? null : String(row.breed_id),
      breed_label: breedJoin?.label ?? null,
      health_state: String(row.health_state),
      retired_at: row.retired_at === null ? null : String(row.retired_at),
    };
  });

  return { rows, totalCount: Math.min(COUNT_CAP, result.count ?? 0) };
}

export async function getAnimal(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<AnimalDetail | null> {
  const result = await (supabase
    .from('animals')
    .select(
      `id, tag, name, species_code, sex, date_of_birth, current_structure_id,
       breed_id, health_state, retired_at, rfid_tag, lifecycle,
       acquisition_kind, acquired_at, acquisition_cost, acquisition_source,
       created_at, created_by, updated_at,
       species:species_code (label),
       breed:breed_id (label),
       structure:current_structure_id (name),
       dam:dam_id (id, tag, name),
       sire:sire_id (id, tag, name),
       created_by_profile:created_by (full_name)`,
    )
    .eq('id', id)
    .maybeSingle() as never) as Promise<{
      data: Record<string, unknown> | null;
      error: { message: string } | null;
    }>;

  const { data: row, error } = await result;
  if (error) throw new Error(`getAnimal failed: ${error.message}`);
  if (!row) return null;

  const speciesJoin = row.species as { label?: string } | null;
  const breedJoin = row.breed as { label?: string } | null;
  const structureJoin = row.structure as { name?: string } | null;
  const damJoin = row.dam as { id: string; tag: string; name: string | null } | null;
  const sireJoin = row.sire as { id: string; tag: string; name: string | null } | null;
  const creatorJoin = row.created_by_profile as { full_name?: string } | null;

  return {
    id: String(row.id),
    tag: String(row.tag),
    name: row.name === null ? null : String(row.name),
    species_code: String(row.species_code),
    species_label: speciesJoin?.label ?? String(row.species_code),
    sex: row.sex as 'male' | 'female' | 'unknown',
    date_of_birth: row.date_of_birth === null ? null : String(row.date_of_birth),
    current_structure_id: row.current_structure_id === null ? null : String(row.current_structure_id),
    structure_name: structureJoin?.name ?? null,
    breed_id: row.breed_id === null ? null : String(row.breed_id),
    breed_label: breedJoin?.label ?? null,
    health_state: String(row.health_state),
    retired_at: row.retired_at === null ? null : String(row.retired_at),
    rfid_tag: row.rfid_tag === null ? null : String(row.rfid_tag),
    lifecycle: row.lifecycle === null ? null : String(row.lifecycle),
    acquisition_kind: row.acquisition_kind === null ? null : String(row.acquisition_kind),
    acquired_at: row.acquired_at === null ? null : String(row.acquired_at),
    acquisition_cost: row.acquisition_cost === null ? null : Number(row.acquisition_cost),
    acquisition_source: row.acquisition_source === null ? null : String(row.acquisition_source),
    dam: damJoin ? { id: String(damJoin.id), tag: String(damJoin.tag), name: damJoin.name ?? null } : null,
    sire: sireJoin ? { id: String(sireJoin.id), tag: String(sireJoin.tag), name: sireJoin.name ?? null } : null,
    created_at: String(row.created_at),
    created_by: row.created_by === null ? null : String(row.created_by),
    created_by_name: creatorJoin?.full_name ?? null,
    updated_at: String(row.updated_at),
  };
}

export async function listSpeciesForForm(
  supabase: SupabaseClient<Database>,
): Promise<Array<{ code: string; label: string }>> {
  const result = await (supabase
    .from('species')
    .select('code, label')
    .order('label', { ascending: true }) as never) as Promise<{
      data: Array<{ code: string; label: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listSpeciesForForm failed: ${error.message}`);
  return data ?? [];
}

export async function listBreedsForForm(
  supabase: SupabaseClient<Database>,
): Promise<Array<{ id: string; species_code: string; label: string }>> {
  const result = await (supabase
    .from('breeds')
    .select('id, species_code, label')
    .order('label', { ascending: true }) as never) as Promise<{
      data: Array<{ id: string; species_code: string; label: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listBreedsForForm failed: ${error.message}`);
  return data ?? [];
}

export async function listStructuresForFarm(
  supabase: SupabaseClient<Database>,
  farmId: string,
): Promise<Array<{ id: string; name: string; kind: string }>> {
  const result = await (supabase
    .from('structures')
    .select('id, name, kind')
    .eq('farm_id', farmId)
    .is('deleted_at', null)
    .order('name', { ascending: true }) as never) as Promise<{
      data: Array<{ id: string; name: string; kind: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listStructuresForFarm failed: ${error.message}`);
  return data ?? [];
}

export async function getCurrentFarmIdFromMembership(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string | null> {
  const result = await (supabase
    .from('memberships')
    .select('farm_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle() as never) as Promise<{
      data: { farm_id: string } | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`getCurrentFarmIdFromMembership failed: ${error.message}`);
  return data?.farm_id ?? null;
}
