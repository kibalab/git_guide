const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadPage, root } = require("./helpers.cjs");

test("Japanese glossary recognizes line terminology without matching 行う", async () => {
  const page = await loadPage("guide/pages/ja/chapter-5.html");
  try {
    const paragraph = Array.from(page.window.document.querySelectorAll(".doc p")).find(p => p.textContent.includes("行う"));
    assert.ok(paragraph);
    assert.ok(!paragraph.querySelector('.term-label[aria-label="行 の説明"]'));
    const line = Array.from(page.window.document.querySelectorAll(".term-label")).find(el => el.textContent === "行単位");
    assert.ok(line);
  } finally { page.close(); }
});

test("Latin glossary aliases do not match longer identifiers", async () => {
  const page = await loadPage("guide/pages/chapter-6.html", { glossary: false });
  try {
    const paragraph = page.window.document.createElement("p");
    paragraph.textContent = "PROJECT HEADERS Commitments Pulling";
    page.window.document.querySelector(".doc").prepend(paragraph);
    page.window.eval(fs.readFileSync(path.join(root, "guide/scripts/glossary.js"), "utf8"));
    assert.equal(paragraph.querySelectorAll(".term-ref").length, 0);
  } finally { page.close(); }
});

test("glossary trigger exposes its description and closes with Escape", async () => {
  const page = await loadPage("guide/pages/chapter-5.html");
  try {
    const trigger = page.window.document.querySelector(".term-label");
    const wrapper = trigger.closest(".term-ref");
    const popup = page.window.document.getElementById(trigger.getAttribute("aria-controls"));
    assert.ok(page.window.document.getElementById(trigger.getAttribute("aria-describedby")));
    assert.equal(trigger.getAttribute("role"), "button");
    assert.ok(popup.hidden);
    trigger.focus();
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.equal(popup.hidden, false);
    trigger.dispatchEvent(new page.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(popup.hidden, true);
    assert.equal(page.window.document.activeElement, trigger);
    trigger.click();
    assert.ok(wrapper.classList.contains("is-open"));
    const link = popup.querySelector("a");
    link.focus();
    link.dispatchEvent(new page.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert.equal(page.window.document.activeElement, trigger);
    assert.equal(popup.hidden, true);
  } finally { page.close(); }
});

test("last appendix participates in glossary navigation", async () => {
  const page = await loadPage("guide/pages/extra-4.html");
  try { assert.ok(page.window.document.querySelectorAll(".term-ref").length > 0); }
  finally { page.close(); }
});

test("language preference survives returning to the landing page", async () => {
  const page = await loadPage("index.html");
  try {
    page.window.document.querySelector('[data-language="ja"]').dispatchEvent(new page.window.Event("click"));
    assert.equal(page.window.localStorage.getItem("git-guide-language"), "ja");
    page.window.document.dispatchEvent(new page.window.Event("DOMContentLoaded"));
    assert.ok(page.window.document.querySelector('[data-language="ja"]').classList.contains("is-preferred"));
  } finally { page.close(); }
});
