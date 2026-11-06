// 모든 화면이 함께 쓰는 사건·인물·책·장소 자료. 연도는 기원전을 음수로 적는다(기원전 1446년 → -1446).
// 표본 사건 11개는 이 파일에, 나머지 49개는 events_more.js에 있다. 표본 사건에는 sample: true를 붙여 시안 A·B·C가 이 11개만 쓰게 한다.
// 구절은 개역한글(1961, 저작권 만료)이다. verse가 없는 사건은 verses.js(tools/build_verses.py가 뽑은 본문)로 채운다.
import { VERSES } from "./verses.js";
import { MORE_EVENTS, MORE_PEOPLE, MORE_PLACES } from "./events_more.js";
import { BIBLE_BOOKS } from "./books.js";
import { STORY_PLACES } from "./places_story.js";

export const RANGE = [-2200, 100];

// 연대는 전통 연대(열왕기상 6:1 등 성경 숫자로 거슬러 센 값)를 기본으로 둔다. 학계 연대는 각 사건의 dateNote에 적는다.
export const ERAS = [
  { id: "patriarchs", name: "족장", from: -2166, to: -1876, hue: 34 },
  { id: "egypt", name: "애굽과 출애굽", from: -1876, to: -1406, hue: 18 },
  { id: "judges", name: "정복과 사사", from: -1406, to: -1050, hue: 90 },
  { id: "united", name: "통일 왕국", from: -1050, to: -931, hue: 45 },
  { id: "divided", name: "분열 왕국", from: -931, to: -586, hue: 200 },
  { id: "exile", name: "포로와 귀환", from: -586, to: -430, hue: 260 },
  { id: "between", name: "중간기", from: -430, to: -5, hue: 160 },
  { id: "jesus", name: "예수", from: -5, to: 30, hue: 350 },
  { id: "church", name: "초대 교회", from: 30, to: 100, hue: 320 },
];

export const EMPIRES = [
  { name: "이집트 신왕국", from: -1550, to: -1070, color: "#c9a227" },
  { name: "앗수르", from: -911, to: -609, color: "#8c4a2f" },
  { name: "바벨론", from: -626, to: -539, color: "#3d5a99" },
  { name: "페르시아", from: -550, to: -330, color: "#7a4b8c" },
  { name: "헬라", from: -336, to: -63, color: "#2f7f86" },
  { name: "로마", from: -63, to: 100, color: "#a33a3a" },
];

// kind: 생애 | 재위 | 활동. 고대 인물의 해는 대부분 추정이다.
export const PEOPLE = [
  { id: "abraham", name: "아브라함", from: -2166, to: -1991, kind: "생애" },
  { id: "moses", name: "모세", from: -1526, to: -1406, kind: "생애" },
  { id: "david", name: "다윗", from: -1040, to: -970, kind: "생애" },
  { id: "ahab", name: "아합", from: -874, to: -853, kind: "재위" },
  { id: "mesha", name: "메사", from: -870, to: -840, kind: "재위" },
  { id: "jehu", name: "예후", from: -841, to: -814, kind: "재위" },
  { id: "isaiah", name: "이사야", from: -740, to: -681, kind: "활동" },
  { id: "hezekiah", name: "히스기야", from: -715, to: -686, kind: "재위" },
  { id: "sennacherib", name: "산헤립", from: -705, to: -681, kind: "재위" },
  { id: "jehoiachin", name: "여호야긴", from: -615, to: -560, kind: "생애" },
  { id: "nebuchadnezzar", name: "느부갓네살", from: -605, to: -562, kind: "재위" },
  { id: "cyrus", name: "고레스", from: -559, to: -530, kind: "재위" },
  { id: "jesus", name: "예수", from: -5, to: 30, kind: "생애" },
  { id: "pilate", name: "빌라도", from: 26, to: 36, kind: "총독" },
  { id: "caiaphas", name: "가야바", from: 18, to: 36, kind: "대제사장" },
  { id: "paul", name: "바울", from: 5, to: 67, kind: "생애" },
];

// 성경 66권(books.js). 연표의 '성경 책' 줄에 놓을 기간과 그 기간의 뜻(basis)을 함께 갖는다.
export const BOOKS = BIBLE_BOOKS;

