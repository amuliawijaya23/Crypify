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
  name: 'pool',
  initialState: initialState,
  reducers: {
    setPool: (state, action) => {
      state.value = action.payload;
    },
    setPoolProfile: (state, action) => {
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
    resetPool: (state, action) => {
      state.value = initialState;
    }
  }
});

export const { 
  setPool, 
  setPoolProfile, 
  setTransfersStartDate, 
  setTransfersEndDate, 
  setTransfersData,
  setTransfersHolders,
  resetPool 
} = tokenSlice.actions;
export default tokenSlice.reducer;