import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    data: null
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.value.data = action.payload;
    },
    logout: (state) => {
      state.value.data = null;
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
