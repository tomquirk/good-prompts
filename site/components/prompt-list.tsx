"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { MascotArt } from "@/components/mascot-art";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ListItem = {
  id: string;
  category: string;
  /** Likes on the source post; -1 when unknown, so those sort last. */
  likes: number;
  haystack: string;
  node: ReactNode;
};

export function PromptList({ items }: { items: ListItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"top" | "new">("top");
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of items) {
      counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const q = query.trim().toLowerCase();
  // Items arrive newest-first; "top" re-sorts by likes (Array.sort is stable).
  const visible = items
    .filter((i) => (!category || i.category === category) && (!q || i.haystack.includes(q)))
    .sort((a, b) => (sort === "top" ? b.likes - a.likes : 0));

  // "/" focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 border-b bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-burn">&gt;</span>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts"
            aria-label="Search prompts"
            className="h-12 rounded-xl bg-secondary pr-12 pl-9 font-mono text-base shadow-lg shadow-black/30 focus-visible:border-burn focus-visible:ring-burn/25 dark:bg-secondary md:text-base"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-input px-1.5 text-xs text-muted-foreground">
            /
          </kbd>
        </div>
        <div className="mt-0.5 -mb-1.5 flex items-center gap-2">
          {/* py-2 contains the chips' enlarged hit areas inside the scroller */}
          <div className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            <Chip active={!category} onClick={() => setCategory(null)} count={items.length}>
              all
            </Chip>
            {categories.map(([c, n]) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)} count={n}>
                {c}
              </Chip>
            ))}
          </div>
          <fieldset className="flex shrink-0 gap-1 border-l pl-2">
            <legend className="sr-only">Sort</legend>
            {(["top", "new"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={sort === s}
                onClick={() => setSort(s)}
                className={cn(
                  "relative rounded-lg px-2 py-1 text-xs transition-colors after:absolute after:inset-x-0 after:-inset-y-2",
                  sort === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="[&>div:first-child>article]:border-t-0">
        {visible.map((i) => (
          <div key={i.id}>{i.node}</div>
        ))}
        {visible.length === 0 && (
          <p className="flex flex-col items-center gap-4 border-t py-16 text-center text-sm text-muted-foreground">
            <MascotArt eyes={{ l: { x: -7, y: 5 }, r: { x: -7, y: 5 } }} className="w-16 opacity-80" />
            <span>
              No prompts match{q ? <> &ldquo;{query.trim()}&rdquo;</> : null}
              {category ? ` in ${category}` : ""}.
            </span>
          </p>
        )}
      </div>
    </>
  );
}

function Chip({
  active,
  count,
  children,
  onClick,
}: {
  active: boolean;
  count: number;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // after: grows the hit area vertically without overlapping neighbours
        "relative shrink-0 rounded-lg px-2 py-1 text-xs whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-inset-y-2",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
      <span className={cn("ml-1.5 tabular-nums", active ? "text-burn" : "text-muted-foreground")}>{count}</span>
    </button>
  );
}
