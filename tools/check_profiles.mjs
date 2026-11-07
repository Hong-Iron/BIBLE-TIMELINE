// 인물 프로필을 점검한다.
// 사용: node tools/check_profiles.mjs                 (사이트의 모든 프로필 + 프로필이 없는 인물)
//       node tools/check_profiles.mjs <파일.js> ...    (새로 쓴 묶음만. 파일은 프로필 객체 하나를 export 한다)
// 점검:
//   - 연표의 모든 인물에게 프로필이 있는지(전체 점검일 때)
//   - id가 인물 목록에 있는지, role·summary·facts·life가 있는지
//   - places·family의 id·life의 event가 실제로 있는지
//   - quotes의 장절이 개역한글에 있는지(tools/.cache/bible_1961_krv.json. 없으면 build_verses.py를 한 번 돌린다)
//   - 사실·생애·가족마다 근거(장절 ref나 출처 src)가 있는지, src가 'id: 위치' 꼴이면 그 id가 출처 목록에 있는지
//   - records가 전시실 유물(ev)을 가리키거나 name·says·strength를 갖췄는지
import { pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const load = (f) => import(pathToFileURL(join(ROOT, "site/shared", f)).href);
const { PEOPLE, EVENTS, PLACES, STRENGTH } = await load("data.js");
const { PROFILES } = await load("profiles.js");
const { CH_SOURCES } = await load("church_events.js");
const { SOURCES: BG_SOURCES } = await load("backgrounds.js");
const { CONTROVERSY_SOURCES } = await load("controversies.js");
const SOURCES = { ...CH_SOURCES, ...BG_SOURCES, ...CONTROVERSY_SOURCES };

// build_verses.py와 같은 책 약칭과 장절 읽기
const BOOKS = {
  창: "Genesis", 출: "Exodus", 레: "Leviticus", 민: "Numbers", 신: "Deuteronomy", 수: "Joshua", 삿: "Judges", 룻: "Ruth",
  삼상: "1Samuel", 삼하: "2Samuel", 왕상: "1Kings", 왕하: "2Kings", 대상: "1Chronicles", 대하: "2Chronicles", 스: "Ezra",
  느: "Nehemiah", 에: "Esther", 욥: "Job", 시: "Psalms", 잠: "Proverbs", 전: "Ecclesiastes", 아: "SongofSolomon", 사: "Isaiah",
  렘: "Jeremiah", 애: "Lamentations", 겔: "Ezekiel", 단: "Daniel", 호: "Hosea", 욜: "Joel", 암: "Amos", 옵: "Obadiah", 욘: "Jonah",
  미: "Micah", 나: "Nahum", 합: "Habakkuk", 습: "Zephaniah", 학: "Haggai", 슥: "Zechariah", 말: "Malachi", 마: "Matthew",
  막: "Mark", 눅: "Luke", 요: "John", 행: "Acts", 롬: "Romans", 고전: "1Corinthians", 고후: "2Corinthians", 갈: "Galatians",
  엡: "Ephesians", 빌: "Philippians", 골: "Colossians", 살전: "1Thessalonians", 살후: "2Thessalonians", 딤전: "1Timothy",
  딤후: "2Timothy", 딛: "Titus", 몬: "Philemon", 히: "Hebrews", 약: "James", 벧전: "1Peter", 벧후: "2Peter", 요일: "1John",
  요이: "2John", 요삼: "3John", 유: "Jude", 계: "Revelation",
};
const CACHE = join(ROOT, "tools/.cache/bible_1961_krv.json");
const BIBLE = existsSync(CACHE) ? Object.fromEntries(JSON.parse(readFileSync(CACHE, "utf8")).map((b) =>
  [b.book, Object.fromEntries(b.chapters.map((c) => [c.chapter, Object.fromEntries(c.verses.map((v) => [v.verse, v.text]))]))])) : null;
function verseProblem(ref) {
  let book = null, chap = null;
  for (let seg of ref.split(";")) {
    seg = seg.trim();
    const m = seg.match(/^([가-힣]+)\s+(.*)$/);
    if (m) { book = m[1]; seg = m[2]; }
    if (!BOOKS[book]) return `책 약칭 '${book}'를 모른다`;
    for (const item of seg.split(",").map((s) => s.trim())) {
      const n = item.match(/^(?:(\d+):)?(\d+)(?:-(\d+))?$/);
      if (!n) return `'${item}'를 읽지 못했다`;
      if (n[1]) chap = +n[1];
      if (chap == null) return "장이 없다";
      for (let v = +n[2]; v <= +(n[3] || n[2]); v++) if (BIBLE && !BIBLE[BOOKS[book]]?.[chap]?.[v]) return `${book} ${chap}:${v}가 개역한글에 없다`;
    }
  }
  return null;
}

const PE = new Set(PEOPLE.map((p) => p.id)), EV = new Set(EVENTS.map((e) => e.id));
// 기록 카드가 { ev: 사진 id }로 가리키는 전시실 유물(profile.js와 같은 방식)
const EVIDENCE = new Set(EVENTS.flatMap((ev) => (ev.evidence || []).filter((e) => e.img).map((e) => e.img)));
const errors = [], notes = [];
const err = (m) => errors.push(m);
// 근거는 성경 장절(ref)이나 옛 문헌·책(src) 가운데 하나 이상
const checkSrc = (where, s, ref) => {
  if (ref) { const pr = verseProblem(ref); if (pr) err(`${where} 장절 '${ref}': ${pr}`); }
  if (!s) return ref ? null : err(`${where}: 근거(ref나 src)가 없다`);
  const m = String(s).match(/^([a-z][a-z0-9]*)\s*:/);
  if (m && !SOURCES[m[1]]) err(`${where}: 출처 id '${m[1]}'가 목록에 없다`);
};

function checkOne(id, f) {
  const w = `프로필 ${id}`;
  if (!PE.has(id)) err(`${w}: 인물 목록에 없는 id다`);
  for (const k of ["role", "summary"]) if (!f[k]) err(`${w}: ${k}가 없다`);
  if (!Array.isArray(f.facts) || f.facts.length < 3) err(`${w}: facts는 3개 이상`);
  if (!Array.isArray(f.life) || f.life.length < 3) err(`${w}: life는 3개 이상`);
  (f.facts || []).forEach((x, i) => { if (!x.k || !x.v) err(`${w} facts[${i}]: k와 v가 필요하다`); checkSrc(`${w} facts[${i}] '${x.k}'`, x.src, x.ref); });
  (f.life || []).forEach((x, i) => {
    if (!x.text) err(`${w} life[${i}]: text가 없다`);
    checkSrc(`${w} life[${i}]`, x.src, x.ref);
    if (x.event && !EV.has(x.event)) err(`${w} life[${i}]: 사건 '${x.event}'가 없다`);
  });
  (f.family || []).forEach((x, i) => {
    if (!x.rel || !x.name) err(`${w} family[${i}]: rel과 name이 필요하다`);
    if (x.id && !PE.has(x.id)) err(`${w} family[${i}]: 인물 '${x.id}'가 없다(id를 빼고 이름만 적는다)`);
    checkSrc(`${w} family[${i}]`, x.src, x.ref);
  });
  for (const p of f.places || []) if (!PLACES[p]) err(`${w}: 장소 '${p}'가 없다`);
  for (const q of f.quotes || []) {
    if (typeof q !== "string") { err(`${w}: quotes는 개역한글 장절 문자열만 쓴다`); continue; }
    const pr = verseProblem(q);
    if (pr) err(`${w} 구절 '${q}': ${pr}`);
  }
  (f.records || []).forEach((r, i) => {
    if (r.ev) { if (!EVIDENCE.has(r.ev)) err(`${w} records[${i}]: 전시실 유물 '${r.ev}'가 없다`); return; }
    for (const k of ["name", "says", "strength"]) if (!r[k]) err(`${w} records[${i}]: ${k}가 없다`);
    if (r.strength && !STRENGTH[r.strength]) err(`${w} records[${i}]: strength '${r.strength}'가 없다`);
  });
  notes.push(`${id}: 사실 ${(f.facts || []).length}, 생애 ${(f.life || []).length}, 가족·관계 ${(f.family || []).length}, 장소 ${(f.places || []).length}, 구절 ${(f.quotes || []).length}, 기록 ${(f.records || []).length}`);
}

const files = process.argv.slice(2);
if (!BIBLE) notes.push("개역한글 캐시가 없어 장절은 형식만 보았다(python3 -I tools/build_verses.py를 한 번 돌린다)");
if (files.length) {
  for (const file of files) {
    const mod = await import(pathToFileURL(resolve(file)).href);
    for (const obj of Object.values(mod)) for (const [id, f] of Object.entries(obj)) checkOne(id, f);
  }
} else {
  for (const [id, f] of Object.entries(PROFILES)) checkOne(id, f);
  for (const p of PEOPLE) if (!PROFILES[p.id]) err(`인물 ${p.id}(${p.name}): 프로필이 없다. 연표에서 눌러도 열리지 않는다`);
}

if (files.length) for (const n of notes) console.log("  " + n);
else console.log(`  프로필 ${Object.keys(PROFILES).length}개, 인물 ${PEOPLE.length}명`);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors) console.log("✗ " + e); process.exit(1); }
console.log("\n오류 없음");
