// 책 해설의 '지도로 따라 읽기' 장소를 점검한다.
// 사용: node tools/check_places.mjs            (전체)
//       node tools/check_places.mjs g3         (guides_g3.js와 places_g3.js만)
// 점검: 사건의 at과 home의 id가 모두 있는지, 새 장소의 좌표가 지도 범위(경도 0~66, 위도 15~50) 안인지,
//       새 장소가 기존 장소와 id·이름이 겹치지 않는지, 묶음 사이에 같은 id를 다르게 적지 않았는지.
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const SHARED = join(dirname(new URL(import.meta.url).pathname), "../site/shared");
const load = (f) => import(pathToFileURL(join(SHARED, f)).href);
const { PLACES, EVENTS } = await load("data.js");
const EV = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

const only = process.argv[2];
const groups = only ? [Number(only.replace(/\D/g, ""))] : [1, 2, 3, 4, 5, 6, 7];
const errors = [], notes = [];
const err = (m) => errors.push(m);

// data.js 본래 장소(표본 + events_more)는 새 장소 파일보다 먼저 정해졌다.
// data.js는 새 장소를 ??=로 더하므로, PLACES[id]가 새 장소 파일의 객체가 아니면 본래 장소다.
const NEWDEF = {}, NEWOBJ = new Set();
for (let i = 1; i <= 7; i++) {
  const mod = await load(`places_g${i}.js`);
  for (const [id, p] of Object.entries(mod[`PLACES_G${i}`])) { (NEWDEF[id] ??= []).push({ g: i, ...p }); NEWOBJ.add(p); }
}
const ORIGINAL = new Set(Object.keys(PLACES).filter((id) => !NEWOBJ.has(PLACES[id])));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const bare = (n) => n.replace(/\(.*?\)/g, "").replace(/\s/g, "");

for (const g of groups) {
  const mod = await load(`places_g${g}.js`);
  for (const [id, p] of Object.entries(mod[`PLACES_G${g}`])) {
    const where = `places_g${g}.js ${id}`;
    if (!/^[a-z][a-z0-9]*$/.test(id)) err(`${where}: id는 영어 소문자와 숫자만 쓴다`);
    if (ORIGINAL.has(id)) err(`${where}: 이미 있는 id다(${PLACES[id].name}). 새로 만들지 말고 그대로 쓴다`);
    if (!p.name || !/[가-힣]/.test(p.name)) err(`${where}: name은 한글 지명`);
    const [lon, lat] = p.at || [];
    if (!(lon >= 0 && lon <= 66 && lat >= 15 && lat <= 50)) err(`${where}: 좌표 [${p.at}]가 지도 범위 밖이거나 [경도, 위도] 순서가 아니다`);
    for (const [oid, o] of Object.entries(PLACES)) {
      if (oid === id || !ORIGINAL.has(oid)) continue;
      if (bare(o.name) === bare(p.name)) err(`${where}: 기존 장소 ${oid}(${o.name})와 이름이 같다. ${oid}를 쓴다`);
      else if (p.at && dist(o.at, p.at) < 0.05) notes.push(`${where}(${p.name}): 기존 ${oid}(${o.name})와 0.05도 안에 있다. 같은 곳이면 ${oid}를 쓴다`);
    }
  }
  const { [`GUIDES_G${g}`]: guides } = await load(`guides_g${g}.js`);
  for (const [bid, gd] of Object.entries(guides)) {
    const home = gd.home;
    if (!home || !Array.isArray(home.at) || !home.at.length) err(`${bid}: home.at이 없다`);
    else {
      for (const id of home.at) if (!PLACES[id]) err(`${bid}: home.at의 '${id}'가 장소 목록에 없다`);
      if (!home.label) err(`${bid}: home.label이 없다`);
    }
    let withAt = 0, viaEvent = 0, viaHome = 0;
    (gd.events || []).forEach((e, i) => {
      const where = `${bid} 사건 ${i + 1}('${e.text.slice(0, 18)}…')`;
      if (e.at) {
        if (!Array.isArray(e.at) || !e.at.length) err(`${where}: at은 장소 id 배열`);
        else for (const id of e.at) if (!PLACES[id]) err(`${where}: '${id}'가 장소 목록에 없다`);
        if (e.move && e.at.length < 2) err(`${where}: move인데 장소가 하나뿐이다`);
        withAt++;
      } else if (e.event && EV[e.event]) viaEvent++;
      else viaHome++;
      if (e.move && !e.at) err(`${where}: move는 at과 함께 쓴다`);
    });
    notes.push(`${bid}: 사건 ${gd.events?.length ?? 0}개 — at ${withAt}, 전시실 경로 ${viaEvent}, 책의 배경 ${viaHome}`);
  }
}

// 묶음 사이에 같은 id를 서로 다르게 적었는지
for (const [id, defs] of Object.entries(NEWDEF)) {
  if (defs.length < 2) continue;
  const far = defs.some((d) => dist(d.at, defs[0].at) > 0.15), named = new Set(defs.map((d) => bare(d.name))).size > 1;
  if (far || named) err(`${id}: 묶음 ${defs.map((d) => `g${d.g} ${d.name} [${d.at}]`).join(" / ")} 가 서로 다르다`);
}

for (const n of notes) console.log("  " + n);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors) console.log("✗ " + e); process.exit(1); }
console.log("\n오류 없음");
