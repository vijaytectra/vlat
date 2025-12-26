// Mock Test Interface Logic
// Handles test interface, question navigation, answer selection, timer, and submission

import {
  saveTestState,
  loadTestState,
  clearTestState,
  saveProgress,
  getProgress,
  submitTestToBackend,
} from "./test-state.js";
import {
  showError,
  showInfo,
  showConfirm,
  showInput,
  showSubmitConfirm,
} from "./modal.js";
import { logout, getUserData } from "./auth.js";

/**
 * Get current language from translation system
 */
function getCurrentLanguage() {
  if (typeof window.getCurrentLanguage === "function") {
    return window.getCurrentLanguage();
  }
  const saved = localStorage.getItem("vlat_language");
  return saved || "en";
}

/**
 * Get localized text from bilingual object or string
 * Supports both old format (string) and new format ({en: "...", ta: "..."})
 */
function getLocalizedText(textObj, lang = null) {
  if (!textObj) return "";

  const currentLang = lang || getCurrentLanguage();

  // If it's already a string (old format), return as is
  if (typeof textObj === "string") {
    return textObj;
  }

  // If it's an object with language keys
  if (typeof textObj === "object") {
    // Try current language first
    if (textObj[currentLang]) {
      return textObj[currentLang];
    }
    // Fallback to English
    if (textObj.en) {
      return textObj.en;
    }
    // Fallback to Tamil
    if (textObj.ta) {
      return textObj.ta;
    }
    // Fallback to first available value
    const firstKey = Object.keys(textObj)[0];
    return textObj[firstKey] || "";
  }

  return "";
}

// Test state
let testState = {
  setId: null,
  currentQuestionIndex: 0,
  questions: [],
  answers: {}, // questionId -> selectedOption
  markedForReview: [],
  timer: {
    totalSeconds: 3600, // 60 minutes
    startTime: null,
    intervalId: null,
  },
  isSubmitted: false,
};

// DOM Elements (will be initialized on page load)
let elements = {};
let beforeUnloadHandler = null;

/**
 * Initialize the test interface
 */
