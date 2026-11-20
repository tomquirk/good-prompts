import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { MetricsRow } from "@/components/metrics-row";
import { PromptText } from "@/components/prompt-text";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SourceTweet } from "@/components/source-tweet";
import { getMetrics } from "@/lib/metrics";
import { EDIT_URL, getPrompt, getPrompts, type Prompt } from "@/lib/prompts";
import { absolute, authorUrl, FEED_TYPES, formatDate, promptPath, SITE_NAME, SITE_URL, scopeLabel } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPrompts().map((p) => ({ id: p.id }));
}

/** use_when first, then as much extra context as fits in ~160 characters. */
function describe(p: Prompt) {
  const extras = [
    "A copy-paste prompt for Claude Code, Codex and other coding agents.",
    p.source.author ? `Posted by ${p.source.author} on X.` : "",
  ];
  let out = p.use_when;
  for (const e of extras) {
    if (e && out.length + e.length + 1 <= 160) {
      out += ` ${e}`;
    }
  }
  return out;
}

export async function generateMetadata({ params }: PageProps<"/prompts/[id]">): Promise<Metadata> {
  const p = getPrompt((await params).id);
  if (!p) {
    return {};
  }
  // Add the query people search for only when the title stays near 60 characters.
  const suffix = " (coding agent prompt)";
  const title = p.title.length + suffix.length <= 62 ? p.title + suffix : p.title;
  const description = describe(p);
  const image = { url: `${promptPath(p.id)}/og.png`, width: 1200, height: 630, alt: p.title, type: "image/png" };
  return {
    title: { absolute: title },
    description,
    keywords: [...p.tags, "Claude Code", "Codex", "coding agent prompt"],
    authors: p.source.author ? [{ name: p.source.author, url: authorUrl(p.source.author) ?? undefined }] : undefined,
    alternates: { canonical: promptPath(p.id), types: FEED_TYPES },
    openGraph: {
      type: "article",
      title,
      description,
      url: promptPath(p.id),
      publishedTime: p.added_on,
      tags: p.tags,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const link =
  "underline underline-offset-4 decoration-foreground/25 hover:text-foreground hover:decoration-foreground/60 transition-colors";

export default async function PromptPage({ params }: PageProps<"/prompts/[id]">) {
  const p = getPrompt((await params).id);
  if (!p) {
    notFound();
  }

  const summary = p.text_kind === "summary";
  const related = getPrompts().filter((r) => r.category === p.category && r.id !== p.id);
  const profile = authorUrl(p.source.author);
  const url = absolute(promptPath(p.id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#prompt`,
        url,
        name: p.title,
        headline: p.title,
        description: p.use_when,
        genre: "Coding agent prompt",
        about: p.category,
        keywords: p.tags.join(", "),
        text: p.prompt,
        datePublished: p.added_on,
        inLanguage: "en",
        ...(p.source.author && {
          author: { "@type": "Person", name: p.source.author, ...(profile && { url: profile }) },
        }),
        ...(p.source.url && { isBasedOn: p.source.url }),
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absolute("/") },
          { "@type": "ListItem", position: 2, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main>
        <nav aria-label="Breadcrumb" className="pt-8 text-xs text-muted-foreground sm:pt-12">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="inline-flex items-center gap-1 py-1 transition-colors hover:text-foreground">
                <ArrowLeftIcon strokeWidth={1.5} className="size-3.5" />
                All prompts
              </Link>
            </li>
            <li aria-hidden={true}>/</li>
            <li>{p.category}</li>
          </ol>
        </nav>

        <article className="grid gap-8 pt-6 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="min-w-0">
            <h1 className="text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">{p.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              {p.use_when}
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <dt>Posted by</dt>
                <dd className="text-foreground">
                  {p.source.author ? (
                    profile ? (
                      <a className={link} href={profile} target="_blank" rel="noreferrer">
                        {p.source.author}
                      </a>
                    ) : (
                      p.source.author
                    )
                  ) : (
                    "unknown"
                  )}
                </dd>
              </div>
              <div className="flex gap-1">
                <dt>Added</dt>
                <dd className="text-foreground">
                  <time dateTime={p.added_on}>{formatDate(p.added_on)}</time>
                </dd>
              </div>
              <div className="flex gap-1">
                <dt className="sr-only">Scope</dt>
                <dd>
                  {p.category} · {scopeLabel(p)}
                </dd>
              </div>
            </dl>
            <MetricsRow metrics={await getMetrics(p.source)} className="mt-3" />

            <section aria-labelledby="prompt-heading" className="mt-8">
              <div className="overflow-hidden rounded-xl border bg-card">
                <div className="flex items-center justify-between border-b py-1.5 pr-2 pl-4">
                  <h2 id="prompt-heading" className="text-xs font-normal text-muted-foreground">
                    {summary ? "summary · full prompt at source" : "prompt"}
                  </h2>
                  <CopyButton text={p.prompt} />
                </div>
                <PromptText text={p.prompt} collapsible={false} />
              </div>
            </section>

            <p className="mt-6 text-xs leading-relaxed text-pretty text-muted-foreground">
              {p.source.status === "verified" ? "verified" : p.source.url ? "unverified" : "no known source"}·
              <a className={link} href={EDIT_URL} target="_blank" rel="noreferrer">
                fix it on github
              </a>
            </p>
          </div>

          <aside aria-label="Original post" className="min-w-0">
            <Suspense fallback={<div className="h-48 rounded-xl border bg-card" />}>
              <SourceTweet source={p.source} />
            </Suspense>
          </aside>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="border-t py-12">
            <h2 id="related-heading" className="text-lg font-medium tracking-tight">
              More {p.category.toLowerCase()} prompts
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={promptPath(r.id)}
                    className="block h-full rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20"
                  >
                    <span className="text-sm text-foreground">{r.title}</span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-pretty text-muted-foreground">
                      {r.use_when}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
