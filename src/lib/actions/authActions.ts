'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import connectDB from '@/utils/db';
import User from '../../../models/user.model';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // This server action is now only for non-admin users.
  // Admin login is handled via a client-side call to /api/auth/login.

  try {
    // Connect to database for regular user login
    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return { error: 'Account is inactive. Please contact support.' };
    }
    
    // In a real app, you'd verify the hashed password here
    // For now, we're just checking if the user exists
    
    // Create session with user ID
    await createSession(user._id.toString());
    redirect('/profile');
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed. Please try again.' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
