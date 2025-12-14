import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/useReducer";
import todoListReducer from "./reducers/todoListReducer";
import globalLoadingReducer from "./reducers/globalLoadingReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    todoListReducer: todoListReducer,
    globalLoading: globalLoadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
