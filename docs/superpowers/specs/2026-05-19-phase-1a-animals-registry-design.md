# Phase 1A — Animals registry — Design Spec

**Status:** Brainstorm complete. Ready for implementation plan.
**Date:** 2026-05-19
**Project:** FarmHeaven (apps/web)
**Phase:** 1A of 1A–1G (Phase 1 — Livestock CRUD)

## Why this exists

The dashboard placeholder reads "Phase 0 complete — Next: run Phase 1 to
enable the Livestock registry." That's where we are. The operator (you)
has a notebook with ~20+ existing animals and needs to migrate them into
the system in a single evening, then add a couple more per month going
forward. Until /livestock works, every other Phase 1 sub-feature
(production events, health events, breeding events, dashboard KPIs,
vaccination cron) has no anchor data to attach to.

This sub-feature is **the foundation gate**. Everything 1C–1G depends
on having animals to log events against.

## Locked decisions (clarifying-question phase)

1. **Data-entry scenario:** Bulk migration. Optimize for speed —
   minimal required fields, keyboard-first, "Save and add another"
   that keeps the sheet open and stickies the species/structure/
   acquisition selections. Heavy validation reserved for what would
   corrupt data (tag uniqueness).
2. **Species scope:** All 7 species (cattle, buffalo, goat, sheep,
   poultry, fish, bee). User-driven; the dropdown trusts the operator
   to pick what fits.
3. **Form scope:** 8 fields — tag, name, species, breed, sex, date of
   birth, current structure, acquisition kind. Everything else
   (dam/sire, RFID, cost/source, lactation fields) is filled later via
   events or `/admin`.
4. **List view:** Standard — 6 columns (tag/name/species/sex/age/
   structure), debounced search, species-pill filter, hide-retired
   toggle, pagination 50/page, sortable headers.
5. **Detail page:** Overview only, no tabs visible in 1A, no edit
   affordance. Tabs slot in alongside Overview when 1C/1D/1E land.
   `/admin` handles typo fixes.

## Architecture

Pure RSC + Server Actions, same patterns as `/(app)/onboarding/` and
`/(admin)/`:

- **Data fetching:** server component fetches via user-scoped Supabase
  client (`@farmheaven/db/server`). RLS enforces farm scoping through
  the bulk `<table>_member_read` policies from migration 14.
- **Form library:** React Hook Form + Zod (matches `farmOnboardingSchema`
  pattern).
- **Drawer:** shadcn `Sheet` (right-side), already installed in Phase 0.
- **Filters/pagination:** URL search params drive RSC re-render. Same
  pattern as `/admin/[table]`.
- **No service-role anywhere.** Animals table is farm-scoped under
  existing RLS; `is_member(farm_id)` is sufficient for both reads and
  writes.

## Section 1 — Data layer

### New files

```
apps/web/src/lib/livestock/
├── queries.ts      # listAnimals, getAnimal, listSpeciesForForm, listBreedsForForm, listStructuresForFarm, getCurrentFarmIdFromMembership
├── schemas.ts      # animalRegistrationSchema (Zod) + AnimalRegistrationInput type
└── format-age.ts   # formatAge(dob: string | Date | null) → "3y 4m" | "8m" | "12d" | "—"
```

### Query surface

```ts
// queries.ts
listAnimals(supabase, {
  farmId: string;
  page: number;            // 1-based
  size: number;            // default 50, max 200
  search?: string;         // ILIKE on tag or name
  species?: string;        // species_code filter
  includeRetired?: boolean; // default false → adds `WHERE retired_at IS NULL`
  order?: 'tag' | 'date_of_birth';  // limited whitelist
  dir?: 'asc' | 'desc';
}): Promise<{
  rows: Array<{
    id: string;
    tag: string;
    name: string | null;
    species_code: string;
    species_label: string;     // joined
    sex: 'male' | 'female' | 'unknown';
    date_of_birth: string | null;
    current_structure_id: string | null;
    structure_name: string | null;  // joined
    breed_id: string | null;
    breed_label: string | null;     // joined
    health_state: string;
    retired_at: string | null;
  }>;
  totalCount: number;  // 'estimated' from Postgres planner
}>;

getAnimal(supabase, id: string): Promise<AnimalDetail | null>
// Returns full row + species_label, breed_label, structure_name,
// dam (tag+name+id), sire (tag+name+id), created_by_name.

listSpeciesForForm(supabase): Promise<Array<{ code: string; label: string }>>
listBreedsForForm(supabase): Promise<Array<{ id: string; species_code: string; label: string }>>
listStructuresForFarm(supabase, farmId: string): Promise<Array<{ id: string; name: string; kind: string }>>

getCurrentFarmIdFromMembership(supabase, userId: string): Promise<string | null>
// One-row lookup, replaces a round trip through the current_farm_id() RPC.
```

