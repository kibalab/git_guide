(function () {
  "use strict";

  var translations = {
    "원본 타이틀": "元のタイトル",
    "기준 문구": "基準文言",
    "main 문구 수정": "main 文言修正",
    "feature 문구 수정": "feature 文言修正",
    "컨플릭트 해결 문구 반영": "コンフリクト解決文言を反映"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graphE3a = new GitGraphVisualizer("#graph-e3a", {
    columnGap: 160,
    laneGap: 84,
    routeSpacing: 21,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 76, right: 52, bottom: 58, left: 180 }
  });

  graphE3a.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/title-copy", color: "#2f8dff" }
    ],
    commits: [
      { id: "q0", name: t("원본 타이틀"), branch: "main", branches: ["main"], parents: [] },
      { id: "q1", name: t("기준 문구"), branch: "main", parents: ["q0"] },
      { id: "q2", name: t("main 문구 수정"), branch: "main", branches: ["main"], parents: ["q1"] },
      { id: "f2", name: t("feature 문구 수정"), branch: "feature/title-copy", branches: ["feature/title-copy"], parents: ["q1"] }
    ]
  });

  const graphE3b = new GitGraphVisualizer("#graph-e3b", {
    columnGap: 160,
    laneGap: 84,
    routeSpacing: 21,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: true,
    showHoverTimeGuide: true,
    padding: { top: 76, right: 52, bottom: 62, left: 180 }
  });

  graphE3b.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/title-copy", color: "#2f8dff" }
    ],
    commits: [
      { id: "r0", name: t("원본 타이틀"), branch: "main", branches: ["main"], parents: [] },
      { id: "r1", name: t("기준 문구"), branch: "main", parents: ["r0"] },
      { id: "r2", name: t("main 문구 수정"), branch: "main", parents: ["r1"] },
      { id: "r3", name: t("feature 문구 수정"), branch: "feature/title-copy", branches: ["feature/title-copy"], parents: ["r1"] },
      { id: "r4", name: t("컨플릭트 해결 문구 반영"), branch: "main", branches: ["main"], tags: ["resolved"], parents: ["r2", "r3"] }
    ]
  });
})();
