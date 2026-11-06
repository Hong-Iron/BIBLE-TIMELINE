// 교회사 자료를 점검한다.
// 사용: node tools/check_church.mjs            (전체)
//       node tools/check_church.mjs v2         (사건·인물 묶음 church_ev2.js와 profiles_c2.js만)
//       node tools/check_church.mjs k3         (논쟁 묶음 controversies_3.js만)
//       --strict  다른 묶음이 아직 쓰지 않은 id를 가리켜도 오류로 본다(모든 묶음이 끝난 뒤)
// 먼저 python3 tools/build_verses.py를 돌려 새 장절의 본문을 verses.js에 넣는다.
// 시대 배경(bg_c1·c2.js)은 tools/check_bg.mjs c1 / c2로 점검한다.
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const SHARED = join(ROOT, "site/shared");
const load = (f) => import(pathToFileURL(join(SHARED, f)).href);
const { EVENTS, PEOPLE, PLACES, ERAS, STRENGTH } = await load("data.js");
const { VERSES } = await load("verses.js");
const { QUOTABLE } = await load("sources.js");
const { SOURCES: BG_SOURCES } = await load("backgrounds.js");
const { TRADITIONS, THEMES, CONTROVERSIES, CONTROVERSY_SOURCES } = await load("controversies.js");
const { PROFILES } = await load("profiles.js");
const { CH_IMG, CH_SOURCES } = await load("church_events.js");
const SOURCES = { ...CH_SOURCES, ...CONTROVERSY_SOURCES, ...BG_SOURCES };

// CHURCH_HISTORY.md의 공통 id 명단
const ROSTER = {
  1: {
    range: [100, 451],
    events: "marcion-expelled polycarp-martyr decian-persecution great-persecution edict-milan nicaea-325 athanasius-canon constantinople-381 carthage-418 ephesus-431 ephesus-449 chalcedon-451",
    people: "ignatius polycarp justin irenaeus tertullian origen cyprian marcion montanus sabellius arius athanasius basil gregorynazianzus gregorynyssa ephrem apollinaris augustine pelagius cyrilalexandria nestorius leo1 dioscorus eutyches constantine theodosius",
    controversies: "gnosticism marcionism montanism quartodeciman lapsi-donatism modalism arianism pneumatomachi apollinarianism nestorius pelagianism chalcedon",
  },
  2: {
    range: [451, 1204],
    events: "constantinople-553 constantinople-681 iconoclasm-726 nicaea-787 triumph-843 xian-stele-781 charlemagne-800 photius-867 schism-1054 crusade-1095 sack-1204",
    people: "justinian severus maximus johndamascene gregory1 photius charlemagne gottschalk paschasius ratramnus berengar cerularius humbert anselm abelard bernard",
    controversies: "three-chapters monothelitism iconoclasm filioque predestination-gottschalk eucharist-medieval schism-1054 atonement",
  },
  3: {
    range: [1204, 1650],
    events: "lateran-1215 palamas-1351 schism-1378 constance-1415 florence-1439 fall-1453 theses-1517 worms-1521 schleitheim-1527 marburg-1529 augsburg-1530 supremacy-1534 institutes-1536 trent-1545 heidelberg-1563 dort-1618 lucaris-1629 westphalia-1648",
    people: "innocent3 francis aquinas palamas barlaam wycliffe hus markephesus erasmus luther zwingli melanchthon grebel calvin cranmer loyola arminius lucaris",
    controversies: "hesychasm conciliarism wycliffe-hus florence-union justification free-will lords-supper baptism scripture-tradition predestination-dort",
  },
};
for (const r of Object.values(ROSTER)) for (const k of ["events", "people", "controversies"]) r[k] = r[k].split(" ");
const ALL_ROSTER = { events: new Set(), people: new Set(), controversies: new Set() };
for (const r of Object.values(ROSTER)) for (const k of Object.keys(ALL_ROSTER)) r[k].forEach((id) => ALL_ROSTER[k].add(id));

