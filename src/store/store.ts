import {
  AnyAction,
  configureStore,
  Dispatch,
  ThunkDispatch,
} from '@reduxjs/toolkit';
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
export type AppDispatch = Dispatch<AnyAction> &
  ThunkDispatch<RootState, null, AnyAction>;

export default store;
