// 결합안 · 연표와 전시실: 시안 C의 실제 비율 연표 위에 제국·시대·책·인물·사건·증거를 나란히 놓고,
// 사건이나 유물을 누르면 시안 B의 어두운 전시실을 화면 가득 연다.
// 화면은 가로로 넓은 '트랙'을 스크롤하고, 그림은 화면 폭만 한 SVG 하나에 그때그때 다시 그린다.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { RANGE, ERAS, EMPIRES, PEOPLE, BOOKS, EVENTS, STRENGTH, PLACES, byId, yearText, yearsBetween } from "../shared/data.js";
import { createMap, THEMES } from "../shared/map.js";
import { createProfiles } from "./profile.js";

const SPAN = RANGE[1] - RANGE[0];
const PERSON = byId(PEOPLE);
const ERA = byId(ERAS);
const SHORT = {
  "abraham-call": "아브라함 떠남", exodus: "출애굽", "david-king": "다윗 즉위", "mesha-revolt": "메사 반란",
  jehu: "예후 즉위", sennacherib: "산헤립 침공", "jehoiachin-exile": "여호야긴 포로", "cyrus-decree": "고레스 칙령",
  "isaiah-scroll": "이사야서 사본", crucifixion: "십자가", "paul-corinth": "바울 재판",
};
const S_COLOR = { direct: "#c2410c", indirect: "#b7791f", context: "#8b867c", manuscript: "#2f6f8f" };
const OFFICE = new Set(["재위", "총독", "대제사장"]);
const UI_FONT = `"Pretendard Variable", Pretendard, -apple-system, sans-serif`;

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const eraColor = (h, l = 88, s = 42) => `hsl(${h} ${s}% ${l}%)`;

const ctx2d = document.createElement("canvas").getContext("2d");
const tw = (text, size = 11, weight = 500) => ((ctx2d.font = `${weight} ${size}px ${UI_FONT}`), ctx2d.measureText(text).width);

// 증거를 사건과 묶어 한 줄로 편다. 옛 사본은 그 책이 다루는 시기 끝에도 이어 준다.
const EVID = EVENTS.flatMap((ev) => ev.evidence.map((e, i) => ({ ...e, ev, i, key: `${ev.id}:${i}` })))
  .sort((a, b) => a.madeYear - b.madeYear);
const bookOf = (name) => BOOKS.find((b) => b.name === name);

function gapText(made, at) {
  const d = made - at, n = yearsBetween(made, at);
  if (n <= 10) return "같은 때";
  return `${n >= 100 ? `약 ${Math.round(n / 10) * 10}` : n}년 ${d > 0 ? "뒤" : "앞"}`;
}

function rangeText(a, b) {
  if (a < 0 && b < 0) return `기원전 ${-a}~${-b}년`;
  if (a > 0 && b > 0) return `기원후 ${a}~${b}년`;
  return `기원전 ${-a}년~기원후 ${b}년`;
}

// 겹치지 않게 줄을 나눈다(앞에서부터 들어갈 수 있는 첫 줄).
function pack(items, gapYears) {
  const ends = [];
  const out = items.map((it) => ({ ...it })).sort((a, b) => a.from - b.from);
  for (const it of out) {
    let r = ends.findIndex((end) => end + gapYears <= it.from);
    if (r < 0) { r = ends.length; ends.push(it.to); } else ends[r] = it.to;
    it.row = r;
  }
  return { rows: ends.length, items: out };
}
const BOOK_PACK = pack(BOOKS, 0);
const PEOPLE_PACK = pack(PEOPLE, 8);

const state = {
  ppy: 2, viewW: 1000, viewH: 400, center: EVENTS[0].year, mobile: false,
  selected: null, near: null, mapEv: null, focusKey: null, person: null,
};
let L = {}; // 차선 위치
let map = null, credits = {};

/* ---------- 차선 배치 ---------- */
function layout() {
  const m = state.mobile;
  const d = {
    axis: 26, gap: m ? 6 : 8, emp: m ? 18 : 20, era: m ? 20 : 22, bookRow: m ? 16 : 17, personRow: m ? 19 : 21,
    evRow: m ? 15 : 16, evRows: 3, band: m ? 46 : 54, thumb: m ? 34 : 42, labelW: m ? 52 : 96,
  };
  let y = d.axis + d.gap;
  const lane = (name, h) => { const top = y; y += h + d.gap; return { top, h, name }; };
  L = { d };
  L.emp = lane("제국", d.emp);
  L.era = lane("시대", d.era);
  L.book = lane("성경 책", BOOK_PACK.rows * d.bookRow);
  L.person = lane("인물", PEOPLE_PACK.rows * d.personRow);
  L.ev = lane("사건", d.evRows * d.evRow + 12);
  L.band = { top: y - d.gap, h: d.band };
  y = L.band.top + d.band;
  // 연표가 오른쪽 열의 높이를 다 쓰도록, 남는 높이만큼 유물 사진 칸(전시 품목)을 키운다. 사진 두 줄이라 2로 나눈다.
  const avail = scroller.clientHeight || 0;
  d.thumb = clamp(Math.floor((avail - y - 12 - 16) / 2) - 8, d.thumb, m ? 64 : 96);
  L.evid = { top: y, h: 2 * (d.thumb + 8) + 6, name: "증거" };
  L.height = L.evid.top + L.evid.h + 6;
  document.body.style.setProperty("--chart-h", `${L.height + 1}px`);
}

const X = (year) => (year - state.center) * state.ppy + state.viewW / 2;
const leftEdge = () => L.d.labelW + 6;

/* ---------- 그리기 ---------- */
const svg = d3.select("#svg");
const G = {};
["grid", "axis", "seps", "emp", "era", "book", "person", "arcs", "pins", "ev", "gaps", "thumbs"].forEach((k) => (G[k] = svg.append("g").attr("class", k)));

