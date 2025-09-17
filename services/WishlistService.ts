import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class WishlistService {
  async getWishlist(token: string) {
    return axios.get(`${API_BASE_URL}/wishlist`, {
      headers: { token: token },
    });
  }

  async addToWishlist(productId: string, token: string) {
    return axios.post(
      `${API_BASE_URL}/wishlist`,
      { productId },
      {
        headers: { token: token },
      }
    );
  }

  async removeFromWishlist(productId: string, token: string) {
    return axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
      headers: { token: token },
    });
  }
}

export default new WishlistService();
