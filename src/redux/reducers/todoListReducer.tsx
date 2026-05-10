import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoItem, TodoListSliceName } from "../../types/Types";

type TodoState = Partial<Record<TodoListSliceName, TodoItem[]>>;

const initialState: TodoState = {};

export const slice = createSlice({
  name: "todoListReducer",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ sliceName: TodoListSliceName; todo: TodoItem }>) => {
      // Inicializa o array se ainda não existir
      if (!state[action.payload.sliceName]) {
        state[action.payload.sliceName] = [];
      }
      state[action.payload.sliceName]!.push(action.payload.todo);
    },

    setTodoList: (state, action: PayloadAction<{ sliceName: TodoListSliceName; todoList: TodoItem[] }>) => {
      state[action.payload.sliceName] = action.payload.todoList;
    },

    toggleTodo: (state, action: PayloadAction<{ sliceName: TodoListSliceName; order: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        const todo = todoList.find((todo) => todo.order === action.payload.order);
        if (todo) {
          todo.isCompleted = !todo.isCompleted;
        }
      }
    },

    editTodo: (
      state,
      action: PayloadAction<{ sliceName: TodoListSliceName; order: number; description: string }>
    ) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        const todo = todoList.find((todo) => todo.order === action.payload.order);
        if (todo) {
          todo.description = action.payload.description;
        }
      }
    },

    deleteTodo: (state, action: PayloadAction<{ sliceName: TodoListSliceName; order: number }>) => {
      const todoList = state[action.payload.sliceName];
      if (todoList) {
        state[action.payload.sliceName] = todoList.filter(
          (todo) => todo.order !== action.payload.order
        );
      }
    },

    reorderTodos: (state, action: PayloadAction<{ sliceName: TodoListSliceName; todoList: TodoItem[] }>) => {
      state[action.payload.sliceName] = action.payload.todoList;
    },
  },
});

export const { addTodo, setTodoList, toggleTodo, deleteTodo, reorderTodos, editTodo } =
  slice.actions;
export default slice.reducer;
