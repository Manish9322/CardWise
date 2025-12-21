
export type Card = {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  userId?: string | null;
  username?: string;
  userEmail?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  questionsAdded: number;
  activeQuestions?: number;
  status: 'active' | 'inactive';
  createdAt: string;
};
