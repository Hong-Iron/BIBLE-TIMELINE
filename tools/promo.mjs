// 사이트를 소개할 그림(카톡·SNS에 올릴 카드)을 만든다. 미리보기 서버(tools/serve.py, 8793)가 떠 있어야 한다.
// 사용: node tools/promo.mjs            → promo/ 에 00-한눈에.jpg, 01~08 기능 카드, 09-휴대폰.jpg
//       node tools/promo.mjs --shots-only (화면만 다시 찍기) · --cards-only (찍어 둔 화면으로 카드만) · --only=home,story
//       node tools/promo.mjs --only=m-home,m-bot,m-debate --card=phones3 (휴대폰 세 화면 카드 하나만)
// 화면은 2배 해상도로 찍고, 카드 HTML을 만들어 다시 찍은 뒤 JPEG로 줄인다.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const OUT = join(ROOT, "promo"), TMP = join(tmpdir(), "bt-promo");
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
const SITE = "http://localhost:8793/";

// 찍기 전에 페이지에서 할 일
const wait = (ms) => `await new Promise((r) => setTimeout(r, ${ms}));`;
// '이동' 표시가 붙은 사건 가운데 장소가 가장 많은 것을 눌러 지도에 길이 그려진 장면을 찍는다.
// 홍철 옆의 '!' 안내(처음 온 사람에게 뜨는 것)는 소개 그림에서 뺀다.
const NOHINT = `document.querySelector(".robot")?.classList.remove("has-hint");`;
const STORY_MOVE = `${wait(1500)} const moves = [...document.querySelectorAll(".st-step")].filter((c) => c.querySelector(".st-where b")?.textContent === "이동"); const n = (c) => (c.querySelector(".st-where").textContent.match(/→/g) || []).length; moves.sort((a, b) => n(b) - n(a))[0]?.click(); ${wait(3000)}`;
const SHOTS = [
  { id: "home", url: "#sennacherib", w: 1440, h: 900, js: `${wait(1500)} document.getElementById("gClose").click(); ${wait(2500)}` },
  { id: "gallery", url: "#sennacherib", w: 1440, h: 900, js: wait(2500) },
  { id: "profile", url: "#p-david", w: 1440, h: 900, js: wait(2500) },
  { id: "book", url: "#b-genesis", w: 1440, h: 900, js: wait(2000) },
  { id: "story", url: "#s-revelation", w: 1440, h: 900, js: STORY_MOVE },
  { id: "bg", url: "#b-2-kings.bg", w: 1440, h: 900, js: wait(2000) },
  { id: "church", url: "#church", w: 1440, h: 900, js: wait(2500) },
  { id: "debate", url: "#c-chalcedon", w: 1440, h: 900, js: wait(2500) },
  { id: "m-home", url: "", w: 390, h: 844, js: `${wait(3500)} ${NOHINT}` },
  { id: "m-gallery", url: "#david-king", w: 390, h: 844, js: wait(2500) },
  { id: "m-story", url: "#s-exodus", w: 390, h: 844, js: STORY_MOVE },
  // 논쟁: '오늘 각 교회의 입장' 칸이 위에 오도록 내린다.
  { id: "m-debate", url: "#c-chalcedon", w: 390, h: 844, js: `${wait(3500)} const sc = document.getElementById("dScroll"), pos = document.querySelector(".db-pos")?.closest("section"); if (pos) sc.scrollTop = pos.offsetTop - 70; ${wait(800)} ${NOHINT}` },
  // 홍철: 출애굽 전시실에서 말풍선을 열고 첫 질문을 고른 뒤, 답이 다 나온 장면(글자가 찍히는 중이면 눌러서 끝까지 보인다)
  { id: "m-bot", url: "#exodus", w: 390, h: 844, js: `${wait(3000)} document.querySelector(".robot__button").click(); ${wait(4000)} document.querySelector(".robot__text").click(); ${wait(700)} document.querySelectorAll(".robot__choice")[0].click(); ${wait(1500)} document.querySelector(".robot__text").click(); ${wait(1500)} ${NOHINT}` },
];

// CDN에서 d3·글꼴을 늦게 받으면 그리기 전에 찍힐 수 있다. 연표가 다 그려졌는지 보고, 아니면 세 번까지 다시 찍는다.
function shoot(s) {
  const js = join(TMP, `${s.id}.js`);
  writeFileSync(js, `(async () => { await document.fonts.ready; ${s.js} return { drawn: document.querySelectorAll("#svg g.ev").length > 0 && document.querySelectorAll("#map svg path").length > 0 }; })()`);
  for (let i = 1; i <= 3; i++) {
    const out = execFileSync("node", [join(ROOT, "tools/headless.mjs"), SITE + s.url, String(s.w), String(s.h), js, join(TMP, `${s.id}.png`)], { env: { ...process.env, SCALE: "2" } }).toString();
    if (out.includes('"drawn": true')) { console.log("찍음", s.id); return; }
    console.log("다시 찍음", s.id, i);
  }
  throw new Error(`${s.id}: 세 번 찍어도 화면이 다 그려지지 않았다`);
}

