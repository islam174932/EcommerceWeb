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
  price: number;
}

interface CartData {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  __v: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
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
      console.log("Cart API Response:", response.data);
      console.log("Cart Data:", response.data.data);
      console.log("Products:", response.data.data.products);

      // Enrich cart items with full product details
      const cartData = response.data.data;
      if (cartData.products && cartData.products.length > 0) {
        const enrichedProducts = await Promise.all(
          cartData.products.map(async (item: any) => {
            try {
              // Fetch full product details
              const productResponse = await fetch(
                `https://ecommerce.routemisr.com/api/v1/products/${item.product._id}`
              );
              const productData = await productResponse.json();

              return {
                ...item,
                product: {
                  ...item.product,
                  price: productData.data.price,
                  priceAfterDiscount: productData.data.priceAfterDiscount,
                },
              };
            } catch (error) {
              console.error(
                `Failed to fetch product details for ${item.product._id}:`,
                error
              );
              return item; // Return original item if enrichment fails
            }
          })
        );

        cartData.products = enrichedProducts;
      }

      // Calculate total price from enriched products
      const products = cartData.products || [];
      const totalPrice = products.reduce((total: number, item: any) => {
        const price =
          item.product.priceAfterDiscount || item.product.price || 0;
        return total + price * item.count;
      }, 0);

      // Set cart with calculated total price
      setCart({
        ...cartData,
        totalCartPrice: totalPrice,
      });
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

  const updateQuantity = async (productId: string, newCount: number) => {
    if (newCount < 1) return;

    // Optimistic update for better UX
    if (cart?.products) {
      const updatedProducts = cart.products.map((item: any) =>
        item.product._id === productId ? { ...item, count: newCount } : item
      );

      // Recalculate total price
      const newTotalPrice = updatedProducts.reduce(
        (total: number, item: any) => {
          const price =
            item.product.priceAfterDiscount || item.product.price || 0;
          return total + price * item.count;
        },
        0
      );

      setCart({
        ...cart,
        products: updatedProducts,
        totalCartPrice: newTotalPrice,
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await CartService.updateCartItem(productId, newCount, token);
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      // Revert to server state on error
      fetchCart();
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (productId: string) => {
    // Optimistic update
    if (cart?.products) {
      const updatedProducts = cart.products.filter(
        (item: any) => item.product._id !== productId
      );

      // Recalculate total price
      const newTotalPrice = updatedProducts.reduce(
        (total: number, item: any) => {
          const price =
            item.product.priceAfterDiscount || item.product.price || 0;
          return total + price * item.count;
        },
        0
      );

      setCart({
        ...cart,
        products: updatedProducts,
        totalCartPrice: newTotalPrice,
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await CartService.removeFromCart(productId, token);
    } catch (error: any) {
      console.error("Failed to remove item:", error);
      // Revert to server state on error
      fetchCart();
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    // Optimistic update
    if (cart) {
      setCart({
        ...cart,
        products: [],
        totalCartPrice: 0,
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await CartService.clearCart(token);
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      // Revert to server state on error
      fetchCart();
      alert("Failed to clear cart. Please try again.");
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
          backgroundColor: "#f8f9fa",
        }}
      >
        <div>Loading cart...</div>
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
          backgroundColor: "#f8f9fa",
        }}
      >
        <div>{error}</div>
      </div>
    );
  }

  return (
    <ProfessionalLayout
      title="Shopping Cart"
      description="Your shopping cart items"
      cartCount={cart?.products?.length || 0}
      currentPage="/cart"
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
            Shopping Cart
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Review and manage your selected items
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Cart Shop
              </h2>
              {cart?.products && cart.products.length > 0 && (
                <button
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => router.push("/checkout")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Check Out
                </button>
              )}
            </div>

            {cart?.products && cart.products.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                }}
              >
                <div>
                  <span style={{ color: "#6b7280" }}>Total price: </span>
                  <span
                    style={{
                      color: "#059669",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    {cart?.totalCartPrice || 0} EGP
                  </span>
                </div>
                <div>
                  <span style={{ color: "#6b7280" }}>
                    Total number of items:{" "}
                  </span>
                  <span
                    style={{
                      color: "#059669",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    {cart?.products?.length || 0}
                  </span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            {cart?.products && cart.products.length > 0 ? (
              <div style={{ marginBottom: "2rem" }}>
                {cart.products.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "1.5rem 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "1.5rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {item.product.title}
                      </h3>
                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "1rem",
                            color: "#6b7280",
                          }}
                        >
                          Unit Price:{" "}
                          <span style={{ color: "#059669", fontWeight: "500" }}>
                            {item.product.priceAfterDiscount ||
                              item.product.price ||
                              0}{" "}
                            EGP
                          </span>
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          Total:{" "}
                          <span style={{ color: "#059669" }}>
                            {(item.product.priceAfterDiscount ||
                              item.product.price ||
                              0) * (item.count || 1)}{" "}
                            EGP
                          </span>
                        </p>
                      </div>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#dc2626",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "color 0.2s ease",
                        }}
                        onClick={() => removeItem(item.product._id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#991b1b";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#dc2626";
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <button
                        style={{
                          background:
                            "linear-gradient(135deg, #059669, #047857)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          transition: "transform 0.2s ease",
                        }}
                        onClick={() =>
                          updateQuantity(item.product._id, item.count + 1)
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        +
                      </button>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          minWidth: "40px",
                          textAlign: "center",
                          color: "#1f2937",
                        }}
                      >
                        {item.count}
                      </span>
                      <button
                        style={{
                          background:
                            "linear-gradient(135deg, #059669, #047857)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          transition: "transform 0.2s ease",
                        }}
                        onClick={() =>
                          updateQuantity(item.product._id, item.count - 1)
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "#6b7280",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
                <h3
                  style={{
                    marginBottom: "1rem",
                    color: "#1f2937",
                    fontSize: "1.5rem",
                  }}
                >
                  Your cart is empty
                </h3>
                <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
                  Add some products to your cart to see them here.
                </p>
                <button
                  style={{
                    background: "linear-gradient(135deg, #059669, #047857)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "1rem 2rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => router.push("/products")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* Clear Cart Button */}
            {cart?.products && cart.products.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: "#dc2626",
                    border: "2px solid #dc2626",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={clearCart}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                >
                  Clear Your Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
}
