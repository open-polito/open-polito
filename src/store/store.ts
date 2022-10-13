import {
  AnyAction,
  combineReducers,
  configureStore,
  Dispatch,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import coursesSlice from './coursesSlice';
import examsSlice from './examsSlice';
import sessionSlice from './sessionSlice';
import userSlice from './userSlice';

const reducer = persistReducer(
  {key: 'root', storage: AsyncStorage, whitelist: ['exams', 'courses', 'user']},
  combineReducers({
    session: sessionSlice,
    user: userSlice,
    courses: coursesSlice,
    exams: examsSlice,
  }),
);

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = Dispatch<AnyAction> &
  ThunkDispatch<RootState, null, AnyAction>;

export default store;
export const persistor = persistStore(store);
