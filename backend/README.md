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

# Email Configuration (using Resend)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=onboarding@resend.dev
# Note: For production, verify your domain in Resend and use your verified email
```

**For Production (Render):**

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `SESSION_SECRET`: A strong random string (generate using `openssl rand -base64 32`)
- `PORT`: Render will set this automatically
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.netlify.app`)
- `RESEND_API_KEY`: Your Resend API key (get from https://resend.com/api-keys)
- `EMAIL_FROM`: Sender email address (use `onboarding@resend.dev` for testing, or your verified domain email for production)

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
- `RESEND_API_KEY` - Your Resend API key
- `EMAIL_FROM` - Sender email (use `onboarding@resend.dev` for testing)

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

## Resend Email Service Setup

This project uses [Resend](https://resend.com) for sending emails (welcome emails and password reset emails).

### Getting Started

1. Sign up for a free account at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys) and create a new API key
3. Copy your API key and set it as `RESEND_API_KEY` in your environment variables

### For Development/Testing

- Use `onboarding@resend.dev` as your `EMAIL_FROM` address (this works out of the box)
- Free tier: 100 emails per day

### For Production

1. Verify your domain in Resend dashboard
2. Update `EMAIL_FROM` to use your verified domain (e.g., `noreply@yourdomain.com`)
3. This improves deliverability and allows you to send more emails

**Benefits of Resend:**

- ✅ More reliable than SMTP on cloud hosting (no connection timeouts)
- ✅ Better deliverability
- ✅ Easy to set up (no SMTP configuration needed)
- ✅ Works great on Render, Heroku, Vercel, etc.

## Notes

- Sessions are stored in MongoDB using `connect-mongo`
- Passwords are hashed using bcryptjs (10 salt rounds)
- VLAT IDs are auto-generated in format: VLAT001, VLAT002, etc.
- CORS is configured to allow credentials (cookies)
- All user inputs are validated and sanitized
- Password reset tokens expire after 1 hour
- Reset tokens are one-time use (cleared after successful password reset)
