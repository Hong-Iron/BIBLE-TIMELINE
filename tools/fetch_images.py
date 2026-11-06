"""Wikimedia Commons에서 증거 사진을 내려받고 출처·라이선스를 site/shared/credits.json에 적는다.
사진은 긴 변 1200 px(img/)와 320 px(img/sm/) 두 크기로 줄인다(macOS sips 사용).
실행: python3 -I tools/fetch_images.py  (저장소 맨 위에서). 교회사 사진은 church_ev1~3.js의 IMG_CH1~3에서 읽는다."""
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
    "kurkh": "File:Shalmaneser III-1.jpg",
    "ishtar": "File:Pergamon museum Ishtar Gate.jpg",
    "benihasan": "File:Asiatics with lyre Beni Hasan.jpg",
    "rekhmire": "File:Brickmakers, Tomb of Rekhmire MET DT10882.jpg",
    "stcatherine": "File:Katharinenkloster Sinai BW 2.jpg",
    "sinai": "File:Mount Sinai BW 4.jpg",
    "sodom": "File:Mount Sodom, Dead Sea Outlook, Israel 20.jpg",
    "jericho": "File:Jericho BW 1.jpg",
    "tabor": "File:Mt Tabor aerial view 2 Mordagan IMOT (14530932473).jpg",
    "harod": "File:Gideon's Fountain, Near Jezreel.jpg",
    "elah": "File:Valley of Elah.jpg",
    "stepped": "File:Stepped structure unearthed in the City of David.jpg",
    "megiddo": "File:Chambered Gate of Megiddo (20726303061).jpg",
    "bubastite": "File:Karnak Tempel Bubastis-Portal 03.jpg",
    "samivory": "File:Furniture Inlays, Samaria, 9th-8th Century BC (43218962441).jpg",
    "muhraka": "File:St Elias Church at the Muhraka Monastery 0651.jpg",
    "nineveh": "File:Nineveh - Mashki Gate.jpg",
    "sargon": "File:Sargon II and dignitary.jpg",
    "ketef": "File:Ketef hinom scrolls.JPG",
    "nabonidus": "File:Cylinder Nabonidus BM WA91128.jpg",
    "behistun": "File:Behistun inscription reliefs.jpg",
    "persepolis": "File:Persepolis – Gate of All Nations 02.jpg",
    "warning": "File:Temple Warning Inscription from Jerusalem Istanbul Archaeology Museums.jpg",
    "nativity": "File:2130 Bethlehem - Grotto of the Nativity.jpg",
    "jordan": "File:Holy Land 2016 P0577 Jordan River Kasr al-Jahud site of the baptism of Jesus.jpg",
    "galboat": "File:2,000 year-old Galilee Boat (25590631200).jpg",
    "olives": "File:Jerusalem Mount of Olives BW 2010-09-20 07-57-31.JPG",
    "rollingstone": "File:Schijfvormige steen bij het familiegraf van Herodus, Bestanddeelnr 255-2387.jpg",
    "steps": "File:PikiWiki Israel 4050 huldas steps.jpg",
    "damascus": "File:Damascus Straight Street and East Gate 8193.jpg",
    "appian": "File:Appian Way.jpg",
    "titus": "File:Spoils from Jerusalem - Arch of Titus - Rome 2008.jpg",
    "patmos": "File:Cave of the Apocalypse.jpg",
    "babchron": "File:The cuneiform inscription highlights the conquest of Jerusalem and the surrender of Jehoiakim, king of Judah, in 597 BCE. From Babylon, Iraq.jpg",
}
# Commons의 작성자 칸이 긴 설명문인 사진은 화면에 이름만 보이도록 줄여 적는다.
AUTHOR_SHORT = {"ur": "Hardnfast", "taylor": "David Castor", "lachish": "Mike Peel",
                "cyrus": "Mike Peel (수정: مانفی)", "isaiah": "Ardon Bar Hama",
                "kurkh": "David Castor", "babchron": "Osama Shukir Muhammed Amin",
                "sargon": "작자 미상", "nabonidus": "작자 미상", "behistun": "작자 미상",
                "galboat": "Konrad Summers", "samivory": "Gary Todd", "harod": "OSU 특별 소장품(1910년 사진)"}
# 교회사 사진: 작성자 칸이 '작자 미상'의 여러 표기나 파일 설명으로 들어온 것
AUTHOR_SHORT.update({"ch-p46": "작자 미상", "ch-sinaiticus": "작자 미상", "ch-muratorian": "작자 미상", "ch-augustine-lateran": "작자 미상",
    "ch-libellus": "작자 미상(250년 이집트 파피루스)", "ch-etchmiadzin": "Heretiq", "ch-tetrarchs": "Nino Barbieri", "ch-smyrna-agora": "Didier Laroche",
    "sinaichrist": "작자 미상", "chludov": "작자 미상", "maximusicon": "작자 미상", "triumphicon": "작자 미상", "xianstele": "David Castor",
    "smhorses": "Tteske", "karolusdenier": "작자 미상(카롤루스 시대 동전)", "ch-palamas-icon": "작자 미상(테살로니키 화파 추정)",
    "ch-hus-spiez": "작자 미상(슈피츠 연대기)", "ch-augsburg-1531": "작자 미상", "ch-heidelberg-1563": "작자 미상", "ch-markephesus-icon": "작자 미상",
    "ch-lucaris-1632": "작자 미상", "ch-theses-1617": "작자 미상(1617년 인쇄물)", "ch-thesis-door": "Avishai Teicher", "photius": "작자 미상(마드리드 스킬리체스 사본)"})
UA = "BibleTimeline/0.1 (https://github.com/Hong-Iron/BIBLE-TIMELINE)"
ROOT = Path(__file__).resolve().parent.parent / "site"

def curl(url, out=None):
    args = ["curl", "-sL", "-A", UA, url] + (["-o", str(out)] if out else [])
    return subprocess.run(args, capture_output=True, text=out is None, check=True).stdout

def plain(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()

import sys
# 교회사 사건의 사진 목록(church_ev1~3.js의 IMG_CH1~3)도 함께 받는다.
_ch = subprocess.run(["node", "-e", 'import("./site/shared/church_events.js").then(m=>console.log(JSON.stringify(m.CH_IMG)))'],
                     cwd=ROOT.parent, capture_output=True, text=True, check=True).stdout
FILES = {**FILES, **json.loads(_ch or "{}")}
# 작성자 칸에 HTML 표나 긴 설명이 들어온 사진은 앞부분만 남긴다(화면에 이름만 보이게).
def short_author(a):
    a = re.sub(r"\s+", " ", a or "").strip()
    return a if len(a) <= 60 else a[:57].rstrip() + "…"
old = json.loads((ROOT / "shared" / "credits.json").read_text()) if (ROOT / "shared" / "credits.json").exists() else {}
credits = {}
for key, title in FILES.items():
    if "--all" not in sys.argv and key in old and (ROOT / "img" / f"{key}.jpg").exists():
        credits[key] = old[key]; continue
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
        "file": title, "page": ii["descriptionurl"], "author": AUTHOR_SHORT.get(key) or short_author(get("Artist")) or "Unknown",
        "license": get("LicenseShortName"), "licenseUrl": get("LicenseUrl"),
    }
    print(key, out.stat().st_size // 1024, "KB |", credits[key]["license"], "|", credits[key]["author"][:50])

(ROOT / "shared" / "credits.json").write_text(json.dumps(credits, ensure_ascii=False, indent=1))
