// Supabase client for Server Components, Server Actions, Route Handlers.
// Reads/writes cookies via next/headers so session state stays in sync.
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

type CookieWrite = { name: string; value: string; options?: CookieOptions };

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: CookieWrite[]) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component where cookies() is read-only.
            // Safe to ignore — middleware will refresh the session.
          }
        },
      },
    },
  );
}

// Convenience: get the current authenticated user (or null) in one call.
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Convenience: get the current farm id by calling the RPC.
export async function getCurrentFarmId() {
  const supabase = await createClient();
  const { data } = await supabase.rpc('current_farm_id');
  return data ?? null;
}
