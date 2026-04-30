import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/members', '/admin'];
const sessionCookieCandidates = ['neon-auth.session', '__Secure-neon-auth.session', 'better-auth.session_token'];

function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function hasSessionCookie(req: NextRequest): boolean {
  return sessionCookieCandidates.some((cookieName) => req.cookies.has(cookieName));
}

export function middleware(req: NextRequest) {
  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (hasSessionCookie(req)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/members/:path*', '/admin/:path*'],
};
