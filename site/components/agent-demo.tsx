import Link from "next/link";

export type DemoPrompt = { title: string; prompt: string; author: string | null; href: string };

/** A static mock of asking your agent for a prompt and the skill answering. */
export function AgentDemo({ prompt: p }: { prompt: DemoPrompt }) {
  return (
    <div className="rounded-xl border bg-card p-5 font-sans text-sm leading-relaxed shadow-2xl shadow-black/40 sm:p-6 sm:text-base">
      {/* Styled after the Claude app: user turns in a bubble on the right, replies as plain text. */}
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-xl bg-secondary px-3.5 py-2 text-foreground">
          find me a good one-shot prompt to try on this project
        </p>
      </div>

      <div className="mt-5 text-foreground">
        <p>
          Try this one{p.author ? <> from {p.author}</> : null}:{" "}
          <Link
            href={p.href}
            className="font-medium text-burn underline decoration-burn/30 underline-offset-4 hover:decoration-burn/70"
          >
            {p.title}
          </Link>
        </p>
        <blockquote className="mt-3 border-l-2 border-burn pl-4 text-base leading-snug text-foreground italic sm:text-lg">
          <p className="line-clamp-3 whitespace-pre-wrap">&ldquo;{p.prompt}&rdquo;</p>
        </blockquote>
        <p className="mt-3">Want me to run it?</p>
      </div>

      <div className="mt-4 flex justify-end">
        <p className="rounded-xl bg-secondary px-3.5 py-2 text-foreground">yes, lets gooo</p>
      </div>

      <p className="mt-5 flex items-center gap-2 font-medium text-burn">
        <span className="cursor" aria-hidden={true}>
          ✻
        </span>
        Burning tokens…
      </p>
    </div>
  );
}
