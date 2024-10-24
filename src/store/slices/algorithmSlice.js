import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAlgorithm: null,
};

export const algorithmSlice = createSlice({
  name: "algorithm",
  initialState,
  reducers: {
    setSelectedAlgorithm: (state, action) => {
      state.selectedAlgorithm = action.payload;
    },
    resetAlgorithmState: (state) => {
      state.selectedAlgorithm = null;
    },
  },
});

export const { setSelectedAlgorithm, resetAlgorithmState } =
  algorithmSlice.actions;

export default algorithmSlice.reducer;
