const { sendContactEmail } = require("../utils/emailService");

/**
 * Submit contact form
 * Validates form data and sends email notification
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, email, countryCode, mobile, queryType, message, agree } =
      req.body;

    // Validate required fields
    if (!name || !email || !countryCode || !mobile || !agree) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields and accept the agreement.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Validate phone number (basic validation - digits only, 6-15 digits)
    const phoneRegex = /^\d{6,15}$/;
    const cleanedMobile = mobile.replace(/\s+/g, "").trim();
    if (!phoneRegex.test(cleanedMobile)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid mobile number (6-15 digits, no spaces or special characters).",
      });
    }

    // Validate country code format
    const countryCodeRegex = /^\+\d{1,4}$/;
    if (!countryCodeRegex.test(countryCode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid country code.",
      });
    }

    // Sanitize inputs (basic sanitization)
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedCountryCode = countryCode.trim();
    const sanitizedMobile = cleanedMobile;
    const sanitizedQueryType = queryType ? queryType.trim() : "";
    const sanitizedMessage = message ? message.trim() : "";

    // Validate name length
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters.",
      });
    }

    // Validate message length if provided
    if (sanitizedMessage && sanitizedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message must not exceed 2000 characters.",
      });
    }

    // Prepare contact data
    const contactData = {
      name: sanitizedName,
      email: sanitizedEmail,
      countryCode: sanitizedCountryCode,
      mobile: sanitizedMobile,
      queryType: sanitizedQueryType,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    };

    // Send email
    try {
      await sendContactEmail(contactData);
      console.log("[Contact Controller] Contact form email sent successfully");

      return res.status(200).json({
        success: true,
        message: "Thank you for contacting us! We'll get back to you soon.",
      });
    } catch (emailError) {
      console.error("[Contact Controller] Error sending contact email:", {
        error: emailError.message,
        stack: emailError.stack,
      });

      // Don't expose internal email errors to user
      // Log the error but return success to user
      return res.status(200).json({
        success: true,
        message: "Thank you for contacting us! We'll get back to you soon.",
      });
    }
  } catch (error) {
    console.error("[Contact Controller] Unexpected error:", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = {
  submitContactForm,
};

