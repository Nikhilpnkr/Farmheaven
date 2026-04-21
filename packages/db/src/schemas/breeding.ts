import { z } from 'zod';
import { uuidSchema } from './common';

export const breedingEventTypeSchema = z.enum([
  'heat_observed',
  'heat_predicted',
  'service',
  'natural_mating',
  'pregnancy_check',
  'abortion',
  'parturition',
  'weaning',
]);

export const breedingEventInsertSchema = z.object({
  animal_id: uuidSchema,
  event_type: breedingEventTypeSchema,
  occurred_at: z.string().datetime().optional(),
  sire_id: uuidSchema.optional(),
  semen_straw_batch: z.string().max(80).optional(),
  semen_breed: z.string().max(80).optional(),
  pregnancy_outcome: z.enum(['positive', 'negative', 'retest', 'lost']).optional(),
  offspring_count: z.coerce.number().int().min(0).max(10).optional(),
  notes: z.string().max(2000).optional(),
});

export type BreedingEventInsertInput = z.infer<typeof breedingEventInsertSchema>;
