# Phase 1A — Animals Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/livestock` as a working animals registry — paginated/filterable list, register-via-Sheet with "Save and add another" for bulk migration, and a read-only detail page at `/livestock/[id]`.

**Architecture:** RSC + Server Actions, same patterns as `/(app)/onboarding/` and `/(admin)/`. React Hook Form + Zod for the register drawer. URL search params drive list filtering. All data access through the user-scoped Supabase client (RLS handles farm scoping via the bulk `<table>_member_read` policies). No DB migration — schema and indexes already in place.

**Tech Stack:** Next.js 15 App Router (RSC + Server Actions), Supabase JS (`@supabase/ssr`), React Hook Form 7.54 + Zod 3.23, shadcn/ui primitives (Sheet, Table, Button, Input, Label, Select), sonner toasts, date-fns 4.1 for age formatting.

**Spec:** [docs/superpowers/specs/2026-05-19-phase-1a-animals-registry-design.md](../specs/2026-05-19-phase-1a-animals-registry-design.md)

**Testing strategy:** Repo has no JS test framework (same as super_admin). Verification per task = `npx tsc --noEmit` filtered to changed files + `pnpm check` (biome) + manual smoke (URLs to hit and what to expect, in Task 7).

**Commit cadence:** One commit per task, message style matches recent repo convention (`feat(livestock): ...`, `chore(...): ...`). DO NOT push between tasks — push the whole branch once at the end.

---

## File Structure

**Files this plan creates:**

```
apps/web/src/lib/livestock/
├── schemas.ts                                    # Task 1
├── format-age.ts                                 # Task 1
└── queries.ts                                    # Task 2

apps/web/src/app/(app)/livestock/
├── page.tsx                                      # Task 5 (replaces placeholder)
├── actions.ts                                    # Task 3
├── _components/
│   └── register-animal-sheet.tsx                 # Task 4
└── [id]/
    └── page.tsx                                  # Task 6
```

**Files this plan modifies:**

```
apps/web/src/app/(app)/livestock/page.tsx        # Task 5 — full rewrite from 8-line placeholder
```

No files in `packages/` change. No DB migration. No CI changes.

---

## Branch + workflow

- Create `feat/phase-1a-animals` from `main` before Task 1.
- Each task = one commit on that branch.
- Task 7 pushes the branch (triggers Vercel preview) and you smoke-test on the preview URL.
- After smoke passes, merge to `main` via the `finishing-a-development-branch` skill or `git merge --no-ff` like we did for super_admin.

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git checkout main && git pull --ff-only && git checkout -b feat/phase-1a-animals
```

---

## Task 1: Foundation utilities (Zod schema + age formatter)

**Files:**
- Create: `apps/web/src/lib/livestock/schemas.ts`
- Create: `apps/web/src/lib/livestock/format-age.ts`

Pure utilities, no DB calls. Used by every later task.

- [ ] **Step 1: Create the lib directory**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p apps/web/src/lib/livestock
```

- [ ] **Step 2: Write `schemas.ts`**

Paste exactly into `apps/web/src/lib/livestock/schemas.ts`:

```ts
import { z } from 'zod';

// Zod schema for the Register Animal form.
//
// Enum values match the live DB constraints exactly:
//   - species_code: the seven rows in public.species (verified 2026-05-19)
//   - sex: public.sex enum (male | female | unknown), default 'unknown'
//   - acquisition_kind: animals_acquisition_kind_check CHECK constraint
//     allows exactly ('born_onfarm', 'purchased', 'gifted', 'transferred')
//
// Everything else (dam/sire, rfid, cost/source, lactation_* fields)
// is filled later via events or /admin and intentionally omitted here.
export const animalRegistrationSchema = z.object({
  tag: z.string().min(1, 'Tag is required').max(40),
  name: z.string().max(80).optional(),
  species_code: z.enum(['cattle', 'buffalo', 'goat', 'sheep', 'poultry', 'fish', 'bee']),
  breed_id: z.string().uuid().optional(),
  sex: z.enum(['male', 'female', 'unknown']).default('unknown'),
  date_of_birth: z.string().date().optional(),
  current_structure_id: z.string().uuid().optional(),
  acquisition_kind: z.enum(['born_onfarm', 'purchased', 'gifted', 'transferred']).default('born_onfarm'),
});

export type AnimalRegistrationInput = z.infer<typeof animalRegistrationSchema>;

// Human labels for the acquisition_kind enum (used by the form).
export const ACQUISITION_KIND_LABELS: Record<AnimalRegistrationInput['acquisition_kind'], string> = {
  born_onfarm: 'Born on farm',
  purchased: 'Purchased',
  gifted: 'Gifted',
  transferred: 'Transferred',
};

// Human labels for sex.
export const SEX_LABELS: Record<AnimalRegistrationInput['sex'], string> = {
  female: 'Female',
  male: 'Male',
  unknown: 'Unknown',
};
```

