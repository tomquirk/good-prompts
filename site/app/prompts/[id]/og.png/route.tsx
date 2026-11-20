import { MASCOT_COLORS_STATIC, MascotArt } from "@/components/mascot-art";
import { getMetrics } from "@/lib/metrics";
import { OG, ogImage } from "@/lib/og";
import { getPrompt, getPrompts } from "@/lib/prompts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// A real file with a .png extension, so static hosting serves it as image/png.
// (The opengraph-image convention exports an extensionless file, which Vercel
// serves as application/octet-stream and Slack refuses to unfurl.)
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPrompts().map((p) => ({ id: p.id }));
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** The opening of the prompt, on one line, cut at a word near `max` characters. */
function excerpt(text: string, max = 230) {
  const flat = text
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gmu, "") // list markers read as noise on one line
    .replace(/\s+/gu, " ")
    .trim();
  if (flat.length <= max) {
    return flat;
  }
  const cut = flat.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const ICON = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", strokeWidth: 2 };

function Heart() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: next/og draws <title> as visible text; the image has alt text.
    <svg {...ICON} stroke={OG.burn} fill={OG.burn}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function Eye() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: next/og draws <title> as visible text; the image has alt text.
    <svg {...ICON} stroke={OG.muted}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export async function GET(_req: Request, { params }: RouteContext<"/prompts/[id]/og.png">) {
  const p = getPrompt((await params).id);
  if (!p) {
    return new Response("Not found", { status: 404 });
  }
  const metrics = await getMetrics(p.source);
  const titleSize = p.title.length > 56 ? 54 : p.title.length > 38 ? 62 : 72;
  const { host } = new URL(SITE_URL);

  return ogImage(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "56px 64px" }}>
      {/* Brand and category */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 26 }}>
          <MascotArt colors={MASCOT_COLORS_STATIC} size={42} />
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            padding: "8px 20px",
            borderRadius: 999,
            border: "1.5px solid rgba(242,154,58,0.45)",
            background: "rgba(242,154,58,0.10)",
            color: OG.burn,
            fontSize: 22,
          }}
        >
          {p.category}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          marginTop: 40,
          maxWidth: 1000,
          fontSize: titleSize,
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}
      >
        {p.title}
      </div>

      {/* The prompt itself, terminal-style, fading out */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginTop: 36,
          flexGrow: 1,
          overflow: "hidden",
          borderRadius: 18,
          border: `1px solid ${OG.line}`,
          background: OG.card,
          padding: "22px 28px",
          fontFamily: "Geist Mono",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: OG.faint }}>
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#ff5f57" }} />
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#febc2e" }} />
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#28c840" }} />
          <div style={{ display: "flex", marginLeft: 10 }}>{p.text_kind === "summary" ? "summary" : "prompt"}</div>
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 23, lineHeight: 1.5, color: "#c9c2b8" }}>
          <span style={{ color: OG.burn, marginRight: 14 }}>{">"}</span>
          <span style={{ display: "flex", flex: 1 }}>{excerpt(p.prompt)}</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 90,
            display: "flex",
            backgroundImage: `linear-gradient(to bottom, rgba(25,21,18,0), ${OG.card})`,
          }}
        />
      </div>

      {/* Author, traction and where to get it */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 28,
          fontSize: 26,
          color: OG.muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {p.source.author ? <span style={{ color: OG.fg }}>{p.source.author}</span> : null}
          {metrics?.likes !== undefined && (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Heart />
              {compact.format(metrics.likes)}
            </span>
          )}
          {metrics?.views !== undefined && (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Eye />
              {compact.format(metrics.views)}
            </span>
          )}
        </div>
        <span style={{ fontFamily: "Geist Mono", fontSize: 22, color: OG.faint }}>{host}</span>
      </div>
    </div>,
  );
}
