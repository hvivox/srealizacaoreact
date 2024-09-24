import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "globalLoading",
  initialState: {
    globalLoading: false,
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = slice.actions;
export default slice.reducer;
