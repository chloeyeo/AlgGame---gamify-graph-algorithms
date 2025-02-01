import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    generateGraphCounter: 0,
  },
  reducers: {
    incrementGraphCounter: (state) => {
      state.generateGraphCounter += 1;
    },
  },
});

export const { incrementGraphCounter } = graphSlice.actions;
export default graphSlice.reducer;
