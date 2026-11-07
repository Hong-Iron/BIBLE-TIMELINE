// 홍철: 오른쪽 아래의 픽셀 로봇. 블로그(Hongs_Blog)의 홍철을 옮겨 왔고, 여기서는 철민의 팡세(묵상 글)에 쓴 생각으로
// 신앙 질문에 답한다. 말풍선에는 세 가지가 있다.
//   질문하기   정해 둔 질문과 답(답마다 이어서 물을 질문이 달린다)
//   대화하기   분기형 대화: 방문자가 할 말을 고르면 홍철이 답하고, 그 답에서 다시 고를 말이 이어진다
//   아무 얘기나 팡세에서 가져온 한마디(다 나올 때까지 겹치지 않는다)
// 대사는 shared/hongcheol.json(형식은 tools/check_hongcheol.mjs 머리말)이고 말풍선을 처음 열 때 받는다.
// 지금 보는 화면(사건·인물·논쟁·책)과 이어진 대화(tags)를 먼저 꺼내고, 답의 link를 누르면 그 화면으로 간다.
import { FACE } from "./hongcheol_face.js";

const DATA_URL = new URL("./shared/hongcheol.json", import.meta.url).href;
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

// getContext(): { keys: ["c-justification", "p-luther", ...], label: "칭의 논쟁" } 지금 보는 화면
// onLink(hash): 답에 달린 화면으로 간다(예: "#c-justification")
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

  let script = null, loading = null, typing = null, bag = [], qShown = 0, ctx = { keys: [], label: "" };

  function load(then) {
    if (script) return then();
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = FONT_URL;
      document.head.appendChild(l);
    }
    loading ??= fetch(DATA_URL).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { script = d; }).catch(() => { loading = null; });
    loading.then(() => (script ? then() : say("어, 지금은 말이 잘 안 나오네요. 잠시 뒤에 다시 눌러 주세요.")));
  }

  /* -- 기억: 이 브라우저 안에만 둔다(방문 횟수, 마지막 방문, 시작한 대화). 아무 데도 보내지 않는다. -- */
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(MEM_KEY) || "{}") || {}; } catch { mem = {}; }
  if (!Array.isArray(mem.heard)) mem.heard = [];
  const heard = mem.heard;
  const save = () => { try { localStorage.setItem(MEM_KEY, JSON.stringify(mem)); } catch { /* 저장소를 못 쓰면 잊는다 */ } };
  function forget() {
    heard.length = 0;
    mem = { heard, visits: 1, last: Date.now(), welcomed: true };
    try { localStorage.removeItem(MEM_KEY); } catch { /* 저장소를 못 쓰면 그대로 */ }
  }
  (() => {
    let fresh = true;
    try { fresh = sessionStorage.getItem("hongcheol-visit") !== "1"; sessionStorage.setItem("hongcheol-visit", "1"); } catch { /* 막힘 */ }
    if (fresh) { mem.prevLast = mem.last || null; mem.visits = (mem.visits || 0) + 1; mem.welcomed = false; }
    mem.last = Date.now();
    save();
  })();

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
    typing.timer = setTimeout(step, /[.!?…]/.test(ch) ? 150 : /[,·]/.test(ch) ? 80 : 22);
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

  /* -- 고르기 -- */
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
  const linkChoice = (n) => (n && n.link ? [{ label: `${n.link_label || "화면 보러 가기"} →`, kind: "primary", run: () => { close(); onLink(n.link); } }] : []);

  /* -- 지금 보는 화면과 이어진 것 -- */
  const tagged = (list) => list.filter((n) => (n.tags || []).some((t) => ctx.keys.includes(t)));

  /* -- 화면 -- */
  function menu() {
    const here = tagged(script.chats || []).length + tagged(script.questions || []).length;
    choices([
      ...(here ? [{ label: `'${ctx.label}' 얘기 할래요`, run: hereTopics, kind: "primary" }] : []),
      { label: "질문하기", run: questions, kind: here ? undefined : "primary" },
      { label: "대화하기", run: topics },
      { label: "아무 얘기나 해 줘요", run: talk, kind: "quiet" },
    ]);
  }
  function home(again) {
    if (!again && welcomeBack()) return;
    say(again ? pick(script.again) || "또 뭐 할까요?" : pick(script.greeting) || "안녕하세요!", menu);
  }
  function welcomeBack() {
    const wb = script.welcome_back;
    if (!wb || mem.welcomed || !mem.prevLast || (mem.visits || 0) < 2) return false;
    mem.welcomed = true;
    save();
    const days = Math.floor((Date.now() - mem.prevLast) / 86400000);
    vars.days = days; vars.visits = mem.visits;
    const parts = [pick(days < 1 ? wb.same_day : days < 14 ? wb.days : wb.long)];
    if ([5, 10, 20, 50, 100].includes(mem.visits) && wb.visits) parts.push(pick(wb.visits));
    const t = mem.thread, node = t && !t.done ? (script.chats || []).find((c) => c.q === t.q) : null;
    if (node && wb.resume) {
      vars.topic = node.q;
      parts.push(pick(wb.resume));
      say(parts.join(" "), () => choices([
        { label: "이어서 할래요", run: () => reply(node, topics), kind: "primary" },
        { label: "다른 거 할래요", run: () => { mem.thread = null; save(); home(true); } },
      ]));
    } else say(parts.join(" "), menu);
    return true;
  }

  // 질문하기: 한 번에 여섯 개씩, 지금 화면과 이어진 질문을 먼저
  function questions(more) {
    const all = script.questions || [];
    if (more !== true) qShown = 0;
    const order = [...tagged(all), ...shuffled(all.filter((q) => !tagged(all).includes(q)))];
    const page = order.slice(qShown, qShown + 6);
    qShown += 6;
    say(pick(script.ask) || "뭐가 궁금해요?", () => choices([
      ...page.map((q) => ({ label: q.q, run: () => reply(q, questions) })),
      ...(qShown < order.length ? [{ label: "다른 질문도 볼래요", run: () => questions(true) }] : []),
      { label: "처음으로", run: () => home(true), kind: "quiet" },
    ]));
  }

  // 대화하기: 아직 안 한 대화부터 넷
  function offer(list) {
    const fresh = list.filter((c) => !heard.includes(c.q));
    return shuffled(fresh.length ? fresh : list).slice(0, 4);
  }
  function topics() { listTopics(offer(script.chats || []), pick(script.chat_prompt) || "무슨 얘기 할까요?", topics); }
  function hereTopics() {
    const list = [...tagged(script.chats || []), ...tagged(script.questions || [])];
    listTopics(shuffled(list).slice(0, 5), fill(pick(script.here_prompt) || "'{here}' 얘기라면 이런 게 있어요."), hereTopics);
  }
  function listTopics(list, prompt, again) {
    if (!list.length) return talk();
    say(prompt, () => choices([
      ...list.map((c) => ({ label: c.q, run: () => { startThread(c); reply(c, again); } })),
      { label: "다른 얘기는 없어요?", run: again },
      { label: "처음으로", run: () => home(true), kind: "quiet" },
    ]));
  }
  function startThread(c) {
    if (!heard.includes(c.q)) heard.push(c.q);
    if (heard.length > 400) heard.splice(0, heard.length - 400);
    mem.thread = { q: c.q, done: false };
    save();
  }
  // 한 번 주고받기: 홍철이 답하고, 이어서 할 말을 꺼낸다. 막다른 데서는 같은 대화에서 아직 안 고른 말을 다시 꺼낸다.
  function reply(node, back, rest = []) {
    rest = rest.filter((n) => n !== node);
    if (node.action === "forget") forget();
    say(pick(node.a), () => {
      const kids = node.next || [];
      if (!kids.length && back === topics && mem.thread) { mem.thread.done = true; save(); }
      const offerList = kids.length ? kids : rest.slice(0, 3);
      const carry = kids.length ? rest : rest.slice(3);
      const next = offerList.map((n) => ({ label: n.q, run: () => reply(n, back, offerList.filter((o) => o !== n).concat(carry)) }));
      const tail = next.length
        ? [{ label: back === questions ? "다른 거 물어볼래요" : "다른 얘기 해요", run: back, kind: "quiet" }]
        : [{ label: back === questions ? "다른 것도 물어볼래요" : "다른 얘기 해요", run: back }, { label: "처음으로", run: () => home(true), kind: "quiet" }];
      choices([...next, ...linkChoice(node), ...tail]);
    });
  }
  function talk() {
    const lines = script.talk || [];
    if (!lines.length) return home(true);
    if (!bag.length) bag = shuffled(lines);
    const line = bag.pop();
    say(pick(line.text), () => choices([
      ...linkChoice(line),
      { label: "더 얘기해 줘요", run: talk },
      { label: "대화할래요", run: topics },
      { label: "물어볼 게 있어요", run: questions, kind: "quiet" },
    ]));
  }

  /* -- 열고 닫기 -- */
  function open() {
    root.classList.remove("has-hint");
    try { sessionStorage.setItem("hongcheol-seen", "1"); } catch { /* 막힘 */ }
    ctx = getContext() || { keys: [], label: "" };
    vars.here = ctx.label;
    nameSmall.textContent = ctx.label ? ` · ${ctx.label}` : "";
    dialog.hidden = false;
    root.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    dialog.focus({ preventScroll: true });
    if (script) return home();
    textEl.textContent = "…";
    load(() => home());
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
