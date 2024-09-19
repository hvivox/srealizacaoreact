
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