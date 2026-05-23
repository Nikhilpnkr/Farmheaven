'use client';

import {
  ACQUISITION_KIND_LABELS,
  type AnimalRegistrationInput,
  SEX_LABELS,
  animalRegistrationSchema,
} from '@/lib/livestock/schemas';
import { Button } from '@farmheaven/ui/components/ui/button';
import { Input } from '@farmheaven/ui/components/ui/input';
import { Label } from '@farmheaven/ui/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@farmheaven/ui/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createAnimal } from '../actions';

type Lookup<T> = readonly T[];

type Props = {
  species: Lookup<{ code: string; label: string }>;
  breeds: Lookup<{ id: string; species_code: string; label: string }>;
  structures: Lookup<{ id: string; name: string; kind: string }>;
};

const DEFAULTS: AnimalRegistrationInput = {
  tag: '',
  name: undefined,
  species_code: 'cattle',
  breed_id: undefined,
  sex: 'unknown',
  date_of_birth: undefined,
  current_structure_id: undefined,
  acquisition_kind: 'born_onfarm',
};

export function RegisterAnimalSheet({ species, breeds, structures }: Props) {
  const [open, setOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<AnimalRegistrationInput>({
    resolver: zodResolver(animalRegistrationSchema),
    defaultValues: DEFAULTS,
  });

  const selectedSpecies = watch('species_code');
  const filteredBreeds = breeds.filter((b) => b.species_code === selectedSpecies);

  // Refocus the tag field whenever the sheet opens.
  useEffect(() => {
    if (open) {
      setGlobalError(null);
      setTimeout(() => setFocus('tag'), 50);
    }
  }, [open, setFocus]);

  async function submit(values: AnimalRegistrationInput, addAnother: boolean): Promise<void> {
    setGlobalError(null);
    startTransition(async () => {
      const result = await createAnimal(values);
      if (result.ok) {
        toast.success(`${values.name || values.tag} added`);
        if (addAnother) {
          // Keep sheet open; reset most fields but sticky the structure /
          // acquisition / species values so the next entry is fast.
          reset({
            ...DEFAULTS,
            species_code: values.species_code,
            current_structure_id: values.current_structure_id,
            acquisition_kind: values.acquisition_kind,
          });
          setTimeout(() => setFocus('tag'), 50);
        } else {
          setOpen(false);
          reset(DEFAULTS);
        }
        return;
      }
      if (result.error === 'tag_taken') {
        setError('tag', { type: 'manual', message: 'Tag already used on this farm' });
        setTimeout(() => setFocus('tag'), 50);
      } else if (result.error === 'not_authenticated' || result.error === 'no_farm') {
        toast.error('Session issue — please refresh and sign in again.');
        setOpen(false);
      } else if (result.error === 'invalid_input') {
        setGlobalError('Form has invalid values. Check each field.');
      } else {
        // Unknown error — show something safe rather than leaking raw PG.
        setGlobalError('Could not save this animal. Try again, or check /admin if it persists.');
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">+ Register animal</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Register animal</SheetTitle>
          <SheetDescription>
            Required: tag, species, sex. Everything else can be filled later.
          </SheetDescription>
        </SheetHeader>

        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleSubmit((values) => submit(values, false))}
        >
          <div className="space-y-1.5">
            <Label htmlFor="tag">Tag *</Label>
            <Input id="tag" autoFocus autoComplete="off" {...register('tag')} />
            {errors.tag && <p className="text-xs text-red-500">{errors.tag.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="name" autoComplete="off" {...register('name')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="species_code">Species *</Label>
              <select
                id="species_code"
                {...register('species_code')}
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                {species.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sex">Sex *</Label>
              <select
                id="sex"
                {...register('sex')}
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                {(['female', 'male', 'unknown'] as const).map((s) => (
                  <option key={s} value={s}>
                    {SEX_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="breed_id">
              Breed <span className="text-muted-foreground">(optional)</span>
            </Label>
            <select
              id="breed_id"
              {...register('breed_id')}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">—</option>
              {filteredBreeds.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
            {filteredBreeds.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No breeds defined for this species yet.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth">
              Date of birth <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current_structure_id">
              Current structure <span className="text-muted-foreground">(optional)</span>
            </Label>
            <select
              id="current_structure_id"
              {...register('current_structure_id')}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">—</option>
              {structures.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="acquisition_kind">Acquisition</Label>
            <select
              id="acquisition_kind"
              {...register('acquisition_kind')}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              {(['born_onfarm', 'purchased', 'gifted', 'transferred'] as const).map((k) => (
                <option key={k} value={k}>
                  {ACQUISITION_KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </div>

          {globalError && (
            <pre className="rounded bg-red-950/20 p-2 text-xs text-red-600 whitespace-pre-wrap">
              {globalError}
            </pre>
          )}

          <SheetFooter className="mt-4 flex-row justify-end gap-2 sm:flex-row">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={handleSubmit((values) => submit(values, true))}
            >
              Save + ↻
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
