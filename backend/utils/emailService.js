const nodemailer = require("nodemailer");

/**
 * Email Service using multiple providers
 * Priority: Brevo API > SendGrid API > SMTP
 *
 * For cloud hosting (Render/Heroku/Vercel), use API-based providers:
 *   - BREVO_API_KEY (recommended - 300 free emails/day)
 *   - SENDGRID_API_KEY (100 free emails/day)
 *
 * For local development, SMTP works:
 *   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 */

/**
 * Send email using Brevo (Sendinblue) HTTP API
 * Free tier: 300 emails/day - works on cloud providers
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
const sendWithBrevoAPI = async (options) => {
  const apiKey = process.env.BREVO_API_KEY;

  // Validate API key exists
  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY environment variable is not set. Please add it in Render dashboard → Environment → Add Environment Variable."
    );
  }

  // Validate API key format (Brevo keys start with 'xkeysib-' and are ~70 chars)
  if (!apiKey.startsWith("xkeysib-") || apiKey.length < 60) {
    console.warn(
      "[Email Service] Warning: Brevo API key format looks incorrect. Should start with 'xkeysib-' and be ~70 characters long."
    );
  }

  // Log first 10 chars for debugging (never log full key)
  console.log(
    `[Email Service] Using Brevo API key: ${apiKey.substring(0, 10)}...`
  );

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: options.fromName || "VLAT Exam",
        email: options.fromEmail,
      },
      to: [
        {
          email: options.to,
        },
      ],
      subject: options.subject,
      htmlContent: options.html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("[Email Service] Brevo API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorData,
      apiKeyPrefix: apiKey.substring(0, 10) + "...",
    });

    // Provide helpful error messages
    if (response.status === 401) {
      if (errorData.message === "Key not found") {
        throw new Error(
          "Brevo API key is invalid or not found. Please verify:\n" +
            "1. Go to https://app.brevo.com/settings/keys/api\n" +
            "2. Create a new API key with 'Send emails' permission\n" +
            "3. Copy the full key (starts with 'xkeysib-')\n" +
            "4. Add it to Render as BREVO_API_KEY environment variable\n" +
            "5. Redeploy your service"
        );
      }
      throw new Error(
        `Brevo API authentication failed. Check your API key is correct and has 'Send emails' permission.`
      );
    }

    throw new Error(
      `Brevo API error: ${response.status} - ${
        errorData.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.messageId || "brevo-accepted",
  };
};

/**
 * Send email using SendGrid's HTTP API
 * Free tier: 100 emails/day - works on cloud providers
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
const sendWithSendGridAPI = async (options) => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY environment variable is required");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: options.to }],
        },
      ],
      from: {
        email: options.fromEmail,
        name: options.fromName || "VLAT Exam",
      },
      subject: options.subject,
      content: [
        {
          type: "text/html",
          value: options.html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Email Service] SendGrid API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `SendGrid API error: ${response.status} ${response.statusText}`
    );
  }

  return {
    success: true,
    messageId: response.headers.get("x-message-id") || "sendgrid-accepted",
  };
};

/**
 * Send email using SMTP (Nodemailer)
 * Works locally but blocked on most cloud providers
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
const sendWithSMTP = async (options) => {
  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  };

  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    throw new Error(
      "SMTP configuration missing. Required: SMTP_USER, SMTP_PASSWORD"
    );
  }

  const transporter = nodemailer.createTransport(smtpConfig);

  if (process.env.NODE_ENV !== "production") {
    try {
      await transporter.verify();
      console.log("[Email Service] SMTP connection verified");
    } catch (error) {
      console.error("[Email Service] SMTP verification failed:", error.message);
      throw new Error(`SMTP connection failed: ${error.message}`);
    }
  }

  const info = await transporter.sendMail({
    from: `"${options.fromName || "VLAT Exam"}" <${options.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  return { success: true, messageId: info.messageId };
};

/**
 * Send email using the best available method
 * Priority: Brevo API > SendGrid API > SMTP
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
const sendEmail = async (options) => {
  // Priority 1: Brevo API (300 free emails/day, works on cloud)
  if (process.env.BREVO_API_KEY) {
    console.log("[Email Service] Using Brevo API");
    return await sendWithBrevoAPI(options);
  }

  // Priority 2: SendGrid API (100 free emails/day, works on cloud)
  if (process.env.SENDGRID_API_KEY) {
    console.log("[Email Service] Using SendGrid API");
    return await sendWithSendGridAPI(options);
  }

  // Priority 3: SMTP (works locally, blocked on most cloud providers)
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    console.log("[Email Service] Using SMTP");
    return await sendWithSMTP(options);
  }

  throw new Error(
    "No email configuration found. Set BREVO_API_KEY, SENDGRID_API_KEY, or SMTP credentials."
  );
};

/**
 * Gets the FROM email address from environment
 * @returns {string} FROM email address
 */
