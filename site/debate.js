// 교회사 화면: 교회사 목록(#church), 논쟁(#c-<id>), 교리의 줄기(#d-<주제>).
// 머리의 '교회사로 보기' 단추, 연표의 논쟁 막대, 전시실의 '논쟁 보기', 시대 배경의 '이 시대의 논쟁'에서 연다.
// 레이아웃은 책 해설과 같은 .p-* 스타일을 쓴다.
import { PEOPLE, EVENTS, ERAS, byId } from "./shared/data.js";
import { CONTROVERSIES, CONTROVERSY_SOURCES, TRADITIONS, THEMES } from "./shared/controversies.js";
import { SOURCES as BG_SOURCES } from "./shared/backgrounds.js";
import { CH_SOURCES } from "./shared/church_events.js";
import { PROFILES } from "./shared/profiles.js";
import { VERSES } from "./shared/verses.js";
import { nav } from "./nav.js";

const PERSON = byId(PEOPLE), EVENT = byId(EVENTS), ERA = byId(ERAS), KO = byId(CONTROVERSIES), THEME = byId(THEMES);
const SOURCES = { ...CH_SOURCES, ...CONTROVERSY_SOURCES, ...BG_SOURCES };
const CHURCH_ERAS = ERAS.filter((e) => e.from >= 30);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const years = (a, b) => (a === b ? `${a}년` : `${a}~${b}년`);
const splitSrc = (s) => { const i = String(s).indexOf(":"); return i < 0 ? [String(s).trim(), ""] : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; };
const srcHTML = (s) => {
  const [id, loc] = splitSrc(s), src = SOURCES[id];
  if (!src) return esc(s);
  const name = src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.name)}</a>` : esc(src.name);
  return `${name}${loc ? ` <span class="bg-loc">${esc(loc)}</span>` : ""}`;
};
const srcLine = (list) => (list?.length ? `<p class="bg-src">출처 · ${list.map(srcHTML).join(" · ")}</p>` : "");
const quoteHTML = (q) => (q ? `<blockquote class="bg-quote"><p>${esc(q.text)}</p><cite>${srcHTML(q.src || "")}</cite></blockquote>` : "");
const refBtn = (ref) => `<button class="vref" type="button" data-ref="${esc(ref)}">${esc(ref)}</button>`;
const personChip = (id) => (PERSON[id] ? `<button class="b-chip${PROFILES[id] ? " link" : ""}" type="button" data-person="${esc(id)}">${esc(PERSON[id].name)}</button>` : "");
const themeChip = (id) => (THEME[id] ? `<button class="db-theme" type="button" data-theme="${esc(id)}">${esc(THEME[id].name)}</button>` : "");
// 이 논쟁 문서에 쓴 출처 id(처음 나온 차례)
const usedSources = (c) => {
  const all = [...(c.src || []), ...(c.sides || []).flatMap((s) => [s.quote?.src]), c.decision?.quote?.src,
    ...TRADITIONS.flatMap((t) => c.positions?.[t.id]?.src || [])].filter(Boolean).map((s) => splitSrc(s)[0]);
  return [...new Set(all)].filter((id) => SOURCES[id]);
};

export function createDebates({ onEvent, onPerson, onEra, onBack, onOpen, onClose }) {
  const root = document.getElementById("debate");
  const page = document.getElementById("dPage");
  const scroll = document.getElementById("dScroll");
  const pop = document.getElementById("dpop");
  let shown = null;

  function libraryHTML() {
    const byEra = (e) => CONTROVERSIES.filter((c) => c.era === e.id);
    const card = (c) => `<button class="db-card" type="button" data-c="${esc(c.id)}"><b>${esc(c.title)}</b><small>${esc(years(c.from, c.to))}</small><span>${esc(c.question)}</span></button>`;
    return `<div class="lib">
      <p class="p-role">교회사 100년~오늘</p>
      <h1 class="lib-title">논쟁을 지나며 자라 온 교리</h1>
      <p class="lib-lead">초대 교회의 공의회부터 종교개혁, 근대 선교, 오늘의 교회 일치 운동과 최근 논쟁까지, 논쟁마다 쟁점, 쪽마다의 주장과 성경 근거, 교회의 결정, 그리고 오늘 각 교회의 입장을 나란히 적었습니다. 어느 쪽도 정답으로 고르지 않았습니다.</p>
      <section class="lib-eras"><h2>교회사 시대</h2><p>시대마다 그때의 제국, 교회의 중심지, 예배와 수도원, 글을 모았습니다.</p>
        <div class="lib-era-row">${CHURCH_ERAS.map((e) => `<button class="lib-era" type="button" data-era="${esc(e.id)}"><b>${esc(e.name)}</b><small>${esc(years(e.from, e.to))}</small></button>`).join("")}</div></section>
      <section class="lib-eras"><h2>교리의 줄기</h2><p>주제마다 논쟁을 시간 순서로 이어 봅니다.</p>
        <div class="lib-era-row">${THEMES.map((t) => `<button class="lib-era" type="button" data-theme="${esc(t.id)}"><b>${esc(t.name)}</b><small>논쟁 ${CONTROVERSIES.filter((c) => c.themes?.includes(t.id)).length}개</small></button>`).join("")}</div></section>
      <section class="lib-eras"><h2>입장을 적은 교회</h2>
        <ul class="db-trads">${TRADITIONS.map((t) => `<li><b>${esc(t.name)}</b><span>${esc(t.note)}</span></li>`).join("")}</ul></section>
      ${CHURCH_ERAS.filter((e) => byEra(e).length).map((e) => `<section class="lib-testament"><h2>${esc(e.name)} <small>${esc(years(e.from, e.to))}</small></h2><div class="db-grid">${byEra(e).map(card).join("")}</div></section>`).join("")}
    </div>`;
  }

  function debateHTML(c) {
    const era = ERA[c.era];
    const i = CONTROVERSIES.indexOf(c), prev = CONTROVERSIES[i - 1], next = CONTROVERSIES[i + 1];
    const people = (c.people || []).filter((id) => PERSON[id]);
    const events = (c.events || []).filter((id) => EVENT[id]);
    const links = (c.links || []).filter((l) => KO[l.id]);
    const pos = (t) => {
      const p = c.positions?.[t.id];
      if (!p) return "";
      return `<article class="db-pos-item"><h4>${esc(t.name)}</h4><p>${esc(p.text)}</p>
        ${p.parts?.length ? `<ul>${p.parts.map((x) => `<li><b>${esc(x.who)}</b>${esc(x.text)}</li>`).join("")}</ul>` : ""}${srcLine(p.src)}</article>`;
    };
    return `
      <aside class="p-side">
        <div class="p-hero">
          <p class="p-role">교회사 논쟁${era ? ` · ${esc(era.name)}` : ""}</p>
          <h1>${esc(c.title)}</h1>
          ${c.aliases?.length ? `<p class="p-alias">${esc(c.aliases.join(" · "))}</p>` : ""}
          <p class="p-years"><span>논쟁</span>${esc(years(c.from, c.to))}</p>
          <div class="db-themes">${(c.themes || []).map(themeChip).join("")}</div>
        </div>
        <section class="p-card"><h3>쟁점</h3><p class="db-q">${esc(c.question)}</p></section>
        ${people.length ? `<section class="p-card"><h3>사람</h3><div class="b-people">${people.map(personChip).join("")}</div></section>` : ""}
        ${events.length ? `<section class="p-card"><h3>연표의 사건</h3><ul class="bg-evs">${events.map((id) => `<li><span>${esc(EVENT[id].yearLabel || `${EVENT[id].year}년`)}</span><button type="button" data-event="${esc(id)}">${esc(EVENT[id].title)}</button></li>`).join("")}</ul></section>` : ""}
        ${links.length ? `<section class="p-card"><h3>이어진 논쟁</h3><ul class="b-links">${links.map((l) => `<li><button type="button" data-c="${esc(l.id)}">${esc(KO[l.id].title)} →</button><span>${esc(l.why || "")}</span></li>`).join("")}</ul></section>` : ""}
        ${era ? `<section class="p-card"><h3>시대 배경</h3><div class="b-people"><button class="bg-era" type="button" data-era="${esc(era.id)}">${esc(era.name)} 시대 배경 →</button></div></section>` : ""}
      </aside>
      <div class="p-main">
        <section class="p-sec"><p class="p-summary">${esc(c.summary)}</p></section>
        <section class="p-sec"><h2>주장</h2><div class="db-sides">${(c.sides || []).map((s) => `
          <article class="db-side"><h4>${esc(s.name)}</h4>
            ${s.people?.length ? `<div class="b-people">${s.people.map(personChip).join("")}</div>` : ""}
            <p>${esc(s.claim)}</p>${quoteHTML(s.quote)}
            ${s.refs?.length ? `<div class="bg-refs">${s.refs.map(refBtn).join("")}</div>` : ""}</article>`).join("")}</div></section>
        <section class="p-sec"><h2>결정</h2><div class="db-decision"><p>${esc(c.decision?.text)}</p>${quoteHTML(c.decision?.quote)}
          ${(c.decision?.events || []).filter((id) => EVENT[id]).map((id) => `<button class="go-ev" type="button" data-event="${esc(id)}">${esc(EVENT[id].title)} · 전시실 →</button>`).join("")}</div></section>
        <section class="p-sec"><h2>오늘 각 교회의 입장</h2><div class="db-pos">${TRADITIONS.map(pos).join("")}</div></section>
        ${usedSources(c).length ? `<section class="p-sec"><h2>이 논쟁에 쓴 자료</h2><ul class="bg-sources">${usedSources(c).map((id) => { const s = SOURCES[id]; return `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}<span>${esc(s.license)}</span></li>`; }).join("")}</ul></section>` : ""}
        <nav class="b-nav">${prev ? `<button type="button" data-c="${esc(prev.id)}">← ${esc(prev.title)}</button>` : "<span></span>"}<button type="button" data-church="1">교회사 목록</button>${next ? `<button type="button" data-c="${esc(next.id)}">${esc(next.title)} →</button>` : "<span></span>"}</nav>
        <p class="p-foot">어느 쪽도 정답으로 고르지 않고 함께 적었다. '정죄'는 어느 공의회나 교회가 내린 결정을 사실로 적은 것이다. 각 교회는 스스로 부르는 이름으로 적었다. 연도는 대략이다.</p>
      </div>`;
  }

  function themeHTML(t) {
    const list = CONTROVERSIES.filter((c) => c.themes?.includes(t.id));
    const first = (s) => String(s || "").split(/(?<=[.다])\s/)[0];
    return `
      <aside class="p-side">
        <div class="p-hero"><p class="p-role">교리의 줄기</p><h1>${esc(t.name)}</h1><p class="p-alias">${esc(t.note)}</p></div>
        <section class="p-card"><h3>다른 줄기</h3><div class="b-people">${THEMES.filter((x) => x !== t).map((x) => themeChip(x.id)).join("")}</div></section>
      </aside>
      <div class="p-main">
        ${t.summary ? `<section class="p-sec"><p class="p-summary">${esc(t.summary)}</p></section>` : ""}
        <section class="p-sec"><h2>논쟁의 차례</h2><ol class="life">${list.map((c) => `
          <li class="has-ev"><span class="when">${esc(years(c.from, c.to))}</span>
          <div><p><b>${esc(c.title)}</b> · ${esc(c.question)}</p><p class="db-dec">${esc(first(c.decision?.text))}</p>
          <span class="lref"><button class="go-ev small" type="button" data-c="${esc(c.id)}">논쟁 보기 →</button></span></div></li>`).join("")}</ol></section>
        <nav class="b-nav"><span></span><button type="button" data-church="1">교회사 목록</button><span></span></nav>
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
    if (!e.target.closest("#dpop")) hidePop();
    const k = e.target.closest("[data-c]");
    if (k) { open(k.dataset.c); return; }
    const th = e.target.closest("[data-theme]");
    if (th) { openTheme(th.dataset.theme); return; }
    if (e.target.closest("[data-church]")) { open(null); return; }
    const er = e.target.closest("[data-era]");
    if (er) { close(); onEra(er.dataset.era); return; }
    const per = e.target.closest("[data-person]");
    if (per && PROFILES[per.dataset.person]) { close(); onPerson(per.dataset.person); return; }
    const ev = e.target.closest("[data-event]");
    if (ev) { close(); onEvent(ev.dataset.event); }
  });
  scroll.addEventListener("scroll", hidePop, { passive: true });
  document.getElementById("dClose").addEventListener("click", () => onBack());

  // key가 지금 그려 둔 화면과 같으면(앞 화면으로 돌아온 경우) 다시 그리지 않아 읽던 자리가 남는다.
  function show(key, html, name, hash, isLib, at) {
    hidePop();
    if (key !== shown) {
      shown = key;
      page.classList.toggle("is-lib", isLib);
      page.innerHTML = html();
      scroll.scrollTop = 0;
    }
    document.getElementById("dName").textContent = name;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    nav.push(hash);
    onOpen(at);
  }

  // id 없이 열면 교회사 목록
  function open(id) {
    const c = id ? KO[id] : null;
    if (id && !c) return;
    show(c ? `c:${c.id}` : "lib", () => (c ? debateHTML(c) : libraryHTML()), c ? c.title : "교회사", c ? `#c-${c.id}` : "#church", !c, c);
  }
  function openTheme(id) {
    const t = THEME[id];
    if (!t) return;
    show(`d:${t.id}`, () => themeHTML(t), `교리의 줄기 · ${t.name}`, `#d-${t.id}`, false, null);
  }
  function close() {
    if (!root.classList.contains("open")) return;
    hidePop();
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    onClose();
  }

  return { open, openTheme, close, hidePop, isOpen: () => root.classList.contains("open"), popOpen: () => !pop.hidden };
}
