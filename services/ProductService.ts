import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class ProductService {
  async getAllProducts(page = 1, limit = 40) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { page, limit },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get products failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get categories failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async getBrands() {
    try {
      const response = await axios.get(`${API_BASE_URL}/brands`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get brands failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async searchProducts(query: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          search: query,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Search products failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async addToCart(productId: string) {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Token from localStorage:",
        token ? "Token exists" : "No token found"
      );

      if (!token) {
        return {
          success: false,
          error: {
            status: 401,
            message: "No authentication token found",
          },
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/cart`,
        { productId },
        {
          headers: {
            token: token,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Add to cart failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async addToWishlist(productId: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/wishlist`,
        { productId },
        {
          headers: {
            token: token,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Add to wishlist failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async removeFromWishlist(productId: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/wishlist/${productId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Remove from wishlist failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }

  async getWishlist() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/wishlist`, {
        headers: {
          token: token,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get wishlist failed:", error);
      return {
        success: false,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
      };
    }
  }
}

export default new ProductService();
