# 바이블 타임라인

> 성경 속 사건을 옆으로 넘기며, 그 사건의 구절과 지도, 그 사건을 뒷받침하는 실제 유물 사진을 함께 보는 웹사이트입니다.

- 주소: https://hong-iron.github.io/BIBLE-TIMELINE/
- 첫 화면은 왼쪽 지도와 오른쪽 연표, 사건을 누르면 열리는 전시실, 인물을 누르면 열리는 인물 프로필로 되어 있습니다. 연표는 기원전 2200년부터 1648년(종교개혁)까지이고, 성경 사건 60개와 교회사 사건 47개, 인물 116명이 들어 있습니다. 머리의 '교회사로 보기'로 교회사 논쟁 30개와 교리의 줄기를 엽니다. 머리의 '성경으로 보기' 단추로 책마다 해설을 열고, 해설에서 '지도로 따라 읽기'와 '당대 배경'으로 넘어갑니다. 연표의 시대 띠를 누르면 그 시대의 배경이 열립니다. 결정 기록과 남은 결정 항목은 [DESIGN.md](DESIGN.md)에, 교회사·신학 논쟁 확장 계획은 [CHURCH_HISTORY.md](CHURCH_HISTORY.md)에, 당대 배경(사건, 문화, 문학, 수사학)을 쓸 때 근거로 삼을 자료와 이용 조건은 [SOURCES.md](SOURCES.md)에 있습니다.
- 이 저장소의 문서와 화면 문구는 [Humanize.md](Humanize.md)의 규칙으로 씁니다.

## 폴더와 담는 파일

| 폴더 | 담는 파일 |
|---|---|
| `site/` | GitHub Pages(저장소의 HTML 파일을 그대로 웹사이트로 띄워 주는 GitHub의 무료 호스팅)에 올라가는 파일 전체. 빌드 단계 없이 그대로 배포합니다 |
| `site/index.html`, `site/app.js`, `site/profile.js`, `site/book.js`, `site/story.js`, `site/debate.js`, `site/search.js`, `site/nav.js` | 사이트 첫 화면. 왼쪽 지도와 오른쪽 연표·전시실(`app.js`), 인물 프로필(`profile.js`), 성경 66권 목록과 책 해설(`book.js`), 책의 사건을 내려 읽으면 지도가 따라 움직이는 '지도로 따라 읽기'(`story.js`), 교회사 목록·논쟁·교리의 줄기(`debate.js`), 사건·인물·성경·논쟁을 한 칸에서 찾는 찾기(`search.js`), 화면 이동 기록(`nav.js`, 돌아가기가 바로 앞 화면으로 가게 함) |
| `site/d/` | 예전 주소. 첫 화면으로 넘겨 주며, 주소 끝의 `#사건 이름`도 그대로 넘깁니다 |
| `site/shared/` | 모든 화면이 함께 쓰는 사건 자료(처음 만든 11개는 `data.js`, 나머지 49개는 `events_more.js`), 인물 프로필 자료(`profiles.js`와 시대별 묶음 `profiles_g1.js`~`profiles_g4.js`), 성경 66권 목록(`books.js`)과 책 해설(`guides.js`와 갈래별 묶음 `guides_g1.js`~`guides_g7.js`), 책 해설에만 나오는 장소(`places_story.js`와 묶음 `places_g1.js`~`places_g7.js`), 교회사 시대·사건·인물·장소(`church_events.js`와 묶음 `church_ev1.js`~`church_ev3.js`, 프로필 `profiles_c1.js`~`profiles_c3.js`), 교회사 논쟁(`controversies.js`와 묶음 `controversies_1.js`~`controversies_3.js`, 연표용 색인 `controversy_index.js`), 당대 배경(`backgrounds.js`와 시대 묶음 `bg_e1.js`·`bg_e2.js`·교회사 `bg_c1.js`·`bg_c2.js`, 책 묶음 `bg_g1.js`~`bg_g7.js`), 배경의 출처 목록(`sources.js`), 사건과 프로필 장절의 개역한글 본문(`verses.js`, 스크립트가 만듦. 연표 사건 것만 따로 `verses_events.js`), 지도 그리기(`map.js`), 지도 모양(`geo.json`), 사진 출처(`credits.json`) |
| `site/img/` | 유물 사진. 긴 변을 1200 px 이하로 줄인 JPEG와, 목록·연표 칸에 쓰는 320 px 판(`img/sm/`) |
| `promo/` | 카톡·SNS에 올릴 소개 그림 10장(한눈에 보기, 기능 8가지, 휴대폰 화면). `tools/promo.mjs`가 만듦. 사이트에는 올라가지 않습니다 |
| `tools/` | 사진을 내려받는 스크립트(`fetch_images.py`), 프로필 장절의 본문을 뽑고 주장과 대조하는 스크립트(`build_verses.py`), 책 해설의 장소를 점검하는 스크립트(`check_places.mjs`), 당대 배경을 점검하는 스크립트(`check_bg.mjs`), 교회사 자료를 점검하는 스크립트(`check_church.mjs`), 인물 프로필을 점검하는 스크립트(`check_profiles.mjs`), 지도 모양을 잘라 내는 스크립트(`crop_geo.mjs`), 헤드리스 크롬으로 화면을 열어 검사하고 찍는 스크립트(`headless.mjs`, `CPU=4`로 휴대폰 속도, `PROFILE`로 함수별 시간, `SCALE=2`로 2배 해상도), 카톡·SNS 소개 그림을 `promo/`에 만드는 스크립트(`promo.mjs`), 내 컴퓨터에서 띄우는 미리보기 서버(`serve.py`), 링크 공유 그림(`og.html`을 `og.sh`가 찍어 `site/og.jpg`로 저장) |

