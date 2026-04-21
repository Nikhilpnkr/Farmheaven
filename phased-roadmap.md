# FarmHeaven — Phased Roadmap (Manual First → IoT Later)

> Goal: get value from day 1 with a notebook-killer app, then layer in IoT + automation as cashflow allows. The database schema already supports all of it; features ship in phases.

**Rule of thumb:** every phase should generate revenue or eliminate a real pain, not just build infrastructure for later.

---

## Phase 0 — Foundation (Week 0–2)

**Goal:** you can log in, you have a farm record, you can add your first cow.

Ship:
- Supabase project + auth (phone OTP via MSG91, magic-link via email as fallback).
- Core schema (done ✓ — all 15 migrations applied).
- Seed your farm, barns, plots, zones via the Supabase UI or a one-time CLI script.
- Deploy skeleton Next.js app (operator console shell + login + farm-selector).
- Storage buckets (`farm-photos`, `vet-prescriptions`, `voice-notes`, `soil-reports`, `drone-orthos`).

Manual-only. No IoT, no storefront yet.

**DB tables used:** `orgs`, `farms`, `profiles`, `memberships`, `structures`, `plots`, `zones`, `species`, `breeds`.

---

## Phase 1 — Livestock (Month 1–2)

**Goal:** one source of truth for every animal. Delete the notebooks.

Ship:
- Register animals individually (cattle, buffalo) with tag, breed, DOB, parentage.
- Register flocks (poultry, goat batches) with headcount.
- Log health events (symptoms, treatments, vaccinations) with photo.
- Log milk yield morning/evening per animal (manual number entry).
- Log egg count per shed daily.
- Log breeding events — heat observed, AI/service, pregnancy check, calving.
- Animal profile page with timeline.
- Vaccination calendar generating tasks.

Manual entry via the console. The worker app for voice/WhatsApp comes later.

**DB tables used (already there):** `animals`, `flocks`, `animal_movements`, `health_events`, `breeding_events`, `production_events`.

**Wins:**
- Lactation curves per animal.
- Breed benchmarking.
- Health timeline for every animal.
- Withdrawal auto-quarantine kicks in automatically (the trigger runs whether data came from IoT or typing).

**Don't build yet:** estrus ML, edge-AI cameras, worker app, RFID.

---

## Phase 2 — Crops, Inventory, Finance basics (Month 2–3)

**Goal:** know what you're growing, what you have, and whether you're profitable per cost center.

Ship:
- Plot management + crop cycles (sowing → harvest stages).
- Manual input log per plot (what fertilizer/bio-input went where).
- Organic-input compliance: block non-PGS/NPOP selections at data-entry time.
- Compost windrow tracker (manual temp readings logged by hand).
- Inventory: add SKUs, receive lots, consume lots. Barcodes skipped — human types the lot code.
- OCR expense capture (photo of bill → Tesseract or AWS Textract → pre-filled txn form).
- Suppliers + cert status tracking. Alert on 30-day-out cert expiry.
- P&L per cost center, basic monthly.

**DB tables used:** `crop_cycles`, `soil_samples` (optional), `compost_windrows`, `suppliers`, `skus`, `inventory_lots`, `inventory_movements`, `ipm_logs`, `cost_centers`, `txn_categories`, `transactions`.

**Wins:**
- Know your margin per SKU.
- Input traceability for the PGS audit is now real, not theoretical.
- No more WhatsApp-screenshot receipts lost in chat.

**Don't build yet:** yield forecasting, soil-lab integration, drone ingestion.

---

## Phase 3 — Tasks, People, Payroll (Month 3–4)

**Goal:** the people running the farm use it without asking questions.

Ship:
- Workers roster + manual attendance (clock-in from a tablet in the office, not geofenced yet).
- Task Kanban auto-generated from vaccination schedule + manual.
- Piece-rate + daily-wage logs.
- Monthly payroll with PF 12% + ESIC 3.25% + gratuity accrual.
- Telugu payslip PDF sent via WhatsApp.
- Vet Workspace scoped login (your vet gets a real account).

**DB tables used:** `workers`, `attendance`, `piece_work_logs`, `tasks`, `payroll_runs`, `payslips`. Vet Workspace just uses scoped `memberships`.

**Wins:**
- Compliant payroll without a spreadsheet.
- Your vet becomes part of the system — prescriptions now lock withdrawal properly.

**Don't build yet:** geofenced check-in, voice transcription, WhatsApp bot.

---

## Phase 4 — Storefront + Orders (Month 4–6) → REVENUE BEGINS

**Goal:** subscriptions start generating cash.

Ship:
- Public storefront at `farmheaven.in` (Next.js + the product catalogue).
- UPI autopay via Razorpay e-mandate.
- Weekly / fortnightly subscription boxes.
- Order management: pack, pick-list print, route plan.
- Delivery routing (manual cluster by pincode; OSRM-based routing can come later).
- Customer profile: order history, LTV, tags.
- Traceability QR on packs (animal-level only; input-level comes in Phase 6).

**DB tables used:** `customers`, `customer_addresses`, `products`, `orders`, `order_items`, `subscriptions`, `delivery_routes`, `customer_events`.

