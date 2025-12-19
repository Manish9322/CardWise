import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
});

export const { setMaintenanceMode } = appSlice.actions;
export default appSlice.reducer;
