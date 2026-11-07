// 교회사 사건·인물 묶음 6(1870~1914년, 혁명과 선교의 세기 후반). 형식은 church_events.js 머리말과 church_ev1.js를 따른다.
// 증거의 kind: "place"는 장소를 오늘(또는 근래에) 찍은 사진이다. 사건을 직접 보여 주지는 않는다.
// 1900년 뒤의 사건은 옮겨 실을 수 있는 옛 문헌이 없으면 source를 비워 둔다(CHURCH_HISTORY.md 3단계).

const place = (img, name, where, says, caveat) => ({
  img, kind: "place", name, madeLabel: "오늘의 모습", where, found: "", says, strength: "context",
  caveat: caveat ?? "장소 사진이다. 사건을 직접 보여 주지는 않는다.",
});

export const CH_EVENTS_6 = [
  {
    id: "vatican1-1870", title: "1차 바티칸 공의회가 교황의 무류성을 교리로 정하다", short: "1차 바티칸 공의회", year: 1870, yearLabel: "1870년 7월 18일",
    dateNote: "공의회는 1869년 12월 8일에 열렸다. 교황 무류성을 담은 헌장 「영원한 목자」는 1870년 7월 18일에 표결했고, 공의회는 10월 20일 무기한 멈추었다.",
    era: "missions",
    summary: "교황 비오 9세가 로마의 성 베드로 대성당에 가톨릭 주교들을 불러 공의회(교회의 대표들이 모여 가르침과 규칙을 정하는 회의)를 연다. 트리엔트 공의회가 끝나고 300년 만이었다. 1870년 4월에는 신앙과 이성에 관한 헌장을 만장일치로 받아들였다. 가장 크게 다툰 안건은 교황 무류성(교황이 신앙과 도덕에 관한 가르침을 공식으로 정할 때 틀릴 수 없다는 가르침)이었다. 독일·오스트리아·프랑스 주교 상당수는 이 교리를 지금 정하는 일이 옳지 않다며 반대했고, 마지막 표결 전날 100명 넘게 로마를 떠났다. 7월 18일 남은 535명 가운데 533명이 찬성해 헌장 「영원한 목자」가 통과했다. 이튿날 프랑스가 프로이센에 전쟁을 선포했고, 9월 이탈리아 군대가 로마에 들어오자 공의회는 멈추었다. 뮌헨의 교회사학자 되링거 등은 이 교리를 받아들이지 않았고, 이들을 따른 사람들이 1871년부터 구가톨릭 교회를 세웠다. 1889년 이 교회들은 18세기부터 로마와 따로 서 있던 네덜란드 위트레흐트 교회와 함께 위트레흐트 연합을 이루었다. 동방 정교회와 개신교는 교황 무류성을 받아들이지 않는다.",
    people: ["pius9", "dollinger"], route: ["rome", "munich", "utrecht"],
    source: { text: "로마 교황이 사도좌에서 말할 때, 곧 모든 그리스도인의 목자이자 스승의 직무를 행하며 온 교회가 지켜야 할 신앙과 도덕의 가르침을 정의할 때, 그는 거룩한 구속자께서 교회에 주려 하신 무류성을 지닌다.", src: "schaffcreeds: 2권 1차 바티칸 공의회 「그리스도의 교회에 관한 첫 교의 헌장」(영원한 목자) 4장" },
    controversy: "infallibility",
    evidence: [{
      img: "ch-vatican1-litho", name: "1차 바티칸 공의회의 개회를 그린 석판화", madeYear: 1870, madeLabel: "1870년",
      where: "미국 의회 도서관", found: "",
      says: "1869년 12월 8일 성 베드로 대성당 안에 마련한 회의장에 주교들이 줄지어 앉은 모습을 그린, 손으로 색을 입힌 석판화다. 공의회가 열리던 해에 만들었다.",
      strength: "context", caveat: "그 자리에 있던 화가가 그린 그림인지 알 수 없어서, 자리 배치 같은 세부는 정확하지 않을 수 있다.",
    }],
  },
  {
    id: "phyletism-1872", title: "콘스탄티노플 공의회가 민족에 따라 교회를 나누는 생각을 정죄하다", short: "1872년 콘스탄티노플 공의회", year: 1872, yearLabel: "1872년 9월",
    dateNote: "공의회는 그때 정교회가 쓰던 율리우스력으로 8월 29일부터 9월 16일까지(오늘 달력으로 9월 10일부터 28일까지) 콘스탄티노플의 성 게오르기오스 성당에서 열렸다. 불가리아 교회가 독립을 선포한 날은 같은 해 율리우스력 5월 11일(오늘 달력 5월 23일)이다.",
    era: "missions",
    summary: "오스만 제국 안의 정교회 신자들은 민족과 상관없이 콘스탄티노플 총대주교의 다스림을 받았다. 19세기에 불가리아 사람들은 그리스 사람 주교 대신 자기 민족의 주교를 세우고 자기 말로 예배하기를 바랐다. 1870년 술탄이 칙령을 내려 불가리아 엑사르크청(총대주교 아래에서 한 지역 교회를 이끄는 으뜸 주교, 곧 엑사르크가 다스리는 교회)을 허락했다. 1872년 비딘 대주교였던 안팀 1세가 첫 엑사르크가 되었고, 그해 5월 총대주교의 허락 없이 교회의 독립을 선포했다. 총대주교 안티모스 6세는 공의회를 열었다. 알렉산드리아·안티오키아 총대주교와 키프로스 대주교, 대주교와 주교 25명이 모여 필레티즘(교회를 땅이 아니라 민족에 따라 나누어 다스리려는 생각)을 정죄하고, 엑사르크청을 분열한 교회로 선언했다. 예루살렘 총대주교는 첫 회기 뒤 회의장을 떠나 서명하지 않았다. 이 분열은 1945년 콘스탄티노플 총대주교청이 불가리아 교회와 다시 사귐을 회복할 때까지 70년 넘게 이어졌다. 정교회는 민족 교회 문제를 다툴 때마다 이 결정을 다시 꺼내 든다.",
    people: [], route: ["constantinople"],
    source: { text: "우리는 필레티즘, 곧 그리스도의 교회 품 안에서 민족과 겨레를 가르는 가르침을 꾸짖고 정죄하며, 복음의 가르침과 거룩한 교부들의 법규에 어긋난다고 선언한다.", src: "mqr1873: 공의회 결정문 1조" },
    controversy: "phyletism",
    evidence: [
      {
        img: "ch-antim1", name: "첫 불가리아 엑사르크 안팀 1세의 사진", madeYear: 1880, madeLabel: "1888년 이전(찍은 해는 알려지지 않음)",
        where: "불가리아 국립 기록원", found: "",
        says: "1872년 불가리아 엑사르크청의 첫 엑사르크가 된 안팀 1세다. 공의회 결정문은 그를 '비딘의 전 대주교 안티모스'라고 이름을 들어 분열을 일으킨 사람으로 선언했다.",
        strength: "context", caveat: "인물 사진이다. 공의회 장면을 보여 주지는 않는다.",
      },
      place("ch-st-stephen-istanbul", "이스탄불의 불가리아 성 스테판 교회", "튀르키예 이스탄불 금각만 기슭",
        "1898년 철골로 지은 불가리아 정교회 성당이다. 콘스탄티노플에 살던 불가리아 사람들이 예배하던 나무 교회 자리에 섰다."),
    ],
  },
  {
    id: "underwood-1885", title: "언더우드와 아펜젤러가 제물포에 내리다", short: "개신교 선교사들의 제물포 도착", year: 1885, yearLabel: "1885년 4월 5일",
    dateNote: "이날은 부활절 주일이었다. 아펜젤러 부부는 서울이 아직 어수선해 곧 일본으로 돌아갔다가 6월에 다시 왔다.",
    era: "missions",
    summary: "미국 북장로교회의 선교사 호러스 언더우드와 미국 북감리교회의 선교사 헨리 아펜젤러 부부가 일본 나가사키에서 같은 배를 타고 제물포(오늘의 인천)에 내린다. 조선은 1882년 미국과 조약을 맺었지만, 1884년 12월 갑신정변(개화파가 일으켰다가 사흘 만에 무너진 정변)의 혼란이 아직 가라앉지 않았다. 아내와 함께 온 아펜젤러는 미국 영사의 경고를 듣고 일본으로 돌아갔고, 혼자 온 언더우드는 서울로 들어갔다. 언더우드는 1884년 9월에 먼저 와 있던 의료 선교사 앨런의 병원 일을 도우며 조선말을 익혔다. 6월에 돌아온 아펜젤러는 영어를 가르치는 학교를 열었고, 고종이 이 학교에 배재학당이라는 이름을 내렸다. 1887년 두 사람은 서울에서 각각 첫 교회를 세웠다. 오늘의 새문안교회와 정동제일교회다. 두 사람은 함께 성경 번역 위원회를 이끌었다. 조선 천주교는 이보다 100년 앞서 시작해 여러 차례 큰 박해를 겪은 뒤였다. 한국 개신교는 이날을 선교가 시작된 날로 기념한다.",
    people: ["underwood", "appenzeller"], route: ["nagasaki", "incheon", "seoul"],
    source: { text: "이날 무덤의 빗장을 깨뜨리신 분께서 조선에 빛과 자유를 가져다주시기를.", src: "griffis1912: 98쪽(제물포에 내린 날 아펜젤러가 드린 기도)" },
    evidence: [{
      img: "ch-underwood-1884", name: "1884년의 언더우드", madeYear: 1884, madeLabel: "1884년",
      where: "릴리어스 언더우드 『조선의 언더우드』(1918)에 실린 사진", found: "",
      says: "조선에 오기 한 해 전, 뉴브런즈윅의 신학교를 마치고 목사 안수를 받던 해의 언더우드다. 그해 7월 미국 북장로교회는 그를 조선에 보낼 첫 목사 선교사로 정했다.",
      strength: "context", caveat: "인물 사진이다. 제물포에 내린 장면을 보여 주지는 않는다.",
    }],
  },
  {
    id: "uganda-1886", title: "부간다의 왕이 그리스도인 젊은이들을 나무공고에서 불태우다", short: "우간다 순교자", year: 1886, yearLabel: "1886년 6월 3일",
    dateNote: "죽임은 1885년 1월부터 1887년 초까지 이어졌다. 가장 많은 사람이 한꺼번에 죽은 날이 1886년 6월 3일이다.",
    era: "missions",
    summary: "빅토리아 호수 북쪽의 부간다 왕국(오늘 우간다의 중심 지역)에 1877년 영국 성공회의 교회 선교회가, 1879년 가톨릭의 백인 신부회(아프리카 선교를 위해 프랑스에서 세운 가톨릭 선교회)가 들어왔다. 왕궁의 시동(왕을 곁에서 모시던 소년과 청년) 가운데 세례를 받는 사람이 늘었다. 1884년 왕위에 오른 카바카(부간다의 왕) 음왕가 2세는 그리스도인들이 왕보다 다른 주인을 섬긴다고 의심했다. 그는 1885년 1월 성공회 소년 세 명을 죽였고, 10월에는 왕국으로 들어오던 성공회 주교 해닝턴을 죽이게 했다. 이를 꾸짖은 가톨릭 신자 시종장 요셉 무카사도 11월에 목이 베였다. 1886년 5월 말 왕은 시동들에게 신앙을 버리라고 명했다. 버틴 사람들은 나무공고로 끌려가 6월 3일 산 채로 불태워졌다. 가톨릭의 가롤로 르왕가와 성공회의 누와 왈루카가가 이때 함께 죽었다. 가톨릭은 이 시기의 순교자 22명을 1920년 복자로, 1964년 성인으로 선포했고, 성공회는 23명을 순교자로 기린다. 두 교회는 해마다 6월 3일 나무공고의 각자 성지에서 순교자를 기념한다.",
    people: [], route: ["kampala", "namugongo"],
    source: { text: "왈루카가와 다른 서른 명쯤이 영웅답게 죽었다. 그리스도인 포로들 둘레에 큰 장작더미를 쌓고, 한 사람씩 단단히 묶은 뒤 불붙은 나무를 가져왔다.", src: "ashe1890: 225~226쪽(성공회 선교사 애시가 부간다에서 들은 소식)" },
    evidence: [
      place("ch-namugongo-basilica", "나무공고 순교자 성지 대성당", "우간다 나무공고",
        "가톨릭 순교자들이 불탄 자리에 1973년 지은 성당이다. 스위스 건축가 유스투스 다힌덴이 설계했다."),
      place("ch-namugongo-anglican", "나무공고 성공회 순교자 성지의 순교자 기념일", "우간다 나무공고",
        "2024년 6월 3일 성공회 순교자 성지에 모인 순례자들이다. 성공회도 같은 날 같은 마을에서 따로 순교자를 기념한다.",
        "오늘의 기념 행사 사진이다. 1886년의 사건을 직접 보여 주지는 않는다."),
    ],
  },
  {
    id: "azusa-1906", title: "로스앤젤레스 아주사 거리에서 오순절 부흥이 일어나다", short: "아주사 거리 부흥", year: 1906, yearLabel: "1906년 4월",
    dateNote: "4월 9일 보니 브레 거리의 한 집에서 방언이 터졌고, 4월 중순 아주사 거리 312번지로 모임을 옮겼다. 집회는 1909년 무렵까지 거의 날마다 열렸다.",
    era: "missions",
    summary: "노예였다가 풀려난 부모에게서 태어난 흑인 설교자 윌리엄 시모어가 로스앤젤레스의 작은 성결교회에 초청을 받아 온다. 성결교회는 회심 뒤에 죄에서 깨끗해지는 두 번째 은혜를 강조한 감리교 계열 운동에서 나온 교회다. 시모어는 텍사스 휴스턴에서 찰스 파럼에게서 성령 세례(회심 뒤에 성령을 따로 받는 체험)를 받으면 그 표시로 방언(배우지 않은 말이나 알아들을 수 없는 소리로 하는 기도)을 한다는 가르침을 배웠다. 교회는 이 가르침 때문에 그를 내쫓았다. 시모어는 보니 브레 거리의 한 흑인 가정에서 기도회를 이어 갔고, 4월 9일 그곳에서 여럿이 방언을 했다. 사람이 몰려들자 아주사 거리 312번지의 옛 흑인 감리교회 건물을 빌려 사도 신앙 선교회를 열었다. 흑인과 백인, 멕시코계와 아시아계 사람이 한자리에서 예배했고, 여성도 설교했다. 4월 18일 로스앤젤레스 타임스는 이 모임을 '기이한 방언의 바벨'이라고 비웃었다. 9월부터 펴낸 신문 『사도 신앙』과 이곳을 다녀간 사람들을 통해 오순절 운동은 몇 해 만에 북미와 유럽, 인도, 아프리카, 남미로 번졌다. 하나님의 성회 같은 오순절 교단들과 뒤의 은사 운동은 이 부흥을 뿌리로 본다.",
    people: ["seymour"], route: ["houston", "losangeles"],
    controversy: "pentecostal",
    evidence: [
      {
        img: "ch-azusa-mission", name: "아주사 거리 312번지의 사도 신앙 선교회 건물", madeYear: 1907, madeLabel: "1907년으로 전함",
        where: "미국 로스앤젤레스", found: "",
        says: "부흥 집회가 열린 목조 건물이다. 본디 흑인 감리교회가 쓰던 건물로, 시모어의 선교회가 빌려 집회 장소로 고쳐 썼다.",
        strength: "indirect", caveat: "1907년 사진으로 알려져 있지만, 찍힌 자동차로 보아 1920년대에 찍었다는 의견도 있다. 건물은 남아 있지 않다.",
      },
      {
        img: "ch-azusa-leaders", name: "아주사 거리 선교회의 일꾼들", madeYear: 1907, madeLabel: "1907년 무렵(1908년에 실림)",
        where: "미국 로스앤젤레스", found: "",
        says: "시모어와 선교회 일꾼들을 함께 찍은 사진이다. 흑인과 백인, 남자와 여자가 한데 서 있어서, 인종이 갈린 시대에 이 선교회가 함께 모였음을 보여 준다.",
        strength: "indirect", caveat: "사진 속 사람들 하나하나의 이름은 자료마다 조금씩 다르게 적는다.",
      },
    ],
  },
  {
    id: "pyongyang-1907", title: "평양 장대현교회에서 대부흥이 일어나다", short: "평양 대부흥", year: 1907, yearLabel: "1907년 1월",
    dateNote: "평안남도 겨울 사경회 기간에 일어났다. 길선주의 공개 회개를 1월 6일 새벽 기도회로 적는 자료와, 큰 회개가 터진 저녁 집회를 1월 14일로 적는 자료가 있다.",
    era: "missions",
    summary: "1906년 8월 평양의 선교사들이 여드레 동안 성경 공부와 기도 모임을 가졌고, 조선 신자 수백 명이 날마다 한 시간씩 기도하기로 약속했다. 1907년 1월 평양 장대현교회에서 평안남도 여러 교회의 남자 신자들이 모인 겨울 사경회(며칠씩 모여 성경을 공부하고 기도하는 모임)가 열렸다. 집회 가운데 장로 길선주가 죽은 친구의 재산을 맡아 관리하다 돈을 떼어먹었다고 사람들 앞에서 고백했다. 이어 사람들이 줄지어 일어나 미움과 도둑질, 간음 같은 죄를 소리 내어 고백하며 울었다. 회개 운동은 평양의 학교와 감리교회를 거쳐 서울과 전국으로 번졌다. 1905년 을사늑약으로 대한제국이 외교권을 빼앗긴 지 두 해 뒤였다. 같은 해 9월 조선의 장로교회들은 처음으로 하나의 노회(한 지역 교회들의 목사와 장로 대표가 모여 교회 일을 정하는 회의)를 열고, 평양 신학교의 첫 졸업생 일곱 명에게 목사 안수를 주었다. 길선주도 그 가운데 한 사람이었다. 한국 개신교는 이 부흥을 교회가 크게 자란 출발점으로 기억하고, 새벽 기도와 통성 기도(여럿이 한꺼번에 소리 내어 하는 기도) 같은 한국 교회의 모습도 이때 자리 잡았다고 본다. 학계에서는 이 부흥이 교회를 나라 잃은 현실의 정치 문제에서 떼어 놓았다는 평가와, 신자들의 삶을 바꾸고 뒤의 민족 운동에 힘이 되었다는 평가가 함께 나온다.",
    people: ["gilseonju"], route: ["pyongyang", "seoul"],
    source: { text: "1907년 1월 첫 주에 성령이 말 그대로 사람들 위에 부어졌고, 그분이 계시다는 불길이 온 도시와 둘레 시골로 빠르게 번져 나갔다.", src: "jones1910: 앞부분(감리교 선교사 존스와 노블이 정리한 부흥 기록)" },
    evidence: [{
      img: "ch-jangdaehyeon", name: "평양 장대현교회", madeYear: 1907, madeLabel: "20세기 초(찍은 해는 분명하지 않음)",
      where: "평양 장대현", found: "",
      says: "평양 장대현 언덕에 선 장로교회 예배당이다. 1907년 겨울 사경회와 부흥 집회가 이 건물에서 열렸다.",
      strength: "indirect", caveat: "찍은 해가 분명하지 않다. 건물은 지금 남아 있지 않다.",
    }],
  },
  {
    id: "pascendi-1907", title: "비오 10세가 근대주의를 '모든 이단의 종합'이라며 정죄하다", short: "근대주의 정죄", year: 1907, yearLabel: "1907년 9월 8일",
    dateNote: "교황청 검사성성의 교령 「참으로 슬픈 결과로」(Lamentabili)는 7월 3일, 회칙은 9월 8일에 나왔다. 반근대주의 서약은 1910년 9월 1일에 정했다.",
    era: "missions",
    summary: "19세기 말 가톨릭 안에서 성경을 역사 연구의 방법으로 읽고, 교리도 시대에 따라 자라고 바뀐다고 보는 학자들이 나왔다. 프랑스의 성서학자 알프레드 루아지, 예수회에서 쫓겨난 아일랜드 출신 사제 조지 티렐 같은 사람들이다. 반대하는 쪽은 이 흐름을 근대주의(성경과 교리를 역사 연구와 근대 철학에 맞추어 새로 풀려던 가톨릭 학자들의 흐름)라고 불렀다. 1907년 7월 교황청 검사성성(교리를 감독하는 교황청 부서)은 교령 「참으로 슬픈 결과로」에서 65개 명제를 정죄했다. 9월 8일 비오 10세는 회칙(교황이 온 교회의 주교들에게 보내는 공식 편지) 「주님의 양 떼를 먹이는 일」(Pascendi dominici gregis)에서 근대주의를 '모든 이단의 종합'이라고 불렀다. 회칙은 신학교에서 스콜라 철학을 바탕으로 가르치고, 의심스러운 교수를 내보내고, 교구마다 책을 검열하는 사람과 감시 위원회를 두라고 명했다. 루아지는 1908년 파문되었고, 1910년부터 사제와 신학교 교수들은 반근대주의 서약을 해야 했다. 이 서약은 2차 바티칸 공의회가 끝난 뒤인 1967년에 그만두었다.",
    people: ["pius10"], route: ["rome", "paris"],
    source: { text: "이 체계 전체를 한눈에 훑어본 사람이라면, 우리가 이것을 모든 이단의 종합이라고 규정한다 해서 누가 놀라겠는가?", src: "pascendi1907la: 39항" },
    controversy: "modernism",
    evidence: [
      {
        img: "ch-pius10-bain", name: "비오 10세의 사진", madeYear: 1905, madeLabel: "20세기 초",
        where: "미국 의회 도서관(베인 통신사의 유리 원판)", found: "",
        says: "회칙 「주님의 양 떼를 먹이는 일」을 낸 교황 비오 10세다.",
        strength: "context", caveat: "인물 사진이다. 회칙이나 그 문서를 보여 주지는 않는다.",
      },
      {
        img: "ch-loisy-1910", name: "알프레드 루아지의 사진", madeYear: 1910, madeLabel: "1910년 무렵",
        where: "프랑스", found: "",
        says: "근대주의자로 지목되어 1908년 파문된 프랑스 성서학자다.",
        strength: "context", caveat: "인물 사진이다.",
      },
    ],
  },
  {
    id: "edinburgh-1910", title: "에든버러에서 세계 선교 대회가 열리다", short: "에든버러 세계 선교 대회", year: 1910, yearLabel: "1910년 6월 14~23일",
    dateNote: "스코틀랜드 연합 자유교회의 총회 회관(에든버러 뉴 칼리지)에서 열흘 동안 열렸다.",
    era: "missions",
    summary: "개신교 선교 단체 160여 곳이 보낸 대표 1,200여 명이 스코틀랜드 에든버러에 모인다. 의장은 미국의 학생 선교 운동을 이끈 존 모트, 실무 책임자는 조지프 올덤이었다. 대회는 미리 꾸린 여덟 위원회의 보고서를 놓고, 선교지 교회가 스스로 서는 길, 교육, 다른 종교와의 관계, 선교 단체끼리의 협력을 토의했다. 성공회의 고교회파(성공회 안에서 가톨릭 전통의 예배와 주교직을 중시하는 쪽)까지 함께하도록, 교파마다 다른 교리와 교회 제도는 토의에서 뺐다. 동방 정교회와 로마 가톨릭은 오지 않았고, 대표 대부분은 영국과 북미 사람이었다. 아시아와 아프리카에서 온 대표는 스무 명이 채 안 되었고, 조선에서는 윤치호가 왔다. 인도의 아자리아는 서양 선교사들에게 '친구'가 되어 달라고 호소해 회의장을 술렁이게 했다. 대회가 세운 계속 위원회는 1921년 국제 선교 협의회가 되었다. 대회에 왔던 성공회 주교 찰스 브렌트는 교리를 놓고 교회들이 대화하는 신앙과 직제 운동을 일으켰다. 이 운동과 생활과 실천 운동이 1948년 세계교회협의회를 세웠고, 국제 선교 협의회는 1961년 여기에 합쳤다. 그래서 이 대회를 근대 교회 일치 운동의 출발점으로 본다.",
    people: ["mott"], route: ["edinburgh"],
    source: { text: "이 1,200명의 대표는 여러 교파와 160개쯤 되는 선교 단체를 대표한다. 보는 이의 눈에 곧바로 띄는 빈자리는 물론 큰 그리스 교회와 로마 교회다.", src: "gairdner1910: 「The Delegates」 50쪽" },
    controversy: "ecumenism",
    evidence: [{
      img: "ch-edinburgh-1910", name: "세계 선교 대회가 열린 총회 회관", madeYear: 1910, madeLabel: "1910년",
      where: "영국 에든버러 뉴 칼리지 총회 회관", found: "",
      says: "1910년 세계 선교 대회 때 총회 회관과 그 안에 모인 대표들을 찍은 사진이다.",
      strength: "direct", caveat: "사진 한 장으로는 열흘 동안의 회의 가운데 어느 회기인지 알 수 없다.",
    }],
  },
];

