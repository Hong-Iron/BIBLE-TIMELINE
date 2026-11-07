// 찾기 화면(#q-<검색어>). 머리의 돋보기, '/' 키, Ctrl·⌘+K로 연다.
// 사건, 인물(다른 이름 포함), 성경 66권, 책 속 장면(지도로 따라 읽기의 사건), 교회사 논쟁, 교리의 줄기, 시대를 한꺼번에 찾는다.
// 결과를 눌러 다른 화면으로 갔다가 돌아오면 검색어와 결과가 그대로 남는다.
import { EVENTS, PEOPLE, ERAS, PLACES } from "./shared/data.js";
import { BIBLE_BOOKS, BOOK_GROUPS } from "./shared/books.js";
import { PROFILES } from "./shared/profiles.js";
import { GUIDES } from "./shared/guides.js";
import { CONTROVERSIES, THEMES } from "./shared/controversies.js";
import { hasStory } from "./story.js";
import { nav } from "./nav.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s·・()「」『』'"‘’“”.,]/g, "");
const span = (a, b) => (a < 0 && b < 0 ? `기원전 ${-a}~${-b}년` : a < 0 ? `기원전 ${-a}년~기원후 ${b}년` : a === b ? `${a}년` : `${a}~${b}년`);

// 초성 찾기: 'ㄷㅇ'으로 '다윗'을 찾는다.
const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const choseong = (s) => [...String(s)].map((c) => { const k = c.charCodeAt(0) - 0xac00; return k >= 0 && k < 11172 ? CHO[Math.floor(k / 588)] : /\s/.test(c) ? "" : c; }).join("");
const isCho = (q) => /^[ㄱ-ㅎ]+$/.test(q);

// 찾을 거리 목록. names는 이름(가장 무겁게), more는 연도·장소·직분, text는 요약 글.
// go는 app.js가 열 화면: { kind, id, i? }
const KINDS = [
  { id: "event", name: "사건" },
  { id: "person", name: "인물" },
  { id: "book", name: "성경" },
  { id: "scene", name: "책 속 장면" },
  { id: "debate", name: "교회사 논쟁" },
  { id: "theme", name: "교리의 줄기" },
  { id: "era", name: "시대" },
];
let INDEX = null;
function buildIndex() {
  const out = [];
  const add = (kind, label, sub, names, more, text, go) =>
    out.push({ kind, label, sub, go, names: names.filter(Boolean).map(norm), cho: names.filter(Boolean).map(choseong), more: norm(more.filter(Boolean).join(" ")), text: norm(text) });
  for (const e of EVENTS) {
    const places = (e.route || []).map((id) => PLACES[id]?.name).filter(Boolean);
    add("event", e.title, [e.yearLabel, places.join(" → ")].filter(Boolean).join(" · "), [e.title, e.short], [e.yearLabel, e.book, ...places], e.summary, { kind: "event", id: e.id });
  }
  for (const p of PEOPLE) {
    const f = PROFILES[p.id] || {};
    add("person", p.name, [f.role, p.now ? `${p.from}년~지금` : span(p.from, p.to)].filter(Boolean).join(" · "), [p.name, ...(f.aliases || [])], [f.role, p.kind], f.summary, { kind: "person", id: p.id });
  }
  for (const b of BIBLE_BOOKS) {
    const g = BOOK_GROUPS.find((x) => x.id === b.group);
    add("book", b.name, [g?.testament, g?.name].filter(Boolean).join(" · "), [b.name, b.abbr, b.id], [g?.name], GUIDES[b.id]?.summary, { kind: "book", id: b.id });
  }
  for (const b of BIBLE_BOOKS) {
    if (!hasStory(b.id)) continue;
    GUIDES[b.id].events.forEach((e, i) => {
      add("scene", e.text, [b.name, e.ref, e.when].filter(Boolean).join(" · "), [], [b.name, e.ref, e.when], e.text, { kind: "scene", id: b.id, i });
    });
  }
  for (const c of CONTROVERSIES) {
    add("debate", c.title, `${span(c.from, c.to)} · ${c.question}`, [c.title, ...(c.aliases || [])], [`${c.from}`, `${c.to}`], [c.question, c.summary].join(" "), { kind: "debate", id: c.id });
  }
  for (const t of THEMES) add("theme", t.name, t.note, [t.name], [], t.summary, { kind: "theme", id: t.id });
  for (const e of ERAS) add("era", e.name, span(e.from, e.to), [e.name], [], "", { kind: "era", id: e.id });
  return out;
}

// 점수: 이름과 같음 100, 이름으로 시작 80, 이름에 들어 있음 60, 초성 50, 연도·장소·직분 40, 요약 글 20
function score(it, q, cho) {
  let s = 0;
  for (const n of it.names) s = Math.max(s, n === q ? 100 : n.startsWith(q) ? 80 : n.includes(q) ? 60 : 0);
  if (cho && it.cho.some((c) => c.includes(cho))) s = Math.max(s, 50);
  if (!s && it.more.includes(q)) s = 40;
  if (!s && it.text.includes(q)) s = 20;
  return s;
}

