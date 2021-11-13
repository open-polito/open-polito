import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  unreadEmailCount: null,
};

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setUnreadEmailCount: (state, action) => {
      state.unreadEmailCount = action.payload;
    },
  },
});

export const {setUnreadEmailCount} = emailSlice.actions;

export default emailSlice.reducer;
