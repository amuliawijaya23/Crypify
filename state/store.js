import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import token from "./reducers/token";
import user from "./reducers/user";

export const store = configureStore({
  reducer: {
    user: user,
    token: token
  }
});

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);