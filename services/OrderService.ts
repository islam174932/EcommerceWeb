import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class OrderService {
  async getAllOrders(token: string) {
    return axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new OrderService();