export async function initializeTest() {
  // Get mock set ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const setId = parseInt(urlParams.get("set"));

  if (!setId || setId < 1 || setId > 6) {
    showError(
      "Invalid Test Set",
      "The selected test set is invalid. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  testState.setId = setId;

  // Initialize DOM elements
  initializeElements();

  // Load mock test data
  const loaded = await loadMockTest(setId);
  if (!loaded) {
    showError(
      "Failed to Load Test",
      "Unable to load test data. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  // Try to load saved state
  const savedState = loadTestState(setId);
  if (savedState && !savedState.isSubmitted) {
    // Restore saved state
    testState.currentQuestionIndex = savedState.currentQuestionIndex || 0;
    testState.answers = savedState.answers || {};
    testState.markedForReview = savedState.markedForReview || [];

    if (savedState.timer) {
      testState.timer.totalSeconds = savedState.timer.totalSeconds || 3600;
      testState.timer.startTime = savedState.timer.startTime
        ? new Date(savedState.timer.startTime)
        : new Date();
    } else {
      testState.timer.startTime = new Date();
    }
  } else {
    // Start fresh
    testState.timer.startTime = new Date();
  }

  // Render initial question
  renderQuestion(testState.currentQuestionIndex);
  updateProgress();
  updateQuestionNavigator();
  startTimer();

  // Setup logout button
  setupLogoutButton();

  // Load user data to display username
  await loadUserData();

  // Setup event listeners
  setupEventListeners();

  // Save state periodically
  setInterval(() => {
    if (!testState.isSubmitted) {
      saveTestState(setId, testState);
    }
  }, 30000); // Every 30 seconds
}

/**
 * Initialize DOM element references
 */
function initializeElements() {
  elements = {
    // Progress elements
    testTitle: document.getElementById("testTitle"),
    questionCounter: document.getElementById("questionCounter"),
    progressBar: document.getElementById("progressBar"),

    // Question elements
    questionText: document.getElementById("questionText"),
    optionsContainer: document.getElementById("optionsContainer"),

    // Navigation buttons
    markForReviewBtn: document.getElementById("markForReviewBtn"),
    jumpToBtn: document.getElementById("jumpToBtn"),
    skipToLastBtn: document.getElementById("skipToLastBtn"),
    previousBtn: document.getElementById("previousBtn"),
    nextBtn: document.getElementById("nextBtn"),
    submitBtn: document.getElementById("submitBtn"),

    // Timer elements
    timerDisplay: document.getElementById("timerDisplay"),
    answeredCount: document.getElementById("answeredCount"),
    notAnsweredCount: document.getElementById("notAnsweredCount"),
    markedCount: document.getElementById("markedCount"),

    // Question navigator
    questionNavigator: document.getElementById("questionNavigator"),
  };
}

/**
 * Load mock test data from JSON
 */
async function loadMockTest(setId) {
  try {
    const response = await fetch(`data/mock-tests.json`);
    if (!response.ok) throw new Error("Failed to fetch test data");

    const data = await response.json();
    const mockSet = data.mockSets.find((set) => set.id === setId);

    if (!mockSet) {
      throw new Error(`Mock set ${setId} not found`);
    }

    testState.questions = mockSet.questions;

    // Update test title
    if (elements.testTitle) {
      elements.testTitle.textContent = getLocalizedText(mockSet.title);
    }

    // Listen for language changes
    window.addEventListener("languageChanged", () => {
      renderQuestion(testState.currentQuestionIndex);
      if (elements.testTitle) {
        elements.testTitle.textContent = getLocalizedText(mockSet.title);
      }
    });

    return true;
  } catch (error) {
    console.error("Error loading mock test:", error);
    return false;
  }
}

/**
 * Render a question
 */
function renderQuestion(index) {
  if (index < 0 || index >= testState.questions.length) return;

  const question = testState.questions[index];
  testState.currentQuestionIndex = index;

  // Update question text
  if (elements.questionText) {
    const questionText = getLocalizedText(question.question);
    elements.questionText.textContent = `Question ${question.id} for Test ${testState.setId}: ${questionText}`;
  }

  // Update question counter
  if (elements.questionCounter) {
    elements.questionCounter.textContent = `Question ${index + 1} of ${
      testState.questions.length
    }`;
  }

  // Render options
  if (elements.optionsContainer) {
    elements.optionsContainer.innerHTML = "";

    question.options.forEach((option) => {
      const optionElement = createOptionElement(question.id, option);
      elements.optionsContainer.appendChild(optionElement);
    });
  }

  // Update navigation buttons
  updateNavigationButtons();

  // Show/hide submit button on last question
  const submitContainer = document.getElementById("submitButtonContainer");
  const navButtons = document.querySelector(
    ".flex.flex-col.sm\\:flex-row.justify-between"
  );
  if (submitContainer && navButtons) {
    if (index === testState.questions.length - 1) {
      submitContainer.classList.remove("hidden");
      if (navButtons) navButtons.classList.add("hidden");
    } else {
      submitContainer.classList.add("hidden");
      if (navButtons) navButtons.classList.remove("hidden");
    }
  }

  // Save state
  saveTestState(testState.setId, testState);
}

/**
 * Create an option element
 */
function createOptionElement(questionId, option) {
  const isSelected = testState.answers[questionId] === option.id;
  const optionText = getLocalizedText(option.text);
  const optionDiv = document.createElement("div");
  optionDiv.className = `option-item p-3 rounded-xl outline outline-1 outline-offset-[-1px] cursor-pointer transition-all ${
    isSelected
      ? "bg-green-100 outline-[1.50px] outline-teal-600"
      : "bg-grey-1 outline-Grey-4 hover:bg-grey-2"
  }`;
  optionDiv.setAttribute("role", "radio");
  optionDiv.setAttribute("aria-checked", isSelected);
  optionDiv.setAttribute("tabindex", isSelected ? "0" : "-1");
  optionDiv.setAttribute("data-question-id", questionId);
  optionDiv.setAttribute("data-option-id", option.id);
  optionDiv.setAttribute("aria-label", `Option ${option.id}: ${optionText}`);

  const borderWidth = isSelected ? "3px" : "1.60px";
  const borderColor = isSelected ? "border-teal-600" : "border-slate-300";

  optionDiv.innerHTML = `
    <div class="inline-flex justify-center items-center gap-3">
      <div class="w-5 h-5 rounded-full ${borderColor} flex items-center justify-center" style="border-width: ${borderWidth}">
        ${
          isSelected
            ? '<div class="w-2 h-2 rounded-full bg-teal-600"></div>'
            : ""
        }
      </div>
      <div class="justify-start text-slate-700 text-base font-normal font-['Inter'] leading-6">
        Option ${option.id}: ${optionText}
      </div>
    </div>
  `;

  // Add click handler
  optionDiv.addEventListener("click", () =>
    selectAnswer(questionId, option.id)
  );

  // Add keyboard handler
  optionDiv.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectAnswer(questionId, option.id);
    }
  });

  return optionDiv;
}

/**
 * Handle answer selection
 */
function selectAnswer(questionId, optionId) {
  testState.answers[questionId] = optionId;

  // Re-render current question to update selection
  renderQuestion(testState.currentQuestionIndex);

  // Update progress
  updateProgress();
  updateQuestionNavigator();

  // Save state
  saveTestState(testState.setId, testState);
}

/**
 * Toggle mark for review
 */
function markForReview() {
  const questionId = testState.questions[testState.currentQuestionIndex].id;

  // Check if question is answered - require answer before marking for review
  if (!testState.answers[questionId]) {
    // Show feedback that question must be answered first
    showInfo(
      "Answer Required",
      "Please select an answer before marking this question for review."
    );
    return; // Don't mark for review
  }

  // Continue with existing toggle logic
  const index = testState.markedForReview.indexOf(questionId);

  if (index > -1) {
    testState.markedForReview.splice(index, 1);
  } else {
    testState.markedForReview.push(questionId);
  }

  updateProgress();
  updateQuestionNavigator();
  updateNavigationButtons(); // This updates the mark button state
  saveTestState(testState.setId, testState);
}

/**
 * Navigate to previous question
 */
function navigatePrevious() {
  if (testState.currentQuestionIndex > 0) {
    renderQuestion(testState.currentQuestionIndex - 1);
  }
}

/**
 * Navigate to next question
 */
function navigateNext() {
  if (testState.currentQuestionIndex < testState.questions.length - 1) {
    renderQuestion(testState.currentQuestionIndex + 1);
  }
}

/**
 * Navigate to specific question
 */
function navigateToQuestion(index) {
  if (index >= 0 && index < testState.questions.length) {
    renderQuestion(index);
  }
}

/**
 * Jump to first question
 */
function jumpToFirst() {
  navigateToQuestion(0);
}

/**
 * Jump to last question
 */
function jumpToLast() {
  navigateToQuestion(testState.questions.length - 1);
}

/**
 * Jump to first unanswered question
 */
function jumpToFirstUnanswered() {
  for (let i = 0; i < testState.questions.length; i++) {
    const questionId = testState.questions[i].id;
    if (!testState.answers[questionId]) {
      navigateToQuestion(i);
      return;
    }
  }
  // All answered, go to last question
  jumpToLast();
}

/**
 * Update navigation buttons state
 */
function updateNavigationButtons() {
  if (elements.previousBtn) {
    elements.previousBtn.disabled = testState.currentQuestionIndex === 0;
    elements.previousBtn.classList.toggle(
      "opacity-50",
      testState.currentQuestionIndex === 0
    );
    elements.previousBtn.classList.toggle(
      "cursor-not-allowed",
      testState.currentQuestionIndex === 0
    );
  }

  if (elements.nextBtn) {
    const isLast =
      testState.currentQuestionIndex === testState.questions.length - 1;
    // Don't disable next button, just hide it on last question (submit button will show)
    if (isLast) {
      elements.nextBtn.style.display = "none";
    } else {
      elements.nextBtn.style.display = "flex";
    }
  }

  // Update mark for review button
  if (elements.markForReviewBtn) {
    const questionId = testState.questions[testState.currentQuestionIndex].id;
    const isAnswered = !!testState.answers[questionId];
    const isMarked = testState.markedForReview.includes(questionId);

    // Disable button if question is not answered
    elements.markForReviewBtn.disabled = !isAnswered;

    // Update visual state
    if (isAnswered) {
      // Enabled state - show marked/unmarked styling
      elements.markForReviewBtn.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
      );
      elements.markForReviewBtn.classList.toggle("bg-purple-100", isMarked);
      elements.markForReviewBtn.classList.toggle("text-purple-600", isMarked);
      // Add tooltip for enabled state
      elements.markForReviewBtn.title = isMarked
        ? "Click to unmark for review"
        : "Click to mark this question for review";
    } else {
      // Disabled state styling
      elements.markForReviewBtn.classList.remove(
        "bg-purple-100",
        "text-purple-600"
      );
      elements.markForReviewBtn.classList.add(
        "opacity-50",
        "cursor-not-allowed"
      );
      // Tooltip explaining why disabled
      elements.markForReviewBtn.title =
        "Please answer this question first before marking for review";
    }
  }
}

