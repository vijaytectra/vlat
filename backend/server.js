require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const testRoutes = require("./routes/test");
const contactRoutes = require("./routes/contact");
const blogRoutes = require("./routes/blog");

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
// For cross-origin cookies to work, the origin must match exactly (no wildcards)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5501",
  "https://vlat.vercel.app",
  "https://vmls.edu.in",
  "https://vlat.thelead101.com",
  "https://vlat.api.thelead101.com",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy - REQUIRED for secure cookies behind reverse proxy (Render, Heroku, etc.)
// This must be set BEFORE session middleware
app.set("trust proxy", 1);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 24 hours
    }),
    cookie: {
      httpOnly: true,
      // For cross-origin requests (frontend on different domain than backend):
      // - secure: true is REQUIRED (cookies only sent over HTTPS)
      // - sameSite: "none" is REQUIRED (allow cross-origin cookies)
      // In development (localhost), we can use lax with secure: false
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// Debug route to check session (remove in production)
app.get("/api/debug/session", (req, res) => {
  res.json({
    success: true,
    data: {
      hasSession: !!req.session,
      sessionId: req.sessionID,
      userId: req.session?.userId || null,
      cookies: req.headers.cookie || "no cookies",
      origin: req.headers.origin || "no origin",
      cookieSettings: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "not set",
        frontendUrl: process.env.FRONTEND_URL || "not set",
        trustProxy: app.get("trust proxy"),
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
