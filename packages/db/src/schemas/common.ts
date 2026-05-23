import { z } from 'zod';

// Shared primitive schemas reused across entities.
export const uuidSchema = z.string().uuid();

export const e164PhoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number (e.g. +919876543210)');

export const indianPincodeSchema = z.string().regex(/^[1-9]\d{5}$/, 'Pincode must be 6 digits');

export const currencyINR = z.number().nonnegative().multipleOf(0.01);

// Common enums mirrored from DB
export const userRoleSchema = z.enum([
  'owner',
  'manager',
  'worker',
  'vet',
  'agronomist',
  'accountant',
  'customer',
]);

export const sexSchema = z.enum(['male', 'female', 'unknown']);

export const langSchema = z.enum(['en', 'te', 'hi']);

export const speciesCodeSchema = z.enum([
  'cattle',
  'buffalo',
  'goat',
  'sheep',
  'poultry',
  'bee',
  'fish',
]);

export const animalLifecycleSchema = z.enum([
  'calf',
  'heifer',
  'lactating',
  'dry',
  'pregnant',
  'breeding_bull',
  'retired',
  'sold',
  'deceased',
]);

export const animalHealthStateSchema = z.enum([
  'healthy',
  'in_heat',
  'sick',
  'quarantined',
  'recovering',
  'weaning',
]);

export const eventSourceSchema = z.enum([
  'manual',
  'sensor',
  'rule',
  'ml',
  'external',
  'vet',
  'api',
  'import',
]);
