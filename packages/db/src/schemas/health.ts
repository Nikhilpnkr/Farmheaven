import { z } from 'zod';
import { uuidSchema } from './common';

export const healthEventTypeSchema = z.enum([
  'observation',
  'symptom',
  'diagnosis',
  'treatment',
  'vaccination',
  'deworming',
  'surgery',
  'recovery',
  'quarantine',
  'death',
]);

export const healthEventInsertSchema = z
  .object({
    animal_id: uuidSchema.optional(),
    flock_id: uuidSchema.optional(),
    event_type: healthEventTypeSchema,
    occurred_at: z.string().datetime().optional(),
    diagnosis: z.string().max(400).optional(),
    symptoms: z.array(z.string()).optional(),
    body_condition_score: z.coerce.number().min(1).max(5).optional(),
    temperature_c: z.coerce.number().min(30).max(45).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine((v) => v.animal_id || v.flock_id, {
    message: 'Either animal_id or flock_id is required',
  });

// Vet prescription — tighter contract that triggers the withdrawal function.
export const prescriptionSchema = z.object({
  farm_id: uuidSchema,
  animal_id: uuidSchema,
  drug_name: z.string().min(1).max(200),
  dose_value: z.coerce.number().positive(),
  dose_unit: z.enum(['mL', 'mg', 'g', 'IU', 'tablet']),
  route: z.enum(['oral', 'IM', 'IV', 'SC', 'topical']),
  frequency: z.enum(['SID', 'BID', 'TID', 'QID']),
  duration_days: z.coerce.number().int().positive().max(30),
  milk_withdrawal_hours: z.coerce.number().int().nonnegative().max(2000),
  meat_withdrawal_days: z.coerce.number().int().nonnegative().max(90),
  inventory_lot_id: uuidSchema.optional(),
  notes: z.string().max(2000).optional(),
});

export type HealthEventInsertInput = z.infer<typeof healthEventInsertSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