All use the user-scoped client. RLS handles all access control. No
service-role.

### Zod schema

```ts
// schemas.ts
export const animalRegistrationSchema = z.object({
  tag: z.string().min(1).max(40),
  name: z.string().max(80).optional(),
  species_code: z.enum(['cattle','buffalo','goat','sheep','poultry','fish','bee']),
  breed_id: z.string().uuid().optional(),
  sex: z.enum(['male','female','unknown']).default('unknown'),
  date_of_birth: z.string().date().optional(),  // ISO YYYY-MM-DD
  current_structure_id: z.string().uuid().optional(),
  acquisition_kind: z.enum(['born_onfarm','purchased','gifted','transferred']).default('born_onfarm'),
});
export type AnimalRegistrationInput = z.infer<typeof animalRegistrationSchema>;
```

### Database — no migration needed

Verified live: `animals_farm_id_tag_key` (unique on `(farm_id, tag)`)
already exists. All needed indexes — species filter, health, dam/sire,
RFID, external_ids — present.

## Section 2 — Server action

### New file

`apps/web/src/app/(app)/livestock/actions.ts`

```ts
'use server';

import { createClient } from '@farmheaven/db/server';
import { animalRegistrationSchema } from '@/lib/livestock/schemas';
import { getCurrentFarmIdFromMembership } from '@/lib/livestock/queries';
import { revalidatePath } from 'next/cache';

type Result = { ok: true; id: string } | { ok: false; error: string };

export async function createAnimal(input: unknown): Promise<Result> {
  const parsed = animalRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? 'invalid_input' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_authenticated' };

  const farmId = await getCurrentFarmIdFromMembership(supabase, user.id);
  if (!farmId) return { ok: false, error: 'no_farm' };

  const payload = {
    ...parsed.data,
    farm_id: farmId,
    created_by: user.id,
  };

  // supabase-js 2.105.x type-skew workaround — same pattern as
  // bootstrap_farm action and the admin-client lookup.
  const { data, error } = await (
    supabase.from('animals') as never as {
      insert: (p: typeof payload) => {
        select: (cols: string) => {
          single: () => Promise<{
            data: { id: string } | null;
            error: { code: string; message: string } | null;
          }>;
        };
      };
    }
  ).insert(payload).select('id').single();

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'tag_taken' };
    return { ok: false, error: error.message };
  }
  if (!data) return { ok: false, error: 'insert_returned_no_row' };

  revalidatePath('/livestock');
  return { ok: true, id: data.id };
}
```

### Error handling matrix

