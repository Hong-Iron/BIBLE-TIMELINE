// 고대 근동 지도. 사건의 장소들이 화면에 들어오도록 부드럽게 옮겨 간다.
// 사용: const map = await createMap(el, theme); map.show(event)
import * as d3 from "../vendor/d3-7.9.0.js";
import { PLACES } from "./data.js";

const BASE = new URL(".", import.meta.url).href;
let geoPromise;
const loadGeo = () => (geoPromise ??= fetch(`${BASE}geo.json`).then((r) => r.json()));

export const THEMES = {
  parchment: { sea: "#c9d0c0", land: "#f1e6c9", coast: "#8a6f45", river: "#7c93a3", lake: "#b9c3c2", route: "#8b2d1f", dot: "#3b2a1a", label: "#3b2a1a", halo: "#efe4c8", muted: "#7a6a55", water: "#5f7484", region: "#a08a6a", font: "'Gowun Batang', serif" },
  night: { sea: "#0b0d10", land: "#1c1915", coast: "#4a4031", river: "#33536b", lake: "#1d2a33", route: "#e8b04b", dot: "#f3e3c0", label: "#e9dcc0", halo: "#1c1915", muted: "#a3958a", water: "#7fa2bd", region: "#7c7064", font: "'Noto Serif KR', serif" },
  atlas: { sea: "#dfe7ec", land: "#f7f5ef", coast: "#9aa6ad", river: "#8fb2c9", lake: "#bcd2df", route: "#c2410c", dot: "#1c1b19", label: "#1c1b19", halo: "#f7f5ef", muted: "#6f695e", water: "#557a93", region: "#9d9283", font: "'Pretendard', sans-serif" },
};


