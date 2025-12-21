const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const testController = require("../controllers/testController");

// All routes require authentication
router.use(requireAuth);

// Get progress for a specific test set
router.get("/progress/:setId", testController.getProgress);

// Get all test progress for user
router.get("/progress", testController.getAllProgress);

// Save/update test progress (for in-progress tests)
router.post("/progress/:setId", testController.saveProgress);

// Submit test and create attempt
router.post("/submit/:setId", testController.submitTest);

// Get user statistics
router.get("/stats", testController.getStats);

module.exports = router;
