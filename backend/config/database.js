const mongoose = require("mongoose");

// Cache connection for serverless environments (Vercel)
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available (serverless optimization)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clean up orphaned username index if it exists
    try {
      const db = conn.connection.db;
      const usersCollection = db.collection("users");
      const indexes = await usersCollection.indexes();

      // Check if username_1 index exists
      const usernameIndex = indexes.find(
        (index) => index.name === "username_1"
      );
      if (usernameIndex) {
        console.log("Removing orphaned username_1 index...");
        await usersCollection.dropIndex("username_1");
        console.log("Successfully removed username_1 index");
      }
    } catch (indexError) {
      // If index doesn't exist or already removed, that's fine
      if (indexError.code !== 27 && indexError.codeName !== "IndexNotFound") {
        console.warn(
          "Warning: Could not remove username index:",
          indexError.message
        );
      }
    }

    // Handle connection events for serverless
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      cachedConnection = null;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      cachedConnection = null;
    });

    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    cachedConnection = null;
    // Don't exit process in serverless - let Vercel handle it
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
