import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  windowHeight: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setWindowHeight: (state, action) => {
      state.windowHeight = action.payload;
    },
  },
});

export const {setWindowHeight} = uiSlice.actions;

export default uiSlice.reducer;
