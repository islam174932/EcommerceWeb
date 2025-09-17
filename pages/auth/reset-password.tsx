import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "../../services/AuthService";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Auto-fill email from URL parameter
  useEffect(() => {
    if (router.query.email && typeof router.query.email === "string") {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestNewCode = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await AuthService.forgetPassword(email);

      if (result.success) {
        setMessage("New reset code sent! Check your email.");
        setResetCode(""); // Clear the old code
        setCountdown(120); // Start 2-minute countdown
      } else {
        const errorData = result.error?.data;
        let errorMessage = "Failed to send new reset code";

        if (errorData?.message) {
          errorMessage = errorData.message;
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password format
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        newPassword
      )
    ) {
      setError(
        "Password must contain uppercase, lowercase, number and special character (e.g., Ahmed@123)"
      );
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting password reset with:", {
        email: email,
        resetCode: resetCode,
        newPasswordLength: newPassword.length,
      });

      const result = await AuthService.resetPassword(
        email,
        resetCode,
        newPassword
      );

      console.log("Reset password result:", result);

      if (result.success) {
        setMessage(
          "Password reset successful! You can now login with your new password."
        );
        // Clear form
        setEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 3000);
      } else {
        // Handle error response without throwing
        const errorData = result.error?.data;
        let errorMessage = "Password reset failed";

        console.log("Error data:", errorData);

        if (errorData?.message) {
          if (
            errorData.message.includes("not verified") ||
            errorData.message.includes("invalid")
          ) {
            errorMessage =
              "Invalid or expired reset code. Please request a new reset link.";
          } else if (errorData.message.includes("not found")) {
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
          Reset Password
        </h2>

        <form onSubmit={handleReset}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="reset-email"
              style={{ display: "block", marginBottom: 4 }}
            >
              Email :
            </label>
            <input
              id="reset-email"
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

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="reset-code"
              style={{ display: "block", marginBottom: 4 }}
            >
              Reset Code :
            </label>
            <input
              id="reset-code"
              type="text"
              placeholder="Enter the 6-digit code from your email"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              maxLength={6}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          {countdown > 0 && (
            <div
              style={{
                marginBottom: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              Code expires in: {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </div>
          )}

          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={handleRequestNewCode}
              disabled={isLoading || !email}
              style={{
                padding: "0.3rem 1rem",
                borderRadius: 4,
                border: "1px solid #28a745",
                background: "#fff",
                color: "#28a745",
                fontSize: "0.875rem",
                cursor: isLoading || !email ? "not-allowed" : "pointer",
                opacity: isLoading || !email ? 0.5 : 1,
              }}
            >
              {countdown > 0
                ? "Request New Code"
                : "Code Expired - Request New Code"}
            </button>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="new-password"
              style={{ display: "block", marginBottom: 4 }}
            >
              New Password :
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              htmlFor="confirm-password"
              style={{ display: "block", marginBottom: 4 }}
            >
              Confirm Password :
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div
            style={{
              marginBottom: "1rem",
              fontSize: "0.875rem",
              color: "#666",
            }}
          >
            Password must contain uppercase, lowercase, number and special
            character (e.g., Ahmed@123)
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
              {isLoading ? "Resetting..." : "Reset Password"}
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
