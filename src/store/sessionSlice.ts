/**
 * @file Manages actions and state related to login, logout and device registration
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getDeviceData} from '../utils/api-utils';
import {
  AuthStatus,
  AUTH_STATUS,
  errorStatus,
  initialStatus,
  pendingStatus,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';
import {Device} from 'open-polito-api/lib/device';
import defaultConfig, {Configuration} from '../defaultConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ping} from 'open-polito-api/lib/utils';
import {v4 as UUIDv4} from 'uuid';
import {setUserInfo} from './userSlice';
import {clearCredentials, getCredentials, saveCredentials} from '../utils/fs';
import {genericPlatform} from '../utils/platform';

export type ToastData = {
  visible: boolean;
  message: string;
  type: 'info' | 'success' | 'warn' | 'err';
  icon?: string;
};

export type LoginData = {
  user: string;
  uuid: string;
};

export type SessionState = {
  authStatus: AuthStatus;

  deviceRegisterStatus: Status;

  loginStatus: Status;
  loginData?: LoginData;

  logoutStatus: Status;

  config: Configuration;

  toast: ToastData;
};

const initialState: SessionState = {
  authStatus: AUTH_STATUS.PENDING,

  deviceRegisterStatus: initialStatus(),

  loginStatus: initialStatus(),
  loginData: undefined,

  logoutStatus: initialStatus(),

  config: defaultConfig,

  toast: {
    visible: false,
    message: '',
    type: 'info',
    icon: '',
  },
};

/**
 * Given {@link Device}, calls {@link Device.register}.
 *
 * @remarks
 * Call this only before logging in with password.
 */
export const registerDevice = createAsyncThunk<
  void,
  Device,
  {state: RootState}
>('session/registerDevice', async device => {
  const deviceData = getDeviceData();
  await device.register(deviceData);
});

/**
 * Logs in, with token or password.
 * If with token, fetches credentials from Keychain/AsyncStorage.
 * If with password, uses provided username and password.
 *
 * @remarks
 * When given "password" as login method, dispatches {@link registerDevice}.
 * Always pings PoliTo servers before logging in, to detect offline mode.
 *
 * On login success, sets Keychain credentials and dispatches {@link setUserInfo}.
 */
export const login = createAsyncThunk<
  LoginData,
  (
    | {method: 'token'}
    | {
        method: 'password';
        username: string;
        password: string;
      }
  ) & {device: Device},
  {state: RootState}
>('session/login', async (args, {dispatch, getState, rejectWithValue}) => {
  try {
    let response;
    switch (args.method) {
      case 'token':
        const savedCredentials = await getCredentials();
        if (!savedCredentials) {
          throw new Error();
        }
        const {username, password} = savedCredentials;
        const {uuid, token} = JSON.parse(password);
        args.device.uuid = uuid;
        response = await args.device.loginWithToken(username, token);
        break;
      case 'password':
        const new_uuid = UUIDv4();
        args.device.uuid = new_uuid;
        await dispatch(registerDevice(args.device));
        response = await args.device.loginWithCredentials(
          args.username,
          args.password,
        );
        break;
    }
    const username = 'S' + response.data.current_id;
    dispatch(setUserInfo(response.data));
    await saveCredentials(
      username,
      JSON.stringify({uuid: args.device.uuid, token: response.token}),
    );
    dispatch(setConfig({...getState().session.config, login: true}));
    return {user: username, uuid: args.device.uuid};
  } catch (e) {
    // There has been an error, check if we're offline
    try {
      await ping();
    } catch (e2) {
      return rejectWithValue('offline');
    }
  }
  throw new Error();
});

/**
 * Clears keychain, logs out and sets auth status as NOT_VALID.
 * Ignores whether or not the logout has been correctly sent to the server.
 */
export const logout = createAsyncThunk<void, Device, {state: RootState}>(
  'session/logout',
  async (device, {dispatch, getState}) => {
    await clearCredentials();
    try {
      await device.logout();
    } finally {
      dispatch(setAuthStatus(AUTH_STATUS.NOT_VALID));
      dispatch(setConfig({...getState().session.config, login: false}));

      if (genericPlatform === 'web' || genericPlatform === 'desktop') {
        localStorage.clear();
      }
    }
  },
);

/**
 * Updates configuration in AsyncStorage and in store.
 * Returns void.
 */
export const setConfig = createAsyncThunk<
  void,
  Configuration,
  {state: RootState}
>('session/setConfig', async (config, {dispatch}) => {
  await dispatch(setConfigState(config));
  await AsyncStorage.setItem('@config', JSON.stringify(config));
});

/**
 * Resets configuration to default
 */
export const resetConfig = createAsyncThunk<void, void, {state: RootState}>(
  'session/resetConfig',
  async (_, {dispatch}) => {
    await dispatch(setConfig(defaultConfig));
  },
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
    setConfigState: (state, action: PayloadAction<Configuration>) => {
      state.config = action.payload;
    },
    setToast: (state, action: PayloadAction<ToastData>) => {
      state.toast = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerDevice.pending, state => {
        state.deviceRegisterStatus = pendingStatus();
      })
      .addCase(registerDevice.fulfilled, state => {
        state.deviceRegisterStatus = successStatus();
      })
      .addCase(registerDevice.rejected, (state, action) => {
        state.deviceRegisterStatus = errorStatus(action.error);
      })

      .addCase(login.pending, state => {
        state.loginStatus = pendingStatus();
        state.authStatus = AUTH_STATUS.PENDING;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = successStatus();
        state.authStatus = AUTH_STATUS.VALID;
        state.loginData = {
          user: action.payload.user,
          uuid: action.payload.uuid,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus =
          action.payload === 'offline'
            ? AUTH_STATUS.OFFLINE
            : AUTH_STATUS.NOT_VALID;
        state.loginStatus = errorStatus(action.error);
      });
  },
});

export const {setAuthStatus, setConfigState, setToast} = sessionSlice.actions;

export default sessionSlice.reducer;
