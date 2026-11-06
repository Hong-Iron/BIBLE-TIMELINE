// 시안 B · 박물관 회랑. 사건 하나가 화면 한 칸짜리 전시실이고, 옆으로 넘기며 걷는다.
import { EVENTS, ERAS, PEOPLE, STRENGTH, PLACES, RANGE, byId, yearText } from "../shared/data.js";

const ERA = byId(ERAS);
const PERSON = byId(PEOPLE);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const imgUrl = (key) => `../img/${key}.jpg`;
const smUrl = (key) => `../img/sm/${key}.jpg`;
const [Y0, Y1] = RANGE;
const pct = (y) => ((y - Y0) / (Y1 - Y0)) * 100;
const pad2 = (n) => String(n).padStart(2, "0");

const hall = document.getElementById("hall");
const counter = document.getElementById("counter");
const mapbox = document.getElementById("mapbox");
const mapCap = document.getElementById("mapcap");
const mapToggle = document.getElementById("maptoggle");
const track = document.getElementById("track");
const readY = document.getElementById("ry");
const readE = document.getElementById("re");

const total = EVENTS.length;
const relicCount = EVENTS.reduce((n, ev) => n + ev.evidence.length, 0);
const spanText = `${yearText(EVENTS[0].year)}부터 ${yearText(EVENTS.at(-1).year)}까지`;
let credits = {};
let map = null;
let cur = -1;
let target = null;

// ---------- 방 만들기 ----------

function entranceHTML() {
  const relics = EVENTS.flatMap((ev, i) => ev.evidence.map((e, k) =>
    `<button class="relic" data-room="${i + 1}" data-k="${k}" title="${esc(e.name)} · ${esc(ev.yearLabel)}">
      <img src="${smUrl(e.img)}" alt="${esc(e.name)}" decoding="async"></button>`)).join("");
  return `<section class="room entrance" aria-label="입구">
    <div class="inner">
      <p class="kicker">시안 B · 박물관 회랑</p>
      <h1>바이블 타임라인</h1>
      <p class="pitch">유물 앞에 서서 성경 속 사건을 걷는다</p>
      <p class="stats">사건 ${total}개 · 유물 ${relicCount}점 · ${spanText}</p>
      <div class="relics" aria-label="이 회랑에 놓인 유물">${relics}</div>
      <button class="enter" data-go="1">옆으로 넘기세요 <span aria-hidden="true">→</span></button>
    </div>
  </section>`;
}

function roomHTML(ev, i) {
  const multi = ev.evidence.length > 1;
  const thumbs = multi
    ? `<div class="thumbs" role="tablist" aria-label="이 방의 유물">${ev.evidence.map((e, k) =>
        `<button class="thumb" role="tab" data-k="${k}" title="${esc(e.name)}" aria-label="${esc(e.name)}">
          <img src="${smUrl(e.img)}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div>`
    : "";
  const people = ev.people.map((id) => PERSON[id]?.name).filter(Boolean).join(" · ");
  return `<section class="room ev${multi ? " multi" : ""}" data-i="${i}" id="room-${esc(ev.id)}" aria-label="${esc(ev.yearLabel)}, ${esc(ev.title)}">
    <div class="bgyear" aria-hidden="true">${Math.abs(ev.year)}</div>
    <div class="inner">
      <div class="stage">
        <figure class="photo"><img alt="" decoding="async"${i > 2 ? ' loading="lazy"' : ""}><span class="floor" aria-hidden="true"></span></figure>
        ${thumbs}
        <div class="plate"><div class="plate-body">
          <div class="plate-head"><h3 class="pname"></h3><span class="chip"></span></div>
          <p class="sdesc"></p>
          <dl class="pmeta"><dt>만든 때</dt><dd class="pmade"></dd><dt>소장</dt><dd class="pwhere"></dd><dt>발견</dt><dd class="pfound"></dd></dl>
          <div class="notes">
            <div><h4>이 유물이 말해 주는 것</h4><p class="psays"></p></div>
            <div><h4>주의할 점</h4><p class="pcaveat"></p></div>
          </div>
        </div></div>
        <p class="credit"></p>
      </div>
      <article class="story">
        <p class="era">${esc(ERA[ev.era]?.name)}</p>
        <p class="year">${esc(ev.yearLabel)}</p>
        <h2 class="title">${esc(ev.title)}</h2>
        <blockquote class="verse"><p>${esc(ev.verse)}</p><cite>${esc(ev.ref)} · ${esc(ev.book)} · 개역한글</cite></blockquote>
        <p class="summary">${esc(ev.summary)}</p>
        <dl class="meta"><dt>연대</dt><dd>${esc(ev.dateNote)}</dd>${people ? `<dt>인물</dt><dd>${esc(people)}</dd>` : ""}</dl>
      </article>
    </div>
  </section>`;
}