| error | UI treatment |
|---|---|
| `tag_taken` | inline under Tag field, focus returns to Tag, sheet stays open |
| `not_authenticated` / `no_farm` | toast.error + close drawer (shouldn't happen if middleware works) |
| `invalid_input` | inline under offending field |
| anything else | inline error block at bottom of drawer with PG message verbatim |

## Section 3 — List page

`apps/web/src/app/(app)/livestock/page.tsx`

### URL

`/livestock?page=N&size=50&q=search&species=cattle&retired=1&order=tag&dir=asc`

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Livestock                                              [+ Register animal]   │
│ 47 animals                                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [Search tag or name…           ]      ☐ Show retired                      │
│                                                                              │
│ All  Cattle  Buffalo  Goat  Sheep  Poultry  Fish  Bee   ← species pills      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tag ↑     Name           Species   Sex   Age      Structure         ⋯        │
│ C-001     Lakshmi         Cattle    F     3y 4m   Dairy barn A    →          │
│ B-001     —               Buffalo   F     5y      Dairy barn B    →          │
│ G-001     —               Goat      M     8m      Goat shed       →          │
│                                                                              │
│   ‹‹ Prev  ·  page 1 of 1  ·  Next ››                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Behavior

- **Header:** title + animal count (`<n> animals` or `<n>+ animals` if estimated count > 10,000).
- **Register button:** top-right, opens the Sheet (client component) via state in a small wrapper component.
- **Search:** debounced 300ms client-side, writes `?q=...`. Server uses `ILIKE` on `tag` and `name`. URL is the source of truth so back button works.
- **Show retired:** checkbox. Default WHERE clause excludes `retired_at IS NOT NULL`.
- **Species pills:** clickable Links. `All` clears the species filter. Active pill highlighted.
- **Table:** shadcn Table primitives. 6 columns + a trailing chevron link cell. Whole row links to `/livestock/<id>`.
- **Sortable:** Tag and DOB columns. Click toggles asc/desc via URL.
- **Age column:** computed from `date_of_birth`. `formatAge(dob, today)` returns `"3y 4m"`, `"8m"`, `"12d"`. Render `—` if DOB is null. Util lives in `lib/livestock/format-age.ts`.
- **Pagination:** prev/next links with proper disabled boundary handling (render disabled Button at boundary, Link otherwise — same fix as super_admin Task 7).

### Empty states

- Zero animals + no filters → centered empty card: "No animals yet. Register your first animal to start tracking." with a central `[+ Register animal]` button.
- Zero animals + active filter → "No animals match these filters. [Clear filters]" linking to `/livestock`.

## Section 4 — Register drawer

### New file

`apps/web/src/app/(app)/livestock/_components/register-animal-sheet.tsx`
(`'use client'`)

### Layout

```
┌─ Register animal ────────────────────────────────────── ✕ ─┐
│  TAG *                                                     │
│  [ C-014                          ]   ← autofocus on open  │
│                                                            │
│  NAME (optional)                                           │
│  [ Lakshmi                        ]                        │
│                                                            │
│  SPECIES *           SEX *                                 │
│  [ Cattle      ▾ ]  [ Female  ▾ ]                          │
│                                                            │
│  BREED (optional)                                          │
│  [ Gir                            ▾ ]                      │
│                                                            │
│  DATE OF BIRTH (optional)                                  │
│  [ 2024-03-15                    ]                         │
│                                                            │
│  CURRENT STRUCTURE (optional)                              │
│  [ Dairy barn A                   ▾ ]                      │
│                                                            │
│  ACQUISITION                                               │
│  [ Born on farm                   ▾ ]                      │
│                                                            │
│  ⚠ Inline error here                                       │
├────────────────────────────────────────────────────────────┤
│                              [Cancel]  [Save]  [Save + ↻]  │
└────────────────────────────────────────────────────────────┘
```

### Props

```ts
type Props = {
  species: Array<{ code: string; label: string }>;
  breeds: Array<{ id: string; species_code: string; label: string }>;
  structures: Array<{ id: string; name: string; kind: string }>;
};
```

Lookups are loaded server-side in `page.tsx` and passed as props. No
client-side fetching.

### Form behavior

- RHF + Zod resolver bound to `animalRegistrationSchema`.
- Default values: `{ sex: 'unknown', acquisition_kind: 'born_onfarm' }`.
- Breed `<select>` filters its `<option>`s by current `species_code`.
  When species changes, `breed_id` clears.
- Native `<input type="date">` for DOB. Native `<select>` for species/
  sex/breed/structure/acquisition_kind.

### Submit

- **`Save`:** call `createAnimal(values)`. On success, toast `"<name|tag> added"`, close sheet, RSC list revalidates.
- **`Save + ↻` (Save and add another):** same action. On success, toast, **keep sheet open**, reset form keeping `species_code`, `current_structure_id`, and `acquisition_kind` as the new defaults. Refocus Tag field.

### Keyboard

- Autofocus tag on open.
- Enter inside any field → `Save` (NOT Save+↻ — easy to fat-finger).
- Esc → close.
- Tab order: tag → name → species → sex → breed → DOB → structure → acquisition → Save → Save+↻ → Cancel.

## Section 5 — Detail page

`apps/web/src/app/(app)/livestock/[id]/page.tsx`

URL: `/livestock/<uuid>`

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← Livestock                                                              │
│ Lakshmi  ·  C-014                                                        │
│ Cattle (Gir) · Female · 3y 4m                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ Basics                                                                   │
│   Tag                C-014                                               │
│   Name               Lakshmi                                             │
│   Species            Cattle (Gir)                                        │
│   Sex                Female                                              │
│   Date of birth      2022-03-15  (3y 4m)                                 │
│   Health state       healthy                                             │
│   Lifecycle          —                                                   │
│                                                                          │
│ Location & parentage                                                     │
│   Structure          Dairy barn A                                        │
│   Dam                — (or: "Ganga (C-002)" → link)                      │
│   Sire               —                                                   │
│                                                                          │
│ Acquisition                                                              │
│   Kind               Born on farm                                        │
│   Date               2022-03-15                                          │
│   Cost               —                                                   │
│   Source             —                                                   │
│                                                                          │
│ System                                                                   │
│   Created            2026-05-19 by Suprameds                             │
│   Updated            —                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Behavior

- Back link to `/livestock`.
- Page header: name (or tag if no name) + tag chip + 1-line summary.
- Four labeled sections rendered as `<dl>` key/value pairs.
- Dam/sire are links to `/livestock/<their-uuid>` if linked.
- No tabs in 1A. When 1C/1D/1E land they add a `<Tabs>` component with
  Overview as the first tab.
- No edit affordance.
- Not-found: `notFound()` on null result. Covers both real 404 and
  cross-farm RLS-hidden rows.

## Section 6 — Out of scope (non-goals for 1A)

Listed explicitly so spec review catches scope creep:

- Edit animal (`/admin/animals/<id>` covers typos)
- Delete animal (`/admin` covers it; soft-delete via `retired_at` is
  Health/Breeding-event concern)
- Health, Breeding, Production tabs (Phases 1D, 1E, 1C)
- Vaccination reminders / overdue badges on rows (Phase 1G)
- Dam/sire pickers in the register form (Phase 1E adds calving flow
  that auto-links calves)
- RFID tag, external IDs, acquisition cost/source, manual lifecycle
  override (all in `/admin` if needed)
- Bulk actions (move animals between structures, mark retired)
- Multi-filter sidebar (lifecycle/health/structure/sex filters)
- Combobox / typeahead for breed/structure (plain select is fine at
  current cardinality)
- Mobile-optimized drawer (Sheet is responsive but bulk-migration is
  desktop work; test on mobile, don't tune)
- i18n (English-only; Telugu labels are in the species table but unused
  here; will come in a later sweep)
- JS tests (repo has no framework; verification is typecheck + biome +
  manual smoke, per super_admin convention)

## Open implementation questions for writing-plans

- `formatAge` precision: do we want years+months down to 1y under 2y,
  months for 2m–24m, days for under 2m? Or simpler "X years" only?
  (Probably: years+months for ≥1y, months for ≥1mo, days under 1mo.)
- ~~`acquisition_kind` enum values~~ **Resolved during spec review:** DB
  CHECK constraint `animals_acquisition_kind_check` allows exactly
  `['born_onfarm', 'purchased', 'gifted', 'transferred']`. Zod enum
  updated to match.
- Whether to show `health_state` as a colored badge in the detail page
  (sick/quarantined would stand out). Default: plain text in 1A; badges
  arrive with 1D when they're actionable.
- Whether to load breeds filtered by species_code on the server
  (smaller initial payload) vs all breeds at once (simpler component).
  Default: all at once — 30 breeds total is tiny.

## What ships when this is built

- `/livestock` shows the operator's animals (paginated, searchable,
  filterable by species).
- `+ Register animal` opens a Sheet that adds animals one at a time
  with "Save and add another" for bulk migration.
- `/livestock/<id>` shows the full read-only overview.
- Existing dashboard placeholder ("Phase 0 complete — Next: run Phase 1
  to enable Livestock") becomes obsolete; can be cleared in a later
  polish commit but not in this one.
- Sidebar `/livestock` link already exists in `dashboard-shell.tsx` —
  no nav changes needed.
- Empty-state copy invites first-time use.
- Foundation in place for 1B (flocks, parallel) and 1C/1D/1E (events,
  attached to animals).
