// 인물의 생김새를 확실히 보여 주는 사진이나 생전 초상. 인물 프로필 맨 위, 이름 옆에 보인다.
// 성경 인물과 고대·중세 인물처럼 후대에 상상해서 그린 그림만 있는 사람은 넣지 않는다.
// { 인물 id: { img: 사진 열쇠(site/img/<열쇠>.jpg), kind: "사진" | "생전 초상", madeLabel, by?, note } }
// 사진 파일은 PORTRAIT_IMG(열쇠 → 위키미디어 공용 파일)에 적으면 tools/fetch_images.py가 받는다. 이미 다른 곳에서 받은 사진은 그 열쇠를 그대로 쓴다.
export const PORTRAITS = {};
export const PORTRAIT_IMG = {};
