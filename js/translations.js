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
 * Load translation file for specified language
 */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`translations/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.status}`);
    }
    translations = await response.json();
    currentLang = lang;
    document.documentElement.lang = lang;
    return translations;
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fallback to English if translation file fails to load
    if (lang !== "en") {
      return await loadTranslations("en");
    }
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
  return filename.replace(".html", "").replace("index", "index");
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
    console.warn("Translations not loaded yet");
    return;
  }

  // Translate all elements with data-i18n attributes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated && translated !== key) {
      el.textContent = translated;
    }
  });

  // Translate attributes
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    const translated = t(key);
    if (translated && translated !== key) {
      el.alt = translated;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const translated = t(key);
    if (translated && translated !== key) {
      el.placeholder = translated;
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const translated = t(key);
    if (translated && translated !== key) {
      el.title = translated;
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    const translated = t(key);
    if (translated && translated !== key) {
      el.setAttribute("aria-label", translated);
    }
  });

  // Translate option elements
  document.querySelectorAll("option[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated && translated !== key) {
      el.textContent = translated;
    }
  });

  // Translate meta tags
  translateMetaTags();

  // Update language switcher active state
  updateLanguageSwitcherState();
}

/**
 * Update language switcher button states
 */
function updateLanguageSwitcherState() {
  const langEnBtn = document.getElementById("lang-en");
  const langTaBtn = document.getElementById("lang-ta");

  if (langEnBtn) {
    if (currentLang === "en") {
      langEnBtn.classList.add("active");
      langEnBtn.classList.remove("inactive");
    } else {
      langEnBtn.classList.remove("active");
      langEnBtn.classList.add("inactive");
    }
  }

  if (langTaBtn) {
    if (currentLang === "ta") {
      langTaBtn.classList.add("active");
      langTaBtn.classList.remove("inactive");
    } else {
      langTaBtn.classList.remove("active");
      langTaBtn.classList.add("inactive");
    }
  }
}

/**
 * Initialize translation system
 */
async function initializeTranslations() {
  const lang = getCurrentLanguage();
  setLanguage(lang);
  await loadTranslations(lang);

  // Set up language switcher event listeners
  const langEnBtn = document.getElementById("lang-en");
  const langTaBtn = document.getElementById("lang-ta");

  if (langEnBtn) {
    langEnBtn.addEventListener("click", async () => {
      await switchLanguage("en");
    });
  }

  if (langTaBtn) {
    langTaBtn.addEventListener("click", async () => {
      await switchLanguage("ta");
    });
  }

  updateLanguageSwitcherState();
}

/**
 * Switch language and translate page
 */
async function switchLanguage(lang) {
  setLanguage(lang);
  await loadTranslations(lang);
  translatePage();

  // Trigger custom event for other scripts to react to language change
  window.dispatchEvent(
    new CustomEvent("languageChanged", { detail: { lang } })
  );
}

// Make t() function globally available
window.t = t;
window.translatePage = translatePage;
window.switchLanguage = switchLanguage;
window.initializeTranslations = initializeTranslations;

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