export const CH_PEOPLE_6 = [
  { id: "dollinger", name: "이그나츠 폰 되링거", from: 1799, to: 1890, kind: "생애" },
  { id: "underwood", name: "호러스 G. 언더우드", from: 1859, to: 1916, kind: "생애" },
  { id: "appenzeller", name: "헨리 G. 아펜젤러", from: 1858, to: 1902, kind: "생애" },
  { id: "gilseonju", name: "길선주", from: 1869, to: 1935, kind: "생애" },
  { id: "seymour", name: "윌리엄 J. 시모어", from: 1870, to: 1922, kind: "생애" },
  { id: "pius10", name: "비오 10세", from: 1903, to: 1914, kind: "재위" },
  { id: "mott", name: "존 R. 모트", from: 1865, to: 1955, kind: "생애" },
];

// church_events.js의 CH_PLACES와 data.js에 없는 장소만
export const PLACES_CH6 = {
  munich: { name: "뮌헨", at: [11.58, 48.14] },
  bamberg: { name: "밤베르크", at: [10.89, 49.89] },
  nagasaki: { name: "나가사키", at: [129.87, 32.75] },
  namugongo: { name: "나무공고", at: [32.65, 0.39] },
  houston: { name: "휴스턴", at: [-95.37, 29.76] },
  centerville: { name: "센터빌(루이지애나)", at: [-91.43, 29.76] },
  newbrunswick: { name: "뉴브런즈윅(뉴저지)", at: [-74.45, 40.49] },
  atlanticcity: { name: "애틀랜틱시티", at: [-74.42, 39.36] },
  souderton: { name: "사우더턴(펜실베이니아)", at: [-75.33, 40.31] },
  lancasterpa: { name: "랭커스터(펜실베이니아)", at: [-76.31, 40.04] },
  madisonnj: { name: "매디슨(뉴저지)", at: [-74.42, 40.76] },
  eocheongdo: { name: "어청도", at: [125.98, 36.12] },
  anju: { name: "안주", at: [125.66, 39.62] },
  riese: { name: "리에세", at: [11.92, 45.73] },
  mantua: { name: "만토바", at: [10.79, 45.16] },
  livingstonmanor: { name: "리빙스턴 매너(뉴욕주)", at: [-74.83, 41.9] },
  postville: { name: "포스트빌(아이오와)", at: [-91.57, 43.08] },
  ithaca: { name: "이타카(코넬 대학)", at: [-76.5, 42.44] },
  orlando: { name: "올랜도", at: [-81.38, 28.54] },
};

