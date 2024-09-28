import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMode: null,
  selectedAlgorithm: null,
};

export const algorithmSlice = createSlice({
  name: "algorithm",
  initialState,
  reducers: {
    setSelectedMode: (state, action) => {
      state.selectedMode = action.payload;
    },
    setSelectedAlgorithm: (state, action) => {
      state.selectedAlgorithm = action.payload;
    },
  },
});

export const { setSelectedMode, setSelectedAlgorithm } = algorithmSlice.actions;

export default algorithmSlice.reducer;
