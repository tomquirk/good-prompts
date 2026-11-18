---
name: refresh-metrics
description: Refresh metrics.json with current X engagement counts for every prompt sourced from an X post. Run once a day.
---

# Refresh engagement metrics

Keeps `metrics.json` at the repo root up to date with likes, replies, reposts, quotes and views for each prompt whose `source.url` is an X post.

## Steps

1. `git fetch origin` and update a local `main` to `origin/main`.
2. Get the tweet IDs: `python3 scripts/refresh_metrics.py ids`. Each output line is one comma-separated batch of up to 100 IDs, taken from `source.url` values matching `https://x.com/<user>/status/<id>` (or twitter.com). Other or null URLs are skipped.
3. Look up each batch with the X API v2: `GET /2/tweets?ids=<batch>&tweet.fields=public_metrics`.
   - With an `X_BEARER_TOKEN` env var, `python3 scripts/refresh_metrics.py fetch` does steps 3 and 4 in one go.
   - Otherwise fetch with any X API v2 client (for example an X connector's get-posts-by-ids tool), save each raw JSON response to a file, and run `python3 scripts/refresh_metrics.py write <response.json> [...]`. The script accepts either `retweet_count` or `repost_count`.
4. The script writes `metrics.json` in this exact shape, with tweet IDs sorted ascending and 2-space indentation:

   ```json
   {
     "schema_version": 1,
     "tweets": {
       "<tweet id>": {
         "likes": 0,
         "replies": 0,
         "reposts": 0,
         "quotes": 0,
         "views": 0,
         "fetched_at": "<ISO 8601 UTC>"
       }
     }
   }
   ```

   - A tweet that isn't returned (deleted, private, or an error) is left out. Never write zeros; the site falls back to free likes and replies on its own.
   - A tweet whose counts haven't changed keeps its previous `fetched_at`, so an unchanged run produces no diff.
5. Only ever change `metrics.json`. Never touch `prompts.json`, the feeds or anything else.
6. If `git status --porcelain metrics.json` is empty, stop without committing. Otherwise commit only `metrics.json` with the message `Refresh metrics` and push to `main`.
