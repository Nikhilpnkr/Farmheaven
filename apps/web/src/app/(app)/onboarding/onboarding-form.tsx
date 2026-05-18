'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { farmOnboardingSchema, type FarmOnboardingInput } from '@farmheaven/db/schemas';
import { Button } from '@farmheaven/ui/components/ui/button';
import { Input } from '@farmheaven/ui/components/ui/input';
import { Label } from '@farmheaven/ui/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createFarm } from './actions';

export function OnboardingForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FarmOnboardingInput>({
    resolver: zodResolver(farmOnboardingSchema),
    defaultValues: {
      state: 'Telangana',
      country: 'IN',
      total_acres: 72,
    },
  });

  const farmName = watch('farm_name');

  // Auto-suggest slug from farm name
  const suggestSlug = () => {
    const slug = farmName
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    if (slug) setValue('slug', slug);
  };

  const onSubmit = async (data: FarmOnboardingInput) => {
    const result = await createFarm(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Farm created. Welcome to FarmHeaven.');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="org_name" className="mb-1 block">Organisation name</Label>
          <Input id="org_name" {...register('org_name')} placeholder="FarmHeaven Pvt Ltd" />
          {errors.org_name ? <p className="mt-1 text-xs text-destructive">{errors.org_name.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="farm_name" className="mb-1 block">Farm name</Label>
          <Input
            id="farm_name"
            {...register('farm_name')}
            placeholder="FarmHeaven · Hyderabad"
            onBlur={suggestSlug}
          />
          {errors.farm_name ? <p className="mt-1 text-xs text-destructive">{errors.farm_name.message}</p> : null}
        </div>
      </div>

      <div>
        <Label htmlFor="slug" className="mb-1 block">Slug</Label>
        <Input id="slug" {...register('slug')} placeholder="farmheaven-hyd" />
        <p className="mt-1 text-xs text-muted-foreground">Used in URLs. Lowercase letters, numbers, hyphens.</p>
        {errors.slug ? <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="total_acres" className="mb-1 block">Total acres</Label>
          <Input id="total_acres" type="number" step="0.01" {...register('total_acres')} />
          {errors.total_acres ? <p className="mt-1 text-xs text-destructive">{errors.total_acres.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="pincode" className="mb-1 block">Pincode</Label>
          <Input id="pincode" {...register('pincode')} placeholder="500075" />
          {errors.pincode ? <p className="mt-1 text-xs text-destructive">{errors.pincode.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="state" className="mb-1 block">State</Label>
          <Input id="state" {...register('state')} />
        </div>
      </div>

      <div>
        <Label htmlFor="address_line" className="mb-1 block">Address (optional)</Label>
        <Input id="address_line" {...register('address_line')} placeholder="Village, Mandal, District" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="latitude" className="mb-1 block">Latitude (optional)</Label>
          <Input id="latitude" type="number" step="0.000001" {...register('latitude')} placeholder="17.458" />
        </div>
        <div>
          <Label htmlFor="longitude" className="mb-1 block">Longitude (optional)</Label>
          <Input id="longitude" type="number" step="0.000001" {...register('longitude')} placeholder="78.328" />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Create farm
      </Button>
    </form>
  );
}