## 내 컴퓨터에서 보기

```bash
python3 tools/serve.py 8793
```

브라우저에서 `http://localhost:8793/`을 엽니다. `python3 -m http.server`도 되지만, 모듈 수십 개를 한꺼번에 받다가 연결이 끊길 때가 있어 대기열을 늘린 `serve.py`를 씁니다. `main`에 push하면 GitHub Actions(GitHub가 push마다 자동으로 돌리는 작업)가 `site/`를 Pages로 배포합니다.

## 쓰는 외부 자료

| 이름 | 무엇인가 | 우리 코드에서 하는 일 | 주의할 점 |
|---|---|---|---|
| 개역한글 | 1961년에 나온 한국어 성경 번역본으로, 저작권 보호 기간이 끝나 누구나 쓸 수 있음. 본문 파일은 [bluesaurel/Korean-Bible-1961-KRV](https://github.com/bluesaurel/Korean-Bible-1961-KRV)의 JSON | `tools/build_verses.py`가 사건과 프로필에 적힌 장절의 본문을 `verses.js`로 뽑고, `data.js`가 사건의 `verse`를 이 본문으로 채웁니다 | 저장소가 대한성서공회 공개 화면과 대조했다고 밝히지만 공식 정본은 아닙니다. 대한성서공회는 저작자 이름 표시와 본문을 고치지 않는 조건을 요구합니다 |
| Wikimedia Commons | 위키백과가 쓰는 사진과 그림을 자유 이용 허락과 함께 모아 둔 저장소 | `tools/fetch_images.py`가 사진을 받고, 작성자·이용 허락·원본 주소를 `credits.json`에 적습니다. 화면은 사진마다 이 정보를 보여 줍니다 | CC BY-SA(작성자 이름과 같은 허락 조건을 붙이면 고쳐 쓰고 다시 배포해도 되는 이용 허락) 사진은 출처 줄을 지우면 안 됩니다 |
| Natural Earth | 해안선, 강, 호수 모양을 누구나 쓸 수 있게 공개한 세계 지도 자료(퍼블릭 도메인) | `tools/crop_geo.mjs`가 동경 0~66도, 북위 15~50도만 잘라 `geo.json`으로 저장합니다 | 오늘날의 해안선과 호수입니다. 사해는 지금 모양이라 고대보다 작게 그려집니다 |
| d3 7.9.0 | 자료를 받아 SVG 그림(지도, 연표)으로 그려 주는 JavaScript 라이브러리(ISC 허락) | 한 파일로 묶은 판을 `site/vendor/d3-7.9.0.js`에 두고 `app.js`와 `map.js`가 불러옵니다 | 판을 올릴 때는 esm.sh의 `d3@<판>/es2022/d3.bundle.mjs`를 받아 바꿉니다 |
| BibleProject | 성경 각 권을 짧은 애니메이션 영상으로 소개하는 비영리 단체의 자료 | 책 해설을 쓸 때 책의 짜임과 큰 주제를 확인하는 참고로만 읽었고, 해설 화면에 해당 책의 개요 영상 페이지 링크를 붙입니다 | 문장과 그림은 가져오지 않습니다. 해설의 문장은 모두 새로 썼습니다 |
