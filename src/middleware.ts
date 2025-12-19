import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get('session')?.value;

  const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/profile');
  const isLoginPage = path === '/admin/login' || path === '/login';

  // If it's a protected route but not the login page itself
  if (isProtectedRoute && !isLoginPage) {
    if (!sessionCookie) {
      const url = req.nextUrl.clone();
      url.pathname = path.startsWith('/admin') ? '/admin/login' : '/login';
      return NextResponse.redirect(url);
    }

    try {
      const session = await decrypt(sessionCookie);
      if (!session?.userId) {
        throw new Error('Invalid session');
      }
    } catch (e) {
      const url = req.nextUrl.clone();
      url.pathname = path.startsWith('/admin') ? '/admin/login' : '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
