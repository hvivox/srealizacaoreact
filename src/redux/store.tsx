import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/useReducer";
import todoListReducer from "./reducers/todoListReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    todoListReducer: todoListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
