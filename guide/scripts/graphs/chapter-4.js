(function () {
  "use strict";

  var translations = {
    "Commit: LoginScene 기본 구성": "コミット: LoginScene の基本構成",
    "Commit: LoginPanel 프리팹 배치 조정": "コミット: LoginPanel プレハブ配置調整",
    "Commit: LoginView 입력 검증 추가": "コミット: LoginView の入力検証を追加",
    "Commit: Addressables에 로그인 배경 등록": "コミット: Addressables にログイン背景を登録",
    "1) Commit": "1) コミット",
    "작업자A local": "作業者A ローカル",
    "시작": "開始",
    "공통 UI 기반": "共通UI基盤",
    "+    <ui:Button name=\"login-btn\" text=\"로그인\" />": "+    <ui:Button name=\"login-btn\" text=\"ログイン\" />",
    "로그인 패널 정렬 조정": "ログインパネルの整列調整",
    "GitHub remote": "GitHub リモート",
    "작업자B local": "作業者B ローカル",
    "Commit": "コミット",
    "2) Push (작업자A origin/main 최신화)": "2) プッシュ（担当者A の origin/main を更新）",
    "Push": "プッシュ",
    "3) Fetch 완료(HEAD 유지)": "3) フェッチ完了（HEAD はそのまま）",
    "Fetch": "フェッチ"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graph4a = new GitGraphVisualizer("#graph-4a", {
    columnGap: 158,
    laneGap: 82,
    routeSpacing: 20,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 72, right: 50, bottom: 56, left: 172 }
  });

  graph4a.setData({
    head: "main",
    branches: [{ name: "main", color: "#df5a4f" }],
    commits: [
      {
        id: "u0",
        name: t("Commit: LoginScene 기본 구성"),
        branch: "main",
        branches: ["main"],
        parents: [],
        changes: [
          {
            path: "Assets/Scenes/LoginScene.unity",
            status: "added",
            diff: [
              "+--- !u!1 &510001",
              "+GameObject:",
              "+  m_Name: LoginCanvas",
              "+  m_Component:",
              "+  - component: {fileID: 224510001}",
              "+--- !u!224 &224510001",
              "+RectTransform:",
              "+  m_AnchoredPosition: {x: 0, y: 0}"
            ]
          }
        ]
      },
      {
        id: "u1",
        name: t("Commit: LoginPanel 프리팹 배치 조정"),
        branch: "main",
        parents: ["u0"],
        changes: [
          {
            path: "Assets/Prefabs/UI/LoginPanel.prefab",
            status: "modified",
            diff: [
              " m_Name: LoginPanel",
              "-m_AnchoredPosition: {x: 0, y: -40}",
              "+m_AnchoredPosition: {x: 0, y: -24}",
              " m_SizeDelta: {x: 820, y: 420}"
            ]
          }
        ]
      },
      {
        id: "u2",
        name: t("Commit: LoginView 입력 검증 추가"),
        branch: "main",
        parents: ["u1"],
        changes: [
          {
            path: "Assets/Scripts/UI/LoginView.cs",
            status: "modified",
            diff: [
              " public bool ValidateInput(string id, string pw)",
              " {",
              "-    return true;",
              "+    return !string.IsNullOrWhiteSpace(id) && !string.IsNullOrWhiteSpace(pw);",
              " }"
            ]
          }
        ]
      },
      {
        id: "u3",
        name: t("Commit: Addressables에 로그인 배경 등록"),
        branch: "main",
        branches: ["main"],
        parents: ["u2"],
        changes: [
          {
            path: "Assets/AddressableAssetsData/AssetGroups/UI.asset",
            status: "modified",
            diff: [
              " m_Entries:",
              "+- m_Address: login_bg_main",
              "+  m_GUID: 8f0f4a8a7d534eb1b95be617d112aa7d",
              "+  m_ReadOnly: 0"
            ]
          }
        ]
      }
    ]
  });

  const graph4b = new GitGraphVisualizer("#graph-4b", {
    columnGap: 146,
    laneGap: 72,
    showRepoTitles: true,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 56, right: 40, bottom: 50, left: 170 },
    multiRepoGap: 80,
    stagePlayInterval: 1400
  });

  const mainOnly = [{ name: "main", color: "#df5a4f" }];
  const startCommitChanges = [
    {
      path: "Assets/Scenes/Login.unity",
      status: "added",
      diff: [
        "+--- !u!1 &410000",
        "+GameObject:",
        "+  m_Name: LoginRoot",
        "+--- !u!224 &410001",
        "+RectTransform:",
        "+  m_AnchorMin: {x: 0, y: 0}",
        "+  m_AnchorMax: {x: 1, y: 1}",
        "+  m_SizeDelta: {x: 0, y: 0}"
      ]
    },
    {
      path: "Assets/Scripts/UI/LoginBootstrap.cs",
      status: "added",
      diff: [
        "+using UnityEngine;",
        "+public sealed class LoginBootstrap : MonoBehaviour",
        "+{",
        "+    [SerializeField] private Canvas rootCanvas;",
        "+    private void Awake() => rootCanvas.worldCamera = Camera.main;",
        "+}"
      ]
    }
  ];

  const commonUiBaseChanges = [
    {
      path: "Assets/Prefabs/UI/LoginPanel.prefab",
      status: "added",
      diff: [
        "+--- !u!1 &731000",
        "+GameObject:",
        "+  m_Name: LoginPanel",
        "+--- !u!224 &731001",
        "+RectTransform:",
        "+  m_AnchorMin: {x: 0.5, y: 0.5}",
        "+  m_AnchorMax: {x: 0.5, y: 0.5}",
        "+  m_SizeDelta: {x: 620, y: 380}"
      ]
    },
    {
      path: "Assets/UI/UXML/LoginView.uxml",
      status: "added",
      diff: [
        "+<ui:UXML xmlns:ui=\"UnityEngine.UIElements\">",
        "+  <ui:VisualElement name=\"login-root\">",
        "+    <ui:TextField name=\"id-input\" label=\"ID\" />",
        "+    <ui:TextField name=\"pw-input\" label=\"PW\" is-password-field=\"true\" />",
        t("+    <ui:Button name=\"login-btn\" text=\"로그인\" />"),
        "+  </ui:VisualElement>",
        "+</ui:UXML>"
      ]
    },
    {
      path: "Assets/UI/USS/LoginView.uss",
      status: "added",
      diff: [
        "+#login-root { width: 620px; padding: 32px; }",
        "+#id-input { margin-bottom: 12px; }",
        "+#pw-input { margin-bottom: 20px; }",
        "+#login-btn { height: 48px; unity-font-style: bold; }"
      ]
    }
  ];

  const loginPanelAlignChanges = [
    {
      path: "Assets/Prefabs/UI/LoginPanel.prefab",
      status: "modified",
      diff: [
        " m_Name: LoginPanel",
        "-m_AnchoredPosition: {x: 0, y: -40}",
        "+m_AnchoredPosition: {x: 0, y: -24}",
        "-m_SizeDelta: {x: 620, y: 380}",
        "+m_SizeDelta: {x: 640, y: 400}"
      ]
    },
    {
      path: "Assets/UI/USS/LoginView.uss",
      status: "modified",
      diff: [
        "-#login-root { width: 620px; padding: 32px; }",
        "+#login-root { width: 640px; padding: 36px 40px; }",
        "-#pw-input { margin-bottom: 20px; }",
        "+#pw-input { margin-bottom: 24px; }",
        "-#login-btn { height: 48px; unity-font-style: bold; }",
        "+#login-btn { height: 52px; unity-font-style: bold; }"
      ]
    },
    {
      path: "Assets/Scripts/UI/LoginView.cs",
      status: "modified",
      diff: [
        " private void ApplyLayout()",
        " {",
        "-    panelRect.anchoredPosition = new Vector2(0f, -40f);",
        "+    panelRect.anchoredPosition = new Vector2(0f, -24f);",
        "-    panelRect.sizeDelta = new Vector2(620f, 380f);",
        "+    panelRect.sizeDelta = new Vector2(640f, 400f);",
        " }"
      ]
    }
  ];

  const baseCommits = [
    { id: "c0", name: t("시작"), branch: "main", branches: ["main"], parents: [], changes: startCommitChanges },
    { id: "c1", name: t("공통 UI 기반"), branch: "main", branches: ["main"], parents: ["c0"], changes: commonUiBaseChanges }
  ];

  const workerABranches = [
    { name: "main", color: "#df5a4f" },
    { name: "origin/main", color: "#2f8dff" }
  ];

  const workerABaseCommits = [
    { id: "c0", name: t("시작"), branch: "main", branches: ["main"], parents: [], changes: startCommitChanges },
    {
      id: "c1",
      name: t("공통 UI 기반"),
      branch: "main",
      branches: ["main", "origin/main"],
      parents: ["c0"],
      changes: commonUiBaseChanges
    }
  ];

  const commitA2 = {
    id: "a2",
    name: t("로그인 패널 정렬 조정"),
    branch: "main",
    branches: ["main"],
    parents: ["c1"],
    changes: loginPanelAlignChanges
  };

  const commitA2WithTracked = {
    id: "a2",
    name: t("로그인 패널 정렬 조정"),
    branch: "main",
    branches: ["main", "origin/main"],
    parents: ["c1"],
    changes: loginPanelAlignChanges
  };

  const remoteA2 = {
    id: "a2",
    name: t("로그인 패널 정렬 조정"),
    branch: "main",
    branches: ["main"],
    parents: ["c1"],
    changes: loginPanelAlignChanges
  };

  const workerBBranches = [
    { name: "main", color: "#df5a4f" },
    { name: "origin/main", color: "#2f8dff" }
  ];

  const workerBBaseCommits = [
    { id: "c0", name: t("시작"), branch: "main", branches: ["main"], parents: [], changes: startCommitChanges },
    {
      id: "c1",
      name: t("공통 UI 기반"),
      branch: "main",
      branches: ["main", "origin/main"],
      parents: ["c0"],
      changes: commonUiBaseChanges
    }
  ];

  const workerBFetchedMain = {
    id: "a2",
    name: t("로그인 패널 정렬 조정"),
    branch: "origin/main",
    branches: ["origin/main"],
    parents: ["c1"],
    changes: loginPanelAlignChanges
  };

  const workerBFetchedCommits = workerBBaseCommits.concat([workerBFetchedMain]);

  graph4b.setData({
    stageOptions: {
      intervalMs: 1400,
      loop: true
    },
    stages: [
      {
        label: t("1) Commit"),
        data: {
          repositories: [
            { id: "worker-a", name: t("작업자A local"), head: "main", branches: workerABranches, commits: workerABaseCommits.concat([commitA2]) },
            { id: "origin", name: t("GitHub remote"), head: "main", branches: mainOnly, commits: baseCommits },
            { id: "worker-b", name: t("작업자B local"), head: "main", branches: workerBBranches, commits: workerBBaseCommits }
          ],
          relations: [
            {
              from: { repo: "worker-a", commit: "c1" },
              to: { repo: "worker-a", commit: "a2" },
              label: t("Commit"),
              color: "#f59e0b"
            }
          ]
        }
      },
      {
        label: t("2) Push (작업자A origin/main 최신화)"),
        data: {
          repositories: [
            { id: "worker-a", name: t("작업자A local"), head: "main", branches: workerABranches, commits: workerABaseCommits.concat([commitA2WithTracked]) },
            { id: "origin", name: t("GitHub remote"), head: "main", branches: mainOnly, commits: baseCommits.concat([remoteA2]) },
            { id: "worker-b", name: t("작업자B local"), head: "main", branches: workerBBranches, commits: workerBBaseCommits }
          ],
          relations: [
            {
              from: { repo: "worker-a", commit: "a2" },
              to: { repo: "origin", commit: "a2" },
              label: t("Push"),
              color: "#2563eb"
            }
          ]
        }
      },
      {
        label: t("3) Fetch 완료(HEAD 유지)"),
        data: {
          repositories: [
            { id: "worker-a", name: t("작업자A local"), head: "main", branches: workerABranches, commits: workerABaseCommits.concat([commitA2WithTracked]) },
            { id: "origin", name: t("GitHub remote"), head: "main", branches: mainOnly, commits: baseCommits.concat([remoteA2]) },
            { id: "worker-b", name: t("작업자B local"), head: "main", branches: workerBBranches, commits: workerBFetchedCommits }
          ],
          relations: [
            {
              from: { repo: "origin", commit: "a2" },
              to: { repo: "worker-b", commit: "a2" },
              label: t("Fetch"),
              color: "#0f766e"
            }
          ]
        }
      }
    ]
  });
})();
