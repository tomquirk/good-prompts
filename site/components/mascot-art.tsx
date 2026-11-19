/**
 * The collectooor: a kawaii speech-bubble blob (he lives on posts), thrilled
 * about every prompt he finds. Big glossy anime eyes set low and wide, a tiny
 * open mouth and a soft blush. Pure SVG with no hooks, so it renders in client
 * components, server components and next/og alike. Animation hooks are class
 * names styled in globals.css (ignored by next/og).
 */

export type Eyes = { l: { x: number; y: number }; r: { x: number; y: number } };

export const MASCOT_COLORS = {
  blob: "var(--burn)",
  eye: "var(--background)",
  iris: "oklch(0.48 0.106 55.497)",
  shine: "oklch(1 0 0)",
  blush: "oklch(0.701 0.195 12.034)",
  tongue: "oklch(0.747 0.156 12.811)",
};

// Literal colors for contexts without CSS variables (next/og, favicon).
export const MASCOT_COLORS_STATIC = {
  blob: "#f29a3a",
  eye: "#100e0c",
  iris: "#8a4b16",
  shine: "#fff",
  blush: "#ff5f7e",
  tongue: "#ff7f91",
};

export const EYES_REST: Eyes = { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } };

// The viewBox starts above 0 to make room for the sparkles.
export const VIEW = { x: 0, y: -10, w: 120, h: 126 };

// Eye centres in viewBox units: low and wide, the way chibi faces sit.
export const EYE_CENTRES = { l: { x: 40, y: 55 }, r: { x: 80, y: 55 } };

const SPARKLE = "M0 -6 Q 1 -1 6 0 Q 1 1 0 6 Q -1 1 -6 0 Q -1 -1 0 -6 Z";

export function MascotArt({
  eyes = EYES_REST,
  colors = MASCOT_COLORS,
  squint = false,
  className,
  size,
}: {
  eyes?: Eyes;
  colors?: typeof MASCOT_COLORS;
  /** The >_< face. */
  squint?: boolean;
  className?: string;
  /** Explicit pixel width; next/og needs it, CSS-sized usages don't. */
  size?: number;
}) {
  const eye = (side: "l" | "r", w: number, h: number) => {
    const c = EYE_CENTRES[side];
    if (squint) {
      const d = side === "l" ? "M-6 -7 L5 0 L-6 7" : "M6 -7 L-5 0 L6 7";
      return (
        <path
          transform={`translate(${c.x} ${c.y})`}
          d={d}
          fill="none"
          stroke={colors.eye}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    return (
      <g transform={`translate(${c.x + eyes[side].x} ${c.y + eyes[side].y})`}>
        <g className={`mascot-eye mascot-eye-${side}`}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w / 2} fill={colors.eye} />
          {/* faint warm glow at the bottom of the iris */}
          <ellipse cx="0" cy={h * 0.27} rx={w * 0.28} ry={h * 0.12} fill={colors.iris} fillOpacity="0.6" />
          {/* two highlights: big up top, small below */}
          <circle cx={-w * 0.14} cy={-h * 0.2} r={w * 0.25} fill={colors.shine} />
          <circle cx={w * 0.2} cy={h * 0.14} r={w * 0.11} fill={colors.shine} />
        </g>
      </g>
    );
  };

  const blush = (cx: number) => <ellipse cx={cx} cy="68" rx="8" ry="4" fill={colors.blush} fillOpacity="0.3" />;

  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      width={size}
      height={size ? (size * VIEW.h) / VIEW.w : undefined}
      className={className}
      aria-hidden={true}
    >
      {/* sparkles */}
      <g fill={colors.blob} fillOpacity="0.8">
        {/* Position on the wrapper: the twinkle animation owns the path's transform. */}
        <g transform="translate(106 4) scale(0.9)">
          <path className="mascot-sparkle" d={SPARKLE} />
        </g>
        <g transform="translate(115 24) scale(0.55)">
          <path className="mascot-sparkle mascot-sparkle-2" d={SPARKLE} />
        </g>
      </g>

      <g className="mascot-blob">
        {/* speech-bubble body, tail bottom-left */}
        <path
          d="M60 10 C 93 10, 112 29, 112 55 C 112 81, 92 99, 60 99 C 52 99, 45 98, 38 96 L 17 111 C 14 113, 11 110, 13 107 L 22 89 C 13 81, 8 69, 8 55 C 8 29, 28 10, 60 10 Z"
          fill={colors.blob}
        />
        <path
          d="M24 40 C 27 30, 35 22, 47 19"
          fill="none"
          stroke={colors.shine}
          strokeOpacity="0.4"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {blush(25)}
        {blush(95)}

        {eye("l", 15, 23)}
        {eye("r", 14, 21.5)}

        {/* tiny open mouth */}
        <path d="M54 66 Q 60 68 66 66 Q 65 76 60 76 Q 55 76 54 66 Z" fill={colors.eye} />
        <path d="M56.5 73.2 Q 60 70.5 63.5 73.2 Q 62.2 76 60 76 Q 57.8 76 56.5 73.2 Z" fill={colors.tongue} />
      </g>
    </svg>
  );
}