- [ ] **Step 3: Write `format-age.ts`**

Paste exactly into `apps/web/src/lib/livestock/format-age.ts`:

```ts
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

// Format an animal's age relative to today.
// Returns:
//   '—'        if dob is null/undefined/empty
//   '12d'      if under 1 month
//   '8m'       if under 1 year
//   '3y 4m'    if 1 year or older (months remainder only when > 0)
//   '5y'       if 1+ years and zero months remainder
export function formatAge(dob: string | Date | null | undefined, now: Date = new Date()): string {
  if (dob === null || dob === undefined || dob === '') return '—';

  const birth = typeof dob === 'string' ? new Date(`${dob}T00:00:00`) : dob;
  if (Number.isNaN(birth.getTime())) return '—';
  if (birth > now) return '—';

  const years = differenceInYears(now, birth);
  if (years >= 1) {
    // months remainder past the year mark
    const monthsTotal = differenceInMonths(now, birth);
    const months = monthsTotal - years * 12;
    return months > 0 ? `${years}y ${months}m` : `${years}y`;
  }

  const months = differenceInMonths(now, birth);
  if (months >= 1) return `${months}m`;

  const days = differenceInDays(now, birth);
  return `${days}d`;
}
```

- [ ] **Step 4: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep -E "lib/livestock/(schemas|format-age)" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add apps/web/src/lib/livestock/ && git commit -m "$(cat <<'EOF'
feat(livestock): add Zod schema + age formatter utilities

Foundation for Phase 1A. animalRegistrationSchema mirrors live DB
constraints exactly (species/sex/acquisition_kind enums all verified
against pg_constraint). formatAge produces y/m/d labels for the list
view + detail header.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Queries layer

**Files:**
- Create: `apps/web/src/lib/livestock/queries.ts`

- [ ] **Step 1: Write `queries.ts`**

Paste exactly:

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@farmheaven/db';

const COUNT_CAP = 10_000;
const PAGE_SIZE_MAX = 200;

export type AnimalListRow = {
  id: string;
  tag: string;
  name: string | null;
  species_code: string;
  species_label: string;
  sex: 'male' | 'female' | 'unknown';
  date_of_birth: string | null;
  current_structure_id: string | null;
  structure_name: string | null;
  breed_id: string | null;
  breed_label: string | null;
  health_state: string;
  retired_at: string | null;
};

export type AnimalDetail = AnimalListRow & {
  rfid_tag: string | null;
  lifecycle: string | null;
  acquisition_kind: string | null;
  acquired_at: string | null;
  acquisition_cost: number | null;
  acquisition_source: string | null;
  dam: { id: string; tag: string; name: string | null } | null;
  sire: { id: string; tag: string; name: string | null } | null;
  created_at: string;
  created_by: string | null;
  created_by_name: string | null;
  updated_at: string;
};

export type ListAnimalsParams = {
  farmId: string;
  page: number;
  size: number;
  search?: string;
  species?: string;
  includeRetired?: boolean;
  order?: 'tag' | 'date_of_birth';
  dir?: 'asc' | 'desc';
};

export type ListAnimalsResult = {
  rows: AnimalListRow[];
  totalCount: number;
};

export async function listAnimals(
  supabase: SupabaseClient<Database>,
  params: ListAnimalsParams,
): Promise<ListAnimalsResult> {
  const {
    farmId,
    page,
    size,
    search,
    species,
    includeRetired = false,
    order = 'tag',
    dir = 'asc',
  } = params;

  const clampedSize = Math.min(PAGE_SIZE_MAX, Math.max(1, size));
  const offset = (Math.max(1, page) - 1) * clampedSize;

  // Type cast — supabase-js 2.105.x has a known type-skew defect with
  // .from(...).select(...) chains (see admin-client.ts + onboarding/actions.ts).
  let query = (supabase
    .from('animals')
    .select(
      `id, tag, name, species_code, sex, date_of_birth, current_structure_id,
       breed_id, health_state, retired_at,
       species:species_code (label),
       breed:breed_id (label),
       structure:current_structure_id (name)`,
      { count: 'estimated' },
    ) as never) as {
      eq: (col: string, val: unknown) => typeof query;
      is: (col: string, val: unknown) => typeof query;
      ilike: (col: string, pattern: string) => typeof query;
      or: (filter: string) => typeof query;
      order: (col: string, opts: { ascending: boolean }) => typeof query;
      range: (from: number, to: number) => Promise<{
        data: Array<Record<string, unknown>> | null;
        count: number | null;
        error: { message: string } | null;
      }>;
    };

  query = query.eq('farm_id', farmId);
  if (!includeRetired) query = query.is('retired_at', null);
  if (species) query = query.eq('species_code', species);
  if (search && search.trim()) {
    const pattern = `%${search.trim().replace(/[%_]/g, '\\$&')}%`;
    query = query.or(`tag.ilike.${pattern},name.ilike.${pattern}`);
  }
  query = query.order(order, { ascending: dir === 'asc' });

  const result = await query.range(offset, offset + clampedSize - 1);
  if (result.error) {
    throw new Error(`listAnimals failed: ${result.error.message}`);
  }

  const rows: AnimalListRow[] = (result.data ?? []).map((row) => {
    const speciesJoin = row.species as { label?: string } | null;
    const breedJoin = row.breed as { label?: string } | null;
    const structureJoin = row.structure as { name?: string } | null;
    return {
      id: String(row.id),
      tag: String(row.tag),
      name: row.name === null ? null : String(row.name),
      species_code: String(row.species_code),
      species_label: speciesJoin?.label ?? String(row.species_code),
      sex: row.sex as 'male' | 'female' | 'unknown',
      date_of_birth: row.date_of_birth === null ? null : String(row.date_of_birth),
      current_structure_id: row.current_structure_id === null ? null : String(row.current_structure_id),
      structure_name: structureJoin?.name ?? null,
      breed_id: row.breed_id === null ? null : String(row.breed_id),
      breed_label: breedJoin?.label ?? null,
      health_state: String(row.health_state),
      retired_at: row.retired_at === null ? null : String(row.retired_at),
    };
  });

  return { rows, totalCount: Math.min(COUNT_CAP, result.count ?? 0) };
}

