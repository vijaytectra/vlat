const TestProgress = require("../models/TestProgress");

/**
 * Convert MongoDB document to JSON-friendly format
 * Converts Map objects to plain objects
 */
function convertProgressToJSON(progress) {
  if (!progress) return null;

  const progressObj = progress.toObject ? progress.toObject() : progress;

  // Convert attempts array, converting Map to object for answers
  if (progressObj.attempts && Array.isArray(progressObj.attempts)) {
    progressObj.attempts = progressObj.attempts.map((attempt) => {
      const attemptObj = { ...attempt };
      // Convert Map to plain object if it's a Map
      if (attemptObj.answers instanceof Map) {
        attemptObj.answers = Object.fromEntries(attemptObj.answers);
      } else if (
        attemptObj.answers &&
        typeof attemptObj.answers === "object" &&
        !Array.isArray(attemptObj.answers)
      ) {
        // Already an object, keep as is
        attemptObj.answers = attemptObj.answers;
      }
      return attemptObj;
    });
  }

  return progressObj;
}

/**
 * Get progress for a specific test set
 */
exports.getProgress = async (req, res) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;

    if (!setId || setId < 1 || setId > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid test set ID",
      });
    }

    let progress = await TestProgress.findOne({
      userId,
      setId: parseInt(setId),
    });

    // If no progress exists, create a default one
    if (!progress) {
      progress = await TestProgress.create({
        userId,
        setId: parseInt(setId),
        status: "not_started",
        attempts: [],
        maxAttempts: 3,
        currentAttempt: 0,
      });
    }

    res.json({
      success: true,
      data: {
        progress: convertProgressToJSON(progress),
      },
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all test progress for the user
 */
exports.getAllProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const allProgress = await TestProgress.find({ userId }).sort({ setId: 1 });

    // Ensure progress exists for all 6 test sets
    const progressMap = {};
    allProgress.forEach((p) => {
      progressMap[p.setId] = p;
    });

    // Create missing progress entries
    for (let i = 1; i <= 6; i++) {
      if (!progressMap[i]) {
        const newProgress = await TestProgress.create({
          userId,
          setId: i,
          status: "not_started",
          attempts: [],
          maxAttempts: 3,
          currentAttempt: 0,
        });
        progressMap[i] = newProgress;
      }
    }

    const progressArray = Object.values(progressMap)
      .sort((a, b) => a.setId - b.setId)
      .map((p) => convertProgressToJSON(p));

    res.json({
      success: true,
      data: {
        progress: progressArray,
      },
    });
  } catch (error) {
    console.error("Get all progress error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Save/update test progress (for in-progress tests)
 */
exports.saveProgress = async (req, res) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;
    const { status, answers, markedForReview, currentQuestionIndex } = req.body;

    if (!setId || setId < 1 || setId > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid test set ID",
      });
    }

    let progress = await TestProgress.findOne({
      userId,
      setId: parseInt(setId),
    });

    if (!progress) {
      progress = await TestProgress.create({
        userId,
        setId: parseInt(setId),
        status: status || "in_progress",
        attempts: [],
        maxAttempts: 3,
        currentAttempt: 0,
      });
    } else {
      // Update status if provided
      if (status) {
        progress.status = status;
      }
    }

    await progress.save();

    res.json({
      success: true,
      data: {
        progress: convertProgressToJSON(progress),
      },
    });
  } catch (error) {
    console.error("Save progress error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Submit test and create attempt
 */
exports.submitTest = async (req, res) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;
    const { score, answers, markedForReview, timeSpent, submittedAt } =
      req.body;

    if (!setId || setId < 1 || setId > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid test set ID",
      });
    }

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid score",
      });
    }

    let progress = await TestProgress.findOne({
      userId,
      setId: parseInt(setId),
    });

    // Check attempt limit
    const currentAttempts = progress ? progress.attempts.length : 0;
    const maxAttempts = progress ? progress.maxAttempts : 3;

    if (currentAttempts >= maxAttempts) {
      return res.status(400).json({
        success: false,
        message: "Maximum attempts reached",
      });
    }

    // Create new attempt
    const newAttemptNumber = currentAttempts + 1;

    // Convert answers object to Map format for MongoDB
    const answersMap = new Map();
    if (answers && typeof answers === "object") {
      Object.entries(answers).forEach(([key, value]) => {
        answersMap.set(key, value);
      });
    }

    const newAttempt = {
      attemptNumber: newAttemptNumber,
      score: Math.round(score),
      answers: answersMap,
      markedForReview: markedForReview || [],
      timeSpent: timeSpent || 0,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      status: "completed",
    };

    if (!progress) {
      // Create new progress
      progress = await TestProgress.create({
        userId,
        setId: parseInt(setId),
        status: "completed",
        attempts: [newAttempt],
        maxAttempts: 3,
        currentAttempt: newAttemptNumber,
      });
    } else {
      // Add attempt to existing progress
      progress.attempts.push(newAttempt);
      progress.status = "completed";
      progress.currentAttempt = newAttemptNumber;
      await progress.save();
    }

    res.json({
      success: true,
      data: {
        progress: convertProgressToJSON(progress),
        attempt: {
          ...newAttempt,
          answers: Object.fromEntries(newAttempt.answers),
        },
      },
    });
  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get user statistics
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const allProgress = await TestProgress.find({ userId });

    let testsCompleted = 0;
    let totalAttempts = 0;
    const scores = [];

    allProgress.forEach((progress) => {
      if (progress.status === "completed") {
        testsCompleted++;
      }
      totalAttempts += progress.attempts.length;
      progress.attempts.forEach((attempt) => {
        scores.push(attempt.score);
      });
    });

    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
          )
        : 0;

    res.json({
      success: true,
      data: {
        stats: {
          testsCompleted,
          totalAttempts,
          bestScore,
          averageScore,
        },
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
