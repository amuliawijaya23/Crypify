import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    assets: []
  }
};

export const tokenSlice = createSlice({
  name: 'trades',
  initialState: initialState,
  reducers: {
    setAssets: (state, action) => {
      state.value.assets = action.payload;
    },
    clearAssets: (state, action) => {
      state.value = initialState;
    }
  }
});

export const { setAssets, clearAssets } = tokenSlice.actions;
export default tokenSlice.reducer;
