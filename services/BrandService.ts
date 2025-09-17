import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class BrandService {
  async getAllBrands() {
    return axios.get(`${API_BASE_URL}/brands`);
  }
}

export default new BrandService();
