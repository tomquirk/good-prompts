import { ImageResponse } from "next/og";
import { MASCOT_COLORS_STATIC, MascotArt } from "@/components/mascot-art";
import { getPrompt, getPrompts } from "@/lib/prompts";
import { SITE_NAME } from "@/lib/site";

export const alt = "A coding agent prompt from prompt-collectooor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPrompts().map((p) => ({ id: p.id }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const p = getPrompt((await params).id);
  if (!p) {
    throw new Error("Unknown prompt id");
  }
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#100e0c",
        color: "#efece6",
        fontFamily: "monospace",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
        <div style={{ display: "flex", width: 34, height: 34 }}>
          <MascotArt colors={MASCOT_COLORS_STATIC} />
        </div>
        {SITE_NAME}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 26, color: MASCOT_COLORS_STATIC.blob, display: "flex" }}>{p.category}</div>
        <div style={{ marginTop: 20, fontSize: 64, lineHeight: 1.1, letterSpacing: -2, display: "flex" }}>
          {p.title}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#9c958c", display: "flex" }}>
          {p.source.author
            ? `Prompt by ${p.source.author}, shown next to the original post`
            : "A prompt for coding agents"}
        </div>
      </div>
    </div>,
    size,
  );
}
