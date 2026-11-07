// 교회사 사건·인물·장소 묶음 5(1789~1869년, 혁명과 선교의 세기 앞부분). 형식은 church_events.js 맨 위에 있다.
// 증거의 kind: "place"는 장소를 오늘(또는 근래에) 찍은 사진이다. 사건을 직접 보여 주지는 않는다.
// 조선 사건의 인용은 『조선왕조실록』의 한문 원문을 우리가 직접 옮겼다. 실록 누리집의 국역문은 옮기지 않는다.
// 음력 날짜는 실록에 적힌 그대로 두고 '음력'이라고 밝힌다.

const place = (img, name, where, says, caveat) => ({
  img, kind: "place", name, madeLabel: "오늘의 모습", where, found: "", says, strength: "context",
  caveat: caveat ?? "장소 사진이다. 사건을 직접 보여 주지는 않는다.",
});

export const CH_EVENTS_5 = [
  {
    id: "civil-constitution-1790", title: "프랑스 국민의회가 성직자 시민 헌법을 의결하다", short: "성직자 시민 헌법", year: 1790, yearLabel: "1790년 7월 12일",
    dateNote: "국민의회가 7월 12일에 의결했고, 루이 16세가 8월 24일에 승인을 포고했다. 성직자에게 이 법을 지키겠다는 맹세를 요구한 법령은 11월 27일에 나왔다.",
    era: "missions",
    summary: "프랑스 혁명이 일어난 이듬해, 국민의회(혁명 뒤 프랑스의 법을 만든 대표 회의)가 가톨릭교회의 조직을 나라의 법으로 새로 짠다. 1789년 11월에 이미 교회 땅을 나라가 거두어들였고, 1790년 2월에는 수도 서원을 법으로 인정하지 않기로 했다. 이 법은 83개 데파르트망(혁명 정부가 새로 나눈 행정 구역)마다 교구를 하나씩만 두고 나머지 주교좌를 없앴다. 주교와 본당 신부는 선거로 뽑고, 나라가 봉급을 주게 했다. 새 주교는 교황에게 승인을 청하지 말라고 정했다. 그해 11월 국민의회가 모든 성직자에게 이 법을 지키겠다고 맹세하라고 명하자, 주교는 몇 사람을 빼고 모두 거부했고 본당 신부는 절반쯤만 맹세했다. 1791년 3월 교황 비오 6세가 이 법을 거부하면서 프랑스 교회는 맹세한 쪽(입헌 교회)과 거부한 쪽으로 갈라졌다. 이 분열은 1801년 나폴레옹과 교황 비오 7세가 정교 협약(교회와 국가 사이의 조약)을 맺은 뒤에야 끝났다.",
    people: [], route: ["paris", "rome"],
    source: { text: "새로 뽑힌 주교는 교황에게 승인을 청할 수 없다. 다만 온 교회의 보이는 머리인 교황에게, 믿음이 하나이고 서로 사귐을 이어 간다는 표시로 편지를 쓴다.", src: "ccc1790: 2편 19조" },
    evidence: [
      {
        img: "ch-ccc-proclamation", name: "「성직자 시민 헌법에 관한 국왕 포고」 인쇄본의 첫 장", madeYear: 1790, madeLabel: "1790년 8월 24일",
        where: "프랑스에서 인쇄한 공문서(소장처는 사진 설명에 적혀 있지 않다)", found: "",
        says: "국민의회가 의결한 법을 루이 16세가 받아들여 온 나라에 알린 포고문이다. 왕이 승인해야 법이 효력을 얻던 혁명 초기의 절차를 보여 준다.",
        strength: "direct", caveat: "법이 의결된 날(7월 12일)이 아니라 왕이 포고한 날의 인쇄물이다.",
      },
      {
        img: "ch-ccc-oath-list", name: "1791년 빌프랑슈 구역에서 맹세한 본당 신부와 보좌 신부 명단", madeYear: 1791, madeLabel: "1791년",
        where: "프랑스 론 데파르트망·리옹 메트로폴 문서 보관소(1L1091)", found: "",
        says: "리옹 북쪽 빌프랑슈 구역에서 성직자 시민 헌법에 맹세한 성직자들의 이름을 적은 행정 문서다. 맹세를 지방 관청이 하나하나 확인하고 기록했음을 보여 준다.",
        strength: "direct", caveat: "한 구역의 명단이다. 프랑스 전체에서 몇 명이 맹세했는지는 이 문서로 알 수 없다.",
      },
    ],
  },
  {
    id: "carey-1793", title: "윌리엄 캐리가 선교사로 인도에 가다", short: "캐리의 인도 선교", year: 1793, yearLabel: "1793년 6월 13일",
    dateNote: "6월 13일 도버 앞바다에서 덴마크 배에 올라 11월 11일 캘커타(지금의 콜카타)에 내렸다. 1800년 1월 10일 덴마크 땅이던 세람포르로 옮겼다.",
    era: "missions",
    summary: "잉글랜드 시골에서 구두를 고치던 침례교 목사 윌리엄 캐리가 가족과 의사 존 토머스와 함께 인도로 떠난다. 그는 1792년 낸 책에서, 예수가 제자들에게 '모든 민족에게 가서 가르치라'고 한 명령은 사도들에게만 준 것이 아니라 지금의 교회에도 똑같이 걸린다고 주장했다. 같은 해 10월 2일 케터링의 한 거실에 모인 시골 목사 열두 명이 침례교 선교회를 세웠고, 캐리가 첫 선교사로 나섰다. 영국 동인도 회사는 선교사를 반기지 않아, 그는 처음 몇 해를 쪽(인디고) 염료 공장의 관리인으로 일하며 벵골어를 익혔다. 1800년 덴마크 땅 세람포르로 옮겨 조슈아 마시먼, 윌리엄 워드와 함께 교회와 학교, 인쇄소를 세웠다. 1801년 벵골어 신약을 펴냈고, 세람포르 인쇄소는 그가 살아 있는 동안 40개 가까운 언어로 성경과 그 일부를 찍었다. 개신교는 이 출발을 근대 선교 운동의 시작으로 자주 꼽는다.",
    people: ["carey"], route: ["kettering", "calcutta", "serampore"],
    source: { text: "많은 사람이 그 명령은 사도들이 이미 다 이루었다고 여기는 듯하다. 우리는 우리 나라 사람의 구원을 돌보기에도 바쁘고, 하나님이 이방 사람을 구원하시려면 어떻게든 복음을 그들에게 가져가실 것이라고 생각한다.", src: "careyenquiry: 1장" },
    evidence: [
      {
        img: "ch-carey-pundit", name: "로버트 홈이 그린 캐리와 인도 학자 므리툰자야 비디알란카르", madeYear: 1811, madeLabel: "1811년 무렵(위키미디어 작품 정보의 연도)",
        where: "영국 옥스퍼드 리젠츠 파크 칼리지", found: "",
        says: "캐리가 날마다 함께 일한 벵골의 학자(판디트)와 나란히 앉은 모습이다. 캐리가 살아 있을 때 그린 초상이다.",
        strength: "context", caveat: "인도로 떠나던 1793년의 모습이 아니라 세람포르에서 번역과 강의를 하던 무렵의 모습이다.",
      },
      place("ch-serampore-college", "세람포르 칼리지", "인도 서벵골주 세람포르",
        "캐리와 마시먼, 워드가 1818년에 세운 학교다. 캐리 일행이 머문 덴마크 땅 세람포르에 지금도 남아 있다.",
        "오늘의 건물 사진이다. 1793년의 출발을 보여 주지는 않는다."),
    ],
  },
  {
    id: "schleiermacher-1799", title: "슐라이어마허가 『종교론』을 펴내다", short: "슐라이어마허 『종교론』", year: 1799, yearLabel: "1799년",
    dateNote: "베를린의 출판업자 요한 프리드리히 웅거가 저자 이름 없이 펴냈다. 슐라이어마허는 뒤에 여러 번 고쳐 다시 냈다.",
    era: "missions",
    summary: "베를린 샤리테 병원의 개혁교회 목사 프리드리히 슐라이어마허가 『종교에 관하여: 종교를 멸시하는 교양인들에게 하는 강연』을 펴낸다. 계몽주의를 배운 베를린의 지식인들은 종교를 낡은 교리나 도덕 교훈쯤으로 여겼다. 슐라이어마허는 종교의 핵심이 세상을 설명하는 이론도, 도덕을 행하는 일도 아니고, 무한한 것을 직접 바라보고 느끼는 데 있다고 답했다. 친구 프리드리히 슐레겔 같은 낭만주의 작가들과 어울리던 때에 쓴 책이다. 그는 뒤에 『기독교 신앙』(1821~22)에서 신앙의 바탕을 '절대 의존의 느낌'으로 풀었다. 개신교 신학은 그를 자유주의 신학(성경과 교리를 사람의 경험과 근대 학문에 비추어 다시 풀려는 신학)의 출발점으로 꼽는다. 같은 시대에도 그는 무신론자, 스피노자주의자, 경건주의자라는 서로 어긋나는 비난을 함께 들었다.",
    people: ["schleiermacher"], route: ["berlin"],
    source: { text: "종교의 본질은 생각하는 것도 행동하는 것도 아니고, 바라봄과 느낌이다. … 실천은 기술이고 사변은 학문이며, 종교는 무한한 것을 알아보는 감각이요 맛이다.", src: "reden1799: 둘째 강연 「종교의 본질에 관하여」(초판 50·53쪽)" },
    controversy: "liberal-theology",
    evidence: [{
      img: "ch-reden-1799", name: "『종교론』 1799년 초판의 속표지", madeYear: 1799, madeLabel: "1799년",
      where: "초판 인쇄본(스캔본은 인터넷 아카이브에 있다)", found: "",
      says: "'종교에 관하여. 종교를 멸시하는 교양인들에게 하는 강연. 베를린, 요한 프리드리히 웅거, 1799'라고만 적혀 있고 저자 이름은 없다.",
      strength: "direct", caveat: "",
    }],
  },
  {
    id: "shinyu-1801", title: "조선 조정이 천주교 신자를 크게 박해하다: 신유박해", short: "신유박해", year: 1801, yearLabel: "1801년",
    dateNote: "대왕대비의 금교령은 음력 1월 10일, 정약종과 이승훈의 처형은 음력 2월 26일(양력 4월 8일), 황사영의 처형은 음력 11월 5일이다(『순조실록』). 청나라 신부 주문모는 5월 31일에 처형되었다(『가톨릭 백과사전』).",
    era: "missions",
    summary: "정조가 죽고 어린 순조가 왕위에 오르자, 수렴청정(어린 왕을 대신해 대비가 나랏일을 맡아보는 일)하던 대왕대비 정순왕후가 천주교를 '아비도 임금도 없는 가르침'이라며 엄히 금한다. 다섯 집을 한 통으로 묶어 서로 살피고 고발하게 했다. 천주교를 믿는 사람이 많던 남인(조선 후기 정치 세력의 한 갈래) 학자들이 표적이 되었다. 이승훈과, 한글 교리서 『주교요지』를 쓴 정약종 등이 서소문 밖에서 목이 베였고, 정약종의 형 정약전과 아우 정약용은 신앙을 버린다고 말해 귀양을 갔다. 조선에 몰래 들어와 있던 청나라 신부 주문모도 스스로 나와 처형되었다. 정약종의 조카사위 황사영은 산골 토굴에 숨어 박해의 경과를 베이징 천주당의 주교에게 알리는 편지를 비단에 썼다(황사영 백서). 편지에는 서양 나라가 큰 배 수백 척과 군사 오륙만을 보내 조선 조정이 천주교를 허락하게 해 달라는 청이 들어 있었다. 제천에서 붙잡힌 그는 대역죄로 처형되었다. 박해의 배경에는 1791년 전라도 진산의 양반 윤지충과 권상연이 어머니 상을 천주교식으로 치르며 제사를 거부했다가 처형된 일(진산 사건)이 있었다.",
    people: ["jeongyakjong", "leeseunghun"], route: ["majae", "seoul", "baeron", "beijing"],
    source: { text: "지금 이른바 사학(邪學)은 아비도 없고 임금도 없어 사람의 도리를 무너뜨리고 교화를 거스른다. … 이렇게 엄히 금한 뒤에도 고치지 않는 무리가 있으면 역적을 다스리는 법으로 다스리라.", src: "sillok: 『순조실록』 2권, 순조 1년(1801) 1월 10일 대왕대비의 하교" },
    controversy: "rites",
    evidence: [
      place("ch-baeron", "제천 배론 성지", "충청북도 제천시 봉양읍",
        "황사영이 숨어 지내며 백서를 썼다고 전하는 산골이다. 충청북도 기념물로 지정되어 있고, 지금은 천주교 성지로 꾸며져 있다.",
        "오늘의 장소 사진이다. 백서 원본은 사진에 없다. 실록은 그가 토굴에 숨었다가 제천에서 붙잡혔다고만 적었다."),
    ],
  },
  {
    id: "ineffabilis-1854", title: "비오 9세가 마리아의 원죄 없는 잉태를 교의로 선포하다", short: "무염시태 교의 선포", year: 1854, yearLabel: "1854년 12월 8일",
    dateNote: "로마 성 베드로 대성당에서 교서 「이네파빌리스 데우스(Ineffabilis Deus)」의 정의문을 읽었다. 앞서 1849년 2월 2일 가에타에서 주교들에게 의견을 묻는 회칙을 보냈다.",
    era: "missions",
    summary: "교황 비오 9세가 로마 성 베드로 대성당에 모인 추기경과 주교 200여 명 앞에서, 마리아가 잉태된 첫 순간부터 원죄(아담 뒤로 모든 사람이 지니고 태어난다고 보는 죄의 상태)에서 보호되었다는 가르침을 하나님이 계시하신 교의로 선포한다. 이 가르침을 원죄 없는 잉태 또는 무염시태(얼룩 없는 잉태)라 부른다. 중세에 둔스 스코투스는 이 가르침을 옹호했고, 토마스 아퀴나스는 『신학대전』에서 받아들이지 않았다. 비오 9세는 1848년 로마의 혁명을 피해 가에타에 머물 때 온 세계 주교들에게 의견을 물었다. 600명 넘는 주교가 답했고, 네 사람을 빼고 모두 이 믿음에 동의했지만 52명은 지금 교의로 정하는 것은 때가 아니라고 했다. 공의회를 열지 않고 교황이 홀로 교의를 정한 이 일을 두고, 개신교 교회사가 필립 샤프는 교황이 16년 뒤 1차 바티칸 공의회가 정할 무류성(교황이 신앙과 도덕에 관해 공식으로 정의할 때 틀리지 않는다는 가르침)을 미리 행사한 셈이라고 평했다. 네덜란드 위트레흐트의 구가톨릭 주교들은 곧바로 이 교의를 거부했고, 정교회와 개신교도 받아들이지 않는다.",
    people: ["pius9"], route: ["gaeta", "rome"],
    source: { text: "복되신 동정녀 마리아는 잉태된 첫 순간에 전능하신 하나님의 특별한 은총과 특권으로, 인류의 구원자 예수 그리스도의 공로를 미리 보시어, 원죄의 모든 얼룩에서 보호되었다. 이 가르침은 하나님이 계시하신 것이다.", src: "schaffcreeds: 2권 「무염시태에 관한 비오 9세의 교령」(라틴어 원문)" },
    controversy: "infallibility",
    evidence: [{
      img: "ch-immacolata-column", name: "로마 스페인 광장의 원죄 없는 잉태 기념 기둥", madeYear: 1857, madeLabel: "1857년",
      where: "이탈리아 로마 스페인 광장(포교성성 건물 앞)", found: "",
      says: "교의 선포를 기념해 비오 9세가 세우게 한 기둥이다. 꼭대기에 마리아 상을 두고, 받침 둘레에 모세·다윗·이사야·에스겔 상을 놓았다(샤프).",
      strength: "context", caveat: "선포 장면이 아니라 3년 뒤에 세운 기념물이다. 사진은 2016년에 찍었다.",
    }],
  },
  {
    id: "byeongin-1866", title: "흥선 대원군이 천주교 신자를 대대적으로 처형하다: 병인박해", short: "병인박해", year: 1866, yearLabel: "1866년",
    dateNote: "베르뇌 주교 등 네 사람은 3월 초 새남터에서, 다블뤼 주교 등 세 사람은 3월 30일 충청도 갈매못에서 처형되었다. 프랑스 함대는 그해 10~11월에 강화도를 공격했다. 박해는 대원군이 물러난 1873년 무렵까지 이어졌다.",
    era: "missions",
    summary: "어린 고종을 대신해 나라를 다스리던 아버지 흥선 대원군이 천주교를 뿌리 뽑으라고 명한다. 1866년 1월 러시아 배가 원산에 와서 통상을 요구하자, 승지를 지낸 천주교 신자 남종삼 등은 서울에 있던 프랑스 주교들을 통해 프랑스·영국과 손잡고 러시아를 막자고 건의했다. 대원군은 한때 관심을 보였지만, 러시아 배가 물러가고 대신들이 거세게 반대하자 생각을 바꾸었다. 그해 봄 베르뇌 주교와 다블뤼 주교 등 프랑스 선교사 아홉 명이 잡혀 서울 새남터와 충청도 갈매못에서 처형되었고, 남종삼과 홍봉주도 목이 베였다. 살아남은 선교사 세 사람은 청나라로 빠져나갔고, 그 가운데 리델 신부가 톈진에서 프랑스 함대 사령관 로즈에게 이 일을 알렸다. 가을에 프랑스 함대가 강화도를 공격했다가 물러갔고(병인양요), 그 뒤 박해는 더 거세져 한강 가 양화진 언덕(뒤에 '머리 자른 산'이라는 뜻으로 절두산이라 불림)에서도 신자들이 처형되었다. 앞서 1839년 기해박해 때는 앵베르 주교와 모방·샤스탕 신부, 정하상이, 1846년 병오박해 때는 첫 한국인 사제 김대건이 처형되었다. 가톨릭교회는 이 세 박해로 죽은 사람 가운데 103명을 1984년 성인으로 선포했다.",
    people: ["kimdaegeon"], route: ["seoul", "galmaemot", "ganghwa"],
    source: { text: "이른바 서양 학문은 아비도 임금도 없는 사악한 술수다. … 러시아가 걱정거리가 된다는 말과 프랑스와 약조를 맺자는 계책은 처음부터 믿을 만한 근거가 없는데, 요사한 말을 지어 여러 사람을 홀렸다.", src: "sillok: 『고종실록』 3권, 고종 3년(1866) 1월 20일 의금부가 올린 남종삼의 결안" },
    controversy: "rites",
    evidence: [
      {
        img: "ch-cheokhwabi", name: "척화비", madeYear: 1871, madeLabel: "1866년에 글을 짓고 1871년에 세움",
        where: "국립경주박물관 뜰", found: "",
        says: "'서양 오랑캐가 쳐들어오는데 싸우지 않으면 화친하자는 것이요, 화친을 주장하는 것은 나라를 파는 일이다'라고 새긴 비석이다. 병인양요 때 지은 글을, 1871년 미국 함대의 강화도 공격(신미양요)을 물리친 뒤 대원군이 전국에 세웠다.",
        strength: "indirect", caveat: "천주교 박해를 직접 말하지는 않는다. 박해와 함께 간 서양 배척 정책을 보여 준다.",
      },
      place("ch-jeoldusan", "절두산 순교 성지", "서울 마포구 합정동 한강 가",
        "병인양요 뒤 신자들을 처형한 양화진 나루의 언덕이다. 지금은 순교자를 기리는 성당과 박물관이 서 있다."),
    ],
  },
];