const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const strict = process.argv.includes("--strict");
const groups = arg ? [arg] : ["v1", "v2", "v3", "k1", "k2", "k3"];
const errors = [], notes = [];
const err = (m) => errors.push(m);
const EV = new Map(EVENTS.map((e) => [e.id, e])), PE = new Map(PEOPLE.map((p) => [p.id, p]));
const ERA = new Map(ERAS.map((e) => [e.id, e]));
const KO = new Map(CONTROVERSIES.map((c) => [c.id, c]));
const srcId = (s) => String(s).split(":")[0].trim();
const checkSrc = (where, list) => {
  if (!Array.isArray(list) || !list.length) return err(`${where}: src가 없다`);
  for (const s of list) if (!SOURCES[srcId(s)]) err(`${where}: 출처 id '${srcId(s)}'가 목록에 없다`);
};
const checkQuote = (where, q) => {
  if (!q) return;
  if (!q.text || !q.src) return err(`${where}: quote에는 text와 src가 필요하다`);
  const s = SOURCES[srcId(q.src)];
  if (!s) err(`${where}: 인용 출처 '${srcId(q.src)}'가 목록에 없다`);
  else if (!QUOTABLE.has(s.license)) err(`${where}: 인용 출처 '${srcId(q.src)}'(${s.license})는 옮겨 실을 수 없다`);
  if (q.text.length > 150) err(`${where}: 인용이 150자를 넘는다`);
};
const checkRefs = (where, refs) => { for (const r of refs || []) if (!VERSES[r]) err(`${where}: 장절 '${r}'가 verses.js에 없다(build_verses.py를 먼저 돌린다)`); };
// 다른 묶음이 쓸 id: 명단에 있으면 아직 없어도 괜찮다(--strict가 아니면)
const refOk = (kind, id, have) => have || (!strict && ALL_ROSTER[kind].has(id));
const inMap = ([lon, lat]) => lon >= -11 && lon <= 66 && lat >= 15 && lat <= 58;

