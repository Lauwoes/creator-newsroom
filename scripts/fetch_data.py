#!/usr/bin/env python3
"""Key-free data refresh for The Creator Newsroom.

Writes data/live.json from public sources that need no API key:

  * YouTube channel RSS feeds    views for each channel's latest 15 uploads
  * YouTube channel pages        the public, abbreviated subscriber count
  * Wikimedia Pageviews REST API English Wikipedia daily pageviews
  * MediaWiki Action API         checks the configured article titles still exist
  * Google Trends web endpoints  best effort; Google rate-limits them quickly

Ground rules
  * Python 3.9+, standard library only.
  * Every request has a timeout and sits inside try/except.
  * When a source fails, the previous value from the existing data/live.json is
    kept and flagged stale:true with its lastSuccess date. Nothing is estimated,
    interpolated or invented. If there is no previous value, the field is null.
  * If every source fails, data/live.json is left untouched and the script
    exits with status 1.

Static inputs (creators, topics, article titles, keywords) live in
scripts/config.json.

Usage (from the repo root):
  python3 scripts/fetch_data.py
  python3 scripts/fetch_data.py --skip google_trends      # faster local run
Sources for --skip: youtube_rss, youtube_pages, wikimedia, google_trends
"""

import argparse
import datetime as dt
import http.client
import http.cookiejar
import json
import os
import re
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CONFIG = os.path.join(ROOT, "scripts", "config.json")
DEFAULT_OUT = os.path.join(ROOT, "data", "live.json")
SCHEMA_VERSION = 1

FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id={}"
WM_URL = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/"
          "all-access/user/{title}/daily/{start}/{end}")
MW_API = "https://en.wikipedia.org/w/api.php"
GT_EXPLORE = "https://trends.google.com/trends/api/explore"
GT_MULTILINE = "https://trends.google.com/trends/api/widgetdata/multiline"
GT_UI = "https://trends.google.com/trends/explore"

NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
# Subscriber count in the channel page header. It matched exactly once on all 16
# bench pages on 2026-09-22. Do NOT use the first "subscriberCountText" on the
# page: it belongs to a featured channel shelf.
SUB_RE = re.compile(r'"metadataParts":\[\{"text":\{"content":"([^"]+?) subscribers?"\},'
                    r'"accessibilityLabel":"([^"]+?) subscribers?"\}')
ABOUT_SUB_RE = re.compile(r'"aboutChannelViewModel":\{.*?"subscriberCountText":"([^"]*?) subscribers?"', re.S)
CANON_RE = re.compile(r'<link rel="canonical" href="https://www\.youtube\.com/channel/(UC[\w-]{22})">')
ABBR_RE = re.compile(r"^([\d.,]+)\s*([KMB]?)$")
MULT = {"": 1, "K": 1000, "M": 1000000, "B": 1000000000}


# --------------------------------------------------------------------------- utils

def utcnow():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0)


def iso(t):
    return t.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_iso(s):
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(dt.timezone.utc)


def log(msg):
    sys.stderr.write("[%s] %s\n" % (utcnow().strftime("%H:%M:%S"), msg))
    sys.stderr.flush()


def pct_change(cur, prev):
    if prev is None or cur is None or prev == 0:
        return None
    return round(100.0 * (cur - prev) / prev, 1)


def change_phrase(pct):
    if pct is None:
        return "no change figure"
    if pct > 0:
        return "up %.1f%%" % pct
    if pct < 0:
        return "down %.1f%%" % abs(pct)
    return "unchanged"


def day_label(d):
    return "%d %s" % (d.day, d.strftime("%b"))


def expand_abbrev(text):
    """'242K' -> 242000, '1.61M' -> 1610000, '812' -> 812. None if unrecognised."""
    m = ABBR_RE.match(text.strip())
    if not m:
        return None
    try:
        return int(round(float(m.group(1).replace(",", "")) * MULT[m.group(2)]))
    except ValueError:
        return None


# --------------------------------------------------------------------------- http

class FetchError(Exception):
    pass


