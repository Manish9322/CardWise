'use server';

import { revalidatePath } from 'next/cache';
import type { Card } from '@/lib/definitions';

// Fetch cards from the API route
export async function getActiveCards(): Promise<Card[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch active cards:', response.statusText);
      return [];
    }

    const allQuestions = await response.json();
    
    // Filter only active cards
    const activeCards = allQuestions.filter((card: Card) => card.status === 'active');
    
    return activeCards;
  } catch (error) {
    console.error('Error fetching active cards:', error);
    return [];
  }
}

export async function getAllCards(): Promise<Card[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch all cards:', response.statusText);
      return [];
    }

    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error('Error fetching all cards:', error);
    return [];
  }
}

export async function getCard(id: string): Promise<Card> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Card not found');
    }

    const card = await response.json();
    return card;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw new Error('Card not found');
  }
}

export async function createCardAction(formData: FormData) {
  const data = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    status: (formData.get('status') as 'active' | 'inactive') || 'inactive',
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create card');
    }

    revalidatePath('/admin');
    revalidatePath('/admin/manage-questions');
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
}

export async function updateCardAction(id: string, formData: FormData) {
  const data = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    status: formData.get('status') as 'active' | 'inactive',
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update card');
    }

    revalidatePath('/admin');
    revalidatePath('/admin/manage-questions');
    revalidatePath(`/admin/cards/${id}/edit`);
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
}

export async function deleteCardAction(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete card');
    }

    revalidatePath('/admin');
    revalidatePath('/admin/manage-questions');
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
}
