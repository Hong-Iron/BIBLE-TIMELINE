import { RANGE, ERAS, EVENTS as ALL_EVENTS, PEOPLE, PLACES, STRENGTH, byId, yearsBetween } from "../shared/data.js";
// 비교용 시안은 처음 만든 표본 사건 11개만 보여 준다.
const EVENTS = ALL_EVENTS.filter((ev) => ev.sample);
import { createMap, THEMES } from "../shared/map.js";

const $ = (id) => document.getElementById(id);
const vp = $("vp"), track = $("track");
const people = byId(PEOPLE);
const credits = await (await fetch("../shared/credits.json")).json();
const mobile = matchMedia("(max-width: 700px)");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const shortYear = (y) => (y < 0 ? `기원전 ${-y}` : `기원후 ${y}`);

// 두루마리 위 배치: 시대 머리 → 그 시대 사건들. 사건이 없는 시대는 좁은 칸으로 남겨 비어 있다는 사실을 보인다.
function layout() {
  const slot = mobile.matches ? 300 : 400;
  const intro = mobile.matches ? 300 : 420;
  let x = intro;
  const items = [];
  for (const era of ERAS) {
    const evs = EVENTS.filter((e) => e.era === era.id);
    const headW = evs.length ? (mobile.matches ? 84 : 110) : (mobile.matches ? 70 : 90);
    items.push({ kind: "era", era, x, w: headW, empty: !evs.length });
    x += headW;
    for (const ev of evs) {
      items.push({ kind: "event", ev, x: x + slot / 2 });
      x += slot;
    }
  }
  return { items, width: x + 140, intro };
}

let L;
function render() {
  L = layout();
  track.style.width = `${L.width}px`;
  track.querySelector(".axis").style.left = `${L.intro}px`;
  track.querySelectorAll(":scope > :not(.axis)").forEach((n) => n.remove());
  const html = [`<div class="intro" style="left:0;width:${L.intro}px">
      <h2>성경을<br>옆으로 펼쳐 읽다</h2>
      <p>책과 사람과 사건을 한 줄 위에 놓고, 그 사건을 뒷받침하는 유물을 함께 봅니다.</p>
      <p class="hint">옆으로 넘기세요 →</p></div>`];
  let prev = null, flip = 0;
  for (const it of L.items) {
    if (it.kind === "era") {
      html.push(`<div class="era-head${it.empty ? " empty" : ""}" style="left:${it.x}px;width:${it.w}px" data-era="${it.era.id}">
        <span class="n">${esc(it.era.name)}</span><span class="y">${shortYear(it.era.from)} ~ ${shortYear(it.era.to)}</span></div>`);
      continue;
    }
    const ev = it.ev, up = flip++ % 2 === 0;
    const e0 = ev.evidence[0];
    if (prev) {
      const gap = yearsBetween(ev.year, prev.ev.year);
      html.push(`<div class="gap" style="left:${(prev.x + it.x) / 2}px">${gap.toLocaleString()}년 뒤</div>`);
    }
    html.push(`<div class="node" style="left:${it.x}px"></div>
      <div class="yr" style="left:${it.x}px">${esc(ev.yearLabel)}</div>
      <div class="stem" style="left:${it.x}px;${up ? "bottom:48%;height:40px" : "top:calc(52% + 42px);height:22px"}"></div>
      <button class="card ${up ? "up" : "down"}" style="left:${it.x}px" data-id="${ev.id}">
        <img src="../img/sm/${e0.img}.jpg" alt="${esc(e0.name)}" loading="lazy">
        <span>
          <h3>${esc(ev.title)}</h3>
          <span class="ref">${esc(ev.book)} · ${esc(ev.ref)}</span>
          <blockquote>${esc(ev.verse)}</blockquote>
          <span class="seal s-${e0.strength}">${STRENGTH[e0.strength].label}${ev.evidence.length > 1 ? ` 외 ${ev.evidence.length - 1}` : ""}</span>
        </span>
      </button>`);
    prev = it;
  }
  track.insertAdjacentHTML("beforeend", html.join(""));
  renderMini();
  syncView();
}

// 아래 띠: 실제 햇수 비율. 위 두루마리가 사건 간격이라 생기는 왜곡을 여기서 바로잡아 보여 준다.
const span = RANGE[1] - RANGE[0];
const pct = (y) => ((y - RANGE[0]) / span) * 100;
function renderMini() {
  $("mini").innerHTML =
    ERAS.map((e) => `<div class="seg" style="left:${pct(e.from)}%;width:${pct(e.to) - pct(e.from)}%;background:hsl(${e.hue} 45% 45%)" title="${esc(e.name)}"></div>`).join("") +
    EVENTS.map((e) => `<div class="tick" style="left:${pct(e.year)}%" title="${esc(e.title)}"></div>`).join("") +
    `<div class="win" id="win"></div>`;
}

function visibleYears() {
  const a = vp.scrollLeft, b = a + vp.clientWidth;
  const ys = [];
  for (const it of L.items) {
    if (it.kind === "event" && it.x >= a && it.x <= b) ys.push(it.ev.year);
    if (it.kind === "era" && it.x + it.w >= a && it.x <= b) ys.push(Math.max(it.era.from, RANGE[0]), Math.min(it.era.to, RANGE[1]));
  }
  return ys.length ? [Math.min(...ys), Math.max(...ys)] : [RANGE[0], RANGE[0] + 50];
}

