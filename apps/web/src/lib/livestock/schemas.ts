import { z } from 'zod';

// Zod schema for the Register Animal form.
//
// Enum values match the live DB constraints exactly:
//   - species_code: the seven rows in public.species (verified 2026-05-19)
//   - sex: public.sex enum (male | female | unknown), default 'unknown'
//   - acquisition_kind: animals_acquisition_kind_check CHECK constraint
//     allows exactly ('born_onfarm', 'purchased', 'gifted', 'transferred')
//
// Everything else (dam/sire, rfid, cost/source, lactation_* fields)
// is filled later via events or /admin and intentionally omitted here.
export const animalRegistrationSchema = z.object({
  tag: z.string().min(1, 'Tag is required').max(40),
  name: z.string().max(80).optional(),
  species_code: z.enum(['cattle', 'buffalo', 'goat', 'sheep', 'poultry', 'fish', 'bee']),
  breed_id: z.string().uuid().optional(),
  sex: z.enum(['male', 'female', 'unknown']).default('unknown'),
  date_of_birth: z.string().date().optional(),
  current_structure_id: z.string().uuid().optional(),
  acquisition_kind: z.enum(['born_onfarm', 'purchased', 'gifted', 'transferred']).default('born_onfarm'),
});

export type AnimalRegistrationInput = z.infer<typeof animalRegistrationSchema>;

// Human labels for the acquisition_kind enum (used by the form).
export const ACQUISITION_KIND_LABELS: Record<AnimalRegistrationInput['acquisition_kind'], string> = {
  born_onfarm: 'Born on farm',
  purchased: 'Purchased',
  gifted: 'Gifted',
  transferred: 'Transferred',
};

// Human labels for sex.
export const SEX_LABELS: Record<AnimalRegistrationInput['sex'], string> = {
  female: 'Female',
  male: 'Male',
  unknown: 'Unknown',
};
