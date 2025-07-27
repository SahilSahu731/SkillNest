import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice';



// Create a root reducer to hold your application state
const rootReducer = combineReducers({
  auth: authReducer,
});

//persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

//create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is to ignore the non-serializable actions that redux-persist uses
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);