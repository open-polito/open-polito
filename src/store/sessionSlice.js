import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uuid: null,
  username: null,
  token: null,
  user: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUuid: (state, action) => {
      state.uuid = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      let _user = action.payload;
      if (typeof _user == 'object') {
        _user = JSON.stringify(_user);
      }
      state.user = _user;
    },
  },
});

export const {setUuid, setUsername, setToken, setUser} = sessionSlice.actions;

export default sessionSlice.reducer;
