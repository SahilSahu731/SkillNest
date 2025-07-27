
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    user: null,
    token: null,
    isLoading: false,
    isError: false,
    message : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to set the loading state to true
    setLoading: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = '';
    },
    // Reducer to handle successful authentication
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    // Reducer to handle errors
    setError: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload; // Set the error message
      state.user = null;
    },
    // Reducer to handle logout
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
});

export const { setLoading, setCredentials, setError, logout } = authSlice.actions;

export default authSlice.reducer;