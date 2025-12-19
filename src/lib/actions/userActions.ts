'use server';

import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/definitions';

export async function getAllUsers(): Promise<User[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch users:', response.statusText);
      return [];
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function createUserAction(formData: FormData) {
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: (formData.get('status') as 'active' | 'inactive') || 'inactive',
  };
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    revalidatePath('/admin/manage-users');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: formData.get('status') as 'active' | 'inactive',
  };
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    revalidatePath('/admin/manage-users');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUserAction(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }

    revalidatePath('/admin/manage-users');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
