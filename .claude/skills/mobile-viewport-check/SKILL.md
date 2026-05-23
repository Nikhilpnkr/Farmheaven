---
name: mobile-viewport-check
description: Use proactively after any UI change in apps/web (new page, new component, layout edit, Tailwind class change). Drives chrome-devtools-mcp through four viewports — 375 (iPhone SE), 390 (iPhone 14), 412 (Pixel 7), 768 (iPad) — screenshots each, asserts no horizontal scroll, validates tap targets ≥44px, dumps console errors. Required gate per CLAUDE.md mobile-first rules before claiming any UI task done.
---

# Mobile Viewport Check

FarmHeaven's CLAUDE.md treats mobile-first as a release blocker, not a guideline. This skill turns that prose into a runnable check.

## When to invoke

- Right after editing any `*.tsx` under `apps/web/src/app/(app)/`, `apps/web/src/app/(storefront)/`, or `apps/web/src/app/(admin)/`.
- Right after editing any component in `apps/web/src/components/` or `packages/ui/src/components/`.
- Right after a Tailwind config or `globals.css` change.
- Before claiming any UI task complete.

Skip when: only `lib/`, `actions.ts`, migrations, or test files changed.

## Prerequisites

- Dev server running: `pnpm --filter @farmheaven/web dev` (port 3000).
- Chrome DevTools MCP available (tools prefixed `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`). If missing, fall back to Playwright MCP (`mcp__plugin_playwright_playwright__*`) with the same flow.

## Procedure

For each viewport in the matrix below, in order:

| Device          | Width | Height | DPR  |
| --------------- | ----- | ------ | ---- |
| iPhone SE       | 375   | 667    | 2    |
| iPhone 14       | 390   | 844    | 3    |
| Pixel 7         | 412   | 915    | 2.625 |
| iPad (portrait) | 768   | 1024   | 2    |

1. `resize_page` to the viewport dimensions.
2. `navigate_page` to the route under test (e.g. `http://localhost:3000/livestock`).
3. `wait_for` network idle or a known DOM marker.
4. `take_screenshot` — full page.
5. `evaluate_script`:
   - **Horizontal-scroll check** — `document.documentElement.scrollWidth > document.documentElement.clientWidth + 1`. Must be `false`.
   - **Tap-target audit** — query every `button, a, [role="button"], input[type="checkbox"], input[type="radio"]`; collect any element where `getBoundingClientRect()` width < 44 OR height < 44. Empty array = pass.
   - **Font-size sanity** — query every `input, textarea, select`; flag any with computed `font-size < 16px` (iOS zoom-on-focus trigger).
6. `list_console_messages` — filter to `error` and `warning` severities; report any.

## Reporting

Produce a structured report:

```
mobile-viewport-check: <route>
─ 375×667 (iPhone SE)     PASS ✓  | screenshot: <path>
─ 390×844 (iPhone 14)     PASS ✓  | screenshot: <path>
─ 412×915 (Pixel 7)       FAIL ✗  | horizontal scroll detected (scrollWidth=440)
                                 | screenshot: <path>
─ 768×1024 (iPad)         PASS ✓  | screenshot: <path>

Tap-target failures:
  - <button class="...">  16×16  (Pixel 7)
Font-size failures:
  - <input id="tag">      14px   (all viewports)
Console:
  - [error] Hydration mismatch on /livestock (iPhone SE)
```

If any viewport fails ANY of the three asserts, the overall result is FAIL and the UI task is not complete. Fix the code, re-run the skill, screenshot the fix.

## Conventions

- Always test the **route the user touched**, not just `/`. Ask if uncertain.
- For routes behind auth, set the session cookie before navigating (see `apps/web/__tests__/` for an example login flow once the e2e suite exists).
- Keep screenshots in `/tmp/mobile-check-<timestamp>/` so they don't pollute the repo. Reference paths in the report; don't paste images inline.
- If the dev server isn't running, start it in the background (`pnpm --filter @farmheaven/web dev`) and `wait_for` `http://localhost:3000` to respond before navigating.

## Why these viewports

- **375** is the iPhone SE — the smallest modern phone still in active use. If it works here, it works.
- **390** and **412** are iPhone 14 / Pixel 7 — the bulk of real traffic.
- **768** is the iPad breakpoint where Tailwind's `md:` kicks in — catches the transition bugs.

Desktop (≥1024) is intentionally not part of this skill. Desktop is a side-effect of doing mobile right; failures there are usually cosmetic, not blocking.

## Edge cases

- **Sticky-bottom bars + iOS safe area**: at 375×667 simulate `env(safe-area-inset-bottom)` is non-zero. Check the bar doesn't overlap the home-indicator zone.
- **Sheets**: open the primary Sheet on the page and re-run the asserts inside the sheet — a sheet that scrolls horizontally is worse than a page that does.
- **Forms with focused inputs**: scroll the input into view and verify the on-screen keyboard hint doesn't trigger horizontal layout shift.

## Related

- CLAUDE.md → "Non-negotiables → Mobile-first, always"
- Future skill: `mobile-a11y-reviewer` subagent runs axe-core alongside this check
