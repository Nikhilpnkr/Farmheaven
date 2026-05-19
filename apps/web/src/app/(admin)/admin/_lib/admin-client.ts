// Central choke point for entering admin mode.
//
// Every page and server action under apps/web/src/app/(admin)/admin/
// MUST call assertSuperAdmin() BEFORE touching createAdminClient(). This
// gives us belt-and-suspenders with the middleware gate: even if middleware
// has a bug, the per-route assert refuses the request.
//
// The createAdminClient re-export is the ONLY allowed import path for the
// service-role client inside (admin)/. A CI check (scripts/check-admin-
// import-boundary.sh) fails the build if @farmheaven/db/admin is imported
// from anywhere outside (admin)/.

import 'server-only';
import { createClient } from '@farmheaven/db/server';

export { createAdminClient } from '@farmheaven/db/admin';

// supabase-js 2.105.x + @supabase/ssr 0.5.x have a known type-inference
// skew where `.from(...).select(...)` collapses to `never`. The query
// works at runtime; we cast to the expected shape after the error guard.
// Same pattern as apps/web/src/app/(app)/onboarding/actions.ts.
type ProfileLookupRow = { is_super_admin: boolean | null };

export async function assertSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('not_authenticated');
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();
  if (error) {
    throw new Error(`profile_lookup_failed: ${error.message}`);
  }
  const profile = data as ProfileLookupRow;
  if (!profile?.is_super_admin) {
    throw new Error('not_super_admin');
  }
  return user;
}
