import { useState } from "react";
import AuthService from "../../services/AuthService";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await AuthService.forgetPassword(email);

      if (result.success) {
        setMessage(
          "Reset code sent successfully! Redirecting to reset password page..."
        );
        // Redirect to reset password page with email parameter after 2 seconds
        setTimeout(() => {
          window.location.href = `/auth/reset-password?email=${encodeURIComponent(
            email
          )}`;
        }, 2000);
      } else {
        // Handle error response without throwing
        const errorData = result.error?.data;
        let errorMessage = "Failed to send reset email";

        if (errorData?.message) {
          if (
            errorData.message.includes("not found") ||
            errorData.message.includes("doesn't exist")
          ) {
            errorMessage = "No account found with this email address.";
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData?.errors?.msg) {
          errorMessage = errorData.errors.msg;
        }

        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
          style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}
        >
          Forget Password
        </h2>

        <form onSubmit={handleForget}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="forget-email"
              style={{ display: "block", marginBottom: 4 }}
            >
              Email :
            </label>
            <input
              id="forget-email"
              type="email"
              placeholder="Enter your email"
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

          {message && (
            <p
              style={{
                color: "green",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}

          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 6,
                border: "1px solid #888",
                background: isLoading ? "#f5f5f5" : "#fff",
                fontWeight: 500,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span style={{ color: "#666" }}>Remember your password? </span>
            <a
              href="/auth/login"
              style={{ color: "green", textDecoration: "none" }}
            >
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
