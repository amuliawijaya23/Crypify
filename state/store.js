import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import pool from "./reducers/pool";
import user from "./reducers/user";

export const store = configureStore({
  reducer: {
    user: user,
    pool: pool
  }
});

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);