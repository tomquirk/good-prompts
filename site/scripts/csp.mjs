// Adds a strict Content-Security-Policy to every exported page. A static export
// has no server to mint nonces, so each page's inline scripts (Next's RSC
// payload and bootstrap) are allowed by hash instead of 'unsafe-inline'.
// frame-ancestors can't be set from a <meta> tag; vercel.json sends it as a header.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)(?<attrs>[^>]*)>(?<body>[\s\S]*?)<\/script>/gu;
const HEAD = /<head(?:\s[^>]*)?>/u;
const DATA_TYPE = /\btype="application\/(?:ld\+)?json"/u;

/** @param {string[]} hashes */
const policy = (hashes) =>
  [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`,
    "style-src 'self'",
    // React renders a few style="" attributes (mascot eyes, tweet embeds).
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: https://pbs.twimg.com https://abs.twimg.com",
    "media-src https://video.twimg.com",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

/**
 * @param {string} dir
 * @returns {AsyncGenerator<string>}
 */
async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(path);
    } else if (entry.name.endsWith(".html")) {
      yield path;
    }
  }
}

let pages = 0;
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    continue;
  }
  const hashes = new Set();
  for (const { groups } of html.matchAll(INLINE_SCRIPT)) {
    const { attrs = "", body = "" } = groups ?? {};
    if (DATA_TYPE.test(attrs)) {
      continue;
    }
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}"/>`;
  // Must come before the first script, so it goes straight after <head>.
  const out = html.replace(HEAD, (m) => m + meta);
  if (out === html) {
    throw new Error(`No <head> in ${file}`);
  }
  await writeFile(file, out);
  pages += 1;
}
console.log(`CSP added to ${pages} pages`);
