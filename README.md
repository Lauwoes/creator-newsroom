# The Creator Newsroom, a desk simulation on real data

A single-page simulation of the Creator Newsroom operating model, built as the functional prototype behind an NYU SPS x Google Marketing Accelerator Hackathon submission (Track 3, Process and Go-To-Market Strategy).

It shows a morning on the desk: a trend board fed by real signals, one-click commissioning to a retained bench of real YouTube channels, a brief drafted from the style guide, a first read that sorts every draft into green, amber or red, a 48-hour read, boosting, and a dashboard that reports trend-to-live against the pilot target and today's published timelines.

## What is real, what is not

- **Real:** the brand (Brooks Running, Ghost 18, Hyperion Elite 6, Cascadia 20; read from brooksrunning.com on 22 Sep 2026), the sixteen channels on the bench with their public subscriber counts and feed views, every signal on the trend board (Google Trends, Wikipedia pageviews, YouTube feeds, each linked to its source), the race calendar, the FTC rules and footwear cases behind the standards, and the Google product names.
- **Modelled, with the formula shown on the page:** the rate card, the reach index, momentum.
- **Simulated:** the day-by-day reveal, every assignment, brief, draft and outcome, and the 48-hour read.

The channels are real public YouTube channels found through public search. None is affiliated with Brooks or with this project, none was contacted, and no draft script or quote is attributed to any of them. Brooks is not involved in the project. The "What is real" screen on the site lists every source with its access date.

## How the data refreshes

`scripts/fetch_data.py` (Python 3.9+, standard library only, no API key) writes `data/live.json` from:

- YouTube channel RSS feeds (the latest 15 uploads per channel with public view counts) and channel pages (the public subscriber count);
- the Wikimedia pageviews API (English Wikipedia daily views for running topics, brands and races);
- Google Trends' web endpoints (best effort; they rate-limit quickly).

When a source fails, the last good value is kept and marked `stale`; nothing is estimated or invented. If every source fails, the file is left untouched and the script exits 1.

`.github/workflows/refresh-data.yml` runs the script every day at 09:17 UTC (late enough for Wikimedia to have published the previous day's totals; also on demand from the Actions tab), then runs `scripts/build_snapshot.py`, which embeds a slim copy of the data in `index.html` as the fallback snapshot, and commits both files if they changed.

The page loads `data/live.json` when it opens (the top bar says "Daily file · refreshed <date>"; if the file is more than 36 hours old it says "Daily file from <date>, not refreshed since", so a stalled Action is visible), falls back to the embedded snapshot if that fails ("Snapshot · <date>"), and then refreshes the Wikipedia figures directly in the browser ("N refreshed in browser").

Run it locally from the repository root:

```bash
python3 scripts/fetch_data.py                       # full refresh, about 4 minutes because Google Trends throttles
python3 scripts/fetch_data.py --skip google_trends  # about 30 seconds
python3 scripts/build_snapshot.py                   # re-embed the snapshot in index.html
python3 -m http.server 8000                         # then open http://localhost:8000/
```

Opening `index.html` straight from disk also works; it uses the embedded snapshot.

## Publish on GitHub Pages

1. Push the repository to GitHub.
2. Open Settings, then Pages. Under "Build and deployment", set Source to "Deploy from a branch", pick `main` and the `/ (root)` folder, and save.
3. Open Settings, then Actions, then General, and make sure workflows have "Read and write permissions" so the daily refresh can commit.
4. After a minute or two the site is at `https://<your-username>.github.io/creator-newsroom/`.

## Editing the content

- `scripts/config.json`: the sixteen channels, the watch channels, the Wikipedia articles and the Google Trends terms the fetcher tracks.
- `DATA` at the top of the script in `index.html`: the brand, the desk's terms (amber allowance, legal turnaround, draft term, pilot target), the trend board (each card points at a signal id in the data by `live:`), the claims register, the test scripts, the race calendar and the Google product table.

## Two-minute walkthrough for a judge

1. On the morning meeting, read the signals, then commission the two trends with the highest momentum. Notice the Hyrox card the desk declines.
2. Advance the day three times. Test scripts arrive and get a first read.
3. On the desk, decide any amber pieces. Watch a red one go to legal and come back.
4. Advance until pieces are live and have a 48-hour read, then boost the strongest.
5. Open the dashboard and compare trend-to-live with the 7-day target and today's published ranges.
6. On standards, paste your own script and run the first read.

Progress is kept in the browser's local storage. Reset clears it.
