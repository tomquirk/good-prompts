import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { rawHtml } from "@/lib/html";
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

const TITLE = /<title>.*?<\/title>/u;
const EM_SIZE = / (?:width|height)="1em"/gu;

/** An icon from the pinned @lobehub/icons-static-svg package, as markup to inline. */
const svg = (icon: string) =>
  rawHtml(
    readFileSync(join(ICONS, "icons", `${icon}.svg`), "utf8")
      .replace(TITLE, "")
      .replace(EM_SIZE, ""),
  );

/** A single agent mark, inlined. */
export function AgentIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <span
      aria-hidden={true}
      className={cn("inline-block [&>svg]:size-full", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG read from a pinned npm package at build time
      dangerouslySetInnerHTML={svg(icon)}
    />
  );
}

/** Logos with names, or just the logos (names as tooltips and for screen readers). */
export function AgentLogos({ className, iconsOnly = false }: { className?: string; iconsOnly?: boolean }) {
  return (
    <ul
      className={cn("flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground", iconsOnly && "gap-x-4", className)}
    >
      {AGENTS.map(([name, icon]) => (
        <li
          key={name}
          title={iconsOnly ? name : undefined}
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          <span
            aria-hidden={true}
            className="size-5 [&>svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG read from a pinned npm package at build time
            dangerouslySetInnerHTML={svg(icon)}
          />
          <span className={iconsOnly ? "sr-only" : undefined}>{name}</span>
        </li>
      ))}
    </ul>
  );
}
