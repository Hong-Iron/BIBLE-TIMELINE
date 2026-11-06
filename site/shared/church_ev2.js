// 교회사 사건·인물·장소 묶음 2(451~1204년). 형식은 church_events.js 맨 위에 있다.

// 증거의 kind: "place"는 사건 장소를 오늘 찍은 사진이다(madeYear 없음).
const place = (img, name, where, says, caveat) => ({
  img, kind: "place", name, madeLabel: "오늘의 모습", where, found: "", says, strength: "context",
  caveat: caveat ?? "장소 사진이다. 사건을 직접 보여 주지는 않는다.",
});

export const CH_EVENTS_2 = [
  {
    id: "hagiasophia-537", title: "유스티니아누스가 하기아 소피아를 봉헌하다", short: "하기아 소피아", year: 537, yearLabel: "기원후 537년",
    dateNote: "537년 12월 27일에 봉헌했다. 첫 둥근 지붕(돔)은 558년 지진으로 무너져 562년에 다시 얹고 봉헌했다.", era: "byzantine",
    summary: "니카 반란(532년) 때 불탄 자리에 황제 유스티니아누스가 5년 만에 거대한 둥근 지붕을 얹은 '거룩한 지혜(하기아 소피아)'의 교회를 지어 봉헌한다. 이후 900년 넘게 콘스탄티노플 총대주교의 교회이자 동방 정교회 예배의 중심이 되었다.",
    people: ["justinian"], route: ["constantinople"],
    source: { text: "둥근 지붕은 단단한 바탕 위에 놓인 것 같지 않고, 하늘에서 금 사슬로 매달아 아래를 덮은 듯 보인다.", src: "lethaby1894: 프로코피오스 『건축에 대하여』 1권 1장" },
    evidence: [{
      img: "hagiasophia", name: "하기아 소피아", madeYear: 537, madeLabel: "537년(둥근 지붕은 562년에 다시 얹음)",
      where: "튀르키예 이스탄불", found: "처음 지은 건물이 그대로 서 있다",
      says: "유스티니아누스가 지은 건물이 거의 그대로 남아 있다. 그 뒤 천 년 가까이 세계에서 가장 큰 성당이었다.",
      strength: "direct",
      caveat: "네 개의 첨탑(미너렛)과 바깥 버팀벽은 1453년 오스만 제국이 모스크로 바꾼 뒤 더한 것이다. 1934년 박물관이 되었고 2020년 다시 모스크가 되었다.",
    }],
  },
  {
    id: "canterbury-597", title: "그레고리우스 1세가 보낸 아우구스티누스가 잉글랜드 켄트에 닿다", short: "켄트 선교", year: 597, yearLabel: "기원후 597년",
    dateNote: "596년 로마를 떠나 597년 봄 켄트의 서넷섬에 내렸다.", era: "byzantine",
    summary: "로마 주교 그레고리우스 1세가 수도사 아우구스티누스와 동료 40명 가까이를 앵글로색슨 사람들에게 보낸다. 켄트 왕 에설버트가 이들을 받아들였고, 캔터베리가 잉글랜드 교회의 중심이 되었다. 로마 주교가 먼 곳의 선교를 직접 이끈 이 일은 서방에서 교황의 권위가 커지는 바탕이 되었다.",
    people: ["gregory1"], route: ["rome", "canterbury"],
    source: { text: "주님의 종 아우구스티누스와 그 동료들이 이 섬에 내렸으니, 전하는 바로는 마흔 명 가까이 되었다.", src: "bedejane: 베다 『잉글랜드 교회사』 1권 25장" },
    evidence: [{
      img: "augustinegospels", name: "성 아우구스티누스 복음서의 누가 그림", madeYear: 590, madeLabel: "6세기 후반",
      where: "영국 케임브리지 코퍼스 크리스티 칼리지(MS 286)", found: "중세 내내 캔터베리의 성 아우구스티누스 수도원에 전해 옴",
      says: "6세기 이탈리아에서 쓴 라틴어 복음서다. 그레고리우스가 보낸 선교단이 가져온 책으로 전해 오며, 지금도 캔터베리 대주교 취임식에 쓰인다.",
      strength: "indirect",
      caveat: "선교단이 직접 가져왔다는 것은 전승이다. 6세기 이탈리아에서 만든 책이라는 점은 학자들이 대체로 받아들인다.",
    }],
  },
  {
    id: "constantinople-553", title: "제2차 콘스탄티노플 공의회가 '세 장'을 정죄하다", short: "제2차 콘스탄티노플", year: 553, yearLabel: "기원후 553년",
    dateNote: "5월 5일~6월 2일. 교황 비길리우스는 참석을 거부했다가 이듬해 결정을 받아들였다.", era: "byzantine",
    summary: "유스티니아누스가 칼케돈 공의회를 거부한 쪽(오리엔트 정교회)과 화해하려고, 그들이 문제 삼던 안디옥 신학자 세 사람의 글('세 장')을 정죄하게 한다. 칼케돈을 받아들인 교회들은 이 공의회를 다섯째 세계 공의회로 받아들였지만, 오리엔트 정교회와의 갈라짐은 메워지지 않았다.",
    people: ["justinian"], route: ["constantinople"], controversy: "three-chapters",
    source: { text: "우리는 몹수에스티아의 주교였던 테오도로스와 그의 불경한 글들을 정죄하고 파문한다.", src: "councils: 제2차 콘스탄티노플 공의회 '공의회의 판결'" },
    evidence: [
      {
        img: "justinianmosaic", name: "산 비탈레 성당의 유스티니아누스 모자이크", madeYear: 547, madeLabel: "547년경",
        where: "이탈리아 라벤나 산 비탈레 성당", found: "처음 꾸민 자리에 그대로 있다",
        says: "황제 유스티니아누스가 주교 막시미아누스, 신하와 군인들과 함께 성찬에 쓸 빵 그릇을 받쳐 든 모습이다. 황제가 교회 일을 이끄는 사람으로 그려졌다.",
        strength: "context",
        caveat: "유스티니아누스는 라벤나에 간 적이 없다. 공의회와 직접 관련된 그림이 아니라, 그때 황제가 교회 안에서 어떤 자리에 있었는지 보여 준다.",
      },
      {
        img: "council5fresco", name: "페라폰토프 수도원 벽화의 제2차 콘스탄티노플 공의회", madeYear: 1502, madeLabel: "1502년",
        where: "러시아 볼로그다주 페라폰토프 수도원", found: "화가 디오니시가 그린 벽화",
        says: "러시아 정교회 수도원 벽에 그린 공의회 그림이다. 동방 정교회가 이 공의회를 세계 공의회로 기념해 왔음을 보여 준다.",
        strength: "context", caveat: "공의회보다 950년쯤 뒤의 그림이다.",
      },
    ],
  },
  {
    id: "constantinople-681", title: "제3차 콘스탄티노플 공의회가 그리스도의 두 의지를 정하다", short: "제3차 콘스탄티노플", year: 681, yearLabel: "기원후 680~681년",
    dateNote: "680년 11월 7일에 시작해 681년 9월 16일에 마쳤다. 황궁의 둥근 지붕 방(트룰로스)에서 모였다.", era: "byzantine",
    summary: "그리스도에게 의지가 하나뿐이라는 주장(단의론)을 둘러싼 오랜 다툼을 끝내려고 황제 콘스탄티누스 4세가 공의회를 연다. 공의회는 그리스도에게 신적 의지와 인간적 의지 둘이 있고, 인간 의지는 신적 의지에 맞서지 않고 따른다고 정했다. 이 생각을 지키다 혀와 오른손을 잘리고 유배지에서 죽은 막시무스의 가르침이 이렇게 인정받았다. 칼케돈을 받아들인 교회들이 여섯째 세계 공의회로 받아들인다.",
    people: ["maximus"], route: ["constantinople"], controversy: "monothelitism",
    source: { text: "그리스도 안에는 두 본성적 의지와 두 본성적 활동이 있다. 이 두 의지는 서로 맞서지 않는다.", src: "councils: 제3차 콘스탄티노플 공의회 신앙 정의" },
    evidence: [{
      img: "council6fresco", name: "페라폰토프 수도원 벽화의 제3차 콘스탄티노플 공의회", madeYear: 1502, madeLabel: "1502년",
      where: "러시아 볼로그다주 페라폰토프 수도원", found: "화가 디오니시가 그린 벽화",
      says: "황제와 주교들이 둘러앉은 공의회를 그린 러시아 정교회의 벽화다.",
      strength: "context", caveat: "공의회보다 800년쯤 뒤의 그림이다.",
    }],
  },
  {
    id: "iconoclasm-726", title: "레오 3세가 성상 공경을 막기 시작하다", short: "성상 파괴 시작", year: 726, yearLabel: "기원후 726년경",
    dateNote: "726년 또는 730년에 시작했다고 전한다. 황제가 처음에 무엇을 했는지는 뒤의 성상 옹호파 기록에 기대고 있어 학자마다 다르게 본다.", era: "byzantine",
    summary: "동로마 황제 레오 3세가 그리스도와 성인들을 그린 그림(성상, 이콘)을 공경하는 일을 막기 시작한다. 이슬람 칼리프국 땅에 살던 다마스쿠스의 요한이 이에 맞서 성상을 변호하는 글을 쓴다. 성상 논쟁은 843년까지 100년 넘게 이어진다.",
    people: ["leoisaurian", "johndamascene"], route: ["constantinople", "damascus"], controversy: "iconoclasm",
    source: { text: "나는 물질을 경배하지 않는다. 나를 위해 물질이 되신, 물질의 하나님을 경배한다.", src: "allies1898: 다마스쿠스의 요한 『성화상에 대하여』 1부" },
    evidence: [
      {
        img: "hagiairene", name: "하기아 이레네 교회 앞쪽 반원 벽의 십자가 모자이크", madeYear: 753, madeLabel: "8세기 중엽(740년 지진 뒤 다시 지을 때)",
        where: "튀르키예 이스탄불", found: "건물이 그대로 서 있다",
        says: "사람 그림 대신 커다란 십자가 하나만 그렸다. 성상 파괴 시기에 교회 장식이 어떻게 바뀌었는지 보여 주는 드문 예다.",
        strength: "indirect", caveat: "정확히 언제 만들었는지는 학자마다 조금씩 다르게 본다.",
      },
      {
        img: "leo3solidus", name: "레오 3세의 금화(솔리두스)", madeYear: 725, madeLabel: "724~731년경",
        where: "고전 주화 경매 기록(CNG)", found: "",
        says: "레오 3세가 찍은 금화로, 황제의 얼굴을 새겼다.",
        strength: "context", caveat: "동전 자체는 성상 정책을 말하지 않는다. 그때 다스린 황제를 보여 줄 뿐이다.",
      },
    ],
  },
  {
    id: "xian-stele-781", title: "장안에 동방 교회의 '대진경교유행중국비'를 세우다", short: "경교 비석", year: 781, yearLabel: "기원후 781년",
    dateNote: "비문에 당나라 건중 2년(781년)이라 적혀 있다. 1625년 무렵 땅속에서 다시 나왔다.", era: "byzantine",
    summary: "페르시아에 중심을 둔 동방 교회의 선교사들이 당나라 수도 장안에 세운 비석이다. 635년 아라본(Olopun)이 경전을 가지고 와 황제의 허락을 받은 뒤 150년 동안 교회가 퍼진 과정을 한문과 시리아어로 새겼다. 장안은 이 지도 밖에 있어서, 지도에는 동방 교회의 총대주교(가톨리코스)가 있던 셀레우키아-크테시폰을 보인다.",
    people: [], route: ["ctesiphon"],
    source: { text: "대진국에 아라본이라는 지극히 덕 높은 사람이 있었다. 그는 푸른 구름을 길잡이 삼아 참된 경전을 가지고 왔다.", src: "legge1888: 비문 2부 7절" },
    evidence: [{
      img: "xianstele", name: "대진경교유행중국비", madeYear: 781, madeLabel: "781년",
      where: "중국 시안 비림박물관", found: "1625년 무렵 시안 근처에서 발굴",
      says: "꼭대기에 연꽃과 구름 위의 십자가를 새기고 '대진경교유행중국비(대진에서 온 빛나는 가르침이 중국에 퍼진 일을 새긴 비)'라는 제목을 달았다. 본문은 한문이고, 아래와 옆에 시리아어로 성직자 이름을 적었다. 동방 교회가 7~8세기 중국에 있었다는 가장 분명한 증거다.",
      strength: "direct",
      caveat: "서양에서는 흔히 '네스토리우스파 비석'이라 부르지만, 이 교회는 스스로를 '동방 교회'라 불렀다. 비문의 신학 용어에는 불교·도교 낱말이 많이 섞여 있다.",
    }],
  },
  {
    id: "nicaea-787", title: "제2차 니케아 공의회가 성상 공경을 다시 세우다", short: "제2차 니케아", year: 787, yearLabel: "기원후 787년",
    dateNote: "9월 24일~10월 13일. 786년 콘스탄티노플에서 처음 모였다가 성상 파괴파 군인들에게 해산당하고, 이듬해 니케아에서 다시 모였다.", era: "byzantine",
    summary: "황후 이레네가 소집한 공의회가 성상 파괴를 정죄하고 성상 공경을 다시 허락한다. 공의회는 성상에 바치는 '공경'과 하나님께만 드리는 '예배'를 나누었다. 동방 정교회와 로마 가톨릭은 이를 일곱째 세계 공의회로 받아들이지만, 당시 프랑크 왕국의 교회는 이 결정을 받아들이지 않았다.",
    people: [], route: ["nicaea"], controversy: "iconoclasm",
    source: { text: "존귀하고 거룩한 성상을 하나님의 거룩한 교회와 거룩한 그릇과 옷, 집과 길가에 두어야 한다.", src: "councils: 제2차 니케아 공의회 신앙 정의" },
    evidence: [
      place("iznik", "니케아(이즈니크)의 하기아 소피아", "튀르키예 이즈니크",
        "제2차 니케아 공의회가 모인 교회로 전해 오는 건물이다. 오스만 시대에 모스크가 되었고, 지금도 모스크다.",
        "건물은 여러 번 고쳐 지었다. 787년 공의회가 정확히 이 건물에서 모였다는 것은 전승이다."),
      {
        img: "sinaichrist", name: "시나이 성 카타리나 수도원의 그리스도 판토크라토르 이콘", madeYear: 550, madeLabel: "6세기",
        where: "이집트 시나이 성 카타리나 수도원", found: "수도원에 처음부터 전해 옴",
        says: "남아 있는 가장 오래된 그리스도 이콘 가운데 하나다. 시나이는 이슬람 칼리프국 땅이라 동로마의 성상 파괴가 미치지 않아 살아남았다. 공의회가 지키려 한 이콘이 어떤 것이었는지 보여 준다.",
        strength: "context", caveat: "공의회와 직접 관련된 유물은 아니다.",
      },
    ],
  },
  {
    id: "charlemagne-800", title: "교황 레오 3세가 카롤루스(샤를마뉴)에게 황제관을 씌우다", short: "카롤루스 대관", year: 800, yearLabel: "기원후 800년",
    dateNote: "800년 12월 25일, 로마의 성 베드로 성당.", era: "byzantine",
    summary: "프랑크 왕 카롤루스가 성탄절 미사 중에 교황 레오 3세에게서 로마 황제의 관을 받는다. 서방에 콘스탄티노플 황제와 따로 선 '황제'가 생기면서 동방과 서방의 교회도 정치적으로 더 멀어졌다. 신경에 '그리고 아들에게서(필리오케)'를 넣는 일도 카롤루스의 궁정에서 힘을 얻었다.",
    people: ["charlemagne"], route: ["rome", "aachen"],
    source: { text: "그는 교황의 뜻을 미리 알았더라면, 그날이 큰 축일이었어도 교회에 발을 들여놓지 않았을 것이라고 말했다.", src: "einhard: 아인하르트 『카롤루스 대제의 생애』 28장" },
    evidence: [
      {
        img: "karolusdenier", name: "카롤루스의 은화(드니에)", madeYear: 812, madeLabel: "812~814년",
        where: "프랑스 국립도서관(BnF) 화폐 소장품", found: "",
        says: "월계관을 쓴 카롤루스의 얼굴과 'KAROLVS IMP AVG(황제 아우구스투스 카롤루스)'라는 글자를 새겼다. 그가 로마 황제의 칭호를 썼음을 보여 준다.",
        strength: "direct", caveat: "마인츠에서 찍은 것으로 보는 동전이다.",
      },
      {
        img: "aachen", name: "아헨 궁정 예배당의 팔각 둥근 지붕", madeYear: 800, madeLabel: "796~805년경",
        where: "독일 아헨 대성당", found: "처음 지은 건물이 대성당 안에 남아 있다",
        says: "카롤루스가 아헨에 지은 예배당이다. 라벤나의 산 비탈레처럼 팔각형으로 지어 동로마 황제의 교회를 본떴다. 그는 이곳에 묻혔다.",
        strength: "indirect", caveat: "둥근 지붕의 모자이크는 19세기에 다시 만든 것이다.",
      },
    ],
  },
  {
    id: "triumph-843", title: "성상 공경이 다시 세워지다('정교의 승리')", short: "정교의 승리", year: 843, yearLabel: "기원후 843년",
    dateNote: "보통 843년 3월 11일로 본다. 샤프는 842년 2월 19일로 적었다.", era: "byzantine",
    summary: "성상 파괴 황제 테오필로스가 죽은 뒤, 섭정 황후 테오도라와 새 총대주교 메토디오스가 성상 공경을 다시 세운다. 콘스탄티노플 회의는 일곱 세계 공의회의 결정을 다시 확인하고 성상 파괴파를 파문했다. 동방 정교회는 지금도 사순절 첫 주일을 '정교의 주일'로 지키며 이날을 기념한다.",
    people: [], route: ["constantinople"], controversy: "iconoclasm",
    source: { text: "성상에 바치는 공경은 그 성상이 나타내는 분께로 건너간다.", src: "councils: 제2차 니케아 공의회 신앙 정의(843년 회의가 다시 확인)" },
    evidence: [
      {
        img: "triumphicon", name: "'정교의 승리' 이콘", madeYear: 1400, madeLabel: "1400년경",
        where: "대영박물관(런던)", found: "",
        says: "843년의 일을 그린 이콘이다. 가운데에 성모 이콘을 높이 든 사람들이 있고, 양옆에 황후 테오도라와 어린 황제 미카엘 3세, 총대주교 메토디오스가 섰다. 아래 줄에는 성상을 지키다 고난받은 성인들이 이콘을 들고 있다.",
        strength: "context", caveat: "사건보다 550년쯤 뒤의 그림이다.",
      },
      {
        img: "chludov", name: "흘루도프 시편의 성상 파괴자 그림", madeYear: 860, madeLabel: "850~875년경",
        where: "러시아 모스크바 국립역사박물관(MS. D.129)", found: "",
        says: "시편 여백에 위쪽은 십자가의 그리스도에게 해면을 내미는 군인을, 아래쪽은 장대 끝 해면으로 그리스도 그림을 덧칠해 지우는 사람들을 나란히 그렸다. 성상 파괴를 그리스도를 괴롭힌 일에 빗댄, 성상 옹호파의 그림이다.",
        strength: "indirect", caveat: "한쪽 편의 시각이다. 아래쪽 인물을 성상 파괴파 총대주교 요한 문법가로 보는 학자가 많다.",
      },
    ],
  },
  {
    id: "photius-867", title: "포티오스가 서방의 필리오케를 비판하고 교황을 파면하다", short: "포티오스 분열", year: 867, yearLabel: "기원후 867년",
    dateNote: "교황 니콜라우스 1세가 863년 포티오스를 파면한다고 선언했고, 867년 콘스탄티노플 회의가 거꾸로 교황을 파면했다. 같은 해 황제가 바뀌면서 포티오스도 물러났다.", era: "eastwest",
    summary: "콘스탄티노플 총대주교 포티오스가 동방의 총대주교들에게 보낸 편지에서, 서방 교회가 니케아 신경에 '그리고 아들에게서(필리오케)'를 더한 일을 비롯해 여러 관습을 비판한다. 불가리아 선교를 두고 로마와 콘스탄티노플이 다투던 때였다. 이 다툼은 879~880년 회의로 일단 화해했지만, 필리오케 문제는 그 뒤 동서가 갈라지는 중심 쟁점으로 남았다.",
    people: ["photius"], route: ["constantinople", "rome"], controversy: "filioque",
    source: { text: "그는 서방 교회 전체를 이단과 분열로 고발했는데, 무엇보다 니케아 신경에 필리오케를 넣어 거룩한 삼위일체에 근원을 둘로 들여왔다는 것이었다.", src: "schaffhcc: 4권 §70(포티오스의 회람 편지를 요약한 대목)" },
    evidence: [{
      img: "photius", name: "마드리드 스킬리체스 사본의 총대주교 포티오스", madeYear: 1150, madeLabel: "12세기",
      where: "스페인 국립도서관(마드리드)", found: "",
      says: "요안니스 스킬리체스가 쓴 동로마 역사책을 그림으로 꾸민 사본에 그린 포티오스다.",
      strength: "context", caveat: "포티오스보다 300년쯤 뒤에 그린 그림이다. 사본의 연대는 12세기로 보는 학자가 많다.",
    }],
  },
  {
    id: "schism-1054", title: "교황 사절이 하기아 소피아 제단에 파문장을 놓다", short: "동서 분열", year: 1054, yearLabel: "기원후 1054년",
    dateNote: "7월 16일. 사절을 보낸 레오 9세는 그해 4월에 이미 죽어, 사절의 권한이 유효했는지 의견이 갈린다. 1965년 교황 바오로 6세와 총대주교 아테나고라스 1세가 서로의 파문을 거두었다.", era: "eastwest",
    summary: "교황 레오 9세가 보낸 훔베르투스 추기경 일행이 콘스탄티노플 총대주교 미카엘 케룰라리오스를 파문하는 글을 하기아 소피아 제단에 놓고 떠난다. 케룰라리오스도 회의를 열어 사절들을 파문한다. 그때는 여러 다툼 가운데 하나로 보였지만, 뒤에 동방 정교회와 로마 가톨릭이 갈라진 해로 기억되었다. 실제로 갈라진 때를 1204년 콘스탄티노플 약탈까지 길게 보는 학자도 많다.",
    people: ["humbert", "cerularius"], route: ["rome", "constantinople"], controversy: "schism-1054",
    source: { text: "하나님께서 보시고 심판하시기를.", src: "schaffhcc: 4권 §71(사절들이 남긴 라틴어 원문에서 옮김)" },
    evidence: [place("hagiasophiain", "하기아 소피아 안", "튀르키예 이스탄불",
      "1054년 7월 16일 예배 시간에 사절들이 파문장을 놓은 제단이 있던 성당이다.",
      "지금 모습은 오스만 시대에 모스크로 바꾼 뒤의 것이다. 1054년의 제단은 남아 있지 않다.")],
  },
  {
    id: "crusade-1095", title: "우르바누스 2세가 클레르몽에서 십자군을 부르다", short: "1차 십자군", year: 1095, yearLabel: "기원후 1095년",
    dateNote: "11월 27일, 클레르몽 공의회 끝 무렵.", era: "eastwest",
    summary: "동로마 황제 알렉시오스 1세가 셀주크 튀르크에 맞설 도움을 청하자, 교황 우르바누스 2세가 서방 기사들에게 동방의 그리스도인을 돕고 예루살렘으로 가라고 호소한다. 1099년 십자군은 예루살렘을 점령하며 무슬림과 유대인 주민을 많이 죽였다. 십자군을 신앙의 순례이자 방어 전쟁으로 보는 쪽과, 폭력을 키우고 동방 그리스도인들의 고통까지 늘린 원정으로 보는 쪽이 오늘날에도 갈린다.",
    people: ["urban2"], route: ["clermont", "constantinople", "jerusalem"],
    source: { text: "모인 사람들이 '하나님이 원하신다!' 하고 외치자, 교황은 '그것을 싸움터의 함성으로 삼으라. 하나님이 너희에게 주신 말이다' 하였다.", src: "robinson1904: 로베르 수도사가 전한 우르바누스 2세의 연설" },
    evidence: [{
      img: "clermont", name: "『바다 건너 원정기』 사본의 클레르몽 공의회 그림", madeYear: 1474, madeLabel: "1474년경",
      where: "프랑스 국립도서관(BnF, Fr. 5594)", found: "",
      says: "세바스티앵 마므로가 쓴 『바다 건너 원정기』 사본에 장 콜롱브가 그린 그림이다. 클레르몽에서 십자군을 호소하는 우르바누스 2세를 그렸다.",
      strength: "context", caveat: "사건보다 약 380년 뒤의 그림이다. 건물과 옷은 15세기 프랑스 모습이다.",
    }],
  },
  {
    id: "sack-1204", title: "4차 십자군이 콘스탄티노플을 약탈하다", short: "콘스탄티노플 약탈", year: 1204, yearLabel: "기원후 1204년",
    dateNote: "4월 12~15일.", era: "eastwest",
    summary: "이집트로 가려던 4차 십자군이 베네치아에 진 빚과 동로마 황위 다툼에 얽혀 같은 그리스도인의 도시 콘스탄티노플을 점령하고 사흘 동안 약탈한다. 교회와 수도원의 보물과 성물이 서방으로 실려 갔고, 라틴 제국과 라틴 총대주교가 세워졌다. 교황 인노켄티우스 3세는 공격을 막으려 했고 약탈을 뒤에 꾸짖었다. 동방 정교회에는 1054년보다 이 일이 갈라짐을 굳힌 사건으로 기억되며, 2001년 교황 요한 바오로 2세가 아테네에서 이 일을 사과했다.",
    people: ["innocent3"], route: ["venice", "constantinople"], controversy: "schism-1054",
    source: { text: "대성당이 더럽혀진 일은 차마 담담히 들을 수 없다. 거룩한 제단은 부서져 군인들에게 나뉘었다.", src: "munro1912: 니케타스 코니아테스, 콘스탄티노플 약탈 대목" },
    evidence: [{
      img: "smhorses", name: "산 마르코의 청동 말 네 마리", madeYear: 200, madeLabel: "고대(기원전 4세기~기원후 4세기 사이로 의견이 갈림)",
      where: "이탈리아 베네치아 산 마르코 대성당 박물관", found: "1204년 콘스탄티노플 경마장에서 실어 옴",
      says: "콘스탄티노플 경마장에 있던 청동 말들이다. 1204년 약탈 때 베네치아로 실려 가 산 마르코 대성당 정면에 놓였다. 진품은 지금 성당 박물관 안에 있다.",
      strength: "direct", caveat: "말을 언제 어디서 만들었는지는 알 수 없다. 성당 정면에 있는 것은 복제품이다.",
    }],
  },
];

