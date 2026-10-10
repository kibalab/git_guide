(function () {
  "use strict";

  var translations = {
    "Unity LoginScene 초안 저장": "Unity LoginScene の下書きを保存",
    "LoginButton 위치 조정": "LoginButton の位置を調整",
    "로그인 문구 스크립트 수정": "ログイン文言のスクリプトを修正",
    "버튼 텍스트를 Enter Game으로 변경": "ボタン文言を Enter Game に変更"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graph2a = new GitGraphVisualizer("#graph-2a", {
    columnGap: 160,
    laneGap: 80,
    routeSpacing: 20,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 70, right: 50, bottom: 52, left: 170 }
  });

  graph2a.setData({
    head: "main",
    branches: [{ name: "main", color: "#df5a4f" }],
    commits: [
      {
        id: "h0",
        name: t("Unity LoginScene 초안 저장"),
        branch: "main",
        branches: ["main"],
        parents: [],
        changes: [
          {
            path: "Assets/Scenes/LoginScene.unity",
            status: "added",
            diff: [
              "+--- !u!1 &100100",
              "+GameObject:",
              "+  m_Name: LoginCanvas",
              "+  m_Component:",
              "+  - component: {fileID: 22400011}",
              "+--- !u!224 &22400011",
              "+RectTransform:",
              "+  m_AnchoredPosition: {x: 0, y: 0}"
            ]
          }
        ]
      },
      {
        id: "h1",
        name: t("LoginButton 위치 조정"),
        branch: "main",
        parents: ["h0"],
        changes: [
          {
            path: "Assets/Prefabs/UI/LoginButton.prefab",
            status: "modified",
            diff: [
              " m_Name: LoginButton",
              "-m_AnchoredPosition: {x: 0, y: -120}",
              "+m_AnchoredPosition: {x: 0, y: -96}",
              " m_Text: Start"
            ]
          }
        ]
      },
      {
        id: "h2",
        name: t("로그인 문구 스크립트 수정"),
        branch: "main",
        parents: ["h1"],
        changes: [
          {
            path: "Assets/Scripts/UI/LoginView.cs",
            status: "modified",
            diff: [
              " public void Bind()",
              " {",
              "-    title.text = \"LOGIN\";",
              "+    title.text = \"WELCOME\";",
              " }"
            ]
          }
        ]
      },
      {
        id: "h3",
        name: t("버튼 텍스트를 Enter Game으로 변경"),
        branch: "main",
        branches: ["main"],
        parents: ["h2"],
        changes: [
          {
            path: "Assets/Prefabs/UI/LoginButton.prefab",
            status: "modified",
            diff: [
              " m_Name: LoginButton",
              " m_AnchoredPosition: {x: 0, y: -96}",
              "-m_Text: Start",
              "+m_Text: Enter Game"
            ]
          }
        ]
      }
    ]
  });
})();
