// Map domain statuses to Badge variants from @farmheaven/ui.
// Keeps the badge call sites declarative: <Badge variant={ANIMAL_STATUS_VARIANT[a.status]}>
// instead of a switch in every list/profile component.

import type { badgeVariants } from '@farmheaven/ui/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

// Animal lifecycle / health status → Badge variant
export const ANIMAL_STATUS_VARIANT = {
  active: 'success',
  healthy: 'success',
  in_heat: 'warning',
  pregnant: 'info',
  sick: 'destructive',
  withdrawal: 'destructive',
  weaning: 'secondary',
  dry: 'secondary',
  sold: 'outline',
  dead: 'outline',
  culled: 'outline',
  retired: 'outline',
} as const satisfies Record<string, BadgeVariant>;

export type AnimalStatus = keyof typeof ANIMAL_STATUS_VARIANT;
