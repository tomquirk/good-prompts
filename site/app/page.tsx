import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { EyeIcon, HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import { AgentDemo } from "@/components/agent-demo";
import { AgentIcon, AgentLogos } from "@/components/agent-logos";
import { CopyButton } from "@/components/copy-button";
import { Mascot } from "@/components/mascot";
import { MascotArt } from "@/components/mascot-art";
import { PromptCard } from "@/components/prompt-card";
import { PromptList } from "@/components/prompt-list";
import { SetupCta } from "@/components/setup-cta";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TweetMarquee } from "@/components/tweet-marquee";
import { getMetrics } from "@/lib/metrics";
import { EDIT_URL, getPrompt, getPrompts } from "@/lib/prompts";
import {
  absolute,
  FEED_TYPES,
  formatDate,
  lastUpdated,
  promptPath,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: FEED_TYPES },
};

// Repo-root setup-prompt.md: paste into any agent to get a prompt a day.
const SETUP_PROMPT = readFileSync(join(process.cwd(), "..", "setup-prompt.md"), "utf8").trim();
// The bare install command, lifted from the setup prompt so the two never drift.
const { command: INSTALL } = SETUP_PROMPT.match(/`(?<command>npx skills add [^`]+)`/u)?.groups ?? {};
const SKILL_URL = "https://github.com/tomquirk/prompt-collectooor/blob/main/skills/daily-prompt/SKILL.md";

const link = "transition-colors hover:text-foreground";
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default async function Home() {
  const prompts = getPrompts();
  const metrics = await Promise.all(prompts.map((p) => getMetrics(p.source)));
  // The demo always shows the best-known prompt in the collection.
  const pick = getPrompt("find-state-machines") ?? prompts[0];
  if (!pick) {
    throw new Error("prompts.json has no prompts");
  }
  const demo = { title: pick.title, prompt: pick.prompt, author: pick.source.author, href: promptPath(pick.id) };
  // Reach of the source posts, each post counted once even if it holds several prompts.
  const reach = new Map<string, { likes: number; views: number }>();
  prompts.forEach((p, i) => {
    if (p.source.url && metrics[i]) {
      reach.set(p.source.url, { likes: metrics[i]?.likes ?? 0, views: metrics[i]?.views ?? 0 });
    }
  });
  const totalLikes = [...reach.values()].reduce((n, r) => n + r.likes, 0);
  const totalViews = [...reach.values()].reduce((n, r) => n + r.views, 0);
  const authorCount = new Set(prompts.map((p) => p.source.author).filter(Boolean)).size;

  const updated = lastUpdated(prompts);
  const categories = [...new Set(prompts.map((p) => p.category))];

  const faq: [string, string][] = [
    [
      `What is ${SITE_NAME}?`,
      `${SITE_NAME} is a collection of ${prompts.length} prompts that developers have posted on X.com for coding agents such as Claude Code and Codex. Each prompt is shown next to the post it came from, credited to its author, and tagged with when to use it.`,
    ],
    [
      "How do I use one of these prompts?",
      "Copy the prompt and paste it into Claude Code, Codex or another coding agent. Prompts marked “runs in a repo” act on the project the agent is working in; prompts marked “runs on your machine” act on your computer more broadly, so read them before running.",
    ],
    [
      "What kinds of prompts are here?",
      `The prompts are grouped into ${categories.length} categories: ${categories.join(", ").toLowerCase()}. Most ask an agent to test, audit or simplify a codebase.`,
    ],
    [
      "Can my agent pick a prompt for me?",
      "Yes. Paste the setup prompt near the top of this page into Claude Code, Codex, Cursor or another agent. It installs the daily-prompt skill with npx skills, which picks one prompt that fits your project whenever you ask and checks with you before running it. The setup prompt also offers to put it on a schedule, for example every weekday morning.",
    ],
    [
      "Can a script or bot read the collection?",
      "Yes. The full list is at /prompts.json, with RSS at /feed.xml, a JSON Feed at /feed.json and a plain-text summary for language models at /llms.txt. New prompts are added by pull request to prompts.json on GitHub.",
    ],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absolute("/"),
        description: SITE_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "CollectionPage",
        url: absolute("/"),
        name: "Prompts for Claude Code and Codex, collected from X.com",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        dateModified: updated,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: prompts.length,
          itemListElement: prompts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: absolute(promptPath(p.id)),
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main>
        <section className="relative grid gap-12 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-12">
          <div className="dot-grid pointer-events-none absolute inset-0 -mx-4 sm:-mx-6" aria-hidden={true} />

          <div className="relative min-w-0">
            {/* Who does the collecting: Grok Bot finds the prompts and opens the PRs. */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="grid size-5 place-items-center rounded-full bg-foreground text-background">
                <AgentIcon icon="grok" className="size-3.5" />
              </span>
              powered by <span className="text-foreground">Grok Bot</span>
            </p>
            <h1 className="text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-5xl">
              Auto-collecting good dev prompts from X.com 🔥
            </h1>
            {/* The angle: every prompt comes from a post that already took off. */}
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span
                className="inline-flex items-center gap-1.5 text-foreground"
                title={`${totalLikes.toLocaleString("en")} likes`}
              >
                <HeartIcon strokeWidth={1.5} className="size-4 text-burn" aria-hidden={true} />
                <span className="tabular-nums">{compact.format(totalLikes)}</span>
                <span className="sr-only">likes</span>
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-foreground"
                title={`${totalViews.toLocaleString("en")} views`}
              >
                <EyeIcon strokeWidth={1.5} className="size-4 text-burn" aria-hidden={true} />
                <span className="tabular-nums">{compact.format(totalViews)}</span>
                <span className="sr-only">views</span>
              </span>
              <span>from viral X.com posts</span>
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              The best one-shot prompts from X.com that audit, de-slop and improve your codebase. Got tokens to burn?
              Let your agents rip.
            </p>

            <div className="mt-8">
              <SetupCta prompt={SETUP_PROMPT} count={prompts.length} />
            </div>
            {/* One quiet line; the setup prompt and the bare install command fold away. */}
            <details className="group mt-1 max-w-lg text-xs text-muted-foreground">
              <summary className="cursor-pointer list-none transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                free · open source · asks before running ·{" "}
                <span className="text-burn group-open:hidden">what&apos;s in it?</span>
              </summary>
              <pre className="mt-3 rounded-xl border bg-card px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-foreground">
                {SETUP_PROMPT}
              </pre>
              {INSTALL !== undefined && (
                <>
                  <p className="mt-4">
                    or just install the skill ·{" "}
                    <a className={link} href={SKILL_URL} target="_blank" rel="noreferrer">
                      read SKILL.md ↗
                    </a>
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border bg-card py-1.5 pr-2 pl-4">
                    <code className="min-w-0 flex-1 py-1 text-xs leading-relaxed text-foreground [overflow-wrap:anywhere]">
                      <span className="text-burn select-none">$ </span>
                      {INSTALL}
                    </code>
                    <CopyButton text={INSTALL} />
                  </div>
                </>
              )}
            </details>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs text-muted-foreground">works with</span>
              <AgentLogos iconsOnly={true} />
            </div>
          </div>

          {/* The mascot perches on the mock, speech bubble and all. */}
          {/* Padding is the mascot's height minus ~12px, so he rests on the card's top edge. */}
          <div className="relative min-w-0 pt-[5.6rem] sm:pt-[6.5rem]">
            <Mascot count={prompts.length} className="absolute top-0 right-8 z-10 w-24 sm:w-28" />
            <AgentDemo prompt={demo} />
          </div>
        </section>

        <section aria-labelledby="proof-heading" className="border-t py-10">
          <h2
            id="proof-heading"
            className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2 text-foreground">
              <span className="relative flex size-2" aria-hidden={true}>
                <span className="absolute inline-flex size-full rounded-full bg-burn opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-burn" />
              </span>
              New prompts every day
            </span>
            <span aria-hidden={true}>·</span>
            <span>from {authorCount} devs on X.com</span>
          </h2>
          <TweetMarquee prompts={prompts} />
        </section>

        <section id="prompts" aria-labelledby="prompts-heading" className="border-t pt-14 sm:pt-20">
          <h2
            id="prompts-heading"
            className="mb-10 text-center text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-5xl"
          >
            Browse all prompts
          </h2>
          <PromptList
            items={prompts.map((p, i) => ({
              id: p.id,
              category: p.category,
              likes: metrics[i]?.likes ?? -1,
              haystack: [p.title, p.prompt, p.use_when, p.category, p.source.author, ...p.tags].join(" ").toLowerCase(),
              node: <PromptCard prompt={p} metrics={metrics[i] ?? null} />,
            }))}
          />
        </section>

        <section
          aria-labelledby="cta-heading"
          className="flex flex-col items-center border-t py-16 text-center sm:py-24"
        >
          <MascotArt className="w-16" />
          <h2 id="cta-heading" className="mt-5 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
            Got tokens to burn?
          </h2>
          <p className="mt-3 max-w-md text-sm text-pretty text-muted-foreground">
            Paste the setup prompt into your agent once. Then ask for a prompt whenever you like, or have it suggest one
            every morning.
          </p>
          <div className="mt-7">
            <SetupCta prompt={SETUP_PROMPT} />
          </div>
        </section>

        <p className="flex flex-wrap gap-x-4 gap-y-1 border-t py-6 text-xs text-muted-foreground">
          <span className="text-foreground">for bots</span>
          <a className={link} href="/prompts.json">
            prompts.json
          </a>
          <a className={link} href="/feed.xml">
            rss
          </a>
          <a className={link} href="/feed.json">
            json feed
          </a>
          <a className={link} href="/llms.txt">
            llms.txt
          </a>
          <a className={link} href={EDIT_URL} target="_blank" rel="noreferrer">
            add a prompt ↗
          </a>
          <span>
            updated <time dateTime={updated}>{formatDate(updated)}</time>
          </span>
        </p>

        <section aria-labelledby="faq-heading" className="border-t py-10">
          <h2 id="faq-heading" className="text-sm font-medium">
            faq
          </h2>
          <div className="mt-3 divide-y text-sm">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-muted-foreground transition-colors hover:text-foreground group-open:text-foreground [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden={true} className="text-burn transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
