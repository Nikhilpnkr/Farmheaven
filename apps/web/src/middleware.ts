import { updateSession } from '@farmheaven/db/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Public storefront paths — accessible without auth. Add new public routes here.
// Note: '/' is the storefront marketing home (also public).
const PUBLIC_PREFIXES = [
  '/shop',
  '/product',
  '/trace',
  '/cart',
  '/checkout',
  '/privacy',
  '/terms',
  '/grievance',
  '/data-request',
  '/subscribe',
  '/meet-the-farm',
  '/traceability',
  '/farm-tour',
  '/contact',
];

const AUTH_PREFIXES = ['/login', '/auth/callback'];

function startsWith(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isStorefront = pathname === '/' || startsWith(pathname, PUBLIC_PREFIXES);
  const isAuthRoute = startsWith(pathname, AUTH_PREFIXES);

  // Authenticated user landing on /login → bounce to operator dashboard.
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Storefront and auth routes are always accessible.
  if (isStorefront || isAuthRoute) {
    return response;
  }

  // Everything else is operator-protected.
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // /admin/* requires profiles.is_super_admin. 404 (not 403) so the route's
  // existence isn't disclosed to non-admins. RLS allows users to read their
  // own profile row via profiles_self_read, so no service-role here.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Cast around supabase-js 2.105.x + @supabase/ssr 0.5.x version-skew
    // type inference defect on .select(); see admin-client.ts for the same pattern.
    type ProfileLookupRow = { is_super_admin: boolean | null };
    const { data } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();
    const profile = data as ProfileLookupRow | null;
    if (!profile?.is_super_admin) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
