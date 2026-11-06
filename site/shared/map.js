// 고대 근동 지도. 사건의 장소들이 화면에 들어오도록 부드럽게 옮겨 간다.
// 사용: const map = await createMap(el, theme); map.show(event)
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { PLACES } from "./data.js";

const BASE = new URL(".", import.meta.url).href;
let geoPromise;
const loadGeo = () => (geoPromise ??= fetch(`${BASE}geo.json`).then((r) => r.json()));

export const THEMES = {
  parchment: { sea: "#c9d0c0", land: "#f1e6c9", coast: "#8a6f45", river: "#7c93a3", lake: "#b9c3c2", route: "#8b2d1f", dot: "#3b2a1a", label: "#3b2a1a", halo: "#efe4c8", font: "'Gowun Batang', serif" },
  night: { sea: "#0b0d10", land: "#1c1915", coast: "#4a4031", river: "#33536b", lake: "#1d2a33", route: "#e8b04b", dot: "#f3e3c0", label: "#e9dcc0", halo: "#1c1915", font: "'Noto Serif KR', serif" },
  atlas: { sea: "#dfe7ec", land: "#f7f5ef", coast: "#9aa6ad", river: "#8fb2c9", lake: "#bcd2df", route: "#c2410c", dot: "#1c1b19", label: "#1c1b19", halo: "#f7f5ef", font: "'Pretendard', sans-serif" },
};

export async function createMap(el, theme = THEMES.parchment, { labels = true, pad = 0.35 } = {}) {
  const geo = await loadGeo();
  const svg = d3.select(el).append("svg").attr("class", "bt-map").style("display", "block").style("width", "100%").style("height", "100%");
  const sea = svg.append("rect").attr("fill", theme.sea);
  const g = svg.append("g");
  const land = g.append("path").attr("fill", theme.land).attr("stroke", theme.coast).attr("stroke-width", 0.8).attr("stroke-linejoin", "round");
  const lakes = g.append("path").attr("fill", theme.lake).attr("stroke", theme.coast).attr("stroke-width", 0.4);
  const rivers = g.append("path").attr("fill", "none").attr("stroke", theme.river).attr("stroke-width", 1.1).attr("stroke-linecap", "round");
  const route = g.append("path").attr("fill", "none").attr("stroke", theme.route).attr("stroke-width", 2.2).attr("stroke-dasharray", "5 4").attr("stroke-linecap", "round");
  const marks = g.append("g");

  const proj = d3.geoMercator();
  const path = d3.geoPath(proj);
  let w = 0, h = 0, view = { lon: 38, lat: 32, span: 22 }, current = null, raf = 0;

  function apply(v) {
    proj.scale(1).translate([0, 0]).center([v.lon, v.lat]);
    // span = 화면 짧은 변에 들어가야 하는 경도 폭(도). 메르카토르는 경도 1도가 위도와 무관하게 같은 너비다.
    const k = Math.min(w, h) / ((v.span * Math.PI) / 180);
    proj.scale(k).translate([w / 2, h / 2]);
    land.attr("d", path(geo.land));
    lakes.attr("d", path(geo.lakes));
    rivers.attr("d", path(geo.rivers));
    drawMarks();
  }

  function drawMarks() {
    const ids = current ? current.route : [];
    const pts = ids.map((id) => proj(PLACES[id].at));
    // noLine이면 점만 찍는다(인물 프로필처럼 순서 없는 장소 모음).
    route.attr("d", pts.length > 1 && !current?.noLine ? d3.line().curve(d3.curveCatmullRom.alpha(0.5))(pts) : null);
    const sel = marks.selectAll("g.pl").data(ids, (d) => d);
    sel.exit().remove();
    const enter = sel.enter().append("g").attr("class", "pl");
    enter.append("circle").attr("r", 4.5).attr("fill", theme.dot).attr("stroke", theme.halo).attr("stroke-width", 2);
    if (labels) {
      enter.append("text").attr("x", 8).attr("y", 4).attr("fill", theme.label).attr("stroke", theme.halo).attr("stroke-width", 3.5).attr("paint-order", "stroke")
        .style("font", `600 13px ${theme.font}`).text((d) => PLACES[d].name);
    }
    const all = enter.merge(sel).attr("transform", (d) => `translate(${proj(PLACES[d].at)})`);
    if (labels) placeLabels(all);
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
      const w = text.getComputedTextLength() || PLACES[d].name.length * 13;
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
    const span = Math.max(3.2, Math.max(needLon, needLat) * (1 + pad * 2));
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
      apply(view);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  new ResizeObserver(resize).observe(el);
  resize();
  return { show, resize };
}
