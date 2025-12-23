// Test State Management - localStorage operations with backend sync
// Handles saving, loading, and clearing test progress
// Uses backend as primary source, localStorage as fallback

import { getApiUrl } from "./auth.js";

const STORAGE_KEY = "mockTestProgress";
const API_BASE_URL = getApiUrl();

/**
 * Save progress for a specific mock test set
 * @param {number} setId - Mock test set ID (1-6)
 * @param {Object} data - Progress data to save
 */
export function saveProgress(setId, data) {
  try {
    const allProgress = getAllProgress();
    allProgress[setId.toString()] = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
}

/**
 * Get progress for a specific mock test set
 * @param {number} setId - Mock test set ID (1-6)
 * @returns {Object|null} Progress data or null if not found
 */
export function getProgress(setId) {
  try {
    const allProgress = getAllProgress();
    return allProgress[setId.toString()] || null;
  } catch (error) {
    console.error("Error loading progress:", error);
    return null;
  }
}

/**
 * Get all progress data
 * @returns {Object} All progress data
 */
export function getAllProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading all progress:", error);
    return {};
  }
}

/**
 * Clear progress for a specific mock test set
 * @param {number} setId - Mock test set ID (1-6)
 */
export function clearProgress(setId) {
  try {
    const allProgress = getAllProgress();
    delete allProgress[setId.toString()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error("Error clearing progress:", error);
    return false;
  }
}

/**
 * Clear all progress data
 */
export function clearAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing all progress:", error);
    return false;
  }
}

/**
 * Calculate statistics from all progress data
 * @returns {Object} Statistics object
 */
export function calculateStats() {
  const allProgress = getAllProgress();
  const stats = {
    testsCompleted: 0,
    totalAttempts: 0,
    scores: [],
    bestScore: 0,
    averageScore: 0,
  };

  Object.values(allProgress).forEach((progress) => {
    if (progress.status === "completed") {
      stats.testsCompleted++;
      if (progress.score !== undefined) {
        stats.scores.push(progress.score);
      }
    }
    if (progress.attempts) {
      stats.totalAttempts += progress.attempts;
    }
  });

  if (stats.scores.length > 0) {
    stats.bestScore = Math.max(...stats.scores);
    stats.averageScore = Math.round(
      stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length
    );
  }

  return stats;
}

/**
 * Save test state during test (answers, current question, timer, etc.)
 * @param {number} setId - Mock test set ID
 * @param {Object} state - Test state data
 */
export function saveTestState(setId, state) {
  try {
    const stateKey = `testState_${setId}`;
    localStorage.setItem(
      stateKey,
      JSON.stringify({
        ...state,
        timestamp: Date.now(),
      })
    );
    return true;
  } catch (error) {
    console.error("Error saving test state:", error);
    return false;
  }
}

/**
 * Load test state during test
 * @param {number} setId - Mock test set ID
 * @returns {Object|null} Test state or null if not found/expired
 */
export function loadTestState(setId) {
  try {
    const stateKey = `testState_${setId}`;
    const stored = localStorage.getItem(stateKey);
    if (!stored) return null;

    const state = JSON.parse(stored);
    // Check if state is older than 24 hours (expired)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - state.timestamp > maxAge) {
      localStorage.removeItem(stateKey);
      return null;
    }
    return state;
  } catch (error) {
    console.error("Error loading test state:", error);
    return null;
  }
}

/**
 * Clear test state
 * @param {number} setId - Mock test set ID
 */
export function clearTestState(setId) {
  try {
    const stateKey = `testState_${setId}`;
    localStorage.removeItem(stateKey);
    return true;
  } catch (error) {
    console.error("Error clearing test state:", error);
    return false;
  }
}

// ==================== Backend Sync Functions ====================

/**
 * Convert backend progress format to frontend format
 */
function convertBackendProgressToFrontend(backendProgress) {
  if (!backendProgress) return null;

  const latestAttempt =
    backendProgress.attempts && backendProgress.attempts.length > 0
      ? backendProgress.attempts[backendProgress.attempts.length - 1]
      : null;

  // Convert answers - handle both Map and object formats
  let answersObj = {};
  if (latestAttempt && latestAttempt.answers) {
    if (latestAttempt.answers instanceof Map) {
      answersObj = Object.fromEntries(latestAttempt.answers);
    } else if (Array.isArray(latestAttempt.answers)) {
      // If it's an array of entries, convert it
      answersObj = Object.fromEntries(latestAttempt.answers);
    } else if (typeof latestAttempt.answers === "object") {
      // Already an object, use as is
      answersObj = latestAttempt.answers;
    }
  }

  return {
    status: backendProgress.status || "not_started",
    score: latestAttempt ? latestAttempt.score : undefined,
    attempts: backendProgress.attempts ? backendProgress.attempts.length : 0,
    maxAttempts: backendProgress.maxAttempts || 3,
    answers: answersObj,
    markedForReview: latestAttempt ? latestAttempt.markedForReview || [] : [],
    timeSpent: latestAttempt ? latestAttempt.timeSpent : undefined,
    submittedAt: latestAttempt ? latestAttempt.submittedAt : undefined,
    lastAttemptDate: latestAttempt ? latestAttempt.submittedAt : undefined,
    previousAttempts: backendProgress.attempts || [],
  };
}