**Wins:**
- Recurring revenue.
- Pulls demand signal back into yield planning for Phase 5.

**Don't build yet:** welfare badges on storefront (need Phase 6 data first), wholesale B2B lane.

---

## Phase 5 — IoT layer (Month 6–9)

**Goal:** stop hand-recording things sensors can auto-capture.

Ship incrementally — pick two or three items each month:
1. **MQTT broker** on a farm Raspberry Pi (Mosquitto) + cloud relay.
2. **Soil-moisture sensors** in Plots 1, 4, 6 → sensor readings flow in.
3. **Tank level sensor** → low-tank alert rule.
4. **RFID reader** at the milking parlor → auto-assign milk batches to animals.
5. **Weather station** → replaces the hardcoded API data.
6. **Cameras** at Barn A and Shed 1 with edge-AI on a Jetson Nano.
7. **Solenoid irrigation valves** on Plots 4 and 6 → enable the smart-irrigation rule.
8. **Cooling fans + misters** controlled via device commands.
9. **Electric fence monitor** + siren device.

The `devices`, `sensor_readings`, `automation_rules`, `rule_firings`, `device_commands` tables are already there. Flip features on as the hardware lands.

**Wins:**
- Water saved 30–40% vs manual scheduling.
- Heat detection catches illness 24–48h earlier.
- Zero manual milk logging (RFID does it).

**Reality check:** budget ₹2–4L for hardware in Phase 5. Subsidies (PMKSY, NABARD) reimburse 40–55% of drip + dairy modernization. Phase 4's subscription revenue should cover the rest.

---

## Phase 6 — Welfare, Compliance, Advanced ML (Month 9–12)

**Goal:** harder-to-fake differentiation — the parts competitors can't copy quickly.

Ship:
- **Estrus prediction ML** — combine RFID activity + camera mounting + cycle history.
- **Welfare rollups** — panting, huddling, vocalization stress — quarterly PDF + storefront badges.
- **Carbon inventory** — sequestration from compost + silvopasture, emissions from enteric CH₄ + diesel, net position.
- **Soil-lab workflow** — sample kits mailed to Anand AU or NSTL, PDF ingestion, per-plot organic-carbon trend.
- **Drone NDVI ingestion** — upload from Redwing or similar, per-plot stress zones.
- **Input lineage traceability** — QR on packs shows supplier → feed lot → animal → parlor → churn → pack.
- **PGS-India / NPOP one-click audit PDF** — from certification bodies you've added, one click generates the full packet.
- **Subsidy auto-claim** — pre-fill Rythu Bandhu, NABARD, PMKSY forms from your data.

**DB tables used:** `welfare_events`, `welfare_rollups`, `carbon_entries`, `soil_samples`, `remote_sensing_runs`, `farm_certifications`, `subsidy_claims`, `audit_log`.

**Wins:**
- Premium pricing justified on the storefront.
- Audit prep goes from 40 hrs to 2 hrs.
- Subsidies you were leaving on the table start arriving.

---

## Phase 7 — Worker App (Month 9–12, parallel with Phase 6)

**Goal:** close your 18-month differentiation window against AgriWebb / Stellapps.

Ship:
- WhatsApp Cloud API bot with voice transcription (Whisper → te-IN / hi-IN / en-IN).
- NER to tag voice notes to the right animal / plot / SKU.
- Geofenced check-in via browser geolocation on a phone.
- Telugu/Hindi UI for tasks, payslips, piece-rate logs.
- Offline-first (service worker caches today's task list).

---

## What to skip (for now or forever)

- **Custom satellite ingestion** — at 72 acres, drones beat satellites on cost + resolution. Skip forever unless scale 10×.
- **Your own vet EMR** — just give vets a scoped prescribe-and-dose screen. The market isn't moving toward standard APIs.
- **Peer benchmarking** — needs ≥10 farms on the platform. Revisit at ~Year 2.
- **Cryptocurrency / tokenization** — no.

---

## Cashflow-aware sequencing

| Phase | Cost to ship | Revenue unlocked | Net |
|---|---|---|---|
| 0–3 (Foundation + Livestock + Crops + People) | Your time + ₹2k/mo Supabase + hosting | 0 | – |
| 4 (Storefront) | ~20h dev + Razorpay fees | Starts ₹50k–₹2L/mo recurring | **+** |
| 5 (IoT) | ₹2–4L hardware (~55% subsidized) | Water/labor savings + better yield data | Break-even 3–6 mo |
| 6 (ML + Compliance) | Time + Whisper API fees | Premium pricing + subsidy catch-up | **++** |
| 7 (Worker App) | Time + WhatsApp fees | Retention of workers + differentiation | **+** |

Build in this order and each phase literally pays for the next.

---

## First week checklist

1. Run through `migration-guide.md` and verify you can sign in.
2. Seed your farm row (`farms`) with the 72-acre boundary GeoJSON.
3. Add 2 barns, 3 plots, 2 sheds manually via SQL or a small admin page.
4. Add your first 5 animals (Lakshmi, Ganga, Nandini, Parvati, Kamala).
5. Log 3 days of manual milk.
6. Log your first health event for Lakshmi.
7. Confirm withdrawal auto-quarantine works by logging a treatment.

If all of those work, Phase 1 is live.
