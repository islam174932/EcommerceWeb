import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import WishlistService from "../services/WishlistService";
import ProfessionalLayout from "../components/ProfessionalLayout";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchProducts();
    fetchCartCount();
    fetchWishlist();
  }, [router, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts(currentPage);
      setProducts(response.data.data);
      setTotalPages(response.data.metadata?.numberOfPages || 1);
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products");
      setLoading(false);
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

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await WishlistService.getWishlist(token);
      console.log("Products Wishlist Response:", response.data);
      if (response.data && response.data.data) {
        const wishlistIds = response.data.data.map((item: any) => item._id);
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await CartService.addToCart(productId, token);
      setCartCount((prev) => prev + 1);
      setSuccessMessage("✓ Product added to cart successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const isInWishlist = wishlist.includes(productId);

      // Optimistic update - update UI immediately
      if (isInWishlist) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        setSuccessMessage("Product removed from wishlist");
      } else {
        setWishlist((prev) => [...prev, productId]);
        setSuccessMessage("Product added to wishlist");
      }

      // Then make the API call
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(productId, token);
      } else {
        await WishlistService.addToWishlist(productId, token);
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update wishlist:", error);

      // Revert optimistic update on error
      const isInWishlist = wishlist.includes(productId);
      if (isInWishlist) {
        setWishlist((prev) => [...prev, productId]);
      } else {
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }

      alert("Failed to update wishlist. Please try again.");
    }
  };

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery ?? searchTerm;

    try {
      setLoading(true);
      setError("");

      if (!query.trim()) {
        // If search is empty, fetch all products
        await fetchProducts();
        return;
      }

      // Get all products first
      const allProductsResponse = await ProductService.getAllProducts(1, 100); // Get more products

      if (allProductsResponse.success && allProductsResponse.data?.data) {
        // Filter products client-side for better control
        const filtered = allProductsResponse.data.data.filter(
          (product: any) => {
            const searchLower = query.toLowerCase();
            return (
              product.title?.toLowerCase().includes(searchLower) ||
              product.description?.toLowerCase().includes(searchLower) ||
              product.category?.name?.toLowerCase().includes(searchLower) ||
              product.brand?.name?.toLowerCase().includes(searchLower) ||
              product.slug?.toLowerCase().includes(searchLower)
            );
          }
        );

        setProducts(filtered);
        setCurrentPage(1);
        setTotalPages(Math.ceil(filtered.length / 12));
      } else {
        setProducts([]);
        setError("Failed to search products");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (loading && products.length === 0) {
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
        Loading products...
      </div>
    );
  }

  return (
    <ProfessionalLayout
      title="Products - Elite Store"
      description="Browse our premium product collection"
      cartCount={cartCount}
      currentPage="/products"
    >
      {/* Hero Section */}
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
            Premium Products
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Discover our curated collection of premium products
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
          {/* Search and Filter Section */}
          {products.length > 0 && (
            <div
              style={{
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search products by name, description, category, or brand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Debounced search - search automatically after user stops typing
                  if (searchTimeout) {
                    clearTimeout(searchTimeout);
                  }
                  const newTimeout = setTimeout(() => {
                    handleSearch(e.target.value);
                  }, 500);
                  setSearchTimeout(newTimeout);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "1rem",
                  width: "400px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                }}
              />
              <button
                onClick={() => handleSearch()}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🔍 Search
              </button>

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleSearch("");
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#dc2626",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          )}

          {/* Search Results Info */}
          {searchTerm && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                background:
                  products.length === 0
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(59, 130, 246, 0.1)",
                borderRadius: "8px",
                color: products.length === 0 ? "#dc2626" : "#1d4ed8",
                fontWeight: "500",
              }}
            >
              {products.length === 0
                ? `No products found for "${searchTerm}". Try different keywords like "shirt", "phone", or "bag".`
                : `Found ${products.length} product${
                    products.length !== 1 ? "s" : ""
                  } for "${searchTerm}"`}
            </div>
          )}

          {/* Show available search terms for debugging */}
          {searchTerm && products.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                background: "rgba(156, 163, 175, 0.1)",
                borderRadius: "8px",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              💡 Try searching for: "Men", "Women", "Samsung", "Apple",
              "Adidas", "Nike"
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: "#dc3545",
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.1rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Products Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                  fontSize: "1.2rem",
                  color: "#666",
                }}
              >
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666",
                  fontSize: "1.1rem",
                }}
              >
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Image container with heart button */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    {/* Heart Button */}
                    <button
                      onClick={() => handleWishlistToggle(product._id)}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        fontSize: "1.4rem",
                        cursor: "pointer",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.15)";
                      }}
                    >
                      <span
                        style={{
                          color: wishlist.includes(product._id)
                            ? "#dc3545"
                            : "#333",
                          fontWeight: "bold",
                        }}
                      >
                        ♥
                      </span>
                    </button>
                  </div>
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
                        fontSize: "1rem",
                        color: "#333",
                        fontWeight: "600",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.title}
                    </h3>
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
                                fontWeight: "600",
                                fontSize: "1.1rem",
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
                              color: "#28a745",
                              fontWeight: "600",
                              fontSize: "1.1rem",
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
                        <span style={{ color: "#ffc107", fontSize: "0.9rem" }}>
                          ⭐
                        </span>
                        <span style={{ color: "#666", fontSize: "0.9rem" }}>
                          {product.ratingsAverage}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        width: "100%",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#218838";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#28a745";
                      }}
                    >
                      + Add To Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: "3rem",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: currentPage === 1 ? "#e9ecef" : "#28a745",
                  color: currentPage === 1 ? "#6c757d" : "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "500",
                }}
              >
                Previous
              </button>

              <span style={{ color: "#666", fontWeight: "500" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "#e9ecef" : "#28a745",
                  color: currentPage === totalPages ? "#6c757d" : "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "500",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            backgroundColor: "#10b981",
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
    </ProfessionalLayout>
  );
}
