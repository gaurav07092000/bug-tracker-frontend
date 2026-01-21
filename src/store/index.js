import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import projectSlice from './slices/projectSlice';
import ticketSlice from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    tickets: ticketSlice,
  },
});