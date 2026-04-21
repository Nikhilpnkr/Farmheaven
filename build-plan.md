# FarmHeaven — Build Plan

> How we turn the Supabase schema + HTML prototype into a production app. Framework choices, repo layout, setup order, and a phase-by-phase implementation plan you (or Claude on your behalf) can start executing tomorrow morning.

**Stance:** Boring, battle-tested stack. Zero exotic dependencies. Everything scales from day 1 to 1,000 customers on the storefront without a rewrite.

---

## 1. TL;DR — the stack

| Layer | Choice | Why |
|---|---|---|
| **Monorepo** | Turborepo + pnpm workspaces | Share code between console, storefront, worker app. Industry standard. Vercel-native. |
| **Language** | TypeScript (strict) | Supabase auto-generates types; end-to-end safety from DB to browser. |
| **Framework** | Next.js 15 (App Router) | Same tool for both apps; server components = less JS shipped; huge ecosystem. |
| **UI library** | shadcn/ui on Tailwind CSS | Copy-into-repo components you fully own; matches our design tokens 1:1. |
| **Data / auth** | Supabase JS SDK (`@supabase/ssr`) | Already wired; RLS enforces scoping server-side. |
| **Data fetching** | Server Components + TanStack Query (client islands) | SSR for first paint, React Query for live mutations. |
| **Forms** | React Hook Form + Zod | RHF for UX, Zod for types + validation shared with backend. |
| **Tables** | TanStack Table v8 | Headless; drives all data grids in the console. |
| **Charts** | Recharts | Already in prototype. |
| **Maps** | Leaflet + React-Leaflet + MapTiler tiles | Free, great India coverage, PostGIS-friendly. |
| **Date / time** | date-fns (tree-shakable) | Lighter than moment; Zulu-safe. |
| **i18n** | next-intl | EN / TE / HI, ICU messages. |
| **Client state** | Zustand (minimal) + nuqs (URL state) | No Redux. |
| **Validation** | Zod | One schema, validates DB writes + forms + API. |
| **Background jobs** | Supabase Edge Functions + pg_cron | Runs without extra infra. |
| **Payments** | Razorpay (UPI autopay, e-mandate) | Best-in-class India. |
| **WhatsApp** | Meta Cloud API via Edge Function webhooks | First-class notification channel. |
| **SMS / OTP** | MSG91 (India) | Cheap, reliable, short codes. |
| **OCR** | Google Cloud Vision (Phase 2+) | ₹-per-page pricing; Telugu-capable. |
| **Voice STT** | OpenAI Whisper API (Phase 7) | Telugu + Hindi out-of-the-box. |
| **Maps / routing** | OSRM public endpoint → self-host when delivery volume grows | Free at low volume. |
| **Email** | Resend | Best DX, 3000 emails/mo free. |
| **Analytics** | PostHog (cloud EU) | Product analytics + funnels + session replay. |
| **Error tracking** | Sentry | Standard. |
| **Hosting — apps** | Vercel (console + storefront) | Free for single user, edge by default. |
| **Hosting — DB + Auth + Storage + Edge Functions** | Supabase (`ap-southeast-1`) | Already live. |
| **Hosting — IoT broker** (Phase 5) | Mosquitto on a farm Raspberry Pi 5 | Works offline when uplink drops. |
| **Edge AI** (Phase 5) | NVIDIA Jetson Orin Nano + Ultralytics YOLO | Cheap, fast, no cloud per-inference cost. |
| **Mobile worker app** | PWA first (Phase 3), Capacitor wrap when needed | Install-to-home-screen, camera + mic + GPS, offline-capable. |
| **CI/CD** | GitHub Actions | Lint, typecheck, migrations check, Vercel preview deploys. |

---

## 2. Monorepo layout

```
FarmHeaven/
├── apps/
│   ├── console/                  # Operator dashboard (next.js)
│   ├── storefront/               # Public farmheaven.in (next.js)
│   └── worker/                   # PWA for field workers (next.js, mobile-first)
├── packages/
│   ├── ui/                       # shadcn/ui components + design tokens
│   ├── db/                       # Supabase client + generated types + Zod schemas
│   ├── config/                   # Shared tsconfig, eslint, tailwind preset
│   └── i18n/                     # Locale JSON (en, te, hi) + helpers
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/               # Already populated (16 files)
├── .github/
│   └── workflows/                # CI checks
├── turbo.json                    # Turborepo pipeline
├── package.json                  # pnpm workspace root
├── pnpm-workspace.yaml
├── .gitignore
└── (the markdown docs you already have)
```

