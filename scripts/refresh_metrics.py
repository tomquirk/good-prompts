#!/usr/bin/env python3
"""Refresh metrics.json with X engagement counts for prompts sourced from X.

Usage:
  python3 scripts/refresh_metrics.py ids
      Print the tweet IDs from prompts.json, one comma-separated batch of up to
      100 per line (ready for GET /2/tweets?ids=...&tweet.fields=public_metrics).

  python3 scripts/refresh_metrics.py write RESPONSE.json [RESPONSE.json ...]
      Merge X API v2 /2/tweets responses (raw JSON with a "data" list of posts
      carrying public_metrics) into metrics.json.

  python3 scripts/refresh_metrics.py fetch
      Fetch from api.x.com directly using the X_BEARER_TOKEN env var, then write.

Only metrics.json is ever written. Tweets missing from the responses are left
out (never written as zeros). A tweet whose counts did not change keeps its old
fetched_at, so an unchanged run produces no diff.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METRICS = ROOT / "metrics.json"
URL_RE = re.compile(r"^https?://(?:www\.|mobile\.)?(?:x|twitter)\.com/[A-Za-z0-9_]+/status/(\d+)(?:[/?#].*)?$")
FIELDS = {"likes": "like_count", "replies": "reply_count", "reposts": "retweet_count",
          "quotes": "quote_count", "views": "impression_count"}
ALIASES = {"retweet_count": "repost_count"}  # some X clients return repost_count


def tweet_ids():
    data = json.loads((ROOT / "prompts.json").read_text())
    ids = set()
    for p in data["prompts"]:
        url = (p.get("source") or {}).get("url")
        m = URL_RE.match(url) if isinstance(url, str) else None
        if m:
            ids.add(m.group(1))
    return sorted(ids, key=int)


def batches(ids, n=100):
    return [ids[i:i + n] for i in range(0, len(ids), n)]


def posts_from(responses):
    posts = {}
    for r in responses:
        for post in r.get("data") or []:
            pm = dict(post.get("public_metrics") or {})
            for k, alt in ALIASES.items():
                if k not in pm and alt in pm:
                    pm[k] = pm[alt]
            if post.get("id") and all(k in pm for k in FIELDS.values()):
                posts[str(post["id"])] = pm
    return posts


def write(posts):
    wanted = set(tweet_ids())
    old = {}
    if METRICS.exists():
        old = json.loads(METRICS.read_text()).get("tweets", {})
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    tweets = {}
    for tid in sorted(set(posts) & wanted, key=int):
        entry = {k: int(posts[tid][v]) for k, v in FIELDS.items()}
        prev = old.get(tid)
        if prev and all(prev.get(k) == entry[k] for k in FIELDS):
            entry["fetched_at"] = prev["fetched_at"]
        else:
            entry["fetched_at"] = now
        tweets[tid] = entry
    text = json.dumps({"schema_version": 1, "tweets": tweets}, indent=2) + "\n"
    changed = not METRICS.exists() or METRICS.read_text() != text
    if changed:
        METRICS.write_text(text)
    print(f"{len(tweets)} of {len(wanted)} tweets; {'changed' if changed else 'unchanged'}")


def fetch():
    token = os.environ["X_BEARER_TOKEN"]
    out = []
    for b in batches(tweet_ids()):
        req = urllib.request.Request(
            "https://api.x.com/2/tweets?ids=" + ",".join(b) + "&tweet.fields=public_metrics",
            headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            out.append(json.load(resp))
    return out


def main(argv):
    if argv[:1] == ["ids"]:
        for b in batches(tweet_ids()):
            print(",".join(b))
    elif argv[:1] == ["write"] and len(argv) > 1:
        write(posts_from(json.loads(Path(f).read_text(), strict=False) for f in argv[1:]))
    elif argv[:1] == ["fetch"]:
        write(posts_from(fetch()))
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