/**
 * Update progress bar and statistics
 */
function updateProgress() {
  const total = testState.questions.length;
  const answered = Object.keys(testState.answers).length;
  const notAnswered = total - answered;
  const marked = testState.markedForReview.length;

  // Update progress bar
  if (elements.progressBar) {
    const percentage = (answered / total) * 100;
    elements.progressBar.style.width = `${percentage}%`;
  }

  // Update statistics
  if (elements.answeredCount) {
    elements.answeredCount.textContent = answered;
  }
  if (elements.notAnsweredCount) {
    elements.notAnsweredCount.textContent = notAnswered;
  }
  if (elements.markedCount) {
    elements.markedCount.textContent = marked;
  }
}

/**
 * Update question navigator grid
 */
function updateQuestionNavigator() {
  if (!elements.questionNavigator) return;

  elements.questionNavigator.innerHTML = "";

  testState.questions.forEach((question, index) => {
    const questionId = question.id;
    const isAnswered = !!testState.answers[questionId];
    const isMarked = testState.markedForReview.includes(questionId);
    const isCurrent = index === testState.currentQuestionIndex;

    const button = document.createElement("button");
    button.className = `question-nav-btn w-9 h-8 rounded-lg outline outline-[1.22px] outline-offset-[-1.22px] text-xs font-normal font-['Inter'] leading-4 transition-all ${
      isCurrent
        ? "bg-teal-600 outline-teal-600 text-grey-1"
        : isAnswered
        ? "bg-green-100 outline-green-300 text-green-700"
        : isMarked
        ? "bg-purple-100 outline-purple-300 text-purple-600"
        : "bg-grey-1 outline-Grey-4 text-grey-6"
    }`;
    button.textContent = questionId;
    button.setAttribute("aria-label", `Question ${questionId}`);
    button.addEventListener("click", () => navigateToQuestion(index));

    elements.questionNavigator.appendChild(button);
  });
}

