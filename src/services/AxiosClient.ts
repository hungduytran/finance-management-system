import axiosClient from "axios";
import CookieService from "./CookieService";
import UserService from "./UserService";

axiosClient.defaults.baseURL = "https://moneylover.online/api/v1";
// CORS config
axiosClient.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axiosClient.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE, OPTIONS";
axiosClient.defaults.headers.common["Access-Control-Allow-Headers"] = "*";
axiosClient.defaults.headers.post["Content-Type"] = "application/json";
axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use(
  function (config) {
    const token = CookieService.getCookie("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await UserService.refreshToken();
        CookieService.setCookie("token", res.data.access_token, 1);
        axiosClient.defaults.headers.common["Authorization"] =
          "Bearer " + res.data.access_token;
        return axiosClient(originalRequest);
      } catch (err) {
        // Handle refresh token error (e.g., redirect to login)
        console.error("Refresh token failed", err);
        CookieService.removeCookie("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
