// 교회사 논쟁 묶음 k6(1962~2026년). 형식은 controversies.js 맨 위에 있다.
// 민감한 최근 논쟁이다. 어느 쪽도 정답으로 고르지 않고, 교회마다 공식 문서·회의 결정에 적힌 입장만 날짜와 출처를 달아 나란히 적는다.
export const CONTROVERSIES_6 = [
  {
    id: "vatican2",
    title: "제2차 바티칸 공의회와 그 해석",
    aliases: ["Second Vatican Council", "Vaticanum II", "Hermeneutic of reform", "Society of Saint Pius X"],
    from: 1962, to: 2026, era: "worldwars", themes: ["church", "scripture"],
    question: "1962~1965년 공의회가 바꾼 전례(자국어 미사), 종교 자유, 다른 교회와의 일치 운동은 이전 가르침을 이어 새롭게 한 개혁인가, 이전 가르침과 끊어진 변화인가.",
    summary: "교황 요한 23세는 교회를 오늘에 맞게 새롭게 하자며(아조르나멘토) 1962년 10월 11일 공의회를 열었고, 바오로 6세가 1965년 12월 8일 닫았다. 공의회는 미사를 각 나라 말로 드릴 수 있게 했고(「전례 헌장」, 1963), 다른 그리스도인을 '갈라진 형제'로 부르며 대화를 열었고(「일치 교령」, 1964), 국가가 종교를 강제하지 말아야 한다고 선언했다(「종교 자유에 관한 선언」, 1965). 마르셀 르페브르 대주교는 이 가운데 일부가 이전 교황들의 가르침과 어긋난다고 보고 성 비오 10세회를 이끌었다. 1988년과 2026년 이 단체가 교황의 허락 없이 주교를 세우자 교황청은 두 번 모두 파문을 선언했다.",
    sides: [
      {
        name: "연속 속의 개혁으로 읽는 쪽",
        people: ["paul6", "johnpaul2", "ratzinger"],
        claim: "공의회는 같은 교회가 같은 신앙을 지키면서 표현과 제도를 새롭게 한 일이다. 문헌은 그 이전의 공의회·교황 가르침과 함께 읽어야 한다. 바뀐 부분이 있어도 교회라는 하나의 주체는 끊어지지 않았다. 베네딕토 16세는 이 읽기를 '개혁의 해석'이라 불렀다.",
        refs: ["마 13:52", "히 13:8"],
      },
      {
        name: "새 출발의 사건으로 읽는 쪽",
        people: ["john23"],
        claim: "공의회는 문헌 몇 줄보다 큰 사건이었다. 교회가 법률 문체를 버리고 세상과 대화하는 말투로 바꾸었고, 시대의 표징을 읽으라고 했다. 그래서 문헌의 글자보다 공의회가 연 방향(공의회의 정신)을 따라 개혁을 계속해야 한다.",
        refs: ["마 16:3", "행 15:28"],
      },
      {
        name: "르페브르 대주교와 성 비오 10세회",
        people: ["lefebvre"],
        claim: "종교 자유, 일치 운동, 주교단의 단체성에 관한 가르침과 새 미사 경본(1969~1970)은 이전 교황들의 가르침(비오 9세의 「오류 목록」, 비오 11세의 「모르탈리움 아니모스」 등)과 어긋난다. 전해 받은 신앙과 옛 라틴어 미사를 지키려면 이 변화를 받아들일 수 없다. 교회가 위기에 있으므로 교황의 허락 없이도 주교를 세울 수 있다(필요의 상태).",
        refs: ["갈 1:8", "살후 2:15", "유 1:3"],
      },
    ],
    decision: {
      text: "공의회는 헌장 4개, 교령 9개, 선언 3개를 냈고, 교황 바오로 6세가 모두 반포했다. 1988년 6월 30일 르페브르가 스위스 에콘에서 주교 네 명을 세우자 요한 바오로 2세는 7월 2일 자의 교서 「에클레시아 데이」로 파문을 선언했고, 베네딕토 16세는 2009년 1월 21일 그 네 주교의 파문을 풀었다. 2026년 7월 1일 성 비오 10세회가 다시 주교 네 명을 세우자, 신앙교리부는 7월 2일 교령으로 관련 주교 여섯 명의 자동 파문과 이 단체의 교회 분열(이교)을 선언했다.",
      events: ["vatican2-1962", "econe-1988"],
    },
    positions: {
      assyrian: {
        text: "동방 교회는 이 공의회의 당사자가 아니며, 공의회 문헌을 평가한 공식 문서는 없다. 공의회가 연 대화는 1994년 11월 11일 마르 딩카 4세 총대주교와 요한 바오로 2세의 「공동 그리스도론 선언」으로 이어졌다. 두 교회는 같은 그리스도 신앙을 서로 다른 말로 고백한다고 확인했고, 2001년 교황청은 동방 교회의 성찬 기도문(아다이와 마리 아나포라)이 유효하다고 인정했다.",
        src: ["decl1994", "addai2001", "baumwinkler2003: 20세기의 교회"],
      },
      oriental: {
        text: "오리엔트 정교회가 이 공의회 자체를 평가한 공식 문서는 없다. 공의회 뒤 교황들과 오리엔트 정교회 수장들은 공동 선언을 냈다(1971년 시리아 정교회, 1973년 5월 10일 콥트 정교회, 1984년 시리아 정교회). 2003년부터는 가톨릭과 오리엔트 정교회 전체가 함께하는 국제 신학 대화 위원회가 열린다. 콥트 정교회는 2024년 3월 7일 이 대화를 멈췄다가 2026년 5월 22일 다시 참여하기로 했다.",
        src: ["decl1973", "coptic2024", "coptic2026"],
      },
      orthodox: {
        text: "정교회 전체가 이 공의회를 평가한 공식 결정은 없다. 러시아 정교회는 1962년 첫 회기부터 참관인을 보냈고, 콘스탄티노플 세계 총대주교청은 1964년 바오로 6세와 아테나고라스 총대주교가 예루살렘에서 만난 뒤 마지막 두 회기에 참관인을 보냈다. 1965년 12월 7일 로마와 콘스탄티노플은 1054년의 파문을 서로 거두었고, 1980년 공식 신학 대화가 시작되었다. 2016년 크레타 공의회 문서는 다른 교회와 대화를 이어 가되, 정교회가 '하나의 거룩한 보편적 사도적 교회'라고 적었다.",
        src: ["bordeianu2018", "decl1965", "crete2016: 「정교회와 그리스도교 세계의 나머지 교회들의 관계」 1·6항"],
      },
      catholic: {
        text: "가톨릭교회는 이 공의회를 세계 공의회의 가르침으로 받아들인다. 베네딕토 16세는 2005년 12월 22일 교황청 연설에서 공의회를 '단절의 해석'이 아니라 '개혁의 해석'(하나인 교회가 이어지면서 새로워진다)으로 읽어야 한다고 했다. 공의회 전 라틴어 미사는 2007년 자의 교서 「Summorum Pontificum」으로 널리 허락되었다가, 2021년 7월 16일 프란치스코의 「Traditionis custodes」로 다시 주교의 허가 아래 놓였다. 2026년 6월 29일 레오 14세는 성 비오 10세회에 주교 서품을 멈추라는 편지를 썼고, 서품 뒤 신앙교리부가 파문과 교회 분열을 선언했다.",
        src: ["b16curia2005", "vatican: 「Summorum Pontificum」(2007), 「Traditionis custodes」(2021)", "ecclesiadei1988", "pillar2026"],
      },
      protestant: {
        text: "세계교회협의회와 여러 개신교회가 공의회에 참관인을 보냈다. 「일치 교령」(1964)이 개신교 공동체를 '교회 공동체'로 부르며 대화를 연 뒤, 루터교 세계연맹과의 대화는 1999년 「칭의 교리에 관한 공동 선언」으로 이어졌다. 세계 감리교협의회(2006)와 세계개혁교회커뮤니언(2017)도 이 선언에 동참했다.",
        src: ["jddj1999", "wcc: 가톨릭과의 공동 작업 그룹", "vatican: 「일치 교령」(1964)", "encykorea: 「공동번역성서」"],
        parts: [
          { who: "한국 교회", text: "공의회가 다른 교회와 함께 성경을 옮기라고 권한 뒤, 1968년 천주교와 개신교 일부 교단이 공동번역위원회를 꾸려 1977년 부활절에 『공동번역 성서』를 냈다. 개신교 보수 교단은 '하나님' 대신 '하느님'을 쓴 점 등을 들어 이 번역을 쓰지 않았다." },
        ],
      },
      academic: {
        text: "역사가들은 공의회를 무엇으로 볼지에서 갈린다. 주세페 알베리고가 이끈 볼로냐 학파의 『제2차 바티칸 공의회사』(5권, 1995~2006)는 공의회를 문헌보다 큰 '사건'으로 읽었다. 아고스티노 마르케토 대주교(2005)는 이 읽기가 이전 가르침과의 연속성을 가볍게 본다고 비판했다. 존 오말리(2008)는 공의회 문헌의 말투가 법률 문체에서 권고 문체로 바뀐 점에 주목했다.",
        src: ["alberigo1995", "marchetto2005", "omalley2008"],
      },
    },
    people: ["john23", "paul6", "athenagoras", "lefebvre", "johnpaul2", "ratzinger", "popefrancis", "dinkha4", "shenouda3"],
    events: ["vatican2-1962", "anathemas-1965", "econe-1988", "christology-1994", "jddj-1999"],
    links: [
      { id: "infallibility", why: "제1차 바티칸 공의회(1870)가 정한 교황 무류성을 제2차 공의회가 주교단의 단체성과 함께 다시 설명했다" },
      { id: "modernism", why: "근대주의 위기 때 정죄된 생각과 공의회의 개혁이 어떤 관계인지가 해석 논쟁의 한 축이다" },
      { id: "ecumenism", why: "공의회의 「일치 교령」이 가톨릭을 교회 일치 운동에 들어서게 했다" },
      { id: "liberation-theology", why: "공의회의 「사목 헌장」을 라틴 아메리카에서 적용하려 한 흐름" },
    ],
    src: ["vatican: 제2차 바티칸 공의회 문헌", "omalley2008", "b16curia2005", "pillar2026"],
  },
  {
    id: "liberation-theology",
    title: "해방신학",
    aliases: ["Liberation theology", "Teología de la liberación", "Libertatis nuntius", "Minjung theology"],
    from: 1968, to: 2024, era: "today", themes: ["grace", "church"],
    question: "구원은 가난과 억압에서 풀려나는 일과 어떤 관계인가. 교회는 가난한 사람의 편에 서야 하는가. 사회를 분석할 때 마르크스주의의 계급 분석을 빌려 써도 되는가.",
    summary: "1968년 8~9월 콜롬비아 메데인에서 열린 라틴 아메리카 주교회의(CELAM) 제2차 총회는 가난과 불의를 '제도화된 폭력'이라 부르며 교회가 가난한 사람과 함께해야 한다고 했다. 페루의 사제 구스타보 구티에레스는 1971년 『해방신학』을 내어, 신학을 가난한 사람 편에서 하는 실천을 성경에 비추어 돌아보는 일로 정의했다. 교황청 신앙교리성은 1984년과 1986년 두 번의 훈령으로 '해방'이라는 주제는 받아들이되 마르크스주의의 계급 투쟁 분석을 빌려 쓰는 데에는 경고했다. 1979년 푸에블라 총회는 '가난한 이들을 위한 우선적 선택'을 교회의 방향으로 삼았고, 이 말은 뒤에 가톨릭 사회 교리에 들어갔다. 구티에레스는 2024년 10월 22일 세상을 떠났다.",
    sides: [
      {
        name: "해방신학자들(구티에레스, 레오나르도 보프, 혼 소브리노 등)",
        people: ["gutierrez"],
        claim: "하나님은 이집트에서 종살이하던 백성의 부르짖음을 듣고 건져 내셨다. 예수는 가난한 자에게 복음을, 눌린 자에게 자유를 선포했고, 가장 작은 사람에게 한 일이 곧 자신에게 한 일이라 했다. 그래서 구원은 영혼만의 일이 아니라 불의한 구조에서 풀려나는 일까지 품는다. 신학은 가난한 사람 편에서 하는 실천을 성경에 비추어 돌아보는 일이다.",
        refs: ["출 3:7-8", "눅 4:18-19", "마 25:40"],
      },
      {
        name: "교황청 신앙교리성(요제프 라칭거 추기경)",
        people: ["ratzinger", "johnpaul2"],
        claim: "해방은 그리스도교의 참된 주제다. 그러나 가장 깊은 속박은 죄이고, 그리스도가 주는 자유는 정치적 해방으로 줄어들지 않는다. 마르크스주의의 계급 투쟁 분석을 그대로 빌려 쓰면 교회와 성경 읽기가 정치 이념에 끌려가고, 폭력을 정당화하게 된다.",
        refs: ["요 8:32", "갈 5:1"],
      },
      {
        name: "복음주의의 통전적 선교(르네 파디야, 사무엘 에스코바르, 존 스토트)",
        people: ["stott"],
        claim: "복음 전도와 사회 정의는 둘 다 그리스도인의 의무다. 하나님은 정의와 자비를 원하시고, 행함이 없는 믿음은 죽은 믿음이다. 그러나 사회 변화를 구원과 같은 일로 보지 않으며, 마르크스주의 분석 대신 성경의 하나님 나라에서 출발한다.",
        refs: ["미 6:8", "약 2:15-17"],
      },
    ],
    decision: {
      text: "신앙교리성은 1984년 8월 6일 훈령 「자유의 전갈(Libertatis nuntius)」로 일부 해방신학이 마르크스주의 개념을 비판 없이 빌려 쓴다고 경고했고, 1986년 3월 22일 훈령 「자유의 자각(Libertatis conscientia)」에서 그리스도교의 자유와 해방을 긍정적으로 정리했다. 1985년에는 레오나르도 보프의 책 『교회: 은사와 권력』에 관한 공지를 내고 보프에게 한동안 공개 발언을 멈추게 했다.",
      events: ["medellin-1968"],
    },
    positions: {
      assyrian: {
        text: "동방 교회가 해방신학을 다룬 공식 문서는 없다. 동방 교회는 세계교회협의회 회원 교회로서 협의회의 정의·평화 활동에 함께해 왔다.",
        src: ["wcc: 회원 교회 목록", "baumwinkler2003: 20세기의 교회"],
      },
      oriental: {
        text: "오리엔트 정교회가 해방신학을 다룬 공식 문서는 없다. 콥트·시리아·아르메니아·에티오피아·말랑카라 교회는 세계교회협의회 회원 교회로서 협의회의 정의·평화 활동에 함께해 왔다.",
        src: ["wcc: 회원 교회 목록", "roberson: 오리엔트 정교회"],
      },
      orthodox: {
        text: "동방 정교회가 해방신학을 다룬 공식 문서는 없다. 사회 문제에 관한 공식 가르침은 러시아 정교회 주교 회의가 2000년에 채택한 「러시아 정교회 사회 개념의 기초」와, 세계 총대주교청 거룩한 시노드가 승인해 2020년에 펴낸 『세상의 생명을 위하여: 정교회의 사회 에토스를 향해』에 있다. 뒤의 문서는 가난과 불평등을 길게 다룬다.",
        src: ["rocsocial2000", "flow2020"],
      },
      catholic: {
        text: "가톨릭교회는 두 훈령(1984, 1986)의 구별을 따른다. 요한 바오로 2세는 1986년 4월 9일 브라질 주교회의에 보낸 편지에서, 올바르게 이해된 해방신학은 시의적절할 뿐 아니라 유용하고 필요하다고 썼다. '가난한 이들을 위한 우선적 선택'(푸에블라 1979, 아파레시다 2007)은 가톨릭 사회 교리의 일부가 되었다. 프란치스코는 2013년 「복음의 기쁨」에서 '가난한 이들을 위한 가난한 교회'를 말했고, 1980년 미사 중에 살해된 엘살바도르의 오스카르 로메로 대주교를 2018년 10월 14일 성인으로 선포했다.",
        src: ["vatican: 「Libertatis nuntius」(1984), 「Libertatis conscientia」(1986)", "vatican: 브라질 주교회의에 보낸 편지(1986년 4월 9일)", "vatican: 「복음의 기쁨」(2013) 198항"],
      },
      protestant: {
        text: "개신교 안에는 해방신학과 가까운 흐름과 거리를 두는 흐름이 함께 있다.",
        src: ["lausanne1974: 5항 그리스도인의 사회적 책임", "wcc: 1983년 밴쿠버 총회", "cca1981"],
        parts: [
          { who: "에큐메니컬 교회들", text: "장로교인 루벵 알베스와 감리교인 호세 미게스 보니노는 해방신학을 함께 일군 개신교 신학자다. 세계교회협의회는 1983년 밴쿠버 총회에서 '정의, 평화, 창조 질서의 보전' 과정을 시작했다." },
          { who: "복음주의", text: "1974년 로잔 언약 5항은 복음 전도와 사회·정치 참여가 둘 다 그리스도인의 의무라고 적었다. 라틴 아메리카 복음주의자들은 이를 '통전적 선교'로 발전시켰다." },
          { who: "한국 교회", text: "1970년대 서남동·안병무 등 한국 신학자들은 군사 정권 아래 노동자와 도시 빈민의 고난을 성경을 읽는 자리로 삼은 민중신학을 내놓았다." },
        ],
      },
      academic: {
        text: "크리스천 스미스(1991)는 해방신학이 생겨난 과정을 라틴 아메리카 교회 안의 조직과 인맥을 통해 자란 사회 운동으로 분석했다. 퓨 리서치 센터의 2014년 조사에서 라틴 아메리카 성인 가운데 가톨릭 신자는 69%로, 가톨릭 가정에서 자랐다고 답한 84%보다 적었다. 개신교인(다수가 오순절 계열)은 19%였다.",
        src: ["smith1991", "pew2014"],
      },
    },
    people: ["gutierrez", "ratzinger", "johnpaul2", "popefrancis", "stott"],
    events: ["medellin-1968", "lausanne-1974"],
    links: [
      { id: "vatican2", why: "메데인 총회는 공의회의 「사목 헌장」을 라틴 아메리카에 적용하려 했다" },
      { id: "ecumenism", why: "세계교회협의회의 정의·평화 활동과 이어진다" },
    ],
    src: ["gutierrez1971", "vatican: 「Libertatis nuntius」(1984), 「Libertatis conscientia」(1986)", "smith1991"],
  },
  {
    id: "women-ordination",
    title: "여성 안수",
    aliases: ["Ordination of women", "Ordinatio sacerdotalis", "Deaconesses"],
    from: 1944, to: 2026, era: "today", themes: ["church", "scripture"],
    question: "여성을 목사, 사제, 주교로 세울 수 있는가. 초대 교회에 있던 여성 부제(집사)를 오늘 다시 세울 수 있는가.",
    summary: "1944년 홍콩의 성공회 주교가 리팀오이를 첫 여성 사제로 세운 뒤, 20세기 후반 많은 개신교회와 성공회 관구가 여성 안수를 결정했다. 가톨릭교회는 1994년 요한 바오로 2세의 교서로 여성에게 사제품을 줄 권한이 교회에 없다고 선언했다. 정교회와 오리엔트 정교회, 동방 교회는 남성만 사제로 세우고, 그 가운데 일부 교회가 옛 여성 부제 직분을 되살리고 있다. 한 교파 안에서도 교단마다 결정이 갈렸다.",
    sides: [
      {
        name: "남성만 사제·목사로 세우는 쪽",
        people: ["johnpaul2"],
        claim: "예수는 열두 사도를 모두 남자로 골랐고, 교회는 처음부터 이를 따랐다. 사제는 성찬에서 그리스도를 대신하는 표지이므로 남성이어야 한다(가톨릭·정교회). 개신교의 이 쪽은 바울이 여자가 가르치거나 남자를 주관하는 일을 허락하지 않았다는 구절을 든다.",
        refs: ["막 3:14", "딤전 2:12", "고전 14:34"],
      },
      {
        name: "여성도 안수하는 쪽",
        claim: "그리스도 안에서는 남자나 여자나 하나다. 바울은 뵈뵈를 교회의 일꾼(디아코노스)이라 불렀고 유니아를 사도들 가운데 뛰어난 사람이라 했다. 성령은 아들과 딸에게 함께 예언하게 하셨다. 여자의 침묵을 말한 구절은 그때 그 교회의 사정에 따른 지시다.",
        refs: ["갈 3:28", "롬 16:1", "롬 16:7", "행 2:17-18"],
      },
      {
        name: "여성 부제를 되살리자는 쪽",
        claim: "초대 교회와 비잔티움 교회에는 여성 부제가 있었다. 여성 부제는 사제직과는 다른 섬김의 직분이므로, 사제를 남성으로 한정하는 전통과 부딪치지 않고 되살릴 수 있다.",
        refs: ["롬 16:1", "딤전 3:11"],
      },
    ],
    decision: {
      text: "교회마다 따로 정했다. 가톨릭은 1994년 5월 22일 교서 「사제 서품(Ordinatio sacerdotalis)」으로 문을 닫았고, 정교회는 1988년 로도스 회의에서 여성 사제를 받아들이지 않으면서 여성 부제의 회복을 권했다. 잉글랜드 국교회는 1992년 11월 11일 총회에서 여성 사제를, 2014년 7월 14일 여성 주교를 결정했고, 2026년 3월 25일 첫 여성 캔터베리 대주교 사라 멀랠리가 취임했다.",
    },
    positions: {
      assyrian: {
        text: "아시리아 동방 교회는 남성만 사제로 세운다. 여성 안수를 다룬 공식 문서는 없다.",
        src: ["roberson: 아시리아 동방 교회", "baumwinkler2003: 교회 조직"],
      },
      oriental: {
        text: "오리엔트 정교회는 모두 남성만 사제로 세운다. 콥트 정교회는 1981년 셰누다 3세가 여성 부제(디아코니사) 직분을 되살렸는데, 안수가 아니라 축성으로 세우며 전례 안의 역할은 없다. 아르메니아 사도 교회의 수녀원에는 여성 부제가 여러 세기 이어져 왔고, 2017년 9월 25일 킬리키아 카톨리코스좌 소속 테헤란 교구장은 평신도 여성을 본당 부제로 세웠다. 아르메니아 교회 전체가 이를 공식 제도로 정하지는 않았다.",
        src: ["roberson: 오리엔트 정교회", "chaillot2018", "armenian2017"],
      },
      orthodox: {
        text: "정교회는 여성을 사제로 세우지 않는다. 세계 총대주교 디미트리오스 1세가 1988년 10~11월 로도스에서 연 정교회 신학 회의는 여성 사제를 받아들이지 않으면서, 사도 시대의 여성 부제 직분은 되살려야 한다고 권했다. 알렉산드리아 총대주교청은 2016년 시노드에서 여성 부제 회복을 결정하고 2017년 콩고 민주 공화국에서 여성 차부제를 세웠으며, 2024년 5월 2일 짐바브웨 대주교가 여성 한 명을 부제로 세웠다. 다른 정교회들은 이를 따르지 않았다.",
        src: ["limouris1992", "zimbabwe2024"],
      },
      catholic: {
        text: "교회법 1024조와 『가톨릭 교회 교리서』 1577항은 세례받은 남자만 유효하게 성품을 받는다고 정한다. 신앙교리성의 「인터 인시뇨레스」(1976)와 요한 바오로 2세의 「사제 서품」(1994)은 교회가 여성에게 사제품을 줄 권한이 없으며 이 판단을 모든 신자가 굳게 지켜야 한다고 했고, 1995년 신앙교리성은 이를 무류한 가르침으로 보았다. 여성 부제에 관해서는 프란치스코가 2016년과 2020년 연구 위원회를 세웠고, 2025년 12월 4일 공개된 두 번째 위원회 보고는 여성 부제를 성품의 한 단계로 받아들이는 데 반대하면서도 아직 최종 판단은 아니라고 적었다. 2021년부터 여성도 독서직과 시종직을 받을 수 있다.",
        src: ["vatican: 「Inter insigniores」(1976), 「Ordinatio sacerdotalis」(1994), 자의 교서 「Spiritus Domini」(2021)", "ccc: 1577항", "petrocchi2025"],
      },
      protestant: {
        text: "개신교 안에서 가장 크게 갈리는 문제 가운데 하나다. 같은 교파 안에서도 교단마다 결정이 다르다.",
        src: ["cofe: 여성 사제(1992)와 여성 주교(2014)", "bfm2000: 6조", "sbc2026", "encykorea: 「전밀라」", "seoul1994", "nocut2013", "nocut2026", "segye2009"],
        parts: [
          { who: "성공회", text: "1944년 홍콩의 리팀오이가 첫 여성 사제가 되었고, 미국 성공회와 캐나다 성공회는 1976년 여성 사제를 결정했다. 잉글랜드 국교회는 1994년 3월 12일 첫 여성 사제 32명을, 2015년 1월 26일 첫 여성 주교를 세웠다. 대한성공회는 2001년 첫 여성 사제를 세웠다. 여성 사제를 세우지 않는 관구와 교구도 남아 있고, 가프콘(세계 성공회 미래 회의)은 2025년 10월 여성 캔터베리 대주교 지명을 받아들이지 않는다고 밝혔다." },
          { who: "루터교", text: "스웨덴 국교회는 1958년 여성 목사를 결정해 1960년 처음 세웠다. 미국 복음주의 루터교회의 전신 교단들은 1970년부터 여성을 안수했다. 루터교회-미주리 시노드는 여성을 목사로 세우지 않는다." },
          { who: "개혁교회·장로교", text: "미국 장로교(오늘의 PCUSA의 전신)는 1956년 첫 여성 목사를 세웠고, 스코틀랜드 교회는 1968년 여성 목사를 허용했다. 한국에서는 대한예수교장로회(통합)가 1994년 9월 총회에서 여성 안수를 가결했고, 한국기독교장로회도 여성 목사를 세운다. 대한예수교장로회(합동)은 여성을 목사로 세우지 않는다. 합동의 2025년 제110회 총회는 여성에게 설교권(강도권)을 주고 목사 자격에 '남성'을 적는 헌법 개정안을 가결했으나, 2026년 봄 노회 투표에서 부결되었다." },
          { who: "감리교", text: "미국 감리교회는 1956년 여성에게 목사의 모든 권리를 주었다. 기독교대한감리회는 1930년 제1회 총회에서 여성 목사 제도를 채택했고, 1955년 3월 전밀라·명화용이 한국인 첫 여성 목사가 되었다." },
          { who: "침례교", text: "미국 남침례회의 「침례교 신앙과 메시지」(2000) 6조는 목사직을 성경이 정한 대로 남성으로 한정한다. 이를 교단 헌법에 넣는 개정안은 2024년(61.45%)과 2025년에 3분의 2를 넘지 못했고, 2026년 6월 10일 첫 투표를 통과해 2027년 두 번째 투표를 남겨 두었다. 기독교한국침례회는 2013년 9월 제103차 총회에서 여성 목사 안수를 가결했다." },
        ],
      },
      academic: {
        text: "칼케돈 공의회(451) 15조는 여성 부제를 40세 전에 안수하지 말라고 정해, 5세기에 여성 부제 안수가 있었음을 보여 준다. 학자들은 그 안수가 남성 부제의 안수와 같은 성격이었는지를 두고 갈린다(매디건과 오시에크 2005, 메이시 2008). 마크 차베스(1997)는 미국 교단들의 여성 안수 규정과 실제로 여성 목회자가 일하는 정도가 늘 일치하지는 않는다는 점을 조사했다.",
        src: ["councils: 칼케돈 공의회 15조", "madigan2005", "macy2008", "chaves1997"],
      },
    },
    people: ["johnpaul2", "popefrancis"],
    events: [],
    links: [
      { id: "sexuality", why: "성공회와 감리교에서 두 문제가 함께 교단 분열의 쟁점이 되었다" },
      { id: "vatican2", why: "공의회 뒤 평신도 직무가 넓어지면서 여성의 자리를 묻는 질문이 커졌다" },
    ],
    src: ["vatican: 「Ordinatio sacerdotalis」(1994)", "limouris1992", "cofe: 여성 사제(1992)와 여성 주교(2014)", "macy2008"],
  },
  {
    id: "sexuality",
    title: "성 윤리와 동성 결합",
    aliases: ["Human sexuality", "Same-sex marriage", "Lambeth I.10", "Fiducia supplicans"],
    from: 1972, to: 2026, era: "today", themes: ["church", "scripture"],
    question: "혼인은 한 남자와 한 여자의 결합인가. 교회는 동성 커플을 축복하거나 혼인시킬 수 있는가. 동성 관계에 있는 사람을 목회자로 세울 수 있는가.",
    summary: "2001년 네덜란드를 시작으로 여러 나라가 동성 혼인을 법으로 인정하면서 교회 안에서도 이 문제가 커졌다. 1998년 람베스 회의는 동성 성관계가 성경과 맞지 않는다고 결의했지만, 2003년 미국 성공회가 동성 관계에 있는 주교를 세우면서 세계 성공회가 갈라지기 시작했다. 미국 연합감리교회는 1972년부터 지켜 온 금지를 2019년 강화했다가 2024년 모두 거두었고, 그 사이 미국 교회의 약 4분의 1이 교단을 떠났다. 가톨릭교회는 2023년 선언 「간청하는 믿음」으로 혼인으로 보지 않는 짧은 축복을 허락했고, 뒤이어 콥트 정교회는 동성 관계에 대한 어떤 축복도 받아들일 수 없다며 가톨릭과의 신학 대화를 2년 넘게 멈추었다.",
    sides: [
      {
        name: "혼인은 한 남자와 한 여자의 결합이라는 쪽",
        claim: "하나님은 사람을 남자와 여자로 지으셨고, 남자가 아내와 합하여 한 몸이 되는 관계가 혼인이다. 예수도 이 말씀을 그대로 인용했다. 바울은 동성 성관계를 죄로 꼽았다. 교회는 동성애 성향을 가진 사람을 존중하고 환대하지만, 동성 결합을 혼인으로 축복할 수는 없다.",
        refs: ["창 2:24", "마 19:4-6", "롬 1:26-27", "고전 6:9-11"],
      },
      {
        name: "동성 결합도 축복하고 혼인시킬 수 있다는 쪽",
        claim: "하나님은 사랑이시며, 사랑은 율법의 완성이다. 성경이 정죄한 행위는 착취나 우상 숭배와 얽힌 고대의 성관계이지, 서로 평생 신실하게 사는 오늘의 동성 커플이 아니다. 그리스도 안에서 모든 사람이 하나이듯 교회는 이들을 혼인과 성직에서 빼지 말아야 한다.",
        refs: ["요일 4:16", "롬 13:10", "갈 3:28"],
      },
      {
        name: "혼인 가르침은 지키되 짧은 축복은 줄 수 있다는 쪽(「간청하는 믿음」)",
        people: ["popefrancis"],
        claim: "혼인은 한 남자와 한 여자의 결합이라는 가르침은 바뀌지 않는다. 그러나 축복은 하나님의 도움을 구하는 사람에게 주는 기도이므로, 혼인으로 오해되지 않는 짧고 즉흥적인 축복은 동성 커플을 포함해 '정상적이지 않은 처지'의 커플에게도 줄 수 있다. 이 축복은 그 관계를 승인하지 않는다.",
        refs: ["민 6:24-26"],
      },
    ],
    decision: {
      text: "세계 차원의 한 결정은 없다. 1998년 람베스 회의 결의 1.10(찬성 526, 반대 70), 2016년 크레타 정교회 공의회 문서, 2023년 12월 18일 교황청 신앙교리부의 「간청하는 믿음(Fiducia supplicans)」, 2024년 미국 연합감리교회 총회 결정처럼 교회마다 따로 정했다.",
      events: ["lambeth-1998", "crete-2016"],
    },
    positions: {
      assyrian: {
        text: "아시리아 동방 교회 거룩한 시노드는 2024년 「그리스도교 혼인과 인간의 성에 관한 시노드 성명」에서 혼인을 한 남자와 한 여자의 깨지지 않는 결합으로 확인했다. 성명은 같은 성(性)인 두 사람의 '결합'을 어떤 경우에도 축복하거나 받아들일 수 없다고 적고, 이를 따르지 않는 성직자는 직무를 멈추게 한다고 정했다. 성명은 신자들에게 누구도 정죄하지 말고 존중과 사랑으로 복음을 전하라고 덧붙였다.",
        src: ["acoe2024"],
      },
      oriental: {
        text: "콥트 정교회 거룩한 시노드는 2024년 3월 7일, 그런 관계에 대한 축복은 어떤 형태든 죄에 대한 축복이라며 동성 관계를 받아들이지 않는다고 밝히고, 다른 오리엔트 정교회와 의논한 뒤 가톨릭과의 신학 대화를 멈추었다. 콥트 교회는 2026년 5월 15일 레오 14세가 동성 커플을 축복하지 않겠다는 확인을 주었다고 밝혔고, 5월 22일 시노드는 대화를 다시 시작하기로 했다.",
        src: ["coptic2024", "coptic2026"],
      },
      orthodox: {
        text: "2016년 크레타 공의회 문서 「혼인 성사와 그 장애」 1장 10항은 교회가 신자들에게 동성 결합이나 혼인 밖의 동거를 허락하지 않는다고 적었다(이 공의회에는 안티오키아·러시아·불가리아·조지아 정교회가 참석하지 않았다). 러시아 정교회의 「사회 개념의 기초」(2000)도 같은 입장이다. 러시아 정교회 시노드 성서·신학 위원회는 2024년 2월 20일 「간청하는 믿음」이 그리스도교 도덕 가르침에서 크게 벗어났다고 판단했다.",
        src: ["crete2016: 「혼인 성사와 그 장애」 1장 10항", "rocsocial2000", "rocfs2024"],
      },
      catholic: {
        text: "『가톨릭 교회 교리서』 2357~2359항은 동성 성행위를 본질적으로 무질서하며 어떤 경우에도 승인할 수 없다고 가르치고, 동성애 성향을 가진 사람은 존중과 연민으로 대하며 부당하게 차별하지 말라고 가르친다. 신앙교리성은 2003년 동성 결합의 법적 인정에 반대했고, 2021년 3월 15일 교회가 동성 결합을 축복할 권한이 없다고 답했다. 2023년 12월 18일 「간청하는 믿음」은 혼인과 혼동되지 않는 짧은 비전례적 축복을 허락했고, 신앙교리부는 2024년 1월 4일 보도 자료에서 지역 교회의 사정에 따라 신중하게 시행할 수 있다고 설명했다. 아프리카·마다가스카르 주교회의 연합(SECAM)은 2024년 1월 11일 아프리카에서는 이런 축복을 하지 않겠다고 밝혔다.",
        src: ["ccc: 2357~2359항", "vatican: 신앙교리성 「고려 사항」(2003), 「의문에 대한 답변」(2021), 「Fiducia supplicans」(2023)과 보도 자료(2024년 1월 4일)", "secam2024"],
      },
      protestant: {
        text: "개신교는 교단마다 결정이 크게 갈리고, 이 문제로 교단이 나뉜 곳이 많다.",
        src: ["lambeth1998", "gafcon2025", "cofe2025", "umc2024", "kmc2024", "bfm2000: 18조"],
        parts: [
          { who: "성공회", text: "1998년 람베스 회의 결의 1.10은 동성 성관계가 성경과 맞지 않으며 동성 결합의 축복과 그런 관계에 있는 사람의 서품을 권할 수 없다고 했다. 미국 성공회는 2003년 11월 동성 관계에 있는 주교를 세웠고 2015년 혼인 교회법을 성별과 상관없이 고쳤다. 이에 반대한 교회들이 2008년 가프콘을 열었고, 가프콘은 2025년 10월 캔터베리 대주교와의 관계를 끊고 스스로를 '세계 성공회 공동체'라 불렀다. 잉글랜드 국교회는 2023년 12월부터 정기 예배 안에서 동성 커플을 위한 기도(「사랑과 믿음의 기도」)를 쓰게 했고, 2025년 10월 주교원은 따로 드리는 축복 예식에는 총회 각 원의 3분의 2 찬성이 필요하다고 정했다." },
          { who: "감리교", text: "미국 연합감리교회는 2019년 2월 특별 총회에서 기존 금지를 강화했고, 2019~2023년 미국 교회 7,600곳 남짓이 교단을 떠났다. 떠난 교회 상당수는 2022년 5월 1일 세워진 세계감리교회에 들어갔다. 2024년 총회는 5월 1일 동성애자 목회자 금지를 692 대 51로 없앴고, 5월 2일 1972년부터 사회 원칙에 있던 '동성애 행위는 그리스도교 가르침과 맞지 않는다'는 문장을 523 대 161로 지웠다. 기독교대한감리회 『교리와 장정』은 '동성애 찬성·동조'를 처벌할 잘못으로 정해 두었고, 이 조항에 따라 성소수자를 축복한 목사에게 2024년 3월 4일 출교가 확정되었다." },
          { who: "루터교", text: "미국 복음주의 루터교회는 2009년 총회에서 동성 관계에 있는 목회자를 허용했고, 스웨덴 국교회는 2009년부터 동성 혼인을 집례한다. 루터교회-미주리 시노드는 혼인을 한 남자와 한 여자의 결합으로 가르친다." },
          { who: "개혁교회·장로교", text: "미국 장로교(PCUSA)는 2011년 안수 기준을 고쳐 동성 관계에 있는 사람의 안수를 허용했고, 2015년 혼인을 '두 사람'의 결합으로 고쳤다. 스코틀랜드 교회는 2022년 총회에서 목사가 동성 혼인을 집례할 수 있게 했다. 북미 기독개혁교회는 2022년 총회에서 동성 성관계를 신앙고백이 금하는 부정(不貞)에 넣었다." },
          { who: "침례교", text: "미국 남침례회의 「침례교 신앙과 메시지」(2000) 18조는 혼인을 한 남자와 한 여자의 결합으로 정한다." },
        ],
      },
      academic: {
        text: "1998년 람베스 결의 1.10은 찬성 526, 반대 70으로 통과했다. 미국 연합감리교회에서는 2019~2023년 미국 교회의 약 4분의 1이 교단을 떠났다. 학자들은 로마서 1장과 고린도전서 6장 9절에 나오는 낱말(말라코이, 아르세노코이타이)을 어떻게 옮길지를 두고 갈린다. 존 보즈웰(1980)은 중세 교회가 처음부터 동성애에 적대적이지는 않았다고 보았고, 로버트 개그넌(2001)은 성경 전체가 동성 성관계를 일관되게 금한다고 보았다.",
        src: ["lambeth1998", "umc2024", "boswell1980", "gagnon2001"],
      },
    },
    people: ["popefrancis"],
    events: ["lambeth-1998", "crete-2016"],
    links: [
      { id: "women-ordination", why: "성공회와 감리교에서 두 문제가 함께 교단 분열의 쟁점이 되었다" },
      { id: "ecumenism", why: "이 문제 때문에 교회 사이의 신학 대화가 멈추기도 했다(콥트 정교회, 2024)" },
    ],
    src: ["lambeth1998", "crete2016: 「혼인 성사와 그 장애」", "vatican: 「Fiducia supplicans」(2023)", "umc2024"],
  },
  {
    id: "ukraine-autocephaly",
    title: "우크라이나 정교회 독립",
    aliases: ["Ukrainian autocephaly", "Tomos 2019", "Moscow–Constantinople schism"],
    from: 2018, to: 2026, era: "today", themes: ["church"],
    question: "우크라이나의 정교회는 누구에게 속하는가. 콘스탄티노플 세계 총대주교는 다른 교회가 자기 영역이라 여기는 곳의 교회에 독립(아우토케팔리아, 스스로 수장을 뽑고 다른 교회에 속하지 않는 지위)을 줄 수 있는가.",
    summary: "키이우 루스는 988년 콘스탄티노플 교회에서 그리스도교를 받았고, 키이우 대교구는 1686년 콘스탄티노플 총대주교의 문서로 모스크바 총대주교청 아래에 들어갔다. 1991년 우크라이나가 독립한 뒤 모스크바에 속하지 않은 정교회들이 생겼지만 다른 정교회들은 이들을 인정하지 않았다. 2018년 콘스탄티노플은 1686년 문서를 거두고 이 교회들을 받아들였으며, 2019년 1월 새로 통합한 우크라이나 정교회(OCU)에 독립을 인정하는 교서(토모스)를 주었다. 모스크바 총대주교청은 콘스탄티노플과 성찬 교제를 끊었다. 이름이 비슷한 다른 교회인 우크라이나 정교회(UOC)는 2022년 러시아의 침공 뒤 모스크바로부터 완전히 독립했다고 선언했지만 OCU에 합류하지는 않았다.",
    sides: [
      {
        name: "콘스탄티노플 세계 총대주교청과 우크라이나 정교회(OCU)",
        people: ["bartholomew"],
        claim: "키이우 대교구는 본래 콘스탄티노플의 영역이었다. 1686년 문서는 모스크바 총대주교에게 키이우 수도대주교를 서품할 권한만 주었을 뿐 영역을 넘기지 않았다. 세계 총대주교청은 세르비아, 루마니아, 폴란드, 불가리아 등의 교회에 독립을 주어 온 '어머니 교회'로서 이 일을 할 권한이 있다.",
      },
      {
        name: "모스크바 총대주교청(러시아 정교회)",
        people: ["kirill"],
        claim: "우크라이나는 300년 넘게 러시아 정교회의 정당한 영역이다. 콘스탄티노플은 교회법이 정죄한 분열 단체를 회개 없이 받아들였고, 다른 교회의 영역에 들어와 독립을 줄 권한이 없다. 독립은 모든 정교회가 함께 합의해야 줄 수 있다.",
      },
      {
        name: "우크라이나 정교회(UOC, 오누프리 수도대주교)",
        claim: "2022년 5월 27일 공의회에서 교회 규약의 모스크바 관련 조항을 지우고 '완전한 자립과 독립'을 선언했다. 러시아의 전쟁과 이를 지지한 키릴 총대주교에게 반대한다. 그러나 콘스탄티노플이 세운 OCU의 서품과 독립은 받아들이지 않는다.",
      },
    ],
    decision: {
      text: "콘스탄티노플 거룩한 시노드는 2018년 10월 11일 1686년 문서를 거두고 독립 절차를 시작했다. 2018년 12월 15일 키이우 성 소피아 대성당의 통합 공의회가 에피파니 수도대주교를 수장으로 뽑았고, 2019년 1월 5일 서명한 토모스를 1월 6일 바르톨로메오스 총대주교가 건넸다. 러시아 정교회 시노드는 2018년 10월 15일 민스크에서 콘스탄티노플과의 성찬 교제를 끊었다. 모든 정교회가 함께 내린 결정은 아직 없다.",
      events: ["ukraine-2019"],
    },
    positions: {
      assyrian: {
        text: "이 문제를 다룬 공식 문서는 없다. 아시리아 동방 교회는 동방 정교회와 성찬 교제를 나누지 않으므로, 동방 정교회 사이의 독립 문제에 당사자로 끼지 않는다.",
        src: ["baumwinkler2003: 20세기의 교회", "roberson: 아시리아 동방 교회"],
      },
      oriental: {
        text: "이 문제를 다룬 공식 문서는 없다. 오리엔트 정교회는 동방 정교회와 성찬 교제를 나누지 않으므로, 동방 정교회 사이의 독립 문제에 당사자로 끼지 않는다.",
        src: ["roberson: 오리엔트 정교회", "ware2015: 교회의 조직"],
      },
      orthodox: {
        text: "동방 정교회는 이 문제로 갈라져 있다. 2026년까지 OCU를 인정한 교회는 콘스탄티노플, 그리스, 알렉산드리아, 키프로스 네 곳이다.",
        src: ["greece2019", "wikireactions", "romcomm2018", "africa2021", "uoc2022", "mospatkorea2019"],
        parts: [
          { who: "콘스탄티노플 세계 총대주교청", text: "2018년 10월 11일 결정과 2019년 1월 토모스로 OCU의 독립을 인정했다." },
          { who: "그리스·알렉산드리아·키프로스 정교회", text: "그리스 정교회 주교 회의는 2019년 10월 12일, 알렉산드리아 총대주교는 2019년 11월 8일, 키프로스 대주교는 2020년 10월 24일 OCU를 인정했다." },
          { who: "러시아 정교회", text: "2018년 10월 15일 콘스탄티노플과 성찬 교제를 끊었고, OCU를 인정한 그리스·알렉산드리아·키프로스 수장의 이름을 기도에서 뺐다. 2018년 12월 28일 동남아시아 총대주교 관구를, 2019년 2월 26일 한국 교구를 세웠고(세계 총대주교청 소속 한국 정교회 대교구와 따로), 2021년 12월 29일 알렉산드리아 총대주교청 사제들을 받아 아프리카 관구를 세웠다. 알렉산드리아 시노드는 2022년 1월 이를 자기 영역 침범이라 비판했다." },
          { who: "우크라이나 정교회(UOC)", text: "2022년 5월 27일 공의회에서 모스크바로부터 '완전한 자립과 독립'을 선언했으나 '독립 교회(아우토케팔리아)'라는 말은 쓰지 않았다. 러시아 정교회는 UOC를 여전히 자기 교회의 일부로 본다." },
          { who: "다른 정교회들", text: "세르비아 정교회 주교 회의(2019년 5월)와 폴란드 정교회 주교 회의(2019년 4월 2일)는 OCU를 인정하지 않는다고 밝혔다. 안티오키아, 알바니아, 체코·슬로바키아 정교회는 모든 정교회 수장 회의를 열어 풀자고 했고, 예루살렘, 루마니아, 불가리아, 조지아 정교회는 인정 여부를 공식으로 정하지 않았다." },
        ],
      },
      catholic: {
        text: "교황청은 이 문제를 정교회 안의 일로 보고 판단을 내지 않는다. 2018년 9월 우크라이나 주재 교황 대사관은 교황청이 우크라이나 독립 정교회 설립에 대해 어떤 평가도 한 적이 없고 할 뜻도 없다고 밝혔다. 그보다 앞서 2016년 2월 12일 아바나에서 프란치스코 교황과 키릴 총대주교가 낸 공동 선언 27항은 우크라이나 정교회 신자들 사이의 분열이 기존 교회법에 따라 극복되기를 바란다고 적었다.",
        src: ["nunciature2018", "vatican: 프란치스코 교황과 키릴 총대주교의 공동 선언(2016년 2월 12일) 27항"],
      },
      protestant: {
        text: "개신교회들은 정교회 안의 교회법 문제인 독립 여부를 공식으로 판단하지 않았다. 러시아 정교회가 회원인 세계교회협의회는 2022년 카를스루에 총회에서 러시아의 우크라이나 침공을 불법이며 정당화할 수 없다고 했다. 2024년 4월에는 키릴 총대주교가 의장으로 있는 세계 러시아 민족 회의가 3월 27일 채택한 문서에서 이 전쟁을 '거룩한 전쟁'이라 부른 데 대해 받아들일 수 없다고 밝혔다.",
        src: ["wcc: 카를스루에 총회 성명(2022)", "wcc2024"],
      },
      academic: {
        text: "학자들은 1686년 문서를 두고 갈린다. 한쪽은 키이우 대교구를 모스크바에 넘긴 문서로, 다른 쪽은 서품 권한만 준 문서로 읽는다. 니콜라스 데니센코(2018)는 20세기 우크라이나 정교회가 여러 갈래로 나뉜 과정을 정리했다. 우크라이나 의회는 2024년 8월 20일 러시아 정교회와 연결된 종교 단체의 활동을 금지하는 법(3894-IX)을 만들었고, 국가 종교 기관은 2025년 8월 27일 UOC의 키이우 대교구가 러시아 정교회와 연결되어 있다고 판정했다. 이를 둘러싼 재판은 2026년에도 이어지고 있다.",
        src: ["denysenko2018", "dess2025"],
      },
    },
    people: ["bartholomew", "kirill", "popefrancis"],
    events: ["ukraine-2019", "havana-2016"],
    links: [
      { id: "phyletism", why: "민족마다 교회를 따로 세우는 문제를 1872년 콘스탄티노플 공의회가 다룬 적이 있다" },
      { id: "schism-1054", why: "콘스탄티노플과 다른 교회 사이의 성찬 단절과 그 권한 문제" },
      { id: "ecumenism", why: "세계교회협의회 안에서 러시아 정교회의 자리가 쟁점이 되었다" },
    ],
    src: ["denysenko2018", "wikireactions", "romcomm2018"],
  },
];

