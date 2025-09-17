import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class PaymentService {
  async pay(token: string, orderId: string, paymentMethod: string) {
    return axios.post(
      `${API_BASE_URL}/orders/${orderId}/pay`,
      { paymentMethod },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}

export default new PaymentService();
