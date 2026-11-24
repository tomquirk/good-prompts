import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

export type Source = {
  url: string | null;
  author: string | null;
  status: "unverified" | "verified" | "missing";
  related_urls?: { url: string; label: string; status: string }[];
};

export type Prompt = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  use_when: string;
  scope: "project" | "machine";
  added_on: string;
  prompt: string;
  text_kind?: "collected" | "summary";
  source: Source;
};

// The repo-root prompts.json is the single source of truth; read at build time.
const PROMPTS_PATH = join(process.cwd(), "..", "prompts.json");

const HTTPS = /^https:\/\/[^\s/]+\//u;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const HANDLE = /^@\w{1,15}$/u;

/**
 * Vercel builds main without running CI, so the site refuses anything that
 * would turn into an unsafe link or path, even if it slipped past review.
 */
function check(p: Prompt) {
  const urls = [p.source.url, ...(p.source.related_urls ?? []).map((r) => r.url)];
  if (!ID.test(p.id)) {
    throw new Error(`Unsafe prompt id: ${p.id}`);
  }
  for (const u of urls) {
    if (u !== null && !HTTPS.test(u)) {
      throw new Error(`Non-HTTPS source URL in ${p.id}`);
    }
  }
  if (p.source.author?.startsWith("@") && !HANDLE.test(p.source.author)) {
    throw new Error(`Bad X handle in ${p.id}`);
  }
  return p;
}

/** Prompts newest-first, each with `n`: its 1-based position in prompts.json. */
export function getPrompts(): (Prompt & { n: number })[] {
  const data = JSON.parse(readFileSync(PROMPTS_PATH, "utf8")) as {
    prompts: Prompt[];
  };
  return data.prompts
    .map(check)
    .map((p, i) => ({ ...p, n: i + 1 }))
    .sort((a, b) => b.added_on.localeCompare(a.added_on) || a.n - b.n);
}

const TWEET_URL = /^https:\/\/(?:x|twitter)\.com\/[^/]+\/status\/(?<id>\d+)/u;

export function tweetId(url: string | null): string | null {
  const { id } = url?.match(TWEET_URL)?.groups ?? {};
  return id ?? null;
}

export const REPO_URL = "https://github.com/tomquirk/good-prompts";
// The daily-prompt skill's listing on skills.sh, Vercel's agent skills directory.
export const SKILLS_SH_URL = "https://skills.sh/tomquirk/good-prompts/daily-prompt";
// Opens prompts.json in GitHub's web editor, which forks and starts a PR.
export const EDIT_URL = `${REPO_URL}/edit/main/prompts.json`;

export function getPrompt(id: string) {
  return getPrompts().find((p) => p.id === id);
}
