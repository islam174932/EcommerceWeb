import { useState } from "react";
import { useRouter } from "next/router";
import AuthService from "../../services/AuthService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await AuthService.login(email, password);

      if (result.success) {
        console.log("Login successful:", result.data);

        // Store token if needed
        if (result.data?.token) {
          localStorage.setItem("token", result.data.token);
        }

        // Redirect to home page
        router.push("/home");
      } else {
        // Handle login error
        const errorMessage = result.error?.data?.message || "Login failed";
        if (
          errorMessage.includes("incorrect") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("invalid")
        ) {
          setError("You are not registered yet. Please register first.");
        } else {
          setError(errorMessage);
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div
        style={{
          maxWidth: 400,
          margin: "0 auto",
          padding: "2rem",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginTop: "3rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "2rem", color: "green", marginRight: 8 }}>
            🛒
          </span>
          <span style={{ fontWeight: 600, fontSize: "1.5rem" }}>
            fresh cart
          </span>
        </div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontWeight: 500,
          }}
        >
          login now
        </h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="login-email"
              style={{ display: "block", marginBottom: 4 }}
            >
              Email :
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="login-password"
              style={{ display: "block", marginBottom: 4 }}
            >
              Password :
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <a
              href="/auth/forget-password"
              style={{ color: "#444", fontSize: "0.95rem" }}
            >
              forget your password ?
            </a>
          </div>
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 6,
                border: "1px solid #888",
                background: loading ? "#f8f9fa" : "#fff",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Logging in..." : "login now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
