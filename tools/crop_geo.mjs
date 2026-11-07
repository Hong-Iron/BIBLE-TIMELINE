// Natural Earth 지도 자료를 성경과 교회사 지역(서경 11도~동경 66도, 북위 15~58도)만 잘라 site/shared/geo.json으로 저장한다.
// 교회사(종교개혁까지)에 비텐베르크·런던·도르트레흐트(북위 51~52도)와 스코틀랜드가 나와 북쪽과 서쪽을 넓혔다.
// 준비: 같은 폴더에 land50.json(world-atlas@2.0.2 land-50m), ne_10m_rivers_lake_centerlines.geojson, ne_10m_lakes.geojson을 받고
//       npm i d3-geo@3 d3-geo-projection@4 topojson-client@3
// 실행: node crop_geo.mjs <저장할 geo.json 경로>
//       node crop_geo.mjs --world <저장할 geo_world.json 경로>
//         교회사 3단계(1648년~오늘)에 아메리카·아프리카·동아시아가 나와, 땅만 세계 범위(서경 130도~동경 155도, 남위 45도~북위 72도)로
//         따로 자른다. 이 파일만 있으면 되고 land50.json만 쓴다. 지도는 처음에 geo.json으로 그리고 이 파일을 나중에 받아 땅을 바꿔 그린다.
import fs from "fs";
import { geoIdentity, geoBounds, geoArea } from "d3-geo";
import { geoProject } from "d3-geo-projection";
import { feature } from "topojson-client";
const BOX = [[-11, 15], [66, 58]];
const clip = geoIdentity().clipExtent(BOX);
// d3는 바깥 고리가 시계 방향이어야 땅으로 본다. 반대면 '지구 전체에서 이 땅을 뺀 면'이 되므로 고리를 뒤집는다.
const fixPoly = (rings) => (geoArea({ type: "Polygon", coordinates: rings }) > 2 * Math.PI ? rings.map((r) => r.slice().reverse()) : rings);
const rewind = (g) => {
  if (!g) return g;
  if (g.type === "Polygon") return { ...g, coordinates: fixPoly(g.coordinates) };
  if (g.type === "MultiPolygon") return { ...g, coordinates: g.coordinates.map(fixPoly) };
  if (g.type === "FeatureCollection") return { ...g, features: g.features.map((f) => ({ ...f, geometry: rewind(f.geometry) })) };
  if (g.type === "Feature") return { ...g, geometry: rewind(g.geometry) };
  if (g.type === "GeometryCollection") return { ...g, geometries: g.geometries.map(rewind) };
  return g;
};
const round = (g) => JSON.parse(JSON.stringify(g, (k, v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v)));
const inBox = (f) => { const [[a, b], [c, d]] = geoBounds(f); return c >= BOX[0][0] && a <= BOX[1][0] && d >= BOX[0][1] && b <= BOX[1][1]; };
if (process.argv[2] === "--world") {
  const WORLD = [[-130, -45], [155, 72]];
  const topo = JSON.parse(fs.readFileSync("land50.json"));
  const land = rewind(round(geoProject(feature(topo, topo.objects.land), geoIdentity().clipExtent(WORLD))));
  fs.writeFileSync(process.argv[3], JSON.stringify({ land }));
  process.exit(0);
}
const topo = JSON.parse(fs.readFileSync("land50.json"));
const land = rewind(round(geoProject(feature(topo, topo.objects.land), clip)));
const pick = (file, keep) => {
  const fc = JSON.parse(fs.readFileSync(file));
  const feats = fc.features.filter(inBox).filter(keep).map((f) => ({ type: "Feature", properties: { name: f.properties.name_ko || f.properties.name, en: f.properties.name }, geometry: geoProject(f.geometry, clip) }));
  return rewind(round({ type: "FeatureCollection", features: feats.filter((f) => f.geometry) }));
};
const rivers = pick("ne_10m_rivers_lake_centerlines.geojson", (f) => f.properties.scalerank <= 6 && !/Canal|Csatorna|Soroksari|Bratul|Borcea/.test(f.properties.name));
const lakes = pick("ne_10m_lakes.geojson", (f) => f.properties.scalerank <= 8 && /Galilee|Dead Sea|Van|Urmia|Tuz|Hammar|Bitter|Sevan|Geneva|Léman|Constance|Bodensee/.test(f.properties.name || ""));
console.log("rivers", rivers.features.map((f) => f.properties.en).join(", "));
console.log("lakes", lakes.features.map((f) => f.properties.en).join(", "));
fs.writeFileSync(process.argv[2], JSON.stringify({ land, rivers, lakes }));