export const CH_PEOPLE_5 = [
  { id: "carey", name: "윌리엄 캐리", from: 1761, to: 1834, kind: "생애" },
  { id: "schleiermacher", name: "프리드리히 슐라이어마허", from: 1768, to: 1834, kind: "생애" },
  { id: "jeongyakjong", name: "정약종", from: 1760, to: 1801, kind: "생애" },
  { id: "kimdaegeon", name: "김대건", from: 1821, to: 1846, kind: "생애" },
  { id: "pius9", name: "비오 9세", from: 1846, to: 1878, kind: "재위" },
  { id: "newman", name: "존 헨리 뉴먼", from: 1801, to: 1890, kind: "생애" },
];

// church_events.js의 CH_PLACES와 data.js의 PLACES에 없는 장소만
// 슐라이어마허가 태어난 브레슬라우는 묶음 7의 breslau를 그대로 쓴다.
export const PLACES_CH5 = {
  paulerspury: { name: "폴러스퍼리", at: [-0.96, 52.1] },
  leicester: { name: "레스터", at: [-1.13, 52.64] },
  kettering: { name: "케터링", at: [-0.72, 52.4] },
  niesky: { name: "니스키", at: [14.82, 51.29] },
  barby: { name: "바르비", at: [11.88, 51.97] },
  majae: { name: "마재(남양주 조안)", at: [127.29, 37.53] },
  baeron: { name: "배론(제천)", at: [128.07, 37.11] },
  solmoe: { name: "솔뫼(당진)", at: [126.78, 36.88] },
  macau: { name: "마카오", at: [113.54, 22.2] },
  shanghai: { name: "상하이", at: [121.47, 31.23] },
  sunwido: { name: "순위도(황해도 옹진)", at: [125.35, 37.73] },
  mirinae: { name: "미리내(안성)", at: [127.22, 37.06] },
  galmaemot: { name: "갈매못(보령)", at: [126.52, 36.38] },
  ganghwa: { name: "강화도", at: [126.49, 37.75] },
  senigallia: { name: "세니갈리아", at: [13.22, 43.72] },
  spoleto: { name: "스폴레토", at: [12.74, 42.73] },
  imola: { name: "이몰라", at: [11.71, 44.35] },
  gaeta: { name: "가에타", at: [13.57, 41.21] },
  santiagochile: { name: "산티아고(칠레)", at: [-70.65, -33.45] },
  littlemore: { name: "리틀모어", at: [-1.22, 51.72] },
  birmingham: { name: "버밍엄", at: [-1.9, 52.48] },
  dublin: { name: "더블린", at: [-6.26, 53.35] },
};

