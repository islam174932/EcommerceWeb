import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class CategoryService {
  async getAllCategories() {
    return axios.get(`${API_BASE_URL}/categories`);
  }
}

export default new CategoryService();
