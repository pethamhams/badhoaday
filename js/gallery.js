/* ==========================================================================
   GALLERY.JS
   gallery.json を読み込み、VRC/3Dギャラリーのタイルとフィルタータブを描画する。
   ========================================================================== */

(function () {
  "use strict";

  const DATA_PATH = "data/gallery.json";

  // fetchが使えない環境(file://直開き等)向けのフォールバック。
  // gallery.json と内容は同一に保つこと。
  const FALLBACK_DATA = {
    photoCount: "100+",
    videoCount: "40+",
    totalItems: 140,
    shownItems: 12,
    items: [
      { type: "photo", image: "assets/gallery-sample-01.jpg", alt: "VRChatサンプル写真01" },
      { type: "world", image: "assets/gallery-sample-02.jpg", alt: "VRChatサンプル写真02" },
      { type: "shorts", image: "assets/gallery-sample-03.jpg", alt: "VRChatサンプル写真03" },
      { type: "video", video: true, label: "YOUTUBE VIDEO" },
      { type: "photo", image: "assets/gallery-sample-04.jpg", alt: "VRChatサンプル写真04" },
      { type: "photo", image: "assets/gallery-sample-01.jpg", alt: "VRChatサンプル写真05" },
      { type: "world", image: "assets/gallery-sample-02.jpg", alt: "VRChatサンプル写真06" },
      { type: "video", video: true, label: "YOUTUBE VIDEO" },
      { type: "photo", image: "assets/gallery-sample-03.jpg", alt: "VRChatサンプル写真07" },
      { type: "shorts", image: "assets/gallery-sample-04.jpg", alt: "VRChatサンプル写真08" },
      { type: "photo", image: "assets/gallery-sample-01.jpg", alt: "VRChatサンプル写真09" },
      { type: "world", image: "assets/gallery-sample-02.jpg", alt: "VRChatサンプル写真10" },
    ],
  };

  const FILTERS = ["all", "photo", "video", "shorts", "world"];

  let state = {
    data: null,
    activeFilter: "all",
  };

  function tileHtml(item) {
    if (item.video) {
      return `
        <div class="gallery-tile gallery-tile--video" data-type="${item.type}">
          <div class="gallery-tile-video">
            <span class="gallery-play-icon" aria-hidden="true">&#9654;</span>
            <span class="gallery-video-label">${item.label || "YOUTUBE VIDEO"}</span>
          </div>
        </div>`;
    }
    return `
      <div class="gallery-tile" data-type="${item.type}">
        <img src="${item.image}" alt="${item.alt || ""}" loading="lazy" />
      </div>`;
  }

  function render() {
    const grid = document.getElementById("gallery-grid");
    const data = state.data;
    if (!grid || !data) return;

    const items =
      state.activeFilter === "all"
        ? data.items
        : data.items.filter((it) => it.type === state.activeFilter);

    grid.innerHTML = items.length
      ? items.map(tileHtml).join("")
      : '<p class="gallery-empty">該当するアイテムがありません。</p>';

    const photoCountEl = document.getElementById("gallery-photo-count");
    const videoCountEl = document.getElementById("gallery-video-count");
    if (photoCountEl) photoCountEl.textContent = data.photoCount;
    if (videoCountEl) videoCountEl.textContent = data.videoCount;

    const shownEl = document.getElementById("gallery-shown-count");
    const totalEl = document.getElementById("gallery-total-count");
    if (shownEl) shownEl.textContent = items.length;
    if (totalEl) totalEl.textContent = data.totalItems;
  }

  function setupFilters() {
    const tabs = document.querySelectorAll(".gallery-filter-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        if (!FILTERS.includes(filter)) return;
        state.activeFilter = filter;
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        render();
      });
    });
  }

  function setupLoadMore() {
    const btn = document.getElementById("gallery-load-more");
    const arrowBtn = document.getElementById("gallery-load-more-circle");

    function handleLoadMore() {
      // TODO: 実データ連携後、ここで次ページ分のアイテムを追加読込する。
    }

    if (btn) btn.addEventListener("click", handleLoadMore);
    if (arrowBtn) arrowBtn.addEventListener("click", handleLoadMore);
  }

  function loadData() {
    fetch(DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("gallery.json not reachable");
        return res.json();
      })
      .then((data) => {
        state.data = data;
        render();
      })
      .catch(() => {
        state.data = FALLBACK_DATA;
        render();
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    setupFilters();
    setupLoadMore();
  });
})();
