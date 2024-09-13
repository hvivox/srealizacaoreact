import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoItem } from "../../types/Types";

interface PrioridadeState {
  [key: string]: TodoItem[];
}

const initialState: PrioridadeState = {};

export const prioridadeSlice = createSlice({
  name: "prioridade",
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
      const todo = state[action.payload.sliceName]?.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<{ sliceName: string; id: number }>) => {
      state[action.payload.sliceName] = state[action.payload.sliceName]?.filter(
        (todo) => todo.id !== action.payload.id
      );
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = prioridadeSlice.actions;
export default prioridadeSlice.reducer;
