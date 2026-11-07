// 인물 프로필 화면. 연표의 인물 막대나 전시실의 인물 이름을 누르면 화면 가득 열린다.
// 왼쪽 열(고정): 이름·기본 정보·가계도·관련 장소 지도 / 오른쪽 열(스크롤): 요약·생애·핵심 구절·성경 밖 기록·등장하는 책
import { nav } from "./nav.js";
import { PEOPLE, EVENTS, STRENGTH, STRENGTH_CH, PLACES, byId } from "./shared/data.js";
import { PROFILES, UPPER, LOWER } from "./shared/profiles.js";
import { createMap, THEMES } from "./shared/map.js";
import { VERSES } from "./shared/verses.js";
import { findBook } from "./shared/books.js";
import { SOURCES as BG_SOURCES } from "./shared/backgrounds.js";
import { CH_SOURCES, CH_PEOPLE } from "./shared/church_events.js";
import { PORTRAITS } from "./shared/portraits.js";
import { CONTROVERSY_SOURCE_NAMES } from "./shared/controversy_index.js";

const SRC_NAME = { ...CONTROVERSY_SOURCE_NAMES, ...CH_SOURCES, ...BG_SOURCES };
// 교회사 인물(이그나티오스처럼 기원후 100년 전에 태어난 사람도 있다)은 맺음말이 다르다.
const CHURCH = new Set(CH_PEOPLE.map((p) => p.id));
const PERSON = byId(PEOPLE);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const yearRange = (a, b) => (a < 0 && b < 0 ? `기원전 ${-a}~${-b}년` : a > 0 ? `기원후 ${a}~${b}년` : `기원전 ${-a}년~기원후 ${b}년`);
const EVIDENCE = Object.fromEntries(EVENTS.flatMap((ev) => ev.evidence.filter((e) => e.img).map((e) => [e.img, { ...e, eventId: ev.id }])));

