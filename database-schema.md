# FarmHeaven — Database Schema Reference

**Project:** `supabase-farmheaven` · **Project ID:** `jfvoskjsimncjexusquz` · **Region:** ap-southeast-1 (Singapore)
**PostgreSQL:** 17.6 · **Extensions:** PostGIS, pgcrypto, citext, pg_trgm, btree_gist, moddatetime, pg_jsonschema
**Current state:** 59 FarmHeaven tables · 11 views · 111 RLS policies · seeded reference data

---

## Design principles

1. **Multi-tenant by `farm_id`.** Every row that can belong to a farm has `farm_id uuid references farms(id)` and an RLS policy scoping it to members. A user can belong to many farms (later franchise expansion is free).
2. **Event-sourced livestock.** `animals` has a denormalized "current state" (health, DIM, last calving), but the truth lives in `health_events`, `breeding_events`, `production_events`. Triggers keep the denorm fresh.
3. **Append-only events.** Nothing mutates. Corrections are new events with a reference to what they correct.
4. **UUIDs everywhere.** `gen_random_uuid()` is the default. No sequential IDs leak business volume.
5. **Soft deletes where user-visible.** `deleted_at timestamptz` on `farms`, `plots`, `structures`, `animals` via `retired_at`.
6. **Idempotency keys** on event tables so webhook retries from WhatsApp / Razorpay / MQTT don't double-record.
7. **JSONB for extensibility.** Every entity has a `metadata jsonb` for rare per-farm customizations without migrations.
8. **Geo-native.** PostGIS types (`geography(point|polygon,4326)`) used on `farms`, `plots`, `structures`, `zones`, `devices`, `customer_addresses`, `attendance`.
9. **Reference tables are global.** `species`, `breeds`, `crops`, `certification_bodies`, `subsidy_schemes` are public-read and shared across all farms so you don't re-seed per tenant.
10. **Auto-quarantine for organic compliance.** The moment a vet signs a treatment, the `auto_quarantine_production` trigger stops that animal's milk from appearing on dispatch until the withdrawal expires. Not a feature flag — a data invariant.

---

## Module map

```
IDENTITY            profiles, orgs, farms, memberships
GEOGRAPHY           structures, plots, zones
LIVESTOCK REGISTRY  species, breeds, animals, flocks, animal_movements
LIVESTOCK EVENTS    health_events, breeding_events, production_events, welfare_events
CROPS               crops, crop_cycles, soil_samples, remote_sensing_runs, ipm_logs, compost_windrows
INVENTORY           suppliers, skus, inventory_lots, inventory_movements, + lineage view
PEOPLE              workers, attendance, piece_work_logs, tasks, payroll_runs, payslips
FINANCE             cost_centers, txn_categories, transactions, subsidy_schemes, subsidy_claims
COMMERCE            customers, customer_addresses, products, subscriptions, orders, order_items,
                    delivery_routes, customer_events
IOT (ready, dormant) devices, sensor_readings (partitioned), automation_rules, rule_firings,
                     device_commands
COMPLIANCE          certification_bodies, farm_certifications, audit_log (partitioned)
ANALYTICS ROLLUPS   welfare_rollups, carbon_entries, lactation_rollups, flock_fcr_rollups
```

Total: **59 tables**.

---

## Key entities — quick tour

### `animals` (the backbone)
```
id, farm_id, tag ('C-0042'), name, species_code, breed_id, sex, date_of_birth,
dam_id, sire_id, rfid_tag, external_ids (jsonb: inaph, pashuadhaar),
-- denormalized current state (maintained by triggers)
lifecycle (calf|heifer|lactating|dry|pregnant|...),
health_state (healthy|in_heat|sick|quarantined|recovering|weaning),
lactation_number, days_in_milk, last_calving_date, predicted_next_estrus_at,
last_production_at,
retired_at, retirement_reason
```

`UNIQUE (farm_id, tag)` — tag IDs are scoped per farm.

### `health_events` — the withdrawal engine
Stores observations, symptoms, diagnoses, treatments, vaccinations. For treatments it includes drug, dose, withdrawal hours, and computed `withdrawal_until_milk` / `withdrawal_until_meat`. The `auto_quarantine_production` trigger consults this on every milk insert.

### `production_events` — unified production stream
Works for milk, eggs, weight, meat, honey, manure, vegetables, grain, fruit. Dimensioned by `animal_id` or `flock_id` or `plot_id` (exactly one). Quality is JSONB (`{fat_pct, snf_pct, scc, egg_grade}`) so the schema never changes when quality metrics evolve.

### `inventory_lots` — batch-level traceability
Every lot has `parent_lot_ids uuid[]`. Ghee batch #GHI-0412 has a parent set pointing at milk lots, which point at feed lots (via movements), forming a DAG. The `inventory_lot_lineage` recursive view walks it.

