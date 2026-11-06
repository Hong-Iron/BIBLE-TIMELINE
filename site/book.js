// 성경 책 해설 화면. 머리의 '성경 66권' 단추, 연표의 책 막대, 전시실의 책 이름, 인물 프로필의 '등장하는 책'에서 연다.
// 책 id 없이 열면 66권 목록(갈래별)을 보여 준다. 레이아웃은 인물 프로필과 같은 .p-* 스타일을 쓴다.
import { PEOPLE, EVENTS, byId } from "./shared/data.js";
import { BIBLE_BOOKS, BOOK_GROUPS, bookById, bpUrl } from "./shared/books.js";
import { GUIDES } from "./shared/guides.js";
import { PROFILES } from "./shared/profiles.js";
import { VERSES } from "./shared/verses.js";
import { hasStory } from "./story.js";

const PERSON = byId(PEOPLE);
const EVENT = byId(EVENTS);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const yr = (y) => (y < 0 ? `기원전 ${-y}` : `기원후 ${y}`);
const range = (b) => (b.from === b.to ? `${yr(b.from)}년` : b.from < 0 && b.to < 0 ? `기원전 ${-b.from}~${-b.to}년` : b.from > 0 ? `기원후 ${b.from}~${b.to}년` : `${yr(b.from)}년~${yr(b.to)}년`);
const groupOf = (b) => BOOK_GROUPS.find((g) => g.id === b.group);
// '열왕기하 18~20장' 같은 글에서 책을 찾는다. 이름이 긴 책부터 맞춰 '요한복음'이 '요한'에 먼저 걸리지 않게 한다.
const BY_LEN = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
export const findBook = (text) => BY_LEN.find((b) => String(text).startsWith(b.name)) || null;

export function createBooks({ onEvent, onPerson, onStory, onOpen, onClose }) {
  const root = document.getElementById("book");
  const page = document.getElementById("bPage");
  const scroll = document.getElementById("bScroll");
  const pop = document.getElementById("bpop");
  let current = null;

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
      <p class="lib-lead">책마다 요약, 쓴 사람과 쓴 때, 책의 짜임, 주요 사건, 주제와 해석, 해석이 갈리는 대목, 핵심 구절을 모았습니다. 구절은 모두 개역한글입니다.</p>
      ${sec("구약")}${sec("신약")}
    </div>`;
  }

  function bookHTML(b) {
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
        ${g.summary ? `<section class="p-sec"><p class="p-summary">${esc(g.summary)}</p></section>` : `<section class="p-sec"><p class="p-note">이 책의 해설은 아직 준비 중입니다.</p></section>`}
        ${g.events?.length ? `<section class="p-sec"><h2>주요 사건${story ? `<button class="b-story-sm" type="button" data-story="${esc(b.id)}">지도로 따라 읽기 →</button>` : ""}</h2><ol class="life">${g.events.map((e) => `
          <li class="${e.event ? "has-ev" : ""}"><span class="when">${esc(e.when || "")}</span>
          <div><p>${esc(e.text)}</p><span class="lref">${refBtn(e.ref)}${e.event && EVENT[e.event] ? `<button class="go-ev small" type="button" data-event="${esc(e.event)}">전시실 →</button>` : ""}</span></div></li>`).join("")}</ol></section>` : ""}
        ${g.themes?.length ? `<section class="p-sec"><h2>주제와 해석</h2><div class="b-themes">${g.themes.map((t) => `
          <article class="b-theme"><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p><div>${(t.refs || []).map(refBtn).join("")}</div></article>`).join("")}</div></section>` : ""}
        ${g.debates?.length ? `<section class="p-sec"><h2>해석이 갈리는 대목</h2>${g.debates.map((d) => `
          <article class="b-debate"><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p>
          <ul>${(d.views || []).map((v) => `<li><b>${esc(v.who)}</b>${esc(v.text)} ${srcTag(v.src)}</li>`).join("")}</ul></article>`).join("")}</section>` : ""}
        ${g.quotes?.length ? `<section class="p-sec"><h2>핵심 구절</h2>${g.quotes.map(quoteBlock).join("")}</section>` : ""}
        <nav class="b-nav">${prev ? `<button type="button" data-book="${esc(prev.id)}">← ${esc(prev.name)}</button>` : "<span></span>"}<button type="button" data-library="1">66권 목록</button>${next ? `<button type="button" data-book="${esc(next.id)}">${esc(next.name)} →</button>` : "<span></span>"}</nav>
        <p class="p-foot">연도는 전통 연대를 따른 추정이다. 장절을 누르면 개역한글 본문이 보인다. 해석이 갈리는 대목은 어느 한쪽을 정답으로 고르지 않고 함께 적었다.</p>
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
    const bk = e.target.closest("[data-book]");
    if (bk) { open(bk.dataset.book); return; }
    if (e.target.closest("[data-library]")) { open(null); return; }
    const per = e.target.closest("[data-person]");
    if (per && PROFILES[per.dataset.person]) { close(); onPerson(per.dataset.person); return; }
    const ev = e.target.closest("[data-event]");
    if (ev) { close(); onEvent(ev.dataset.event); }
  });
  scroll.addEventListener("scroll", hidePop, { passive: true });
  document.getElementById("bClose").addEventListener("click", () => close());

  function open(id) {
    const b = id ? bookById[id] : null;
    if (id && !b) return;
    current = b;
    hidePop();
    page.classList.toggle("is-lib", !b);
    page.innerHTML = b ? bookHTML(b) : libraryHTML();
    scroll.scrollTop = 0;
    document.getElementById("bName").textContent = b ? b.name : "66권 목록";
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    history.replaceState(null, "", b ? `#b-${b.id}` : "#books");
    onOpen(b);
  }

  function close() {
    if (!root.classList.contains("open")) return;
    hidePop();
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    history.replaceState(null, "", location.pathname + location.search);
    onClose();
  }

  return { open, close, hidePop, isOpen: () => root.classList.contains("open"), popOpen: () => !pop.hidden, currentId: () => current?.id ?? null };
}
