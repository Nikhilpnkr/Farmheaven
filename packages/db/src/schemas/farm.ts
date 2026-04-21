import { z } from 'zod';
import { indianPincodeSchema } from './common';

export const farmOnboardingSchema = z.object({
  org_name: z.string().min(2).max(120),
  farm_name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z][a-z0-9-]*$/, 'Lowercase letters, numbers, hyphens only'),
  total_acres: z.coerce.number().positive().max(100000),
  address_line: z.string().max(240).optional(),
  pincode: indianPincodeSchema.optional(),
  state: z.string().default('Telangana'),
  country: z.string().default('IN'),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export type FarmOnboardingInput = z.infer<typeof farmOnboardingSchema>;

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().optional(),
  preferred_lang: z.enum(['en', 'te', 'hi']).default('en'),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
