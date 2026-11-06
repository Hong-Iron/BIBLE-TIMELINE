#!/bin/sh
# 시안 목록의 미리보기 사진을 만든다. 미리보기 서버(python3 -m http.server 8793 --directory site)가 떠 있어야 한다.
# 사용: sh tools/thumbs.sh a b c
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$(cd "$(dirname "$0")/.." && pwd)/site/thumbs"
TMP="${TMPDIR:-/tmp}/bt-thumbs"; mkdir -p "$TMP"
for k in "$@"; do
  case "$k" in b) URL="b/#sennacherib" ;; *) URL="$k/" ;; esac
  "$CHROME" --headless=new --hide-scrollbars --window-size=1280,800 --force-device-scale-factor=1 \
    --virtual-time-budget=6000 --user-data-dir="$TMP/profile" \
    --screenshot="$TMP/$k.png" "http://localhost:8793/$URL" >/dev/null 2>&1
  sips -Z 960 -s format jpeg -s formatOptions 80 "$TMP/$k.png" --out "$OUT/$k.jpg" >/dev/null
  echo "$k -> $OUT/$k.jpg"
done
