import "server-only";
import { getPrompts, type Prompt, REPO_URL } from "@/lib/prompts";
import { absolute, formatDate, lastUpdated, promptPath, SITE_DESCRIPTION, SITE_NAME, scopeLabel } from "@/lib/site";

/** One prompt's lines: a link and summary, plus the full text when `full`. */
function entry(p: Prompt, full: boolean): string[] {
  const by = p.source.author ? `, posted by ${p.source.author}` : "";
  const lines = [`- [${p.title}](${absolute(promptPath(p.id))}): ${p.use_when} (${scopeLabel(p)}${by})`];
  if (!full) {
    return lines;
  }
  const label = p.text_kind === "summary" ? "Summary (full prompt at the source)" : "Prompt";
  lines.push("", `  ${label}:`, "", ...p.prompt.split("\n").map((l) => (l ? `    ${l}` : "")), "");
  if (p.source.url) {
    lines.push(`  Source: ${p.source.url}`, "");
  }
  return lines;
}

/** llms.txt (https://llmstxt.org); `full` inlines every prompt's text. */
export function llmsTxt(full: boolean) {
  const prompts = getPrompts();
  const byCategory = Map.groupBy(prompts, (p) => p.category);
  const out = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${prompts.length} prompts, last updated ${formatDate(lastUpdated(prompts))}. Each prompt has its own page with the prompt text, when to use it, its author and the original post. Most sources have not been independently verified. Paste a prompt into Claude Code, Codex or another coding agent. "Runs in a repo" prompts act on the current project; "runs on your machine" prompts act on the computer more broadly.`,
    "",
    "## Data",
    "",
    `- [prompts.json](${absolute("/prompts.json")}): every prompt with id, title, category, tags, use_when, scope, added_on, prompt text and source`,
    `- [RSS feed](${absolute("/feed.xml")}) and [JSON Feed](${absolute("/feed.json")}): new prompts as they are added`,
    `- [Full text for LLMs](${absolute("/llms-full.txt")}): this file with every prompt inlined`,
    `- [GitHub repository](${REPO_URL}): source of truth; add prompts by pull request`,
  ];
  for (const [category, items] of byCategory) {
    out.push("", `## ${category}`, "");
    for (const p of items) {
      out.push(...entry(p, full));
    }
  }
  return `${out.join("\n")}\n`;
}

export const textResponse = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
