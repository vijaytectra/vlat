require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const testRoutes = require("./routes/test");

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5500",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      // In production with HTTPS, use secure: true and sameSite: "none" for cross-origin
      // In development or same-origin, use secure: false and sameSite: "lax"
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.FORCE_SECURE_COOKIE !== "false",
      sameSite:
        process.env.NODE_ENV === "production" &&
        process.env.FORCE_SECURE_COOKIE !== "false"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // Don't set domain unless you need to share cookies across subdomains
      // Setting domain can cause issues with cross-origin requests
      domain: process.env.COOKIE_DOMAIN || undefined,
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/test", testRoutes);

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
      cookieSettings: {
        secure:
          process.env.NODE_ENV === "production" &&
          process.env.FORCE_SECURE_COOKIE !== "false",
        sameSite:
          process.env.NODE_ENV === "production" &&
          process.env.FORCE_SECURE_COOKIE !== "false"
            ? "none"
            : "lax",
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
