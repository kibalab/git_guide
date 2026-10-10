(function () {
  "use strict";

  var translations = {
    "기준점": "基準点",
    "기본 씬": "基本シーン",
    "배너 시안": "バナーラフ",
    "배너 합치기": "バナーを統合",
    "효과음 조정": "効果音調整",
    "효과음 합치기": "効果音を統合",
    "일반 작업": "通常作業",
    "긴급 수정": "緊急修正",
    "긴급 수정 main 반영": "緊急修正を main に反映",
    "1.1 UI 출고 기준": "1.1 UI 出荷基準",
    "다음 빌드 아트 기준": "次のビルドのアート基準",
    "로비 배너 시안 시작": "ロビーバナーのラフ開始",
    "배너 목업 정리": "バナーモック整理",
    "배너 시안 develop 반영": "バナーラフを develop に反映",
    "행사 빌드 release 분기": "イベントビルド用 release 分岐",
    "QA용 아이콘/정렬 수정": "QA 用アイコン/整列修正",
    "행사 UI 1.2 배포": "イベント UI 1.2 配布",
    "release 수정 develop 반영": "release 修正を develop に反映",
    "로그인 잘림 hotfix 분기": "ログイン欠け hotfix 分岐",
    "노치 여백 긴급 수정": "ノッチ余白の緊急修正",
    "긴급 수정 배포": "緊急修正を配布",
    "hotfix develop 반영": "hotfix を develop に反映",
    "배포 가능한 UI 기준": "配布可能な UI 基準",
    "공통 로그인 프리팹 정리": "共通ログインプレハブ整理",
    "로그인 패널 시안": "ログインパネルのラフ",
    "리뷰 코멘트 반영": "レビューコメント反映",
    "아이콘 정리": "アイコン整理",
    "로그인 패널 머지": "ログインパネルをマージ",
    "이벤트 배너 문구 수정": "イベントバナー文言修正",
    "검수 의견 반영": "確認コメント反映",
    "배너 문구 머지": "バナー文言をマージ",
    "현재 운영 UI": "現在運用中の UI",
    "main 통합 기준": "main 統合基準",
    "검수 서버 기준": "検収サーバー基準",
    "행사 로비 시안": "イベントロビーのラフ",
    "배너/아이콘 정리": "バナー/アイコン整理",
    "행사 시안 main 반영": "イベントラフを main に反映",
    "검수 빌드 갱신": "検収ビルド更新",
    "운영 반영": "運用反映",
    "오늘 작업 기준": "今日の作業基準",
    "공통 앵커 정리": "共通アンカー整理",
    "버튼 문구 한 줄 수정": "ボタン文言を1行修正",
    "오전 바로 합치기": "午前にすぐ統合",
    "세이프 에어리어 한 줄 보정": "セーフエリアを1行補正",
    "오후 바로 합치기": "午後にすぐ統合",
    "버튼 틴트 한 단계 조정": "ボタンのティントを1段階調整",
    "당일 마지막 합치기": "当日最後の統合"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const sharedGraphOptions = {
    columnGap: 154,
    laneGap: 82,
    routeSpacing: 20,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showHoverTimeGuide: true,
    padding: { top: 76, right: 52, bottom: 56, left: 186 }
  };

  const graphE2a = new GitGraphVisualizer("#graph-e2a", {
    ...sharedGraphOptions,
    showTags: false
  });

  graphE2a.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "feature/ui-banner", color: "#2f8dff" },
      { name: "feature/sound", color: "#1ea86b" }
    ],
    commits: [
      { id: "t0", name: t("기준점"), branch: "main", branches: ["main"], parents: [] },
      { id: "t1", name: t("기본 씬"), branch: "main", parents: ["t0"] },
      { id: "u2", name: t("배너 시안"), branch: "feature/ui-banner", branches: ["feature/ui-banner"], parents: ["t1"] },
      { id: "u3", name: t("배너 합치기"), branch: "main", parents: ["t1", "u2"] },
      { id: "s2", name: t("효과음 조정"), branch: "feature/sound", branches: ["feature/sound"], parents: ["u3"] },
      { id: "s3", name: t("효과음 합치기"), branch: "main", branches: ["main"], parents: ["u3", "s2"] }
    ]
  });

  const graphE2b = new GitGraphVisualizer("#graph-e2b", {
    ...sharedGraphOptions,
    showTags: true,
    padding: { top: 76, right: 52, bottom: 60, left: 186 }
  });

  graphE2b.setData({
    head: "main",
    branches: [
      { name: "main", color: "#df5a4f" },
      { name: "hotfix/ui-block", color: "#ea9a14" }
    ],
    commits: [
      { id: "h0", name: t("기준점"), branch: "main", branches: ["main"], parents: [] },
      { id: "h1", name: t("일반 작업"), branch: "main", parents: ["h0"] },
      { id: "h2", name: t("긴급 수정"), branch: "hotfix/ui-block", branches: ["hotfix/ui-block"], parents: ["h1"] },
      { id: "h3", name: t("긴급 수정 main 반영"), branch: "main", branches: ["main"], tags: ["urgent"], parents: ["h1", "h2"] }
    ]
  });

  const strategyGraphFactories = {
    gitflow() {
      const graph = new GitGraphVisualizer("#graph-e2c", {
        columnGap: 122,
        laneGap: 76,
        routeSpacing: 18,
        showBranchNames: true,
        showCommitNames: true,
        showHeadLabels: true,
        showDiffInspector: false,
        showTags: true,
        showHoverTimeGuide: true,
        padding: { top: 78, right: 64, bottom: 62, left: 208 }
      });

      graph.setData({
        head: "develop",
        branches: [
          { name: "main", color: "#df5a4f" },
          { name: "develop", color: "#1ea86b" },
          { name: "feature/login-panel", color: "#2f8dff" },
          { name: "release/1.2", color: "#ea9a14" },
          { name: "hotfix/login-safe-area", color: "#8b5cf6" }
        ],
        commits: [
          { id: "gf0", name: t("1.1 UI 출고 기준"), branch: "main", branches: ["main"], parents: [] },
          { id: "gf1", name: t("다음 빌드 아트 기준"), branch: "develop", branches: ["develop"], parents: ["gf0"] },
          { id: "gf2", name: t("로비 배너 시안 시작"), branch: "feature/login-panel", branches: ["feature/login-panel"], parents: ["gf1"] },
          { id: "gf3", name: t("배너 목업 정리"), branch: "feature/login-panel", parents: ["gf2"] },
          { id: "gf4", name: t("배너 시안 develop 반영"), branch: "develop", branches: ["develop"], parents: ["gf1", "gf3"] },
          { id: "gf5", name: t("행사 빌드 release 분기"), branch: "release/1.2", branches: ["release/1.2"], parents: ["gf4"] },
          { id: "gf6", name: t("QA용 아이콘/정렬 수정"), branch: "release/1.2", parents: ["gf5"] },
          { id: "gf7", name: t("행사 UI 1.2 배포"), branch: "main", branches: ["main"], tags: ["v1.2"], parents: ["gf0", "gf6"] },
          { id: "gf8", name: t("release 수정 develop 반영"), branch: "develop", branches: ["develop"], parents: ["gf4", "gf6"] },
          { id: "gf9", name: t("로그인 잘림 hotfix 분기"), branch: "hotfix/login-safe-area", branches: ["hotfix/login-safe-area"], parents: ["gf7"] },
          { id: "gf10", name: t("노치 여백 긴급 수정"), branch: "hotfix/login-safe-area", parents: ["gf9"] },
          { id: "gf11", name: t("긴급 수정 배포"), branch: "main", branches: ["main"], tags: ["hotfix"], parents: ["gf7", "gf10"] },
          { id: "gf12", name: t("hotfix develop 반영"), branch: "develop", branches: ["develop"], parents: ["gf8", "gf10"] }
        ]
      });
    },
    githubflow() {
      const graph = new GitGraphVisualizer("#graph-e2d", {
        columnGap: 126,
        laneGap: 78,
        routeSpacing: 18,
        showBranchNames: true,
        showCommitNames: true,
        showHeadLabels: true,
        showDiffInspector: false,
        showTags: false,
        showHoverTimeGuide: true,
        padding: { top: 76, right: 56, bottom: 58, left: 194 }
      });

      graph.setData({
        head: "main",
        branches: [
          { name: "main", color: "#df5a4f" },
          { name: "feature/login-panel", color: "#2f8dff" },
          { name: "feature/banner-copy", color: "#1ea86b" }
        ],
        commits: [
          { id: "gh0", name: t("배포 가능한 UI 기준"), branch: "main", branches: ["main"], parents: [] },
          { id: "gh1", name: t("공통 로그인 프리팹 정리"), branch: "main", parents: ["gh0"] },
          { id: "gh2", name: t("로그인 패널 시안"), branch: "feature/login-panel", branches: ["feature/login-panel"], parents: ["gh1"] },
          { id: "gh3", name: t("리뷰 코멘트 반영"), branch: "feature/login-panel", parents: ["gh2"] },
          { id: "gh4", name: t("아이콘 정리"), branch: "feature/login-panel", parents: ["gh3"] },
          { id: "gh5", name: t("로그인 패널 머지"), branch: "main", branches: ["main"], parents: ["gh1", "gh4"] },
          { id: "gh6", name: t("이벤트 배너 문구 수정"), branch: "feature/banner-copy", branches: ["feature/banner-copy"], parents: ["gh5"] },
          { id: "gh7", name: t("검수 의견 반영"), branch: "feature/banner-copy", parents: ["gh6"] },
          { id: "gh8", name: t("배너 문구 머지"), branch: "main", branches: ["main"], parents: ["gh5", "gh7"] }
        ]
      });
    },
    gitlabflow() {
      const graph = new GitGraphVisualizer("#graph-e2f", {
        columnGap: 124,
        laneGap: 74,
        routeSpacing: 18,
        showBranchNames: true,
        showCommitNames: true,
        showHeadLabels: true,
        showDiffInspector: false,
        showTags: true,
        showHoverTimeGuide: true,
        padding: { top: 78, right: 64, bottom: 60, left: 206 }
      });

      graph.setData({
        head: "main",
        branches: [
          { name: "production", color: "#df5a4f" },
          { name: "staging", color: "#1ea86b" },
          { name: "main", color: "#2f8dff" },
          { name: "feature/event-lobby", color: "#ea9a14" }
        ],
        commits: [
          { id: "gl0", name: t("현재 운영 UI"), branch: "production", branches: ["production"], tags: ["live"], parents: [] },
          { id: "gl1", name: t("main 통합 기준"), branch: "main", branches: ["main"], parents: ["gl0"] },
          { id: "gl2", name: t("검수 서버 기준"), branch: "staging", branches: ["staging"], parents: ["gl1"] },
          { id: "gl3", name: t("행사 로비 시안"), branch: "feature/event-lobby", branches: ["feature/event-lobby"], parents: ["gl1"] },
          { id: "gl4", name: t("배너/아이콘 정리"), branch: "feature/event-lobby", parents: ["gl3"] },
          { id: "gl5", name: t("행사 시안 main 반영"), branch: "main", branches: ["main"], parents: ["gl1", "gl4"] },
          { id: "gl6", name: t("검수 빌드 갱신"), branch: "staging", branches: ["staging"], tags: ["qa"], parents: ["gl2", "gl5"] },
          { id: "gl7", name: t("운영 반영"), branch: "production", branches: ["production"], tags: ["prod"], parents: ["gl0", "gl6"] }
        ]
      });
    },
    tbd() {
      const graph = new GitGraphVisualizer("#graph-e2e", {
        columnGap: 134,
        laneGap: 76,
        routeSpacing: 18,
        showBranchNames: true,
        showCommitNames: true,
        showHeadLabels: true,
        showDiffInspector: false,
        showTags: false,
        showHoverTimeGuide: true,
        padding: { top: 76, right: 56, bottom: 58, left: 194 }
      });

      graph.setData({
        head: "main",
        branches: [
          { name: "main", color: "#df5a4f" },
          { name: "task/login-copy", color: "#2f8dff" },
          { name: "task/safe-area", color: "#1ea86b" },
          { name: "task/button-tint", color: "#ea9a14" }
        ],
        commits: [
          { id: "tb0", name: t("오늘 작업 기준"), branch: "main", branches: ["main"], parents: [] },
          { id: "tb1", name: t("공통 앵커 정리"), branch: "main", parents: ["tb0"] },
          { id: "tb2", name: t("버튼 문구 한 줄 수정"), branch: "task/login-copy", branches: ["task/login-copy"], parents: ["tb1"] },
          { id: "tb3", name: t("오전 바로 합치기"), branch: "main", branches: ["main"], parents: ["tb1", "tb2"] },
          { id: "tb4", name: t("세이프 에어리어 한 줄 보정"), branch: "task/safe-area", branches: ["task/safe-area"], parents: ["tb3"] },
          { id: "tb5", name: t("오후 바로 합치기"), branch: "main", branches: ["main"], parents: ["tb3", "tb4"] },
          { id: "tb6", name: t("버튼 틴트 한 단계 조정"), branch: "task/button-tint", branches: ["task/button-tint"], parents: ["tb5"] },
          { id: "tb7", name: t("당일 마지막 합치기"), branch: "main", branches: ["main"], parents: ["tb5", "tb6"] }
        ]
      });
    }
  };

  window.GitGuideStrategyTabs(strategyGraphFactories);
})();