**Why this shape:**

- Three apps, not one with route groups. The storefront is public/SEO-critical; the console is auth-walled and ops-heavy; the worker app is mobile-first with totally different UX. Route-groups-in-one-app works until it doesn't — separate apps keep bundle sizes honest.
- `packages/db` is where generated types + Zod schemas live. Every app imports from `@farmheaven/db` for queries.
- `packages/ui` holds the shadcn components we've customized to match our tokens. No component lives in more than one place.
- Turborepo caches build output per-package; CI completes in under 2 minutes once warm.

---

## 3. Alternatives considered (and why we passed)

| Option | Why not |
|---|---|
| SvelteKit | Faster dev, smaller bundles, but smaller talent pool + fewer Indian devs fluent in it. Hiring matters. |
| Remix | Great DX, but Next.js's Vercel integration + edge runtime > Remix at our scale. |
| Nuxt / Vue | Same hiring argument; also shadcn-vue is less mature than shadcn-react. |
| Expo / React Native (for worker app) | Adds an App Store / Play Store gate for every release. PWA ships instantly. Revisit if native features (background sync, notification taps) block us. |
| Drizzle ORM / Prisma | Supabase JS SDK is enough and respects RLS natively. An ORM duplicates schema and risks bypassing RLS. |
| tRPC | Overkill. Server Actions + Supabase SDK gives type-safety without the abstraction layer. |
| Firebase / Appwrite | Already on Supabase; the schema + RLS is the moat — not switching. |
| Shopify / Magento for storefront | Locked out of the integrated view (farm data ↔ storefront). Also never handles UPI autopay subscriptions natively. |
| Redux / MobX | Zustand covers 99% of state needs in 3% of the boilerplate. |
| Contentful / Sanity | Our content (product descriptions, blog posts) lives in the same DB with the rest of the farm data. One source of truth. |

---

## 4. Exact package list per app

### `apps/console` (the operator dashboard)

```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "@farmheaven/db": "workspace:*",
    "@farmheaven/ui": "workspace:*",
    "@farmheaven/i18n": "workspace:*",
    "@tanstack/react-query": "latest",
    "@tanstack/react-table": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "zod": "latest",
    "zustand": "latest",
    "nuqs": "latest",
    "recharts": "latest",
    "react-leaflet": "latest",
    "leaflet": "latest",
    "date-fns": "latest",
    "next-intl": "latest",
    "lucide-react": "latest",
    "sonner": "latest",
    "cmdk": "latest"
  }
}
```

### `apps/storefront`

Subset of the above, minus TanStack Table and Leaflet (storefront has no complex tables or live maps). Add:

```json
{
  "razorpay": "latest",
  "next-sitemap": "latest",
  "next-seo": "latest",
  "@vercel/og": "latest"
}
```

### `apps/worker` (PWA)

```json
{
  "next": "15.x",
  "next-pwa": "latest",
  "@supabase/ssr": "latest",
  "@farmheaven/db": "workspace:*",
  "@farmheaven/ui": "workspace:*",
  "react-hook-form": "latest",
  "zod": "latest",
  "workbox-webpack-plugin": "latest",
  "dexie": "latest"  // IndexedDB for offline queue
}
```

### `packages/db`

```json
{
  "@supabase/supabase-js": "latest",
  "zod": "latest"
}
```

Plus a script `supabase gen types typescript --project-id jfvoskjsimncjexusquz --schema public > src/types.ts` that regenerates on every migration change.

### Dev dependencies (root)

```json
{
  "turbo": "latest",
  "typescript": "latest",
  "@types/node": "latest",
  "@types/react": "latest",
  "eslint": "latest",
  "eslint-config-next": "latest",
  "prettier": "latest",
  "tailwindcss": "latest",
  "autoprefixer": "latest",
  "postcss": "latest",
  "@biomejs/biome": "latest",
  "supabase": "latest",
  "husky": "latest",
  "lint-staged": "latest"
}
```

