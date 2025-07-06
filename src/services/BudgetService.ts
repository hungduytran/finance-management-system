import axiosClient from "./AxiosClient";

class BudgetService {
  static getBudgets() {
    return axiosClient.get("/budgets", { params: { sort: "id,asc" } });
  }

  static createBudget({
    amount,
    sentAmount,
    month,
    year,
    categoryId,
  }: {
    amount: number;
    sentAmount: number;
    month: number;
    year: number;
    categoryId: number;
  }) {
    return axiosClient.post("/budgets", {
      amount,
      sentAmount,
      month,
      year,
      category: { id: categoryId },
    });
  }

  static updateBudget({
    id,
    amount,
    sentAmount,
    month,
    year,
    categoryId,
  }: {
    id: number;
    amount: number;
    sentAmount: number;
    month: number;
    year: number;
    categoryId: number;
  }) {
    return axiosClient.put(`/budgets/${id}`, {
      amount,
      sentAmount,
      month,
      year,
      category: { id: categoryId },
    });
  }

  static deleteBudget(id: number) {
    return axiosClient.delete(`/budgets/${id}`);
  }
}

export default BudgetService;
