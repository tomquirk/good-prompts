import { ImageResponse } from "next/og";
import { getPrompts } from "@/lib/prompts";
import { MascotArt, MASCOT_COLORS_STATIC } from "@/components/mascot-art";

export const alt = "prompt-collectooor: collecting god-tier dev prompts from X.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  const count = getPrompts().length;
  return new ImageResponse(
    (
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
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <MascotArt colors={MASCOT_COLORS_STATIC} size={34} />
          prompt-collectooor
        </div>
        <div style={{ position: "absolute", right: 90, top: 90, display: "flex", width: 260, height: 273 }}>
          <MascotArt colors={MASCOT_COLORS_STATIC} size={260} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.1, letterSpacing: -2, maxWidth: 760, display: "flex" }}>
            Collecting god-tier dev prompts from X.com
          </div>
          <div style={{ marginTop: 32, fontSize: 28, color: "#9c958c", display: "flex" }}>
            {`${count} prompts for Claude Code, Codex & co, ranked by likes`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
