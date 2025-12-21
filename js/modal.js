// Modal/Dialog Utility
// Provides custom dialog boxes to replace browser alerts

/**
 * Create and show a modal dialog
 * @param {Object} options - Modal configuration
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message/content
 * @param {string} options.type - Modal type: 'info', 'error', 'warning', 'success', 'confirm', 'input'
 * @param {string} options.inputLabel - Label for input field (if type is 'input')
 * @param {string} options.inputPlaceholder - Placeholder for input field
 * @param {string} options.inputType - Input type (default: 'text')
 * @param {Function} options.onConfirm - Callback when confirmed
 * @param {Function} options.onCancel - Callback when cancelled
 * @param {string} options.confirmText - Confirm button text (default: 'OK')
 * @param {string} options.cancelText - Cancel button text (default: 'Cancel')
 */
export function showModal(options = {}) {
  const {
    title = "Dialog",
    message = "",
    type = "info",
    inputLabel = "",
    inputPlaceholder = "",
    inputType = "text",
    onConfirm = null,
    onCancel = null,
    confirmText = "OK",
    cancelText = "Cancel",
  } = options;

  // Remove existing modal if any
  const existingModal = document.getElementById("customModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const modal = document.createElement("div");
  modal.id = "customModal";
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200";
  modal.style.opacity = "0";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modalTitle");

  // Fade in animation
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);

  // Determine colors based on type
  let iconColor = "text-blue-600";
  let iconBg = "bg-blue-100";
  let borderColor = "border-blue-200";
  let confirmButtonClass = "bg-primary hover:bg-red-800";

  switch (type) {
    case "error":
      iconColor = "text-red-600";
      iconBg = "bg-red-100";
      borderColor = "border-red-200";
      confirmButtonClass = "bg-red-600 hover:bg-red-700";
      break;
    case "success":
      iconColor = "text-green-600";
      iconBg = "bg-green-100";
      borderColor = "border-green-200";
      confirmButtonClass = "bg-green-600 hover:bg-green-700";
      break;
    case "warning":
      iconColor = "text-orange-600";
      iconBg = "bg-orange-100";
      borderColor = "border-orange-200";
      confirmButtonClass = "bg-orange-600 hover:bg-orange-700";
      break;
    case "confirm":
      iconColor = "text-primary";
      iconBg = "bg-red-100";
      borderColor = "border-red-200";
      confirmButtonClass = "bg-primary hover:bg-red-800";
      break;
    default:
      iconColor = "text-blue-600";
      iconBg = "bg-blue-100";
      borderColor = "border-blue-200";
      confirmButtonClass = "bg-primary hover:bg-red-800";
  }

  // Determine icon
  let icon = "";
  switch (type) {
    case "error":
      icon = '<i class="fa-solid fa-circle-exclamation"></i>';
      break;
    case "success":
      icon = '<i class="fa-solid fa-circle-check"></i>';
      break;
    case "warning":
      icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
      break;
    case "confirm":
      icon = '<i class="fa-solid fa-circle-question"></i>';
      break;
    default:
      icon = '<i class="fa-solid fa-circle-info"></i>';
  }

  // Create input field if type is 'input'
  let inputField = "";
  if (type === "input") {
    inputField = `
      <div class="mt-4">
        <label for="modalInput" class="block text-sm font-medium text-[#404040] mb-2">
          ${inputLabel}
        </label>
        <input
          type="${inputType}"
          id="modalInput"
          class="w-full px-4 py-2 border border-grey-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="${inputPlaceholder}"
          autocomplete="off"
        />
      </div>
    `;
  }

  // Create modal content
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all scale-95" id="modalContent">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 ${iconBg} rounded-full flex items-center justify-center ${iconColor} text-xl">
            ${icon}
          </div>
          <div class="flex-1">
            <h3 id="modalTitle" class="text-xl font-semibold text-grey-10 mb-2">
              ${title}
            </h3>
            <p class="text-[#404040] text-sm leading-6">
              ${message}
            </p>
          </div>
          <button
            id="modalCloseBtn"
            class="flex-shrink-0 text-grey-6 hover:text-grey-10 transition-colors"
            aria-label="Close dialog"
          >
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        ${inputField}

        <!-- Buttons -->
        <div class="flex gap-3 mt-6 justify-end">
          ${
            type === "confirm" || type === "input"
              ? `
            <button
              id="modalCancelBtn"
              class="px-6 py-2.5 bg-grey-2 text-[#404040] rounded-lg hover:bg-grey-3 transition-colors font-medium"
            >
              ${cancelText}
            </button>
          `
              : ""
          }
          <button
            id="modalConfirmBtn"
            class="px-6 py-2.5 ${confirmButtonClass} text-white rounded-lg transition-colors font-medium"
          >
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  // Append to body
  document.body.appendChild(modal);

  // Scale in animation
  setTimeout(() => {
    const modalContent = modal.querySelector("#modalContent");
    if (modalContent) {
      modalContent.style.transform = "scale(1)";
    }
  }, 10);

  // Focus management
  const input = modal.querySelector("#modalInput");
  const confirmBtn = modal.querySelector("#modalConfirmBtn");
  const cancelBtn = modal.querySelector("#modalCancelBtn");
  const closeBtn = modal.querySelector("#modalCloseBtn");

  // Focus on input if present, otherwise on confirm button
  setTimeout(() => {
    if (input) {
      input.focus();
    } else {
      confirmBtn.focus();
    }
  }, 100);

  // Close function
  const closeModal = (result = null) => {
    const modalContent = modal.querySelector("#modalContent");
    if (modalContent) {
      modalContent.style.transform = "scale(0.95)";
    }
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.remove();
    }, 200);
    if (onCancel && result === null) {
      onCancel();
    }
  };

  // Event listeners
  closeBtn.addEventListener("click", () => closeModal(null));
  confirmBtn.addEventListener("click", () => {
    if (type === "input") {
      const inputValue = input.value.trim();
      if (inputValue) {
        closeModal(inputValue);
        if (onConfirm) {
          onConfirm(inputValue);
        }
      } else {
        input.focus();
        input.classList.add("border-red-600");
        setTimeout(() => {
          input.classList.remove("border-red-600");
        }, 2000);
      }
    } else {
      closeModal(true);
      if (onConfirm) {
        onConfirm();
      }
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => closeModal(null));
  }

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(null);
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal(null);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  // Return close function for programmatic closing
  return {
    close: () => closeModal(null),
  };
}