---

## 5. Setup sequence (Day 1)

Literal terminal commands, in order. Run from `C:\Users\pc\Documents\Claude\Projects\FarmHeaven\` after the GitHub push is done.

```bash
# 1. Install pnpm (if you don't have it)
npm i -g pnpm@latest

# 2. Turn the folder into a pnpm workspace
pnpm init
# edit package.json: add "workspaces": ["apps/*","packages/*"]

# 3. Add Turborepo
pnpm add -Dw turbo typescript prettier @biomejs/biome husky lint-staged

# 4. Scaffold apps
pnpm create next-app@latest apps/console --typescript --tailwind --app --src-dir --no-eslint
pnpm create next-app@latest apps/storefront --typescript --tailwind --app --src-dir --no-eslint
pnpm create next-app@latest apps/worker --typescript --tailwind --app --src-dir --no-eslint

# 5. Create shared packages
mkdir -p packages/db packages/ui packages/config packages/i18n
# Write package.json for each with "name":"@farmheaven/db", etc.

# 6. Install Supabase CLI
npm i -g supabase
supabase link --project-ref jfvoskjsimncjexusquz
supabase gen types typescript --linked > packages/db/src/types.ts

# 7. Add Supabase clients to packages/db
pnpm -F @farmheaven/db add @supabase/ssr @supabase/supabase-js zod

# 8. Add shadcn/ui to the UI package
cd packages/ui
pnpm dlx shadcn@latest init
# Pick Tailwind defaults. Then:
pnpm dlx shadcn@latest add button input select dialog dropdown-menu \
  table form card toast badge tabs avatar skeleton

# 9. Bootstrap environment variables
cp apps/console/.env.example apps/console/.env.local
# Fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY from dashboard

# 10. First run
pnpm dev
```

Full setup should take ~30 minutes end-to-end.

---

## 6. The `packages/db` architecture

This is the most important package. Everything else imports from here.

```typescript
// packages/db/src/server.ts — Server Components / Route Handlers
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// packages/db/src/client.ts — Client Components
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// packages/db/src/admin.ts — NEVER import from client code
import { createClient as createPlain } from '@supabase/supabase-js';
export const admin = () =>
  createPlain<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 🚨 server only
  );

// packages/db/src/schemas.ts — Zod mirrors of DB tables
import { z } from 'zod';
export const animalInsertSchema = z.object({
  tag: z.string().min(1).max(32),
  name: z.string().optional(),
  species_code: z.enum(['cattle','buffalo','goat','sheep','poultry','bee','fish']),
  breed_id: z.string().uuid().optional(),
  sex: z.enum(['male','female','unknown']).default('unknown'),
  date_of_birth: z.string().date().optional(),
  // ...
});
export type AnimalInsert = z.infer<typeof animalInsertSchema>;
```

Rule: every form in any app imports its schema from `packages/db/src/schemas`. No duplicate type definitions.

---

## 7. Build order — mapped to phased-roadmap.md

### Phase 0 · Week 0–1: Scaffolding

- Monorepo setup as above.
- `apps/console` — auth flow (phone OTP), empty dashboard shell, sidebar + topbar (copy the CSS from `prototype.html`).
- Farm selector in topbar that calls `current_farm_id()`.
- Deploy console to Vercel as `https://app.farmheaven.in` (even if empty).

**Done when:** you can sign in with your phone, land on an empty dashboard, see your name in the topbar.

### Phase 1 · Week 2–5: Livestock CRUD

- Animals list page (uses the table component from `packages/ui`).
- "Register animal" drawer with React Hook Form + Zod.
- Animal detail page with Overview / Health / Breeding / Production tabs.
- "Log event" drawers for health / breeding / production.
- Dashboard KPI strip now reads real data.
- Vaccination schedule generator (pg_cron + Supabase Edge Function that inserts into `tasks`).

**Done when:** you've moved your notebook data into the app and haven't touched the notebook in a week.

### Phase 2 · Week 6–9: Crops + Inventory + Finance basics

