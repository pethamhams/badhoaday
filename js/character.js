/* ==========================================================================
   CHARACTER.JS
   1. characters.json を読み込んでカードグリッドを描画する
   2. 上部のタイプ絞り込みタブでカードをフィルタリングする
   ========================================================================== */

(function () {
  "use strict";

  const DATA_PATH = "data/characters.json";

  // fetchが使えない環境(file://直開き等)向けのフォールバック。
  // characters.json と内容は同一に保つこと。
  const FALLBACK_DATA = {
    types: ["ALL", "HEVIL", "HENJEL", "HENIMAL", "HECRIS", "HENSECTA", "HELAUNE", "HEIVORG", "HEIVOLIS", "HELESTARIA", "HUMAN"],
    slotCount: 60,
    characters: [
      { slot: 0, name: "ZOWHOME", type: "HELAUNE", image: "assets/zowhome-face.png", link: "character-zowhome.html" },
    ],
  };

  let currentFilter = "ALL";
  let dataCache = null;

  function buildGrid(data) {
    const grid = document.getElementById("character-grid");
    const byslot = new Map(data.characters.map((c) => [c.slot, c]));

    const cards = [];
    for (let i = 0; i < data.slotCount; i++) {
      const c = byslot.get(i);
      if (c) {
        cards.push(`
          <a href="${c.link}" class="character-card is-filled" data-type="${c.type}">
            <div class="card-photo" style="background-image:url('${c.image}')"></div>
            <div class="card-name-area"><div class="card-name">${c.name}</div></div>
          </a>`);
      } else {
        cards.push(`
          <div class="character-card is-empty" data-type="">
            <div class="card-photo"></div>
            <div class="card-name-area"><div class="card-name"></div></div>
          </div>`);
      }
    }
    grid.innerHTML = cards.join("");
  }

  function buildFilterTabs(data) {
    const wrap = document.getElementById("type-filter");
    wrap.innerHTML = data.types
      .map(
        (t) =>
          `<button type="button" data-type="${t}" class="${t === "ALL" ? "is-active" : ""}">
            <img src="assets/filter_${t.toLowerCase()}.png" alt="${t}" />
          </button>`
      )
      .join("");

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      currentFilter = btn.dataset.type;
      wrap.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
      applyFilter();
    });
  }

  function applyFilter() {
    const grid = document.getElementById("character-grid");
    grid.querySelectorAll(".character-card").forEach((card) => {
      const isEmpty = card.classList.contains("is-empty");
      if (currentFilter === "ALL") {
        card.classList.remove("is-hidden");
        return;
      }
      // 絞り込み中は空の枠を隠し、タイプが一致するカードのみ表示する
      const match = !isEmpty && card.dataset.type === currentFilter;
      card.classList.toggle("is-hidden", !match);
    });
  }

  function init(data) {
    dataCache = data;
    buildGrid(data);
    buildFilterTabs(data);
  }

  function loadData() {
    fetch(DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("characters.json not reachable");
        return res.json();
      })
      .then(init)
      .catch(() => init(FALLBACK_DATA));
  }

  /* --- BGM再生/停止トグル --- */
  function initBgmToggle() {
    const audio = document.getElementById("bgm-audio");
    const button = document.getElementById("bgm-toggle");
    if (!audio || !button) return;

    const label = button.querySelector(".bgm-label");

    button.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      button.setAttribute("aria-pressed", "true");
      if (label) label.textContent = "ON";
    });

    audio.addEventListener("pause", () => {
      button.setAttribute("aria-pressed", "false");
      if (label) label.textContent = "OFF";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initBgmToggle();
  });
})();
