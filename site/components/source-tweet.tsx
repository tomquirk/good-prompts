import { ArrowUpRightIcon } from "lucide-react";
import { EmbeddedTweet } from "react-tweet";
import { type Source, tweetId } from "@/lib/prompts";
import { fetchTweet } from "@/lib/tweets";

const WWW = /^www\./u;

/**
 * Renders the source tweet statically at build time. Falls back to a plain
 * link card for non-tweet sources (gists), deleted/private tweets, or none.
 */
export async function SourceTweet({ source }: { source: Source }) {
  const id = tweetId(source.url);
  const tweet = id ? await fetchTweet(id) : undefined;

  if (tweet) {
    return (
      <div className="tweet-frame">
        <EmbeddedTweet tweet={tweet} />
      </div>
    );
  }

  return <SourceFallback source={source} isTweet={Boolean(id)} />;
}

function SourceFallback({ source, isTweet }: { source: Source; isTweet: boolean }) {
  if (!source.url) {
    return <div className="rounded-xl border border-dashed p-5 text-xs text-muted-foreground">Source unknown.</div>;
  }

  const host = new URL(source.url).hostname.replace(WWW, "");
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-xl border bg-card p-5 text-xs transition-colors hover:border-foreground/20"
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span>{host}</span>
        <ArrowUpRightIcon
          strokeWidth={1.5}
          className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      <div className="mt-3 text-sm text-foreground">{source.author ?? "source"}</div>
      <div className="mt-1 text-muted-foreground">
        {isTweet
          ? "This post is now private or has been deleted."
          : `Full prompt on ${host === "gist.github.com" ? "GitHub Gist" : host}`}
      </div>
    </a>
  );
}
