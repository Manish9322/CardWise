import type { Card } from '@/lib/definitions';

let cards: Card[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    answer: '4',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'What is the largest planet in our solar system?',
    answer: 'Jupiter',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'Who wrote "To Kill a Mockingbird"?',
    answer: 'Harper Lee',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'What is the powerhouse of the cell?',
    answer: 'Mitochondria',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCards(onlyActive = false): Promise<Card[]> {
  await delay(500);
  if (onlyActive) {
    return cards.filter(card => card.status === 'active');
  }
  return cards;
}

export async function getCardById(id: string): Promise<Card | undefined> {
  await delay(300);
  return cards.find(card => card.id === id);
}

export async function createCard(data: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
  await delay(500);
  const newCard: Card = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  cards = [newCard, ...cards];
  return newCard;
}

export async function updateCard(id: string, data: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<Card | null> {
  await delay(500);
  const cardIndex = cards.findIndex(card => card.id === id);
  if (cardIndex === -1) {
    return null;
  }
  const updatedCard = { ...cards[cardIndex], ...data };
  cards[cardIndex] = updatedCard;
  return updatedCard;
}

export async function deleteCard(id: string): Promise<{ success: boolean }> {
  await delay(500);
  const initialLength = cards.length;
  cards = cards.filter(card => card.id !== id);
  return { success: cards.length < initialLength };
}