const getFromEmail = () => {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@vlat.com";
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userEmail) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5500";
    const resetLink = `${frontendUrl}/reset-password.html?token=${resetToken}&email=${encodeURIComponent(
      userEmail
    )}`;

    const emailFrom = getFromEmail();

    console.log(
      `[Email Service] Sending password reset email from ${emailFrom} to ${userEmail}`
    );

    const result = await sendEmail({
      to: userEmail,
      fromEmail: emailFrom,
      fromName: "VLAT Exam",
      subject: "VLAT - Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            h1 {
              color: #8D191C;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            p {
              margin-bottom: 15px;
              color: #525252;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .reset-button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #8D191C;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
            }
            .link-text {
              word-break: break-all;
              color: #8D191C;
              font-size: 12px;
              margin-top: 20px;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              font-size: 12px;
              color: #737373;
            }
            .warning {
              background-color: #fff6e2;
              border-left: 4px solid #EDCD88;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .warning-text {
              color: #8D191C;
              font-size: 14px;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your VLAT account. If you made this request, please click the button below to reset your password:</p>
              
              <div class="button-container">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="link-text">${resetLink}</div>
              
              <div class="warning">
                <p class="warning-text">
                  <strong>Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
                </p>
              </div>
              
              <p>For security reasons, if you did not request this password reset, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>VLAT - Vinayaka Mission's Law Admission Test</p>
              <p>Need help? Contact us at admissions@vmls.edu.in or +91 73582 01234</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email Service] Password reset email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("[Email Service] Error sending password reset email:", {
      message: error.message,
      code: error.code,
    });

    throw new Error(
      error.message ||
        "Failed to send password reset email. Please try again later."
    );
  }
};

// Send welcome email with VLAT ID
const sendWelcomeEmail = async (userEmail, userName, vlatId) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5500";
    const loginUrl = `${frontendUrl}/login.html`;
    const emailFrom = getFromEmail();

    console.log(
      `[Email Service] Sending welcome email from ${emailFrom} to ${userEmail}`
    );

    const result = await sendEmail({
      to: userEmail,
      fromEmail: emailFrom,
      fromName: "VLAT Exam",
      subject: "Welcome to VLAT - Your Registration is Complete!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #FFF6E5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #8D191C;
            }
            h1 {
              color: #8D191C;
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            .subtitle {
              color: #525252;
              font-size: 16px;
              margin-top: 5px;
            }
            .content {
              margin-bottom: 30px;
            }
            p {
              margin-bottom: 15px;
              color: #525252;
              font-size: 15px;
            }
            .vlat-id-container {
              background: linear-gradient(135deg, #8D191C 0%, #6d1316 100%);
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
              box-shadow: 0 4px 6px rgba(141, 25, 28, 0.2);
            }
            .vlat-id-label {
              color: #EDCD88;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .vlat-id-value {
              color: #ffffff;
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 2px;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background-color: #FFF6E5;
              border-left: 4px solid #EDCD88;
              padding: 20px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .info-box-title {
              color: #8D191C;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .info-box-content {
              color: #525252;
              font-size: 14px;
              margin: 0;
            }
            .info-box-content ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .info-box-content li {
              margin-bottom: 8px;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .login-button {
              display: inline-block;
              padding: 14px 35px;
              background-color: #8D191C;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              text-align: center;
              font-size: 12px;
              color: #737373;
            }
            .contact-info {
              margin-top: 15px;
              padding: 15px;
              background-color: #F3F4F6;
              border-radius: 8px;
            }
            .contact-info p {
              margin: 5px 0;
              font-size: 13px;
            }
            .contact-info a {
              color: #8D191C;
              text-decoration: none;
            }
            .highlight {
              color: #8D191C;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to VLAT!</h1>
              <p class="subtitle">Vinayaka Mission's Law Admission Test</p>
            </div>
            <div class="content">
              <p>Dear <span class="highlight">${userName}</span>,</p>
              
              <p>Congratulations! Your registration for the VLAT Entrance Exam has been successfully completed.</p>
              
              <div class="vlat-id-container">
                <div class="vlat-id-label">Your VLAT ID</div>
                <div class="vlat-id-value">${vlatId}</div>
              </div>
              
              <p>Please save this VLAT ID securely. You will need it to log in to your account and access the exam.</p>
              
              <div class="info-box">
                <div class="info-box-title">📋 Login Instructions</div>
                <div class="info-box-content">
                  <p>You can log in to your account using either:</p>
                  <ul>
                    <li>Your registered email address: <span class="highlight">${userEmail}</span></li>
                    <li>Your VLAT ID: <span class="highlight">${vlatId}</span></li>
                  </ul>
                  <p>Use the password you created during registration.</p>
                </div>
              </div>
              
              <div class="button-container">
                <a href="${loginUrl}" class="login-button">Login to Your Account</a>
              </div>
              
              <div class="info-box">
                <div class="info-box-title">📝 Next Steps</div>
                <div class="info-box-content">
                  <p>After logging in, you can:</p>
                  <ul>
                    <li>Review the exam instructions</li>
                    <li>Take practice mock tests</li>
                    <li>Access your dashboard</li>
                    <li>View your test results</li>
                  </ul>
                </div>
              </div>
              
              <p>We're excited to have you on board and wish you the best of luck with your exam preparation!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <div class="contact-info">
                <p><strong>Need Help?</strong></p>
                <p>📧 Email: <a href="mailto:admissions@vmls.edu.in">admissions@vmls.edu.in</a></p>
                <p>📞 Phone: <a href="tel:+917358201234">+91 73582 01234</a></p>
              </div>
              <p style="margin-top: 20px;">VLAT - Vinayaka Mission's Law Admission Test</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email Service] Welcome email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("[Email Service] Error sending welcome email:", {
      message: error.message,
      code: error.code,
    });

    throw new Error(
      error.message || "Failed to send welcome email. Please try again later."
    );
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
