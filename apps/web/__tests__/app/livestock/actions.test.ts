import { beforeEach, describe, expect, it, vi } from 'vitest';

// The action transitively imports next/cache (revalidatePath) and the Supabase
// server client. Stub them so the module loads in Node. Per CLAUDE.md we don't
// mock DB *responses* — these stubs would throw if called, which is exactly
// what we want: the test only exercises the validation branch that returns
// BEFORE any DB call.
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@farmheaven/db/server', () => ({
  createClient: vi.fn(() => {
    throw new Error('createClient must not be called when input validation fails');
  }),
}));

vi.mock('@/lib/livestock/queries', () => ({
  getCurrentFarmIdFromMembership: vi.fn(() => {
    throw new Error('membership lookup must not be called when input validation fails');
  }),
}));

import { createAnimal } from '@/app/(app)/livestock/actions';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createAnimal — validation branch', () => {
  it('returns invalid_input for missing required fields', async () => {
    const result = await createAnimal({});
    expect(result).toEqual({ ok: false, error: 'invalid_input' });
  });

  it('returns invalid_input when tag is empty', async () => {
    const result = await createAnimal({ tag: '', species_code: 'cattle' });
    expect(result).toEqual({ ok: false, error: 'invalid_input' });
  });

  it('returns invalid_input when species_code is unknown', async () => {
    const result = await createAnimal({ tag: 'C-0001', species_code: 'unicorn' });
    expect(result).toEqual({ ok: false, error: 'invalid_input' });
  });

  it('returns invalid_input when breed_id is non-UUID', async () => {
    const result = await createAnimal({
      tag: 'C-0001',
      species_code: 'cattle',
      breed_id: 'not-a-uuid',
    });
    expect(result).toEqual({ ok: false, error: 'invalid_input' });
  });

  it('returns invalid_input for entirely non-object input', async () => {
    expect(await createAnimal(null)).toEqual({ ok: false, error: 'invalid_input' });
    expect(await createAnimal('hello')).toEqual({ ok: false, error: 'invalid_input' });
    expect(await createAnimal(42)).toEqual({ ok: false, error: 'invalid_input' });
  });
});