function niceStep() {
  const steps = [5, 10, 25, 50, 100, 250, 500];
  return steps.find((s) => s * state.ppy >= (state.mobile ? 62 : 74)) ?? 500;
}

function tickLabel(y) {
  if (y === 0) return "기원전 | 기원후";
  return y < 0 ? `기원전 ${-y}` : `기원후 ${y}`;
}

// 띠 안에 이름을 넣되, 띠가 화면 왼쪽으로 반쯤 나가 있으면 이름을 보이는 쪽으로 끌어온다.
function stickyLabelX(xa, xb, w, pad = 7) {
  const x = Math.max(xa, leftEdge()) + pad;
  if (x + w + pad > xb) return xb - xa >= w + pad * 2 ? xb - w - pad : null;
  return x;
}

function render() {
  const { d } = L;
  const W = state.viewW, H = L.height;
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
  const vis = (a, b) => X(b) > -40 && X(a) < W + 40;
  const sel = state.selected;
  const selPeople = new Set(sel ? sel.people : []);
  if (state.person) selPeople.add(state.person);

  // 눈금과 세로 격자
  const step = niceStep();
  const y0 = Math.ceil((state.center - W / 2 / state.ppy) / step) * step;
  const ticks = d3.range(y0, state.center + W / 2 / state.ppy + step, step).filter((t) => t >= RANGE[0] && t <= RANGE[1]);
  G.grid.selectAll("line").data(ticks, (t) => t).join("line")
    .attr("class", (t) => (t === 0 ? "zero" : null))
    .attr("x1", X).attr("x2", X).attr("y1", d.axis).attr("y2", H);
  G.axis.selectAll("g").data(ticks, (t) => t).join((e) => {
    const g = e.append("g");
    g.append("line").attr("y1", d.axis - 5).attr("y2", d.axis);
    g.append("text").attr("y", d.axis - 10).attr("text-anchor", "middle");
    return g;
  }).attr("transform", (t) => `translate(${X(t)},0)`).select("text").text(tickLabel);

  const seps = [d.axis, L.emp.top - d.gap / 2, L.book.top - d.gap / 2, L.person.top - d.gap / 2, L.ev.top - d.gap / 2, L.evid.top];
  G.seps.selectAll("line").data(seps).join("line").attr("class", "sep").attr("x1", 0).attr("x2", W).attr("y1", (y) => Math.round(y) + 0.5).attr("y2", (y) => Math.round(y) + 0.5);

  // 제국 띠와 시대 띠
  const bands = (g, data, top, h, fill, stroke, text, label) => {
    const items = data.filter((b) => vis(b.from, b.to));
    g.selectAll("g.b").data(items, (b) => b.name).join((e) => {
      const gg = e.append("g").attr("class", "b");
      gg.append("rect").attr("rx", 3);
      gg.append("text").attr("class", "band-label");
      gg.append("title");
      return gg;
    }).each(function (b) {
      const xa = X(b.from), xb = X(b.to);
      const gg = d3.select(this);
      gg.select("rect").attr("x", xa + 0.5).attr("y", top + 0.5).attr("width", Math.max(1, xb - xa - 1)).attr("height", h - 1)
        .attr("fill", fill(b)).attr("stroke", stroke(b));
      const w = tw(label(b), 11, 600);
      const lx = stickyLabelX(xa, xb, w);
      gg.select("text").attr("x", lx ?? 0).attr("y", top + h / 2 + 4).attr("fill", text(b)).style("display", lx == null ? "none" : null).text(label(b));
      gg.select("title").text(`${label(b)} · ${rangeText(b.from, b.to)}`);
    });
  };
  bands(G.emp, EMPIRES, L.emp.top, d.emp, (b) => hexA(b.color, 0.15), (b) => hexA(b.color, 0.4), (b) => darken(b.color), (b) => b.name);
  bands(G.era, ERAS, L.era.top, d.era, (b) => eraColor(b.hue), (b) => eraColor(b.hue, 72, 30), (b) => eraColor(b.hue, 27, 35), (b) => b.name);

  // 성경 책: 다루는 시기
  const books = BOOK_PACK.items.filter((b) => vis(b.from, b.to));
  G.book.selectAll("g.book").data(books, (b) => b.name).join((e) => {
    const g = e.append("g").attr("class", "book");
    g.append("rect").attr("rx", 3);
    g.append("text");
    g.append("title");
    return g;
  }).classed("on", (b) => sel && sel.book === b.name).each(function (b) {
    const g = d3.select(this);
    const top = L.book.top + b.row * d.bookRow;
    const xa = X(b.from), xb = X(b.to);
    g.select("rect").attr("x", xa).attr("y", top + 1.5).attr("width", Math.max(2, xb - xa)).attr("height", d.bookRow - 3);
    const w = tw(b.name, 10.5, 500);
    let lx = stickyLabelX(xa, xb, w, 6);
    if (lx == null) {
      const next = BOOK_PACK.items.filter((o) => o.row === b.row && o.from >= b.to).sort((p, q) => p.from - q.from)[0];
      lx = !next || X(next.from) - xb > w + 10 ? xb + 4 : null;
    }
    g.select("text").attr("x", lx ?? 0).attr("y", top + d.bookRow / 2 + 3.5).style("display", lx == null ? "none" : null).text(b.name);
    g.select("title").text(`${b.name} · 다루는 시기 ${rangeText(b.from, b.to)}`);
  });

  // 인물: 이름은 막대 위에, 막대가 짧으면 옆 막대와 겹치지 않을 때만 밖으로 삐져나오게 둔다
  const people = PEOPLE_PACK.items.filter((p) => vis(p.from, p.to));
  G.person.selectAll("g.person").data(people, (p) => p.id).join((e) => {
    const g = e.append("g");
    g.append("line").attr("class", "bar");
    g.append("line").attr("class", "cap a");
    g.append("line").attr("class", "cap b");
    g.append("rect").attr("class", "hit");
    g.append("text");
    g.append("title");
    g.on("click", (event, p) => profiles.open(p.id));
    return g;
  }).attr("class", (p) => `person ${OFFICE.has(p.kind) ? "office" : p.kind === "활동" ? "act" : "life"}${selPeople.has(p.id) ? " on" : ""}`)
    .each(function (p) {
      const g = d3.select(this);
      const top = L.person.top + p.row * d.personRow;
      const xa = X(p.from), xb = X(p.to), ly = top + d.personRow - 5;
      g.select(".bar").attr("x1", xa).attr("x2", Math.max(xb, xa + 2)).attr("y1", ly).attr("y2", ly);
      g.select(".a").attr("x1", xa + 0.5).attr("x2", xa + 0.5).attr("y1", ly - 4).attr("y2", ly + 3);
      g.select(".b").attr("x1", xb - 0.5).attr("x2", xb - 0.5).attr("y1", ly - 4).attr("y2", ly + 3);
      const w = tw(p.name, 11, selPeople.has(p.id) ? 600 : 500);
      const next = PEOPLE_PACK.items.filter((o) => o.row === p.row && o.from > p.from).sort((a, b) => a.from - b.from)[0];
      const room = next ? X(next.from) - 6 : Infinity;
      // 이름은 보이는 왼쪽 끝에 붙여 두고, 들어갈 자리가 없으면 숨긴다(마우스를 올리면 보인다).
      const start = Math.max(xa, leftEdge() + 2);
      const lx = start + w <= Math.max(xb, room) ? start : xb - w >= xa ? xb - w : null;
      g.select("text").attr("x", lx ?? 0).attr("y", ly - 5).style("display", lx == null ? "none" : null).text(p.name);
      g.select(".hit").attr("x", Math.min(xa, lx ?? xa) - 2).attr("y", top).attr("width", Math.max(xb, (lx ?? xa) + w) - Math.min(xa, lx ?? xa) + 4).attr("height", d.personRow);
      g.select("title").text(`${p.name} · ${p.kind} ${rangeText(p.from, p.to)} (추정) · 눌러서 프로필 보기`);
    });

  // 사건: 점은 차선 맨 아래, 이름은 위쪽 세 줄 중 비어 있는 줄에
  const dotY = L.ev.top + L.ev.h - 7;
  const rowEnd = Array(d.evRows).fill(-Infinity);
  const evLayout = EVENTS.map((ev) => {
    const x = X(ev.year);
    const isSel = sel === ev;
    const tryPlace = (label) => {
      const w = tw(label, 12, isSel ? 650 : 500);
      const r = rowEnd.findIndex((end) => end + 12 <= x - 3);
      return r < 0 ? null : { r, w, label };
    };
    let p = tryPlace(ev.title) ?? tryPlace(SHORT[ev.id] ?? ev.title);
    if (!p) {
      const w = tw(SHORT[ev.id], 12);
      const r = rowEnd.indexOf(Math.min(...rowEnd));
      p = { r, w, label: SHORT[ev.id], crowded: true };
    }
    rowEnd[p.r] = x - 3 + p.w;
    return { ev, x, ...p };
  });
  G.ev.selectAll("g.ev").data(evLayout.filter((o) => o.x > -200 && o.x < W + 40), (o) => o.ev.id).join((e) => {
    const g = e.append("g").attr("class", "ev");
    g.append("line").attr("class", "lead");
    g.append("rect").attr("class", "hit");
    g.append("circle").attr("class", "ring").attr("r", 9);
    g.append("circle").attr("class", "dot").attr("r", 5);
    g.append("text");
    g.append("title");
    g.on("click", (event, o) => openGallery(o.ev));
    return g;
  }).classed("on", (o) => sel === o.ev).classed("near", (o) => state.near === o.ev && sel !== o.ev).each(function (o) {
    const g = d3.select(this);
    const ty = L.ev.top + (d.evRows - 1 - o.r) * d.evRow + 13;
    g.select(".lead").attr("x1", o.x).attr("x2", o.x).attr("y1", ty + 3).attr("y2", dotY);
    g.selectAll("circle").attr("cx", o.x).attr("cy", dotY);
    g.select("text").attr("x", o.x - 3).attr("y", ty).attr("opacity", o.crowded ? 0.45 : 1).text(o.label);
    g.select(".hit").attr("x", o.x - 8).attr("y", ty - 13).attr("width", o.w + 12).attr("height", dotY - ty + 21);
    g.select("title").text(`${o.ev.title} · ${o.ev.yearLabel}`);
  });

  // 증거: 만든 해에 핀을 꽂고, 사진은 겹치지 않게 두 줄로 옆으로 비켜 놓는다
  const T = d.thumb, rowRight = [-Infinity, -Infinity];
  const thumbs = EVID.map((e) => {
    const pin = X(e.madeYear);
    let best = null;
    for (let r = 0; r < 2; r++) {
      const left = Math.max(pin - T / 2, rowRight[r] + 6);
      const shift = left - (pin - T / 2);
      if (!best || shift < best.shift - 0.5) best = { r, left, shift };
    }
    rowRight[best.r] = best.left + T;
    return { e, pin, left: best.left, top: L.evid.top + 8 + best.r * (T + 8) };
  });
  const thumbsVis = thumbs.filter((t) => t.left < W + 40 && t.left + T > -40);
  G.pins.selectAll("path").data(thumbsVis, (t) => t.e.key).join("path").attr("class", "pin").attr("fill", "none")
    .attr("d", (t) => {
      const cx = t.left + T / 2, y0 = L.evid.top, y1 = t.top;
      return `M${t.pin},${y0} C${t.pin},${y0 + (y1 - y0) * 0.7} ${cx},${y0 + (y1 - y0) * 0.3} ${cx},${y1}`;
    });
  G.thumbs.selectAll("g.thumb").data(thumbsVis, (t) => t.e.key).join((e) => {
    const g = e.append("g").attr("class", "thumb");
    g.append("clipPath").attr("id", (t) => `c-${t.e.img}`).append("rect").attr("rx", 3);
    g.append("rect").attr("class", "frame").attr("rx", 3);
    g.append("image").attr("preserveAspectRatio", "xMidYMid slice").attr("clip-path", (t) => `url(#c-${t.e.img})`).attr("href", (t) => `../img/sm/${t.e.img}.jpg`);
    g.append("rect").attr("class", "str").attr("rx", 1.5);
    g.append("title");
    g.on("click", (event, t) => openGallery(t.e.ev, t.e.i));
    return g;
  }).classed("on", (t) => state.focusKey === t.e.key || sel === t.e.ev).each(function (t) {
    const g = d3.select(this);
    g.select("clipPath rect").attr("x", t.left).attr("y", t.top).attr("width", T).attr("height", T);
    g.select(".frame").attr("x", t.left - 0.5).attr("y", t.top - 0.5).attr("width", T + 1).attr("height", T + 1);
    g.select("image").attr("x", t.left).attr("y", t.top).attr("width", T).attr("height", T);
    g.select(".str").attr("x", t.left + 3).attr("y", t.top + T - 4).attr("width", T - 6).attr("height", 3).attr("fill", S_COLOR[t.e.strength]);
    g.select("title").text(`${t.e.name} · ${t.e.madeLabel} · ${STRENGTH[t.e.strength].label}`);
  });

  // 사건 점 → 증거 핀을 잇는 곡선과 걸린 시간
  const bt = L.band.top, bb = L.evid.top;
  const arcs = [];
  for (const t of thumbs) {
    const xe = X(t.e.ev.year);
    arcs.push({ key: t.e.key, x0: xe, x1: t.pin, ev: t.e.ev, gap: gapText(t.e.madeYear, t.e.ev.year), ms: false, from: dotY + 5 });
    const book = t.e.strength === "manuscript" && bookOf(t.e.ev.book);
    if (book) arcs.push({ key: `${t.e.key}:book`, x0: X(book.to), x1: t.pin, ev: t.e.ev, gap: `${book.name} 시대보다 ${gapText(t.e.madeYear, book.to)}`, ms: true, from: bt + 2, anchor: true });
  }
  const arcsVis = arcs.filter((a) => Math.max(a.x0, a.x1) > -40 && Math.min(a.x0, a.x1) < W + 40);
  const arcPath = (a) => {
    const y0 = a.from, y1 = bb, k = (y1 - y0) * 0.75;
    return `M${a.x0},${y0} C${a.x0},${y0 + k} ${a.x1},${y1 - k} ${a.x1},${y1}`;
  };
  G.arcs.selectAll("path").data(arcsVis, (a) => a.key).join("path")
    .attr("class", (a) => `arc${a.ms ? " ms" : ""}${sel === a.ev ? " on" : ""}`).attr("d", arcPath);
  G.arcs.selectAll("rect.anchor").data(arcsVis.filter((a) => a.anchor), (a) => a.key).join("rect").attr("class", "anchor")
    .attr("width", 7).attr("height", 7).attr("x", (a) => a.x0 - 3.5).attr("y", bt - 2).attr("transform", (a) => `rotate(45 ${a.x0} ${bt + 1.5})`);
  const gapsVis = arcsVis.filter((a) => a.gap !== "같은 때" && Math.abs(a.x1 - a.x0) > tw(a.gap, 10.5) + 22);
  G.gaps.selectAll("g.gap").data(gapsVis, (a) => a.key).join((e) => {
    const g = e.append("g");
    g.append("rect").attr("rx", 8);
    g.append("text").attr("text-anchor", "middle");
    return g;
  }).attr("class", (a) => `gap${a.ms ? " ms" : ""}`).each(function (a) {
    const g = d3.select(this);
    const w = tw(a.gap, 10.5) + 14;
    const cx = clamp((a.x0 + a.x1) / 2, leftEdge() + w / 2, W - w / 2 - 4), cy = (a.from + bb) / 2;
    g.select("rect").attr("x", cx - w / 2).attr("y", cy - 8.5).attr("width", w).attr("height", 17);
    g.select("text").attr("x", cx).attr("y", cy + 3.6).text(a.gap);
  });
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function darken(hex) {
  const c = d3.hsl(hex);
  c.l = Math.min(c.l, 0.32);
  return c.formatHex();
}

/* ---------- 차선 이름 ---------- */
function renderLaneLabels() {
  const el = $("lanes");
  el.style.setProperty("--lw", `${L.d.labelW}px`);
  const rows = [
    [L.emp, "제국"], [L.era, "시대"], [L.book, "성경 책", "다루는 시기"], [L.person, "인물"],
    [L.ev, "사건"], [L.evid, "증거", "만든 때"],
  ];
  el.innerHTML = rows.map(([l, name, sub]) => `<div style="top:${l.top + l.h / 2}px">${name}${sub ? `<small>${sub}</small>` : ""}</div>`).join("");
}

/* ---------- 스크롤·확대 ---------- */
const scroller = $("scroller"), track = $("track"), stage = $("stage");
const limits = () => ({ min: state.viewW / SPAN, max: state.viewW / 30 });

function sizeTrack() {
  track.style.width = `${state.viewW + SPAN * state.ppy}px`;
  track.style.height = `${L.height}px`;
  stage.style.width = `${state.viewW}px`;
  stage.style.height = `${L.height}px`;
}

function setCenter(year, smooth = false) {
  const left = (clamp(year, RANGE[0], RANGE[1]) - RANGE[0]) * state.ppy;
  if (smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches) scroller.scrollTo({ left, behavior: "smooth" });
  else { scroller.scrollLeft = left; onScroll(true); }
}

function setPpy(p) {
  const { min, max } = limits();
  const c = state.center;
  state.ppy = clamp(p, min, max);
  sizeTrack();
  scroller.scrollLeft = (c - RANGE[0]) * state.ppy;
  state.center = c;
  updateZoomUI();
  frame();
}
const zoomBy = (f) => setPpy(state.ppy * f);

function updateZoomUI() {
  const { min, max } = limits();
  const years = state.viewW / state.ppy;
  const nice = years >= 200 ? Math.round(years / 50) * 50 : years >= 60 ? Math.round(years / 10) * 10 : Math.round(years);
  $("zLabel").textContent = `화면 폭 약 ${nice.toLocaleString("ko-KR")}년`;
  $("zOut").disabled = state.ppy <= min * 1.001;
  $("zIn").disabled = state.ppy >= max * 0.999;
}

let rafId = 0, hintAnchor = null;
function frame() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    render();
    updateReadout();
    updateOverview();
    followMap();
  });
}