export function search(query, per = 8) {
  INDEX ??= buildIndex();
  const q = norm(query);
  if (!q) return [];
  const cho = isCho(q) ? q : null;
  // 책 속 장면은 글에서만 찾으므로 이름 점수가 없다. 글에 들어 있으면 30을 준다.
  const hits = INDEX.map((it) => ({ it, s: it.kind === "scene" ? (it.text.includes(q) ? 30 : 0) : score(it, q, cho) })).filter((h) => h.s > 0);
  // 묶음은 가장 잘 맞는 결과가 높은 차례로 놓는다(같으면 KINDS 차례). '루터'를 찾으면 인물이 사건보다 먼저 나온다.
  return KINDS.map((k, order) => {
    const list = hits.filter((h) => h.it.kind === k.id).sort((a, b) => b.s - a.s);
    return { kind: k, order, top: list[0]?.s ?? 0, total: list.length, items: list.slice(0, per).map((h) => h.it) };
  }).filter((g) => g.total).sort((a, b) => b.top - a.top || a.order - b.order);
}

export function createSearch({ onPick, onBack, onClose }) {
  const root = document.getElementById("find");
  const input = document.getElementById("fInput");
  const list = document.getElementById("fList");
  const scroll = document.getElementById("fScroll");
  let results = [], flat = [], active = 0, more = new Set();

  // 찾은 글자를 굵게 보인다(띄어쓰기를 무시하고 찾으므로 원문에 그대로 있을 때만).
  const mark = (s, q) => {
    const t = String(s), i = q ? t.toLowerCase().indexOf(q.toLowerCase()) : -1;
    return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`;
  };

  function render() {
    const q = input.value.trim();
    results = search(q, 200);
    flat = [];
    if (!q) {
      list.innerHTML = `<div class="f-empty"><p>사건, 인물, 성경 66권, 책 속 장면, 교회사 논쟁을 한꺼번에 찾습니다.</p>
        <p class="f-try">${["다윗", "출애굽", "바울", "칼케돈", "루터", "1517", "ㅇㄱㅅㅌ"].map((w) => `<button type="button" data-try="${esc(w)}">${esc(w)}</button>`).join("")}</p>
        <p class="f-tip">초성으로도 찾습니다(ㅇㄱㅅㅌ → 아우구스티누스). 해(1517)나 장소(에베소)로도 찾습니다.</p></div>`;
      return;
    }
    if (!results.length) { list.innerHTML = `<div class="f-empty"><p>'${esc(q)}'(으)로 찾은 것이 없습니다.</p></div>`; return; }
    list.innerHTML = results.map((g) => {
      const n = more.has(g.kind.id) ? g.items.length : Math.min(6, g.items.length);
      const rows = g.items.slice(0, n).map((it) => {
        const k = flat.push(it) - 1;
        return `<button class="f-row" type="button" data-k="${k}"><b>${mark(it.label, q)}</b>${it.sub ? `<small>${mark(it.sub, q)}</small>` : ""}</button>`;
      }).join("");
      const rest = g.total - n;
      return `<section class="f-group"><h3>${esc(g.kind.name)} <span>${g.total}</span></h3>${rows}
        ${rest > 0 && n < g.items.length ? `<button class="f-more" type="button" data-more="${esc(g.kind.id)}">${g.items.length - n}개 더 보기</button>` : ""}</section>`;
    }).join("");
    setActive(0);
  }

  function setActive(k) {
    if (!flat.length) return;
    active = (k + flat.length) % flat.length;
    list.querySelectorAll(".f-row").forEach((r) => r.classList.toggle("on", +r.dataset.k === active));
    list.querySelector(`.f-row[data-k="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }

  const pick = (k) => { const it = flat[k]; if (it) onPick(it.go); };

  let typing = 0;
  input.addEventListener("input", () => {
    more = new Set();
    render();
    // 주소는 잠깐 멈췄을 때 바꾼다(같은 화면이므로 기록을 쌓지 않는다).
    clearTimeout(typing);
    typing = setTimeout(() => nav.replace(`#q-${encodeURIComponent(input.value.trim())}`), 300);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") { e.preventDefault(); pick(active); }
    else if (e.key === "Escape") { e.preventDefault(); input.value ? ((input.value = ""), input.dispatchEvent(new Event("input"))) : onBack(); }
  });
  list.addEventListener("click", (e) => {
    const t = e.target.closest("[data-try]");
    if (t) { input.value = t.dataset.try; input.dispatchEvent(new Event("input")); input.focus(); return; }
    const m = e.target.closest("[data-more]");
    if (m) { more.add(m.dataset.more); render(); return; }
    const r = e.target.closest(".f-row");
    if (r) pick(+r.dataset.k);
  });
  document.getElementById("fClose").addEventListener("click", () => onBack());

  function open(q = "") {
    const same = root.classList.contains("open") && input.value.trim() === q;
    if (!same) { input.value = q; more = new Set(); render(); scroll.scrollTop = 0; }
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    nav.push(`#q-${encodeURIComponent(q)}`);
    // 휴대폰에서 돌아왔을 때 자판이 갑자기 뜨지 않도록, 검색어가 있으면 입력칸에 바로 들어가지 않는다.
    if (!q || matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true });
    else root.focus({ preventScroll: true });
  }

  function close() {
    if (!root.classList.contains("open")) return;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    input.blur();
    onClose();
  }

  return { open, close, isOpen: () => root.classList.contains("open") };
}
