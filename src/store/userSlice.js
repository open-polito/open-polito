import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  libretto: null,
  carico_didattico: null,
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
  },
});

export const {setLibretto, setCarico} = userSlice.actions;

export default userSlice.reducer;