// [경도, 위도]
export const PLACES = {
  ur: { name: "우르", at: [46.1, 30.96] },
  haran: { name: "하란", at: [39.03, 36.86] },
  shechem: { name: "세겜", at: [35.28, 32.21] },
  rameses: { name: "라암셋", at: [31.83, 30.8] },
  sinai: { name: "시내산(전통 위치)", at: [33.97, 28.54] },
  thebes: { name: "테베", at: [32.65, 25.72] },
  hebron: { name: "헤브론", at: [35.1, 31.53] },
  jerusalem: { name: "예루살렘", at: [35.23, 31.78] },
  dan: { name: "단", at: [35.65, 33.25] },
  samaria: { name: "사마리아", at: [35.19, 32.28] },
  dibon: { name: "디본", at: [35.78, 31.5] },
  nimrud: { name: "갈라(님루드)", at: [43.33, 36.1] },
  nineveh: { name: "니느웨", at: [43.15, 36.36] },
  lachish: { name: "라기스", at: [34.85, 31.56] },
  babylon: { name: "바벨론", at: [44.42, 32.54] },
  qumran: { name: "쿰란", at: [35.46, 31.74] },
  caesarea: { name: "가이사랴", at: [34.89, 32.5] },
  corinth: { name: "고린도", at: [22.88, 37.91] },
  delphi: { name: "델포이", at: [22.5, 38.48] },
  antioch: { name: "안디옥", at: [36.16, 36.2] },
  bethel: { name: "벧엘", at: [35.22, 31.93] },
  beersheba: { name: "브엘세바", at: [34.79, 31.24] },
  memphis: { name: "애굽(멤피스)", at: [31.25, 29.85] },
  midian: { name: "미디안", at: [35.5, 28.2] },
  nebo: { name: "느보산", at: [35.73, 31.77] },
  bethlehem: { name: "베들레헴", at: [35.2, 31.7] },
  nazareth: { name: "나사렛", at: [35.3, 32.7] },
  capernaum: { name: "가버나움", at: [35.57, 32.88] },
  tarsus: { name: "다소", at: [34.9, 36.92] },
  damascus: { name: "다메섹", at: [36.29, 33.51] },
  rome: { name: "로마", at: [12.49, 41.89] },
  jezreel: { name: "이스르엘", at: [35.33, 32.56] },
  carmel: { name: "갈멜산", at: [35.09, 32.67] },
  ramoth: { name: "길르앗 라못", at: [35.98, 32.47] },
  qarqar: { name: "카르카르", at: [36.33, 35.75] },
  carchemish: { name: "갈그미스", at: [38.0, 36.83] },
  ecbatana: { name: "악메다(엑바타나)", at: [48.52, 34.8] },
  pasargadae: { name: "파사르가대", at: [53.17, 30.2] },
  ephesus: { name: "에베소", at: [27.34, 37.94] },
};

// strength: direct = 성경 속 이름이나 사건이 직접 나온다 / indirect = 같은 상황을 옆에서 보여 준다
//           context = 시대와 장소의 배경 / manuscript = 성경 본문의 옛 사본
export const STRENGTH = {
  direct: { label: "직접 언급", desc: "성경에 나오는 이름이나 사건이 그대로 적혀 있다" },
  indirect: { label: "간접 증거", desc: "같은 시대·상황을 보여 주지만 성경 사건을 직접 말하지는 않는다" },
  context: { label: "배경", desc: "그 시대와 장소가 실제로 어땠는지 보여 준다" },
  manuscript: { label: "옛 사본", desc: "성경 본문이 그 시대에 이미 이 모양이었다는 증거다" },
};

