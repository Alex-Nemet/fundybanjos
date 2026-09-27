#!/usr/bin/env bash
# Measure page speed with Lighthouse and append the results to history.csv.
#
#   _docs/performance/measure.sh <commit> "<label>"
#
# Checks out <commit> into a temp folder, serves it locally, and runs
# Lighthouse RUNS times per page in both mobile and desktop mode. The median
# of each metric is appended to history.csv. Needs node (for npx) and chromium.
#
# Numbers come from a local server with Lighthouse's simulated throttling, so
# compare rows with each other rather than with real-world load times.

set -euo pipefail

COMMIT=${1:?usage: measure.sh <commit> "<label>"}
LABEL=${2:?usage: measure.sh <commit> "<label>"}
RUNS=${RUNS:-3}
PAGES=${PAGES:-"index custom-banjo-gallery about testimonials fundy-tuner chanterelle-open-back-banjo"}
CHROME=${CHROME:-/usr/bin/chromium}
PORT=${PORT:-8850}

HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(git -C "$HERE" rev-parse --show-toplevel)
SHA=$(git -C "$REPO" rev-parse --short "$COMMIT")
WORK=$(mktemp -d)
SITE="$WORK/site"

git -C "$REPO" worktree add -q --detach "$SITE" "$SHA"
python3 -m http.server "$PORT" --directory "$SITE" >/dev/null 2>&1 &
SERVER=$!
cleanup() {
    kill "$SERVER" 2>/dev/null || true
    git -C "$REPO" worktree remove --force "$SITE" 2>/dev/null || true
    rm -rf "$WORK"
}
trap cleanup EXIT
sleep 1

for page in $PAGES; do
    for form in mobile desktop; do
        preset=()
        [ "$form" = desktop ] && preset=(--preset=desktop)
        for run in $(seq "$RUNS"); do
            npx -y lighthouse@12 "http://localhost:$PORT/$page.html" "${preset[@]}" \
                --quiet --only-categories=performance --output=json \
                --output-path="$WORK/$page-$form-$run.json" \
                --chrome-path="$CHROME" --chrome-flags="--headless=new --no-sandbox" >/dev/null 2>&1
        done
        echo "measured $page ($form)" >&2
    done
done

python3 "$HERE/summarize.py" "$WORK" "$SHA" "$LABEL" >> "$HERE/history.csv"
echo "appended results for $SHA to $HERE/history.csv" >&2
