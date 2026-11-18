import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

/** Prompts newest-first, each with `n`: its 1-based position in prompts.json. */
export function getPrompts(): (Prompt & { n: number })[] {
  const data = JSON.parse(readFileSync(PROMPTS_PATH, "utf8")) as {
    prompts: Prompt[];
  };
  return data.prompts
    .map((p, i) => ({ ...p, n: i + 1 }))
    .sort((a, b) => b.added_on.localeCompare(a.added_on) || a.n - b.n);
}

export function tweetId(url: string | null): string | null {
  const m = url?.match(/^https:\/\/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/);
  return m ? m[1] : null;
}

export const REPO_URL = "https://github.com/tomquirk/prompt-collectooor";
// Opens prompts.json in GitHub's web editor, which forks and starts a PR.
export const EDIT_URL = `${REPO_URL}/edit/main/prompts.json`;

export function getPrompt(id: string) {
  return getPrompts().find((p) => p.id === id);
}
