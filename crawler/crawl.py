"""
해피씨쀼 재테크 허브 — 금융사 이벤트 자동 수집기
=================================================
sources.json 에 등록된 은행·증권사 '진행중 이벤트' 페이지를 헤드리스 크롬으로 열어
이벤트 제목·기간·링크를 뽑고, ISA / 연금저축 / IRP / CMA·파킹 / 예적금 으로 분류해
output/events.json 에 저장합니다.

실행
  python crawl.py                   # 전체 금융사
  python crawl.py 미래에셋 KB증권    # 이름 일부로 골라서 (기존 결과에 병합)
"""
import asyncio, json, re, sys, datetime, hashlib
from pathlib import Path
from urllib.parse import urljoin

import requests
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "output"
DBG = OUT / "debug"
OUT.mkdir(exist_ok=True)
DBG.mkdir(exist_ok=True)
KST = datetime.timezone(datetime.timedelta(hours=9))
TODAY = datetime.datetime.now(KST).date()

DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"

# ── 분류 규칙 (제목 기준) ──────────────────────────────────────
CATEGORIES = {
    "isa":     r"ISA|아이에스에이",
    "pension": r"연금저축|개인연금|연저펀|연금\s*펀드|연금계좌|연금\s*(이전|갈아타|옮기)|절세계좌",
    "irp":     r"IRP|개인형\s*퇴직|퇴직연금|\bDC\b|DC형",
    "cma":     r"CMA|파킹|발행어음|\bRP\b|RP형|입출금|머니박스|세이프박스|플러스박스|통장\s*(이벤트|혜택|금리|가입|개설)|수시입출",
    "savings": r"예금|적금|정기예|특판|저축",
}
CAT_LABEL = {"isa": "ISA", "pension": "연금저축", "irp": "IRP·퇴직연금", "cma": "CMA·파킹", "savings": "예적금", "other": "기타"}
EVENT_WORDS = r"이벤트|혜택|증정|프로모션|캠페인|시즌|웰컴|Welcome|우대|지원금|경품|페스타|FESTA|챌린지|쿠폰|캐시백|리워드|상품권|기프티콘|추첨|순입금|특판|드려요|받아|쏜다|지급|고금리|최대"
NOISE = re.compile(r"^\d+\s*/\s*\d+\s*페이지|총\s*\d+\s*건|응모결과|^조회수|^좋아요|확인하실 수 있습니다|로그인필요|신청/해지|약관|전체\s*메뉴|메뉴닫기|진행중인\s*이벤트$|종료된\s*이벤트|당첨자|당첨\s*결과|검색기간|조회기간|개인정보|채용|회원가입|공유하기|이전글|다음글|목록$|오늘 하루|그만 보기|닫기$")

_D = r"(?:(?:20)?\d{2})\s*[.\-/년]\s*\d{1,2}\s*[.\-/월]\s*\d{1,2}\s*일?(?:\s*\([^)]{1,3}\))?"
_D_SHORT = r"\d{1,2}\s*[.\-/월]\s*\d{1,2}\s*일?(?:\s*\([^)]{1,3}\))?"
DATE_RE = re.compile(r"((?:20)?\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})")
RANGE_RE = re.compile(rf"({_D})\s*[~∼～\-–]\s*({_D}|{_D_SHORT}|소진\s*시(?:까지)?|별도\s*안내|상시|예산\s*소진\s*시?(?:까지)?|종료\s*시(?:까지)?)")
DDAY_RE = re.compile(r"D\s*-\s*(?:day\s*)?(\d{1,3})(?!\d)", re.I)
STATUS_PREFIX = re.compile(r"^(진행중|종료임박|마감임박|NEW|HOT|신규|이벤트|D-\d+|D-DAY|\[?진행\]?)\s*")
MONEY_RE = re.compile(r"(?:최대\s*)?\d[\d,.]*\s*(?:만\s*원|억\s*원|원|%|주)")


def norm_date(s, ref_year=None):
    m = DATE_RE.search(s or "")
    if m:
        y, mo, d = m.groups()
        y = int(y) + (2000 if len(y) == 2 else 0)
        return f"{y}.{int(mo):02d}.{int(d):02d}"
    m = re.search(r"(\d{1,2})\s*[.\-/월]\s*(\d{1,2})", s or "")
    if m and ref_year:
        return f"{ref_year}.{int(m.group(1)):02d}.{int(m.group(2)):02d}"
    return (s or "").strip()


