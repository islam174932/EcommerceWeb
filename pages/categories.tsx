import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ProfessionalLayout from "../components/ProfessionalLayout";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchCategories();
    fetchCartCount();
  }, [router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getCategories();
      if (response.success) {
        setCategories(response.data.data);
      } else {
        setError("Failed to load categories");
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to load categories");
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

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const openCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
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
        Loading categories...
      </div>
    );
  }

  return (
    <ProfessionalLayout
      title="Categories - Elite Store"
      description="Explore our wide range of product categories"
      cartCount={cartCount}
      currentPage="/categories"
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
            Shop Categories
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Explore our wide range of product categories
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
          {error && (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                color: "#ef4444",
                fontSize: "1.1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              {error}
            </div>
          )}

          {/* Categories Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {categories.map((category) => (
              <div
                key={category._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
                onClick={() => {
                  openCategoryModal(category);
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background: `linear-gradient(135deg, #28a745, #20c997)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                      }}
                    >
                      🏷️
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.3rem",
                      color: "#333",
                      fontWeight: "600",
                    }}
                  >
                    {category.name}
                  </h3>
                  <p
                    style={{
                      margin: "0",
                      color: "#666",
                      fontSize: "0.95rem",
                    }}
                  >
                    Browse {category.name.toLowerCase()} products
                  </p>
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "25px",
                      color: "#28a745",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      display: "inline-block",
                    }}
                  >
                    View Products →
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && !loading && !error && (
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
                No categories found
              </h2>
              <p style={{ color: "#999" }}>
                Categories are currently being updated. Please check back later.
              </p>
            </div>
          )}

          {/* Category Modal */}
          {showModal && selectedCategory && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={closeCategoryModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "2rem",
                  maxWidth: "500px",
                  width: "90%",
                  maxHeight: "80vh",
                  overflow: "auto",
                  position: "relative",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeCategoryModal}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666",
                    padding: "5px",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>

                {/* Category Content */}
                <div style={{ textAlign: "center" }}>
                  <h2
                    style={{
                      color: "#28a745",
                      marginBottom: "1rem",
                      fontSize: "1.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {selectedCategory.name}
                  </h2>

                  <p
                    style={{
                      color: "#666",
                      marginBottom: "2rem",
                      fontSize: "1rem",
                    }}
                  >
                    {selectedCategory.name.toLowerCase()}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    {selectedCategory.image ? (
                      <img
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "150px",
                          height: "150px",
                          background: `linear-gradient(135deg, #28a745, #20c997)`,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "3rem",
                          color: "white",
                        }}
                      >
                        📂
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      closeCategoryModal();
                      router.push(
                        `/products?category=${selectedCategory.slug}`
                      );
                    }}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "0.8rem 2rem",
                      borderRadius: "8px",
                      fontSize: "1rem",
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
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfessionalLayout>
  );
}
