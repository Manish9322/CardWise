'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // In a real app, you'd validate against a database
  if (email === 'admin@example.com' && password === 'password') {
    await createSession('admin-user');
    redirect('/admin');
  }

  return { error: 'Invalid credentials' };
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}
