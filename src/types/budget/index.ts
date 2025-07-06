import type { CategoryType } from "../category";

export type BudgetType = {
  id: number;
  category: CategoryType;
  month: number;
  year: number;
  amount: number;
  sentAmount: number;
};
