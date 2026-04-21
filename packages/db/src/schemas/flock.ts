import { z } from 'zod';
import { speciesCodeSchema, uuidSchema } from './common';

export const flockPurposeSchema = z.enum([
  'layer',
  'broiler',
  'breeding',
  'meat_goat',
  'dairy_goat',
  'meat_sheep',
  'wool_sheep',
  'dual_purpose',
]);

export const flockInsertSchema = z.object({
  code: z.string().min(1).max(32),
  name: z.string().max(80).optional(),
  species_code: speciesCodeSchema,
  breed_id: uuidSchema.optional(),
  purpose: flockPurposeSchema,
  structure_id: uuidSchema.optional(),
  date_placed: z.string().date(),
  expected_exit_date: z.string().date().optional(),
  headcount_initial: z.coerce.number().int().positive(),
  target_fcr: z.coerce.number().positive().optional(),
});

export type FlockInsertInput = z.infer<typeof flockInsertSchema>;
