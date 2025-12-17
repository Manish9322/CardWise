import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/admin'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route) && path !== '/admin/login');

  if (isProtectedRoute) {
    const cookie = req.cookies.get('session');
    if (!cookie) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }

    const session = await decrypt(cookie.value);
    if (!session?.userId) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
