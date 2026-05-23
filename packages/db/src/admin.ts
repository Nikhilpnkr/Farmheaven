// Service-role Supabase client. BYPASSES RLS. Never import into client code.
// Use only inside:
//   - Edge Functions
//   - Server Actions / Route Handlers that NEED to bypass RLS (rare: webhooks, admin ops)
//
// If you're reaching for this from a normal request, you probably want server.ts.

import { createClient as createPlain } from '@supabase/supabase-js';
import type { Database } from './types';

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. This client must never run in the browser.',
    );
  }
  return createPlain<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
