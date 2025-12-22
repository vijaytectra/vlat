// Authentication utilities for VLAT Exam Application
// Update API_BASE_URL with your Render backend URL when deploying

const API_BASE_URL = "https://vlat-backend.onrender.com";
/**
 * Get API base URL
 */
export function getApiUrl() {
  return API_BASE_URL;
}

/**
 * Check if user is authenticated by calling /api/user/me
 */
export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "GET",
      credentials: "include", // Include cookies
    });

    // Log response details for debugging
    console.log("Auth check response status:", response.status);
    console.log("Auth check response headers:", {
      "set-cookie": response.headers.get("set-cookie"),
      "content-type": response.headers.get("content-type"),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Auth check successful, user:",
        data.data?.user?.email || "unknown"
      );
      return { authenticated: true, user: data.data.user };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Auth check failed:", {
        status: response.status,
        statusText: response.statusText,
        message: errorData.message || "Unknown error",
      });
      return { authenticated: false, user: null };
    }
  } catch (error) {
    console.error("Auth check error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return { authenticated: false, user: null };
  }
}

/**
 * Get current user data
 */
export async function getUserData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.data.user };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to get user data",
      };
    }
  } catch (error) {
    console.error("Get user data error:", error);
    return { success: false, message: "Network error" };
  }
}

/**
 * Logout user
 */
export async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      // Redirect to login page
      window.location.href = "login.html";
    } else {
      console.error("Logout failed");
      // Still redirect to login page even if logout API fails
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect to login page
    window.location.href = "login.html";
  }
}

/**
 * Redirect to login if not authenticated
 */
export async function redirectIfNotAuth() {
  const auth = await checkAuth();
  if (!auth.authenticated) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/**
 * Register user
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Log response for debugging
    console.log("Registration response status:", response.status);
    console.log("Registration response data:", data);

    if (response.ok) {
      if (data.success && data.data && data.data.user) {
        return { success: true, user: data.data.user };
      } else {
        console.error("Unexpected response structure:", data);
        return {
          success: false,
          message:
            data.message ||
            "Registration succeeded but received unexpected response format",
        };
      }
    } else {
      // Log error details for debugging
      console.error("Registration failed:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      return { success: false, message: data.message || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration network error:", error);
    if (error.message) {
      console.error("Error message:", error.message);
    }
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Login user
 */
export async function login(loginId, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ loginId, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.data.user };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

/**
 * Request password reset
 */
export async function forgotPassword(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Password reset email sent",
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to send reset email",
      };
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

/**
 * Verify reset token
 */
export async function verifyResetToken(token, email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/verify-reset-token?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok && data.valid) {
      return { success: true, valid: true };
    } else {
      return {
        success: false,
        valid: false,
        message: data.message || "Invalid or expired token",
      };
    }
  } catch (error) {
    console.error("Verify token error:", error);
    return { success: false, valid: false, message: "Network error" };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token, email, password, confirmPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Password reset successfully",
      };
    } else {
      return {
        success: false,
        message: data.message || "Password reset failed",
      };
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}