### `automation_rules` — visual IFTTT for the farm
Trigger + AND-conditions + actions are all JSONB. Engine lives in Edge Functions (Phase 5). Example:
```json
{
  "trigger": {"kind":"sensor_threshold","device_id":"...","metric":"soil_vwc","op":"lt","value":18},
  "conditions": [{"kind":"no_rain_24h"}, {"kind":"et_above","value":3}],
  "actions": [
    {"kind":"open_valve","zone_id":"...","minutes":30},
    {"kind":"notify_whatsapp","to":"worker_lead"}
  ]
}
```

### `sensor_readings` — partitioned, dormant until Phase 5
```
partition by range (occurred_at);
-- default partition exists; pg_partman can take over later
```
When IoT volume grows, `pg_partman` auto-creates monthly partitions and drops old ones per retention policy.

---

## Role matrix (RLS)

| Role | Reads | Writes | Notes |
|---|---|---|---|
| **owner** | Everything in their farm | Everything | Full god mode |
| **manager** | Everything | Everything except user admin | Day-to-day ops |
| **accountant** | Full read (finance-focused) | Finance only | Read-only on ops |
| **vet** (external) | Animals in `memberships.scoped_animal_ids` | Health events, prescriptions only | Scoped login |
| **agronomist** | Plots, crops, inputs | Crop events, IPM logs | Scoped module |
| **worker** | Assigned tasks, own attendance, own payslips | Task status, piece-rate, voice notes | Mobile app only |
| **customer** | Own orders, addresses, subscriptions | Own profile, own address | Storefront only |

Scoping is enforced via `public.is_member(farm_id, roles[])` SECURITY DEFINER function on every policy. Bulk policy generator in migration `14_rls_policies` added `_member_read` + `_member_write` pairs to every `farm_id`-scoped table. Special tables (`order_items`, `customer_addresses`, `flock_fcr_rollups`) scope via FK joins.

---

## Helper functions callable from the app

| Function | Purpose |
|---|---|
| `is_member(farm_id, roles)` | Membership check for RLS |
| `current_farm_id()` | User's default farm |
| `sign_prescription(...)` | Creates a treatment + auto-computes withdrawal windows |
| `record_milk(...)` | Inserts a milk event; auto-quarantine trigger runs |
| `handle_new_user()` | Auto-provisions a `profiles` row on signup |

All are `set search_path = public` for security.

---

## Useful views

| View | What it gives you |
|---|---|
| `v_animals_active` | Every non-retired animal, joined to breed + species + current structure |
| `v_daily_milk` | Per-day herd yield: saleable, quarantined, total |
| `v_upcoming_estrus` | Predicted heat windows for the next few days |
| `v_animals_quarantined` | Who's under antibiotic withdrawal right now |
| `v_inventory_onhand` | Current stock per SKU with reorder flag |
| `v_pnl_mtd` | P&L by cost center month-to-date |
| `v_welfare_latest` | Latest welfare rollup per species |
| `v_carbon_net` | Net tCO₂e YTD |
| `inventory_lot_lineage` | Recursive DAG walk of a lot's ancestors |

All views use `security_invoker = on` so they respect the caller's RLS.

---

## Enums at a glance

- `user_role`: owner, manager, worker, vet, agronomist, accountant, customer
- `sex`: male, female, unknown
- `animal_lifecycle`: calf, heifer, lactating, dry, pregnant, breeding_bull, retired, sold, deceased
- `animal_health_state`: healthy, in_heat, sick, quarantined, recovering, weaning
- `flock_purpose`: layer, broiler, breeding, meat_goat, dairy_goat, meat_sheep, wool_sheep, dual_purpose
- `health_event_type`: observation, symptom, diagnosis, treatment, vaccination, deworming, surgery, recovery, quarantine, death
- `breeding_event_type`: heat_observed, heat_predicted, service, natural_mating, pregnancy_check, abortion, parturition, weaning
- `production_type`: milk, egg, weight, meat, honey, manure, fleece, vegetable, grain, fruit
- `welfare_signal`: panting, crowding, vocalization, lameness, body_condition, huddling, pecking, mounting, predator, normal
- `plot_stage`: fallow, prep, sown, germination, vegetative, tillering, flowering, fruiting, ripening, harvest, post_harvest
- `device_status`: online, offline, warn, maintenance, retired
- `task_status`: backlog, today, in_progress, done, cancelled
- `task_priority`: low, medium, high, urgent
- `subsidy_status`: eligible, draft, ready, submitted, approved, rejected, disbursed, expired
- `order_status`: new, confirmed, packing, routed, out_for_delivery, delivered, cancelled, refunded
- `subscription_status`: active, paused, cancelled, ended
- `cert_status`: valid, expiring_soon, expired, pending, revoked
- `event_source`: manual, sensor, rule, ml, external, vet, api, import
- `transaction_type`: income, expense, transfer, adjustment
- `payment_status`: pending, processing, paid, failed, refunded
- `quarantine_reason`: antibiotic_withdrawal, disease, suspected, voluntary
- `inventory_category`: feed, seed, medicine, vaccine, fertilizer, bio_input, packaging, equipment, harvested_produce, processed_goods, other
- `cost_center_type`: dairy, small_ruminants, poultry, crops, storefront, infra, admin, compost, other

