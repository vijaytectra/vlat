const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    // Log session info for debugging
    console.log("Auth middleware - Session check:", {
      hasSession: !!req.session,
      hasUserId: !!(req.session && req.session.userId),
      sessionId: req.sessionID,
      cookies: req.headers.cookie ? "present" : "missing",
    });

    if (!req.session || !req.session.userId) {
      console.log("Auth failed: No session or userId");
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      console.log("Auth failed: User not found in database");
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Auth successful for user:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = requireAuth;
