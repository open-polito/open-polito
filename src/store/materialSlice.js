import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  material: null,
};

export const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    setMaterial: (state, action) => {
      state.material = action.payload;
    },
  },
});

export const {setMaterial} = materialSlice.actions;

export default materialSlice.reducer;