function onScroll(force) {
  const c = RANGE[0] + scroller.scrollLeft / state.ppy;
  if (!force && Math.abs(c - state.center) * state.ppy < 0.5) return;
  state.center = c;
  if (hintAnchor != null && Math.abs(scroller.scrollLeft - hintAnchor) > 60) $("hint").classList.add("gone");
  frame();
}

/* ---------- 지금 보는 해 ---------- */
function updateReadout() {
  const c = state.center;
  const on = nearestEvent(c);
  const step = state.ppy >= 6 ? 1 : state.ppy >= 1.5 ? 5 : 10;
  let y = Math.round(c / step) * step;
  if (y === 0) y = c < 0 ? -1 : 1;
  $("yr").textContent = Math.abs(on.year - c) * state.ppy < 4 ? on.yearLabel : `${yearText(y)}${step > 1 ? "경" : ""}`;
  const era = ERAS.find((e) => c >= e.from && c < e.to);
  const emp = EMPIRES.filter((e) => c >= e.from && c < e.to).map((e) => e.name);
  const eraName = era ? era.name : c < ERAS[0].from ? "아브라함 이전" : "초대 교회 이후";
  $("ctx").textContent = [eraName, emp.length ? `${emp.join("·")} 시대` : null].filter(Boolean).join(" · ");
}

