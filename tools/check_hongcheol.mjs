// 홍철의 대사(site/shared/hongcheol.json)를 점검한다.
// 사용: node tools/check_hongcheol.mjs                (사이트의 hongcheol.json)
//       node tools/check_hongcheol.mjs <묶음.json> ... (새로 쓴 묶음만. 인사말 같은 공통 칸은 없어도 된다)
//
// 형식
// {
//   greeting, again, chat_prompt, here_prompt: [문장, ...]    // 하나를 골라 말한다. here_prompt의 {here}는 지금 화면 이름
//   ask: 문장 또는 [문장, ...]
//   welcome_back: { same_day, days, long, visits, resume }    // 다시 온 방문자. {days} {visits} {topic}
//   questions: [마디, ...]   // 질문하기
//   chats: [마디, ...]       // 대화하기
//   talk: [{ text, link?, link_label? }, ...]   // 아무 얘기나
// }
// 마디: { q: 방문자가 하는 말, a: 홍철의 답(문장 또는 [변형, ...]), next?: [마디, ...], tags?: [화면 열쇠], link?: "#화면", link_label?, action?: "forget" }
// 화면 열쇠: ev-<사건 id>, p-<인물 id>, c-<논쟁 id>, d-<교리의 줄기 id>, b-<책 id>, e-<시대 id>, bible, church
// 링크: #<사건 id>, #p-…, #c-…, #d-…, #b-…, #s-<지도로 따라 읽기 책>, #e-…, #church, #books
//
// 점검: 형식, 길이(질문 44자, 답 280자, 한마디 220자 이하), 링크와 열쇠가 실제로 있는지, 같은 자리의 같은 질문,
//       공개하지 않기로 한 내용(건강, 실명, 단체, 돈·성적 같은 사생활)을 가리키는 말
import { pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";

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
  if (k === "bible" || k === "church") return true;
  const [p, id] = [k.slice(0, k.indexOf("-") + 1), k.slice(k.indexOf("-") + 1)];
  return { "ev-": () => has(EVENTS, id), "p-": () => has(PEOPLE, id), "c-": () => has(CONTROVERSY_INDEX, id), "d-": () => THEMES.includes(id),
    "b-": () => has(BIBLE_BOOKS, id), "e-": () => has(ERAS, id) }[p]?.() ?? false;
};
const LINK = (h) => {
  if (!h.startsWith("#")) return false;
  const s = h.slice(1);
  if (s === "church" || s === "books") return true;
  if (has(EVENTS, s)) return true;
  const [p, id] = [s.slice(0, 2), s.slice(2)];
  return { "p-": () => has(PEOPLE, id), "c-": () => has(CONTROVERSY_INDEX, id), "d-": () => THEMES.includes(id), "b-": () => has(BIBLE_BOOKS, id),
    "s-": () => id === "church" || (has(BIBLE_BOOKS, id) && story(id)), "e-": () => has(ERAS, id) }[p]?.() ?? false;
};

// 공개하지 않기로 한 내용(사용자 결정: 생각과 신앙만). 이런 말이 나오면 문장을 다시 본다.
const PRIVATE = [/우울/, /양극성/, /조울/, /공황/, /정신과/, /정신 ?건강/, /약물/, /복용/, /진단/, /상담 ?센터/, /자살/, /자해/, /ADHD/i, /불안 ?장애/, /수면제/, /입원/,
  /학점/, /성적표/, /등록금/, /계좌/, /후원금/, /연봉/, /월급/, /CCC/i, /순장/, /대표단/, /철민/];

const errors = [], stats = { questions: 0, chats: 0, nodes: 0, answers: 0, talk: 0, links: 0, tagged: 0, maxDepth: 0 };
const err = (m) => errors.push(m);
const texts = (v) => (Array.isArray(v) ? v : [v]);
const checkText = (where, t, max) => {
  if (typeof t !== "string" || t.trim().length < 2) return err(`${where}: 글이 비었다`);
  if (t.length > max) err(`${where}: ${t.length}자(최대 ${max}자) '${t.slice(0, 30)}…'`);
  for (const re of PRIVATE) if (re.test(t)) err(`${where}: 공개하지 않기로 한 내용일 수 있다(${re}) '${t.slice(0, 40)}…'`);
};
function node(where, n, depth) {
  stats.nodes++;
  stats.maxDepth = Math.max(stats.maxDepth, depth);
  if (depth > 6) err(`${where}: 6단보다 깊다`);
  checkText(`${where} q`, n.q, 44);
  if (n.a == null) err(`${where}: 답(a)이 없다`);
  for (const [i, a] of texts(n.a).entries()) { checkText(`${where} a${i}`, a, 280); stats.answers++; }
  if (n.link != null) { stats.links++; if (!LINK(n.link)) err(`${where}: 링크 '${n.link}'가 없는 화면이다`); if (n.link_label && n.link_label.length > 16) err(`${where}: link_label이 길다`); }
  if (n.tags) { stats.tagged++; for (const k of n.tags) if (!KEY(k)) err(`${where}: 화면 열쇠 '${k}'가 없다`); }
  if (n.action && n.action !== "forget") err(`${where}: action은 forget만`);
  const seen = new Set();
  (n.next || []).forEach((c, i) => {
    if (seen.has(c.q)) err(`${where}: 같은 자리에 같은 질문 '${c.q}'`);
    seen.add(c.q);
    node(`${where} > ${i + 1}`, c, depth + 1);
  });
}
function check(name, d, full) {
  for (const k of ["greeting", "again", "chat_prompt", "here_prompt"]) {
    if (d[k] == null) { if (full) err(`${name}: ${k}가 없다`); continue; }
    texts(d[k]).forEach((t, i) => checkText(`${name} ${k}[${i}]`, t, 160));
  }
  if (full && !d.welcome_back) err(`${name}: welcome_back이 없다`);
  const top = new Set();
  for (const kind of ["questions", "chats"]) (d[kind] || []).forEach((n, i) => {
    if (top.has(n.q)) err(`${name} ${kind}[${i}]: 맨 위 질문 '${n.q}'가 겹친다`);
    top.add(n.q);
    stats[kind]++;
    node(`${name} ${kind}[${i}] '${(n.q || "").slice(0, 16)}'`, n, 1);
  });
  (d.talk || []).forEach((t, i) => {
    stats.talk++;
    for (const [j, x] of texts(t.text).entries()) checkText(`${name} talk[${i}].${j}`, x, 220);
    if (t.link != null && !LINK(t.link)) err(`${name} talk[${i}]: 링크 '${t.link}'가 없는 화면이다`);
  });
}

const files = process.argv.slice(2);
if (files.length) for (const f of files) check(f, JSON.parse(readFileSync(resolve(f), "utf8")), false);
else check("hongcheol.json", JSON.parse(readFileSync(join(ROOT, "site/shared/hongcheol.json"), "utf8")), true);

console.log(`  질문하기 ${stats.questions}, 대화하기 ${stats.chats}, 마디 ${stats.nodes}(가장 깊이 ${stats.maxDepth}단), 답 ${stats.answers}, 한마디 ${stats.talk}, 화면 링크 ${stats.links}, 화면 열쇠 단 마디 ${stats.tagged}`);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors.slice(0, 80)) console.log("✗ " + e); if (errors.length > 80) console.log(`… 그리고 ${errors.length - 80}건`); process.exit(1); }
console.log("\n오류 없음");
