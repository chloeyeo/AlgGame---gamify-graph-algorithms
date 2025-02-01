import { configureStore } from "@reduxjs/toolkit";
import algorithmSlice from "./slices/algorithmSlice";
import graphReducer from "./slices/graphSlice";

export const store = configureStore({
  reducer: {
    algorithm: algorithmSlice,
    graph: graphReducer,
  },
});
