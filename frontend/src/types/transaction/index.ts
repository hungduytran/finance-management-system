import type { CategoryType } from "../category";

export type TransactionType = {
  id: number;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  category: CategoryType;
  transactionDate: string;
  createdAt: string;
  userTransaction: {
    id: number;
  };
  accountTransaction: {
    id: number;
    name: string;
  };
};