export function createProfiles({ getCredits, onEvent, onBook, onBack, onOpen, onClose }) {
  const root = document.getElementById("profile");
  const page = document.getElementById("pPage");
  const scroll = document.getElementById("pScroll");
  const pop = document.getElementById("vpop");
  const verses = VERSES;
  let map = null, mapLoading = null, current = null;

  const refBtn = (ref) => (ref ? `<button class="vref" type="button" data-ref="${esc(ref)}">${esc(ref)}</button>` : "");
  // 출처가 "id: 위치"이고 id가 출처 목록에 있으면 자료 이름으로 보인다. 아니면(옛 프로필의 글 출처) 그대로 쓴다.
  // 출처가 여럿이면 ';'로 나뉜다("a: 3장; b: 5권"). 숫자나 §로 시작하는 조각("schaffhcc: 4권 §71; 5권 §9")은 앞 출처의 다른 위치다.
  const srcTag = (src) => {
    if (!src) return "";
    const out = [];
    for (const s of String(src).split(";").map((x) => x.trim()).filter(Boolean)) {
      const m = s.match(/^([a-z][a-z0-9]*)\s*:\s*(.*)$/), known = m && SRC_NAME[m[1]];
      if (known) out.push(`${known.name}${m[2] ? ` · ${m[2]}` : ""}`);
      else if (!m && out.length && /^[\d§]/.test(s)) out[out.length - 1] += `; ${s}`;
      else out.push(s);
    }
    return `<span class="src">${esc(out.join(" / "))}</span>`;
  };

  // 생김새가 확실한 사진이나 생전 초상(shared/portraits.js). 누르면 원본(위키미디어 공용)이 열린다.
  function portraitHTML(id, p) {
    const pt = PORTRAITS[id];
    if (!pt) return "";
    const c = getCredits()[pt.img];
    const credit = c ? `${esc(c.author)} · ${c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license)}` : "";
    return `<figure class="p-portrait">
      ${c?.page ? `<a href="${esc(c.page)}" target="_blank" rel="noopener" title="원본 보기">` : ""}<img src="img/${esc(pt.img)}.jpg" alt="${esc(p.name)}의 ${esc(pt.kind)}" decoding="async">${c?.page ? "</a>" : ""}
      <figcaption><b>${esc(pt.kind)}</b> ${esc([pt.madeLabel, pt.by].filter(Boolean).join(" · "))}${pt.note ? `<span>${esc(pt.note)}</span>` : ""}${credit ? `<small>${credit}</small>` : ""}</figcaption>
    </figure>`;
  }

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
      ${x.img ? `<figure><img src="img/${esc(x.img)}.jpg" alt="${esc(x.name)}" loading="lazy"></figure>` : ""}
      <div class="rec-body">
        <div class="rec-head"><h4>${esc(x.name)}</h4>${s ? `<span class="chip" data-s="${esc(x.strength)}" title="${esc(CHURCH.has(current) ? STRENGTH_CH[x.strength] : s.desc)}">${esc(s.label)}</span>` : ""}</div>
        <p class="rec-meta">${[x.madeLabel, x.where, x.found].filter(Boolean).map(esc).join(" · ")}</p>
        <p>${esc(x.says)}</p>
        ${x.caveat ? `<p class="rec-caveat"><b>주의할 점</b>${esc(x.caveat)}</p>` : ""}
        ${x.eventId ? `<button class="go-ev" type="button" data-event="${esc(x.eventId)}">이 유물의 전시실 →</button>` : ""}
        ${c ? `<p class="rec-credit">사진 ${esc(c.author)} · ${lic} · <a href="${esc(c.page)}" target="_blank" rel="noopener">원본</a></p>` : ""}
      </div>
    </article>`;
  }

  // 성경 장절(문자열) 또는 교회사 인물이 남긴 글 { text, src }
  function quoteBlock(ref) {
    if (ref && typeof ref === "object") {
      const [id, loc] = (() => { const s = String(ref.src || ""), i = s.indexOf(":"); return i < 0 ? [s.trim(), ""] : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; })();
      const src = SRC_NAME[id];
      return `<blockquote class="pq"><p>${esc(ref.text)}</p><cite>${src ? esc(src.name) : esc(id)}${loc ? ` · ${esc(loc)}` : ""}</cite></blockquote>`;
    }
    const parts = verses[ref] || [];
    const text = parts.map(([, t]) => t).join(" ");
    return `<blockquote class="pq"><p>${esc(text || "…")}</p><cite>${esc(ref)} · 개역한글</cite></blockquote>`;
  }

  function render(id) {
    // 교회사 인물처럼 칸이 빠진 프로필도 그릴 수 있게 빈 목록으로 채운다.
    const p = PERSON[id], f = { aliases: [], facts: [], family: [], places: [], life: [], quotes: [], records: [], books: [], ...PROFILES[id] };
    const events = EVENTS.filter((ev) => (ev.people || []).includes(id));
    page.innerHTML = `
      <aside class="p-side">
        <div class="p-hero${PORTRAITS[id] ? " has-portrait" : ""}">
          ${portraitHTML(id, p)}
          <div class="p-hero-text">
          <p class="p-role">${esc(f.role)}</p>
          <h1>${esc(p.name)}</h1>
          ${f.aliases.length ? `<p class="p-alias">다른 이름 · ${f.aliases.map(esc).join(", ")}</p>` : ""}
          <p class="p-years"><span>${esc(p.kind)}</span>${esc(p.now ? `기원후 ${p.from}년~` : yearRange(p.from, p.to))} ${p.now ? "<em>지금까지</em>" : p.from < 1600 ? "<em>추정</em>" : ""}</p>
          </div>
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
            ${ev.evidence[0]?.img ? `<img src="img/sm/${esc(ev.evidence[0].img)}.jpg" alt="" loading="lazy">` : `<span class="p-noimg">${ev.evidence.length ? "글" : "성경"}</span>`}
            <span><small>${esc(ev.yearLabel)}</small><b>${esc(ev.title)}</b><em>전시실에서 보기 →</em></span>
          </button>`).join("")}</div></section>` : ""}
        ${f.life.length ? `<section class="p-sec">
          <h2>생애</h2>
          <ol class="life">${f.life.map((l) => `
            <li class="${l.event ? "has-ev" : ""}">
              <span class="when">${esc(l.when || "")}</span>
              <div><p>${esc(l.text)}</p><span class="lref">${refBtn(l.ref)}${srcTag(l.src)}${l.event ? `<button class="go-ev small" type="button" data-event="${esc(l.event)}">전시실 →</button>` : ""}</span></div>
            </li>`).join("")}</ol>
        </section>` : ""}
        ${f.quotes.length ? `<section class="p-sec">
          <h2>${f.quotes.some((q) => typeof q === "object") ? "남긴 글과 구절" : "핵심 구절"}</h2>
          ${f.quotes.map(quoteBlock).join("")}
        </section>` : ""}
        ${f.records.length || f.recordNote ? `<section class="p-sec">
          <h2>성경 밖 기록과 유물</h2>
          ${f.recordNote ? `<p class="p-note">${esc(f.recordNote)}</p>` : ""}
          <div class="recs">${f.records.map(recordCard).join("")}</div>
        </section>` : ""}
        ${f.books.length ? `<section class="p-sec">
          <h2>등장하는 책</h2>
          <div class="books">${f.books.map((b) => findBook(b) ? `<button class="book-link" type="button" data-book="${esc(findBook(b).id)}">${esc(b)}</button>` : `<span>${esc(b)}</span>`).join("")}</div>
        </section>` : ""}
        <p class="p-foot">${CHURCH.has(p.id) ? "연도는 사료에 따른 것이고 일부는 추정이다. 같은 사람을 교회마다 다르게 보는 경우 함께 적었다." : "연도는 성경에 적힌 나이와 햇수를 거슬러 더한 전통 연대이고 대부분 추정이다."} 장절을 누르면 개역한글 본문이 보인다.</p>
      </div>`;
    showMap(f.places);
  }

  function showMap(places) {
    const el = document.getElementById("pMap");
    const route = places.filter((k) => PLACES[k]);
    // 지도는 한 번만 만들고, 열 때마다 새 칸으로 옮겨 붙인다.
    if (map) { el.appendChild(map.el); map.resize(); map.show({ route, noLine: true }, { instant: true }); return; }
    if (mapLoading) return;
    const host = document.createElement("div");
    host.className = "p-map-host";
    el.appendChild(host);
    mapLoading = createMap(host, THEMES.atlas, { labels: true, pad: 0.3 }).then((m) => {
      map = { ...m, el: host };
      const now = document.getElementById("pMap");
      if (now && !now.contains(host)) now.appendChild(host);
      m.resize();
      m.show({ route: PROFILES[current].places.filter((k) => PLACES[k]), noLine: true }, { instant: true });
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
    const bk = e.target.closest("[data-book]");
    if (bk) { close(); onBook(bk.dataset.book); return; }
    const person = e.target.closest("[data-person]");
    if (person) { open(person.dataset.person); return; }
    const ev = e.target.closest("[data-event]");
    if (ev) { close(); onEvent(ev.dataset.event); }
  });
  scroll.addEventListener("scroll", hidePop, { passive: true });
  // 닫기는 바로 앞 화면으로 돌아간다.
  document.getElementById("pClose").addEventListener("click", () => onBack());

  async function open(id) {
    if (!PROFILES[id] || !PERSON[id]) return;
    hidePop();
    // 같은 인물로 돌아오면 다시 그리지 않아 읽던 자리가 그대로 남는다.
    if (current !== id || !document.getElementById("pPage").childElementCount) { current = id; render(id); scroll.scrollTop = 0; }
    document.getElementById("pName").textContent = PERSON[id].name;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    nav.push(`#p-${id}`);
    onOpen(PERSON[id]);
  }

  function close() {
    if (!root.classList.contains("open")) return;
    hidePop();
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    onClose();
  }

  return { open, close, hidePop, has: (id) => !!(PROFILES[id] && PERSON[id]), isOpen: () => root.classList.contains("open"), popOpen: () => !pop.hidden };
}
