import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Card } from '@/lib/definitions';

type CardsState = {
  cards: Card[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: CardsState = {
  cards: [],
  currentIndex: 0,
  isLoading: true,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
      state.currentIndex = 0;
      state.isLoading = false;
      state.error = null;
    },
    nextCard: (state) => {
      if (state.cards.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.cards.length;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  },
});

export const { setCards, nextCard, setLoading, setError } = cardsSlice.actions;
export default cardsSlice.reducer;
