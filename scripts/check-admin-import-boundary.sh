#!/usr/bin/env bash
# Fail if @farmheaven/db/admin (or createAdminClient) is imported from anywhere
# outside apps/web/src/app/(admin)/. The service-role key NEVER leaks into the
# user-app surface; this is a structural guard.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Search for any import of admin.ts outside the (admin) route group.
# Allowed locations:
#   apps/web/src/app/(admin)/**            — the admin route itself
#   packages/db/src/admin.ts               — the client lives here
#   packages/db/src/index.ts               — package barrel may re-export
#   scripts/check-admin-import-boundary.sh — this script
VIOLATIONS=$(
  grep -RIn --include='*.ts' --include='*.tsx' \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist \
    --exclude-dir=.turbo \
    -e "from '@farmheaven/db/admin'" \
    -e 'from "@farmheaven/db/admin"' \
    -e "createAdminClient" \
    apps/ packages/ 2>/dev/null \
    | grep -v "^apps/web/src/app/(admin)/" \
    | grep -v "^packages/db/src/admin.ts:" \
    | grep -v "^packages/db/src/index.ts:" \
    || true
)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ createAdminClient / @farmheaven/db/admin imported outside (admin)/ route:" >&2
  echo "$VIOLATIONS" >&2
  echo "" >&2
  echo "The service-role key bypasses RLS. Imports must stay inside" >&2
  echo "apps/web/src/app/(admin)/. If you need it elsewhere, that's a" >&2
  echo "design conversation, not a workaround." >&2
  exit 1
fi

echo "✓ admin import boundary clean"
