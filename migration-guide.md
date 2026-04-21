# FarmHeaven — Migration & Dev Setup Guide

Step-by-step guide to getting the schema running locally + remote, connecting a Next.js frontend, and extending it safely.

---

## 1. Project coordinates

- **Supabase project:** `FarmHeaven` · ID `jfvoskjsimncjexusquz`
- **Region:** ap-southeast-1 (Singapore — best latency for Hyderabad; ~40–60 ms)
- **Host:** `db.jfvoskjsimncjexusquz.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/jfvoskjsimncjexusquz

---

## 2. Current state (already applied)

16 migrations are live. Verify:

```sql
select name, executed_at
from supabase_migrations.schema_migrations
order by executed_at;
```

You should see 16 rows ending with `16_security_patches`.

Quick smoke test:

```sql
select
  (select count(*) from pg_tables where schemaname='public') as tables,
  (select count(*) from pg_policies where schemaname='public') as policies,
  (select count(*) from public.species) as species,
  (select count(*) from public.breeds) as breeds,
  (select count(*) from public.crops) as crops,
  (select count(*) from public.subsidy_schemes) as schemes;
```

Expected: ~60 tables, 111 policies, 7 species, 30 breeds, 26 crops, 10 schemes.

---

## 3. Local dev setup

### Install Supabase CLI
```bash
npm i -g supabase
```

### Link to this project
```bash
supabase login
supabase link --project-ref jfvoskjsimncjexusquz
```

### Pull the schema locally
```bash
supabase db pull
```

This writes all 16 migrations to `supabase/migrations/`.

### Run locally with Docker
```bash
supabase start     # boots Postgres + Studio on http://localhost:54323
supabase db reset  # applies all migrations to the local DB
```

---

## 4. Storage buckets to create (via Dashboard → Storage)

| Bucket | Public? | Purpose |
|---|---|---|
| `farm-photos` | no | Animal, barn, plot photos |
| `vet-prescriptions` | no | Signed prescription PDFs |
| `voice-notes` | no | Worker voice notes (before Whisper) |
| `soil-reports` | no | Anand AU / NSTL PDFs |
| `drone-orthos` | no | Redwing NDVI + orthomosaic images |
| `invoices-ocr` | no | Bill photos for OCR |
| `payslips` | no | Generated PDFs |
| `product-images` | **yes** | Storefront product photos |
| `farm-public` | **yes** | Farm tour videos, hero imagery |

For each private bucket, add an RLS policy:

```sql
create policy "farm_members_read_own" on storage.objects for select
  using (bucket_id = 'farm-photos' and (storage.foldername(name))[1] = (
    select id::text from public.current_farm_id() as id
  ));
```

Or simpler: use `{farm_id}/...` folder convention and match in policies.

---

## 5. Auth configuration (Dashboard → Authentication)

1. **Phone auth:** enable. Provider = MSG91 (India) or Twilio. OTP template:
   "Your FarmHeaven code is {{ .Code }}. Expires in 5 min."
2. **Email magic link:** enable as fallback for the owner.
3. **Email templates:** customize in English + add Telugu/Hindi variants.
4. **Redirect URLs:** `http://localhost:3000/*`, `https://farmheaven.in/*`, `https://app.farmheaven.in/*`.

---

## 6. Seed your farm (one-time)

Replace the placeholder polygon with your actual 72-acre boundary.

```sql
-- Your owner user signs up via the app first; grab their user id
-- then run this in SQL editor:

insert into public.orgs (id, name, owner_id)
values (gen_random_uuid(), 'FarmHeaven Pvt Ltd', '<your-auth-user-id>')
returning id;

insert into public.farms (
  org_id, name, slug, location_geom, total_acres, pincode
) values (
  '<org-id-from-above>',
  'FarmHeaven · Hyderabad',
  'farmheaven-hyd',
  st_point(78.328, 17.458)::geography,
  72,
  '500075'
) returning id;

insert into public.memberships (farm_id, user_id, role, is_active, accepted_at)
values ('<farm-id>', '<your-auth-user-id>', 'owner', true, now());
```

Then add a few barns and plots:

```sql
insert into public.structures (farm_id, code, name, kind, capacity) values
  ('<farm-id>','BARN-A','Barn A (Dairy)','dairy_barn',40),
  ('<farm-id>','BARN-B','Barn B (Calves)','calf_barn',20),
  ('<farm-id>','SHED-1','Shed 1 (Layers)','poultry_shed',1200),
  ('<farm-id>','SHED-2','Shed 2 (Broilers)','poultry_shed',800);

insert into public.plots (farm_id, code, name, area_acres) values
  ('<farm-id>','P-01','Plot 1 (Rice)',8),
  ('<farm-id>','P-02','Plot 2 (Millets)',5),
  ('<farm-id>','P-03','Plot 3 (Veg)',2),
  ('<farm-id>','P-04','Plot 4 (Tomato)',4);
```

---

## 7. Your first animal

