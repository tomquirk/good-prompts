import { BadgeCheckIcon, HeartIcon } from "lucide-react";
import { type Prompt, tweetId } from "@/lib/prompts";
import { fetchTweet } from "@/lib/tweets";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

type Card = {
  id: string;
  url: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  text: string;
  likes: number;
};

/** Post text without trailing t.co links, cut to the range X itself displays. */
function cleanText(text: string, range?: [number, number]) {
  const chars = Array.from(text);
  const shown = range ? chars.slice(range[0], range[1]).join("") : text;
  return shown.replace(/\s*https:\/\/t\.co\/\S+/gu, "").trim();
}

async function cards(prompts: Prompt[]): Promise<Card[]> {
  // One card per post, even when it holds several prompts.
  const posts = new Map<string, string>();
  for (const p of prompts) {
    const id = tweetId(p.source.url);
    if (id !== null && p.source.url !== null && !posts.has(id)) {
      posts.set(id, p.source.url);
    }
  }
  const fetched = await Promise.all([...posts].map(async ([id, url]) => ({ id, url, t: await fetchTweet(id) })));
  const out: Card[] = [];
  for (const { id, url, t } of fetched) {
    if (!t) {
      continue; // private or deleted
    }
    out.push({
      id,
      url,
      name: t.user.name,
      handle: t.user.screen_name,
      avatar: t.user.profile_image_url_https.replace("_normal.", "_bigger."),
      verified: Boolean(t.user.is_blue_verified || t.user.verified),
      text: cleanText(t.text, t.display_text_range),
      likes: t.favorite_count,
    });
  }
  return out.sort((a, b) => b.likes - a.likes);
}

/**
 * An endless, edge-faded strip of the posts the prompts came from. The list is
 * rendered twice and slid by half its width, so the loop has no seam.
 */
export async function TweetMarquee({ prompts }: { prompts: Prompt[] }) {
  const list = await cards(prompts);
  if (list.length === 0) {
    return null;
  }

  const row = (hidden: boolean) =>
    list.map((c) => (
      <li key={(hidden ? "b" : "a") + c.id} aria-hidden={hidden || undefined} className="w-72 shrink-0">
        <a
          href={c.url}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="flex h-full flex-col rounded-xl border bg-card p-4 text-sm transition-colors hover:border-foreground/20"
        >
          <div className="flex items-center gap-2.5">
            {/* biome-ignore lint/performance/noImgElement: remote avatars in a static export, where next/image cannot optimise */}
            <img
              src={c.avatar}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              className="size-9 rounded-full outline outline-1 -outline-offset-1 outline-white/10"
            />
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1 truncate font-sans font-semibold text-foreground">
                <span className="truncate">{c.name}</span>
                {c.verified ? (
                  <BadgeCheckIcon className="size-4 shrink-0 fill-sky-500 text-background" aria-label="verified" />
                ) : null}
              </div>
              <div className="truncate text-xs text-muted-foreground">@{c.handle}</div>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 font-sans text-pretty whitespace-pre-line text-foreground">{c.text}</p>
          <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted-foreground">
            <HeartIcon strokeWidth={1.5} className="size-3.5" aria-hidden={true} />
            <span className="tabular-nums">{compact.format(c.likes)}</span>
          </div>
        </a>
      </li>
    ));

  return (
    <div
      className="marquee group relative -mx-4 overflow-hidden sm:-mx-6"
      style={{ "--marquee-duration": `${list.length * 5}s` } as React.CSSProperties}
    >
      <ul className="marquee-track flex w-max gap-4 py-1">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
