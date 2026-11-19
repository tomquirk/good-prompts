"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Both icons stay mounted and cross-fade, so the swap animates in and out.
const icon = "size-3.5 transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";
const shown = "opacity-100 scale-100 blur-[0px]";
const hidden = "opacity-0 scale-25 blur-[4px]";

export function CopyButton({
  text,
  label = "copy",
  primary = false,
  onCopied,
  className,
}: {
  text: string;
  label?: string;
  /** The page's main call to action: large, filled orange. */
  primary?: boolean;
  onCopied?: () => void;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Button
      variant={primary ? "default" : "ghost"}
      size={primary ? "lg" : "xs"}
      aria-label={copied ? "Copied" : label}
      className={cn(
        primary
          ? "h-11 gap-2 rounded-xl bg-burn px-5 font-mono text-sm text-background hover:bg-burn/90"
          : // after: extends the 24px button to a ~40px tall hit area
            "relative font-mono text-muted-foreground hover:text-foreground after:absolute after:-inset-x-1 after:-inset-y-2",
        !primary && copied && "text-burn hover:text-burn",
        className,
      )}
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          onCopied?.();
        }
      }}
    >
      <span className="relative grid size-3.5 place-items-center">
        <CopyIcon strokeWidth={1.5} className={cn(icon, copied ? hidden : shown)} />
        <CheckIcon strokeWidth={1.5} className={cn(icon, "absolute", copied ? shown : hidden)} />
      </span>
      {/* Both labels share one grid cell so the width never changes. */}
      <span className="grid text-left">
        <span className={cn("col-start-1 row-start-1", copied && "invisible")}>{label}</span>
        <span className={cn("col-start-1 row-start-1", !copied && "invisible")}>copied</span>
      </span>
    </Button>
  );
}

/** Clipboard API first; falls back to execCommand where it is blocked (iframes, some webviews). */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
