// Translation Engine for VLAT Application
// Handles bilingual (English/Tamil) translation system

let translations = {};
let currentLang = "en";

/**
 * Get current language from localStorage or default to 'en'
 */
function getCurrentLanguage() {
  const saved = localStorage.getItem("vlat_language");
  return saved || "en";
}

/**
 * Set language and save to localStorage
 */
function setLanguage(lang) {
  if (lang !== "en" && lang !== "ta") {
    console.warn("Invalid language:", lang);
    return;
  }
  currentLang = lang;
  localStorage.setItem("vlat_language", lang);
  document.documentElement.lang = lang;
}

/**
 * Get base path for translations (works for root and subdirectory deployments)
 * Enhanced with better production path handling and error logging
 */
function getTranslationsBasePath() {
  try {
    // Get current page pathname (e.g., "/vlat/index.html" or "/vlat/")
    const pathname = window.location.pathname;
    const origin = window.location.origin;
    
    console.log("[Translations] Current pathname:", pathname);
    console.log("[Translations] Current origin:", origin);
    
    // Remove filename if present (index.html, about-vlat.html, etc.)
    // This gives us the directory path
    let dirPath = pathname.replace(/\/[^/]*\.html?$/, '');
    
    // Remove trailing slash if present
    dirPath = dirPath.replace(/\/$/, '');
    
    // If dirPath is empty or just '/', we're at root
    // Otherwise, construct path: /vlat/translations
    if (!dirPath || dirPath === '/') {
      const rootPath = '/translations';
      console.log("[Translations] Using root path:", rootPath);
      return rootPath;
    }
    
    // Ensure path starts with / and construct translations path
    const cleanPath = dirPath.startsWith('/') ? dirPath : `/${dirPath}`;
    const translationsPath = `${cleanPath}/translations`;
    console.log("[Translations] Using subdirectory path:", translationsPath);
    return translationsPath;
  } catch (error) {
    console.error("[Translations] Error determining base path:", error);
    // Fallback to root translations
    return '/translations';
  }
}

/**
 * Load translation file for specified language
 * Enhanced with comprehensive error handling and logging
 */
