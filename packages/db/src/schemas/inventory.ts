import { z } from 'zod';
import { uuidSchema } from './common';

export const inventoryCategorySchema = z.enum([
  'feed',
  'seed',
  'medicine',
  'vaccine',
  'fertilizer',
  'bio_input',
  'packaging',
  'equipment',
  'harvested_produce',
  'processed_goods',
  'other',
]);

export const skuInsertSchema = z.object({
  code: z.string().min(1).max(32),
  name: z.string().min(1).max(120),
  category: inventoryCategorySchema,
  unit: z.enum(['kg', 'g', 'L', 'mL', 'count', 'dozen', 'bottle', 'bag']),
  is_withdrawal_tracked: z.boolean().default(false),
  default_withdrawal_milk_hours: z.coerce.number().int().nonnegative().optional(),
  default_withdrawal_meat_days: z.coerce.number().int().nonnegative().optional(),
  reorder_point: z.coerce.number().nonnegative().optional(),
  reorder_qty: z.coerce.number().nonnegative().optional(),
  preferred_supplier_id: uuidSchema.optional(),
  is_organic_compliant: z.boolean().default(true),
});

export const lotReceiveSchema = z.object({
  sku_id: uuidSchema,
  supplier_id: uuidSchema.optional(),
  supplier_batch_ref: z.string().max(80).optional(),
  internal_batch: z.string().min(1).max(80),
  quantity_initial: z.coerce.number().positive(),
  unit: z.string().max(16),
  unit_cost: z.coerce.number().nonnegative().optional(),
  received_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
  location: z.string().max(120).optional(),
});

export type SkuInsertInput = z.infer<typeof skuInsertSchema>;
export type LotReceiveInput = z.infer<typeof lotReceiveSchema>;
