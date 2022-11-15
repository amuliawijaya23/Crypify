import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
  transfers: null
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setTokenProfile: (state, action) => {
      state.profile = action.payload;
    },
    setTokenTransfers: (state, action) => {
      state.transfers = action.payload;
    }
  }
});

export const { setTokenProfile, setTokenTransfers } = tokenSlice.actions;
export default tokenSlice.reducer;