import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  material: null,
  recentMaterial: null,
};

export const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    setMaterial: (state, action) => {
      state.material = action.payload;
    },
    setRecentMaterial: (state, action) => {
      state.recentMaterial = action.payload;
    },
  },
});

export const {setMaterial, setRecentMaterial} = materialSlice.actions;

export default materialSlice.reducer;
