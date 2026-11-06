// 성경 66권 해설. 책 id(books.js)를 열쇠로 한다. 갈래별 묶음 파일 7개를 합친다.
// BibleProject 자료는 읽고 참고만 했고, 문장은 새로 썼다. 장절의 본문은 verses.js(개역한글)에서 채운다.
//
// 형식(모든 칸에서 사실에는 ref(장절) 또는 src(성경 밖 출처)를 붙인다):
// {
//   summary: "3~5문장 요약",
//   author: [{ view: "전통" | "학계" | "본문", text, ref?, src? }],   // 쓴 사람
//   date: [{ view, text, ref?, src? }],                               // 쓴 때
//   setting: "배경이 되는 때와 곳, 처음 읽은 사람들",
//   structure: [{ range: "1~11장", title, text }],                    // 책의 짜임
//   events: [{ when?, text, ref, event?, at?, move? }],                // 주요 사건(event는 data.js 사건 id)
//                                                                     // at: 장소 id 목록(지도로 따라 읽기). 일어난 차례대로.
//                                                                     // move: true면 at을 차례로 잇는 길을 그린다(여행·행군·포로로 끌려감).
//   home: { at: [장소 id...], label },                                 // at이 없는 사건(가르침·환상·시)에 지도가 보여 줄 책의 배경
//   themes: [{ title, text, refs: [장절...] }],                        // 중심 주제와 해석
//   debates: [{ title, text, views: [{ who, text, src? }] }],         // 해석이 갈리는 대목
//   quotes: [장절...],                                                 // 핵심 구절
//   people: [PEOPLE id...],                                            // 등장인물(프로필 연결)
//   links: [{ id: 책 id, why }],                                       // 이어 읽을 책
// }
import { GUIDES_G1 } from "./guides_g1.js";
import { GUIDES_G2 } from "./guides_g2.js";
import { GUIDES_G3 } from "./guides_g3.js";
import { GUIDES_G4 } from "./guides_g4.js";
import { GUIDES_G5 } from "./guides_g5.js";
import { GUIDES_G6 } from "./guides_g6.js";
import { GUIDES_G7 } from "./guides_g7.js";

export const GUIDES = Object.assign({}, GUIDES_G1, GUIDES_G2, GUIDES_G3, GUIDES_G4, GUIDES_G5, GUIDES_G6, GUIDES_G7);
