# Super Admin — Design Spec

**Status:** Brainstorm complete. Ready for implementation plan.
**Date:** 2026-05-18
**Project:** FarmHeaven (apps/web)

## Why this exists

The operator (you) needs unrestricted, cross-tenant access to fix bad data,
inspect any farm's state for debugging or support, and run one-off operations
the per-tenant UI doesn't expose. Today there is no UI for this — your only
options are Supabase Studio (separate auth, separate URL) and direct SQL via
MCP. Both are slower than a purpose-built tool inside the app.

Super_admin is **not** a new role inside the per-farm RBAC matrix. It is a
platform-tier capability that lives outside the multi-tenant model and uses
Supabase's `service_role` key to bypass RLS by design.

## Locked decisions (clarifying-question phase)

1. **Scope:** Generic data browser. Sidebar of public tables → paginated row
   list → row detail with JSON-edit modal. No curated per-domain pages.
2. **Bootstrap:** Manual SQL for the first super_admin
   (`update profiles set is_super_admin = true where phone = '<your phone>'`).
   No promote-UI in MVP.
3. **Authentication:** Same phone-OTP login as regular users. Middleware on
   `/admin/*` re-reads `profiles.is_super_admin` from the DB on every request.
   Service-role key never reaches the browser.
4. **Audit logging:** None. YAGNI.
5. **Edit experience:** Raw JSON-per-row textarea. Server validates JSON
   parses, then `UPDATE ... SET (every column) = ...`. Delete button on the
   same row-detail page. No per-column smart form, no SQL console in MVP.
6. **Architecture:** RSC + Server Actions (matches existing onboarding
   pattern). Service-role client only ever instantiated server-side.

## Section 1 — Data model + middleware gate

### Migration 19 (new)

```sql
alter table public.profiles
  add column is_super_admin boolean not null default false;

create index if not exists profiles_is_super_admin_idx
  on public.profiles (id) where is_super_admin = true;
```

Partial index keeps the middleware lookup cheap even as `profiles` grows.

### Bootstrap SQL (run-once, manual)

```sql
update public.profiles set is_super_admin = true where phone = '919573299175';
```

Applied via Supabase MCP after migration 19 lands.

### Middleware change

Extend `apps/web/src/middleware.ts`. After the existing `if (!user)` redirect
to `/login` but before `return response`:

```ts
if (pathname.startsWith('/admin')) {
  const { data: { user: u } } = await supabase.auth.getUser();
  const { data: p } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', u!.id)
    .single();
  if (!p?.is_super_admin) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }
}
```

The `supabase` client is the user-scoped one (RLS active). The SELECT works
because `profiles_self_read` policy allows users to read their own row.

**404, not 403** — so existence of the admin surface isn't disclosed to
unauthorized callers.

## Section 2 — Route structure + service-role boundary

### File layout

```
apps/web/src/app/(admin)/
├── layout.tsx                    # admin shell, calls assertSuperAdmin() once
├── admin/
│   ├── page.tsx                  # /admin → redirect to /admin/profiles
│   ├── _lib/
│   │   ├── admin-client.ts       # re-exports createAdminClient + assertSuperAdmin
│   │   └── table-list.ts         # curated allowlist of (table, label, columns, group)
│   └── [table]/
│       ├── page.tsx              # list rows of [table], paginated
│       └── [id]/
│           ├── page.tsx          # row detail (read view + foreign-key inbound list)
│           └── actions.ts        # update_row(table, id, json) and delete_row(table, id) server actions
```

### Service-role boundary

The service-role key is the most dangerous secret in the system. One rule,
backed by three checks:

> **Rule:** `createAdminClient()` is imported only from files inside
> `apps/web/src/app/(admin)/`. Anything in `(app)/` or `(storefront)/`
> importing it must fail CI.

**Check 1 — `assertSuperAdmin()` helper** in `_lib/admin-client.ts`:

```ts
import { createClient } from '@farmheaven/db/server';

export async function assertSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('not_authenticated');
  const { data } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();
  if (!data?.is_super_admin) throw new Error('not_super_admin');
  return user;
}

export { createAdminClient } from '@farmheaven/db/admin';
```

Every server action and page in `(admin)/` calls `assertSuperAdmin()` before
touching `createAdminClient()`. Belt-and-suspenders with middleware.