function syncView() {
  const [y0, y1] = visibleYears();
  const win = $("win");
  win.style.left = `${pct(y0)}%`;
  win.style.width = `${Math.max(0.8, pct(y1) - pct(y0))}%`;
  const mid = vp.scrollLeft + vp.clientWidth / 2;
  let cur = ERAS[0].id;
  for (const it of L.items) if (it.kind === "era" && it.x <= mid) cur = it.era.id;
  document.querySelectorAll("#eras button").forEach((b) => b.classList.toggle("on", b.dataset.era === cur));
}

function scrollToX(x) {
  vp.scrollTo({ left: Math.max(0, x - vp.clientWidth / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

$("eras").innerHTML = ERAS.map((e) => `<button data-era="${e.id}">${esc(e.name)}</button>`).join("");
$("eras").addEventListener("click", (e) => {
  const id = e.target.dataset.era;
  if (!id) return;
  const it = L.items.find((i) => i.kind === "era" && i.era.id === id);
  scrollToX(it.x + vp.clientWidth / 2 - 40);
});

$("mini").addEventListener("click", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const year = RANGE[0] + ((e.clientX - r.left) / r.width) * span;
  const near = L.items.filter((i) => i.kind === "event").reduce((a, b) => (Math.abs(b.ev.year - year) < Math.abs(a.ev.year - year) ? b : a));
  scrollToX(near.x);
});

// 세로 휠을 가로 이동으로 바꾼다. 트랙패드의 가로 밀기는 그대로 둔다.
vp.addEventListener("wheel", (e) => {
  if (document.body.classList.contains("open")) return;
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    vp.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 32 : 1);
  }
}, { passive: false });
vp.addEventListener("scroll", () => requestAnimationFrame(syncView), { passive: true });
addEventListener("keydown", (e) => {
  if (document.body.classList.contains("open")) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    return;
  }
  if (e.key === "ArrowRight") vp.scrollBy({ left: 360, behavior: "smooth" });
  if (e.key === "ArrowLeft") vp.scrollBy({ left: -360, behavior: "smooth" });
});

// 펼침 패널
let map, openId = null;
const credit = (key) => {
  const c = credits[key];
  const lic = c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license);
  return `사진: ${esc(c.author)} · ${lic} · <a href="${esc(c.page)}" target="_blank" rel="noopener">원본</a>`;
};

async function open(id) {
  const ev = EVENTS.find((e) => e.id === id);
  openId = id;
  $("sheetYear").textContent = ev.yearLabel;
  $("sheetTitle").textContent = ev.title;
  $("verse").innerHTML = `${esc(ev.verse)}<cite>${esc(ev.book)} · ${esc(ev.ref)}</cite>`;
  $("summary").textContent = ev.summary;
  $("dateNote").textContent = `연대: ${ev.dateNote}`;
  $("people").innerHTML = ev.people.map((p) => `<span title="${people[p].kind} ${shortYear(people[p].from)}~${shortYear(people[p].to)}">${esc(people[p].name)}</span>`).join("");
  $("route").textContent = ev.route.map((r) => PLACES[r].name).join(" → ");
  $("evidence").innerHTML = ev.evidence.map((x) => `
    <article class="ev">
      <a href="../img/${x.img}.jpg" target="_blank" rel="noopener"><img src="../img/${x.img}.jpg" alt="${esc(x.name)}"></a>
      <div>
        <h5>${esc(x.name)}</h5>
        <div class="meta">${esc(x.madeLabel)} · ${esc(x.where)}<br>발견: ${esc(x.found)}</div>
        <span class="seal s-${x.strength}" title="${esc(STRENGTH[x.strength].desc)}">${STRENGTH[x.strength].label}</span>
        <p>${esc(x.says)}</p>
        <p class="warn">주의할 점: ${esc(x.caveat)}</p>
        <div class="credit">${credit(x.img)}</div>
      </div>
    </article>`).join("");
  document.body.classList.add("open");
  map ??= await createMap($("map"), THEMES.parchment);
  map.resize();
  map.show(ev);
  $("close").focus({ preventScroll: true });
}
function close() {
  document.body.classList.remove("open");
  const card = track.querySelector(`[data-id="${openId}"]`);
  card?.focus({ preventScroll: true });
}
function step(d) {
  const i = EVENTS.findIndex((e) => e.id === openId);
  const next = EVENTS[i + d];
  if (!next) return;
  open(next.id);
  scrollToX(L.items.find((it) => it.kind === "event" && it.ev.id === next.id).x);
}

track.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) open(card.dataset.id);
});
$("close").onclick = close;
$("sheetBg").onclick = close;
$("prev").onclick = () => step(-1);
$("next").onclick = () => step(1);

mobile.addEventListener("change", render);
addEventListener("resize", () => requestAnimationFrame(syncView));
render();
vp.focus({ preventScroll: true });

window.__bt = { open, close, scrollToX, layout: () => L };