- Plots list + map view (Leaflet, draws from `plots.boundary_geom`).
- Crop cycle sow/harvest lifecycle.
- Input log per plot (blocks non-PGS inputs at form level using `skus.is_organic_compliant`).
- Inventory: SKUs, lots, movements. FEFO pick logic as a view.
- OCR expense capture: React Hook Form with file upload → Supabase Storage → Edge Function calls Google Vision → parses fields → pre-fills the txn form.
- P&L view joining `v_pnl_mtd`.

**Done when:** you can tell at a glance which SKU makes money.

### Phase 3 · Week 10–12: Tasks + People + Vet

- Tasks Kanban (dnd-kit for drag/drop).
- Workers roster + attendance logs.
- Monthly payroll run with PF + ESIC computation in a SQL function.
- Telugu payslip PDF (react-pdf or pdfkit in an Edge Function).
- WhatsApp send via Meta Cloud API.
- Vet Workspace — a separate layout in the console app shown only when `membership.role = 'vet'`. Uses the `sign_prescription()` function. Shows only animals in `scoped_animal_ids`.

**Done when:** Dr. Reddy logs into his own account and prescribes directly into your system.

### Phase 4 · Week 13–18: Storefront + Orders → REVENUE

- `apps/storefront`:
  - Public product grid from `products` (RLS policy `products_public_read`).
  - Cart (Zustand, persisted).
  - Razorpay checkout (one-time + e-mandate for subscriptions).
  - Subscription management page (pause, skip, cancel).
  - Traceability QR landing page — scan → shows animal profile via `order_items.picked_lot_ids`.
  - SEO (next-seo, sitemap, structured data).
- `apps/console` — Orders queue, route plan, pack-list print.
- Delivery routing (cluster orders by pincode first; OSRM route optimization later).

**Done when:** first customer orders + pays via UPI autopay. Money hits your Razorpay dashboard.

### Phase 5 · Month 6–9: IoT layer

Covered in detail in `phased-roadmap.md` §5. The DB schema (`devices`, `sensor_readings`, `automation_rules`) is already ready.

- Edge Function `ingest-sensor-reading` accepts MQTT bridge POSTs and inserts into `sensor_readings`.
- Edge Function `evaluate-rules` runs every 60 sec (pg_cron), finds matching rules, inserts into `rule_firings` + `device_commands`.
- Console: live sensor cards, rules builder UI (json-editor for now, visual later).

### Phase 6 · Month 9–12: Welfare, Compliance, ML

- Quarterly welfare rollup job (pg_cron) — writes to `welfare_rollups`.
- Compliance PDF generator (react-pdf) that renders the PGS audit packet from data.
- Subsidy form auto-fill: pre-computes eligibility, pre-fills PDFs, owner e-signs, submits.

### Phase 7 · Parallel with Phase 6: Worker PWA

- `apps/worker` — mobile-first layout, Telugu default.
- Voice note capture (MediaRecorder API) → Supabase Storage → Edge Function transcribes via Whisper → writes to `health_events.voice_transcript`.
- Geofenced check-in (browser Geolocation API, compare to farm boundary).
- Offline queue via Dexie — writes go to IndexedDB first, sync when online.
- Install-to-home-screen PWA manifest.

---

## 8. Week 1 concrete checklist

Day-by-day for anyone (you or Claude) starting on this.

**Day 1 — Scaffold**
- [ ] Push current repo to GitHub (per `PUSH_TO_GITHUB.md`).
- [ ] Install pnpm + Turborepo.
- [ ] `pnpm create next-app` for all three apps.
- [ ] Write root `turbo.json`, `pnpm-workspace.yaml`, shared `tsconfig.base.json`.
- [ ] Commit: "Scaffold monorepo with 3 Next.js apps".

**Day 2 — Shared packages**
- [ ] Scaffold `packages/db`, `packages/ui`, `packages/config`, `packages/i18n`.
- [ ] Add Supabase clients to `packages/db`.
- [ ] Run `supabase gen types typescript --linked` → commit the generated types.
- [ ] Add shadcn to `packages/ui`, install baseline components.
- [ ] Copy design tokens (CSS custom properties) from `prototype.html` into `packages/ui/src/styles/tokens.css`.

**Day 3 — Auth**
- [ ] Build login page in `apps/console` with phone + OTP.
- [ ] Enable MSG91 in Supabase Dashboard → Authentication → Phone.
- [ ] Middleware that redirects unauthenticated users to `/login`.
- [ ] On first sign-in, redirect to `/onboarding/create-farm` if the user has no memberships.