/* ---------- 전체 띠 ---------- */
const overview = $("overview");
function buildOverview() {
  const pct = (y) => ((y - RANGE[0]) / SPAN) * 100;
  overview.innerHTML =
    ERAS.map((e) => `<i class="ov-era" style="left:${pct(e.from)}%;width:${pct(e.to) - pct(e.from)}%;background:${eraColor(e.hue, 82, 38)}" title="${esc(e.name)}"></i>`).join("") +
    EVENTS.map((e) => `<i class="ov-ev" style="left:${pct(e.year)}%" title="${esc(e.title)}"></i>`).join("") +
    `<i class="ov-win" id="ovWin"></i>`;
}
function updateOverview() {
  const half = state.viewW / 2 / state.ppy;
  const a = clamp(state.center - half, RANGE[0], RANGE[1]), b = clamp(state.center + half, RANGE[0], RANGE[1]);
  const win = $("ovWin");
  win.style.left = `${((a - RANGE[0]) / SPAN) * 100}%`;
  win.style.width = `${((b - a) / SPAN) * 100}%`;
}
function overviewYear(e) {
  const r = overview.getBoundingClientRect();
  return RANGE[0] + clamp((e.clientX - r.left) / r.width, 0, 1) * SPAN;
}
overview.addEventListener("pointerdown", (e) => {
  overview.setPointerCapture(e.pointerId);
  setCenter(overviewYear(e));
  const move = (ev) => setCenter(overviewYear(ev));
  const up = () => { overview.removeEventListener("pointermove", move); overview.removeEventListener("pointerup", up); overview.removeEventListener("pointercancel", up); };
  overview.addEventListener("pointermove", move);
  overview.addEventListener("pointerup", up);
  overview.addEventListener("pointercancel", up);
});

