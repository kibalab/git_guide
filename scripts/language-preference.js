(() => {
  const STORAGE_KEY = "git-guide-language";

  function safeGet() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function safeSet(language) {
    if (!language) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function inferLanguage(element) {
    const explicit = element.getAttribute("data-language");
    if (explicit === "ko" || explicit === "ja") return explicit;

    const href = (element.getAttribute("href") || "").replace(/\\/g, "/");
    const text = (element.textContent || "").trim();

    if (href.includes("/ja/") || text.includes("日本語")) return "ja";
    if (text.includes("한국어")) return "ko";
    if (/guide\/pages\/index\.html$/i.test(href)) return "ko";
    return null;
  }

  function currentPageLanguage() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("ko")) return "ko";

    const pathname = window.location.pathname.replace(/\\/g, "/");
    return pathname.includes("/ja/") ? "ja" : "ko";
  }

  function applyLandingPreference(language) {
    const cards = Array.from(document.querySelectorAll(".lang-card"));
    if (!cards.length || !language) return;

    cards.forEach((card) => {
      const cardLanguage = inferLanguage(card);
      const isPreferred = cardLanguage === language;
      card.classList.toggle("is-preferred", isPreferred);
      if (isPreferred) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }
    });
  }

  function bindLanguageLinks(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      const language = inferLanguage(element);
      if (!language) return;
      element.addEventListener("click", () => safeSet(language));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindLanguageLinks(".lang-switch a, .lang-card");

    if (document.querySelector(".lang-switch")) {
      safeSet(currentPageLanguage());
    }

    applyLandingPreference(safeGet());
  });
})();
