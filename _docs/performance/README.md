# Page speed history

`history.csv` logs Lighthouse page-speed results for the site over time, one row
per page and device type for each measured commit. Add a row set after any
change that might affect loading:

```
_docs/performance/measure.sh <commit> "<short label>"
```

It checks out that commit into a temp folder, serves it locally, runs Lighthouse
3 times per page on simulated mobile and desktop, and appends the medians.
Takes roughly 10 minutes. Needs `node` (Lighthouse runs through `npx`) and
`chromium`. Override the page list with `PAGES="index about" measure.sh ...`.

## Columns

| Column | Meaning |
|---|---|
| `score` | Lighthouse performance score, 0–100 |
| `fcp_s` | First Contentful Paint: seconds until anything appears |
| `lcp_s` | Largest Contentful Paint: seconds until the main content appears |
| `cls` | Cumulative Layout Shift: how much the page jumps while loading (under 0.1 is good) |
| `total_kb` | Everything downloaded when the page opens |
| `requests` | Number of files downloaded when the page opens |

## Reading the numbers

Mobile runs simulate a mid-range phone on a slow 4G connection, so times are
much longer than on Wi-Fi. The server is local rather than GitHub Pages, so
compare rows with each other, not with real-world load times. Differences of
a few tenths of a second between runs are noise.
