export type Card = {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  createdAt: string;
  // This is a placeholder as we don't have user data yet
  username?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  questionsAdded: number;
  status: 'active' | 'inactive';
  createdAt: string;
};
