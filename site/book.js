// 성경 책 해설 화면. 머리의 '성경으로 보기' 단추, 연표의 책 막대, 전시실의 책 이름, 인물 프로필의 '등장하는 책'에서 연다.
// 책 id 없이 열면 66권 목록(갈래별)을 보여 준다. 레이아웃은 인물 프로필과 같은 .p-* 스타일을 쓴다.
// 책 해설의 오른쪽 열은 '책 해설'과 '당대 배경' 두 탭이다(#b-<책>, #b-<책>.bg).
// 시대 배경(#e-<시대>)도 이 화면에 연다. 연표의 시대 띠, 책의 '당대 배경' 탭, 66권 목록에서 연다.
import { PEOPLE, EVENTS, ERAS, EMPIRES, byId } from "./shared/data.js";
import { ERA_BG, BOOK_BG, SOURCES, BG_KINDS } from "./shared/backgrounds.js";
import { CONTROVERSY_INDEX } from "./shared/controversy_index.js";
import { BIBLE_BOOKS, BOOK_GROUPS, bookById, bpUrl } from "./shared/books.js";
import { GUIDES } from "./shared/guides.js";
import { PROFILES } from "./shared/profiles.js";
import { VERSES } from "./shared/verses.js";
import { hasStory } from "./story.js";
import { nav } from "./nav.js";

