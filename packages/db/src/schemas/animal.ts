import { z } from 'zod';
import { sexSchema, speciesCodeSchema, uuidSchema } from './common';

export const animalInsertSchema = z.object({
  tag: z.string().min(1).max(32),
  name: z.string().max(80).optional(),
  species_code: speciesCodeSchema,
  breed_id: uuidSchema.optional(),
  sex: sexSchema.default('unknown'),
  date_of_birth: z.string().date().optional(),
  acquired_at: z.string().date().optional(),
  acquisition_kind: z
    .enum(['born_onfarm', 'purchased', 'gifted', 'transferred'])
    .default('born_onfarm'),
  acquisition_cost: z.coerce.number().nonnegative().optional(),
  acquisition_source: z.string().max(200).optional(),
  current_structure_id: uuidSchema.optional(),
  dam_id: uuidSchema.optional(),
  sire_id: uuidSchema.optional(),
  rfid_tag: z.string().max(64).optional(),
});

export type AnimalInsertInput = z.infer<typeof animalInsertSchema>;
