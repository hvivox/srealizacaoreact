/** Chaves do estado Redux/API para cada lista de itens — evita strings soltas no código. */
export const TODO_LIST_SLICE_KEYS = {
  PRIORITY: "priorityList",
  GRATITUDE: "gratitudeList",
  RESTRICTION: "restrictionList",
  LEARNING: "learningList",
} as const;

export type TodoListSliceName = (typeof TODO_LIST_SLICE_KEYS)[keyof typeof TODO_LIST_SLICE_KEYS];

export type Sheet ={
  id: number;
  focus: string;
  realizationDate: Date;
  dayNote: number;
  status: number;
  todoItemList: TodoItem[];
}

export type Pagination = {
  current: number;
  pageSize: number;
  totalItem: number;
}


export type TodoItem = {
  order: number;
  description: string;
  isCompleted: boolean;
}