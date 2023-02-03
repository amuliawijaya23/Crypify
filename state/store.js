import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import pool from './reducers/pool';
import user from './reducers/user';
import trades from './reducers/trades';

export const store = configureStore({
  reducer: {
    user: user,
    pool: pool,
    trades: trades
  }
});

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
