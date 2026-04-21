# FarmHeaven

End-to-end farm management platform for a 72-acre organic, self-sustaining farm in Hyderabad. Dairy (cow + buffalo), small ruminants (goat/sheep), poultry (layers + broilers), organic crops with rotation + composting, IoT automation (Phase 5+), and a direct-to-consumer storefront.

## Artifacts in this folder

| File | What it is |
|---|---|
| `design-system.md` | The full platform specification — vision, architecture, design tokens, component library, 10 module page designs, data model, automation rules, roles, tech stack, 6-phase roadmap. |
| `gap-analysis.md` | Benchmark vs 20+ competitors (Herdwatch, AgriWebb, Cainthus, CropIn, Stellapps, Barn2Door, etc.) with the top 10 features to add and what to skip. |
| `prototype.html` | Working single-file HTML prototype — 15 clickable screens including vet workspace, welfare dashboard, worker app preview, drone NDVI, supplier scorecard, subsidy auto-claim. Open in any browser. |
| `phased-roadmap.md` | **Start here.** Manual-first → IoT-later rollout plan across 7 phases, each designed to pay for the next. |
| `database-schema.md` | Schema reference — 59 tables, 11 views, 111 RLS policies. Module map + entity details + common query patterns. |
| `migration-guide.md` | How to work with the live Supabase project: CLI setup, seed your farm, first animal, TypeScript types, storage buckets, partitioning. |
| `rls-policies.md` | Role capability matrix + policy patterns + testing. |

## Tech stack

- **Database:** Supabase (PostgreSQL 17) — project `FarmHeaven` · `jfvoskjsimncjexusquz` · ap-southeast-1
- **Extensions enabled:** PostGIS, pgcrypto, citext, pg_trgm, btree_gist, moddatetime, pg_jsonschema
- **Frontend:** Next.js + TypeScript + Tailwind + shadcn/ui (to build)
- **IoT (Phase 5):** Mosquitto MQTT on farm Raspberry Pi; Jetson Nano for edge AI
- **Messaging:** WhatsApp Cloud API + MSG91 (SMS/OTP)
- **Payments:** Razorpay UPI autopay
- **Deployment:** Vercel (console + storefront)
- **Storage:** Supabase Storage buckets

## Start here

1. Read `phased-roadmap.md` — understand the sequence.
2. Skim `database-schema.md` — know what tables exist.
3. Follow `migration-guide.md` — seed your farm row + your first cow.
4. Build Phase 1 (livestock) first — everything else depends on it.

## Current DB state

- ✅ 16 migrations applied
- ✅ 59 FarmHeaven tables
- ✅ 11 views, 111 RLS policies
- ✅ Reference seed: 7 species, 30 breeds (Murrah, Gir, Sahiwal, Osmanabadi, Kadaknath, etc.), 26 crops, 4 cert bodies, 10 subsidy schemes
- ✅ Auto-quarantine trigger tested (withdrawal hides milk from dispatch)
- ✅ Security advisors: 0 errors

Next: build a Phase-1 CRUD UI on top of this (Next.js + Supabase client). Start with animal registry + manual milk logging.
