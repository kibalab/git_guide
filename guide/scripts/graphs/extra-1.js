(function () {
  "use strict";

  var translations = {
    "기본 UI 파일 배치": "基本UIファイルを配置",
    "로그인 버튼 간격 12px 조정": "ログインボタンの間隔を 12px に調整",
    "튜토리얼 배경 이미지 교체": "チュートリアル背景画像を差し替え",
    "오탈자 2건 수정": "誤字 2 件を修正"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graphE1 = new GitGraphVisualizer("#graph-e1", {
    columnGap: 162,
    laneGap: 84,
    routeSpacing: 20,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 72, right: 50, bottom: 56, left: 176 }
  });

  graphE1.setData({
    head: "main",
    branches: [{ name: "main", color: "#df5a4f" }],
    commits: [
      { id: "s0", name: t("기본 UI 파일 배치"), branch: "main", branches: ["main"], parents: [] },
      { id: "s1", name: t("로그인 버튼 간격 12px 조정"), branch: "main", parents: ["s0"] },
      { id: "s2", name: t("튜토리얼 배경 이미지 교체"), branch: "main", parents: ["s1"] },
      { id: "s3", name: t("오탈자 2건 수정"), branch: "main", branches: ["main"], parents: ["s2"] }
    ]
  });
})();
