import { createSlice } from "@reduxjs/toolkit";

// import from Date-fns
import startOfDay from 'date-fns/startOfDay';
import getUnixTime from 'date-fns/getUnixTime';

const initialState = {
  profile: {},
  transfers: {
    start: null,
    end: null,
    data: []
  }
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setTokenProfile: (state, action) => {
      state.profile = action.payload;
    },
    setTransfersStartDate: (state, action) => {
      state.transfers.start = action.payload;
    },
    setTransfersEndDate: (state, action) => {
      state.transfers.end = action.payload;
    },
    setTransfersData: (state, action) => {
      state.transfers.data = action.payload;
    },
  }
});

export const { setTokenProfile, setTransfersStartDate, setTransfersEndDate, setTransfersData } = tokenSlice.actions;
export default tokenSlice.reducer;