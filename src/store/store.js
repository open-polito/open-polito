import {configureStore} from '@reduxjs/toolkit';
import sessionSlice from './sessionSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    session: sessionSlice,
    ui: uiSlice,
  },
});
