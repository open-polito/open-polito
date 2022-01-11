import {configureStore} from '@reduxjs/toolkit';
import emailSlice from './emailSlice';
import materialSlice from './materialSlice';
import sessionSlice from './sessionSlice';
import uiSlice from './uiSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    session: sessionSlice,
    ui: uiSlice,
    email: emailSlice,
    user: userSlice,
    material: materialSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
