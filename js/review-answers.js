// Review Answers Page Logic
// Displays detailed question-by-question review with correct/incorrect highlighting

import { showError } from "./modal.js";
import { getProgress } from "./test-state.js";

/**
 * Initialize review answers page
 */
async function initializeReviewAnswers() {
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const setId = parseInt(urlParams.get("set"));

  if (!setId || setId < 1 || setId > 6) {
    showError(
      "Invalid Test Set",
      "The test set is invalid. Redirecting to dashboard...",
      () => {
        window.location.href = "dashboard.html";
      }
    );
    return;
  }

  // Load progress data
  const progress = getProgress(setId);
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

  // Display review
  displayQuestionReview(mockSet, progress);
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
 * Display question-by-question review
 */
function displayQuestionReview(mockSet, progress) {
  const questions = mockSet.questions;
  const answers = progress.answers || {};
  const container = document.getElementById("questionsReview");
  const reviewTitle = document.getElementById("reviewTitle");

  if (!container) return;

  // Update title
  if (reviewTitle) {
    reviewTitle.textContent = `Review Answers - ${mockSet.title}`;
  }

  container.innerHTML = "";

  questions.forEach((question, index) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    const isUnanswered = !userAnswer;

    const questionDiv = document.createElement("div");
    questionDiv.className = `p-4 sm:p-6 rounded-xl border ${
      isCorrect
        ? "bg-green-100 border-green-300"
        : isUnanswered
        ? "bg-grey-1 border-grey-4"
        : "bg-red-50 border-red-200"
    }`;

    questionDiv.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-semibold text-grey-10 text-lg">Question ${
          question.id
        }</h3>
        <span class="px-3 py-1 rounded text-xs font-medium ${
          isCorrect
            ? "bg-green-600 text-white"
            : isUnanswered
            ? "bg-grey-6 text-white"
            : "bg-red-600 text-white"
        }">
          ${isCorrect ? "Correct" : isUnanswered ? "Unanswered" : "Incorrect"}
        </span>
      </div>
      <p class="text-grey-7 mb-4 text-base">${question.question}</p>
      <div class="space-y-2">
        ${question.options
          .map((option) => {
            const isUserAnswer = userAnswer === option.id;
            const isCorrectAnswer = question.correctAnswer === option.id;

            let bgClass = "bg-white";
            let borderClass = "border-grey-4";
            let textClass = "text-grey-7";

            if (isCorrectAnswer) {
              bgClass = "bg-green-100";
              borderClass = "border-green-600";
              textClass = "text-green-800";
            } else if (isUserAnswer && !isCorrect) {
              bgClass = "bg-red-100";
              borderClass = "border-red-600";
              textClass = "text-red-800";
            }

            return `
            <div class="p-3 rounded-lg border ${bgClass} ${borderClass}">
              <div class="flex items-center gap-2">
                <span class="font-medium ${textClass}">${option.id}.</span>
                <span class="${textClass}">${option.text}</span>
                ${
                  isCorrectAnswer
                    ? '<span class="ml-auto text-green-600 font-semibold">✓ Correct Answer</span>'
                    : ""
                }
                ${
                  isUserAnswer && !isCorrect
                    ? '<span class="ml-auto text-red-600 font-semibold">✗ Your Answer</span>'
                    : ""
                }
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    container.appendChild(questionDiv);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeReviewAnswers);
} else {
  initializeReviewAnswers();
}
