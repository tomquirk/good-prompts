import type { Prompt } from "@/lib/prompts";

export const SITE_NAME = "prompt-collectooor";

export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const SITE_DESCRIPTION =
  "Copy-paste prompts for Claude Code, Codex and other coding agents, collected from developers' posts on X.com and shown next to the original post.";

/** Feed links, repeated wherever a page sets its own `alternates`. */
export const FEED_TYPES = {
  "application/rss+xml": "/feed.xml",
  "application/feed+json": "/feed.json",
};

export const promptPath = (id: string) => `/prompts/${id}`;
export const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** "@handle" -> profile URL on X, when the author is an X handle. */
export function authorUrl(author: string | null): string | null {
  return author?.startsWith("@") ? `https://x.com/${author.slice(1)}` : null;
}

export function scopeLabel(p: Pick<Prompt, "scope">) {
  return p.scope === "machine" ? "runs on your machine" : "runs in a repo";
}

/** "2026-11-12" -> "12 November 2026", fixed to UTC so builds are stable. */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Latest `added_on` across the collection. */
export function lastUpdated(prompts: Pick<Prompt, "added_on">[]) {
  return prompts.reduce((max, p) => (p.added_on > max ? p.added_on : max), "");
}