/* ---------- 지도 따라가기 ---------- */
const nearestEvent = (y) => EVENTS.reduce((best, ev) => (Math.abs(ev.year - y) < Math.abs(best.year - y) ? ev : best), EVENTS[0]);
let mapTimer = 0;
function followMap() {
  const ev = nearestEvent(state.center);
  if (ev !== state.near) {
    state.near = ev;
    $("capTitle").textContent = ev.title;
    $("capMeta").textContent = `${ev.yearLabel} · ${ev.route.map((id) => PLACES[id].name).join(" → ")}`;
    render();
  }
  clearTimeout(mapTimer);
  mapTimer = setTimeout(() => {
    if (map && state.mapEv !== state.near) { state.mapEv = state.near; map.show(state.near); }
  }, 140);
}
$("cap").addEventListener("click", () => state.near && openGallery(state.near));

/* ---------- 전시실: 사건이나 유물을 누르면 화면 가득 열린다 ---------- */
// 사건 하나가 화면 한 칸짜리 방이다. 옆으로 넘기면 뒤쪽 연표도 같은 사건으로 옮겨 가서, 닫으면 그 자리에서 이어 본다.
const gallery = $("gallery"), hall = $("hall"), gTrack = $("gTrack"), gMapBox = $("gMapBox");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const imgUrl = (key) => `../img/${key}.jpg`;
const smUrl = (key) => `../img/sm/${key}.jpg`;
const pad2 = (n) => String(n).padStart(2, "0");
const pct = (y) => ((y - RANGE[0]) / SPAN) * 100;
const isOpen = () => gallery.classList.contains("open");
let gMap = null, gMapLoading = null, gCur = -1, gTarget = null;

