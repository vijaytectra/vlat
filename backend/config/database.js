const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