export const CH_PEOPLE_2 = [
  { id: "justinian", name: "유스티니아누스 1세", from: 527, to: 565, kind: "재위" },
  { id: "severus", name: "안디옥의 세베루스", from: 465, to: 538, kind: "생애" },
  { id: "gregory1", name: "그레고리우스 1세", from: 540, to: 604, kind: "생애" },
  { id: "maximus", name: "고백자 막시무스", from: 580, to: 662, kind: "생애" },
  { id: "johndamascene", name: "다마스쿠스의 요한", from: 675, to: 749, kind: "생애" },
  { id: "leoisaurian", name: "레오 3세(동로마)", from: 717, to: 741, kind: "재위" },
  { id: "charlemagne", name: "카롤루스 대제(샤를마뉴)", from: 768, to: 814, kind: "재위" },
  { id: "paschasius", name: "파스카시우스 라드베르투스", from: 790, to: 865, kind: "생애" },
  { id: "ratramnus", name: "코르비의 라트람누스", from: 800, to: 870, kind: "생애" },
  { id: "gottschalk", name: "오르배의 고트샬크", from: 808, to: 868, kind: "생애" },
  { id: "photius", name: "포티오스", from: 810, to: 891, kind: "생애" },
  { id: "berengar", name: "투르의 베렝가리우스", from: 999, to: 1088, kind: "생애" },
  { id: "cerularius", name: "미카엘 케룰라리오스", from: 1000, to: 1059, kind: "생애" },
  { id: "humbert", name: "실바 칸디다의 훔베르투스", from: 1000, to: 1061, kind: "생애" },
  { id: "anselm", name: "캔터베리의 안셀무스", from: 1033, to: 1109, kind: "생애" },
  { id: "abelard", name: "피에르 아벨라르", from: 1079, to: 1142, kind: "생애" },
  { id: "urban2", name: "우르바누스 2세", from: 1088, to: 1099, kind: "재위" },
  { id: "bernard", name: "클레르보의 베르나르두스", from: 1090, to: 1153, kind: "생애" },
];

