# Team Management — Parked Brainstorm

**Status:** Brainstorm paused mid-design (4 of 6 sections approved) to prioritize
super_admin. Resume after super_admin ships.

**Date paused:** 2026-05-18

## Decisions locked in clarifying-questions phase

1. **Invite mechanism:** phone-match on first signup. Owner enters teammate's
   phone + role. Pre-create a `pending_memberships` row. When that phone signs
   in via OTP for the first time, a trigger attaches the existing membership.
2. **Permissions:** owner-only manages the team. Managers do not get the team
   page in MVP. (RLS will be tightened from owner+manager → owner only.)
3. **Scoping depth:** role only. Defer `scoped_animal_ids` and `scoped_module`
   to the vet-workspace feature (build-plan Phase 3).
4. **Acceptance flow:** auto-accept on first OTP sign-in. No interstitial
   screen. Owner's WhatsApp message IS the consent. Mitigation for typo-on-
   owner-side: deactivate-in-one-click from the team page.
5. **Pending model:** separate `pending_memberships` table. Keep `memberships`
   semantically clean ("settled" team only).

## Design sections approved (4 of 6)

### Section 1 — Data model

- New table `public.pending_memberships(id, farm_id, phone, role, invited_by,
  invited_at, unique(farm_id, phone))`. Index on `phone`.
- New trigger `claim_pending_memberships` on `auth.users` AFTER INSERT, runs
  after `handle_new_user`. SECURITY DEFINER, `search_path=public,auth`. Loops
  pending rows for the new phone, inserts real memberships
  (is_active=true, accepted_at=now()), deletes pending rows.
- Phone normalization: strip everything except digits, match the existing
  `auth.users.phone` format (e.g. `919573299175`).

### Section 2 — RPCs

All SECURITY DEFINER, `grant execute to authenticated`:

- `invite_teammate(_farm_id, _phone, _role)` — owner-only gate. Normalizes
  phone. Rejects already-member / already-invited. If phone is an existing
  `auth.users` row, INSERT into `memberships` directly (skip pending step).
- `change_member_role(_membership_id, _new_role)` — owner-only gate. Blocks
  `cannot_change_self` and `last_owner`.
- `deactivate_teammate(_membership_id)` — owner-only gate. Blocks
  `cannot_deactivate_self` and `last_owner`. Soft-delete (is_active=false).
- `cancel_pending_invite(_pending_id)` — owner-only gate. Hard DELETE.

### Section 3 — RLS tightening

- Drop and recreate `memberships_owner_write` to require `role='owner'`
  (currently allows owner+manager). Defense in depth: RPCs are SECURITY
  DEFINER so they bypass this anyway, but direct PostgREST calls must not.
- Enable RLS on `pending_memberships`. Add `owner_read` and `owner_write`
  policies gated by `is_member(farm_id, ['owner'])`. Protects PII (phones).

### Section 4 — Routes + UI

- New route `apps/web/src/app/(app)/settings/team/` with `page.tsx`,
  `actions.ts`, `team-table.tsx`, `invite-form.tsx`. New
  `(app)/settings/layout.tsx` as a tab shell for future settings tabs.
- Server gate in `page.tsx`: if caller role ≠ 'owner', render restricted
  state instead of the table.
- Page layout: card with "Team" header, `[+ Invite]` button top-right,
  table of (Name, Phone, Role, Status, ⋯). Pending rows have name "—" and
  a yellow `Pending` badge. Owner's own row is annotated `(you)` and has
  no row menu (matches RPC `cannot_change_self` rail).
- Invite dialog: `+91`-prefixed phone input, role select (5 options —
  excludes 'owner' for MVP), submit → toast → revalidate.
- Add "Settings" item to `packages/ui/src/components/app/sidebar.tsx`.
- No new shadcn components needed (Phase 0 commit covers all required
  primitives).

## Sections NOT yet drafted

- **Section 5 — Edge cases + safety rails:** last-owner protection (RPC
  raises, UI hides), self-edit blocking, phone format validation, pending-
  invite expiry policy (do we expire after N days?), what happens if a
  pending phone is invited to two farms (loop trigger claims both), what
  happens if invited_by is later deactivated (FK on profiles).
- **Section 6 — Out of scope:** vet scoping (animal multi-select),
  manager-can-edit, role audit log entries, "leave farm" self-service,
  re-activate-deactivated-member, super_admin (covered separately).

## When resuming

Start by re-reading this doc, re-confirming the locked decisions with the
user (in case anything shifted), then jump straight to drafting Sections 5
and 6. The data model, RPC list, RLS plan, and UI layout are all ready —
no need to re-litigate.
