// 홍철: 오른쪽 아래의 픽셀 로봇. 블로그(Hongs_Blog)의 홍철과 같은 얼굴과 말풍선이고, 여기서는 방문자가 지금 보고 있는 자리
// (사건·인물·논쟁·성경 책·시대·교리의 줄기)에서 물을 법한 질문에 답한다. 답은 사이트를 만든 사람의 생각하는 방식으로 썼다.
// 방문자는 글을 입력하지 않고 질문을 골라 누르며, 답마다 이어서 물을 질문이 갈라진다.
//   shared/hongcheol.json          인사말과 자리 목록(spots: 열쇠 → 이름). 말풍선을 처음 열 때 받는다.
//   shared/hongcheol/<열쇠>.json   그 자리의 질문과 답. 그 자리에서 처음 열 때 받는다.
// 형식은 tools/check_hongcheol.mjs 머리말.
import { FACE } from "./hongcheol_face.js";

const BASE = new URL("./shared/", import.meta.url).href;
const FONT_URL = "https://cdn.jsdelivr.net/npm/galmuri@2.40.3/dist/galmuri.css";
const MEM_KEY = "hongcheol-memory";
const pick = (v) => (Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v);
const shuffled = (list) => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const TAIL = '<svg class="robot__tail" viewBox="0 0 6 5" shape-rendering="crispEdges" aria-hidden="true" focusable="false">'
  + [[0, 0, 1], [5, 0, 1], [1, 1, 1], [5, 1, 1], [2, 2, 1], [5, 2, 1], [3, 3, 1], [5, 3, 1], [4, 4, 2]].map(([x, y, w]) => `<rect class="robot__tail-ink" x="${x}" y="${y}" width="${w}" height="1"/>`).join("")
  + [[1, 0, 4], [2, 1, 3], [3, 2, 2], [4, 3, 1]].map(([x, y, w]) => `<rect class="robot__tail-fill" x="${x}" y="${y}" width="${w}" height="1"/>`).join("")
  + "</svg>";

