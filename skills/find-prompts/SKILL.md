---
name: find-prompts
description: Find complete, one-shot prompts for AI coding agents (Claude Code, Codex, Cursor and similar) in X posts, judge them against a quality bar, and return clean candidate entries. Works anywhere you have X read access; it does not publish anything.
---

# Find prompts on X

Search X for prompts people share for AI coding agents, keep only the good ones, and return them as structured candidates. This skill only finds and judges. What you do with the candidates (save them, post them, open a PR to a collection) is up to the caller.

## Inputs

- **X read access.** Any X API v2 client works: an X connector, an MCP server, or a bearer token.
- **Optional: the user's bookmarks**, if you can read them as the user. Treat a bookmark as a strong signal that the post is good; it doesn't need high engagement, but it still has to pass the quality bar. Never add, change or remove bookmarks.
- **Optional: an existing collection** to dedupe against (for example a `prompts.json` or a JSON Feed).
- **A considered list**: a file that records every post ID and URL you've already judged, with the decision and a short reason. Read it first and append to it after, so you never judge the same post twice. If the caller doesn't name one, use `~/.find-prompts/considered.json`.

## Steps

1. **Bookmarks first** (if available): page through newest-first until you reach posts on the considered list.
2. **Public search**: run several searches for recent posts that share agent prompts, for example phrases like "paste this into Claude Code", "prompt for Codex", "give your agent this prompt", "Cursor prompt", "one-shot prompt". Search can't filter by engagement, so check likes, bookmarks, reposts and quotes yourself.
3. **Get the whole prompt.** If a post's text is truncated, read its full long-form text (note_tweet or article), any attached image, the quoted post, or the linked source. If you can't read the full prompt, skip the post.
4. **Judge** each post against the quality bar below, and dedupe against the collection, including the same idea in different words.
5. **Record** every post you looked at in the considered list.
6. **Return** the candidates.

## Quality bar

Keep a prompt only if it is complete, useful and **one-shot**: a task you can paste to a coding agent when you have tokens to spare, which it can finish and hand back. Good examples: "Map this codebase: folder structure, what each main file does, how data flows from UI to database, the 5 riskiest files. Write it to ARCHITECTURE.md." or "Find all of the implicit state machines in my app."

Skip:
- Standing rules or additions to AGENTS.md, CLAUDE.md or other always-on instruction files, and setups for ongoing loops or harnesses.
- Vague advice, tips threads, hype, jokes and engagement bait.
- Jailbreaks, malware, harmful instructions, or anything that installs uncensored models or bypasses safety.
- Thin self-promotion, such as "install my tool" one-liners.
- Non-coding prompts (resumes, trading, marketing, content farming, image or video generation).
- Prompts that only exist in an image you can't read, or behind a link you can't open.
- Public-search posts with negligible engagement, unless the user bookmarked them.

## Output

Return a list of candidates. Each one should look like this:

```json
{
  "id": "short-kebab-case-id",
  "title": "What the prompt does",
  "category": "Codebase audits and simplification",
  "tags": ["audit"],
  "use_when": "One sentence on when it helps.",
  "scope": "project",
  "prompt": "The prompt text, exactly as posted.",
  "source": {
    "url": "https://x.com/someone/status/123",
    "author": "@someone",
    "status": "verified"
  },
  "engagement": { "likes": 0, "bookmarks": 0 },
  "why": "One line on why it passed."
}
```

- `scope` is `project` for work in a repo and `machine` for work on the computer itself (logs, caches, configs).
- Clean up formatting and obvious typos only. Don't invent text or change the meaning.
- If the prompt depends on context in the post (for example "this issue" pointing at a quoted tweet), add that link to the prompt so it stands alone.
- If the post only points to a long external workflow, write a short summary, set `"text_kind": "summary"`, and link the full source.
- Set `status` to `verified` only if you actually read the full source; otherwise `unverified`.
- Leave out secrets, private details and personal data if a post accidentally contains them.

If nothing passes, return an empty list and the few closest misses, each with the reason it failed.