// 바탕 지명: 사건과 상관없이 늘 보이는 바다·강·지역·도시 이름. pri가 작을수록 먼저 자리를 잡고, 겹치면 pri가 큰 이름부터 뺀다.
// [경도, 위도]
const FEATURES = [
  { name: "지중해", at: [31.5, 33.4], kind: "water", pri: 1, alts: [[33.4, 33.9], [34.2, 32.6], [29.0, 34.2], [26.0, 34.6], [20.0, 35.6], [33.0, 35.6]] },
  { name: "홍해", at: [36.2, 25.0], kind: "water", pri: 10, alts: [[34.6, 27.4], [33.2, 28.3], [34.75, 28.9]] },
  { name: "페르시아만", at: [50.6, 27.4], kind: "water", pri: 11 },
  { name: "사해", at: [35.5, 31.35], kind: "water", pri: 12 },
  { name: "갈릴리 바다", at: [35.59, 32.83], kind: "water", pri: 13 },
  { name: "흑해", at: [34.0, 43.2], kind: "water", pri: 14 },
  { name: "에게해", at: [25.0, 38.6], kind: "water", pri: 15 },
  { name: "카스피해", at: [51.0, 41.0], kind: "water", pri: 16 },
  { name: "나일강", at: [31.3, 26.6], kind: "river", pri: 20 },
  { name: "유프라테스강", at: [40.6, 34.6], kind: "river", pri: 21 },
  { name: "티그리스강", at: [44.6, 34.1], kind: "river", pri: 22 },
  { name: "요단강", at: [35.57, 32.25], kind: "river", pri: 23 },
  { name: "애굽", at: [30.0, 27.6], kind: "region", pri: 30, alts: [[31.6, 29.0], [32.3, 28.0], [30.6, 30.4]] },
  { name: "가나안", at: [34.75, 31.0], kind: "region", pri: 31, alts: [[35.05, 32.45], [34.9, 30.75]] },
  { name: "앗수르", at: [43.6, 36.9], kind: "region", pri: 32 },
  { name: "갈대아", at: [46.6, 30.6], kind: "region", pri: 33 },
  { name: "바사(페르시아)", at: [53.5, 31.2], kind: "region", pri: 34 },
  { name: "메대", at: [48.8, 35.9], kind: "region", pri: 35 },
  { name: "아람", at: [37.4, 34.4], kind: "region", pri: 36 },
  { name: "아라비아", at: [42.0, 27.0], kind: "region", pri: 37 },
  { name: "시나이반도", at: [33.8, 29.3], kind: "region", pri: 38 },
  { name: "소아시아", at: [31.5, 39.0], kind: "region", pri: 39 },
  { name: "모압", at: [35.95, 31.15], kind: "region", pri: 40 },
  { name: "에돔", at: [35.55, 30.45], kind: "region", pri: 41 },
  { name: "블레셋", at: [34.45, 31.45], kind: "region", pri: 42 },
  { name: "길리기아", at: [35.2, 37.3], kind: "region", pri: 43 },
  { name: "마게도냐", at: [22.6, 40.9], kind: "region", pri: 44 },
  { name: "아가야", at: [21.9, 37.6], kind: "region", pri: 45 },
  { name: "이탈리아", at: [15.0, 41.2], kind: "region", pri: 46 },
  // 교회사(유럽) 쪽. 로마 시대와 중세 모두에 쓰는 이름으로 적는다.
  { name: "대서양", at: [-8.0, 46.0], kind: "water", pri: 16, alts: [[-9.5, 41.5], [-8.5, 50.0]] },
  { name: "북해", at: [3.0, 55.5], kind: "water", pri: 17, alts: [[2.0, 53.5]] },
  { name: "아드리아해", at: [15.5, 43.0], kind: "water", pri: 33 },
  { name: "라인강", at: [7.2, 50.6], kind: "river", pri: 52, alts: [[8.3, 49.2]] },
  { name: "도나우강", at: [18.8, 46.4], kind: "river", pri: 53, alts: [[12.5, 48.6]] },
  { name: "갈리아", at: [2.5, 46.8], kind: "region", pri: 47 },
  { name: "히스파니아", at: [-4.0, 40.0], kind: "region", pri: 48 },
  { name: "브리타니아", at: [-1.8, 52.8], kind: "region", pri: 49 },
  { name: "게르마니아", at: [10.5, 51.5], kind: "region", pri: 50 },
];
// 도시 우선순위. 목록에 없는 장소는 맨 뒤에 놓는다.
const MAJOR = ["jerusalem", "babylon", "nineveh", "memphis", "damascus", "rome", "susa", "samaria", "ur", "haran", "antioch",
  "constantinople", "alexandria", "carthage", "paris", "wittenberg", "geneva",
  "nicaea", "milan", "lyon", "hippo", "edessa", "ctesiphon", "athos", "ravenna", "aachen", "cluny", "avignon", "florence", "prague",
  "constance", "worms", "augsburg", "zurich", "trent", "oxford", "london", "canterbury", "dordrecht",
  "ephesus", "corinth", "tarsus", "caesarea", "thebes", "carchemish", "bethlehem", "nazareth", "capernaum", "hebron", "beersheba",
  "jericho", "shechem", "bethel", "dan", "lachish", "dibon", "megiddo", "joppa", "patmos", "persepolis", "pasargadae", "ecbatana"];
// 바탕 지명으로 쓸 때 괄호 설명을 줄인 이름
const SHORT_NAME = { memphis: "멤피스", sinai: "시내산", sodomsite: "소돔", nimrud: "갈라", hor: "호르산", khorsabad: "두르샤루킨",
  ecbatana: "악메다", tayma: "데마", susa: "수산", penuel: "브니엘", bethanyjordan: "베다니" };
const baseName = (id) => SHORT_NAME[id] ?? PLACES[id].name.replace(/\(.*\)/, "").trim();
// 글자 폭 어림: 한글은 글자 크기만큼, 나머지는 절반 남짓
const textW = (t, size, spacing = 0) => 4 + [...t].reduce((n, c) => n + (/[\u3131-\uD79D]/.test(c) ? size * 1.06 : size * 0.6) + spacing, 0);

