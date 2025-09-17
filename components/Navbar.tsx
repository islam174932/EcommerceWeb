import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated by checking for token
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/auth/login";
  };

  return (
    <nav
      style={{
        background: "#222",
        color: "#fff",
        padding: "1rem",
      }}
    >
      <button
        style={{
          background: "#444",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          display: "none",
        }}
        onClick={() => setOpen((prev) => !prev)}
        className="navbar-toggle"
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
        className="navbar-links"
      >
        {!isAuthenticated ? (
          <>
            <Link
              href="/auth/login"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
              Home
            </Link>
            <Link
              href="/products"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Products
            </Link>
            <Link
              href="/orders"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Orders
            </Link>
            <Link
              href="/wishlist"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Cart
            </Link>
            <button
              onClick={handleLogout}
              style={{
                color: "#fff",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .navbar-links {
            display: ${open ? "flex" : "none"};
            flex-direction: column;
            width: 100%;
          }
          .navbar-toggle {
            display: block;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
