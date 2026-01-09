// Dynamic Instructions Page Logic
// Updates test title and description based on selected mock set from URL parameter

import { showError } from "./modal.js";
import { logout, getUserData } from "./auth.js";

let currentMockSet = null;

/**
 * Get current language from localStorage or default to 'en'
 * Normalizes old/invalid language codes (e.g., "tn" → "ta")
 */
function getCurrentLanguage() {
  const saved = localStorage.getItem("vlat_language");

  // Normalize old/invalid language codes
  if (saved === "tn") {
    // Migrate old "tn" code to "ta"
    localStorage.setItem("vlat_language", "ta");
    return "ta";
  }

  // Validate and return only valid codes
  if (saved === "en" || saved === "ta") {
    return saved;
  }

  // Invalid code, return default
  if (saved) {
    // Clean up invalid value
    localStorage.removeItem("vlat_language");
  }
  return "en";
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

  // Store mockSet globally for language change updates
  currentMockSet = mockSet;

  // Update page content
  updateTestInfo(mockSet, setId);

  // Load user data to display username
  await loadUserData();

  // Listen for language changes and update title/description
  window.addEventListener("languageChanged", () => {
    if (currentMockSet) {
      updateTestInfo(currentMockSet, setId);
    }
  });
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
    const response = await fetch(`data/mock-tests.json?v=${new Date().getTime()}`);
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
    testTitle.textContent = getLocalizedText(mockSet.title);
  }

  // Update description if available
  const description = document.querySelector("p.text-grey-4");
  if (description && mockSet.description) {
    description.textContent = getLocalizedText(mockSet.description);
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
