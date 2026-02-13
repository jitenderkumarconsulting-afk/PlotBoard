import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  user: {},
  accessToken: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.data.user
      state.accessToken = action.payload.data.access_token;
    },

    register(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload?.data.user;
      state.accessToken = action.payload?.data?.access_token;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.accessToken = "";
    },

    refreshToken(state, action) {
      state.accessToken = action.payload;
    },
    
    resetAuthState(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.accessToken = "";
    }
  },
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
