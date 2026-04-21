import { z } from 'zod';
import { uuidSchema } from './common';

export const taskStatusSchema = z.enum(['backlog', 'today', 'in_progress', 'done', 'cancelled']);

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const taskInsertSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: taskStatusSchema.default('backlog'),
  priority: taskPrioritySchema.default('medium'),
  due_at: z.string().datetime().optional(),
  assigned_worker_id: uuidSchema.optional(),
  assigned_profile_id: uuidSchema.optional(),
  reference_kind: z.string().max(40).optional(),
  reference_id: uuidSchema.optional(),
});

export type TaskInsertInput = z.infer<typeof taskInsertSchema>;
