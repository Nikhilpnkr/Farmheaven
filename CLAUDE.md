# FarmHeaven — Project Rules for Claude Code

> Read this before touching code. These are non-negotiable.

## Current state (2026-05-23)

- **Workflow:** Direct-to-`main`, no feature branches, no PRs. See "Commit & main-line policy" below for the full rules. PR #1 was the final feature-branch PR before the cutover; it landed as merge commit `be65eb8`.
- **Shipped on `main`:** 3-app → 1-app collapse · Phase 0 (phone-OTP auth + onboarding via `bootstrap_farm` RPC) · Meadow theme + dual light/dark · Super-admin `/admin/[table]` browser · Phase 1A livestock registry · TDD-wired Sentry SDK across all 3 runtimes · TS strict (no `ignoreBuildErrors`) · app-router icon/apple-icon/opengraph-image · storefront 44px-tap-target hardening · hero-trust-strip redesign replacing emoji badges · CI workflow fixed (pnpm setup + supabase secret guard) · biome 0 errors across 128 files
- **Live:** `https://farmheaven-web-git-main-badgers-projects-c8635f3c.vercel.app` — Vercel deployment-protected, use the Vercel MCP `get_access_to_vercel_url` for a 23-hour bypass token. `farmheaven.in` not yet mapped.
- **Migrations applied:** 19 (`01_extensions` → `19_super_admin_column`)
- **Test suite:** 32 cases across 7 files, ~1.3s runtime
- **Vercel projects:** 1 active (`farmheaven-web`) · 3 zombies from pre-collapse (`farmheaven-console/storefront/worker`) that auto-cancel on every push — delete in dashboard when convenient
- **Design baseline:** B+ composite, B AI-slop. Full audit at `.design-audit/` (gitignored). FINDING-001 (14 tap targets), FINDING-003 (favicon/OG 404s), FINDING-004 (badge cluster) closed. **Still open:** FINDING-002 (`/login` phone input at 40px, needs `h-11`) — trivial; bundle into next storefront touch.
- **Next up:** Phase 1B per `C:\Users\pc\Downloads\FARMHEAVEN_BUILD_PLAN.md` — likely flocks or the unified `events` table.

## Stack

Single Next.js 15 app at `apps/web`, route groups: `(app)` farmer console, `(admin)` super-admin, `(storefront)` public customer site. pnpm + turborepo monorepo. React 19. TypeScript strict. Tailwind 3.4 + shadcn/ui. Supabase (raw `@supabase/ssr` client + generated types — **NO Drizzle**, despite what older docs say). React Hook Form + Zod. TanStack Query for client cache, nuqs for URL state. Biome for lint+format. Sentry for errors/tracing/replay. Razorpay for payments. date-fns for dates.

## Non-negotiables

### 1. Mobile-first, always

Every page must be designed at **375px first**, then scale up. The farmer logs milk on a phone in a cowshed; the customer scans a QR on a phone. Desktop is a side-effect of doing mobile right.

- **Tap targets**: minimum 44×44px (iOS HIG). Use shadcn `size="lg"` or `size="icon"` defaults; never go smaller than `h-10 w-10`.
- **No horizontal scroll** anywhere except intentional carousels. Verify at 375px and 320px.
- **Forms**: one column on mobile, two-column only ≥ `md:`. Inputs `text-base` minimum (prevents iOS zoom-on-focus). `inputMode` + `autoComplete` on every input (`numeric`, `decimal`, `tel`, `email`).
- **Tables**: never render raw `<table>` on mobile. Use card list at `< md`, table at `≥ md`. Build this as a shared pattern, not per-page.
- **Bottom safe area**: respect `env(safe-area-inset-bottom)` for sticky CTAs. Use `pb-[env(safe-area-inset-bottom)]` on fixed-bottom bars.
- **Sheet over Dialog** on mobile. shadcn `Sheet` with `side="bottom"` is the default modal pattern; `Dialog` only when content is < 1 viewport tall.
- **Sticky primary action**: any flow with > 1 input has its primary action sticky at the bottom on mobile.
- **Test on real viewport sizes**: 375 (iPhone SE), 390 (iPhone 14), 412 (Pixel 7), 768 (iPad). Don't skip 375.

### 2. Accessibility is a release blocker

- Every interactive element keyboard-reachable + visible `:focus-visible` ring (Tailwind `focus-visible:ring-2`).
- Forms: `<Label htmlFor>` on every input; errors announced via `aria-describedby` (shadcn `<FormMessage>` does this).
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI elements. Verify in both light and dark themes.
- Images: `alt` is required, not optional. Decorative → `alt=""`. Photo uploads → infer alt from filename or require caption.
- No color-only signaling — always pair with icon or text.

