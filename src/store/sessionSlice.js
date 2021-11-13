import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uuid: null,
  username: null,
  token: null,
  name: null,
  anagrafica: null,
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
      state.anagrafica = action.payload;
    },
  },
});

export const {setUuid, setUsername, setToken, setUser} = sessionSlice.actions;

export default sessionSlice.reducer;
