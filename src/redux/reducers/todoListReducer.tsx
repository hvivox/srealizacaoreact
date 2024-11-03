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

    setTodoList: (state, action: PayloadAction<{ sliceName: string; todoList: TodoItem[] }>) => {
      state[action.payload.sliceName] = action.payload.todoList;
    },

    toggleTodo: (state, action: PayloadAction<{ sliceName: string; order: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        const todo = todoList.find((todo) => todo.order === action.payload.order);
        if (todo) {
          todo.isCompleted = !todo.isCompleted;
        }
      }
    },
    deleteTodo: (state, action: PayloadAction<{ sliceName: string; order: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        state[action.payload.sliceName] = todoList.filter(
          (todo) => todo.order !== action.payload.order
        );
      }
    },

    reorderTodos: (state, action: PayloadAction<{ sliceName: string; todoList: TodoItem[] }>) => {
      state[action.payload.sliceName] = action.payload.todoList;
    },

    /*reorderTodos: (
      state,
      action: PayloadAction<{ sliceName: string; sourceIndex: number; destinationIndex: number }>
    ) => {
      const { sliceName, sourceIndex, destinationIndex } = action.payload;
      const todoList = state[sliceName];
      if (todoList) {
        const [movedTodo] = todoList.splice(sourceIndex, 1);
        todoList.splice(destinationIndex, 0, movedTodo);
      }
    },*/
  },
});

export const { addTodo, setTodoList, toggleTodo, deleteTodo, reorderTodos } = slice.actions;
export default slice.reducer;