function creditsHTML() {
  return `<section class="room credits" aria-label="자료 출처">
    <div class="inner"><div class="wrap">
      <p class="kicker">출구</p>
      <h2>자료 출처</h2>
      <dl class="sources">
        <dt>구절</dt><dd>개역한글(1961). 장과 절을 함께 적었다.</dd>
        <dt>사진</dt><dd>Wikimedia Commons. 사진마다 찍은 사람과 사용 허락(라이선스)을 함께 적었다.</dd>
        <dt>지도</dt><dd>Natural Earth의 해안선, 강, 호수(공개 자료).</dd>
        <dt>연대</dt><dd>사건마다 '연대' 항목에 어떤 기준으로 정한 해인지 적었다. 학자마다 다른 해는 그곳에 함께 적었다.</dd>
      </dl>
      <ul class="photos" id="photolist"></ul>
      <button class="enter again" data-go="0"><span aria-hidden="true">←</span> 입구로 돌아가기</button>
    </div></div>
  </section>`;
}

hall.innerHTML = entranceHTML() + EVENTS.map((ev, i) => roomHTML(ev, i + 1)).join("") + creditsHTML();
const rooms = [...hall.children];
rooms.filter((r) => r.classList.contains("ev")).forEach((r) => setEvidence(r, 0, true));

// ---------- 유물 바꾸기 ----------

function fillPlate(room, ev, e) {
  const s = STRENGTH[e.strength];
  const q = (sel) => room.querySelector(sel);
  q(".pname").textContent = e.name;
  const chip = q(".chip");
  chip.textContent = s.label;
  chip.dataset.s = e.strength;
  chip.title = s.desc;
  q(".sdesc").textContent = s.desc;
  q(".pmade").textContent = e.madeLabel;
  q(".pwhere").textContent = e.where;
  q(".pfound").textContent = e.found;
  q(".psays").textContent = e.says;
  q(".pcaveat").textContent = e.caveat;
  fillCredit(room);
}

function fillCredit(room) {
  const ev = EVENTS[room.dataset.i - 1];
  const e = ev.evidence[+room.dataset.k || 0];
  const c = credits[e.img];
  const el = room.querySelector(".credit");
  if (!c) { el.textContent = ""; return; }
  const lic = c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license);
  el.innerHTML = `<span class="lbl">사진</span>${esc(c.author)} · ${lic} · <a href="${esc(c.page)}" target="_blank" rel="noopener">원본</a>`;
}

function setEvidence(room, k, instant = false) {
  const ev = EVENTS[room.dataset.i - 1];
  const e = ev.evidence[k];
  if (!e) return;
  room.dataset.k = k;
  room.querySelectorAll(".thumb").forEach((t) => {
    const on = +t.dataset.k === k;
    t.classList.toggle("on", on);
    t.setAttribute("aria-selected", String(on));
  });
  const stage = room.querySelector(".stage");
  const im = room.querySelector(".photo img");
  const swap = () => {
    fillPlate(room, ev, e);
    im.src = imgUrl(e.img);
    im.alt = e.name;
  };
  if (instant || reduce) { swap(); return; }
  stage.classList.add("swap");
  setTimeout(() => {
    swap();
    const done = () => stage.classList.remove("swap");
    im.decode ? im.decode().then(done, done) : done();
  }, 220);
}

