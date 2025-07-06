import axiosClient from "./AxiosClient";

class CategoryService {
  static getCategories() {
    return axiosClient.get("/categories");
  }
}

export default CategoryService;
