const User = require("../models/User");
const crypto = require("crypto");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");

// Validation helpers
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!minLength) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!hasUpperCase) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!hasLowerCase) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!hasNumber) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!hasSpecialChar) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { valid: true };
};

const validateContactNumber = (contactNumber) => {
  const cleaned = contactNumber.trim().replace(/\D/g, "");
  if (cleaned.length !== 10) {
    return {
      valid: false,
      message: "Contact number must be exactly 10 digits",
    };
  }
  return { valid: true, cleaned };
};

// Generate VLAT ID
const generateVLATId = async () => {
  try {
    // Find the highest existing VLAT ID number
    const users = await User.find({ vlatId: { $exists: true } })
      .select("vlatId")
      .sort({ vlatId: -1 })
      .limit(1);

    let nextNumber = 1;

    if (users.length > 0 && users[0].vlatId) {
      // Extract number from VLAT ID (e.g., "VLAT001" -> 1)
      const match = users[0].vlatId.match(/\d+/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    // Format with zero-padding (3 digits)
    const vlatId = `VLAT${nextNumber.toString().padStart(3, "0")}`;

    // Check if it already exists (shouldn't happen, but safety check)
    const exists = await User.findOne({
      vlatId: { $regex: new RegExp(`^${vlatId}$`, "i") },
    });
    if (exists) {
      // If exists, try next number
      return await generateVLATId();
    }

    return vlatId;
  } catch (error) {
    console.error("Error generating VLAT ID:", error);
    throw new Error("Failed to generate VLAT ID");
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, contactNumber, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !contactNumber || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Trim and sanitize inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContact = contactNumber.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate contact number
    const contactValidation = validateContactNumber(trimmedContact);
    if (!contactValidation.valid) {
      return res.status(400).json({
        success: false,
        message: contactValidation.message,
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate VLAT ID
    const vlatId = await generateVLATId();

    // Create user
    const user = new User({
      name: trimmedName,
      email: trimmedEmail,
      contactNumber: contactValidation.cleaned,
      password,
      vlatId,
    });

    await user.save();

    // Send welcome email asynchronously (don't block registration if email fails)
    // Use setImmediate to make it truly non-blocking
    setImmediate(async () => {
      try {
        await sendWelcomeEmail(trimmedEmail, trimmedName, vlatId);
        console.log(`Welcome email sent successfully to ${trimmedEmail}`);
      } catch (emailError) {
        // Log error but don't fail registration
        console.warn(
          `Welcome email failed for ${trimmedEmail}:`,
          emailError.message || "Email service unavailable"
        );
        // Registration still succeeds even if email fails
      }
    });

    // Create session
    req.session.userId = user._id;

    // Return user data without password
    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      // Duplicate key error
      const keyPattern = error.keyPattern || {};
      let message = "Email or VLAT ID already exists";

      // Provide more specific error messages based on which field caused the duplicate
      if (keyPattern.email) {
        message = "Email already registered. Please use a different email.";
      } else if (keyPattern.vlatId) {
        message = "VLAT ID already exists. Please try again.";
      } else if (keyPattern.username) {
        // This shouldn't happen after index cleanup, but handle it gracefully
        message = "Registration error. Please contact support.";
        console.error(
          "Username index error detected - index cleanup may be needed"
        );
      }

      return res.status(400).json({
        success: false,
        message: message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again later.",
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Validate required fields
    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Login ID/Email and password are required",
      });
    }

    // Trim and sanitize
    const trimmedLoginId = loginId.trim();

    // Find user by email or VLAT ID (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: trimmedLoginId.toLowerCase() },
        { vlatId: { $regex: new RegExp(`^${trimmedLoginId}$`, "i") } },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Create session
    req.session.userId = user._id;

    // Return user data without password
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
          success: false,
          message: "Error during logout",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// Forgot password - generate token and send email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: trimmedEmail });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetTokenExpiry);
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(trimmedEmail, resetToken, user.email);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Clear token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "If the email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify reset token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Token and email are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user with matching token and email
    const user = await User.findOne({
      email: trimmedEmail,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.json({
        success: false,
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      valid: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({
      success: false,
      valid: false,
      message: "Server error",
    });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password, confirmPassword } = req.body;

    if (!token || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user with matching token and email
    const user = await User.findOne({
      email: trimmedEmail,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    // Clear reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
