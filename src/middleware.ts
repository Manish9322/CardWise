import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get('session')?.value;

  // For both admin and profile routes, check for a valid session
  if (path.startsWith('/admin') || path.startsWith('/profile')) {
    if (!sessionCookie) {
      const url = req.nextUrl.clone();
      url.pathname = path.startsWith('/admin') ? '/admin/login' : '/login';
      return NextResponse.redirect(url);
    }

    try {
      // Decrypt the session to ensure it's valid
      const session = await decrypt(sessionCookie);
      if (!session?.userId) {
        throw new Error('Invalid session');
      }
    } catch (e) {
      // If decryption fails or session is invalid, redirect to the appropriate login page
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
