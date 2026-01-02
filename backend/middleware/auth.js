const User = require("../models/User");
const { verifyToken, extractTokenFromHeader } = require("../utils/jwt");

const requireAuth = async (req, res, next) => {
  try {
    // Read from cookie first (for browser requests), then header (for API clients)
    const token = req.cookies?.accessToken || 
                  extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // Clear invalid cookie
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      });
      
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

module.exports = requireAuth;
