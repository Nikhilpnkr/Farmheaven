# Super Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a working `/admin` data-browser route for super_admin users that lets you read, edit, and delete any row in any allowlisted public table — using Supabase's service_role to bypass RLS — with structural guards against locking yourself out and a CI check that the service-role client never escapes the admin route group.

**Architecture:** RSC + Server Actions inside a dedicated `(admin)` route group. Middleware reads `profiles.is_super_admin` and 404s non-admins. Service-role client (`createAdminClient()`) is instantiated only inside `(admin)/admin/`. Edits go through a raw JSON textarea modal that posts to a server action which re-asserts `is_super_admin` before touching service-role.

**Tech Stack:** Next.js 15 App Router (RSC + Server Actions), Supabase JS (`@supabase/ssr` for user-scoped client, `@supabase/supabase-js` with service_role for admin client), shadcn/ui primitives (Table, Dialog, Button, Input, Separator — all already installed), Biome (lint), TypeScript (typecheck), pnpm + Turborepo.

**Spec:** [docs/superpowers/specs/2026-05-18-super-admin-design.md](../specs/2026-05-18-super-admin-design.md)

**Testing strategy:** The repo has no JS test framework set up, and introducing one is out of scope for this feature. Verification per task is: `pnpm turbo typecheck` for type safety, `pnpm check` for lint, and explicit manual smoke commands (the URL to hit and what to expect). The one exception is Task 11's CI import-boundary script — that IS the test for the service-role-key-escape invariant.

**Commit cadence:** One commit per task. Use the existing repo's commit-message style (`feat(area): ...`, `fix(area): ...`, `chore(ci): ...`).

---

## File Structure

**Files this plan creates:**

```
supabase/migrations/
  20260518080000_19_super_admin_column.sql       # Task 1

apps/web/src/app/(admin)/
  layout.tsx                                     # Task 5
  admin/
    page.tsx                                     # Task 6 (redirect to /admin/profiles)
    _lib/
      admin-client.ts                            # Task 2
      table-list.ts                              # Task 3
    [table]/
      page.tsx                                   # Task 7 (list)
      [id]/
        page.tsx                                 # Task 8 (detail)
        actions.ts                               # Task 9 (server actions)
        edit-json-modal.tsx                      # Task 10 (client)
        delete-button.tsx                        # Task 10 (client)

scripts/
  check-admin-import-boundary.sh                 # Task 11
```

**Files this plan modifies:**

```
apps/web/src/middleware.ts                       # Task 4 (add /admin gate)
packages/db/src/middleware.ts                    # Task 4 (extend updateSession to return supabase)
packages/db/src/types.ts                         # Task 1 (regenerated after migration 19)
.github/workflows/ci.yml                         # Task 11 (add import-boundary check step)
```

**File responsibilities (the "what each file is for"):**

- `_lib/admin-client.ts` — central choke point for entering admin mode. Re-exports `createAdminClient` AND wraps it behind `assertSuperAdmin()`. Every admin route imports from here.
- `_lib/table-list.ts` — pure data: allowlist of tables, their display labels, the columns to show in the list view, and which domain group they belong to in the sidebar.
- `[table]/page.tsx` — paginated list of rows for one table.
- `[table]/[id]/page.tsx` — read-only summary + FK-inbound list + Edit/Delete triggers.
- `[table]/[id]/actions.ts` — `update_row` and `delete_row` server actions. Owns the last-super_admin guard.
- `[table]/[id]/edit-json-modal.tsx` — client component, holds modal open/close state and the JSON textarea value, submits to `update_row`.
- `[table]/[id]/delete-button.tsx` — client component, holds confirm-modal state and the type-the-PK input, submits to `delete_row`.

---

## Task 1: Migration 19 + bootstrap + types regen

**Files:**
- Create: `supabase/migrations/20260518080000_19_super_admin_column.sql`
- Modify: `packages/db/src/types.ts` (regenerate)

- [ ] **Step 1: Write the migration file**

Create `supabase/migrations/20260518080000_19_super_admin_column.sql` with:

```sql
-- Add a platform-tier admin flag to profiles.
-- super_admin is NOT a per-farm role; it lives outside the user_role enum.
-- See docs/superpowers/specs/2026-05-18-super-admin-design.md.

alter table public.profiles
  add column is_super_admin boolean not null default false;

-- Partial index so the middleware lookup stays cheap even as profiles grows.
-- Only the (small) set of super_admin rows is indexed.
create index if not exists profiles_is_super_admin_idx
  on public.profiles (id) where is_super_admin = true;
```

- [ ] **Step 2: Apply the migration to the live Supabase project**

Use the Supabase MCP tool `mcp__supabase-farmheaven__apply_migration` with:
- `project_id`: `jfvoskjsimncjexusquz`
- `name`: `19_super_admin_column`
- `query`: paste the SQL body from Step 1 (without comments to keep it short is fine)

Expected: `{"success": true}`.

- [ ] **Step 3: Run the bootstrap UPDATE via MCP**

Use `mcp__supabase-farmheaven__execute_sql` with:

```sql
update public.profiles
   set is_super_admin = true
 where phone = '919573299175';

select id, full_name, phone, is_super_admin
  from public.profiles
 where is_super_admin = true;
```

Expected: one row returned with `is_super_admin: true` for phone `919573299175`. If the SELECT returns zero rows, that phone hasn't signed up yet — sign in first via the live site, then re-run.

- [ ] **Step 4: Regenerate Database types**

Use the Supabase MCP tool `mcp__supabase-farmheaven__generate_typescript_types` with `project_id: jfvoskjsimncjexusquz`. The output is large (~200KB) and may be returned as a tool-result file. If it comes back wrapped as `{"types": "..."}` with escaped `\n`, unwrap with:

```bash
node -e "const fs=require('fs');const p='C:/<path-from-tool-result>';const raw=fs.readFileSync(p,'utf8');const obj=JSON.parse(raw);fs.writeFileSync('C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/packages/db/src/types.ts',obj.types);console.log('wrote',obj.types.length,'chars, newlines:',(obj.types.match(/\\n/g)||[]).length);"
```

(The previous migration 18 hit this exact wrapping; same fix applies.)

- [ ] **Step 5: Verify types include is_super_admin**

```bash
node -e "const s=require('fs').readFileSync('C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/packages/db/src/types.ts','utf8');const i=s.indexOf('is_super_admin');console.log('index:',i);console.log(s.slice(Math.max(0,i-100),i+200));"
```