const CARDS = [
  { id: "home", no: 1, title: "연표와 지도", text: "사건을 옆으로 넘기면 지도가 그 장소로 따라가고, 사건을 뒷받침하는 유물 사진이 아래에 놓입니다." },
  { id: "gallery", no: 2, title: "전시실", text: "사건을 누르면 유물 사진, 개역한글 구절, 유물이 사건보다 몇 년 뒤에 만들어졌는지가 한 방에 펼쳐집니다." },
  { id: "profile", no: 3, title: "인물 프로필", text: "성경 인물 52명과 교회사 인물 64명의 가계도, 생애, 핵심 구절, 성경 밖 기록을 모았습니다." },
  { id: "book", no: 4, title: "성경 66권 해설", text: "책마다 쓴 사람과 때, 짜임, 주요 사건, 주제와 해석, 해석이 갈리는 대목을 정리했습니다." },
  { id: "story", no: 5, title: "지도로 따라 읽기", text: "책의 사건을 내려 읽으면 지도가 그 장소로 옮겨 가며 지나온 길을 그립니다." },
  { id: "bg", no: 6, title: "당대 배경", text: "그 시대의 사건, 문화, 문학, 글의 짜임을 성경 밖 기록과 나란히 놓고 출처를 모두 밝혔습니다." },
  { id: "church", no: 7, title: "교회사", text: "기원후 100년부터 종교개혁이 끝나는 1648년까지 시대 6개, 사건 47개, 논쟁 30편을 연표와 지도에 이어 붙였습니다." },
  { id: "debate", no: 8, title: "논쟁과 각 교회의 입장", text: "논쟁마다 쟁점, 양쪽 주장과 성경 근거, 공의회의 결정, 그리고 오늘 여섯 교회 전통의 입장을 나란히 적었습니다." },
];

