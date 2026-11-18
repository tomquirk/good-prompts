---
name: publish-prompts
description: Take candidate prompts (for example from the find-prompts skill) and add the good ones to the prompt-collectooor collection through a pull request that merges cleanly.
---

# Publish prompts to prompt-collectooor

Add new prompts to `prompts.json` in https://github.com/tomquirk/prompt-collectooor through a pull request. Run [`find-prompts`](../find-prompts/SKILL.md) first to get candidates, or start from a single post someone wants added.

## Before you add anything

- Drop any candidate already in `prompts.json`, including the same idea in different words.
- Collection-specific skips on top of the find-prompts quality bar:
  - Generic web-app security audits that overlap the existing `security-audit-dashboard` prompt, which the maintainer prefers.
  - Anything the maintainer previously removed (for example `deepen-modules-simplify-interfaces`).
- Strip the candidate-only fields (`engagement`, `why`) before writing the entry.

## Adding prompts

Follow the README's "Add or update a prompt" rules. In short:

1. `git fetch origin` and branch from the latest `origin/main`. Never push prompt changes straight to main.
2. Append entries to `prompts.json`: unique permanent kebab-case `id`, `title`, `category`, `tags`, `use_when`, `scope` (`project` or `machine`), `added_on` set to today's collection date (YYYY-MM-DD, not the tweet date), `prompt`, and `source` with `url`, `author` and `status`.
   - Clean up formatting and obvious typos only. Don't invent text or change the meaning.
   - If the prompt depends on context in the post (for example "this issue" referring to a quoted tweet), include that link in the prompt so it stands alone.
   - If the post only points to a long external workflow, set `text_kind` to `summary` and link the full source.
   - `status` is `verified` only if you actually opened and read the full source; otherwise `unverified`.
   - Leave out secrets, private details or personal data.
   - Never reuse or change an existing `id` or `added_on`.
3. Run `python3 scripts/build.py` and `python3 -m unittest discover -s tests` to validate, then discard the regenerated files (`git checkout -- feed.json feed.xml PROMPTS.md`). Commit only `prompts.json`: CI validates the PR and rebuilds the feeds after merge, so PRs that also carry generated files just cause conflicts. Never edit generated files by hand.
4. Push the branch and open a PR against `main` with `gh pr create`.

## Every PR must merge cleanly

Right before reporting a PR, fetch origin again and bring the branch up to date:

1. Merge `origin/main` into the branch.
2. Resolve any `prompts.json` conflict by taking main's file and appending this branch's new entries by `id`. If the branch carries generated files, reset them to main's versions so the PR only changes `prompts.json`.
3. Rerun the build and tests to validate, commit and push.
4. Confirm the CI check passes and `gh pr view <n> --json mergeable,mergeStateStatus` reports `MERGEABLE` and `CLEAN`. Recheck after a few seconds if it says `UNKNOWN`.

On every run, do the same for any other open prompt PRs that have fallen behind main.

## Reporting

When a PR is ready, send the maintainer a very short note: the PR link, the author's post link, one line on what the prompt does, and then the full prompt text exactly as committed in a code block, so they can review and approve the merge from chat. If they say "merge", merge it with `gh pr merge --merge`.

Also report a failed run. If nothing qualifies, stay silent.