const PERSON = byId(PEOPLE);
const EVENT = byId(EVENTS);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const yr = (y) => (y < 0 ? `기원전 ${-y}` : `기원후 ${y}`);
const range = (b) => (b.from === b.to ? `${yr(b.from)}년` : b.from < 0 && b.to < 0 ? `기원전 ${-b.from}~${-b.to}년` : b.from > 0 ? `기원후 ${b.from}~${b.to}년` : `${yr(b.from)}년~${yr(b.to)}년`);
const groupOf = (b) => BOOK_GROUPS.find((g) => g.id === b.group);
// 두 기간이 겹치는가. 경계의 한 해만 맞닿는 것(예: 복음서 ~30년과 초대 교회 30년~)은 겹친다고 보지 않는다.
const overlaps = (a, b) => a.from < b.to && b.from < a.to;
const erasOf = (b) => ERAS.filter((e) => overlaps(e, b));
const ERA = byId(ERAS);
const debatesOf = (e) => CONTROVERSY_INDEX.filter((c) => c.era === e.id);
const bgCount = (bg) => (bg ? BG_KINDS.reduce((n, k) => n + (bg[k.key]?.length || 0), 0) : 0);
// "rinap: Sennacherib 22" → 출처 이름(링크)과 위치
const splitSrc = (s) => { const i = s.indexOf(":"); return i < 0 ? [s.trim(), ""] : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; };
const srcHTML = (s) => {
  const [id, loc] = splitSrc(s), src = SOURCES[id];
  if (!src) return esc(s);
  const name = src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.name)}</a>` : esc(src.name);
  return `${name}${loc ? ` <span class="bg-loc">${esc(loc)}</span>` : ""}`;
};
// 배경 글에 쓰인 출처 id(중복 없이, 처음 나온 차례)
const usedSources = (bgs) => [...new Set(bgs.flatMap((bg) => BG_KINDS.flatMap((k) => (bg?.[k.key] || []).flatMap((it) => [...(it.src || []), it.quote?.src].filter(Boolean).map((s) => splitSrc(s)[0])))))].filter((id) => SOURCES[id]);

export function createBooks({ onEvent, onPerson, onStory, onDebate, onBack, onOpen, onClose }) {
  const root = document.getElementById("book");
  const page = document.getElementById("bPage");
  const scroll = document.getElementById("bScroll");
  const pop = document.getElementById("bpop");
  let current = null, currentTab = "guide";

  const refBtn = (ref) => (ref ? `<button class="vref" type="button" data-ref="${esc(ref)}">${esc(ref)}</button>` : "");
  const srcTag = (src) => (src ? `<span class="src">${esc(src)}</span>` : "");
  const quoteBlock = (ref) => {
    const text = (VERSES[ref] || []).map(([, t]) => t).join(" ");
    return `<blockquote class="pq"><p>${esc(text || "…")}</p><cite>${esc(ref)} · 개역한글</cite></blockquote>`;
  };
  const views = (list) => (list || []).map((v) => `<li><b>${esc(v.view)}</b>${esc(v.text)} ${refBtn(v.ref)}${srcTag(v.src)}</li>`).join("");

  function libraryHTML() {
    const byGroup = (gid) => BIBLE_BOOKS.filter((b) => b.group === gid);
    const card = (b) => `<button class="lib-book${GUIDES[b.id] ? "" : " todo"}" type="button" data-book="${esc(b.id)}">
      <b>${esc(b.name)}</b><small>${b.chapters}장 · ${esc(b.basis)} ${esc(range(b))}</small></button>`;
    const sec = (t) => `<section class="lib-testament"><h2>${t}</h2>${BOOK_GROUPS.filter((g) => g.testament === t).map((g) => `
      <div class="lib-group"><h3>${esc(g.name)} <span>${byGroup(g.id).length}권</span></h3><div class="lib-grid">${byGroup(g.id).map(card).join("")}</div></div>`).join("")}</section>`;
    return `<div class="lib">
      <p class="p-role">성경 66권</p>
      <h1 class="lib-title">책을 고르면 해설이 열립니다</h1>
      <p class="lib-lead">책마다 요약, 쓴 사람과 쓴 때, 책의 짜임, 주요 사건, 주제와 해석, 해석이 갈리는 대목, 핵심 구절을 모았습니다. 구절은 모두 개역한글입니다. '당대 배경' 탭에는 그 책을 쓴 때의 사건, 문화, 문학, 글의 짜임을 모았습니다.</p>
      <section class="lib-eras"><h2>시대 배경</h2><p>시대마다 그때의 제국, 종교, 법, 일상, 글을 모았습니다.</p>
        <div class="lib-era-row">${ERAS.map((e) => `<button class="lib-era" type="button" data-era="${esc(e.id)}"><b>${esc(e.name)}</b><small>${esc(range(e))}</small></button>`).join("")}</div></section>
      ${sec("구약")}${sec("신약")}
    </div>`;
  }

  function bookHTML(b, tab) {
    const g = GUIDES[b.id] || {};
    const grp = groupOf(b);
    const people = (g.people || []).filter((id) => PERSON[id]);
    const bp = (b.bp || []).map((slug, i) => `<a href="${bpUrl(slug)}" target="_blank" rel="noopener">BibleProject 개요 영상${b.bp.length > 1 ? ` ${i + 1}` : ""} ↗</a>`).join("");
    const idx = BIBLE_BOOKS.indexOf(b);
    const prev = BIBLE_BOOKS[idx - 1], next = BIBLE_BOOKS[idx + 1];
    const story = hasStory(b.id);
    return `
      <aside class="p-side">
        <div class="p-hero">
          <p class="p-role">${esc(grp.testament)} · ${esc(grp.name)}</p>
          <h1>${esc(b.name)}</h1>
          <p class="p-alias">${b.chapters}장 · 약칭 '${esc(b.abbr)}'</p>
          <p class="p-years"><span>${esc(b.basis)}</span>${esc(range(b))} <em>추정</em></p>
          ${story ? `<button class="b-story" type="button" data-story="${esc(b.id)}">지도로 따라 읽기 →</button>` : ""}
        </div>
        ${g.author || g.date || g.setting ? `<section class="p-card">
          <h3>기본 정보</h3>
          ${g.author ? `<h4 class="b-sub">쓴 사람</h4><ul class="b-views">${views(g.author)}</ul>` : ""}
          ${g.date ? `<h4 class="b-sub">쓴 때</h4><ul class="b-views">${views(g.date)}</ul>` : ""}
          ${g.setting ? `<h4 class="b-sub">배경</h4><p class="b-setting">${esc(g.setting)}</p>` : ""}
        </section>` : ""}
        ${g.structure ? `<section class="p-card">
          <h3>책의 짜임</h3>
          <ol class="b-structure">${g.structure.map((s) => `<li><span>${esc(s.range)}</span><div><b>${esc(s.title)}</b><p>${esc(s.text)}</p></div></li>`).join("")}</ol>
        </section>` : ""}
        ${people.length ? `<section class="p-card"><h3>등장인물</h3><div class="b-people">${people.map((id) => `<button class="b-chip${PROFILES[id] ? " link" : ""}" type="button" data-person="${esc(id)}">${esc(PERSON[id].name)}</button>`).join("")}</div></section>` : ""}
        ${g.links?.length ? `<section class="p-card"><h3>이어 읽을 책</h3><ul class="b-links">${g.links.filter((l) => bookById[l.id]).map((l) => `<li><button type="button" data-book="${esc(l.id)}">${esc(bookById[l.id].name)} →</button><span>${esc(l.why)}</span></li>`).join("")}</ul></section>` : ""}
        <section class="p-card b-ref"><h3>참고</h3><p>BibleProject의 개요 영상을 참고해 새로 썼습니다.</p><div>${bp}</div></section>
      </aside>
      <div class="p-main">
        <div class="b-tabs" role="tablist">
          <button type="button" role="tab" data-tab="guide" aria-selected="${tab !== "bg"}">책 해설</button>
          <button type="button" role="tab" data-tab="bg" aria-selected="${tab === "bg"}">당대 배경${bgCount(BOOK_BG[b.id]) ? ` <span>${bgCount(BOOK_BG[b.id])}</span>` : ""}</button>
        </div>
        <div class="b-panel" id="bPanel">${tab === "bg" ? bgMain(b) : guideMain(b)}</div>
        <nav class="b-nav">${prev ? `<button type="button" data-book="${esc(prev.id)}">← ${esc(prev.name)}</button>` : "<span></span>"}<button type="button" data-library="1">66권 목록</button>${next ? `<button type="button" data-book="${esc(next.id)}">${esc(next.name)} →</button>` : "<span></span>"}</nav>
        <p class="p-foot">연도는 전통 연대를 따른 추정이다. 장절을 누르면 개역한글 본문이 보인다. 해석이 갈리는 대목은 어느 한쪽을 정답으로 고르지 않고 함께 적었다.</p>
      </div>`;
  }

  function guideMain(b) {
    const g = GUIDES[b.id] || {};
    const story = hasStory(b.id);
    return `
        ${g.summary ? `<section class="p-sec"><p class="p-summary">${esc(g.summary)}</p></section>` : `<section class="p-sec"><p class="p-note">이 책의 해설은 아직 준비 중입니다.</p></section>`}
        ${g.events?.length ? `<section class="p-sec"><h2>주요 사건${story ? `<button class="b-story-sm" type="button" data-story="${esc(b.id)}">지도로 따라 읽기 →</button>` : ""}</h2><ol class="life">${g.events.map((e) => `
          <li class="${e.event ? "has-ev" : ""}"><span class="when">${esc(e.when || "")}</span>
          <div><p>${esc(e.text)}</p><span class="lref">${refBtn(e.ref)}${e.event && EVENT[e.event] ? `<button class="go-ev small" type="button" data-event="${esc(e.event)}">전시실 →</button>` : ""}</span></div></li>`).join("")}</ol></section>` : ""}
        ${g.themes?.length ? `<section class="p-sec"><h2>주제와 해석</h2><div class="b-themes">${g.themes.map((t) => `
          <article class="b-theme"><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p><div>${(t.refs || []).map(refBtn).join("")}</div></article>`).join("")}</div></section>` : ""}
        ${g.debates?.length ? `<section class="p-sec"><h2>해석이 갈리는 대목</h2>${g.debates.map((d) => `
          <article class="b-debate"><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p>
          <ul>${(d.views || []).map((v) => `<li><b>${esc(v.who)}</b>${esc(v.text)} ${srcTag(v.src)}</li>`).join("")}</ul></article>`).join("")}</section>` : ""}
        ${g.quotes?.length ? `<section class="p-sec"><h2>핵심 구절</h2>${g.quotes.map(quoteBlock).join("")}</section>` : ""}`;
  }

  // 배경 항목 하나: 제목, 때, 설명, 옛 문헌 인용, 견줄 장절, 출처
  const bgItem = (it) => `<article class="bg-item">
      <h4>${esc(it.title)}</h4>${it.when ? `<p class="bg-when">${esc(it.when)}</p>` : ""}
      <p>${esc(it.text)}</p>
      ${it.quote ? `<blockquote class="bg-quote"><p>${esc(it.quote.text)}</p><cite>${srcHTML(it.quote.src || "")}</cite></blockquote>` : ""}
      ${it.ref || it.refs?.length ? `<div class="bg-refs">${[it.ref, ...(it.refs || [])].filter(Boolean).map(refBtn).join("")}</div>` : ""}
      ${it.src?.length ? `<p class="bg-src">출처 · ${it.src.map(srcHTML).join(" · ")}</p>` : ""}
    </article>`;
  const bgKinds = (bg) => BG_KINDS.filter((k) => bg?.[k.key]?.length).map((k) => `
      <section class="p-sec bg-sec"><h2>${k.name}</h2><div class="bg-grid">${bg[k.key].map(bgItem).join("")}</div></section>`).join("");
  const sourceList = (ids) => (ids.length ? `<section class="p-sec"><h2>이 배경에 쓴 자료</h2><ul class="bg-sources">${ids.map((id) => {
      const s = SOURCES[id];
      return `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}<span>${esc(s.license)}</span></li>`;
    }).join("")}</ul></section>` : "");
  const eraChips = (eras) => eras.map((e) => `<button class="bg-era" type="button" data-era="${esc(e.id)}">${esc(e.name)} 시대 배경 →</button>`).join("");

  function bgMain(b) {
    const bg = BOOK_BG[b.id];
    const eras = erasOf(b);
    return `
        <section class="p-sec">
          ${eras.length ? `<p class="bg-eras"><b>이 책의 시대</b>${eraChips(eras)}</p>` : ""}
          ${bg?.summary ? `<p class="p-summary">${esc(bg.summary)}</p>` : `<p class="p-note">이 책의 당대 배경은 아직 준비 중입니다. 위의 시대 배경을 먼저 보세요.</p>`}
        </section>
        ${bgKinds(bg)}
        ${sourceList(usedSources([bg]))}`;
  }

  function eraHTML(e) {
    const bg = ERA_BG[e.id] || {};
    const idx = ERAS.indexOf(e);
    const prev = ERAS[idx - 1], next = ERAS[idx + 1];
    const books = BIBLE_BOOKS.filter((b) => overlaps(b, e));
    const emps = EMPIRES.filter((x) => overlaps(x, e));
    const evs = EVENTS.filter((ev) => ev.era === e.id);
    return `
      <aside class="p-side">
        <div class="p-hero">
          <p class="p-role">시대 배경</p>
          <h1>${esc(e.name)}</h1>
          <p class="p-years"><span>시대</span>${esc(range(e))} <em>전통 연대</em></p>
        </div>
        ${emps.length ? `<section class="p-card"><h3>이 시대의 제국</h3><ul class="bg-emps">${emps.map((x) => `<li><i style="background:${esc(x.color)}"></i><b>${esc(x.name)}</b><span>${esc(range(x))}</span></li>`).join("")}</ul></section>` : ""}
        ${books.length ? `<section class="p-card"><h3>이 시대를 다루거나 이때 쓴 책</h3><div class="b-people">${books.map((b) => `<button class="b-chip link" type="button" data-book="${esc(b.id)}.bg">${esc(b.name)}</button>`).join("")}</div></section>` : ""}
        ${debatesOf(e).length ? `<section class="p-card"><h3>이 시대의 논쟁</h3><ul class="b-links">${debatesOf(e).map((c) => `<li><button type="button" data-debate="${esc(c.id)}">${esc(c.title)} →</button><span>${c.from === c.to ? c.from : `${c.from}~${c.to}`}년</span></li>`).join("")}</ul></section>` : ""}
        ${evs.length ? `<section class="p-card"><h3>연표의 사건</h3><ul class="bg-evs">${evs.map((ev) => `<li><span>${esc(ev.yearLabel || yr(ev.year))}</span><button type="button" data-event="${esc(ev.id)}">${esc(ev.title)}</button></li>`).join("")}</ul></section>` : ""}
      </aside>
      <div class="p-main">
        <section class="p-sec">${bg.summary ? `<p class="p-summary">${esc(bg.summary)}</p>` : `<p class="p-note">이 시대의 배경은 아직 준비 중입니다.</p>`}</section>
        ${bgKinds(bg)}
        ${sourceList(usedSources([bg]))}
        <nav class="b-nav">${prev ? `<button type="button" data-era="${esc(prev.id)}">← ${esc(prev.name)}</button>` : "<span></span>"}<button type="button" data-library="1">66권 목록</button>${next ? `<button type="button" data-era="${esc(next.id)}">${esc(next.name)} →</button>` : "<span></span>"}</nav>
        <p class="p-foot">연도는 전통 연대를 따른 추정이다. 학설이 갈리는 곳은 양쪽을 함께 적었다. 옛 문헌 인용은 저작권이 끝난 번역에서 옮겼다.</p>
      </div>`;
  }

  function showVerse(btn) {
    const ref = btn.dataset.ref, parts = VERSES[ref];
    pop.innerHTML = `<b>${esc(ref)}</b>${parts ? parts.map(([k, t]) => `<p><sup>${esc(k.split(":")[1])}</sup>${esc(t)}</p>`).join("") : "<p>본문이 없습니다.</p>"}<small>개역한글</small>`;
    pop.hidden = false;
    pop.dataset.ref = ref;
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
    if (vref) { e.stopPropagation(); pop.hidden || pop.dataset.ref !== vref.dataset.ref ? showVerse(vref) : hidePop(); return; }
    if (!e.target.closest("#bpop")) hidePop();
    const st = e.target.closest("[data-story]");
    if (st) { onStory(st.dataset.story); return; }
    const db = e.target.closest("[data-debate]");
    if (db) { close(); onDebate(db.dataset.debate); return; }
    const tb = e.target.closest("[data-tab]");
    if (tb) { setTab(tb.dataset.tab); return; }
    const er = e.target.closest("[data-era]");
    if (er) { openEra(er.dataset.era); return; }
    const bk = e.target.closest("[data-book]");
    if (bk) { open(bk.dataset.book); return; }
    if (e.target.closest("[data-library]")) { open(null); return; }
    const per = e.target.closest("[data-person]");
    if (per && PROFILES[per.dataset.person]) { close(); onPerson(per.dataset.person); return; }
    const ev = e.target.closest("[data-event]");
    if (ev) { close(); onEvent(ev.dataset.event); }
  });
  scroll.addEventListener("scroll", hidePop, { passive: true });
  // 닫기는 바로 앞 화면으로 돌아간다(앞 화면이 이 사이트 밖이면 연표로).
  document.getElementById("bClose").addEventListener("click", () => onBack());

  // id 끝에 ".bg"를 붙이면 '당대 배경' 탭으로 연다(예: "genesis.bg").
  function open(id) {
    const [bid, tab] = String(id ?? "").split(".");
    const b = bid ? bookById[bid] : null;
    if (bid && !b) return;
    const nextTab = tab === "bg" ? "bg" : "guide";
    const key = b ? `b:${b.id}:${nextTab}` : "lib";
    current = b;
    currentTab = nextTab;
    show(key, () => (b ? bookHTML(b, currentTab) : libraryHTML()), b ? b.name : "66권 목록", b ? `#b-${b.id}${currentTab === "bg" ? ".bg" : ""}` : "#books", !b);
    // 휴대폰처럼 왼쪽 열이 위로 올라가는 폭에서는 배경 탭으로 열 때 탭 자리까지 내려 준다.
    if (b && currentTab === "bg" && matchMedia("(max-width: 900px)").matches) {
      const tabs = page.querySelector(".b-tabs");
      scroll.scrollTop = tabs.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 66;
    }
    onOpen(b, null);
  }

  function openEra(id) {
    const e = ERA[id];
    if (!e) return;
    current = null;
    show(`e:${e.id}`, () => eraHTML(e), `시대 배경 · ${e.name}`, `#e-${e.id}`, false);
    onOpen(null, e);
  }

  // key가 지금 그려 둔 화면과 같으면(앞 화면으로 돌아온 경우) 다시 그리지 않아 읽던 자리가 남는다.
  let shown = null;
  function show(key, html, name, hash, isLib) {
    hidePop();
    if (key !== shown) {
      shown = key;
      page.classList.toggle("is-lib", isLib);
      page.innerHTML = html();
      scroll.scrollTop = 0;
    }
    document.getElementById("bName").textContent = name;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    nav.push(hash);
  }

  // 오른쪽 열만 바꾼다. 탭이 화면 위로 지나갔으면 탭이 보이는 자리로 올린다.
  function setTab(tab) {
    if (!current || tab === currentTab) return;
    currentTab = tab;
    hidePop();
    document.getElementById("bPanel").innerHTML = tab === "bg" ? bgMain(current) : guideMain(current);
    page.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
    const tabs = page.querySelector(".b-tabs");
    if (tabs.getBoundingClientRect().top < scroll.getBoundingClientRect().top + 60) scroll.scrollTop += tabs.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 66;
    shown = `b:${current.id}:${tab}`;
    nav.replace(`#b-${current.id}${tab === "bg" ? ".bg" : ""}`);
  }

  function close() {
    if (!root.classList.contains("open")) return;
    hidePop();
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    onClose();
  }

  return { open, openEra, close, hidePop, isOpen: () => root.classList.contains("open"), popOpen: () => !pop.hidden, currentId: () => current?.id ?? null };
}