Enums are stable — adding values is an ALTER TYPE; removing is a migration-level change.

---

## Reference data already seeded

- **7 species:** cattle, buffalo, goat, sheep, poultry, bee, fish (with Telugu + Hindi labels)
- **30 breeds:** Gir, Sahiwal, Red Sindhi, Ongole, Deoni, Tharparkar, HF Cross, Jersey Cross; Murrah, Jaffarabadi, Mehsana, Surti; Osmanabadi, Deccani, Sirohi, Jamunapari, Beetal, Black Bengal; Deccani/Nellore/Madras Red sheep; Kadaknath, Giriraja, Aseel, Vanaraja, Rhode Island Red, BV-380, Cobb 500, Ross 308, Country
- **26 crops:** Basmati + paddy rice, little/finger/pearl millet, sorghum, tur, chickpea, green/black gram, cotton, tomato, brinjal, okra, chilli, spinach, coriander, moringa, curry leaf, banana, papaya, turmeric, ginger, sunn hemp, cowpea, mango
- **4 cert bodies:** PGS-India, NPOP, FSSAI, APEDA Organic
- **10 subsidy schemes:** Rythu Bandhu, PM-KISAN, PMKSY drip, NABARD DEHM, NABARD interest subvention, TS Organic Mission, TS goat scheme, Kadaknath promotion, RKVY organic, FPO support

Read-only via RLS (`select` true for all).

---

## Partitioning strategy

Two tables are partitioned by month via `pg_partman` (to be configured in Phase 5 when volume warrants):

- `sensor_readings` — expected millions of rows/month once IoT is online
- `audit_log` — compliance-grade immutable trail

Default partitions exist today so inserts work without configuration.

---

## What's NOT in the schema (and why)

| Not included | Why |
|---|---|
| Password / magic-link tokens | Supabase Auth handles this in `auth` schema |
| Session storage | Supabase Auth |
| File blobs | Supabase Storage (buckets listed in `migration-guide.md`) |
| Job queue | `pgmq` extension available; use when IoT rule engine needs it |
| Vector embeddings | `pgvector` available for future animal-ID / image-similarity |
| Analytics events (product usage) | Use PostHog, not our DB |

---

## Common query patterns

### Today's milk yield
```sql
select sum(quantity) filter (where not is_quarantined) as saleable_l
from production_events
where farm_id = $1 and kind = 'milk' and occurred_at::date = current_date;
```

### Animals with upcoming estrus
```sql
select * from v_upcoming_estrus where farm_id = $1
order by predicted_window_start asc;
```

### Inventory lots expiring in 7 days
```sql
select s.name, l.internal_batch, l.quantity_remaining, l.expires_at
from inventory_lots l
join skus s on s.id = l.sku_id
where l.farm_id = $1
  and l.expires_at between now() and now() + interval '7 days'
  and l.quantity_remaining > 0;
```

### P&L this month
```sql
select * from v_pnl_mtd where farm_id = $1;
```

### Trace a pack back to its inputs
```sql
with recursive trace as (
  select id, name, 0 as depth from skus where id = $1 -- the pack's SKU
  union all
  select l.id, s.name, t.depth + 1
  from inventory_lots l
  join skus s on s.id = l.sku_id
  join trace t on true
  -- recurse through parent_lot_ids
  where l.id = any(...)
)
select * from trace;
```

---

## Migration history (in order)

1. `01_extensions_and_types` — PostGIS, citext, pgcrypto, enums
2. `02_identity_and_farms` — profiles, orgs, farms, memberships, `is_member()`
3. `03_geography_and_zones` — structures, plots, zones
4. `04_livestock_registry` — species, breeds, animals, flocks, movements
5. `05_livestock_events` — health, breeding, production, welfare + auto-quarantine trigger
6. `06_crops_soil_compost` — crop cycles, soil samples, NDVI runs, IPM, compost
7. `07_inventory_and_suppliers` — suppliers, SKUs, lots, movements, lineage view
8. `08_tasks_people_payroll` — workers, attendance, piece-rate, tasks, payslips
9. `09_finance_and_subsidies` — cost centers, txn categories, transactions, schemes, claims
10. `10_commerce_storefront` — customers, products, subscriptions, orders, routes
11. `11_iot_and_rules` — devices, partitioned sensor_readings, rules, commands
12. `12_compliance_welfare_carbon` — certifications, audit log (partitioned), welfare + carbon rollups
13. `13_seed_reference_data` — species, breeds, crops, cert bodies, subsidy schemes
14. `14_rls_policies` — RLS on every table, bulk policy generator
15. `15_views_and_helpers` — reporting views + `sign_prescription()`, `record_milk()`
16. `16_security_patches` — security_invoker on views, search_path on functions, missing policies

Every migration is replayable and stored in Supabase's `supabase_migrations.schema_migrations` table.
