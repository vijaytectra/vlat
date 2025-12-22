# VLAT Backend API

Backend API for VLAT Exam Application built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/vlat_exam
SESSION_SECRET=your-secret-key-change-this-in-production
PORT=3000
FRONTEND_URL=http://localhost:5500

# Email Configuration (using Nodemailer with SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
# Note: For Gmail, you need to generate an App Password (not your regular password)
```

**For Production (Render):**

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `SESSION_SECRET`: A strong random string (generate using `openssl rand -base64 32`)
- `PORT`: Render will set this automatically
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.netlify.app`)
- `SMTP_HOST`: SMTP server hostname (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`)
- `SMTP_PORT`: SMTP port (587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Set to `true` for port 465 (SSL), `false` for port 587 (TLS)
- `SMTP_USER`: Your SMTP username/email
- `SMTP_PASSWORD`: Your SMTP password or app password
- `EMAIL_FROM`: Sender email address (usually same as SMTP_USER)

### 3. Run the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, contactNumber, password, confirmPassword }`
- `POST /api/auth/login` - Login user
  - Body: `{ loginId, password }` (loginId can be email or VLAT ID)
- `POST /api/auth/logout` - Logout user

- `POST /api/auth/forgot-password` - Request password reset
  - Body: `{ email }`
- `GET /api/auth/verify-reset-token` - Verify reset token validity
  - Query params: `token` and `email`
- `POST /api/auth/reset-password` - Reset password with token
  - Body: `{ token, email, password, confirmPassword }`

### User Data

- `GET /api/user/me` - Get current user data (requires authentication)

### Health Check

- `GET /api/health` - Server health check

## Deployment on Render

### 1. Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Select the `backend` folder as the root directory

### 2. Configure Build Settings

- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3. Set Environment Variables

Add the following environment variables in Render:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `SESSION_SECRET` - A strong random secret
- `FRONTEND_URL` - Your frontend URL
- `NODE_ENV` - Set to `production`
- `SMTP_HOST` - SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (587 or 465)
- `SMTP_SECURE` - `true` for SSL (465), `false` for TLS (587)
- `SMTP_USER` - Your email address
- `SMTP_PASSWORD` - Your app password or SMTP password
- `EMAIL_FROM` - Sender email address

### 4. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render)
5. Get your connection string and use it as `MONGODB_URI`

### 5. Update Frontend API URL

After deploying, update the `API_BASE_URL` in `js/auth.js` with your Render backend URL.

## Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── authController.js # Authentication logic
│   └── userController.js # User data logic
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   └── User.js          # User schema
├── routes/
│   ├── auth.js          # Auth routes
│   └── user.js          # User routes
├── server.js            # Express server
├── package.json
└── .env                 # Environment variables (not committed)
```

## Email Service Setup (Nodemailer with SMTP)

This project uses [Nodemailer](https://nodemailer.com) with SMTP for sending emails (welcome emails and password reset emails).

### Option 1: Gmail SMTP (Recommended for Development)

**Setup Steps:**

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. Configure environment variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

**Gmail Limits:**
- Free accounts: 500 emails per day
- Works reliably on cloud hosting (Render, Heroku, etc.)

### Option 2: SendGrid SMTP (Recommended for Production)

**Setup Steps:**

1. Sign up at [SendGrid](https://sendgrid.com) (free tier: 100 emails/day)
2. Create an API Key:
   - Settings → API Keys → Create API Key
   - Choose "Full Access" or "Mail Send" permissions
   - Copy the API key

3. Configure environment variables:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**SendGrid Benefits:**
- ✅ Better deliverability
- ✅ Higher sending limits (upgradeable)
- ✅ Email analytics
- ✅ No domain verification needed for basic use

### Option 3: Custom SMTP Server

If you have your own SMTP server or use another provider:

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
```

**Common SMTP Providers:**
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Zoho**: `smtp.zoho.com:587`
- **Custom**: Use your hosting provider's SMTP settings

### Troubleshooting

**Authentication Failed (EAUTH):**
- For Gmail: Make sure you're using an App Password, not your regular password
- Check that 2-Step Verification is enabled (Gmail)
- Verify SMTP_USER and SMTP_PASSWORD are correct

**Connection Failed (ECONNECTION):**
- Check SMTP_HOST and SMTP_PORT are correct
- Verify firewall/network allows SMTP connections
- Try port 465 with SMTP_SECURE=true if 587 doesn't work

**Email Not Received:**
- Check spam/junk folder
- Verify recipient email is correct
- Check SMTP provider's sending limits
- Review server logs for error messages

## Notes

- Sessions are stored in MongoDB using `connect-mongo`
- Passwords are hashed using bcryptjs (10 salt rounds)
- VLAT IDs are auto-generated in format: VLAT001, VLAT002, etc.
- CORS is configured to allow credentials (cookies)
- All user inputs are validated and sanitized
- Password reset tokens expire after 1 hour
- Reset tokens are one-time use (cleared after successful password reset)
