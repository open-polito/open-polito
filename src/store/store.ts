import {configureStore, createReducer} from '@reduxjs/toolkit';
import coursesSlice from './coursesSlice';
import examsSlice from './examsSlice';
import sessionSlice from './sessionSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    session: sessionSlice,
    user: userSlice,
    courses: coursesSlice,
    exams: examsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
