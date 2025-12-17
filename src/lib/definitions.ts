export type Card = {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  createdAt: string;
  // This is a placeholder as we don't have user data yet
  username?: string;
};
