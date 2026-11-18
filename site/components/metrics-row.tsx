import { EyeIcon, HeartIcon, MessageCircleIcon, Repeat2Icon, type LucideIcon } from "lucide-react";
import type { Metrics } from "@/lib/metrics";
import { cn } from "@/lib/utils";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en");

/** Likes, replies, shares (reposts + quotes) and views, whichever are known. */
export function MetricsRow({ metrics, className }: { metrics: Metrics | null; className?: string }) {
  if (!metrics) return null;
  const shares =
    metrics.reposts === undefined && metrics.quotes === undefined
      ? undefined
      : (metrics.reposts ?? 0) + (metrics.quotes ?? 0);

  const items: [LucideIcon, number | undefined, string][] = [
    [HeartIcon, metrics.likes, "likes"],
    [MessageCircleIcon, metrics.replies, "replies"],
    [Repeat2Icon, shares, "shares"],
    [EyeIcon, metrics.views, "views"],
  ];

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      {items.map(([Icon, value, label]) =>
        value === undefined ? null : (
          <li key={label} className="inline-flex items-center gap-1.5" title={`${full.format(value)} ${label}`}>
            <Icon strokeWidth={1.5} className="size-3.5" aria-hidden />
            <span className="tabular-nums">{compact.format(value)}</span>
            <span className="sr-only">{label}</span>
          </li>
        ),
      )}
    </ul>
  );
}