// getContext(): { keys: [지금 자리, 이어진 자리…], label } — 예: 사건이면 ["ev-…", "c-…", "p-…", "e-…"]
// onLink(hash): 그 화면으로 간다(예: "#c-justification")
export function createHongcheol({ getContext, onLink }) {
  const root = document.createElement("div");
  root.className = "robot";
  root.innerHTML = `
    <div class="robot__dialog" role="dialog" aria-label="홍철과 대화" tabindex="-1" hidden>
      <span class="robot__name">홍철<small></small></span>
      <button type="button" class="robot__close" aria-label="닫기">&times;</button>
      <p class="robot__text" aria-hidden="true"></p>
      <p class="robot__live" aria-live="polite"></p>
      <span class="robot__more" aria-hidden="true"></span>
      ${TAIL}
      <div class="robot__choices"></div>
    </div>
    <span class="robot__hint" aria-hidden="true">!</span>
    <button type="button" class="robot__button" aria-label="홍철에게 물어보기" aria-haspopup="dialog" aria-expanded="false">${FACE}</button>`;
  document.body.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const button = $(".robot__button"), dialog = $(".robot__dialog"), textEl = $(".robot__text"), liveEl = $(".robot__live");
  const choicesEl = $(".robot__choices"), nameSmall = $(".robot__name small");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let base = null, baseLoading = null, typing = null, ctx = { keys: [], label: "" }, here = null;
  const spots = new Map(); // 열쇠 → 받은 자리(또는 받는 중인 Promise)

  function loadBase() {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = FONT_URL;
      document.head.appendChild(l);
    }
    baseLoading ??= fetch(`${BASE}hongcheol.json`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => (base = d)).catch(() => { baseLoading = null; return null; });
    return baseLoading;
  }
  const hasSpot = (k) => !!base?.spots?.[k];
  function loadSpot(k) {
    if (!hasSpot(k)) return Promise.resolve(null);
    if (!spots.has(k)) spots.set(k, fetch(`${BASE}hongcheol/${encodeURIComponent(k)}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
    return spots.get(k);
  }

  /* -- 기억: 이 브라우저 안에만 둔다(방문 횟수, 마지막 방문, 이미 들은 질문). 아무 데도 보내지 않는다. -- */
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(MEM_KEY) || "{}") || {}; } catch { mem = {}; }
  if (!Array.isArray(mem.heard)) mem.heard = [];
  const save = () => { try { localStorage.setItem(MEM_KEY, JSON.stringify(mem)); } catch { /* 저장소를 못 쓰면 잊는다 */ } };
  (() => {
    let fresh = true;
    try { fresh = sessionStorage.getItem("hongcheol-visit") !== "1"; sessionStorage.setItem("hongcheol-visit", "1"); } catch { /* 막힘 */ }
    if (fresh) { mem.prevLast = mem.last || null; mem.visits = (mem.visits || 0) + 1; mem.welcomed = false; }
    mem.last = Date.now();
    save();
  })();
  const heard = (k, q) => mem.heard.includes(`${k}|${q}`);
  const markHeard = (k, q) => { if (!heard(k, q)) { mem.heard.push(`${k}|${q}`); if (mem.heard.length > 600) mem.heard.splice(0, mem.heard.length - 600); save(); } };

  /* -- 글자 -- */
  const vars = {};
  const fill = (t) => String(t || "").replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  function say(text, then) {
    stopTyping();
    const full = fill(text);
    const active = document.activeElement;
    if (!dialog.hidden && (active === document.body || dialog.contains(active))) dialog.focus({ preventScroll: true });
    liveEl.textContent = full;
    dialog.classList.remove("is-done");
    choicesEl.innerHTML = "";
    if (reduceMotion) { textEl.textContent = full; return finish(then); }
    dialog.classList.add("is-typing");
    root.classList.add("is-talking");
    textEl.textContent = "";
    typing = { full, i: 0, timer: 0, then };
    step();
  }
  function step() {
    if (!typing) return;
    typing.i++;
    textEl.textContent = typing.full.slice(0, typing.i);
    if (typing.i >= typing.full.length) return finish(typing.then);
    const ch = typing.full.charAt(typing.i - 1);
    typing.timer = setTimeout(step, /[.!?…]/.test(ch) ? 150 : /[,·]/.test(ch) ? 80 : 20);
  }
  function skip() { if (typing) { const then = typing.then; textEl.textContent = typing.full; finish(then); } }
  function stopTyping() { if (typing) clearTimeout(typing.timer); typing = null; }
  function finish(then) {
    stopTyping();
    dialog.classList.remove("is-typing");
    dialog.classList.add("is-done");
    root.classList.remove("is-talking");
    if (then) then();
  }
  function choices(list) {
    choicesEl.innerHTML = "";
    for (const c of list) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "robot__choice" + (c.kind ? ` robot__choice--${c.kind}` : "");
      el.textContent = c.label;
      el.addEventListener("click", c.run);
      choicesEl.appendChild(el);
    }
    choicesEl.scrollTop = 0;
    const first = choicesEl.querySelector(".robot__choice");
    if (first && document.activeElement === dialog) first.focus({ preventScroll: true });
  }
  const go = (hash) => { close(); onLink(hash); };
  const linkChoice = (n) => (n && n.link ? [{ label: `${n.link_label || "화면 보러 가기"} →`, kind: "primary", run: () => go(n.link) }] : []);

  /* -- 화면 -- */
  // 지금 자리의 질문(아직 안 들은 것부터)과, 이어진 자리(등장인물·논쟁·시대)로 넘어가는 단추
  function spotMenu(spot, prompt) {
    const qs = spot.questions || [];
    const fresh = qs.filter((n) => !heard(spot.key, n.q));
    const list = (fresh.length ? fresh : qs).slice(0, 4);
    const related = ctx.keys.filter((k) => k !== spot.key && hasSpot(k)).slice(0, 2);
    say(prompt, () => choices([
      ...list.map((n) => ({ label: n.q, run: () => ask(spot, n, qs.filter((o) => o !== n)) })),
      ...related.map((k) => ({ label: `${base.spots[k]} 얘기도 해요`, run: () => openSpot(k, true) })),
      { label: "다른 데 얘기도 들려줘요", run: elsewhere, kind: "quiet" },
    ]));
  }
  async function openSpot(k, moved) {
    const spot = await loadSpot(k);
    if (!spot || !(spot.questions || []).length) return nowhere();
    here = spot;
    vars.here = spot.title;
    nameSmall.textContent = ` · ${spot.title}`;
    spotMenu(spot, pick(moved ? base.related_prompt : base.greeting) || "'{here}' 보고 계시네요. 이런 게 궁금하지 않아요?");
  }
  // 이 자리에서 한 번 묻고 답하기. 막다른 데서는 아직 안 물은 같은 자리 질문을 다시 꺼낸다.
  function ask(spot, node, rest) {
    markHeard(spot.key, node.q);
    say(pick(node.a), () => {
      const kids = node.next || [];
      const offer = kids.length ? kids : rest.filter((n) => !heard(spot.key, n.q)).slice(0, 3);
      choices([
        ...offer.map((n) => ({ label: n.q, run: () => ask(spot, n, kids.length ? rest : rest.filter((o) => o !== n)) })),
        ...linkChoice(node),
        { label: "처음 질문으로", run: () => spotMenu(spot, pick(base.again) || "또 뭐가 궁금해요?"), kind: "quiet" },
      ]);
    });
  }
  // 다른 자리 하나를 골라 그 자리 질문을 맛보기로 보여 주고, 그 화면으로 갈 수 있게 한다.
  async function elsewhere() {
    const keys = Object.keys(base.spots).filter((k) => k !== here?.key);
    if (!keys.length) return say(pick(base.nowhere), () => choices([{ label: "닫기", run: close, kind: "quiet" }]));
    const k = keys[Math.floor(Math.random() * keys.length)];
    const spot = await loadSpot(k);
    if (!spot) return nowhere();
    const n = pick(spot.questions);
    say(fill(pick(base.elsewhere_prompt) || "'{there}'에서는 이런 질문이 나와요.").replace("{there}", spot.title), () => choices([
      { label: n.q, run: () => { here = spot; vars.here = spot.title; nameSmall.textContent = ` · ${spot.title}`; ask(spot, n, spot.questions.filter((o) => o !== n)); } },
      { label: `'${spot.title}' 화면으로 갈래요 →`, kind: "primary", run: () => go(spot.link) },
      { label: "다른 데도요", run: elsewhere },
      ...(here ? [{ label: "아까 보던 데로", run: () => spotMenu(here, pick(base.again)), kind: "quiet" }] : []),
    ]));
  }
  function nowhere() {
    nameSmall.textContent = "";
    say(pick(base.nowhere) || "사건이나 인물, 논쟁을 하나 열어 보세요. 그 자리에서 물을 만한 걸 얘기해 드릴게요.", () => choices([
      { label: "아무 데나 골라 줘요", run: elsewhere, kind: "primary" },
      { label: "괜찮아요", run: close, kind: "quiet" },
    ]));
  }
  function welcomeLine() {
    const wb = base.welcome_back;
    if (!wb || mem.welcomed || !mem.prevLast || (mem.visits || 0) < 2) return "";
    mem.welcomed = true;
    save();
    const days = Math.floor((Date.now() - mem.prevLast) / 86400000);
    vars.days = days; vars.visits = mem.visits;
    return `${pick(days < 1 ? wb.same_day : days < 14 ? wb.days : wb.long)} `;
  }

  /* -- 열고 닫기 -- */
  async function open() {
    root.classList.remove("has-hint");
    try { sessionStorage.setItem("hongcheol-seen", "1"); } catch { /* 막힘 */ }
    ctx = getContext() || { keys: [], label: "" };
    dialog.hidden = false;
    root.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    dialog.focus({ preventScroll: true });
    if (!base) { textEl.textContent = "…"; await loadBase(); }
    if (!base) return say("어, 지금은 말이 잘 안 나오네요. 잠시 뒤에 다시 눌러 주세요.");
    const wl = welcomeLine();
    const k = ctx.keys.find(hasSpot);
    if (!k) return nowhere();
    const spot = await loadSpot(k);
    if (!spot) return nowhere();
    here = spot;
    vars.here = spot.title;
    nameSmall.textContent = ` · ${spot.title}`;
    spotMenu(spot, wl + fill(pick(base.greeting)));
  }
  function close() {
    stopTyping();
    dialog.hidden = true;
    root.classList.remove("is-open", "is-talking");
    button.setAttribute("aria-expanded", "false");
  }
  button.addEventListener("click", () => (dialog.hidden ? open() : close()));
  $(".robot__close").addEventListener("click", close);
  textEl.addEventListener("click", skip);
  dialog.addEventListener("keydown", (e) => {
    // 말풍선 안의 키는 연표·화면 이동 키로 넘기지 않는다.
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); close(); button.focus(); }
    else if ((e.key === "Enter" || e.key === " ") && typing && e.target === dialog) { e.preventDefault(); skip(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const items = [...choicesEl.querySelectorAll(".robot__choice")];
      if (!items.length) return;
      e.preventDefault();
      const i = items.indexOf(document.activeElement);
      items[i < 0 ? 0 : (i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
    }
  });
  document.addEventListener("click", (e) => { if (!dialog.hidden && e.target.isConnected && !root.contains(e.target)) close(); });
  let seen = false;
  try { seen = sessionStorage.getItem("hongcheol-seen") === "1"; } catch { /* 막힘 */ }
  if (!seen) setTimeout(() => { if (dialog.hidden) root.classList.add("has-hint"); }, 3000);

  return { open, close, isOpen: () => !dialog.hidden };
}
