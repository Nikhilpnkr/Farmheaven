# FarmHeaven — RLS Policy Reference

All 59 FarmHeaven tables have Row Level Security enabled. 111 policies in total.

---

## The core security function

```sql
public.is_member(farm_id, roles[]) → boolean
```

`SECURITY DEFINER`, `set search_path = public`. Called from every policy. Returns true if `auth.uid()` has an active membership with one of the listed roles (or any role if `roles` is null).

Cost: one indexed lookup into `memberships (farm_id, user_id)`.

---

## Policy patterns

### A. Farm-scoped CRUD (most tables)

```sql
create policy "<table>_member_read" on public.<table>
  for select using (public.is_member(farm_id));

create policy "<table>_member_write" on public.<table>
  for all
  using (public.is_member(farm_id))
  with check (public.is_member(farm_id));
```

Applied to all tables with a direct `farm_id` column.

### B. Parent-scoped (FK-joined)

For tables that scope via a FK to a parent row (e.g. `order_items.order_id → orders.farm_id`):

```sql
create policy "order_items_read" on public.order_items for select
  using (exists (select 1 from public.orders o
    where o.id = order_id and public.is_member(o.farm_id)));
```

Applied to: `customer_addresses`, `order_items`, `flock_fcr_rollups`.

### C. Public-read reference tables

```sql
create policy "<table>_public_read" on public.<table> for select using (true);
```

Applied to: `species`, `breeds`, `crops`, `certification_bodies`, `subsidy_schemes`.
No write policy → only the migration user can insert.

### D. Role-restricted

```sql
-- Only owners/managers can write farms:
create policy "farms_owner_write" on public.farms for all
  using (public.is_member(id, array['owner','manager']::public.user_role[]))
  with check (public.is_member(id, array['owner','manager']::public.user_role[]));

-- Only audit readers:
create policy "audit_read_owner" on public.audit_log for select
  using (public.is_member(farm_id, array['owner','manager','accountant']::public.user_role[]));
```

### E. Self-scoped (profiles)

```sql
create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_member_read" on public.profiles
  for select using (
    exists (
      select 1 from public.memberships m1
      join public.memberships m2 on m1.farm_id = m2.farm_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id and m1.is_active
    )
  );
```

You can see your own profile. You can see the profile of anyone you share a farm with. You cannot see strangers.

---

## Role capability matrix

| Capability | owner | manager | accountant | vet | agronomist | worker | customer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Farm settings | R/W | R | R | – | – | – | – |
| Livestock records | R/W | R/W | R | R* | – | R | – |
| Health events | R/W | R/W | – | R/W* | – | – | – |
| Breeding events | R/W | R/W | – | R/W* | – | – | – |
| Production events (milk, eggs) | R/W | R/W | R | – | – | R/W | – |
| Crops + plots | R/W | R/W | R | – | R/W | R | – |
| IoT devices + rules | R/W | R/W | – | – | – | – | – |
| Inventory | R/W | R/W | R | R (medicines) | R | – | – |
| Suppliers | R/W | R/W | R/W | – | R | – | – |
| Tasks | R/W | R/W | – | R/W* | R/W* | R/W (own) | – |
| People roster | R/W | R | R/W | – | – | R (self) | – |
| Payroll | R/W | R | R/W | – | – | R (own) | – |
| Finance txns | R/W | R | R/W | – | – | – | – |
| Subsidy claims | R/W | R/W | R/W | – | – | – | – |
| Orders | R/W | R/W | R | – | – | R/W (assigned) | R (own) |
| Customers | R/W | R/W | R | – | – | – | – |
| Storefront products | R/W | R/W | R | – | – | – | R (public) |
| Welfare / carbon | R/W | R/W | R | R | R | – | – |
| Audit log | R | R | R | – | – | – | – |

*Scoped: vet sees only animals in their `memberships.scoped_animal_ids`. Worker sees only their own tasks/attendance/payslips.

Role-specific restrictions beyond the capability matrix are enforced at application layer (hiding UI) PLUS policy layer (backend deny). Never rely on client-side hiding alone.

---

## Enforcing worker self-scoping

For `attendance`, `piece_work_logs`, `payslips`, a worker should only see their own rows. The base `farm_member_read` policy lets them see all workers' rows. Tighten with a second policy:

```sql
create policy "attendance_worker_self_only" on public.attendance
  for select using (
    worker_id in (select id from public.workers where profile_id = auth.uid())
    or public.is_member(farm_id, array['owner','manager','accountant']::public.user_role[])
  );
```

(Not applied yet — Phase 3 work, along with the worker app. The default `farm_member_read` is fine while only you log in.)

---

## Public storefront access

The storefront is public — anonymous users must be able to read products and place orders.

Three approaches, pick one per endpoint:

1. **Edge Function as proxy** (recommended). Anon calls your Edge Function. Function uses service role to query DB. You audit every request.
2. **Anon RLS policy on `products`**:

   ```sql
   create policy "products_public_read" on public.products
     for select using (is_available = true);
   ```
3. **Turn off RLS for `products`** and rely on `is_available`. Cleanest but loses consistency. Not recommended.

For customer writes (create order, create subscription), always route through an Edge Function. Never let anon clients write to the DB directly — fraud / spam risk.

---

## Testing RLS

```sql
-- Impersonate a user
set role authenticated;
set request.jwt.claims to '{"sub":"<their-auth-uid>","role":"authenticated"}';

-- Try to read something
select count(*) from public.animals;

-- Reset
reset role;
```

Or, more realistically, write unit tests with `pgTAP` (extension is available):

```sql
create extension pgtap;
select plan(3);
select results_eq(
  'select count(*) from public.animals',
  $$values (0::bigint)$$,
  'unauthenticated user sees no animals'
);
select finish();
```

---

## What to do if a policy is blocking a legitimate query

1. `explain (analyze, costs) <query>` — see which policy is blocking.
2. `select * from pg_policies where tablename = '<t>';` — list all policies.
3. Temporarily run as service role to confirm it's the policy (not a data issue).
4. Fix at the policy level, never by disabling RLS.

---

## Advisors — run regularly

Supabase has built-in lints for RLS, policy consistency, and function search paths:

```
mcp__supabase-farmheaven__get_advisors (type='security')
mcp__supabase-farmheaven__get_advisors (type='performance')
```

Run after every migration. Current state: **0 errors, 5 warnings** (3 extension-in-public, 2 partition default policy — all acceptable).
