/* ==========================================================================
   STORE.JS
   store-products.json (Notion管理予定) を読み込み、商品カードを描画する。
   NAME(商品名)とPRICE(金額)は管理しやすいようJSONから差し込み、
   ADD TO CARTはすべてBoothリンクを埋め込む。
   ========================================================================== */

(function () {
  "use strict";

  const DATA_PATH = "data/store-products.json";

  // fetchが使えない環境(file://直開き等)向けのフォールバック。
  // store-products.json と内容は同一に保つこと。
  const FALLBACK_DATA = {
    boothUrl: "https://nmexoxo.booth.pm/",
    products: Array.from({ length: 21 }, (_, i) => ({
      slot: i,
      name: "sold out",
      price: "0.00 JPY",
      image: "assets/store-product-a.png",
      badge: i < 3,
    })),
  };

  function cardHtml(p, boothUrl) {
    return `
      <div class="store-card">
        <div class="store-card-photo">
          ${p.badge ? '<img class="store-card-badge" src="assets/store-deco-star-small.gif" alt="" aria-hidden="true" />' : ""}
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <p class="store-card-name">${p.name}</p>
        <p class="store-card-price">${p.price}</p>
        <a class="store-card-cart" href="${boothUrl}" target="_blank" rel="noopener">ADD TO CART</a>
      </div>`;
  }

  function render(data) {
    const grid = document.getElementById("store-grid");
    grid.innerHTML = data.products.map((p) => cardHtml(p, data.boothUrl)).join("");
  }

  function loadData() {
    fetch(DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("store-products.json not reachable");
        return res.json();
      })
      .then(render)
      .catch(() => render(FALLBACK_DATA));
  }

  /* マーキーのシームレスループ: 同じ内容を複製して隣に並べ、
     -50%までスクロールしたらちょうど1周分ずれた状態でループする */
  function duplicateMarquee() {
    const track = document.querySelector(".store-marquee-track");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    duplicateMarquee();
  });
})();
