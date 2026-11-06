# 바이블 타임라인

> 성경 속 사건을 옆으로 넘기며, 그 사건의 구절과 지도, 그 사건을 뒷받침하는 실제 유물 사진을 함께 보는 웹사이트입니다.

- 주소: https://hong-iron.github.io/BIBLE-TIMELINE/
- 첫 화면은 왼쪽 지도와 오른쪽 연표, 사건을 누르면 열리는 전시실, 인물을 누르면 열리는 인물 프로필로 되어 있습니다. 대표 사건 60개와 인물 52명이 들어 있습니다. 화면 구성을 정하려고 만든 시안 세 개는 `/drafts/`에 남겨 두었습니다. 결정 기록과 남은 결정 항목은 [DESIGN.md](DESIGN.md)에 있습니다.
- 이 저장소의 문서와 화면 문구는 [Humanize.md](Humanize.md)의 규칙으로 씁니다.

## 폴더와 담는 파일

| 폴더 | 담는 파일 |
|---|---|
| `site/` | GitHub Pages(저장소의 HTML 파일을 그대로 웹사이트로 띄워 주는 GitHub의 무료 호스팅)에 올라가는 파일 전체. 빌드 단계 없이 그대로 배포합니다 |
| `site/index.html`, `site/app.js`, `site/profile.js` | 사이트 첫 화면. 왼쪽 지도와 오른쪽 연표·전시실(`app.js`), 인물 프로필(`profile.js`) |
| `site/drafts/` | 화면 구성을 정하려고 만든 시안 목록 |
| `site/a/`, `site/b/`, `site/c/` | 비교했던 시안 A 두루마리, 시안 B 박물관 회랑, 시안 C 동시대 차선. 표본 사건 11개만 보여 줍니다 |
| `site/d/` | 예전 결합안 주소. 첫 화면으로 넘겨 주며, 주소 끝의 `#사건 이름`도 그대로 넘깁니다 |
| `site/shared/` | 모든 화면이 함께 쓰는 사건 자료(표본 11개는 `data.js`, 나머지 49개는 `events_more.js`), 인물 프로필 자료(`profiles.js`와 시대별 묶음 `profiles_g1.js`~`profiles_g4.js`), 사건과 프로필 장절의 개역한글 본문(`verses.js`, 스크립트가 만듦), 지도 그리기(`map.js`), 지도 모양(`geo.json`), 사진 출처(`credits.json`) |
| `site/img/` | 유물 사진. 긴 변을 1200 px 이하로 줄인 JPEG와, 목록·연표 칸에 쓰는 320 px 판(`img/sm/`) |
| `tools/` | 사진을 내려받는 스크립트(`fetch_images.py`), 프로필 장절의 본문을 뽑고 주장과 대조하는 스크립트(`build_verses.py`), 지도 모양을 잘라 내는 스크립트(`crop_geo.mjs`), 시안 목록의 미리보기 사진을 찍는 스크립트(`thumbs.sh`) |

## 내 컴퓨터에서 보기

```bash
python3 -m http.server 8793 --directory site
```

브라우저에서 `http://localhost:8793/`을 엽니다. `main`에 push하면 GitHub Actions(GitHub가 push마다 자동으로 돌리는 작업)가 `site/`를 Pages로 배포합니다.

## 쓰는 외부 자료

| 이름 | 무엇인가 | 우리 코드에서 하는 일 | 주의할 점 |
|---|---|---|---|
| 개역한글 | 1961년에 나온 한국어 성경 번역본으로, 저작권 보호 기간이 끝나 누구나 쓸 수 있음. 본문 파일은 [bluesaurel/Korean-Bible-1961-KRV](https://github.com/bluesaurel/Korean-Bible-1961-KRV)의 JSON | `tools/build_verses.py`가 사건과 프로필에 적힌 장절의 본문을 `verses.js`로 뽑고, `data.js`가 사건의 `verse`를 이 본문으로 채웁니다 | 저장소가 대한성서공회 공개 화면과 대조했다고 밝히지만 공식 정본은 아닙니다. 대한성서공회는 저작자 이름 표시와 본문을 고치지 않는 조건을 요구합니다 |
| Wikimedia Commons | 위키백과가 쓰는 사진과 그림을 자유 이용 허락과 함께 모아 둔 저장소 | `tools/fetch_images.py`가 사진을 받고, 작성자·이용 허락·원본 주소를 `credits.json`에 적습니다. 화면은 사진마다 이 정보를 보여 줍니다 | CC BY-SA(작성자 이름과 같은 허락 조건을 붙이면 고쳐 쓰고 다시 배포해도 되는 이용 허락) 사진은 출처 줄을 지우면 안 됩니다 |
| Natural Earth | 해안선, 강, 호수 모양을 누구나 쓸 수 있게 공개한 세계 지도 자료(퍼블릭 도메인) | `tools/crop_geo.mjs`가 동경 0~66도, 북위 15~50도만 잘라 `geo.json`으로 저장합니다 | 오늘날의 해안선과 호수입니다. 사해는 지금 모양이라 고대보다 작게 그려집니다 |
| d3 | 자료를 받아 SVG 그림(지도, 차트)으로 그려 주는 JavaScript 라이브러리(ISC 허락) | `map.js`가 jsDelivr에서 불러와 메르카토르 도법으로 지도를 그립니다 | 외부 CDN이 막히면 지도가 그려지지 않습니다 |
