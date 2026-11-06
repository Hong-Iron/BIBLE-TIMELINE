import fs from "fs";
import { geoIdentity, geoBounds, geoArea } from "d3-geo";
import { geoProject } from "d3-geo-projection";
import { feature } from "topojson-client";
const BOX = [[5, 20], [52, 45]];
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
const topo = JSON.parse(fs.readFileSync("land50.json"));
const land = rewind(round(geoProject(feature(topo, topo.objects.land), clip)));
const pick = (file, keep) => {
  const fc = JSON.parse(fs.readFileSync(file));
  const feats = fc.features.filter(inBox).filter(keep).map((f) => ({ type: "Feature", properties: { name: f.properties.name_ko || f.properties.name, en: f.properties.name }, geometry: geoProject(f.geometry, clip) }));
  return rewind(round({ type: "FeatureCollection", features: feats.filter((f) => f.geometry) }));
};
const rivers = pick("ne_10m_rivers_lake_centerlines.geojson", (f) => f.properties.scalerank <= 6 && !/Canal|Danube|Po$|Bratul|Borcea/.test(f.properties.name));
const lakes = pick("ne_10m_lakes.geojson", (f) => f.properties.scalerank <= 8 && /Galilee|Dead Sea|Van|Urmia|Tuz|Hammar|Bitter|Sevan/.test(f.properties.name || ""));
console.log("rivers", rivers.features.map((f) => f.properties.en).join(", "));
console.log("lakes", lakes.features.map((f) => f.properties.en).join(", "));
fs.writeFileSync(process.argv[2], JSON.stringify({ land, rivers, lakes }));
