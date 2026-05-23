// Supabase client for Client Components ('use client').
// Singleton per module so we don't spin up a new socket on every render.
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { requireEnv } from './env';
import type { Database } from './types';

let _client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (_client) return _client;
  _client = createBrowserClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  );
  return _client;
}