/**
 * Start timer
 */
function startTimer() {
  if (testState.timer.intervalId) {
    clearInterval(testState.timer.intervalId);
  }

  testState.timer.intervalId = setInterval(() => {
    if (testState.timer.totalSeconds > 0) {
      testState.timer.totalSeconds--;
      updateTimerDisplay();
      saveTestState(testState.setId, testState);
    } else {
      // Time's up - auto submit
      clearInterval(testState.timer.intervalId);
      autoSubmit();
    }
  }, 1000);

  updateTimerDisplay();
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
  if (!elements.timerDisplay) return;

  const minutes = Math.floor(testState.timer.totalSeconds / 60);
  const seconds = testState.timer.totalSeconds % 60;
  elements.timerDisplay.textContent = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  // Add warning class when time is low
  if (testState.timer.totalSeconds < 300) {
    // Less than 5 minutes
    elements.timerDisplay.classList.add("text-red-600");
  } else {
    elements.timerDisplay.classList.remove("text-red-600");
  }
}

/**
 * Auto submit when time runs out
 */
function autoSubmit() {
  if (testState.isSubmitted) return;

  // Show info and submit immediately
  showInfo("Time's Up!", "Your test has been submitted automatically.", () => {
    // Already submitted, just close
  });

  // Submit immediately
  proceedWithSubmission();
}

/**
 * Submit test
 */
function submitTest() {
  if (testState.isSubmitted) return;

  // Get statistics
  const answeredCount = Object.keys(testState.answers).length;
  const totalQuestions = testState.questions.length;
  const notAnsweredCount = totalQuestions - answeredCount;
  const markedCount = testState.markedForReview.length;

  // Show custom submit confirmation dialog
  showSubmitConfirm(
    {
      totalQuestions: totalQuestions,
      answered: answeredCount,
      notAnswered: notAnsweredCount,
      markedForReview: markedCount,
    },
    () => {
      // User confirmed submission
      proceedWithSubmission();
    },
    () => {
      // User cancelled - do nothing, just close modal
    }
  );
}

/**
 * Proceed with test submission after confirmation
 */
