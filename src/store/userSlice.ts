/**
 * @file Manages actions and state related to user data
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from 'open-polito-api/device';
import {getNotifications, Notification} from 'open-polito-api/notifications';
import {getUnreadMail, PersonalData} from 'open-polito-api/user';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
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
};

const initialState: UserState = {
  userInfo: null,

  unreadEmailCount: 0,
  getUnreadEmailCountStatus: initialStatus,

  notifications: [],
  getNotificationsStatus: initialStatus,
};

/**
 * Wrapper of {@link getUnreadMail}
 */
export const getUnreadEmailCount = createAsyncThunk<
  number,
  Device,
  {state: RootState}
>('user/getUnreadEmailCount', async device => {
  const response = await getUnreadMail(device);
  return response.unread;
});

/**
 * Wrapper of {@link getNotifications}
 */
export const getNotificationList = createAsyncThunk<
  Notification[],
  Device,
  {state: RootState}
>('user/getNotifications', async device => {
  const notifications = await getNotifications(device);
  return notifications.reverse();
});

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
      });
  },
});

export const {setUserInfo, setNotificationsStatus, setNotifications} =
  userSlice.actions;

export default userSlice.reducer;
