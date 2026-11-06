"""사건 자료(data.js, events_more.js)와 인물 프로필(profiles*.js)에 적힌 장절의 본문을 개역한글에서 뽑아
site/shared/verses.js(export const VERSES = {...})로 저장한다. data.js와 프로필 화면이 이 모듈을 불러 쓴다.

실행: python3 -I tools/build_verses.py          (저장소 맨 위에서)
      python3 -I tools/build_verses.py --check  (주장과 본문을 나란히 출력해 눈으로 대조한다)
      python3 -I tools/build_verses.py --guides genesis exodus  (책 해설의 주장과 본문을 대조한다. 책 id를 빼면 전부)

개역한글 본문은 bluesaurel/Korean-Bible-1961-KRV의 JSON을 tools/.cache/에 받아 쓴다.
장절 표기: "창 12:1-3", "왕하 9:20, 24", "출 2:21; 3:1"처럼 쓴다. 책 이름을 빼면 앞 조각의 책을, 장을 빼면 앞 조각의 장을 이어 쓴다.
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / ".cache" / "bible_1961_krv.json"
SRC = "https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/bible_1961_krv.json"

BOOKS = {
    "창": "Genesis", "출": "Exodus", "레": "Leviticus", "민": "Numbers", "신": "Deuteronomy", "수": "Joshua", "삿": "Judges",
    "룻": "Ruth", "삼상": "1Samuel", "삼하": "2Samuel", "왕상": "1Kings", "왕하": "2Kings", "대상": "1Chronicles",
    "대하": "2Chronicles", "스": "Ezra", "느": "Nehemiah", "에": "Esther", "욥": "Job", "시": "Psalms", "잠": "Proverbs",
    "전": "Ecclesiastes", "아": "SongofSolomon", "사": "Isaiah", "렘": "Jeremiah", "애": "Lamentations", "겔": "Ezekiel",
    "단": "Daniel", "호": "Hosea", "욜": "Joel", "암": "Amos", "옵": "Obadiah", "욘": "Jonah", "미": "Micah", "나": "Nahum",
    "합": "Habakkuk", "습": "Zephaniah", "학": "Haggai", "슥": "Zechariah", "말": "Malachi", "마": "Matthew", "막": "Mark",
    "눅": "Luke", "요": "John", "행": "Acts", "롬": "Romans", "고전": "1Corinthians", "고후": "2Corinthians", "갈": "Galatians",
    "엡": "Ephesians", "빌": "Philippians", "골": "Colossians", "살전": "1Thessalonians", "살후": "2Thessalonians",
    "딤전": "1Timothy", "딤후": "2Timothy", "딛": "Titus", "몬": "Philemon", "히": "Hebrews", "약": "James", "벧전": "1Peter",
    "벧후": "2Peter", "요일": "1John", "요이": "2John", "요삼": "3John", "유": "Jude", "계": "Revelation",
}


def load_bible():
    if not CACHE.exists():
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sL", "-o", str(CACHE), SRC], check=True)
    data = json.loads(CACHE.read_text())
    return {b["book"]: {c["chapter"]: {v["verse"]: v["text"] for v in c["verses"]} for c in b["chapters"]} for b in data}


def parse(ref):
    """'왕하 9:20, 24; 10:7' → [('왕하', 9, 20), ('왕하', 9, 24), ('왕하', 10, 7)]"""
    out, book, chap = [], None, None
    for seg in ref.split(";"):
        seg = seg.strip()
        m = re.match(r"^([가-힣]+)\s+(.*)$", seg)
        if m:
            book, seg = m.group(1), m.group(2)
        for item in seg.split(","):
            item = item.strip()
            m = re.match(r"^(?:(\d+):)?(\d+)(?:-(\d+))?$", item)
            if not m or book is None:
                raise ValueError(f"장절을 읽지 못함: {ref!r} ({item!r})")
            if m.group(1):
                chap = int(m.group(1))
            if chap is None:
                raise ValueError(f"장이 없음: {ref!r}")
            a = int(m.group(2)); b = int(m.group(3) or a)
            out += [(book, chap, v) for v in range(a, b + 1)]
    return out


def collect_refs(js):
    refs = re.findall(r'\bref: "([^"]+)"', js)
    # quotes(핵심 구절)와 refs(책 해설의 주제 근거) 목록 안의 장절도 모은다
    for block in re.findall(r"(?:quotes|refs): \[([^\]]*)\]", js):
        refs += re.findall(r'"([^"]+)"', block)
    return list(dict.fromkeys(refs))


SOURCES = ["data.js", "events_more.js", "profiles.js", "profiles_*.js", "guides_*.js"]


def read_sources():
    shared = ROOT / "site" / "shared"
    files = sorted({f for pat in SOURCES for f in shared.glob(pat)})
    return "\n".join(f.read_text() for f in files)


def main():
    bible = load_bible()
    js = read_sources()
    out, missing = {}, []
    for ref in collect_refs(js):
        parts = []
        for book, c, v in parse(ref):
            text = bible.get(BOOKS[book], {}).get(c, {}).get(v)
            if text is None:
                missing.append(f"{ref} → {book} {c}:{v}")
                continue
            parts.append([f"{book} {c}:{v}", text])
        out[ref] = parts
    body = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "site" / "shared" / "verses.js").write_text(
        "// tools/build_verses.py가 만든 파일이다. 손으로 고치지 않는다. 장절 → [[\"책 장:절\", 개역한글 본문], ...]\n"
        f"export const VERSES = {body};\n")
    print(f"장절 {len(out)}개, 절 {sum(len(p) for p in out.values())}개를 verses.js에 저장했다.")
    if missing:
        print("찾지 못한 절:", *missing, sep="\n  ")
        sys.exit(1)
    if "--check" in sys.argv:
        check(out)
    if "--guides" in sys.argv:
        ids = [a for a in sys.argv[sys.argv.index("--guides") + 1:] if not a.startswith("--")]
        check_guides(out, set(ids) or None)


def check(verses):
    """profiles.js의 주장 옆에 근거 절을 붙여 출력한다."""
    dump = subprocess.run(["node", "-e", 'import("./site/shared/profiles.js").then(m=>console.log(JSON.stringify(m.PROFILES)))'],
                          cwd=ROOT, capture_output=True, text=True, check=True).stdout
    for pid, p in json.loads(dump).items():
        print(f"\n===== {pid}")
        items = [("이름", p.get("nameNote"))] + [("정보 " + f["k"], {"text": f["v"], **f}) for f in p["facts"]] \
            + [("가족 " + f["rel"], {"text": f["name"] + (" / " + f["note"] if f.get("note") else ""), **f}) for f in p["family"]] \
            + [("생애", l) for l in p["life"]]
        for label, it in items:
            if not it:
                continue
            ref = it.get("ref")
            body = " | ".join(f"{k} {t[:90]}" for k, t in verses.get(ref, [])) if ref else f"(출처: {it.get('src')})"
            print(f"- [{label}] {it['text']}\n    {ref or ''} → {body}")


def check_guides(verses, only=None):
    """guides_*.js의 장절을 주장 옆에 붙여 출력한다. only가 있으면 그 책 id만."""
    dump = subprocess.run(["node", "-e", 'import("./site/shared/guides.js").then(m=>console.log(JSON.stringify(m.GUIDES)))'],
                          cwd=ROOT, capture_output=True, text=True, check=True).stdout
    for bid, g in json.loads(dump).items():
        if only and bid not in only:
            continue
        print(f"\n===== 책 {bid}")
        body = lambda ref: " | ".join(f"{k} {t[:90]}" for k, t in verses.get(ref, [])) if ref else ""
        for a in g.get("author", []) + g.get("date", []):
            print(f"- [쓴 사람·때 {a.get('view')}] {a['text']}\n    {a.get('ref') or ''} → {body(a.get('ref')) or '(출처: ' + str(a.get('src')) + ')'}")
        for e in g.get("events", []):
            print(f"- [사건] {e['text']}\n    {e.get('ref')} → {body(e.get('ref'))}")
        for t in g.get("themes", []):
            for r in t.get("refs", []):
                print(f"- [주제 {t['title']}] {r} → {body(r)}")


if __name__ == "__main__":
    main()
