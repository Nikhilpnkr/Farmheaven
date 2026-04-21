# FarmHeaven — Design System & Platform Spec

> A farm-operations + direct-to-consumer platform for a 70+ acre organic, self-sustaining farm in Telangana. Covers dairy (cow/buffalo), small ruminants (goat/sheep), poultry (layers + broilers), organic crops, IoT automation, and a customer storefront.

**Owner:** Suprameds  ·  **Location:** Hyderabad, Telangana, India  ·  **Version:** 1.0  ·  **Date:** 2026-04-20

---

## 1. Product Vision

FarmHeaven is the single pane of glass for running a closed-loop organic farm. It replaces the notebook + WhatsApp + Excel sprawl that most Indian farms run on with one operator console, one mobile app for ground staff, an automated IoT layer, and a customer-facing storefront that converts farm output into recurring revenue.

Three guiding principles:

1. **Closed-loop by default.** Every data point should route back into another part of the system. Manure from cattle → compost → crop yields → animal feed. The UI visualizes these flows so the operator can see leaks and surpluses.
2. **Low-touch operation.** If a sensor, feeder, or valve can automate a decision, the UI should surface the rule — not the raw data. Humans manage exceptions, not routines.
3. **Farm-first UX, not SaaS-first UX.** Large tap targets (gloves, sun, dust), offline-first mobile, Telugu + English toggle, voice notes over typed input, WhatsApp as a first-class notification channel.

---

## 2. System Architecture (context for the design)

```
┌──────────────────────────────────────────────────────────────────┐
│                    CUSTOMER STOREFRONT (Next.js)                 │
│       farmheaven.in  ·  subscriptions · orders · farm tours      │
└───────────────────────────────┬──────────────────────────────────┘
                                │ shared product + inventory API
┌───────────────────────────────┴──────────────────────────────────┐
│                  OPERATOR CONSOLE (Next.js + React)              │
│   Dashboard · Livestock · Crops · IoT · Finance · Orders · CRM   │
└───────────────────────────────┬──────────────────────────────────┘
                                │ GraphQL / REST
┌───────────────────────────────┴──────────────────────────────────┐
│       BACKEND (Node/NestJS + PostgreSQL + TimescaleDB)           │
│   auth · entity services · rules engine · scheduler · webhooks   │
└───────┬──────────────────────────────┬────────────────┬──────────┘
        │                              │                │
┌───────┴────────┐           ┌─────────┴───────┐    ┌──┴─────────┐
│ IoT Gateway    │           │  WhatsApp Cloud │    │ Razorpay / │
│ (MQTT broker,  │           │  API + SMS      │    │ UPI / Shiprocket │
│ Mosquitto on   │           │                 │    │            │
│ farm RPi)      │           └─────────────────┘    └────────────┘
└───────┬────────┘
        │ MQTT / LoRaWAN
┌───────┴───────────────────────────────────────────────────────────┐
│  FIELD DEVICES                                                    │
│  • Soil moisture (crops)  • Tank level sensors  • Weather station │
│  • Solenoid irrigation valves  • RFID ear tags + reader gantries  │
│  • Auto-feeder controllers  • CCTV + edge AI (NVIDIA Jetson Nano) │
│  • Milking parlor flow meters  • Egg counter belt  • Electric fence│
└───────────────────────────────────────────────────────────────────┘
```

Design implications: the UI is a thin, opinionated view over an events stream. The same "Animal" entity appears in six screens; the design system must keep those views coherent.

---

## 3. Information Architecture

Ten top-level modules. Every module lives at a stable URL and has a mobile counterpart.

| # | Module | Purpose | Primary user |
|---|---|---|---|
| 1 | **Dashboard** | Morning stand-up view: alerts, KPIs, weather, tasks | Owner |
| 2 | **Livestock** | Animal registry, health, breeding, production | Owner + Vet |
| 3 | **Crops & Fields** | Plot map, crop calendar, inputs, yields | Owner + Workers |
| 4 | **IoT & Automation** | Sensors, rules engine, device health, cameras | Owner |
| 5 | **Inventory** | Feed, seeds, medicines, harvested produce, packaging | Owner + Workers |
| 6 | **Tasks & People** | Assignments, attendance, payroll, shift plans | Owner + Workers |
| 7 | **Finance** | Expenses, P&L per unit, government subsidies, tax | Owner + Accountant |
| 8 | **Orders & Customers** | Storefront orders, subscriptions, delivery routes | Owner |
| 9 | **Storefront (public)** | Shop, subscribe, farm tours, blog | Customers |
| 10 | **Reports & Compliance** | Organic certification logs, milk yield curves, margins | Owner + Auditor |

