import { configureStore } from "@reduxjs/toolkit";
import algorithmSlice from "./slices/algorithmSlice";

export const store = configureStore({
  reducer: {
    algorithm: algorithmSlice,
  },
});
