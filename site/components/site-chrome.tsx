import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { MascotArt } from "@/components/mascot-art";
import { EDIT_URL, REPO_URL } from "@/lib/prompts";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-3 text-sm">
      <Link href="/" className="flex items-center gap-2 py-2 font-medium">
        <MascotArt className="size-6" />
        {SITE_NAME}
      </Link>
      <nav aria-label="Site" className="flex items-center gap-1 text-muted-foreground">
        <Link href="/#prompts" className="hidden px-2 py-2 transition-colors hover:text-foreground sm:inline">prompts</Link>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 py-2 pl-2 transition-colors hover:text-foreground"
        >
          github <ArrowUpRightIcon strokeWidth={1.5} className="size-3.5" />
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t py-10 text-xs text-muted-foreground sm:flex-row sm:justify-between">
      <span className="text-pretty">
        Prompts belong to whoever posted them. Mostly unverified.
      </span>
      <a
        href={EDIT_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 transition-colors hover:text-foreground"
      >
        Add a prompt on GitHub <ArrowUpRightIcon strokeWidth={1.5} className="size-3.5" />
      </a>
    </footer>
  );
}

/** Inline JSON-LD; `<` is escaped so prompt text can't close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
