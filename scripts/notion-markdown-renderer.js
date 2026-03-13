(function (global) {
  "use strict";

  var DEFAULT_OPTIONS = {
    rootClass: "notion-md",
    sanitize: true,
    codeHighlight: true,
    markedUrl: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
    domPurifyUrl: "https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js",
    highlightJsUrl: "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/common.min.js"
  };

  function merge(base, override) {
    var out = {};
    var key;
    for (key in base) out[key] = base[key];
    for (key in override) out[key] = override[key];
    return out;
  }

  function resolveElement(target) {
    if (!target) return null;
    if (typeof target === "string") return document.querySelector(target);
    if (target && target.nodeType === 1) return target;
    return null;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (!src) {
        reject(new Error("Missing script src."));
        return;
      }

      var existing = document.querySelector('script[data-notion-md-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute("data-loaded") === "1") {
          resolve();
          return;
        }
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Failed to load script: " + src)); }, { once: true });
        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-notion-md-src", src);
      script.addEventListener("load", function () {
        script.setAttribute("data-loaded", "1");
        resolve();
      }, { once: true });
      script.addEventListener("error", function () {
        reject(new Error("Failed to load script: " + src));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeParse(markedApi, markdown, renderer) {
    if (!markedApi) return "";
    if (typeof markedApi.parse === "function") {
      return markedApi.parse(markdown, { renderer: renderer });
    }
    if (typeof markedApi === "function") {
      return markedApi(markdown, { renderer: renderer });
    }
    return "";
  }

  function NotionMarkdownRenderer(container, options) {
    var root = resolveElement(container);
    if (!root) throw new Error("NotionMarkdownRenderer: container not found");

    this.container = root;
    this.options = merge(DEFAULT_OPTIONS, options || {});
    this.renderer = null;
    this.ready = this.init();
  }

  NotionMarkdownRenderer.prototype.init = async function () {
    await this.ensureDependencies();
    this.configureMarkedRenderer();
    this.container.classList.add(this.options.rootClass);
  };

  NotionMarkdownRenderer.prototype.ensureDependencies = async function () {
    if (!global.marked) {
      await loadScript(this.options.markedUrl);
    }

    if (this.options.sanitize && !(global.DOMPurify && typeof global.DOMPurify.sanitize === "function")) {
      await loadScript(this.options.domPurifyUrl);
    }

    if (this.options.codeHighlight && !global.hljs) {
      try {
        await loadScript(this.options.highlightJsUrl);
      } catch (error) {
        /* Optional dependency: continue without syntax highlighting. */
      }
    }
  };

  NotionMarkdownRenderer.prototype.configureMarkedRenderer = function () {
    var markedApi = global.marked;
    if (!markedApi || !markedApi.Renderer) return;

    var renderer = new markedApi.Renderer();
    var self = this;

    renderer.link = function (href, title, text) {
      var safeHref = escapeHtml(href || "#");
      var titleAttr = title ? ' title="' + escapeHtml(title) + '"' : "";
      return '<a href="' + safeHref + '"' + titleAttr + ' target="_blank" rel="noopener noreferrer">' + text + "</a>";
    };

    renderer.code = function (code, infostring) {
      var language = String(infostring || "").trim().split(/\s+/)[0];
      var highlighted = escapeHtml(code);

      if (self.options.codeHighlight && global.hljs) {
        try {
          if (language && global.hljs.getLanguage && global.hljs.getLanguage(language)) {
            highlighted = global.hljs.highlight(code, { language: language }).value;
          } else if (global.hljs.highlightAuto) {
            highlighted = global.hljs.highlightAuto(code).value;
          }
        } catch (error) {
          highlighted = escapeHtml(code);
        }
      }

      var className = language ? ' class="language-' + escapeHtml(language) + '"' : "";
      return "<pre><code" + className + ">" + highlighted + "</code></pre>";
    };

    if (typeof markedApi.setOptions === "function") {
      markedApi.setOptions({
        gfm: true,
        breaks: true,
        mangle: false,
        headerIds: false
      });
    }

    this.renderer = renderer;
  };

  NotionMarkdownRenderer.prototype.render = async function (markdownText) {
    await this.ready;

    var text = typeof markdownText === "string" ? markdownText : String(markdownText || "");
    var html = safeParse(global.marked, text, this.renderer);

    if (this.options.sanitize && global.DOMPurify && typeof global.DOMPurify.sanitize === "function") {
      html = global.DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true }
      });
    }

    this.container.innerHTML = html;
    return html;
  };

  NotionMarkdownRenderer.prototype.renderFromElement = async function (sourceElement) {
    var source = resolveElement(sourceElement);
    if (!source) throw new Error("NotionMarkdownRenderer: source element not found");
    return this.render(source.textContent || "");
  };

  NotionMarkdownRenderer.prototype.renderFromUrl = async function (url) {
    var response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch markdown: " + response.status + " " + response.statusText);
    }
    var text = await response.text();
    return this.render(text);
  };

  global.NotionMarkdownRenderer = NotionMarkdownRenderer;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { NotionMarkdownRenderer: NotionMarkdownRenderer };
  }
})(typeof window !== "undefined" ? window : globalThis);

