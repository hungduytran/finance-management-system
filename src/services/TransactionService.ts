import axiosClient from "./AxiosClient";

class TransactionService {
  static getWeeklySummary() {
    return axiosClient.get("/weekly-summary");
  }

  static getTransactions(month: number, year: number) {
    return axiosClient.get("/transactions", {
      params: {
        month,
        year,
        sort: "id,asc",
      },
    });
  }

  static getAllTransactions() {
    return axiosClient.get("/transactions/all");
  }

  static createTransaction({
    account,
    category,
    type,
    amount,
    description,
    transactionDate,
  }: {
    account: { id: number };
    category: { id: number };
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    transactionDate: string;
  }) {
    return axiosClient.post("/transactions", {
      account: account,
      category: category,
      type,
      amount,
      description,
      transactionDate: transactionDate,
    });
  }

  static updateTransaction({
    id,
    account,
    category,
    type,
    amount,
    description,
    transactionDate,
  }: {
    id: number;
    account: { id: number };
    category: { id: number };
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    transactionDate: string;
  }) {
    return axiosClient.put(`/transactions/${id}`, {
      account: account,
      category: category,
      type,
      amount,
      description,
      transactionDate: transactionDate,
    });
  }

  static deleteTransaction(id: number) {
    return axiosClient.delete(`/transactions/${id}`);
  }
}

export default TransactionService;