function roomHTML(ev, i) {
  const multi = ev.evidence.length > 1;
  const thumbs = multi
    ? `<div class="g-thumbs" role="tablist" aria-label="이 방의 유물">${ev.evidence.map((e, k) =>
        `<button class="g-thumb" role="tab" data-k="${k}" title="${esc(e.name)}" aria-label="${esc(e.name)}">
          <img src="${smUrl(e.img)}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div>`
    : "";
  const people = ev.people.map((id) => PERSON[id]).filter(Boolean)
    .map((p) => `<button class="g-person" type="button" data-person="${esc(p.id)}" title="인물 프로필 보기">${esc(p.name)}</button>(${esc(p.kind)} ${esc(rangeText(p.from, p.to))})`).join(" · ");
  return `<section class="room${multi ? " multi" : ""}" data-i="${i}" aria-label="${esc(ev.yearLabel)}, ${esc(ev.title)}">
    <div class="bgyear" aria-hidden="true">${Math.abs(ev.year)}</div>
    <div class="g-inner">
      <div class="g-stage">
        <figure class="photo"><img alt="" decoding="async" loading="lazy"><span class="floor" aria-hidden="true"></span></figure>
        ${thumbs}
        <div class="plate"><div class="plate-body">
          <div class="plate-head"><h3 class="pname"></h3><span class="chip"></span></div>
          <p class="g-sdesc"></p>
          <dl class="pmeta"><dt>만든 때</dt><dd><span class="pmade"></span> · <span class="pgap"></span></dd><dt>소장</dt><dd class="pwhere"></dd><dt>발견</dt><dd class="pfound"></dd></dl>
          <div class="notes">
            <div><h4>이 유물이 말해 주는 내용</h4><p class="psays"></p></div>
            <div><h4>주의할 점</h4><p class="pcaveat"></p></div>
          </div>
        </div></div>
        <p class="g-credit"></p>
      </div>
      <article class="story">
        <p class="g-era">${esc(ERA[ev.era]?.name)}</p>
        <p class="g-year">${esc(ev.yearLabel)}</p>
        <h2 class="g-title">${esc(ev.title)}</h2>
        <blockquote class="g-verse"><p>${esc(ev.verse)}</p><cite>${esc(ev.ref)} · ${esc(ev.book)} · 개역한글</cite></blockquote>
        <p class="g-summary">${esc(ev.summary)}</p>
        <dl class="g-meta"><dt>연대</dt><dd>${esc(ev.dateNote)}</dd>${people ? `<dt>인물</dt><dd>${people}</dd>` : ""}</dl>
      </article>
    </div>
  </section>`;
}

hall.innerHTML = EVENTS.map(roomHTML).join("");
const rooms = [...hall.children];

function fillCredit(room) {
  const e = EVENTS[room.dataset.i].evidence[+room.dataset.k || 0];
  const c = credits[e.img];
  const el = room.querySelector(".g-credit");
  if (!c) { el.textContent = ""; return; }
  const lic = c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license);
  el.innerHTML = `사진 ${esc(c.author)} · ${lic} · <a href="${esc(c.page)}" target="_blank" rel="noopener">원본</a>`;
}

function fillPlate(room, ev, e) {
  const s = STRENGTH[e.strength];
  const q = (sel) => room.querySelector(sel);
  q(".pname").textContent = e.name;
  const chip = q(".chip");
  chip.textContent = s.label;
  chip.dataset.s = e.strength;
  chip.title = s.desc;
  q(".g-sdesc").textContent = s.desc;
  q(".pmade").textContent = e.madeLabel;
  // 라벨에는 연표의 곡선 이름표보다 촘촘하게 적는다. 1년 이내면 같은 무렵으로 본다.
  const n = yearsBetween(e.madeYear, ev.year);
  q(".pgap").textContent = n <= 1 ? "사건과 같은 무렵" : `사건보다 ${n >= 100 ? `약 ${Math.round(n / 10) * 10}` : n}년 ${e.madeYear > ev.year ? "뒤" : "앞"}`;
  q(".pwhere").textContent = e.where;
  q(".pfound").textContent = e.found;
  q(".psays").textContent = e.says;
  q(".pcaveat").textContent = e.caveat;
  fillCredit(room);
}

function setEvidence(room, k, instant = false) {
  const ev = EVENTS[room.dataset.i];
  const e = ev.evidence[k];
  if (!e) return;
  room.dataset.k = k;
  room.querySelectorAll(".g-thumb").forEach((t) => {
    const on = +t.dataset.k === k;
    t.classList.toggle("on", on);
    t.setAttribute("aria-selected", String(on));
  });
  if (isOpen() && +room.dataset.i === gCur) { state.focusKey = `${ev.id}:${k}`; frame(); }
  const stageEl = room.querySelector(".g-stage");
  const im = room.querySelector(".photo img");
  const swap = () => { fillPlate(room, ev, e); im.src = imgUrl(e.img); im.alt = e.name; };
  if (instant || reduce) { swap(); return; }
  stageEl.classList.add("swap");
  setTimeout(() => {
    swap();
    const done = () => stageEl.classList.remove("swap");
    im.decode ? im.decode().then(done, done) : done();
  }, 220);
}
rooms.forEach((r) => setEvidence(r, 0, true));

// 아래 시간 띠: 실제 햇수 비율로 시대와 사건 점을 놓는다
gTrack.innerHTML = `<div class="line"></div>`
  + ERAS.map((er) => `<div class="g-seg" data-era="${er.id}" style="left:${pct(er.from)}%;width:${pct(er.to) - pct(er.from)}%;--h:${er.hue}" title="${esc(er.name)}"><span>${esc(er.name)}</span></div>`).join("")
  + EVENTS.map((ev, i) => `<button class="g-dot" data-room="${i}" style="left:${pct(ev.year)}%" data-tip="${esc(ev.yearLabel)} · ${esc(ev.title)}" aria-label="${esc(ev.yearLabel)}, ${esc(ev.title)}"></button>`).join("");

function layoutRail() {
  const W = gTrack.clientWidth;
  gTrack.querySelectorAll(".g-seg").forEach((seg) => seg.classList.toggle("fit", seg.firstElementChild.offsetWidth + 10 <= seg.offsetWidth));
  // 몇 해 차이 안 나는 점(메사와 예후, 예수와 바울)은 겹치지 않게 한 칸 위로 올린다.
  let prev = -1e9, prevUp = false;
  gTrack.querySelectorAll(".g-dot").forEach((d) => {
    const x = (parseFloat(d.style.left) / 100) * W;
    const up = x - prev < 14 && !prevUp;
    d.classList.toggle("up", up);
    d.classList.toggle("tip-r", x > W - 150);
    d.classList.toggle("tip-l", x < 150);
    prev = x;
    prevUp = up;
  });
}

