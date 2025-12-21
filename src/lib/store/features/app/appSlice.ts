
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/utils/services/api';

type AppState = {
  isMaintenanceMode: boolean;
};

const initialState: AppState = {
  isMaintenanceMode: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMaintenanceMode: (state, action: PayloadAction<boolean>) => {
      state.isMaintenanceMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getSettings.matchFulfilled,
      (state, { payload }) => {
        state.isMaintenanceMode = payload.isMaintenanceMode;
      }
    )
  },
});

export const { setMaintenanceMode } = appSlice.actions;
export default appSlice.reducer;
