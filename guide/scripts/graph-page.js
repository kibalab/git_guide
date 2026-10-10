(function () {
  "use strict";

  window.GitGuideStrategyTabs = function (factories) {
    var rendered = new Set();
    var tabs = Array.from(document.querySelectorAll("[data-strategy]"));
    var panels = Array.from(document.querySelectorAll(".tab-panel"));
    function activate(strategy) {
      tabs.forEach(function (tab) {
        var active = tab.dataset.strategy === strategy;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(function (panel) {
        var active = panel.id === "panel-" + strategy;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      if (!rendered.has(strategy)) {
        factories[strategy]();
        rendered.add(strategy);
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab.dataset.strategy);
        tab.focus();
      });
      tab.addEventListener("keydown", function (event) {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        var next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        activate(tabs[next].dataset.strategy);
        tabs[next].focus();
      });
    });
    if (tabs.length) activate((tabs.find(function (tab) {
      return tab.getAttribute("aria-selected") === "true";
    }) || tabs[0]).dataset.strategy);
  };
})();