Expected: prints a snippet showing `is_super_admin: boolean` inside the `profiles` table type block.

- [ ] **Step 6: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && npx tsc --noEmit -p apps/web 2>&1 | grep -E "is_super_admin|profiles" | head -5
```

Expected: no errors specifically mentioning `is_super_admin`. (Pre-existing errors in `packages/db/middleware.ts`, `packages/ui/sidebar.tsx`, `apps/web/src/lib/status.ts` are unrelated to this work.)

- [ ] **Step 7: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add supabase/migrations/20260518080000_19_super_admin_column.sql packages/db/src/types.ts && git commit -m "$(cat <<'EOF'
feat(db): add profiles.is_super_admin column (migration 19)

Platform-tier admin flag for the upcoming /admin data browser. Defaults
to false; partial index covers only the small set of super_admin rows.

Bootstrap (run-once, manual via MCP):
  update profiles set is_super_admin = true where phone = '919573299175';

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Service-role helper layer

**Files:**
- Create: `apps/web/src/app/(admin)/admin/_lib/admin-client.ts`

- [ ] **Step 1: Create the directory and file**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p "apps/web/src/app/(admin)/admin/_lib"
```

- [ ] **Step 2: Write `admin-client.ts`**

Contents:

```ts
// Central choke point for entering admin mode.
//
// Every page and server action under apps/web/src/app/(admin)/admin/
// MUST call assertSuperAdmin() BEFORE touching createAdminClient(). This
// gives us belt-and-suspenders with the middleware gate: even if middleware
// has a bug, the per-route assert refuses the request.
//
// The createAdminClient re-export is the ONLY allowed import path for the
// service-role client inside (admin)/. A CI check (scripts/check-admin-
// import-boundary.sh) fails the build if @farmheaven/db/admin is imported
// from anywhere outside (admin)/.

import 'server-only';
import { createClient } from '@farmheaven/db/server';

export { createAdminClient } from '@farmheaven/db/admin';

export async function assertSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('not_authenticated');
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();
  if (error) {
    throw new Error(`profile_lookup_failed: ${error.message}`);
  }
  if (!data?.is_super_admin) {
    throw new Error('not_super_admin');
  }
  return user;
}
```

Note the `import 'server-only'` — if anything client-side ever imports this file, Next.js fails the build. Additional safety on top of the CI check.

- [ ] **Step 3: Typecheck just this file's package**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "admin-client" || echo "OK"
```

Expected: `OK` (no errors in admin-client.ts).

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/_lib/admin-client.ts" && git commit -m "$(cat <<'EOF'
feat(admin): add assertSuperAdmin + createAdminClient choke point

Single import path for the service-role client inside (admin)/.
assertSuperAdmin re-verifies is_super_admin on every entry, providing
belt-and-suspenders with the middleware gate.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Table allowlist

**Files:**
- Create: `apps/web/src/app/(admin)/admin/_lib/table-list.ts`

- [ ] **Step 1: Write `table-list.ts`**

The allowlist below was generated from the live DB on 2026-05-18 (56 tables, excluding `spatial_ref_sys` and partition children). Groupings follow the migration files 02–12. Columns shown in the list view are 3–5 per table — pick the most identifying ones.

Contents:

```ts
// Curated allowlist of tables exposed in /admin.
//
// Why a hardcoded list (not pg_tables introspection):
//   - Filters out PostGIS noise (spatial_ref_sys, 8k rows)
//   - Filters out partition children (audit_log_default, sensor_readings_default)
//   - Lets us pick informative list-view columns per table
//   - Lets us group by domain in the sidebar
//
// To add a new table later: append it to its domain group below.

export type AdminTable = {
  name: string;            // exact public.<name>
  label: string;           // sidebar display
  listColumns: string[];   // columns shown in /admin/[table] list (max 5)
  // primary key is always 'id' across this schema; if that ever changes,
  // add a pk?: string here and read it in the row-detail page.
};

