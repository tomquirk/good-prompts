"use client";

import { useState } from "react";

const COLLAPSE_AT = 900; // characters

/** Prompt body; very long prompts collapse behind a fade until expanded. */
export function PromptText({ text, collapsible = true }: { text: string; collapsible?: boolean }) {
  const long = collapsible && text.length > COLLAPSE_AT;
  const [open, setOpen] = useState(!long);

  return (
    <div className="relative">
      <pre
        className={
          "px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground " +
          (open ? "" : "max-h-72 overflow-hidden")
        }
      >
        {text}
      </pre>
      {long ? (
        <div
          className={
            open
              ? "px-4 pb-3"
              : "absolute inset-x-0 bottom-0 flex h-24 items-end bg-linear-to-t from-card via-card/90 to-transparent px-4 pb-3"
          }
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative text-xs text-burn underline-offset-4 hover:underline after:absolute after:-inset-x-2 after:-inset-y-3"
          >
            {open ? "Collapse" : `Show full prompt (${text.length.toLocaleString()} characters)`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
