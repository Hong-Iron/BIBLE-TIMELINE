// 책 해설의 '지도로 따라 읽기'에 쓰는 장소. 묶음별 파일 7개를 합친다. data.js가 PLACES에 더한다(이미 있는 id는 그대로 둔다).
// 형식: id(영어 소문자): { name: 개역한글 지명, at: [경도, 위도], region?: true(도시가 아닌 땅·광야·지방) }
// 위치가 전통이나 추정이면 이름에 '(전통 위치)' 또는 '(추정)'을 붙인다.
import { PLACES_G1 } from "./places_g1.js";
import { PLACES_G2 } from "./places_g2.js";
import { PLACES_G3 } from "./places_g3.js";
import { PLACES_G4 } from "./places_g4.js";
import { PLACES_G5 } from "./places_g5.js";
import { PLACES_G6 } from "./places_g6.js";
import { PLACES_G7 } from "./places_g7.js";

export const STORY_PLACES = Object.assign({}, PLACES_G1, PLACES_G2, PLACES_G3, PLACES_G4, PLACES_G5, PLACES_G6, PLACES_G7);
