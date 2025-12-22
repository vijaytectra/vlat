// Main JavaScript file for VLAT Exam Application

// Announcements Data and Functions
let allAnnouncements = [];
let currentCategory = "All";
let searchQuery = "";

// Load announcements from JSON file
async function loadAnnouncements() {
  try {
    const response = await fetch("data/announcements.json");
    const data = await response.json();
    allAnnouncements = data.announcements || [];
    renderAnnouncements();
    renderCategoryFilters();
  } catch (error) {
    console.error("Error loading announcements:", error);
    allAnnouncements = [];
  }
}

// Get unique categories from announcements
function getCategories() {
  const categories = ["All"];
  const uniqueCategories = new Set();
  allAnnouncements.forEach((announcement) => {
    uniqueCategories.add(announcement.category);
  });
  return [...categories, ...Array.from(uniqueCategories).sort()];
}

// Render category filter buttons
function renderCategoryFilters() {
  const filterContainer = document.getElementById("announcementFilters");
  if (!filterContainer) return;

  const categories = getCategories();
  filterContainer.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className =
      "px-3 py-1 text-xs  text-grey-7 rounded-full hover:bg-primary hover:text-white category-filter";
    if (category === currentCategory) {
      button.classList.add("bg-primary", "text-white");
    }
    button.textContent = category;
    button.dataset.category = category;
    button.addEventListener("click", () => {
      currentCategory = category;
      renderCategoryFilters();
      renderAnnouncements();
    });
    filterContainer.appendChild(button);
  });
}

// Filter announcements based on category and search
function getFilteredAnnouncements() {
  let filtered = allAnnouncements;

  // Filter by category
  if (currentCategory !== "All") {
    filtered = filtered.filter(
      (announcement) => announcement.category === currentCategory
    );
  }

  // Filter by search query
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(query) ||
        announcement.description.toLowerCase().includes(query) ||
        announcement.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// Render announcements in the sidebar
function renderAnnouncements() {
  const container = document.getElementById("announcementsContainer");
  if (!container) return;

  const filtered = getFilteredAnnouncements();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-grey-6">No announcements found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map(
      (announcement) => `
    <div class="card border border-[#A3A3A3]">
      <div class="flex items-start justify-between mb-2">
        <div class="flex space-x-2 flex-wrap gap-2">
          <span class="px-2 py-1 text-xs bg-primary text-white rounded-full">${
            announcement.category
          }</span>
          ${announcement.tags
            .filter((tag) => tag !== announcement.category)
            .map(
              (tag) =>
                `<span class="px-2 py-1 text-xs bg-grey-2 text-grey-7 rounded-full">${tag}</span>`
            )
            .join("")}
        </div>
        <span class="text-xs text-grey-6">${announcement.date}</span>
      </div>
      <h3 class="font-medium text-[announcementsContainer] mb-2">${
        announcement.title
      }</h3>
      <p class="text-xs text-[#737373] mb-3">${announcement.description}</p>
      <a href="${
        announcement.link
      }" class="text-sm text-[#155DFC] hover:underline">Read more →</a>
    </div>
  `
    )
    .join("");
}

// Initialize search functionality
function initAnnouncementSearch() {
  const searchInput = document.querySelector(
    '#announcementSidebar input[type="text"][placeholder*="Search"]'
  );
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderAnnouncements();
    });
  }
}

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

  // Load announcements when sidebar is initialized
  loadAnnouncements();
  initAnnouncementSearch();
}

// Mobile Menu Toggle (Works on both mobile and desktop)
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobileMenu = document.getElementById("closeMobileMenu");
  const announcementBtn = document.getElementById("announcementBtn");

  if (!mobileMenuBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove("translate-x-full");
    mobileMenu.classList.add("translate-x-0", "z-50");
    document.body.style.overflow = "hidden";
    // Hide announcement button when menu opens
    if (announcementBtn) {
      announcementBtn.style.display = "none";
    }
  };

  const closeMenu = () => {
    mobileMenu.classList.add("translate-x-full");
    mobileMenu.classList.remove("translate-x-0", "z-50");
    document.body.style.overflow = "";
    // Show announcement button when menu closes
    if (announcementBtn) {
      announcementBtn.style.display = "";
    }
  };

  // Open menu
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openMenu();
  });

  // Close menu with close button
  if (closeMobileMenu) {
    closeMobileMenu.addEventListener("click", closeMenu);
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuBtn.contains(e.target) &&
      !mobileMenu.classList.contains("translate-x-full")
    ) {
      closeMenu();
    }
  });

  // Close menu when clicking a normal link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    if (link.id !== "announcementsLink") {
      link.addEventListener("click", closeMenu);
    }
  });

  // Announcements link behavior
  const announcementsLink = document.getElementById("announcementsLink");
  if (announcementsLink) {
    announcementsLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();

      const announcementSidebar = document.getElementById(
        "announcementSidebar"
      );
      if (announcementSidebar) {
        announcementSidebar.classList.remove("translate-x-full");
        announcementSidebar.classList.add("translate-x-0", "z-10");
      }
    });
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

// Scroll to Top Button
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (!scrollToTopBtn) return;

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.scrollY >= 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  // Initial check
  toggleScrollButton();

  // Listen for scroll events
  window.addEventListener("scroll", toggleScrollButton);

  // Smooth scroll to top on button click
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
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
  initScrollToTop();
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
