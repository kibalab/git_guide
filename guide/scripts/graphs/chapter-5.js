(function () {
  "use strict";

  var translations = {
    "기본 씬": "基本シーン",
    "메뉴 배치": "メニュー配置",
    "UI 시안": "UIラフ",
    "버튼 정렬": "ボタン整列",
    "main 문구 수정": "main 文言修正",
    "feature를 main에 머지": "feature を main にマージ",
    "1) Fetch 완료": "1) フェッチ完了",
    "원본": "元の状態",
    "기준점": "基準点",
    "Fetch로 받은 원격 변경(origin/main)": "フェッチしたリモート変更（origin/main）",
    "2) Pull 완료 (fast-forward)": "2) プル完了（fast-forward）",
    "원격 변경(main과 origin/main 동일)": "リモート変更（main と origin/main が同じ）",
    "1) Fetch 완료 (원격 변경은 익명 분기)": "1) フェッチ完了（リモート変更は匿名分岐）",
    "배너 문구": "バナー文言",
    "내 로컬 변경(main)": "自分のローカル変更（main）",
    "2) Pull 완료 (Merge)": "2) プル完了（マージ）",
    "컨플릭트 해결 후 Merge": "コンフリクト解決後にマージ"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graph5a = new GitGraphVisualizer("#graph-5a", {
    columnGap: 160,
    laneGap: 84,
    routeSpacing: 21,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 74, right: 54, bottom: 58, left: 175 }
  });

  graph5a.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/ui", color: "#2f8dff" }
    ],
    commits: [
      { id: "m0", name: t("기본 씬"), branch: "main", branches: ["main"], parents: [] },
      { id: "m1", name: t("메뉴 배치"), branch: "main", parents: ["m0"] },
      {
        id: "f2",
        name: t("UI 시안"),
        branch: "feature/ui",
        branches: ["feature/ui"],
        parents: ["m1"],
        changes: [
          { path: "ui/menu.txt", status: "modified", diff: ["-START", "+BEGIN"] }
        ]
      },
      {
        id: "f3",
        name: t("버튼 정렬"),
        branch: "feature/ui",
        branches: ["feature/ui"],
        parents: ["f2"],
        changes: [
          { path: "ui/menu.css", status: "modified", diff: ["-.menu-btn { margin: 6px; }", "+.menu-btn { margin: 10px; }"] }
        ]
      },
      {
        id: "m4",
        name: t("main 문구 수정"),
        branch: "main",
        parents: ["m1"],
        changes: [
          { path: "ui/menu.txt", status: "modified", diff: ["-START", "+PLAY"] }
        ]
      },
      {
        id: "m5",
        name: t("feature를 main에 머지"),
        branch: "main",
        branches: ["main"],
        parents: ["m4", "f3"],
        changes: [
          { path: "ui/menu.txt", status: "modified", diff: ["-PLAY", "+BEGIN PLAY"] },
          { path: "ui/menu.css", status: "modified", diff: ["-.menu-btn { margin: 6px; }", "+.menu-btn { margin: 10px; }"] }
        ]
      }
    ]
  });

  const graph5b = new GitGraphVisualizer("#graph-5b", {
    columnGap: 154,
    laneGap: 84,
    routeSpacing: 21,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 74, right: 54, bottom: 58, left: 182 },
    stagePlayInterval: 1500
  });

  graph5b.setData({
    stageOptions: {
      intervalMs: 1500,
      loop: true
    },
    stages: [
      {
        label: t("1) Fetch 완료"),
        data: {
          head: "main",
          branches: [
            { name: "main", color: "#df5a4f" },
            { name: "origin/main", color: "#2f8dff" }
          ],
          commits: [
            { id: "c0", name: t("원본"), branch: "main", branches: ["main", "origin/main"], parents: [] },
            { id: "c1", name: t("기준점"), branch: "main", branches: ["main"], parents: ["c0"] },
            { id: "r2", name: t("Fetch로 받은 원격 변경(origin/main)"), branch: "origin/main", branches: ["origin/main"], parents: ["c1"] }
          ]
        }
      },
      {
        label: t("2) Pull 완료 (fast-forward)"),
        data: {
          head: "main",
          branches: [
            { name: "main", color: "#df5a4f" },
            { name: "origin/main", color: "#2f8dff" }
          ],
          commits: [
            { id: "c0", name: t("원본"), branch: "main", branches: ["main", "origin/main"], parents: [] },
            { id: "c1", name: t("기준점"), branch: "main", parents: ["c0"] },
            { id: "r2", name: t("원격 변경(main과 origin/main 동일)"), branch: "origin/main", branches: ["main", "origin/main"], parents: ["c1"] }
          ]
        }
      }
    ]
  });

  const graph5c = new GitGraphVisualizer("#graph-5c", {
    columnGap: 154,
    laneGap: 84,
    routeSpacing: 21,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 74, right: 54, bottom: 58, left: 182 },
    stagePlayInterval: 1500
  });

  graph5c.setData({
    stageOptions: {
      intervalMs: 1500,
      loop: true
    },
    stages: [
      {
        label: t("1) Fetch 완료 (원격 변경은 익명 분기)"),
        data: {
          head: "main",
          branches: [
            { name: "main", color: "#df5a4f" },
            { name: "origin/main", color: "#2f8dff" }
          ],
          commits: [
            { id: "c0", name: t("원본"), branch: "main", branches: ["main", "origin/main"], parents: [] },
            { id: "c1", name: t("배너 문구"), branch: "main", branches: ["main"], parents: ["c0"] },
            { id: "l2", name: t("내 로컬 변경(main)"), branch: "main", parents: ["c1"] },
            { id: "r2", name: t("Fetch로 받은 원격 변경(origin/main)"), branch: "origin/main", branches: ["origin/main"], laneKey: "anon-remote-fetch", parents: ["c1"] }
          ]
        }
      },
      {
        label: t("2) Pull 완료 (Merge)"),
        data: {
          head: "main",
          branches: [
            { name: "main", color: "#df5a4f" },
            { name: "origin/main", color: "#2f8dff" }
          ],
          commits: [
            { id: "c0", name: t("원본"), branch: "main", branches: ["main", "origin/main"], parents: [] },
            { id: "c1", name: t("배너 문구"), branch: "main", parents: ["c0"] },
            { id: "l2", name: t("내 로컬 변경(main)"), branch: "main", parents: ["c1"] },
            { id: "r2", name: t("Fetch로 받은 원격 변경(origin/main)"), branch: "origin/main", branches: ["origin/main"], laneKey: "anon-remote-fetch", parents: ["c1"] },
            {
              id: "m3",
              name: t("컨플릭트 해결 후 Merge"),
              branch: "main",
              branches: ["main"],
              parents: ["l2", "r2"]
            }
          ]
        }
      }
    ]
  });
})();
