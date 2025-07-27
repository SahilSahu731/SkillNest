import { configureStore } from '@reduxjs/toolkit';
// Import your slices here later
// import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // Add other slices here
  },
})