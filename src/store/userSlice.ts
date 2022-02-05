/**
 * @file Manages actions and state related to user data
 */

import {
  createAsyncThunk,
  createSlice,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit';
import {Booking} from 'open-polito-api/booking';
import {CaricoDidattico} from 'open-polito-api/carico_didattico';
import Corso from 'open-polito-api/corso';
import {
  EsameProvvisorio,
  EsameSostenuto,
  Libretto,
} from 'open-polito-api/libretto';
import User, {Anagrafica} from 'open-polito-api/user';
import {CourseData, setCourseData} from './coursesSlice';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';

type UserData = {
  userInfo: Anagrafica | null;
  bookings: Booking[] | null;
  exams: {
    taken: EsameSostenuto[];
    temporary: EsameProvvisorio[];
  } | null;
  unreadEmailCount: number;
};

type UserState = UserData & {
  loadUserStatus: Status;
  getUnreadEmailCountStatus: Status;
};

const initialState: UserState = {
  userInfo: null,
  bookings: null,
  exams: null,
  unreadEmailCount: 0,

  loadUserStatus: initialStatus,
  getUnreadEmailCountStatus: initialStatus,
};

/**
 * Accepts {@link User} instance, dispatches {@link getUnreadEmailCount}
 * and calls {@link User.populate}, updating user data in the store.
 */
export const loadUser = createAsyncThunk<UserData, User, {state: RootState}>(
  'user/loadUser',
  async (user, {dispatch, getState}) => {
    await dispatch(getUnreadEmailCount(user));
    await user.populate();
    const userData: UserData = {
      userInfo: user.anagrafica,
      bookings: user.bookings,
      exams: {
        taken: user.libretto.materie,
        temporary: user.libretto.provvisori,
      },
      unreadEmailCount: getState().user.unreadEmailCount,
    };
    // Set course data
    // We can safely use initialStatus since at this point we haven't called loadCourse yet
    user.carico_didattico.corsi.forEach(corso =>
      dispatch(
        setCourseData({
          ...convertToCourseData(corso, true),
          loadCourseStatus: initialStatus,
        }),
      ),
    );
    user.carico_didattico.extra_courses.forEach(corso =>
      dispatch(
        setCourseData({
          ...convertToCourseData(corso, false),
          loadCourseStatus: initialStatus,
        }),
      ),
    );
    return userData;
  },
);

/**
 * Accepts {@link User} instance, calls {@link User.unreadMail} and updates the store.
 */
export const getUnreadEmailCount = createAsyncThunk<
  number,
  User,
  {state: RootState}
>('user/getUnreadEmailCount', async user => {
  const response = await user.unreadMail();
  return response.unread;
});

/**
 * Utility function to convert {@link Corso} to {@link Course} (only basic data)
 * @param corso Corso instance
 * @param isMain Whether the course is a main course or extra course
 * @returns Course object with basic data
 */
const convertToCourseData = (corso: Corso, isMain: boolean): CourseData => {
  const course: CourseData = {
    name: corso.nome,
    code: corso.codice,
    cfu: corso.cfu,
    taskID: corso.id_incarico,
    category: corso.categoria,
    overbooking: corso.overbooking,
    isMain: isMain,
  };
  return course;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Anagrafica>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadUser.pending, state => {
        state.loadUserStatus = pendingStatus();
      })
      .addCase(loadUser.fulfilled, (state, {payload}) => {
        Object.assign(state, payload);
        state.loadUserStatus = successStatus();
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loadUserStatus = errorStatus(action.error);
      })

      .addCase(getUnreadEmailCount.pending, state => {
        state.getUnreadEmailCountStatus = pendingStatus();
      })
      .addCase(getUnreadEmailCount.fulfilled, (state, {payload}) => {
        state.unreadEmailCount = payload;
        state.getUnreadEmailCountStatus = successStatus();
      })
      .addCase(getUnreadEmailCount.rejected, (state, action) => {
        state.getUnreadEmailCountStatus = errorStatus(action.error);
      });
  },
});

export const {setUserInfo} = userSlice.actions;

export default userSlice.reducer;
