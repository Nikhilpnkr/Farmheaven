import { animalRegistrationSchema } from '@/lib/livestock/schemas';
import { describe, expect, it } from 'vitest';

const minValid = {
  tag: 'C-0001',
  species_code: 'cattle' as const,
};

describe('animalRegistrationSchema', () => {
  it('accepts a minimum-valid payload and applies enum defaults', () => {
    const result = animalRegistrationSchema.safeParse(minValid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sex).toBe('unknown');
      expect(result.data.acquisition_kind).toBe('born_onfarm');
    }
  });

  it('rejects missing tag', () => {
    const result = animalRegistrationSchema.safeParse({ species_code: 'cattle' });
    expect(result.success).toBe(false);
  });

  it('rejects empty tag', () => {
    const result = animalRegistrationSchema.safeParse({ ...minValid, tag: '' });
    expect(result.success).toBe(false);
  });

  it('rejects tag longer than 40 chars', () => {
    const result = animalRegistrationSchema.safeParse({ ...minValid, tag: 'x'.repeat(41) });
    expect(result.success).toBe(false);
  });

  it('rejects unknown species_code', () => {
    const result = animalRegistrationSchema.safeParse({ ...minValid, species_code: 'unicorn' });
    expect(result.success).toBe(false);
  });

  it('accepts each of the seven valid species codes', () => {
    const codes = ['cattle', 'buffalo', 'goat', 'sheep', 'poultry', 'fish', 'bee'] as const;
    for (const code of codes) {
      const result = animalRegistrationSchema.safeParse({ tag: 'T', species_code: code });
      expect(result.success).toBe(true);
    }
  });

  it('coerces empty-string optionals to undefined (form submission case)', () => {
    const result = animalRegistrationSchema.safeParse({
      ...minValid,
      breed_id: '',
      date_of_birth: '',
      current_structure_id: '',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.breed_id).toBeUndefined();
      expect(result.data.date_of_birth).toBeUndefined();
      expect(result.data.current_structure_id).toBeUndefined();
    }
  });

  it('rejects non-UUID breed_id', () => {
    const result = animalRegistrationSchema.safeParse({ ...minValid, breed_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects malformed date_of_birth', () => {
    const result = animalRegistrationSchema.safeParse({
      ...minValid,
      date_of_birth: '23-05-2026',
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown acquisition_kind', () => {
    const result = animalRegistrationSchema.safeParse({
      ...minValid,
      acquisition_kind: 'stolen',
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown sex value', () => {
    const result = animalRegistrationSchema.safeParse({ ...minValid, sex: 'hermaphrodite' });
    expect(result.success).toBe(false);
  });
});
