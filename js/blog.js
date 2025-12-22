// Blog Data
const blogData = [
  {
    id: 1,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Court Judgements",
    categorySlug: "court-judgements",
    author: "Advocate Rajesh Kumar",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog1.svg",
  },
  {
    id: 2,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Student Life",
    categorySlug: "student-life",
    author: "Prof. Priya Menon",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog2.svg",
  },
  {
    id: 3,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Legal Research",
    categorySlug: "legal-research",
    author: "Dr. Anil Sharma",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog3.svg",
  },
  {
    id: 4,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Faculty Insights",
    categorySlug: "faculty-insights",
    author: "Prof. Meera Iyer",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog4.svg",
  },
  {
    id: 5,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Moot Court & Events",
    categorySlug: "moot-court-events",
    author: "Advocate Vikram Reddy",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog5.svg",
  },
  {
    id: 6,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Admissions",
    categorySlug: "admissions",
    author: "Dr. Suresh Nair",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog6.svg",
  },
  {
    id: 7,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Career Guidance",
    categorySlug: "career-guidance",
    author: "Advocate Kavita Desai",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog7.svg",
  },
  {
    id: 8,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Court Judgements",
    categorySlug: "court-judgements",
    author: "Advocate Arjun Patel",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog8.svg",
  },
  {
    id: 9,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Student Life",
    categorySlug: "student-life",
    author: "Prof. Deepak Joshi",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog9.svg",
  },
  {
    id: 10,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Legal Research",
    categorySlug: "legal-research",
    author: "Dr. Ramesh Krishnan",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog1.svg",
  },
  {
    id: 11,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Faculty Insights",
    categorySlug: "faculty-insights",
    author: "Prof. Lakshmi Venkatesh",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog2.svg",
  },
  {
    id: 12,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Moot Court & Events",
    categorySlug: "moot-court-events",
    author: "Advocate Sanjay Malhotra",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog3.svg",
  },
  {
    id: 13,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Admissions",
    categorySlug: "admissions",
    author: "Dr. Neha Gupta",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog4.svg",
  },
  {
    id: 14,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Career Guidance",
    categorySlug: "career-guidance",
    author: "Advocate Rohit Agarwal",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog5.svg",
  },
  {
    id: 15,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Court Judgements",
    categorySlug: "court-judgements",
    author: "Advocate Manoj Singh",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog6.svg",
  },
  {
    id: 16,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Student Life",
    categorySlug: "student-life",
    author: "Prof. Anjali Rao",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog7.svg",
  },
  {
    id: 17,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Legal Research",
    categorySlug: "legal-research",
    author: "Dr. Karthik Subramanian",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog8.svg",
  },
  {
    id: 18,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Faculty Insights",
    categorySlug: "faculty-insights",
    author: "Prof. Sunita Verma",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog9.svg",
  },
  {
    id: 19,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Moot Court & Events",
    categorySlug: "moot-court-events",
    author: "Advocate Pradeep Chaturvedi",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog1.svg",
  },
  {
    id: 20,
    title: "The Impact of Recent Supreme Court Judgements on Civil Liberties",
    description:
      "Exploring how landmark decisions have redefined fundamental rights and shaped public discourse on individual freedoms in contemporary India.",
    category: "Admissions",
    categorySlug: "admissions",
    author: "Dr. Ashok Mehta",
    date: "Nov 22, 2025",
    readTime: "8 min read",
    image: "images/blog2.svg",
  },
];

// Blog state
let currentTopic = "all";
let displayedCount = 9; // Initially show 9 blogs
const blogsPerLoad = 5;

// Create blog card HTML
function createBlogCard(blog) {
  return `
    <a href="blog.html" class="block">
      <article class="bg-white border border-grey-4 p-3  hover:shadow-lg transition-shadow">
        <div class="relative w-full h-48 rounded-xl overflow-hidden mb-5">
          <img 
            src="${blog.image}" 
            alt="${blog.title}"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3 bg-[#FFF6E2] rounded-[100px] px-3 py-1">
            <span class="text-primary text-xs font-normal font-['Arial'] leading-4">${blog.category}</span>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <h3 class="text-grey-10 text-base font-normal font-['Inter'] leading-6">${blog.title}</h3>
            <p class="text-grey-7 text-sm font-normal font-['Inter'] leading-5">${blog.description}</p>
          </div>
          <div class="pt-3 border-t border-grey-4 flex flex-wrap items-end gap-4 ">
            <div class="flex items-center gap-1.5">
              <i class="fas fa-user w-3.5 h-3.5 text-grey-5"></i>
              <span class="text-grey-7 text-xs font-normal font-['Arial'] leading-4">${blog.author}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fas fa-calendar w-3.5 h-3.5 text-grey-5"></i>
              <span class="text-grey-7 text-xs font-normal font-['Arial'] leading-4">${blog.date}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fas fa-clock w-3.5 h-3.5 text-grey-5"></i>
              <span class="text-grey-7 text-xs font-normal font-['Arial'] leading-4">${blog.readTime}</span>
            </div>
          </div>
        </div>
      </article>
    </a>
  `;
}

// Get filtered blogs based on current topic
function getFilteredBlogs() {
  if (currentTopic === "all") {
    return blogData;
  }
  return blogData.filter((blog) => blog.categorySlug === currentTopic);
}

// Render blogs
function renderBlogs() {
  const blogGrid = document.getElementById("blogGrid");
  const filteredBlogs = getFilteredBlogs();
  const blogsToShow = filteredBlogs.slice(0, displayedCount);

  if (blogsToShow.length === 0) {
    blogGrid.innerHTML =
      '<p class="col-span-full text-center text-grey-7 py-8">No blogs found for this topic.</p>';
    document.getElementById("loadMoreBtn").style.display = "none";
    return;
  }

  blogGrid.innerHTML = blogsToShow.map((blog) => createBlogCard(blog)).join("");

  // Show/hide load more button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (displayedCount >= filteredBlogs.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "flex";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Topic filter buttons
  const topicFilters = document.querySelectorAll(".topic-filter");

  topicFilters.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      topicFilters.forEach((btn) =>
        btn.classList.remove("active-topic", "bg-white", "border-primary")
      );

      // Add active class to clicked button
      this.classList.add("active-topic", "bg-white", "border-primary");

      // Update current topic and reset displayed count
      currentTopic = this.dataset.topic;
      displayedCount = 9;

      // Re-render blogs
      renderBlogs();

      // Scroll to blog section
      document
        .querySelector("#blogGrid")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Load more button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.addEventListener("click", function () {
    displayedCount += blogsPerLoad;
    renderBlogs();
  });

  // Initial render
  renderBlogs();

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobileMenu = document.getElementById("closeMobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.remove("translate-x-full");
    });
  }

  if (closeMobileMenu && mobileMenu) {
    closeMobileMenu.addEventListener("click", function () {
      mobileMenu.classList.add("translate-x-full");
    });
  }
});
