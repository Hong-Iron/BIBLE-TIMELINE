// 지도로 따라 읽기. 책 해설의 주요 사건을 위에서 아래로 내려 읽으면, 왼쪽(휴대폰에서는 위쪽) 지도가 그 사건의 장소로 옮겨 간다.
// 사건의 장소는 해설의 at → 이어진 전시실 사건의 route → 책의 배경(home) 순서로 찾는다.
// 교회사는 책이 없으므로 교회사 사건 전체를 해 순서대로 잇는 '교회사'(#s-church)를 하나의 책처럼 읽는다.
import { EVENTS, PLACES, byId } from "./shared/data.js";
import { BIBLE_BOOKS, BOOK_GROUPS, bookById, bookByName } from "./shared/books.js";
import { GUIDES as BOOK_GUIDES } from "./shared/guides.js";
import { SOURCES as BASE_SOURCES } from "./shared/sources.js";
import { CH_EVENTS, CH_SOURCES } from "./shared/church_events.js";
import { VERSES } from "./shared/verses.js";
import { createMap, THEMES } from "./shared/map.js";
import { nav } from "./nav.js";

const EVENT = byId(EVENTS);
const SRC_NAME = { ...CH_SOURCES, ...BASE_SOURCES };
const CHURCH_IDS = new Set(CH_EVENTS.map((e) => e.id));
const CHURCH = { id: "church", name: "교회사" };
const GUIDES = {
  ...BOOK_GUIDES,
  church: {
    summary: "박해 속의 교부들부터 공의회, 동서 교회의 갈라짐, 종교개혁, 근대 선교와 한국 교회, 오늘의 교회까지 교회사 사건을 해 순서대로 따라갑니다.",
    events: EVENTS.filter((e) => CHURCH_IDS.has(e.id)).sort((a, b) => a.year - b.year).map((e) => ({ text: e.title, when: e.yearLabel, event: e.id })),
  },
};
const bookOf = (id) => (id === "church" ? CHURCH : bookById[id]);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const nameOf = (id) => PLACES[id].name;

// 사건 하나가 지도에 보여 줄 장소. src는 장소를 어디서 얻었는지(at · event · home)다.
function placesOf(e, g) {
  const at = (e.at || []).filter((id) => PLACES[id]);
  if (at.length) return { ids: at, move: !!e.move && at.length > 1, src: "at" };
  const ev = e.event && EVENT[e.event];
  if (ev?.route?.length) return { ids: ev.route, move: ev.route.length > 1, src: "event" };
  return { ids: (g.home?.at || []).filter((id) => PLACES[id]), move: false, src: "home" };
}

// 이 책을 지도로 따라 읽을 수 있는가: 장소가 있는 사건이 하나라도 있어야 한다.
export const hasStory = (id) => (GUIDES[id]?.events || []).some((e) => placesOf(e, GUIDES[id]).ids.length);

// 연표의 사건에서 따라 읽기를 시작할 책과 사건 차례. 지도를 눌렀을 때 지금 보던 사건부터 읽게 한다.
// 1) 교회사 사건이면 교회사. 2) 해설이 이 사건을 가리키는 책(여럿이면 사건의 책, 없으면 정경 순서로 첫 책).
// 3) 해설과 이어지지 않은 사건은 구절이 있는 책에서 장이 가장 가까운 사건.
function startOf(ev) {
  if (!ev) return null;
  if (CHURCH_IDS.has(ev.id)) return { id: "church", i: GUIDES.church.events.findIndex((e) => e.event === ev.id) };
  const hits = [];
  for (const b of BIBLE_BOOKS) if (hasStory(b.id)) GUIDES[b.id].events.forEach((e, i) => { if (e.event === ev.id) hits.push({ id: b.id, i }); });
  if (hits.length) return hits.find((h) => h.id === bookByName[ev.book]?.id) || hits[0];
  const m = String(ev.ref || "").match(/^([가-힣]+)\s+(\d+)/);
  const b = (m && BIBLE_BOOKS.find((x) => x.abbr === m[1])) || bookByName[ev.book];
  if (!b || !hasStory(b.id)) return null;
  const g = GUIDES[b.id], ch = m ? +m[2] : 0;
  let best = -1, gap = Infinity;
  g.events.forEach((e, i) => {
    const c = +(String(e.ref || "").match(/(\d+):/)?.[1] ?? NaN);
    if (placesOf(e, g).ids.length && Math.abs(c - ch) < gap) { gap = Math.abs(c - ch); best = i; }
  });
  return { id: b.id, i: Math.max(0, best) };
}