for (const grp of groups) {
  const n = grp.slice(1);
  const R = ROSTER[n];
  if (grp[0] === "v") {
    const mod = await load(`church_ev${n}.js`);
    const events = mod[`CH_EVENTS_${n}`], people = mod[`CH_PEOPLE_${n}`], places = mod[`PLACES_CH${n}`], imgs = mod[`IMG_CH${n}`];
    const profs = (await load(`profiles_c${n}.js`))[`PROFILES_C${n}`];
    for (const id of R.events) if (!events.some((e) => e.id === id)) err(`${grp}: 명단의 사건 '${id}'가 없다`);
    for (const id of R.people) if (!people.some((p) => p.id === id)) err(`${grp}: 명단의 인물 '${id}'가 없다`);
    for (const [id, p] of Object.entries(places)) {
      if (!/^[a-z][a-z0-9]*$/.test(id)) err(`PLACES_CH${n}.${id}: id는 영어 소문자와 숫자만`);
      if (!p.name || !Array.isArray(p.at) || !inMap(p.at)) err(`PLACES_CH${n}.${id}: name과 지도 범위(경도 -11~66, 위도 15~58) 안의 at이 필요하다`);
    }
    for (const e of events) {
      const where = `${grp} 사건 ${e.id}`;
      if (EVENTS.filter((x) => x.id === e.id).length > 1) err(`${where}: 같은 id의 사건이 또 있다`);
      for (const k of ["title", "year", "yearLabel", "era", "summary"]) if (e[k] == null || e[k] === "") err(`${where}: ${k}가 없다`);
      const era = ERA.get(e.era);
      if (!era) err(`${where}: 시대 '${e.era}'가 없다`);
      else if (e.year < era.from || e.year > era.to) err(`${where}: ${e.year}년이 시대 ${e.era}(${era.from}~${era.to}) 밖이다`);
      if (e.year < R.range[0] || e.year > R.range[1]) err(`${where}: ${e.year}년이 이 묶음의 기간 밖이다`);
      if (!e.route?.length) err(`${where}: route(장소)가 없다`);
      for (const id of e.route || []) if (!PLACES[id]) err(`${where}: 장소 '${id}'가 없다`); else if (!inMap(PLACES[id].at)) err(`${where}: 장소 '${id}'가 지도 범위 밖이다`);
      for (const id of e.people || []) if (!refOk("people", id, PE.has(id))) err(`${where}: 인물 '${id}'가 없다`);
      if (!e.source) err(`${where}: source(그 사건을 전하는 옛 문헌 한두 줄)가 없다`); else checkQuote(`${where} source`, e.source);
      if (e.controversy && !refOk("controversies", e.controversy, KO.has(e.controversy))) err(`${where}: 논쟁 '${e.controversy}'가 없다`);
      (e.evidence || []).forEach((v, i) => {
        const w = `${where} 증거 ${i + 1}`;
        for (const k of ["name", "where", "says", "strength"]) if (!v[k]) err(`${w}: ${k}가 없다`);
        if (!STRENGTH[v.strength]) err(`${w}: strength '${v.strength}'가 없다`);
        if (v.kind !== "place" && v.img && v.madeYear == null) err(`${w}: 유물이면 madeYear가 필요하다`);
        if (v.img && !imgs[v.img] && !CH_IMG[v.img] && !existsSync(join(ROOT, "site/img", `${v.img}.jpg`))) err(`${w}: 사진 '${v.img}'를 IMG_CH${n}에 적지 않았다`);
      });
      if (!(e.evidence || []).length) notes.push(`${where}: 증거가 없다(전시실에 글만 보인다)`);
    }
    for (const p of people) {
      if (PEOPLE.filter((x) => x.id === p.id).length > 1) err(`${grp} 인물 ${p.id}: 같은 id의 인물이 또 있다`);
      if (!p.name || p.from == null || p.to == null || !p.kind) err(`${grp} 인물 ${p.id}: name·from·to·kind가 필요하다`);
      if (!profs[p.id]) notes.push(`${grp} 인물 ${p.id}: 프로필이 없다`);
    }
    for (const id of Object.keys(profs)) if (!PE.has(id)) err(`profiles_c${n}.${id}: 인물 목록에 없는 id다`);
    for (const [k, f] of Object.entries(imgs)) if (!/^[a-z][a-z0-9-]*$/.test(k) || !String(f).startsWith("File:")) err(`IMG_CH${n}.${k}: 키는 영어 소문자, 값은 'File:…'`);
    notes.push(`${grp}: 사건 ${events.length}, 인물 ${people.length}, 프로필 ${Object.keys(profs).length}, 새 장소 ${Object.keys(places).length}, 사진 ${Object.keys(imgs).length}`);
  } else {
    const list = (await load(`controversies_${n}.js`))[`CONTROVERSIES_${n}`];
    for (const id of R.controversies) if (!list.some((c) => c.id === id)) err(`${grp}: 명단의 논쟁 '${id}'가 없다`);
    for (const c of list) {
      const where = `${grp} 논쟁 ${c.id}`;
      for (const k of ["title", "from", "to", "era", "question", "summary"]) if (c[k] == null || c[k] === "") err(`${where}: ${k}가 없다`);
      if (!ERA.get(c.era)) err(`${where}: 시대 '${c.era}'가 없다`);
      if (!c.themes?.length || c.themes.some((t) => !THEMES.some((x) => x.id === t))) err(`${where}: themes는 ${THEMES.map((t) => t.id).join("·")} 가운데서`);
      if (!Array.isArray(c.sides) || c.sides.length < 2 || c.sides.length > 4) err(`${where}: sides는 2~4쪽`);
      (c.sides || []).forEach((s, i) => {
        if (!s.name || !s.claim) err(`${where} 주장 ${i + 1}: name과 claim이 필요하다`);
        checkRefs(`${where} 주장 ${i + 1}`, s.refs);
        checkQuote(`${where} 주장 ${i + 1}`, s.quote);
        for (const id of s.people || []) if (!refOk("people", id, PE.has(id))) err(`${where} 주장 ${i + 1}: 인물 '${id}'가 없다`);
      });
      if (!c.decision?.text) err(`${where}: decision.text가 없다`);
      checkQuote(`${where} 결정`, c.decision?.quote);
      for (const id of c.decision?.events || []) if (!refOk("events", id, EV.has(id))) err(`${where} 결정: 사건 '${id}'가 없다`);
      for (const t of TRADITIONS) {
        const p = c.positions?.[t.id];
        if (!p?.text) { err(`${where}: ${t.name}(${t.id})의 입장이 없다`); continue; }
        checkSrc(`${where} ${t.id}`, p.src);
      }
      for (const id of c.people || []) if (!refOk("people", id, PE.has(id))) err(`${where}: 인물 '${id}'가 없다`);
      for (const id of c.events || []) if (!refOk("events", id, EV.has(id))) err(`${where}: 사건 '${id}'가 없다`);
      for (const l of c.links || []) if (!refOk("controversies", l.id, KO.has(l.id))) err(`${where}: 이어진 논쟁 '${l.id}'가 없다`);
      checkSrc(`${where}`, c.src);
      notes.push(`${where}: 주장 ${c.sides?.length ?? 0}쪽, 입장 ${TRADITIONS.filter((t) => c.positions?.[t.id]?.text).length}/6`);
    }
  }
}

for (const n of notes) console.log("  " + n);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors) console.log("✗ " + e); process.exit(1); }
console.log("\n오류 없음");