**Check 2 — runtime guard in admin.ts** (already exists): throws if
`SUPABASE_SERVICE_ROLE_KEY` is missing. Since the env var isn't exposed to
client bundles, accidental client-side imports fail at first use.

**Check 3 — CI import-boundary check** (see Section 5).

### Data flow for one edit

```
User clicks "Save" in JSON modal
  → Client component invokes Server Action update_row(table, id, json)
  → Server Action: assertSuperAdmin() — throws if not super_admin
  → Server Action: createAdminClient() — service-role from process.env
  → admin.from(table).update(parsed).eq('id', id)
  → revalidatePath(`/admin/${table}`)
  → return { ok: true } | { error: pg_error_message }
  → Client: toast + close modal (or inline error)
```

## Section 3 — Table list page

### URL

`/admin/[table]?page=N&size=50&order=col&dir=desc`

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🛡 ADMIN (super_admin only)                                  Exit admin →│
├───────────────┬──────────────────────────────────────────────────────────┤
│ ▾ identity    │ profiles                                                 │
│   profiles    │ 1,247 rows                                               │
│   orgs        │ ────────────────────────────────────────────────────     │
│   farms       │ id              full_name      phone          ⋯          │
│   memberships │ fc49f602-…      919573299175   919573299175    [edit]    │
│ ▾ livestock   │ ...                                                      │
│   animals     │                                                          │
│   ...         │   ‹‹ Prev  ·  page 1 of 25  ·  Next ››                   │
└───────────────┴──────────────────────────────────────────────────────────┘
```

### Sidebar

- Hardcoded in `_lib/table-list.ts`, grouped by domain matching migrations
  02–12 (identity / livestock / crops / inventory / finance / commerce /
  iot / compliance).
- Active table highlighted.
- "Exit admin →" returns to `/dashboard` — visual cue you're in a different
  mode.

### Table area

- Header: `<table_name>` + total count (cheap `select count(*)`, capped at
  10,000 — show "10,000+ rows" if larger so `count(*)` never blocks on a
  huge table).
- Columns: 4–5 informative columns per table, hardcoded in `table-list.ts`
  (e.g., for `profiles`: id, full_name, phone, email). Trailing `[edit]`
  link in the last column.
- Long values truncated with title tooltip.
- No inline editing — too easy to misclick. All edits via row detail.

### Pagination

- Server-side `range(offset, offset + size - 1)`.
- Default `size = 50`. Query-string driven so back button works.
- Page link block at the bottom.

### Sorting

- Click column header → toggle asc/desc. Pushes `?order=col&dir=…`.
- Default sort: `created_at desc` if column exists, otherwise PK desc.

### Filtering / search

**NOT in MVP.** Pagination + sort + direct row-by-ID URLs cover the use case.

## Section 4 — Row detail + JSON edit

### URL

`/admin/[table]/[id]`

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← profiles · fc49f602-…                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ Read-only summary                                  [Edit JSON]  [Delete] │
│ ────────────────                                                         │
│  id           fc49f602-…                                                 │
│  full_name    919573299175                                               │
│  phone        919573299175                                               │
│  is_super_admin true                                                     │
│  created_at   2026-05-18T07:10:59Z                                       │
│  ...                                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ Foreign-key inbound (other tables that point here)                       │
│ ────────────────                                                         │
│  • orgs.owner_id        → 0 rows                                         │
│  • memberships.user_id  → 1 row                                          │
│  • audit_log.actor_id   → 0 rows                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Read-only summary

- Vertical key/value of every column (including ones hidden in the list).
- Long values: truncated with click-to-expand.
- Geography columns: WKT text.
- JSONB columns: pretty-printed in a `<pre>` block.

### Edit JSON modal

- Pre-fills a `<textarea>` (monospace) with `JSON.stringify(row, null, 2)`.
- Primary key shown but visually greyed out. Server action ignores any `id`
  change in the submitted JSON (changing PKs invites orphans).
- Banner at the top: "⚠ You are editing live data via service-role. No undo."
- Save flow:
  1. Client parses JSON. Bad JSON → inline error, no submit.
  2. Server Action `update_row(table, id, json_string)`.
  3. Server: `assertSuperAdmin()`. Parse JSON server-side (defense in depth).
     Strip `id` from payload.
  4. `createAdminClient().from(table).update(parsed).eq('id', id)`.
  5. Return `{ ok: true }` or `{ error: <pg error message> }`.
  6. Client: toast + close + `revalidatePath` on success; inline PG error
     message on failure.

### Delete button

- Opens confirm modal (Section 5).
- After successful delete, redirect to `/admin/[table]` (list page).

### Foreign-key inbound section

- Read from `pg_catalog.pg_constraint` once on page load, cached per session.
- For each inbound FK: table name + count of referencing rows. No filter
  link in MVP (filtering is out of scope).
- Purpose: tells you "deleting this farm will fail or cascade to 47 rows"
  before you click.

## Section 5 — Safety rails

- **Delete confirmation echoes the PK.** Modal: *"Type `<the actual UUID>`
  to confirm deletion."* Delete button stays disabled until the input
  matches exactly. No lazy y/N dialog.
- **Last-super_admin guard, server-side.** Two paths to the same lockout:
  editing your own `profiles.is_super_admin` to false, OR deleting your
  own `profiles` row. Both `update_row` and `delete_row` must check: if
  the target row has `is_super_admin = true` AND
  `select count(*) from profiles where is_super_admin = true` returns 1 AND
  (for update: the new payload sets it false; for delete: always) →
  reject with `last_super_admin`. Server-side gate (not UI). The lockout
  is structurally impossible regardless of which surface you go through.
- **Visual danger styling.** Dark topbar, persistent 🛡 ADMIN badge, red
  `[Delete]` button, prominent "Exit admin →" link. The admin pages should
  never look like normal app pages.
- **Curated table allowlist** (`_lib/table-list.ts`). Excludes
  `spatial_ref_sys` (8k PostGIS rows), `audit_log_default` /
  `sensor_readings_default` (partition children, confusing), and system
  schemas. ~30 tables hardcoded. Adding a new table = one-line edit.
- **CI import-boundary check.** A Biome lint rule, or a simple shell test
  in CI, that fails if `createAdminClient` is imported from a path outside
  `apps/web/src/app/(admin)/`. Mechanical guard against the "I'll just
  use it for one quick thing" pattern.

## Section 6 — Out of scope (non-goals)

Listed explicitly so spec review catches scope creep:

- SQL console / arbitrary query runner
- Audit logging of admin actions (Q4 said no)
- Impersonate-a-user mode
- Promote-to-super-admin UI (manual SQL is the mechanism)
- Full-text search across tables
- Per-column smart form / Monaco editor
- Inline cell editing in the list view
- Bulk operations (multi-row delete, mass update)
- Schema migrations through the UI (use Supabase MCP)
- Storage browser
- Edge function inspector
- Auth user creation/disabling
- **Team management page** — separate parked spec at
  [docs/superpowers/specs/2026-05-18-team-management-parked.md](2026-05-18-team-management-parked.md)

## Open implementation questions for writing-plans

- Exact list of tables for the initial allowlist in `_lib/table-list.ts`.
  Probably draft from the migration filenames and refine after first use.
- Whether the FK-inbound count query is one combined query or one per FK.
  Affects load time for tables with many FKs.
- Whether `update_row` should diff submitted vs current and only UPDATE
  changed columns (PG default behavior for unchanged columns), or just
  send the full row each time. Latter is simpler and PG handles it fine.
- How `Database` types from `packages/db/src/types.ts` interact with the
  generic `from(table)` call — we lose row-type narrowing because `table`
  is a string. Probably cast result to `Record<string, unknown>` and own
  the JSON serialization.

## What ships when this is built

- Migration 19 applied on Supabase (`profiles.is_super_admin` column).
- `update profiles set is_super_admin = true where phone = '919573299175'`
  run via MCP.
- Middleware redirects non-super_admins from `/admin/*` to `/404`.
- `/admin/profiles` (and every other allowlisted table) renders a
  paginated, sortable list.
- `/admin/profiles/<id>` renders read-only summary + JSON edit modal +
  delete confirm.
- CI fails on stray `createAdminClient` imports outside `(admin)/`.
- Existing app behavior unchanged for non-super_admin users.