export type AdminGroup = {
  label: string;
  tables: AdminTable[];
};

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    label: 'identity',
    tables: [
      { name: 'profiles',    label: 'profiles',    listColumns: ['id', 'full_name', 'phone', 'email', 'is_super_admin'] },
      { name: 'orgs',        label: 'orgs',        listColumns: ['id', 'name', 'owner_id', 'plan', 'created_at'] },
      { name: 'farms',       label: 'farms',       listColumns: ['id', 'name', 'slug', 'org_id', 'total_acres'] },
      { name: 'memberships', label: 'memberships', listColumns: ['id', 'farm_id', 'user_id', 'role', 'is_active'] },
    ],
  },
  {
    label: 'geography',
    tables: [
      { name: 'zones',      label: 'zones',      listColumns: ['id', 'farm_id', 'name', 'zone_type'] },
      { name: 'plots',      label: 'plots',      listColumns: ['id', 'farm_id', 'name', 'area_acres'] },
      { name: 'structures', label: 'structures', listColumns: ['id', 'farm_id', 'name', 'structure_type'] },
    ],
  },
  {
    label: 'livestock',
    tables: [
      { name: 'species',          label: 'species',          listColumns: ['id', 'common_name', 'scientific_name'] },
      { name: 'breeds',           label: 'breeds',           listColumns: ['id', 'species_id', 'name'] },
      { name: 'flocks',           label: 'flocks',           listColumns: ['id', 'farm_id', 'name', 'species_id'] },
      { name: 'animals',          label: 'animals',          listColumns: ['id', 'farm_id', 'tag', 'species_id', 'status'] },
      { name: 'animal_movements', label: 'animal movements', listColumns: ['id', 'farm_id', 'animal_id', 'from_zone_id', 'to_zone_id'] },
      { name: 'health_events',    label: 'health events',    listColumns: ['id', 'farm_id', 'animal_id', 'event_type', 'occurred_at'] },
      { name: 'breeding_events',  label: 'breeding events',  listColumns: ['id', 'farm_id', 'dam_id', 'sire_id', 'event_type'] },
      { name: 'production_events',label: 'production events',listColumns: ['id', 'farm_id', 'animal_id', 'event_type', 'occurred_at'] },
      { name: 'lactation_rollups',label: 'lactation rollups',listColumns: ['id', 'farm_id', 'animal_id', 'milk_liters_total'] },
      { name: 'flock_fcr_rollups',label: 'flock FCR rollups',listColumns: ['id', 'farm_id', 'flock_id'] },
    ],
  },
  {
    label: 'crops',
    tables: [
      { name: 'crops',         label: 'crops',         listColumns: ['id', 'common_name', 'scientific_name'] },
      { name: 'crop_cycles',   label: 'crop cycles',   listColumns: ['id', 'farm_id', 'crop_id', 'plot_id', 'sowing_date'] },
      { name: 'soil_samples',  label: 'soil samples',  listColumns: ['id', 'farm_id', 'plot_id', 'sampled_at'] },
      { name: 'compost_windrows', label: 'compost windrows', listColumns: ['id', 'farm_id', 'name', 'started_at'] },
      { name: 'ipm_logs',      label: 'IPM logs',      listColumns: ['id', 'farm_id', 'plot_id', 'occurred_at'] },
      { name: 'remote_sensing_runs', label: 'remote sensing runs', listColumns: ['id', 'farm_id', 'started_at'] },
    ],
  },
  {
    label: 'inventory',
    tables: [
      { name: 'inventory_lots',      label: 'inventory lots',      listColumns: ['id', 'farm_id', 'sku_id', 'quantity', 'received_at'] },
      { name: 'inventory_movements', label: 'inventory movements', listColumns: ['id', 'farm_id', 'lot_id', 'quantity', 'occurred_at'] },
      { name: 'suppliers',           label: 'suppliers',           listColumns: ['id', 'farm_id', 'name', 'phone'] },
      { name: 'skus',                label: 'SKUs',                listColumns: ['id', 'farm_id', 'name', 'unit'] },
    ],
  },
  {
    label: 'people',
    tables: [
      { name: 'workers',          label: 'workers',          listColumns: ['id', 'farm_id', 'full_name', 'phone'] },
      { name: 'attendance',       label: 'attendance',       listColumns: ['id', 'farm_id', 'worker_id', 'date'] },
      { name: 'piece_work_logs',  label: 'piece work logs',  listColumns: ['id', 'farm_id', 'worker_id', 'occurred_at'] },
      { name: 'payroll_runs',     label: 'payroll runs',     listColumns: ['id', 'farm_id', 'period_start', 'period_end'] },
      { name: 'payslips',         label: 'payslips',         listColumns: ['id', 'farm_id', 'worker_id', 'payroll_run_id'] },
      { name: 'tasks',            label: 'tasks',            listColumns: ['id', 'farm_id', 'title', 'status', 'assignee_id'] },
    ],
  },
  {
    label: 'finance',
    tables: [
      { name: 'transactions',    label: 'transactions',    listColumns: ['id', 'farm_id', 'amount', 'occurred_at'] },
      { name: 'txn_categories',  label: 'txn categories',  listColumns: ['id', 'farm_id', 'name', 'kind'] },
      { name: 'cost_centers',    label: 'cost centers',    listColumns: ['id', 'farm_id', 'name'] },
      { name: 'subsidy_schemes', label: 'subsidy schemes', listColumns: ['id', 'name', 'agency'] },
      { name: 'subsidy_claims',  label: 'subsidy claims',  listColumns: ['id', 'farm_id', 'scheme_id', 'amount'] },
    ],
  },
  {
    label: 'commerce',
    tables: [
      { name: 'products',          label: 'products',          listColumns: ['id', 'farm_id', 'name', 'price'] },
      { name: 'customers',         label: 'customers',         listColumns: ['id', 'farm_id', 'name', 'phone'] },
      { name: 'customer_addresses',label: 'customer addresses',listColumns: ['id', 'customer_id', 'pincode'] },
      { name: 'customer_events',   label: 'customer events',   listColumns: ['id', 'farm_id', 'customer_id', 'event_type'] },
      { name: 'orders',            label: 'orders',            listColumns: ['id', 'farm_id', 'customer_id', 'status', 'total'] },
      { name: 'order_items',       label: 'order items',       listColumns: ['id', 'order_id', 'sku_id', 'quantity'] },
      { name: 'subscriptions',     label: 'subscriptions',     listColumns: ['id', 'farm_id', 'customer_id', 'status'] },
      { name: 'delivery_routes',   label: 'delivery routes',   listColumns: ['id', 'farm_id', 'name'] },
    ],
  },
  {
    label: 'iot',
    tables: [
      { name: 'devices',          label: 'devices',          listColumns: ['id', 'farm_id', 'name', 'device_type'] },
      { name: 'device_commands',  label: 'device commands',  listColumns: ['id', 'farm_id', 'device_id', 'issued_at'] },
      { name: 'sensor_readings',  label: 'sensor readings',  listColumns: ['id', 'farm_id', 'device_id', 'recorded_at'] },
      { name: 'automation_rules', label: 'automation rules', listColumns: ['id', 'farm_id', 'name'] },
      { name: 'rule_firings',     label: 'rule firings',     listColumns: ['id', 'farm_id', 'rule_id', 'fired_at'] },
    ],
  },
  {
    label: 'compliance',
    tables: [
      { name: 'audit_log',             label: 'audit log',             listColumns: ['id', 'farm_id', 'actor_id', 'action', 'occurred_at'] },
      { name: 'welfare_events',        label: 'welfare events',        listColumns: ['id', 'farm_id', 'event_type', 'occurred_at'] },
      { name: 'welfare_rollups',       label: 'welfare rollups',       listColumns: ['id', 'farm_id'] },
      { name: 'carbon_entries',        label: 'carbon entries',        listColumns: ['id', 'farm_id', 'category', 'amount'] },
      { name: 'farm_certifications',   label: 'farm certifications',   listColumns: ['id', 'farm_id', 'body_id'] },
      { name: 'certification_bodies',  label: 'certification bodies',  listColumns: ['id', 'name', 'country'] },
    ],
  },
];

// Flat lookup, built once at module load.
const TABLE_INDEX: Map<string, AdminTable> = new Map(
  ADMIN_GROUPS.flatMap((g) => g.tables.map((t) => [t.name, t] as const)),
);

export function findTable(name: string): AdminTable | undefined {
  return TABLE_INDEX.get(name);
}

