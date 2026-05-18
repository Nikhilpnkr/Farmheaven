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
  const { response, user } = await updateSession(request);
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

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
