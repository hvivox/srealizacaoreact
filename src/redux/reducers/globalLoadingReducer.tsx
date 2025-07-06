import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "globalLoading",
  initialState: {
    isActivetedglobalLoading: false,
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isActivetedglobalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = slice.actions;
export default slice.reducer;
