import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    assets: [],
    transactions: []
  }
};

export const tradeSlice = createSlice({
  name: 'trades',
  initialState: initialState,
  reducers: {
    setAssets: (state, action) => {
      state.value.assets = action.payload;
    },
    setAssetTransactions: (state, action) => {
      const assetId = action.payload.id;
      const transactions = action.payload.transactions;
      const transactionsCount = transactions.length;

      if (transactionsCount > 0) {
        const buy = transactions?.filter((t) => t.is_buy);
        const sell = transactions?.filter((t) => !t.is_buy);

        const amountPurchased = buy?.map((t) => t.amount).reduce((a, b) => a + b, 0);
        const amountSold = sell?.map((t) => t.amount).reduce((a, b) => a + b, 0);

        const totalFee = transactions?.map((t) => t.fee).reduce((a, b) => a + b, 0);
        const buyPriceUSD = buy?.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);
        const sellPriceUSD = sell?.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);

        const newTransaction = {
          // eslint-disable-next-line camelcase
          asset_id: assetId,
          amount: amountPurchased - amountSold,
          profit: sellPriceUSD - (buyPriceUSD + totalFee),
          // eslint-disable-next-line camelcase
          last_transaction: transactions[0].date,
          // eslint-disable-next-line camelcase
          buy_date: transactions[transactionsCount - 1].date,
          data: transactions
        };

        if (state.value.transactions) {
          const currentTransactions = [...state.value.transactions];
          const index = currentTransactions.map((t) => t.asset_id).indexOf(assetId);

          if (index === -1) {
            state.value.transactions = [...currentTransactions, newTransaction];
          } else {
            currentTransactions[index] = newTransaction;
            state.value.transactions = currentTransactions;
          }
        } else {
          state.value.transactions = [newTransaction];
        }
      }
    },
    clearAssets: (state, action) => {
      state.value = initialState;
    }
  }
});

export const { setAssets, setAssetTransactions, clearAssets } = tradeSlice.actions;
export default tradeSlice.reducer;