/**
 * Show error dialog
 */
export function showError(title, message, onConfirm = null) {
  return showModal({
    title,
    message,
    type: "error",
    confirmText: "OK",
    onConfirm,
  });
}

/**
 * Show success dialog
 */
export function showSuccess(title, message, onConfirm = null) {
  return showModal({
    title,
    message,
    type: "success",
    confirmText: "OK",
    onConfirm,
  });
}

/**
 * Show info dialog
 */
export function showInfo(title, message, onConfirm = null) {
  return showModal({
    title,
    message,
    type: "info",
    confirmText: "OK",
    onConfirm,
  });
}

/**
 * Show confirmation dialog
 */
export function showConfirm(title, message, onConfirm = null, onCancel = null) {
  return showModal({
    title,
    message,
    type: "confirm",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm,
    onCancel,
  });
}

/**
 * Show input dialog
 */
export function showInput(
  title,
  message,
  inputLabel,
  inputPlaceholder = "",
  inputType = "text",
  onConfirm = null,
  onCancel = null
) {
  return showModal({
    title,
    message,
    type: "input",
    inputLabel,
    inputPlaceholder,
    inputType,
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm,
    onCancel,
  });
}

/**
 * Show submit test confirmation dialog with statistics
 */
export function showSubmitConfirm(stats, onConfirm = null, onCancel = null) {
  const {
    totalQuestions = 40,
    answered = 0,
    notAnswered = 0,
    markedForReview = 0,
  } = stats;

  // Remove existing modal if any
  const existingModal = document.getElementById("customModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const modal = document.createElement("div");
  modal.id = "customModal";
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200";
  modal.style.opacity = "0";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "submitModalTitle");

  // Fade in animation
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);

  // Warning message if there are unanswered questions
  const warningMessage =
    notAnswered > 0
      ? `<div class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p class="text-orange-600 text-sm font-medium">
            Warning: ${notAnswered} question(s) remain unanswered.
          </p>
        </div>`
      : "";

  // Create modal content
  modal.innerHTML = `
    <div class="bg-[#FFFFFF] border-4 border-[#D4D4D4] rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all scale-95" id="modalContent">
      <div class="p-6 relative">
        <!-- Header -->
         <button
            id="modalCloseBtn"
            class="flex-shrink-0 absolute top-3 right-3 text-grey-6 hover:text-[#404040] transition-colors"
            aria-label="Close dialog"
          >
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        <div class="flex flex-col items-center justify-center mb-4">
          <h3 id="submitModalTitle" class="text-2xl font-semibold text-[#0A0A0A]">
            Submit Test?
          </h3>
         
          <!-- Question -->
          <p class="text-[#404040] text-base mb-6">
            Are you sure you want to submit your test?
          </p>
        </div>


        <!-- Statistics -->
        <div class="space-y-3 mb-4 bg-[#F5F5F5] rounded-xl p-3">
          <div class="flex justify-between items-center">
            <span class="text-[#404040] text-sm">Total Questions:</span>
            <span class="text-[#404040] text-sm font-medium">${totalQuestions}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[#404040] text-sm">Answered:</span>
            <span class="text-[#00A63E] text-sm font-medium">${answered}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[#404040] text-sm">Not Answered:</span>
            <span class="text-[#F54900] text-sm font-medium">${notAnswered}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[#404040] text-sm">Marked for Review:</span>
            <span class="text-purple-600 text-sm font-medium">${markedForReview}</span>
          </div>
        </div>

        ${warningMessage}

        <!-- Buttons -->
        <div class="flex gap-3 mt-6 justify-end">
          <button
            id="modalCancelBtn"
            class="px-6 py-2.5 bg-white border border-grey-4 text-grey-10 rounded-lg hover:bg-grey-2 transition-colors font-medium"
          >
            Continue Test
          </button>
          <button
            id="modalConfirmBtn"
            class="px-6 py-2.5 bg-grey-10 text-white rounded-lg hover:bg-grey-9 transition-colors font-medium"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  `;

  // Append to body
  document.body.appendChild(modal);

  // Scale in animation
  setTimeout(() => {
    const modalContent = modal.querySelector("#modalContent");
    if (modalContent) {
      modalContent.style.transform = "scale(1)";
    }
  }, 10);

  // Focus management
  const confirmBtn = modal.querySelector("#modalConfirmBtn");
  const cancelBtn = modal.querySelector("#modalCancelBtn");
  const closeBtn = modal.querySelector("#modalCloseBtn");

  // Focus on cancel button first (safer default)
  setTimeout(() => {
    cancelBtn.focus();
  }, 100);

  // Close function
  const closeModal = (result = null) => {
    const modalContent = modal.querySelector("#modalContent");
    if (modalContent) {
      modalContent.style.transform = "scale(0.95)";
    }
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.remove();
    }, 200);
    if (onCancel && result === null) {
      onCancel();
    }
  };

  // Event listeners
  closeBtn.addEventListener("click", () => closeModal(null));
  confirmBtn.addEventListener("click", () => {
    closeModal(true);
    if (onConfirm) {
      onConfirm();
    }
  });

  cancelBtn.addEventListener("click", () => closeModal(null));

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(null);
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal(null);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  // Return close function for programmatic closing
  return {
    close: () => closeModal(null),
  };
}
