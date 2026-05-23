// Auth middleware shared across apps. Call from each app's middleware.ts.
// Refreshes the session cookie on every request so expired tokens don't leak through.
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from './types';

type CookieWrite = { name: string; value: string; options?: CookieOptions };

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: CookieWrite[]) => {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, supabase };
}

// Gate an app behind auth. Returns a redirect response if unauthorized.
export async function requireAuth(
  request: NextRequest,
  loginPath = '/login',
): Promise<{ response: NextResponse; user: NonNullable<Awaited<ReturnType<typeof updateSession>>['user']> } | NextResponse> {
  const { response, user } = await updateSession(request);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return { response, user };
}
