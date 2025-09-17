import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import WishlistService from "../services/WishlistService";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import Head from "next/head";

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  category: {
    name: string;
  };
}

interface WishlistData {
  count: number;
  data: Product[];
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchWishlist();
    fetchCartCount();
  }, [router]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await WishlistService.getWishlist(token);
      console.log("Wishlist API Response:", response.data);

      // Handle the API response structure correctly
      if (response.data) {
        const wishlistData = {
          count: response.data.count || 0,
          data: response.data.data || [],
        };
        setWishlist(wishlistData);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        setError("Failed to load wishlist");
        setLoading(false);
      }
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await CartService.getCart(token);
      setCartCount(response.data.numOfCartItems || 0);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await WishlistService.removeFromWishlist(productId, token);

      // Update wishlist state optimistically
      if (wishlist) {
        setWishlist({
          ...wishlist,
          data: wishlist.data.filter((item) => item._id !== productId),
          count: wishlist.count - 1,
        });
      }

      setSuccessMessage("Product removed from wishlist");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      alert("Failed to remove from wishlist. Please try again.");
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Add to cart
      await CartService.addToCart(productId, token);

      // Remove from wishlist after successfully adding to cart
      await WishlistService.removeFromWishlist(productId, token);

      // Update both cart count and wishlist state
      setCartCount((prev) => prev + 1);

      if (wishlist) {
        setWishlist({
          ...wishlist,
          data: wishlist.data.filter((item) => item._id !== productId),
          count: wishlist.count - 1,
        });
      }

      setSuccessMessage("✓ Product added to cart and removed from wishlist!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
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
        Loading wishlist...
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

  return (
    <>
      <Head>
        <title>Wishlist - Fresh Cart</title>
      </Head>
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => router.push("/home")}
            >
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                🛒
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#28a745",
                }}
              >
                fresh cart
              </span>
            </div>

            <nav style={{ display: "flex", gap: "2rem" }}>
              <a
                href="/home"
                style={{
                  textDecoration: "none",
                  color: "#6c757d",
                  fontWeight: "500",
                }}
              >
                Home
              </a>
              <a
                href="/cart"
                style={{
                  textDecoration: "none",
                  color: "#6c757d",
                  fontWeight: "500",
                }}
              >
                cart
              </a>
              <a
                href="/wishlist"
                style={{
                  textDecoration: "none",
                  color: "#28a745",
                  fontWeight: "500",
                }}
              >
                wish list
              </a>
              <a
                href="/products"
                style={{
                  textDecoration: "none",
                  color: "#6c757d",
                  fontWeight: "500",
                }}
              >
                Products
              </a>
              <a
                href="/categories"
                style={{
                  textDecoration: "none",
                  color: "#6c757d",
                  fontWeight: "500",
                }}
              >
                categories
              </a>
              <a
                href="/brands"
                style={{
                  textDecoration: "none",
                  color: "#6c757d",
                  fontWeight: "500",
                }}
              >
                brands
              </a>
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/cart")}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
                🛒
              </div>
              <button
                onClick={logout}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #28a745",
                  color: "#28a745",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                log out
              </button>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              position: "fixed",
              top: "100px",
              right: "20px",
              backgroundColor: "#28a745",
              color: "white",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1001,
              fontSize: "1rem",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Main Content */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: "normal",
                color: "#333",
                margin: 0,
              }}
            >
              My wish List
            </h1>
          </div>

          {wishlist && wishlist.data.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#666", marginBottom: "1rem" }}>
                Your wishlist is empty
              </h2>
              <p style={{ color: "#999", marginBottom: "2rem" }}>
                Add products to your wishlist to see them here
              </p>
              <button
                onClick={() => router.push("/products")}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {wishlist?.data.map((product) => (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Product Image */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Heart Icon at Bottom Right */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        fontSize: "1.5rem",
                        color: "#dc3545",
                      }}
                    >
                      ❤️
                    </div>
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: "1rem" }}>
                    <p
                      style={{
                        color: "#28a745",
                        fontSize: "0.9rem",
                        margin: "0 0 0.5rem 0",
                        fontWeight: "500",
                      }}
                    >
                      {product.category.name}
                    </p>
                    <h3
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "600",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.8rem",
                      }}
                    >
                      {product.title}
                    </h3>

                    {/* Price and Rating */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        {product.priceAfterDiscount ? (
                          <div>
                            <span
                              style={{
                                color: "#28a745",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                              }}
                            >
                              {product.priceAfterDiscount} EGP
                            </span>
                            <span
                              style={{
                                color: "#999",
                                textDecoration: "line-through",
                                marginLeft: "0.5rem",
                                fontSize: "0.9rem",
                              }}
                            >
                              {product.price} EGP
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "#333",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            {product.price} EGP
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span style={{ color: "#ffc107", fontSize: "1rem" }}>
                          ⭐
                        </span>
                        <span style={{ color: "#666", fontSize: "0.9rem" }}>
                          {product.ratingsAverage}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "1px solid #28a745",
                          padding: "0.6rem 1rem",
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          flex: 1,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#218838";
                          e.currentTarget.style.borderColor = "#218838";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#28a745";
                          e.currentTarget.style.borderColor = "#28a745";
                        }}
                      >
                        add To Cart
                      </button>

                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        style={{
                          backgroundColor: "transparent",
                          color: "#dc3545",
                          border: "none",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#a71e2a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#dc3545";
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
