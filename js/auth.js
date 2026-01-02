// Authentication utilities for VLAT Exam Application
// Uses httpOnly cookies for secure authentication (XSS protection)

const API_BASE_URL = "https://vlat.api.thelead101.com";

/**
 * Get API base URL
 */
export function getApiUrl() {
  return API_BASE_URL;
}

/**
 * Get authorization headers (cookies sent automatically by browser)
 */
export function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    // No Authorization header needed - httpOnly cookie sent automatically
  };
}

/**
 * Check if user is authenticated by calling /api/user/me
 */
export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: 'include', // Critical - sends cookies with request
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Auth check successful, user:",
        data.data?.user?.email || "unknown"
      );
      return { authenticated: true, user: data.data.user };
    } else {
      // Cookie might be invalid or expired (backend clears it automatically)
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
      headers: getAuthHeaders(),
      credentials: 'include', // Critical - sends cookies with request
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.data.user };
    } else {
      // Cookie might be invalid or expired (backend clears it automatically)
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
    // Call backend to clear httpOnly cookie
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: 'include', // Send cookie to be cleared
      });
    } catch (error) {
      // Log error but continue with redirect
      console.log("Logout API call failed (non-critical):", error);
    }

    // Redirect to login page
    window.location.href = "login.html";
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
      credentials: 'include', // Critical - receive cookies from backend
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.success && data.data && data.data.user) {
        // Cookie is set automatically by backend - no token storage needed
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
      console.error("Registration failed:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      return { success: false, message: data.message || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration network error:", error);
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
      credentials: 'include', // Critical - receive cookies from backend
      body: JSON.stringify({ loginId, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Cookie is set automatically by backend - no token storage needed
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
      credentials: 'include',
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
        credentials: 'include',
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
      credentials: 'include',
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
