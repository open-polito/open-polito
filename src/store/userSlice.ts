/**
 * @file Manages actions and state related to user data
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  Booking,
  BookingContext,
  getBookings,
  getContexts,
} from 'open-polito-api/booking';
import {Device} from 'open-polito-api/device';
import {getNotifications, Notification} from 'open-polito-api/notifications';
import {getUnreadMail, PersonalData} from 'open-polito-api/user';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  shouldWaitForCooldown,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';

export type UserState = {
  userInfo: PersonalData | null;

  unreadEmailCount: number;
  getUnreadEmailCountStatus: Status;

  notifications: Notification[];
  getNotificationsStatus: Status;

  bookings: Booking[];
  getBookingsStatus: Status;

  bookingContexts: BookingContext[];
  getBookingContextsStatus: Status;
};

const initialState: UserState = {
  userInfo: null,

  unreadEmailCount: 0,
  getUnreadEmailCountStatus: initialStatus(),

  notifications: [],
  getNotificationsStatus: initialStatus(),

  bookings: [],
  getBookingsStatus: initialStatus(),

  bookingContexts: [],
  getBookingContextsStatus: initialStatus(),
};

/**
 * Wrapper of {@link getUnreadMail}
 */
export const getUnreadEmailCount = createAsyncThunk<
  number,
  Device,
  {state: RootState}
>(
  'user/getUnreadEmailCount',
  async device => {
    const response = await getUnreadMail(device);
    return response.unread;
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().user.getUnreadEmailCountStatus, 10),
  },
);

/**
 * Wrapper of {@link getNotifications}
 */
export const getNotificationList = createAsyncThunk<
  Notification[],
  Device,
  {state: RootState}
>(
  'user/getNotificationList',
  async device => {
    const notifications = await getNotifications(device);
    return notifications.reverse();
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().user.getNotificationsStatus, 10),
  },
);

/**
 * Wrapper of {@link getBookings}
 */
export const getMyBookings = createAsyncThunk<
  Booking[],
  Device,
  {state: RootState}
>(
  'user/getMyBookings',
  async device => {
    const bookings = await getBookings(device);
    return bookings;
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().user.getBookingsStatus),
  },
);

/**
 * Wrapper of {@link getContexts}
 */
export const getBookingContexts = createAsyncThunk<
  BookingContext[],
  Device,
  {state: RootState}
>(
  'user/getBookingContexts',
  async device => {
    const contexts = await getContexts(device);
    return contexts;
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().user.getBookingContextsStatus),
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<PersonalData>) => {
      state.userInfo = action.payload;
    },
    setNotificationsStatus: (state, action: PayloadAction<Status>) => {
      state.getNotificationsStatus = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUnreadEmailCount.pending, state => {
        state.getUnreadEmailCountStatus = pendingStatus();
      })
      .addCase(getUnreadEmailCount.fulfilled, (state, {payload}) => {
        state.unreadEmailCount = payload;
        state.getUnreadEmailCountStatus = successStatus();
      })
      .addCase(getUnreadEmailCount.rejected, (state, action) => {
        state.getUnreadEmailCountStatus = errorStatus(action.error);
      })
      .addCase(getNotificationList.pending, state => {
        state.getNotificationsStatus = pendingStatus();
      })
      .addCase(getNotificationList.fulfilled, (state, {payload}) => {
        state.notifications = payload;
        state.getNotificationsStatus = successStatus();
      })
      .addCase(getNotificationList.rejected, (state, action) => {
        state.getNotificationsStatus = errorStatus(action.error);
      })
      .addCase(getMyBookings.pending, state => {
        state.getBookingsStatus = pendingStatus();
      })
      .addCase(getMyBookings.fulfilled, (state, {payload}) => {
        state.bookings = payload;
        state.getBookingsStatus = successStatus();
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.getNotificationsStatus = errorStatus(action.error);
      })
      .addCase(getBookingContexts.pending, state => {
        state.getBookingContextsStatus = pendingStatus();
      })
      .addCase(getBookingContexts.fulfilled, (state, {payload}) => {
        state.bookingContexts = payload;
        state.getBookingContextsStatus = successStatus();
      })
      .addCase(getBookingContexts.rejected, (state, action) => {
        state.getBookingContextsStatus = errorStatus(action.error);
      });
  },
});

export const {setUserInfo, setNotificationsStatus, setNotifications} =
  userSlice.actions;

export default userSlice.reducer;
