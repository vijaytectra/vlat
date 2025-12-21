const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Logout route
router.post("/logout", authController.logout);

// Forgot password route
router.post("/forgot-password", authController.forgotPassword);

// Verify reset token route
router.get("/verify-reset-token", authController.verifyResetToken);

// Reset password route
router.post("/reset-password", authController.resetPassword);

module.exports = router;