def parse_range(text):
    m = RANGE_RE.search(text)
    if m:
        start = norm_date(m.group(1))
        end = norm_date(m.group(2), ref_year=start[:4])
        # 12.01 ~ 01.31 처럼 해를 넘기는 경우
        if re.match(r"\d{4}\.\d\d\.\d\d$", end) and end < start and not DATE_RE.search(m.group(2)):
            end = f"{int(start[:4]) + 1}{end[4:]}"
        return start, end, m.group(0)
    # 시작일/종료일이 따로 적힌 경우 (예: SK증권)
    ds = DATE_RE.findall(text)
    if len(ds) >= 2:
        f = lambda t: f"{int(t[0]) + (2000 if len(t[0]) == 2 else 0)}.{int(t[1]):02d}.{int(t[2]):02d}"
        return f(ds[0]), f(ds[1]), ""
    m = DDAY_RE.search(text)
    if m:
        end = TODAY + datetime.timedelta(days=int(m.group(1)))
        return "", end.strftime("%Y.%m.%d"), m.group(0)
    return "", "", ""


def classify(text):
    cats = [k for k, pat in CATEGORIES.items() if re.search(pat, text, re.I)]
    if len(cats) > 1 and "cma" in cats and any(c in cats for c in ("isa", "pension", "irp")):
        if not re.search(r"CMA|파킹|발행어음", text, re.I):
            cats.remove("cma")
    return cats or ["other"]


TAIL_JUNK = re.compile(r"\s*(조회수|조회횟수|관심지수|(?:행사|이벤트|가입)\s*기간|기간\s*[:：]|종료\s*\d+\s*일\s*전|NEW$).*$")
CAT_PREFIX = re.compile(r"^(연금/ISA|국내주식|해외주식|금융상품|은행연계/비대면|투자정보|기타|이벤트|공지)\s+")


def clean_title(t, rng_text):
    t = re.sub(r"D\s*-\s*\d{1,3}\s*신규\s*이벤트\s*$", "", t)
    if rng_text:
        t = t.replace(rng_text, " ")
    # '제목 진행중 설명…' 형태면 앞부분만 제목으로
    t = re.split(r"\s(?:진행중|종료임박|마감임박)\s", t)[0]
    t = TAIL_JUNK.sub("", t)
    t = RANGE_RE.sub(" ", t)
    t = DDAY_RE.sub(" ", t)
    t = re.sub(r"(이벤트\s*)?기간\s*[:：]?\s*$", "", t)
    t = re.sub(r"\s+", " ", t).strip(" -|·:~")
    for _ in range(3):
        t = STATUS_PREFIX.sub("", t).strip()
        t = CAT_PREFIX.sub("", t).strip()
        t = re.sub(r"^\d{1,3}\s+", "", t)  # 앞에 붙은 D-day 숫자
    t = re.sub(r"\s*\d{4}[.\-]\d{2}[.\-]\d{2}\.?$", "", t)  # 끝에 붙은 등록일
    return t.strip(" -|·:~")


def make_event(src, title, start, end, url, desc=""):
    k = re.sub(r"\W", "", title)
    cats = classify(title + " " + desc[:60])
    return {
        "id": hashlib.md5((src["name"] + k).encode()).hexdigest()[:10],
        "institution": src["name"],
        "type": src["type"],
        "categories": cats,
        "title": title,
        "start": start,
        "end": end,
        "benefitHints": list(dict.fromkeys(MONEY_RE.findall(title + " " + desc)))[:4],
        "desc": desc[:200],
        "url": url or src["url"],
        "listUrl": src["url"],
    }


# ── 브라우저에서 실행: 메뉴/헤더/푸터 제거 후 텍스트 블록 + 링크 추출 ──────────
EXTRACT_JS = r"""
() => {
  const T = (x) => String(x || '').replace(/\s+/g, ' ').replace(/^ | $/g, '');
  const root = document.body.cloneNode(true);
  const kill = 'header,nav,footer,script,style,noscript,select,option,#header,#footer,#gnb,#lnb,.gnb,.lnb,.header,.footer,#skipNav,.skip,[class*="allMenu"],[class*="sitemap"],[id*="sitemap"],[class*="gnb"],[id*="gnb"],[class*="quick"]';
  root.querySelectorAll(kill).forEach(e => e.remove());
  const blocks = [];
  const INLINE = ['A','LI','DT','DD','P','STRONG','SPAN','H1','H2','H3','H4','H5','EM','B','TD','TR','BUTTON','LABEL'];
  const walk = (el) => {
    const tag = el.tagName; if (!tag) return;
    if (tag === 'IMG') { const a = T(el.getAttribute('alt')); if (a.length > 3) blocks.push(a); return; }
    const kids = [...el.children];
    const txt = T(el.textContent);
    if (!txt && !el.querySelector('img')) return;
    if (txt && txt.length < 170 && (kids.length === 0 || INLINE.includes(tag) || kids.every(k => INLINE.includes(k.tagName) || k.tagName === 'BR' || k.tagName === 'IMG'))) {
      blocks.push(txt); el.querySelectorAll('img').forEach(walk); return;
    }
    kids.forEach(walk);
  };
  walk(root);
  const links = [...document.querySelectorAll('a,[onclick]')].map(a => ({
    t: T(a.textContent || (a.querySelector('img') && a.querySelector('img').alt) || '').slice(0, 250),
    h: a.getAttribute('href') || '', o: (a.getAttribute('onclick') || '').slice(0, 300)
  })).filter(l => l.t.length > 3);
  return {blocks, links, title: document.title, url: location.href};
}
"""


