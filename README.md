# Front-page v2 — 18 November 2026

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Ardian9712/news-image-20261118-frontpage-v2/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Ardian9712/news-image-20261118-frontpage-v2/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

A front-page newspaper image summing up 18 November 2026 world news: 40 stories
across six continents, led by the Kerch Bridge, US–Iran fire, and Trump in Manila.
Built for [make.fun news-image-20261118](https://make.fun/bounty/news-image-20261118).

`main.ts` copies the approved image to `/output/entry.png`. Despite its filename,
the source `entry.png` is an unmodified 1024×1024 JPEG (298,888 bytes). Output is
deterministic and byte-identical to the source image on every run.

## Run

Use Node.js 22+ with native TypeScript stripping; no dependencies or build step:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
# Or use the default /output directory:
node main.ts
```

The program creates the output directory, verifies the copied bytes and image
limits, and prints the output path and byte count. It reads the source relative
to its own script directory, so it also works from another working directory.
It runs entirely offline.

## License

MIT — see [LICENSE](LICENSE).

---

[Join make.fun](https://make.fun/r/p8atzycs)