Plus **Settings** (farm profile, users, devices, integrations, localization).

---

## 4. Design Tokens

Tokens are the atomic contract — change them once, the whole system shifts. Named semantically, not by hex value, so themes can be swapped (dark mode, high-sun mode).

### 4.1 Color

The palette is rooted in Indian earth pigments — turmeric, indigo, haldi, terracotta — not the generic Silicon-Valley greens that most farm apps use. Colors are defined in OKLCH for consistent perceived lightness, with sRGB fallbacks.

**Brand**

| Token | Light hex | Dark hex | Use |
|---|---|---|---|
| `brand/leaf-600` | `#3B7A3F` | `#6FB073` | Primary action, logo |
| `brand/leaf-500` | `#4E9E54` | `#82C487` | Hover states on primary |
| `brand/soil-700` | `#5B3A1E` | `#8B6A4A` | Text accent, section headers |
| `brand/turmeric-500` | `#E0A415` | `#F4C14A` | Highlights, celebratory states |

**Semantic**

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `success` | `#2E7D32` | `#4CAF50` | Task done, healthy animal, yield up |
| `warning` | `#E59400` | `#FFB84D` | Attention needed, vaccination due |
| `danger` | `#C62828` | `#EF5350` | Disease outbreak, device offline > 1 h, negative margin |
| `info` | `#1565C0` | `#42A5F5` | Neutral info, scheduled events |

**Neutrals (surface hierarchy)**

| Token | Light | Dark | Use |
|---|---|---|---|
| `surface/canvas` | `#FAF7F0` | `#161412` | App background (warm off-white; not pure white) |
| `surface/raised` | `#FFFFFF` | `#211E1B` | Cards, panels |
| `surface/sunken` | `#F2EDE0` | `#0E0C0A` | Input backgrounds, table row banding |
| `border/subtle` | `#E5DFD0` | `#332F2A` | Dividers |
| `border/strong` | `#C4BBA6` | `#4A453F` | Input borders |
| `text/primary` | `#1F1B16` | `#F5EFE2` | Body |
| `text/secondary` | `#5A5346` | `#B8B09E` | Helper, labels |
| `text/muted` | `#8A8372` | `#807869` | Timestamps, disabled |

**Data-viz palette** (qualitative, colorblind-safe, tested for deuteranopia and protanopia):

`#3B7A3F` · `#E0A415` · `#1565C0` · `#C62828` · `#6A3D9A` · `#8B6A4A` · `#00838F` · `#D84315`

### 4.2 Typography

Two families. **Inter** for UI (excellent at small sizes, free, supports Telugu via Noto Sans Telugu fallback). **Fraunces** for brand/marketing headlines on the storefront — warmer, agricultural feel.

```
font-family-ui     : "Inter", "Noto Sans Telugu", system-ui, sans-serif
font-family-brand  : "Fraunces", "Noto Serif Telugu", Georgia, serif
font-family-mono   : "JetBrains Mono", ui-monospace  (device IDs, coords)
```

Type scale (1.25 minor-third ratio, rem-based):

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `text-xs` | 0.75rem / 12px | 1.4 | 500 | Table captions, chips |
| `text-sm` | 0.875rem / 14px | 1.5 | 400 | Secondary body, helper text |
| `text-base` | 1rem / 16px | 1.55 | 400 | Default body |
| `text-lg` | 1.125rem / 18px | 1.5 | 500 | Card titles |
| `text-xl` | 1.25rem / 20px | 1.4 | 600 | Section headers |
| `text-2xl` | 1.5rem / 24px | 1.3 | 600 | Page titles |
| `text-3xl` | 1.875rem / 30px | 1.2 | 700 | Dashboard hero metrics |
| `text-display` | 2.5rem / 40px | 1.1 | 700 | Storefront heroes only |

Minimum body size on mobile = 16px (prevents iOS zoom-on-focus).

