"""Turn a folder of Lighthouse JSON reports into history.csv rows (median of runs).

Called by measure.sh: python3 summarize.py <report-dir> <commit> <label>
"""

import csv
import datetime
import glob
import json
import os
import statistics
import sys

report_dir, commit, label = sys.argv[1:4]
today = datetime.date.today().isoformat()

groups = {}
for path in sorted(glob.glob(os.path.join(report_dir, "*.json"))):
    page, form, _run = os.path.basename(path)[:-5].rsplit("-", 2)
    groups.setdefault((page, form), []).append(json.load(open(path)))

out = csv.writer(sys.stdout)
for (page, form), reports in sorted(groups.items()):
    def median(get):
        return statistics.median(get(r) for r in reports)

    def audit(key):
        return lambda r: r["audits"][key]["numericValue"]

    out.writerow([
        today, commit, label, page, form, len(reports),
        round(median(lambda r: r["categories"]["performance"]["score"] * 100)),
        round(median(audit("first-contentful-paint")) / 1000, 2),
        round(median(audit("largest-contentful-paint")) / 1000, 2),
        round(median(audit("cumulative-layout-shift")), 3),
        round(median(audit("total-byte-weight")) / 1024),
        round(median(lambda r: len(r["audits"]["network-requests"]["details"]["items"]))),
    ])
