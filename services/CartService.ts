import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class CartService {
  async getCart(token: string) {
    return axios.get(`${API_BASE_URL}/cart`, {
      headers: { token: token },
    });
  }

  async addToCart(productId: string, token: string) {
    return axios.post(
      `${API_BASE_URL}/cart`,
      { productId },
      {
        headers: { token: token },
      }
    );
  }

  async removeFromCart(productId: string, token: string) {
    return axios.delete(`${API_BASE_URL}/cart/${productId}`, {
      headers: { token: token },
    });
  }

  async updateCartItem(productId: string, count: number, token: string) {
    return axios.put(
      `${API_BASE_URL}/cart/${productId}`,
      { count },
      {
        headers: { token: token },
      }
    );
  }

  async clearCart(token: string) {
    return axios.delete(`${API_BASE_URL}/cart`, {
      headers: { token: token },
    });
  }
}

export default new CartService();