function setRoom(i) {
  if (i === gCur || !rooms[i]) return;
  gCur = i;
  const ev = EVENTS[i];
  rooms.forEach((r, k) => r.classList.toggle("is-current", k === i));
  $("gCount").textContent = `${pad2(i + 1)} / ${pad2(EVENTS.length)}`;
  $("gRy").textContent = ev.yearLabel;
  $("gRe").textContent = ERA[ev.era]?.name ?? "";
  $("gPrev").disabled = i === 0;
  $("gNext").disabled = i === EVENTS.length - 1;
  gTrack.querySelectorAll(".g-dot").forEach((d) => {
    const on = +d.dataset.room === i;
    d.classList.toggle("on", on);
    if (on) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current");
  });
  gTrack.querySelectorAll(".g-seg").forEach((s) => s.classList.toggle("on", s.dataset.era === ev.era));
  const names = ev.route.map((id) => PLACES[id]?.name).filter(Boolean);
  $("gMapCap").textContent = `${names.length > 1 ? "경로" : "장소"} · ${names.join(" → ")}`;
  gMap?.show(ev);
  state.selected = ev;
  state.focusKey = `${ev.id}:${+rooms[i].dataset.k || 0}`;
  setCenter(ev.year);
  history.replaceState(null, "", `#${ev.id}`);
}

function goRoom(i) {
  i = clamp(i, 0, rooms.length - 1);
  gTarget = i;
  hall.scrollTo({ left: i * hall.clientWidth, behavior: reduce ? "auto" : "smooth" });
}
const here = () => gTarget ?? gCur;

let gTicking = false;
hall.addEventListener("scroll", () => {
  if (gTicking) return;
  gTicking = true;
  requestAnimationFrame(() => {
    gTicking = false;
    if (!isOpen()) return; // 닫는 중에 늦게 도착한 스크롤은 연표를 다시 옮기지 않는다
    const w = hall.clientWidth, x = hall.scrollLeft / w;
    setRoom(Math.round(x));
    if (gTarget !== null && Math.abs(hall.scrollLeft - gTarget * w) < 2) gTarget = null;
    if (!reduce) parallax(x);
  });
}, { passive: true });
hall.addEventListener("scrollend", () => { gTarget = null; });

// 뒤의 큰 숫자는 방보다 느리게 움직여 깊이가 생긴다.
function parallax(x) {
  rooms.forEach((r, k) => {
    const d = k - x;
    if (Math.abs(d) > 1.5) return;
    r.querySelector(".bgyear").style.transform = `translate3d(${(-d * 32).toFixed(2)}vw,0,0)`;
  });
}

function ensureMap() {
  if (gMap || gMapLoading) return;
  gMapLoading = createMap($("gMap"), THEMES.atlas, { labels: true, pad: 0.5 })
    .then((m) => { gMap = m; if (gCur >= 0) m.show(EVENTS[gCur], { instant: true }); })
    .catch(() => gMapBox.remove());
}

function openGallery(ev, k = null) {
  const i = EVENTS.indexOf(ev);
  if (k != null && +rooms[i].dataset.k !== k) setEvidence(rooms[i], k, true);
  $("hint").classList.add("gone");
  toggleLegend(false);
  if (isOpen()) { goRoom(i); return; }
  gallery.classList.add("open");
  gallery.setAttribute("aria-hidden", "false");
  hall.scrollLeft = i * hall.clientWidth;
  gCur = -1;
  setRoom(i);
  layoutRail();
  ensureMap();
  gallery.focus({ preventScroll: true }); // 방 전체에 초점을 두어 화살표 키가 바로 듣게 한다
}

function closeGallery() {
  if (!isOpen()) return;
  gallery.classList.remove("open");
  gallery.setAttribute("aria-hidden", "true");
  setMapOpen(false);
  state.focusKey = null;
  history.replaceState(null, "", location.pathname + location.search);
  frame();
  scroller.focus({ preventScroll: true });
}

function setMapOpen(open) {
  gMapBox.classList.toggle("open", open);
  $("gMapToggle").setAttribute("aria-expanded", String(open));
  $("gMapToggle").textContent = open ? "지도 닫기" : "지도";
}

gallery.addEventListener("click", (e) => {
  const per = e.target.closest(".g-person");
  if (per) { closeGallery(); profiles.open(per.dataset.person); return; }
  const thumb = e.target.closest(".g-thumb");
  if (thumb) {
    const room = thumb.closest(".room");
    if (+thumb.dataset.k !== +room.dataset.k) setEvidence(room, +thumb.dataset.k);
    return;
  }
  const dot = e.target.closest(".g-dot");
  if (dot) goRoom(+dot.dataset.room);
});
$("gClose").addEventListener("click", closeGallery);
$("gPrev").addEventListener("click", () => goRoom(here() - 1));
$("gNext").addEventListener("click", () => goRoom(here() + 1));
$("gMapToggle").addEventListener("click", () => setMapOpen(!gMapBox.classList.contains("open")));

// 세로 휠 한 번(관성 포함)에 방 하나를 넘긴다. 방 안에 아직 내릴 글이 있으면 그 글부터 내린다.
const canScroll = (el, dy) => (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0);
let gestureOpen = true, lockUntil = 0, idle = 0;
gallery.addEventListener("wheel", (e) => {
  if (e.ctrlKey) return;
  const dy = e.deltaY;
  if (Math.abs(e.deltaX) > Math.abs(dy)) return;
  const room = e.target.closest?.(".room");
  if (room && canScroll(room, dy)) return;
  e.preventDefault();
  clearTimeout(idle);
  idle = setTimeout(() => { gestureOpen = true; }, 170);
  const now = performance.now();
  if (!gestureOpen || now < lockUntil || Math.abs(dy) < 3) return;
  gestureOpen = false;
  lockUntil = now + 450;
  goRoom(here() + Math.sign(dy));
}, { passive: false });

