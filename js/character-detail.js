/* ==========================================================================
   CHARACTER-DETAIL.JS
   character-zowhome.json (Notionから反映予定のデータ) を読み込み、
   NAME / DATA項目・説明 / DATA MORE / CATCH COPY の値を描画する。
   EN項目=Arial Bold、EN説明=Arial Italic、日本語=Noto Sans JP という
   フォントの使い分けをCSSクラスで反映している。
   DATA・DATA MOREの各項目は同一フォーマット(同じフォント/サイズ)で統一。
   ========================================================================== */

(function () {
  "use strict";

  // fetchが使えない環境(file://直開き等)向けのフォールバック。
  // character-zowhome.json と内容は同一に保つこと。
  const FALLBACK_DATA = {
    name: "ZOWHOME",
    nameJa: "ゾーホーム / 臓家",
    catchCopy: "",
    fields: [
      { item: "TYPE", desc: "Helaune" },
      { item: "SUB TYPE", desc: "" },
      { item: "GOTH TYPE", desc: "Japan goth" },
      { item: "AFFILIATION", desc: "HELLNEL" },
      { item: "OCCUPATION", desc: "" },
      { item: "AGE", desc: "21" },
      { item: "HEIGHT", desc: "166" },
      { item: "LIKES", desc: "" },
      { item: "DISLIKES", desc: "" },
      { item: "HOBBIES", desc: "" },
      { item: "DANGER", desc: "LEVEL Ⅳ" },
      { item: "ABILITIES", desc: "" },
      { item: "WEAPON", desc: "" },
      { item: "SEXUAL", desc: "Homosexuality" },
      { item: "FIRST PERSON", desc: "" },
      { item: "SECOND PERSON", desc: "" },
    ],
    dataMore: { type: "", biography: "", background: "" },
    images: { fullBody: "", face: "" },
  };

  function fieldRowHtml(item, desc) {
    return `<div class="field-row"><span class="field-item">${item}</span><span class="field-sep">:  </span><span class="field-desc">${desc || ""}</span></div>`;
  }

  function renderFields(fields) {
    const wrap = document.getElementById("detail-fields");
    // 先頭に「DATA」見出し行を、他の項目と全く同じ書式で追加する
    const rows = [fieldRowHtml("DATA", "")].concat(
      fields.map((f) => fieldRowHtml(f.item, f.desc))
    );
    wrap.innerHTML = rows.join("");
  }

  function renderFieldsMore(dataMore) {
    const wrap = document.getElementById("detail-fields-more");
    const rows = [
      fieldRowHtml("DATA MORE", ""),
      fieldRowHtml("TYPE", dataMore.type),
      fieldRowHtml("BIOGRAPHY", dataMore.biography),
      fieldRowHtml("BACKGROUND", dataMore.background),
    ];
    wrap.innerHTML = rows.join("");
  }

  function init(data) {
    document.getElementById("detail-name-en").textContent = data.name;
    document.getElementById("detail-name-jp").textContent = data.nameJa;
    document.getElementById("detail-catchcopy").textContent = data.catchCopy || "";
    renderFields(data.fields);
    renderFieldsMore(data.dataMore);

    if (data.images && data.images.fullBody) {
      document.getElementById("detail-photo-full").style.backgroundImage = `url('${data.images.fullBody}')`;
    }
  }

  function loadData() {
    fetch("data/character-zowhome.json")
      .then((res) => {
        if (!res.ok) throw new Error("character-zowhome.json not reachable");
        return res.json();
      })
      .then(init)
      .catch(() => init(FALLBACK_DATA));
  }

  document.addEventListener("DOMContentLoaded", loadData);
})();
