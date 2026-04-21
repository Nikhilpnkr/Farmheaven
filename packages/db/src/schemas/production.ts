import { z } from 'zod';
import { uuidSchema } from './common';

export const productionTypeSchema = z.enum([
  'milk',
  'egg',
  'weight',
  'meat',
  'honey',
  'manure',
  'fleece',
  'vegetable',
  'grain',
  'fruit',
]);

export const productionEventInsertSchema = z
  .object({
    animal_id: uuidSchema.optional(),
    flock_id: uuidSchema.optional(),
    plot_id: uuidSchema.optional(),
    kind: productionTypeSchema,
    shift: z.enum(['morning', 'evening', 'midday', 'all_day']).optional(),
    occurred_at: z.string().datetime().optional(),
    quantity: z.coerce.number().positive(),
    unit: z.enum(['L', 'kg', 'g', 'count', 'dozen']),
    structure_id: uuidSchema.optional(),
    // Milk quality
    fat_pct: z.coerce.number().min(0).max(15).optional(),
    snf_pct: z.coerce.number().min(0).max(15).optional(),
    scc: z.coerce.number().int().nonnegative().optional(),
    notes: z.string().max(2000).optional(),
    idempotency_key: z.string().max(200).optional(),
  })
  .refine((v) => v.animal_id || v.flock_id || v.plot_id, {
    message: 'Must reference animal, flock, or plot',
  });

// The shape the record_milk RPC accepts.
export const milkLogSchema = z.object({
  animal_id: uuidSchema,
  litres: z.coerce.number().positive().max(100),
  shift: z.enum(['morning', 'evening']),
  fat_pct: z.coerce.number().min(0).max(15).optional(),
  snf_pct: z.coerce.number().min(0).max(15).optional(),
  scc: z.coerce.number().int().nonnegative().optional(),
  structure_id: uuidSchema.optional(),
});

export type ProductionEventInsertInput = z.infer<typeof productionEventInsertSchema>;
export type MilkLogInput = z.infer<typeof milkLogSchema>;
