const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadPage, root } = require("./helpers.cjs");
const key = "git-guide-command-explanations";
const files = ["guide/pages", "guide/pages/ja"].flatMap(dir =>
  fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith(".html")).map(file => dir + "/" + file)
);

for (const file of files) {
  test(file + " adds contextual commands only when enabled", async () => {
    const page = await loadPage(file);
    try {
      const button = page.window.document.getElementById("command-toggle");
      const blocks = Array.from(page.window.document.querySelectorAll("[data-command-guide]"));
      assert.ok(button && !button.hidden);
      assert.ok(blocks.length > 0);
      assert.ok(blocks.every(block => block.hidden));
      assert.equal(button.getAttribute("aria-pressed"), "false");
      for (const id of button.getAttribute("aria-controls").split(" ")) {
        assert.ok(page.window.document.getElementById(id));
      }
      button.focus();
      button.click();
      assert.equal(page.window.document.activeElement, button);
      assert.equal(button.getAttribute("aria-pressed"), "true");
      assert.equal(page.window.localStorage.getItem(key), "true");
      assert.ok(blocks.every(block => !block.hidden && block.querySelector("h3").textContent));
      const codes = Array.from(page.window.document.querySelectorAll(".command-guide code"));
      if (!file.endsWith("extra-4.html")) assert.ok(codes.length > 0);
      codes.forEach(code => assert.match(code.textContent, /^(git|gh) /));
      button.click();
      assert.ok(blocks.every(block => block.hidden));
      assert.equal(page.window.localStorage.getItem(key), "false");
    } finally { page.close(); }
  });
}

test("saved command preference applies to another page and language", async () => {
  const page = await loadPage("guide/pages/ja/chapter-6.html", { commandsEnabled: true });
  try {
    assert.equal(page.window.document.getElementById("command-toggle").getAttribute("aria-pressed"), "true");
    const blocks = Array.from(page.window.document.querySelectorAll(".command-guide"));
    assert.ok(blocks.every(block => !block.hidden));
    assert.equal(blocks[0].querySelector("h3").textContent, "PR の作成・レビュー・マージ");
    assert.ok(blocks[0].textContent.includes("GitHub CLI"));
    assert.ok(!blocks[0].textContent.includes("작성자"));
  } finally { page.close(); }
});

test("disabled storage still permits toggling commands", async () => {
  const page = await loadPage("guide/pages/chapter-1.html", { storageUnavailable: true });
  try {
    const button = page.window.document.getElementById("command-toggle");
    button.click();
    assert.equal(button.getAttribute("aria-pressed"), "true");
    assert.ok(!page.window.document.querySelector(".command-guide").hidden);
    page.window.dispatchEvent(new page.window.Event("pageshow"));
    assert.equal(button.getAttribute("aria-pressed"), "true");
    button.click();
    assert.ok(page.window.document.querySelector(".command-guide").hidden);
  } finally { page.close(); }
});

test("preference changes in another tab hide content and restore safe focus", async () => {
  const page = await loadPage("guide/pages/chapter-5.html", { commandsEnabled: true });
  try {
    const button = page.window.document.getElementById("command-toggle");
    page.window.document.querySelector(".command-guide-source").focus();
    page.window.dispatchEvent(new page.window.StorageEvent("storage", { key, newValue: "false", storageArea: page.window.localStorage }));
    assert.equal(page.window.document.activeElement, button);
    assert.equal(button.getAttribute("aria-pressed"), "false");
    page.window.localStorage.setItem(key, "true");
    page.window.dispatchEvent(new page.window.Event("pageshow"));
    assert.equal(button.getAttribute("aria-pressed"), "true");
    page.window.dispatchEvent(new page.window.StorageEvent("storage", { key: null, newValue: null, storageArea: page.window.localStorage }));
    assert.equal(button.getAttribute("aria-pressed"), "false");
  } finally { page.close(); }
});

test("commands follow strategy tabs without exposing inactive panels", async () => {
  const page = await loadPage("guide/pages/extra-2.html", { commandsEnabled: true });
  try {
    const doc = page.window.document;
    const first = doc.getElementById("panel-gitflow");
    const second = doc.getElementById("panel-githubflow");
    assert.ok(!first.hidden && second.hidden);
    assert.ok(first.querySelector('.command-guide code').textContent.includes("develop"));
    doc.querySelector('[data-strategy="githubflow"]').click();
    assert.ok(first.hidden && !second.hidden);
    assert.ok(second.querySelector('.command-guide').textContent.includes("gh pr create"));
    doc.getElementById("command-toggle").click();
    assert.ok(second.querySelector('.command-guide').hidden);
    assert.ok(!second.hidden);
  } finally { page.close(); }
});