// 증거 사진: 키(img 이름) → 위키미디어 공용 파일 이름. tools/fetch_images.py가 받는다.
export const IMG_CH5 = {
  "ch-ccc-proclamation": "File:ANC, Louis XVI - Proclamation du roi pour la Constitution civile du Clergé, 24 août 1790.png",
  "ch-ccc-oath-list": "File:Liste des curés et vicaires du district de Villefranche qui ont prêté le serment de la Constitution civile du clergé, 1791.jpg",
  "ch-carey-pundit": "File:Robert Home (1752-1834) - William Carey (1761–1834) and His Indian Pundit Mrityunjaya Vidyalankar (c.1762–1819) - HH1 - Regent's Park College.jpg",
  "ch-serampore-college": "File:Serampore College, Serampore, Hooghly, West Bengal.jpg",
  "ch-reden-1799": "File:Cover of 1799 edition of Über die Religion.jpg",
  "ch-baeron": "File:배론성지.jpg",
  "ch-immacolata-column": "File:Colonna dell'Immacolata - Piazza di Spagna - Rome 2016.jpg",
  "ch-cheokhwabi": "File:척화비(경주박물관).jpg",
  "ch-jeoldusan": "File:Jeoldusan Martyrs' Shrine (절두산 순교성지) - panoramio.jpg",
  // 프로필의 기록 사진
  "ch-jugyo-yoji-1885": "File:쥬교요지 (1885년).pdf",
  "ch-kim-launay-1901": "File:Launay, Dallet - La Corée et les missionnaires, 1901-p267.jpg",
  "ch-kim-letters": "File:Letters of Andrew Kim Taegon in the Seosomun Shrine History Museum.jpg",
  "ch-pius9-braun": "File:Pius IX, by Adolphe Braun, 1875.jpg",
  "ch-newman-richmond": "File:Portrait of John Henry Newman.jpg",
};