// church_events.js의 CH_PLACES에 없는 장소만
const P = (name, lon, lat) => ({ name, at: [lon, lat] });
export const PLACES_CH2 = {
  venice: P("베네치아", 12.34, 45.44),
  lazica: P("라지카(오늘날 조지아 서부)", 41.67, 42.2),
  marsaba: P("마르 사바 수도원", 35.33, 31.71),
  aosta: P("아오스타", 7.32, 45.74),
  bec: P("르 베크 수도원", 0.72, 49.23),
  clairvaux: P("클레르보", 4.78, 48.15),
  // 아래는 인물 프로필의 지도에만 쓴다.
  corbie: P("코르비 수도원", 2.51, 49.91),
  fulda: P("풀다 수도원", 9.68, 50.55),
  orbais: P("오르배 수도원", 3.69, 48.96),
  soissons: P("수아송", 3.32, 49.38),
  tours: P("투르", 0.69, 47.39),
  sens: P("상스", 3.28, 48.2),
};

// 증거 사진: 키(img 이름) → 위키미디어 공용 파일 이름. tools/fetch_images.py가 받는다.
export const IMG_CH2 = {
  hagiasophia: "File:Hagia Sophia Mars 2013.jpg",
  hagiasophiain: "File:Hagia Sophia Interior Panorama.jpg",
  augustinegospels: "File:Luke St Augustine's Gospels Corpus Christi Cambridge MS 286.jpeg",
  justinianmosaic: "File:Justinian mosaic, San Vitale, consecrated 547, Ravenna, Italy.jpg",
  council5fresco: "File:EcumenicalCouncil 5th 11-22.jpg",
  council6fresco: "File:EcumenicalCouncil 6th 07-07.jpg",
  hagiairene: "File:Istanbul Hagia Eirene Apse in 2016 08 0990.jpg",
  leo3solidus: "File:Solidus of Leo III sb1504.png",
  xianstele: "File:Nestorian stele 1.jpg",
  iznik: "File:Iznik Hagia Sophia Mosque 8350.jpg",
  sinaichrist: "File:Christ Icon Sinai 6th century.jpg",
  karolusdenier: "File:Charlemagne denier Mayence 812 814.jpg",
  aachen: "File:Aachen Kaiserdom Innen Kuppel 1.JPG",
  triumphicon: "File:Triumph orthodoxy.jpg",
  chludov: "File:Crucifixion with iconoclasts, Chludov Psalter, folio 67r.jpg",
  photius: "File:Patriarch Photius, Madrid Skylitzes.jpg",
  clermont: "File:Passages d'outremer Fr5594, fol. 19r, Concile de Clermont.jpg",
  smhorses: "File:Horses of Basilica San Marco bright.jpg",
  maximusicon: "File:Athonite Fresco Icon of Saint Maximos the Confessor.jpg",
  damasceneicon: "File:Athonite Fresco Icon of Saint John of Damascus 2.jpg",
};

