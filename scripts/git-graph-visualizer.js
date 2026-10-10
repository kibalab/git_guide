(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  var DEFAULT_PALETTE = [
    "#df5a4f",
    "#2f8dff",
    "#1ea86b",
    "#ea9a14",
    "#7d5cdb",
    "#0e9e96",
    "#e65697",
    "#64748b"
  ];

  var DEFAULT_OPTIONS = {
    columnGap: 160,
    laneGap: 88,
    nodeRadius: 8,
    edgeWidth: 3,
    laneWidth: 2,
    routeSpacing: 18,
    routeInset: 14,
    innerBranchDelay: true,
    splitDelayColumns: 0.65,
    minTimeGapColumns: 0.58,
    multiRepoGap: 90,
    multiRepoHeaderHeight: 30,
    showRepoTitles: true,
    repoTitleColor: "#1f2937",
    repoDividerColor: "#d7dde7",
    relationColor: "#7c3aed",
    relationOpacity: 0.88,
    relationWidth: 2,
    relationDash: "6 6",
    relationFlow: true,
    relationFlowDurationMs: 900,
    relationFlowDirection: "forward",
    relationBundleSpacing: 12,
    pairRemoteBranches: true,
    remoteBranchPrefixes: ["origin", "upstream"],
    remoteBranchTint: 0.26,
    remoteBranchOpacity: 0.82,
    enableCommitInspector: true,
    showDiffInspector: true,
    stagePlayInterval: 1200,
    stageLoop: true,
    stageMotion: true,
    stageMotionDuration: 380,
    stageMotionStagger: 70,
    locale: null,
    messages: null,
    padding: { top: 88, right: 56, bottom: 78, left: 140 },
    background: "#ffffff",
    laneColor: "#d6d9df",
    textColor: "#2a2d33",
    mutedTextColor: "#616a76",
    fontFamily: "'Pretendard', 'Noto Sans KR', 'Segoe UI', sans-serif",
    palette: DEFAULT_PALETTE,
    showLaneGuides: true,
    showBranchNames: true,
    showCommitNames: true,
    showCommitHashes: false,
    showTags: true,
    showHeadLabels: true,
    maxCommitLabelLength: 16,
    maxCommitLabelTracks: 2,
    showHoverTimeGuide: true,
    hoverGuideColor: "#8f96a3"
  };

  function assign(base, override) {
    var out = {};
    var key;
    for (key in base) out[key] = base[key];
    for (key in override) out[key] = override[key];
    return out;
  }

  function svgNode(tag, attrs, text) {
    var node = document.createElementNS(SVG_NS, tag);
    var key;
    attrs = attrs || {};
    for (key in attrs) {
      if (attrs[key] !== undefined && attrs[key] !== null) {
        node.setAttribute(key, String(attrs[key]));
      }
    }
    if (text) node.textContent = text;
    return node;
  }

  function pickColor(index, options) {
    var palette = options.palette && options.palette.length ? options.palette : DEFAULT_PALETTE;
    return palette[index % palette.length];
  }

  function compact(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, Math.max(0, maxLength - 1)) + "…";
  }

  function branchBadgeWidth(name) {
    var text = String(name || "");
    return Math.max(48, 16 + text.length * 7);
  }

  function branchLaneLabelWidth(model) {
    var widths = new Map();
    model.branches.forEach(function (branch) {
      if (!Object.prototype.hasOwnProperty.call(model.branchHeads, branch.name)) return;
      var current = widths.get(branch.laneIndex) || 0;
      widths.set(branch.laneIndex, current + branchBadgeWidth(branch.name) + (current ? 8 : 0));
    });
    return Math.max.apply(null, [0].concat(Array.from(widths.values())));
  }

  function parseRemoteTrackingBranch(name, options) {
    if (typeof name !== "string" || !name.length) return null;
    var prefixes = Array.isArray(options && options.remoteBranchPrefixes) && options.remoteBranchPrefixes.length
      ? options.remoteBranchPrefixes
      : ["origin", "upstream"];
    for (var i = 0; i < prefixes.length; i += 1) {
      var remote = String(prefixes[i] || "");
      if (!remote) continue;
      var needle = remote + "/";
      if (name.indexOf(needle) !== 0) continue;
      var local = name.slice(needle.length);
      if (!local) return null;
      return {
        remote: remote,
        local: local
      };
    }
    return null;
  }

  function tintHexColor(color, amount) {
    var tint = Number(amount);
    if (!Number.isFinite(tint)) tint = 0;
    if (tint < 0) tint = 0;
    if (tint > 1) tint = 1;

    var raw = String(color || "").trim();
    var short = /^#([0-9a-fA-F]{3})$/;
    var full = /^#([0-9a-fA-F]{6})$/;
    var m;
    if ((m = raw.match(short))) {
      raw = "#" + m[1].split("").map(function (c) { return c + c; }).join("");
    } else if (!full.test(raw)) {
      return color;
    }

    var r = parseInt(raw.slice(1, 3), 16);
    var g = parseInt(raw.slice(3, 5), 16);
    var b = parseInt(raw.slice(5, 7), 16);

    var mix = function (value) {
      var mixed = Math.round(value + (255 - value) * tint);
      if (mixed < 0) mixed = 0;
      if (mixed > 255) mixed = 255;
      var hex = mixed.toString(16);
      return hex.length === 1 ? ("0" + hex) : hex;
    };

    return "#" + mix(r) + mix(g) + mix(b);
  }

  function buildHeadLabelRows(branchNames, branchByName) {
    var names = Array.isArray(branchNames) ? branchNames.slice() : [];
    var nameSet = new Set(names);
    var used = new Set();
    var rows = [];

    names.forEach(function (name) {
      if (used.has(name)) return;
      var meta = branchByName && branchByName.get ? branchByName.get(name) : null;

      if (meta && meta.isRemote && meta.pairLocalName && nameSet.has(meta.pairLocalName) && !used.has(meta.pairLocalName)) {
        // Pair will be created when local branch is processed.
        return;
      }

      if (meta && !meta.isRemote) {
        var pairedRemote = null;
        for (var i = 0; i < names.length; i += 1) {
          var candidate = names[i];
          if (candidate === name || used.has(candidate)) continue;
          var candidateMeta = branchByName && branchByName.get ? branchByName.get(candidate) : null;
          if (!candidateMeta || !candidateMeta.isRemote) continue;
          if (candidateMeta.pairLocalName !== name) continue;
          pairedRemote = candidate;
          break;
        }
        if (pairedRemote) {
          rows.push([name, pairedRemote]);
          used.add(name);
          used.add(pairedRemote);
          return;
        }
      }

      rows.push([name]);
      used.add(name);
    });

    names.forEach(function (name) {
      if (used.has(name)) return;
      rows.push([name]);
      used.add(name);
    });

    return rows;
  }

  function laneCountOfModel(model) {
    if (!model) return 1;
    var lanes = new Set();
    if (Array.isArray(model.branches)) {
      model.branches.forEach(function (branch) {
        if (!branch) return;
        var laneIndex = Number(branch.laneIndex);
        if (Number.isFinite(laneIndex) && laneIndex >= 0) {
          lanes.add(laneIndex);
        }
      });
    }
    if (Array.isArray(model.commits)) {
      model.commits.forEach(function (commit) {
        if (!commit) return;
        var lane = Number(commit.lane);
        if (Number.isFinite(lane) && lane >= 0) {
          lanes.add(lane);
        }
      });
    }
    return Math.max(1, lanes.size || 0);
  }

  function dashCycleLength(dashPattern) {
    var raw = dashPattern == null ? "" : String(dashPattern);
    var parts = raw
      .split(/[,\s]+/)
      .map(function (token) { return parseFloat(token); })
      .filter(function (n) { return Number.isFinite(n) && n > 0; });
    if (!parts.length) return 12;
    if (parts.length % 2 === 1) parts = parts.concat(parts);
    var sum = 0;
    parts.forEach(function (n) { sum += n; });
    return sum > 0 ? sum : 12;
  }

  function normalizeBranches(rawBranches, commits, options, rawBranchHeads) {
    var map = new Map();
    var order = [];

    (rawBranches || []).forEach(function (branch, index) {
      if (typeof branch === "string") {
        if (!map.has(branch)) {
          map.set(branch, { name: branch, color: pickColor(index, options) });
          order.push(branch);
        }
        return;
      }

      if (branch && branch.name && !map.has(branch.name)) {
        map.set(branch.name, {
          name: branch.name,
          color: branch.color || pickColor(index, options)
        });
        order.push(branch.name);
      }
    });

    commits.forEach(function (commit) {
      if (commit.branch && !map.has(commit.branch)) {
        map.set(commit.branch, {
          name: commit.branch,
          color: pickColor(map.size, options)
        });
        order.push(commit.branch);
      }

      (commit.branches || []).forEach(function (branchName) {
        if (branchName && !map.has(branchName)) {
          map.set(branchName, {
            name: branchName,
            color: pickColor(map.size, options)
          });
          order.push(branchName);
        }
      });
    });

    Object.keys(rawBranchHeads || {}).forEach(function (branchName) {
      if (!branchName || map.has(branchName)) return;
      map.set(branchName, {
        name: branchName,
        color: pickColor(map.size, options)
      });
      order.push(branchName);
    });

    var pairRemote = options.pairRemoteBranches !== false;
    var allNames = new Set(order);
    var laneKeyByName = new Map();
    var laneIndexByKey = new Map();
    var nextLane = 0;

    order.forEach(function (name) {
      var remoteInfo = parseRemoteTrackingBranch(name, options);
      var pairLocal = pairRemote && remoteInfo && allNames.has(remoteInfo.local) ? remoteInfo.local : null;
      laneKeyByName.set(name, pairLocal || name);
    });

    order.forEach(function (name) {
      var laneKey = laneKeyByName.get(name) || name;
      if (!laneIndexByKey.has(laneKey)) {
        laneIndexByKey.set(laneKey, nextLane);
        nextLane += 1;
      }
    });

    return order.map(function (name) {
      var branch = map.get(name);
      var remoteInfo = parseRemoteTrackingBranch(name, options);
      var pairedLocal = pairRemote && remoteInfo && allNames.has(remoteInfo.local) ? remoteInfo.local : null;
      var isRemote = !!pairedLocal;
      var baseColor = branch.color;
      if (isRemote && map.has(pairedLocal)) {
        baseColor = map.get(pairedLocal).color || baseColor;
      }
      var color = isRemote ? tintHexColor(baseColor, options.remoteBranchTint) : baseColor;
      return {
        name: branch.name,
        color: color,
        laneIndex: laneIndexByKey.get(laneKeyByName.get(name)),
        isRemote: isRemote,
        pairLocalName: pairedLocal
      };
    });
  }

  function computeBranchHeads(branches, commits) {
    var latest = new Map();

    commits.forEach(function (commit) {
      if (commit.branch) latest.set(commit.branch, commit.id);
      (commit.branches || []).forEach(function (name) {
        latest.set(name, commit.id);
      });
    });

    var heads = {};
    branches.forEach(function (branch) {
      if (latest.has(branch.name)) heads[branch.name] = latest.get(branch.name);
    });

    return heads;
  }

  function normalizeChangeLines(rawLines) {
    var lines = [];
    if (typeof rawLines === "string") {
      rawLines = rawLines.split(/\r?\n/);
    }
    if (!Array.isArray(rawLines)) return lines;

    rawLines.forEach(function (line) {
      var raw = "";
      var type = "ctx";
      if (typeof line === "string") {
        raw = line;
      } else if (line && typeof line === "object") {
        raw = String(line.raw || line.text || "");
        if (line.type === "add") type = "add";
        else if (line.type === "del") type = "del";
        else if (line.type === "ctx") type = "ctx";
      } else {
        return;
      }

      if (type === "ctx") {
        if (raw.charAt(0) === "+") type = "add";
        else if (raw.charAt(0) === "-") type = "del";
      }

      var text = raw;
      if ((type === "add" || type === "del") && text.length && (text.charAt(0) === "+" || text.charAt(0) === "-")) {
        text = text.slice(1);
      } else if (type === "ctx" && text.charAt(0) === " ") {
        text = text.slice(1);
      }

      lines.push({
        type: type,
        text: text,
        raw: raw
      });
    });

    return lines;
  }

  function normalizeCommitChanges(rawChanges) {
    var files = [];
    if (!rawChanges) return files;

    if (Array.isArray(rawChanges)) {
      rawChanges.forEach(function (entry, index) {
        if (typeof entry === "string") {
          files.push({
            path: entry,
            status: "modified",
            lines: []
          });
          return;
        }
        if (!entry || typeof entry !== "object") return;
        files.push({
          path: String(entry.path || entry.file || entry.name || ("file_" + index)),
          status: String(entry.status || "modified"),
          lines: normalizeChangeLines(entry.diff || entry.lines || entry.patch || [])
        });
      });
      return files;
    }

    if (typeof rawChanges === "object") {
      Object.keys(rawChanges).forEach(function (path) {
        files.push({
          path: path,
          status: "modified",
          lines: normalizeChangeLines(rawChanges[path])
        });
      });
    }

    return files;
  }

  function cloneChanges(changes) {
    if (!Array.isArray(changes)) return [];
    return changes.map(function (file) {
      return {
        path: file.path,
        status: file.status,
        lines: Array.isArray(file.lines)
          ? file.lines.map(function (line) {
            return {
              type: line.type,
              text: line.text,
              raw: line.raw
            };
          })
          : []
      };
    });
  }

  function normalizeData(rawData, options) {
    var rawCommits = Array.isArray(rawData.commits) ? rawData.commits : [];

    var commits = rawCommits.map(function (commit, index) {
      return {
        id: commit.id || "commit_" + index,
        name: commit.name || commit.message || "",
        branch: commit.branch || null,
        branches: Array.isArray(commit.branches) ? commit.branches : [],
        parents: Array.isArray(commit.parents) ? commit.parents : [],
        tags: Array.isArray(commit.tags) ? commit.tags : [],
        laneKey: commit.laneKey !== undefined && commit.laneKey !== null ? commit.laneKey : null,
        color: commit.color || null,
        changes: normalizeCommitChanges(commit.changes || commit.files || null)
      };
    });

    var branches = normalizeBranches(rawData.branches, commits, options, rawData.branchHeads || {});
    var branchByName = new Map(
      branches.map(function (branch) {
        return [branch.name, branch];
      })
    );
    var laneByBranch = new Map(
      branches.map(function (branch) {
        return [branch.name, branch.laneIndex];
      })
    );

    var fallbackLane = branches.length ? 0 : -1;
    var maxBranchLane = branches.reduce(function (maxLane, branch) {
      var lane = Number(branch && branch.laneIndex);
      if (Number.isFinite(lane) && lane > maxLane) return lane;
      return maxLane;
    }, -1);
    var laneByCustomKey = new Map();
    var nextCustomLane = maxBranchLane + 1;
    var resolveCustomLane = function (rawKey) {
      if (rawKey === undefined || rawKey === null) return null;
      if (typeof rawKey === "number" && Number.isFinite(rawKey) && rawKey >= 0) {
        return rawKey;
      }
      var key = String(rawKey);
      if (laneByBranch.has(key)) return laneByBranch.get(key);
      if (laneByCustomKey.has(key)) return laneByCustomKey.get(key);
      var lane = nextCustomLane;
      nextCustomLane += 1;
      laneByCustomKey.set(key, lane);
      return lane;
    };

    var positionedCommits = commits.map(function (commit, column) {
      var lane = fallbackLane;
      var customLane = resolveCustomLane(commit.laneKey);
      if (customLane !== null) {
        lane = customLane;
      } else if (commit.branch && laneByBranch.has(commit.branch)) {
        lane = laneByBranch.get(commit.branch);
      }

      return {
        id: commit.id,
        name: commit.name,
        branch: commit.branch,
        branches: commit.branches,
        parents: commit.parents,
        tags: commit.tags,
        laneKey: commit.laneKey,
        changes: commit.changes,
        lane: lane,
        column: column,
        color: commit.color || (commit.branch && branchByName.has(commit.branch)
          ? branchByName.get(commit.branch).color
          : (lane >= 0 && branches[lane] ? branches[lane].color : "#7a7a7a")),
        isRemoteBranch: !!(commit.branch && branchByName.has(commit.branch) && branchByName.get(commit.branch).isRemote)
      };
    });

    var commitById = new Map(
      positionedCommits.map(function (commit) {
        return [commit.id, commit];
      })
    );

    var derivedHeads = computeBranchHeads(branches, positionedCommits);
    var branchHeads = Object.prototype.hasOwnProperty.call(rawData, "branchHeads")
      ? assign({}, rawData.branchHeads || {})
      : derivedHeads;

    var currentCommit = rawData.currentCommit || null;
    if (!currentCommit && rawData.head && branchHeads[rawData.head]) {
      currentCommit = branchHeads[rawData.head];
    }
    if (!currentCommit && positionedCommits.length) {
      currentCommit = positionedCommits[positionedCommits.length - 1].id;
    }

    return {
      branches: branches,
      branchByName: branchByName,
      commits: positionedCommits,
      commitById: commitById,
      branchHeads: branchHeads,
      currentCommit: currentCommit,
      currentHeadBranch: typeof rawData.head === "string" ? rawData.head : null
    };
  }

  function normalizeMultiRepoData(rawData, options) {
    var repos = Array.isArray(rawData.repositories) ? rawData.repositories : [];
    var relations = Array.isArray(rawData.relations) ? rawData.relations : [];

    var normalizedRepos = repos.map(function (repo, index) {
      var id = repo.id || repo.name || ("repo_" + index);
      var name = repo.name || repo.id || ("Repository " + (index + 1));
      return {
        id: id,
        name: name,
        model: normalizeData(repo, options)
      };
    });

    var normalizedRelations = relations.map(function (relation) {
      var from = relation.from || {
        repo: relation.fromRepo,
        commit: relation.fromCommit
      };
      var to = relation.to || {
        repo: relation.toRepo,
        commit: relation.toCommit
      };
      return {
        fromRepo: from ? from.repo : null,
        fromCommit: from ? from.commit : null,
        toRepo: to ? to.repo : null,
        toCommit: to ? to.commit : null,
        label: relation.label || "",
        color: relation.color || null
      };
    });

    return {
      repositories: normalizedRepos,
      relations: normalizedRelations
    };
  }

  function shortHash(value) {
    if (!value) return "";
    return value.length <= 7 ? value : value.slice(0, 7);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function detectDocumentLocale() {
    if (typeof document === "undefined" || !document.documentElement) return "ko";
    var lang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.indexOf("ja") === 0 ? "ja" : "ko";
  }

  var INSPECTOR_MESSAGES = {
    ko: {
      inspectorTitle: "커밋 선택",
      inspectorIntro: "커밋 노드를 클릭하면 변경 파일과 diff를 볼 수 있습니다.",
      noCommitSelected: "선택된 커밋이 없습니다.",
      selectFilePrompt: "파일을 선택하면 diff가 표시됩니다.",
      noChangedFiles: "변경 파일 정보가 없습니다.",
      missingChangesData: "changes 데이터를 커밋에 넣으면 diff를 볼 수 있습니다.",
      noDiffLines: "diff 라인이 없습니다.",
      graphLabel: "커밋 이력 그래프",
      previousStage: "이전 단계",
      nextStage: "다음 단계",
      play: "재생",
      pause: "일시정지",
      noCommits: "표시할 커밋이 없습니다.",
      noRepositories: "표시할 저장소가 없습니다.",
      commitLabel: "커밋 변경 내용 보기",
      commitMeta: function (commitId, fileCount) {
        return "commit " + shortHash(commitId) + " · files " + fileCount;
      }
    },
    ja: {
      inspectorTitle: "コミット選択",
      inspectorIntro: "コミットノードをクリックすると変更ファイルと diff を確認できます。",
      noCommitSelected: "選択されたコミットはありません。",
      selectFilePrompt: "ファイルを選ぶと diff が表示されます。",
      noChangedFiles: "変更ファイル情報がありません。",
      missingChangesData: "コミットに changes データを入れると diff を確認できます。",
      noDiffLines: "diff 行がありません。",
      graphLabel: "コミット履歴グラフ",
      previousStage: "前の段階",
      nextStage: "次の段階",
      play: "再生",
      pause: "一時停止",
      noCommits: "表示するコミットはありません。",
      noRepositories: "表示するリポジトリはありません。",
      commitLabel: "コミットの変更を確認",
      commitMeta: function (commitId, fileCount) {
        return "commit " + shortHash(commitId) + " · ファイル " + fileCount + " 件";
      }
    }
  };

  function GitGraphVisualizer(container, options) {
    var root = typeof container === "string" ? document.querySelector(container) : container;
    if (!root) throw new Error("GitGraphVisualizer: container not found");

    this.container = root;
    this.options = assign(DEFAULT_OPTIONS, options || {});
    this.options.padding = assign(DEFAULT_OPTIONS.padding, (options || {}).padding || {});
    this.locale = this.options.locale || detectDocumentLocale();
    this.messages = assign(INSPECTOR_MESSAGES[this.locale] || INSPECTOR_MESSAGES.ko, this.options.messages || {});
    this.model = null;
    this.multiModel = null;
    this.stageItems = null;
    this.stageIndex = 0;
    this.stageTimer = null;
    this.stageOptions = {
      intervalMs: this.options.stagePlayInterval,
      loop: this.options.stageLoop
    };
    this.animateNextRender = false;
    this.stageMotionTimers = [];
    this.prevStageKeys = null;
    this.currentRenderKeys = new Set();
    this.stageTransitionDirection = 0;
    this.stageCommitChangesCache = new Map();
    this.stageFixedHeight = null;
    this.selectedCommitKey = null;
    this.selectedFilePath = null;
    this.visibleCommitMap = new Map();
    this.commitNodeByKey = new Map();
    this.prevTrackedPositions = new Map();
    this.currentTrackedPositions = new Map();
    this.currentTrackedNodes = new Map();
    this.activeRepoContext = null;
    this.uiRefs = null;
    this.savedGraphScroll = null;
    this.restoreCommitFocus = null;
    this.motionQuery = global.matchMedia ? global.matchMedia("(prefers-reduced-motion: reduce)") : null;
    this.motionChangeHandler = function () {
      this.clearStageMotionTimers();
      this.animateNextRender = false;
      this.render();
    }.bind(this);
    if (this.motionQuery && this.motionQuery.addEventListener) {
      this.motionQuery.addEventListener("change", this.motionChangeHandler);
    }
  }

  GitGraphVisualizer.prototype.prefersReducedMotion = function () {
    return !!(this.motionQuery && this.motionQuery.matches);
  };

  GitGraphVisualizer.prototype.isInspectorEnabled = function () {
    return this.options.enableCommitInspector !== false && this.options.showDiffInspector !== false;
  };

  GitGraphVisualizer.prototype.ensureUiStyles = function () {
    if (typeof document === "undefined") return;
    if (document.getElementById("ggv-ui-style")) return;

    var style = document.createElement("style");
    style.id = "ggv-ui-style";
    style.textContent = [
      ".ggv-root{display:flex;flex-direction:column;gap:10px;}",
      ".ggv-stage{display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid #d7dde7;background:#fff;}",
      ".ggv-stage button{border:1px solid #c7cfdb;background:#f8fafc;color:#111827;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;}",
      ".ggv-stage button:hover{background:#eef2f7;}",
      ".ggv-stage button:disabled{opacity:.45;cursor:default;}",
      ".ggv-stage-label{font-size:12px;color:#334155;font-weight:700;}",
      ".ggv-stage-name{font-size:12px;color:#64748b;margin-left:6px;}",
      ".ggv-graph{overflow:auto;background:transparent;}",
      ".ggv-inspector{border:1px solid #d7dde7;background:#fff;display:flex;flex-direction:column;min-height:180px;}",
      ".ggv-inspector-header{padding:8px 10px;border-bottom:1px solid #e3e8ef;display:flex;gap:8px;align-items:center;flex-wrap:wrap;}",
      ".ggv-inspector-title{font-size:12px;font-weight:800;color:#111827;}",
      ".ggv-inspector-sub{font-size:11px;color:#64748b;}",
      ".ggv-inspector-body{display:grid;grid-template-columns:minmax(180px,250px) 1fr;min-height:150px;}",
      ".ggv-file-list{border-right:1px solid #e3e8ef;max-height:260px;overflow:auto;}",
      ".ggv-file-item{display:block;width:100%;border:0;border-bottom:1px solid #eef2f7;background:#fff;padding:8px 10px;text-align:left;font-size:12px;color:#1f2937;cursor:pointer;}",
      ".ggv-file-item:hover{background:#f8fbff;}",
      ".ggv-file-item.active{background:#eef5ff;color:#1d4ed8;font-weight:700;}",
      ".ggv-diff{max-height:260px;overflow:auto;padding:8px 10px;font-family:'JetBrains Mono','Consolas',monospace;font-size:12px;line-height:1.5;}",
      ".ggv-diff-line{white-space:pre;}",
      ".ggv-diff-line.add{background:#ecfdf3;color:#0f5132;}",
      ".ggv-diff-line.del{background:#fff1f2;color:#9f1239;}",
      ".ggv-diff-line.ctx{color:#334155;}",
      ".ggv-empty{padding:10px;color:#64748b;font-size:12px;}",
      ".ggv-commit-hit{cursor:pointer;}",
      ".ggv-commit-hit:focus-visible{outline:none;stroke:#111827;stroke-width:3;}",
      ".ggv-stage button:focus-visible,.ggv-file-item:focus-visible{outline:2px solid #1d4ed8;outline-offset:2px;}",
      ".ggv-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;}",
      ".ggv-reduced-motion .ggv-relation-flow{animation:none;}",
      "@media(prefers-reduced-motion:reduce){.ggv-relation-flow{animation:none!important;}}",
      "@keyframes ggv-relation-dash-flow{from{stroke-dashoffset:0;}to{stroke-dashoffset:var(--ggv-rel-flow-offset,-12);}}",
      ".ggv-relation-flow{animation:ggv-relation-dash-flow var(--ggv-rel-flow-duration,900ms) linear infinite;will-change:stroke-dashoffset;}"
    ].join("");
    document.head.appendChild(style);
  };

  GitGraphVisualizer.prototype.stopStagePlayback = function () {
    if (this.stageTimer) {
      clearInterval(this.stageTimer);
      this.stageTimer = null;
    }
  };

  GitGraphVisualizer.prototype.clearStageMotionTimers = function () {
    if (!Array.isArray(this.stageMotionTimers)) {
      this.stageMotionTimers = [];
      return;
    }
    this.stageMotionTimers.forEach(function (timerId) {
      clearTimeout(timerId);
    });
    this.stageMotionTimers = [];
    if (typeof document !== "undefined" && document.getAnimations) {
      document.getAnimations().forEach(function (anim) {
        var effect = anim.effect;
        var target = effect && effect.target;
        if (!target || !target.hasAttribute || !this.container.contains(target)) return;
        if (target.hasAttribute("data-ggv-anim-key")) {
          // Keep the perpetual dashed-flow animation alive.
          if (typeof anim.animationName === "string" && anim.animationName === "ggv-relation-dash-flow") {
            return;
          }
          if (target.style) {
            target.style.opacity = "";
            target.style.transform = "";
            target.style.strokeDasharray = "";
            target.style.strokeDashoffset = "";
          }
          anim.cancel();
        }
      }, this);
    }
  };

  GitGraphVisualizer.prototype.clearStageMode = function () {
    this.stopStagePlayback();
    this.clearStageMotionTimers();
    this.stageItems = null;
    this.stageIndex = 0;
    this.prevStageKeys = null;
    this.stageTransitionDirection = 0;
    this.stageCommitChangesCache = new Map();
    this.stageFixedHeight = null;
  };

  GitGraphVisualizer.prototype.applyStageData = function (payload) {
    if (!payload || typeof payload !== "object") {
      this.model = normalizeData({}, this.options);
      this.multiModel = null;
      return;
    }

    if (Array.isArray(payload.repositories)) {
      this.multiModel = normalizeMultiRepoData(payload, this.options);
      this.model = null;
      this.applyStageChangeCache();
      return;
    }

    this.multiModel = null;
    this.model = normalizeData(payload, this.options);
    this.applyStageChangeCache();
  };

  GitGraphVisualizer.prototype.collectCommitChangesIntoCache = function (repoKey, commits) {
    if (!repoKey || !Array.isArray(commits)) return;
    commits.forEach(function (commit) {
      if (!commit || !commit.id) return;
      var changes = normalizeCommitChanges(commit.changes || commit.files || null);
      if (!changes.length) return;
      this.stageCommitChangesCache.set(this.commitKey(repoKey, commit.id), cloneChanges(changes));
    }, this);
  };

  GitGraphVisualizer.prototype.buildStageChangeCache = function () {
    this.stageCommitChangesCache = new Map();
    if (!this.stageItems || !this.stageItems.length) return;

    this.stageItems.forEach(function (stage) {
      var data = stage.data || {};
      if (Array.isArray(data.repositories)) {
        data.repositories.forEach(function (repo, repoIndex) {
          var repoId = (repo && (repo.id || repo.name)) ? (repo.id || repo.name) : ("repo_" + repoIndex);
          var repoName = repo && repo.name ? repo.name : repoId;
          this.collectCommitChangesIntoCache(repoId, repo && Array.isArray(repo.commits) ? repo.commits : []);
          if (repoName !== repoId) {
            this.collectCommitChangesIntoCache(repoName, repo && Array.isArray(repo.commits) ? repo.commits : []);
          }
        }, this);
        return;
      }
      this.collectCommitChangesIntoCache("_single_", Array.isArray(data.commits) ? data.commits : []);
    }, this);
  };

  GitGraphVisualizer.prototype.applyChangeCacheToModel = function (model, repoId, repoName) {
    if (!model || !Array.isArray(model.commits) || !this.stageCommitChangesCache || !this.stageCommitChangesCache.size) return;
    model.commits.forEach(function (commit) {
      if (commit.changes && commit.changes.length) return;
      var cached =
        this.stageCommitChangesCache.get(this.commitKey(repoId, commit.id)) ||
        this.stageCommitChangesCache.get(this.commitKey(repoName, commit.id)) ||
        this.stageCommitChangesCache.get(this.commitKey("_single_", commit.id));
      if (cached && cached.length) {
        commit.changes = cloneChanges(cached);
      }
    }, this);
  };

  GitGraphVisualizer.prototype.applyStageChangeCache = function () {
    if (!this.stageCommitChangesCache || !this.stageCommitChangesCache.size) return;
    if (this.multiModel && Array.isArray(this.multiModel.repositories)) {
      this.multiModel.repositories.forEach(function (repo) {
        this.applyChangeCacheToModel(repo.model, repo.id || repo.name || "_repo_", repo.name || repo.id || "_repo_");
      }, this);
      return;
    }
    if (this.model) {
      this.applyChangeCacheToModel(this.model, "_single_", "_single_");
    }
  };

  GitGraphVisualizer.prototype.estimateSingleGraphHeight = function (model) {
    if (!model || !Array.isArray(model.commits) || !model.commits.length) return 120;

    var savedModel = this.model;
    var savedShift = this.commitShiftMap;
    this.model = model;
    this.prepareCommitShifts();
    this.model = savedModel;
    this.commitShiftMap = savedShift;

    var laneCount = laneCountOfModel(model);
    var headCountByCommit = Object.create(null);
    Object.keys(model.branchHeads).forEach(function (branchName) {
      var commitId = model.branchHeads[branchName];
      if (!commitId) return;
      headCountByCommit[commitId] = (headCountByCommit[commitId] || 0) + 1;
    });

    var maxHeadCount = 0;
    Object.keys(headCountByCommit).forEach(function (commitId) {
      if (headCountByCommit[commitId] > maxHeadCount) maxHeadCount = headCountByCommit[commitId];
    });

    var hasTagLabel = this.options.showTags && model.commits.some(function (commit) {
      return commit.tags && commit.tags.length > 0;
    });

    var top = this.options.padding.top + (this.options.showHeadLabels ? maxHeadCount * 20 : 0) + (this.options.showCommitNames ? 28 : 0);
    var bottom = this.options.padding.bottom + (hasTagLabel ? 28 : 0) + (this.options.showCommitHashes ? 16 : 0);
    return top + bottom + Math.max(0, laneCount - 1) * this.options.laneGap;
  };

  GitGraphVisualizer.prototype.estimateMultiGraphHeight = function (multiModel) {
    if (!multiModel || !Array.isArray(multiModel.repositories) || !multiModel.repositories.length) return 120;

    var savedModel = this.model;
    var savedShift = this.commitShiftMap;
    var cursorY = this.options.padding.top;
    var count = 0;

    multiModel.repositories.forEach(function (repo) {
      var model = repo.model;
      if (!model || !Array.isArray(model.commits) || !model.commits.length) return;
      count += 1;

      this.model = model;
      this.prepareCommitShifts();

      var laneCount = laneCountOfModel(model);
      var laneHeight = Math.max(0, laneCount - 1) * this.options.laneGap;
      var hasTagLabel = this.options.showTags && model.commits.some(function (commit) {
        return commit.tags && commit.tags.length > 0;
      });

      var headCountByCommit = Object.create(null);
      Object.keys(model.branchHeads).forEach(function (branchName) {
        var commitId = model.branchHeads[branchName];
        if (!commitId) return;
        headCountByCommit[commitId] = (headCountByCommit[commitId] || 0) + 1;
      });

      var maxHeadCount = 0;
      Object.keys(headCountByCommit).forEach(function (commitId) {
        if (headCountByCommit[commitId] > maxHeadCount) maxHeadCount = headCountByCommit[commitId];
      });

      var topExtra = (this.options.showHeadLabels ? maxHeadCount * 20 : 0) + (this.options.showCommitNames ? 28 : 0);
      var bottomExtra = (hasTagLabel ? 28 : 0) + (this.options.showCommitHashes ? 16 : 0);
      var headerHeight = this.options.showRepoTitles ? this.options.multiRepoHeaderHeight : 0;
      var sectionHeight = headerHeight + topExtra + laneHeight + bottomExtra;
      cursorY += sectionHeight + this.options.multiRepoGap;
    }, this);

    this.model = savedModel;
    this.commitShiftMap = savedShift;

    if (count > 0) cursorY -= this.options.multiRepoGap;
    return cursorY + this.options.padding.bottom;
  };

  GitGraphVisualizer.prototype.computeStageFixedHeight = function () {
    if (!this.stageItems || !this.stageItems.length) return null;
    var maxHeight = 0;
    this.stageItems.forEach(function (stage) {
      var data = stage.data || {};
      var h = 0;
      if (Array.isArray(data.repositories)) {
        var multi = normalizeMultiRepoData(data, this.options);
        h = this.estimateMultiGraphHeight(multi);
      } else {
        var single = normalizeData(data, this.options);
        h = this.estimateSingleGraphHeight(single);
      }
      if (h > maxHeight) maxHeight = h;
    }, this);
    return maxHeight > 0 ? maxHeight : null;
  };

  GitGraphVisualizer.prototype.setStages = function (stages, stageOptions) {
    var list = Array.isArray(stages) ? stages : [];
    this.clearStageMode();

    this.stageOptions = assign({
      intervalMs: this.options.stagePlayInterval,
      loop: this.options.stageLoop
    }, stageOptions || {});

    this.stageItems = list
      .map(function (stage, index) {
        var payload = stage && stage.data && typeof stage.data === "object" ? stage.data : stage;
        if (!payload || typeof payload !== "object") return null;
        return {
          label: stage && stage.label ? String(stage.label) : ("Step " + (index + 1)),
          data: payload
        };
      })
      .filter(function (item) { return !!item; });

    this.selectedCommitKey = null;
    this.selectedFilePath = null;

    if (!this.stageItems.length) {
      this.stageItems = null;
      this.model = normalizeData({}, this.options);
      this.multiModel = null;
      this.render();
      return;
    }

    this.buildStageChangeCache();
    this.stageFixedHeight = this.computeStageFixedHeight();
    this.stageIndex = 0;
    this.stageTransitionDirection = 1;
    this.applyStageData(this.stageItems[this.stageIndex].data);
    this.animateNextRender = !!this.options.stageMotion;
    this.render();
  };

  GitGraphVisualizer.prototype.goToStage = function (index, directionHint) {
    if (!this.stageItems || !this.stageItems.length) return;
    if (index < 0 || index >= this.stageItems.length) return;
    if (index === this.stageIndex) return;

    var prevIndex = this.stageIndex;
    this.stageTransitionDirection = Number.isFinite(directionHint) && directionHint !== 0
      ? directionHint
      : (index - prevIndex);
    this.selectedCommitKey = null;
    this.selectedFilePath = null;
    this.applyStageData(this.stageItems[index].data);
    this.stageIndex = index;
    this.animateNextRender = !!this.options.stageMotion;
    this.render();
  };

  GitGraphVisualizer.prototype.stepStage = function (delta) {
    if (!this.stageItems || !this.stageItems.length) return;

    var len = this.stageItems.length;
    var target = this.stageIndex + delta;
    if (target < 0) {
      target = this.stageOptions.loop ? len - 1 : 0;
    } else if (target >= len) {
      if (this.stageOptions.loop) target = 0;
      else {
        target = len - 1;
        this.stopStagePlayback();
      }
    }
    if (target === this.stageIndex) return;
    this.goToStage(target, delta);
  };

  GitGraphVisualizer.prototype.toggleStagePlayback = function () {
    if (!this.stageItems || this.stageItems.length < 2) return;
    if (this.stageTimer) {
      this.stopStagePlayback();
      this.updateStageControls();
      return;
    }

    var intervalMs = Math.max(200, Number(this.stageOptions.intervalMs) || this.options.stagePlayInterval);
    this.stageTimer = setInterval(function () {
      this.stepStage(1);
      this.updateStageControls();
    }.bind(this), intervalMs);
    this.updateStageControls();
  };

  GitGraphVisualizer.prototype.nextStage = function () {
    this.stepStage(1);
  };

  GitGraphVisualizer.prototype.prevStage = function () {
    this.stepStage(-1);
  };

  GitGraphVisualizer.prototype.playStages = function () {
    if (!this.stageTimer) this.toggleStagePlayback();
  };

  GitGraphVisualizer.prototype.pauseStages = function () {
    this.stopStagePlayback();
    this.updateStageControls();
  };

  GitGraphVisualizer.prototype.updateStageControls = function () {
    if (!this.uiRefs || !this.uiRefs.stage || !this.stageItems || !this.stageItems.length) return;
    var label = this.uiRefs.stage.label;
    var name = this.uiRefs.stage.name;
    var playBtn = this.uiRefs.stage.playBtn;
    var prevBtn = this.uiRefs.stage.prevBtn;
    var nextBtn = this.uiRefs.stage.nextBtn;
    if (label) {
      label.textContent = (this.stageIndex + 1) + " / " + this.stageItems.length;
    }
    if (name) {
      name.textContent = this.stageItems[this.stageIndex].label;
    }
    if (playBtn) {
      playBtn.textContent = this.stageTimer ? this.messages.pause : this.messages.play;
      playBtn.setAttribute("aria-label", this.stageTimer ? this.messages.pause : this.messages.play);
      playBtn.setAttribute("aria-pressed", this.stageTimer ? "true" : "false");
    }
    if (this.uiRefs.stage.status) {
      this.uiRefs.stage.status.textContent = label.textContent + " · " + name.textContent;
    }
    if (prevBtn && !this.stageOptions.loop) prevBtn.disabled = this.stageIndex <= 0;
    if (nextBtn && !this.stageOptions.loop) nextBtn.disabled = this.stageIndex >= this.stageItems.length - 1;
  };

  GitGraphVisualizer.prototype.buildUiShell = function () {
    this.ensureUiStyles();
    var hasStages = !!(this.stageItems && this.stageItems.length);
    var hasInspector = this.isInspectorEnabled();
    if (this.uiRefs && this.container.contains(this.uiRefs.root) &&
        !!this.uiRefs.stage === hasStages && !!this.uiRefs.inspector === hasInspector) {
      this.uiRefs.root.classList.toggle("ggv-reduced-motion", this.prefersReducedMotion());
      this.uiRefs.graphHost.style.height = this.stageFixedHeight ? this.stageFixedHeight + "px" : "";
      this.uiRefs.graphHost.style.minHeight = this.stageFixedHeight ? this.stageFixedHeight + "px" : "";
      this.updateStageControls();
      return;
    }
    this.container.replaceChildren();

    var root = document.createElement("div");
    root.className = "ggv-root";
    root.classList.toggle("ggv-reduced-motion", this.prefersReducedMotion());
    var stageRefs = null;

    if (this.stageItems && this.stageItems.length) {
      var bar = document.createElement("div");
      bar.className = "ggv-stage";

      var prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.textContent = "←";
      prevBtn.setAttribute("aria-label", this.messages.previousStage);
      prevBtn.addEventListener("click", function () { this.stepStage(-1); }.bind(this));

      var playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.textContent = this.messages.play;
      playBtn.addEventListener("click", function () { this.toggleStagePlayback(); }.bind(this));

      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.textContent = "→";
      nextBtn.setAttribute("aria-label", this.messages.nextStage);
      nextBtn.addEventListener("click", function () { this.stepStage(1); }.bind(this));

      var label = document.createElement("span");
      label.className = "ggv-stage-label";
      label.textContent = "1 / 1";

      var name = document.createElement("span");
      name.className = "ggv-stage-name";

      var status = document.createElement("span");
      status.className = "ggv-sr-only";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.setAttribute("aria-atomic", "true");
      bar.appendChild(status);
      bar.appendChild(prevBtn);
      bar.appendChild(playBtn);
      bar.appendChild(nextBtn);
      bar.appendChild(label);
      bar.appendChild(name);
      root.appendChild(bar);

      stageRefs = { bar: bar, prevBtn: prevBtn, playBtn: playBtn, nextBtn: nextBtn, label: label, name: name, status: status };
    }

    var graphHost = document.createElement("div");
    graphHost.className = "ggv-graph";
    graphHost.tabIndex = 0;
    graphHost.setAttribute("role", "region");
    graphHost.setAttribute("aria-label", this.messages.graphLabel);
    if (Number.isFinite(this.stageFixedHeight) && this.stageFixedHeight > 0) {
      graphHost.style.height = this.stageFixedHeight + "px";
      graphHost.style.minHeight = this.stageFixedHeight + "px";
    }
    root.appendChild(graphHost);

    var inspector = null;
    if (this.isInspectorEnabled()) {
      inspector = this.buildInspector();
      root.appendChild(inspector.root);
    }

    this.container.appendChild(root);
    this.uiRefs = {
      root: root,
      graphHost: graphHost,
      stage: stageRefs,
      inspector: inspector
    };
    this.updateStageControls();
  };

  GitGraphVisualizer.prototype.buildInspector = function () {
    var root = document.createElement("div");
    root.className = "ggv-inspector";

    var header = document.createElement("div");
    header.className = "ggv-inspector-header";

    var title = document.createElement("div");
    title.className = "ggv-inspector-title";
    title.setAttribute("role", "status");
    title.setAttribute("aria-live", "polite");
    title.textContent = this.messages.inspectorTitle;

    var sub = document.createElement("div");
    sub.className = "ggv-inspector-sub";
    sub.textContent = this.messages.inspectorIntro;

    header.appendChild(title);
    header.appendChild(sub);

    var body = document.createElement("div");
    body.className = "ggv-inspector-body";

    var fileList = document.createElement("div");
    fileList.className = "ggv-file-list";

    var diff = document.createElement("div");
    diff.className = "ggv-diff";

    body.appendChild(fileList);
    body.appendChild(diff);
    root.appendChild(header);
    root.appendChild(body);

    return { root: root, title: title, sub: sub, fileList: fileList, diff: diff };
  };

  GitGraphVisualizer.prototype.mountSvg = function (svg) {
    this.buildUiShell();
    this.uiRefs.graphHost.appendChild(svg);
    if (this.savedGraphScroll) {
      this.uiRefs.graphHost.scrollLeft = this.savedGraphScroll.left;
      this.uiRefs.graphHost.scrollTop = this.savedGraphScroll.top;
      this.savedGraphScroll = null;
    }
    if (this.restoreCommitFocus) {
      var focusNode = this.commitNodeByKey.get(this.restoreCommitFocus);
      var hit = focusNode && focusNode.querySelector(".ggv-commit-hit");
      if (hit) hit.focus({ preventScroll: true });
      this.restoreCommitFocus = null;
    }
    if (this.animateNextRender && this.options.stageMotion && !this.prefersReducedMotion()) {
      this.applyStageTransitionMotion(svg);
      this.applyTrackedPositionMotion();
    }
    this.animateNextRender = false;
    if (this.stageItems && this.stageItems.length) {
      this.prevStageKeys = new Set(this.currentRenderKeys || []);
    } else {
      this.prevStageKeys = null;
    }
    this.prevTrackedPositions = new Map(this.currentTrackedPositions || []);
    this.refreshCommitInspector();
  };

  GitGraphVisualizer.prototype.markAnimNode = function (node, key, revealX, kind) {
    if (!node || !key) return;
    var stableKey = String(key);
    node.setAttribute("data-ggv-anim-key", stableKey);
    node.setAttribute("data-ggv-anim-kind", kind || "item");
    if (Number.isFinite(revealX)) {
      node.setAttribute("data-ggv-reveal-x", String(revealX));
    }
    if (!this.currentRenderKeys) this.currentRenderKeys = new Set();
    this.currentRenderKeys.add(stableKey);
  };

  GitGraphVisualizer.prototype.registerTrackedNode = function (node, key, x, y) {
    if (!node || !key) return;
    var stable = String(key);
    node.setAttribute("data-ggv-track-key", stable);
    if (Number.isFinite(x)) node.setAttribute("data-ggv-track-x", String(x));
    if (Number.isFinite(y)) node.setAttribute("data-ggv-track-y", String(y));
    this.currentTrackedPositions.set(stable, { x: x, y: y });
    this.currentTrackedNodes.set(stable, node);
    this.markAnimNode(node, "track::" + stable, x, "label");
  };

  GitGraphVisualizer.prototype.applyTrackedPositionMotion = function () {
    if (!this.animateNextRender || !this.options.stageMotion || this.prefersReducedMotion()) return;
    if (!this.prevTrackedPositions || !this.prevTrackedPositions.size) return;
    if (!this.currentTrackedPositions || !this.currentTrackedPositions.size) return;

    var duration = Math.max(120, Number(this.options.stageMotionDuration) || 380);
    var easing = "cubic-bezier(0.22,0.61,0.36,1)";

    this.currentTrackedPositions.forEach(function (curr, key) {
      var prev = this.prevTrackedPositions.get(key);
      if (!prev) return;
      var node = this.currentTrackedNodes.get(key);
      if (!node) return;

      var dx = Number(prev.x) - Number(curr.x);
      var dy = Number(prev.y) - Number(curr.y);
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
      if (Math.abs(dx) < 0.6 && Math.abs(dy) < 0.6) return;

      var kf = [
        { transform: "translate(" + dx + "px," + dy + "px)" },
        { transform: "translate(" + (dx * 0.48) + "px," + (dy * 0.18) + "px)" },
        { transform: "translate(0px,0px)" }
      ];

      if (typeof node.animate === "function") {
        var anim = node.animate(kf, {
          duration: duration,
          easing: easing,
          fill: "both"
        });
        anim.onfinish = function () {
          node.style.transform = "";
        };
      } else {
        node.style.transform = "translate(" + dx + "px," + dy + "px)";
        node.style.transition = "transform " + duration + "ms " + easing;
        var t = setTimeout(function () {
          node.style.transform = "translate(0px,0px)";
        }, 16);
        this.stageMotionTimers.push(t);
      }
    }, this);
  };

  GitGraphVisualizer.prototype.applyStageTransitionMotion = function (svg) {
    if (!svg) return;
    this.clearStageMotionTimers();

    var nodes = Array.prototype.slice.call(svg.querySelectorAll("[data-ggv-anim-key]"));
    if (!nodes.length) return;

    var prev = this.prevStageKeys || new Set();
    var shouldDiffOnly = !!(prev && prev.size) && this.stageTransitionDirection >= 0;
    var targets = nodes.filter(function (node) {
      var key = node.getAttribute("data-ggv-anim-key");
      if (!key) return false;
      if (!shouldDiffOnly) return false;
      return !prev.has(key);
    });

    if (shouldDiffOnly && !targets.length) {
      var allXs = nodes
        .map(function (node) { return Number(node.getAttribute("data-ggv-reveal-x")); })
        .filter(function (x) { return Number.isFinite(x); });
      if (allXs.length) {
        var maxX = Math.max.apply(null, allXs);
        var columnUnitFallback = Math.max(12, Number(this.options.columnGap) || 120);
        var threshold = maxX - columnUnitFallback * 0.85;
        targets = nodes.filter(function (node) {
          var x = Number(node.getAttribute("data-ggv-reveal-x"));
          if (!Number.isFinite(x)) return false;
          return x >= threshold;
        });
      }
    }

    if (!targets.length) return;

    var xs = targets
      .map(function (node) { return Number(node.getAttribute("data-ggv-reveal-x")); })
      .filter(function (x) { return Number.isFinite(x); });
    if (!xs.length) return;

    var minX = Math.min.apply(null, xs);
    var duration = Math.max(120, Number(this.options.stageMotionDuration) || 380);
    var stagger = Math.max(10, Number(this.options.stageMotionStagger) || 70);
    var columnUnit = Math.max(12, Number(this.options.columnGap) || 120);

    var animateStroke = function (node, delayMs) {
      if (!node || typeof node.getTotalLength !== "function") return false;
      var length = 0;
      try {
        length = node.getTotalLength();
      } catch (error) {
        return false;
      }
      if (!Number.isFinite(length) || length <= 0) return false;

      var origDash = node.getAttribute("stroke-dasharray");
      var origOffset = node.style.strokeDashoffset;

      var startOffset = -length;
      node.style.strokeDasharray = length + " " + length;
      node.style.strokeDashoffset = String(startOffset);

      if (typeof node.animate === "function") {
        var anim = node.animate(
          [
            { strokeDashoffset: String(startOffset) },
            { strokeDashoffset: "0" }
          ],
          {
            duration: duration,
            delay: delayMs,
            easing: "ease",
            fill: "both"
          }
        );
        anim.onfinish = function () {
          node.style.strokeDashoffset = origOffset || "";
          if (origDash !== null && origDash !== undefined) {
            node.setAttribute("stroke-dasharray", origDash);
            node.style.strokeDasharray = "";
          } else {
            node.style.strokeDasharray = "";
          }
        };
      } else {
        node.style.transition = "stroke-dashoffset " + duration + "ms ease " + delayMs + "ms";
        var startTimer = setTimeout(function () {
          node.style.strokeDashoffset = "0";
        }, 16);
        this.stageMotionTimers.push(startTimer);

        var endTimer = setTimeout(function () {
          node.style.transition = "";
          node.style.strokeDashoffset = origOffset || "";
          if (origDash !== null && origDash !== undefined) {
            node.setAttribute("stroke-dasharray", origDash);
            node.style.strokeDasharray = "";
          } else {
            node.style.strokeDasharray = "";
          }
        }, duration + delayMs + 40);
        this.stageMotionTimers.push(endTimer);
      }
      return true;
    }.bind(this);

    targets.forEach(function (node) {
      var x = Number(node.getAttribute("data-ggv-reveal-x"));
      if (!Number.isFinite(x)) x = minX;
      var step = Math.max(0, (x - minX) / columnUnit);
      var delay = step * stagger;
      var kind = node.getAttribute("data-ggv-anim-kind") || "item";

      if (kind === "edge" || kind === "relation-path") {
        if (animateStroke(node, delay)) return;
      }

      node.style.opacity = "0";
      if (typeof node.animate === "function") {
        var fade = node.animate(
          [
            { opacity: 0 },
            { opacity: 1 }
          ],
          {
            duration: duration,
            delay: delay,
            easing: "ease",
            fill: "both"
          }
        );
        fade.onfinish = function () {
          node.style.opacity = "1";
        };
      } else {
        node.style.transition = "opacity " + duration + "ms ease " + delay + "ms";
        var timerId = setTimeout(function () {
          node.style.opacity = "1";
        }, 16);
        this.stageMotionTimers.push(timerId);
      }
    }, this);
  };

  GitGraphVisualizer.prototype.commitKey = function (repoId, commitId) {
    return String(repoId || "_single_") + "::" + String(commitId || "");
  };

  GitGraphVisualizer.prototype.selectCommit = function (key) {
    this.selectedCommitKey = key;
    this.animateNextRender = false;
    this.render();
  };

  GitGraphVisualizer.prototype.refreshCommitInspector = function () {
    var refs = this.uiRefs && this.uiRefs.inspector;
    if (!refs) return;

    var selected = this.selectedCommitKey ? this.visibleCommitMap.get(this.selectedCommitKey) : null;
    if (!selected && this.selectedCommitKey) {
      this.selectedCommitKey = null;
      this.selectedFilePath = null;
    }

    if (!selected) {
      refs.title.textContent = this.messages.inspectorTitle;
      refs.sub.textContent = this.messages.inspectorIntro;
      refs.fileList.innerHTML = '<div class="ggv-empty">' + escapeHtml(this.messages.noCommitSelected) + "</div>";
      refs.diff.innerHTML = '<div class="ggv-empty">' + escapeHtml(this.messages.selectFilePrompt) + "</div>";
      return;
    }

    var commit = selected.commit;
    var files = Array.isArray(commit.changes) ? commit.changes : [];
    refs.title.textContent = (selected.repoName ? (selected.repoName + " · ") : "") + (commit.name || commit.id);
    refs.sub.textContent = this.messages.commitMeta(commit.id, files.length);

    refs.fileList.innerHTML = "";
    refs.diff.innerHTML = "";

    if (!files.length) {
      refs.fileList.innerHTML = '<div class="ggv-empty">' + escapeHtml(this.messages.noChangedFiles) + "</div>";
      refs.diff.innerHTML = '<div class="ggv-empty">' + escapeHtml(this.messages.missingChangesData) + "</div>";
      return;
    }

    var activePath = this.selectedFilePath;
    if (!activePath || !files.some(function (file) { return file.path === activePath; })) {
      activePath = files[0].path;
      this.selectedFilePath = activePath;
    }

    files.forEach(function (file) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "ggv-file-item" + (file.path === activePath ? " active" : "");
      item.textContent = file.path;
      item.addEventListener("click", function () {
        this.selectedFilePath = file.path;
        this.refreshCommitInspector();
      }.bind(this));
      refs.fileList.appendChild(item);
    }, this);

    var target = files.find(function (file) { return file.path === activePath; }) || files[0];
    if (!target.lines.length) {
      refs.diff.innerHTML = '<div class="ggv-empty">' + escapeHtml(this.messages.noDiffLines) + "</div>";
      return;
    }

    target.lines.forEach(function (line) {
      var row = document.createElement("div");
      var type = line.type === "add" ? "add" : (line.type === "del" ? "del" : "ctx");
      row.className = "ggv-diff-line " + type;
      var prefix = type === "add" ? "+" : (type === "del" ? "-" : " ");
      row.textContent = prefix + line.text;
      refs.diff.appendChild(row);
    });
  };

  GitGraphVisualizer.prototype.setData = function (data) {
    if (data && Array.isArray(data.stages)) {
      this.setStages(data.stages, data.stageOptions || {});
      return;
    }

    this.clearStageMode();
    this.animateNextRender = false;
    if (data && Array.isArray(data.repositories)) {
      this.multiModel = normalizeMultiRepoData(data, this.options);
      this.model = null;
      this.selectedCommitKey = null;
      this.selectedFilePath = null;
      this.render();
      return;
    }
    this.multiModel = null;
    this.model = normalizeData(data || {}, this.options);
    this.selectedCommitKey = null;
    this.selectedFilePath = null;
    this.render();
  };

  GitGraphVisualizer.prototype.setMultiRepoData = function (data) {
    this.clearStageMode();
    this.animateNextRender = false;
    this.multiModel = normalizeMultiRepoData(data || {}, this.options);
    this.model = null;
    this.selectedCommitKey = null;
    this.selectedFilePath = null;
    this.render();
  };

  GitGraphVisualizer.prototype.setDiffInspectorVisible = function (visible) {
    this.options.showDiffInspector = !!visible;
    if (!this.options.showDiffInspector) {
      this.selectedCommitKey = null;
      this.selectedFilePath = null;
    }
    this.render();
  };

  GitGraphVisualizer.prototype.clear = function () {
    this.clearStageMotionTimers();
    var focused = document.activeElement;
    if (focused && this.container.contains(focused) && focused.classList.contains("ggv-commit-hit")) {
      this.restoreCommitFocus = focused.getAttribute("data-selection-key");
    }
    if (this.uiRefs) {
      this.savedGraphScroll = {
        left: this.uiRefs.graphHost.scrollLeft,
        top: this.uiRefs.graphHost.scrollTop
      };
      this.uiRefs.graphHost.replaceChildren();
    }
    this.layoutPadding = null;
    this.commitShiftMap = null;
    this.multiLayout = null;
    this.visibleCommitMap = new Map();
    this.commitNodeByKey = new Map();
    this.currentTrackedPositions = new Map();
    this.currentTrackedNodes = new Map();
    this.activeRepoContext = null;
  };

  GitGraphVisualizer.prototype.columnX = function (column) {
    var padding = this.layoutPadding || this.options.padding;
    return padding.left + column * this.options.columnGap;
  };

  GitGraphVisualizer.prototype.commitColumn = function (commit) {
    var shift = this.commitShiftMap ? (this.commitShiftMap.get(commit.id) || 0) : 0;
    return commit.column + shift;
  };

  GitGraphVisualizer.prototype.commitX = function (commit) {
    return this.columnX(this.commitColumn(commit));
  };

  GitGraphVisualizer.prototype.prepareCommitShifts = function () {
    this.commitShiftMap = new Map();
    this.model.commits.forEach(function (commit) {
      this.commitShiftMap.set(commit.id, 0);
    }, this);

    if (!this.options.innerBranchDelay) return;

    var splitGroups = new Map();

    this.model.commits.forEach(function (commit) {
      commit.parents.forEach(function (parentId) {
        var parent = this.model.commitById.get(parentId);
        if (!parent) return;
        if (commit.lane === parent.lane) return;

        var direction = commit.lane > parent.lane ? "down" : "up";
        var key = parent.id + "|" + direction;
        if (!splitGroups.has(key)) splitGroups.set(key, []);
        splitGroups.get(key).push({
          commit: commit,
          laneDelta: Math.max(1, Math.abs(commit.lane - parent.lane))
        });
      }, this);
    }, this);

    splitGroups.forEach(function (edges) {
      if (edges.length < 2) return;

      edges.sort(function (a, b) {
        if (a.laneDelta !== b.laneDelta) return a.laneDelta - b.laneDelta;
        if (a.commit.lane !== b.commit.lane) return a.commit.lane - b.commit.lane;
        return a.commit.column - b.commit.column;
      });

      edges.forEach(function (edge, index) {
        var delay = (edges.length - 1 - index) * this.options.splitDelayColumns;
        if (delay <= 0) return;

        this.model.commits.forEach(function (target) {
          if (target.lane !== edge.commit.lane) return;
          if (target.column < edge.commit.column) return;

          var prev = this.commitShiftMap.get(target.id) || 0;
          if (delay > prev) this.commitShiftMap.set(target.id, delay);
        }, this);
      }, this);
    }, this);

    var minTimeGap = Number(this.options.minTimeGapColumns) || 0;
    if (minTimeGap > 0) {
      var previousEffectiveColumn = -Infinity;
      this.model.commits.forEach(function (commit) {
        var shift = this.commitShiftMap.get(commit.id) || 0;
        var effectiveColumn = commit.column + shift;
        var minAllowed = previousEffectiveColumn + minTimeGap;
        if (effectiveColumn < minAllowed) {
          effectiveColumn = minAllowed;
          this.commitShiftMap.set(commit.id, effectiveColumn - commit.column);
        }
        previousEffectiveColumn = effectiveColumn;
      }, this);
    }
  };

  GitGraphVisualizer.prototype.laneY = function (lane) {
    var safeLane = lane < 0 ? 0 : lane;
    var padding = this.layoutPadding || this.options.padding;
    return padding.top + safeLane * this.options.laneGap;
  };

  GitGraphVisualizer.prototype.buildRoutes = function () {
    var routes = [];
    var parentGroups = new Map();

    this.model.commits.forEach(function (commit) {
      var fromX = this.commitX(commit);
      var fromY = this.laneY(commit.lane);

      commit.parents.forEach(function (parentId, parentIndex) {
        var parent = this.model.commitById.get(parentId);
        if (!parent) return;

        var toX = this.commitX(parent);
        var toY = this.laneY(parent.lane);

        if (commit.lane === parent.lane) {
          routes.push({
            kind: "straight",
            color: parentIndex === 0 ? commit.color : parent.color,
            fromX: fromX,
            fromY: fromY,
            toX: toX,
            toY: toY,
            laneDelta: 0,
            fromCommitId: commit.id,
            toCommitId: parent.id
          });
          return;
        }

        var startX = fromX - this.options.nodeRadius;
        var endX = toX + this.options.nodeRadius;
        var maxX = startX - this.options.routeInset;
        var minX = endX + this.options.routeInset;
        if (minX > maxX) {
          var midX = startX + (endX - startX) * 0.5;
          minX = midX;
          maxX = midX;
        }
        var route = {
          kind: "smooth",
          color: parentIndex === 0 ? commit.color : parent.color,
          fromX: fromX,
          fromY: fromY,
          toX: toX,
          toY: toY,
          laneDelta: Math.max(1, Math.abs(commit.lane - parent.lane)),
          parentId: parent.id,
          fromCommitId: commit.id,
          toCommitId: parent.id,
          minChannelX: minX,
          maxChannelX: maxX,
          channelX: (minX + maxX) * 0.5
        };

        routes.push(route);

        if (!parentGroups.has(parent.id)) {
          parentGroups.set(parent.id, []);
        }
        parentGroups.get(parent.id).push(route);
      }, this);
    }, this);

    parentGroups.forEach(function (group) {
      var below = group.filter(function (route) {
        return route.fromY > route.toY;
      });
      var above = group.filter(function (route) {
        return route.fromY < route.toY;
      });

      var placeGroup = function (items) {
        if (!items.length) return;

        items.sort(function (a, b) {
          if (a.laneDelta !== b.laneDelta) return a.laneDelta - b.laneDelta;
          if (a.fromY !== b.fromY) return a.fromY - b.fromY;
          return a.fromX - b.fromX;
        });

        var minGap = Math.max(10, this.options.routeSpacing);
        var previousChannel = Number.POSITIVE_INFINITY;

        items.forEach(function (route, index) {
          var ideal = index === 0 ? route.maxChannelX : previousChannel - minGap;
          if (ideal > route.maxChannelX) ideal = route.maxChannelX;
          if (ideal < route.minChannelX) ideal = route.minChannelX;
          route.channelX = ideal;
          previousChannel = route.channelX;
        });

        for (var i = items.length - 2; i >= 0; i -= 1) {
          var next = items[i + 1];
          var current = items[i];
          var mustBeAtLeast = next.channelX + minGap;
          if (current.channelX < mustBeAtLeast) {
            current.channelX = Math.min(current.maxChannelX, mustBeAtLeast);
          }
          if (current.channelX < current.minChannelX) {
            current.channelX = current.minChannelX;
          }
        }
      }.bind(this);

      placeGroup(below);
      placeGroup(above);
    }, this);

    return routes;
  };

  GitGraphVisualizer.prototype.estimateMetadataMaxRight = function () {
    if (!this.model || !Array.isArray(this.model.commits) || !this.model.commits.length) return 0;

    var branchHeads = this.model.branchHeads || {};
    var headNames = Object.keys(branchHeads);
    var maxRight = 0;

    this.model.commits.forEach(function (commit) {
      var x = this.commitX(commit);
      if (x + this.options.nodeRadius + 2 > maxRight) maxRight = x + this.options.nodeRadius + 2;

      var branchesAtCommit = headNames.filter(function (name) {
        return branchHeads[name] === commit.id;
      });
      if (this.model.currentHeadBranch) {
        branchesAtCommit.sort(function (a, b) {
          if (a === b) return 0;
          if (a === this.model.currentHeadBranch) return -1;
          if (b === this.model.currentHeadBranch) return 1;
          return a.localeCompare(b);
        }.bind(this));
      }

      if (this.options.showHeadLabels) {
        branchesAtCommit.forEach(function (branchName) {
          var isCurrentHead = this.model.currentHeadBranch && this.model.currentHeadBranch === branchName;
          var text = isCurrentHead ? ("HEAD · " + branchName) : branchName;
          var w = Math.max(40, 14 + text.length * 7);
          if (x + w / 2 > maxRight) maxRight = x + w / 2;
        }, this);
      }

      if (this.options.showCommitNames && commit.name) {
        var commitLabel = compact(commit.name, this.options.maxCommitLabelLength);
        var labelWidth = Math.max(24, commitLabel.length * 6.6);
        if (x + labelWidth * 0.5 > maxRight) maxRight = x + labelWidth * 0.5;
      }

      if (this.options.showTags && commit.tags && commit.tags.length) {
        commit.tags.forEach(function (tag, tagIndex) {
          var tagText = String(tag);
          var tw = Math.max(34, 12 + tagText.length * 7);
          var tx = x + 10 + tagIndex * (tw + 6);
          if (tx + tw > maxRight) maxRight = tx + tw;
        });
      }
    }, this);

    return maxRight;
  };

  GitGraphVisualizer.prototype.render = function () {
    this.clear();
    this.currentRenderKeys = new Set();

    if (this.multiModel && this.multiModel.repositories && this.multiModel.repositories.length) {
      this.renderMulti();
      return;
    }

    if (!this.model || !this.model.commits.length) {
      var emptySvg = svgNode("svg", {
        width: 420,
        height: 120,
        viewBox: "0 0 420 120",
        role: this.isInspectorEnabled() ? "group" : "img",
        "aria-label": this.messages.graphLabel,
        style: "font-family: " + this.options.fontFamily + ";"
      });
      emptySvg.appendChild(
        svgNode("text", {
          x: 18,
          y: 62,
          fill: this.options.mutedTextColor,
          "font-size": 12,
          "font-weight": 600
        }, this.messages.noCommits)
      );
      this.mountSvg(emptySvg);
      return;
    }

    this.prepareCommitShifts();

    var commits = this.model.commits;
    var branches = this.model.branches;
    var laneCount = laneCountOfModel(this.model);
    var headCountByCommit = Object.create(null);
    Object.keys(this.model.branchHeads).forEach(function (branchName) {
      var commitId = this.model.branchHeads[branchName];
      if (!commitId) return;
      headCountByCommit[commitId] = (headCountByCommit[commitId] || 0) + 1;
    }, this);

    var maxHeadCount = 0;
    Object.keys(headCountByCommit).forEach(function (commitId) {
      if (headCountByCommit[commitId] > maxHeadCount) maxHeadCount = headCountByCommit[commitId];
    });

    var hasTagLabel = this.options.showTags && commits.some(function (commit) {
      return commit.tags && commit.tags.length > 0;
    });

    var leftPadding = this.options.padding.left;
    if (this.options.showBranchNames && branches.length) {
      var maxBranchLabelWidth = branchLaneLabelWidth(this.model);
      var minLeftForLabels = Math.max(this.options.padding.left + 28, maxBranchLabelWidth + 64);
      if (minLeftForLabels > leftPadding) leftPadding = minLeftForLabels;
    }

    this.layoutPadding = {
      left: leftPadding,
      right: this.options.padding.right,
      top: this.options.padding.top + (this.options.showHeadLabels ? maxHeadCount * 20 : 0) + (this.options.showCommitNames ? 28 : 0),
      bottom: this.options.padding.bottom + (hasTagLabel ? 28 : 0) + (this.options.showCommitHashes ? 16 : 0)
    };

    var maxEffectiveColumn = commits.reduce(function (maxValue, commit) {
      return Math.max(maxValue, this.commitColumn(commit));
    }.bind(this), 0);

    var width = this.layoutPadding.left + this.layoutPadding.right + Math.max(0, maxEffectiveColumn) * this.options.columnGap;
    var height = this.layoutPadding.top + this.layoutPadding.bottom + Math.max(0, laneCount - 1) * this.options.laneGap;
    var metadataRight = this.estimateMetadataMaxRight();
    if (metadataRight > 0) {
      width = Math.max(width, metadataRight + 18);
    }

    var svg = svgNode("svg", {
      width: width,
      height: height,
      viewBox: "0 0 " + width + " " + height,
      role: this.isInspectorEnabled() ? "group" : "img",
      "aria-label": this.messages.graphLabel,
      style: "font-family: " + this.options.fontFamily + ";"
    });

    if (this.options.background && this.options.background !== "transparent") {
      svg.appendChild(
        svgNode("rect", {
          x: 0,
          y: 0,
          width: width,
          height: height,
          fill: this.options.background
        })
      );
    }

    if (this.options.showLaneGuides) {
      this.drawLaneGuides(svg, width);
    }

    this.activeRepoContext = null;
    this.drawEdges(svg, this.buildRoutes());
    this.drawCommits(svg);

    if (this.options.showBranchNames) {
      this.drawBranchLaneLabels(svg);
    }

    if (this.options.showHeadLabels || this.options.showTags || this.options.showCommitNames || this.options.showCommitHashes) {
      this.drawMetadataLabels(svg);
    }

    if (this.options.showHoverTimeGuide) {
      this.drawHoverTimeGuide(svg, width, height);
    }

    this.mountSvg(svg);
  };

  GitGraphVisualizer.prototype.renderMulti = function () {
    var repos = this.multiModel && this.multiModel.repositories ? this.multiModel.repositories : [];
    this.currentRenderKeys = new Set();
    if (!repos.length) {
      var emptySvg = svgNode("svg", {
        width: 420,
        height: 120,
        viewBox: "0 0 420 120",
        role: this.isInspectorEnabled() ? "group" : "img",
        "aria-label": this.messages.graphLabel,
        style: "font-family: " + this.options.fontFamily + ";"
      });
      emptySvg.appendChild(
        svgNode("text", {
          x: 18,
          y: 62,
          fill: this.options.mutedTextColor,
          "font-size": 12,
          "font-weight": 600
        }, this.messages.noRepositories)
      );
      this.mountSvg(emptySvg);
      return;
    }

    var leftPadding = this.options.padding.left;
    if (this.options.showBranchNames) {
      var maxBranchLabelWidth = repos.reduce(function (maxWidth, repo) {
        return Math.max(
          maxWidth,
          branchLaneLabelWidth(repo.model)
        );
      }, 0);
      var minLeftForLabels = Math.max(this.options.padding.left + 28, maxBranchLabelWidth + 64);
      if (minLeftForLabels > leftPadding) leftPadding = minLeftForLabels;
    }

    var repoLayouts = [];
    var cursorY = this.options.padding.top;
    var maxEffectiveColumn = 0;
    var maxMetadataRightX = 0;

    var savedModel = this.model;
    var savedShiftMap = this.commitShiftMap;
    var savedPadding = this.layoutPadding;

    repos.forEach(function (repo, index) {
      var model = repo.model;
      this.model = model;
      this.prepareCommitShifts();
      var shiftMap = new Map(this.commitShiftMap || []);

      var laneCount = laneCountOfModel(model);
      var laneHeight = Math.max(0, laneCount - 1) * this.options.laneGap;
      var hasTagLabel = this.options.showTags && model.commits.some(function (commit) {
        return commit.tags && commit.tags.length > 0;
      });

      var headCountByCommit = Object.create(null);
      Object.keys(model.branchHeads).forEach(function (branchName) {
        var commitId = model.branchHeads[branchName];
        if (!commitId) return;
        headCountByCommit[commitId] = (headCountByCommit[commitId] || 0) + 1;
      });

      var maxHeadCount = 0;
      Object.keys(headCountByCommit).forEach(function (commitId) {
        if (headCountByCommit[commitId] > maxHeadCount) maxHeadCount = headCountByCommit[commitId];
      });

      var topExtra = (this.options.showHeadLabels ? maxHeadCount * 20 : 0) + (this.options.showCommitNames ? 28 : 0);
      var bottomExtra = (hasTagLabel ? 28 : 0) + (this.options.showCommitHashes ? 16 : 0);
      var headerHeight = this.options.showRepoTitles ? this.options.multiRepoHeaderHeight : 0;
      var sectionHeight = headerHeight + topExtra + laneHeight + bottomExtra;
      var graphTop = cursorY + headerHeight + topExtra;

      var repoMaxColumn = model.commits.reduce(function (maxValue, commit) {
        var shift = shiftMap.get(commit.id) || 0;
        return Math.max(maxValue, commit.column + shift);
      }, 0);

      if (repoMaxColumn > maxEffectiveColumn) maxEffectiveColumn = repoMaxColumn;

      this.layoutPadding = {
        left: leftPadding,
        right: this.options.padding.right,
        top: graphTop,
        bottom: 0
      };
      var repoMetaRight = this.estimateMetadataMaxRight();
      if (repoMetaRight > maxMetadataRightX) maxMetadataRightX = repoMetaRight;

      repoLayouts.push({
        index: index,
        repo: repo,
        shiftMap: shiftMap,
        sectionTop: cursorY,
        sectionHeight: sectionHeight,
        graphTop: graphTop,
        laneCount: laneCount
      });

      cursorY += sectionHeight + this.options.multiRepoGap;
    }, this);

    this.model = savedModel;
    this.commitShiftMap = savedShiftMap;
    this.layoutPadding = savedPadding;

    if (repoLayouts.length) {
      cursorY -= this.options.multiRepoGap;
    }

    var width = leftPadding + this.options.padding.right + Math.max(0, maxEffectiveColumn) * this.options.columnGap;
    var height = cursorY + this.options.padding.bottom;
    if (maxMetadataRightX > 0) {
      width = Math.max(width, maxMetadataRightX + 18);
    }

    var svg = svgNode("svg", {
      width: width,
      height: height,
      viewBox: "0 0 " + width + " " + height,
      role: this.isInspectorEnabled() ? "group" : "img",
      "aria-label": this.messages.graphLabel,
      style: "font-family: " + this.options.fontFamily + ";"
    });

    if (this.options.background && this.options.background !== "transparent") {
      svg.appendChild(
        svgNode("rect", {
          x: 0,
          y: 0,
          width: width,
          height: height,
          fill: this.options.background
        })
      );
    }

    var commitPointMap = new Map();
    var hoverPoints = [];

    repoLayouts.forEach(function (layout) {
      var repo = layout.repo;
      var model = repo.model;

      this.model = model;
      this.commitShiftMap = layout.shiftMap;
      this.layoutPadding = {
        left: leftPadding,
        right: this.options.padding.right,
        top: layout.graphTop,
        bottom: 0
      };

      if (this.options.showRepoTitles) {
        svg.appendChild(
          svgNode("text", {
            x: leftPadding,
            y: layout.sectionTop + 20,
            fill: this.options.repoTitleColor,
            "font-size": 13,
            "font-weight": 700
          }, repo.name)
        );

        svg.appendChild(
          svgNode("line", {
            x1: leftPadding,
            y1: layout.sectionTop + this.options.multiRepoHeaderHeight - 2,
            x2: width - this.options.padding.right + 8,
            y2: layout.sectionTop + this.options.multiRepoHeaderHeight - 2,
            stroke: this.options.repoDividerColor,
            "stroke-width": 1
          })
        );
      }

      if (this.options.showLaneGuides) {
        this.drawLaneGuides(svg, width);
      }

      this.activeRepoContext = repo;
      this.drawEdges(svg, this.buildRoutes());
      this.drawCommits(svg);

      if (this.options.showBranchNames) {
        this.drawBranchLaneLabels(svg);
      }

      if (this.options.showHeadLabels || this.options.showTags || this.options.showCommitNames || this.options.showCommitHashes) {
        this.drawMetadataLabels(svg);
      }

      model.commits.forEach(function (commit) {
        var x = this.commitX(commit);
        var y = this.laneY(commit.lane);
        var point = {
          x: x,
          y: y,
          repoId: repo.id,
          repoName: repo.name,
          commitId: commit.id
        };
        commitPointMap.set(repo.id + "::" + commit.id, point);
        commitPointMap.set(repo.name + "::" + commit.id, point);
        hoverPoints.push({ x: x });
      }, this);
    }, this);

    this.model = null;
    this.commitShiftMap = null;
    this.layoutPadding = null;
    this.activeRepoContext = null;

    this.drawMultiRelations(svg, commitPointMap);

    if (this.options.showHoverTimeGuide) {
      this.drawHoverTimeGuideByPoints(svg, width, height, hoverPoints);
    }

    this.multiLayout = {
      width: width,
      height: height,
      leftPadding: leftPadding,
      repoLayouts: repoLayouts
    };

    this.mountSvg(svg);
  };

  GitGraphVisualizer.prototype.drawMultiRelations = function (svg, pointMap) {
    var relations = this.multiModel && this.multiModel.relations ? this.multiModel.relations : [];
    if (!relations.length) return;

    var group = svgNode("g");
    var svgWidth = Number(svg.getAttribute("width")) || Number(svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) || 0;
    var svgHeight = Number(svg.getAttribute("height")) || Number(svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.height) || 0;
    var relationFlowEnabled = this.options.relationFlow !== false && !this.prefersReducedMotion();
    var flowDurationMs = Math.max(220, Number(this.options.relationFlowDurationMs) || 900);
    var flowCycle = dashCycleLength(this.options.relationDash);
    var flowDir = String(this.options.relationFlowDirection || "forward").toLowerCase();
    var flowSign = flowDir === "reverse" ? 1 : -1;
    var resolved = [];
    var corridorMap = new Map();
    var duplicateMap = new Map();

    relations.forEach(function (relation, index) {
      var fromKey = String(relation.fromRepo || "") + "::" + String(relation.fromCommit || "");
      var toKey = String(relation.toRepo || "") + "::" + String(relation.toCommit || "");
      var fromPoint = pointMap.get(fromKey);
      var toPoint = pointMap.get(toKey);
      if (!fromPoint || !toPoint) return;

      var dx = toPoint.x - fromPoint.x;
      var dy = toPoint.y - fromPoint.y;
      var verticalDominant = Math.abs(dy) >= Math.abs(dx) * 0.72;
      var direction = verticalDominant
        ? (dy >= 0 ? "down" : "up")
        : (dx >= 0 ? "right" : "left");

      var pairA = fromKey < toKey ? fromKey : toKey;
      var pairB = fromKey < toKey ? toKey : fromKey;
      var pairKey = pairA + "||" + pairB;
      var fromRepoKey = String(relation.fromRepo || fromPoint.repoId || fromPoint.repoName || "");
      var toRepoKey = String(relation.toRepo || toPoint.repoId || toPoint.repoName || "");
      var repoA = fromRepoKey < toRepoKey ? fromRepoKey : toRepoKey;
      var repoB = fromRepoKey < toRepoKey ? toRepoKey : fromRepoKey;
      var corridorKey = repoA + "||" + repoB + "::" + direction;
      var duplicateKey = fromKey + "->" + toKey;

      var item = {
        relation: relation,
        fromPoint: fromPoint,
        toPoint: toPoint,
        pairKey: pairKey,
        index: index,
        dx: dx,
        dy: dy,
        direction: direction,
        verticalDominant: verticalDominant,
        corridorKey: corridorKey,
        duplicateKey: duplicateKey
      };
      resolved.push(item);
      if (!corridorMap.has(corridorKey)) corridorMap.set(corridorKey, []);
      corridorMap.get(corridorKey).push(item);
      if (!duplicateMap.has(duplicateKey)) duplicateMap.set(duplicateKey, []);
      duplicateMap.get(duplicateKey).push(item);
    });

    corridorMap.forEach(function (items) {
      items.sort(function (a, b) {
        var aPrimary = a.verticalDominant
          ? (a.fromPoint.x + a.toPoint.x) * 0.5
          : (a.fromPoint.y + a.toPoint.y) * 0.5;
        var bPrimary = b.verticalDominant
          ? (b.fromPoint.x + b.toPoint.x) * 0.5
          : (b.fromPoint.y + b.toPoint.y) * 0.5;
        if (aPrimary !== bPrimary) return aPrimary - bPrimary;
        var aSpan = Math.abs(a.dx) + Math.abs(a.dy);
        var bSpan = Math.abs(b.dx) + Math.abs(b.dy);
        if (aSpan !== bSpan) return bSpan - aSpan;
        return a.index - b.index;
      });
      items.forEach(function (item, idx) {
        item.corridorSize = items.length;
        item.corridorIndex = idx;
      });
    });

    duplicateMap.forEach(function (items) {
      items.sort(function (a, b) { return a.index - b.index; });
      items.forEach(function (item, idx) {
        item.duplicateSize = items.length;
        item.duplicateIndex = idx;
      });
    });

    var occupiedLabelRects = [];
    var overlaps = function (a, b, gap) {
      var g = Number(gap) || 0;
      return !(
        a.right + g < b.left ||
        a.left - g > b.right ||
        a.bottom + g < b.top ||
        a.top - g > b.bottom
      );
    };

    resolved.forEach(function (item) {
      var relation = item.relation;
      var fromPoint = item.fromPoint;
      var toPoint = item.toPoint;
      var color = relation.color || this.options.relationColor;
      var relationKey = "relation::" + item.pairKey + "::" + item.index;

      var spread = Number(this.options.relationBundleSpacing) || 12;
      var laneStep = Math.max(10, spread * 1.05);
      var duplicateStep = Math.max(6, spread * 0.65);
      var edgeMarginX = 10;
      var edgeMarginY = 10;
      var sx = fromPoint.x;
      var sy = fromPoint.y;
      var tx = toPoint.x;
      var ty = toPoint.y;
      var c1x;
      var c1y;
      var c2x;
      var c2y;

      if (item.verticalDominant) {
        var side = item.direction === "down" ? 1 : -1;
        var centeredDuplicate = (item.duplicateSize > 1)
          ? (item.duplicateIndex - (item.duplicateSize - 1) * 0.5)
          : 0;
        var laneMagnitude = 28 + item.corridorIndex * laneStep + Math.abs(centeredDuplicate) * duplicateStep;
        if (svgWidth > 0) {
          var rightRoom = (svgWidth - edgeMarginX) - Math.max(sx, tx);
          var leftRoom = Math.min(sx, tx) - edgeMarginX;
          if (side > 0 && rightRoom < laneMagnitude + 6 && leftRoom > rightRoom + 10) side = -1;
          if (side < 0 && leftRoom < laneMagnitude + 6 && rightRoom > leftRoom + 10) side = 1;
        }
        var farX = side > 0 ? Math.max(sx, tx) : Math.min(sx, tx);
        var channelX = farX + side * laneMagnitude;
        if (svgWidth > 0) {
          channelX = Math.max(edgeMarginX, Math.min(svgWidth - edgeMarginX, channelX));
        }

        var spanY = Math.abs(ty - sy);
        var bendY = Math.max(22, Math.min(150, spanY * 0.28));
        var signY = ty >= sy ? 1 : -1;
        var pull = 0.8;
        c1x = sx + (channelX - sx) * pull;
        c2x = tx + (channelX - tx) * pull;
        c1y = sy + signY * bendY;
        c2y = ty - signY * bendY;
      } else {
        var sideY = item.direction === "right" ? -1 : 1;
        var centeredDup = (item.duplicateSize > 1)
          ? (item.duplicateIndex - (item.duplicateSize - 1) * 0.5)
          : 0;
        var laneOffsetY = 24 + item.corridorIndex * laneStep + Math.abs(centeredDup) * duplicateStep;
        if (svgHeight > 0) {
          var bottomRoom = (svgHeight - edgeMarginY) - Math.max(sy, ty);
          var topRoom = Math.min(sy, ty) - edgeMarginY;
          if (sideY > 0 && bottomRoom < laneOffsetY + 6 && topRoom > bottomRoom + 10) sideY = -1;
          if (sideY < 0 && topRoom < laneOffsetY + 6 && bottomRoom > topRoom + 10) sideY = 1;
        }
        var farY = sideY > 0 ? Math.max(sy, ty) : Math.min(sy, ty);
        var channelY = farY + sideY * laneOffsetY;
        if (svgHeight > 0) {
          channelY = Math.max(edgeMarginY, Math.min(svgHeight - edgeMarginY, channelY));
        }

        var spanX = Math.abs(tx - sx);
        var bendX = Math.max(24, Math.min(160, spanX * 0.32));
        var signX = tx >= sx ? 1 : -1;
        c1x = sx + signX * bendX;
        c2x = tx - signX * bendX;
        c1y = sy + (channelY - sy) * 0.8;
        c2y = ty + (channelY - ty) * 0.8;
      }

      var d = [
        "M", sx, sy,
        "C", c1x, c1y, c2x, c2y, tx, ty
      ].join(" ");

      var tangentDx = tx - c2x;
      var tangentDy = ty - c2y;
      var tangentLen = Math.sqrt(tangentDx * tangentDx + tangentDy * tangentDy) || 1;
      var ux = tangentDx / tangentLen;
      var uy = tangentDy / tangentLen;
      var nodeInset = Math.max(8, (Number(this.options.nodeRadius) || 8) + 1);
      var tipX = tx - ux * nodeInset;
      var tipY = ty - uy * nodeInset;
      var arrowLen = Math.max(9, (Number(this.options.relationWidth) || 2) * 3.6);
      var arrowHalf = Math.max(4, (Number(this.options.relationWidth) || 2) * 1.9);
      var shaftEndX = tipX - ux * (arrowLen * 0.72);
      var shaftEndY = tipY - uy * (arrowLen * 0.72);
      d = [
        "M", sx, sy,
        "C", c1x, c1y, c2x, c2y, shaftEndX, shaftEndY
      ].join(" ");

      var relPath = svgNode("path", {
          d: d,
          fill: "none",
          stroke: color,
          "stroke-width": this.options.relationWidth,
          "stroke-dasharray": this.options.relationDash,
          "stroke-linecap": "round",
          opacity: this.options.relationOpacity
        });
      if (relationFlowEnabled) {
        relPath.setAttribute("class", "ggv-relation-flow");
        relPath.style.setProperty("--ggv-rel-flow-duration", flowDurationMs + "ms");
        relPath.style.setProperty("--ggv-rel-flow-offset", String(flowCycle * flowSign));
      }
      this.markAnimNode(relPath, relationKey + "::path", Math.max(sx, tx, c1x, c2x), "relation-path");
      group.appendChild(relPath);

      var nx = -uy;
      var ny = ux;
      var baseX = tipX - ux * arrowLen;
      var baseY = tipY - uy * arrowLen;
      var leftX = baseX + nx * arrowHalf;
      var leftY = baseY + ny * arrowHalf;
      var rightX = baseX - nx * arrowHalf;
      var rightY = baseY - ny * arrowHalf;
      var relHead = svgNode("polygon", {
          points: [tipX, tipY, leftX, leftY, rightX, rightY].join(" "),
          fill: color,
          opacity: this.options.relationOpacity
        });
      this.markAnimNode(relHead, relationKey + "::arrow", Math.max(sx, tx), "relation");
      group.appendChild(relHead);

      if (relation.label) {
        var label = String(relation.label);
        var lw = Math.max(40, 12 + label.length * 6.3);
        var lh = 16;
        var t = 0.5;
        var mt = 1 - t;
        var baseX = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * tx;
        var baseY = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ty;
        var ldx = tx - sx;
        var ldy = ty - sy;
        var llen = Math.sqrt(ldx * ldx + ldy * ldy) || 1;
        var labelNx = -ldy / llen;
        var labelNy = ldx / llen;
        var centered = (item.duplicateSize > 1)
          ? (item.duplicateIndex - (item.duplicateSize - 1) * 0.5)
          : 0;
        var labelLift = centered * Math.max(4, spread * 0.35);
        var lx = baseX + labelNx * labelLift;
        var ly = baseY - 8 + labelNy * labelLift;
        var rect = {
          left: lx - lw / 2,
          right: lx + lw / 2,
          top: ly - 12,
          bottom: ly - 12 + lh
        };
        var attempt = 0;
        var maxAttempt = 16;
        var baseStep = 12;
        while (attempt < maxAttempt && occupiedLabelRects.some(function (other) { return overlaps(rect, other, 4); })) {
          var ring = Math.floor(attempt / 2) + 1;
          var dir = attempt % 2 === 0 ? -1 : 1;
          var shiftY = dir * ring * baseStep;
          var shiftX = labelNx * ring * 2;
          rect = {
            left: lx - lw / 2 + shiftX,
            right: lx + lw / 2 + shiftX,
            top: ly - 12 + shiftY,
            bottom: ly - 12 + lh + shiftY
          };
          attempt += 1;
        }

        if (svgWidth > 0) {
          if (rect.left < 4) {
            var shiftRight = 4 - rect.left;
            rect.left += shiftRight;
            rect.right += shiftRight;
          } else if (rect.right > svgWidth - 4) {
            var shiftLeft = (svgWidth - 4) - rect.right;
            rect.left += shiftLeft;
            rect.right += shiftLeft;
          }
        }
        if (svgHeight > 0) {
          if (rect.top < 4) {
            var down = 4 - rect.top;
            rect.top += down;
            rect.bottom += down;
          } else if (rect.bottom > svgHeight - 4) {
            var up = (svgHeight - 4) - rect.bottom;
            rect.top += up;
            rect.bottom += up;
          }
        }
        occupiedLabelRects.push(rect);
        lx = (rect.left + rect.right) * 0.5;
        ly = rect.top + 12;

        var labelRect = svgNode("rect", {
            x: rect.left,
            y: rect.top,
            width: lw,
            height: lh,
            rx: 8,
            fill: "#ffffff",
            stroke: color,
            "stroke-width": 1,
            opacity: 0.92
          });
        this.markAnimNode(labelRect, relationKey + "::label-bg", Math.max(sx, tx), "relation");
        group.appendChild(labelRect);

        var labelText = svgNode("text", {
            x: lx,
            y: ly,
            fill: color,
            "font-size": 10,
            "font-weight": 700,
            "text-anchor": "middle"
          }, label);
        this.markAnimNode(labelText, relationKey + "::label-text", Math.max(sx, tx), "relation");
        group.appendChild(labelText);
      }
    }, this);

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawLaneGuides = function (svg, width) {
    var group = svgNode("g");
    var laneCount = laneCountOfModel(this.model);
    var padding = this.layoutPadding || this.options.padding;

    for (var lane = 0; lane < laneCount; lane += 1) {
      var y = this.laneY(lane);
      group.appendChild(
        svgNode("line", {
          x1: padding.left - 16,
          y1: y,
          x2: width - padding.right + 16,
          y2: y,
          stroke: this.options.laneColor,
          "stroke-width": this.options.laneWidth,
          "stroke-dasharray": "6 8"
        })
      );
    }

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawEdges = function (svg, routes) {
    var group = svgNode("g");
    var repoContext = this.activeRepoContext;
    var repoId = repoContext ? (repoContext.id || repoContext.name || "_repo_") : "_single_";

    routes.forEach(function (route) {
      var edgeBaseKey = "edge::" + repoId + "::" + String(route.fromCommitId || "") + "->" + String(route.toCommitId || "");
      if (route.kind === "straight") {
        var straight = svgNode("line", {
            x1: route.fromX - this.options.nodeRadius,
            y1: route.fromY,
            x2: route.toX + this.options.nodeRadius,
            y2: route.toY,
            stroke: route.color,
            "stroke-width": this.options.edgeWidth,
            "stroke-linecap": "round",
            opacity: 0.9
          });
        this.markAnimNode(straight, edgeBaseKey + "::line", Math.max(route.fromX, route.toX), "edge");
        group.appendChild(straight);
        return;
      }

      var startX = route.fromX - this.options.nodeRadius;
      var endX = route.toX + this.options.nodeRadius;
      var span = Math.max(24, startX - endX);
      var baseHandle = Math.max(22, Math.min(320, span));
      var shiftBudget = Math.max(0, route.maxChannelX - route.minChannelX);
      var normalized = shiftBudget > 0
        ? (route.maxChannelX - route.channelX) / shiftBudget
        : 0;
      var extraShift = normalized * Math.max(8, this.options.routeSpacing * 0.9);

      var c1x = startX - baseHandle - extraShift * 0.6;
      var c2x = endX + baseHandle - extraShift;

      if (c2x > c1x - 8) {
        var pivot = startX + (endX - startX) * 0.5 - extraShift * 0.5;
        c1x = pivot + 4;
        c2x = pivot - 4;
      }

      var d = [
        "M", startX, route.fromY,
        "C", c1x, route.fromY, c2x, route.toY, endX, route.toY
      ].join(" ");

      var curved = svgNode("path", {
          d: d,
          fill: "none",
          stroke: route.color,
          "stroke-width": this.options.edgeWidth,
          "stroke-linejoin": "round",
          "stroke-linecap": "round",
          opacity: 0.9
        });
      this.markAnimNode(curved, edgeBaseKey + "::path", Math.max(route.fromX, route.toX), "edge");
      group.appendChild(curved);
    }, this);

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawCommits = function (svg) {
    var group = svgNode("g");
    var repoContext = this.activeRepoContext;
    var repoId = repoContext ? (repoContext.id || repoContext.name || "_repo_") : "_single_";
    var repoName = repoContext ? (repoContext.name || repoId) : "";

    this.model.commits.forEach(function (commit) {
      var x = this.commitX(commit);
      var y = this.laneY(commit.lane);
      var isCurrent = commit.id === this.model.currentCommit;
      var key = this.commitKey(repoId, commit.id);
      var selected = this.selectedCommitKey === key;
      var node = svgNode("g");
      this.markAnimNode(node, "commit::" + key, x, "commit");

      this.visibleCommitMap.set(key, {
        key: key,
        commit: commit,
        repoId: repoId,
        repoName: repoName
      });

      if (isCurrent) {
        node.appendChild(
          svgNode("circle", {
            cx: x,
            cy: y,
            r: this.options.nodeRadius + 7,
            fill: "none",
            stroke: "#111827",
            "stroke-width": 2,
            opacity: 0.18
          })
        );
      }

      if (selected) {
        node.appendChild(
          svgNode("circle", {
            cx: x,
            cy: y,
            r: this.options.nodeRadius + 11,
            fill: "none",
            stroke: commit.color,
            "stroke-width": 2,
            opacity: 0.35
          })
        );
      }

      node.appendChild(
        svgNode("circle", {
          cx: x,
          cy: y,
          r: this.options.nodeRadius + 2,
          fill: "#ffffff",
          stroke: commit.color,
          "stroke-width": 2
        })
      );

      node.appendChild(
        svgNode("circle", {
          cx: x,
          cy: y,
          r: this.options.nodeRadius - 2,
          fill: commit.color,
          stroke: "#ffffff",
          "stroke-width": 1.5
        })
      );

      if (this.isInspectorEnabled()) {
        var hit = svgNode("circle", {
          cx: x,
          cy: y,
          r: this.options.nodeRadius + 12,
          fill: "transparent",
          "pointer-events": "all",
          class: "ggv-commit-hit",
          tabindex: 0,
          role: "button",
          "aria-label": this.messages.commitLabel + ": " + (commit.name || commit.id),
          "aria-pressed": selected ? "true" : "false",
          "data-selection-key": key
        });
        hit.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.currentTarget.dispatchEvent(new global.MouseEvent("click", { bubbles: true }));
        });
        hit.addEventListener("click", function (selectionKey, event) {
          event.stopPropagation();
          this.selectedFilePath = null;
          this.selectCommit(selectionKey);
        }.bind(this, key));
        node.appendChild(hit);
      }

      this.commitNodeByKey.set(key, node);
      group.appendChild(node);
    }, this);

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawBranchLaneLabels = function (svg) {
    if (!this.model.branches.length) return;

    var group = svgNode("g");
    var padding = this.layoutPadding || this.options.padding;
    var repoContext = this.activeRepoContext;
    var repoKey = repoContext ? (repoContext.id || repoContext.name || "_repo_") : "_single_";
    var remoteTextOpacity = Math.max(0.55, Math.min(0.98, Number(this.options.remoteBranchOpacity) || 0.82));
    var byLane = new Map();
    this.model.branches.forEach(function (branch) {
      if (!Object.prototype.hasOwnProperty.call(this.model.branchHeads, branch.name)) return;
      var laneKey = String(branch.laneIndex);
      if (!byLane.has(laneKey)) byLane.set(laneKey, []);
      byLane.get(laneKey).push(branch);
    }, this);

    byLane.forEach(function (laneBranches, laneKey) {
      laneBranches.sort(function (a, b) {
        if (!!a.isRemote !== !!b.isRemote) return a.isRemote ? 1 : -1;
        return a.name.localeCompare(b.name);
      });

      var y = this.laneY(Number(laneKey));
      var cursorRight = padding.left - 18;

      laneBranches.forEach(function (branch) {
        var width = branchBadgeWidth(branch.name);
        var x = cursorRight - width;
        var node = svgNode("g");
        node.appendChild(
          svgNode("rect", {
            x: x,
            y: y - 11,
            width: width,
            height: 22,
            rx: 11,
            fill: branch.color,
            opacity: branch.isRemote ? 0.14 : 0.16,
            stroke: branch.color,
            "stroke-width": 1
          })
        );

        node.appendChild(
          svgNode("text", {
            x: x + width / 2,
            y: y + 4,
            fill: branch.color,
            opacity: branch.isRemote ? remoteTextOpacity : 1,
            "font-size": 11,
            "font-weight": 700,
            "text-anchor": "middle"
          }, branch.name)
        );

        this.registerTrackedNode(
          node,
          "branch-lane::" + repoKey + "::" + branch.name,
          x + width / 2,
          y
        );
        group.appendChild(node);
        cursorRight = x - 8;
      }, this);

    }, this);

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawMetadataLabels = function (svg) {
    var group = svgNode("g");
    var branchHeads = this.model.branchHeads;
    var branchByName = this.model.branchByName || new Map();
    var headNames = Object.keys(branchHeads);
    var nameTracksByLane = new Map();
    var repoContext = this.activeRepoContext;
    var repoKey = repoContext ? (repoContext.id || repoContext.name || "_repo_") : "_single_";
    var remoteTextOpacity = Math.max(0.55, Math.min(0.98, Number(this.options.remoteBranchOpacity) || 0.82));

    this.model.commits.forEach(function (commit) {
      var x = this.commitX(commit);
      var y = this.laneY(commit.lane);
      var branchesAtCommit = headNames.filter(function (name) {
        return branchHeads[name] === commit.id;
      });
      if (this.model.currentHeadBranch) {
        branchesAtCommit.sort(function (a, b) {
          if (a === b) return 0;
          if (a === this.model.currentHeadBranch) return -1;
          if (b === this.model.currentHeadBranch) return 1;
          return a.localeCompare(b);
        }.bind(this));
      }

      var commitNameY = null;
      if (this.options.showCommitNames && commit.name) {
        var commitLabel = compact(commit.name, this.options.maxCommitLabelLength);
        var labelWidth = Math.max(24, commitLabel.length * 6.6);
        var labelLeft = x - labelWidth * 0.5;
        var labelRight = x + labelWidth * 0.5;
        var baseY = y - 16;
        var laneKey = String(commit.lane);
        if (!nameTracksByLane.has(laneKey)) nameTracksByLane.set(laneKey, []);
        var laneTracks = nameTracksByLane.get(laneKey);
        var maxTracks = Math.max(1, Number(this.options.maxCommitLabelTracks) || 1);
        var trackIndex = 0;

        while (trackIndex < laneTracks.length && labelLeft <= laneTracks[trackIndex] + 8) {
          trackIndex += 1;
        }
        if (trackIndex >= maxTracks) trackIndex = maxTracks - 1;
        var previousRight = laneTracks[trackIndex] || -Infinity;
        laneTracks[trackIndex] = Math.max(previousRight, labelRight);
        commitNameY = baseY - trackIndex * 11;

        group.appendChild(
          svgNode("text", {
            x: x,
            y: commitNameY,
            fill: this.options.textColor,
            "font-size": 11,
            "font-weight": 600,
            "text-anchor": "middle"
          }, commitLabel)
        );
      }

      if (this.options.showHeadLabels) {
        var firstHeadTop = commitNameY !== null ? (commitNameY - 32) : (y - 38);
        var drawHeadLabel = function (branchName, yPos) {
          var branchMeta = branchByName.get(branchName);
          var isCurrentHead = this.model.currentHeadBranch && this.model.currentHeadBranch === branchName;
          var text = isCurrentHead ? ("HEAD · " + branchName) : branchName;
          var w = Math.max(40, 14 + text.length * 7);
          var node = svgNode("g");
          if (isCurrentHead) {
            node.appendChild(
              svgNode("rect", {
                x: x - w / 2,
                y: yPos,
                width: w,
                height: 18,
                rx: 9,
                fill: "#111827",
                opacity: 0.9
              })
            );

            node.appendChild(
              svgNode("text", {
                x: x,
                y: yPos + 13,
                fill: "#ffffff",
                "font-size": 10,
                "font-weight": 700,
                "text-anchor": "middle"
              }, text)
            );
          } else {
            var labelColor = branchMeta ? branchMeta.color : "#374151";
            var labelOpacity = branchMeta && branchMeta.isRemote ? 0.15 : 0.18;
            node.appendChild(
              svgNode("rect", {
                x: x - w / 2,
                y: yPos,
                width: w,
                height: 18,
                rx: 9,
                fill: labelColor,
                stroke: labelColor,
                "stroke-width": 1,
                opacity: labelOpacity
              })
            );

            node.appendChild(
              svgNode("text", {
                x: x,
                y: yPos + 13,
                fill: labelColor,
                opacity: branchMeta && branchMeta.isRemote ? remoteTextOpacity : 1,
                "font-size": 10,
                "font-weight": 700,
                "text-anchor": "middle"
              }, text)
            );
          }

          this.registerTrackedNode(
            node,
            "head-label::" + repoKey + "::" + branchName,
            x,
            yPos + 9
          );
          group.appendChild(node);
        }.bind(this);

        branchesAtCommit.forEach(function (branchName, branchIndex) {
          var yPos = firstHeadTop - branchIndex * 20;
          drawHeadLabel(branchName, yPos);
        }, this);
      }

      if (this.options.showTags && commit.tags.length) {
        var tagY = y + 14;
        commit.tags.forEach(function (tag, tagIndex) {
          var tagText = String(tag);
          var tw = Math.max(34, 12 + tagText.length * 7);
          var tx = x + 10 + tagIndex * (tw + 6);

          group.appendChild(
            svgNode("rect", {
              x: tx,
              y: tagY,
              width: tw,
              height: 18,
              rx: 9,
              fill: "#111827",
              opacity: 0.1,
              stroke: "#111827",
              "stroke-width": 1
            })
          );

          group.appendChild(
            svgNode("text", {
              x: tx + tw / 2,
              y: tagY + 13,
              fill: this.options.mutedTextColor,
              "font-size": 10,
              "font-weight": 700,
              "text-anchor": "middle"
            }, tagText)
          );
        }, this);
      }

      if (this.options.showCommitHashes) {
        var hashY = y + (this.options.showTags && commit.tags.length ? 44 : 28);
        group.appendChild(
          svgNode("text", {
            x: x,
            y: hashY,
            fill: this.options.mutedTextColor,
            "font-size": 10,
            "font-weight": 500,
            "text-anchor": "middle"
          }, shortHash(commit.id))
        );
      }
    }, this);

    svg.appendChild(group);
  };

  GitGraphVisualizer.prototype.drawHoverTimeGuide = function (svg, width, height) {
    var points = this.model.commits.map(function (commit) {
      return { x: this.commitX(commit) };
    }, this);
    this.drawHoverTimeGuideByPoints(svg, width, height, points, this.options.hoverGuideColor);
  };

  GitGraphVisualizer.prototype.drawHoverTimeGuideByPoints = function (svg, width, height, points, guideColor) {
    if (!Array.isArray(points) || !points.length) return;

    var xs = points
      .map(function (point) { return Number(point.x); })
      .filter(function (x) { return Number.isFinite(x); })
      .sort(function (a, b) { return a - b; });

    if (!xs.length) return;

    var uniqueXs = [];
    xs.forEach(function (x) {
      if (!uniqueXs.length || Math.abs(uniqueXs[uniqueXs.length - 1] - x) > 0.5) {
        uniqueXs.push(x);
      }
    });

    var line = svgNode("line", {
      x1: 0,
      y1: 6,
      x2: 0,
      y2: height - 6,
      stroke: guideColor || this.options.hoverGuideColor,
      "stroke-width": 1.5,
      "stroke-dasharray": "6 6",
      opacity: 0.9,
      visibility: "hidden",
      "pointer-events": "none"
    });

    svg.appendChild(line);

    var nearestX = function (targetX) {
      if (!uniqueXs.length) return null;
      var best = uniqueXs[0];
      var bestDist = Math.abs(best - targetX);
      for (var i = 1; i < uniqueXs.length; i += 1) {
        var dist = Math.abs(uniqueXs[i] - targetX);
        if (dist < bestDist) {
          best = uniqueXs[i];
          bestDist = dist;
        }
      }
      return best;
    };

    var updateGuide = function (event) {
      var rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      var px = (event.clientX - rect.left) * (width / rect.width);
      var x = nearestX(px);
      if (!Number.isFinite(x)) return;
      line.setAttribute("x1", String(x));
      line.setAttribute("x2", String(x));
      line.setAttribute("visibility", "visible");
    };

    svg.addEventListener("mousemove", updateGuide);
    svg.addEventListener("mouseenter", updateGuide);
    svg.addEventListener("mouseleave", function () {
      line.setAttribute("visibility", "hidden");
    });
  };

  GitGraphVisualizer.prototype.destroy = function () {
    this.clearStageMode();
    if (this.motionQuery && this.motionQuery.removeEventListener) {
      this.motionQuery.removeEventListener("change", this.motionChangeHandler);
    }
    this.container.replaceChildren();
    this.uiRefs = null;
    this.model = null;
    this.multiModel = null;
  };

  global.GitGraphVisualizer = GitGraphVisualizer;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { GitGraphVisualizer: GitGraphVisualizer };
  }
})(typeof window !== "undefined" ? window : globalThis);
