# The Creator Newsroom, a desk simulation

A single-page simulation of the Creator Newsroom operating model, built as a companion to an NYU SPS x Google Marketing Accelerator Hackathon submission (Track 3, Process and Go-To-Market Strategy).

It shows a morning on the desk: a trend board with decaying momentum, one-click commissioning to a retained bench, a brief drafted from the style guide, a first read that sorts every draft into green, amber or red, a 48-hour read, boosting, and a dashboard that reports trend-to-live against the old process.

Everything is fictional: the brand, the correspondents, the trends, the rates and the numbers. No Google product is called. Where the real desk would use Insights Finder, Brand Pulse, Creator Partnerships, Gemini or NotebookLM, the behaviour is scripted, and the site says so on every screen where it matters.

## Publish on GitHub Pages

1. Create a new public repository on GitHub, for example `creator-newsroom`.
2. Upload `index.html` to the root of the repository (drag and drop on the repository page works; no build step is needed).
3. Open Settings, then Pages. Under "Build and deployment", set Source to "Deploy from a branch", pick `main` and the `/ (root)` folder, and save.
4. After a minute or two the site is at `https://<your-username>.github.io/creator-newsroom/`.

Every later change is just a new commit of `index.html`.

## Editing the content

All the data sits in one object, `DATA`, at the top of the script in `index.html`:

- `brand`: the fictional brand and product.
- `trends`: what appears on the board, on which day, with what momentum and decay.
- `bench`: the sixteen correspondents, their beats, turnaround, rate card and performance index.
- `claims`: the red and amber rules the first read applies, plus the disclosure rule.
- `drafts`: the sample scripts correspondents submit. They are handed out in a fixed order so the first three pieces come back green, amber and red.
- `amberAllowance`, `oldProcessDays`, `legalTurnaround`: the risk budget and the comparison baseline.

Nothing else needs to change to swap the brand or the category.

## Two-minute walkthrough for a judge

1. On the morning meeting, commission the two trends with the highest momentum.
2. Advance the day two or three times. Drafts arrive and get a first read.
3. On the desk, decide any amber pieces. Watch a red one go to legal and come back.
4. Advance until pieces are live and have a 48-hour read, then boost the strongest.
5. Open the dashboard and compare trend-to-live with the old-process bar.
6. On standards, paste your own script and run the first read.

Progress is kept in the browser's local storage. Reset clears it.
