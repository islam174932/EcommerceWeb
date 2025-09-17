import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CartService from "../services/CartService";
import ProfessionalLayout from "../components/ProfessionalLayout";

interface CartItem {
  count: number;
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
  };
}

interface CartData {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  __v: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    details: "",
    phone: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({
    details: "",
    phone: "",
    city: "",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchCart();
  }, [router]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await CartService.getCart(token);
      console.log("Checkout Cart API Response:", response.data);
      console.log("Checkout Cart Data:", response.data.data);

      // The cart data is nested under response.data.data
      const cartData = response.data.data;

      // Handle cases where cart might be null or empty
      if (cartData && cartData.products) {
        setCart(cartData);
      } else {
        console.log("Cart is empty or null");
        setCart(null);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        setError("Failed to load cart");
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const errors = {
      details: "",
      phone: "",
      city: "",
    };

    if (!formData.details.trim()) {
      errors.details = "Details are required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePayNow = async () => {
    if (!validateForm()) {
      return;
    }

    setOrderLoading(true);

    try {
      // Here you would integrate with your payment API
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message and redirect
      alert("Order placed successfully! Thank you for your purchase.");
      router.push("/home");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        Loading checkout...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          color: "#dc3545",
        }}
      >
        {error}
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <ProfessionalLayout
        title="Checkout - Elite Store"
        description="Complete your purchase securely"
        cartCount={0}
        currentPage="/checkout"
      >
        <div
          style={{
            background: "#f8fafc",
            minHeight: "100vh",
            padding: "3rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "3rem 2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              maxWidth: "500px",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h2
              style={{
                color: "#1f2937",
                marginBottom: "1rem",
                fontSize: "1.5rem",
              }}
            >
              Your cart is empty
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "2rem",
                fontSize: "1.1rem",
              }}
            >
              Add some products to proceed with checkout
            </p>
            <button
              onClick={() => router.push("/products")}
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Browse Products
            </button>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout
      title="Checkout - Elite Store"
      description="Complete your purchase securely"
      cartCount={cart?.products?.length || 0}
      currentPage="/checkout"
    >
      {/* Page Title Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Checkout
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Complete your purchase securely
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "3rem 2rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Order Summary */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "2rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ color: "#6b7280", fontSize: "1rem" }}>
                  Items ({cart.products.length})
                </span>
                <span
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    fontSize: "1rem",
                  }}
                >
                  {cart.totalCartPrice} EGP
                </span>
              </div>
              <hr
                style={{
                  margin: "1rem 0",
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                }}
              >
                <span style={{ color: "#1f2937" }}>Total</span>
                <span style={{ color: "#059669" }}>
                  {cart.totalCartPrice} EGP
                </span>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "1.5rem",
                }}
              >
                Shipping Details
              </h2>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Address & Details *
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => handleInputChange("details", e.target.value)}
                  placeholder="Enter your complete address and any delivery instructions"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `2px solid ${
                      formErrors.details ? "#dc2626" : "#d1d5db"
                    }`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    resize: "vertical",
                    minHeight: "120px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    if (!formErrors.details) {
                      e.target.style.borderColor = "#059669";
                    }
                  }}
                  onBlur={(e) => {
                    if (!formErrors.details) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                />
                {formErrors.details && (
                  <span
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {formErrors.details}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `2px solid ${
                      formErrors.phone ? "#dc2626" : "#d1d5db"
                    }`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!formErrors.phone) {
                      e.target.style.borderColor = "#059669";
                    }
                  }}
                  onBlur={(e) => {
                    if (!formErrors.phone) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                />
                {formErrors.phone && (
                  <span
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {formErrors.phone}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `2px solid ${
                      formErrors.city ? "#dc2626" : "#d1d5db"
                    }`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!formErrors.city) {
                      e.target.style.borderColor = "#059669";
                    }
                  }}
                  onBlur={(e) => {
                    if (!formErrors.city) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                />
                {formErrors.city && (
                  <span
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {formErrors.city}
                  </span>
                )}
              </div>

              <button
                onClick={handlePayNow}
                disabled={orderLoading}
                style={{
                  width: "100%",
                  background: orderLoading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #059669, #047857)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: orderLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: orderLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!orderLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(5, 150, 105, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!orderLoading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {orderLoading
                  ? "Processing Order..."
                  : `Pay Now - ${cart.totalCartPrice} EGP`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
}
