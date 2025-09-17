import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface ProfessionalHeaderProps {
  readonly cartCount?: number;
  readonly currentPage?: string;
}

export default function ProfessionalHeader({
  cartCount = 0,
  currentPage,
}: ProfessionalHeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
  ];

  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "1rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 1000,
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
              color: "white",
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
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color:
                  currentPage === item.href
                    ? "white"
                    : "rgba(255, 255, 255, 0.9)",
                fontWeight: currentPage === item.href ? "600" : "500",
                transition: "color 0.3s ease",
                padding: "8px 16px",
                borderRadius: "8px",
                background:
                  currentPage === item.href
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  currentPage === item.href
                    ? "white"
                    : "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.background =
                  currentPage === item.href
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.1)";
              }}
            >
              {item.label}
            </a>
          ))}

          {/* Cart Icon */}
          <a
            href="/cart"
            style={{
              textDecoration: "none",
              color:
                currentPage === "/cart" ? "white" : "rgba(255, 255, 255, 0.9)",
              fontWeight: currentPage === "/cart" ? "600" : "500",
              position: "relative",
              padding: "8px 16px",
              borderRadius: "8px",
              background:
                currentPage === "/cart"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                currentPage === "/cart" ? "white" : "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.background =
                currentPage === "/cart"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.1)";
            }}
          >
            Cart ({cartCount})
          </a>

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
