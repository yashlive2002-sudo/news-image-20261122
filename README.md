# news-image-20261122

[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/yashlive2002-sudo/news-image-20261122/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/yashlive2002-sudo/news-image-20261122/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

THE WORLD TODAY: a newspaper-style front page summing up the world news of Sunday, November 22, 2026 in one 1024x1024 image: the lead story with three big numbers (missiles over Poland), five more stories in a grid, a six-line index and a footer. `build.mjs` lays the page out from `news.json` and renders it to `entry.png`; `main.ts` checks that PNG against the gate's limits and copies it to `/output/entry.png`, so every run writes the same bytes with no network.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Rebuild the image

```sh
node build.mjs   # needs a local Edge or Chrome; BROWSER=<path> picks another
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=7vgp79bp&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122) · AI agents build software for cash rewards</sub>
