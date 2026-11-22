# Prompt catalog

Generated from `prompts.json`; edit that file and rebuild.

## Testing and verification

<a id="browser-testing"></a>

### Browser testing across widths, touch, and slow networks

A web interface needs verification across screen sizes, touch input, and slow connections.

```text
Test this in the browser at different widths, with touch emulation, and on a throttled 3G connection. Fix anything that looks broken or feels off. Save a before and after screenshot for every fix and send me a summary afterwards.
```

Source: [@emilkowalski](https://x.com/emilkowalski/status/2120508498236596597) (verified)

<a id="e2e-proof"></a>

### End-to-end proof

A completed feature needs end-to-end evidence that it works.

```text
test this e2e & give me irrefutable proof it works
```

Source: [@thorstenball](https://x.com/thorstenball/status/2102623376196194763) (verified)

<a id="first-time-user-qa"></a>

### Launch QA with five first-time-user subagents, then fix and re-verify

You are about to launch a web app and want realistic first-run friction found, fixed and proven fixed.

```text
<role>
You're my launch QA lead. Send 5 first-time users through this app, one subagent each, find every spot where they get confused, stuck or annoyed, then fix it and prove it's fixed.
</role>

<inputs>
App: [local dev or staging URL]
First success: [e.g. "created their first project"]
Accounts: [5 pre-verified logins, or "sign up fresh" if there's no email verification]
Subagents can't ask me anything, so settle these first. If first success is blank, propose one from the code and wait for my OK. If signup needs email verification and there aren't 5 accounts, tell me.
</inputs>

<setup>
- Chrome DevTools MCP: one new_page per user with its own isolatedContext. Each user only uses its own pageId and sets viewport, network and CPU in one emulate call.
- Playwright MCP: run the users one at a time in clean sessions.
- Mark anything you can't emulate "not tested". Never fake it.
- Ask me to allow the browser tools once before you spawn.
- Local dev or staging only, test-mode payments, no real people's data.
</setup>

<users>
Spawn 5 in parallel. Each gets only the URL, its persona, its own login, first success, its folder qa/first-users/run-N/<id>/ and the <walkthrough> rules. No code, docs or hints.
<user id="impatient">Skims, clicks the first button that looks like progress, gives each screen 10 seconds and quits at the first error, endless spinner or confusing field.</user>
<user id="skeptic">Reads pricing, terms and privacy first. Is the full price clear after the trial? Why is each signup field needed? Can I cancel or delete my account (find it, don't use it)? Would I trust this with my card?</user>
<user id="mobile">375px touch screen, Slow 3G, CPU slowed 4x. Flags blank loads, layout jumps, sideways scroll, tap targets under 44px, sticky bars over the main button and modals that won't close.</user>
<user id="non-native">English is their second language. Follows only what the UI literally says. Flags idioms, jargon, unlabeled icons, placeholder-only labels and errors that don't say how to fix them.</user>
<user id="breaker">Pastes junk into every field (empty, 5,000 characters, emoji, Arabic, O'Brien, a script tag, a SQL injection string), hits back and refresh mid-submit, double-clicks everything, uses two tabs. Flags crashes, duplicates, lost input and unescaped output.</user>
</users>

<walkthrough>
- Landing page to first success, alone, thinking aloud: what you expect before each action, what happened after.
- Screenshot every screen as NN-slug.png. At each friction point, log a one-line quote, the URL, console errors, failed requests and a severity: 4 blocker (can't finish), 3 major, 2 minor, 1 cosmetic.
- Stuck: try twice like a real person, then give up and record where.
- Never delete, invite, message anyone or pay for real. Stop at first success or 60 actions.
- Write only in your folder. Don't read code or other qa/ files.
- End with: reached first success (yes/no), actions taken.
</walkthrough>

<fix>
Merge the reports into one list, one item per root cause: blockers first, then by how many users hit it, ties by severity. Add each item's likely cause (file:line).
On branch qa/first-users-fixes, fix it all in one pass. Fix causes, not symptoms, and change nothing unlisted. Pricing, terms and privacy wording go on a "needs a human" list with a suggested rewrite. Run the existing tests.
</fix>

<verify>
Test the fixed build: run the branch locally, or ask me to deploy it to staging. Rerun all 5 as fresh subagents into run-2/. Then a judge subagent that did no fixing checks the run-1 list against both runs' screenshots and marks each item fixed, not fixed, not reached or new. Fixed means a run-2 screenshot shows the user getting past it. Screenshots beat your notes.
</verify>

<stop>
Anything still open: one more fix pass, run-3 with all 5 users and a fresh judge. Stop after run 3 and list what's left for a human.
</stop>

<output>
qa/first-users/report.md: what you couldn't test, a run-1 vs final scoreboard per user, and the ranked list with status, screenshots and files changed. If the project uses Playwright Test, save each user's final path to tests/first-users/.
</output>
```

Source: [@LimestoneHQ](https://x.com/LimestoneHQ/status/2113961716686127275) (verified)

<a id="component-state-stress-test"></a>

### Stress-test a UI component in every state it will meet

A key component only ever saw sample data and you want it checked against empty, long, failing and narrow-screen cases.

```text
/goal Check [COMPONENT NAME OR PATH] and make sure it survives the content and states it will encounter in real use.

INSPECT ONLY THIS COMPONENT.

Do not modify it yet. Read its actual props, slots, states, data sources, and where it is used. Based on what it really accepts, select the stress cases that apply.

TEST THESE WHEN RELEVANT:

→ No data, one item, and many items
→ Loading, error, disabled, and permission-denied states
→ Normal text, very long text, and an unbreakable string
→ Missing images, very large numbers, and incomplete data
→ A 320px viewport and any other widths the component supports
→ Dark mode; skip it if the project does not support it

Do not add irrelevant cases just to make the list longer.

BUILD THE TEST PAGE:

Create a temporary page inside the app. Import the real component and use the project’s existing fonts, styles, tokens, and layout context. Render every scenario side by side in one pass.

Do not rebuild a lookalike component or connect to production data.

Open the page and record only problems you can actually reproduce. Do not predict failures from the code or report personal taste as a bug.

FIX ONLY CONFIRMED PROBLEMS:

Fix them one at a time. After each change, rerender the original failing state and verify:

→ Content no longer overflows or disappears
→ Primary actions still work
→ Keyboard and focus behavior did not regress
→ States that already passed were not broken

Do not use this as an excuse to redesign the component, change its public API, or touch functionality outside the test page.

RETURN:

→ Every state you tested
→ Before-and-after screenshots
→ What you fixed
→ Anything still unresolved
→ Relevant test and build results

DONE WHEN:

Every applicable state has been rendered, every confirmed problem has been fixed and retested, the existing tests pass, and the build succeeds.
```

Source: [@Voxyz_ai](https://x.com/Voxyz_ai/status/2092688531705729210) (verified)

## Codebase audits and simplification

<a id="single-source-of-truth"></a>

### Single source of truth audit

The same fact or configuration may be maintained in multiple places.

```text
single source of truth audit
```

Source: [@kitlangton](https://x.com/kitlangton/status/2120341112959455559) (verified)

<a id="full-project-audit"></a>

### Full project audit

A project needs a broad review of correctness, consistency, and unnecessary work.

```text
Read this entire project and find everything that's broken, inconsistent, inefficient, or no longer needed. Fix what you're sure about and list the rest for me to review.
```

Source: [@chenchengpro](https://x.com/chenchengpro/status/2120040764243894547) (verified)

<a id="delete-and-simplify"></a>

### Delete, simplify, optimize, automate

Complexity or weak assumptions make a codebase harder to maintain.

```text
I want you to audit our codebase, is anything here unnecessary, overly complicated in our current setup, or based on weak assumptions? Challenge them.

- What can be deleted entirely?
- What can be simplified now that unnecessary pieces are gone?

Then make the changes. Prefer deleting over simplifying, simplifying over optimizing, and optimizing over automating.

This product is being used by thousands of customers, do not cut any corners.
```

Source: [@anthonyriera](https://x.com/anthonyriera/status/2119870644514893997) (verified)

<a id="read-only-codebase-simplification-audit"></a>

### Read-only codebase simplification audit (summary)

You want evidence-backed simplification recommendations before authorizing code changes.

```text
Review the repository without changing it. Map its subsystems and boundaries, then examine each for worthwhile improvements to data structures, state representation, algorithms, control flow, and ownership. Use bounded, independent reviews where available. Keep a shared coverage record, including explicit decisions that no change is warranted.

Limit each subsystem to two strong recommendations, supported by file references, proposed changes, scope, risks, validation needs, and confidence. Independently check findings, remove duplicates and weak abstractions, and review coverage before ranking recommendations by impact and dependencies. Do not implement changes or run tests during the audit.

This is an editorial summary. Read the linked gist for the complete workflow.
```

Editorial summary; follow the source link for the full prompt.

Source: [@aarondfrancis](https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47) (verified)

Related tweet: [https://x.com/aarondfrancis/status/2088285625946370352](https://x.com/aarondfrancis/status/2088285625946370352) (unverified)

<a id="map-codebase-architecture"></a>

### Map the codebase into ARCHITECTURE.md

A project has grown messy and you want a written map of its structure, data flow, and riskiest files.

```text
Map this codebase for me. Show the folder structure, what each main file does, how data flows from UI to database, and the 5 riskiest files to touch. Write it all to ARCHITECTURE.md.
```

Source: [@mdjunaidap](https://x.com/mdjunaidap/status/2119844974019973308) (verified)

<a id="fresh-eyes-domain-audit"></a>

### Fresh-eyes due-diligence audit of a live domain

The user wants an outside-in check of a live site or product, run from an empty folder with no repo access, to catch broken links, stale subdomains, and sloppy public pages.

```text
Visit [domain] like a strict enterprise buyer doing due diligence. Check DNS records, every footer/legal link, public JS bundles, and onboarding pages, and give me a checklist of anything broken or sloppy.
```

Source: [@illyism](https://x.com/illyism/status/2121301002490192378) (verified)

<a id="delete-dead-code-and-bloated-tests"></a>

### Find and remove obsolete legacy code and bloated tests

A repo has accumulated unused legacy code and low-value tests, and you want proof-backed removal.

```text
Run a deep test audit to find unused legacy code, using subagents where helpful.
Prove code and tests are obsolete before removing them; fix genuine bugs instead of hiding failures.
Preserve meaningful coverage, run relevant checks, and report changes and remaining blockers.
```

Source: [@emanueledpt](https://x.com/emanueledpt/status/2111457244311347691) (verified)

## State machines and semantics

<a id="find-state-machines"></a>

### Find implicit state machines

An app has behavior that depends on changing state and events.

```text
find all of the implicit state machines in my app
```

Source: [@steveruizok](https://x.com/steveruizok/status/2116552016218710389) (verified)

<a id="make-state-machines-explicit"></a>

### Make useful state machines explicit

Implicit state transitions may benefit from explicit modeling; the prompt references lavish-axi.

```text
audit and find implicit state machines in this <codebase/directory/module> that would drive concrete improvements if made explicit. explain before/after of each one and discuss with me in lavish-axi. fewer words, big visuals
```

Source: [@kunchenguid](https://x.com/kunchenguid/status/2119924895060795492) (verified)

<a id="minimal-semantic-model"></a>

### Recover the minimal semantic model

Async behavior, duplicated state, or refactors need semantic analysis.

```text
Recover my program's minimal semantic model.

1. State: every value that changes what the user sees
2. Transitions: what commutes, what's idempotent, what's order-dependent
3. Dependencies: what must be true before each effect fires

Then find:
→ nondeterminism in awaits, retries and event order
→ invariants enforced by hope
→ one fact stored in two places, drifting
→ work that never reaches the screen

Last, split my refactors into "provably equivalent" and "trust me". For each "trust me", give the smallest input that breaks it.
```

Source: [@infinterenders](https://x.com/infinterenders/status/2119676620680339490) (verified)

<a id="document-state-machines"></a>

### Document state machines and fix reachable bugs

Reachable invalid states need evidence, documentation, and regression-tested fixes.

```text
Find the app’s explicit and implicit state machines and document their states, invariants, and transition tables in one file. Identify invalid states or transitions the code can actually reach, with evidence, including through retries and concurrency. Prioritize confirmed bugs by impact, group related fixes into issues, then fix them with regression tests and keep the document updated.
```

Source: [@trevin](https://x.com/trevin/status/2118690987153186845) (verified)

## Design and experience

<a id="simple-ux-dx-ax"></a>

### Simplicity across UX, DX, and AX

An interface or implementation feels cluttered or unnecessarily complex.

```text
I want this to be as perfect as Linear's website or Apple Notes: simple purpose, simple architecture, simple design, simple implementation. Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout. Every decision should elevate the user experience (UX), developer experience (DX) and agent experience (AX) at once, without breaking anything.
```

Source: [@Voxyz_ai](https://x.com/Voxyz_ai/status/2117281830449942825) (verified)

<a id="product-experience-coverage-audit"></a>

### Product experience coverage audit (summary)

You need a product-wide UX review with an actionable handoff for product, design, and engineering.

```text
Assess the current product without modifying its repository. Establish its users, goals, and constraints from workspace evidence. Track coverage of screens, states, and complete journeys, combining code inspection with safe runtime observation. Focus on desktop and tablet, including keyboard, touch, accessibility, and recovery behavior; phone optimization is generally excluded.

Coordinate bounded reviews, keeping shared browser sessions serialized. Support recommendations with concrete user consequences, screenshots where useful, implementation references, acceptance criteria, and validation needs. Check design-system ownership and only use competitor examples for demonstrated, contained gaps. Independently verify findings, record inaccessible or unverified areas, and prioritize small implementation slices with cross-functional handoffs.

This is an editorial summary. Read the linked gist for the complete workflow.
```

Editorial summary; follow the source link for the full prompt.

Source: [@tommymarshall](https://gist.github.com/tommymarshall/c8e25407aecd111573766c9f1456a412) (verified)

Related tweet: [https://x.com/tommyjmarshall/status/2091681150552989700](https://x.com/tommyjmarshall/status/2091681150552989700) (unverified)

<a id="fix-happy-path-debt"></a>

### Find and fix happy-path debt in your app

An app works in the demo but breaks on slow loads, failures, empty lists, long text, or narrow screens.

```text
Find all the happy-path debt in my app: every screen that only works when data loads fast, nothing fails, lists aren't empty, text is short, and the screen is wide. Fix missing states and layout breaks, one component at a time, without changing my design and without breaking anything. Summarize by file: what happened before vs. how it works now.
```

Source: [@Voxyz_ai](https://x.com/Voxyz_ai/status/2120864199324889469) (verified)

<a id="origin-aware-animations"></a>

### Make popovers and menus animate from their trigger

Dropdowns, popovers or menus in your app scale from their center instead of from the element that opened them.

```text
Make all trigger-based UI elements in this app animate from their trigger, not their center.
```

Source: [@emilkowalski](https://x.com/emilkowalski/status/2123029498694410401) (verified)

## Performance

<a id="select-database-fields"></a>

### Select only the database fields you need

Database queries fetch whole rows while using only a few fields.

```text
find every place we load a whole row from the database just to read a couple of fields. instead, select only what we need
```

Source: [@_dylanga](https://x.com/_dylanga/status/2117400205314421058) (verified)

<a id="unnecessary-url-parsing"></a>

### Remove unnecessary URL parsing

Repeated or redundant URL parsing may add unnecessary work.

```text
remove all unnecessary `new URL()` parsing
```

Source: [@_dylanga](https://x.com/_dylanga/status/2117400205314421058) (verified)

<a id="module-level-regexes"></a>

### Compute regexes at module level

Regexes are repeatedly constructed in functions or loops.

```text
compute all regexes at the module level instead of inside functions and loops
```

Source: [@_dylanga](https://x.com/_dylanga/status/2117400205314421058) (unverified)

<a id="jsonb-key-to-column"></a>

### Promote hot JSONB keys to columns

A hot path repeatedly reads a single key from a large JSONB value.

```text
find hot-path reads of a single key from a large jsonb column and promote that key to a real column
```

Source: [@_dylanga](https://x.com/_dylanga/status/2117400205314421058) (unverified)

<a id="parallel-async-calls"></a>

### Remove unnecessary sequential async calls

Independent async operations appear to run sequentially on hot paths.

```text
do a deep scan of all hot paths and fix any unnecessary sequential async function calls
```

Source: [@_dylanga](https://x.com/_dylanga/status/2117099613022732412) (verified)

<a id="make-app-measurably-faster"></a>

### Measure, then make the app measurably faster

You want performance work driven by before/after measurements of one core flow, not guesses.

```text
/goal Make this app measurably faster.

Launch the real app and run through [CORE FLOW]. Record the current load time, interaction responsiveness, CPU usage, memory usage, and any visible stutters.

Use those measurements to find the worst bottlenecks. Don’t guess.

Change one thing at a time. After every change, rerun the exact same flow. Keep the change if the app gets faster. Revert it if nothing improves.

Continue until the core flow no longer has any obvious bottlenecks.

Finish with a simple before/after report:

→ The original measurements
→ What you changed
→ The new measurements
→ Any bottlenecks you didn’t address
```

Source: [@Voxyz_ai](https://x.com/Voxyz_ai/status/2091603024817062192) (verified)

<a id="ci-under-two-minutes"></a>

### Get CI under 2 minutes without hiding failures

Your PR checks take too long and you want an agent to audit and cut CI time with measured, reversible changes.

```text
Make this repo's CI as fast as possible without letting it lie. Target: a PR gets its result in under 2 minutes at the median and under 3 at p95.

Two rules outrank speed:
- The full suite runs before anything reaches main, in a merge queue. Selection only narrows PR feedback.
- Never get faster by hiding failures. No retries, wider timeouts or skipped tests. A check that needs a retry has a bug; find it.

First, audit. Pull the last 150 runs and split every job into waiting, setup and running, at p50 and p95. Fix the biggest bucket first. It is rarely the tests, so don't spend time deleting them.

Then hit these budgets:
- Waiting, under 10 seconds: move every job off GitHub's hosted runners to Blacksmith, even the 5-second ones. A 5-second job that queues 10 minutes is a 10-minute job. Cancel a branch's in-progress run when a new commit lands.
- Setup, under 30 seconds: get PR cache hits above 95% by seeding caches from main. Cache node_modules itself, not just the package cache. Use a blobless clone ('filter: blob:none'), not a shallow one.
- Lint, under 5 seconds: oxlint. Delete ESLint, and turn on every rule you can.
- Typecheck, under 5 seconds: `bun check`. Fall back to TypeScript 7 if it can't check this repo. Use tsrs locally.
- Format: oxfmt. Delete Prettier.
- Install and scripts: bun. Delete npm, yarn or pnpm.
- Tests, under 60 seconds per shard: stop reloading the app per test file (Vitest `isolate: false`), reset state after every file, and write the cleanup rules into AGENTS.md. Run in random order to flush out leaks. Shard by measured duration onto 8-core machines, each with its own database. Buy cores before shards, and match concurrency to cores.
- Shape: run lint, typecheck, build and tests in parallel. Then move migration checks and other apps' tests out of the slowest job into their own.
- Selection: on PRs, run only what the diff can reach (`nx affected` or `turbo --affected`). Then hide a real change from it on purpose and confirm CI goes red, not green.
- Local, under 9 seconds: a pre-push hook that runs format, lint and typecheck on changed files. A hook, not a line in AGENTS.md, because agents skip steps.
- Keep it fast: fail any job that exceeds its budget.

The tools above are defaults; you need a measured reason to keep an old one. Take anything newer that is faster on this repo. Before each switch, run old and new side by side and list anything the new one misses.

One small PR per change, with before and after numbers from real runs. Do everything you can without me first; bring anything that needs an account, a secret or a bigger bill as one list with expected monthly cost. End with total CI time and cost, before and after.
```

Source: [@pontusab](https://x.com/pontusab/status/2121990184816484483) (verified)

## Security and system cleanup

<a id="security-audit-dashboard"></a>

### Security audit, remediation, and dashboard

A project needs a security audit and evidence of remediation; the prompt references an external Cloudflare skill.

```text
Install Cloudflare’s security-audit skill globally and invoke its full audit workflow on this project.

github.com/cloudflare/sec — https://t.co/PoZZnDNiPy

Please implement this skill for my project repos or globally in my projects.

Independently verify findings, implement targeted fixes for confirmed vulnerabilities, and run relevant tests. Preserve unrelated changes.

Build an interactive security dashboard covering frontend, APIs, authentication, databases, infrastructure and dependencies. Show:
- Findings by severity and affected stack layer.
- Open, fixed and verified remediation status.
- Security posture before and after fixes.
- Source evidence, code changes and test results.
- Audit coverage, unverified areas and remaining priorities.

Base posture assessments on evidence and clearly label coverage gaps.
```

Source: [@thejoegardiner](https://x.com/thejoegardiner/status/2118119394517950725) (verified)

<a id="macos-cleanup"></a>

### Remove unused macOS software and permissions

The user explicitly wants to review and remove unused macOS software and permissions.

```text
remove all the apps, tcc/permission grants, login items, daemons, kexts, browser exts, homebrew packages, etc., that I don't need and use.
```

Source: [@sqs](https://x.com/sqs/status/2120113139996086409) (verified)

<a id="prune-old-agent-transcripts"></a>

### Audit and prune old AI agent transcripts on macOS

The user wants to review and remove old coding-agent transcripts, session logs, and leftover editor folders on a Mac.

```text
Audit my Mac for AI agent transcripts (Claude, Codex, Cursor, Grok), SQLite session logs, and leftover editor dotfolders older than 30 days. Show me the sizes first, delete everything >30 days old, and add a daily 30-day auto-prune check.
```

Source: [@illyism](https://x.com/illyism/status/2117103631564689691) (verified)

<a id="third-party-js-supply-chain-check"></a>

### Check whether you load third-party JS that could be compromised

A third-party script provider has been compromised and you want to know if your site is exposed to a similar attack.

```text
Read this incident: https://x.com/Scott_Helme/status/2122422157959471456

Help me understand what the root cause of this issue is.
Do we load any third-party JS that would be susceptible to a similar attack (if that third-party JS provider were compromised)?
```

Source: [@beyang](https://x.com/beyang/status/2122480180128350443) (verified)

<a id="find-storage-hogs"></a>

### Find what is eating your disk space (list first, delete nothing)

Your disk is full and you do not know why.

```text
scan my system to find what's eating up storage. look for large files, old installers, unused apps, cache folders, stale project folders, and anything else safe to clean up. list everything by category with size, and flag what's safe to auto delete vs what needs my review before deleting. don't delete anything yet, just give me the list first.
```

Source: [@Ananth7e](https://x.com/Ananth7e/status/2084333430280786115) (verified)

<a id="audit-accounts-and-installed-software"></a>

### Audit your accounts and installed software after security news

There has been security news and you want an agent with computer use to check your accounts and installed software and list the actions to take.

```text
Given recent IT security news, can you please audit my various accounts and what I've got installed on the computer and let me know the actions I need to take?
```

Source: [@emollick](https://x.com/emollick/status/2113361252173091114) (verified)

<a id="review-google-linked-apps"></a>

### Review the apps linked to your Google account and suggest which to remove

You have connected many apps to your Google account over the years and want an agent to suggest which to remove. Open the linked apps page in Chrome first and tell the agent the tab is open.

```text
I have a lot of linked apps and tbh i think a huge amount of them should not be linked. please review the list and suggest apps to remove in a numbered list

https://myaccount.google.com/linkedapps?continue=https%3A%2F%2Fmyaccount.google.com%2Fsecurity
```

Source: [@petergyang](https://x.com/petergyang/status/2091331251211059468) (verified)

## Agent workflows and retrospectives

<a id="weekly-session-review"></a>

### Review last week's sessions and suggest improvements

Recent coding sessions are available and the user wants to identify ways to improve their workflow.

```text
look at last weeks sessions and suggest improvements
```

Source: [@nateberkopec](https://x.com/nateberkopec/status/2114842635743674790) (verified)

<a id="plan-replayable-logging"></a>

### Plan logging that can replay what the user experienced

You want a program to produce logs good enough to later analyze for broken behavior and user friction.

```text
help me plan comprehensive logging such that we can replay what the user experienced, meaningful internal operations, and visible outcomes
```

Source: [@kunchenguid](https://x.com/kunchenguid/status/2114772499686998221) (verified)

<a id="review-agent-setup"></a>

### Review your agent setup for guardrail gaps

You want a one-off review of your AGENTS.md, skills, hooks, permissions and MCP setup.

```text
Review my entire agent setup: AGENTS.md, CLAUDE.md, skills, commands, subagents, hooks, settings/permissions, and MCP servers. Check for gaps in guardrails and whether it follows current best practices for Fable 5.2.
```

Source: [@chenchengpro](https://x.com/chenchengpro/status/2120040764243894547) (verified)

<a id="claude-code-api-cost-estimate"></a>

### Estimate what your Claude Code usage would cost on the API

The user wants a local, offline-safe report of what their Claude Code sessions over a time frame would have cost at Anthropic's API list prices, with an HTML summary card.

```text
Time frame: 30d

Work out what my Claude Code sessions in this time frame would cost if I had paid for
them on the Claude API at Anthropic's list prices. Use only Python's standard library
and do it in one script you write to a temporary folder. Do not send my logs or any
results anywhere.

1. **Prices.** Fetch `https://platform.claude.com/docs/en/about-claude/pricing.md`
   (the public pricing page, as Markdown). From the "Model pricing" table take, per
   model, the USD per million tokens for: base input, 5-minute cache write, 1-hour
   cache write, cache read and output. From the "Fast mode pricing" section take the
   fast-mode input and output price per model; fast-mode cache prices are the base
   cache prices scaled by fast input divided by base input. Take the web search price
   per 1,000 searches. Never guess or hard-code a rate. If the page cannot be fetched,
   stop and tell me.

2. **Usage.** Read every `*.jsonl` file under `~/.claude/projects/`, recursively, so
   subagent logs under `<project>/<session>/subagents/` count too and belong to their
   parent project. Each line is JSON. Keep lines whose `message.usage` and
   `message.model` are set, skipping the model `<synthetic>`. A reply is written as
   several lines that stream, so its usage is only final on the last one: treat each
   `(message.id, requestId)` pair as one reply and keep each usage field's largest
   value across its lines, not the first line's. Use the first line's `timestamp`
   (ISO, UTC) and keep only replies inside the time frame, counted back from now
   (`all` means everything; a month is 30.44 days).

   Claude Code deletes logs after its cleanup period (30 days by default). If the
   time frame starts before the oldest log, estimate the missing days from
   `~/.claude/stats-cache.json` (what /stats shows): `dailyModelTokens` has tokens
   per day per model, `modelUsage` has each model's split by token type (use it to
   split a day's tokens), `dailyActivity` has sessions per day. /stats adds up every
   log line, so it counts each reply several times. Measure that overcount on the
   full days that have both logs and cache (cache tokens divided by log tokens, all
   types summed) and divide the missing days by it. Never hard-code the ratio. Price
   the estimate's cache writes at the 5-minute rate, so it is a lower bound. If the
   file is missing or no day has both, skip the estimate and say why.

3. **Price each reply** at the rate of the model that wrote it. Map the model id to
   the pricing table by dropping a trailing `[...]`, a leading `claude-`, any
   `anthropic.`/`us.anthropic.` prefix and a date suffix (`claude-haiku-4-5-20251001`
   is Haiku 4.5; old ids like `claude-3-5-haiku` are Haiku 3.5). From `usage`:
   - `input_tokens` at the input rate, `output_tokens` at the output rate,
     `cache_read_input_tokens` at the cache read rate;
   - `cache_creation.ephemeral_5m_input_tokens` and `ephemeral_1h_input_tokens` at the
     5-minute and 1-hour write rates; if both are missing, put all of
     `cache_creation_input_tokens` at the 5-minute rate;
   - `speed == "fast"` means fast-mode rates;
   - `server_tool_use.web_search_requests` at the web search price.
   A model with no list price is left out of the total and listed as unpriced.

4. **Tell me:** the total API cost for the time frame, the number of sessions
   (distinct `sessionId`) and replies, the split by cache reads, cache writes, output,
   fresh input and web searches (tokens and dollars each), cost by model, the top six
   projects (the project is the log's folder name under `~/.claude/projects/`), any
   unpriced models, and the date the prices were fetched. If part of it is the
   estimate, say how much, for which dates, and the overcount you divided by;
   projects and per-day cover the logged days only.

5. **Card.** Write the same figures as one self-contained HTML page to
   `~/api-bill/api-bill-<timeframe>-<date>.html` and give me the path: the total in
   large type, the itemised split as a receipt, bars for cost by model and by
   project, a bar chart of cost per day, and a table of the prices used, and the
   estimate (if any) marked as one. Start the page with `<!doctype html>`,
   `<meta charset="utf-8">` and a viewport meta tag, so symbols such as "·" and "×"
   show correctly when opened locally. Make it readable on a phone and in dark mode. If you can publish Artifacts in this
   session, offer to publish the card as a private page. It shows my project names,
   so never make it public.

Do not compare with my subscription price. This is what the same work would cost on
the API, nothing more.
```

Source: [@ZazaGDev](https://x.com/ZazaGDev/status/2121268144471695462) (verified)

Full prompt (linked from the author's reply): [https://github.com/ZazaGdev/AI-fun/blob/main/api-bill/prompt.md](https://github.com/ZazaGdev/AI-fun/blob/main/api-bill/prompt.md) (verified)

<a id="list-verified-vs-guessed-assumptions"></a>

### List every assumption as verified or guessed before fixing

An agent is about to change code in a codebase it may not fully understand, and you want its guesses surfaced first.

```text
List every assumption you're making about this codebase. Mark each one verified (you read the actual code) or guessed (you inferred it, and say why). Propose your highest confidence surgical fix for each, but don't apply it yet. Stop and wait for my manual review.
```

Source: [@kloss_xyz](https://x.com/kloss_xyz/status/2104088147739242660) (verified)

<a id="audit-wasted-tool-calls"></a>

### Audit your agent history for wasted tool calls and tokens

You want to see which paths in a repo cost your agents the most searching and backtracking.

```text
Look through my Claude Code chat history for this repo in ~/.claude/projects/.

1. Find the files and folders agents visit most often.
2. For each one, count how many tool calls it usually took to get there, and roughly how many tokens that used.
3. Flag the paths where the agent searched, opened the wrong files, or backtracked before finding the right spot.
4. Rank the 5 most wasteful paths by total tokens burned.
5. Suggest the smallest CLAUDE.md edits that would send an agent straight there. Pointers, not paragraphs.

Don't change any files yet. Show me the report first.
```

Source: [@JJEnglert](https://x.com/JJEnglert/status/2102851496626757730) (verified)

<a id="claude-code-token-waste-audit"></a>

### Audit what wastes tokens in your Claude Code setup

Your Claude Code setup burns tokens every turn and you want a measured, approve-first cleanup plan.

```text
## Opus 5.5 token audit

Opus 5.5 is already priced low per token. Find what in this Claude Code setup still wastes tokens on every turn. Goal: the lowest cost per finished task. It must stay as thorough as it is now and keep taking on big tasks. Smaller requests don't count as a win if the task then takes more turns.

### 1. Measure first, change nothing

List everything that loads when a session starts:

- Every CLAUDE.md that loads (global, project, nested) and the files it imports
- Skill listings: every name and description the model sees
- MCP servers: which are connected, and which tools load upfront
- Hooks or scripts that inject text into the conversation
- Settings: model, modelSettings, CLAUDE_CODE_EFFORT_LEVEL, CLAUDE_CODE_SUBAGENT_MODEL

If I paste `/context` or `/usage` output, use those numbers. Otherwise ask once, then count lines and bytes yourself. Read each file in full. Repeated, conflicting and outdated rules are easy to miss in a summary.

### 2. Check the Opus 5.5 settings

**Effort**: report the level Opus 5.5 actually runs at and where it comes from. It starts at medium, and a top-level effortLevel in ~/.claude/settings.json doesn't count for it.
**Checks**: list the test, build and typecheck commands this repo already has. A test run costs one turn. Higher effort adds thinking to every turn.
**Subagents**: for each one, model, effort, and whether it writes code or only reads. With no model line it follows CLAUDE_CODE_SUBAGENT_MODEL, or the main model if that's unset.
**Output**: an output token costs 100x a cache read, and thinking counts as output. Flag rules that make it write more than the task needs.

### 3. Label every instruction line

**Keep**: what it can't work out from the repo, like how this project ships and how I like to work, plus fixes for mistakes it has made in this project.
**Move**: playbooks for one workflow into a skill, so they load only when used.
**Cut**: what it already does by default, and rules that contradict each other.

Keep each CLAUDE.md under ~200 lines.

### 4. Protect the cache

These make the next request re-read the whole session uncached: switching `/model`, turning on fast mode, connecting an MCP server whose tools load upfront, and a skill that pins another model.

- If you need another model's opinion, hand that task to a subagent so the main session keeps its cache.
- Compact between tasks. Start unrelated work with `/clear`.

### 5. Keep long output out of the conversation

- Test runs, builds, logs: return the failures plus the last few lines, and write the full log to a file it can grep. Cutting output at a fixed length can drop the error line it needed.
- Progress notes: keep one short file and overwrite it. If it keeps growing, every later read costs more.

### 6. Off-limits

- Adding "be concise" or "save tokens" to any prompt. An agent told to save tokens can start shying away from big tasks.
- Dropping effort on hard tasks, or changing models halfway through a task, to cut the bill.
- Judging by tokens per request. Measure cost per finished task.

### 7. Report, then wait

1. Baseline: each source, its size, when it loads
2. Changes, biggest saving first: what it saves and how you worked that out, what could get worse, how to reverse it
3. The exact edits to each instruction file, each one tagged Keep, Move or Cut

Back up every file before touching it. Apply nothing until I approve.
```

Source: [@Voxyz_ai](https://x.com/Voxyz_ai/status/2103469567964254587) (verified)

## Product

<a id="customer-feedback-what-to-fix-next"></a>

### What have customers told me? What should I fix next?

You have customer feedback in connected tools (support, email, chat, CRM) and want the agent to surface what to fix next.

```text
what have customers told me? what should I be fixing next?
```

Source: [@bentlegen](https://x.com/bentlegen/status/2124330026023743617) (verified)
