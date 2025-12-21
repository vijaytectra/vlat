// Shared components and utilities

// Header Component
export function createHeader(isDashboard = false) {
  const headerClass = isDashboard
    ? "bg-white border-b border-grey-2 sticky top-0 z-50"
    : "bg-white border-b border-grey-2";

  return `
    <header class="${headerClass}">
      <div class="">
        <div class="flex items-center justify-between h-20 md:h-28">
          <!-- Logo -->
          <div class="flex items-center space-x-4">
            <img src="images/logo.png" alt="VMLS Logo" class="h-12 md:h-14 w-auto">
            <div class="hidden md:block border-l border-grey-4 pl-4">
              <span class="text-xl font-semibold text-grey-10">VLAT</span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-8">
            <a href="index.html" class="text-grey-7 hover:text-primary transition-colors">Home</a>
            <a href="about-vlat.html" class="text-grey-7 hover:text-primary transition-colors">About VLAT</a>
            <a href="about-vmls.html" class="text-grey-7 hover:text-primary transition-colors">About VMLS</a>
            <a href="blogs.html" class="text-grey-7 hover:text-primary transition-colors">Blog</a>
            <a href="how-to-register.html" class="text-grey-7 hover:text-primary transition-colors">How to Register</a>
            <a href="contact.html" class="text-grey-7 hover:text-primary transition-colors">Contact</a>
          </nav>

          <!-- Contact Info & CTA -->
          <div class="hidden lg:flex items-center space-x-6">
            <div class="flex items-center space-x-4 text-sm text-grey-7">
              <a href="tel:+917358201234" class="flex items-center space-x-2 hover:text-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 7358201234</span>
              </a>
              <a href="mailto:admissions@vmls.edu.in" class="flex items-center space-x-2 hover:text-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>admissions@vmls.edu.in</span>
              </a>
            </div>
            <a href="login.html" class="btn-primary">Login</a>
            <a href="how-to-register.html" class="btn-secondary">Register</a>
          </div>

          <!-- Mobile Menu Button -->
          <button id="mobileMenuBtn" class=" p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
          <nav class="flex flex-col space-y-4">
            <a href="index.html" class="text-grey-7 hover:text-primary">Home</a>
            <a href="about-vlat.html" class="text-grey-7 hover:text-primary">About VLAT</a>
            <a href="about-vmls.html" class="text-grey-7 hover:text-primary">About VMLS</a>
            <a href="blogs.html" class="text-grey-7 hover:text-primary">Blog</a>
            <a href="how-to-register.html" class="text-grey-7 hover:text-primary">How to Register</a>
            <a href="contact.html" class="text-grey-7 hover:text-primary">Contact</a>
            <div class="pt-4 border-t border-grey-4">
              <a href="login.html" class="btn-primary block text-center mb-2">Login</a>
              <a href="how-to-register.html" class="btn-secondary block text-center">Register</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `;
}

