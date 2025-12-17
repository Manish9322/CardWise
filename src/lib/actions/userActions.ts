'use server';

import { revalidatePath } from 'next/cache';
import * as db from '@/lib/db/mock-db';

export async function getAllUsers() {
  return await db.getUsers();
}

export async function createUserAction(formData: FormData) {
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: (formData.get('status') as 'active' | 'inactive') || 'inactive',
  };
  await db.createUser(data);
  revalidatePath('/admin/manage-users');
}

export async function updateUserAction(id: string, formData: FormData) {
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: formData.get('status') as 'active' | 'inactive',
  };
  await db.updateUser(id, data);
  revalidatePath('/admin/manage-users');
}

export async function deleteUserAction(id: string) {
  await db.deleteUser(id);
  revalidatePath('/admin/manage-users');
}
