// Main JavaScript file for VLAT Exam Application

// Announcements Sidebar Toggle
function initAnnouncementsSidebar() {
  const announcementBtn = document.getElementById("announcementBtn");
  const announcementSidebar = document.getElementById("announcementSidebar");
  const closeAnnouncement = document.getElementById("closeAnnouncement");

  if (announcementBtn && announcementSidebar) {
    announcementBtn.addEventListener("click", () => {
      announcementSidebar.classList.toggle("translate-x-full");
      announcementSidebar.classList.toggle("translate-x-0");
    });

    if (closeAnnouncement) {
      closeAnnouncement.addEventListener("click", () => {
        announcementSidebar.classList.add("translate-x-full");
        announcementSidebar.classList.remove("translate-x-0");
      });
    }
  }
}

// Mobile Menu Toggle (Works on both mobile and desktop)
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobileMenu = document.getElementById("closeMobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    // Open menu
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.remove("translate-x-full");
      mobileMenu.classList.add("translate-x-0");
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    });

    // Close menu with close button
    if (closeMobileMenu) {
      closeMobileMenu.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
        document.body.style.overflow = "";
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        mobileMenu &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        !mobileMenu.classList.contains("translate-x-full")
      ) {
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking on a menu link (except announcements which opens sidebar)
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      if (link.id !== "announcementsLink") {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("translate-x-full");
          mobileMenu.classList.remove("translate-x-0");
          document.body.style.overflow = "";
        });
      }
    });

    // Handle announcements link - close mobile menu and open announcements sidebar
    const announcementsLink = document.getElementById("announcementsLink");
    if (announcementsLink) {
      announcementsLink.addEventListener("click", (e) => {
        e.preventDefault();
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
        document.body.style.overflow = "";
        // Open announcements sidebar
        const announcementSidebar = document.getElementById(
          "announcementSidebar"
        );
        if (announcementSidebar) {
          announcementSidebar.classList.remove("translate-x-full");
          announcementSidebar.classList.add("translate-x-0");
        }
      });
    }
  }
}

// Jump to Question Popup
function initJumpToQuestion() {
  const jumpToBtn = document.getElementById("jumpToBtn");
  const jumpToModal = document.getElementById("jumpToModal");
  const closeJumpTo = document.getElementById("closeJumpTo");

  if (jumpToBtn && jumpToModal) {
    jumpToBtn.addEventListener("click", () => {
      jumpToModal.classList.remove("hidden");
    });

    if (closeJumpTo) {
      closeJumpTo.addEventListener("click", () => {
        jumpToModal.classList.add("hidden");
      });
    }
  }
}
// Submit Test Popup
function initSubmitTest() {
  const submitBtn = document.getElementById("submitTestBtn");
  const submitModal = document.getElementById("submitModal");
  const closeSubmit = document.getElementById("closeSubmit");
  const continueTestBtn = document.getElementById("continueTestBtn");

  if (submitBtn && submitModal) {
    submitBtn.addEventListener("click", () => {
      submitModal.classList.remove("hidden");
    });

    if (closeSubmit) {
      closeSubmit.addEventListener("click", () => {
        submitModal.classList.add("hidden");
      });
    }

    if (continueTestBtn) {
      continueTestBtn.addEventListener("click", () => {
        submitModal.classList.add("hidden");
      });
    }
  }
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });

  // Application Form Specific Handling
  const applicationForm = document.getElementById("applicationForm");
  if (applicationForm) {
    applicationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (applicationForm.checkValidity()) {
        // Get form data
        const formData = new FormData(applicationForm);
        const data = Object.fromEntries(formData);

        // Here you would typically send the data to a server
        console.log("Form submitted with data:", data);

        // Show success message (you can replace this with a proper modal/notification)
        alert("Application submitted successfully! We will contact you soon.");

        // Reset form
        applicationForm.reset();
        applicationForm.classList.remove("was-validated");
      } else {
        // Show validation errors
        const firstInvalid = applicationForm.querySelector(":invalid");
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    // Real-time validation feedback
    const inputs = applicationForm.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.checkValidity()) {
          input.classList.remove("border-primary");
          input.classList.add("border-primary");
        } else {
          input.classList.remove("border-primary");
          input.classList.add("border-[#FFFFFF1A]");
        }
      });
    });
  }
}

// Question Navigator (for test screens)
function initQuestionNavigator() {
  const questionButtons = document.querySelectorAll(".question-btn");

  questionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      questionButtons.forEach((b) =>
        b.classList.remove("bg-primary", "text-white")
      );
      // Add active class to clicked button
      btn.classList.add("bg-primary", "text-white");

      // Navigate to question (implement based on your needs)
      const questionNumber = btn.dataset.question;
      // Load question logic here
    });
  });
}

// Timer (for test screens)
function initTimer() {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    let totalSeconds = 60 * 60; // 60 minutes in seconds

    setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      timerElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        // Auto submit when time runs out
        alert("Time is up!");
      }
    }, 1000);
  }
}

// Initialize all functions on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initAnnouncementsSidebar();
  initMobileMenu();
  initJumpToQuestion();
  initSubmitTest();
  initFormValidation();
  initQuestionNavigator();
  initTimer();
});

// Close modals on outside click
document.addEventListener("click", (e) => {
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach((modal) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});
