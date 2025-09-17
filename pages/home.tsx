import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import WishlistService from "../services/WishlistService";

interface Product {
  _id: string;
  title: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  colors: string[];
  imageCover: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  subcategory: Array<{
    _id: string;
    name: string;
    slug: string;
    category: string;
  }>;
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  ratingsAverage: number;
  ratingsQuantity: number;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    fetchData();
    fetchCartCount();
    fetchWishlist();
  }, []);

  const fetchData = async () => {
    try {
      const productsData = await ProductService.getAllProducts();
      setProducts(productsData.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }
      const cartData = await CartService.getCart(token);
      setCartCount(cartData.data?.numOfCartItems || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setWishlistItems([]);
        return;
      }
      const wishlistData = await WishlistService.getWishlist(token);
      setWishlistItems(
        wishlistData.data?.data?.map((item: any) => item._id) || []
      );
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      // Optimistic update
      setCartCount((prev) => prev + 1);
      await CartService.addToCart(productId, token);
    } catch (error) {
      // Revert on error
      setCartCount((prev) => prev - 1);
      console.error("Error adding to cart:", error);
      if ((error as any)?.response?.status === 401) {
        router.push("/auth/login");
      }
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      if (isInWishlist(productId)) {
        // Optimistic update
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        await WishlistService.removeFromWishlist(productId, token);
      } else {
        // Optimistic update
        setWishlistItems((prev) => [...prev, productId]);
        await WishlistService.addToWishlist(productId, token);
      }
    } catch (error) {
      // Revert on error - refetch to get accurate state
      fetchWishlist();
      console.error("Error updating wishlist:", error);
      if ((error as any)?.response?.status === 401) {
        router.push("/auth/login");
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return (
    <>
      <Head>
        <title>Premium E-Commerce Store</title>
        <meta
          name="description"
          content="Discover premium products with exceptional quality"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/professional.css" />
      </Head>

      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Professional Header */}
        <header
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            padding: "1rem 2rem",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              onClick={() => router.push("/")}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "white",
                  }}
                >
                  E
                </span>
              </div>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1f2937",
                  letterSpacing: "-0.5px",
                }}
              >
                Elite Store
              </span>
            </button>

            {/* Navigation */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <a
                href="/wishlist"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "500",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                Wishlist
              </a>
              <a
                href="/products"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "500",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                Products
              </a>
              <a
                href="/categories"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "500",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                Categories
              </a>
              <a
                href="/brands"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "500",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                Brands
              </a>

              {/* Cart Icon */}
              <a
                href="/cart"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "500",
                  position: "relative",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                Cart ({cartCount})
              </a>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    setCartCount(0);
                    setWishlistItems([]);
                    router.push("/");
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#dc2626",
                    padding: "8px 20px",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Logout
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => router.push("/auth/login")}
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: "#2563eb",
                      padding: "8px 20px",
                      borderRadius: "25px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.2)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => router.push("/auth/register")}
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "25px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(251, 191, 36, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #f59e0b, #d97706)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(251, 191, 36, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #fbbf24, #f59e0b)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(251, 191, 36, 0.2)";
                    }}
                  >
                    Register
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            padding: "4rem 2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "800",
                marginBottom: "1.5rem",
                lineHeight: "1.1",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Premium Shopping
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Experience
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                marginBottom: "2rem",
                opacity: 0.9,
                lineHeight: "1.6",
              }}
            >
              Discover curated collections of premium products with exceptional
              quality and unmatched customer service.
              {!isAuthenticated && (
                <span
                  style={{
                    display: "block",
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    opacity: 0.8,
                  }}
                >
                  Login to access your cart and wishlist features!
                </span>
              )}
            </p>
            <button
              onClick={() => router.push("/products")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "16px 32px",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Explore Products →
            </button>
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
          {/* Featured Products Section */}
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
                Featured Products
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#6b7280",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Discover our handpicked selection of premium products designed
                to elevate your lifestyle
              </p>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                marginBottom: "3rem",
              }}
            >
              {products.slice(0, 8).map((product) => (
                <article
                  key={product._id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "75%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product._id);
                      }}
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        background: isInWishlist(product._id)
                          ? "rgba(239, 68, 68, 0.9)"
                          : "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "50%",
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: "18px",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(0, 0, 0, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.15)";
                      }}
                    >
                      <span
                        style={{
                          color: isInWishlist(product._id)
                            ? "white"
                            : "#ef4444",
                          fontWeight: "bold",
                        }}
                      >
                        ♥
                      </span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div style={{ padding: "1.5rem" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#1f2937",
                        marginBottom: "1rem",
                      }}
                    >
                      {product.price} EGP
                    </p>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #1d4ed8, #1e40af)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 25px rgba(59, 130, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #3b82f6, #1d4ed8)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* View All Products Button */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => router.push("/products")}
                style={{
                  background: "linear-gradient(135deg, #1f2937, #111827)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "16px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(31, 41, 55, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View All Products →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
