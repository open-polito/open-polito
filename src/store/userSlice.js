import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  libretto: null,
  carico_didattico: null,
  loadingUser: false,
  loadedUser: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLibretto: (state, action) => {
      state.libretto = action.payload;
    },
    setCarico: (state, action) => {
      state.carico_didattico = action.payload;
    },
    setLoadingUser: (state, action) => {
      state.loadingUser = action.payload;
    },
    setLoadedUser: (state, action) => {
      state.loadedUser = action.payload;
    },
  },
});

export const {setLibretto, setCarico, setLoadingUser, setLoadedUser} =
  userSlice.actions;

export default userSlice.reducer;