async function proceedWithSubmission() {
  if (testState.isSubmitted) return;

  // Mark as submitted first to prevent beforeunload from triggering
  testState.isSubmitted = true;

  // Remove beforeunload listener to prevent browser warning during navigation
  if (beforeUnloadHandler) {
    window.removeEventListener("beforeunload", beforeUnloadHandler);
    beforeUnloadHandler = null;
  }

  // Stop timer
  if (testState.timer.intervalId) {
    clearInterval(testState.timer.intervalId);
  }

  // Calculate score
  let correct = 0;
  testState.questions.forEach((question) => {
    const selectedAnswer = testState.answers[question.id];
    if (selectedAnswer === question.correctAnswer) {
      correct++;
    }
  });

  const score = Math.round((correct / testState.questions.length) * 100);
  const timeSpent = 3600 - testState.timer.totalSeconds;

  // Prepare attempt data
  const attemptData = {
    score: score,
    answers: testState.answers,
    markedForReview: testState.markedForReview,
    timeSpent: timeSpent,
    submittedAt: new Date().toISOString(),
  };

  // Submit to backend (will also save to localStorage as fallback)
  const backendResult = await submitTestToBackend(testState.setId, attemptData);

  // If backend submission failed, ensure localStorage is saved
  if (!backendResult) {
    // Get existing progress to increment attempts
    const existingProgress = getProgress(testState.setId);
    const currentAttempts = existingProgress?.attempts || 0;
    const maxAttempts = 3;
    const newAttempts = Math.min(currentAttempts + 1, maxAttempts);

    // Save progress with incremented attempts to localStorage
    saveProgress(testState.setId, {
      status: "completed",
      score: score,
      attempts: newAttempts,
      maxAttempts: maxAttempts,
      answers: testState.answers,
      markedForReview: testState.markedForReview,
      timeSpent: timeSpent,
      submittedAt: new Date().toISOString(),
      lastAttemptDate: new Date().toISOString(),
    });
  }

  // Clear test state
  clearTestState(testState.setId);

  // Use a small delay to ensure beforeunload is removed before navigation
  setTimeout(() => {
    // Redirect to results page
    window.location.href = `results.html?set=${testState.setId}&score=${score}`;
  }, 100);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  if (elements.markForReviewBtn) {
    elements.markForReviewBtn.addEventListener("click", markForReview);
  }

  if (elements.jumpToBtn) {
    elements.jumpToBtn.addEventListener("click", () => {
      showInput(
        "Jump to Question",
        `Enter a question number between 1 and ${testState.questions.length}`,
        "Question Number",
        `1-${testState.questions.length}`,
        "number",
        (questionNum) => {
          const num = parseInt(questionNum);
          if (num >= 1 && num <= testState.questions.length) {
            navigateToQuestion(num - 1);
          } else {
            showError(
              "Invalid Question Number",
              `Please enter a number between 1 and ${testState.questions.length}`
            );
          }
        }
      );
    });
  }

  if (elements.skipToLastBtn) {
    elements.skipToLastBtn.addEventListener("click", jumpToLast);
  }

  if (elements.previousBtn) {
    elements.previousBtn.addEventListener("click", navigatePrevious);
  }

  if (elements.nextBtn) {
    elements.nextBtn.addEventListener("click", navigateNext);
  }

  if (elements.submitBtn) {
    elements.submitBtn.addEventListener("click", submitTest);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (testState.isSubmitted) return;

    // Prevent shortcuts when typing in inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        navigatePrevious();
        break;
      case "ArrowRight":
        e.preventDefault();
        navigateNext();
        break;
      case "m":
      case "M":
        e.preventDefault();
        markForReview();
        break;
      case "s":
      case "S":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          submitTest();
        }
        break;
    }
  });

  // Warn before leaving page (only if not submitted)
  beforeUnloadHandler = (e) => {
    if (!testState.isSubmitted) {
      e.preventDefault();
      e.returnValue =
        "Your progress will be saved, but are you sure you want to leave?";
      return e.returnValue;
    }
  };
  window.addEventListener("beforeunload", beforeUnloadHandler);
}

/**
 * Load and display user data
 */
async function loadUserData() {
  try {
    const result = await getUserData();

    if (result.success && result.user) {
      const user = result.user;

      // Update user name in header
      const userNameHeader = document.getElementById("userNameHeader");
      if (userNameHeader) {
        userNameHeader.textContent = user.name;
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    // Don't block page load if user data fails
  }
}

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
  document.addEventListener("DOMContentLoaded", initializeTest);
} else {
  initializeTest();
}
