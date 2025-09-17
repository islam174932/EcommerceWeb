import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: email.trim(),
        password: password,
      });
      console.log("Login successful:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Login failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

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

  async register(
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone: string
  ) {
    // Format data exactly like the API documentation example
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      rePassword: rePassword,
      phone: phone.trim(),
    };

    console.log("Sending payload:", payload);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration successful:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Registration failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Return error instead of throwing to prevent Next.js error overlay
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

  async forgetPassword(email: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgotPasswords`,
        { email }
      );
      console.log("Forget password successful:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Forget password failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

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

  async resetPassword(email: string, resetCode: string, newPassword: string) {
    try {
      // Step 1: Verify the reset code
      console.log("Verifying reset code:", resetCode);
      const verifyResponse = await axios.post(
        `${API_BASE_URL}/auth/verifyResetCode`,
        {
          resetCode,
        }
      );

      console.log("Code verification successful:", verifyResponse.data);

      // Step 2: Reset the password (without resetCode, just email and newPassword)
      console.log("Resetting password for:", email);
      const resetResponse = await axios.put(
        `${API_BASE_URL}/auth/resetPassword`,
        {
          email,
          newPassword,
        }
      );

      console.log("Password reset successful:", resetResponse.data);
      return { success: true, data: resetResponse.data };
    } catch (error: any) {
      console.error("Reset password failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

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

export default new AuthService();
