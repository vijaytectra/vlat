// Dynamic Dashboard Logic
// Loads mock test data from JSON and user progress from backend (with localStorage fallback)
// Renders test cards dynamically without changing UI structure

import {
  getAllProgress,
  calculateStats,
  getAllProgressFromBackend,
  getStatsFromBackend,
} from "./test-state.js";
import { getUserData, logout, redirectIfNotAuth, getApiUrl } from "./auth.js";

let mockTestsData = [];

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

      // Update welcome message
      const userNameWelcome = document.getElementById("userNameWelcome");
      if (userNameWelcome) {
        userNameWelcome.textContent = user.name;
      }

      // Update VLAT ID
      const userVlatId = document.getElementById("userVlatId");
      if (userVlatId) {
        userVlatId.textContent = user.vlatId || "N/A";
      }

      // Update user name in meta info
      const userNameMeta = document.getElementById("userNameMeta");
      if (userNameMeta) {
        userNameMeta.textContent = user.name;
      }
    } else {
      // If not authenticated, redirect to login
      console.error("Failed to get user data:", result.message);
      redirectIfNotAuth();
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    redirectIfNotAuth();
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

/**
 * Initialize dashboard
 */
async function initializeDashboard() {
  // Note: Session debug endpoint removed - using JWT authentication now

  // Check authentication first with retry logic
  let isAuthenticated = false;
  let retries = 3;

  while (!isAuthenticated && retries > 0) {
    isAuthenticated = await redirectIfNotAuth();
    if (!isAuthenticated && retries > 1) {
      console.log(
        `Auth check failed, retrying... (${retries - 1} attempts left)`
      );
      // Wait a bit before retrying (cookie might need time to be set)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    retries--;
  }

  if (!isAuthenticated) {
    console.error("Authentication failed after retries, redirecting to login");
    return; // Will redirect to login
  }

  // Load user data
  await loadUserData();

  // Setup logout button
  setupLogoutButton();

  // Load mock tests data
  const loaded = await loadMockTests();
  if (!loaded) {
    console.error("Failed to load mock tests data");
    return;
  }

  // Load user progress from backend (with localStorage fallback)
  const allProgress = await getAllProgressFromBackend();
  const stats = await getStatsFromBackend();

  // Update stats cards
  updateStatsCards(stats);

  // Render test cards
  renderTestCards(allProgress);
}

/**
 * Load mock tests from JSON
 */
async function loadMockTests() {
  try {
    const response = await fetch("data/mock-tests.json");
    if (!response.ok) throw new Error("Failed to fetch test data");

    const data = await response.json();
    mockTestsData = data.mockSets;
    return true;
  } catch (error) {
    console.error("Error loading mock tests:", error);
    return false;
  }
}

/**
 * Update statistics cards
 */
function updateStatsCards(stats) {
  // Tests Completed
  const testsCompletedEl = document.querySelector(
    '[data-stat="tests-completed"]'
  );
  if (testsCompletedEl) {
    testsCompletedEl.textContent = `${stats.testsCompleted} / ${mockTestsData.length}`;
  }

  // Average Score
  const avgScoreEl = document.querySelector('[data-stat="avg-score"]');
  if (avgScoreEl) {
    avgScoreEl.textContent =
      stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A";
  }

  // Best Score
  const bestScoreEl = document.querySelector('[data-stat="best-score"]');
  if (bestScoreEl) {
    bestScoreEl.textContent =
      stats.bestScore > 0 ? `${stats.bestScore}%` : "N/A";
  }

  // Total Attempts
  const totalAttemptsEl = document.querySelector(
    '[data-stat="total-attempts"]'
  );
  if (totalAttemptsEl) {
    totalAttemptsEl.textContent = stats.totalAttempts || 0;
  }
}

/**
 * Render test cards dynamically
 */
function renderTestCards(allProgress) {
  // Find the grid container
  const gridContainer =
    document.getElementById("mockTestCards") ||
    document.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3"
    );

  if (!gridContainer) {
    console.error("Test cards container not found");
    return;
  }

  // Clear existing static cards
  gridContainer.innerHTML = "";

  // Render all test cards
  mockTestsData.forEach((mockSet) => {
    const progress = allProgress[mockSet.id.toString()] || null;
    const card = createTestCard(mockSet, progress);
    gridContainer.appendChild(card);
  });
}

/**
 * Create a test card element
 */
function createTestCard(mockSet, progress) {
  const status = progress?.status || "not_started";
  const score = progress?.score;
  const attempts = progress?.attempts || 0;
  const maxAttempts = 3;
  const answeredCount = progress?.answers
    ? Object.keys(progress.answers).length
    : 0;
  const totalQuestions = mockSet.questions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  // Determine status badge
  let statusBadge = "";
  if (status === "completed") {
    statusBadge = `
      <span class="text-xs px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#009689] border border-[#96F7E4]">
        Completed
      </span>
    `;
  } else if (status === "in_progress") {
    statusBadge = `
      <span class="text-xs px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#009689] border border-[#96F7E4]">
        In Progress
      </span>
    `;
  } else {
    statusBadge = `
      <span class="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252] border border-[#D4D4D4]">
        Not Started
      </span>
    `;
  }

  // Determine button text and action
  let buttonHtml = "";
  if (status === "completed") {
    // Check if more attempts are available
    if (attempts < maxAttempts) {
      // Show both View Results and Retake Test buttons
      buttonHtml = `
        <div class="flex flex-col gap-2">
          <button
            onclick="window.location.href='results.html?set=${mockSet.id}'"
            class="w-full bg-[#262626] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90"
          >
            <i class="fas fa-eye"></i>
            <span class="text-sm text-[#F3F4F6]">View Results</span>
          </button>
          <button
            onclick="retakeTest(${mockSet.id})"
            class="w-full bg-primary text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-red-800 transition-colors"
          >
            <i class="fas fa-redo"></i>
            <span class="text-sm">Retake Test (${
              maxAttempts - attempts
            } left)</span>
          </button>
        </div>
      `;
    } else {
      // All attempts used, only show View Results
      buttonHtml = `
        <button
          onclick="window.location.href='results.html?set=${mockSet.id}'"
          class="w-full bg-[#262626] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90"
        >
          <i class="fas fa-eye"></i>
          <span class="text-sm text-[#F3F4F6]">View Results</span>
        </button>
      `;
    }
  } else if (status === "in_progress") {
    buttonHtml = `
      <button
        onclick="window.location.href='mock-test.html?set=${mockSet.id}'"
        class="w-full bg-[#171717] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90"
      >
        <i class="fas fa-play"></i>
        <span class="text-sm">Resume Test</span>
      </button>
    `;
  } else {
    buttonHtml = `
      <button
        onclick="window.location.href='instructions.html?set=${mockSet.id}'"
        class="w-full bg-[#171717] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90"
      >
        <i class="fas fa-play"></i>
        <span class="text-sm">Start Test</span>
      </button>
    `;
  }

  // Progress section (only show if in progress or completed)
  let progressSection = "";
  if (status === "in_progress" || status === "completed") {
    progressSection = `
      <div class="space-y-4 bg-[#F0FDFA] p-4 border border-[#96F7E4] rounded-lg">
        <div class="flex justify-between text-xs text-[#525252]">
          <span>Progress</span>
          <span class="text-[#00776E]">${answeredCount} / ${totalQuestions} done</span>
        </div>
        <div class="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
          <div class="h-full bg-[#009689]" style="width: ${progressPercentage}%"></div>
        </div>
      </div>
    `;
  }

  // Score section (only show if completed)
  let scoreSection = "";
  if (status === "completed" && score !== undefined) {
    scoreSection = `
      <div class="border border-[#D4D4D4] rounded-lg p-4 text-sm">
        <span class="text-[#314158]">Your Score</span>
        <span class="float-right font-semibold text-xl text-[#008236]">${score}%</span>
      </div>
    `;
  }

  const card = document.createElement("div");
  card.className = "bg-white border border-[#D4D4D4] rounded-2xl p-4 space-y-3";
  if (status === "completed" || status === "in_progress") {
    card.className += " space-y-8";
  }

  card.innerHTML = `
    <div class="flex justify-between items-start gap-2">
      <h4 class="font-medium text-[#171717]">${mockSet.title}</h4>
      ${statusBadge}
    </div>

    <div class="flex items-center gap-4 text-xs text-[#525252]">
      <div class="flex items-center gap-1">
        <i class="fas fa-list-ul"></i>
        <span>${totalQuestions} questions</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="fas fa-clock"></i>
        <span>60 mins</span>
      </div>
    </div>

    ${progressSection}

    ${scoreSection}

    <p class="text-xs text-[#525252]">Attempts: ${attempts} / ${maxAttempts}</p>

    ${buttonHtml}
  `;

  return card;
}

/**
 * Retake test - clear current attempt and start fresh
 * This function is made available globally so it can be called from onclick handlers
 */
window.retakeTest = async function (setId) {
  try {
    // Dynamically import test-state functions
    const { clearTestState, getProgress, saveProgress } = await import(
      "./test-state.js"
    );

    // Clear the in-progress test state (if any)
    clearTestState(setId);

    // Get existing progress to preserve attempt count
    const progress = getProgress(setId);

    if (progress && progress.status === "completed") {
      // Store previous attempt data for history (optional - you can remove this if not needed)
      const previousAttempts = progress.previousAttempts || [];
      previousAttempts.push({
        score: progress.score,
        submittedAt: progress.submittedAt,
        attemptNumber: progress.attempts,
      });

      // Reset status to allow new attempt, but keep attempt count
      // The attempt will be incremented when the new test is submitted
      saveProgress(setId, {
        ...progress,
        status: "not_started", // Reset status to allow retake
        previousAttempts: previousAttempts, // Store history
        // Keep attempts count as is - it will be incremented on next submission
        answers: {}, // Clear answers for new attempt
        markedForReview: [], // Clear marked questions
        score: undefined, // Clear score
        submittedAt: undefined, // Clear submission date
      });
    }

    // Navigate to instructions to start new attempt
    window.location.href = `instructions.html?set=${setId}`;
  } catch (error) {
    console.error("Error retaking test:", error);
    // Fallback: just navigate to instructions
    window.location.href = `instructions.html?set=${setId}`;
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDashboard);
} else {
  initializeDashboard();
}
