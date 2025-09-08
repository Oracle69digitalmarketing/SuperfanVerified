8import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducer — replace with actual slices
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add more slices here as your app grows
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: disable if you're using non-serializable data
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
