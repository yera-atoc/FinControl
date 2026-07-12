export type ClientRow = {
  id: string;
  name: string;
  contact: string | null;
  status: "new" | "completed";
  result: string | null;
  paid: number;
  created_at: string;
};

export type StudentRow = {
  id: string;
  name: string;
  phone: string | null;
  test_date: string | null;
  result: string | null;
  paid: number;
  created_at: string;
};

export type AccountRow = {
  id: string;
  name: string;
  bank: string | null;
  balance: number;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

export type TransactionRow = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  client_id: string | null;
  date: string;
  note: string | null;
};

export type TaskRow = {
  id: string;
  title: string;
  due: string;
  done: boolean;
};

export const EXPENSE_CATEGORIES = ["Еда", "Транспорт", "Аренда", "Реклама", "Связь", "Прочее"];