// minor: false면 바탕 지명에 주요 도시(MAJOR)만 놓는다(첫 화면처럼 지도가 작을 때).
// minSpan: 장소가 한 곳뿐일 때도 화면 짧은 변에 이만큼(경도, 도)은 보이게 한다.
// reserve(w, h): 지도 위에 겹쳐 놓은 설명 상자처럼 바탕 지명을 놓지 않을 자리 [[x, y, 너비, 높이], ...]
export async function createMap(el, theme = THEMES.parchment, { labels = true, base = true, pad = 0.35, reserve = null, minSpan = 3.2, minor = true } = {}) {
  const geo = await loadGeo();
  const svg = d3.select(el).append("svg").attr("class", "bt-map").style("display", "block").style("width", "100%").style("height", "100%");
  const sea = svg.append("rect").attr("fill", theme.sea);
  const g = svg.append("g");
  // 땅·호수·강은 기준 투영(REF)으로 한 번만 그리고, 화면을 옮길 때는 묶음 전체를 옮기고 키운다.
  // 메르카토르는 중심과 배율이 바뀌어도 투영한 평면이 이동·확대만 하므로 결과가 똑같다. 선 굵기는 그대로 둔다.
  const shapes = g.append("g");
  const land = shapes.append("path").attr("fill", theme.land).attr("stroke", theme.coast).attr("stroke-width", 0.8).attr("stroke-linejoin", "round");
  const lakes = shapes.append("path").attr("fill", theme.lake).attr("stroke", theme.coast).attr("stroke-width", 0.4);
  const rivers = shapes.append("path").attr("fill", "none").attr("stroke", theme.river).attr("stroke-width", 1.1).attr("stroke-linecap", "round");
  shapes.selectAll("path").attr("vector-effect", "non-scaling-stroke");
  const REF = 8000;
  const refProj = d3.geoMercator().scale(REF).translate([0, 0]).center([0, 0]);
  const refPath = d3.geoPath(refProj);
  land.attr("d", refPath(geo.land));
  lakes.attr("d", refPath(geo.lakes));
  rivers.attr("d", refPath(geo.rivers));
  const baseG = g.append("g").attr("class", "base").style("pointer-events", "none");
  const trail = g.append("g").style("pointer-events", "none");
  const route = g.append("path").attr("fill", "none").attr("stroke", theme.route).attr("stroke-width", 2.2).attr("stroke-dasharray", "5 4").attr("stroke-linecap", "round");
  const marks = g.append("g");

  const proj = d3.geoMercator();
  let w = 0, h = 0, view = { lon: 38, lat: 32, span: 22 }, current = null, raf = 0;

  // full이 아니면(지도가 움직이는 중) 바탕 지명의 자리를 다시 고르지 않고 지금 이름들을 따라 옮기기만 한다.
  function apply(v, full = true) {
    proj.scale(1).translate([0, 0]).center([v.lon, v.lat]);
    // span = 화면 짧은 변에 들어가야 하는 경도 폭(도). 메르카토르는 경도 1도가 위도와 무관하게 같은 너비다.
    const k = Math.min(w, h) / ((v.span * Math.PI) / 180);
    proj.scale(k).translate([w / 2, h / 2]);
    const sc = k / REF, [cx, cy] = refProj([v.lon, v.lat]);
    shapes.attr("transform", `translate(${w / 2 - sc * cx},${h / 2 - sc * cy}) scale(${sc})`);
    const taken = drawMarks();
    if (!base) return;
    if (full) drawBase(reserve ? taken.concat(reserve(w, h)) : taken);
    else baseG.selectAll("g.bl").attr("transform", (d) => `translate(${proj(d.geo)})`);
  }

  function drawMarks() {
    const ids = current ? current.route : [];
    // trail: 앞에서 지나온 장소. 이름 없이 옅은 점으로만 남긴다(지도로 따라 읽기).
    const onNow = new Set(ids);
    trail.selectAll("circle").data((current?.trail || []).filter((id) => !onNow.has(id) && PLACES[id]), (d) => d)
      .join((e) => e.append("circle").attr("r", 3.2).attr("fill", theme.route).attr("fill-opacity", 0.28).attr("stroke", theme.halo).attr("stroke-width", 1))
      .attr("transform", (d) => `translate(${proj(PLACES[d].at)})`);
    const pts = ids.map((id) => proj(PLACES[id].at));
    // noLine이면 점만 찍는다(인물 프로필처럼 순서 없는 장소 모음).
    route.attr("d", pts.length > 1 && !current?.noLine ? d3.line().curve(d3.curveCatmullRom.alpha(0.5))(pts) : null);
    const sel = marks.selectAll("g.pl").data(ids, (d) => d);
    sel.exit().remove();
    const enter = sel.enter().append("g").attr("class", "pl");
    // 도시는 검은 점, 땅·지방(region)은 그 땅 가운데에 옅은 원을 그린다.
    enter.filter((d) => PLACES[d].region).append("circle").attr("r", 16).attr("fill", theme.route).attr("fill-opacity", 0.13).attr("stroke", theme.route).attr("stroke-opacity", 0.35).attr("stroke-dasharray", "3 3");
    enter.append("circle").attr("r", (d) => (PLACES[d].region ? 2.5 : 4.5)).attr("fill", theme.dot).attr("stroke", theme.halo).attr("stroke-width", 2);
    if (labels) {
      enter.append("text").attr("x", 8).attr("y", 4).attr("fill", theme.label).attr("stroke", theme.halo).attr("stroke-width", 3.5).attr("paint-order", "stroke")
        .style("font", `600 13px ${theme.font}`).text((d) => PLACES[d].name);
    }
    const all = enter.merge(sel).attr("transform", (d) => `translate(${proj(PLACES[d].at)})`);
    if (labels) return placeLabels(all);
    return pts.map(([x, y]) => [x - 6, y - 6, 12, 12]);
  }

  // 바탕 지명은 사건 장소의 이름이 자리를 잡은 뒤, 남은 빈자리에만 놓는다.
  const STYLE = {
    water: { size: 11.5, weight: 500, fill: theme.water, spacing: 1.5 },
    river: { size: 10.5, weight: 500, fill: theme.water, spacing: 0.5 },
    region: { size: 11.5, weight: 600, fill: theme.region, spacing: 3 },
    place: { size: 10.5, weight: 500, fill: theme.muted, spacing: 0 },
  };
  function drawBase(taken) {
    const onRoute = new Set(current ? current.route : []);
    // 사건 장소로 이름이 이미 떠 있는 바다·지역은 바탕에 다시 쓰지 않는다. 장소와 바탕 지명이 같은 이름이면 바탕 지명을 쓴다.
    const routeNames = new Set([...onRoute].map(baseName));
    const featNames = new Set(FEATURES.map((f) => f.name));
    const cands = [
      ...FEATURES.filter((f) => !routeNames.has(f.name)),
      ...Object.keys(PLACES).filter((id) => !onRoute.has(id) && !featNames.has(baseName(id)) && (minor || MAJOR.includes(id))).map((id) => {
        const i = MAJOR.indexOf(id);
        return { name: baseName(id), at: PLACES[id].at, kind: PLACES[id].region ? "region" : "place", pri: i < 0 ? (PLACES[id].region ? 150 : 200) : i < 8 ? 2 + i * 0.1 : 50 + i };
      }),
    ].sort((a, b) => a.pri - b.pri);
    const shown = [];
    for (const c of cands) {
      const st = STYLE[c.kind], tw = textW(c.name, st.size, st.spacing), th = st.size + 3;
      // 도시는 점의 오른쪽·왼쪽, 바다·강·지역은 후보 자리(at, alts) 가운데 화면 안에서 빈 곳에 놓는다.
      const spots = c.kind === "place"
        ? (([x, y]) => [{ x, y, geo: c.at, dx: 6, anchor: "start", box: [x + 5, y - th / 2 - 1, tw + 2, th] }, { x, y, geo: c.at, dx: -6, anchor: "end", box: [x - 7 - tw, y - th / 2 - 1, tw + 2, th] }])(proj(c.at))
        : [c.at, ...(c.alts || [])].map((geo) => { const [x, y] = proj(geo); return { x, y, geo, dx: 0, anchor: "middle", box: [x - tw / 2, y - th / 2, tw, th] }; });
      const ok = spots.find((sp) => sp.box[0] >= 4 && sp.box[1] >= 2 && sp.box[0] + sp.box[2] <= w - 6 && sp.box[1] + sp.box[3] <= h - 2 && !taken.some((t) => hit(sp.box, t)));
      if (!ok) continue;
      const { x, y } = ok;
      taken.push(ok.box);
      if (c.kind === "place") taken.push([x - 3, y - 3, 6, 6]);
      shown.push({ ...c, x, y, geo: ok.geo, dx: ok.dx, anchor: ok.anchor, st });
    }
    baseG.selectAll("g.bl").data(shown, (d) => d.kind + d.name).join((e) => {
      const gg = e.append("g").attr("class", "bl");
      gg.append("circle").attr("r", 2.2);
      gg.append("text").attr("stroke", theme.halo).attr("stroke-width", 3).attr("paint-order", "stroke").attr("dy", "0.35em");
      return gg;
    }).attr("transform", (d) => `translate(${d.x},${d.y})`).each(function (d) {
      const gg = d3.select(this);
      gg.select("circle").attr("fill", theme.muted).style("display", d.kind === "place" ? null : "none");
      gg.select("text").attr("x", d.dx).attr("text-anchor", d.anchor).attr("fill", d.st.fill)
        .style("font", `${d.st.weight} ${d.st.size}px ${theme.font}`).style("letter-spacing", `${d.st.spacing}px`).text(d.name);
    });
  }

  // 가까운 지명끼리 글자가 겹치면 오른쪽 → 왼쪽 → 아래 → 위 순서로 빈자리를 찾아 옮긴다.
  const SPOTS = [
    { x: 8, y: 4, anchor: "start", box: (w) => [8, -9, w, 14] },
    { x: -8, y: 4, anchor: "end", box: (w) => [-8 - w, -9, w, 14] },
    { x: 0, y: 19, anchor: "middle", box: (w) => [-w / 2, 7, w, 14] },
    { x: 0, y: -10, anchor: "middle", box: (w) => [-w / 2, -23, w, 14] },
  ];
  const hit = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
  function placeLabels(groups) {
    const taken = [];
    groups.each(function (d) { const [x, y] = proj(PLACES[d].at); taken.push([x - 6, y - 6, 12, 12]); });
    groups.each(function (d) {
      const [x, y] = proj(PLACES[d].at);
      const text = this.querySelector("text");
      // 글자 폭은 처음 한 번만 잰다(움직이는 동안 매 프레임 재면 느리다).
      const w = (this.__w ||= text.getComputedTextLength() || PLACES[d].name.length * 13);
      const inside = (b) => b[0] >= 0 && b[1] >= 0 && b[0] + b[2] <= w0() && b[1] + b[3] <= h0();
      const boxes = SPOTS.map((s) => { const [bx, by, bw, bh] = s.box(w); return [x + bx, y + by, bw, bh]; });
      let i = boxes.findIndex((b) => inside(b) && !taken.some((t) => hit(b, t)));
      if (i < 0) i = boxes.findIndex((b) => !taken.some((t) => hit(b, t)));
      if (i < 0) i = 0;
      text.setAttribute("x", SPOTS[i].x);
      text.setAttribute("y", SPOTS[i].y);
      text.setAttribute("text-anchor", SPOTS[i].anchor);
      taken.push(boxes[i]);
    });
    return taken;
  }
  const w0 = () => w, h0 = () => h;

  function target(ev) {
    const pts = ev.route.map((id) => PLACES[id].at);
    const lons = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
    const [x0, x1] = d3.extent(lons), [y0, y1] = d3.extent(lats);
    const aspect = w / h || 1.6;
    // 가로세로 중 더 빡빡한 쪽에 맞춘다. 위도 1도는 이 지역(북위 30도 안팎)에서 경도 1도보다 약 1.15배 길게 그려진다.
    const needLon = (x1 - x0) / Math.max(aspect, 1);
    const needLat = ((y1 - y0) * 1.15) / Math.max(1 / aspect, 1);
    const span = Math.max(minSpan, Math.max(needLon, needLat) * (1 + pad * 2));
    return { lon: (x0 + x1) / 2, lat: (y0 + y1) / 2, span };
  }

  function resize() {
    const r = el.getBoundingClientRect();
    w = r.width; h = r.height;
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    sea.attr("width", w).attr("height", h);
    if (current) view = target(current);
    apply(view);
  }

  function show(ev, { instant = false } = {}) {
    if (ev === current) return;
    current = ev;
    const from = view, to = target(ev);
    cancelAnimationFrame(raf);
    marks.selectAll("g.pl").remove();
    if (instant || matchMedia("(prefers-reduced-motion: reduce)").matches) { view = to; apply(view); return; }
    // 멀리 갈 때는 잠깐 넓게 물러났다가 다가간다(d3.interpolateZoom).
    const zi = d3.interpolateZoom([from.lon, from.lat, from.span], [to.lon, to.lat, to.span]);
    const dur = Math.min(1400, Math.max(500, zi.duration * 0.6));
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const [lon, lat, span] = zi(d3.easeCubicInOut(t));
      view = { lon, lat, span };
      apply(view, t >= 1);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  new ResizeObserver(resize).observe(el);
  resize();
  return { show, resize };
}