**Day 4 — Farm shell**
- [ ] Onboarding: capture farm name + address + acres → inserts `orgs` + `farms` + `memberships`.
- [ ] Sidebar + topbar from the prototype — extract into `packages/ui`.
- [ ] Farm selector in topbar (reads from `memberships`).
- [ ] Dashboard page with placeholder KPIs bound to `current_farm_id()`.

**Day 5 — Deploy**
- [ ] Vercel project for `apps/console` (configure monorepo root + app dir).
- [ ] Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
- [ ] Set up preview deploys from feature branches.
- [ ] Add domain: `app.farmheaven.in`.
- [ ] Setup Sentry (1 DSN per app).

**End of Week 1:** you can sign in at `app.farmheaven.in` and see your farm's empty dashboard. Ready for Phase 1 feature work.

---

## 9. CI/CD (GitHub Actions)

`.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck build
      - run: pnpm -F @farmheaven/db test

  migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db lint --db-url "${{ secrets.SUPABASE_DB_URL }}"
      - run: supabase db diff --linked  # fails if migrations don't match DB
```

Vercel auto-deploys every branch as a preview. Production deploys only from `main`.

---

## 10. Security / guardrails

- **Never** use `SUPABASE_SERVICE_ROLE_KEY` in client code. Put it in Edge Functions only.
- **Always** re-run Supabase security advisors after a migration (`mcp get_advisors`).
- **Never** disable RLS to "get past" an error. Fix the policy.
- **Storage buckets** need their own policies (see `migration-guide.md`).
- **Rate-limit** public endpoints (OTP, order-placement, voice upload) in an Edge Function.
- **Aadhaar** — only `last4` stored, never the full number.
- **PII export** endpoint for GDPR-ish right-to-access.

---

## 11. Cost estimate (monthly)

| Item | Phase 0–3 | Phase 4+ |
|---|---|---|
| Supabase Free → Pro | ₹0 → ₹2,100 | ₹2,100 |
| Vercel Hobby → Pro (if traffic warrants) | ₹0 | ₹1,700 |
| Razorpay fees | ₹0 | 2% per txn |
| WhatsApp Cloud API | ₹0 | ₹0.35–0.75 / message |
| MSG91 OTP | ₹0 | ₹0.18 / SMS |
| Google Cloud Vision OCR | — | ₹0.12 / image |
| OpenAI Whisper | — | $0.006 / min audio |
| Sentry Developer | ₹0 | ₹0 |
| PostHog Cloud | ₹0 (1M events/mo free) | ₹0 |
| Resend | ₹0 (3k emails/mo) | ₹0 |
| Domain (farmheaven.in) | ₹800 / year | ₹800 / year |
| **Total** | **₹2,100/mo** | **~₹5,000–8,000/mo pre-Razorpay** |

Razorpay fees scale with revenue, not a fixed cost.

---

## 12. Hardware (Phase 5 IoT, budget reference)

| Item | Qty | ₹ each | Total |
|---|---|---|---|
| Raspberry Pi 5 (farm gateway) | 1 | 7,000 | 7,000 |
| NVIDIA Jetson Orin Nano (edge AI) | 1 | 25,000 | 25,000 |
| RTSP IP cameras (dome, PoE) | 4 | 4,500 | 18,000 |
| Soil moisture + temp sensors (LoRa) | 6 | 1,800 | 10,800 |
| Water tank level sensor | 2 | 1,200 | 2,400 |
| Weather station | 1 | 18,000 | 18,000 |
| Solenoid irrigation valves + controllers | 8 | 1,600 | 12,800 |
| RFID reader + tags (kit of 50) | 1 | 12,000 | 12,000 |
| Electric fence controller + monitor | 1 | 6,500 | 6,500 |
| UPS for gateway | 1 | 4,000 | 4,000 |
| **Subtotal** | | | **~1,16,500** |
| Installation + cabling | | | 30,000 |
| Contingency 15% | | | 22,000 |
| **Total Phase 5 CAPEX** | | | **~1,68,000** |

