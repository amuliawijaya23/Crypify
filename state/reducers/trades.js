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
    }
  }
});

export const { setAssets } = tokenSlice.actions;
export default tokenSlice.reducer;
