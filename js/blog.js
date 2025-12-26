// Hardcoded Blog Data (fallback)
const hardcodedBlogData = [
  {
    id: 1,
    title: "What Is a Moot Court?",
    description:
      "A complete guide to Moot Courts—what they are, why they matter in legal education, how competitions work, and how students transform into confident advocates through mooting.",
    category: "Moot Court",
    categorySlug: "moot-court",
    author: "VMLS Editorial Team",
    date: "Nov 7, 2025",
    readTime: "10 min read",
    image: "images/blogs/blog1.png",
    redirectUrl: "https://vmls.edu.in/blog/what-is-a-moot-court",
  },
  {
    id: 2,
    title: "Top Law College in Chennai for LL.B., LL.M. & Ph.D. Admissions",
    description:
      "A comprehensive overview of Vinayaka Mission’s Law School (VMLS), Chennai—programs offered, admissions process, scholarships, faculty excellence, and career prospects for aspiring law professionals.",
    category: "Law Colleges in India",
    categorySlug: "law-colleges-in-india",
    author: "VMLS Editorial Team",
    date: "Oct 11, 2025",
    readTime: "15 min read",
    image: "images/blogs/blog2.png",
    redirectUrl:
      "https://vmls.edu.in/blog/top-law-college-in-chennai-for-llb-llm-ph-d-admissions/",
  },
  {
    id: 3,
    title: "The Best Law Colleges in India",
    description:
      "A detailed guide to the best law colleges in India, including NLUs and top private law schools, eligibility criteria, entrance exams, NIRF rankings, placements, and three-year LLB options for aspiring law students.",
    category: "Law Colleges in India",
    categorySlug: "law-colleges-in-india",
    author: "VMLS Editorial Team",
    date: "Oct 9, 2025",
    readTime: "14 min read",
    image: "images/blogs/blog3.webp",
    redirectUrl: "https://vmls.edu.in/blog/the-best-law-colleges-in-india/",
  },
  {
    id: 4,
    title:
      "Bachelor’s Degree in Law: The Ultimate Guide to LLB Courses, Entrance Exams, and Career Opportunities",
    description:
      "A complete guide to the Bachelor’s Degree in Law (LLB), covering eligibility criteria, types of LLB programs, entrance exams, top law schools in India, and career opportunities after graduation.",
    category: "LLB",
    categorySlug: "llb",
    author: "VMLS Editorial Team",
    date: "Sep 21, 2025",
    readTime: "16 min read",
    image: "images/blogs/blog4.png",
    redirectUrl: "https://vmls.edu.in/blog/bachelors-degree-in-law/",
  },
  {
    id: 5,
    title: "Why Distance LL.B. Degrees Are Not Approved in India?",
    description:
      "A clear legal explanation of why distance or correspondence LL.B. degrees are not approved by the Bar Council of India (BCI), including eligibility rules, attendance requirements, and what law aspirants must know before choosing a law program.",
    category: "Distance LL.B.",
    categorySlug: "distance-llb",
    author: "VMLS Editorial Team",
    date: "Sep 3, 2025",
    readTime: "13 min read",
    image: "images/blogs/blog5.png",
    redirectUrl:
      "https://vmls.edu.in/blog/why-distance-ll-b-degrees-are-not-approved-in-india/",
  },
  {
    id: 6,
    title:
      "Empowering Migrant Labourers in Chennai Through Clinical Legal Education and Access to Justice",
    description:
      "An in-depth look at how clinical legal education at Vinayaka Mission’s Law School enables law students to support migrant labourers in Chennai through legal aid, awareness programs, mediation, and access to justice initiatives.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "VMLS Editorial Team",
    date: "Aug 21, 2025",
    readTime: "12 min read",
    image: "images/blogs/blog6.png",
    redirectUrl:
      "https://vmls.edu.in/blog/empowering-migrant-labourers-in-chennai-through-clinical-legal-education-and-access-to-justice/",
  },
  {
    id: 7,
    title:
      "The Impact of Clinical Legal Education on Legal Practitioners’ Professional Skills and Social Justice",
    description:
      "An academic perspective on how Clinical Legal Education (CLE) enhances professional legal skills, ethical reasoning, and access to social justice, with insights from legal aid clinics and family law practice in India.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "Kamala Priyadarshini",
    date: "Jul 6, 2025",
    readTime: "14 min read",
    image: "images/blogs/blog7.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/fostering-legal-skills-and-advancing-social-justice-through-cle.html",
  },
  {
    id: 8,
    title:
      "Justice at the Grassroots: Clinical Legal Education and Family Law Practice in India",
    description:
      "A faculty-authored perspective on how Clinical Legal Education and legal aid clinics shape ethical, independent, and socially responsible lawyers, with a focus on family law practice and grassroots justice in India.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "Dr. Kannan Kunnathully",
    date: "Jul 2, 2025",
    readTime: "11 min read",
    image: "images/blogs/blog8.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/justice-at-the-grassroots-clinical-legal-education-and-family-law-practice-in-india.html",
  },
  {
    id: 9,
    title:
      "Law and Economics in Clinical Legal Education: Recasting Experiential Learning in the 5-Year LLB Program",
    description:
      "An interdisciplinary analysis of how Law and Economics can be integrated into Clinical Legal Education to enhance experiential learning, institutional design, and policy-oriented legal training in the 5-Year LLB program.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "Tathagat Sharma",
    date: "Jun 30, 2025",
    readTime: "12 min read",
    image: "images/blogs/blog9.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/decoding-competition-law-the-cle-approach.html",
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
    image: "images/blogs/blog10.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/the-impact-of-recent-supreme-court-judgements-on-civil-liberties.html",
  },
  {
    id: 11,
    title: "Empowering Women through Clinical Legal Education in India",
    description:
      "An in-depth examination of how Clinical Legal Education and pro bono legal clinics empower women in rural and suburban India by improving access to justice, legal awareness, and ethical lawyering.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "Mike Ruban",
    date: "Jun 30, 2025",
    readTime: "13 min read",
    image: "images/blogs/blog11.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/empowering-women-through-clinical-legal-education-in-india.html",
  },
  {
    id: 12,
    title: "Why Clinical Legal Education & ADR Matter in India",
    description:
      "A faculty perspective on how Clinical Legal Education (CLE) and Alternative Dispute Resolution (ADR) are reshaping legal training in India by combining practical learning, mediation skills, and social justice engagement.",
    category: "Clinical Legal Education",
    categorySlug: "clinical-legal-education",
    author: "Shubham Shukla",
    date: "Jun 29, 2025",
    readTime: "10 min read",
    image: "images/blogs/blog12.webp",
    redirectUrl:
      "https://vmls.edu.in/blogs/why-clinical-legal-education-and-adr-are-crucial-for-indian-justice.html",
  },
];

