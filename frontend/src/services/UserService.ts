import axiosClient from "./AxiosClient";

class UserService {
  static login({ email, password }: { email: string; password: string }) {
    return axiosClient.post("/auth/login", { email, password });
  }

  static register({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) {
    return axiosClient.post("/auth/register", { email, password, username });
  }

  static logout() {
    return axiosClient.post("/auth/logout");
  }

  static refreshToken() {
    return axiosClient.post("/auth/refresh-token");
  }
}

export default UserService;
