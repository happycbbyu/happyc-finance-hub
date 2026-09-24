"""
output/events.json → 사이트용 live-events.js 생성
  python build_site_data.py                 # ../live-events.js (저장소 루트) 로 저장
  python build_site_data.py 경로/live-events.js
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).parent
src = json.loads((ROOT / "output" / "events.json").read_text(encoding="utf-8"))
dest = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "live-events.js"

KEEP = ("institution", "type", "categories", "title", "start", "end", "benefitHints", "desc", "url", "firstSeen")
data = {
    "crawledAt": src["crawledAt"],
    "sources": [{k: s[k] for k in ("name", "type", "url", "ok", "count")} for s in src["sources"]],
    "events": [{k: e.get(k) for k in KEEP} for e in src["events"]],
}
js = (
    "// 자동 생성 파일 — 직접 수정하지 마세요 (crawler/build_site_data.py)\n"
    f"// 수집 시각: {src['crawledAt']}\n"
    "window.LIVE_EVENTS = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
)
dest.write_text(js, encoding="utf-8")
print(f"{dest} 저장 ({len(data['events'])}건, {len(js)//1024}KB)")