export async function getAnimal(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<AnimalDetail | null> {
  const result = await (supabase
    .from('animals')
    .select(
      `id, tag, name, species_code, sex, date_of_birth, current_structure_id,
       breed_id, health_state, retired_at, rfid_tag, lifecycle,
       acquisition_kind, acquired_at, acquisition_cost, acquisition_source,
       created_at, created_by, updated_at,
       species:species_code (label),
       breed:breed_id (label),
       structure:current_structure_id (name),
       dam:dam_id (id, tag, name),
       sire:sire_id (id, tag, name),
       created_by_profile:created_by (full_name)`,
    )
    .eq('id', id)
    .maybeSingle() as never) as Promise<{
      data: Record<string, unknown> | null;
      error: { message: string } | null;
    }>;

  const { data: row, error } = await result;
  if (error) throw new Error(`getAnimal failed: ${error.message}`);
  if (!row) return null;

  const speciesJoin = row.species as { label?: string } | null;
  const breedJoin = row.breed as { label?: string } | null;
  const structureJoin = row.structure as { name?: string } | null;
  const damJoin = row.dam as { id: string; tag: string; name: string | null } | null;
  const sireJoin = row.sire as { id: string; tag: string; name: string | null } | null;
  const creatorJoin = row.created_by_profile as { full_name?: string } | null;

  return {
    id: String(row.id),
    tag: String(row.tag),
    name: row.name === null ? null : String(row.name),
    species_code: String(row.species_code),
    species_label: speciesJoin?.label ?? String(row.species_code),
    sex: row.sex as 'male' | 'female' | 'unknown',
    date_of_birth: row.date_of_birth === null ? null : String(row.date_of_birth),
    current_structure_id: row.current_structure_id === null ? null : String(row.current_structure_id),
    structure_name: structureJoin?.name ?? null,
    breed_id: row.breed_id === null ? null : String(row.breed_id),
    breed_label: breedJoin?.label ?? null,
    health_state: String(row.health_state),
    retired_at: row.retired_at === null ? null : String(row.retired_at),
    rfid_tag: row.rfid_tag === null ? null : String(row.rfid_tag),
    lifecycle: row.lifecycle === null ? null : String(row.lifecycle),
    acquisition_kind: row.acquisition_kind === null ? null : String(row.acquisition_kind),
    acquired_at: row.acquired_at === null ? null : String(row.acquired_at),
    acquisition_cost: row.acquisition_cost === null ? null : Number(row.acquisition_cost),
    acquisition_source: row.acquisition_source === null ? null : String(row.acquisition_source),
    dam: damJoin ? { id: String(damJoin.id), tag: String(damJoin.tag), name: damJoin.name ?? null } : null,
    sire: sireJoin ? { id: String(sireJoin.id), tag: String(sireJoin.tag), name: sireJoin.name ?? null } : null,
    created_at: String(row.created_at),
    created_by: row.created_by === null ? null : String(row.created_by),
    created_by_name: creatorJoin?.full_name ?? null,
    updated_at: String(row.updated_at),
  };
}

export async function listSpeciesForForm(
  supabase: SupabaseClient<Database>,
): Promise<Array<{ code: string; label: string }>> {
  const result = await (supabase
    .from('species')
    .select('code, label')
    .order('label', { ascending: true }) as never) as Promise<{
      data: Array<{ code: string; label: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listSpeciesForForm failed: ${error.message}`);
  return data ?? [];
}

export async function listBreedsForForm(
  supabase: SupabaseClient<Database>,
): Promise<Array<{ id: string; species_code: string; label: string }>> {
  const result = await (supabase
    .from('breeds')
    .select('id, species_code, label')
    .order('label', { ascending: true }) as never) as Promise<{
      data: Array<{ id: string; species_code: string; label: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listBreedsForForm failed: ${error.message}`);
  return data ?? [];
}

export async function listStructuresForFarm(
  supabase: SupabaseClient<Database>,
  farmId: string,
): Promise<Array<{ id: string; name: string; kind: string }>> {
  const result = await (supabase
    .from('structures')
    .select('id, name, kind')
    .eq('farm_id', farmId)
    .is('deleted_at', null)
    .order('name', { ascending: true }) as never) as Promise<{
      data: Array<{ id: string; name: string; kind: string }> | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`listStructuresForFarm failed: ${error.message}`);
  return data ?? [];
}

export async function getCurrentFarmIdFromMembership(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string | null> {
  const result = await (supabase
    .from('memberships')
    .select('farm_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle() as never) as Promise<{
      data: { farm_id: string } | null;
      error: { message: string } | null;
    }>;
  const { data, error } = await result;
  if (error) throw new Error(`getCurrentFarmIdFromMembership failed: ${error.message}`);
  return data?.farm_id ?? null;
}
```

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "lib/livestock/queries" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add apps/web/src/lib/livestock/queries.ts && git commit -m "$(cat <<'EOF'
feat(livestock): add query layer (list, detail, lookups)

Six exported functions covering all the read paths Phase 1A needs:
listAnimals (paginated + filterable), getAnimal (full detail with
joined dam/sire/structure/species/breed/creator), listSpeciesForForm,
listBreedsForForm, listStructuresForFarm, getCurrentFarmIdFromMembership.

All use the user-scoped Supabase client through RLS. Type assertions
work around the known supabase-js 2.105.x type-skew defect (same
pattern as admin-client.ts).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Server action (createAnimal)

**Files:**
- Create: `apps/web/src/app/(app)/livestock/actions.ts`

- [ ] **Step 1: Write `actions.ts`**

Paste exactly:

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@farmheaven/db/server';
import { animalRegistrationSchema } from '@/lib/livestock/schemas';
import { getCurrentFarmIdFromMembership } from '@/lib/livestock/queries';

type Result = { ok: true; id: string } | { ok: false; error: string };

export async function createAnimal(input: unknown): Promise<Result> {
  const parsed = animalRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? 'invalid_input' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_authenticated' };

  const farmId = await getCurrentFarmIdFromMembership(supabase, user.id);
  if (!farmId) return { ok: false, error: 'no_farm' };

  // Drop optional empties so we don't write empty strings into nullable cols.
  const data = parsed.data;
  const payload: Record<string, unknown> = {
    tag: data.tag,
    species_code: data.species_code,
    sex: data.sex,
    acquisition_kind: data.acquisition_kind,
    farm_id: farmId,
    created_by: user.id,
  };
  if (data.name) payload.name = data.name;
  if (data.breed_id) payload.breed_id = data.breed_id;
  if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
  if (data.current_structure_id) payload.current_structure_id = data.current_structure_id;

  // supabase-js 2.105.x type-skew workaround.
  const insertResult = await (
    supabase.from('animals') as never as {
      insert: (p: Record<string, unknown>) => {
        select: (cols: string) => {
          single: () => Promise<{
            data: { id: string } | null;
            error: { code: string; message: string } | null;
          }>;
        };
      };
    }
  )
    .insert(payload)
    .select('id')
    .single();

  if (insertResult.error) {
    if (insertResult.error.code === '23505') {
      return { ok: false, error: 'tag_taken' };
    }
    return { ok: false, error: insertResult.error.message };
  }
  if (!insertResult.data) return { ok: false, error: 'insert_returned_no_row' };

  revalidatePath('/livestock');
  return { ok: true, id: insertResult.data.id };
}
```

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "livestock/actions" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(app)/livestock/actions.ts" && git commit -m "$(cat <<'EOF'
feat(livestock): add createAnimal server action

Validates input via Zod, resolves farm via membership, inserts via the
user-scoped client (RLS-active). Maps pg unique_violation (23505) on
(farm_id, tag) to a friendly 'tag_taken' error string the form can
display inline. Drops optional-empty fields from the payload so we
don't write empty strings into nullable columns.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Register Animal sheet (client component)

**Files:**
- Create: `apps/web/src/app/(app)/livestock/_components/register-animal-sheet.tsx`

- [ ] **Step 1: Make the components directory**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p "apps/web/src/app/(app)/livestock/_components"
```

- [ ] **Step 2: Write `register-animal-sheet.tsx`**

Paste exactly:

```tsx
'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import {
  animalRegistrationSchema,
  ACQUISITION_KIND_LABELS,
  SEX_LABELS,
  type AnimalRegistrationInput,
} from '@/lib/livestock/schemas';
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
  const tagInputRef = useRef<HTMLInputElement | null>(null);

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

  async function submit(
    values: AnimalRegistrationInput,
    addAnother: boolean,
  ): Promise<void> {
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
      } else {
        setGlobalError(result.error);
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
            <Input
              id="tag"
              autoFocus
              autoComplete="off"
              {...register('tag')}
              ref={(el) => {
                tagInputRef.current = el;
                register('tag').ref(el);
              }}
            />
            {errors.tag && <p className="text-xs text-red-500">{errors.tag.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name <span className="text-muted-foreground">(optional)</span></Label>
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
            <Label htmlFor="breed_id">Breed <span className="text-muted-foreground">(optional)</span></Label>
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
              <p className="text-xs text-muted-foreground">No breeds defined for this species yet.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth">Date of birth <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current_structure_id">Current structure <span className="text-muted-foreground">(optional)</span></Label>
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
```

- [ ] **Step 3: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "register-animal-sheet" || echo "OK"
```

Expected: `OK`. If you see complaints about `register('tag').ref` overwriting, simplify the tag input by removing the manual ref assignment (the form's `setFocus('tag')` handles refocusing without a manual ref).

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(app)/livestock/_components/register-animal-sheet.tsx" && git commit -m "$(cat <<'EOF'
feat(livestock): add Register Animal sheet (RHF + Zod + Save+another)

Right-side shadcn Sheet with the 8 fields locked in spec section 4.
React Hook Form + zodResolver bound to animalRegistrationSchema.
Breed select filters by selected species. Save+another keeps the
sheet open, stickies species/structure/acquisition for the next row,
and refocuses the tag field for keyboard-driven bulk entry.

Pending state via useTransition. Errors surface inline (tag_taken →
under tag field) or as a global block for anything else.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: List page (replaces placeholder)

**Files:**
- Modify: `apps/web/src/app/(app)/livestock/page.tsx`

- [ ] **Step 1: Overwrite `page.tsx`**

Paste exactly into `apps/web/src/app/(app)/livestock/page.tsx`:

```tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@farmheaven/db/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@farmheaven/ui/components/ui/table';
import { Button } from '@farmheaven/ui/components/ui/button';
import { Input } from '@farmheaven/ui/components/ui/input';
import {
  listAnimals,
  listBreedsForForm,
  listSpeciesForForm,
  listStructuresForFarm,
  getCurrentFarmIdFromMembership,
} from '@/lib/livestock/queries';
import { formatAge } from '@/lib/livestock/format-age';
import { SEX_LABELS } from '@/lib/livestock/schemas';
import { RegisterAnimalSheet } from './_components/register-animal-sheet';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

type Search = {
  page?: string;
  q?: string;
  species?: string;
  retired?: string;
  order?: string;
  dir?: string;
};

export default async function LivestockPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const farmId = await getCurrentFarmIdFromMembership(supabase, user.id);
  if (!farmId) redirect('/onboarding');

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const search = (sp.q ?? '').trim();
  const speciesFilter = sp.species && sp.species !== 'all' ? sp.species : undefined;
  const includeRetired = sp.retired === '1';
  const order = sp.order === 'date_of_birth' ? 'date_of_birth' : 'tag';
  const dir: 'asc' | 'desc' = sp.dir === 'desc' ? 'desc' : 'asc';

  const [{ rows, totalCount }, species, breeds, structures] = await Promise.all([
    listAnimals(supabase, {
      farmId,
      page,
      size: PAGE_SIZE,
      search,
      species: speciesFilter,
      includeRetired,
      order,
      dir,
    }),
    listSpeciesForForm(supabase),
    listBreedsForForm(supabase),
    listStructuresForFarm(supabase, farmId),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFilters = Boolean(search || speciesFilter || includeRetired);

  function buildQuery(overrides: Record<string, string | undefined>): Record<string, string> {
    const merged: Record<string, string | undefined> = {
      q: search || undefined,
      species: speciesFilter,
      retired: includeRetired ? '1' : undefined,
      order: order === 'tag' ? undefined : order,
      dir: dir === 'asc' ? undefined : dir,
      page: page === 1 ? undefined : String(page),
      ...overrides,
    };
    return Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined),
    ) as Record<string, string>;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Livestock</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount === 0 ? 'No animals yet' : `${totalCount.toLocaleString()} ${totalCount === 1 ? 'animal' : 'animals'}`}
          </p>
        </div>
        <RegisterAnimalSheet species={species} breeds={breeds} structures={structures} />
      </header>

      {/* Search + retired toggle */}
      <form className="mb-3 flex items-center gap-3" action="/livestock" method="get">
        <Input
          name="q"
          defaultValue={search}
          placeholder="Search tag or name…"
          className="max-w-xs"
        />
        {speciesFilter && <input type="hidden" name="species" value={speciesFilter} />}
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="retired"
            value="1"
            defaultChecked={includeRetired}
          />
          Show retired
        </label>
        <Button type="submit" size="sm" variant="secondary">
          Apply
        </Button>
      </form>

      {/* Species pills */}
      <nav className="mb-4 flex flex-wrap gap-1.5">
        <PillLink
          href={{ pathname: '/livestock', query: buildQuery({ species: undefined, page: undefined }) }}
          active={!speciesFilter}
        >
          All
        </PillLink>
        {species.map((s) => (
          <PillLink
            key={s.code}
            href={{ pathname: '/livestock', query: buildQuery({ species: s.code, page: undefined }) }}
            active={speciesFilter === s.code}
          >
            {s.label}
          </PillLink>
        ))}
      </nav>

      {/* Table or empty state */}
      {rows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <SortLink current={order === 'tag'} dir={dir} buildQuery={buildQuery} col="tag">
                    Tag
                  </SortLink>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>
                  <SortLink current={order === 'date_of_birth'} dir={dir} buildQuery={buildQuery} col="date_of_birth">
                    Age
                  </SortLink>
                </TableHead>
                <TableHead>Structure</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.tag}</TableCell>
                  <TableCell>{row.name ?? '—'}</TableCell>
                  <TableCell>
                    {row.species_label}
                    {row.breed_label ? <span className="text-muted-foreground"> · {row.breed_label}</span> : null}
                  </TableCell>
                  <TableCell>{SEX_LABELS[row.sex]}</TableCell>
                  <TableCell className="font-mono text-xs">{formatAge(row.date_of_birth)}</TableCell>
                  <TableCell>{row.structure_name ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/livestock/${row.id}`}>open →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {rows.length > 0 && (
        <nav className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          {page > 1 ? (
            <Button asChild size="sm" variant="ghost">
              <Link href={{ pathname: '/livestock', query: buildQuery({ page: String(page - 1) }) }}>
                ‹‹ Prev
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled>
              ‹‹ Prev
            </Button>
          )}
          <span>
            page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Button asChild size="sm" variant="ghost">
              <Link href={{ pathname: '/livestock', query: buildQuery({ page: String(page + 1) }) }}>
                Next ››
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled>
              Next ››
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}

function PillLink({
  href,
  active,
  children,
}: {
  href: { pathname: string; query: Record<string, string> };
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
          : 'rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted'
      }
    >
      {children}
    </Link>
  );
}

function SortLink({
  current,
  dir,
  buildQuery,
  col,
  children,
}: {
  current: boolean;
  dir: 'asc' | 'desc';
  buildQuery: (o: Record<string, string | undefined>) => Record<string, string>;
  col: 'tag' | 'date_of_birth';
  children: React.ReactNode;
}) {
  const nextDir = current && dir === 'asc' ? 'desc' : 'asc';
  return (
    <Link
      href={{
        pathname: '/livestock',
        query: buildQuery({ order: col, dir: nextDir, page: undefined }),
      }}
      className="text-xs text-muted-foreground hover:text-foreground"
    >
      {children}
      {current ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </Link>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No animals match these filters.</p>
        <Button asChild size="sm" variant="link" className="mt-2">
          <Link href="/livestock">Clear filters</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-xl font-semibold">No animals yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Register your first animal to start tracking milk, health, and breeding.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "livestock/page" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(app)/livestock/page.tsx" && git commit -m "$(cat <<'EOF'
feat(livestock): replace placeholder list page with real registry

Server component renders the animal list with search, species pills,
hide-retired toggle, sortable Tag and Age columns, and prev/next
pagination. Empty states for first-use (CTA) vs filter-no-match
(Clear filters link). Wires up the Register Animal sheet.

URL search params drive every filter so the back button and shareable
links work. Pagination uses the same disabled-Button-at-boundary
pattern as /admin/[table] to avoid clicking past page 1 or last page.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Detail page

**Files:**
- Create: `apps/web/src/app/(app)/livestock/[id]/page.tsx`

- [ ] **Step 1: Make the dynamic route directory**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p "apps/web/src/app/(app)/livestock/[id]"
```

- [ ] **Step 2: Write `[id]/page.tsx`**

Paste exactly:

```tsx
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@farmheaven/db/server';
import { getAnimal } from '@/lib/livestock/queries';
import { formatAge } from '@/lib/livestock/format-age';
import { SEX_LABELS, ACQUISITION_KIND_LABELS } from '@/lib/livestock/schemas';

export const dynamic = 'force-dynamic';

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const animal = await getAnimal(supabase, id);
  if (!animal) notFound();

  const age = formatAge(animal.date_of_birth);
  const headline = animal.name || animal.tag;
  const summary = [
    animal.breed_label ? `${animal.species_label} (${animal.breed_label})` : animal.species_label,
    SEX_LABELS[animal.sex],
    age !== '—' ? age : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <Link href="/livestock" className="text-sm text-muted-foreground hover:underline">
        ← Livestock
      </Link>

      <header className="mt-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {headline}
          {animal.name ? <span className="ml-2 font-mono text-base text-muted-foreground">· {animal.tag}</span> : null}
        </h1>
        {summary && <p className="mt-1 text-sm text-muted-foreground">{summary}</p>}
      </header>

      <Section title="Basics">
        <Row label="Tag" value={animal.tag} mono />
        <Row label="Name" value={animal.name ?? '—'} />
        <Row label="Species" value={animal.breed_label ? `${animal.species_label} (${animal.breed_label})` : animal.species_label} />
        <Row label="Sex" value={SEX_LABELS[animal.sex]} />
        <Row label="Date of birth" value={animal.date_of_birth ? `${animal.date_of_birth}  (${age})` : '—'} />
        <Row label="Health state" value={animal.health_state} />
        <Row label="Lifecycle" value={animal.lifecycle ?? '—'} />
        {animal.rfid_tag && <Row label="RFID tag" value={animal.rfid_tag} mono />}
        {animal.retired_at && <Row label="Retired at" value={animal.retired_at} />}
      </Section>

      <Section title="Location & parentage">
        <Row label="Structure" value={animal.structure_name ?? '—'} />
        <Row
          label="Dam"
          value={
            animal.dam ? (
              <Link href={`/livestock/${animal.dam.id}`} className="text-primary hover:underline">
                {animal.dam.name || animal.dam.tag}
                {animal.dam.name ? <span className="ml-1 font-mono text-xs text-muted-foreground">· {animal.dam.tag}</span> : null}
              </Link>
            ) : (
              '—'
            )
          }
        />
        <Row
          label="Sire"
          value={
            animal.sire ? (
              <Link href={`/livestock/${animal.sire.id}`} className="text-primary hover:underline">
                {animal.sire.name || animal.sire.tag}
                {animal.sire.name ? <span className="ml-1 font-mono text-xs text-muted-foreground">· {animal.sire.tag}</span> : null}
              </Link>
            ) : (
              '—'
            )
          }
        />
      </Section>

      <Section title="Acquisition">
        <Row
          label="Kind"
          value={animal.acquisition_kind ? ACQUISITION_KIND_LABELS[animal.acquisition_kind as keyof typeof ACQUISITION_KIND_LABELS] ?? animal.acquisition_kind : '—'}
        />
        <Row label="Date" value={animal.acquired_at ?? '—'} />
        <Row label="Cost" value={animal.acquisition_cost !== null ? `₹${animal.acquisition_cost.toLocaleString()}` : '—'} />
        <Row label="Source" value={animal.acquisition_source ?? '—'} />
      </Section>

      <Section title="System">
        <Row
          label="Created"
          value={
            animal.created_by_name
              ? `${formatTimestamp(animal.created_at)} by ${animal.created_by_name}`
              : formatTimestamp(animal.created_at)
          }
        />
        <Row
          label="Updated"
          value={animal.updated_at === animal.created_at ? '—' : formatTimestamp(animal.updated_at)}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-card">
      <h2 className="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex px-4 py-2 text-sm">
      <dt className="w-40 shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-xs' : 'text-sm'}>{value}</dd>
    </div>
  );
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toISOString().slice(0, 10);
}
```

- [ ] **Step 3: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "livestock/\[id\]" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(app)/livestock/[id]/page.tsx" && git commit -m "$(cat <<'EOF'
feat(livestock): add read-only animal detail page

/livestock/[id] renders four sections (Basics, Location & parentage,
Acquisition, System) as labeled key/value lists. Dam and sire are
linked back to their own detail pages when present. notFound() on
missing rows (covers both real 404 and cross-farm RLS-hidden rows).

No edit affordance in 1A per spec — /admin handles typos.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Deploy + smoke verification

**Files:** none (verification only).

- [ ] **Step 1: Push the branch**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git push -u origin feat/phase-1a-animals
```

- [ ] **Step 2: Wait for Vercel preview READY**

Use `mcp__vercel__list_deployments` with `teamId=team_XlvQ9L7UMk00XMWPqxqXLJ9q`, `projectId=prj_RA6SAeyFZySOVVcxjbl6QfW8CMAT`, `limit=3`. Find the deployment for the latest commit. Poll `mcp__vercel__get_deployment` until `state: READY`. Typical build 30-90s.

Preview URL pattern: `https://farmheaven-web-git-feat-phase-1a-animals-badgers-projects-c8635f3c.vercel.app`

- [ ] **Step 3: Smoke as the bootstrapped user (phone 919573299175)**

Sign in on the preview URL, then walk through:

| Action | Expected |
|---|---|
| Click "Livestock" in sidebar | Lands on `/livestock`. Empty state: "No animals yet. Register your first animal to start tracking." |
| Click `+ Register animal` | Sheet slides in from the right. Tag field is focused. |
| Type tag `C-001`, leave species `Cattle`, sex `Female`, DOB `2023-01-15`, click `Save` | Toast: "C-001 added". Sheet closes. List shows one row with Tag=C-001, Species=Cattle, Age=~2y 4m. |
| Click `+ Register animal` again | Sheet opens; species defaults to `Cattle` (sticky from last entry). |
| Type `C-001` (same tag) → `Save` | Inline error under tag: "Tag already used on this farm". Sheet stays open. |
| Change to `C-002`, click `Save + ↻` | Toast. **Sheet stays open**, tag field clears and refocuses. Species/structure/acquisition values still selected. |
| Add 2-3 more animals with `Save + ↻` | List shows them all. Pagination not yet relevant. |
| Type a query in search box, click Apply | Filters by tag/name ILIKE. |
| Click `Cattle` species pill | Filters to species=cattle. |
| Click `All` pill | Filter cleared. |
| Click a row's `open →` | Navigates to `/livestock/<id>`. Shows all sections. |
| `/livestock/<bad-uuid>` | 404. |

- [ ] **Step 4: Merge to main**

If everything passes:

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git checkout main && git pull --ff-only && git merge --no-ff feat/phase-1a-animals -m "Merge branch 'feat/phase-1a-animals'

Ships Phase 1A — animals registry. Operator can now register and
browse animals from /livestock, the foundation for 1C/1D/1E events.

Spec: docs/superpowers/specs/2026-05-19-phase-1a-animals-registry-design.md
Plan: docs/superpowers/plans/2026-05-19-phase-1a-animals-registry.md
" && git push origin main && git push origin --delete feat/phase-1a-animals && git branch -d feat/phase-1a-animals
```

- [ ] **Step 5: Mark Task #1 complete**

```
TaskUpdate(taskId="1", status="completed")
```

---

## Self-review checklist (already run by author)

- [x] **Spec coverage:**
  - Section 1 (data layer) → Tasks 1 (schemas + age) + 2 (queries)
  - Section 2 (server action) → Task 3
  - Section 3 (list page) → Task 5
  - Section 4 (register drawer) → Task 4
  - Section 5 (detail page) → Task 6
  - Section 6 (out-of-scope) → enforced by what's NOT in any task
  - Smoke + ship → Task 7

- [x] **Placeholder scan:** No TBDs, no "implement later," no "add error handling" stubs. Every code block is complete. The one place an implementer might need to deviate (Task 4 Step 3 if the manual tag ref overwrite confuses TypeScript) has explicit fallback instructions.

- [x] **Type consistency:** `AnimalRegistrationInput` is the same throughout. `AnimalListRow` / `AnimalDetail` shapes match between queries.ts and page consumers. `pkColumn` not used here (no /admin pattern). All Server Action call sites use the same `Result = { ok: true; id } | { ok: false; error }` shape.

- [x] **Scope:** Single sub-feature, 6 implementation tasks + 1 verification task. Each is 5-15 minutes. Fits a focused pass.

- [x] **DB constraint verified:** `animals_acquisition_kind_check` allows exactly `('born_onfarm', 'purchased', 'gifted', 'transferred')`. Zod enum matches.

## Notes for the implementer

- **Pre-existing typecheck noise** in `packages/db/src/middleware.ts`, `packages/db/src/server.ts`, `packages/ui/src/components/app/sidebar.tsx`, `apps/web/src/lib/status.ts` is unrelated to this work. Don't try to fix it here. When verifying typecheck, always `grep` for the file you just touched.
- **The `as never as { ... }` type cast pattern** at the supabase boundary is unavoidable until `@supabase/ssr` and `@supabase/supabase-js` version-lock gets fixed upstream. Same pattern as `admin-client.ts`, onboarding `actions.ts`, super_admin server actions. Don't try to "fix" the casts.
- **Server Actions** for the entire feature use the user-scoped client (`createClient` from `@farmheaven/db/server`). No `createAdminClient` here. If you find yourself wanting it, stop and re-read the spec — admin is for emergencies, this surface runs through RLS.
- **The sticky-on-Save+↻ field set** (species_code, current_structure_id, acquisition_kind) is the killer feature of bulk mode. Don't accidentally clear them on success.
- **Sonner Toaster** is mounted in `apps/web/src/app/layout.tsx`. No need to add it.
- **Sidebar nav already has `/livestock`** at `dashboard-shell.tsx:42`. No nav changes needed.
