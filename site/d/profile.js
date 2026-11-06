// 인물 프로필 화면. 연표의 인물 막대나 전시실의 인물 이름을 누르면 화면 가득 열린다.
// 왼쪽 열(고정): 이름·기본 정보·가계도·관련 장소 지도 / 오른쪽 열(스크롤): 요약·생애·핵심 구절·성경 밖 기록·등장하는 책
import { PEOPLE, EVENTS, STRENGTH, PLACES, byId } from "../shared/data.js";
import { PROFILES, UPPER, LOWER } from "../shared/profiles.js";
import { createMap, THEMES } from "../shared/map.js";

const PERSON = byId(PEOPLE);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const yearRange = (a, b) => (a < 0 && b < 0 ? `기원전 ${-a}~${-b}년` : a > 0 ? `기원후 ${a}~${b}년` : `기원전 ${-a}년~기원후 ${b}년`);
const EVIDENCE = Object.fromEntries(EVENTS.flatMap((ev) => ev.evidence.map((e) => [e.img, { ...e, eventId: ev.id }])));

export function createProfiles({ getCredits, onEvent, onOpen, onClose }) {
  const root = document.getElementById("profile");
  const page = document.getElementById("pPage");
  const scroll = document.getElementById("pScroll");
  const pop = document.getElementById("vpop");
  let verses = {}, map = null, mapLoading = null, current = null;
  const versesReady = fetch("../shared/verses.json").then((r) => r.json()).then((v) => (verses = v)).catch(() => {});

  const refBtn = (ref) => (ref ? `<button class="vref" type="button" data-ref="${esc(ref)}">${esc(ref)}</button>` : "");
  const srcTag = (src) => (src ? `<span class="src">${esc(src)}</span>` : "");

  function familyTree(p, f) {
    const chip = (m) => {
      const link = m.id && PROFILES[m.id] ? ` data-person="${esc(m.id)}"` : "";
      return `<div class="fchip${link ? " link" : ""}"${link} title="${esc(m.note || "")}">
        <small>${esc(m.rel)}</small><b>${esc(m.name)}</b>${m.note ? `<span class="fnote">${esc(m.note)}</span>` : ""}
        <span class="fsrc">${refBtn(m.ref)}${srcTag(m.src)}</span></div>`;
    };
    const up = f.filter((m) => UPPER.has(m.rel)), down = f.filter((m) => LOWER.has(m.rel));
    const same = f.filter((m) => !UPPER.has(m.rel) && !LOWER.has(m.rel));
    const row = (list, cls) => (list.length ? `<div class="trow ${cls}">${list.map(chip).join("")}</div>` : "");
    return `<div class="tree">
      ${row(up, "up")}
      <div class="trow self"><div class="fchip me"><small>본인</small><b>${esc(p.name)}</b></div>${same.map(chip).join("")}</div>
      ${row(down, "down")}
    </div>`;
  }

  function recordCard(r) {
    const base = r.ev ? EVIDENCE[r.ev] : {};
    const x = { ...base, ...r, img: r.img ?? (r.ev ? base.img : null) };
    const s = STRENGTH[x.strength];
    const c = x.img ? getCredits()[x.img] : null;
    const lic = c ? (c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license)) : "";
    return `<article class="rec${x.img ? "" : " textonly"}">
      ${x.img ? `<figure><img src="../img/${esc(x.img)}.jpg" alt="${esc(x.name)}" loading="lazy"></figure>` : ""}
      <div class="rec-body">
        <div class="rec-head"><h4>${esc(x.name)}</h4>${s ? `<span class="chip" data-s="${esc(x.strength)}" title="${esc(s.desc)}">${esc(s.label)}</span>` : ""}</div>
        <p class="rec-meta">${[x.madeLabel, x.where, x.found].filter(Boolean).map(esc).join(" · ")}</p>
        <p>${esc(x.says)}</p>
        ${x.caveat ? `<p class="rec-caveat"><b>주의할 점</b>${esc(x.caveat)}</p>` : ""}
        ${x.eventId ? `<button class="go-ev" type="button" data-event="${esc(x.eventId)}">이 유물의 전시실 →</button>` : ""}
        ${c ? `<p class="rec-credit">사진 ${esc(c.author)} · ${lic} · <a href="${esc(c.page)}" target="_blank" rel="noopener">원본</a></p>` : ""}
      </div>
    </article>`;
  }

  function quoteBlock(ref) {
    const parts = verses[ref] || [];
    const text = parts.map(([, t]) => t).join(" ");
    return `<blockquote class="pq"><p>${esc(text || "…")}</p><cite>${esc(ref)} · 개역한글</cite></blockquote>`;
  }

  function render(id) {
    const p = PERSON[id], f = PROFILES[id];
    const events = EVENTS.filter((ev) => ev.people.includes(id));
    page.innerHTML = `
      <aside class="p-side">
        <div class="p-hero">
          <p class="p-role">${esc(f.role)}</p>
          <h1>${esc(p.name)}</h1>
          ${f.aliases.length ? `<p class="p-alias">다른 이름 · ${f.aliases.map(esc).join(", ")}</p>` : ""}
          <p class="p-years"><span>${esc(p.kind)}</span>${esc(yearRange(p.from, p.to))} <em>추정</em></p>
        </div>
        <section class="p-card">
          <h3>기본 정보</h3>
          <dl class="facts">${f.facts.map((x) => `<dt>${esc(x.k)}</dt><dd>${esc(x.v)}${x.note ? `<span class="fnote">${esc(x.note)}</span>` : ""} ${refBtn(x.ref)}${srcTag(x.src)}</dd>`).join("")}</dl>
        </section>
        <section class="p-card">
          <h3>가문과 가족</h3>
          ${familyTree(p, f.family)}
        </section>
        <section class="p-card p-mapcard">
          <h3>관련 장소</h3>
          <div class="p-map" id="pMap"></div>
          <p class="p-places">${f.places.map((k) => esc(PLACES[k]?.name)).join(" · ")}</p>
        </section>
      </aside>
      <div class="p-main">
        <section class="p-sec">
          <p class="p-summary">${esc(f.summary)}</p>
          ${f.nameNote ? `<p class="p-name-note"><b>이름</b>${esc(f.nameNote.text)} ${refBtn(f.nameNote.ref)}</p>` : ""}
        </section>
        ${events.length ? `<section class="p-sec"><h2>연표의 사건</h2><div class="p-events">${events.map((ev) => `
          <button class="p-event" type="button" data-event="${esc(ev.id)}">
            <img src="../img/sm/${esc(ev.evidence[0].img)}.jpg" alt="" loading="lazy">
            <span><small>${esc(ev.yearLabel)}</small><b>${esc(ev.title)}</b><em>전시실에서 보기 →</em></span>
          </button>`).join("")}</div></section>` : ""}
        <section class="p-sec">
          <h2>생애</h2>
          <ol class="life">${f.life.map((l) => `
            <li class="${l.event ? "has-ev" : ""}">
              <span class="when">${esc(l.when || "")}</span>
              <div><p>${esc(l.text)}</p><span class="lref">${refBtn(l.ref)}${srcTag(l.src)}${l.event ? `<button class="go-ev small" type="button" data-event="${esc(l.event)}">전시실 →</button>` : ""}</span></div>
            </li>`).join("")}</ol>
        </section>
        <section class="p-sec">
          <h2>핵심 구절</h2>
          ${f.quotes.map(quoteBlock).join("")}
        </section>
        <section class="p-sec">
          <h2>성경 밖 기록과 유물</h2>
          ${f.recordNote ? `<p class="p-note">${esc(f.recordNote)}</p>` : ""}
          <div class="recs">${f.records.map(recordCard).join("")}</div>
        </section>
        <section class="p-sec">
          <h2>등장하는 책</h2>
          <div class="books">${f.books.map((b) => `<span>${esc(b)}</span>`).join("")}</div>
        </section>
        <p class="p-foot">연도는 성경에 적힌 나이와 햇수를 거슬러 더한 전통 연대이고 대부분 추정이다. 장절을 누르면 개역한글 본문이 보인다.</p>
      </div>`;
    showMap(f.places);
  }

  function showMap(places) {
    const el = document.getElementById("pMap");
    const route = places.filter((k) => PLACES[k]);
    // 지도는 한 번만 만들고, 열 때마다 새 칸으로 옮겨 붙인다.
    if (map) { el.appendChild(map.el); map.resize(); map.show({ route }, { instant: true }); return; }
    if (mapLoading) return;
    const host = document.createElement("div");
    host.className = "p-map-host";
    el.appendChild(host);
    mapLoading = createMap(host, THEMES.atlas, { labels: true, pad: 0.3 }).then((m) => {
      map = { ...m, el: host };
      const now = document.getElementById("pMap");
      if (now && !now.contains(host)) now.appendChild(host);
      m.resize();
      m.show({ route: PROFILES[current].places.filter((k) => PLACES[k]) }, { instant: true });
    }).catch(() => {});
  }

  function showVerse(btn) {
    const ref = btn.dataset.ref;
    const parts = verses[ref];
    pop.innerHTML = `<b>${esc(ref)}</b>${parts ? parts.map(([k, t]) => `<p><sup>${esc(k.split(":")[1])}</sup>${esc(t)}</p>`).join("") : "<p>본문을 불러오는 중입니다.</p>"}<small>개역한글</small>`;
    pop.hidden = false;
    const r = btn.getBoundingClientRect(), rr = root.getBoundingClientRect();
    const w = Math.min(360, rr.width - 24);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(12, Math.min(r.left - rr.left, rr.width - w - 12))}px`;
    const below = r.bottom - rr.top + 8, h = pop.offsetHeight;
    pop.style.top = `${below + h < rr.height - 12 ? below : Math.max(12, r.top - rr.top - h - 8)}px`;
  }
  const hidePop = () => { pop.hidden = true; };

  root.addEventListener("click", (e) => {
    const vref = e.target.closest(".vref");
    if (vref) { e.stopPropagation(); pop.hidden || pop.dataset.ref !== vref.dataset.ref ? (showVerse(vref), (pop.dataset.ref = vref.dataset.ref)) : hidePop(); return; }
    if (!e.target.closest("#vpop")) hidePop();
    const person = e.target.closest("[data-person]");
    if (person) { open(person.dataset.person); return; }
    const ev = e.target.closest("[data-event]");
    if (ev) { close(); onEvent(ev.dataset.event); }
  });
  scroll.addEventListener("scroll", hidePop, { passive: true });
  document.getElementById("pClose").addEventListener("click", () => close());

  async function open(id) {
    if (!PROFILES[id] || !PERSON[id]) return;
    await versesReady;
    current = id;
    hidePop();
    render(id);
    scroll.scrollTop = 0;
    document.getElementById("pName").textContent = PERSON[id].name;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    history.replaceState(null, "", `#p-${id}`);
    onOpen(PERSON[id]);
  }

  function close() {
    if (!root.classList.contains("open")) return;
    hidePop();
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    history.replaceState(null, "", location.pathname + location.search);
    onClose();
  }

  return { open, close, hidePop, isOpen: () => root.classList.contains("open"), popOpen: () => !pop.hidden };
}
