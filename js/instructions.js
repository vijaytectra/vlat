// Dynamic Instructions Page Logic
// Updates test title and description based on selected mock set from URL parameter

import { showError } from "./modal.js";
import { logout, getUserData } from "./auth.js";

/**
 * Initialize instructions page
 */
async function initializeInstructions() {
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

  // Update page content
  updateTestInfo(mockSet, setId);

  // Load user data to display username
  await loadUserData();
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
 * Update test information on page
 */
function updateTestInfo(mockSet, setId) {
  // Update test title in red card
  const testTitle = document.querySelector("h1.text-secondary");
  if (testTitle) {
    testTitle.textContent = mockSet.title;
  }

  // Update description if available
  const description = document.querySelector("p.text-grey-4");
  if (description && mockSet.description) {
    description.textContent = mockSet.description;
  }

  // Update Start Test button link
  const startButton = document.getElementById("startTestBtn");
  if (startButton) {
    startButton.addEventListener("click", function () {
      window.location.href = `mock-test.html?set=${setId}`;
    });
  }

  // Setup logout button
  setupLogoutButton();
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
  document.addEventListener("DOMContentLoaded", initializeInstructions);
} else {
  initializeInstructions();
}
