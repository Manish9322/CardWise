import { type NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Authentication check is temporarily disabled.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
