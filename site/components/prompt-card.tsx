import Link from "next/link";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { PromptText } from "@/components/prompt-text";
import { MetricsRow } from "@/components/metrics-row";
import { SourceTweet } from "@/components/source-tweet";
import type { Metrics } from "@/lib/metrics";
import type { Prompt } from "@/lib/prompts";
import { promptPath, scopeLabel } from "@/lib/site";

export function PromptCard({ prompt, metrics }: { prompt: Prompt; metrics: Metrics | null }) {
  const summary = prompt.text_kind === "summary";

  return (
    <article
      id={prompt.id}
      className="grid gap-8 border-t py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12"
    >
      <div className="min-w-0">
        <h2 className="group text-lg font-medium tracking-tight text-balance">
          <Link
            href={promptPath(prompt.id)}
            className="underline-offset-4 decoration-foreground/25 hover:underline"
          >
            {prompt.title}
          </Link>
          <a
            href={`#${prompt.id}`}
            aria-label={`Link to ${prompt.title} on this page`}
            className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            #
          </a>
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {prompt.category} · {scopeLabel(prompt)}
        </p>
        <MetricsRow metrics={metrics} className="mt-2" />

        <div className="mt-5 overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b py-1.5 pr-2 pl-4">
            <span className="text-xs text-muted-foreground">
              {summary ? "summary · full prompt at source" : "prompt"}
            </span>
            <CopyButton text={prompt.prompt} />
          </div>
          <PromptText text={prompt.prompt} />
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-pretty text-muted-foreground">
          <span className="text-foreground/70">Use when:</span> {prompt.use_when}
        </p>
      </div>

      <div className="min-w-0">
        <Suspense fallback={<div className="h-48 rounded-xl border bg-card" />}>
          <SourceTweet source={prompt.source} />
        </Suspense>
      </div>
    </article>
  );
}
