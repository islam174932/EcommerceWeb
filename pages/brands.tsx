import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ProfessionalLayout from "../components/ProfessionalLayout";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchBrands();
    fetchCartCount();
  }, [router]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getBrands();
      if (response.success) {
        setBrands(response.data.data);
      } else {
        setError("Failed to load brands");
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch brands:", error);
      setError("Failed to load brands");
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await CartService.getCart(token);
        if (
          response.data &&
          response.data.data &&
          response.data.data.products
        ) {
          setCartCount(response.data.data.products.length);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBrand(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <ProfessionalLayout
        title="Brands - Elite Store"
        description="Explore our premium brand collection"
        cartCount={cartCount}
        currentPage="/brands"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading brands...
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout
      title="Brands - Elite Store"
      description="Explore our premium brand collection"
      cartCount={cartCount}
      currentPage="/brands"
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
            Premium Brands
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Discover products from the world's most trusted brands
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
          {error ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "4rem 2rem",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              <p
                style={{
                  color: "#dc3545",
                  fontSize: "1.1rem",
                }}
              >
                {error}
              </p>
            </div>
          ) : brands.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "4rem 2rem",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "1.1rem",
                }}
              >
                Brands are currently being updated. Please check back later.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  onClick={() => handleBrandClick(brand)}
                >
                  <div
                    style={{
                      height: "200px",
                      background: `url(${brand.image}) center/cover`,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        padding: "1rem",
                        color: "white",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.9rem",
                        margin: 0,
                      }}
                    >
                      Click to explore {brand.name} products
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brand Modal */}
      {showModal && selectedBrand && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                height: "200px",
                background: `url(${selectedBrand.image}) center/cover`,
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              {selectedBrand.name}
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              Explore our complete collection of {selectedBrand.name} products.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  router.push(`/products?brand=${selectedBrand.slug}`);
                }}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                View Products
              </button>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  color: "#6b7280",
                  border: "1px solid #d1d5db",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  );
}
