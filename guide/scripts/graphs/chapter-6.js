(function () {
  "use strict";

  var translations = {
    "1) feature 작업 Push": "1) feature ブランチをプッシュ",
    "내 local": "自分のローカル",
    "시작": "開始",
    "기본 화면": "基本画面",
    "입력창 정렬": "入力欄の整列",
    "GitHub remote": "GitHub リモート",
    "Push": "プッシュ",
    "2) PR 열기": "2) PR を作成",
    "PR 열기": "PR を作成",
    "3) 리뷰 반영 후 PR 업데이트": "3) レビュー反映後に PR を更新",
    "리뷰 반영: 버튼 대비 수정": "レビュー反映: ボタンのコントラスト調整",
    "PR 업데이트": "PR を更新",
    "4) 리뷰 승인 후 remote main 머지 완료": "4) レビュー承認後にリモート main へマージ完了",
    "PR 머지 완료": "PR マージ完了",
    "Merge": "マージ",
    "5) Fetch: origin/main 최신화": "5) フェッチ: origin/main を更新",
    "Fetch": "フェッチ",
    "6) Pull: local main 최신화": "6) プル: ローカル main を更新",
    "Pull": "プル",
    "1) 머지 직후: 아직 feature 브렌치에 위치": "1) マージ直後: まだ feature ブランチ上",
    "2) 리모트 feature 브렌치 삭제": "2) リモート feature ブランチ削除",
    "리모트 브렌치 삭제": "リモートブランチ削除",
    "3) main으로 checkout": "3) main に切り替え",
    "4) Pull로 main 최신화": "4) プルで main を更新",
    "5) 로컬 feature 브렌치 삭제": "5) ローカル feature ブランチ削除",
    "6) 새 작업 브렌치 생성": "6) 新しい作業ブランチを作成"
  };
  var japanese = document.documentElement.lang.indexOf("ja") === 0;
  function t(text, variant) {
    if (!japanese || !Object.prototype.hasOwnProperty.call(translations, text)) return text;
    var translated = translations[text];
    return Array.isArray(translated) ? translated[variant || 0] : translated;
  }

  const graph5a = new GitGraphVisualizer("#graph-5a", {
    columnGap: 146,
    laneGap: 74,
    showRepoTitles: true,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 58, right: 44, bottom: 52, left: 170 },
    multiRepoGap: 78,
    stagePlayInterval: 1400
  });

  const prBranches = [
    { name: "main", color: "#df5a4f" },
    { name: "feature/login-ui", color: "#2f8dff" }
  ];

  const localBaseCommits = [
    { id: "p0", name: t("시작"), branch: "main", branches: ["main"], parents: [] },
    { id: "p1", name: t("기본 화면"), branch: "main", parents: ["p0"] },
    {
      id: "p3",
      name: t("입력창 정렬"),
      branch: "feature/login-ui",
      branches: ["feature/login-ui"],
      parents: ["p1"],
      changes: [
        { path: "ui/login.css", status: "modified", diff: ["-.field { margin-bottom: 8px; }", "+.field { margin-bottom: 14px; }"] }
      ]
    }
  ];

  const reviewedCommit = {
    id: "p4",
    name: t("리뷰 반영: 버튼 대비 수정"),
    branch: "feature/login-ui",
    branches: ["feature/login-ui"],
    parents: ["p3"],
    changes: [
      { path: "ui/login.css", status: "modified", diff: ["-.login-btn { color: #9ca3af; }", "+.login-btn { color: #ffffff; }"] }
    ]
  };

  const mergedCommit = {
    id: "p5",
    name: t("PR 머지 완료"),
    branch: "main",
    branches: ["main"],
    tags: ["merged"],
    parents: ["p1", "p4"],
    changes: [
      { path: "ui/login.html", status: "modified", diff: ["-<h1>Login</h1>", "+<h1>Welcome Back</h1>"] },
      { path: "ui/login.css", status: "modified", diff: ["-.field { margin-bottom: 8px; }", "+.field { margin-bottom: 14px; }"] },
      { path: "ui/login.css", status: "modified", diff: ["-.login-btn { color: #9ca3af; }", "+.login-btn { color: #ffffff; }"] }
    ]
  };

  const remoteBaseCommits = [
    { id: "p0", name: t("시작"), branch: "main", branches: ["main"], parents: [] },
    { id: "p1", name: t("기본 화면"), branch: "main", branches: ["main"], parents: ["p0"] },
    {
      id: "p3",
      name: t("입력창 정렬"),
      branch: "feature/login-ui",
      branches: ["feature/login-ui"],
      parents: ["p1"],
      changes: [
        { path: "ui/login.css", status: "modified", diff: ["-.field { margin-bottom: 8px; }", "+.field { margin-bottom: 14px; }"] }
      ]
    }
  ];

  graph5a.setData({
    stageOptions: {
      intervalMs: 1400,
      loop: true
    },
    stages: [
      {
        label: t("1) feature 작업 Push"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p3",
                "origin/feature/login-ui": "p3"
              },
              commits: localBaseCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "feature/login-ui": "p3"
              },
              commits: remoteBaseCommits
            }
          ],
          relations: [
            {
              from: { repo: "local", commit: "p3" },
              to: { repo: "remote", commit: "p3" },
              label: t("Push"),
              color: "#2563eb"
            }
          ]
        }
      },
      {
        label: t("2) PR 열기"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p3",
                "origin/feature/login-ui": "p3"
              },
              commits: localBaseCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "feature/login-ui": "p3"
              },
              commits: remoteBaseCommits
            }
          ],
          relations: [
            {
              from: { repo: "local", commit: "p3" },
              to: { repo: "remote", commit: "p3" },
              label: t("Push"),
              color: "#2563eb"
            },
            {
              from: { repo: "remote", commit: "p3" },
              to: { repo: "remote", commit: "p1" },
              label: t("PR 열기"),
              color: "#7c3aed"
            }
          ]
        }
      },
      {
        label: t("3) 리뷰 반영 후 PR 업데이트"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p4",
                "origin/feature/login-ui": "p4"
              },
              commits: localBaseCommits.concat([reviewedCommit])
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "feature/login-ui": "p4"
              },
              commits: remoteBaseCommits.concat([reviewedCommit])
            }
          ],
          relations: [
            {
              from: { repo: "local", commit: "p4" },
              to: { repo: "remote", commit: "p4" },
              label: t("Push"),
              color: "#2563eb"
            },
            {
              from: { repo: "remote", commit: "p4" },
              to: { repo: "remote", commit: "p1" },
              label: t("PR 업데이트"),
              color: "#7c3aed"
            }
          ]
        }
      },
      {
        label: t("4) 리뷰 승인 후 remote main 머지 완료"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p4",
                "origin/feature/login-ui": "p4"
              },
              commits: localBaseCommits.concat([reviewedCommit])
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p5",
                "feature/login-ui": "p4"
              },
              commits: remoteBaseCommits.concat([reviewedCommit, mergedCommit])
            }
          ],
          relations: [
            {
              from: { repo: "remote", commit: "p4" },
              to: { repo: "remote", commit: "p5" },
              label: t("Merge"),
              color: "#16a34a"
            }
          ]
        }
      },
      {
        label: t("5) Fetch: origin/main 최신화"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: prBranches,
              branchHeads: {
                "main": "p1",
                "origin/main": "p5",
                "feature/login-ui": "p4",
                "origin/feature/login-ui": "p4"
              },
              commits: localBaseCommits.concat([reviewedCommit, mergedCommit])
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p5",
                "feature/login-ui": "p4"
              },
              commits: remoteBaseCommits.concat([reviewedCommit, mergedCommit])
            }
          ],
          relations: [
            {
              from: { repo: "remote", commit: "p5" },
              to: { repo: "local", commit: "p5" },
              label: t("Fetch"),
              color: "#0d9488"
            }
          ]
        }
      },
      {
        label: t("6) Pull: local main 최신화"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p5",
                "origin/main": "p5",
                "feature/login-ui": "p4",
                "origin/feature/login-ui": "p4"
              },
              commits: localBaseCommits.concat([reviewedCommit, mergedCommit])
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: prBranches,
              branchHeads: {
                "main": "p5",
                "feature/login-ui": "p4"
              },
              commits: remoteBaseCommits.concat([reviewedCommit, mergedCommit])
            }
          ],
          relations: [
            {
              from: { repo: "remote", commit: "p5" },
              to: { repo: "local", commit: "p5" },
              label: t("Pull"),
              color: "#2563eb"
            }
          ]
        }
      }
    ]
  });

  const graph5b = new GitGraphVisualizer("#graph-5b", {
    columnGap: 146,
    laneGap: 74,
    showRepoTitles: true,
    showBranchNames: true,
    showCommitNames: true,
    showHeadLabels: true,
    showDiffInspector: false,
    showTags: false,
    showHoverTimeGuide: true,
    padding: { top: 58, right: 44, bottom: 52, left: 170 },
    multiRepoGap: 78,
    stagePlayInterval: 1400
  });

  const cleanupBranchesBase = [
    { name: "main", color: "#df5a4f" },
    { name: "feature/login-ui", color: "#2f8dff" }
  ];
  const cleanupBranchesWithNext = cleanupBranchesBase.concat([
    { name: "feature/next-task", color: "#1ea86b" }
  ]);

  const cleanupLocalBeforePullCommits = localBaseCommits.concat([reviewedCommit]);
  const cleanupLocalAfterPullCommits = localBaseCommits.concat([reviewedCommit, mergedCommit]);
  const cleanupRemoteCommits = remoteBaseCommits.concat([reviewedCommit, mergedCommit]);

  graph5b.setData({
    stageOptions: {
      intervalMs: 1400,
      loop: true
    },
    stages: [
      {
        label: t("1) 머지 직후: 아직 feature 브렌치에 위치"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p4"
              },
              commits: cleanupLocalBeforePullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5",
                "feature/login-ui": "p4"
              },
              commits: cleanupRemoteCommits
            }
          ]
        }
      },
      {
        label: t("2) 리모트 feature 브렌치 삭제"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/login-ui",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p4"
              },
              commits: cleanupLocalBeforePullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5"
              },
              commits: cleanupRemoteCommits
            }
          ],
          relations: [
            {
              from: { repo: "local", commit: "p4" },
              to: { repo: "remote", commit: "p4" },
              label: t("리모트 브렌치 삭제"),
              color: "#dc2626"
            }
          ]
        }
      },
      {
        label: t("3) main으로 checkout"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p1",
                "origin/main": "p1",
                "feature/login-ui": "p4"
              },
              commits: cleanupLocalBeforePullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5"
              },
              commits: cleanupRemoteCommits
            }
          ]
        }
      },
      {
        label: t("4) Pull로 main 최신화"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5",
                "origin/main": "p5",
                "feature/login-ui": "p4"
              },
              commits: cleanupLocalAfterPullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5"
              },
              commits: cleanupRemoteCommits
            }
          ],
          relations: [
            {
              from: { repo: "remote", commit: "p5" },
              to: { repo: "local", commit: "p5" },
              label: t("Pull"),
              color: "#2563eb"
            }
          ]
        }
      },
      {
        label: t("5) 로컬 feature 브렌치 삭제"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5",
                "origin/main": "p5"
              },
              commits: cleanupLocalAfterPullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5"
              },
              commits: cleanupRemoteCommits
            }
          ]
        }
      },
      {
        label: t("6) 새 작업 브렌치 생성"),
        data: {
          repositories: [
            {
              id: "local",
              name: t("내 local"),
              head: "feature/next-task",
              branches: cleanupBranchesWithNext,
              branchHeads: {
                "main": "p5",
                "origin/main": "p5",
                "feature/next-task": "p5"
              },
              commits: cleanupLocalAfterPullCommits
            },
            {
              id: "remote",
              name: t("GitHub remote"),
              head: "main",
              branches: cleanupBranchesBase,
              branchHeads: {
                "main": "p5"
              },
              commits: cleanupRemoteCommits
            }
          ]
        }
      }
    ]
  });
})();
