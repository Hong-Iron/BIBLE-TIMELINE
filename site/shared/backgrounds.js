// 당대 배경. 시대 15개(ERA_BG, 열쇠는 data.js의 ERAS id. 교회사 시대 6개는 bg_c1·c2.js)와 책 66권(BOOK_BG, 열쇠는 books.js의 책 id).
// 시대 배경은 그 시대 공통의 세계(제국, 종교, 법, 일상, 글 갈래)를, 책 배경은 그 책에만 맞는 비교를 쓴다.
// 같은 내용을 시대와 책에 되풀이하지 않는다.
//
// 형식:
// {
//   summary: "2~4문장",
//   events:     [item...],   // 사건: 제국, 전쟁, 왕, 성경 밖 기록에 나오는 일
//   culture:    [item...],   // 문화: 종교, 법, 가족, 경제, 일상, 글을 쓰는 재료와 사람
//   literature: [item...],   // 문학: 같은 시대의 글, 성경과 견줄 문헌과 갈래
//   rhetoric:   [item...],   // 수사학(글의 짜임): 평행법, 교차대구, 조약 형식, 편지 형식, 연설 순서
// }
// item: { title, text, when?, ref?, refs?, src: ["출처 id: 위치", ...], quote?: { text, src } }
//   src: sources.js(또는 묶음 파일의 SRC_*)의 id와 그 안의 위치. 사실마다 하나 이상. 확인하지 않은 쪽수는 적지 않는다.
//   ref/refs: 비교하는 성경 장절(개역한글 본문은 verses.js가 채운다).
//   quote: 이용 조건이 공유·CC0·CC BY인 번역에서 한국어로 옮긴 한두 줄. src에 그 번역을 적는다.
import { SOURCES as BASE } from "./sources.js";
import { ERA_BG_E1, SRC_E1 } from "./bg_e1.js";
import { ERA_BG_E2, SRC_E2 } from "./bg_e2.js";
import { ERA_BG_C1, SRC_C1 } from "./bg_c1.js";
import { ERA_BG_C2, SRC_C2 } from "./bg_c2.js";
import { ERA_BG_C3, SRC_C3 } from "./bg_c3.js";
import { BOOK_BG_G1, SRC_G1 } from "./bg_g1.js";
import { BOOK_BG_G2, SRC_G2 } from "./bg_g2.js";
import { BOOK_BG_G3, SRC_G3 } from "./bg_g3.js";
import { BOOK_BG_G4, SRC_G4 } from "./bg_g4.js";
import { BOOK_BG_G5, SRC_G5 } from "./bg_g5.js";
import { BOOK_BG_G6, SRC_G6 } from "./bg_g6.js";
import { BOOK_BG_G7, SRC_G7 } from "./bg_g7.js";

export const ERA_BG = Object.assign({}, ERA_BG_E1, ERA_BG_E2, ERA_BG_C1, ERA_BG_C2, ERA_BG_C3);
export const BOOK_BG = Object.assign({}, BOOK_BG_G1, BOOK_BG_G2, BOOK_BG_G3, BOOK_BG_G4, BOOK_BG_G5, BOOK_BG_G6, BOOK_BG_G7);
// 기본 출처 목록이 먼저다. 묶음 파일은 없는 id만 더한다.
export const SOURCES = { ...SRC_E1, ...SRC_E2, ...SRC_C1, ...SRC_C2, ...SRC_C3, ...SRC_G1, ...SRC_G2, ...SRC_G3, ...SRC_G4, ...SRC_G5, ...SRC_G6, ...SRC_G7, ...BASE };
export const BG_KINDS = [
  { key: "events", name: "사건" },
  { key: "culture", name: "문화" },
  { key: "literature", name: "문학" },
  { key: "rhetoric", name: "글의 짜임" },
];
