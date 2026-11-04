# The Creator Newsroom, a desk simulation on real data

A single-page simulation of the Creator Newsroom operating model, built as the functional prototype behind an NYU SPS x Google Marketing Accelerator Hackathon submission (Track 3, Process and Go-To-Market Strategy). A student prototype, not a Google product.

It shows a morning on the desk, set like a newsroom: a trend board fed by real signals, one-click commissioning to a retained bench of real YouTube channels, a brief drafted from the style guide, a first read that sorts every draft into green, amber or red with editor's marks, a 48-hour read, boosting, and a dashboard that reports trend-to-live against the pilot target and today's published timelines.

Live at https://lauwoes.github.io/creator-newsroom/

## Links for the presentation

- `/#standards/demo` opens straight on the script check with larger type for projection. `demo.html` redirects there.
- `/#dashboard` opens on the dashboard.
- Any section can be linked by its hash: `#meeting`, `#desk`, `#standards`, `#bench`, `#dashboard`, and `#about` for the "what is real" page. Add `/demo` to any of them for the larger type.

## What is real, what is not

- **Real:** the brand (Brooks Running, Ghost 18, Hyperion Elite 6, Cascadia 20; read from brooksrunning.com on 22 Sep 2026), the sixteen channels on the bench with their public subscriber counts and feed views, every signal on the trend board (Google Trends, Wikipedia pageviews, YouTube feeds, each linked to its source with its capture time), the race calendar and sponsors, the FTC rules and footwear cases behind the standards, and the Google product names.
- **Modelled, with the formula shown on the page:** the rate card, the reach index, momentum.
- **Simulated:** the day-by-day reveal, every assignment, brief, draft and outcome, and the 48-hour read. The trend cards' angles are editor's notes dated on the page; the signals beneath them refresh daily.

The channels are real public YouTube channels found through public search. None is affiliated with Brooks or with this project, none was contacted, and no draft script or quote is attributed to any of them. Brooks is not involved in the project. The `#about` screen lists every source with its access date.

## Files

- `index.html`: the shell (masthead, folio, section tabs, footer).
- `style.css`: the design. Paper and ink, hairline rules, condensed headlines in Archivo, slugs and numerals in IBM Plex Mono, editor's marks on the script check, a dark scheme that follows the system setting.
- `app.js`: all logic and content, including `DATA` (brand, desk terms, trend board, claims register, test scripts, calendar) and the embedded fallback snapshot of the data.
- `data/live.json`: the daily data file. `scripts/fetch_data.py` writes it; `scripts/config.json` lists what it tracks.

No build step. Every change is a commit of these files.

## How the data refreshes

`scripts/fetch_data.py` (Python 3.9+, standard library only, no API key) writes `data/live.json` from:

- YouTube channel RSS feeds (the latest 15 uploads per channel with public view counts) and channel pages (the public subscriber count);
- the Wikimedia pageviews API (English Wikipedia daily views for running topics, brands and races);
- Google Trends' web endpoints (best effort; they rate-limit quickly).

When a source fails, the last good value is kept and marked `stale`; nothing is estimated or invented. If every source fails, the file is left untouched and the script exits 1.

`.github/workflows/refresh-data.yml` runs the script every day at 09:17 UTC (and on demand from the Actions tab), then runs `scripts/build_snapshot.py`, which embeds a slim copy of the data in `app.js` as the fallback snapshot, and commits both files if they changed.

The page loads `data/live.json` when it opens (the folio line reads "Real data · daily file ..."; if the file is more than 36 hours old it says "not refreshed since", so a stalled Action is visible), falls back to the embedded snapshot if that fails ("snapshot"), and then refreshes the Wikipedia figures directly in the browser ("N refreshed in browser").

Run it locally from the repository root:

```bash
python3 scripts/fetch_data.py                       # full refresh, about 4 minutes because Google Trends throttles
python3 scripts/fetch_data.py --skip google_trends  # about 30 seconds
python3 scripts/build_snapshot.py                   # re-embed the snapshot in app.js
python3 -m http.server 8000                         # then open http://localhost:8000/
```

Opening `index.html` straight from disk also works; it uses the embedded snapshot.

## Editing the content

All the content sits in one object, `DATA`, at the top of `app.js`:

- `brand`: the real brand and products, with the date they were read.
- `desk`: the pilot's working terms (amber allowance, legal turnaround, draft term, trend-to-live target).
- `board`: the trend cards. Each points at a signal id in the data by `live:` (and optionally `also:`), with the day it appears, its decay, its beat and the editor's angle. `boardDate` is the day the angles were written.
- `claims`: the red and amber rules the first read applies, plus the disclosure rule. A missing disclosure is a red check, because the brand is liable for it under the FTC Endorsement Guides.
- `drafts`: the desk's test scripts. They are handed out in a fixed order so the first three pieces come back green, amber and red. They are not attributed to anyone.
- `calendar` and `products`: the race dates and the Google product table, with sources.

The bench itself comes from the data file; edit `scripts/config.json` to change the channels, the Wikipedia articles or the Google Trends terms the fetcher tracks.

## Two-minute walkthrough for a judge

1. On the morning meeting, commission the two trends with the highest momentum.
2. Advance the day two or three times. Test scripts arrive and get a first read.
3. On the desk, decide any amber pieces. Watch a red one go to legal and come back.
4. Advance until pieces are live and have a 48-hour read, then boost the strongest.
5. Open the dashboard and compare trend-to-live with the 7-day target and today's published ranges.
6. On standards, paste your own script and run the first read.

Progress is kept in the browser's local storage. Reset clears it.
