#!/usr/bin/env python3
"""Embed a slim copy of data/live.json into index.html as the page's fallback snapshot.

The page loads data/live.json when it opens. If that fails (offline, file:// URL, a
broken deploy), it uses the snapshot embedded between the /*SNAP*/ markers instead.
Only the fields the page reads are embedded, and only the trend items the board uses,
so the page stays small. Run from the repo root:

  python3 scripts/build_snapshot.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIVE = os.path.join(ROOT, "data", "live.json")
PAGE = os.path.join(ROOT, "index.html")

CREATOR_FIELDS = ["id", "beat", "name", "handle", "channelId", "url", "flags", "medianViews15", "uploads30d",
                  "uploads30dIsFloor", "shortsInLast15", "daysSinceLastUpload", "feedStale", "subscribers",
                  "subscribersText", "subscribersCapturedAt", "subscribersStale", "stale", "lastSuccess"]
TREND_FIELDS = ["id", "topic", "signal_text", "metric", "value", "change_pct", "window", "source_name", "source_url",
                "captured", "stale", "lastSuccess", "article", "articleUrl", "note", "caveats", "keyword", "partialToday"]
SOURCE_FIELDS = ["id", "name", "url", "status", "ok", "failed", "lastSuccess", "note"]


def main():
    live = json.load(open(LIVE))
    page = open(PAGE, encoding="utf-8").read()
    # Trend ids the board refers to (live: and also: values in the DATA.board literal).
    used = set(re.findall(r'(?:live|also):"([^"]+)"', page))
    slim = {
        "schemaVersion": live.get("schemaVersion"),
        "generatedAt": live.get("generatedAt"),
        "generator": live.get("generator"),
        "embeddedSnapshot": True,
        "benchNote": live.get("benchNote"),
        "summary": live.get("summary"),
        "sources": [{k: s.get(k) for k in SOURCE_FIELDS} for s in live.get("sources", [])],
        "creators": [{k: c.get(k) for k in CREATOR_FIELDS if k in c} for c in live.get("creators", [])],
        "trends": [{k: t.get(k) for k in TREND_FIELDS if k in t} for t in live.get("trends", []) if t.get("id") in used],
    }
    missing = sorted(used - {t["id"] for t in slim["trends"]})
    if missing:
        print("warning: board refers to trend ids not in live.json:", ", ".join(missing), file=sys.stderr)
    blob = json.dumps(slim, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    new_page, n = re.subn(r"/\*SNAP\*/.*?/\*SNAP\*/", lambda m: "/*SNAP*/" + blob + "/*SNAP*/", page, count=1, flags=re.S)
    if n != 1:
        print("error: /*SNAP*/ markers not found in index.html", file=sys.stderr)
        sys.exit(1)
    if new_page != page:
        open(PAGE, "w", encoding="utf-8").write(new_page)
        print(f"embedded snapshot: {len(slim['creators'])} creators, {len(slim['trends'])} trends, {len(blob):,} bytes")
    else:
        print("snapshot unchanged")


if __name__ == "__main__":
    main()
