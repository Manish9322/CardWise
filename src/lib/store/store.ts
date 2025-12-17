import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/theme/themeSlice';
import cardsReducer from './features/cards/cardsSlice';
import authReducer from './features/auth/authSlice';
import { api } from '@/utils/services/api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      cards: cardsReducer,
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
