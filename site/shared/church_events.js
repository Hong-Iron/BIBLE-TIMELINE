// 교회사(기원후 100~1648년)의 시대·제국·장소·사건·인물. data.js가 ERAS·EMPIRES·PLACES·EVENTS·PEOPLE에 더한다.
// 사건은 성경 사건(data.js·events_more.js)과 같은 형식이되, 성경 구절(book·ref) 대신 그 사건을 전하는 옛 문헌 한두 줄을 둔다.
// {
//   id, title, short?, year, yearLabel, dateNote?, era, summary, people: [인물 id], route: [장소 id],
//   source: { text: "한국어로 옮긴 한두 줄", src: "출처 id: 위치" },   // 출처는 sources.js. 공유·CC0·CC BY 번역이나 원문에서만 옮긴다
//   evidence: [ ...성경 사건과 같은 증거 형식(img, name, madeYear, madeLabel, where, found, says, strength, caveat) ],
//   controversy?: 이어진 논쟁 id(controversies.js)
// }
// 인물: { id, name, from, to, kind }(data.js PEOPLE과 같은 형식), 프로필은 profiles_c1~c3.js.
// 사건과 인물의 id는 CHURCH_HISTORY.md의 공통 id 명단을 따른다.
import { CH_EVENTS_1, CH_PEOPLE_1, PLACES_CH1, IMG_CH1, SRC_V1 } from "./church_ev1.js";
import { CH_EVENTS_2, CH_PEOPLE_2, PLACES_CH2, IMG_CH2, SRC_V2 } from "./church_ev2.js";
import { CH_EVENTS_3, CH_PEOPLE_3, PLACES_CH3, IMG_CH3, SRC_V3 } from "./church_ev3.js";

export const CH_ERAS = [
  { id: "fathers", name: "교부와 박해", from: 100, to: 313, hue: 12 },
  { id: "councils", name: "공의회 시대", from: 313, to: 451, hue: 285 },
  { id: "byzantine", name: "칼케돈 이후", from: 451, to: 843, hue: 185 },
  { id: "eastwest", name: "동서의 갈림", from: 843, to: 1204, hue: 130 },
  { id: "latemedieval", name: "중세 후기", from: 1204, to: 1517, hue: 55 },
  { id: "reformation", name: "종교개혁", from: 1517, to: 1648, hue: 230 },
];

// 로마(서로마)는 data.js에서 476년까지 늘린다.
export const CH_EMPIRES = [
  { name: "사산 페르시아", from: 224, to: 651, color: "#7a4b8c" },
  { name: "동로마(비잔티움)", from: 395, to: 1453, color: "#8c3b6e" },
  { name: "이슬람 칼리프국", from: 632, to: 1258, color: "#2f7f5a" },
  { name: "프랑크·신성 로마", from: 800, to: 1648, color: "#5a6b2f" },
  { name: "오스만", from: 1299, to: 1648, color: "#b0532a" },
];

// 여러 묶음이 함께 쓰는 장소. [경도, 위도]
const P = (name, lon, lat) => ({ name, at: [lon, lat] });
export const CH_PLACES = {
  nicaea: P("니케아", 29.72, 40.43), constantinople: P("콘스탄티노플", 28.98, 41.01), chalcedon: P("칼케돈", 29.03, 40.99),
  alexandria: P("알렉산드리아", 29.92, 31.2), carthage: P("카르타고", 10.32, 36.85), hippo: P("히포", 7.75, 36.88),
  milan: P("밀라노", 9.19, 45.46), lyon: P("리옹", 4.83, 45.76), edessa: P("에데사", 38.79, 37.16), nisibis: P("니시비스", 41.21, 37.07),
  ctesiphon: P("셀레우키아-크테시폰", 44.58, 33.09), caesareacappadocia: P("가이사랴(갑바도기아)", 35.48, 38.72), scetis: P("스케티스(와디 나트룬)", 30.35, 30.38),
  athos: P("아토스산", 24.33, 40.16), ravenna: P("라벤나", 12.2, 44.42), toledo: P("톨레도", -4.02, 39.86), aachen: P("아헨", 6.08, 50.78),
  cluny: P("클뤼니", 4.66, 46.43), clermont: P("클레르몽", 3.08, 45.78), paris: P("파리", 2.35, 48.86), avignon: P("아비뇽", 4.81, 43.95),
  oxford: P("옥스퍼드", -1.26, 51.75), canterbury: P("캔터베리", 1.08, 51.28), london: P("런던", -0.13, 51.51), prague: P("프라하", 14.42, 50.09),
  constance: P("콘스탄츠", 9.18, 47.66), florence: P("피렌체", 11.25, 43.77), ferrara: P("페라라", 11.62, 44.84), erfurt: P("에르푸르트", 11.03, 50.98),
  wittenberg: P("비텐베르크", 12.65, 51.87), leipzig: P("라이프치히", 12.37, 51.34), worms: P("보름스", 8.36, 49.63), marburg: P("마르부르크", 8.77, 50.81),
  augsburg: P("아우크스부르크", 10.9, 48.37), zurich: P("취리히", 8.54, 47.37), schleitheim: P("슐라이트하임", 8.48, 47.75), geneva: P("제네바", 6.14, 46.2),
  trent: P("트렌토(트리엔트)", 11.12, 46.07), heidelberg: P("하이델베르크", 8.67, 49.41), dordrecht: P("도르트레흐트", 4.69, 51.81), munster: P("뮌스터", 7.63, 51.96),
  osnabruck: P("오스나브뤼크", 8.05, 52.28), loyola: P("로욜라", -2.27, 43.18),
};

export const CH_EVENTS = [...CH_EVENTS_1, ...CH_EVENTS_2, ...CH_EVENTS_3];
export const CH_PEOPLE = [...CH_PEOPLE_1, ...CH_PEOPLE_2, ...CH_PEOPLE_3];
export const CH_MORE_PLACES = { ...PLACES_CH1, ...PLACES_CH2, ...PLACES_CH3 };
export const CH_IMG = { ...IMG_CH1, ...IMG_CH2, ...IMG_CH3 };
export const CH_SOURCES = { ...SRC_V1, ...SRC_V2, ...SRC_V3 };