```sql
insert into public.animals (
  farm_id, tag, name, species_code, breed_id, sex, date_of_birth, current_structure_id
)
select
  '<farm-id>','C-0042','Lakshmi','buffalo',
  b.id,'female','2020-03-14',
  (select id from public.structures where code='BARN-A' and farm_id='<farm-id>')
from public.breeds b where b.species_code='buffalo' and b.code='murrah'
returning id;
```

Log her first milk:

```sql
select public.record_milk(
  '<farm-id>', '<animal-id>', 18.4, 'morning',
  6.8, 9.2, 220000
);
```

---

## 8. Test the withdrawal auto-quarantine

1. Sign a prescription:

```sql
select public.sign_prescription(
  '<farm-id>', '<animal-id>',
  'Oxytetracycline 5%', 48.5, 'mL', 'IM', 'SID', 3,
  96,   -- milk withdrawal hours
  28    -- meat withdrawal days
);
```

2. Try to log milk right after:

```sql
select public.record_milk('<farm-id>', '<animal-id>', 16.2, 'evening');
```

3. Inspect:

```sql
select occurred_at, quantity, is_quarantined, quarantine_reason, quarantined_until
from public.production_events
where animal_id = '<animal-id>'
order by occurred_at desc limit 5;
```

The newest row should show `is_quarantined = true` and `disposition = 'for_compost'`.

---

## 9. Frontend: generating TypeScript types

```bash
supabase gen types typescript --project-id jfvoskjsimncjexusquz --schema public > src/types/database.ts
```

Then in your Next.js app:

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

All queries get end-to-end typed. RLS enforces scoping — you don't need per-query `where farm_id = ...`, the policies handle it.

---

## 10. How to add a new table safely

1. Write a new migration file: `YYYYMMDDHHMMSS_description.sql`.
2. ALWAYS include:
   - `farm_id uuid references public.farms(id) on delete cascade`
   - `created_at timestamptz default now()`, `updated_at timestamptz default now()` (+ trigger)
   - `alter table public.<name> enable row level security;`
   - Two policies — `_member_read` and `_member_write`.
3. Run `supabase db push` to apply remote.
4. Re-generate types.
5. Run security advisors: `mcp__supabase-farmheaven__get_advisors`.

---

## 11. Partitioned tables — when to care

`sensor_readings` and `audit_log` are partitioned by range on `occurred_at` with a default partition. No action needed until data volumes justify it.

When IoT goes live (Phase 5), enable pg_partman to auto-create monthly partitions:

```sql
create extension if not exists pg_partman;

select partman.create_parent(
  p_parent_table := 'public.sensor_readings',
  p_control := 'occurred_at',
  p_type := 'native',
  p_interval := 'monthly',
  p_premake := 3
);

-- retention: drop partitions older than 24 months
update partman.part_config
set retention = '24 months', retention_keep_table = false
where parent_table = 'public.sensor_readings';
```

Add a cron to run `partman.run_maintenance()` weekly:

```sql
select cron.schedule('partman_maintenance', '0 3 * * 0',
  $$select partman.run_maintenance()$$);
```

---

## 12. Backups

Supabase auto-backs up daily (Pro+ plan has 7-day PITR). For disaster recovery:

```bash
supabase db dump --project-ref jfvoskjsimncjexusquz -f backup.sql
# or a schema-only snapshot:
supabase db dump --project-ref jfvoskjsimncjexusquz --schema-only -f schema.sql
```

---

## 13. Security checklist before going live

- [ ] Run security advisors — 0 errors, only documented warnings.
- [ ] Run performance advisors and add indexes for top queries.
- [ ] Confirm every table either has RLS enabled OR is explicitly excluded (only `spatial_ref_sys` and partition defaults).
- [ ] Storage bucket policies match table policies.
- [ ] Anon key never calls privileged RPC — use service role from the server only.
- [ ] Rate-limit public endpoints (OTP, order placement) at the API gateway.
- [ ] GDPR-ish: delete endpoint for customers + data export JSON.
- [ ] Aadhaar: only store last 4 digits (already enforced in `workers` schema).

---

## 14. Troubleshooting

**"permission denied for table X"** → RLS policy missing or `is_member(farm_id)` returning false. Check your `memberships` row.

**"new row violates row-level security policy"** → Inserting with a `farm_id` you're not a member of, or `auth.uid()` is null (unauthenticated).

**Trigger didn't fire** → Check `pg_trigger`:
```sql
select tgname, tgrelid::regclass from pg_trigger where tgname like 'trg_%';
```

**Slow query** → `explain analyze` the query, then call `mcp__supabase-farmheaven__get_advisors(type='performance')`.

---

## 15. Cost estimate

| Item | Monthly |
|---|---|
| Supabase Free (Phase 0–1) | ₹0 |
| Supabase Pro (Phase 2+, includes 8GB DB, 100GB bandwidth) | $25 ≈ ₹2,100 |
| Supabase Pro + 1 bolt-on storage (Phase 5+) | ~₹3,500 |
| Vercel hosting (console + storefront) | ₹0 (hobby) to $20 |
| Razorpay fees | 2% per transaction |
| WhatsApp Cloud API | ₹0.35–0.75 per message |

Total burn Phase 0–3: **₹2,100/mo**. Total Phase 4+: **₹5,000–8,000/mo** before Razorpay. Manageable.
