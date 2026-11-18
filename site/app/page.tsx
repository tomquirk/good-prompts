import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { Mascot } from "@/components/mascot";
import { PromptCard } from "@/components/prompt-card";
import { PromptList } from "@/components/prompt-list";
import { getMetrics } from "@/lib/metrics";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { EDIT_URL, getPrompts, REPO_URL } from "@/lib/prompts";
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

const RAW_JSON = `${REPO_URL.replace("github.com", "raw.githubusercontent.com")}/main/prompts.json`;
const CURL = `curl -s ${RAW_JSON} | jq -r '.prompts[] | "\\(.id): \\(.title)"'`;

// Repo-root setup-prompt.md: paste into any agent to get a prompt a day.
const SETUP_PROMPT = readFileSync(join(process.cwd(), "..", "setup-prompt.md"), "utf8").trim();

const link = "transition-colors hover:text-foreground";

export default async function Home() {
  const prompts = getPrompts();
  const metrics = await Promise.all(prompts.map((p) => getMetrics(p.source)));

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
      "Can I get a prompt suggested every day?",
      "Yes. Paste the setup prompt near the top of this page into Claude Code, Codex, Cursor or another agent. It installs the daily-prompt skill with npx skills and schedules it, and each morning it suggests one prompt that fits your project and asks whether to run it.",
    ],
    [
      "Can a script or bot read the collection?",
      `Yes. The full list is at /prompts.json, with RSS at /feed.xml, a JSON Feed at /feed.json and a plain-text summary for language models at /llms.txt. New prompts are added by pull request to prompts.json on GitHub.`,
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
        <section className="relative pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="dot-grid pointer-events-none absolute inset-0 -mx-4 sm:-mx-6" aria-hidden />
          <div className="relative">
            <Mascot
              count={prompts.length}
              className="mb-2 ml-auto w-28 lg:absolute lg:top-0 lg:right-10 lg:mb-0 lg:w-56"
            />
            <h1 className="max-w-3xl text-3xl lg:max-w-[calc(100%-18rem)] leading-[1.15] font-medium tracking-tight text-balance sm:text-5xl">
              One-shot prompts from X.com, for when you got tokens to burn 🔥
            </h1>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              {prompts.length} prompts for Claude Code, Codex &amp; co. Copy, paste, burn.
            </p>

            <div className="mt-10 max-w-3xl overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b py-1.5 pr-2 pl-4">
                <span className="text-xs text-muted-foreground">for your bots</span>
                <CopyButton text={CURL} />
              </div>
              <pre className="overflow-x-auto [scrollbar-width:none] px-4 py-3 text-[13px] text-foreground/90">
                <span className="text-burn select-none">$ </span>
                {CURL}
              </pre>
            </div>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <a className={link} href="/feed.xml">rss</a>
              <a className={link} href="/feed.json">json feed</a>
              <a className={link} href="/llms.txt">llms.txt</a>
              <a className={link} href={EDIT_URL} target="_blank" rel="noreferrer">
                add a prompt ↗
              </a>
              <span>
                updated <time dateTime={updated}>{formatDate(updated)}</time>
              </span>
            </p>

            <div className="mt-8 max-w-3xl overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b py-1.5 pr-2 pl-4">
                <span className="text-xs text-muted-foreground">
                  get one a day: paste this into your agent
                </span>
                <CopyButton text={SETUP_PROMPT} />
              </div>
              <pre className="whitespace-pre-wrap px-4 py-3 text-[13px] text-foreground/90">
                {SETUP_PROMPT}
              </pre>
            </div>
          </div>
        </section>

        <PromptList
          items={prompts.map((p, i) => ({
            id: p.id,
            category: p.category,
            likes: metrics[i]?.likes ?? -1,
            haystack: [p.title, p.prompt, p.use_when, p.category, p.source.author, ...p.tags]
              .join(" ")
              .toLowerCase(),
            node: <PromptCard prompt={p} metrics={metrics[i]} />,
          }))}
        />

        <section aria-labelledby="faq-heading" className="border-t py-10">
          <h2 id="faq-heading" className="text-sm font-medium">
            faq
          </h2>
          <div className="mt-3 divide-y text-sm">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-muted-foreground transition-colors hover:text-foreground group-open:text-foreground [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="text-burn transition-transform group-open:rotate-45">+</span>
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
