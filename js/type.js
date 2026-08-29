/* ==========================================================================
   TYPE.JS
   type-data.json を読み込み、HEVIL〜ENEMYの順で11種類のGOTHタイプの
   ラベルをモニター画面の黒い部分に描画する。
   ラベルをクリックすると、その画面部分に専用画像と、タイプライター風に
   1文字ずつ表示される説明文が表示される
   (画像/説明が無いタイプ、またはもう一度押した場合は一覧表示に戻る)。
   ========================================================================== */

(function () {
  "use strict";

  const FALLBACK_DATA = {
    defaultImage: "",
    rows: [
      ["HEVIL", "HENJEL", "HENIMAL", "HECRIS"],
      ["HENSECTA", "HELAUNE", "HEIVORG", "HEIBORIS"],
      ["HELESTARIA"],
      ["HUMAN", "ENEMY"],
    ],
    images: {
      HEVIL: "assets/HEVIL.png",
      HENJEL: "assets/HENJEL.png",
      HENIMAL: "assets/HENIMAL.png",
      HECRIS: "assets/HECRIS.png",
      HENSECTA: "assets/HENSECTA.png",
      HELAUNE: "assets/HELAUNE.png",
      HEIVORG: "assets/HEIVORG.png",
      HEIBORIS: "assets/HEIBORIS.png",
      HELESTARIA: "assets/HELESTARIA.png",
      HUMAN: "",
      ENEMY: "",
    },
    icons: {
      HEVIL: "assets/type-icon-hevil.gif",
      HENJEL: "assets/type-icon-henjel.gif",
      HENIMAL: "assets/type-icon-henimal.gif",
      HECRIS: "assets/type-icon-hecris.gif",
      HENSECTA: "assets/type-icon-hensecta.gif",
      HELAUNE: "assets/type-icon-helaune.gif",
      HEIVORG: "assets/type-icon-heivorg.gif",
      HEIBORIS: "assets/type-icon-heiboris.gif",
      HELESTARIA: "assets/type-icon-helestaria.gif",
      HUMAN: "assets/type-icon-human.gif",
      ENEMY: "assets/type-icon-enemy.gif",
    },
    descriptions: {
      HEVIL: "A species associated with demonic appearances and concepts. Many possess horns, wings, or tails, and their abilities tend to be highly offensive in nature. They are regarded as the oldest known TYPE in recorded history.",
      HENJEL: "A species associated with sacred appearances and concepts. Some individuals possess wings or halos, though they symbolize silence and loss rather than true holiness.",
      HENIMAL: "A species with animal-like characteristics. Their forms vary widely, including ears, tails, wings, and other animal traits. Many possess exceptional physical abilities and heightened senses.",
      HECRIS: "A species descended from marine life. They commonly possess fins, gills, and large tail fins, allowing them to thrive in deep seas and aquatic environments.",
      HENSECTA: "A species derived from insects and reptiles. Antennae, wings, exoskeletons, venom, and other specialized traits are common. Due to their remarkable diversity, their abilities and biology vary greatly between individuals.",
      HELAUNE: "A species resembling clowns or dolls. Many possess sharp fangs and permanently smiling mouths, and their emotional expression is often unusual or difficult to interpret. Hedonism is considered a defining behavioral trait.",
      HEIVORG: "A species formed through the fusion of machinery and living organisms. Metallic limbs, compound eyes, and flight mechanisms are common features, giving them an artificial appearance. Despite this, they carry blood instead of oil, a condition said to be the result of an ancient curse left behind by a tyrannical war.",
      HEIBORIS: "A species descended from plant life. They display characteristics of flowers, vines, and trees while possessing blood instead of sap. Carnivorous plant traits are also common, and their regenerative abilities are exceptionally powerful.",
      HELESTARIA: "A rare species believed to originate from the concept of festivals. As living embodiments of a unique GOTH TYPE, they possess extraordinary abilities. They are born when the festive consciousness of a living human is reincarnated. A single festival may give rise to multiple HELESTARIA, each representing the hidden side of that celebration. Much of their biology and existence remains unknown.",
      HUMAN: "",
      ENEMY: "",
    },
    descriptionsJa: {
      HEVIL: "悪魔を連想させる姿や概念を持つ種。羽や尻尾を持ち、能力が攻撃的な者が多い。一番古い歴史がある。",
      HENJEL: "神聖さを思わせる姿や概念を持つ種。羽や輪を持つ者も存在するが、実際は神聖さよりも静寂や喪失を象徴する。",
      HENIMAL: "動物の特徴を持つ種。耳・尻尾・翼など姿は多様で、身体能力や感覚に優れる個体が多い。",
      HECRIS: "海生物を起源とする種。ヒレやエラ、大きな尾びれを備え、深海や水辺への高い適応能力を持つ。",
      HENSECTA: "昆虫や爬虫類を起源とする種。触角や翅、外殻、毒などを備える。種類が多いため個体によって能力や生態が大きく異なる。",
      HELAUNE: "道化師や人形を思わせる外見を持つ種。鋭い牙やにこやかな口を持つ個体が多く、感情表現が独特である個体も多い。快楽主義性である。",
      HEIVORG: "機械と生命が融合した種。金属製の四肢や複眼、飛行装置などを備え、人工的な外見が特徴。オイルではなく血を保有しているのは、古の独裁的戦争による呪いと言われている。",
      HEIBORIS: "植物を起源とする種。花・蔓・樹木などの特徴を持ち、血を保有し、肉食性植物の性質も受け継ぐ。再生能力が非常に高い。",
      HELESTARIA: "祝祭概念に由来するとされる希少種。固有のGOTH TYPEを体現しているため能力が非常に高い。生きている人間から祝祭自我が転生し成る。各祝祭に1人とは限らず、いずれも祝祭の裏側の存在である。その生態は未解明な部分が多い。",
      HUMAN: "",
      ENEMY: "",
    },
  };

  let typeTimeout = null;

  function typewriteNameThenDesc(el, name, descText, descTextJa, speed) {
    if (typeTimeout) clearTimeout(typeTimeout);
    el.innerHTML =
      '<span class="type-desc-name"></span><span class="type-desc-body"></span><span class="type-desc-body-ja"></span>';
    const nameEl = el.querySelector(".type-desc-name");
    const bodyEl = el.querySelector(".type-desc-body");
    const jaEl = el.querySelector(".type-desc-body-ja");
    const jaPart = descTextJa ? "\n\n" + descTextJa : "";
    const full = name + "\n\n" + descText + jaPart;
    const splitAt1 = name.length;
    const splitAt2 = name.length + 2 + descText.length;
    let i = 0;

    function step() {
      const shown = full.slice(0, i + 1);
      nameEl.textContent = shown.slice(0, Math.min(shown.length, splitAt1));
      bodyEl.textContent = shown.slice(splitAt1, Math.min(shown.length, splitAt2)).replace(/^\n+/, "");
      jaEl.textContent = shown.slice(splitAt2).replace(/^\n+/, "");
      i++;
      if (i < full.length) {
        typeTimeout = setTimeout(step, speed || 28);
      }
    }
    step();
  }

  function render(data) {
    const wrap = document.getElementById("type-selector");
    const photo = document.getElementById("type-photo");
    const desc = document.getElementById("type-description");

    wrap.innerHTML = data.rows
      .map(
        (row) => `
        <div class="type-row">
          ${row
            .map(
              (name) => `
            <button type="button" data-type="${name}">
              <img class="type-icon" src="${data.icons[name]}" alt="" aria-hidden="true" />
              <span class="type-label">${name}</span>
            </button>`
            )
            .join("")}
        </div>`
      )
      .join("");

    function showList() {
      photo.style.display = "none";
      desc.style.display = "none";
      wrap.style.display = "";
      if (typeTimeout) clearTimeout(typeTimeout);
    }

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const name = btn.dataset.type;
      const src = data.images[name];
      const text = (data.descriptions && data.descriptions[name]) || "(準備中 / description coming soon)";
      const textJa = (data.descriptionsJa && data.descriptionsJa[name]) || "";

      if (src) {
        photo.onerror = () => {
          photo.style.display = "none";
        };
        photo.src = src;
        photo.style.display = "block";
        wrap.style.display = "none";
      } else {
        photo.style.display = "none";
        photo.removeAttribute("src");
      }

      desc.style.display = "block";
      typewriteNameThenDesc(desc, name, text, textJa, 24);

      wrap.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
    });

    // 画面(選択中の画像/説明文)をクリックすると一覧に戻る
    photo.addEventListener("click", showList);
    desc.addEventListener("click", showList);
  }

  function loadData() {
    fetch("data/type-data.json")
      .then((res) => {
        if (!res.ok) throw new Error("type-data.json not reachable");
        return res.json();
      })
      .then(render)
      .catch(() => render(FALLBACK_DATA));
  }

  document.addEventListener("DOMContentLoaded", loadData);
})();
