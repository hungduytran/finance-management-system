export type LoanType = {
  id: number;
  lenderName: string;
  totalAmount: number;
  paidAmount: number;
  borrowedDate: string;
  dueDate: string;
  type: "DEBT" | "CREDIT";
  createAt?: string;
};
