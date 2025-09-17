import { useState } from "react";
import AuthService from "../../services/AuthService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted!"); // Debug log

    // Clear any previous errors first
    setError("");

    console.log("Form data:", {
      name,
      email,
      phone,
      passwordLength: password.length,
    });

    // Basic validation
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate password format - let's try a simpler validation first
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    console.log("Password validation:", {
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      password: "***",
    });

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        "Password must contain: uppercase letter, lowercase letter, number and special character (@$!%*?&)"
      );
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate name
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    // Validate phone - accept international formats
    const phoneClean = phone.replace(/[\s\-\(\)]/g, ""); // Remove spaces, dashes, parentheses
    if (!/^\+?[\d]{10,15}$/.test(phoneClean)) {
      console.log(
        "Phone validation failed for:",
        phone,
        "cleaned:",
        phoneClean
      );
      setError(
        "Please enter a valid phone number (10-15 digits, optionally starting with +)"
      );
      return;
    }

    try {
      setLoading(true); // Start loading
      console.log("Attempting to register with:", {
        name,
        email,
        password: "***", // Hide password in logs
        rePassword: "***",
        phone,
      });
      const result = await AuthService.register(
        name,
        email,
        password,
        rePassword,
        phone
      );

      if (result.success) {
        console.log("Registration successful:", result.data);
        setError(""); // Clear any previous errors
        alert("Registration successful! Redirecting to login...");
        window.location.href = "/auth/login";
      } else {
        // Handle error response
        console.error("Registration failed:", result.error);
        console.log("Full result object:", result);
        console.log("Error data type:", typeof result.error?.data);
        console.log("Error data content:", result.error?.data);
        console.log("Error status:", result.error?.status);
        console.log("Error message:", result.error?.message);

        const errorData = result.error?.data;
        const errorStatus = result.error?.status;

        // Try to get the most specific error message
        let errorMessage = "Registration failed";

        // Check if there's a specific error message in the response
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.msg) {
          errorMessage = errorData.msg;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === "string") {
          errorMessage =
            errorData === "fail"
              ? "Registration failed. Please check your information."
              : errorData;
        } else if (errorStatus) {
          // Handle by status code
          switch (errorStatus) {
            case 400:
              errorMessage = "Invalid data provided. Please check all fields.";
              break;
            case 409:
              errorMessage =
                "Email already exists. Please use a different email.";
              break;
            case 422:
              errorMessage = "Validation failed. Please check your input.";
              break;
            default:
              errorMessage = `Registration failed (${errorStatus}). Please try again.`;
          }
        }

        console.log("Final error message:", errorMessage);
        setError(errorMessage);
      }
    } catch (err: any) {
      // This should rarely happen now, but just in case
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
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
          register now
        </h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="register-name"
              style={{ display: "block", marginBottom: 4 }}
            >
              Name :
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              htmlFor="register-email"
              style={{ display: "block", marginBottom: 4 }}
            >
              Email :
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // Clear error when user types
              }}
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
              htmlFor="register-password"
              style={{ display: "block", marginBottom: 4 }}
            >
              Password :
            </label>
            <input
              id="register-password"
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
            <label
              htmlFor="register-repassword"
              style={{ display: "block", marginBottom: 4 }}
            >
              Re-password :
            </label>
            <input
              id="register-repassword"
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
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
              htmlFor="register-phone"
              style={{ display: "block", marginBottom: 4 }}
            >
              Phone :
            </label>
            <input
              id="register-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: 6,
                border: loading ? "1px solid #ccc" : "1px solid #007bff",
                background: loading ? "#f8f9fa" : "#007bff",
                color: loading ? "#6c757d" : "white",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontSize: "1rem",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#0056b3";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#007bff";
                }
              }}
            >
              {loading ? "Registering..." : "Register now"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span style={{ color: "#666" }}>Already have an account? </span>
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
