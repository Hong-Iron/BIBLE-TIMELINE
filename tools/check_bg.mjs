// 당대 배경(bg_*.js)을 점검한다.
// 사용: node tools/check_bg.mjs          (전체)
//       node tools/check_bg.mjs g3       (bg_g3.js만, 시대 묶음은 e1·e2, 교회사 시대는 c1·c2)
// 먼저 python3 tools/build_verses.py를 돌려 새 장절의 본문을 verses.js에 넣는다.
// 점검:
//   - 시대·책 id가 맞는지, 묶음이 맡은 책을 모두 썼는지
//   - 갈래마다 항목 수(시대는 3개 이상, 책은 갈래마다 1개 이상·모두 5개 이상)
//   - 항목마다 title·text·src가 있는지, src의 id가 출처 목록에 있는지
//   - 장절이 verses.js에 있는지
//   - 인용(quote)이 옮겨도 되는 자료(공유·CC0·CC BY)에서 왔는지, 길이가 두 줄 남짓(150자) 이하인지
//   - 묶음 파일에서 새로 쓴 출처가 기본 목록과 겹치지 않는지
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const SHARED = join(dirname(new URL(import.meta.url).pathname), "../site/shared");
const load = (f) => import(pathToFileURL(join(SHARED, f)).href);
const { ERAS } = await load("data.js");
const { BIBLE_BOOKS } = await load("books.js");
const { VERSES } = await load("verses.js");
const { SOURCES: BASE, QUOTABLE } = await load("sources.js");
const { SOURCES } = await load("backgrounds.js");

const GROUP_BOOKS = {};
for (let i = 1; i <= 7; i++) GROUP_BOOKS[`g${i}`] = Object.keys((await load(`guides_g${i}.js`))[`GUIDES_G${i}`]);
const ERA_GROUPS = { e1: ["patriarchs", "egypt", "judges", "united", "divided"], e2: ["exile", "between", "jesus", "church"],
  c1: ["fathers", "councils", "byzantine"], c2: ["eastwest", "latemedieval", "reformation"] };
const ERA_IDS = new Set(ERAS.map((e) => e.id));
const KINDS = ["events", "culture", "literature", "rhetoric"];

const only = process.argv[2];
const groups = only ? [only] : ["e1", "e2", "c1", "c2", "g1", "g2", "g3", "g4", "g5", "g6", "g7"];
const errors = [], notes = [];
const err = (m) => errors.push(m);

for (const grp of groups) {
  const isEra = grp.startsWith("e") || grp.startsWith("c");
  const U = grp.toUpperCase();
  const mod = await load(`bg_${grp}.js`);
  const data = mod[isEra ? `ERA_BG_${U}` : `BOOK_BG_${U}`];
  const extra = mod[`SRC_${U}`] || {};
  for (const [id, s] of Object.entries(extra)) {
    if (BASE[id]) err(`bg_${grp}.js SRC_${U}.${id}: sources.js에 이미 있는 id다. 그대로 쓴다`);
    if (!s.name || !s.license) err(`bg_${grp}.js SRC_${U}.${id}: name과 license가 필요하다`);
  }
  const expected = isEra ? ERA_GROUPS[grp] : GROUP_BOOKS[grp];
  for (const id of expected) if (!data[id]) err(`${grp}: '${id}'의 배경이 없다`);
  for (const [id, bg] of Object.entries(data)) {
    if (isEra ? !ERA_IDS.has(id) : !BIBLE_BOOKS.some((b) => b.id === id)) err(`${grp}: '${id}'는 없는 ${isEra ? "시대" : "책"} id다`);
    if (!expected.includes(id)) err(`${grp}: '${id}'는 이 묶음이 맡은 ${isEra ? "시대" : "책"}이 아니다`);
    if (!bg.summary) err(`${id}: summary가 없다`);
    let total = 0;
    for (const k of KINDS) {
      const items = bg[k] || [];
      total += items.length;
      if (isEra && items.length < 3) err(`${id}.${k}: 시대 배경은 갈래마다 3개 이상`);
      if (!isEra && items.length < 1) err(`${id}.${k}: 책 배경은 갈래마다 1개 이상`);
      items.forEach((it, i) => {
        const where = `${id}.${k}[${i}]('${(it.title || "").slice(0, 16)}')`;
        if (!it.title || !it.text) err(`${where}: title과 text가 필요하다`);
        if (!Array.isArray(it.src) || !it.src.length) err(`${where}: src가 없다`);
        for (const s of it.src || []) {
          const sid = s.split(":")[0].trim();
          if (!SOURCES[sid]) err(`${where}: 출처 id '${sid}'가 목록에 없다`);
        }
        for (const r of [it.ref, ...(it.refs || [])].filter(Boolean)) if (!VERSES[r]) err(`${where}: 장절 '${r}'가 verses.js에 없다(build_verses.py를 먼저 돌린다)`);
        if (it.quote) {
          const qid = (it.quote.src || "").split(":")[0].trim();
          if (!SOURCES[qid]) err(`${where}: 인용의 출처 '${qid}'가 목록에 없다`);
          else if (!QUOTABLE.has(SOURCES[qid].license)) err(`${where}: 인용 출처 '${qid}'(${SOURCES[qid].license})는 옮겨 실을 수 없다. 공유·CC0·CC BY만`);
          if ((it.quote.text || "").length > 150) err(`${where}: 인용이 150자를 넘는다`);
        }
      });
    }
    if (!isEra && total < 5) err(`${id}: 책 배경 항목이 모두 ${total}개다(5개 이상)`);
    notes.push(`${id}: ${KINDS.map((k) => `${k} ${(bg[k] || []).length}`).join(", ")}`);
  }
}

for (const n of notes) console.log("  " + n);
if (errors.length) { console.log(`\n오류 ${errors.length}건`); for (const e of errors) console.log("✗ " + e); process.exit(1); }
console.log("\n오류 없음");
