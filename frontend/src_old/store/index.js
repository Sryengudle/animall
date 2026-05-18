import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import animalsReducer from './slices/animalsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    animals: animalsReducer,
    ui: uiReducer,
  },
});

export default store;