const BASE_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; overflow: hidden; }
  body { color: #1c1b19; font-family: "Pretendard Variable", Pretendard, sans-serif; background: radial-gradient(120% 120% at 15% 5%, #fbfaf7, #f1ebe0 60%, #e8dfcf); }
  .shot { display: block; border-radius: 14px; border: 1px solid #ddd3c2; box-shadow: 0 3px 6px rgba(60, 45, 25, 0.08), 0 30px 60px -30px rgba(60, 45, 25, 0.45); }
  .no { display: inline-grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: #c2410c; color: #fff; font-size: 28px; font-weight: 800; }
  .url { position: absolute; right: 60px; bottom: 26px; font-size: 20px; color: #8b867c; }`;
const page = (w, h, body, css = "") => `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>${BASE_CSS} html, body { width: ${w}px; height: ${h}px; } ${css}</style></head><body>${body}
<svg width="0" height="0"><g></g></svg></body></html>`;
const img = (id) => `file://${join(TMP, `${id}.png`)}`;

// 기능 카드 하나: 위에 번호·이름·한 줄 설명, 아래에 화면
function featureCard(c) {
  return page(1600, 1180, `
    <header style="position:absolute; left:60px; top:52px; right:60px; display:flex; gap:22px; align-items:flex-start">
      <span class="no">${c.no}</span>
      <div><h1 style="margin:0; font-size:50px; font-weight:800; letter-spacing:-0.03em">${c.title}</h1>
      <p style="margin:12px 0 0; font-size:27px; line-height:1.45; color:#45413a; word-break:keep-all">${c.text}</p></div>
    </header>
    <img class="shot" src="${img(c.id)}" style="position:absolute; left:60px; top:222px; width:1480px; height:925px; object-fit:cover; object-position:top">`);
}

// 한눈에 보기: 제목과 여덟 화면 바둑판
function overview() {
  const tile = (c, i) => {
    const x = 60 + (i % 2) * 760, y = 300 + Math.floor(i / 2) * 520;
    return `<div style="position:absolute; left:${x}px; top:${y}px; width:720px">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px"><span class="no" style="width:40px; height:40px; font-size:21px">${c.no}</span><b style="font-size:30px; letter-spacing:-0.02em">${c.title}</b></div>
      <img class="shot" src="${img(c.id)}" style="width:720px; height:450px; object-fit:cover; object-position:top"></div>`;
  };
  return page(1600, 300 + Math.ceil(CARDS.length / 2) * 520 + 60, `
    <header style="position:absolute; left:60px; top:64px; right:60px">
      <p style="margin:0; font-size:24px; font-weight:700; letter-spacing:0.12em; color:#c2410c">성경 · 교회사 · 연표 · 지도 · 유물</p>
      <h1 style="margin:12px 0 0; font-size:76px; font-weight:800; letter-spacing:-0.035em">바이블 타임라인</h1>
      <p style="margin:14px 0 0; font-size:30px; color:#45413a">아브라함부터 종교개혁까지, 사건을 옆으로 넘기며 구절과 지도, 실제 유물을 함께 봅니다</p>
    </header>
    ${CARDS.map(tile).join("")}
    <div class="url">hong-iron.github.io/BIBLE-TIMELINE</div>`);
}

// 휴대폰 화면 넷
function phones() {
  const P = [["m-home", "연표와 지도"], ["m-gallery", "전시실"], ["m-story", "지도로 따라 읽기"], ["m-debate", "교회사 논쟁"]];
  return page(1600, 1090, `
    <header style="position:absolute; left:60px; top:56px">
      <h1 style="margin:0; font-size:50px; font-weight:800; letter-spacing:-0.03em">휴대폰에서도 그대로</h1>
      <p style="margin:12px 0 0; font-size:27px; color:#45413a">앱 설치 없이 링크만 열면 됩니다. 지도는 위, 연표는 아래로 바뀝니다.</p>
    </header>
    ${P.map(([id, t], i) => `<div style="position:absolute; left:${60 + i * 380}px; top:220px; width:340px; text-align:center">
      <img class="shot" src="${img(id)}" style="width:340px; height:736px; border-radius:26px; border:7px solid #1c1b19">
      <b style="display:block; margin-top:18px; font-size:28px">${t}</b></div>`).join("")}
    <div class="url">hong-iron.github.io/BIBLE-TIMELINE</div>`);
}

// 휴대폰 세 화면: 소개할 때 한 장으로 보내는 그림
const PHONES3 = [
  ["m-home", "연표와 지도", "사건을 넘기면 지도와 유물이 따라와요"],
  ["m-bot", "홍철에게 묻기", "보던 자리에서 궁금한 걸 골라 물어요"],
  ["m-debate", "교회사 논쟁", "여섯 교회의 입장을 나란히 봐요"],
];
function phones3() {
  return page(1600, 1290, `
    <header style="position:absolute; left:0; right:0; top:52px; text-align:center">
      <p style="margin:0; font-size:22px; font-weight:700; letter-spacing:0.12em; color:#c2410c">성경 · 교회사 · 연표 · 지도 · 유물</p>
      <h1 style="margin:10px 0 0; font-size:60px; font-weight:800; letter-spacing:-0.035em">바이블 타임라인</h1>
    </header>
    ${PHONES3.map(([id, t, d], i) => `<div style="position:absolute; left:${110 + i * 480}px; top:200px; width:420px; text-align:center">
      <img class="shot" src="${img(id)}" style="width:420px; height:909px; border-radius:30px; border:8px solid #1c1b19">
      <b style="display:block; margin-top:20px; font-size:30px; letter-spacing:-0.02em">${t}</b>
      <span style="display:block; margin-top:6px; font-size:21px; color:#45413a">${d}</span></div>`).join("")}
    <div class="url">hong-iron.github.io/BIBLE-TIMELINE</div>`);
}

function render(name, html, w, h) {
  const file = join(TMP, `${name}.html`), png = join(TMP, `${name}-card.png`), js = join(TMP, "card.js");
  writeFileSync(file, html);
  writeFileSync(js, `(async () => { await document.fonts.ready; ${wait(1200)} return { ok: 1 }; })()`);
  execFileSync("node", [join(ROOT, "tools/headless.mjs"), `file://${file}`, String(w), String(h), js, png], { stdio: "ignore" });
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", png, "--out", join(OUT, `${name}.jpg`)], { stdio: "ignore" });
  console.log("카드", `promo/${name}.jpg`);
}

// --only=home,story 처럼 주면 그 화면만 다시 찍는다.
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
if (!process.argv.includes("--cards-only")) for (const s of SHOTS) if (!only || only.includes(s.id)) shoot(s);
const card = process.argv.find((a) => a.startsWith("--card="))?.slice(7);
if (card === "phones3") render(`${CARDS.length + 2}-휴대폰세화면`, phones3(), 1600, 1290);
else if (!process.argv.includes("--shots-only")) {
  render(`${CARDS.length + 2}-휴대폰세화면`, phones3(), 1600, 1290);
  render("00-한눈에", overview(), 1600, 300 + Math.ceil(CARDS.length / 2) * 520 + 60);
  CARDS.forEach((c) => render(`0${c.no}-${c.title.replace(/\s/g, "")}`, featureCard(c), 1600, 1180));
  render(`0${CARDS.length + 1}-휴대폰`, phones(), 1600, 1090);
}
