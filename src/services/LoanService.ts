import axiosClient from "./AxiosClient";

class LoanService {
  static getLoans() {
    return axiosClient.get("/loans", {
      params: { sort: "id,asc" },
    });
  }

  static createLoan(
    lenderName: string,
    totalAmount: number,
    paidAmount: number,
    borrowedDate: string,
    dueDate: string,
    type: "DEBT" | "CREDIT",
  ) {
    return axiosClient.post("/loans", {
      lenderName,
      totalAmount,
      paidAmount,
      borrowedDate,
      dueDate,
      type,
    });
  }

  static updateLoan(
    id: number,
    lenderName: string,
    totalAmount: number,
    paidAmount: number,
    borrowedDate: string,
    dueDate: string,
    type: "DEBT" | "CREDIT",
  ) {
    return axiosClient.put(`/loans/${id}`, {
      lenderName,
      totalAmount,
      paidAmount,
      borrowedDate,
      dueDate,
      type,
    });
  }

  static deleteLoan(id: number) {
    return axiosClient.delete(`/loans/${id}`);
  }
}

export default LoanService;
