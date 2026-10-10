const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.resolve(__dirname, "..");

async function loadPage(file, { reducedMotion = false, glossary = true, commandsEnabled = false, storageUnavailable = false } = {}) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), "utf8"), {
    url: "https://kibalab.github.io/git_guide/" + file,
    runScripts: "outside-only",
    pretendToBeVisual: true
  });
  const { window } = dom;
  await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
  const motionListeners = new Set();
  const motion = {
    matches: reducedMotion,
    addEventListener(type, fn) { motionListeners.add(fn); },
    removeEventListener(type, fn) { motionListeners.delete(fn); }
  };
  window.matchMedia = () => motion;
  if (commandsEnabled) window.localStorage.setItem("git-guide-command-explanations", "true");
  if (storageUnavailable) Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage unavailable"); } });
  const graphs = [];
  let implementation;
  Object.defineProperty(window, "GitGraphVisualizer", {
    configurable: true,
    get() { return implementation; },
    set(value) {
      implementation = function (...args) {
        const graph = new value(...args);
        graph.options.stageMotion = false;
        graphs.push(graph);
        return graph;
      };
      implementation.prototype = value.prototype;
    }
  });
  for (const script of window.document.querySelectorAll("script")) {
    const src = script.getAttribute("src");
    if (!glossary && src?.endsWith("glossary.js")) continue;
    const code = src
      ? fs.readFileSync(path.resolve(root, path.dirname(file), src), "utf8")
      : script.textContent;
    if (code.trim()) window.eval(code);
  }
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  return {
    window, graphs, motion,
    changeMotion(matches) { motion.matches = matches; motionListeners.forEach(fn => fn()); },
    close() { graphs.forEach(g => g.destroy()); window.close(); }
  };
}

module.exports = { loadPage, root };
