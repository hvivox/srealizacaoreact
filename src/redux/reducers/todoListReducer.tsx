import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoItem } from "../../types/Types";

interface TodoState {
  [key: string]: TodoItem[]; // Chave dinâmica para diferentes listas de tarefas
}

const initialState: TodoState = {};

export const slice = createSlice({
  name: "todoListReducer",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ sliceName: string; todo: TodoItem }>) => {
      // Inicializa o array se ainda não existir
      if (!state[action.payload.sliceName]) {
        state[action.payload.sliceName] = [];
      }
      state[action.payload.sliceName].push(action.payload.todo);
    },
    toggleTodo: (state, action: PayloadAction<{ sliceName: string; id: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        const todo = todoList.find((todo) => todo.id === action.payload.id);
        if (todo) {
          todo.completed = !todo.completed;
        }
      }
    },
    deleteTodo: (state, action: PayloadAction<{ sliceName: string; id: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        state[action.payload.sliceName] = todoList.filter((todo) => todo.id !== action.payload.id);
      }
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = slice.actions;
export default slice.reducer;