// 증거 사진: 키(img 이름) → 위키미디어 공용 파일 이름. tools/fetch_images.py가 받는다.
export const IMG_CH6 = {
  "ch-vatican1-litho": "File:The oecumenical council of the Vatican, convened December 8th 1869 LCCN2006677480.jpg",
  "ch-antim1": "File:BASA 1318K-1-5908 Antim-I.jpg",
  "ch-st-stephen-istanbul": "File:Bulgarian St. Stephen Church (2020).jpg",
  "ch-underwood-1884": "File:Underwood1884.jpg",
  "ch-namugongo-basilica": "File:Namugongo Martyrs Shrine exterior view.jpg",
  "ch-namugongo-anglican": "File:Uganda Martyrs Namugongo Day, Anglican shrine -2024 37.jpg",
  "ch-azusa-mission": "File:AFM on azusa street.jpg",
  "ch-azusa-leaders": "File:Azusa street group photo.jpg",
  "ch-jangdaehyeon": "File:Jangdaehyun Church.jpg",
  "ch-pius10-bain": "File:Pope Pius X (LCCN2014686818).jpg",
  "ch-loisy-1910": "File:Alfred Loisy.jpg",
  "ch-edinburgh-1910": "File:The 1910 World Missionary Conference, the Edinburgh Missionary Conference.jpg",
  // 프로필의 기록 사진
  "ch-dollinger-hanfstaengl": "File:Ignaz v. Döllinger.jpg",
  "ch-appenzeller-1901": "File:A Modern Pioneer in Korea - Henry Gerhart Appenzeller, 1901.jpg",
  "ch-appenzeller-students": "File:A Modern Pioneer in Korea - Appenzeller and His Students, 1887.jpg",
  "ch-gilseonju": "File:길선주.jpg",
  "ch-seymour": "File:William Joseph Seymour.jpg",
  "ch-mott-1910": "File:John Raleigh Mott, 1910.jpg",
};