/**
 * Get progress from backend with localStorage fallback
 * @param {number} setId - Mock test set ID (1-6)
 * @returns {Promise<Object|null>} Progress data or null if not found
 */
export async function getProgressFromBackend(setId) {
  try {
    const { getAuthHeaders } = await import("./auth.js");
    const response = await fetch(`${API_BASE_URL}/api/test/progress/${setId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.progress) {
        const frontendFormat = convertBackendProgressToFrontend(
          data.data.progress
        );
        // Also save to localStorage as cache
        if (frontendFormat) {
          saveProgress(setId, frontendFormat);
        }
        return frontendFormat;
      }
    }
  } catch (error) {
    console.warn("Backend fetch failed, using localStorage fallback:", error);
  }

  // Fallback to localStorage
  return getProgress(setId);
}

/**
 * Get all progress from backend with localStorage fallback
 * @returns {Promise<Object>} All progress data
 */
export async function getAllProgressFromBackend() {
  try {
    const { getAuthHeaders } = await import("./auth.js");
    const response = await fetch(`${API_BASE_URL}/api/test/progress`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.progress) {
        const progressMap = {};
        data.data.progress.forEach((backendProgress) => {
          const frontendFormat =
            convertBackendProgressToFrontend(backendProgress);
          if (frontendFormat) {
            progressMap[backendProgress.setId.toString()] = frontendFormat;
            // Cache in localStorage
            saveProgress(backendProgress.setId, frontendFormat);
          }
        });
        return progressMap;
      }
    }
  } catch (error) {
    console.warn("Backend fetch failed, using localStorage fallback:", error);
  }

  // Fallback to localStorage
  return getAllProgress();
}

/**
 * Submit test to backend
 * @param {number} setId - Mock test set ID
 * @param {Object} attemptData - Test attempt data
 * @returns {Promise<Object|null>} Response data or null on error
 */
export async function submitTestToBackend(setId, attemptData) {
  try {
    const { getAuthHeaders } = await import("./auth.js");
    const response = await fetch(`${API_BASE_URL}/api/test/submit/${setId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        score: attemptData.score,
        answers: attemptData.answers,
        markedForReview: attemptData.markedForReview || [],
        timeSpent: attemptData.timeSpent || 0,
        submittedAt: attemptData.submittedAt || new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.progress) {
        // Update localStorage with backend response
        const frontendFormat = convertBackendProgressToFrontend(
          data.data.progress
        );
        if (frontendFormat) {
          saveProgress(setId, frontendFormat);
        }
        return data.data;
      }
    } else {
      const errorData = await response.json();
      console.error("Backend submit failed:", errorData.message);
      return null;
    }
  } catch (error) {
    console.error("Error submitting test to backend:", error);
    // Still save to localStorage as fallback
    saveProgress(setId, {
      status: "completed",
      score: attemptData.score,
      attempts: (getProgress(setId)?.attempts || 0) + 1,
      maxAttempts: 3,
      answers: attemptData.answers,
      markedForReview: attemptData.markedForReview || [],
      timeSpent: attemptData.timeSpent || 0,
      submittedAt: attemptData.submittedAt || new Date().toISOString(),
      lastAttemptDate: attemptData.submittedAt || new Date().toISOString(),
    });
    return null;
  }
}

/**
 * Get statistics from backend with localStorage fallback
 * @returns {Promise<Object>} Statistics object
 */
export async function getStatsFromBackend() {
  try {
    const { getAuthHeaders } = await import("./auth.js");
    const response = await fetch(`${API_BASE_URL}/api/test/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.stats) {
        return {
          testsCompleted: data.data.stats.testsCompleted || 0,
          totalAttempts: data.data.stats.totalAttempts || 0,
          bestScore: data.data.stats.bestScore || 0,
          averageScore: data.data.stats.averageScore || 0,
        };
      }
    }
  } catch (error) {
    console.warn(
      "Backend stats fetch failed, using localStorage fallback:",
      error
    );
  }

  // Fallback to localStorage calculation
  return calculateStats();
}

/**
 * Save progress to backend (for in-progress tests)
 * @param {number} setId - Mock test set ID
 * @param {Object} data - Progress data
 * @returns {Promise<boolean>} Success status
 */
export async function saveProgressToBackend(setId, data) {
  try {
    const { getAuthHeaders } = await import("./auth.js");
    const response = await fetch(`${API_BASE_URL}/api/test/progress/${setId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: data.status || "in_progress",
      }),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.warn(
      "Backend save progress failed, using localStorage only:",
      error
    );
  }

  // Always save to localStorage as fallback
  saveProgress(setId, data);
  return false;
}