### 4.3 Spacing

4px base grid. Never use off-grid pixel values — the system breaks otherwise.

```
space-0   0
space-1   4px
space-2   8px
space-3   12px
space-4   16px   ← default card padding
space-5   20px
space-6   24px   ← default section gap
space-8   32px
space-10  40px
space-12  48px
space-16  64px
space-20  80px   ← top-of-page hero padding
```

### 4.4 Radius

```
radius-none  0
radius-sm    4px    ← chips, badges
radius-md    8px    ← inputs, buttons
radius-lg    12px   ← cards
radius-xl    16px   ← modals, hero imagery
radius-full  9999px ← pills, avatars
```

### 4.5 Shadows (elevation)

Designed for the warm off-white canvas — cooler greys read as dirty. Shadows use a brown undertone.

```
elev-0   none
elev-1   0 1px 2px rgba(68, 52, 36, 0.06)
elev-2   0 2px 4px rgba(68, 52, 36, 0.08), 0 1px 2px rgba(68,52,36,0.04)
elev-3   0 8px 16px rgba(68, 52, 36, 0.10), 0 2px 4px rgba(68,52,36,0.06)
elev-4   0 16px 32px rgba(68, 52, 36, 0.14), 0 4px 8px rgba(68,52,36,0.08)
```

### 4.6 Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion-instant` | 80ms | ease-out | Hover, focus ring |
| `motion-fast` | 160ms | cubic-bezier(0.2,0,0,1) | Buttons, chips, small state |
| `motion-normal` | 240ms | cubic-bezier(0.2,0,0,1) | Modal open, drawer |
| `motion-slow` | 400ms | cubic-bezier(0.2,0,0,1) | Page transitions, chart enter |
| `motion-ambient` | 2000ms | ease-in-out infinite | Live-data pulse, growing plant |

Respect `prefers-reduced-motion: reduce` — drop everything above `motion-fast` to instant.

### 4.7 Breakpoints

```
sm   640px  — phone landscape
md   768px  — tablet portrait (worker app is optimized here)
lg   1024px — tablet landscape, small laptop
xl   1280px — desktop console
2xl  1536px — wide monitor
```

Operator console is `lg+` first; worker app is `sm` first; storefront is mobile-first.

### 4.8 Iconography

Lucide icon set, 1.5px stroke, 20px default. Custom set for farm-specific concepts (cow, goat, hen, grain sack, drip, tractor, compost bin, UPI, WhatsApp) drawn to match Lucide's grid and stroke — never mix custom 2px strokes with Lucide 1.5.

---

## 5. Component Library

Built on shadcn/ui as a base, extended with farm-specific components. Everything exports TypeScript types. Stored in `/packages/ui`.

### 5.1 Atoms

**Button** — variants: `primary`, `secondary`, `ghost`, `destructive`, `success`. Sizes: `sm` (32px), `md` (40px — default), `lg` (48px — mobile primary). States: default, hover, active, focus-visible, disabled, loading. Minimum touch target 44×44 on mobile.

**Input / Textarea / Select** — label above (never placeholder-as-label), helper text below, 16px font on mobile, left icon slot for units (kg, L, ₹). Error state uses `danger` border + red icon + text.

**Chip** — variant `filter` (toggleable) and `status` (read-only, color-coded). Chips for animal status are canonical: `Healthy` (green), `In heat` (turmeric), `Pregnant` (indigo), `Sick` (red), `Weaning` (soil), `Retired` (muted).

**Badge** — tiny numeric indicator, usually on nav items ("3 alerts").

**Avatar** — for humans *and* animals. Animals get their tag ID auto-generated as initials and a species-tinted background.

**Skeleton** — shimmering placeholder, used aggressively because rural 4G is flaky.

**Toast** — bottom-right desktop, top mobile. Swipe-to-dismiss. Sticky for `danger` toasts.

### 5.2 Molecules

**Metric card** — large number, label, delta (▲ +12% vs last week), sparkline. Used on Dashboard and module headers.

**Animal card** — avatar + tag ID + species icon + name + status chip + last-event timestamp. Clickable to full profile.

**Sensor card** — live value (pulses softly on update via `motion-ambient`), unit, last-updated, device status dot (green/amber/red), mini 6-hour trend line.

