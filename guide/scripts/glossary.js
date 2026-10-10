(function () {
  "use strict";

  var pageOrder = {
    "index.html": 0,
    "chapter-1.html": 1,
    "chapter-2.html": 2,
    "chapter-3.html": 3,
    "chapter-4.html": 4,
    "chapter-5.html": 5,
    "chapter-6.html": 6,
    "extra-1.html": 7,
    "extra-2.html": 8,
    "extra-3.html": 9,
    "extra-4.html": 10
  };

  function currentLanguage() {
    var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.indexOf("ja") === 0 ? "ja" : "ko";
  }

  var glossaryByLanguage = {
    ko: [
      {
        id: "local-repo",
        order: 1,
        href: "./chapter-1.html",
        title: "로컬 기록 저장소",
        summary: "내 컴퓨터 안에 있는 Git 기록 저장소입니다. 실제 작업 파일과 .git 폴더가 함께 있습니다.",
        linkText: "1장에서 자세히 보기",
        aliases: ["로컬 레포지토리", "로컬 기록 저장소"]
      },
      {
        id: "remote-repo",
        order: 1,
        href: "./chapter-1.html",
        title: "리모트 기록 저장소",
        summary: "GitHub 같은 서비스 쪽에 있는 기록 저장소입니다. 로컬과 자동으로 항상 같아지지는 않습니다.",
        linkText: "1장에서 자세히 보기",
        aliases: ["리모트 레포지토리", "리모트 기록 저장소"]
      },
      {
        id: "repo",
        order: 1,
        href: "./chapter-1.html",
        title: "기록 저장소",
        summary: "작업 기록과 변경 이력을 보관하는 Git의 기본 단위입니다.",
        linkText: "1장에서 자세히 보기",
        aliases: ["기록 저장소", "레포지토리"]
      },
      {
        id: "history",
        order: 2,
        href: "./chapter-2.html",
        title: "히스토리",
        summary: "작업이 시간 순서대로 어떻게 바뀌었는지 남아 있는 기록입니다.",
        linkText: "2장에서 자세히 보기",
        aliases: ["히스토리"]
      },
      {
        id: "line",
        order: 2,
        href: "./chapter-2.html",
        title: "라인",
        summary: "텍스트 파일에서 Git이 변화 지점을 비교할 때 자주 쓰는 줄 단위입니다.",
        linkText: "2장에서 자세히 보기",
        aliases: ["라인"]
      },
      {
        id: "head",
        order: 3,
        href: "./chapter-3.html",
        title: "HEAD",
        summary: "지금 내가 어느 브렌치 끝에서 작업 중인지 가리키는 표식입니다.",
        linkText: "3장에서 자세히 보기",
        aliases: ["HEAD"]
      },
      {
        id: "branch",
        order: 3,
        href: "./chapter-3.html",
        title: "브렌치",
        summary: "작업 흐름을 갈라서 따로 진행할 수 있게 해 주는 길 표시입니다.",
        linkText: "3장에서 자세히 보기",
        aliases: ["브렌치"]
      },
      {
        id: "checkout",
        order: 3,
        href: "./chapter-3.html",
        title: "Checkout",
        summary: "지금 작업할 브렌치나 기준 지점을 바꾸는 행동입니다.",
        linkText: "3장에서 자세히 보기",
        aliases: ["Checkout", "checkout"]
      },
      {
        id: "commit",
        order: 4,
        href: "./chapter-4.html",
        title: "커밋",
        summary: "의미 있는 작업 묶음을 기록 저장소에 저장한 한 단위입니다.",
        linkText: "4장에서 자세히 보기",
        aliases: ["커밋", "Commit"]
      },
      {
        id: "push",
        order: 4,
        href: "./chapter-4.html",
        title: "Push",
        summary: "내 로컬 커밋을 리모트 기록 저장소로 올리는 행동입니다.",
        linkText: "4장에서 자세히 보기",
        aliases: ["Push", "푸쉬", "푸시"]
      },
      {
        id: "fetch",
        order: 4,
        href: "./chapter-4.html",
        title: "Fetch",
        summary: "리모트 최신 기록을 로컬의 추적 브렌치로 가져오되, 현재 작업 위치는 바꾸지 않는 동작입니다.",
        linkText: "4장에서 자세히 보기",
        aliases: ["Fetch", "페치"]
      },
      {
        id: "merge",
        order: 5,
        href: "./chapter-5.html",
        title: "Merge",
        summary: "갈라져 있던 작업 흐름을 다시 하나로 합치는 과정입니다.",
        linkText: "5장에서 자세히 보기",
        aliases: ["Merge", "머지"]
      },
      {
        id: "pull",
        order: 5,
        href: "./chapter-5.html",
        title: "Pull",
        summary: "리모트 기록을 받아와 현재 브렌치에 반영하는 흐름입니다. 보통 Fetch와 Merge가 이어집니다.",
        linkText: "5장에서 자세히 보기",
        aliases: ["Pull", "풀"]
      },
      {
        id: "conflict",
        order: 5,
        href: "./chapter-5.html",
        title: "컨플릭트",
        summary: "같은 부분을 서로 다르게 바꿔서 Git이 자동으로 하나로 정하지 못하는 상태입니다.",
        linkText: "5장에서 자세히 보기",
        aliases: ["컨플릭트", "conflict", "Conflict"]
      },
      {
        id: "pr",
        order: 6,
        href: "./chapter-6.html",
        title: "Pull Request (PR)",
        summary: "내 브렌치 작업을 기준 브렌치에 합쳐도 되는지 팀에 검토를 요청하는 단계입니다.",
        linkText: "6장에서 자세히 보기",
        aliases: ["Pull Request", "PR"]
      }
    ],
    ja: [
      {
        id: "local-repo",
        order: 1,
        href: "./chapter-1.html",
        title: "ローカル記録保存先",
        summary: "自分のPCの中にある Git の記録保存先です。実作業ファイルと .git フォルダが一緒にあります。",
        linkText: "第1章で詳しく見る",
        aliases: ["ローカルリポジトリ", "ローカル記録保存先"]
      },
      {
        id: "remote-repo",
        order: 1,
        href: "./chapter-1.html",
        title: "リモート記録保存先",
        summary: "GitHub のようなサービス側にある記録保存先です。ローカルと自動で常に同じにはなりません。",
        linkText: "第1章で詳しく見る",
        aliases: ["リモートリポジトリ", "リモート記録保存先"]
      },
      {
        id: "repo",
        order: 1,
        href: "./chapter-1.html",
        title: "記録保存先",
        summary: "作業記録と変更履歴を保管する Git の基本単位です。",
        linkText: "第1章で詳しく見る",
        aliases: ["記録保存先", "リポジトリ"]
      },
      {
        id: "history",
        order: 2,
        href: "./chapter-2.html",
        title: "履歴",
        summary: "作業が時間順にどう変わってきたかを残した記録です。",
        linkText: "第2章で詳しく見る",
        aliases: ["履歴"]
      },
      {
        id: "line",
        order: 2,
        href: "./chapter-2.html",
        title: "行",
        summary: "テキストファイルで Git が差分を見るときによく使う、1行単位の区切りです。",
        linkText: "第2章で詳しく見る",
        aliases: ["行単位", "ライン"]
      },
      {
        id: "head",
        order: 3,
        href: "./chapter-3.html",
        title: "HEAD",
        summary: "いま自分がどのブランチの先端で作業しているかを示す印です。",
        linkText: "第3章で詳しく見る",
        aliases: ["HEAD"]
      },
      {
        id: "branch",
        order: 3,
        href: "./chapter-3.html",
        title: "ブランチ",
        summary: "作業の流れを分けて別々に進められるようにする道筋の印です。",
        linkText: "第3章で詳しく見る",
        aliases: ["ブランチ"]
      },
      {
        id: "checkout",
        order: 3,
        href: "./chapter-3.html",
        title: "Checkout",
        summary: "いま作業するブランチや基準位置を切り替える動きです。",
        linkText: "第3章で詳しく見る",
        aliases: ["Checkout", "checkout"]
      },
      {
        id: "commit",
        order: 4,
        href: "./chapter-4.html",
        title: "コミット",
        summary: "意味のある作業のまとまりを記録保存先に残した1単位です。",
        linkText: "第4章で詳しく見る",
        aliases: ["コミット", "Commit"]
      },
      {
        id: "push",
        order: 4,
        href: "./chapter-4.html",
        title: "Push",
        summary: "自分のローカルコミットをリモート記録保存先へ送る動きです。",
        linkText: "第4章で詳しく見る",
        aliases: ["Push", "プッシュ"]
      },
      {
        id: "fetch",
        order: 4,
        href: "./chapter-4.html",
        title: "Fetch",
        summary: "リモートの最新記録をローカルの追跡ブランチに取り込みつつ、現在の作業位置は変えない動きです。",
        linkText: "第4章で詳しく見る",
        aliases: ["Fetch", "フェッチ"]
      },
      {
        id: "merge",
        order: 5,
        href: "./chapter-5.html",
        title: "Merge",
        summary: "分かれていた作業の流れをもう一度ひとつにまとめる工程です。",
        linkText: "第5章で詳しく見る",
        aliases: ["Merge", "マージ"]
      },
      {
        id: "pull",
        order: 5,
        href: "./chapter-5.html",
        title: "Pull",
        summary: "リモート記録を受け取って現在のブランチに反映する流れです。通常は Fetch と Merge が続きます。",
        linkText: "第5章で詳しく見る",
        aliases: ["Pull", "プル"]
      },
      {
        id: "conflict",
        order: 5,
        href: "./chapter-5.html",
        title: "コンフリクト",
        summary: "同じ場所を別々の内容に変えたため、Git が自動でひとつに決められない状態です。",
        linkText: "第5章で詳しく見る",
        aliases: ["コンフリクト", "conflict", "Conflict"]
      },
      {
        id: "pr",
        order: 6,
        href: "./chapter-6.html",
        title: "Pull Request (PR)",
        summary: "自分のブランチ作業を基準ブランチに取り込んでよいか、チームにレビューを依頼する段階です。",
        linkText: "第6章で詳しく見る",
        aliases: ["Pull Request", "PR"]
      }
    ]
  };

  var uiText = {
    ko: {
      tooltipAriaSuffix: " 설명"
    },
    ja: {
      tooltipAriaSuffix: " の説明"
    }
  };

  var glossary = glossaryByLanguage[currentLanguage()] || glossaryByLanguage.ko;
  var localeText = uiText[currentLanguage()] || uiText.ko;

  var activeTooltipState = null;
  var pointerPosition = { x: 0, y: 0 };
  var tooltipGap = 10;
  var tooltipViewportMargin = 12;
  var tooltipCloseDelay = 180;
  var closeTimer = null;
  var termCounter = 0;

  function currentPageName() {
    var path = window.location.pathname || "";
    var segments = path.split("/");
    return segments[segments.length - 1] || "index.html";
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function collectEligibleAliases(currentOrder) {
    var aliasMap = {};
    glossary.forEach(function (entry) {
      if (currentOrder <= entry.order) return;
      entry.aliases.forEach(function (alias) {
        aliasMap[alias] = entry;
      });
    });

    return Object.keys(aliasMap)
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (alias) {
        return {
          alias: alias,
          entry: aliasMap[alias]
        };
      });
  }

  function isTextNodeEligible(node) {
    if (!node || !node.parentNode || !node.nodeValue || !node.nodeValue.trim()) return false;
    var parent = node.parentNode;
    if (!(parent instanceof Element)) return false;

    if (
      parent.closest(
        "script, style, a, code, svg, .graph-frame, .code-sample, .merge-window, .term-ref, .topbar, .top-links"
      )
    ) {
      return false;
    }

    return !!parent.closest(".doc p, .doc li");
  }

  function buildTermRef(alias, entry) {
    var wrapper = document.createElement("span");
    wrapper.className = "term-ref";

    var label = document.createElement("span");
    label.className = "term-label";
    label.textContent = alias;
    label.tabIndex = 0;
    label.setAttribute("role", "button");
    label.setAttribute("aria-expanded", "false");
    label.setAttribute("aria-label", entry.title + localeText.tooltipAriaSuffix);

    var tooltip = document.createElement("span");
    tooltip.className = "term-tooltip";
    tooltip.id = "term-popup-" + (++termCounter);
    tooltip.hidden = true;
    tooltip.setAttribute("role", "region");
    tooltip.setAttribute("aria-label", entry.title);
    label.setAttribute("aria-controls", tooltip.id);

    var title = document.createElement("strong");
    title.textContent = entry.title;

    var body = document.createElement("span");
    body.textContent = entry.summary;
    body.id = tooltip.id + "-description";
    label.setAttribute("aria-describedby", body.id);

    var link = document.createElement("a");
    link.href = entry.href;
    link.textContent = entry.linkText;

    tooltip.appendChild(title);
    tooltip.appendChild(body);
    tooltip.appendChild(link);

    wrapper.appendChild(label);
    wrapper.appendChild(tooltip);
    return wrapper;
  }

  function pointInRect(point, rect, padding) {
    var pad = padding || 0;
    return (
      point.x >= rect.left - pad &&
      point.x <= rect.right + pad &&
      point.y >= rect.top - pad &&
      point.y <= rect.bottom + pad
    );
  }

  function triangleArea(a, b, c) {
    return Math.abs(
      (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2
    );
  }

  function pointInTriangle(point, a, b, c) {
    var full = triangleArea(a, b, c);
    var t1 = triangleArea(point, b, c);
    var t2 = triangleArea(a, point, c);
    var t3 = triangleArea(a, b, point);
    return Math.abs(full - (t1 + t2 + t3)) < 0.8;
  }

  function pointInsideSafeTriangle(point, triangle) {
    if (!triangle) return false;
    return pointInTriangle(point, triangle.a, triangle.b, triangle.c);
  }

  function cancelScheduledClose() {
    if (!closeTimer) return;
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  function scheduleTooltipClose() {
    cancelScheduledClose();
    closeTimer = window.setTimeout(function () {
      closeActiveTooltip();
    }, tooltipCloseDelay);
  }

  function getTooltipPlacement(triggerRect, tooltipRect) {
    var preferredTop = triggerRect.bottom + tooltipGap;
    var fitsBelow =
      preferredTop + tooltipRect.height <= window.innerHeight - tooltipViewportMargin;

    if (fitsBelow || triggerRect.top < tooltipRect.height + tooltipGap + tooltipViewportMargin) {
      return "bottom";
    }

    return "top";
  }

  function positionTooltip(wrapper) {
    if (!wrapper) return null;

    var tooltip = wrapper.querySelector(".term-tooltip");
    if (!tooltip) return null;

    var triggerRect = wrapper.getBoundingClientRect();
    var tooltipRect = tooltip.getBoundingClientRect();
    var placement = getTooltipPlacement(triggerRect, tooltipRect);
    var width = tooltipRect.width;
    var height = tooltipRect.height;
    var left = clamp(
      triggerRect.left + triggerRect.width / 2 - width / 2,
      tooltipViewportMargin,
      window.innerWidth - width - tooltipViewportMargin
    );
    var top = clamp(
      placement === "bottom" ? triggerRect.bottom + tooltipGap : triggerRect.top - height - tooltipGap,
      tooltipViewportMargin,
      Math.max(tooltipViewportMargin, window.innerHeight - height - tooltipViewportMargin)
    );
    var arrowLeft = clamp(
      triggerRect.left + triggerRect.width / 2 - left,
      16,
      width - 16
    );

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.style.setProperty("--tooltip-arrow-left", arrowLeft + "px");
    tooltip.setAttribute("data-placement", placement);

    tooltipRect = tooltip.getBoundingClientRect();

    if (activeTooltipState && activeTooltipState.wrapper === wrapper) {
      activeTooltipState.triggerRect = triggerRect;
      activeTooltipState.tooltipRect = tooltipRect;
    }

    return {
      triggerRect: triggerRect,
      tooltipRect: tooltipRect,
      placement: placement
    };
  }

  function clearTooltipState(wrapper) {
    if (!wrapper) return;
    wrapper.classList.remove("is-open");
    wrapper.querySelector(".term-label").setAttribute("aria-expanded", "false");
    var tooltip = wrapper.querySelector(".term-tooltip");
    if (!tooltip) return;
    tooltip.hidden = true;
    tooltip.style.left = "";
    tooltip.style.top = "";
    tooltip.style.removeProperty("--tooltip-arrow-left");
    tooltip.removeAttribute("data-placement");
    tooltip.style.visibility = "";
  }

  function closeActiveTooltip() {
    cancelScheduledClose();
    if (!activeTooltipState) return;
    clearTooltipState(activeTooltipState.wrapper);
    activeTooltipState = null;
  }

  function openTooltip(wrapper) {
    cancelScheduledClose();
    if (!wrapper) return;
    if (activeTooltipState && activeTooltipState.wrapper !== wrapper) {
      closeActiveTooltip();
    }

    var tooltip = wrapper.querySelector(".term-tooltip");
    if (!tooltip) return;

    wrapper.classList.add("is-open");
    wrapper.querySelector(".term-label").setAttribute("aria-expanded", "true");
    tooltip.hidden = false;
    tooltip.style.visibility = "hidden";

    activeTooltipState = {
      wrapper: wrapper,
      tooltip: tooltip,
      triggerRect: null,
      tooltipRect: null,
      safeTriangle: null
    };

    positionTooltip(wrapper);
    tooltip.style.visibility = "";
  }

  function updateSafeTriangle(exitPoint) {
    if (!activeTooltipState || !activeTooltipState.tooltipRect) return;

    var tooltipRect = activeTooltipState.tooltipRect;
    var placement = activeTooltipState.tooltip.getAttribute("data-placement") || "bottom";
    var y = placement === "bottom" ? tooltipRect.top : tooltipRect.bottom;
    var offset = placement === "bottom" ? -8 : 8;

    activeTooltipState.safeTriangle = {
      a: exitPoint,
      b: { x: tooltipRect.left - 12, y: y + offset },
      c: { x: tooltipRect.right + 12, y: y + offset }
    };
  }

  function isPointInsideActiveRegions(point) {
    if (!activeTooltipState) return false;
    return (
      pointInRect(point, activeTooltipState.triggerRect, 1) ||
      pointInRect(point, activeTooltipState.tooltipRect, 2)
    );
  }

  function pointInsideBridgeCorridor(point) {
    if (!activeTooltipState || !activeTooltipState.triggerRect || !activeTooltipState.tooltipRect) {
      return false;
    }

    var triggerRect = activeTooltipState.triggerRect;
    var tooltipRect = activeTooltipState.tooltipRect;
    var left = Math.min(triggerRect.left, tooltipRect.left) - 14;
    var right = Math.max(triggerRect.right, tooltipRect.right) + 14;
    var top = Math.min(triggerRect.top, tooltipRect.top) - 8;
    var bottom = Math.max(triggerRect.bottom, tooltipRect.bottom) + 8;

    return (
      point.x >= left &&
      point.x <= right &&
      point.y >= top &&
      point.y <= bottom
    );
  }

  function handlePointerMove(event) {
    pointerPosition.x = event.clientX;
    pointerPosition.y = event.clientY;

    if (!activeTooltipState) return;

    var point = pointerPosition;
    if (isPointInsideActiveRegions(point)) {
      activeTooltipState.safeTriangle = null;
      cancelScheduledClose();
      return;
    }

    if (pointInsideSafeTriangle(point, activeTooltipState.safeTriangle)) {
      cancelScheduledClose();
      return;
    }

    if (pointInsideBridgeCorridor(point)) {
      cancelScheduledClose();
      return;
    }

    scheduleTooltipClose();
  }

  function handleWrapperPointerEnter(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    openTooltip(event.currentTarget);
  }

  function handleWrapperPointerLeave(event) {
    if (!activeTooltipState || activeTooltipState.wrapper !== event.currentTarget) return;

    var related = event.relatedTarget;
    if (related && activeTooltipState.wrapper.contains(related)) {
      return;
    }

    updateSafeTriangle({
      x: event.clientX || pointerPosition.x,
      y: event.clientY || pointerPosition.y
    });
    scheduleTooltipClose();
  }

  function handleFocusIn(event) {
    openTooltip(event.currentTarget);
  }

  function handleFocusOut(event) {
    var wrapper = event.currentTarget;
    if (event.relatedTarget && wrapper.contains(event.relatedTarget)) {
      return;
    }

    if (activeTooltipState && activeTooltipState.wrapper === wrapper) {
      closeActiveTooltip();
    }
  }

  function initTooltipBehavior(root) {
    var refs = root.querySelectorAll(".term-ref");
    if (!refs.length) return;

    refs.forEach(function (wrapper) {
      wrapper.addEventListener("pointerenter", handleWrapperPointerEnter);
      wrapper.addEventListener("pointerleave", handleWrapperPointerLeave);
      wrapper.addEventListener("focusin", handleFocusIn);
      wrapper.addEventListener("focusout", handleFocusOut);
      wrapper.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        openTooltip(wrapper);
      });
      wrapper.addEventListener("keydown", function (event) {
        if (event.target !== wrapper.querySelector(".term-label") || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        if (activeTooltipState && activeTooltipState.wrapper === wrapper) closeActiveTooltip();
        else openTooltip(wrapper);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && activeTooltipState) {
        var wrapper = activeTooltipState.wrapper;
        var focusInside = wrapper.contains(document.activeElement);
        closeActiveTooltip();
        var trigger = wrapper.querySelector(".term-label");
        if (focusInside && document.activeElement !== trigger) {
          trigger.focus({ preventScroll: true });
          closeActiveTooltip();
        }
      }
    });
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", function (event) {
      if (!activeTooltipState) return;
      if (!activeTooltipState.wrapper.contains(event.target)) {
        closeActiveTooltip();
      }
    });

    window.addEventListener("resize", function () {
      if (activeTooltipState) {
        positionTooltip(activeTooltipState.wrapper);
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        if (activeTooltipState) {
          positionTooltip(activeTooltipState.wrapper);
        }
      },
      true
    );
  }

  function replaceTermsInNode(node, aliasRecords, usedEntries) {
    var text = node.nodeValue;
    if (!text) return;

    var pattern = aliasRecords.map(function (record) {
      return escapeRegExp(record.alias);
    }).join("|");
    if (!pattern) return;

    var regex = new RegExp(pattern, "g");
    if (!regex.test(text)) return;
    regex.lastIndex = 0;

    var aliasMap = {};
    aliasRecords.forEach(function (record) {
      aliasMap[record.alias] = record.entry;
    });

    var fragment = document.createDocumentFragment();
    var lastIndex = 0;
    var match;

    while ((match = regex.exec(text))) {
      var alias = match[0];
      var index = match.index;
      var entry = aliasMap[alias];

      var before = index ? text.charAt(index - 1) : "";
      var after = text.charAt(index + alias.length);
      var latinAlias = /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(alias);
      if (latinAlias && (/[A-Za-z0-9_]/.test(before) || /[A-Za-z0-9_]/.test(after))) continue;

      if (usedEntries[entry.id]) {
        continue;
      }

      if (index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
      }

      fragment.appendChild(buildTermRef(alias, entry));
      usedEntries[entry.id] = true;
      lastIndex = index + alias.length;
    }

    if (lastIndex === 0) return;

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(fragment, node);
  }

  function applyGlossary() {
    var order = pageOrder[currentPageName()] || 0;
    var aliasRecords = collectEligibleAliases(order);
    if (!aliasRecords.length) return;

    var root = document.querySelector(".doc");
    if (!root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return isTextNodeEligible(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    var targets = [];
    var usedEntries = {};
    while (walker.nextNode()) {
      targets.push(walker.currentNode);
    }

    targets.forEach(function (node) {
      replaceTermsInNode(node, aliasRecords, usedEntries);
    });

    initTooltipBehavior(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyGlossary);
  } else {
    applyGlossary();
  }
})();