// 이 묶음에서 새로 쓴 출처. 교회 공식 문서는 저작권이 살아 있어 '링크만'으로 적고 인용하지 않는다
const S = (name, url, license) => ({ name, url, license });
export const SRC_K6 = {
  // 제2차 바티칸 공의회
  b16curia2005: S("베네딕토 16세, 「교황청에 한 성탄 인사」(2005년 12월 22일)", "https://www.vatican.va/content/benedict-xvi/en/speeches/2005/december/documents/hf_ben_xvi_spe_20051222_roman-curia.html", "링크만"),
  ecclesiadei1988: S("요한 바오로 2세, 자의 교서 「Ecclesia Dei」(1988년 7월 2일)", "https://www.vatican.va/content/john-paul-ii/en/motu_proprio/documents/hf_jp-ii_motu-proprio_02071988_ecclesia-dei.html", "링크만"),
  pillar2026: S("The Pillar, 「Vatican confirms six SSPX bishops excommunicated」(2026년 7월, 신앙교리부 교령 2026년 7월 2일 보도)", "https://www.pillarcatholic.com/p/vatican-confirms-six-sspx-bishops", "링크만"),
  bordeianu2018: S("R. Bordeianu, 「Orthodox Observers at the Second Vatican Council and Intra-Orthodox Dynamics」, 『Theological Studies』 79(2018)", "https://theologicalstudies.net/author/radu-bordeianu/", "인용만"),
  crete2016: S("정교회 거룩한 대공의회(크레타, 2016) 공식 문서", "https://www.holycouncil.org/official-documents", "링크만"),
  encykorea: S("『한국민족문화대백과사전』(한국학중앙연구원)", "https://encykorea.aks.ac.kr/", "링크만"),
  alberigo1995: S("G. Alberigo & J. A. Komonchak 편, 『History of Vatican II』 1~5권(Orbis·Peeters, 1995~2006)", null, "인용만"),
  marchetto2005: S("A. Marchetto, 『Il Concilio Ecumenico Vaticano II: Contrappunto per la sua storia』(Libreria Editrice Vaticana, 2005)", null, "인용만"),
  omalley2008: S("J. W. O'Malley, 『What Happened at Vatican II』(Harvard UP, 2008)", null, "인용만"),
  coptic2024: S("Catholic World Report, 「Coptic Orthodox Church confirms dialogue with Catholic Church suspended over same-sex blessings」(2024년 3월 12일)", "https://www.catholicworldreport.com/2024/03/12/coptic-orthodox-church-confirms-dialogue-with-catholic-church-suspended-over-same-sex-blessings/", "링크만"),
  coptic2026: S("The Catholic Herald, 「Coptic Church resumes talks with Rome after assurances on same-sex blessings」(2026년 5월 23일)", "https://thecatholicherald.com/article/coptic-church-resumes-talks-with-rome-after-assurances-on-same-sex-blessings", "링크만"),
  // 해방신학
  gutierrez1971: S("G. Gutiérrez, 『Teología de la liberación: Perspectivas』(Lima: CEP, 1971)", null, "인용만"),
  smith1991: S("C. Smith, 『The Emergence of Liberation Theology』(University of Chicago Press, 1991)", null, "인용만"),
  pew2014: S("Pew Research Center, 「Religion in Latin America: Widespread Change in a Historically Catholic Region」(2014년 11월 13일)", "https://www.pewresearch.org/religion/2014/11/13/religion-in-latin-america/", "링크만"),
  lausanne1974: S("로잔 언약(1974)", "https://lausanne.org/statement/lausanne-covenant", "링크만"),
  cca1981: S("아시아 기독교협의회 신학위원회 편, 『Minjung Theology: People as the Subjects of History』(CCA, 1981)", null, "인용만"),
  rocsocial2000: S("러시아 정교회 주교 회의, 「러시아 정교회 사회 개념의 기초」(2000)", null, "인용만"),
  flow2020: S("세계 총대주교청, 『For the Life of the World: Toward a Social Ethos of the Orthodox Church』(2020)", "https://www.goarch.org/social-ethos", "링크만"),
  // 여성 안수
  limouris1992: S("G. Limouris 편, 『The Place of the Woman in the Orthodox Church and the Question of the Ordination of Women』(로도스 정교회 신학 회의 1988, Tertios, 1992)", null, "인용만"),
  zimbabwe2024: S("Episcopal News Service, 「Eastern Orthodox Church ordains Zimbabwean woman as its first deaconess」(2024년 5월 6일)", "https://episcopalnewsservice.org/2024/05/06/eastern-orthodox-church-ordains-zimbabwean-woman-as-its-first-deaconess/", "링크만"),
  armenian2017: S("The Armenian Weekly, 「Historic Ordination: Tehran Prelacy of the Armenian Church Ordains Deaconess」(2018년 1월 16일)", "https://armenianweekly.com/2018/01/16/historic-ordination-tehran-diocese-armenian-church-ordains-deaconess/", "링크만"),
  chaillot2018: S("C. Chaillot, 「Deaconesses in the Coptic Orthodox Church」, 『Ecclesia Orans』 35(2018)", "https://ecclesiaorans.com/2018/12/14/year-xxxv-2018-2-abstract-c-chaillot/", "인용만"),
  petrocchi2025: S("America, 「Vatican commission on women deacons」(2025년 12월 4일, 페트로키 위원회 보고 공개)", "https://www.americamagazine.org/vatican-dispatch/2025/12/04/women-deacons-vatican-commission/", "링크만"),
  cofe: S("잉글랜드 국교회 누리집", "https://www.churchofengland.org/", "링크만"),
  bfm2000: S("미국 남침례회, 「침례교 신앙과 메시지」(The Baptist Faith and Message, 2000)", "https://bfm.sbc.net/bfm2000/", "링크만"),
  sbc2026: S("Baptist Report, 「Southern Baptists approve first phase of constitutional ban on women pastors」(2026년 6월)", "https://baptistreport.substack.com/p/southern-baptists-approve-first-phase", "링크만"),
  seoul1994: S("서울신문, 「여성 안수기도 최종승인 위해 전력」(1994년 10월 21일)", "https://www.seoul.co.kr/news/1994/10/21/19941021017002", "링크만"),
  nocut2013: S("노컷뉴스, 「침례교, '여성목사 안수' 허용키로 결정」(2013년 9월 25일)", "https://nocutnews.co.kr/news/1104531", "링크만"),
  nocut2026: S("노컷뉴스, 예장합동 제111회 총회 보도(2026년 9월 14일)", "https://nocutnews.co.kr/news/6578015", "링크만"),
  segye2009: S("세계일보, 대한성공회 여성 사제 보도(2009년 7월 7일)", "https://www.segye.com/newsView/20090707003421", "링크만"),
  madigan2005: S("K. Madigan & C. Osiek 편역, 『Ordained Women in the Early Church: A Documentary History』(Johns Hopkins UP, 2005)", null, "인용만"),
  macy2008: S("G. Macy, 『The Hidden History of Women's Ordination』(Oxford UP, 2008)", null, "인용만"),
  chaves1997: S("M. Chaves, 『Ordaining Women: Culture and Conflict in Religious Organizations』(Harvard UP, 1997)", null, "인용만"),
  // 성 윤리
  lambeth1998: S("람베스 회의(1998) 결의 I.10 「인간의 성」", "https://www.anglicancommunion.org/resources/document-library/lambeth-conference/1998/section-i-called-to-full-humanity/section-i10-human-sexuality.aspx", "링크만"),
  gafcon2025: S("Religion News Service, 「Rejecting Canterbury decision, conservative bishops claim lead of Anglican Communion」(2025년 10월 17일)", "https://religionnews.com/2025/10/17/rejecting-canterbury-decision-conservative-bishops-claim-lead-of-anglican-communion/", "링크만"),
  cofe2025: S("Church Times, 「Further synodical approval is needed for same-sex blessings, House of Bishops says」(2025년 10월 17일)", "https://www.churchtimes.co.uk/articles/2025/17-october/news/uk/further-synodical-approval-is-needed-for-same-sex-blessings-house-of-bishops-says", "링크만"),
  umc2024: S("UM Insight, 「Church ends 52-year-old anti-gay stance」(2024년 5월)", "https://um-insight.net/general-conference/general-conference-2024/church-ends-52-year-old-anti-gay-stance", "링크만"),
  kmc2024: S("주간경향, 「성소수자 환대로 출교…실패 아닌 꽃거름이길」(2024년 3월 12일)", "https://weekly.khan.co.kr/article/202403120640021", "링크만"),
  acoe2024: S("아시리아 동방 교회 거룩한 시노드, 「Synodical Statement Concerning Christian Marriage and Issues of Human Sexuality」(2024)", "https://ar.news.assyrianchurch.org/wp-content/uploads/2024/05/English-Synodal-Statement-Concerning-Christian-Marriage-and-Issues-of-Human-Sexuality.pdf", "링크만"),
  rocfs2024: S("Anglican Ink, 「Fiducia Supplicans departs from Christian moral teaching, Russian Orthodox Church rules」(2024년 2월 22일)", "https://anglican.ink/2024/02/22/fiducia-supplicans-departs-from-christian-moral-teaching-russian-orthodox-church-rules/", "링크만"),
  secam2024: S("아프리카·마다가스카르 주교회의 연합(SECAM), 「Fiducia supplicans」에 관한 성명(2024년 1월 11일)", null, "인용만"),
  boswell1980: S("J. Boswell, 『Christianity, Social Tolerance, and Homosexuality』(University of Chicago Press, 1980)", null, "인용만"),
  gagnon2001: S("R. A. J. Gagnon, 『The Bible and Homosexual Practice: Texts and Hermeneutics』(Abingdon, 2001)", null, "인용만"),
  // 우크라이나 정교회
  greece2019: S("Orthodox Times, 「The Church of Greece has recognized the Autocephalous Church of Ukraine」(2019년 10월 12일)", "https://orthodoxtimes.com/the-church-of-greece-has-recognized-the-autocephalous-church-of-ukraine/", "링크만"),
  wikireactions: S("위키백과, 「Reactions of the Eastern Orthodox churches to the 2018 Moscow–Constantinople schism」", "https://en.wikipedia.org/wiki/Reactions_of_the_Eastern_Orthodox_churches_to_the_2018_Moscow%E2%80%93Constantinople_schism", "CC BY-SA"),
  romcomm2018: S("Vatican News, 「Russian Orthodox break communion with Ecumenical Patriarch」(2018년 10월 15일)", "https://www.vaticannews.va/en/world/news/2018-10/russian-orthodox-break-communion-with-ecumenical-patriarch.html", "링크만"),
  africa2021: S("위키백과, 「Patriarchal Exarchate of Africa」", "https://en.wikipedia.org/wiki/Patriarchal_Exarchate_of_Africa", "CC BY-SA"),
  uoc2022: S("RISU, 「Changes to the Statute of Independence instead of cutting ties with Moscow. The UOC-MP holds a Council」(2022년 5월 27일)", "https://risu.ua/en/changes-to-the-statute-of-independence-instead-of-cutting-ties-with-moscow-the-uoc-mp-holds-a-council_n129641", "링크만"),
  mospatkorea2019: S("러시아 정교회 대외교회관계부, 「Archbishop Feofan of Korea: We continue the work that was initiated several centuries ago」(2019)", "https://mospat.ru/en/news/46320", "링크만"),
  nunciature2018: S("AsiaNews, 「Nunciature in Kiev: Ukrainian autocephaly is an internal orthodox affair」(2018년 9월 28일)", "https://www.asianews.it/en/north-asia/russia/nunciature-in-kiev-ukrainian-autocephaly-is-an-internal-orthodox-affair", "링크만"),
  wcc2024: S("Orthodox Times, 「WCC cannot reconcile World Russian People's Council decree describing Ukraine conflict as 'Holy War'」(2024년 4월)", "https://orthodoxtimes.com/wcc-cannot-reconcile-world-russian-peoples-council-decree-describing-ukraine-conflict-as-holy-war/", "링크만"),
  dess2025: S("Babel, 「In Ukraine, the Ukrainian Orthodox Church was recognized as affiliated with the Russian Orthodox Church」(2025년 8월 28일)", "https://babel.ua/en/news/120963-in-ukraine-the-ukrainian-orthodox-church-was-recognized-as-affiliated-with-the-russian-orthodox-church", "링크만"),
  denysenko2018: S("N. E. Denysenko, 『The Orthodox Church in Ukraine: A Century of Separation』(Northern Illinois UP, 2018)", null, "인용만"),
};