**Field card** — plot thumbnail (satellite crop), crop name, current stage chip, days-to-harvest countdown, ongoing task count.

**Form field** — label + control + helper/error. Composes `Input`, `Select`, `DatePicker`, etc. Never break layout with error state (reserve space).

**Search bar** — global `⌘K` / long-press on mobile, searches across animals, fields, SKUs, orders, customers. Results grouped and keyboard-navigable.

**Breadcrumb** — for drill-down views (Livestock → Dairy → Cow #C-0042 → Health events).

### 5.3 Organisms

**DataTable** — column pinning, row selection, inline edit on double-click, virtualized above 500 rows. Supports density toggle (compact/cozy/comfy). Mobile: auto-converts to a stacked card list.

**Map** — Leaflet + satellite tiles; draws field boundaries as GeoJSON, animal location heatmap (if LoRa collars in future), sensor pins. A "layers" control toggles crops / livestock / sensors / irrigation zones.

**Calendar / Gantt** — for crop cycles, breeding timelines, vaccination schedules. Month/quarter/year views. Overlay filters by crop, animal group, or worker.

**RulesBuilder** — visual if-this-then-that editor for the automation engine. Left: triggers (sensor threshold, schedule, event). Middle: conditions (AND/OR). Right: actions (open valve, send WhatsApp, create task, log entry).

**DeviceRow** — for IoT device list. Name, type icon, battery %, signal bars, firmware version, last-heard, actions (reboot, calibrate, retire).

**OrderRow** — for Orders module. Customer, items (with thumbnails), total, status pill, delivery slot, action menu.

**Timeline** — for animal life events (birth, vaccinations, breedings, weight checks, illnesses, culling). Color-coded by event type.

**KPI strip** — horizontal scroll strip of metric cards for the module header (e.g., Livestock: "Total head · Avg milk/day · Births this month · Active alerts").

### 5.4 Patterns

**Empty state** — never just "No data." Always explains what this view *will* show + a primary CTA. For new farms: "No animals yet. Register your first cow to start tracking milk, health, and breeding." + CTA.

**Confirmation modal** — destructive actions require typing the entity name (e.g., "Type COW-0042 to confirm culling"). Softer actions use a simple checkbox.

**Drawer (side sheet)** — for detail views that don't warrant a full page navigation. E.g., clicking an animal row opens a drawer; clicking "Full profile" pushes to `/livestock/:id`.

**WhatsApp-style comments** — every entity (animal, field, order) has a comment thread. Supports voice notes (Whisper auto-transcribes in Telugu/Hindi/English), photo attachments (mandatory for health/disease logs).

**Offline banner** — thin amber bar at top when offline. Mobile queues writes; console shows read-only toast.

---

## 6. Page Designs

For each page: purpose, layout, key components, automation touchpoints. Screens are described in enough detail for a developer to build from, without mockup files.

### 6.1 Dashboard (`/`)

**Layout:** 12-col grid.

- **Row 1 (full width):** Weather + alerts banner. Today's forecast, SW monsoon status, 3 highest-severity alerts (device offline, animal sick, low tank).
- **Row 2 (8/4 split):** KPI strip (left 8 cols) — Today's milk yield, Eggs collected, Tasks done/pending, Revenue this week. Weather detail card (right 4 cols) — 7-day forecast, rain probability, soil temp.
- **Row 3 (full):** "Needs you today" — sorted task list combining vet visits, harvest windows, breeding checks, order dispatches.
- **Row 4 (6/6 split):** Milk yield trend (30 days, by animal group) + Egg production trend.
- **Row 5 (full):** Farm map — live, with animals grouped into zones, active irrigation highlighted, and any camera with motion flagged.

**Automation touchpoints:** Any card with a 🤖 glyph in the corner is driven by an automation rule — clicking shows which rule and lets you pause/edit it.

### 6.2 Livestock

Three sub-modules sharing one shell: **Dairy**, **Small ruminants (Goat/Sheep)**, **Poultry**.

**`/livestock/dairy`**
- Header: KPI strip — Total head, In-milk count, Avg L/animal/day, Pregnant, Open days avg.
- Sidebar filter: breed (Murrah, Gir, Sahiwal, Jersey cross), stage (heifer/lactating/dry/calf), barn, health status.
- Main: toggle DataTable ↔ Card grid ↔ Barn view (visual stalls).
- Each animal row: tag, name, breed, last calving, DIM (days in milk), yesterday's yield, status chips.
- Bulk actions: schedule vaccination, assign to barn, record weights, export for co-op.

**Animal profile (`/livestock/dairy/:id`)**
- Hero: photo + tag + species + breed + age + current status + parentage (dam/sire).
- Tabs: Overview · Production · Health · Breeding · Feed · Genealogy · Comments.
- Production tab: daily milk log (morning/evening), fat %, SCC (somatic cell count from parlor), lactation curve vs breed average.
- Health tab: timeline of vaccinations, dewormings, treatments, body-condition scores. Vaccination schedule auto-generated from breed + age + Telangana disease calendar (FMD, HS, BQ, brucellosis, theileriosis).
- Breeding tab: heat cycle tracker (pedometer + visual heat detection from camera), AI/service records, pregnancy status with due date.

**`/livestock/small-ruminants`** — similar structure, with group-level tracking (flock > individual) for goats/sheep since individual Osmanabadi goats don't economically justify per-animal milk logs. Batch weighing, batch dewormings. Individual tracking only for bucks/does in breeding program.

**`/livestock/poultry`** — flock-centric. Track by shed/batch, not individual bird (except breeding stock).
- Shed view: current headcount, age in days, avg weight, daily egg count (from belt counter), feed conversion ratio, mortality %, next vaccination.
- Two workflows: **Layers** (egg production curve, culling at 72 weeks) and **Broilers** (growth curve vs Cobb/Ross target, market-readiness at ~38 days).

### 6.3 Crops & Fields

**`/fields`** — map-first. Draw 70-acre boundary, sub-divide into plots. Each plot has crop rotation history, soil test results (pH, N/P/K, organic carbon), current crop, stage.

Organic-farming-specific features:
- Crop rotation planner with legume/cash crop cycle recommendations for Telangana red soil.
- Companion planting suggestions.
- Input log — only PGS-India or NPOP-approved inputs are selectable, and switching to a non-organic input triggers a compliance warning that bubbles up to Reports.
- Integrated pest management (IPM) log — pheromone traps, neem sprays, bio-controls.
- Compost pipeline: manure from cattle/poultry → composting windrows (temperature tracked via sensors) → application events linked back to plots.

**`/fields/:id/calendar`** — crop stage Gantt: prep → sow → germination → vegetative → flowering → fruiting → harvest. Overlays: irrigation events, fertigation, pest pressure, weather.

### 6.4 IoT & Automation

**`/iot/devices`** — grouped by type: Sensors, Valves, Feeders, Cameras, Gateways. Each row shows battery/signal/last-heard. Failed devices bubble to dashboard alerts.

**`/iot/cameras`** — grid of live feeds + motion-detected clips. Edge AI (Jetson Nano) runs:
- Cattle body-condition scoring.
- Lameness detection from gait.
- Heat detection (mounting behavior).
- Chicken huddle/stress detection.
- Predator detection at night (dog vs jackal vs human).
Each event creates a timeline entry on the relevant animal/flock.

**`/iot/rules`** — the RulesBuilder organism. Typical rules:
- *If* soil moisture in plot 4 < 18% AND no rain forecast 24h *then* open valve zone 4 for 30 min, notify worker.
- *If* water tank < 30% *then* start bore pump, alert owner.
- *If* poultry shed temp > 34°C for 10 min *then* activate cooling fan 2, notify.
- *If* cow C-0042 rumination drops > 25% *then* create vet task, flag "possible disease".
- *If* egg count today < 80% of 7-day avg *then* alert owner.
- *Every day 4:30am* *if* milking stall 1 available *then* start CIP cycle.

**`/iot/zones`** — map of irrigation zones, feed silos, cooling fans with manual override toggles.

### 6.5 Inventory

**`/inventory`** — tabs: Feed · Seeds · Medicines/Vaccines · Harvested produce · Packaging · Tools/Equipment.

- Feed: compound feed, silage, hay, mineral mix — auto-decremented as feeders dispense. Low-stock reorder alerts.
- Medicines: batch, expiry, withdrawal period (critical — milk/meat withdrawal after antibiotic triggers auto-quarantine in Production).
- Harvested produce: milk (litres, chilling tank, batches per day), eggs (count, size grade), meat (kg, cuts, cold storage locations), vegetables (crop, weight, grade).
- FEFO (first-expiring, first-out) pick logic built into order dispatch.

### 6.6 Tasks & People

**`/people`** — worker roster: photo, Aadhaar (if consented), phone, skills, shift, wage rate, attendance calendar.

**`/tasks`** — Kanban: Backlog · Today · In progress · Done. Tasks auto-generated from rules (vaccination due, harvest window, sensor alert) or created manually. Workers check in via WhatsApp bot or simplified mobile app.

Attendance/payroll: geo-fenced check-in at farm gate, piece-rate + daily wage support, auto-generated monthly payslips.

### 6.7 Finance

**`/finance`** — cost center per unit (dairy, goat, poultry, crop plot, storefront).

- Expense capture: photo-of-bill → OCR (receipts, mandi slips, vet bills) → categorized + GST-handled.
- P&L per unit per month — know which product actually makes money.
- Subsidy tracker: NABARD, Rythu Bandhu, state organic mission schemes applicable.
- Tax-ready: TDS on vendors, GST on storefront sales, agricultural income exemption line items clearly isolated.
- Cash flow forecast: upcoming receivables (subscriptions) vs payables (feed, wages).

### 6.8 Orders & Customers (operator side)

**`/orders`** — live queue. Filters: today / tomorrow / subscription renewals. Each order shows items, pick list, delivery slot, route, assigned delivery person.

Delivery routing: clusters orders by pincode, suggests route via OSRM, prints stickers with QR codes.

**`/customers`** — CRM lite: contact, order history, LTV, favorite SKUs, subscription status. Segment builder for campaigns (e.g., "customers who bought ghee > 2× but never eggs").

### 6.9 Storefront (customer-facing, `farmheaven.in`)

Mobile-first, Fraunces for headlines, warmer imagery, UPI as first payment option.

- **Home:** hero video of the farm, "meet the animals" carousel (each cow/goat has a profile page — builds trust), today's harvest banner, subscription pitch.
- **Shop:** categories — Milk & dairy (A2 ghee, paneer, curd), Eggs (country, Kadaknath), Meat (goat, chicken), Vegetables (seasonal), Honey, Millets.
- **Subscribe:** weekly/fortnightly boxes. Customers pick delivery day, pause/skip from dashboard, pay via UPI autopay (e-mandate).
- **Traceability page:** scan QR on any pack → which animal/plot, which batch, which worker packed, which date. Huge trust signal for organic.
- **Farm tours:** bookable slots — farm-to-table meals, kids' tours, corporate wellness. Calendar widget, razorpay checkout.
- **Blog/education:** why A2, why pastured, monsoon recipes. SEO engine for long-tail queries ("A2 ghee Hyderabad delivery", "organic millets near me").

### 6.10 Reports & Compliance

**`/reports`** — pre-built reports + custom builder.

- Milk yield per animal per month (for lactation benchmarking).
- Feed conversion ratio per poultry batch.
- Organic compliance log (auto-compiled from input logs; one-click PDF for PGS-India / NPOP audit).
- Margin per SKU per month.
- Cohort retention for subscription customers.
- Water usage per crop (sustainability KPI).

---

## 7. Data Model (core entities)

Simplified — actual schema will normalize further.

```
User           (id, name, phone, role, lang, farm_id)
Farm           (id, name, location_geom, size_acres, cert_status)
Barn/Shed      (id, farm_id, type, capacity, climate_targets)
Field/Plot     (id, farm_id, geom, soil_profile_id, current_crop_id)

Animal         (id, tag, species, breed, dob, sex, dam_id, sire_id, status,
                barn_id, acquisition, retirement_reason)
Flock          (id, species, shed_id, date_placed, headcount, purpose)

ProductionEvent(id, subject_id, type[milk|egg|weight|meat|veg], value, unit,
                ts, recorded_by, source[manual|sensor|rule])
HealthEvent    (id, animal_id, type, ts, observations, treatment_id, withdrawal_until)
BreedingEvent  (id, animal_id, type[heat|service|pg_check|calving|abortion], ts, notes)

Device         (id, type, zone, firmware, battery_pct, last_seen)
SensorReading  (timescaledb hypertable: device_id, ts, metric, value)
Rule           (id, name, trigger_json, conditions_json, actions_json, active)

Inventory SKU  (id, name, category, unit, reorder_point, withdrawal_rule)
InventoryLot   (id, sku_id, qty, location, batch, expiry, parent_event_id)

Task           (id, title, assignee_id, due, status, source[rule|manual], links_to)

Order          (id, customer_id, items[], total, delivery_slot, route_id, status)
Subscription   (id, customer_id, plan_id, cadence, next_delivery, status)
Customer       (id, name, phone, email, addr[], ltv, tags[])

Transaction    (id, type[income|expense], cost_center, category, amount, party, ts, gst_json)
```

TimescaleDB for `SensorReading` (tens of millions of rows). PostgreSQL for everything else. Postgres RLS (row-level security) for role scoping.

---

## 8. Automation Workflows

Every routine should be encoded. Below are the high-leverage ones to launch with.

| # | Trigger | Action | Impact |
|---|---|---|---|
| 1 | Soil moisture < threshold & no rain forecast | Open drip valve X min, log water used | 30–40% water saving |
| 2 | Cow rumination drops > 25% or activity spikes | Create vet task, flag animal | Catches illness/heat 24–48h earlier |
| 3 | Withdrawal period active | Auto-quarantine milk/meat output, hide from dispatch | Organic compliance |
| 4 | Daily 5:30am milking | Pull flow-meter readings, assign to animal via RFID, update lactation curve | Zero manual logging |
| 5 | Shed temp > 34°C | Run cooling fans + sprinklers, notify if unresolved in 15min | Prevents heat stress mortality |
| 6 | Tank level < 30% | Start bore, alert if level doesn't rise in 30min (dry bore) | Prevents stockout |
| 7 | Egg count < 80% of 7-day avg | Alert + auto-create inspection task | Early disease detection |
| 8 | Subscription renewal tomorrow | Generate pick list, assign to packer, schedule delivery | Fulfillment pipeline |
| 9 | Vaccination due in 7 days | Create task, assign vet, WhatsApp worker | Never miss a schedule |
| 10 | Compost windrow temp drops below 45°C | Schedule turning task | Proper composting curve |
| 11 | Organic-non-compliant input selected | Block + show reason | Keeps certification clean |
| 12 | Predator detected on night camera | Trigger siren + owner alarm, log event | Asset protection |

The RulesBuilder UI exposes these as first-class editable objects — not code.

---

## 9. Roles & Permissions

| Role | Scope |
|---|---|
| **Owner** | Everything. Default role for Suprameds. |
| **Manager** | All operations; no finance, no user admin. |
| **Vet** | Read livestock, write health events, create prescriptions. |
| **Agronomist** | Read fields, write crop events, recommend inputs. |
| **Worker** | Mobile app only. Assigned tasks, log sensor readings, photo reports. |
| **Accountant** | Finance read/write. Read-only elsewhere. |
| **Customer** | Storefront only. Own orders, subscription, addresses. |

Postgres RLS enforces scoping server-side; the UI just hides features per role — never relies on client hiding alone.

---

## 10. Tech Stack Recommendation

Pragmatic, cheap to run, hirable-for-developers.

| Layer | Choice | Reason |
|---|---|---|
| Frontend (console + storefront) | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | Same stack for both apps, SEO for storefront, server components for the console |
| State/data | TanStack Query + Zustand | Simple, debuggable |
| Backend | NestJS (Node) or Django (Python) | NestJS if TS-all-the-way; Django if you want admin panel for free |
| Database | PostgreSQL 16 + TimescaleDB extension + PostGIS | One DB handles everything |
| IoT broker | Mosquitto (MQTT) on farm Raspberry Pi + cloud MQTT relay | Works offline when uplink drops |
| Edge AI | NVIDIA Jetson Nano / Orin Nano for cameras | Cheap, handles the models you need |
| Real-time | Postgres NOTIFY + WebSocket gateway | No extra infra |
| Hosting | Hetzner (₹/GB beats AWS for India) + Cloudflare | ~₹2,000/month starter |
| Object storage | Cloudflare R2 or Backblaze B2 | Cheap egress |
| Messaging | WhatsApp Cloud API (Meta) + MSG91 for SMS | WhatsApp is the real channel in India |
| Payments | Razorpay (UPI autopay for subscriptions) | Handles e-mandate |
| Logistics | Shiprocket or Dunzo/Porter API for hyperlocal | City-wide same-day |
| Auth | Lucia or NextAuth + phone OTP (MSG91) | OTP is standard in India |
| Maps | Leaflet + MapTiler (or OSM) | Free enough, good India coverage |
| Monitoring | Grafana (on the same Postgres) + Sentry | DIY-friendly |

Localization: `next-intl` with en-IN, te-IN, hi-IN bundles. Currency INR always, dates DD-MM-YYYY.

---

## 11. Implementation Roadmap

Don't build all of it. Ship in phases; revenue from each phase funds the next.

**Phase 0 — Week 0–2: Foundation**
- Monorepo, design tokens, auth, user/farm setup, empty module shells.

**Phase 1 — Month 1–2: Livestock core**
- Animal registry, health events, manual milk/egg logging, basic dashboard.
- Win: one source of truth for the herd.

**Phase 2 — Month 2–3: Crops + inventory + finance basics**
- Fields with map, crop calendar, inventory with FEFO, expense OCR, P&L skeleton.

**Phase 3 — Month 3–5: IoT layer**
- MQTT broker on Pi, first sensors (soil, tank, temp), RFID at milking parlor, RulesBuilder v1, 5 canonical rules automated.

**Phase 4 — Month 5–7: Storefront + orders**
- `farmheaven.in` launches with 10 SKUs, weekly subscription, UPI autopay, delivery routing.
- Win: recurring revenue begins.

**Phase 5 — Month 7–9: Compliance + CRM + cameras**
- PGS-India / NPOP compliance reports one-click, customer CRM with segments, edge-AI cameras for heat/illness detection.

**Phase 6 — Month 9–12: Polish + expand**
- Telugu localization, worker mobile app, farm tours bookings, traceability QR on packs, subscription pause/skip UI.

**Stretch (Year 2):** drone scouting, robotic milking integration, B2B wholesale module for Hyderabad restaurants, CSA-style share subscriptions.

---

## 12. Appendix — KPIs the system should surface by default

**Livestock health & productivity**

- Avg milk yield per cow per day (L), per breed
- Days-in-milk distribution
- Calving interval (target < 13 months)
- Mortality % (target < 3% dairy, < 5% poultry layers, < 4% broilers)
- Feed Conversion Ratio (dairy target 1.4 L milk/kg DM, broilers < 1.7)
- Egg production per layer per year (target 280+)
- Somatic cell count (milk quality)

**Crops & sustainability**

- Yield per acre vs regional benchmark
- Water used per kg produce
- Organic input % (must be 100% for certification)
- Soil organic carbon trend
- Plot rotation compliance

**Business**

- Gross margin per SKU
- CAC, LTV, LTV/CAC ratio on storefront
- Subscription retention (month 1, 3, 6)
- NPS
- Cash runway

**Automation health**

- % of routine events auto-captured vs manual
- Sensor uptime %
- Rules triggered per week, false-positive %

---

## 13. Open Design Questions

To resolve before build starts:

1. **Individual vs group tracking threshold.** Where's the economic break-even for per-animal tracking in goats? (Tentative: breeding stock individual, commercial stock group.)
2. **Direct-delivery zones.** Start Hyderabad-only or include Secunderabad + Cyberabad from day 1?
3. **Cold chain.** Milk dispatch — glass bottles with deposit or food-grade HDPE? Deposit model builds loyalty but adds ops load.
4. **A2 testing cadence.** How often to re-verify A2/A2 genotype (for any Jersey cross)? Impacts the A2 ghee line claim.
5. **Worker device ownership.** Company phones or BYOD? Affects offline sync design.
6. **Slaughter.** On-farm or partner abattoir? Massive regulatory and UI implications for the meat SKUs.
7. **AI integration.** Meta's WhatsApp bot for customer support — self-built on Claude/GPT or use a vendor (Interakt, Wati)?

---

*End of v1.0. This doc is the north star — update it as decisions are made. Keep tokens, component contracts, and data model in sync with the repo via codegen where possible.*