// 이 묶음에서 새로 쓴 출처(sources.js에 없는 것만)
export const SRC_V6 = {
  mqr1873: { name: "1872년 콘스탄티노플 공의회 결정문의 영어 번역(『Methodist Quarterly Review』 1873년 1월호, Orthodox History 재수록)", url: "https://www.orthodoxhistory.org/?p=6160", license: "공유" },
  griffis1912: { name: "W. E. Griffis, 『A Modern Pioneer in Korea: The Life Story of Henry G. Appenzeller』(1912)", url: "https://archive.org/details/amodernpioneerin00grifuoft", license: "공유" },
  underwood1918: { name: "L. H. Underwood, 『Underwood of Korea』(1918)", url: "https://archive.org/details/underwoodofkorea00unde", license: "공유" },
  ashe1890: { name: "R. P. Ashe, 『Two Kings of Uganda』(1889년 초판, 1890년 판)", url: "https://archive.org/details/twokingsofuganda00ashe", license: "공유" },
  jones1910: { name: "G. H. Jones & W. A. Noble, 『The Korean Revival: An Account of the Revival in the Korean Churches in 1907』(1910)", url: "https://archive.org/details/koreanrevivalacc00jone", license: "공유" },
  gairdner1910: { name: "W. H. T. Gairdner, 『Echoes from Edinburgh, 1910』(1910)", url: "https://archive.org/details/echoesfromedinbu00gair", license: "공유" },
  pascendi1907la: { name: "비오 10세 회칙 「주님의 양 떼를 먹이는 일」(Pascendi dominici gregis, 1907년 9월 8일, 라틴어 원문)", url: "https://www.vatican.va/content/pius-x/la/encyclicals/documents/hf_p-x_enc_19070908_pascendi-dominici-gregis.html", license: "공유" },
  eb1911: { name: "『Encyclopædia Britannica』 11판(1910~1911)", url: "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica", license: "공유" },
  // 아래는 근거로만 단다. 옮겨 싣지 않는다.
  encykorea: { name: "『한국민족문화대백과사전』(한국학중앙연구원)", url: "https://encykorea.aks.ac.kr/", license: "링크만" },
  robeck2006: { name: "C. M. Robeck Jr., 『The Azusa Street Mission and Revival』(Thomas Nelson, 2006)", url: null, license: "인용만" },
  blair1977: { name: "W. N. Blair & B. Hunt, 『The Korean Pentecost and the Sufferings Which Followed』(Banner of Truth, 1977)", url: null, license: "인용만" },
  hopkins1979: { name: "C. H. Hopkins, 『John R. Mott, 1865–1955: A Biography』(Eerdmans, 1979)", url: null, license: "인용만" },
  bdcm: { name: "G. H. Anderson 편, 『Biographical Dictionary of Christian Missions』(1998) 온라인판(보스턴 대학 선교학 자료)", url: "https://www.bu.edu/missiology/missionary-biography/", license: "링크만" },
  nobelmott: { name: "노벨 재단, 「John R. Mott – Biographical」(1946년 평화상)", url: "https://www.nobelprize.org/prizes/peace/1946/mott/biographical/", license: "링크만" },
};