def find_link(title, links, base):
    key = re.sub(r"\s+", "", title)[:20]
    cands = [l for l in links if key and key in re.sub(r"\s+", "", l["t"])]
    if not cands:
        return ""
    best = min(cands, key=lambda l: len(l["t"]))
    h = best["h"]
    if h and not h.lower().startswith(("javascript", "#")):
        return urljoin(base, h)
    m = re.search(r"['\"](/[^'\"]+\.(?:do|jsp|cmd|html|act|ibk)[^'\"]*|https?://[^'\"]+)['\"]", (h or "") + " " + best["o"])
    return urljoin(base, m.group(1)) if m else ""


def extract_events(src, data):
    lines = []
    for t in data["blocks"]:
        if not lines or lines[-1] != t:
            lines.append(t)
    notice_mode = src.get("mode") == "notice"
    events, seen = [], set()
    for i, t in enumerate(lines):
        if len(t) < 5 or len(t) > 170 or NOISE.search(t):
            continue
        own = parse_range(t)
        # 제목 줄 자체가 날짜뿐이면 건너뜀
        if own[2] and len(clean_title(t, own[2])) < 4:
            continue
        rng = own
        if not rng[1]:
            # 바로 아래 1~3줄 중 날짜만 있는 줄을 기간으로 사용
            for j in range(i + 1, min(i + 4, len(lines))):
                nxt = lines[j]
                r = parse_range(nxt)
                if r[1] and len(clean_title(nxt, r[2])) < 12:
                    rng = r
                    break
                if parse_range(nxt)[1]:  # 다음 이벤트 줄을 만나면 중단
                    break
        has_word = re.search(EVENT_WORDS, t, re.I)
        if notice_mode:
            if not re.search(r"이벤트|혜택|프로모션|캐시백|경품|쿠폰", t):
                continue
            if re.search(r"종료|당첨|안내|공지|변경|중단|유의", t):
                continue
        elif not rng[1] and not (has_word and src.get("loose")):
            continue
        title = clean_title(t, rng[2])
        if len(title) < 4 or len(title) > 120:
            continue
        k = re.sub(r"\W", "", title)
        if k in seen or any(k in s or s in k for s in seen if len(s) > 8 and len(k) > 8):
            continue
        seen.add(k)
        desc = lines[i + 1] if i + 1 < len(lines) and not parse_range(lines[i + 1])[1] else ""
        url = find_link(title, data["links"], data["url"])
        events.append(make_event(src, title, rng[0], rng[1], url, desc))
    return events


# ── JSON API 로 바로 가져오는 사이트 ──────────────────────────
def api_samsung(src):
    r = requests.post("https://www.samsungpop.com/mbw/customer/noticeEvent.do", timeout=30,
                      headers={"X-Requested-With": "XMLHttpRequest", "User-Agent": MOBILE_UA,
                               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                               "Referer": "https://www.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventList"},
                      data="currentPage=1&rowsPerPage=100&ntcSect=3&todayEnd=0&searchType=0&siteGubun=H24&cmd=getEventList&ajaxQuery=1",
                      )
    r.raise_for_status()
    out = []
    for x in r.json().get("list", []):
        s, e, _ = parse_range(x.get("period", ""))
        out.append(make_event(src, x["ntcTitle1"].strip(), s, e,
                              f"https://www.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventView&menuSeqNo={x.get('menuSeqNo','')}",
                              x.get("EtcConts5", "")))
    return out


