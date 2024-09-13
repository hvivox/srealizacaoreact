import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoItem } from "../../types/Types";

export const slice = createSlice({
  name: "todoListReducer",
  initialState: [] as TodoItem[],
  reducers: {
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = slice.actions;
export default slice.reducer;