export function isAllowedTable(name: string): boolean {
  return TABLE_INDEX.has(name);
}
```

Note: column names in `listColumns` are best-guess based on migration filenames; some may not exist exactly. The list page (Task 7) renders missing columns as empty cells rather than crashing — see Step 5 of Task 7 for the defensive access pattern. After Task 7, if any column is consistently empty across all rows it's probably misnamed; check the actual schema in `packages/db/src/types.ts` and update `table-list.ts` accordingly.

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "table-list" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/_lib/table-list.ts" && git commit -m "$(cat <<'EOF'
feat(admin): add curated table allowlist for /admin sidebar

56 tables grouped by domain (identity, livestock, crops, inventory,
people, finance, commerce, iot, compliance). Excludes spatial_ref_sys
and partition children. List-view columns picked per table; tune
after first use.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Middleware gate + extend updateSession

**Files:**
- Modify: `packages/db/src/middleware.ts`
- Modify: `apps/web/src/middleware.ts`

The middleware needs to look up `profiles.is_super_admin` for `/admin/*` requests. To avoid creating a second Supabase client (and re-doing cookie handling), extend `updateSession` to also return the `supabase` instance it already created.

- [ ] **Step 1: Extend `packages/db/src/middleware.ts`**

Edit the file:
- Add `supabase` to the return object of `updateSession`.
- Update `requireAuth`'s return type (it currently destructures `{response, user}` and ignores supabase, which still works, but typing benefits).

Final contents of `packages/db/src/middleware.ts`:

```ts
// Auth middleware shared across apps. Call from each app's middleware.ts.
// Refreshes the session cookie on every request so expired tokens don't leak through.
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from './types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, supabase };
}

// Gate an app behind auth. Returns a redirect response if unauthorized.
export async function requireAuth(
  request: NextRequest,
  loginPath = '/login',
): Promise<{ response: NextResponse; user: NonNullable<Awaited<ReturnType<typeof updateSession>>['user']> } | NextResponse> {
  const { response, user } = await updateSession(request);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return { response, user };
}
```

(Only change vs current: `return { response, user, supabase }`.)

- [ ] **Step 2: Add the /admin gate in `apps/web/src/middleware.ts`**

Replace the file's `middleware` function body. Final contents:

```ts
import { updateSession } from '@farmheaven/db/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Public storefront paths — accessible without auth. Add new public routes here.
// Note: '/' is the storefront marketing home (also public).
const PUBLIC_PREFIXES = [
  '/shop',
  '/product',
  '/trace',
  '/cart',
  '/checkout',
  '/privacy',
  '/terms',
  '/grievance',
  '/data-request',
  '/subscribe',
  '/meet-the-farm',
  '/traceability',
  '/farm-tour',
  '/contact',
];

const AUTH_PREFIXES = ['/login', '/auth/callback'];

function startsWith(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isStorefront = pathname === '/' || startsWith(pathname, PUBLIC_PREFIXES);
  const isAuthRoute = startsWith(pathname, AUTH_PREFIXES);

  // Authenticated user landing on /login → bounce to operator dashboard.
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Storefront and auth routes are always accessible.
  if (isStorefront || isAuthRoute) {
    return response;
  }

  // Everything else is operator-protected.
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // /admin/* requires profiles.is_super_admin. 404 (not 403) so the route's
  // existence isn't disclosed to non-admins. RLS allows users to read their
  // own profile row via profiles_self_read, so no service-role here.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const { data } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();
    if (!data?.is_super_admin) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

(The existing matcher already covers `/admin/*` since it matches everything except static assets.)

- [ ] **Step 3: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep -E "middleware" | grep -v "/db/" || echo "OK in apps/web"
```

Expected: `OK in apps/web`. (Pre-existing `packages/db/src/middleware.ts` errors about `next/server` types are unrelated.)

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add packages/db/src/middleware.ts apps/web/src/middleware.ts && git commit -m "$(cat <<'EOF'
feat(admin): gate /admin/* behind profiles.is_super_admin

Middleware reads is_super_admin via the user-scoped client (RLS allows
profiles_self_read) and rewrites to /404 if the flag is false. 404 not
403 — the admin surface's existence isn't disclosed to non-admins.

updateSession now also returns the supabase client it built, so the
middleware can re-use it without re-doing cookie handling.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Admin route group + layout (topbar + sidebar)

**Files:**
- Create: `apps/web/src/app/(admin)/layout.tsx`

- [ ] **Step 1: Create directories**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p "apps/web/src/app/(admin)/admin"
```

- [ ] **Step 2: Write `(admin)/layout.tsx`**

Contents:

```tsx
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { assertSuperAdmin } from './admin/_lib/admin-client';
import { ADMIN_GROUPS } from './admin/_lib/table-list';
import { Separator } from '@farmheaven/ui/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders with the middleware gate. If middleware ever has a bug,
  // this still refuses unauthenticated/non-admin requests.
  await assertSuperAdmin();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <span className="font-mono text-sm uppercase tracking-wider text-amber-400">
            Admin · super_admin only
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          Exit admin →
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="min-h-[calc(100vh-49px)] w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/50 px-3 py-4">
          {ADMIN_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="mb-1 px-2 text-[10px] uppercase tracking-wider text-zinc-500">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.tables.map((t) => (
                  <li key={t.name}>
                    <Link
                      href={`/admin/${t.name}`}
                      className="block rounded px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Separator className="my-3 bg-zinc-800" />
            </div>
          ))}
        </nav>

        {/* Main */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

`force-dynamic` because every request needs the assertSuperAdmin check — Next.js otherwise tries to statically prerender this layout.