// ---------- 시간 띠 ----------

track.innerHTML = `<div class="line"></div>`
  + ERAS.map((er) => `<div class="seg" data-era="${er.id}" style="left:${pct(er.from)}%;width:${pct(er.to) - pct(er.from)}%;--h:${er.hue}" title="${esc(er.name)}"><span class="seg-label">${esc(er.name)}</span></div>`).join("")
  + EVENTS.map((ev, i) => `<button class="dot" data-go="${i + 1}" style="left:${pct(ev.year)}%" data-tip="${esc(ev.yearLabel)} · ${esc(ev.title)}" aria-label="${esc(ev.yearLabel)}, ${esc(ev.title)}"></button>`).join("");

function layoutRail() {
  const W = track.clientWidth;
  track.querySelectorAll(".seg").forEach((seg) => {
    seg.classList.toggle("fit", seg.firstElementChild.offsetWidth + 10 <= seg.offsetWidth);
  });
  // 몇 해 차이 안 나는 점(메사와 예후, 예수와 바울)은 겹치지 않게 한 칸 위로 올린다.
  let prev = -1e9, prevUp = false;
  track.querySelectorAll(".dot").forEach((d) => {
    const x = (parseFloat(d.style.left) / 100) * W;
    const up = x - prev < 14 && !prevUp;
    d.classList.toggle("up", up);
    d.classList.toggle("tip-r", x > W - 150);
    d.classList.toggle("tip-l", x < 150);
    prev = x;
    prevUp = up;
  });
}

// ---------- 지금 서 있는 방 ----------

function setCurrent(i) {
  if (i === cur || !rooms[i]) return;
  cur = i;
  rooms.forEach((r, k) => r.classList.toggle("is-current", k === i));
  const ev = EVENTS[i - 1];
  counter.textContent = ev ? `${pad2(i)} / ${pad2(total)}` : i === 0 ? "입구" : "출처";
  track.querySelectorAll(".dot").forEach((d) => {
    const on = +d.dataset.go === i;
    d.classList.toggle("on", on);
    if (on) d.setAttribute("aria-current", "step");
    else d.removeAttribute("aria-current");
  });
  track.querySelectorAll(".seg").forEach((s) => s.classList.toggle("on", !!ev && s.dataset.era === ev.era));
  readY.textContent = ev ? ev.yearLabel : i === 0 ? "입구" : "출구";
  readE.textContent = ev ? ERA[ev.era]?.name ?? "" : i === 0 ? spanText : "자료 출처";
  mapbox.classList.toggle("on", !!ev);
  document.body.classList.toggle("has-map", !!ev);
  if (ev) {
    const names = ev.route.map((id) => PLACES[id]?.name).filter(Boolean);
    mapCap.textContent = `${names.length > 1 ? "경로" : "장소"} · ${names.join(" → ")}`;
    map?.show(ev);
  } else {
    setMapOpen(false);
  }
  history.replaceState(null, "", ev ? `#${ev.id}` : location.pathname + location.search);
}

function go(i) {
  i = Math.max(0, Math.min(rooms.length - 1, i));
  target = i;
  hall.scrollTo({ left: i * hall.clientWidth, behavior: reduce ? "auto" : "smooth" });
}
const here = () => target ?? cur;

let ticking = false;
hall.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const w = hall.clientWidth;
    const x = hall.scrollLeft / w;
    setCurrent(Math.round(x));
    if (target !== null && Math.abs(hall.scrollLeft - target * w) < 2) target = null;
    if (!reduce) parallax(x);
  });
}, { passive: true });
hall.addEventListener("scrollend", () => { target = null; });

