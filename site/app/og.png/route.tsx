import { MASCOT_COLORS_STATIC, MascotArt } from "@/components/mascot-art";
import { OG, ogImage } from "@/lib/og";
import { getPrompts } from "@/lib/prompts";
import { SITE_NAME } from "@/lib/site";

// A .png file rather than the opengraph-image convention, so static hosting
// serves it as image/png (see app/prompts/[id]/og.png/route.tsx).
export const dynamic = "force-static";

export function GET() {
  const count = getPrompts().length;
  return ogImage(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 28 }}>
        <MascotArt colors={MASCOT_COLORS_STATIC} size={42} />
        {SITE_NAME}
      </div>
      <div style={{ position: "absolute", right: 90, top: 110, display: "flex" }}>
        <MascotArt colors={MASCOT_COLORS_STATIC} size={260} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            maxWidth: 760,
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2.5,
          }}
        >
          Auto-collecting good dev prompts from X.com
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 28, color: OG.muted }}>
          {`${count} prompts for Claude Code, Codex & co, ranked by likes`}
        </div>
      </div>
    </div>,
  );
}
