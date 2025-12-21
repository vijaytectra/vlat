// Results Page Logic
// Displays test results with score, breakdown, and question-by-question review

import { showError } from "./modal.js";
import {
  getProgress,
  getAllProgress,
  getProgressFromBackend,
  getAllProgressFromBackend,
} from "./test-state.js";
import { logout } from "./auth.js";

// Store current test data for button handlers
let currentSetId = null;
let currentProgress = null;
let allMockTests = [];

/**
 * Initialize results page
 */
async function initializeResults() {
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const setId = parseInt(urlParams.get("set"));
  const scoreFromUrl = urlParams.get("score")
    ? parseInt(urlParams.get("score"))
    : null;

  if (!setId || setId < 1 || setId > 6) {
    showError(
      "Invalid Results Data",
      "The results data is invalid. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  // Load progress data from backend (with localStorage fallback)
  const progress = await getProgressFromBackend(setId);
  if (!progress || progress.status !== "completed") {
    showError(
      "Results Not Found",
      "Test results not found. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  // Score is loaded from progress object, URL parameter is optional
  // This allows "View Results" from dashboard to work without score in URL

  // Load mock test data
  const mockSet = await loadMockTest(setId);
  if (!mockSet) {
    showError(
      "Test Data Not Found",
      "Unable to load test data. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  // Store for button handlers
  currentSetId = setId;
  currentProgress = progress;

  // Load all mock tests for next test functionality
  const allTests = await loadAllMockTests();
  if (allTests) {
    allMockTests = allTests;
  }

  // Display results
  displayResults(mockSet, progress);
}

/**
 * Load mock test data
 */
async function loadMockTest(setId) {
  try {
    const response = await fetch("data/mock-tests.json");
    if (!response.ok) throw new Error("Failed to fetch test data");

    const data = await response.json();
    return data.mockSets.find((set) => set.id === setId);
  } catch (error) {
    console.error("Error loading mock test:", error);
    return null;
  }
}

/**
 * Load all mock tests
 */
async function loadAllMockTests() {
  try {
    const response = await fetch("data/mock-tests.json");
    if (!response.ok) throw new Error("Failed to fetch test data");

    const data = await response.json();
    return data.mockSets;
  } catch (error) {
    console.error("Error loading all mock tests:", error);
    return null;
  }
}

/**
 * Get motivational message based on score
 */
function getMotivationalMessage(score) {
  if (score < 50) {
    return {
      title: "Keep Practicing! 💪",
      text: "Don't worry! Every attempt makes you stronger. Review and try again!",
    };
  } else if (score >= 50 && score <= 80) {
    return {
      title: "Good Progress! 🎯",
      text: "You're improving! Review your mistakes and keep going!",
    };
  } else {
    return {
      title: "Excellent Work! 🎉",
      text: "Outstanding performance! Keep up the great work!",
    };
  }
}

/**
 * Get next available test
 */
async function getNextAvailableTest(currentSetId) {
  const allProgress = await getAllProgressFromBackend();

  // Find next test that is not completed (not_started or in_progress)
  for (let i = currentSetId + 1; i <= 6; i++) {
    const progress = allProgress[i.toString()];
    // Return test if no progress exists or status is not completed
    if (!progress || progress.status !== "completed") {
      return i;
    }
  }

  // If no next test found, return null
  return null;
}

/**
 * Display results on page
 */
function displayResults(mockSet, progress) {
  const questions = mockSet.questions;
  const answers = progress.answers || {};

  // Calculate statistics
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) {
      unanswered++;
    } else if (userAnswer === question.correctAnswer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const score = progress.score || 0;
  const totalQuestions = questions.length;

  // Update test name
  const testName = document.getElementById("testName");
  if (testName) testName.textContent = mockSet.title;

  // Update motivational message
  const motivational = getMotivationalMessage(score);
  const motivationalTitle = document.getElementById("motivationalTitle");
  const motivationalText = document.getElementById("motivationalText");
  if (motivationalTitle) motivationalTitle.textContent = motivational.title;
  if (motivationalText) motivationalText.textContent = motivational.text;

  // Update score display
  const scoreDisplay = document.getElementById("scoreDisplay");
  const scoreDetails = document.getElementById("scoreDetails");
  if (scoreDisplay) scoreDisplay.textContent = `${score}%`;
  if (scoreDetails) {
    scoreDetails.textContent = `${correct} out of ${totalQuestions} questions correct`;
  }

  // Update retake button
  updateRetakeButton(progress);

  // Update review answers button
  updateReviewAnswersButton(progress);

  // Update next test button (async)
  updateNextTestButton(currentSetId);

  // Setup logout button
  setupLogoutButton();
}

/**
 * Update retake button based on attempts
 */
function updateRetakeButton(progress) {
  const retakeBtn = document.getElementById("retakeTestBtn");
  const retakeText = document.getElementById("retakeTestText");

  if (!retakeBtn || !retakeText) return;

  const attempts = progress.attempts || 0;
  const maxAttempts = progress.maxAttempts || 3;
  const remainingAttempts = maxAttempts - attempts;

  if (remainingAttempts > 0) {
    retakeBtn.disabled = false;
    retakeText.textContent = `Retake Test (${remainingAttempts} left)`;
  } else {
    retakeBtn.disabled = true;
    retakeText.textContent = "All attempts used";
  }
}

/**
 * Update review answers button based on attempts
 */
function updateReviewAnswersButton(progress) {
  const reviewBtn = document.getElementById("reviewAnswersBtn");
  const reviewBtnSpan = reviewBtn?.querySelector("span");

  if (!reviewBtn || !reviewBtnSpan) return;

  const attempts = progress.attempts || 0;
  const maxAttempts = progress.maxAttempts || 3;
  const allAttemptsCompleted = attempts >= maxAttempts;
  const remainingAttempts = maxAttempts - attempts;

  if (allAttemptsCompleted) {
    // All attempts completed - enable button
    reviewBtn.disabled = false;
    reviewBtnSpan.textContent = "Review Answers";
    reviewBtn.title = "View detailed answers and explanations";
  } else {
    // Not all attempts completed - disable button
    reviewBtn.disabled = true;
    reviewBtnSpan.textContent = `Complete all 3 attempts to view answers `;
    reviewBtn.title = `You need to complete all ${maxAttempts} attempts before viewing answers. ${remainingAttempts} attempt${
      remainingAttempts > 1 ? "s" : ""
    } remaining.`;
  }
}

/**
 * Update next test button
 */
async function updateNextTestButton(currentSetId) {
  const nextTestBtn = document.getElementById("nextTestBtn");
  if (!nextTestBtn) return;

  const nextTestId = await getNextAvailableTest(currentSetId);

  if (nextTestId) {
    nextTestBtn.onclick = () => {
      window.location.href = `instructions.html?set=${nextTestId}`;
    };
  } else {
    // All tests completed, go to dashboard
    nextTestBtn.onclick = () => {
      window.location.href = "dashboard.html";
    };
    nextTestBtn.querySelector("span").textContent = "Back to Dashboard";
  }
}

/**
 * Handle retake test button click
 */
window.handleRetakeTest = async function () {
  if (!currentSetId) return;

  try {
    const { clearTestState, getProgress, saveProgress } = await import(
      "./test-state.js"
    );

    // Clear the in-progress test state
    clearTestState(currentSetId);

    // Get existing progress
    const progress = getProgress(currentSetId);

    if (progress && progress.status === "completed") {
      // Store previous attempt data
      const previousAttempts = progress.previousAttempts || [];
      previousAttempts.push({
        score: progress.score,
        submittedAt: progress.submittedAt,
        attemptNumber: progress.attempts,
      });

      // Reset status to allow new attempt
      saveProgress(currentSetId, {
        ...progress,
        status: "not_started",
        previousAttempts: previousAttempts,
        answers: {},
        markedForReview: [],
        score: undefined,
        submittedAt: undefined,
      });
    }

    // Navigate to instructions
    window.location.href = `instructions.html?set=${currentSetId}`;
  } catch (error) {
    console.error("Error retaking test:", error);
    window.location.href = `instructions.html?set=${currentSetId}`;
  }
};

/**
 * Handle next test button click
 */
window.handleNextTest = async function () {
  const nextTestId = await getNextAvailableTest(currentSetId);

  if (nextTestId) {
    window.location.href = `instructions.html?set=${nextTestId}`;
  } else {
    window.location.href = "dashboard.html";
  }
};

/**
 * Handle review answers button click
 */
window.handleReviewAnswers = function () {
  if (!currentSetId || !currentProgress) return;

  const attempts = currentProgress.attempts || 0;
  const maxAttempts = currentProgress.maxAttempts || 3;

  // Check if all attempts are completed
  if (attempts < maxAttempts) {
    const remainingAttempts = maxAttempts - attempts;
    showError(
      "Complete All Attempts",
      `You must complete all ${maxAttempts} attempts before viewing answers. You have completed ${attempts} out of ${maxAttempts} attempts. ${remainingAttempts} attempt${
        remainingAttempts > 1 ? "s" : ""
      } remaining.`
    );
    return;
  }

  // All attempts completed - allow navigation
  window.location.href = `review-answers.html?set=${currentSetId}`;
};

/**
 * Setup logout button
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await logout();
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeResults);
} else {
  initializeResults();
}
