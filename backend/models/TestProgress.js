const mongoose = require("mongoose");

// TestAttempt schema (embedded in TestProgress)
const testAttemptSchema = new mongoose.Schema(
  {
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    answers: {
      type: Map,
      of: String, // questionId -> selectedOption
      default: new Map(),
    },
    markedForReview: {
      type: [Number], // Array of question IDs
      default: [],
    },
    timeSpent: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
  },
  { _id: false }
); // Disable _id for embedded documents

// TestProgress schema
const testProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  setId: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started",
  },
  attempts: {
    type: [testAttemptSchema],
    default: [],
  },
  maxAttempts: {
    type: Number,
    default: 3,
  },
  currentAttempt: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one progress document per user per test set
testProgressSchema.index({ userId: 1, setId: 1 }, { unique: true });

// Update updatedAt before saving
testProgressSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get latest attempt
testProgressSchema.methods.getLatestAttempt = function () {
  if (this.attempts.length === 0) return null;
  return this.attempts[this.attempts.length - 1];
};

// Method to get best score
testProgressSchema.methods.getBestScore = function () {
  if (this.attempts.length === 0) return 0;
  return Math.max(...this.attempts.map((attempt) => attempt.score));
};

module.exports = mongoose.model("TestProgress", testProgressSchema);