With PMKSY drip (55% subsidy), NABARD Dairy Entrepreneurship, and Telangana Organic Mission, expect ~40% reimbursement. Net out-of-pocket: **~₹1L**.

---

## 13. Open decisions I want your call on

1. **Monorepo or single repo?** I recommended monorepo. If you want a single Next.js app with route groups for simplicity, we can do that — but I'd re-add the storefront separately when it becomes SEO-critical.
2. **PWA worker app now or later?** I recommended Phase 7 to focus Phase 1–4 on CRUD + revenue. You could argue for WhatsApp-only (no PWA) through Phase 6.
3. **WhatsApp Cloud API or Interakt/Wati?** Cloud API is cheaper but has more integration work. Interakt is ~₹2,000/mo flat and handles template approvals for you.
4. **OCR vendor** — Google Vision (₹0.12/page, Telugu-capable) vs Tesseract.js (free, in-browser, no Telugu). I'd start with Google and never look back.
5. **Storefront UI library** — same shadcn stack, or go further into brand-led UI (Framer Motion animations, custom hero imagery)? Brand-led wins for D2C trust. Recommend: yes, more custom on storefront.
6. **E-mandate setup.** Razorpay's e-mandate on UPI autopay requires a one-time bank KYC flow. Plan ~2 weeks of cert + approvals for launch.
7. **Consent / compliance.** GDPR isn't the law in India but DPDPA 2023 is. Add a privacy policy page + data-export endpoint before Phase 4 ships publicly.

---

## 14. How to resume with Claude on each phase

Paste the matching prompt when you're ready to start that phase. I've already got the context.

### Kick-off Phase 0 (Day 1–5)
> "Phase 0: scaffold the monorepo per build-plan.md §5. Create apps/console with phone OTP auth, farm-select onboarding, and sidebar + topbar copied from prototype.html. Use shadcn/ui, Tailwind with our design tokens, Supabase SSR client. Wire `current_farm_id()`. Commit after each logical step."

### Kick-off Phase 1 (Livestock)
> "Phase 1: build livestock CRUD in apps/console. Animals list (data table), register-animal drawer, animal detail with tabs for Overview/Health/Breeding/Production, log-event drawers. Use the Zod schemas in packages/db. Wire KPIs from v_animals_active + v_daily_milk."

### Kick-off Phase 2 (Crops + Inventory)
> "Phase 2: plots list with Leaflet map, crop-cycle lifecycle UI, input-log with organic-compliance block, inventory (SKUs + lots + FEFO), OCR expense capture via Supabase Storage + Edge Function + Google Vision."

### Kick-off Phase 3 (Tasks + Payroll + Vet)
> "Phase 3: tasks Kanban with dnd-kit, workers roster, monthly payroll via SQL function (PF 12% + ESIC 3.25%), Telugu payslip PDF via Edge Function, WhatsApp delivery. Vet Workspace layout scoped to membership.role='vet' using sign_prescription()."

### Kick-off Phase 4 (Storefront + Orders)
> "Phase 4: build apps/storefront. Product grid, cart, Razorpay checkout with UPI autopay for subscriptions. Traceability QR page. SEO setup. Console gets the Orders queue + route planner + pack-list print."

### Kick-off Phase 5 (IoT)
> "Phase 5: Edge Function to ingest MQTT sensor data, rule evaluator running via pg_cron, device command queue. Console gets live sensor cards + RulesBuilder UI."

### Kick-off Phase 6 (Compliance)
> "Phase 6: quarterly welfare rollup pg_cron job, PGS/NPOP audit PDF generator, subsidy auto-claim wizard with form pre-fill."

### Kick-off Phase 7 (Worker PWA)
> "Phase 7: build apps/worker — mobile-first PWA, Telugu default, voice note capture + Whisper transcription, geofenced check-in, Dexie offline queue, install-to-home-screen manifest."

---

## 15. What I recommend you do right now

1. Push this to GitHub (`PUSH_TO_GITHUB.md`).
2. Answer the 7 questions in §13.
3. Say "go" and I'll execute Phase 0 — the full scaffolding, committed and deployable — so by the end of the week you're signing in to an actual production URL with your farm record live in Supabase.

Phase 0 is ~400 lines of code across 15 files. I can write all of it in one pass and have it ready to commit.
