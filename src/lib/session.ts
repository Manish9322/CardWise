import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ userId, expires });

  (await cookies()).set('session', session, { expires, httpOnly: true });
}


export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value || null;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 60 * 60 * 1000);
    const res = await encrypt(parsed);
    
    const response = request.nextUrl.pathname.startsWith('/admin') 
      ? NextResponse.next() 
      : NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
      
    response.cookies.set({
      name: 'session',
      value: res,
      httpOnly: true,
      expires: parsed.expires,
    });
    return response;
}
