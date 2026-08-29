/* ==========================================================================
   MAIN.JS
   必要最低限の処理のみ:
   1. news.json を読み込んでNEWSログを描画する
   2. マーキー文言をJSに複製して継ぎ目のないループにする
   ========================================================================== */

(function () {
  "use strict";

  /* --- 1. NEWSログの描画 -------------------------------------------------- */
  const NEWS_JSON_PATH = "data/news.json";

  // ローカルファイルを直接開いた場合など fetch が失敗するケースに備えたフォールバック。
  // news.json と内容は同一に保つこと。
  const NEWS_FALLBACK = [
    { date: "2026.12.24", tag: "log", text: "Development notes updated." },
    { date: "2026.12.11", tag: "camera", text: "New photographs added." },
    { date: "2026.11.30", tag: "gallery", text: "Illustrations updated." },
    { date: "2026.11.18", tag: "character", text: "New profile released." },
    { date: "2026.11.07", tag: "world", text: "World archive expanded." },
    { date: "2026.10.31", tag: "special", text: "Halloween page added." },
    { date: "2026.10.20", tag: "music", text: "Background music updated." },
    { date: "2026.10.08", tag: "illustration", text: "New artwork uploaded." },
    { date: "2026.09.26", tag: "download", text: "Wallpapers available." },
    { date: "2026.09.15", tag: "goods", text: "Store updated." },
    { date: "2026.09.01", tag: "log", text: "Site maintenance." },
    { date: "2026.08.24", tag: "camera", text: "Photo archive expanded." },
    { date: "2026.08.10", tag: "character", text: "Character file updated." },
    { date: "2026.07.28", tag: "gallery", text: "New gallery section." },
    { date: "2026.07.19", tag: "world", text: "Location records updated." },
    { date: "2026.07.12", tag: "website open", text: "Welcome." },
  ];

  function renderNews(items) {
    const tbody = document.getElementById("news-log-body");
    if (!tbody) return;

    tbody.innerHTML = items
      .map(
        (item) => `
        <tr>
          <td class="news-date">${item.date}</td>
          <td class="news-tag">${item.tag}</td>
          <td class="news-text">${item.text}</td>
        </tr>`
      )
      .join("");
  }

  function loadNews() {
    fetch(NEWS_JSON_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("news.json not reachable");
        return res.json();
      })
      .then(renderNews)
      .catch(() => renderNews(NEWS_FALLBACK));
  }

  /* --- 2. マーキーのシームレスループ ---------------------------------------
     同じ内容を複製して隣に並べ、-50% までスクロールしたら
     ちょうど1周分ずれた状態でループする(CSS側のkeyframeと対応)。       */
  function duplicateMarquee() {
    const track = document.querySelector(".marquee-track");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  /* --- 3. BGM再生/停止トグル ------------------------------------------------
     ブラウザの自動再生ポリシーにより、ページ読込時の自動再生はできないため、
     ボタンが押されたタイミングで初めて再生を開始する。 */
  function initBgmToggle() {
    const audio = document.getElementById("bgm-audio");
    const button = document.getElementById("bgm-toggle");
    if (!audio || !button) return;

    const label = button.querySelector(".bgm-label");

    button.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {
          /* 再生がブロックされた場合は何もしない(次のクリックで再試行される) */
        });
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
    loadNews();
    duplicateMarquee();
    initBgmToggle();
  });
})();
