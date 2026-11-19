"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

/**
 * The page's main action: copy the setup prompt. Once copied, the next step
 * (paste it into your agent) stays visible, since a copy alone does nothing.
 */
export function SetupCta({ prompt, count }: { prompt: string; count?: number }) {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <CopyButton primary={true} text={prompt} label="copy setup prompt" onCopied={() => setCopied(true)} />
        {count !== undefined && (
          <a href="#prompts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            or browse {count} prompts ↓
          </a>
        )}
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-burn">
        {copied ? "✓ copied. now paste it into your agent." : ""}
      </p>
    </div>
  );
}