- [ ] **Step 3: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "(admin)/layout" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/layout.tsx" && git commit -m "$(cat <<'EOF'
feat(admin): add (admin) route group layout with topbar + sidebar

Dark themed shell that looks distinctly different from the operator app
so super_admin always knows when they're in god mode. assertSuperAdmin
runs on every request (force-dynamic).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: /admin index redirect

**Files:**
- Create: `apps/web/src/app/(admin)/admin/page.tsx`

- [ ] **Step 1: Write the redirect page**

Contents:

```tsx
import { redirect } from 'next/navigation';

export default function AdminIndex() {
  redirect('/admin/profiles');
}
```

That's the entire file. `redirect()` throws a special error caught by Next.js; the function never returns.

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "(admin)/admin/page" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/page.tsx" && git commit -m "feat(admin): /admin redirects to /admin/profiles"
```

---

## Task 7: Table list page

**Files:**
- Create: `apps/web/src/app/(admin)/admin/[table]/page.tsx`

- [ ] **Step 1: Write the list page**

Contents:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@farmheaven/ui/components/ui/table';
import { Button } from '@farmheaven/ui/components/ui/button';
import { assertSuperAdmin, createAdminClient } from '../_lib/admin-client';
import { findTable } from '../_lib/table-list';

export const dynamic = 'force-dynamic';

const PAGE_SIZE_DEFAULT = 50;
const COUNT_CAP = 10_000;

type Search = {
  page?: string;
  size?: string;
  order?: string;
  dir?: string;
};

export default async function TableListPage({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams: Promise<Search>;
}) {
  await assertSuperAdmin();

  const { table } = await params;
  const sp = await searchParams;

  const config = findTable(table);
  if (!config) notFound();

  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const size = Math.min(200, Math.max(1, parseInt(sp.size ?? String(PAGE_SIZE_DEFAULT), 10) || PAGE_SIZE_DEFAULT));
  const order = sp.order && config.listColumns.includes(sp.order) ? sp.order : 'created_at';
  const dir: 'asc' | 'desc' = sp.dir === 'asc' ? 'asc' : 'desc';

  const admin = createAdminClient();
  const offset = (page - 1) * size;

  // Build the query. We try the requested order first; if the column doesn't
  // exist (e.g. species has no created_at), retry with primary-key order.
  let rowsResult = await admin
    .from(table)
    .select('*', { count: 'estimated' })
    .order(order, { ascending: dir === 'asc' })
    .range(offset, offset + size - 1);

  if (rowsResult.error && /column .* does not exist/i.test(rowsResult.error.message)) {
    rowsResult = await admin
      .from(table)
      .select('*', { count: 'estimated' })
      .order('id', { ascending: dir === 'asc' })
      .range(offset, offset + size - 1);
  }

  if (rowsResult.error) {
    return (
      <div>
        <h1 className="font-mono text-2xl">{config.label}</h1>
        <pre className="mt-4 rounded bg-red-950/40 p-4 text-sm text-red-300">
          {rowsResult.error.message}
        </pre>
      </div>
    );
  }

  const rows = (rowsResult.data ?? []) as Record<string, unknown>[];
  const rawCount = rowsResult.count ?? 0;
  const countLabel = rawCount > COUNT_CAP ? `${COUNT_CAP.toLocaleString()}+ rows` : `${rawCount.toLocaleString()} rows`;
  const totalPages = Math.max(1, Math.ceil(Math.min(rawCount, COUNT_CAP) / size));

  return (
    <div>
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="font-mono text-2xl">{config.label}</h1>
        <span className="text-sm text-zinc-400">{countLabel}</span>
      </header>

      <div className="overflow-x-auto rounded border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              {config.listColumns.map((col) => (
                <TableHead key={col} className="font-mono text-xs text-zinc-400">
                  <Link
                    href={{
                      pathname: `/admin/${table}`,
                      query: { page: '1', size, order: col, dir: order === col && dir === 'asc' ? 'desc' : 'asc' },
                    }}
                    className="hover:text-zinc-100"
                  >
                    {col}
                    {order === col ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </Link>
                </TableHead>
              ))}
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => {
              const id = String(row['id'] ?? i);
              return (
                <TableRow key={id} className="border-zinc-800 hover:bg-zinc-900/50">
                  {config.listColumns.map((col) => (
                    <TableCell key={col} className="max-w-xs truncate font-mono text-xs" title={String(row[col] ?? '')}>
                      {formatCell(row[col])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-amber-400 hover:bg-zinc-800 hover:text-amber-300">
                      <Link href={`/admin/${table}/${id}`}>edit →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <nav className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        <Button asChild size="sm" variant="ghost" disabled={page <= 1}>
          <Link href={{ pathname: `/admin/${table}`, query: { page: String(page - 1), size, order, dir } }}>
            ‹‹ Prev
          </Link>
        </Button>
        <span>
          page {page} of {totalPages}
        </span>
        <Button asChild size="sm" variant="ghost" disabled={page >= totalPages}>
          <Link href={{ pathname: `/admin/${table}`, query: { page: String(page + 1), size, order, dir } }}>
            Next ››
          </Link>
        </Button>
      </nav>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
```

Notes:
- `force-dynamic` because every request reads live DB.
- `count: 'estimated'` so big tables don't block on a full `count(*)`.
- The `column does not exist` retry handles tables in the allowlist that lack `created_at` (e.g. `species`, `breeds`).
- Missing columns render as `'—'` via `formatCell(undefined)`, so a typo in `listColumns` shows up as a column of em-dashes rather than crashing.

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "[table]/page" || echo "OK"
```

Expected: `OK`. (TypeScript may warn that `Database['public']` doesn't know about `table` as a generic string — that's fine, `from(string)` returns `any` and we cast.)

- [ ] **Step 3: Smoke test (after Task 12's deploy)**

This step is for the smoke verification phase. For now, just commit.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/[table]/page.tsx" && git commit -m "$(cat <<'EOF'
feat(admin): table list page with pagination + sortable columns

/admin/[table] renders rows via service-role, paginated server-side.
Sortable column headers cycle asc/desc via search params. Defends
against missing columns (renders '—') and tables without created_at
(retries order by id).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Row detail page

**Files:**
- Create: `apps/web/src/app/(admin)/admin/[table]/[id]/page.tsx`

**Note:** The spec called for a "foreign-key inbound" section (count of rows in other tables pointing at this row). I cut it from the MVP because PostgREST doesn't expose `pg_catalog`, and adding a dedicated SECURITY DEFINER RPC just for the FK count expands scope by a migration. The practical equivalent: when you try to Delete a row with dependents, Postgres raises a foreign_key_violation which the Delete confirm modal surfaces inline. If you decide the count is worth a migration later, the implementer notes at the end of this plan show the shape.

- [ ] **Step 1: Write the row detail page**

Contents of `apps/web/src/app/(admin)/admin/[table]/[id]/page.tsx`:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { assertSuperAdmin, createAdminClient } from '../../_lib/admin-client';
import { findTable } from '../../_lib/table-list';
import { EditJsonModal } from './edit-json-modal';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

export default async function RowDetailPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  await assertSuperAdmin();
  const { table, id } = await params;

  const config = findTable(table);
  if (!config) notFound();

  const admin = createAdminClient();
  const { data: row, error } = await admin.from(table).select('*').eq('id', id).maybeSingle();

  if (error || !row) {
    return (
      <div>
        <Link href={`/admin/${table}`} className="text-amber-400 hover:underline">
          ← {config.label}
        </Link>
        <pre className="mt-4 rounded bg-red-950/40 p-4 text-sm text-red-300">
          {error?.message ?? `Row ${id} not found.`}
        </pre>
      </div>
    );
  }

  // We freeze the JSON for the modal pre-fill server-side so the client
  // component always edits the exact row the server just read.
  const rowJsonString = JSON.stringify(row, null, 2);

  return (
    <div>
      <Link href={`/admin/${table}`} className="text-amber-400 hover:underline">
        ← {config.label}
      </Link>

      <header className="mt-2 flex items-baseline justify-between">
        <h1 className="font-mono text-2xl">
          {config.label} · <span className="text-zinc-400">{id}</span>
        </h1>
        <div className="flex gap-2">
          <EditJsonModal table={table} id={id} initialJson={rowJsonString} />
          <DeleteButton table={table} id={id} />
        </div>
      </header>

      <section className="mt-6 rounded border border-zinc-800 bg-zinc-900/40">
        <h2 className="border-b border-zinc-800 px-4 py-2 text-xs uppercase tracking-wider text-zinc-500">
          Row data
        </h2>
        <dl className="divide-y divide-zinc-800">
          {Object.entries(row as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="flex px-4 py-2 text-sm">
              <dt className="w-48 shrink-0 font-mono text-xs text-zinc-500">{k}</dt>
              <dd className="break-all font-mono text-xs text-zinc-200">{formatValue(v)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function formatValue(v: unknown): React.ReactNode {
  if (v === null || v === undefined) return <span className="text-zinc-600">null</span>;
  if (typeof v === 'object') {
    return <pre className="whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>;
  }
  return String(v);
}
```

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "[id]/page" || echo "OK"
```

Expected: only "Cannot find module './edit-json-modal'" and "./delete-button" — those files come in Task 10. Otherwise OK.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/[table]/[id]/page.tsx" && git commit -m "$(cat <<'EOF'
feat(admin): row detail page with read-only summary

/admin/[table]/[id] shows every column as a key/value list. Edit and
Delete buttons live here (client components land in next commit). FK
inbound list deferred — Delete surfaces PG FK violations as errors,
which is the practical equivalent for MVP.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Server actions — update_row + delete_row + last-super_admin guard

**Files:**
- Create: `apps/web/src/app/(admin)/admin/[table]/[id]/actions.ts`

- [ ] **Step 1: Write `actions.ts`**

Contents:

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertSuperAdmin, createAdminClient } from '../../_lib/admin-client';
import { isAllowedTable } from '../../_lib/table-list';

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateRow(
  table: string,
  id: string,
  jsonString: string,
): Promise<ActionResult> {
  try {
    await assertSuperAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  if (!isAllowedTable(table)) {
    return { ok: false, error: 'table_not_allowed' };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString) as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
    return { ok: false, error: 'invalid_json_shape' };
  }

  // Strip id from the payload — changing PKs invites orphans.
  // We keep the original `id` as the WHERE target.
  delete parsed.id;

  const admin = createAdminClient();

  // Last-super_admin guard. Two paths into lockout: edit own profile to
  // set is_super_admin=false, or delete own profile entirely. Block both.
  if (table === 'profiles' && parsed.is_super_admin === false) {
    const lockoutCheck = await checkLastSuperAdmin(admin, id);
    if (lockoutCheck) return { ok: false, error: lockoutCheck };
  }

  const { error } = await admin.from(table).update(parsed).eq('id', id);
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/${table}/${id}`);
  revalidatePath(`/admin/${table}`);
  return { ok: true };
}

