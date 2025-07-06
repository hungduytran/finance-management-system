import axiosClient from "./AxiosClient";

class AccountService {
  static getChart() {
    return axiosClient.get("/accounts/charts");
  }

  static getAccounts() {
    return axiosClient.get("/accounts");
  }

  static getAccountById(accountId: number) {
    return axiosClient.get(`/accounts/${accountId}`);
  }

  static createAccount({
    name,
    description,
    balance,
  }: {
    name: string;
    description: string;
    balance: number;
  }) {
    return axiosClient.post("/accounts", { name, description, balance });
  }

  static updateAccount({
    id,
    name,
    description,
    balance,
  }: {
    id: number;
    name: string;
    description: string;
    balance: number;
  }) {
    return axiosClient.put(`/accounts/${id}`, {
      name: name,
      description: description,
      balance: balance,
    });
  }

  static deleteAccount(accountId: number) {
    return axiosClient.delete(`/accounts/${accountId}`);
  }
}

export default AccountService;
