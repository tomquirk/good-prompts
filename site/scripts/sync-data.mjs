// Copies the repo-root data files into public/ so the site also serves them
// (e.g. /prompts.json, /feed.xml). The repo root stays the source of truth.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(site, "..");
mkdirSync(join(site, "public"), { recursive: true });
for (const file of ["prompts.json", "feed.json", "feed.xml"]) {
  copyFileSync(join(root, file), join(site, "public", file));
}