// 이 묶음에서 새로 쓴 출처(sources.js에 없는 것만). 모두 열어서 번역자와 해를 확인했다.
export const SRC_V2 = {
  lethaby1894: { name: "W. Lethaby & H. Swainson 번역, 프로코피오스 『건축에 대하여』(『The Church of Sancta Sophia』, 1894)", url: "https://sourcebooks.fordham.edu/source/procop-deaed1.asp", license: "공유" },
  bedejane: { name: "베다 『잉글랜드 교회사』(L. C. Jane 번역으로 보이는 1903년판, Medieval Sourcebook)", url: "https://sourcebooks.fordham.edu/basis/bede-book1.asp", license: "공유" },
  allies1898: { name: "다마스쿠스의 요한 『성화상에 대하여』(M. H. Allies 번역, 1898)", url: "https://sourcebooks.fordham.edu/basis/johndamascus-images.asp", license: "공유" },
  legge1888: { name: "J. Legge, 『The Nestorian Monument of Hsî-an Fû』(1888)", url: "https://archive.org/details/nestorianmonumen00legg", license: "공유" },
  einhard: { name: "아인하르트 『카롤루스 대제의 생애』(S. E. Turner 번역, 1880)", url: "https://sourcebooks.fordham.edu/basis/einhard.asp", license: "공유" },
  robinson1904: { name: "J. H. Robinson 편, 『Readings in European History』(1904)의 우르바누스 2세 연설(로베르 수도사판)", url: "https://sourcebooks.fordham.edu/source/urban2a.asp", license: "공유" },
  munro1912: { name: "D. C. Munro 번역, 니케타스 코니아테스의 콘스탄티노플 약탈 기록(『Translations and Reprints』 3권 1호, 1912)", url: "https://sourcebooks.fordham.edu/source/choniates1.asp", license: "공유" },
  // 아래는 인물 프로필(profiles_c2.js)에서 쓴다. 옮겨 싣지 않고 근거로만 단다.
  ocasaints: { name: "미국 정교회(OCA) 누리집의 축일별 성인 전기", url: "https://www.oca.org/saints/lives", license: "링크만" },
  benedict16: { name: "베네딕토 16세 수요 일반 알현 교리 교육(2008~2009년, 교부와 중세 신학자 연속 강론)", url: "https://www.vatican.va/content/benedict-xvi/en/audiences.index.html", license: "링크만" },
  dvornik1948: { name: "F. Dvornik, 『The Photian Schism: History and Legend』(Cambridge UP, 1948)", url: null, license: "인용만" },
  brock1973: { name: "S. Brock, 「An Early Syriac Life of Maximus the Confessor」, 『Analecta Bollandiana』 91(1973)", url: null, license: "인용만" },
  chambesy1990: { name: "동방 정교회·오리엔트 정교회 신학 대화 합동위원회 「제2 합의문」(스위스 샹베지, 1990)", url: null, license: "인용만" },
};
