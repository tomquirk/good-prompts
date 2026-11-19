import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { type Source, tweetId } from "@/lib/prompts";
import { fetchTweet } from "@/lib/tweets";

export type Metrics = {
  likes?: number;
  replies?: number;
  reposts?: number;
  quotes?: number;
  views?: number;
};

const KEYS = ["likes", "replies", "reposts", "quotes", "views"] as const;

// Repo-root metrics.json, written by grokbot from the X API. Keyed by tweet ID.
function readFile(): Record<string, Metrics> {
  try {
    const raw = JSON.parse(readFileSync(join(process.cwd(), "..", "metrics.json"), "utf8"));
    return raw?.tweets && typeof raw.tweets === "object" ? raw.tweets : {};
  } catch {
    return {}; // missing or malformed: fall back to embed counts
  }
}
const FILE = readFile();

/**
 * Counts for a prompt's source post. metrics.json wins field by field; likes
 * and replies fall back to the free embed data. Null when there is no tweet.
 */
export async function getMetrics(source: Source): Promise<Metrics | null> {
  const id = tweetId(source.url);
  if (!id) {
    return null;
  }
  const tweet = await fetchTweet(id);
  const out: Metrics = {};
  if (tweet) {
    out.likes = tweet.favorite_count;
    out.replies = tweet.conversation_count;
  }
  const stored = FILE[id] ?? {};
  for (const k of KEYS) {
    const v = stored[k];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      out[k] = v;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}