async function loadTranslations(lang) {
  try {
    const basePath = getTranslationsBasePath();
    const url = `${basePath}/${lang}.json`;
    
    console.log(`[Translations] Loading ${lang} translations from:`, url);
    
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorMsg = `Failed to load translations from ${url}: ${response.status} - ${response.statusText}`;
      console.error(`[Translations] ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    const loadedTranslations = await response.json();
    
    // Validate that we got valid JSON data
    if (!loadedTranslations || typeof loadedTranslations !== 'object') {
      throw new Error('Invalid translation data format');
    }
    
    const translationCount = Object.keys(loadedTranslations).length;
    console.log(`[Translations] Successfully loaded ${lang} translations (${translationCount} top-level keys)`);
    
    translations = loadedTranslations;
    currentLang = lang;
    document.documentElement.lang = lang;
    
    return translations;
  } catch (error) {
    console.error(`[Translations] Error loading ${lang} translations:`, error);
    console.error(`[Translations] Error details:`, {
      message: error.message,
      stack: error.stack,
      url: window.location.href
    });
    
    // Fallback to English if translation file fails to load
    if (lang !== "en") {
      console.warn(`[Translations] Falling back to English translations`);
      return await loadTranslations("en");
    }
    
    // Last resort: return empty object if even English fails
    console.error("[Translations] CRITICAL: Failed to load English translations!");
    console.error("[Translations] This is a critical error. Translations will not work.");
    translations = {};
    return {};
  }
}

/**
 * Get translation by key path (e.g., 'pages.index.hero.title')
 * @param {string} key - Translation key path
 * @param {string} fallback - Fallback text if key not found
 * @returns {string} Translated text
 */
function t(key, fallback = "") {
  if (!key) return fallback || "";

  const keys = key.split(".");
  let value = translations;

  for (const k of keys) {
    if (value === null || value === undefined) {
      return fallback || key;
    }
    value = value[k];
  }

  return value !== undefined && value !== null ? value : fallback || key;
}

/**
 * Get current page name from URL
 */
function getPageName() {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";
  let pageName = filename.replace(".html", "");
  // Handle index.html special case
  if (pageName === "index") {
    return "index";
  }
  return pageName;
}

/**
 * Translate meta tags (title, description)
 */
function translateMetaTags() {
  const pageName = getPageName();
  const metaKey = `meta.${pageName}`;

  // Translate page title
  const titleKey = `${metaKey}.title`;
  const title = t(titleKey);
  if (title && title !== titleKey) {
    document.title = title;
  }

  // Translate meta description
  const descKey = `${metaKey}.description`;
  const description = t(descKey);
  if (description && description !== descKey) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    } else {
      // Create meta description if it doesn't exist
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", description);
      document.head.appendChild(metaDesc);
    }
  }
}

/**
 * Translate single element and its children
 */
function translateElement(element) {
  if (!element) return;

  // Translate text content
  const i18nKey = element.getAttribute("data-i18n");
  if (i18nKey) {
    const translated = t(i18nKey);
    if (translated && translated !== i18nKey) {
      element.textContent = translated;
    }
  }

  // Translate attributes
  const attrs = [
    "alt",
    "title",
    "placeholder",
    "aria-label",
    "aria-placeholder",
  ];
  attrs.forEach((attr) => {
    const i18nAttr = `data-i18n-${attr}`;
    const attrKey = element.getAttribute(i18nAttr);
    if (attrKey) {
      const translated = t(attrKey);
      if (translated && translated !== attrKey) {
        element.setAttribute(attr, translated);
      }
    }
  });

  // Special handling for data-i18n-alt
  const altKey = element.getAttribute("data-i18n-alt");
  if (altKey) {
    const translated = t(altKey);
    if (translated && translated !== altKey) {
      element.alt = translated;
    }
  }

  // Special handling for data-i18n-placeholder
  const placeholderKey = element.getAttribute("data-i18n-placeholder");
  if (placeholderKey) {
    const translated = t(placeholderKey);
    if (translated && translated !== placeholderKey) {
      element.placeholder = translated;
    }
  }

  // Recursively translate children
  const children = element.querySelectorAll(
    "[data-i18n], [data-i18n-alt], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label]"
  );
  children.forEach((child) => translateElement(child));
}

/**
 * Translate entire page
 */
function translatePage() {
  if (!translations || Object.keys(translations).length === 0) {
    console.warn("[Translations] translatePage called but translations not loaded yet");
    return;
  }

  // Translate all elements with data-i18n attributes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  // Translate attributes
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.alt = translated;
      }
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.placeholder = translated;
      }
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.title = translated;
      }
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.setAttribute("aria-label", translated);
      }
    }
  });

  // Translate option elements
  document.querySelectorAll("option[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  // Translate meta tags
  translateMetaTags();

  // Update language switcher active state
  updateLanguageSwitcherState();
}

/**
 * Update language switcher button states
 * Updated to use class-based selectors to handle multiple buttons (desktop + mobile)
 */
function updateLanguageSwitcherState() {
  // Use class selector to find all language buttons
  const langEnButtons = document.querySelectorAll('[data-lang="en"]');
  const langTaButtons = document.querySelectorAll('[data-lang="ta"]');

  // Update all English buttons
  langEnButtons.forEach((btn) => {
    if (currentLang === "en") {
      btn.classList.add("active");
      btn.classList.remove("inactive");
    } else {
      btn.classList.remove("active");
      btn.classList.add("inactive");
    }
  });

  // Update all Tamil buttons
  langTaButtons.forEach((btn) => {
    if (currentLang === "ta") {
      btn.classList.add("active");
      btn.classList.remove("inactive");
    } else {
      btn.classList.remove("active");
      btn.classList.add("inactive");
    }
  });
}

/**
 * Initialize translation system
 * Updated to use class-based selectors and improved error handling
 */
async function initializeTranslations() {
  try {
    console.log("[Translations] Initializing translation system...");
    
    const lang = getCurrentLanguage();
    console.log("[Translations] Current language from storage:", lang);
    
    setLanguage(lang);
    
    // Load translations and wait for completion
    await loadTranslations(lang);
    
    // Apply translations immediately after loading
    if (translations && Object.keys(translations).length > 0) {
      console.log("[Translations] Applying translations to page...");
      translatePage();
      console.log("[Translations] Translations applied successfully");
    } else {
      console.warn("[Translations] No translations loaded, page will not be translated");
    }

    // Set up language switcher event listeners using class-based selectors
    // This handles both desktop and mobile buttons
    const langEnButtons = document.querySelectorAll('[data-lang="en"]');
    const langTaButtons = document.querySelectorAll('[data-lang="ta"]');

    console.log(`[Translations] Found ${langEnButtons.length} English button(s) and ${langTaButtons.length} Tamil button(s)`);

    // Attach listeners to all English buttons
    langEnButtons.forEach((btn) => {
      if (!btn.hasAttribute('data-listener-attached')) {
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("[Translations] English button clicked");
          await switchLanguage("en");
        });
      }
    });

    // Attach listeners to all Tamil buttons
    langTaButtons.forEach((btn) => {
      if (!btn.hasAttribute('data-listener-attached')) {
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("[Translations] Tamil button clicked");
          await switchLanguage("ta");
        });
      }
    });

    updateLanguageSwitcherState();
    console.log("[Translations] Translation system initialized successfully");
  } catch (error) {
    console.error("[Translations] Failed to initialize translation system:", error);
    console.error("[Translations] Error stack:", error.stack);
  }
}

/**
 * Switch language and translate page
 * Enhanced with error handling and logging
 */
async function switchLanguage(lang) {
  try {
    console.log(`[Translations] Switching language to: ${lang}`);
    
    setLanguage(lang);
    await loadTranslations(lang);
    
    if (translations && Object.keys(translations).length > 0) {
      translatePage();
      console.log(`[Translations] Language switched to ${lang} successfully`);
    } else {
      console.warn(`[Translations] Language switch to ${lang} completed but no translations available`);
    }

    // Trigger custom event for other scripts to react to language change
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang } })
    );
  } catch (error) {
    console.error(`[Translations] Error switching language to ${lang}:`, error);
    throw error;
  }
}

// Make t() function globally available
window.t = t;
window.translatePage = translatePage;
window.switchLanguage = switchLanguage;
window.initializeTranslations = initializeTranslations;
window.getCurrentLanguage = getCurrentLanguage;

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    t,
    translatePage,
    setLanguage,
    getCurrentLanguage,
    initializeTranslations,
    switchLanguage,
    loadTranslations,
  };
}
