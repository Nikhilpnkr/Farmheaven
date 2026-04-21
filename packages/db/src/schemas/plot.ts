import { z } from 'zod';
import { uuidSchema } from './common';

export const plotInsertSchema = z.object({
  code: z.string().min(1).max(32),
  name: z.string().min(1).max(80),
  area_acres: z.coerce.number().positive(),
  soil_type: z.enum(['red', 'black', 'alluvial', 'sandy', 'clay', 'loamy', 'other']).optional(),
  water_source: z.enum(['borewell', 'canal', 'rainfed', 'pond', 'river', 'mixed']).optional(),
  slope_pct: z.coerce.number().min(0).max(45).optional(),
  is_certified_organic: z.boolean().default(true),
});

export const cropCycleInsertSchema = z.object({
  plot_id: uuidSchema,
  crop_id: uuidSchema,
  variety: z.string().max(120).optional(),
  season: z.enum(['kharif', 'rabi', 'summer', 'perennial']).optional(),
  sowing_date: z.string().date().optional(),
  area_acres: z.coerce.number().positive().optional(),
  target_yield_kg: z.coerce.number().nonnegative().optional(),
});

export type PlotInsertInput = z.infer<typeof plotInsertSchema>;
export type CropCycleInsertInput = z.infer<typeof cropCycleInsertSchema>;
