'use server';

import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

export async function logout(redirectTo: string = '/login') {
  await deleteSession();
  redirect(redirectTo);
}
