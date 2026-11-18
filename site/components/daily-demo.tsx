"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { MascotArt } from "@/components/mascot-art";
import { MetricsRow } from "@/components/metrics-row";
import type { Metrics } from "@/lib/metrics";

export type DailyItem = {
  title: string;
  prompt: string;
  useWhen: string;
  author: string | null;
  href: string;
  metrics: Metrics | null;
};

// Steps through every prompt before repeating: 7919 is prime, so it's coprime
// with any list length that isn't a multiple of it.
function pick<T>(items: T[], date: Date) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 864e5);
  return items[(day * 7919) % items.length];
}

const noop = () => () => {};
const pad = (n: number) => String(n).padStart(2, "0");
const localDay = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * A mock of asking your agent for a prompt and the skill answering. The pick
 * rotates by date so the page shows something new each day: the build renders
 * the build day's pick, and the browser swaps in the visitor's local date.
 */
export function DailyDemo({ items, buildDate }: { items: DailyItem[]; buildDate: string }) {
  // The build's date during prerender and hydration, then the visitor's local date.
  const day = useSyncExternalStore(noop, localDay, () => buildDate);
  const [y, m, d] = day.split("-").map(Number);
  const now = new Date(y, m - 1, d);
  // Showcase only posts that are still up and have counts, so popularity always shows.
  const live = items.filter((i) => i.metrics?.likes !== undefined);
  const p = pick(live.length ? live : items, now);

  return (
    <div className="rounded-2xl border bg-card p-4 text-[13px] shadow-2xl shadow-black/40 sm:p-5">
      <div className="text-xs text-muted-foreground">your agent</div>

      <div className="mt-4 flex justify-end">
        <span className="max-w-[85%] rounded-xl rounded-br-sm bg-secondary px-3 py-1.5 text-foreground">
          find me a good one-shot prompt to try on this project
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        <MascotArt className="size-8 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">
            try this one:{" "}
            <Link href={p.href} className="underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground/60">
              {p.title}
            </Link>
          </p>
          <div className="mt-3 rounded-lg border bg-background px-3 py-2.5">
            <p className="line-clamp-3 text-[12.5px] leading-relaxed whitespace-pre-wrap text-foreground/90">
              {p.prompt}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {p.author && <span>from {p.author}</span>}
            <MetricsRow metrics={p.metrics} />
          </div>
          <p className="mt-3 text-foreground">Want me to run it?</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <span className="rounded-xl rounded-br-sm bg-secondary px-3 py-1.5 text-foreground">yes</span>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="cursor inline-block size-2 rounded-full bg-burn" aria-hidden />
        running… burning tokens 🔥
      </p>
    </div>
  );
}
