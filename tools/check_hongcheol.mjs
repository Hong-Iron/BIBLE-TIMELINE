// 홍철의 대사를 점검한다.
// 사용: node tools/check_hongcheol.mjs                  (사이트의 hongcheol.json과 hongcheol/*.json 전부)
//       node tools/check_hongcheol.mjs <묶음.json> ...   (새로 쓴 자리 묶음만: { "<자리 열쇠>": { title, questions }, ... })
//
// 형식
//   shared/hongcheol.json
//     { greeting, related_prompt, again, elsewhere_prompt, nowhere: [문장, ...],   // 하나를 골라 말한다
//       welcome_back: { same_day, days, long },                                  // 다시 온 방문자. {days}
//       spots: { "<자리 열쇠>": "자리 이름", ... } }                             // 질문이 있는 자리 목록
//     greeting·related_prompt의 {here}는 지금 자리 이름, elsewhere_prompt의 {there}는 다른 자리 이름이다.
//   shared/hongcheol/<자리 열쇠>.json
//     { key, title, link: "#화면", questions: [마디, ...] }
//   마디: { q: 방문자가 묻는 말, a: 홍철의 답(문장 또는 [변형, ...]), next?: [마디, ...], link?: "#화면", link_label? }
// 자리 열쇠: ev-<사건 id>, p-<인물 id>, c-<논쟁 id>, d-<교리의 줄기 id>, b-<책 id>, e-<시대 id>
// 링크: #<사건 id>, #p-…, #c-…, #d-…, #b-…, #s-<지도로 따라 읽기 책>, #e-…, #church, #books
//
// 점검: 형식, 길이(질문 44자, 답 300자 이하), 자리 열쇠와 링크가 실제로 있는지, 같은 자리의 같은 질문,
//       공개하지 않기로 한 내용(건강, 실명, 단체, 사생활)과 개인 묵상을 드러내는 말(팡세, 제 경험 등)
import { pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const load = (f) => import(pathToFileURL(join(ROOT, "site/shared", f)).href);
const { EVENTS, PEOPLE, ERAS } = await load("data.js");
const { BIBLE_BOOKS } = await load("books.js");
const { CONTROVERSY_INDEX } = await load("controversy_index.js");
const { GUIDES } = await load("guides.js");
const THEMES = ["trinity", "christ", "grace", "church", "scripture"];
const has = (list, id) => list.some((x) => x.id === id);
const story = (id) => (GUIDES[id]?.events || []).length > 0;

const KEY = (k) => {
  const i = k.indexOf("-"), p = k.slice(0, i + 1), id = k.slice(i + 1);
  return { "ev-": () => has(EVENTS, id), "p-": () => has(PEOPLE, id), "c-": () => has(CONTROVERSY_INDEX, id), "d-": () => THEMES.includes(id),
    "b-": () => has(BIBLE_BOOKS, id), "e-": () => has(ERAS, id) }[p]?.() ?? false;
};
const LINK = (h) => {
  if (typeof h !== "string" || !h.startsWith("#")) return false;
  const s = h.slice(1);
  if (s === "church" || s === "books" || has(EVENTS, s)) return true;
  const [p, id] = [s.slice(0, 2), s.slice(2)];
  return { "p-": () => has(PEOPLE, id), "c-": () => has(CONTROVERSY_INDEX, id), "d-": () => THEMES.includes(id), "b-": () => has(BIBLE_BOOKS, id),
    "s-": () => id === "church" || (has(BIBLE_BOOKS, id) && story(id)), "e-": () => has(ERAS, id) }[p]?.() ?? false;
};

// 공개하지 않기로 한 내용(건강, 실명, 단체, 사생활)과, 개인 묵상을 드러내는 말. 홍철은 일기를 꺼내는 사람이 아니라 안내하는 사람이다.
const PRIVATE = [/우울/, /양극성/, /조울/, /공황/, /정신과/, /정신 ?건강/, /약물/, /복용/, /진단/, /상담 ?센터/, /자살/, /자해/, /ADHD/i, /불안 ?장애/, /수면제/, /입원/,
  /학점/, /성적표/, /등록금/, /계좌/, /후원금/, /연봉/, /월급/, /CCC/i, /순장/, /대표단/, /철민/,
  /팡세/, /묵상 ?글/, /제 ?묵상/, /제 경험/, /제가 쓴/, /제가 썼/, /저도 그랬/, /저도 그런 적/, /제 블로그/, /강의안/, /교안/, /수련회/];

const errors = [], stats = { spots: 0, questions: 0, nodes: 0, answers: 0, links: 0, maxDepth: 0 };
const err = (m) => errors.push(m);
const texts = (v) => (Array.isArray(v) ? v : [v]);
const checkText = (where, t, max) => {
  if (typeof t !== "string" || t.trim().length < 2) return err(`${where}: 글이 비었다`);
  if (t.length > max) err(`${where}: ${t.length}자(최대 ${max}자) '${t.slice(0, 30)}…'`);
  for (const re of PRIVATE) if (re.test(t)) err(`${where}: 쓰지 않기로 한 말(${re}) '${t.slice(0, 40)}…'`);
};
function node(where, n, depth) {
  stats.nodes++;
  stats.maxDepth = Math.max(stats.maxDepth, depth);
  if (depth > 4) err(`${where}: 4단보다 깊다`);
  checkText(`${where} q`, n.q, 44);
  if (n.a == null) err(`${where}: 답(a)이 없다`);
  for (const [i, a] of texts(n.a).entries()) { checkText(`${where} a${i}`, a, 300); stats.answers++; }
  if (n.link != null) { stats.links++; if (!LINK(n.link)) err(`${where}: 링크 '${n.link}'가 없는 화면이다`); if (n.link_label && n.link_label.length > 18) err(`${where}: link_label이 길다`); }
  const seen = new Set();
  (n.next || []).forEach((c, i) => {
    if (seen.has(c.q)) err(`${where}: 같은 자리에 같은 질문 '${c.q}'`);
    seen.add(c.q);
    node(`${where} > ${i + 1}`, c, depth + 1);
  });
}
function spot(key, sp) {
  stats.spots++;
  if (!KEY(key)) err(`${key}: 없는 자리 열쇠다`);
  if (!sp.title) err(`${key}: title이 없다`);
  const qs = sp.questions || [];
  if (qs.length < 2) err(`${key}: 질문이 ${qs.length}개다(2개 이상)`);
  const seen = new Set();
  qs.forEach((n, i) => {
    if (seen.has(n.q)) err(`${key}: 같은 질문 '${n.q}'`);
    seen.add(n.q);
    stats.questions++;
    node(`${key} [${i + 1}] '${(n.q || "").slice(0, 14)}'`, n, 1);
  });
}

const files = process.argv.slice(2);
if (files.length) {
  for (const f of files) for (const [k, sp] of Object.entries(JSON.parse(readFileSync(resolve(f), "utf8")))) spot(k, sp);
} else {
  const base = JSON.parse(readFileSync(join(ROOT, "site/shared/hongcheol.json"), "utf8"));
  for (const k of ["greeting", "related_prompt", "again", "elsewhere_prompt", "nowhere"]) {
    if (!base[k]) err(`hongcheol.json: ${k}가 없다`);
    texts(base[k] || []).forEach((t, i) => checkText(`hongcheol.json ${k}[${i}]`, t, 160));
  }
  if (!base.welcome_back) err("hongcheol.json: welcome_back이 없다");
  const dir = join(ROOT, "site/shared/hongcheol");
  const onDisk = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)) : [];
  for (const k of Object.keys(base.spots || {})) if (!onDisk.includes(k)) err(`spots의 '${k}' 파일이 없다`);
  for (const k of onDisk) {
    if (!base.spots?.[k]) err(`hongcheol/${k}.json이 spots 목록에 없다`);
    const sp = JSON.parse(readFileSync(join(dir, `${k}.json`), "utf8"));
    if (sp.key !== k) err(`hongcheol/${k}.json: key가 파일 이름과 다르다`);
    if (!LINK(sp.link)) err(`hongcheol/${k}.json: link '${sp.link}'가 없는 화면이다`);
    spot(k, sp);
  }
}

console.log(`  자리 ${stats.spots}, 첫 질문 ${stats.questions}, 마디 ${stats.nodes}(가장 깊이 ${stats.maxDepth}단), 답 ${stats.answers}, 화면 링크 ${stats.links}`);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors.slice(0, 80)) console.log("✗ " + e); if (errors.length > 80) console.log(`… 그리고 ${errors.length - 80}건`); process.exit(1); }
console.log("\n오류 없음");