/* ---------- 인물 프로필 ---------- */
const profiles = createProfiles({
  getCredits: () => credits,
  onEvent: (id) => openGallery(EVENTS.find((ev) => ev.id === id)),
  // 프로필을 여는 동안 뒤쪽 연표를 그 인물의 생애 가운데로 옮기고 막대를 강조한다. 닫으면 그 자리에서 이어 본다.
  onOpen: (p) => { state.person = p.id; setCenter((p.from + p.to) / 2); frame(); },
  onClose: () => { frame(); scroller.focus({ preventScroll: true }); },
});

function stepEvent(dir) {
  if (isOpen()) { goRoom(here() + dir); return; }
  const base = state.center;
  const list = dir > 0 ? EVENTS.filter((e) => e.year > base + 0.5) : EVENTS.filter((e) => e.year < base - 0.5).reverse();
  if (list[0]) setCenter(list[0].year, true);
}

/* ---------- 입력 ---------- */
scroller.addEventListener("scroll", () => onScroll(false), { passive: true });
scroller.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    zoomBy(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.006)));
    return;
  }
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    scroller.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 32 : 1);
  }
}, { passive: false });

// 휴대폰: 두 손가락으로 벌리고 오므리면 확대·축소
let pinch = null;
const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
scroller.addEventListener("touchstart", (e) => { if (e.touches.length === 2) pinch = { d: dist(e.touches), p: state.ppy }; }, { passive: true });
scroller.addEventListener("touchmove", (e) => {
  if (pinch && e.touches.length === 2) { e.preventDefault(); setPpy((pinch.p * dist(e.touches)) / pinch.d); }
}, { passive: false });
scroller.addEventListener("touchend", (e) => { if (e.touches.length < 2) pinch = null; });

// 마우스로 끌어서 넘기기(클릭과 구분)
let drag = null, swallowClick = false;
stage.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  drag = { x: e.clientX, y: e.clientY, s: scroller.scrollLeft, t: scroller.scrollTop, moved: false };
});
addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; stage.classList.add("dragging"); }
  if (drag.moved) { scroller.scrollLeft = drag.s - dx; scroller.scrollTop = drag.t - (e.clientY - drag.y); }
});
addEventListener("pointerup", () => {
  if (drag?.moved) { swallowClick = true; setTimeout(() => (swallowClick = false), 0); }
  drag = null;
  stage.classList.remove("dragging");
});
stage.addEventListener("click", (e) => { if (swallowClick) { e.stopPropagation(); e.preventDefault(); } }, true);

addEventListener("keydown", (e) => {
  if (e.target.closest?.("input, textarea, select")) return;
  if (profiles.isOpen()) { if (e.key === "Escape") profiles.popOpen() ? profiles.hidePop() : profiles.close(); return; }
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); stepEvent(e.key === "ArrowRight" ? 1 : -1); }
  else if (isOpen()) { /* 전시실에서는 확대 키를 쓰지 않는다 */ }
  else if (e.key === "+" || e.key === "=") zoomBy(1.5);
  else if (e.key === "-" || e.key === "_") zoomBy(1 / 1.5);
  else if (e.key === "Escape") { closeGallery(); toggleLegend(false); }
  else if (isOpen() && e.key === "Home") { e.preventDefault(); goRoom(0); }
  else if (isOpen() && e.key === "End") { e.preventDefault(); goRoom(rooms.length - 1); }
});
$("zIn").addEventListener("click", () => zoomBy(1.6));
$("zOut").addEventListener("click", () => zoomBy(1 / 1.6));

// 범례
const lgBtn = $("lgBtn"), lgPop = $("lgPop");
function toggleLegend(open = lgPop.hidden) {
  lgPop.hidden = !open;
  lgBtn.setAttribute("aria-expanded", String(open));
}
lgBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleLegend(); });
document.addEventListener("click", (e) => { if (!lgPop.hidden && !lgPop.contains(e.target)) toggleLegend(false); });

/* ---------- 크기 ---------- */
const mq = matchMedia("(max-width: 700px)");
function onResize() {
  if (isOpen()) { hall.scrollLeft = gCur * hall.clientWidth; layoutRail(); }
  const prevW = state.viewW;
  state.mobile = mq.matches;
  state.viewW = scroller.clientWidth || prevW;
  layout();
  renderLaneLabels();
  const { min, max } = limits();
  state.ppy = clamp(state.ppy, min, max);
  sizeTrack();
  scroller.scrollLeft = (state.center - RANGE[0]) * state.ppy;
  updateZoomUI();
  frame();
}

/* ---------- 시작 ---------- */
async function init() {
  state.mobile = mq.matches;
  state.viewW = scroller.clientWidth;
  layout();
  renderLaneLabels();
  state.ppy = clamp(state.viewW / 600, limits().min, limits().max);
  sizeTrack();
  buildOverview();
  updateZoomUI();

  const fromHash = EVENTS.find((e) => `#${e.id}` === location.hash);
  setCenter((fromHash ?? EVENTS[0]).year);
  hintAnchor = scroller.scrollLeft;
  new ResizeObserver(onResize).observe(scroller);

  credits = await fetch("../shared/credits.json").then((r) => r.json()).catch(() => ({}));
  rooms.forEach(fillCredit);
  if (fromHash) openGallery(fromHash);
  else if (location.hash.startsWith("#p-")) profiles.open(location.hash.slice(3));
  document.fonts?.ready.then(frame);

  map = await createMap($("map"), THEMES.atlas, { pad: 0.4 });
  const first = state.near ?? nearestEvent(state.center);
  state.mapEv = first;
  map.show(first, { instant: true });
}
init();
