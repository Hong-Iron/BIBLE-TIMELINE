// 화면 이동 기록. 닫기 단추와 휴대폰의 '뒤로'가 바로 앞 화면으로 돌아가게 한다.
// - push: 다른 화면으로 갈 때(연표 → 전시실, 책 → 인물 등). 방문 기록에 한 칸 쌓는다.
// - replace: 같은 화면 안에서 주소만 바뀔 때(전시실 방 넘기기, 책의 탭 바꾸기).
// - back: 앞 화면이 이 사이트 안에 있으면 그리로, 없으면(주소로 바로 들어온 경우) fallback을 부른다.
// - quietly: 방문 기록을 따라 화면을 다시 그릴 때는 기록을 건드리지 않는다.
let silent = false;
const url = (hash) => hash || location.pathname + location.search;
const depth = () => history.state?.bt || 0;

export const nav = {
  push(hash) {
    if (silent || location.hash === (hash || "")) return;
    history.pushState({ bt: depth() + 1 }, "", url(hash));
  },
  replace(hash) {
    if (!silent) history.replaceState(history.state, "", url(hash));
  },
  back(fallback) {
    if (depth() > 0) history.back();
    else fallback();
  },
  quietly(fn) {
    silent = true;
    try { fn(); } finally { silent = false; }
  },
};