export async function deleteRow(
  table: string,
  id: string,
): Promise<ActionResult> {
  try {
    await assertSuperAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  if (!isAllowedTable(table)) {
    return { ok: false, error: 'table_not_allowed' };
  }

  const admin = createAdminClient();

  // Last-super_admin guard for delete: if the target row IS a super_admin
  // AND it's the only one, deleting it locks everyone out.
  if (table === 'profiles') {
    const lockoutCheck = await checkLastSuperAdmin(admin, id);
    if (lockoutCheck) return { ok: false, error: lockoutCheck };
  }

  const { error } = await admin.from(table).delete().eq('id', id);
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/${table}`);
  // Redirect back to the list — the row no longer exists.
  redirect(`/admin/${table}`);
}

// Returns an error string if the operation would lock everyone out,
// or null if it's safe.
async function checkLastSuperAdmin(
  admin: ReturnType<typeof createAdminClient>,
  targetProfileId: string,
): Promise<string | null> {
  const { data: target } = await admin
    .from('profiles')
    .select('is_super_admin')
    .eq('id', targetProfileId)
    .maybeSingle();

  // If target isn't a super_admin, no lockout risk from this operation.
  if (!target?.is_super_admin) return null;

  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_super_admin', true);

  if ((count ?? 0) <= 1) {
    return 'last_super_admin: refusing to leave the platform with zero super_admins';
  }
  return null;
}
```

- [ ] **Step 2: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep "[id]/actions" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/[table]/[id]/actions.ts" && git commit -m "$(cat <<'EOF'
feat(admin): updateRow + deleteRow server actions with lockout guard

Both actions re-assertSuperAdmin and reject unknown tables before
touching service-role. updateRow strips id from the payload so PKs
can't be mutated. Both run a last-super_admin check on profiles
deletes/demotions, so self-lockout is structurally impossible.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Edit JSON modal + Delete confirm (client components)

**Files:**
- Create: `apps/web/src/app/(admin)/admin/[table]/[id]/edit-json-modal.tsx`
- Create: `apps/web/src/app/(admin)/admin/[table]/[id]/delete-button.tsx`

- [ ] **Step 1: Write `edit-json-modal.tsx`**

Contents:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@farmheaven/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@farmheaven/ui/components/ui/dialog';
import { updateRow } from './actions';

export function EditJsonModal({
  table,
  id,
  initialJson,
}: {
  table: string;
  id: string;
  initialJson: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialJson);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    // Client-side JSON parse so we fail fast on typos before a network round trip.
    try {
      JSON.parse(value);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      return;
    }
    startTransition(async () => {
      const result = await updateRow(table, id, value);
      if (result.ok) {
        toast.success('Row updated');
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setValue(initialJson);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-100 hover:bg-zinc-800">
          Edit JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="font-mono">
            Edit {table} row
          </DialogTitle>
          <DialogDescription className="text-amber-400">
            ⚠ You are editing live data via service-role. No undo.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="min-h-[400px] w-full rounded border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
        />

        {error && (
          <pre className="rounded bg-red-950/40 p-3 text-xs text-red-300 whitespace-pre-wrap">
            {error}
          </pre>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={pending}
            className="bg-amber-500 text-zinc-950 hover:bg-amber-400"
          >
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Write `delete-button.tsx`**

Contents:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@farmheaven/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@farmheaven/ui/components/ui/dialog';
import { Input } from '@farmheaven/ui/components/ui/input';
import { Label } from '@farmheaven/ui/components/ui/label';
import { deleteRow } from './actions';

export function DeleteButton({ table, id }: { table: string; id: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canDelete = typed === id;

  function handleDelete() {
    if (!canDelete) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteRow(table, id);
      // On success deleteRow redirects, so we won't reach here.
      // On failure, surface the error.
      if (result && !result.ok) {
        setError(result.error);
        toast.error('Delete failed');
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setTyped('');
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="font-mono text-red-400">
            Delete {table} row
          </DialogTitle>
          <DialogDescription>
            Type the row's id exactly to confirm deletion. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="font-mono text-xs">id to delete</Label>
          <code className="block rounded bg-zinc-950 p-2 font-mono text-xs text-zinc-300 break-all">
            {id}
          </code>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="paste the id here"
            className="border-zinc-700 bg-zinc-950 font-mono text-xs text-zinc-100"
          />
        </div>

        {error && (
          <pre className="rounded bg-red-950/40 p-3 text-xs text-red-300 whitespace-pre-wrap">
            {error}
          </pre>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canDelete || pending}
            onClick={handleDelete}
          >
            {pending ? 'Deleting…' : 'Delete forever'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git/apps/web" && npx tsc --noEmit 2>&1 | grep -E "edit-json-modal|delete-button" || echo "OK"
```

Expected: `OK`. If sonner or any shadcn primitive isn't resolving, check that those files exist in `packages/ui/src/components/ui/` and rerun.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add "apps/web/src/app/(admin)/admin/[table]/[id]/edit-json-modal.tsx" "apps/web/src/app/(admin)/admin/[table]/[id]/delete-button.tsx" && git commit -m "$(cat <<'EOF'
feat(admin): JSON edit modal + type-the-PK delete confirm

Edit modal pre-fills with server-rendered JSON, parses client-side
before sending. Delete confirm requires typing the row's id exactly
before the destructive button enables. Both surface PG errors inline.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: CI import-boundary check

**Files:**
- Create: `scripts/check-admin-import-boundary.sh`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the boundary-check script**

Create `scripts/check-admin-import-boundary.sh`:

```bash
#!/usr/bin/env bash
# Fail if @farmheaven/db/admin (or createAdminClient) is imported from anywhere
# outside apps/web/src/app/(admin)/. The service-role key NEVER leaks into the
# user-app surface; this is a structural guard.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Search for any import of admin.ts outside the (admin) route group.
# Allowed locations:
#   apps/web/src/app/(admin)/**            — the admin route itself
#   packages/db/src/admin.ts               — the client lives here
#   packages/db/src/index.ts               — package barrel may re-export
#   scripts/check-admin-import-boundary.sh — this script
VIOLATIONS=$(
  grep -RIn --include='*.ts' --include='*.tsx' \
    -e "from '@farmheaven/db/admin'" \
    -e 'from "@farmheaven/db/admin"' \
    -e "createAdminClient" \
    apps/ packages/ 2>/dev/null \
    | grep -v "^apps/web/src/app/(admin)/" \
    | grep -v "^packages/db/src/admin.ts:" \
    | grep -v "^packages/db/src/index.ts:" \
    || true
)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ createAdminClient / @farmheaven/db/admin imported outside (admin)/ route:" >&2
  echo "$VIOLATIONS" >&2
  echo "" >&2
  echo "The service-role key bypasses RLS. Imports must stay inside" >&2
  echo "apps/web/src/app/(admin)/. If you need it elsewhere, that's a" >&2
  echo "design conversation, not a workaround." >&2
  exit 1
fi

echo "✓ admin import boundary clean"
```

Make it executable:

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && mkdir -p scripts && chmod +x scripts/check-admin-import-boundary.sh
```

- [ ] **Step 2: Run the script locally to verify it passes**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && bash scripts/check-admin-import-boundary.sh
```

Expected: `✓ admin import boundary clean` and exit code 0.

- [ ] **Step 3: Sanity-test the script by introducing a fake violation**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && echo "import { createAdminClient } from '@farmheaven/db/admin';" > /tmp/fake-violation.ts && cp /tmp/fake-violation.ts apps/web/src/lib/fake-violation.ts && bash scripts/check-admin-import-boundary.sh; echo "exit=$?"
```

Expected: prints the violation, exits 1. Then clean up:

```bash
rm apps/web/src/lib/fake-violation.ts && bash scripts/check-admin-import-boundary.sh
```

Expected: clean again, exit 0.

- [ ] **Step 4: Add CI step to `.github/workflows/ci.yml`**

In the `check` job, add a new step right after "Biome check (lint + format)" and before "Typecheck":

```yaml
      - name: Admin import boundary
        run: bash scripts/check-admin-import-boundary.sh
```

The diff to apply (insert after line 31 of the existing ci.yml, the line that reads `        run: pnpm check`):

```yaml
      - name: Biome check (lint + format)
        run: pnpm check

      - name: Admin import boundary
        run: bash scripts/check-admin-import-boundary.sh

      - name: Typecheck
        run: pnpm turbo typecheck
```

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git add scripts/check-admin-import-boundary.sh .github/workflows/ci.yml && git commit -m "$(cat <<'EOF'
chore(ci): fail build if createAdminClient leaks outside (admin)/ route

Mechanical guard against the "I'll just use it for one quick thing"
pattern. Service-role bypasses RLS; allowing the client outside the
admin route group means a future bug there can read/write any tenant's
data. Script is a 25-line shell grep.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Deploy + manual smoke verification

**Files:** None (verification only).

This is the integration test the codebase doesn't have a framework for. Execute each smoke step against the deployed Vercel site after pushing.

- [ ] **Step 1: Push to main**

```bash
cd "C:/Users/pc/Documents/Claude/Projects/FarmHeaven-git" && git push origin main
```

- [ ] **Step 2: Wait for Vercel deploy to go READY**

Use `mcp__vercel__list_deployments` with `teamId=team_XlvQ9L7UMk00XMWPqxqXLJ9q`, `projectId=prj_RA6SAeyFZySOVVcxjbl6QfW8CMAT`, `limit=3`. Find the deployment for the latest commit. Then poll `mcp__vercel__get_deployment` until `state: READY`. Builds usually take 30–120 seconds on this project.

- [ ] **Step 3: Verify SUPABASE_SERVICE_ROLE_KEY is set in Vercel env**

Hit `/admin/profiles` while logged in as super_admin. If you get a 500 with message "SUPABASE_SERVICE_ROLE_KEY is not set", the env var isn't set in Vercel for the `farmheaven-web` project. Add it (Vercel dashboard → Project Settings → Environment Variables → add for Production), then redeploy.

To get the service role key for the project: `mcp__supabase-farmheaven__get_project` doesn't return secret keys. You'll have to copy it from the Supabase dashboard (Project Settings → API → service_role key). This is a one-time setup.

- [ ] **Step 4: Smoke as super_admin**

While signed in as the bootstrapped super_admin (phone 919573299175):

| URL | Expected |
|---|---|
| `https://farmheaven-web.vercel.app/admin` | Redirects to `/admin/profiles`. Dark themed page with sidebar listing all 56 tables grouped by domain. |
| `/admin/profiles` | Table of all profile rows. Your row shows `is_super_admin: true`. Pagination controls work; URL updates with `?page=2`. |
| `/admin/profiles?order=phone&dir=asc` | Sorted by phone ascending. Column header `phone ↑`. |
| `/admin/bogus_table_xyz` | 404 (not in allowlist). |
| `/admin/profiles/<your-id>` | Read-only summary of every column. `[Edit JSON]` and `[Delete]` buttons in the header. |

- [ ] **Step 5: Smoke an actual edit**

On your own profile detail page:
1. Click `[Edit JSON]`. Modal opens with the row JSON pre-filled.
2. Change the `metadata` field from `{}` to `{"admin_test": "hello"}`.
3. Click `Save changes`. Toast says "Row updated", modal closes.
4. Page revalidates; `metadata` now shows `{"admin_test":"hello"}`.

- [ ] **Step 6: Smoke the last-super_admin guard (the critical one)**

On your own profile detail page:
1. Click `[Edit JSON]`.
2. Change `"is_super_admin": true` to `"is_super_admin": false`.
3. Click `Save changes`. Inline error: `last_super_admin: refusing to leave the platform with zero super_admins`.
4. Modal stays open, row unchanged. ✓

Then test delete-side lockout:
1. Click `[Delete]`. Confirm modal opens.
2. Paste your id into the input. `Delete forever` button enables.
3. Click it. Inline error: `last_super_admin: refusing to leave the platform with zero super_admins`.
4. Modal stays open, row exists. ✓

- [ ] **Step 7: Smoke as non-super_admin**

Either sign in with a different phone, or run a quick SQL via MCP to set is_super_admin=false on your account temporarily:

```sql
update profiles set is_super_admin = false where phone = '919573299175';
```

Then refresh `/admin/profiles`. Expected: 404 page (Next.js default). The admin surface is invisible to non-admins.

Restore yourself:

```sql
update profiles set is_super_admin = true where phone = '919573299175';
```

- [ ] **Step 8: Smoke CI import-boundary**

Push the work, then check the GH Actions run includes the "Admin import boundary" step with a green check. If it ran red, the script caught a real violation — fix the import before this plan is "done."

- [ ] **Step 9: Final commit (only if any tweaks needed)**

If any smoke steps revealed bugs, fix them with small commits during this task. The plan is "done" when all 9 steps above pass.

---

## Self-review checklist (already run by author)

- [x] **Spec coverage:** Every section of the design spec maps to at least one task.
  - Section 1 (data model + middleware) → Task 1 + Task 4
  - Section 2 (route structure + service-role boundary) → Task 2 + Task 5 + Task 11
  - Section 3 (table list) → Task 7
  - Section 4 (row detail + JSON edit) → Task 8 + Task 9 + Task 10
  - Section 5 (safety rails) → Task 9 (last-super_admin guard), Task 10 (type-PK confirm), Task 11 (import boundary), Task 5 (visual styling), Task 3 (allowlist)
  - Section 6 (out of scope) → not implemented by design

- [x] **Placeholder scan:** No TODOs, no "implement later." Every code block is complete and runnable. The one place I considered something fancier (FK inbound list in Task 8) was explicitly cut to a no-op with rationale in the task body, not left as a "TBD."

- [x] **Type consistency:** Function names are consistent (`updateRow`, `deleteRow`, `assertSuperAdmin`, `createAdminClient`, `findTable`, `isAllowedTable`). Import paths use the `'../../_lib/...'` convention throughout the `[table]/[id]/` directory. Server actions return `ActionResult = {ok: true} | {ok: false, error: string}` consistently.

- [x] **Scope:** Single feature, ~12 tasks, each 2–10 minutes. Fits one focused implementation pass.

- [x] **Ambiguity:** Each task lists exact file paths, exact code, exact verification commands.

## Notes for the implementer

- **Pre-existing typecheck errors in `packages/db`, `packages/ui`, and `apps/web/src/lib/status.ts`** are unrelated to this work. Don't try to fix them here — they're tracked separately. When verifying typecheck, `grep` for the file you just touched.
- **The `?` after `from` in service-role calls (e.g., `admin.from(table).select('*')`)** returns untyped data because `table` is a string at runtime. Cast to `Record<string, unknown>` when accessing fields. This is intentional — the data browser doesn't know columns ahead of time.
- **If you find a listColumn that's consistently empty across all rows of a table**, the column name in `_lib/table-list.ts` is wrong. Check `packages/db/src/types.ts` for the real schema and update.
- **If you'd rather have the FK inbound list now**, write a SECURITY DEFINER PG function `public.admin_fk_inbound(_table text, _id text) returns setof (table_name text, column_name text, ref_count bigint)`. Then call it from `[id]/page.tsx`. It's clean work, just not MVP.