// Footer Component - Updated to match Figma design
export function createFooter() {
  return `
    <footer class="relative bg-[#2B0809] overflow-hidden">
      <div class="container-custom py-12 md:py-16 lg:py-20">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-16 xl:gap-[237px] mb-16 md:mb-20">
          <!-- Left Column: University Info & Social Media -->
          <div class="w-full lg:w-[338px] flex flex-col gap-12 lg:gap-20">
            <!-- Logo and Branding Section -->
            <div class="flex flex-col gap-6">
              <!-- Logo Image -->
              <div class="relative flex items-center gap-3">
                <img
                  src="images/vmlslogowhite1.svg"
                  alt="VMLS Logo"
                  class="h-[55px] w-auto object-contain"
                  onerror="this.style.display='none'"
                />
                <!-- Vertical Line -->
                <div class="h-[55px] w-px bg-grey-1"></div>
                <img
                  src="images/vlatlogowhite.svg"
                  alt="VLAT Logo"
                  class="h-[55px] w-auto object-contain"
                  onerror="this.style.display='none'"
                />
              </div>
              
              <!-- University Description -->
              <p class="text-base text-grey-1 font-normal leading-relaxed max-w-[338px]">
                Vinayaka Mission's Research Foundation (VMRF) is an innovative and pioneering University that offers a multi-disciplinary learning experience.
              </p>
            </div>

            <!-- Social Media Icons -->
            <div class="flex justify-center lg:justify-start items-center gap-6 lg:gap-[26px]">
              <!-- Instagram -->
              <a href="#" class="text-white hover:opacity-80 transition-opacity" aria-label="Instagram">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <!-- YouTube -->
              <a href="#" class="text-white hover:opacity-80 transition-opacity" aria-label="YouTube">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <!-- Facebook -->
              <a href="#" class="text-white hover:opacity-80 transition-opacity" aria-label="Facebook">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <!-- X (Twitter) -->
              <a href="#" class="text-white hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <!-- LinkedIn -->
              <a href="#" class="text-white hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Right Columns: Link Sections -->
          <div class="flex-1 lg:w-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-[50px]">
              <!-- Quick Links Column 1 -->
              <div class="flex flex-col gap-8">
                <!-- Header -->
                <div class="flex flex-col gap-3">
                  <div class="w-[70px] h-1 bg-grey-1 rounded-full"></div>
                  <h3 class="text-base font-bold text-grey-1 uppercase">Quick Links</h3>
                </div>
                <!-- Links -->
                <ul class="flex flex-col gap-[18px]">
                  <li>
                    <a href="index.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Home</a>
                  </li>
                  <li>
                    <a href="about-vlat.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">About VLAT</a>
                  </li>
                  <li>
                    <a href="about-vmls.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">About VMLS</a>
                  </li>
                  <li>
                    <a href="how-to-register.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Registration Process</a>
                  </li>
                  <li>
                    <a href="eligibility.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Eligibility</a>
                  </li>
                </ul>
              </div>

              <!-- Quick Links Column 2 -->
              <div class="flex flex-col gap-8">
                <!-- Header -->
                <div class="flex flex-col gap-3">
                  <div class="w-[70px] h-1 bg-grey-1 rounded-full"></div>
                  <h3 class="text-base font-bold text-grey-1 uppercase">Quick Links</h3>
                </div>
                <!-- Links -->
                <ul class="flex flex-col gap-[18px]">
                  <li>
                    <a href="blogs.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Blogs</a>
                  </li>
                  <li>
                    <a href="contact.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Contact Us</a>
                  </li>
                  <li>
                    <a href="mock-test.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Mock Test</a>
                  </li>
                  <li>
                    <a href="lead-form.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Lead Form Page</a>
                  </li>
                  <li>
                    <a href="login.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Candidate Login</a>
                  </li>
                </ul>
              </div>

              <!-- Legal & Information Column -->
              <div class="flex flex-col gap-8">
                <!-- Header -->
                <div class="flex flex-col gap-3">
                  <div class="w-[70px] h-1 bg-grey-1 rounded-full"></div>
                  <h3 class="text-base font-bold text-grey-1 uppercase">Legal & Information</h3>
                </div>
                <!-- Links -->
                <ul class="flex flex-col gap-[18px]">
                  <li>
                    <a href="privacy-policy.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="terms-conditions.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="disclaimer.html" class="text-base text-grey-4 font-normal hover:text-grey-1 transition-colors">Disclaimer</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center pt-8 border-t border-grey-5/20">
          <p class="text-xs text-grey-5 font-normal">
            Copyright © 2025 VMLS - Vinayaka Mission's Law School
          </p>
        </div>
      </div>
    </footer>
  `;
}

// Announcements Sidebar Component
export function createAnnouncementsSidebar() {
  return `
    <!-- Announcements Sidebar -->
    <div id="announcementSidebar" class="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold text-grey-10">Announcements</h2>
            <p class="text-sm text-grey-6 mt-1">Latest updates from our institute</p>
          </div>
          <button id="closeAnnouncement" class="p-2 hover:bg-grey-2 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input type="text" placeholder="Search announcements..." class="input-field pr-10">
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-grey-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button class="px-3 py-1 text-xs bg-grey-2 text-grey-7 rounded-full hover:bg-primary hover:text-white">All</button>
            <button class="px-3 py-1 text-xs bg-grey-2 text-grey-7 rounded-full hover:bg-primary hover:text-white">Updates</button>
            <button class="px-3 py-1 text-xs bg-grey-2 text-grey-7 rounded-full hover:bg-primary hover:text-white">Events</button>
            <button class="px-3 py-1 text-xs bg-grey-2 text-grey-7 rounded-full hover:bg-primary hover:text-white">News</button>
          </div>
        </div>

        <!-- Announcements List -->
        <div class="space-y-4">
          <!-- Announcement Item -->
          <div class="card">
            <div class="flex items-start justify-between mb-2">
              <div class="flex space-x-2">
                <span class="px-2 py-1 text-xs bg-primary text-white rounded">Updates</span>
                <span class="px-2 py-1 text-xs bg-grey-2 text-grey-7 rounded">Admissions</span>
              </div>
              <span class="text-xs text-grey-6">Nov 22, 2025</span>
            </div>
            <h3 class="font-semibold text-grey-10 mb-2">Undergraduate Admissions Open for Academic Year 2026-27</h3>
            <p class="text-sm text-grey-6 mb-3">Applications are now being accepted for various undergraduate programs. Register early to secure your seat.</p>
            <a href="#" class="text-sm text-primary hover:underline">Read more →</a>
          </div>

          <!-- Add more announcement items here -->
        </div>
      </div>
    </div>

    <!-- Announcement Button (Fixed Position) -->
    <button id="announcementBtn" class="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 bg-primary text-white px-4 py-20 rounded-l-lg shadow-lg hover:bg-opacity-90 transition-all">
      <span class="writing-vertical text-sm font-medium">Announcements</span>
      <svg class="w-6 h-6 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    </button>
  `;
}