export function createStory({ onEvent, onBack, onClose }) {
  const root = document.getElementById("story");
  const scroll = document.getElementById("sScroll");
  const list = document.getElementById("sSteps");
  const cap = document.getElementById("sCap");
  const bar = document.getElementById("sBar");
  let book = null, steps = [], active = -1, map = null, mapLoading = null, ticking = false;

  function stepHTML(s, i) {
    const e = s.e;
    const ev = e.event && EVENT[e.event];
    const when = e.when || ev?.yearLabel || "";
    const verse = (VERSES[e.ref] || []).map(([, t]) => t).join(" ");
    // 교회사 사건은 성경 구절 대신 그 사건을 전하는 옛 문헌 한두 줄을 싣는다.
    const src = !e.ref && ev?.source;
    const srcName = src && (() => { const t = src.src || "", k = t.indexOf(":"), id = (k < 0 ? t : t.slice(0, k)).trim(); return `${SRC_NAME[id]?.name || id}${k < 0 ? "" : ` · ${t.slice(k + 1).trim()}`}`; })();
    const where = s.p.ids.length
      ? s.p.src === "home"
        ? `<p class="st-where home"><b>책의 배경</b>${esc(GUIDES[book.id].home?.label || s.p.ids.map(nameOf).join(" · "))}</p>`
        : `<p class="st-where"><b>${s.p.move ? "이동" : "장소"}</b>${esc(s.p.ids.map(nameOf).join(s.p.move ? " → " : " · "))}</p>`
      : "";
    return `<article class="st-step" data-i="${i}">
      <div class="st-meta"><span class="st-no">${String(i + 1).padStart(2, "0")}</span>${when ? `<span class="st-when">${esc(when)}</span>` : ""}</div>
      <p class="st-text">${esc(e.text)}</p>
      ${where}
      ${verse ? `<blockquote class="st-verse"><p>${esc(verse)}</p><cite>${esc(e.ref)} · 개역한글</cite></blockquote>`
        : src ? `<blockquote class="st-verse"><p>${esc(src.text)}</p><cite>${esc(srcName)}</cite></blockquote>` : e.ref ? `<p class="st-ref">${esc(e.ref)}</p>` : ""}
      ${ev ? `<button class="go-ev" type="button" data-event="${esc(ev.id)}">전시실에서 증거 보기 →</button>` : ""}
    </article>`;
  }

  function render() {
    const g = GUIDES[book.id] || {};
    const grp = BOOK_GROUPS.find((x) => x.id === book.group);
    const church = book === CHURCH;
    // 교회사는 성경 맨 뒤에 이어 붙인다(이전 = 지도로 따라 읽을 수 있는 마지막 책).
    const idx = church ? BIBLE_BOOKS.length : BIBLE_BOOKS.indexOf(book);
    // 앞뒤 책 가운데 지도로 따라 읽을 수 있는 가장 가까운 책
    const near = (dir) => { for (let i = idx + dir; i >= 0 && i < BIBLE_BOOKS.length; i += dir) if (hasStory(BIBLE_BOOKS[i].id)) return BIBLE_BOOKS[i]; return null; };
    const prev = near(-1), next = church ? null : near(1) || CHURCH;
    list.innerHTML = `
      <header class="st-intro">
        <p class="p-role">${church ? "교회사 · 기원후 100년~오늘" : `${esc(grp?.testament)} · ${esc(grp?.name)}`}</p>
        <h1>${esc(book.name)}</h1>
        ${g.summary ? `<p class="st-sum">${esc(g.summary)}</p>` : ""}
        <p class="st-hint">아래로 내리면 사건 ${steps.length}개를 차례로 따라가며 지도가 그 장소로 옮겨 갑니다. <span class="st-key">↑ ↓</span> 키로도 넘길 수 있습니다.</p>
        <ul class="st-legend"><li><i class="dot"></i>지금 사건의 장소</li><li><i class="trail"></i>앞에서 지나온 곳</li><li><i class="land"></i>도시가 아닌 땅·지방</li><li><i class="line"></i>옮겨 간 길</li></ul>
      </header>
      ${steps.map(stepHTML).join("")}
      <footer class="st-end">
        <p>${esc(book.name)}의 주요 사건을 모두 따라왔습니다.</p>
        <nav>${prev ? `<button type="button" data-story="${esc(prev.id)}">← ${esc(prev.name)}</button>` : "<span></span>"}<button type="button" data-back="1">돌아가기</button>${next ? `<button type="button" data-story="${esc(next.id)}">${esc(next.name)} →</button>` : "<span></span>"}</nav>
      </footer>`;
  }

  // 스크롤 영역의 위에서 40% 지점(휴대폰처럼 영역이 낮으면 12%)을 지난 마지막 사건이 지금 사건이다. 사건 사이 빈칸에서는 앞 사건을 그대로 둔다.
  const lineAt = () => scroll.clientHeight * (scroll.clientHeight < 560 ? 0.12 : 0.4);
  function pick() {
    ticking = false;
    const line = scroll.getBoundingClientRect().top + lineAt();
    const cards = list.querySelectorAll(".st-step");
    let i = 0;
    cards.forEach((c, k) => { if (c.getBoundingClientRect().top <= line) i = k; });
    // 맨 끝까지 내렸으면 마지막 사건
    if (scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 4) i = cards.length - 1;
    setActive(i);
  }

  function setActive(i) {
    if (i === active || !steps[i]) return;
    active = i;
    list.querySelectorAll(".st-step").forEach((c, k) => c.classList.toggle("on", k === i));
    const s = steps[i];
    bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    const trail = [...new Set(steps.slice(0, i).flatMap((t) => (t.p.src === "home" ? [] : t.p.ids)))];
    // 장소가 다섯 곳 이상이면 앞의 세 곳만 쓰고 나머지는 개수로 줄인다. 책의 배경이면 배경 설명을 쓴다.
    const names = s.p.ids.map(nameOf), sep = s.p.move ? " → " : " · ";
    const shown = names.length > 4 ? `${names.slice(0, 3).join(sep)} 외 ${names.length - 3}곳` : names.join(sep);
    const home = s.p.src === "home";
    cap.innerHTML = `<small>${String(i + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}${s.e.when ? ` · ${esc(s.e.when)}` : ""}</small>
      <b>${esc(home ? GUIDES[book.id].home?.label || shown : shown || "장소를 특정할 수 없음")}</b>
      ${home ? `<span>책의 배경</span>` : ""}`;
    if (map && s.p.ids.length) map.show({ route: s.p.ids, noLine: !s.p.move, trail });
  }

  function go(i, smooth = true) {
    const c = list.querySelectorAll(".st-step")[i];
    if (!c) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = c.offsetTop - lineAt() + 16;
    scroll.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? "smooth" : "auto" });
  }

  scroll.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }, { passive: true });
  root.addEventListener("click", (e) => {
    const ev = e.target.closest("[data-event]");
    if (ev) { const id = ev.dataset.event; close(); onEvent(id); return; }
    const st = e.target.closest("[data-story]");
    if (st) { open(st.dataset.story); return; }
    if (e.target.closest("[data-back]")) { onBack(); return; }
    const card = e.target.closest(".st-step");
    if (card && !e.target.closest(".st-verse")) go(+card.dataset.i);
    const q = e.target.closest(".st-verse");
    if (q) q.classList.toggle("full");
  });
  document.getElementById("sClose").addEventListener("click", () => onBack());

  // at: 처음 보여 줄 사건 차례(연표에서 보던 사건부터 읽을 때). 없으면 맨 앞부터.
  async function open(id, at = null) {
    const b = bookOf(id);
    if (!b || !hasStory(id)) return false;
    // 같은 책으로 돌아오면(전시실에 갔다가 돌아온 경우) 읽던 사건과 지도를 그대로 둔다.
    const same = book === b && list.childElementCount;
    book = b;
    if (!same) {
      const g = GUIDES[id];
      steps = (g.events || []).map((e) => ({ e, p: placesOf(e, g) }));
      active = -1;
      render();
      scroll.scrollTop = 0;
    }
    document.getElementById("sName").textContent = b.name;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.focus({ preventScroll: true });
    nav.push(`#s-${b.id}`);
    if (same) { if (at != null) { go(at, false); pick(); } return true; }
    // 지도는 처음 열 때 한 번 만든다. 아래 왼쪽 설명 상자 자리에는 바탕 지명을 놓지 않는다.
    mapLoading ??= createMap(document.getElementById("sMap"), THEMES.atlas, {
      labels: true, pad: 0.55, minSpan: 6.5, reserve: (w, h) => [[0, h - cap.offsetHeight - 22, cap.offsetWidth + 24, cap.offsetHeight + 22]],
    }).then((m) => (map = m));
    await mapLoading;
    if (book !== b) return true;
    const first = (at != null && steps[at]?.p.ids.length ? steps[at] : null) || steps.find((s) => s.p.ids.length);
    if (first) map.show({ route: first.p.ids, noLine: !first.p.move, trail: [] }, { instant: true });
    active = -1;
    if (at != null) go(at, false);
    pick();
    return true;
  }

  // 연표에서 보던 사건부터 읽는다. 시작할 책이 없으면 false.
  const openAt = (evId) => { const s = startOf(EVENT[evId]); return s ? open(s.id, s.i) : false; };

  function close() {
    if (!root.classList.contains("open")) return;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    onClose(book);
  }

  const step = (d) => go(Math.max(0, Math.min(steps.length - 1, (active < 0 ? 0 : active) + d)));
  return { open, openAt, canOpenAt: (evId) => !!startOf(EVENT[evId]), close, step, isOpen: () => root.classList.contains("open") };
}
