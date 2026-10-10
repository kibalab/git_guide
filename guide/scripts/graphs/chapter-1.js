(function () {
  "use strict";

  var translations = {
    "내 컴퓨터 (local)": "自分のPC（ローカル）",
    "처음 시작": "はじめの状態",
    "기본 화면": "基本画面",
    "저장: 버튼 위치 조정": "保存: ボタン位置を調整",
    "origin (remote)": "origin（リモート）",
    "업로드된 저장": "アップロード済みの保存",
    "다른 사람 컴퓨터 (local)": "別の人のPC（ローカル）",
    "다운로드 완료": "ダウンロード完了",
    "업로드": "アップロード",
    "다운로드": "ダウンロード"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const common = {
    columnGap: 150,
    laneGap: 74,
    showRepoTitles: true,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 54, right: 44, bottom: 50, left: 160 }
  };

  const graph1a = new GitGraphVisualizer("#graph-1a", {
    ...common,
    multiRepoGap: 82
  });

  graph1a.setData({
    repositories: [
      {
        id: "local",
        name: t("내 컴퓨터 (local)"),
        head: "main",
        branches: [{ name: "main", color: "#df5a4f" }],
        commits: [
          { id: "c0", name: t("처음 시작"), branch: "main", branches: ["main"], parents: [] },
          { id: "c1", name: t("기본 화면"), branch: "main", parents: ["c0"] },
          { id: "s2", name: t("저장: 버튼 위치 조정"), branch: "main", branches: ["main"], parents: ["c1"] }
        ]
      },
      {
        id: "remote",
        name: t("origin (remote)"),
        head: "main",
        branches: [{ name: "main", color: "#df5a4f" }],
        commits: [
          { id: "c0", name: t("처음 시작"), branch: "main", branches: ["main"], parents: [] },
          { id: "c1", name: t("기본 화면"), branch: "main", parents: ["c0"] },
          { id: "s2", name: t("업로드된 저장"), branch: "main", branches: ["main"], parents: ["c1"] }
        ]
      },
      {
        id: "teammate",
        name: t("다른 사람 컴퓨터 (local)"),
        head: "main",
        branches: [{ name: "main", color: "#df5a4f" }],
        commits: [
          { id: "c0", name: t("처음 시작"), branch: "main", branches: ["main"], parents: [] },
          { id: "c1", name: t("기본 화면"), branch: "main", parents: ["c0"] },
          { id: "s2", name: t("다운로드 완료"), branch: "main", branches: ["main"], parents: ["c1"] }
        ]
      }
    ],
    relations: [
      {
        from: { repo: "local", commit: "s2" },
        to: { repo: "remote", commit: "s2" },
        label: t("업로드"),
        color: "#2563eb"
      },
      {
        from: { repo: "remote", commit: "s2" },
        to: { repo: "teammate", commit: "s2" },
        label: t("다운로드"),
        color: "#0f766e"
      }
    ]
  });
})();
