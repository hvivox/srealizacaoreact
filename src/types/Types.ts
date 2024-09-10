
export type Sheet ={
  id: number;
  focus: string;
  realizationDate: Date;
  dayNote: number;
}

export type Pagination = {
  current: number;
  pageSize: number;
  totalItem: number;
}