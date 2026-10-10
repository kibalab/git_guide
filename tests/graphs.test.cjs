const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadPage, root } = require("./helpers.cjs");
const pageFiles = ["guide/pages", "guide/pages/ja"].flatMap(dir =>
  fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith(".html")).map(file => dir + "/" + file)
);

for (const file of pageFiles) {
  test(file + " renders valid graphs in every stage and strategy", async () => {
    const page = await loadPage(file);
    try {
      page.window.document.querySelectorAll("[data-strategy]").forEach(tab => tab.click());
      for (const graph of page.graphs) {
        const count = graph.stageItems?.length || 1;
        for (let stage = 0; stage < count; stage++) {
          graph.goToStage(stage);
          const models = graph.multiModel?.repositories.map(repo => repo.model) || [graph.model];
          for (const model of models) {
            assert.equal(new Set(model.commits.map(commit => commit.id)).size, model.commits.length);
            model.commits.forEach(commit => commit.parents.forEach(parent => assert.ok(model.commitById.has(parent))));
            Object.values(model.branchHeads).forEach(commit => assert.ok(model.commitById.has(commit)));
          }
          for (const rect of graph.container.querySelectorAll("svg rect")) {
            const svg = rect.closest("svg");
            const x = Number(rect.getAttribute("x"));
            const width = Number(rect.getAttribute("width"));
            assert.ok(x >= 0, file + " stage " + stage + " clips a label at " + x);
            assert.ok(x + width <= Number(svg.getAttribute("width")) + 1);
          }
        }
      }
    } finally { page.close(); }
  });
}

for (const language of ["", "ja/"]) {
  test(language + "branch cleanup removes refs while preserving commit history", async () => {
    const page = await loadPage("guide/pages/" + language + "chapter-6.html");
    try {
      const graph = page.graphs[1];
      graph.goToStage(1);
      const remote = graph.multiModel.repositories.find(repo => repo.id === "remote");
      assert.equal(remote.model.branchHeads["feature/login-ui"], undefined);
      assert.ok(remote.model.commitById.has("p4"));
      graph.goToStage(4);
      const local = graph.multiModel.repositories.find(repo => repo.id === "local");
      assert.equal(local.model.branchHeads["feature/login-ui"], undefined);
      assert.ok(local.model.commitById.has("p4"));
      assert.ok(!graph.container.querySelector('[data-ggv-track-key="head-label::local::feature/login-ui"]'));
      assert.ok(!graph.container.querySelector('[data-ggv-track-key="branch-lane::local::feature/login-ui"]'));
      graph.goToStage(5);
      assert.equal(graph.multiModel.repositories[0].model.currentHeadBranch, "feature/next-task");
      assert.equal(graph.multiModel.repositories[0].model.branchHeads["feature/next-task"], "p5");
    } finally { page.close(); }
  });
}

test("stage buttons retain keyboard focus and graph scroll", async () => {
  const page = await loadPage("guide/pages/chapter-6.html");
  try {
    const graph = page.graphs[0];
    const button = graph.uiRefs.stage.nextBtn;
    const host = graph.uiRefs.graphHost;
    button.focus();
    host.scrollLeft = 275;
    button.click();
    assert.equal(graph.uiRefs.stage.nextBtn, button);
    assert.equal(page.window.document.activeElement, button);
    assert.equal(graph.uiRefs.graphHost, host);
    assert.equal(host.scrollLeft, 275);
    assert.ok(graph.uiRefs.stage.status.textContent.includes("2 / 6"));
  } finally { page.close(); }
});

test("commit keyboard selection retains focus and scroll", async () => {
  const page = await loadPage("guide/pages/chapter-2.html");
  try {
    const graph = page.graphs[0];
    const hit = graph.container.querySelectorAll(".ggv-commit-hit")[1];
    const key = hit.getAttribute("data-selection-key");
    graph.uiRefs.graphHost.scrollLeft = 130;
    hit.focus();
    hit.dispatchEvent(new page.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    assert.equal(graph.selectedCommitKey, key);
    assert.equal(page.window.document.activeElement.getAttribute("data-selection-key"), key);
    assert.equal(graph.uiRefs.graphHost.scrollLeft, 130);
    assert.ok(graph.uiRefs.inspector.diff.textContent.includes("m_AnchoredPosition"));
    assert.equal(graph.uiRefs.graphHost.querySelector("svg").getAttribute("role"), "group");
  } finally { page.close(); }
});

test("animation cleanup is scoped to its graph", async () => {
  const page = await loadPage("guide/pages/chapter-6.html");
  try {
    const counts = [0, 0];
    page.window.document.getAnimations = () => page.graphs.map((graph, index) => ({
      effect: { target: graph.container.querySelector("[data-ggv-anim-key]") },
      cancel() { counts[index]++; }
    }));
    page.graphs[0].clearStageMotionTimers();
    assert.deepEqual(counts, [1, 0]);
  } finally { page.close(); }
});

test("reduced motion removes continuous animations and responds to preference changes", async () => {
  const page = await loadPage("guide/pages/chapter-6.html", { reducedMotion: true });
  try {
    assert.equal(page.window.document.querySelectorAll(".ggv-relation-flow").length, 0);
    page.changeMotion(false);
    assert.ok(page.window.document.querySelectorAll(".ggv-relation-flow").length > 0);
    page.changeMotion(true);
    assert.equal(page.window.document.querySelectorAll(".ggv-relation-flow").length, 0);
  } finally { page.close(); }
});

test("language graph structures stay identical", async () => {
  const ko = await loadPage("guide/pages/chapter-6.html");
  const ja = await loadPage("guide/pages/ja/chapter-6.html");
  try {
    function shape(graph) {
      return JSON.stringify(graph.stageItems.map(stage => stage.data.repositories.map(repo => ({
        id: repo.id, head: repo.head, refs: repo.branchHeads,
        commits: repo.commits.map(commit => ({ id: commit.id, parents: commit.parents }))
      }))));
    }
    ko.graphs.forEach((graph, index) => assert.equal(shape(graph), shape(ja.graphs[index])));
    assert.equal(ja.graphs[0].uiRefs.stage.playBtn.textContent, "再生");
  } finally { ko.close(); ja.close(); }
});
