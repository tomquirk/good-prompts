import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cn } from "@/lib/utils";

// Monochrome (currentColor) marks from LobeHub's MIT-licensed icon set, inlined
// at build time. Logos belong to their owners; shown to say "works with".
// Resolved from the project root: bundlers turn require.resolve into a module ID.
const ICONS = join(process.cwd(), "node_modules", "@lobehub", "icons-static-svg");

const AGENTS: [name: string, icon: string][] = [
  ["Claude Code", "claudecode"],
  ["Codex", "codex"],
  ["Cursor", "cursor"],
  ["Grok Bot", "grok"],
  ["Gemini CLI", "geminicli"],
  ["OpenCode", "opencode"],
  ["Amp", "amp"],
];

const svg = (icon: string) =>
  readFileSync(join(ICONS, "icons", `${icon}.svg`), "utf8")
    .replace(/<title>.*?<\/title>/, "")
    .replace(/ (width|height)="1em"/g, "");

/** A single agent mark, inlined. */
export function AgentIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-block [&>svg]:size-full", className)} dangerouslySetInnerHTML={{ __html: svg(icon) }} />
  );
}

/** Logos with names, or just the logos (names as tooltips and for screen readers). */
export function AgentLogos({ className, iconsOnly = false }: { className?: string; iconsOnly?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/70", iconsOnly && "gap-x-4", className)}>
      {AGENTS.map(([name, icon]) => (
        <li key={name} title={iconsOnly ? name : undefined} className="inline-flex items-center gap-2 whitespace-nowrap">
          <span aria-hidden className="size-5 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg(icon) }} />
          <span className={iconsOnly ? "sr-only" : undefined}>{name}</span>
        </li>
      ))}
    </ul>
  );
}