// 이 묶음에서 새로 쓴 출처(sources.js에 없는 것만)
export const SRC_V5 = {
  // 원문(저작권 만료). 인용문은 이 원문에서 우리가 옮겼다
  ccc1790: { name: "「성직자 시민 헌법」 프랑스어 원문(국민의회, 1790년 7월 12일, 위키문헌)", url: "https://fr.wikisource.org/wiki/Constitution_civile_du_clerg%C3%A9_du_12_juillet_1790", license: "공유" },
  anderson1908: { name: "F. M. Anderson 편, 『The Constitutions and Other Select Documents Illustrative of the History of France, 1789–1907』(개정판, 1908)", url: "https://archive.org/details/constitutionsoth00ande", license: "공유" },
  careyenquiry: { name: "W. Carey, 『An Enquiry into the Obligations of Christians to Use Means for the Conversion of the Heathens』(1792)", url: "https://www.gutenberg.org/ebooks/11449", license: "공유" },
  smithcarey: { name: "G. Smith, 『The Life of William Carey, Shoemaker & Missionary』(프로젝트 구텐베르크 판)", url: "https://www.gutenberg.org/ebooks/2056", license: "공유" },
  reden1799: { name: "F. 슐라이어마허 『종교에 관하여: 종교를 멸시하는 교양인들에게 하는 강연』(베를린, 1799년 초판, 독일어 원문)", url: "https://archive.org/details/berdiereligion00schl", license: "공유" },
  eb1911: { name: "『Encyclopædia Britannica』 11판(1910~1911)", url: "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica", license: "공유" },
  sillok: { name: "『조선왕조실록』 한문 원문(국사편찬위원회 누리집)", url: "https://sillok.history.go.kr/", license: "공유" },
  dallet: { name: "C. Dallet, 『Histoire de l'Église de Corée』 1·2권(1874)", url: "https://archive.org/details/histoiredelgli01dall", license: "공유" },
  // 근거로만 단다. 옮겨 싣지 않는다
  cbckmartyrs: { name: "한국천주교주교회의 시복시성주교특별위원회 누리집(103위 성인 연표와 124위 복자 약전)", url: "https://www.cbck.or.kr/koreanmartyrs", license: "링크만" },
  vaticannews: { name: "바티칸 뉴스(Vatican News)", url: "https://www.vaticannews.va/", license: "링크만" },
};
