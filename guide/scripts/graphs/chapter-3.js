(function () {
  "use strict";

  var translations = {
    "프로젝트 시작": "プロジェクト開始",
    "기본 화면": "基本画面",
    "배경 시안": [
      "背景案",
      "背景ラフ"
    ],
    "밝기 조정": "明るさ調整",
    "긴급 문구": "緊急文言",
    "main에 합치기": "main に統合"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const baseOpt = {
    columnGap: 158,
    laneGap: 86,
    routeSpacing: 20,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 74, right: 52, bottom: 58, left: 178 }
  };

  const graph3a = new GitGraphVisualizer("#graph-3a", baseOpt);
  graph3a.setData({
    head: "feature/login-bg",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/login-bg", color: "#2f8dff" }
    ],
    commits: [
      { id: "b0", name: t("프로젝트 시작"), branch: "main", branches: ["main"], parents: [] },
      { id: "b1", name: t("기본 화면"), branch: "main", parents: ["b0"] },
      { id: "b2", name: t("배경 시안", 0), branch: "feature/login-bg", branches: ["feature/login-bg"], parents: ["b1"] },
      { id: "b3", name: t("밝기 조정"), branch: "feature/login-bg", branches: ["feature/login-bg"], parents: ["b2"] },
      { id: "b4", name: t("긴급 문구"), branch: "main", branches: ["main"], parents: ["b1"] }
    ]
  });

  const graph3b = new GitGraphVisualizer("#graph-3b", baseOpt);
  graph3b.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/login-bg", color: "#2f8dff" }
    ],
    commits: [
      { id: "m0", name: t("프로젝트 시작"), branch: "main", branches: ["main"], parents: [] },
      { id: "m1", name: t("기본 화면"), branch: "main", parents: ["m0"] },
      { id: "m2", name: t("배경 시안", 1), branch: "feature/login-bg", branches: ["feature/login-bg"], parents: ["m1"] },
      { id: "m3", name: t("밝기 조정"), branch: "feature/login-bg", branches: ["feature/login-bg"], parents: ["m2"] },
      { id: "m4", name: t("main에 합치기"), branch: "main", branches: ["main"], parents: ["m1", "m3"] }
    ]
  });
})();
