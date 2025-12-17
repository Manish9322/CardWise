import type { Card, User } from '@/lib/definitions';

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

let users: User[] = [
    {
        id: 'usr_1',
        username: 'Admin',
        email: 'admin@example.com',
        phone: '123-456-7890',
        questionsAdded: 5,
        status: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'usr_2',
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        phone: '098-765-4321',
        questionsAdded: 12,
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id: 'usr_3',
        username: 'JaneSmith',
        email: 'jane.smith@example.com',
        phone: '555-555-5555',
        questionsAdded: 0,
        status: 'inactive',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
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

// User-related functions
export async function getUsers(): Promise<User[]> {
  await delay(500);
  return users;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'questionsAdded'>): Promise<User> {
  await delay(500);
  const newUser: User = {
    ...data,
    id: `usr_${Date.now()}`,
    createdAt: new Date().toISOString(),
    questionsAdded: 0,
  };
  users = [newUser, ...users];
  return newUser;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    await delay(500);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return null;
    }
    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;
    return updatedUser;
}

export async function deleteUser(id: string): Promise<{ success: boolean }> {
    await delay(500);
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    return { success: users.length < initialLength };
}
