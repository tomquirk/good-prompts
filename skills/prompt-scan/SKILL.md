---
name: prompt-scan
description: Scan X (the user's bookmarks plus public search) for one-shot AI coding prompts and open a clean pull request adding the good ones to prompts.json. Run four times a day.
---

# Prompt scan

Find reusable prompts for AI coding agents (Claude Code, Codex, Cursor and similar) on X and add the good ones to this repo through a pull request.

## Sources

1. **The owner's X bookmarks** (signed-in X tool, read only; never add, change or remove bookmarks). Page through until you reach bookmarks you've already considered. The owner bookmarks good ones on purpose, so a bookmark is a strong signal and doesn't need high engagement, but it still has to meet the quality bar.
2. **Public X search** for popular posts sharing such prompts. Check engagement yourself (likes, bookmarks, quotes); search can't filter by it.

Keep a durable list of every tweet ID and URL you've considered, with the decision and reason, so you never re-analyse a post or add a duplicate. This list is the running agent's own state and is not stored in this repo.

If a post's text is truncated, read its full text (note_tweet), any image, or the linked source to get the whole prompt.

## Quality bar

Keep a prompt only if it is complete, useful and **one-shot**: something you can paste to a coding agent when you have tokens to spare, like asking it to audit and prune old agent transcripts on a Mac.

Skip:
- Standing rules or additions for AGENTS.md, CLAUDE.md or other always-on instruction files.
- Vague advice, jokes, jailbreaks, malware, harmful instructions and thin self-promotion.
- Non-coding prompts (resumes, trading, content farming and so on).
- Anything already in `prompts.json`, including the same idea in different words.
- Generic web-app security audits that overlap the existing `security-audit-dashboard` prompt, which the owner prefers.
- Anything the owner previously removed (for example `deepen-modules-simplify-interfaces`).

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

When a PR is ready, send the owner a very short note: the PR link, the author's post link, one line on what the prompt does, and then the full prompt text exactly as committed in a code block, so they can review and approve the merge from chat. If they say "merge", merge it with `gh pr merge --merge`.

Also report a failed run. If nothing qualifies, stay silent.
