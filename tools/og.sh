#!/bin/sh
# 링크를 공유할 때 보이는 그림(site/og.jpg, 1200×630)을 tools/og.html에서 찍는다.
# 사용: sh tools/og.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMPDIR:-/tmp}/bt-og"; mkdir -p "$TMP"
# 글꼴을 받을 때까지 기다린 뒤 찍는다.
echo '(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 1500)); return { fonts: document.fonts.size }; })()' > "$TMP/wait.js"
node "$ROOT/tools/headless.mjs" "file://$ROOT/tools/og.html" 1200 630 "$TMP/wait.js" "$TMP/og.png" > /dev/null
sips -s format jpeg -s formatOptions 88 "$TMP/og.png" --out "$ROOT/site/og.jpg" > /dev/null
echo "site/og.jpg $(sips -g pixelWidth -g pixelHeight "$ROOT/site/og.jpg" | awk '/pixel/ {printf "%s ", $2}')"
