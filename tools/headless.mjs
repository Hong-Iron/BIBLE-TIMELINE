// 헤드리스 크롬으로 페이지를 열고, 연표가 그려지기를 기다린 뒤 검사 스크립트를 실행해 결과를 찍는다.
// 사용: node tools/headless.mjs <주소> <너비> <높이> <검사.js> [스크린샷.png]
//   예: node tools/headless.mjs "http://localhost:8793/#s-acts" 375 812 check.js shot.png
// 검사.js는 값을 돌려주는 식 하나다(예: `(async () => ({ hash: location.hash }))()`).
// Emulation으로 크기를 정하므로 창이 500px 아래로 안 줄어드는 --window-size의 한계 없이 휴대폰 폭을 잴 수 있다.
// 끝에 페이지 오류(EXC/ERR), 실패한 요청(FAIL), 끝나지 않은 요청(pending)을 함께 찍는다.
// 환경 변수 SCALE=2면 2배 해상도로 찍는다(소개 그림용). CPU=4면 CPU를 4배 느리게 해 휴대폰처럼 잰다.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, W, H, jsFile, shot] = process.argv.slice(2);
if (!jsFile) { console.error("사용: node tools/headless.mjs <주소> <너비> <높이> <검사.js> [스크린샷.png]"); process.exit(2); }
const port = 9333 + Math.floor(Math.random() * 300);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, `--window-size=${W},${H}`, "--hide-scrollbars",
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "bt-headless-"))}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 크롬이 막 뜬 때는 디버그 주소가 빈 응답을 주기도 하므로, 페이지 목록이 나올 때까지 기다린다.
let page;
for (let i = 0; i < 75 && !page; i++) {
  try { const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); page = Array.isArray(tabs) && tabs.find((t) => t.type === "page"); } catch { /* 아직 안 떴다 */ }
  if (!page) await sleep(200);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const wait = new Map(), logs = [], req = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); }
  const p = d.params;
  if (d.method === "Runtime.exceptionThrown") logs.push("EXC " + p.exceptionDetails.exception?.description?.split("\n")[0]);
  if (d.method === "Runtime.consoleAPICalled" && p.type === "error") logs.push("ERR " + p.args.map((a) => a.value ?? a.description).join(" "));
  if (d.method === "Network.requestWillBeSent") req.set(p.requestId, p.request.url);
  if (d.method === "Network.loadingFinished") req.delete(p.requestId);
  if (d.method === "Network.loadingFailed") { logs.push("FAIL " + req.get(p.requestId) + " " + p.errorText); req.delete(p.requestId); }
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Runtime.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: +(process.env.SCALE || 1), mobile: +W < 600 });
if (process.env.CPU) await send("Emulation.setCPUThrottlingRate", { rate: +process.env.CPU });
// PROFILE_LOAD=1이면 페이지를 여는 순간부터 프로파일을 뜬다(첫 화면이 왜 느린지 볼 때).
if (process.env.PROFILE && process.env.PROFILE_LOAD) { await send("Profiler.enable"); await send("Profiler.setSamplingInterval", { interval: 200 }); await send("Profiler.start"); }
await send("Page.enable");
await send("Page.navigate", { url });
// d3를 jsDelivr에서 받으므로 망이 느리면 그리기 시작이 늦다. 연표 SVG에 무언가 그려질 때까지 30초까지 기다린다.
for (let i = 0; i < 60; i++) {
  await sleep(500);
  const v = await send("Runtime.evaluate", { expression: 'document.querySelectorAll("svg g").length', returnByValue: true });
  if (v.result?.result?.value > 0) break;
}
await sleep(1500);
// PROFILE=파일이면 검사 스크립트가 도는 동안 CPU 프로파일을 떠서 함수별 시간을 남긴다(.cpuprofile).
if (process.env.PROFILE && !process.env.PROFILE_LOAD) { await send("Profiler.enable"); await send("Profiler.setSamplingInterval", { interval: 200 }); await send("Profiler.start"); }
const r = await send("Runtime.evaluate", { expression: readFileSync(jsFile, "utf8"), awaitPromise: true, returnByValue: true });
if (process.env.PROFILE) { const { result } = await send("Profiler.stop"); writeFileSync(process.env.PROFILE, JSON.stringify(result.profile)); }
console.log(JSON.stringify(r.result?.result?.value ?? r.result, null, 1));
if (shot) { const s = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(shot, Buffer.from(s.result.data, "base64")); }
console.log("logs:", logs.filter((l) => !l.includes("favicon")));
console.log("pending:", [...req.values()].filter((u) => !/\.woff2|fonts\.g/.test(u)));
ws.close();
chrome.kill();