export const EVENTS = [
  {
    id: "abraham-call",
    title: "아브라함이 하란을 떠나다",
    year: -2091,
    yearLabel: "기원전 2091년",
    dateNote: "전통 연대. 학계는 대체로 기원전 2000~1800년 사이로 보지만 정하기 어렵다.",
    era: "patriarchs",
    book: "창세기",
    ref: "창 12:1",
    verse: "여호와께서 아브람에게 이르시되 너는 너의 본토 친척 아비 집을 떠나 내가 네게 지시할 땅으로 가라",
    summary: "갈대아 우르에서 하란으로 옮겨 살던 아브람이, 일흔다섯 살에 가족을 떠나 가나안으로 간다.",
    people: ["abraham"],
    route: ["ur", "haran", "shechem"],
    evidence: [
      {
        img: "ur", name: "우르의 지구라트", madeYear: -2100, madeLabel: "기원전 21세기",
        where: "이라크 나시리야 근처 현장", found: "1920~30년대 레너드 울리 발굴",
        says: "아브라함의 고향으로 적힌 '갈대아 우르'가 실제로 큰 도시였음을 보여 준다. 우르남무 왕이 지은 신전 탑이다.",
        strength: "context",
        caveat: "아브라함을 직접 말하는 유물은 없다. 학자 대부분이 '갈대아 우르'를 이곳으로 보고, 북쪽의 다른 도시로 보는 학자도 있다.",
      },
    ],
  },
  {
    id: "exodus",
    title: "이스라엘이 애굽을 나오다",
    year: -1446,
    yearLabel: "기원전 1446년",
    dateNote: "이른 연대(왕상 6:1의 480년으로 계산). 늦은 연대로 보면 기원전 13세기(약 1270~1260년)다.",
    era: "egypt",
    book: "출애굽기",
    ref: "출 12:51",
    verse: "그 같은 날에 여호와께서 이스라엘 자손을 그 군대대로 애굽 땅에서 인도하여 내셨더라",
    summary: "430년 동안 애굽에 살던 이스라엘 자손이 모세를 따라 애굽을 떠나 시내산으로 간다.",
    people: ["moses", "aaron"],
    route: ["rameses", "sinai"],
    evidence: [
      {
        img: "merneptah", name: "메르넵타 석비", madeYear: -1208, madeLabel: "기원전 1208년경",
        where: "이집트 박물관(카이로)", found: "1896년 플린더스 피트리, 테베",
        says: "이집트 왕 메르넵타가 리비아를 이긴 일을 자랑한 비석이다. 끝부분의 가나안 원정 대목에 '이스라엘'이 나온다. 성경 밖에서 이 이름이 나온 첫 기록이다.",
        strength: "indirect",
        caveat: "출애굽 자체를 말하지는 않는다. 기원전 1208년쯤 가나안에 '이스라엘'이라는 백성이 이미 있었다는 증거다.",
      },
    ],
  },
  {
    id: "david-king",
    title: "다윗이 왕이 되다",
    year: -1010,
    yearLabel: "기원전 1010년경",
    dateNote: "학자마다 몇 년씩 차이가 난다(기원전 1010~1000년).",
    era: "united",
    book: "사무엘하",
    ref: "삼하 5:4-5",
    verse: "다윗이 삼십세에 위에 나아가서 사십년을 다스렸으되 헤브론에서 칠년 육개월 동안 유다를 다스렸고 예루살렘에서 삼십 삼년 동안 온 이스라엘과 유다를 다스렸더라",
    summary: "헤브론에서 유다의 왕이 된 다윗이, 예루살렘으로 옮겨 온 이스라엘을 다스린다.",
    people: ["david"],
    route: ["hebron", "jerusalem"],
    evidence: [
      {
        img: "teldan", name: "텔 단 비문", madeYear: -840, madeLabel: "기원전 9세기 후반",
        where: "이스라엘 박물관(예루살렘)", found: "1993~94년, 텔 단",
        says: "아람 왕이 이긴 싸움을 새긴 비석 조각이다. 유다 왕조를 '다윗의 집'이라고 부른다. 다윗이라는 이름이 성경 밖에서 처음 나온다.",
        strength: "direct",
        caveat: "다윗이 왕이 된 해보다 170년쯤 뒤의 비석이다. 학자 대부분이 '다윗의 집'으로 읽고, 다르게 읽자는 학자도 일부 있다.",
      },
    ],
  },
  {
    id: "mesha-revolt",
    title: "모압 왕 메사가 등을 돌리다",
    year: -852,
    yearLabel: "기원전 852년경",
    dateNote: "아합이 죽은 해(기원전 853년) 바로 뒤로 본다.",
    era: "divided",
    book: "열왕기하",
    ref: "왕하 3:4-5",
    verse: "모압 왕 메사는 양을 치는 자라 새끼 양 십만의 털과 수양 십만의 털을 이스라엘 왕에게 바치더니 아합이 죽은 후에 모압 왕이 이스라엘 왕을 배반한지라",
    summary: "이스라엘에 양털을 바치던 모압이, 아합이 죽자 더는 바치지 않고 맞선다.",
    people: ["ahab", "mesha"],
    route: ["samaria", "dibon"],
    evidence: [
      {
        img: "mesha", name: "메사 석비", madeYear: -840, madeLabel: "기원전 840년경",
        where: "루브르 박물관(파리)", found: "1868년, 요르단 디반(옛 디본)",
        says: "메사가 자기 입으로 이스라엘에서 벗어난 일을 새겼다. 이스라엘 왕 '오므리'와 하나님의 이름 '여호와(YHWH)'가 나온다.",
        strength: "direct",
        caveat: "발견 직후 깨져 조각을 다시 맞췄다. 깨지기 전에 떠 둔 종이 탁본 덕분에 글자 대부분을 되살렸다.",
      },
    ],
  },
  {
    id: "jehu",
    title: "예후가 이스라엘 왕이 되다",
    year: -841,
    yearLabel: "기원전 841년",
    dateNote: "앗수르 기록과 맞물려 비교적 정확한 해다.",
    era: "divided",
    book: "열왕기하",
    ref: "왕하 9:6",
    verse: "예후가 일어나 집으로 들어가니 소년이 그 머리에 기름을 부으며 이르되 이스라엘 하나님 여호와의 말씀이 내가 네게 기름을 부어 여호와의 백성 곧 이스라엘의 왕을 삼노니",
    summary: "장군 예후가 기름 부음을 받고 아합 집안을 무너뜨린 뒤 왕이 된다.",
    people: ["jehu"],
    route: ["samaria", "nimrud"],
    evidence: [
      {
        img: "jehu", name: "살만에셀 3세의 검은 오벨리스크", madeYear: -827, madeLabel: "기원전 827년경",
        where: "대영박물관(런던)", found: "1846년 오스틴 헨리 레이어드, 님루드",
        says: "앗수르 왕 앞에 엎드린 사람 위에 '오므리의 아들 예후'의 조공이라고 적혀 있다. 이스라엘 왕을 그린 가장 오래된 그림이다.",
        strength: "direct",
        caveat: "엎드린 사람이 예후 본인인지 그가 보낸 사신인지는 의견이 갈린다. 성경은 이 조공을 따로 적지 않는다.",
      },
    ],
  },
  {
    id: "sennacherib",
    title: "산헤립이 예루살렘을 에워싸다",
    year: -701,
    yearLabel: "기원전 701년",
    dateNote: "앗수르 연대기로 해가 정확히 맞는다.",
    era: "divided",
    book: "열왕기하",
    ref: "왕하 18:13",
    verse: "히스기야왕 십 사년에 앗수르 왕 산헤립이 올라와서 유다 모든 견고한 성읍들을 쳐서 취하매",
    summary: "앗수르 군대가 라기스를 무너뜨리고 예루살렘을 에워싼다. 히스기야는 미리 터널을 파서 성 안으로 물을 끌어들였다.",
    people: ["hezekiah", "sennacherib", "isaiah"],
    route: ["nineveh", "lachish", "jerusalem"],
    evidence: [
      {
        img: "taylor", name: "산헤립 연대기 각기둥(테일러 프리즘)", madeYear: -691, madeLabel: "기원전 691년",
        where: "대영박물관(런던)", found: "1830년 로버트 테일러가 니느웨 근처에서 얻음",
        says: "산헤립이 유다의 성읍 46개를 빼앗고 히스기야를 '새장에 갇힌 새처럼' 예루살렘에 가두었다고 자랑한다.",
        strength: "direct",
        caveat: "예루살렘을 빼앗았다고는 말하지 않는다. 성경과 앗수르 기록 모두 예루살렘이 함락되지 않았다고 전한다.",
      },
      {
        img: "lachish", name: "라기스 함락 부조", madeYear: -700, madeLabel: "기원전 700년경",
        where: "대영박물관(런던)", found: "1840년대 레이어드, 니느웨 산헤립 궁전",
        says: "왕하 18:14의 라기스 공격을 앗수르 쪽에서 그린 벽 조각이다. 성벽을 오르는 병사와 끌려가는 주민이 보인다.",
        strength: "direct",
        caveat: "왕의 궁전을 꾸민 선전용 그림이라 승리를 크게 그렸다.",
      },
      {
        img: "siloam", name: "실로암 비문", madeYear: -700, madeLabel: "기원전 700년경",
        where: "이스탄불 고고학 박물관", found: "1880년, 예루살렘 히스기야 터널 안",
        says: "양쪽에서 파 들어간 일꾼들이 터널 한가운데서 만난 순간을 새겼다. 왕하 20:20의 '수도'를 판 이야기와 맞는다.",
        strength: "indirect",
        caveat: "왕의 이름은 나오지 않는다. 히스기야 때 팠다는 연대는 글자 모양과 성경 기록으로 추정했다.",
      },
    ],
  },
  {
    id: "jehoiachin-exile",
    title: "여호야긴이 바벨론으로 끌려가다",
    year: -597,
    yearLabel: "기원전 597년",
    dateNote: "바벨론 연대기로 날짜까지 확인된다. 예루살렘 성전은 11년 뒤(기원전 586년)에 불탄다.",
    era: "divided",
    book: "열왕기하",
    ref: "왕하 24:15",
    verse: "저가 여호야긴을 바벨론으로 사로잡아 가고 왕의 모친과 왕의 아내들과 내시와 나라에 권세 있는 자도 예루살렘에서 바벨론으로 사로잡아 가고",
    summary: "느부갓네살이 예루살렘을 쳐서 젊은 왕 여호야긴과 귀족들을 바벨론으로 데려간다.",
    people: ["jehoiachin", "nebuchadnezzar"],
    route: ["jerusalem", "babylon"],
    evidence: [
      {
        img: "jehoiachin", name: "여호야긴 배급 점토판", madeYear: -592, madeLabel: "기원전 592년경",
        where: "페르가몬 박물관 근동관(베를린)", found: "1899~1917년 독일 발굴, 바벨론 궁전 터",
        says: "바벨론 궁정이 포로에게 준 기름 배급 장부다. '유다 왕 여호야긴'과 그 아들들의 몫이 적혀 있다.",
        strength: "direct",
        caveat: "왕하 25:27-30은 여호야긴이 나중에 풀려나 왕의 식탁에서 먹었다고 전한다. 이 장부는 그보다 앞선 포로 시절의 기록이다.",
      },
    ],
  },
  {
    id: "cyrus-decree",
    title: "고레스가 돌아가라고 명하다",
    year: -538,
    yearLabel: "기원전 538년",
    dateNote: "고레스가 바벨론을 정복한 다음 해다.",
    era: "exile",
    book: "에스라",
    ref: "스 1:2",
    verse: "바사 왕 고레스는 말하노니 하늘의 신 여호와께서 세상 만국으로 내게 주셨고 나를 명하사 유다 예루살렘에 전을 건축하라 하셨나니",
    summary: "바벨론을 차지한 페르시아 왕 고레스가 유다 사람들에게 돌아가 성전을 다시 지으라고 허락한다.",
    people: ["cyrus"],
    route: ["babylon", "jerusalem"],
    evidence: [
      {
        img: "cyrus", name: "고레스 원통", madeYear: -539, madeLabel: "기원전 539~538년",
        where: "대영박물관(런던)", found: "1879년 호르무즈드 라삼, 바벨론",
        says: "고레스가 끌려온 여러 민족을 고향으로 돌려보내고 신전을 다시 세우게 했다고 적었다.",
        strength: "indirect",
        caveat: "유다나 예루살렘을 따로 말하지는 않는다. 포로를 돌려보낸 고레스의 정책이 실제로 있었다는 증거다.",
      },
    ],
  },
  {
    id: "isaiah-scroll",
    title: "쿰란에서 이사야서를 베껴 쓰다",
    year: -125,
    yearLabel: "기원전 125년경",
    dateNote: "글씨체와 탄소 연대 측정으로 기원전 150~100년 사이로 본다.",
    era: "between",
    book: "이사야",
    ref: "사 53:5",
    verse: "그가 찔림은 우리의 허물을 인함이요 그가 상함은 우리의 죄악을 인함이라 그가 징계를 받음으로 우리가 평화를 누리고 그가 채찍에 맞음으로 우리가 나음을 입었도다",
    summary: "사해 근처 쿰란의 공동체가 이사야서 66장 전체를 가죽 두루마리에 베껴 쓴다.",
    people: ["isaiah"],
    route: ["qumran"],
    evidence: [
      {
        img: "isaiah", name: "이사야 대두루마리(1QIsaᵃ)", madeYear: -125, madeLabel: "기원전 125년경",
        where: "이스라엘 박물관 '책의 전당'(예루살렘)", found: "1947년, 쿰란 제1동굴",
        says: "통째로 남은 가장 오래된 이사야서다. 그전까지 알던 가장 오래된 사본보다 천 년쯤 앞서는데, 내용이 거의 같다.",
        strength: "manuscript",
        caveat: "철자와 낱말에 작은 차이가 수백 곳 있다. 뜻이 바뀌는 차이는 드물다.",
      },
    ],
  },
  {
    id: "crucifixion",
    title: "예수가 십자가에 못 박히다",
    year: 30,
    yearLabel: "기원후 30년경",
    dateNote: "기원후 30년 또는 33년으로 보는 의견이 많다.",
    era: "jesus",
    book: "마가복음",
    ref: "막 15:15",
    verse: "빌라도가 무리에게 만족을 주고자 하여 바라바는 놓아 주고 예수는 채찍질하고 십자가에 못 박히게 넘겨주니라",
    summary: "대제사장 가야바에게 심문받은 예수를, 로마 총독 빌라도가 십자가형에 넘긴다.",
    people: ["jesus", "pilate", "caiaphas"],
    route: ["caesarea", "jerusalem"],
    evidence: [
      {
        img: "pilate", name: "빌라도 비문", madeYear: 31, madeLabel: "기원후 26~36년",
        where: "이스라엘 박물관(예루살렘)", found: "1961년, 가이사랴 원형극장",
        says: "'유대 총독 본디오 빌라도'가 세운 건물을 기념하는 돌이다. 빌라도가 살던 때의 돌에 그의 이름과 직함이 함께 새겨진 드문 예다.",
        strength: "direct",
        caveat: "가이사랴 현장에 서 있는 돌은 복제품이고, 진품은 박물관에 있다.",
      },
      {
        img: "caiaphas", name: "가야바 유골함", madeYear: 30, madeLabel: "기원후 1세기",
        where: "이스라엘 박물관(예루살렘)", found: "1990년, 예루살렘 남쪽 무덤",
        says: "'가야바의 아들 요셉'이라고 새긴 뼈 상자다. 역사가 요세푸스는 이 대제사장을 '가야바라 불린 요셉'이라고 적었다.",
        strength: "direct",
        caveat: "같은 사람이라는 데 많은 학자가 동의하지만, 이름이 흔해 다른 사람일 수 있다는 의견도 있다.",
      },
    ],
  },
  {
    id: "paul-corinth",
    title: "바울이 고린도에서 재판받다",
    year: 51,
    yearLabel: "기원후 51년경",
    dateNote: "갈리오가 총독으로 일한 해(51~52년)에 맞춘 값이다.",
    era: "church",
    book: "사도행전",
    ref: "행 18:12",
    verse: "갈리오가 아가야 총독 되었을 때에 유대인이 일제히 일어나 바울을 대적하여 재판 자리로 데리고 와서",
    summary: "고린도에서 1년 반 머물던 바울을 유대인들이 총독 갈리오에게 고소한다. 갈리오는 사건을 받지 않는다.",
    people: ["paul"],
    route: ["antioch", "corinth"],
    evidence: [
      {
        img: "gallio", name: "갈리오 비문(델포이 비문)", madeYear: 52, madeLabel: "기원후 52년",
        where: "델포이 고고학 박물관", found: "1905년 발표된 조각들, 델포이",
        says: "글라우디오 황제가 보낸 편지에 '내 친구, 아가야 총독 갈리오'가 나온다. 바울의 여행 연대를 정하는 기준점이 된다.",
        strength: "direct",
        caveat: "여러 조각을 이어 맞춘 비문이라, 빈 곳을 짐작해 채워 읽은 글자가 있다.",
      },
    ],
  },
];

// 두 해 사이의 햇수. 0년이 없으므로 기원전에서 기원후로 넘어가면 1년을 뺀다(기원전 1년 → 기원후 1년은 1년).
export function yearsBetween(a, b) {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return hi - lo - (lo < 0 && hi > 0 ? 1 : 0);
}

for (const ev of EVENTS) ev.sample = true;
PEOPLE.push(...MORE_PEOPLE);
Object.assign(PLACES, MORE_PLACES);
for (const [id, p] of Object.entries(STORY_PLACES)) PLACES[id] ??= p;
EVENTS.push(...MORE_EVENTS);
for (const ev of EVENTS) ev.verse ??= (VERSES[ev.ref] || []).map(([, t]) => t).join(" ");
// 같은 해의 사건은 적은 순서를 지킨다(Array.prototype.sort는 안정 정렬).
EVENTS.sort((a, b) => a.year - b.year);

export const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export function yearText(y) {
  return y < 0 ? `기원전 ${-y}년` : `기원후 ${y}년`;
}

export async function loadCredits(base) {
  return (await fetch(`${base}shared/credits.json`)).json();
}