// API Configuration
const API_BASE_URL = "https://vlat.api.thelead101.com";

// Blog state
let currentTopic = "all";
let displayedCount = 9;
let allBlogs = []; // Combined WordPress + hardcoded blogs
let wordpressBlogs = []; // WordPress blogs

// Create blog card HTML
function createBlogCard(blog) {
  return `
  <a href="${blog.redirectUrl}" class="block h-full">
  <article
    class="bg-white h-full min-h-[400px] border border-grey-4 p-3 
           hover:shadow-lg transition-shadow 
           flex flex-col"
  >
    <!-- Image -->
    <div class="relative w-full h-48 rounded-xl overflow-hidden mb-5">
      <img 
        src="${blog.image}" 
        alt="${blog.title}"
        class="w-full h-full object-cover"
        onerror="this.onerror=null; this.src='images/blogs/blog-default.png';"
      />
      <div class="absolute top-3 left-3 bg-[#FFF6E2] rounded-[100px] px-3 py-1">
        <span class="text-primary text-xs font-normal leading-4">
          ${blog.category}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 flex-grow">
      <div class="flex flex-col gap-3">
        <h1
          class="text-grey-10 text-base font-normal leading-6 
                 line-clamp-2"
        >
          ${blog.title}
        </h1>

        <p
          class="text-grey-7 text-sm font-normal leading-5 
                 line-clamp-5"
        >
          ${blog.description}
        </p>
      </div>

      <!-- Footer (Pinned to bottom + centered) -->
      <div
        class="pt-3 border-t border-grey-4 
               flex justify-center gap-6 mt-auto"
      >
        <div class="flex items-center gap-1.5">
          <i class="fas fa-user text-grey-5 text-xs"></i>
          <span class="text-grey-7 text-xs">${blog.author}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <i class="fas fa-calendar text-grey-5 text-xs"></i>
          <span class="text-grey-7 text-xs">${blog.date}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <i class="fas fa-clock text-grey-5 text-xs"></i>
          <span class="text-grey-7 text-xs">${blog.readTime}</span>
        </div>
      </div>
    </div>
  </article>
</a>

  `;
}

/**
 * Format date from ISO 8601 to "MMM DD, YYYY" format
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

/**
 * Create slug from category name
 */
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Transform WordPress post to blog format
 */
