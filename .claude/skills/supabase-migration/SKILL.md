---
name: supabase-migration
description: Scaffold and validate a new Supabase migration for FarmHeaven. Creates a timestamped SQL file with RLS + policies pre-stubbed, runs it on a Supabase branch DB via the supabase-farmheaven MCP, regenerates TypeScript types, and runs the admin-import-boundary script. Use when adding a new table, column, RPC, view, or RLS policy. NOT for emergency hotfixes against prod — those go through `supabase migration new` manually.
disable-model-invocation: true
---

# Supabase Migration

FarmHeaven has 19 migrations, 59 tables, 111 RLS policies. Every new table is a RLS-leak waiting to happen. This skill enforces the policy guard at migration time, not at PR-review time.

## When to invoke

- `/supabase-migration <slug>` — e.g. `/supabase-migration add-flock-photos`.
- Use BEFORE writing any code that depends on the new schema.
- Skip if you're only tweaking RLS on an existing table — for that, use the supabase-farmheaven MCP `apply_migration` directly with a focused policy patch.

## Procedure

### 1. Determine the next migration number

Migrations live at `supabase/migrations/`. Filenames follow `YYYYMMDDHHMMSS_NN_<slug>.sql` where `NN` increments monotonically.

```bash
ls supabase/migrations/ | tail -3
```

Pick the next `NN` (e.g. last is `19_super_admin_column.sql` → next is `20`). Generate the timestamp:

```bash
date -u +%Y%m%d%H%M%S
```

### 2. Scaffold the file

Create `supabase/migrations/<timestamp>_<NN>_<slug>.sql` with this skeleton — keep ALL the section headers, fill or delete the bodies:

```sql
-- Migration <NN>: <slug>
-- Purpose: <one-line motivation>
-- Touches: <comma-separated tables/views/functions>

-- ============================================================
-- 1. SCHEMA CHANGES (CREATE TABLE / ALTER TABLE / etc.)
-- ============================================================

-- <DDL here>

-- ============================================================
-- 2. INDEXES
-- ============================================================

-- Indexes for foreign keys + common WHERE clauses.
-- Every FK column gets a btree index unless justified.

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================
-- REQUIRED for every new table. CI rejects migrations that
-- create a table without ENABLE ROW LEVEL SECURITY.

-- ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. POLICIES
-- ============================================================
-- REQUIRED: one policy per (operation, role) combination you
-- want to allow. Default = deny. Use the existing helper:
--   public.is_farm_member(farm_id)  -- defined in migration 14
-- which checks auth.uid() membership against the farm_members
-- table. Do NOT write raw auth.uid() = ... — use the helper so
-- the team has one place to evolve the policy logic.

-- CREATE POLICY "<table>_member_read"  ON public.<table>
--   FOR SELECT TO authenticated
--   USING (public.is_farm_member(farm_id));
--
-- CREATE POLICY "<table>_member_write" ON public.<table>
--   FOR INSERT TO authenticated
--   WITH CHECK (public.is_farm_member(farm_id));
--
-- ... and UPDATE, DELETE as needed.

-- ============================================================
-- 5. GRANTS (rare — most access goes through RLS)
-- ============================================================

-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.<table> TO authenticated;

-- ============================================================
-- 6. SEED DATA (optional)
-- ============================================================

-- INSERT INTO public.<table> (...) VALUES (...);
```

### 3. Validate on a Supabase branch

```
mcp__supabase-farmheaven__create_branch {name: "migration-<slug>"}
mcp__supabase-farmheaven__apply_migration {branch_id: ..., name: "<slug>", query: <file contents>}
mcp__supabase-farmheaven__list_tables {schemas: ["public"]}    # confirm table exists
mcp__supabase-farmheaven__get_advisors {branch_id: ..., type: "security"}   # MUST be clean
mcp__supabase-farmheaven__get_advisors {branch_id: ..., type: "performance"} # review warnings
```

The `security` advisor is the gate. If it returns any finding (RLS not enabled, policy missing, SECURITY DEFINER without search_path), the migration is rejected — fix and re-apply.

### 4. Regenerate types

After the branch DB looks good:

```bash
pnpm db:types
```

This writes to `packages/db/src/types.ts`. Commit the regenerated file alongside the migration in the SAME commit.

### 5. Sanity checks before commit

```bash
pnpm exec biome check --write packages/db/src/types.ts
bash scripts/check-admin-import-boundary.sh
pnpm --filter @farmheaven/web typecheck   # types.ts changes can break call sites
pnpm --filter @farmheaven/web test
```

### 6. Apply to remote `main` project ONLY after review

The branch DB is for validation. The actual `main` project still needs the migration applied — but **never via this skill**. Either:
- Push the branch to GitHub, open a PR, let the user (Nikhilpnkr) apply on merge, OR
- `mcp__supabase-farmheaven__merge_branch` after explicit confirmation.

This skill stops at step 5. It does NOT modify the production Supabase project.

## Non-negotiables

- **Every new table has RLS enabled + at least one policy per intended operation.** Bare `ENABLE ROW LEVEL SECURITY` without policies is also fail — that locks the table to nobody.
- **Use `is_farm_member(farm_id)` not raw `auth.uid()`.** Future single-source policy refactor depends on it.
- **`SECURITY DEFINER` functions must set `search_path`** — `SET search_path = public, pg_temp` at minimum. Sentry advisor flags this; don't override.
- **No `DROP TABLE`** without `IF EXISTS` and an `ON DELETE CASCADE` audit of FKs first.
- **Soft delete pattern**: tables get a `deleted_at timestamptz` column and a partial unique index `WHERE deleted_at IS NULL`. Hard delete is for migrations only.

## What this skill does NOT do

- Edit Supabase functions / Edge Functions — use `deploy_edge_function` MCP directly.
- Hot-patch production RLS — that's an incident response, not a migration.
- Reset the main project — `db:reset` is for local supabase CLI dev only.

## Related

- CLAUDE.md → "Security → RLS on by default"
- `scripts/check-admin-import-boundary.sh` — runs on every Edit hook
- Future subagent: `rls-policy-reviewer` reviews this migration's policies before commit
