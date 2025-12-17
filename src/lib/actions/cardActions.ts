'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as db from '@/lib/db/mock-db';
import type { Card } from '@/lib/definitions';

export async function getActiveCards() {
  return await db.getCards(true);
}

export async function getAllCards() {
  return await db.getCards(false);
}

export async function getCard(id: string) {
  const card = await db.getCardById(id);
  if (!card) {
    throw new Error('Card not found');
  }
  return card;
}

export async function createCardAction(formData: FormData) {
  const data = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    status: (formData.get('status') as 'active' | 'inactive') || 'inactive',
  };

  await db.createCard(data);
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updateCardAction(id: string, formData: FormData) {
  const data = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    status: formData.get('status') as 'active' | 'inactive',
  };

  await db.updateCard(id, data);
  revalidatePath('/admin');
  revalidatePath(`/admin/cards/${id}/edit`);
  redirect('/admin');
}

export async function deleteCardAction(id: string) {
  await db.deleteCard(id);
  revalidatePath('/admin');
}