def api_nh(src):
    out = []
    for page in range(1, 6):
        r = requests.post("https://m.mynamuh.com/customer/event/eventList.json", timeout=30,
                          headers={"X-Requested-With": "XMLHttpRequest", "User-Agent": MOBILE_UA,
                                   "Referer": "https://m.mynamuh.com/customer/event/eventList"},
                          data={"page": page, "seq": "", "category": "", "keyword": ""})
        r.raise_for_status()
        res = r.json()["result"]
        for x in res.get("content", []):
            f = lambda d: f"{d[:4]}.{d[4:6]}.{d[6:8]}" if d and len(d) == 8 else ""
            out.append(make_event(src, x["mTitle"].strip(), f(x.get("mStartDttm")), f(x.get("mEndDttm")),
                                  f"https://m.mynamuh.com/customer/event/eventView?mNo={x['mNo']}", x.get("mSummary") or ""))
        if page >= int(res.get("totalPages") or 1):
            break
    return out


def api_html(src):
    """브라우저 없이 서버 렌더링 HTML 을 받아 처리 (IBK투자증권 등)"""
    from bs4 import BeautifulSoup
    import ssl
    from requests.adapters import HTTPAdapter

    class LegacyTLS(HTTPAdapter):  # 오래된 암호화 방식만 지원하는 금융사 서버 대응 (인증서 검증은 유지)
        def init_poolmanager(self, *a, **kw):
            ctx = ssl.create_default_context()
            ctx.set_ciphers("DEFAULT:@SECLEVEL=1")
            ctx.options |= getattr(ssl, "OP_LEGACY_SERVER_CONNECT", 0x4)
            kw["ssl_context"] = ctx
            return super().init_poolmanager(*a, **kw)

    sess = requests.Session()
    sess.mount("https://", LegacyTLS())
    import os
    try:
        r = sess.get(src["url"], timeout=30, headers={"User-Agent": DESKTOP_UA},
                     verify=os.environ.get("REQUESTS_CA_BUNDLE", True))
        raw, final_url = r.content, r.url
    except requests.exceptions.SSLError:
        import subprocess  # 파이썬 SSL 이 안 맞는 서버는 시스템 curl 로 재시도
        raw = subprocess.run(["curl", "-sSL", "-m", "30", "-A", DESKTOP_UA, src["url"]],
                             capture_output=True, check=True).stdout
        final_url = src["url"]
    html = raw.decode(src.get("encoding") or "utf-8", errors="replace")
    soup = BeautifulSoup(html, "html.parser")
    for s in soup(["script", "style", "header", "footer", "nav", "select"]):
        s.decompose()
    blocks = [re.sub(r"\s+", " ", x).strip() for x in soup.get_text("\n").split("\n")]
    blocks = [b for b in blocks if b]
    links = [{"t": re.sub(r"\s+", " ", a.get_text(" ")).strip(), "h": a.get("href", ""), "o": a.get("onclick", "")} for a in soup.find_all("a")]
    return extract_events(src, {"blocks": blocks, "links": links, "url": final_url})


APIS = {"samsung": api_samsung, "nh": api_nh, "html": api_html}


# ── 브라우저 크롤링 ───────────────────────────────────────────
async def render(browser, src):
    ctx = await browser.new_context(
        locale="ko-KR", timezone_id="Asia/Seoul", ignore_https_errors=True,
        user_agent=MOBILE_UA if src.get("mobile") else DESKTOP_UA,
        viewport={"width": 430, "height": 2000} if src.get("mobile") else {"width": 1400, "height": 2200},
        is_mobile=bool(src.get("mobile")), has_touch=bool(src.get("mobile")),
    )
    page = await ctx.new_page()
    try:
        if src.get("pre"):  # 직접 URL 접근이 막힌 사이트: 메인 → JS 로 메뉴 이동
            await page.goto(src["pre"]["url"], timeout=45000, wait_until="domcontentloaded")
            await page.wait_for_timeout(4000)
            await page.evaluate(src["pre"]["js"])
            await page.wait_for_timeout(2000)
        else:
            await page.goto(src["url"], timeout=45000, wait_until="domcontentloaded")
        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        await page.wait_for_timeout(src.get("wait", 3000))
        for _ in range(src.get("scrolls", 3)):
            await page.mouse.wheel(0, 4000)
            await page.wait_for_timeout(700)
        for sel in src.get("click", []):
            try:
                await page.click(sel, timeout=3000)
                await page.wait_for_timeout(2000)
            except Exception:
                pass
        datas = []
        for fr in page.frames:
            try:
                datas.append(await fr.evaluate(EXTRACT_JS))
            except Exception:
                pass
        try:
            await page.screenshot(path=str(DBG / f"{src['name']}.png"))
        except Exception:
            pass
        return datas
    finally:
        await ctx.close()


