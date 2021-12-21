import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  material: null,
  recentMaterial: null,
  loadingMaterial: false, // true when loading material, to avoid multiple loads if opening-closing Material screen
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
    setLoadingMaterial: (state, action) => {
      state.loadingMaterial = action.payload;
    },
  },
});

export const {setMaterial, setRecentMaterial, setLoadingMaterial} =
  materialSlice.actions;

export default materialSlice.reducer;
