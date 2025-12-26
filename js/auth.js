// Authentication utilities for VLAT Exam Application
// Update API_BASE_URL with your Vercel backend URL when deploying

const API_BASE_URL = "https://vlat.api.thelead101.com";

const TOKEN_KEY = "vlat_auth_token";

/**
 * Get API base URL
 */
export function getApiUrl() {
  return API_BASE_URL;
}

/**
 * Store JWT token in localStorage
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Get JWT token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove JWT token from localStorage
 */
export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get authorization headers with JWT token
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Check if user is authenticated by calling /api/user/me
 */
export async function checkAuth() {
  try {
    const token = getAuthToken();
    if (!token) {
      return { authenticated: false, user: null };
    }

    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Auth check successful, user:",
        data.data?.user?.email || "unknown"
      );
      return { authenticated: true, user: data.data.user };
    } else {
      // Token might be invalid or expired
      if (response.status === 401) {
        removeAuthToken();
      }
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
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.data.user };
    } else {
      if (response.status === 401) {
        removeAuthToken();
      }
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
    // Remove token from localStorage
    removeAuthToken();

    // Call logout endpoint (optional, for consistency)
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      // Ignore logout API errors, token is already removed
      console.log("Logout API call failed (non-critical):", error);
    }

    // Redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect to login page
    removeAuthToken();
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
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.success && data.data && data.data.user) {
        // Store JWT token from response
        if (data.data.token) {
          setAuthToken(data.data.token);
        }
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
      body: JSON.stringify({ loginId, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store JWT token from response
      if (data.data && data.data.token) {
        setAuthToken(data.data.token);
      }
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