### 3. Performance budgets

Enforced via Lighthouse CI on every PR (set up if missing — see "Tooling to add").

- **LCP** ≤ 2.5s on mobile 4G (Lighthouse mobile preset).
- **INP** ≤ 200ms.
- **CLS** ≤ 0.1.
- **JS bundle per route** ≤ 200KB gzipped. If a route ships more, lazy-load with `next/dynamic`.
- **Images**: `next/image` only, never `<img>`. Always set `sizes`. Storefront product photos use `priority` only for above-fold.
- **Fonts**: `next/font` with `display: 'swap'`, subset to latin. No FOIT.
- **Server components by default**; client components only for interaction. Annotate `'use client'` reluctantly.
- **No `useEffect`-on-mount data fetching**. RSC + Server Actions, or TanStack Query with `staleTime`.

### 4. Testing — every PR

Vitest 3 is installed at `apps/web/` (config: [apps/web/vitest.config.ts](apps/web/vitest.config.ts)). Tests live in `apps/web/__tests__/` mirroring `src/`. Run via `pnpm test` (turbo) or `pnpm --filter @farmheaven/web test` directly.

- **Unit tests** (Vitest): every Zod schema, every pure util in `lib/`, every server action's validation branch. Examples in `apps/web/__tests__/lib/livestock/` and `apps/web/__tests__/app/livestock/`.
- **Integration tests** (Vitest + `@testing-library/react`): every form's happy path + one validation-error path. Needs `environment: 'jsdom'` per-file via `// @vitest-environment jsdom`.
- **E2E tests** (Playwright — not yet installed): the critical paths only — login, register animal, log milk, customer checkout, QR trace page. Run on mobile viewport (Pixel 7) in CI.
- **No mocking the DB**. Tests hit a Supabase branch DB (per [Supabase MCP `create_branch`](https://supabase.com/docs/guides/cli/branching)). Mocked DB tests are banned — they passed for us before while the real migration broke. Mocking module *shells* (e.g. `vi.mock('next/cache')` so a Node test can load a server action) is fine; mocking DB *responses* is not.
- **Coverage gate**: 70% statements on `lib/` and `actions/` (enforced in vitest.config.ts). UI components not coverage-gated (Playwright covers them visually).
- **No `it.skip` / `test.skip` in main**. If a test is broken, fix it or delete it; don't park it.

### 5. Type safety

- `tsc --noEmit` must pass. `next.config.ts` no longer has `ignoreBuildErrors` (cleared 2026-05-23) — TS errors fail the Vercel build too. No `// @ts-ignore` without a `// reason: ...` next line. `// @ts-expect-error` preferred.
- No `any`. Use `unknown` and narrow. Biome warns on `noExplicitAny` — keep it warning-clean.
- DB types are generated: `pnpm db:types`. Never hand-write a `Database` row type.
- Server action inputs are **always** parsed by a Zod schema before use. Never trust `FormData` directly.

### 6. Security

- **RLS on by default** for every table. New migrations that create a table MUST include policies in the same migration. CI rejects migrations that add a table without `enable row level security`. The `/supabase-migration` skill scaffolds + validates the policy block; the `rls-policy-reviewer` subagent audits a migration before commit.
- **`createAdminClient` (service role)** is locked to `app/(admin)/` by [scripts/check-admin-import-boundary.sh](scripts/check-admin-import-boundary.sh). This runs in CI AND on every Edit/Write via the post-edit hook (see `.claude/settings.json`) — leaks fail immediately, not on PR. Don't widen it.
- **No secrets in client bundles**. `NEXT_PUBLIC_*` is the only public prefix; everything else is server-only.
- **CSP + security headers** on every response (via `next.config.ts` headers). Storefront pages need stricter CSP than admin.
- **Input validation**: Zod at every server-action boundary, every API route, every webhook. Razorpay webhooks must verify HMAC signature.
- **PII minimization**: customer phone/email logged to Sentry only as `user.id`-style hashes, never raw.
- **Soft-delete only**, per build plan ground rules — `deleted_at` column, never `DELETE FROM`.

### 7. Observability

- **Sentry** is wired on `apps/web` via `@sentry/nextjs@^9.47` across all three runtimes (browser, Node server, Edge). Init files are unit-tested — see `apps/web/__tests__/instrumentation*.test.ts` and `sentry.{server,edge}.config.test.ts`. Sample rates: 100% traces in dev, 10% in prod; Session Replay 10% of sessions, 100% on errors; `enableLogs: true`; `sendDefaultPii: true`. Tunnel route is `/monitoring` (excluded from the middleware matcher). `next.config.ts` wraps with `withSentryConfig(withNextIntl(...))`.
- Server actions wrap errors with `Sentry.captureException` before rethrowing. Don't swallow.
- `app/global-error.tsx` calls `Sentry.captureException` in its `useEffect`. Don't remove that hook.
- **Structured logging**: server-side `console.log` is banned outside of `dev`. Use `lib/logger.ts` (add it if missing — `pino`).
- **Every user-facing error has a toast** (sonner) AND a Sentry event with breadcrumb context.
- Source maps are NOT yet uploaded to Sentry — production stack traces will be minified until `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` are set on the farmheaven-web Vercel project. See "Tooling to add".

### 8. SEO + storefront-readiness

- Storefront routes use `generateMetadata`. Title + description + canonical URL on every page. Default OG image inherits from `apps/web/src/app/opengraph-image.tsx` (1200×630 brand card via `ImageResponse`); override per-route by adding `opengraph-image.tsx` in that route's segment.
- Default site icons live at `apps/web/src/app/icon.tsx` (32×32) and `apple-icon.tsx` (180×180) — also `ImageResponse`-rendered, no PNG bytes in git. Killed 6 production 404s on 2026-05-23.
- `next-sitemap` auto-generates `sitemap.xml` on build. `/trace/[slug]` pages MUST be in the sitemap (they're the traffic funnel).
- `/trace/[slug]` renders fully SSR — no `'use client'` at the root, no Suspense fallbacks above the fold. JSON-LD `Product` + `Organization` structured data.
- robots.txt allows storefront + trace pages, disallows `(app)/*` and `(admin)/*`.

## Commands (verification gates)

Before claiming a task is done, every one of these must pass:

```bash
pnpm typecheck       # turbo across workspaces; gated since 2026-05-23
pnpm check           # biome lint + format check
pnpm test            # vitest run via turbo (32 tests, ~1.3s)
pnpm --filter @farmheaven/web build   # next build must succeed
bash scripts/check-admin-import-boundary.sh   # service-role boundary
pnpm e2e             # once playwright is installed; mobile viewport
```

For a UI change, also: invoke the `/mobile-viewport-check` skill (or the `mobile-a11y-reviewer` subagent for PR-grade audit). Both drive Chrome DevTools MCP through 375/390/412/768 viewports, assert no horizontal scroll, validate 44px tap targets, dump console errors.

## Claude Code automations (`.claude/`)

These are wired up and active. Files live in `.claude/` and are checked in.

- **Hooks** ([.claude/settings.json](.claude/settings.json)) — fire on every `Edit`/`Write`/`MultiEdit`:
  - `biome check --write apps/web/src packages` — autoformat + lint
  - `scripts/check-admin-import-boundary.sh` — block service-role leaks outside `(admin)/`
- **Skills** (`.claude/skills/`):
  - `mobile-viewport-check` — proactive after any UI edit; drives Chrome DevTools through 4 mobile viewports, screenshots + asserts.
  - `supabase-migration` — user-only (`/supabase-migration <slug>`); scaffolds migration with RLS+policies stubbed, validates on a Supabase branch.
- **Subagents** (`.claude/agents/`):
  - `rls-policy-reviewer` — auto-dispatched on migration edits; static analysis of every `CREATE TABLE` for RLS + policies + SECURITY DEFINER hygiene.
  - `mobile-a11y-reviewer` — invoke after a UI change with a running dev server; full axe-core scan + tap-target + font-size + horizontal-scroll audit at 375 and 412.

## Tooling to add (prod-readiness checklist)

Each is a small PR.

- [x] **Vitest** + `@testing-library/react` + jsdom. Config at [apps/web/vitest.config.ts](apps/web/vitest.config.ts), 70% coverage gate, 32 tests in `apps/web/__tests__/` (8 Sentry init + 24 livestock). (Done 2026-05-23.)
- [ ] **Playwright** with mobile project (Pixel 7) + desktop project. Smoke suite covers login, register animal, log milk, checkout, trace page. CI runs on PR.
- [ ] **Lighthouse CI** GitHub Action on every PR. Mobile preset. Budget file in `.lighthouserc.json`. Hard-fail thresholds: LCP 2.5s, INP 200ms, CLS 0.1.
- [ ] **`@axe-core/playwright`** integration — every E2E test ends with `await checkA11y(page)`. Zero serious/critical issues.
- [ ] **`@next/bundle-analyzer`** behind `ANALYZE=true`. Add `pnpm analyze` script. Review on every dependency change.
- [ ] **Sentry source maps**: `withSentryConfig` in `apps/web/next.config.ts` is wired to upload but no auth token is set. Generate one at sentry.io/settings/auth-tokens with `project:releases` + `org:read` scopes, then set `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` on the farmheaven-web Vercel project. Without these, production stack traces stay minified.
- [ ] **PostHog** (or alternative) for product analytics — events for: animal registered, milk logged, product added to cart, checkout completed, QR scanned. Opt-out for storefront customers.
- [ ] **`@vercel/og` per-route dynamic OG images** on `/product/[slug]` and `/trace/[slug]` — the infrastructure (`next/og` `ImageResponse`) is proven via `apps/web/src/app/opengraph-image.tsx`; remaining work is the per-route variants that pull product/animal data into the card.
- [ ] **CSP middleware** with nonce-based script-src. Strict on `(storefront)`, looser on `(app)` if needed.
- [ ] **Renovate or Dependabot** weekly grouped PRs for deps.
- [ ] **`pnpm audit --prod`** as a CI step; fail on high/critical.
- [ ] **Backup automation**: Supabase point-in-time recovery enabled; verify retention ≥ 7 days.
- [ ] **Error budget**: Sentry release-tracking + alert if error rate > 1% of sessions.
- [ ] **Status page** stub (`/status` route reading from Supabase health + Vercel API).
- [ ] **Razorpay webhook signature verification** test cases (replay attack, bad signature, late delivery).

## Commit & main-line policy

Solo developer. **Work happens directly on `main`. Do not create feature branches.**

- **No feature branches.** Don't run `git checkout -b`. Don't open PRs against `main`. The PR-review surface exists for collaboration; with one dev there's no one on the other side of the review. Skip the ceremony.
- **`git push origin main` IS the deploy command.** Vercel ships every push to production. If the build is red, prod is red. Read this twice.
- **Verify before push, always.** Without a preview-build gate, the gates only catch breakage after it's already in main. Run the verification gates locally before every push. Anything more involved than a docs change should also get a `pnpm --filter @farmheaven/web build` locally first.
- **Atomic commits stay the discipline.** One logical change per commit, small commits over huge ones. The value is reversibility (`git revert <sha>`), not diff-review.
- **Hotfix = revert.** When something breaks production: `git revert <bad-sha> && git push`. No branch needed.
- **Conventional Commits.** `feat(scope): …`, `fix(scope): …`, `chore(scope): …`, `docs(scope): …`. Scope mirrors module: `livestock`, `admin`, `storefront`, `auth`, `db`, `ci`, `deps`, etc.
- **Commit body uses the audit format** since there's no PR body: **What**, **Why**, **Verification** (which gates passed, which viewports tested for UI, before/after for design fixes). Past commits like `ff9399f`, `2865798`, `49ebb05` set the bar.
- **Author**: Nikhilpnkr only. **Never** add a Claude `Co-Authored-By` trailer on any commit or doc. Drop the Anthropic mention from templates.
- **Parallel-session coordination.** Multiple Claude sessions may run against this repo at once. Before any push, `git pull --rebase origin main` to fold in concurrent work. If a push is rejected as non-fast-forward, rebase locally and push again. Never force-push to `main`.
- **Internal subagent worktrees are exempt.** The Claude Agent SDK creates temporary worktree-branches for `Explore` / `Plan` / `code-reviewer` agents and cleans them up after the run. Those are isolation primitives, not user-facing branches — the no-branches rule doesn't apply to them.

## Project-specific conventions

- **Single farm, single tenant.** No `tenant_id`. Queries assume one farm (set at onboarding).
- **Two auth realms**: farm staff (`profiles` table) and customers (`customers` table). Never mix.
- **Server components by default**; `'use client'` only for stateful interaction.
- **Money** = integer paise (₹1.00 = 100). Never floats. Display via formatter, never raw.
- **Dates** = `timestamptz` UTC, displayed in `Asia/Kolkata`. Use `date-fns-tz` helpers in `lib/date.ts`.
- **Photos**: Supabase Storage at `farm-media/{entity_type}/{entity_id}/{uuid}.{ext}`. Public bucket for storefront, private for internal. Use `next/image` with the Supabase loader.
- **Every list view** supports filter + search + sort, URL-driven via `nuqs`.
- **Every form** is RHF + Zod, schemas in `apps/web/src/lib/<module>/schemas.ts`.
- **Server actions over API routes** for mutations. API routes only for webhooks and cron.
- **Build plan**: canonical source at `C:\Users\pc\Downloads\FARMHEAVEN_BUILD_PLAN.md`. v2 plan mentions Drizzle — ignore that part; real schema is the 19-migration Supabase one.

## What NOT to build (parking lot)

Per the v2 plan: no subscriptions, no IoT/MQTT, no multi-tenant, no offline-PWA, no native app, no AI/Whisper features, no Telugu/Hindi i18n (English only in v1), no multi-vendor marketplace, no cold-chain, no map view, no real-time WebSockets (polling is fine). If you find yourself wanting one of these, stop.