function transformWordPressPost(wpPost) {
  try {
    // Extract title
    const title = wpPost.title?.rendered || "Untitled";

    // Extract description from excerpt (strip HTML, limit to 200 chars)
    let description = "";
    if (wpPost.excerpt?.rendered) {
      description = stripHtml(wpPost.excerpt.rendered).trim().substring(0, 200);
      if (description.length === 200) {
        description += "...";
      }
    }
    if (!description) {
      description = "No description available.";
    }

    // Format date
    const date = wpPost.date ? formatDate(wpPost.date) : "Unknown date";

    // Extract author
    let author = "VMLS Editorial Team";
    if (
      wpPost._embedded?.author &&
      Array.isArray(wpPost._embedded.author) &&
      wpPost._embedded.author.length > 0
    ) {
      author = wpPost._embedded.author[0].name || author;
    }

    // Extract featured image
    let image = "images/blogs/blog-default.png"; // Default fallback
    if (
      wpPost._embedded?.["wp:featuredmedia"] &&
      Array.isArray(wpPost._embedded["wp:featuredmedia"]) &&
      wpPost._embedded["wp:featuredmedia"].length > 0
    ) {
      const featuredMedia = wpPost._embedded["wp:featuredmedia"][0];
      if (featuredMedia.source_url) {
        image = featuredMedia.source_url;
      }
    }

    // Extract category
    let category = "Uncategorized";
    let categorySlug = "uncategorized";
    if (
      wpPost._embedded?.["wp:term"] &&
      Array.isArray(wpPost._embedded["wp:term"])
    ) {
      // Find category taxonomy
      for (const termGroup of wpPost._embedded["wp:term"]) {
        if (Array.isArray(termGroup)) {
          const categoryTerm = termGroup.find(
            (term) => term.taxonomy === "category"
          );
          if (categoryTerm) {
            category = categoryTerm.name || category;
            categorySlug = categoryTerm.slug || createSlug(category);
            break;
          }
        }
      }
    }

    // Get redirect URL
    const redirectUrl = wpPost.link || "#";

    return {
      id: wpPost.id || Date.now(),
      title: title,
      description: description,
      category: category,
      categorySlug: categorySlug,
      author: author,
      date: date,
      readTime: "5 min read", // Default as per plan
      image: image,
      redirectUrl: redirectUrl,
      isWordPress: true, // Flag to identify WordPress blogs
    };
  } catch (error) {
    return null;
  }
}

/**
 * Fetch blogs from WordPress via backend proxy
 */
async function fetchWordPressBlogs() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/wordpress?per_page=9`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid response from backend");
    }

    const posts = result.data;

    // Transform WordPress posts to blog format
    const transformedBlogs = posts
      .map(transformWordPressPost)
      .filter((blog) => blog !== null);

    return transformedBlogs;
  } catch (error) {
    console.warn("Failed to fetch WordPress blogs:", error.message);
    return [];
  }
}

/**
 * Combine WordPress and hardcoded blogs
 */
function combineBlogs(wordpressBlogs, hardcodedBlogs) {
  // If WordPress has 9 or more blogs, use only WordPress (newest 9)
  if (wordpressBlogs.length >= 9) {
    return wordpressBlogs.slice(0, 9);
  }

  // If WordPress has less than 9, combine WordPress first, then hardcoded
  const combined = [...wordpressBlogs];
  const remaining = 9 - wordpressBlogs.length;

  // Add hardcoded blogs to fill up to 9 total
  for (let i = 0; i < remaining && i < hardcodedBlogs.length; i++) {
    combined.push(hardcodedBlogs[i]);
  }

  return combined;
}

// Get filtered blogs based on current topic
function getFilteredBlogs() {
  const blogsToFilter = allBlogs.length > 0 ? allBlogs : hardcodedBlogData;
  if (currentTopic === "all") {
    return blogsToFilter;
  }
  return blogsToFilter.filter((blog) => blog.categorySlug === currentTopic);
}

// Render blogs
function renderBlogs() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  const filteredBlogs = getFilteredBlogs();
  const blogsToShow = filteredBlogs.slice(0, displayedCount);

  if (blogsToShow.length === 0) {
    blogGrid.innerHTML =
      '<p class="col-span-full text-center text-grey-7 py-8">No blogs found for this topic.</p>';
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
    return;
  }

  blogGrid.innerHTML = blogsToShow.map((blog) => createBlogCard(blog)).join("");

  // Always show load more button (it redirects to WordPress)
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
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

      // Re-render blogs (use allBlogs which is already combined)
      renderBlogs();

      // Scroll to blog section
      document
        .querySelector("#blogGrid")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Load more button - redirect to WordPress blog page
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      window.location.href = "https://vmls.edu.in/blogs.html";
    });
    // Update button text to indicate it redirects
    loadMoreBtn.textContent = "View All Blogs";
  }

  // Initialize: Fetch WordPress blogs and render
  async function initializeBlogs() {
    const blogGrid = document.getElementById("blogGrid");
    if (blogGrid) {
      blogGrid.innerHTML =
        '<p class="col-span-full text-center text-grey-7 py-8">Loading blogs...</p>';
    }

    try {
      wordpressBlogs = await fetchWordPressBlogs();
      allBlogs = combineBlogs(wordpressBlogs, hardcodedBlogData);
      renderBlogs();
    } catch (error) {
      console.error("Error initializing blogs:", error);
      allBlogs = hardcodedBlogData;
      renderBlogs();
    }
  }

  initializeBlogs();

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
