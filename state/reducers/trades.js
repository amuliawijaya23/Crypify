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
    setAssetTransactions: (state, action) => {
      const assetId = action.payload.id;
      const currentAssets = [...state.value.assets];
      const index = currentAssets.map((a) => a.id).indexOf(assetId);
      currentAssets[index].transactions = action.payload.transactions;
    },
    clearAssets: (state, action) => {
      state.value = initialState;
    }
  }
});

export const { setAssets, setAssetTransactions, clearAssets } = tokenSlice.actions;
export default tokenSlice.reducer;