async def crawl_one(browser, src, sem):
    async with sem:
        res = {"name": src["name"], "type": src["type"], "url": src["url"], "ok": False, "events": [], "error": "", "note": src.get("note", "")}
        for attempt in range(2):  # 금융사 서버가 간헐적으로 끊겨서 1회 재시도
            try:
                if src.get("api"):
                    evs = await asyncio.to_thread(APIS[src["api"]], src)
                    nblocks = len(evs)
                else:
                    datas = await render(browser, src)
                    nblocks = sum(len(d["blocks"]) for d in datas)
                    (DBG / f"{src['name']}.txt").write_text(
                        "\n\n".join(d["url"] + "\n" + "\n".join(d["blocks"]) for d in datas)[:40000], encoding="utf-8")
                    evs = [e for d in datas for e in extract_events(src, d)]
                    res["events"] = evs
                res["events"] = list({e["id"]: e for e in evs}.values())
                if nblocks < 10 and not res["events"] and attempt == 0 and not src.get("api"):
                    raise RuntimeError("내용 없음(일시 오류 가능) — 재시도")
                res["ok"] = True
                res["error"] = "" if (nblocks >= 10 or res["events"] or src.get("api")) else "페이지 내용이 거의 없음 — URL 변경/차단 확인 필요"
                if not res["events"] and not res["error"] and not src.get("mode") == "notice":
                    res["error"] = "이벤트를 하나도 못 찾음 — 페이지 구조 변경 확인 필요"
                break
            except Exception as e:
                res["error"] = f"{type(e).__name__}: {str(e).splitlines()[0][:140]}"
                await asyncio.sleep(3)
        mark = "OK" if res["ok"] and not res["error"] else "!!"
        print(f"{mark} {src['name']:<9} {len(res['events']):>3}건  {res['error']}", flush=True)
        return res


def not_expired(ev):
    e = ev.get("end", "")
    return not (re.match(r"\d{4}\.\d{2}\.\d{2}$", e) and e < TODAY.strftime("%Y.%m.%d"))


async def main(filters):
    sources = [s for s in json.loads((ROOT / "sources.json").read_text(encoding="utf-8")) if not s.get("disabled")]
    if filters:
        sources = [s for s in sources if any(f in s["name"] for f in filters)]
    sem = asyncio.Semaphore(4)
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--no-sandbox", "--disable-blink-features=AutomationControlled"])
        results = await asyncio.gather(*[crawl_one(browser, s, sem) for s in sources])
        await browser.close()

    for r in results:
        r["events"] = [e for e in r["events"] if not_expired(e)]
    events = [e for r in results for e in r["events"]]
    srcs = [{k: r[k] for k in ("name", "type", "url", "ok", "error", "note")} | {"count": len(r["events"])} for r in results]

    old_p = OUT / "events.json"
    if filters and old_p.exists():  # 일부만 돌렸으면 기존 결과에 병합
        old = json.loads(old_p.read_text(encoding="utf-8"))
        names = {r["name"] for r in results}
        events = [e for e in old["events"] if e["institution"] not in names and not_expired(e)] + events
        srcs = [s for s in old["sources"] if s["name"] not in names] + srcs

    # 처음 발견된 날짜 기록 → 'NEW' 표시용
    first_seen = {}
    if old_p.exists():
        for e in json.loads(old_p.read_text(encoding="utf-8")).get("events", []):
            first_seen[e["id"]] = e.get("firstSeen")
    now = datetime.datetime.now(KST)
    for e in events:
        e["firstSeen"] = first_seen.get(e["id"]) or now.strftime("%Y-%m-%d")

    order = {s["name"]: i for i, s in enumerate(json.loads((ROOT / "sources.json").read_text(encoding="utf-8")))}
    events.sort(key=lambda e: (order.get(e["institution"], 999), e["end"] or "9999"))
    srcs.sort(key=lambda s: order.get(s["name"], 999))
    out = {
        "crawledAt": now.strftime("%Y-%m-%d %H:%M KST"),
        "summary": {c: sum(1 for e in events if c in e["categories"]) for c in CAT_LABEL},
        "sources": srcs,
        "events": events,
    }
    old_p.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    ok = sum(1 for s in srcs if s["ok"] and not s["error"])
    print(f"\n완료: {ok}/{len(srcs)}개 금융사 정상 · 진행중 이벤트 {len(events)}건 → output/events.json")
    print("  " + " / ".join(f"{CAT_LABEL[c]} {n}" for c, n in out["summary"].items()))


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))
