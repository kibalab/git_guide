(function () {
  "use strict";

  var storageKey = "git-guide-command-explanations";
  var language = document.documentElement.lang.indexOf("ja") === 0 ? "ja" : "ko";
  var sourceLabel = language === "ja" ? "公式ドキュメント" : "공식 문서";

  function readPreference() {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch (error) {
      return null;
    }
  }

  function sourceUrl(command) {
    var parts = command.split(/\s+/);
    if (parts[0] === "gh") {
      return "https://cli.github.com/manual/gh_" + parts.slice(1, 3).join("_");
    }
    var name = parts[1];
    return "https://git-scm.com/docs/" + (name.indexOf("-") === 0 ? "git" : "git-" + name);
  }

  function renderBlock(block, index) {
    var content = window.GitGuideCommandData[block.dataset.commandGuide];
    if (!content) return false;
    block.id = "command-guide-" + index;
    var heading = document.createElement("h3");
    heading.id = block.id + "-title";
    heading.textContent = content.title[language];
    block.setAttribute("aria-labelledby", heading.id);
    block.appendChild(heading);
    if (content.note[language]) {
      var note = document.createElement("p");
      note.className = "command-guide-note";
      note.textContent = content.note[language];
      block.appendChild(note);
    }
    var list = document.createElement("ol");
    content.steps.forEach(function (step) {
      var item = document.createElement("li");
      var description = document.createElement("p");
      description.textContent = step.description[language];
      var example = document.createElement("pre");
      example.tabIndex = 0;
      example.setAttribute("aria-label", step.description[language]);
      var code = document.createElement("code");
      code.textContent = step.command;
      example.appendChild(code);
      var source = document.createElement("a");
      source.className = "command-guide-source";
      source.href = sourceUrl(step.command);
      source.textContent = sourceLabel;
      item.appendChild(description);
      item.appendChild(example);
      item.appendChild(source);
      list.appendChild(item);
    });
    if (content.steps.length) block.appendChild(list);
    return true;
  }

  function init() {
    var button = document.getElementById("command-toggle");
    if (!button || button.dataset.bound || !window.GitGuideCommandData) return;
    button.dataset.bound = "true";
    var blocks = Array.from(document.querySelectorAll("[data-command-guide]")).filter(renderBlock);
    if (!blocks.length) return;
    button.setAttribute("aria-controls", blocks.map(function (block) { return block.id; }).join(" "));
    button.hidden = false;

    function setVisible(visible) {
      if (!visible && blocks.some(function (block) { return block.contains(document.activeElement); })) {
        button.focus({ preventScroll: true });
      }
      button.setAttribute("aria-pressed", visible ? "true" : "false");
      blocks.forEach(function (block) { block.hidden = !visible; });
    }

    setVisible(readPreference() === true);
    button.addEventListener("click", function () {
      var visible = button.getAttribute("aria-pressed") !== "true";
      setVisible(visible);
      try {
        window.localStorage.setItem(storageKey, String(visible));
      } catch (error) {}
    });
    window.addEventListener("storage", function (event) {
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch (error) {
        return;
      }
      if (event.key === storageKey || event.key === null) setVisible(event.newValue === "true");
    });
    window.addEventListener("pageshow", function () {
      var preference = readPreference();
      if (preference !== null) setVisible(preference);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
