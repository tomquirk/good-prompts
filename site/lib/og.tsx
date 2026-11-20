import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  bg: "#100e0c",
  card: "#191512",
  fg: "#efece6",
  muted: "#9c958c",
  faint: "#6b655e",
  line: "rgba(255,255,255,0.10)",
  burn: "#f29a3a",
};

const FONT_DIR = join(process.cwd(), "node_modules", "geist", "dist", "fonts");

async function fonts() {
  const load = (file: string) => readFile(join(FONT_DIR, file));
  const [regular, semibold, mono] = await Promise.all([
    load("geist-sans/Geist-Regular.ttf"),
    load("geist-sans/Geist-SemiBold.ttf"),
    load("geist-mono/GeistMono-Regular.ttf"),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/** A 1200x630 PNG on the site's dotted dark background, with Geist loaded. */
export async function ogImage(children: ReactElement) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: OG.bg,
        color: OG.fg,
        fontFamily: "Geist",
        backgroundImage: [
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.09) 1px, transparent 0)",
          "radial-gradient(circle at 92% 0%, rgba(242,154,58,0.20) 0%, rgba(242,154,58,0) 55%)",
        ].join(", "),
        backgroundSize: "24px 24px, 100% 100%",
        backgroundRepeat: "repeat, no-repeat",
      }}
    >
      {children}
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