class Client(object):
    def __init__(self, user_agent, cookies=False, headers=None):
        handlers = []
        if cookies:
            handlers.append(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        self.opener = urllib.request.build_opener(*handlers)
        self.headers = {"User-Agent": user_agent}
        self.headers.update(headers or {})

    def get(self, url, headers=None, timeout=20, attempts=3, waits=(5, 15), max_wait=65,
            deadline=None, retry_on=(429, 500, 502, 503, 504)):
        """Return (body_bytes, final_url). Raise FetchError on failure."""
        h = dict(self.headers)
        h.update(headers or {})
        last = "unknown error"
        for i in range(attempts):
            if deadline is not None and time.monotonic() > deadline:
                raise FetchError("time budget used up")
            try:
                with self.opener.open(urllib.request.Request(url, headers=h), timeout=timeout) as r:
                    return r.read(), r.geturl()
            except urllib.error.HTTPError as e:
                last = "HTTP %d" % e.code
                retry_after = e.headers.get("Retry-After") if e.headers else None
                e.close()
                if e.code not in retry_on or i == attempts - 1:
                    break
                wait = waits[min(i, len(waits) - 1)]
                if retry_after and retry_after.strip().isdigit():
                    wait = int(retry_after.strip()) + 1
            except (urllib.error.URLError, OSError, http.client.HTTPException, ValueError) as e:
                last = "%s: %s" % (type(e).__name__, e)
                if i == attempts - 1:
                    break
                wait = waits[min(i, len(waits) - 1)]
            if wait > max_wait:
                last += " (retry wait %ss too long)" % wait
                break
            if deadline is not None and time.monotonic() + wait > deadline:
                last += " (time budget)"
                break
            log("  %s on %s; retrying in %ss" % (last, url[:90], wait))
            time.sleep(wait)
        raise FetchError(last)


class SourceStatus(object):
    def __init__(self, sid, name, url, note):
        self.d = {"id": sid, "name": name, "url": url, "status": "skipped",
                  "ok": 0, "failed": 0, "lastSuccess": None, "errors": [], "note": note}
        self.attempted = False

    def ok(self):
        self.attempted = True
        self.d["ok"] += 1

    def fail(self, what, err):
        self.attempted = True
        self.d["failed"] += 1
        if len(self.d["errors"]) < 10:
            self.d["errors"].append("%s: %s" % (what, err))
        log("  FAIL %s: %s" % (what, err))

    def finish(self, now, prev_sources, skipped_reason=None):
        d = self.d
        if skipped_reason:
            d["status"] = "skipped"
            d["errors"].append(skipped_reason)
        elif d["ok"] and not d["failed"]:
            d["status"] = "ok"
        elif d["ok"]:
            d["status"] = "partial"
        elif self.attempted:
            d["status"] = "failed"
        prev = prev_sources.get(d["id"], {})
        d["lastSuccess"] = iso(now) if d["ok"] else prev.get("lastSuccess")
        return d


# --------------------------------------------------------------------------- previous file

def load_previous(path):
    try:
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except FileNotFoundError:
        return {}
    except Exception as e:  # corrupt file: start fresh rather than crash
        log("previous %s unreadable (%s); starting without it" % (path, e))
        return {}


def carry_trend(prev_item, reason):
    item = dict(prev_item)
    item["stale"] = True
    item["lastSuccess"] = prev_item.get("lastSuccess") or prev_item.get("captured")
    item["staleReason"] = reason
    return item


# --------------------------------------------------------------------------- YouTube

def fetch_feed(client, channel_id):
    """Parse a channel's RSS feed. Returns (feed_url, author, entries)."""
    url = FEED_URL.format(channel_id)
    body, _ = client.get(url, timeout=20, attempts=3, waits=(3, 8))
    try:
        root = ET.fromstring(body)
    except ET.ParseError as e:
        raise FetchError("feed XML did not parse (%s)" % e)
    author = root.findtext("a:author/a:name", default=None, namespaces=NS)
    entries = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", default="", namespaces=NS)
        ch = e.findtext("yt:channelId", default="", namespaces=NS)
        if ch and ch != channel_id:
            raise FetchError("feed entry belongs to %s, not %s" % (ch, channel_id))
        link = e.find("a:link[@rel='alternate']", NS)
        href = link.get("href") if link is not None else "https://www.youtube.com/watch?v=" + vid
        stats = e.find("media:group/media:community/media:statistics", NS)
        raw_views = stats.get("views") if stats is not None else None
        pub = e.findtext("a:published", default="", namespaces=NS)
        try:
            pub_dt = parse_iso(pub)
        except ValueError:
            continue
        entries.append({
            "videoId": vid,
            "title": e.findtext("a:title", default="", namespaces=NS),
            "published": iso(pub_dt),
            "publishedDt": pub_dt,
            "views": int(raw_views) if raw_views and raw_views.isdigit() else None,
            "isShort": "/shorts/" in href,
            "url": href,
        })
    if not entries:
        raise FetchError("feed returned no entries")
    entries.sort(key=lambda x: x["publishedDt"], reverse=True)
    return url, author, entries


def fetch_subscribers(client, handle, channel_id):
    """Read the public subscriber text from the channel page header (fallback: /about)."""
    page = "https://www.youtube.com/" + urllib.parse.quote(handle, safe="@._-")
    hdrs = {"Accept-Language": "en-US,en;q=0.9", "Cookie": "SOCS=CAI"}
    body, final = client.get(page, headers=hdrs, timeout=30, attempts=2, waits=(5,))
    host = urllib.parse.urlparse(final).hostname
    if host != "www.youtube.com":
        raise FetchError("redirected to %s (consent page?)" % host)
    html = body.decode("utf-8", "replace")
    m = CANON_RE.search(html)
    if not m or m.group(1) != channel_id:
        raise FetchError("channel ID on page (%s) does not match config" % (m.group(1) if m else "none"))
    texts = {x[0] for x in SUB_RE.findall(html)}
    if len(texts) == 1:
        text, source = texts.pop(), page + " (channel page header)"
    else:
        about = page + "/about"
        body, final = client.get(about, headers=hdrs, timeout=30, attempts=2, waits=(5,))
        if urllib.parse.urlparse(final).hostname != "www.youtube.com":
            raise FetchError("about page redirected (consent page?)")
        m2 = ABOUT_SUB_RE.search(body.decode("utf-8", "replace"))
        if not m2:
            raise FetchError("no subscriber count on page header (%d matches) or /about" % len(texts))
        text, source = m2.group(1), about + " (aboutChannelViewModel)"
    n = expand_abbrev(text)
    if n is None:
        raise FetchError("unrecognised subscriber text %r" % text)
    return n, text + " subscribers", source


FEED_FIELDS = ["feedUrl", "feedAuthor", "feedEntries", "medianViews15", "uploads30d", "uploads30dIsFloor",
               "shortsInLast15", "daysSinceLastUpload", "latestVideos", "feedCapturedAt"]
SUB_FIELDS = ["subscribers", "subscribersText", "subscribersSource", "subscribersCapturedAt"]


def summarize_feed(entries, now, prev_creator, n_latest):
    views = [e["views"] for e in entries if e["views"] is not None]
    in30 = [e for e in entries if e["publishedDt"] >= now - dt.timedelta(days=30)]
    prev_views = {}
    prev_at = None
    if prev_creator and prev_creator.get("feedCapturedAt") and prev_creator.get("latestVideos"):
        prev_at = prev_creator["feedCapturedAt"]
        for v in prev_creator["latestVideos"]:
            if isinstance(v, dict) and v.get("videoId") and isinstance(v.get("views"), int):
                prev_views[v["videoId"]] = v["views"]
    latest = []
    for e in entries[:n_latest]:
        age_days = (now - e["publishedDt"]).total_seconds() / 86400.0
        v = {k: e[k] for k in ("title", "videoId", "published", "views", "isShort", "url")}
        v["ageDays"] = round(age_days, 2)
        v["viewsPerDay"] = int(round(e["views"] / age_days)) if (e["views"] is not None and age_days >= 1) else None
        if e["videoId"] in prev_views and e["views"] is not None and prev_at:
            hours = (now - parse_iso(prev_at)).total_seconds() / 3600.0
            # RSS counts are cached up to 15 min and YouTube can revise counts down, so only
            # diff captures at least an hour apart. "gained" can still be negative (real data).
            if hours >= 1:
                v["viewsSincePrev"] = {"gained": e["views"] - prev_views[e["videoId"]],
                                       "hours": round(hours, 1), "prevCapturedAt": prev_at}
        latest.append(v)
    return {
        "feedEntries": len(entries),
        "medianViews15": int(round(statistics.median(views))) if views else None,
        "uploads30d": len(in30),
        # The feed holds at most 15 uploads: if all 15 are inside 30 days the true count is >= 15.
        "uploads30dIsFloor": len(entries) >= 15 and len(in30) == len(entries),
        "shortsInLast15": sum(1 for e in entries if e["isShort"]),
        "daysSinceLastUpload": round((now - entries[0]["publishedDt"]).total_seconds() / 86400.0, 1),
        "latestVideos": latest,
        "feedCapturedAt": iso(now),
    }


def run_youtube(cfg, prev, skip, now, st_rss, st_pages):
    ua = cfg["browserUserAgent"]
    client = Client(ua, headers={"Accept-Language": "en-US,en;q=0.9"})
    ycfg = cfg.get("youtube", {})
    n_latest = int(ycfg.get("latestVideos", 5))
    prev_creators = {c.get("channelId"): c for c in prev.get("creators", []) if isinstance(c, dict)}
    creators = []
    feeds = []  # (channel dict, entries, is_bench) for trend signals

    for c in cfg["creators"]:
        cid = c["channelId"]
        p = prev_creators.get(cid, {})
        rec = {k: c.get(k) for k in ("id", "beat", "name", "handle", "channelId", "url")}
        rec["flags"] = c.get("flags", [])

        # --- RSS feed
        if "youtube_rss" in skip:
            err = "skipped this run"
        else:
            err = None
            log("RSS %s" % c["handle"])
            try:
                feed_url, author, entries = fetch_feed(client, cid)
                rec["feedUrl"] = feed_url
                rec["feedAuthor"] = author
                rec.update(summarize_feed(entries, now, p, n_latest))
                rec["feedStale"] = False
                rec["feedLastSuccess"] = iso(now)
                st_rss.ok()
                feeds.append((c, entries, True))
            except FetchError as e:
                err = str(e)
                st_rss.fail(c["handle"], err)
            time.sleep(0.4)
        if err is not None:
            for k in FEED_FIELDS:
                rec[k] = p.get(k)
            rec["feedUrl"] = FEED_URL.format(cid)
            rec["feedStale"] = True
            rec["feedLastSuccess"] = p.get("feedLastSuccess") or p.get("feedCapturedAt")
            rec["feedError"] = err

        # --- subscriber count
        if "youtube_pages" in skip:
            err = "skipped this run"
        else:
            err = None
            log("page %s" % c["handle"])
            try:
                n, text, source = fetch_subscribers(client, c["handle"], cid)
                rec.update({"subscribers": n, "subscribersText": text, "subscribersSource": source,
                            "subscribersCapturedAt": iso(now), "subscribersStale": False,
                            "subscribersLastSuccess": iso(now)})
                st_pages.ok()
            except FetchError as e:
                err = str(e)
                st_pages.fail(c["handle"], err)
            time.sleep(0.6)
        if err is not None:
            for k in SUB_FIELDS:
                rec[k] = p.get(k)
            rec["subscribersStale"] = True
            rec["subscribersLastSuccess"] = p.get("subscribersLastSuccess") or p.get("subscribersCapturedAt")
            rec["subscribersError"] = err
        rec["subscribersPrecision"] = ("YouTube public abbreviated count (3 significant figures); "
                                       "the number is the abbreviation expanded, not an exact count")

        rec["stale"] = bool(rec["feedStale"] or rec["subscribersStale"])
        dates = [d for d in (rec.get("feedLastSuccess"), rec.get("subscribersLastSuccess")) if d]
        rec["lastSuccess"] = min(dates) if dates else None
        creators.append(rec)

    # --- watch channels (keyword signals only; never attributed to the bench)
    if "youtube_rss" not in skip:
        for w in ycfg.get("watchChannels", []):
            log("RSS watch %s" % w["handle"])
            try:
                _, _, entries = fetch_feed(client, w["channelId"])
                st_rss.ok()
                feeds.append((w, entries, False))
            except FetchError as e:
                st_rss.fail("watch " + w["handle"], str(e))
            time.sleep(0.4)
    return creators, feeds


def youtube_trends(cfg, feeds, now, n_bench_expected):
    """Trend items computed from this run's RSS entries only."""
    ycfg = cfg.get("youtube", {})
    items = []
    captured = iso(now)
    bench_feeds = [f for f in feeds if f[2]]
    watch_names = [f[0]["name"] for f in feeds if not f[2]]
    partial_note = None
    if len(bench_feeds) < n_bench_expected:
        partial_note = "%d of %d bench feeds could not be read this run." % (
            n_bench_expected - len(bench_feeds), n_bench_expected)

    # 1) Fastest-moving bench uploads (views per day since publish), long-form and Shorts separately
    vwin = int(ycfg.get("velocityWindowDays", 7))
    min_age_h = float(ycfg.get("velocityMinAgeHours", 24))
    for is_short, iid, label in ((False, "yt-bench-fastest-video", "video"),
                                 (True, "yt-bench-fastest-short", "Short")):
        cands = []
        for c, entries, _ in bench_feeds:
            for e in entries:
                age_h = (now - e["publishedDt"]).total_seconds() / 3600.0
                if e["isShort"] != is_short or e["views"] is None:
                    continue
                if age_h < min_age_h or age_h > vwin * 24:
                    continue
                cands.append((e["views"] / (age_h / 24.0), e, c, age_h / 24.0))
        if not cands:
            continue
        cands.sort(key=lambda x: x[0], reverse=True)
        vpd, e, c, age = cands[0]
        items.append({
            "id": iid,
            "topic": "Fastest-moving bench %s this week" % label,
            "signal_text": ("'%s' by %s (%s beat) has %s views (RSS) %.1f days after publishing, about %s a day: "
                            "the fastest of %d bench %ss published in the last %d days and at least %d hours old."
                            % (e["title"], c["name"], c["beat"], format(e["views"], ","), age,
                               format(int(round(vpd)), ","), len(cands), label, vwin, int(min_age_h))),
            "metric": "YouTube views (RSS) per day since publish",
            "value": int(round(vpd)),
            "change_pct": None,
            "window": "%s uploads published %s to %s, at least %d hours old" % (
                label, (now - dt.timedelta(days=vwin)).strftime("%Y-%m-%d"), now.strftime("%Y-%m-%d"), int(min_age_h)),
            "source_name": "YouTube channel RSS feed (%s)" % c["name"],
            "source_url": e["url"],
            "captured": captured,
            "stale": False,
            "lastSuccess": captured,
            "sourceKey": "youtube_rss",
            "beat": c["beat"],
            "kind": "bench",
            "caveats": [x for x in [partial_note] if x],
            "supporting": [{"title": x[1]["title"], "channel": x[2]["name"], "beat": x[2]["beat"],
                            "videoId": x[1]["videoId"], "url": x[1]["url"], "published": x[1]["published"],
                            "views": x[1]["views"], "viewsPerDay": int(round(x[0]))} for x in cands[:5]],
        })

    # 2) Keyword topics across bench + watch channels
    kwin = int(ycfg.get("keywordWindowDays", 14))
    cutoff = now - dt.timedelta(days=kwin)
    crowded = [c["name"] for c, entries, _ in feeds
               if len(entries) >= 15 and all(e["publishedDt"] >= cutoff for e in entries)]
    for t in ycfg.get("keywordTopics", []):
        rx = re.compile(t["pattern"], re.I)
        hits = []
        for c, entries, is_bench in feeds:
            for e in entries:
                if e["publishedDt"] >= cutoff and rx.search(e["title"] or ""):
                    hits.append((e, c, is_bench))
        if not hits:
            continue
        hits.sort(key=lambda x: x[0]["views"] or 0, reverse=True)
        total = sum(h[0]["views"] or 0 for h in hits)
        chans = sorted({h[1]["name"] for h in hits})
        n_bench = sum(1 for h in hits if h[2])
        top = hits[0]
        caveats = ["Keyword match on video titles; a match does not mean the video is about the brand or product."]
        if crowded:
            caveats.append("The feed holds only each channel's latest 15 uploads; %s posted more than that in %d days, "
                           "so their counts are floors." % (", ".join(crowded), kwin))
        if partial_note:
            caveats.append(partial_note)
        items.append({
            "id": "yt-kw-" + t["id"],
            "topic": t["topic"],
            "signal_text": ("%d upload%s in the last %d days from %d tracked channel%s (%d from the bench, %d from "
                            "watch channels) %s this topic in the title, with %s views in total (RSS). "
                            "Most viewed: '%s' by %s, %s views."
                            % (len(hits), "" if len(hits) == 1 else "s", kwin, len(chans),
                               "" if len(chans) == 1 else "s", n_bench, len(hits) - n_bench,
                               "matches" if len(hits) == 1 else "match",
                               format(total, ","), top[0]["title"], top[1]["name"],
                               format(top[0]["views"] or 0, ","))),
            "metric": "YouTube views (RSS) summed over matching uploads published in the last %d days" % kwin,
            "value": total,
            "change_pct": None,
            "window": "uploads published %s to %s" % (cutoff.strftime("%Y-%m-%d"), now.strftime("%Y-%m-%d")),
            "source_name": "YouTube channel RSS feeds (%d bench + %d watch channels: %s)" % (
                len(bench_feeds), len(watch_names), ", ".join(watch_names) or "none"),
            "source_url": top[0]["url"],
            "captured": captured,
            "stale": False,
            "lastSuccess": captured,
            "sourceKey": "youtube_rss",
            "beat": t.get("beat"),
            "kind": t.get("kind"),
            "uploads": len(hits),
            "benchUploads": n_bench,
            "channels": chans,
            "caveats": caveats,
            "supporting": [{"title": h[0]["title"], "channel": h[1]["name"], "onBench": h[2],
                            "videoId": h[0]["videoId"], "url": h[0]["url"], "published": h[0]["published"],
                            "views": h[0]["views"], "isShort": h[0]["isShort"]} for h in hits[:5]],
        })
    return items


# --------------------------------------------------------------------------- Wikimedia

def check_titles(client, titles):
    """Return {title: caveat} for titles that are missing or now redirect."""
    url = MW_API + "?" + urllib.parse.urlencode({
        "action": "query", "format": "json", "formatversion": "2", "redirects": "1",
        "titles": "|".join(titles)})
    body, _ = client.get(url, timeout=20, attempts=2)
    q = json.loads(body).get("query", {})
    norm = {n["from"]: n["to"] for n in q.get("normalized", [])}
    redir = {r["from"]: r["to"] for r in q.get("redirects", [])}
    missing = {p["title"] for p in q.get("pages", []) if p.get("missing")}
    out = {}
    for t in titles:
        n = norm.get(t, t)
        if n in redir:
            out[t] = ("The article '%s' now redirects to '%s'; pageviews for the old title undercount. "
                      "Update scripts/config.json." % (n, redir[n]))
        elif n in missing:
            out[t] = "The article '%s' no longer exists on English Wikipedia. Update scripts/config.json." % n
    return out


def run_wikimedia(cfg, prev_trends, skip, now, st_wm, st_mw):
    wcfg = cfg.get("wikimedia", {})
    arts = wcfg.get("articles", [])
    ids = ["wm-" + a["id"] for a in arts]
    if "wikimedia" in skip:
        return [carry_trend(prev_trends[i], "skipped this run") for i in ids if i in prev_trends]
    client = Client(cfg["userAgent"])
    title_caveats = {}
    try:
        title_caveats = check_titles(client, [a["article"] for a in arts][:50])
        st_mw.ok()
    except (FetchError, ValueError, KeyError) as e:
        st_mw.fail("title check", e)

    project = wcfg.get("project", "en.wikipedia")
    end = (now - dt.timedelta(days=1)).date()
    start = end - dt.timedelta(days=int(wcfg.get("daysBack", 63)))
    min_prev = int(wcfg.get("minPrevWeekViews", 200))
    delay = float(wcfg.get("delaySeconds", 1.0))
    items = []
    for a in arts:
        iid = "wm-" + a["id"]
        url = WM_URL.format(project=project, title=urllib.parse.quote(a["article"], safe=""),
                            start=start.strftime("%Y%m%d"), end=end.strftime("%Y%m%d"))
        log("Wikimedia %s" % a["article"])
        try:
            body, _ = client.get(url, timeout=20, attempts=4, waits=(5, 10, 20), max_wait=65)
            data = json.loads(body)
            days = {}
            for it in data.get("items", []):
                days[dt.datetime.strptime(it["timestamp"][:8], "%Y%m%d").date()] = int(it["views"])
            if not days:
                raise FetchError("no daily items returned")
            st_wm.ok()
        except (FetchError, ValueError, KeyError, TypeError) as e:
            st_wm.fail(a["article"], e)
            if iid in prev_trends:
                items.append(carry_trend(prev_trends[iid], "Wikimedia request failed: %s" % e))
            time.sleep(delay)
            continue
        time.sleep(delay)

        last = max(days)
        cur = [last - dt.timedelta(days=i) for i in range(7)]
        prv = [last - dt.timedelta(days=7 + i) for i in range(7)]
        caveats = []
        if a.get("caveat"):
            caveats.append(a["caveat"])
        if a["article"] in title_caveats:
            caveats.append(title_caveats[a["article"]])
        missing = [d for d in cur + prv if d not in days]
        last7 = sum(days[d] for d in cur if d in days)
        prev7 = sum(days[d] for d in prv if d in days)
        why = None
        if missing:
            why = "%d of the 14 days have no data" % len(missing)
        elif prev7 < min_prev:
            why = "fewer than %d views in the previous week, too few for a reliable change figure" % min_prev
        pct = None if why else pct_change(last7, prev7)
        if why:
            caveats.append("No change figure: %s." % why)
        if (now.date() - last).days > 3:
            caveats.append("Latest available day is %s; Wikimedia data is running late." % last.isoformat())
        last28 = [last - dt.timedelta(days=i) for i in range(27, -1, -1)]
        present28 = [(d, days[d]) for d in last28 if d in days]
        peak_d, peak_v = max(present28, key=lambda x: x[1])
        title_disp = a["article"].replace("_", " ")
        if pct is None:
            chg = "against %s in the previous 7 days (no change figure: %s)" % (format(prev7, ","), why or "previous week was zero")
        else:
            chg = "%s on the previous 7 days (%s)" % (change_phrase(pct), format(prev7, ","))
        signal = ("English Wikipedia views of the '%s' article: %s in the 7 days to %s, %s. "
                  "Busiest day in the last 28: %s (%s views)."
                  % (title_disp, format(last7, ","), day_label(last), chg, day_label(peak_d), format(peak_v, ",")))
        items.append({
            "id": iid,
            "topic": a["topic"],
            "signal_text": signal,
            "metric": "English Wikipedia pageviews (agent=user), sum of the last 7 complete days",
            "value": last7,
            "change_pct": pct,
            "window": "%s to %s vs %s to %s" % (cur[-1].isoformat(), cur[0].isoformat(),
                                                prv[-1].isoformat(), prv[0].isoformat()),
            "source_name": "Wikimedia Pageviews REST API",
            "source_url": url,
            "captured": iso(now),
            "stale": False,
            "lastSuccess": iso(now),
            "sourceKey": "wikimedia",
            "beat": a.get("beat"),
            "kind": a.get("kind"),
            "previousValue": prev7,
            "article": a["article"],
            "articleUrl": "https://en.wikipedia.org/wiki/" + urllib.parse.quote(a["article"]),
            "note": a.get("note"),
            "caveats": caveats,
            "series": [[d.isoformat(), days.get(d)] for d in last28],
        })
    return items


# --------------------------------------------------------------------------- Google Trends

class Trends(object):
    def __init__(self, cfg, gcfg, deadline):
        self.client = Client(cfg["browserUserAgent"], cookies=True, headers={"Accept-Language": "en-US,en;q=0.9"})
        self.geo = gcfg.get("geo", "US")
        self.tz = str(gcfg.get("tz", 240))
        self.delay = float(gcfg.get("delayBetweenCallsSeconds", 2))
        self.deadline = deadline

    def _json(self, url, referer):
        # First request of a fresh session usually 429s and sets a cookie; the retry works.
        body, _ = self.client.get(url, headers={"Referer": referer}, timeout=30, attempts=5,
                                  waits=(5, 10, 20, 40), max_wait=45, deadline=self.deadline)
        text = body.decode("utf-8", "replace")
        i = text.find("{")  # strip the )]}' anti-JSON-hijacking prefix
        if i < 0:
            raise FetchError("unexpected Trends response")
        return json.loads(text[i:])

    def timeline(self, keywords, timeframe):
        ui = GT_UI + "?" + urllib.parse.urlencode(
            {"date": timeframe, "geo": self.geo, "q": ",".join(keywords)}, quote_via=urllib.parse.quote)
        req = {"comparisonItem": [{"keyword": k, "geo": self.geo, "time": timeframe} for k in keywords],
               "category": 0, "property": ""}
        j = self._json(GT_EXPLORE + "?" + urllib.parse.urlencode(
            {"hl": "en-US", "tz": self.tz, "req": json.dumps(req, separators=(",", ":"))}), ui)
        w = next((x for x in j.get("widgets", []) if x.get("id") == "TIMESERIES"), None)
        if not w:
            raise FetchError("no TIMESERIES widget in explore response")
        time.sleep(self.delay)
        d = self._json(GT_MULTILINE + "?" + urllib.parse.urlencode(
            {"hl": "en-US", "tz": self.tz, "req": json.dumps(w["request"], separators=(",", ":")),
             "token": w["token"]}), ui)
        pts = d["default"]["timelineData"]
        if not pts:
            raise FetchError("empty timeline")
        return ui, pts


def trends_item(iid, meta, kw, k_index, pts, ui, timeframe, chart_label, now):
    complete, partial = [], None
    for p in pts:
        day = dt.datetime.fromtimestamp(int(p["time"]), dt.timezone.utc).date()
        val = p["value"][k_index]
        if p.get("isPartial"):
            partial = (day, val)
        else:
            complete.append((day, val))
    if len(complete) < 14:
        raise FetchError("only %d complete days" % len(complete))
    cur, prv = complete[-7:], complete[-14:-7]
    last7, prev7 = sum(v for _, v in cur), sum(v for _, v in prv)
    pct = pct_change(last7, prev7)
    caveats = ["Index values are relative to the peak of this chart only; do not compare them with other charts."]
    tf = {"today 3-m": "3-month", "today 1-m": "1-month"}.get(timeframe, timeframe)
    chg = ("%s on the previous 7 days (%d)" % (change_phrase(pct), prev7) if pct is not None
           else "against 0 in the previous 7 days (no change figure)")
    sig = ("US Google search interest for '%s' summed to %d over the 7 complete days to %s, %s. "
           "Daily index 0-100, relative to the peak of its %s %s."
           % (kw, last7, day_label(cur[-1][0]), chg, tf, chart_label))
    if partial and partial[1] > 0:
        sig += " Today's partial value is %d (provisional)." % partial[1]
    if meta.get("caveat"):
        caveats.append(meta["caveat"])
    return {
        "id": iid,
        "topic": meta["topic"],
        "signal_text": sig,
        "metric": "Google Trends US search interest (0-100 index, %s %s), sum of the last 7 complete days" % (tf, chart_label),
        "value": last7,
        "change_pct": pct,
        "window": "%s to %s vs %s to %s" % (cur[0][0].isoformat(), cur[-1][0].isoformat(),
                                            prv[0][0].isoformat(), prv[-1][0].isoformat()),
        "source_name": "Google Trends (unofficial web endpoints, best effort)",
        "source_url": ui,
        "captured": iso(now),
        "stale": False,
        "lastSuccess": iso(now),
        "sourceKey": "google_trends",
        "beat": meta.get("beat"),
        "kind": meta.get("kind"),
        "keyword": kw,
        "previousValue": prev7,
        "partialToday": {"date": partial[0].isoformat(), "value": partial[1]} if partial else None,
        "caveats": caveats,
        "series": [[d.isoformat(), v] for d, v in complete[-28:]],
    }


def run_google_trends(cfg, prev_trends, skip, now, st_gt):
    gcfg = cfg.get("googleTrends", {})
    jobs = []  # (ids, keywords, metas, timeframe, chart_label)
    for t in gcfg.get("terms", []):
        jobs.append((["gt-" + t["id"]], [t["keyword"]], [t], t.get("timeframe", "today 3-m"), "chart"))
    for c in gcfg.get("comparisons", []):
        kws = [k["keyword"] for k in c["keywords"]]
        ids = ["gt-%s-%s" % (c["id"], re.sub(r"[^a-z0-9]+", "-", k.lower()).strip("-")) for k in kws]
        jobs.append((ids, kws, c["keywords"], c.get("timeframe", "today 1-m"), c.get("label", "comparison chart")))

    def carry_all(job_list, reason):
        out = []
        for ids, _, _, _, _ in job_list:
            out.extend(carry_trend(prev_trends[i], reason) for i in ids if i in prev_trends)
        return out

    if "google_trends" in skip:
        return carry_all(jobs, "skipped this run")
    if not gcfg.get("enabled", True):
        return []
    deadline = time.monotonic() + float(gcfg.get("timeBudgetSeconds", 240))
    stop_after = int(gcfg.get("stopAfterConsecutiveFailures", 2))
    tr = Trends(cfg, gcfg, deadline)
    items, fails = [], 0
    for n, (ids, kws, metas, tf, label) in enumerate(jobs):
        if fails >= stop_after or time.monotonic() > deadline:
            reason = ("stopped after %d consecutive failures" % fails) if fails >= stop_after else "time budget used up"
            for _ in jobs[n:]:
                st_gt.fail(", ".join(_[1]), "not attempted: " + reason)
            items.extend(carry_all(jobs[n:], "Google Trends not attempted: " + reason))
            break
        log("Google Trends %s" % ", ".join(kws))
        try:
            ui, pts = tr.timeline(kws, tf)
            built = [trends_item(ids[i], metas[i], kws[i], i, pts, ui, tf, label, now) for i in range(len(kws))]
            items.extend(built)
            st_gt.ok()
            fails = 0
        except (FetchError, ValueError, KeyError, IndexError, TypeError) as e:
            fails += 1
            st_gt.fail(", ".join(kws), e)
            items.extend(carry_all([(ids, kws, metas, tf, label)], "Google Trends request failed: %s" % e))
        time.sleep(float(gcfg.get("delayBetweenTermsSeconds", 4)))
    return items


# --------------------------------------------------------------------------- output

def _scalar(x):
    return x is None or isinstance(x, (bool, int, float))


def dumps(obj, level=0):
    """Pretty JSON, but short numeric lists and [date, value] pairs stay on one line."""
    pad, pad1 = "  " * level, "  " * (level + 1)
    if isinstance(obj, dict):
        if not obj:
            return "{}"
        return "{\n" + ",\n".join("%s%s: %s" % (pad1, json.dumps(k, ensure_ascii=False), dumps(v, level + 1))
                                  for k, v in obj.items()) + "\n" + pad + "}"
    if isinstance(obj, list):
        if not obj:
            return "[]"
        inline = all(_scalar(x) for x in obj) or all(
            isinstance(x, list) and len(x) == 2 and isinstance(x[0], str) and _scalar(x[1]) for x in obj)
        if inline:
            return json.dumps(obj, ensure_ascii=False)
        return "[\n" + ",\n".join(pad1 + dumps(x, level + 1) for x in obj) + "\n" + pad + "]"
    return json.dumps(obj, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--config", default=DEFAULT_CONFIG)
    ap.add_argument("--out", default=DEFAULT_OUT)
    ap.add_argument("--skip", default="", help="comma list: youtube_rss,youtube_pages,wikimedia,google_trends")
    args = ap.parse_args()
    skip = {s.strip() for s in args.skip.split(",") if s.strip()}

    with open(args.config, encoding="utf-8") as f:
        cfg = json.load(f)
    prev = load_previous(args.out)
    prev_trends = {t.get("id"): t for t in prev.get("trends", []) if isinstance(t, dict)}
    prev_sources = {s.get("id"): s for s in prev.get("sources", []) if isinstance(s, dict)}
    now = utcnow()
    log("start; previous file: %s" % ("yes, generated " + str(prev.get("generatedAt")) if prev else "none"))

    st = {
        "youtube_rss": SourceStatus("youtube_rss", "YouTube channel RSS feeds",
                                    "https://www.youtube.com/feeds/videos.xml",
                                    "Latest 15 uploads per channel with public view counts. Server-side only (no CORS)."),
        "youtube_pages": SourceStatus("youtube_pages", "YouTube channel pages (public subscriber count)",
                                      "https://www.youtube.com/",
                                      "Subscriber text read from the channel page header; the channel ID on the page must match."),
        "wikimedia": SourceStatus("wikimedia", "Wikimedia Pageviews REST API",
                                  "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/",
                                  "English Wikipedia daily pageviews, agent=user. Also callable from a browser with a plain fetch()."),
        "mediawiki": SourceStatus("mediawiki", "MediaWiki Action API (article title check)",
                                  MW_API, "Flags configured article titles that were renamed or deleted."),
        "google_trends": SourceStatus("google_trends", "Google Trends (unofficial web endpoints)",
                                      GT_UI, "Best effort: rate-limited (HTTP 429) and untested from GitHub Actions IPs. "
                                             "Last good values are kept and marked stale on failure."),
    }

    creators, feeds = run_youtube(cfg, prev, skip, now, st["youtube_rss"], st["youtube_pages"])

    trends = []
    trends += run_wikimedia(cfg, prev_trends, skip, now, st["wikimedia"], st["mediawiki"])
    trends += run_google_trends(cfg, prev_trends, skip, now, st["google_trends"])
    if feeds:
        trends += youtube_trends(cfg, feeds, now, len(cfg["creators"]))
    else:
        trends += [carry_trend(t, "YouTube RSS feeds could not be read this run")
                   for i, t in prev_trends.items() if i and i.startswith("yt-")]

    fresh_any = any(s.d["ok"] for k, s in st.items() if k != "mediawiki")
    sources = []
    for k, s in st.items():
        sources.append(s.finish(now, prev_sources, "skipped with --skip" if k in skip else None))
    if not fresh_any:
        log("every source failed or was skipped; leaving %s untouched" % args.out)
        return 1

    out = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": iso(now),
        "generator": "scripts/fetch_data.py",
        "notes": cfg.get("notes", []),
        "benchNote": cfg.get("benchNote"),
        "summary": {
            "creators": len(creators),
            "creatorsStale": sum(1 for c in creators if c["stale"]),
            "trends": len(trends),
            "trendsStale": sum(1 for t in trends if t.get("stale")),
            "sourcesOk": [s["id"] for s in sources if s["status"] == "ok"],
            "sourcesPartial": [s["id"] for s in sources if s["status"] == "partial"],
            "sourcesFailed": [s["id"] for s in sources if s["status"] == "failed"],
        },
        "sources": sources,
        "creators": creators,
        "trends": trends,
    }
    text = dumps(out) + "\n"
    json.loads(text)  # never write something that does not parse
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    tmp = args.out + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, args.out)
    s = out["summary"]
    log("wrote %s: %d creators (%d stale), %d trend items (%d stale); ok=%s partial=%s failed=%s"
        % (args.out, s["creators"], s["creatorsStale"], s["trends"], s["trendsStale"],
           s["sourcesOk"], s["sourcesPartial"], s["sourcesFailed"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
