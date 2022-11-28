import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    profile: {},
    transfers: {
      start: null,
      end: null,
      data: [],
      holders: []
    }
  }
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload;
    },
    setTokenProfile: (state, action) => {
      state.value.profile = action.payload;
    },
    setTransfersStartDate: (state, action) => {
      state.value.transfers.start = action.payload;
    },
    setTransfersEndDate: (state, action) => {
      state.value.transfers.end = action.payload;
    },
    setTransfersData: (state, action) => {
      state.value.transfers.data = action.payload;
    },
    setTransfersHolders: (state, action) => {
      state.value.transfers.holders = action.payload;
    },
    resetToken: (state, action) => {
      state.value = initialState;
    }
  }
});

export const { 
  setToken, 
  setTokenProfile, 
  setTransfersStartDate, 
  setTransfersEndDate, 
  setTransfersData,
  setTransfersHolders,
  resetToken 
} = tokenSlice.actions;
export default tokenSlice.reducer;