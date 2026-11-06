"""Wikimedia Commons에서 증거 사진을 내려받고 출처·라이선스를 site/shared/credits.json에 적는다.
사진은 긴 변 1200 px(img/)와 320 px(img/sm/) 두 크기로 줄인다(macOS sips 사용).
실행: python3 -I tools/fetch_images.py  (저장소 맨 위에서)"""
import html, json, re, subprocess, urllib.parse
from pathlib import Path

FILES = {
    "ur": "File:Ancient ziggurat at Ali Air Base Iraq 2005.jpg",
    "merneptah": "File:Merenptah Israel Stele Cairo.jpg",
    "teldan": "File:JRSLM 300116 Tel Dan Stele 01.jpg",
    "mesha": "File:Mesha stele (Louvre, AO 5066).jpg",
    "jehu": "File:Jehu on the Black Obelisk of Shalmaneser III.jpg",
    "taylor": "File:Taylor Prism-1.jpg",
    "siloam": "File:Siloam Inscription 2.jpg",
    "lachish": "File:Lachish Relief, British Museum 14.jpg",
    "jehoiachin": "File:Jehoiachin Ration Tablet.JPG",
    "cyrus": "File:Cyrus Cylinder.jpg",
    "isaiah": "File:Great Isaiah Scroll Ch53.jpg",
    "pilate": "File:Dedicatory inscription found reused in the staircase of the theatre of Caesarea, the first and only mention of Pontius Pilates' name ever unearthed, 26-36 AD, Israel Museum, Jerusalem (15655925251).jpg",
    "caiaphas": "File:Ossuary of the high priest Joseph Caiaphas P1180839.JPG",
    "gallio": "File:Delphes Gallion.jpg",
}
# Commons의 작성자 칸이 긴 설명문인 사진은 화면에 이름만 보이도록 줄여 적는다.
AUTHOR_SHORT = {"ur": "Hardnfast", "taylor": "David Castor", "lachish": "Mike Peel",
                "cyrus": "Mike Peel (수정: مانفی)", "isaiah": "Ardon Bar Hama"}
UA = "BibleTimeline/0.1 (https://github.com/Hong-Iron/BIBLE-TIMELINE)"
ROOT = Path(__file__).resolve().parent.parent / "site"

def curl(url, out=None):
    args = ["curl", "-sL", "-A", UA, url] + (["-o", str(out)] if out else [])
    return subprocess.run(args, capture_output=True, text=out is None, check=True).stdout

def plain(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()

credits = {}
for key, title in FILES.items():
    api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query", "titles": title, "prop": "imageinfo", "format": "json",
        "iiprop": "url|extmetadata", "iiurlwidth": 1200})
    page = next(iter(json.loads(curl(api))["query"]["pages"].values()))
    ii = page["imageinfo"][0]; m = ii["extmetadata"]
    get = lambda k: plain(m.get(k, {}).get("value"))
    out = ROOT / "img" / f"{key}.jpg"
    curl(ii["thumburl"], out)
    subprocess.run(["sips", "-Z", "1200", "-s", "format", "jpeg", "-s", "formatOptions", "78", str(out), "--out", str(out)], capture_output=True, check=True)
    (ROOT / "img" / "sm").mkdir(exist_ok=True)
    subprocess.run(["sips", "-Z", "320", "-s", "format", "jpeg", "-s", "formatOptions", "72", str(out), "--out", str(ROOT / "img" / "sm" / out.name)], capture_output=True, check=True)
    credits[key] = {
        "file": title, "page": ii["descriptionurl"], "author": AUTHOR_SHORT.get(key) or get("Artist") or "Unknown",
        "license": get("LicenseShortName"), "licenseUrl": get("LicenseUrl"),
    }
    print(key, out.stat().st_size // 1024, "KB |", credits[key]["license"], "|", credits[key]["author"][:50])

(ROOT / "shared" / "credits.json").write_text(json.dumps(credits, ensure_ascii=False, indent=1))
