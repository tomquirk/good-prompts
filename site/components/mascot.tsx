"use client";

import { useEffect, useRef, useState } from "react";
import { EYE_CENTRES, EYES_REST, MascotArt, VIEW, type Eyes } from "@/components/mascot-art";
import { cn } from "@/lib/utils";

// In the 120×120 viewBox: how far the gaze travels, and the circle the eyes
// must stay inside so they never slide off the blob.
const REACH = 9;
const BLOB = { x: 60, y: 54, r: 30 };

const jitter = (n: number) => (Math.random() - 0.5) * n;

export function Mascot({ count, className }: { count: number; className?: string }) {
  const lines = [
    "ahhh, i'm collectinggg!",
    `${count} prompts. i love every single one`,
    "ooh, copy that one. no wait, that one",
    "someone said audit and i got excited",
    "i read every tweet. best job ever",
    "hehe. poke me again (>_<)",
  ];

  const ref = useRef<HTMLButtonElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [eyes, setEyes] = useState<Eyes>(EYES_REST);
  const [line, setLine] = useState(0);
  const [spaz, setSpaz] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Both eyes aim at the pointer together, each with its own tremor, and
    // every so often the gaze darts somewhere random.
    const tick = setInterval(() => {
      const svg = ref.current?.querySelector("svg");
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const scale = box.width / VIEW.w;
      let gx: number, gy: number;
      if (Math.random() < 0.07 || !pointer.current) {
        const a = Math.random() * Math.PI * 2;
        [gx, gy] = [Math.cos(a) * REACH, Math.sin(a) * REACH];
      } else {
        const mid = { x: (EYE_CENTRES.l.x + EYE_CENTRES.r.x) / 2, y: (EYE_CENTRES.l.y + EYE_CENTRES.r.y) / 2 };
        const dx = pointer.current.x - (box.left + (mid.x - VIEW.x) * scale);
        const dy = pointer.current.y - (box.top + (mid.y - VIEW.y) * scale);
        const d = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, d / 220) * REACH;
        [gx, gy] = [(dx / d) * reach, (dy / d) * reach];
      }
      const place = (side: "l" | "r") => {
        const c = EYE_CENTRES[side];
        let x = c.x + gx + jitter(2.2);
        let y = c.y + gy + jitter(2.2);
        const d = Math.hypot(x - BLOB.x, y - BLOB.y);
        if (d > BLOB.r) {
          x = BLOB.x + ((x - BLOB.x) / d) * BLOB.r;
          y = BLOB.y + ((y - BLOB.y) / d) * BLOB.r;
        }
        return { x: x - c.x, y: y - c.y };
      };
      setEyes({ l: place("l"), r: place("r") });
    }, 110);

    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    if (!spaz) return;
    const t = setTimeout(() => setSpaz(false), 650);
    return () => clearTimeout(t);
  }, [spaz]);

  return (
    <div className={cn("relative", className)}>
      <p
        aria-live="polite"
        className="absolute right-0 bottom-[calc(100%-0.25rem)] z-10 w-max max-w-48 rounded-lg border bg-card px-2.5 py-1.5 text-[11px] leading-snug text-pretty text-foreground shadow-lg sm:max-w-52 sm:text-xs"
      >
        {lines[line]}
        <span
          aria-hidden
          className="absolute right-8 -bottom-[5px] size-2.5 rotate-45 border-r border-b bg-card"
        />
      </p>
      <button
        ref={ref}
        type="button"
        aria-label="Poke the collectooor, the site's mascot"
        onClick={() => {
          setSpaz(true);
          setLine((l) => (l + 1) % lines.length);
        }}
        className={cn("mascot block w-full cursor-pointer rounded-2xl", spaz && "mascot-spaz")}
      >
        <MascotArt eyes={eyes} squint={spaz} className="block h-auto w-full overflow-visible" />
      </button>
    </div>
  );
}