// 뒤의 큰 숫자는 방보다 느리게 움직여 깊이가 생긴다.
function parallax(x) {
  rooms.forEach((r, k) => {
    const d = k - x;
    if (Math.abs(d) > 1.5) return;
    const bg = r.querySelector(".bgyear");
    if (bg) bg.style.transform = `translate3d(${(-d * 32).toFixed(2)}vw,0,0)`;
  });
}

// ---------- 입력 ----------

document.addEventListener("click", (e) => {
  const relic = e.target.closest(".relic");
  if (relic) {
    const room = rooms[+relic.dataset.room];
    setEvidence(room, +relic.dataset.k, true);
    go(+relic.dataset.room);
    return;
  }
  const thumb = e.target.closest(".thumb");
  if (thumb) {
    const room = thumb.closest(".room");
    if (+thumb.dataset.k !== +room.dataset.k) setEvidence(room, +thumb.dataset.k);
    return;
  }
  const to = e.target.closest("[data-go]");
  if (to) go(+to.dataset.go);
});

function setMapOpen(open) {
  mapbox.classList.toggle("open", open);
  mapToggle.setAttribute("aria-expanded", String(open));
  mapToggle.textContent = open ? "지도 닫기" : "지도";
}
mapToggle.addEventListener("click", () => setMapOpen(!mapbox.classList.contains("open")));

addEventListener("keydown", (e) => {
  if (e.altKey || e.metaKey || e.ctrlKey) return;
  const step = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }[e.key];
  if (step) { e.preventDefault(); go(here() + step); }
  else if (e.key === "Home") { e.preventDefault(); go(0); }
  else if (e.key === "End") { e.preventDefault(); go(rooms.length - 1); }
  else if (e.key === "Escape") setMapOpen(false);
});

// 세로 휠 한 번(관성 포함)에 방 하나를 넘긴다. 방 안에 아직 내릴 글이 있으면 그 글부터 내린다.
const canScroll = (el, dy) => (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0);
let gestureOpen = true, lockUntil = 0, idle = 0;
addEventListener("wheel", (e) => {
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
  go(here() + Math.sign(dy));
}, { passive: false });

let resizeT = 0;
addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    target = null;
    hall.scrollTo({ left: cur * hall.clientWidth, behavior: "auto" });
    layoutRail();
  }, 90);
});

// ---------- 시작 ----------

const startId = decodeURIComponent(location.hash.slice(1));
const start = EVENTS.findIndex((ev) => ev.id === startId) + 1;
requestAnimationFrame(() => {
  hall.scrollLeft = start * hall.clientWidth;
  setCurrent(start);
  layoutRail();
});
document.fonts?.ready.then(layoutRail);

fetch("../shared/credits.json")
  .then((r) => r.json())
  .then((c) => {
    credits = c;
    rooms.filter((r) => r.classList.contains("ev")).forEach(fillCredit);
    document.getElementById("photolist").innerHTML = EVENTS.flatMap((ev) => ev.evidence).map((e) => {
      const p = c[e.img];
      if (!p) return "";
      const lic = p.licenseUrl ? `<a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license);
      return `<li><b>${esc(e.name)}</b><br><span>${esc(p.author)} · ${lic} · <a href="${esc(p.page)}" target="_blank" rel="noopener">원본</a></span></li>`;
    }).join("");
  })
  .catch((err) => console.warn("사진 출처를 불러오지 못했습니다", err));

// 지도는 바깥 라이브러리(d3)를 받아 오므로 따로 불러온다. 실패해도 회랑은 그대로 걷는다.
import("../shared/map.js")
  .then(({ createMap, THEMES }) => createMap(document.getElementById("map"), THEMES.night, { labels: true, pad: 0.5 }))
  .then((m) => {
    map = m;
    const ev = EVENTS[cur - 1];
    if (ev) map.show(ev, { instant: true });
  })
  .catch((err) => {
    console.warn("지도를 불러오지 못했습니다", err);
    mapbox.classList.add("failed");
    mapToggle.hidden = true;
  });
