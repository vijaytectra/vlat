// Test State Management - localStorage operations
// Handles saving, loading, and clearing test progress

const STORAGE_KEY = 'mockTestProgress';

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
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
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
    console.error('Error loading progress:', error);
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
    console.error('Error loading all progress:', error);
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
    console.error('Error clearing progress:', error);
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
    console.error('Error clearing all progress:', error);
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
    averageScore: 0
  };

  Object.values(allProgress).forEach(progress => {
    if (progress.status === 'completed') {
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
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      timestamp: Date.now()
    }));
    return true;
  } catch (error) {
    console.error('Error saving test state:', error);
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
    console.error('Error loading test state:', error);
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
    console.error('Error clearing test state:', error);
    return false;
  }
}
