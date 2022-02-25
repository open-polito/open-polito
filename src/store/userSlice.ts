/**
 * @file Manages actions and state related to user data
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from 'open-polito-api/device';
import {getUnreadMail, PersonalData} from 'open-polito-api/user';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';

type UserData = {
  userInfo: PersonalData | null;
  unreadEmailCount: number;
};

type UserState = UserData & {
  getUnreadEmailCountStatus: Status;
};

const initialState: UserState = {
  userInfo: null,
  unreadEmailCount: 0,

  getUnreadEmailCountStatus: initialStatus,
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<PersonalData>) => {
      state.userInfo = action.payload;
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
      });
  },
});

export const {setUserInfo} = userSlice.actions;

export default userSlice.reducer;
